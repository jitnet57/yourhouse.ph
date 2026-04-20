"""
LangGraph: Language Synchronization Orchestrator
UI 언어 변경 → DB preference 저장 → 번역 캐시 확인 → Claude 번역 → 응답
"""
from __future__ import annotations

import logging
import os
from datetime import datetime
from typing import Literal, TypedDict

logger = logging.getLogger(__name__)

Lang = Literal["en", "ko", "ja", "zh"]

LANG_NAMES: dict[str, str] = {
    "en": "English",
    "ko": "Korean",
    "ja": "Japanese",
    "zh": "Simplified Chinese",
}

VALID_LANGS = set(LANG_NAMES.keys())

# ── State ──────────────────────────────────────────────────────────────────

class LangSyncState(TypedDict):
    user_id: str
    requested_lang: str
    previous_lang: str
    ui_synced: bool
    preference_saved: bool
    content_keys: list[str]          # content_keys requested by caller
    translated_content: dict         # {content_key: translated_text}
    cache_hits: list[str]
    cache_misses: list[str]
    original_texts: dict             # {content_key: original_text}  fetched from DB
    errors: list[str]
    final_lang: str


# ── Node helpers ───────────────────────────────────────────────────────────

def _get_db():
    """Return Supabase client (or stub)."""
    from app.integrations.supabase_client import supabase_client
    return supabase_client


# ── Node 1: validate_language ──────────────────────────────────────────────

def validate_language(state: LangSyncState) -> LangSyncState:
    """Validate requested language; fall back to 'en' if invalid."""
    lang = state.get("requested_lang", "en")
    if lang not in VALID_LANGS:
        state["errors"].append(f"Invalid lang '{lang}', fallback to 'en'")
        lang = "en"
    state["final_lang"] = lang
    logger.info("[lang_sync] validate: %s → %s", state.get("requested_lang"), lang)
    return state


# ── Node 2: save_user_preference ──────────────────────────────────────────

