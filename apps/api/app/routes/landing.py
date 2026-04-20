"""
FastAPI routes: Landing Page Editor
POST /api/landing/save-draft
POST /api/landing/publish
POST /api/landing/ai-generate
POST /api/landing/upload         (multipart)
GET  /api/landing/current/{tenant_id}
GET  /api/landing/preview/{draft_id}
"""
from __future__ import annotations

import base64
import json
import logging
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/landing", tags=["Landing Editor"])


# ── Schemas ────────────────────────────────────────────────────────────────

class LandingConfigPayload(BaseModel):
    tenant_id: str
    user_id: Optional[str] = None
    hero_url: Optional[str] = None
    hero_file_b64: Optional[str] = None
    hero_file_content_type: Optional[str] = "image/jpeg"
    overlay_color: str = "#000000"
    overlay_alpha: float = Field(0.4, ge=0.0, le=1.0)
    gradient_from: str = "#6366f1"
    gradient_to: str = "#ec4899"
    gradient_direction: str = "to-br"
    headline_i18n: dict = Field(default_factory=lambda: {"en": ""})
    subtext_i18n: dict = Field(default_factory=lambda: {"en": ""})
    cta_text_i18n: dict = Field(default_factory=lambda: {"en": "Get Started"})
    cta_color: str = "#6366f1"
    cta_url: str = "/signup"


class AIGenerateRequest(LandingConfigPayload):
    brand_keywords: list[str] = Field(default_factory=list)
    tone: str = "professional"
    generate_langs: list[str] = Field(default_factory=lambda: ["en"])


class LandingResponse(BaseModel):
    ok: bool
    action: str
    draft_id: Optional[str] = None
    preview_url: Optional[str] = None
    version: Optional[int] = None
    uploaded_url: Optional[str] = None
    headline_i18n: Optional[dict] = None
    subtext_i18n: Optional[dict] = None
    cta_text_i18n: Optional[dict] = None
    accessibility_issues: list[str] = []
    errors: list[str] = []


# ── Helpers ────────────────────────────────────────────────────────────────

def _initial_state(p: LandingConfigPayload, action: str) -> dict:
    return {
        "tenant_id": p.tenant_id,
        "user_id": p.user_id or "anonymous",
        "action": action,
        "hero_file_b64": p.hero_file_b64,
        "hero_file_content_type": p.hero_file_content_type,
        "hero_url": p.hero_url,
        "overlay_color": p.overlay_color,
        "overlay_alpha": p.overlay_alpha,
        "gradient_from": p.gradient_from,
        "gradient_to": p.gradient_to,
        "gradient_direction": p.gradient_direction,
        "headline_i18n": p.headline_i18n,
        "subtext_i18n": p.subtext_i18n,
        "cta_text_i18n": p.cta_text_i18n,
        "cta_color": p.cta_color,
        "cta_url": p.cta_url,
    }


def _response(action: str, state: dict) -> LandingResponse:
    return LandingResponse(
        ok=not state.get("errors"),
        action=action,
        draft_id=state.get("draft_id"),
        preview_url=state.get("preview_url"),
        version=state.get("version"),
        uploaded_url=state.get("uploaded_url"),
        headline_i18n=state.get("headline_i18n"),
        subtext_i18n=state.get("subtext_i18n"),
        cta_text_i18n=state.get("cta_text_i18n"),
        accessibility_issues=state.get("accessibility_issues", []),
        errors=state.get("errors", []),
    )


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.post("/save-draft", response_model=LandingResponse)
async def save_draft(payload: LandingConfigPayload):
    from app.agents.landing_editor_graph import run_landing_editor
    state = _initial_state(payload, "save_draft")
    result = await run_landing_editor(state)
    return _response("save_draft", result)


@router.post("/publish", response_model=LandingResponse)
async def publish(payload: LandingConfigPayload):
    from app.agents.landing_editor_graph import run_landing_editor
    state = _initial_state(payload, "publish")
    result = await run_landing_editor(state)
    if result.get("errors"):
        raise HTTPException(status_code=400, detail=result["errors"])
    return _response("publish", result)


@router.post("/ai-generate", response_model=LandingResponse)
async def ai_generate(payload: AIGenerateRequest):
    from app.agents.landing_editor_graph import run_landing_editor
    state = _initial_state(payload, "ai_generate")
    state["brand_keywords"] = payload.brand_keywords
    state["tone"] = payload.tone
    state["generate_langs"] = payload.generate_langs
    result = await run_landing_editor(state)
    return _response("ai_generate", result)


@router.post("/upload", response_model=LandingResponse)
async def upload(
    tenant_id: str = Form(...),
    file: UploadFile = File(...),
):
    """Direct multipart upload — useful when payload is too large for JSON."""
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB)")

    from app.integrations.r2_client import upload_bytes, gen_asset_key
    try:
        ext = (file.content_type or "image/jpeg").split("/")[-1].replace("jpeg", "jpg")
        url = await upload_bytes(
            bucket="landing-assets",
            key=gen_asset_key(tenant_id, ext=ext),
            data=data,
            content_type=file.content_type or "image/jpeg",
        )
        return LandingResponse(ok=True, action="upload_asset", uploaded_url=url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/current/{tenant_id}")
async def get_current(tenant_id: str):
    """Return the currently published landing config for a tenant."""
    try:
        from app.integrations.supabase_client import supabase_client
        result = supabase_client.table("landing_configs").select("*").eq(
            "tenant_id", tenant_id
        ).eq("is_published", True).limit(1).execute()
        rows = result.get("data", []) if isinstance(result, dict) else []
        if not rows:
            return {"ok": False, "detail": "No published config"}
        return {"ok": True, "config": rows[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preview/{draft_id}")
async def get_preview(draft_id: str, tenant: str):
    """Return draft payload for the preview iframe to render."""
    try:
        from app.integrations.redis_client import get_redis
        redis = await get_redis()
        raw = await redis.get(f"landing_draft:{tenant}:{draft_id}")
        if not raw:
            raise HTTPException(status_code=404, detail="Draft expired or not found")
        return json.loads(raw)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
