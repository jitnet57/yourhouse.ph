from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import json

router = APIRouter(
    prefix="/api/integrations-orchestration",
    tags=["integrations-orchestration"]
)

# Models
class TwilioMessageRequest(BaseModel):
    phone_number: str
    message: str
    channel: str = "sms"  # sms, whatsapp, voice

class ElevenLabsRequest(BaseModel):
    text: str
    voice_id: str = "21m00Tcm4TlvDq8ikWAM"
    stability: float = 0.5

class CalComBookingRequest(BaseModel):
    title: str
    start_time: str
    end_time: str
    attendee_email: str
    description: str = ""

class LangGraphExecuteRequest(BaseModel):
    lead_name: str
    lead_email: str
    property_type: str
    budget_range: str

# Twilio Endpoints
@router.post("/twilio/send-message")
async def send_twilio_message(request: TwilioMessageRequest):
    """Send SMS, WhatsApp, or voice message via Twilio"""
    try:
        from app.integrations.twilio_client import twilio_client
        
        if not twilio_client.is_configured():
            raise HTTPException(status_code=400, detail="Twilio not configured")
        
        if request.channel == "sms":
            result = twilio_client.send_sms(request.phone_number, request.message)
        elif request.channel == "whatsapp":
            result = twilio_client.send_whatsapp(request.phone_number, request.message)
        elif request.channel == "voice":
            result = twilio_client.make_call(request.phone_number, request.message)
        else:
            raise HTTPException(status_code=400, detail="Invalid channel")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/twilio/message-status/{message_sid}")
async def get_message_status(message_sid: str):
    """Get Twilio message delivery status"""
    try:
        from app.integrations.twilio_client import twilio_client
        
        if not twilio_client.is_configured():
            raise HTTPException(status_code=400, detail="Twilio not configured")
        
        result = twilio_client.get_message_status(message_sid)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/twilio/status")
