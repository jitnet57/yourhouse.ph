"""ElevenLabs integration client for K-IREA API."""

import os
from typing import Dict, List, Optional
import httpx
import base64
import logging

logger = logging.getLogger(__name__)

class ElevenLabsClient:
    """ElevenLabs integration for text-to-speech."""
    
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.base_url = "https://api.elevenlabs.io/v1"
        self.default_voice = os.getenv("ELEVENLABS_DEFAULT_VOICE", "21m00Tcm4TlvDq8ikWAM")
        self.headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
    
    def configure(self, api_key: Optional[str], default_voice: Optional[str] = None):
        """Configure ElevenLabs runtime client."""
        self.api_key = api_key
        if default_voice:
            self.default_voice = default_voice
        self.headers["xi-api-key"] = self.api_key or ""

    def deconfigure(self):
        """Remove ElevenLabs runtime configuration."""
        self.api_key = None
        self.headers["xi-api-key"] = ""

    def is_configured(self) -> bool:
        """Check if ElevenLabs is properly configured."""
        return bool(self.api_key)
    
    def generate_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> Dict:
        """Generate speech from text using ElevenLabs."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "ElevenLabs not configured"}
            
            voice_id = voice_id or self.default_voice
            
            url = f"{self.base_url}/text-to-speech/{voice_id}"
            
            data = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": stability,
                    "similarity_boost": similarity_boost
                }
            }
            
            response = httpx.post(
                url,
                headers=self.headers,
                json=data,
                timeout=30.0
            )
            
            if response.status_code == 200:
                audio_base64 = base64.b64encode(response.content).decode()
                logger.info(f"Speech generated from text: {text[:50]}...")
                return {
                    "success": True,
                    "audio_base64": audio_base64,
                    "text": text,
                    "voice_id": voice_id,
                    "length": len(response.content)
                }
            else:
                logger.error(f"ElevenLabs error: {response.status_code} - {response.text}")
                return {
                    "success": False,
                    "error": f"API error: {response.status_code}",
                    "details": response.text
                }
        except Exception as e:
            logger.error(f"Speech generation error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_voices(self) -> Dict:
        """Get list of available voices."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "ElevenLabs not configured"}
            
            url = f"{self.base_url}/voices"
            
            response = httpx.get(
                url,
                headers=self.headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                voices_data = response.json()
                voices = []
                
                for voice in voices_data.get("voices", []):
                    voices.append({
                        "id": voice.get("voice_id"),
                        "name": voice.get("name"),
                        "category": voice.get("category"),
                        "description": voice.get("description"),
                        "language": voice.get("language")
                    })
                
                logger.info(f"Retrieved {len(voices)} voices")
                return {
                    "success": True,
                    "voices": voices,
                    "count": len(voices)
                }
            else:
                logger.error(f"Get voices error: {response.status_code}")
                return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Get voices error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_voice_settings(self, voice_id: str) -> Dict:
        """Get settings for a specific voice."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "ElevenLabs not configured"}
            
            url = f"{self.base_url}/voices/{voice_id}/settings"
            
            response = httpx.get(
                url,
                headers=self.headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                settings = response.json()
                logger.info(f"Retrieved settings for voice: {voice_id}")
                return {
                    "success": True,
                    "voice_id": voice_id,
                    "settings": settings
                }
            else:
                logger.error(f"Get settings error: {response.status_code}")
                return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Get settings error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def update_voice_settings(
        self,
        voice_id: str,
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> Dict:
        """Update voice settings."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "ElevenLabs not configured"}
            
            url = f"{self.base_url}/voices/{voice_id}/settings"
            
            data = {
                "stability": stability,
                "similarity_boost": similarity_boost
            }
            
            response = httpx.post(
                url,
                headers=self.headers,
                json=data,
                timeout=10.0
            )
            
            if response.status_code == 200:
                logger.info(f"Updated settings for voice: {voice_id}")
                return {
                    "success": True,
                    "voice_id": voice_id,
                    "stability": stability,
                    "similarity_boost": similarity_boost
                }
            else:
                logger.error(f"Update settings error: {response.status_code}")
                return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Update settings error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_usage(self) -> Dict:
        """Get account usage statistics."""
        try:
            if not self.is_configured():
                return {"success": False, "error": "ElevenLabs not configured"}
            
            url = f"{self.base_url}/user/subscription"
            
            response = httpx.get(
                url,
                headers=self.headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info("Retrieved subscription/usage info")
                return {
                    "success": True,
                    "subscription": data
                }
            else:
                logger.error(f"Get usage error: {response.status_code}")
                return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Get usage error: {str(e)}")
            return {"success": False, "error": str(e)}


# Global instance
elevenlabs_client = ElevenLabsClient()


async def test_elevenlabs_connection() -> bool:
    """Test ElevenLabs connectivity."""
    return elevenlabs_client.is_configured()
