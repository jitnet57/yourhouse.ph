"""
LangGraph: Landing Page Editor Orchestrator
validate → (upload) → (ai_generate) → accessibility → save_draft|publish → broadcast
"""
from __future__ import annotations

import json
import logging
import os
import re
import uuid
from datetime import datetime
from typing import Literal, Optional, TypedDict

from app.utils.color import contrast_ratio, hex_to_rgb

logger = logging.getLogger(__name__)

Direction = Literal[
    "to-t", "to-tr", "to-r", "to-br",
    "to-b", "to-bl", "to-l", "to-tl",
]
VALID_DIRECTIONS = {"to-t", "to-tr", "to-r", "to-br", "to-b", "to-bl", "to-l", "to-tl"}
VALID_LANGS = {"en", "ko", "ja", "zh"}
HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$")


# ── State ──────────────────────────────────────────────────────────────────

class LandingEditorState(TypedDict, total=False):
    tenant_id: str
    user_id: str
    action: str                # save_draft | publish | ai_generate | upload_asset

    # Hero
    hero_file_b64: Optional[str]
    hero_file_content_type: Optional[str]
    hero_url: Optional[str]
    uploaded_url: Optional[str]

    # Appearance
    overlay_color: str
    overlay_alpha: float
    gradient_from: str
    gradient_to: str
    gradient_direction: str

    # Content
    headline_i18n: dict
    subtext_i18n: dict
    cta_text_i18n: dict
    cta_color: str
    cta_url: str

    # AI inputs
    brand_keywords: list[str]
    tone: str
    generate_langs: list[str]
    ai_generated: Optional[dict]

    # Outputs
    accessibility_issues: list[str]
    draft_id: Optional[str]
    preview_url: Optional[str]
    version: Optional[int]
    errors: list[str]


# ── Node 1: validate_inputs ───────────────────────────────────────────────

def validate_inputs(state: LandingEditorState) -> LandingEditorState:
    """Schema + range + color/direction validation."""
    errs: list[str] = list(state.get("errors") or [])

    for field in ("overlay_color", "gradient_from", "gradient_to", "cta_color"):
        val = state.get(field, "")
        if val and not HEX_RE.match(val):
            errs.append(f"Invalid color: {field}={val}")

    alpha = state.get("overlay_alpha", 0.4)
    if not 0.0 <= alpha <= 1.0:
        errs.append(f"overlay_alpha out of range: {alpha}")

    direction = state.get("gradient_direction", "to-br")
    if direction not in VALID_DIRECTIONS:
        errs.append(f"Invalid gradient_direction: {direction}")

    state["errors"] = errs
    logger.info("[landing] validate: errors=%d", len(errs))
    return state


# ── Node 2: upload_asset ──────────────────────────────────────────────────

async def upload_asset(state: LandingEditorState) -> LandingEditorState:
    """Upload hero image if provided as base64."""
    b64 = state.get("hero_file_b64")
    if not b64:
        return state

    try:
        import base64
        from app.integrations.r2_client import upload_bytes, gen_asset_key
        data = base64.b64decode(b64)
        ext = (state.get("hero_file_content_type", "image/jpeg").split("/")[-1]
               .replace("jpeg", "jpg"))
        url = await upload_bytes(
            bucket="landing-assets",
            key=gen_asset_key(state["tenant_id"], ext=ext),
            data=data,
            content_type=state.get("hero_file_content_type", "image/jpeg"),
        )
        state["uploaded_url"] = url
        state["hero_url"] = url
        logger.info("[landing] uploaded hero asset: %s", url[:80])
    except Exception as e:
        state.setdefault("errors", []).append(f"upload_asset failed: {e}")
        logger.warning("[landing] upload error: %s", e)
    return state


# ── Node 3: ai_generate_content ───────────────────────────────────────────

