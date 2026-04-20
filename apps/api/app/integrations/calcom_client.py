"""
Cal.com Integration Client
Appointment Scheduling & Calendar Sync
"""
import httpx
from typing import Optional, Dict, List
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class CalComClient:
    def __init__(self):
        self.api_key = os.getenv("CAL_COM_API_KEY")
        self.base_url = "https://api.cal.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def create_event(self, title: str, start_time: str, end_time: str,
                          attendee_email: str, description: str = "") -> Dict:
        """Create a calendar booking"""
        if not self.api_key:
            return {"success": False, "error": "Cal.com not configured"}
        
        try:
            payload = {
                "title": title,
                "startTime": start_time,
                "endTime": end_time,
                "attendeeEmail": attendee_email,
                "description": description
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/bookings",
                    headers=self.headers,
                    json=payload
                )
                
                if response.status_code == 201:
                    data = response.json()
                    return {
                        "success": True,
                        "booking_id": data.get("id"),
                        "title": title,
                        "start_time": start_time,
                        "end_time": end_time,
                        "attendee": attendee_email
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Cal.com API error: {response.status_code}"
                    }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_availability(self, user_id: str, date: str) -> Dict:
        """Get available time slots for a user"""
        if not self.api_key:
            return {"success": False, "error": "Cal.com not configured"}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/users/{user_id}/availability",
                    headers=self.headers,
                    params={"date": date}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "date": date,
                        "available_slots": data.get("slots", [])
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Cal.com API error: {response.status_code}"
                    }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def cancel_booking(self, booking_id: str, reason: str = "") -> Dict:
        """Cancel a booking"""
        if not self.api_key:
            return {"success": False, "error": "Cal.com not configured"}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/bookings/{booking_id}",
                    headers=self.headers,
                    json={"reason": reason}
                )
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "booking_id": booking_id,
                        "status": "cancelled"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Cal.com API error: {response.status_code}"
                    }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def sync_calendar(self, user_id: str) -> Dict:
        """Sync calendar with Cal.com"""
        if not self.api_key:
            return {"success": False, "error": "Cal.com not configured"}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/users/{user_id}/sync",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "user_id": user_id,
                        "synced_at": datetime.now().isoformat()
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Cal.com API error: {response.status_code}"
                    }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def configure(self, api_key: Optional[str]):
        """Configure Cal.com runtime client."""
        self.api_key = api_key
        self.headers["Authorization"] = f"Bearer {self.api_key}" if self.api_key else ""

    def deconfigure(self):
        """Remove Cal.com runtime configuration."""
        self.api_key = None
        self.headers["Authorization"] = ""

    def is_configured(self) -> bool:
        """Check if Cal.com is properly configured"""
        return self.api_key is not None

# Global instance
calcom_client = CalComClient()