async def twilio_status():
    """Check Twilio integration status"""
    try:
        from app.integrations.twilio_client import twilio_client
        
        return {
            "service": "Twilio",
            "configured": twilio_client.is_configured(),
            "capabilities": ["SMS", "WhatsApp", "Voice Calls"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ElevenLabs Endpoints
@router.post("/elevenlabs/generate-speech")
async def generate_speech(request: ElevenLabsRequest):
    """Generate AI voice from text"""
    try:
        from app.integrations.elevenlabs_client import elevenlabs_client
        
        if not elevenlabs_client.is_configured():
            raise HTTPException(status_code=400, detail="ElevenLabs not configured")
        
        result = elevenlabs_client.generate_speech(
            text=request.text,
            voice_id=request.voice_id,
            stability=request.stability
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/elevenlabs/voices")
async def get_elevenlabs_voices():
    """Get available ElevenLabs voices"""
    try:
        from app.integrations.elevenlabs_client import elevenlabs_client
        
        if not elevenlabs_client.is_configured():
            raise HTTPException(status_code=400, detail="ElevenLabs not configured")
        
        result = elevenlabs_client.get_voices()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/elevenlabs/status")
async def elevenlabs_status():
    """Check ElevenLabs integration status"""
    try:
        from app.integrations.elevenlabs_client import elevenlabs_client
        
        return {
            "service": "ElevenLabs",
            "configured": elevenlabs_client.is_configured(),
            "capabilities": ["Text-to-Speech", "Voice Cloning", "Custom Voices"],
            "models": ["eleven_monolingual_v1", "eleven_multilingual_v2"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Cal.com Endpoints
@router.post("/calcom/create-booking")
async def create_calcom_booking(request: CalComBookingRequest):
    """Create a calendar booking via Cal.com"""
    try:
        from app.integrations.calcom_client import calcom_client
        
        if not calcom_client.is_configured():
            raise HTTPException(status_code=400, detail="Cal.com not configured")
        
        result = await calcom_client.create_event(
            title=request.title,
            start_time=request.start_time,
            end_time=request.end_time,
            attendee_email=request.attendee_email,
            description=request.description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/calcom/availability/{user_id}")
async def get_calcom_availability(user_id: str, date: str = Query(...)):
    """Get available time slots from Cal.com"""
    try:
        from app.integrations.calcom_client import calcom_client
        
        if not calcom_client.is_configured():
            raise HTTPException(status_code=400, detail="Cal.com not configured")
        
        result = await calcom_client.get_availability(user_id, date)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calcom/sync/{user_id}")
async def sync_calcom_calendar(user_id: str):
    """Sync calendar with Cal.com"""
    try:
        from app.integrations.calcom_client import calcom_client
        
        if not calcom_client.is_configured():
            raise HTTPException(status_code=400, detail="Cal.com not configured")
        
        result = await calcom_client.sync_calendar(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/calcom/status")
async def calcom_status():
    """Check Cal.com integration status"""
    try:
        from app.integrations.calcom_client import calcom_client
        
        return {
            "service": "Cal.com",
            "configured": calcom_client.is_configured(),
            "capabilities": ["Appointment Booking", "Calendar Sync", "Reminders"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# LangGraph Orchestration Endpoints
@router.post("/langgraph/execute-property-agent")
async def execute_property_agent(request: LangGraphExecuteRequest):
    """Execute property qualifying agent with LangGraph"""
    try:
        from app.integrations.langgraph_orchestration import property_graph_compiled
        
        state = {
            "messages": [
                {"role": "user", "content": f"I'm {request.lead_name}, interested in a {request.property_type}"}
            ],
            "context": {
                "lead_name": request.lead_name,
                "lead_email": request.lead_email,
                "property_type": request.property_type,
                "budget_range": request.budget_range
            },
            "current_step": "start",
            "result": None
        }
        
        # Execute graph
        final_state = property_graph_compiled.invoke(state)
        
        return {
            "success": True,
            "lead_name": request.lead_name,
            "completed_steps": final_state.get("current_step"),
            "messages": final_state.get("messages"),
            "context": final_state.get("context"),
            "result": final_state.get("result")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/langgraph/execute-qualification")
async def execute_qualification(request: LangGraphExecuteRequest):
    """Execute lead qualification workflow with LangGraph"""
    try:
        from app.integrations.langgraph_orchestration import lead_graph_compiled
        
        state = {
            "messages": [
                {"role": "user", "content": f"I'm interested in {request.property_type}"}
            ],
            "context": {
                "lead_name": request.lead_name,
                "lead_email": request.lead_email,
                "budget_range": request.budget_range
            },
            "current_step": "start",
            "result": None
        }
        
        # Execute graph
        final_state = lead_graph_compiled.invoke(state)
        
        return {
            "success": True,
            "lead_name": request.lead_name,
            "workflow_completed": final_state.get("current_step") == "assign_agent",
            "assigned_agent": final_state.get("context", {}).get("assigned_agent"),
            "qualification_result": final_state.get("result")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/langgraph/status")
async def langgraph_status():
    """Check LangGraph integration status"""
    return {
        "service": "LangGraph",
        "configured": True,
        "capabilities": [
            "Multi-step Agent Workflows",
            "State Management",
            "Conditional Routing",
            "Lead Qualification",
            "Property Tours"
        ],
        "agents": [
            {
                "name": "Property Agent",
                "steps": ["greet", "qualify", "schedule", "end"]
            },
            {
                "name": "Lead Qualification",
                "steps": ["collect_info", "assess_budget", "check_timeline", "assign_agent"]
            }
        ],
        "timestamp": datetime.now().isoformat()
    }

# Integration Status Dashboard
@router.get("/status")
async def all_integrations_status():
    """Get status of all integrations"""
    try:
        from app.integrations.twilio_client import twilio_client
        from app.integrations.elevenlabs_client import elevenlabs_client
        from app.integrations.calcom_client import calcom_client
        
        return {
            "timestamp": datetime.now().isoformat(),
            "integrations": {
                "twilio": {
                    "configured": twilio_client.is_configured(),
                    "capabilities": ["SMS", "WhatsApp", "Voice Calls"]
                },
                "elevenlabs": {
                    "configured": elevenlabs_client.is_configured(),
                    "capabilities": ["Text-to-Speech", "Voice Cloning"]
                },
                "calcom": {
                    "configured": calcom_client.is_configured(),
                    "capabilities": ["Appointment Booking", "Calendar Sync"]
                },
                "langgraph": {
                    "configured": True,
                    "capabilities": ["Agent Orchestration", "Workflow Management"]
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-all")
async def test_all_integrations():
    """Test all integrations"""
    try:
        from app.integrations.twilio_client import twilio_client
        from app.integrations.elevenlabs_client import elevenlabs_client
        from app.integrations.calcom_client import calcom_client

        twilio_ready = twilio_client.is_configured()
        elevenlabs_ready = elevenlabs_client.is_configured()
        calcom_ready = calcom_client.is_configured()

        return {
            "status": "all_systems_checked",
            "timestamp": datetime.now().isoformat(),
            "tests": {
                "twilio": {
                    "service": "Twilio",
                    "configured": twilio_ready,
                    "status": "ready" if twilio_ready else "not_configured",
                    "endpoint": "/api/integrations-orchestration/twilio/send-message"
                },
                "elevenlabs": {
                    "service": "ElevenLabs",
                    "configured": elevenlabs_ready,
                    "status": "ready" if elevenlabs_ready else "not_configured",
                    "endpoint": "/api/integrations-orchestration/elevenlabs/generate-speech"
                },
                "calcom": {
                    "service": "Cal.com",
                    "configured": calcom_ready,
                    "status": "ready" if calcom_ready else "not_configured",
                    "endpoint": "/api/integrations-orchestration/calcom/create-booking"
                },
                "langgraph": {
                    "service": "LangGraph",
                    "configured": True,
                    "status": "ready",
                    "endpoint": "/api/integrations-orchestration/langgraph/execute-property-agent"
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