async def ai_generate_content(state: LandingEditorState) -> LandingEditorState:
    """Generate headline/subtext/CTA in requested languages via Claude."""
    if state.get("action") != "ai_generate":
        return state

    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    langs = [l for l in state.get("generate_langs", ["en"]) if l in VALID_LANGS]
    if not langs:
        langs = ["en"]

    if not api_key:
        # Fallback: keyword-based placeholder copy
        keywords = ", ".join(state.get("brand_keywords", []))
        placeholder = {
            "headline_i18n": {l: f"Discover {keywords}" for l in langs},
            "subtext_i18n": {l: f"The smarter way to {keywords}." for l in langs},
            "cta_text_i18n": {l: "Get Started" for l in langs},
        }
        state["ai_generated"] = placeholder
        state["headline_i18n"] = placeholder["headline_i18n"]
        state["subtext_i18n"] = placeholder["subtext_i18n"]
        state["cta_text_i18n"] = placeholder["cta_text_i18n"]
        logger.warning("[landing] no ANTHROPIC_API_KEY — used placeholder copy")
        return state

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        prompt = (
            f"Generate landing page copy for a real estate SaaS.\n"
            f"Brand keywords: {', '.join(state.get('brand_keywords', []))}\n"
            f"Tone: {state.get('tone', 'professional')}\n"
            f"Target languages: {', '.join(langs)}\n\n"
            "Return STRICT JSON only (no markdown, no explanations):\n"
            "{\n"
            '  "headline_i18n": {"en":"...", ...},\n'
            '  "subtext_i18n":  {"en":"...", ...},\n'
            '  "cta_text_i18n": {"en":"...", ...}\n'
            "}\n\n"
            "Constraints:\n"
            "- Headline: max 60 chars\n"
            "- Subtext: max 120 chars\n"
            "- CTA: max 20 chars, action verb"
        )
        res = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        text = res.content[0].text.strip()
        # Strip possible ```json fences
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.S)
        parsed = json.loads(text)
        state["ai_generated"] = parsed
        state["headline_i18n"] = parsed["headline_i18n"]
        state["subtext_i18n"] = parsed["subtext_i18n"]
        state["cta_text_i18n"] = parsed["cta_text_i18n"]
        logger.info("[landing] AI generated copy for %d languages", len(langs))
    except Exception as e:
        state.setdefault("errors", []).append(f"ai_generate failed: {e}")
        logger.warning("[landing] ai_generate error: %s", e)
    return state


# ── Node 4: accessibility_check ───────────────────────────────────────────

def accessibility_check(state: LandingEditorState) -> LandingEditorState:
    """WCAG AA contrast validation."""
    issues: list[str] = []
    try:
        overlay_rgb = hex_to_rgb(state.get("overlay_color", "#000000"))
        text_rgb = (255, 255, 255)
        ratio = contrast_ratio(text_rgb, overlay_rgb,
                               alpha=state.get("overlay_alpha", 0.4))
        if ratio < 4.5:
            issues.append(
                f"Text/overlay contrast {ratio:.2f}:1 fails WCAG AA (min 4.5). "
                f"Increase overlay_alpha or use darker overlay_color."
            )

        cta_rgb = hex_to_rgb(state.get("cta_color", "#6366f1"))
        cta_ratio = contrast_ratio(text_rgb, cta_rgb)
        if cta_ratio < 4.5:
            issues.append(
                f"CTA button contrast {cta_ratio:.2f}:1 fails WCAG AA."
            )
    except Exception as e:
        issues.append(f"accessibility_check error: {e}")

    state["accessibility_issues"] = issues
    logger.info("[landing] a11y issues=%d", len(issues))
    return state


# ── Node 5: save_draft ────────────────────────────────────────────────────

async def save_draft(state: LandingEditorState) -> LandingEditorState:
    """Persist draft to Redis with 5min TTL."""
    try:
        from app.integrations.redis_client import get_redis
        draft_id = str(uuid.uuid4())
        # Exclude binary fields from draft payload
        payload = {k: v for k, v in state.items()
                   if k not in ("hero_file_b64",)}
        redis = await get_redis()
        await redis.setex(
            f"landing_draft:{state['tenant_id']}:{draft_id}",
            300,
            json.dumps(payload, default=str),
        )
        state["draft_id"] = draft_id
        state["preview_url"] = (
            f"/preview?draft={draft_id}&tenant={state['tenant_id']}"
        )
        logger.info("[landing] draft saved: %s", draft_id)
    except Exception as e:
        state.setdefault("errors", []).append(f"save_draft failed: {e}")
    return state


# ── Node 6: publish ───────────────────────────────────────────────────────