async def save_user_preference(state: LangSyncState) -> LangSyncState:
    """Persist preferred_lang to users table via Supabase."""
    try:
        db = _get_db()
        db.table("users").update({
            "preferred_lang": state["final_lang"],
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", state["user_id"]).execute()
        state["preference_saved"] = True
        logger.info("[lang_sync] preference saved: user=%s lang=%s",
                    state["user_id"], state["final_lang"])
    except Exception as e:
        state["errors"].append(f"save_preference failed: {e}")
        logger.warning("[lang_sync] save_preference error: %s", e)
    return state


# ── Node 3: check_translation_cache ───────────────────────────────────────

async def check_translation_cache(state: LangSyncState) -> LangSyncState:
    """Check Redis for cached translations; also fetch DB originals for misses."""
    from app.integrations.redis_client import cache_get_translation

    hits, misses, originals = [], [], {}

    for key in state.get("content_keys", []):
        cached = await cache_get_translation(state["final_lang"], key)
        if cached:
            state["translated_content"][key] = cached
            hits.append(key)
            logger.debug("[lang_sync] cache HIT: %s", key)
        else:
            misses.append(key)
            logger.debug("[lang_sync] cache MISS: %s", key)

    # Fetch original texts for cache misses from content_store
    if misses:
        try:
            db = _get_db()
            result = db.table("content_store").select(
                "content_key,original_text"
            ).in_("content_key", misses).execute()
            rows = result.get("data", []) if isinstance(result, dict) else []
            for row in rows:
                originals[row["content_key"]] = row["original_text"]
        except Exception as e:
            state["errors"].append(f"fetch_originals failed: {e}")

    state["cache_hits"] = hits
    state["cache_misses"] = misses
    state["original_texts"] = originals
    return state


# ── Node 4: translate_missing_content ─────────────────────────────────────

async def translate_missing_content(state: LangSyncState) -> LangSyncState:
    """
    For each cache miss, call Claude to translate, then store in Redis + DB.
    Falls back gracefully if Anthropic API key is missing.
    """
    from app.integrations.redis_client import cache_set_translation

    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    target_lang = LANG_NAMES[state["final_lang"]]

    for key in state["cache_misses"]:
        original = state["original_texts"].get(key)
        if not original:
            logger.warning("[lang_sync] no original text for key: %s", key)
            continue

        # Skip translation if target == original language
        if state["final_lang"] == "en":
            state["translated_content"][key] = original
            await cache_set_translation(state["final_lang"], key, original)
            continue

        translated = original  # default fallback
        if api_key:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=api_key)
                response = client.messages.create(
                    model="claude-opus-4-7",
                    max_tokens=1024,
                    system=(
                        f"You are a professional real estate content translator.\n"
                        f"Translate the given text to {target_lang}.\n"
                        "Rules:\n"
                        "- Preserve numbers, proper nouns, addresses as-is\n"
                        "- Use professional real estate terminology\n"
                        "- Return ONLY the translated text, no explanations or quotes"
                    ),
                    messages=[{"role": "user", "content": original}],
                )
                translated = response.content[0].text.strip()
                logger.info("[lang_sync] translated key=%s lang=%s", key, state["final_lang"])
            except Exception as e:
                state["errors"].append(f"translation failed for '{key}': {e}")
                logger.warning("[lang_sync] Claude API error: %s", e)
        else:
            logger.warning("[lang_sync] ANTHROPIC_API_KEY not set, using original text")

        state["translated_content"][key] = translated

        # Persist to Redis cache
        await cache_set_translation(state["final_lang"], key, translated)

        # Persist to DB translations table
        try:
            db = _get_db()
            db.table("translations").upsert({
                "content_key": key,
                "lang": state["final_lang"],
                "translated_text": translated,
                "model_used": "claude-opus-4-7",
                "updated_at": datetime.utcnow().isoformat(),
            }, on_conflict="content_key,lang").execute()
        except Exception as e:
            state["errors"].append(f"db_upsert failed for '{key}': {e}")

    return state


# ── Node 5: finalize ──────────────────────────────────────────────────────

def finalize(state: LangSyncState) -> LangSyncState:
    """Mark UI sync complete and log summary."""
    state["ui_synced"] = True
    logger.info(
        "[lang_sync] done — user=%s lang=%s hits=%d misses=%d errors=%d",
        state["user_id"], state["final_lang"],
        len(state["cache_hits"]), len(state["cache_misses"]),
        len(state["errors"]),
    )
    return state


# ── Conditional edge ───────────────────────────────────────────────────────

def needs_translation(state: LangSyncState) -> str:
    """Route to translation node only if there are cache misses."""
    return "translate" if state["cache_misses"] else "finalize"


# ── Build graph ────────────────────────────────────────────────────────────

def build_lang_sync_graph():
    """Compile and return the LangGraph application."""
    try:
        from langgraph.graph import StateGraph, END
    except ImportError:
        logger.warning("langgraph not installed — returning None")
        return None

    workflow = StateGraph(LangSyncState)

    workflow.add_node("validate", validate_language)
    workflow.add_node("save_preference", save_user_preference)
    workflow.add_node("check_cache", check_translation_cache)
    workflow.add_node("translate", translate_missing_content)
    workflow.add_node("finalize", finalize)

    workflow.set_entry_point("validate")
    workflow.add_edge("validate", "save_preference")
    workflow.add_edge("save_preference", "check_cache")
    workflow.add_conditional_edges(
        "check_cache",
        needs_translation,
        {"translate": "translate", "finalize": "finalize"},
    )
    workflow.add_edge("translate", "finalize")
    workflow.add_edge("finalize", END)

    return workflow.compile()


# Singleton — compiled once at import time
try:
    lang_sync_app = build_lang_sync_graph()
except Exception as _e:
    logger.warning("Failed to build lang_sync_graph: %s", _e)
    lang_sync_app = None


async def run_lang_sync(
    user_id: str,
    requested_lang: str,
    previous_lang: str = "en",
    content_keys: list[str] | None = None,
) -> LangSyncState:
    """
    Convenience wrapper — falls back to minimal sync when LangGraph is unavailable.
    """
    initial: LangSyncState = {
        "user_id": user_id,
        "requested_lang": requested_lang,
        "previous_lang": previous_lang,
        "ui_synced": False,
        "preference_saved": False,
        "content_keys": content_keys or [],
        "translated_content": {},
        "cache_hits": [],
        "cache_misses": [],
        "original_texts": {},
        "errors": [],
        "final_lang": requested_lang,
    }

    if lang_sync_app is None:
        # Graceful degradation: run nodes sequentially without LangGraph
        state = validate_language(initial)
        state = await save_user_preference(state)
        state = await check_translation_cache(state)
        if state["cache_misses"]:
            state = await translate_missing_content(state)
        state = finalize(state)
        return state

    return await lang_sync_app.ainvoke(initial)
