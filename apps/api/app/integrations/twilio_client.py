"""Twilio integration client for K-IREA API."""

import os
from typing import Dict, Optional
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
import logging

logger = logging.getLogger(__name__)

class TwilioClient:
    """Twilio integration for SMS, WhatsApp, and voice calls."""
    
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        self.client = None
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
    
    def configure(self, account_sid: Optional[str], auth_token: Optional[str], phone_number: Optional[str] = None):
        """Configure Twilio runtime client."""
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.phone_number = phone_number or self.phone_number
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None

    def deconfigure(self):
        """Remove Twilio runtime configuration."""
        self.account_sid = None
        self.auth_token = None
        self.client = None
        self.phone_number = None
    
    def is_configured(self) -> bool:
        """Check if Twilio is properly configured."""
        return self.client is not None
    
    def send_sms(self, to_number: str, message: str) -> Dict:
        """Send SMS message via Twilio."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "Twilio not configured"}
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            
            logger.info(f"SMS sent to {to_number}: {message_obj.sid}")
            return {
                "success": True,
                "message_sid": message_obj.sid,
                "status": message_obj.status,
                "phone": to_number
            }
        except Exception as e:
            logger.error(f"SMS send error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def send_whatsapp(self, to_number: str, message: str) -> Dict:
        """Send WhatsApp message via Twilio."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "Twilio not configured"}
            
            # Ensure WhatsApp format
            if not to_number.startswith("whatsapp:"):
                to_number = f"whatsapp:{to_number}"
            
            from_number = f"whatsapp:{self.phone_number}"
            
            message_obj = self.client.messages.create(
                body=message,
                from_=from_number,
                to=to_number
            )
            
            logger.info(f"WhatsApp sent to {to_number}: {message_obj.sid}")
            return {
                "success": True,
                "message_sid": message_obj.sid,
                "status": message_obj.status,
                "channel": "whatsapp"
            }
        except Exception as e:
            logger.error(f"WhatsApp send error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def make_call(self, to_number: str, screen_name: str = "K-IREA Property Agent") -> Dict:
        """Make an outbound call via Twilio."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "Twilio not configured"}
            
            # Generate TwiML for voice message
            response = VoiceResponse()
            response.say(f"Hello, this is {screen_name} calling.", voice="alice")
            response.hangup()
            
            call = self.client.calls.create(
                to=to_number,
                from_=self.phone_number,
                twiml=str(response)
            )
            
            logger.info(f"Call made to {to_number}: {call.sid}")
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
                "phone": to_number
            }
        except Exception as e:
            logger.error(f"Call error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_message_status(self, message_sid: str) -> Dict:
        """Get the status of a sent message."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "Twilio not configured"}
            
            message = self.client.messages(message_sid).fetch()
            
            return {
                "message_sid": message.sid,
                "status": message.status,
                "to": message.to,
                "from": message.from_,
                "body": message.body,
                "sent_at": message.date_sent,
                "error_code": message.error_code,
                "error_message": message.error_message
            }
        except Exception as e:
            logger.error(f"Status check error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_call_status(self, call_sid: str) -> Dict:
        """Get the status of a call."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "Twilio not configured"}
            
            call = self.client.calls(call_sid).fetch()
            
            return {
                "call_sid": call.sid,
                "status": call.status,
                "to": call.to,
                "from": call.from_,
                "duration": call.duration,
                "start_time": call.start_time,
                "end_time": call.end_time
            }
        except Exception as e:
            logger.error(f"Call status error: {str(e)}")
            return {"success": False, "error": str(e)}


# Global instance
twilio_client = TwilioClient()


async def test_twilio_connection() -> bool:
    """Test Twilio connectivity."""
    return twilio_client.is_configured()
