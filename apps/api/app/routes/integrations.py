from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

router = APIRouter(
    prefix="/api/integrations",
    tags=["integrations"]
)

# Models
class IntegrationConfig(BaseModel):
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    additional_config: Optional[Dict[str, Any]] = None

class IntegrationCreateRequest(BaseModel):
    provider: str
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    additional_config: Optional[Dict[str, Any]] = None

class Integration(BaseModel):
    id: str
    name: str
    provider: str  # twilio, elevenlabs, cal-com, supabase, stripe
    status: str  # connected, disconnected, error
    description: str
    connected_at: Optional[str] = None
    last_used: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class WebhookConfig(BaseModel):
    event_type: str
    url: str
    is_active: bool = True

class WebhookCreateRequest(BaseModel):
    integration_id: str
    event_type: str
    url: str
    is_active: bool = True

class Webhook(BaseModel):
    id: str
    integration_id: str
    event_type: str
    url: str
    is_active: bool
    created_at: str
    last_triggered: Optional[str] = None

# In-memory storage
integrations_db: Dict[str, Integration] = {
    "1": Integration(
        id="1",
        name="Twilio SMS",
        provider="twilio",
        status="connected",
        description="SMS and voice communications",
        connected_at="2026-03-15",
        last_used="2026-04-17",
        config={"account_sid": "AC...", "phone_number": "+1234567890"}
    ),
    "2": Integration(
        id="2",
        name="ElevenLabs AI Voice",
        provider="elevenlabs",
        status="connected",
        description="AI voice generation for leads",
        connected_at="2026-03-20",
        last_used="2026-04-16",
        config={"model_id": "eleven_monolingual_v1"}
    )
}

webhooks_db: Dict[str, Webhook] = {
    "1": Webhook(
        id="1",
        integration_id="1",
        event_type="sms_received",
        url="https://api.yourhouse.ph/webhooks/sms",
        is_active=True,
        created_at="2026-03-15",
        last_triggered="2026-04-17T14:30:00Z"
    )
}

cal_webhook_events: List[Dict[str, Any]] = []

AVAILABLE_INTEGRATIONS = [
    {
        "id": "twilio",
        "name": "Twilio",
        "provider": "twilio",
        "description": "SMS, voice calls, and messaging",
        "features": ["SMS Sending", "Voice Calls", "WhatsApp Integration"],
        "required_fields": ["phone_number"],
        "optional_fields": ["api_secret"]
    },
    {
        "id": "elevenlabs",
        "name": "ElevenLabs",
        "provider": "elevenlabs",
        "description": "AI-powered voice generation",
        "features": ["Text-to-Speech", "Voice Cloning", "Custom Voices"],
        "required_fields": [],
        "optional_fields": ["default_voice", "api_secret"]
    },
    {
        "id": "cal-com",
        "name": "Cal.com",
        "provider": "cal-com",
        "description": "Scheduling and meeting booking",
        "features": ["Appointment Booking", "Calendar Sync", "Reminders"],
        "required_fields": [],
        "optional_fields": []
    },
    {
        "id": "supabase",
        "name": "Supabase",
        "provider": "supabase",
        "description": "PostgreSQL database & auth",
        "features": ["Database", "Authentication", "Real-time Sync"],
        "required_fields": [],
        "optional_fields": []
    },
    {
        "id": "stripe",
        "name": "Stripe",
        "provider": "stripe",
        "description": "Payment processing",
        "features": ["Payments", "Invoicing", "Subscriptions"],
        "required_fields": [],
        "optional_fields": []
    },
    {
        "id": "langgraph",
        "name": "LangGraph",
        "provider": "langgraph",
        "description": "AI orchestration engine for multi-step workflows",
        "features": ["Lead Qualification", "Property Agent Workflows", "Stateful Chat"],
        "required_fields": [],
        "optional_fields": []
    }
]



def validate_integration_config(provider: str, config: Dict[str, Any]):
    if provider == "twilio":
        if not config.get("api_key"):
            raise HTTPException(status_code=400, detail="Twilio requires api_key")
        if not config.get("phone_number"):
            raise HTTPException(status_code=400, detail="Twilio requires a phone_number in additional_config")
    elif provider == "elevenlabs":
        if not config.get("api_key"):
            raise HTTPException(status_code=400, detail="ElevenLabs requires api_key")
    elif provider == "cal-com":
        if not config.get("api_key"):
            raise HTTPException(status_code=400, detail="Cal.com requires api_key")
    elif provider == "langgraph":
        return
    elif provider == "supabase":
        if not config.get("api_key"):
            raise HTTPException(status_code=400, detail="Supabase requires api_key")
    elif provider == "stripe":
        if not config.get("api_key"):
            raise HTTPException(status_code=400, detail="Stripe requires api_key")