async def publish(state: LandingEditorState) -> LandingEditorState:
    """Atomic publish: bump version, insert, flip is_published."""
    if state.get("action") != "publish":
        return state
    if state.get("accessibility_issues"):
        state.setdefault("errors", []).append(
            "Cannot publish while accessibility issues exist"
        )
        return state

    try:
        from app.integrations.supabase_client import supabase_client
        tenant_id = state["tenant_id"]

        # Get next version (stub-safe)
        try:
            last = supabase_client.table("landing_configs").select("version").eq(
                "tenant_id", tenant_id
            ).order("version", desc=True).limit(1).execute()
            data = last.get("data", []) if isinstance(last, dict) else []
            next_version = (data[0]["version"] + 1) if data else 1
        except Exception:
            next_version = 1

        # Un-publish old rows
        try:
            supabase_client.table("landing_configs").update(
                {"is_published": False}
            ).eq("tenant_id", tenant_id).execute()
        except Exception:
            pass

        supabase_client.table("landing_configs").insert({
            "tenant_id": tenant_id,
            "version": next_version,
            "is_published": True,
            "hero_bg_url": state.get("uploaded_url") or state.get("hero_url"),
            "hero_bg_type": "upload" if state.get("uploaded_url") else
                            ("url" if state.get("hero_url") else "gradient"),
            "overlay_color": state.get("overlay_color", "#000000"),
            "overlay_alpha": state.get("overlay_alpha", 0.4),
            "gradient_from": state.get("gradient_from", "#6366f1"),
            "gradient_to": state.get("gradient_to", "#ec4899"),
            "gradient_direction": state.get("gradient_direction", "to-br"),
            "headline_i18n": state.get("headline_i18n", {"en": ""}),
            "subtext_i18n": state.get("subtext_i18n", {"en": ""}),
            "cta_text_i18n": state.get("cta_text_i18n", {"en": "Get Started"}),
            "cta_color": state.get("cta_color", "#6366f1"),
            "cta_url": state.get("cta_url", "/signup"),
            "published_at": datetime.utcnow().isoformat(),
        }).execute()

        state["version"] = next_version
        logger.info("[landing] published version=%d tenant=%s", next_version, tenant_id)
    except Exception as e:
        state.setdefault("errors", []).append(f"publish failed: {e}")
        logger.warning("[landing] publish error: %s", e)
    return state


# ── Node 7: broadcast_preview ─────────────────────────────────────────────

async def broadcast_preview(state: LandingEditorState) -> LandingEditorState:
    """Push PREVIEW_UPDATE event to all connected editor sessions."""
    try:
        from app.integrations.ws_broadcast import broadcast
        await broadcast(
            channel=f"landing_preview:{state['tenant_id']}",
            payload={
                "type": "PREVIEW_UPDATE",
                "draft_id": state.get("draft_id"),
                "version": state.get("version"),
                "a11y_issues": state.get("accessibility_issues", []),
            },
        )
    except Exception as e:
        logger.debug("[landing] broadcast skipped: %s", e)
    return state


# ── Routing ──────────────────────────────────────────────────────────────

def route_after_validate(state: LandingEditorState) -> str:
    if state.get("errors"):
        return "broadcast"
    if state.get("hero_file_b64"):
        return "upload"
    return "maybe_ai"


def route_after_a11y(state: LandingEditorState) -> str:
    if state.get("action") == "publish" and not state.get("accessibility_issues"):
        return "publish"
    return "save_draft"


# ── Graph builder ────────────────────────────────────────────────────────

def build_landing_editor_graph():
    try:
        from langgraph.graph import StateGraph, END
    except ImportError:
        logger.warning("langgraph not installed — landing graph disabled")
        return None

    wf = StateGraph(LandingEditorState)
    wf.add_node("validate", validate_inputs)
    wf.add_node("upload", upload_asset)
    wf.add_node("maybe_ai", ai_generate_content)
    wf.add_node("a11y", accessibility_check)
    wf.add_node("save_draft", save_draft)
    wf.add_node("publish", publish)
    wf.add_node("broadcast", broadcast_preview)

    wf.set_entry_point("validate")
    wf.add_conditional_edges("validate", route_after_validate, {
        "broadcast": "broadcast",
        "upload": "upload",
        "maybe_ai": "maybe_ai",
    })
    wf.add_edge("upload", "maybe_ai")
    wf.add_edge("maybe_ai", "a11y")
    wf.add_conditional_edges("a11y", route_after_a11y, {
        "save_draft": "save_draft",
        "publish": "publish",
    })
    wf.add_edge("save_draft", "broadcast")
    wf.add_edge("publish", "broadcast")
    wf.add_edge("broadcast", END)

    return wf.compile()


try:
    landing_editor_app = build_landing_editor_graph()
except Exception as _e:
    logger.warning("Failed to build landing_editor_graph: %s", _e)
    landing_editor_app = None


async def run_landing_editor(initial: LandingEditorState) -> LandingEditorState:
    """Convenience wrapper with fallback to sequential execution."""
    initial.setdefault("errors", [])
    initial.setdefault("accessibility_issues", [])

    if landing_editor_app is None:
        # Sequential fallback
        state = validate_inputs(initial)
        if not state.get("errors"):
            if state.get("hero_file_b64"):
                state = await upload_asset(state)
            state = await ai_generate_content(state)
            state = accessibility_check(state)
            if state.get("action") == "publish" and not state.get("accessibility_issues"):
                state = await publish(state)
            else:
                state = await save_draft(state)
        state = await broadcast_preview(state)
        return state

    return await landing_editor_app.ainvoke(initial)
