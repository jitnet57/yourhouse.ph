"""
FastAPI route: Language Sync
POST /api/lang-sync  — UI 언어 변경 시 호출
GET  /api/lang-sync/preference/{user_id} — 저장된 언어 설정 조회
POST /api/lang-sync/content  — 신규 콘텐츠를 content_store에 등록
"""
from __future__ import annotations

import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/lang-sync", tags=["Language Sync"])

VALID_LANGS = {"en", "ko", "ja", "zh"}


# ── Request / Response schemas ─────────────────────────────────────────────

class LangSyncRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    requested_lang: str = Field(..., description="Target language code: en|ko|ja|zh")
    previous_lang: Optional[str] = Field("en", description="Previous language code")
    content_keys: list[str] = Field(
        default_factory=list,
        description="content_store keys currently visible on screen",
    )


class LangSyncResponse(BaseModel):
    ok: bool
    final_lang: str
    preference_saved: bool
    translated_content: dict
    cache_hits: int
    cache_misses: int
    errors: list[str]


class ContentRegisterRequest(BaseModel):
    content_key: str = Field(..., description="Unique key e.g. 'property.42.title'")
    content_type: str = Field(..., description="property | lead | agent | report")
    original_lang: str = Field("en")
    original_text: str


class UserLangPreference(BaseModel):
    user_id: str
    preferred_lang: str


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.post("", response_model=LangSyncResponse)
async def sync_language(payload: LangSyncRequest):
    """
    Main endpoint: called by frontend whenever the language selector changes.

    Flow (LangGraph):
      validate → save_preference → check_cache
        → (cache miss?) translate via Claude
        → finalize
    """
    if payload.requested_lang not in VALID_LANGS:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid lang '{payload.requested_lang}'. Must be one of {sorted(VALID_LANGS)}",
        )

    try:
        from app.agents.lang_sync_graph import run_lang_sync
        result = await run_lang_sync(
            user_id=payload.user_id,
            requested_lang=payload.requested_lang,
            previous_lang=payload.previous_lang or "en",
            content_keys=payload.content_keys,
        )
    except Exception as e:
        logger.error("[lang_sync] graph error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"LangSync error: {e}")

    return LangSyncResponse(
        ok=result["ui_synced"],
        final_lang=result["final_lang"],
        preference_saved=result["preference_saved"],
        translated_content=result["translated_content"],
        cache_hits=len(result["cache_hits"]),
        cache_misses=len(result["cache_misses"]),
        errors=result["errors"],
    )


@router.get("/preference/{user_id}", response_model=UserLangPreference)
async def get_user_preference(user_id: str):
    """Return the stored language preference for a user."""
    try:
        from app.integrations.supabase_client import supabase_client
        result = supabase_client.table("users").select(
            "id,preferred_lang"
        ).eq("id", user_id).limit(1).execute()
        rows = result.get("data", []) if isinstance(result, dict) else []
        if not rows:
            raise HTTPException(status_code=404, detail="User not found")
        return UserLangPreference(user_id=user_id, preferred_lang=rows[0].get("preferred_lang", "en"))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/content", status_code=201)
async def register_content(payload: ContentRegisterRequest):
    """
    Register a new translatable content item in content_store.
    Call this when creating properties, leads, agents, or reports.
    """
    if payload.original_lang not in VALID_LANGS:
        raise HTTPException(status_code=422, detail="Invalid original_lang")

    try:
        from app.integrations.supabase_client import supabase_client
        supabase_client.table("content_store").upsert({
            "content_key": payload.content_key,
            "content_type": payload.content_type,
            "original_lang": payload.original_lang,
            "original_text": payload.original_text,
            "updated_at": datetime.utcnow().isoformat(),
        }, on_conflict="content_key").execute()
        return {"ok": True, "content_key": payload.content_key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/cache/{lang}/{content_key:path}", status_code=204)
async def invalidate_cache(lang: str, content_key: str):
    """Invalidate a specific translation in Redis cache."""
    if lang not in VALID_LANGS:
        raise HTTPException(status_code=422, detail="Invalid lang")
    try:
        from app.integrations.redis_client import cache_invalidate
        await cache_invalidate(lang, content_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