def configure_runtime_client(provider: str, config: Dict[str, Any]):
    if provider == "twilio":
        from app.integrations.twilio_client import twilio_client
        twilio_client.configure(
            account_sid=config.get("api_key"),
            auth_token=config.get("api_secret"),
            phone_number=config.get("phone_number")
        )
    elif provider == "elevenlabs":
        from app.integrations.elevenlabs_client import elevenlabs_client
        elevenlabs_client.configure(
            api_key=config.get("api_key"),
            default_voice=config.get("default_voice")
        )
    elif provider == "cal-com":
        from app.integrations.calcom_client import calcom_client
        calcom_client.configure(api_key=config.get("api_key"))
    elif provider == "langgraph":
        # LangGraph does not require external runtime credentials
        return


def clear_runtime_client(provider: str):
    if provider == "twilio":
        from app.integrations.twilio_client import twilio_client
        twilio_client.deconfigure()
    elif provider == "elevenlabs":
        from app.integrations.elevenlabs_client import elevenlabs_client
        elevenlabs_client.deconfigure()
    elif provider == "cal-com":
        from app.integrations.calcom_client import calcom_client
        calcom_client.deconfigure()
    elif provider == "langgraph":
        return

# Endpoints

@router.get("/", response_model=List[Integration])
async def list_integrations(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    """Get all connected integrations"""
    integrations_list = list(integrations_db.values())
    return integrations_list[skip:skip + limit]

@router.get("/available")
async def get_available_integrations():
    """Get list of available integrations"""
    return AVAILABLE_INTEGRATIONS

@router.get("/{integration_id}", response_model=Integration)
async def get_integration(integration_id: str):
    """Get specific integration details"""
    if integration_id not in integrations_db:
        raise HTTPException(status_code=404, detail="Integration not found")
    return integrations_db[integration_id]

@router.post("/", response_model=Integration)
async def create_integration(request: IntegrationCreateRequest):
    """Connect a new integration"""
    provider = request.provider
    # Find available integration
    available = next((i for i in AVAILABLE_INTEGRATIONS if i["provider"] == provider), None)
    if not available:
        raise HTTPException(status_code=400, detail="Invalid provider")
    
    # Check if already connected
    existing = next((i for i in integrations_db.values() if i.provider == provider), None)
    if existing:
        raise HTTPException(status_code=400, detail="Integration already connected")
    
    integration_id = str(len(integrations_db) + 1)
    now = datetime.now().isoformat().split("T")[0]
    
    integration_config: Dict[str, Any] = {
        "api_key": request.api_key,
        "api_secret": request.api_secret,
    }
    if request.additional_config:
        integration_config.update(request.additional_config)

    validate_integration_config(provider, integration_config)

    new_integration = Integration(
        id=integration_id,
        name=available["name"],
        provider=provider,
        status="connected",
        description=available["description"],
        connected_at=now,
        last_used=now,
        config=integration_config
    )
    
    integrations_db[integration_id] = new_integration
    configure_runtime_client(provider, integration_config)
    return new_integration

@router.delete("/{integration_id}")
async def disconnect_integration(integration_id: str):
    """Disconnect an integration"""
    if integration_id not in integrations_db:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    integration = integrations_db[integration_id]
    provider = integration.provider
    clear_runtime_client(provider)
    del integrations_db[integration_id]
    
    # Also delete related webhooks
    webhooks_to_delete = [w_id for w_id, w in webhooks_db.items() if w.integration_id == integration_id]
    for w_id in webhooks_to_delete:
        del webhooks_db[w_id]
    
    return {"message": f"{provider} integration disconnected successfully"}

@router.post("/{integration_id}/test")
async def test_integration(integration_id: str):
    """Test integration connectivity"""
    if integration_id not in integrations_db:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    integration = integrations_db[integration_id]
    provider = integration.provider
    configured = False
    status_message = "Unknown provider"

    if provider == "twilio":
        from app.integrations.twilio_client import twilio_client
        configured = twilio_client.is_configured()
        status_message = "Twilio is configured" if configured else "Twilio is not configured"
    elif provider == "elevenlabs":
        from app.integrations.elevenlabs_client import elevenlabs_client
        configured = elevenlabs_client.is_configured()
        status_message = "ElevenLabs is configured" if configured else "ElevenLabs is not configured"
    elif provider == "cal-com":
        from app.integrations.calcom_client import calcom_client
        configured = calcom_client.is_configured()
        status_message = "Cal.com is configured" if configured else "Cal.com is not configured"
    elif provider == "langgraph":
        configured = True
        status_message = "LangGraph orchestration is available"
    else:
        configured = integration.status == "connected"
        status_message = f"Integration {provider} status is {integration.status}"

    return {
        "integration_id": integration_id,
        "provider": provider,
        "configured": configured,
        "status": "success" if configured else "failure",
        "message": status_message,
        "response_time_ms": 120
    }

@router.post("/{integration_id}/sync")
async def sync_integration(integration_id: str):
    """Sync data with integration"""
    if integration_id not in integrations_db:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    integration = integrations_db[integration_id]
    integration.last_used = datetime.now().isoformat().split("T")[0]
    
    # Mock sync operation
    return {
        "integration_id": integration_id,
        "provider": integration.provider,
        "status": "synced",
        "records_synced": 42,
        "last_sync": integration.last_used
    }

# Webhooks

@router.get("/webhooks", response_model=List[Webhook])
async def list_webhooks(integration_id: Optional[str] = None):
    """Get all webhooks"""
    webhooks_list = list(webhooks_db.values())
    
    if integration_id:
        webhooks_list = [w for w in webhooks_list if w.integration_id == integration_id]
    
    return webhooks_list

@router.post("/webhooks", response_model=Webhook)
async def create_webhook(webhook_request: WebhookCreateRequest):
    """Create a new webhook"""
    integration_id = webhook_request.integration_id
    if integration_id not in integrations_db:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    webhook_id = str(len(webhooks_db) + 1)
    now = datetime.now().isoformat().split("T")[0]
    
    new_webhook = Webhook(
        id=webhook_id,
        integration_id=integration_id,
        event_type=webhook_request.event_type,
        url=webhook_request.url,
        is_active=webhook_request.is_active,
        created_at=now
    )
    
    webhooks_db[webhook_id] = new_webhook
    return new_webhook

@router.delete("/webhooks/{webhook_id}")
async def delete_webhook(webhook_id: str):
    """Delete a webhook"""
    if webhook_id not in webhooks_db:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    del webhooks_db[webhook_id]
    return {"message": "Webhook deleted successfully"}

@router.post("/webhooks/{webhook_id}/test")
async def test_webhook(webhook_id: str):
    """Send test payload to webhook"""
    if webhook_id not in webhooks_db:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    webhook = webhooks_db[webhook_id]
    
    # Mock test send
    return {
        "webhook_id": webhook_id,
        "event_type": webhook.event_type,
        "status": "sent",
        "response_code": 200,
        "message": "Test payload sent successfully"
    }

@router.post("/cal-webhook")
async def handle_cal_webhook(request: Request):
    """Receive Cal.com webhook events."""
    try:
        payload = await request.json()
    except Exception:
        payload = {"error": "invalid_json"}

    event = {
        "received_at": datetime.now().isoformat(),
        "payload": payload
    }
    cal_webhook_events.append(event)

    return {
        "status": "received",
        "message": "Cal.com webhook received successfully",
        "received_at": event["received_at"],
        "payload_summary": {
            "type": payload.get("type") if isinstance(payload, dict) else None,
            "event": payload.get("event") if isinstance(payload, dict) else None,
            "raw_size": len(str(payload))
        }
    }


@router.get("/cal-webhook/events")
async def list_cal_webhook_events():
    """List recently received Cal.com webhook events."""
    return {
        "total_events": len(cal_webhook_events),
        "events": cal_webhook_events[-20:]
    }


@router.get("/statistics/summary")
async def get_integration_statistics():
    """Get integration statistics"""
    connected = sum(1 for i in integrations_db.values() if i.status == "connected")
    disconnected = sum(1 for i in integrations_db.values() if i.status == "disconnected")
    
    by_provider = {}
    for integration in integrations_db.values():
        p = integration.provider
        by_provider[p] = by_provider.get(p, 0) + 1
    
    return {
        "total_integrations": len(integrations_db),
        "connected": connected,
        "disconnected": disconnected,
        "total_webhooks": len(webhooks_db),
        "total_cal_webhook_events": len(cal_webhook_events),
        "by_provider": by_provider,
        "available_integrations": len(AVAILABLE_INTEGRATIONS)
    }
