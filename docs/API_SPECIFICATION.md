# API Specification & Integration Guide
## K-IREA Platform - Backend API Reference

**Date:** 2026-04-15  
**Version:** 1.0-Alpha  

---

## 📋 Overview

### Backend Architecture
```
┌─────────────────────────────────────────────────────┐
│           Frontend (Next.js Browser)                │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼──────┐ ┌──▼──────┐ ┌─▼──────────┐
    │  Twilio   │ │ Twilio  │ │ ElevenLabs │
    │   SMS/    │ │ Voice   │ │   Voice    │
    │ WhatsApp  │ │ (WebRTC)│ │   API      │
    └────┬──────┘ └──┬──────┘ └─┬──────────┘
         │           │          │
         └───────────┼──────────┘
                     │
         ┌───────────▼──────────────┐
         │   Python FastAPI Server  │
         │  (Port: 8000)            │
         └───────────┬──────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
 ┌──▼─────┐    ┌────▼────┐    ┌─────▼──────┐
 │ Supabase│    │ LangFlow│    │  Redis     │
 │(DB/RLS) │    │(AI Agent│    │  (Cache)   │
 └─────────┘    │ Orches) │    └────────────┘
                └─────────┘
```

---

## 🔌 REST API Endpoints

### 1. **Authentication** (Supabase Auth)

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. **Customer Management**

#### Create Lead (웹사이트 Form 제출)
```
POST /api/v1/customers
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "name": "홍길동",
  "email": "hong@example.com",
  "phone_number": "+639123456789",
  "country": "Korea",
  "investment_type": "INVESTOR",
  "preferred_location": ["Cebu IT Park", "South Business Park"],
  "investment_budget": 500000,
  "source": "landing_page_form",
  "comment": "세부 콘도 투자 고려 중입니다"
}

Response (201 Created):
{
  "id": "cust_abc123",
  "name": "홍길동",
  "ai_score": 45,
  "status": "LEAD",
  "created_at": "2026-04-15T14:30:00Z",
  "next_action": "AUTOMATED_SMS_SENT"
}
```

#### Get Customer Details
```
GET /api/v1/customers/{customer_id}
Authorization: Bearer {TOKEN}

Response (200 OK):
{
  "id": "cust_abc123",
  "name": "홍길동",
  "email": "hong@example.com",
  "phone_number": "+639123456789",
  "ai_score": 68,
  "status": "PROSPECT",
  "last_interaction": "2026-04-15T15:45:00Z",
  "interactions_count": 3,
  "communication_history": [
    {
      "channel": "WhatsApp",
      "timestamp": "2026-04-15T14:35:00Z",
      "message": "환영합니다! 세부 부동산 분석 리포트를 확인해보세요."
    },
    {
      "channel": "Voice",
      "timestamp": "2026-04-15T15:00:00Z",
      "duration": 340,
      "sentiment": "POSITIVE"
    }
  ]
}
```

#### Update Customer Status & Preferences
```
PATCH /api/v1/customers/{customer_id}
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "status": "CONTRACTED",
  "preferred_voice_tone": "PROFESSIONAL",
  "notes": "세부 IT Park 콘도 계약 진행 중"
}

Response (200 OK):
{
  "id": "cust_abc123",
  "status": "CONTRACTED",
  "updated_at": "2026-04-15T16:00:00Z"
}
```

---

### 3. **Properties (매물 관리)**

#### Get Properties with AI Filter
```
GET /api/v1/properties?
  location=Cebu&
  min_roi=8&
  max_price=300000&
  property_type=CONDO&
  sort_by=estimated_net_roi

Authorization: Bearer {TOKEN}

Response (200 OK):
[
  {
    "id": "prop_001",
    "property_name": "Cebu IT Park Twin Towers Unit 1205",
    "location_city": "Cebu",
    "location_coords": [10.3157, 123.8854],
    "price_php": 150000,
    "property_type": "CONDO",
    "area_sqm": 42.5,
    "monthly_rental_php": 1250,
    "annual_maintenance_php": 3500,
    "annual_tax_php": 2000,
    "estimated_net_roi": 8.2,
    "verification_score": 99,
    "infrastructure_score": 92,
    "nearby_schools": 5,
    "nearby_hospitals": 2,
    "nearby_malls": 3
  }
]
```

#### Generate AI Property Report
```
POST /api/v1/properties/{property_id}/analyze
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "customer_id": "cust_abc123",
  "include_voice_summary": true,
  "language": "korean"
}

Response (202 Accepted):
{
  "report_id": "report_xyz789",
  "status": "PROCESSING",
  "estimated_completion": "2026-04-15T14:35:00Z",
  "webhook_url": "https://k-irea.com/webhooks/report-ready"
}

# 리포트 완료 시 Webhook 콜백:
POST {webhook_url}
{
  "report_id": "report_xyz789",
  "pdf_url": "https://storage.supabase.com/reports/report_xyz789.pdf",
  "voice_summary_url": "https://storage.s3.amazonaws.com/voice/report_xyz789.mp3",
  "summary": {
    "investment_potential": "HIGH",
    "roi_analysis": "8.2% 순수익률로 포트폴리오에 적합한 선택입니다.",
    "risk_assessment": "LOW",
    "key_metrics": {
      "payback_period_years": 12.2,
      "cash_on_cash_return": 15.5,
      "capitalization_rate": 8.2
    }
  }
}
```

---

### 4. **Appointments (예약 관리)**

#### Create Appointment (Cal.com 연동)
```
POST /api/v1/appointments
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "customer_id": "cust_abc123",
  "property_id": "prop_001",
  "preferred_time_slots": [
    "2026-04-18T10:00:00Z",
    "2026-04-18T14:00:00Z",
    "2026-04-19T09:00:00Z"
  ],
  "appointment_type": "PROPERTY_TOUR",
  "notes": "부동산 전문가와 함께 투어 원합니다"
}

Response (201 Created):
{
  "appointment_id": "appt_012",
  "cal_booking_id": "cal_abc789",
  "scheduled_for": "2026-04-18T10:00:00Z",
  "broker_name": "마크 브라더",
  "broker_phone": "+639178888888",
  "location_coords": [10.3157, 123.8854],
  "status": "SCHEDULED",
  "ics_calendar": "BEGIN:VCALENDAR...",  # iCal 형식 (Outlook 연동용)
  "created_at": "2026-04-15T14:40:00Z"
}
```

#### Get Appointment Details with GPS Route
```
GET /api/v1/appointments/{appointment_id}
Authorization: Bearer {TOKEN}

Response (200 OK):
{
  "appointment_id": "appt_012",
  "scheduled_for": "2026-04-18T10:00:00Z",
  "status": "SCHEDULED",
  "broker": {
    "name": "마크 브라더",
    "avatar": "https://...",
    "phone": "+639178888888",
    "rating": 4.8
  },
  "property": {
    "id": "prop_001",
    "name": "Cebu IT Park Twin Towers Unit 1205",
    "address": "101 IT Park, Cebu, Philippines"
  },
  "route": {
    "start_location": "Your Hotel",
    "end_location": "Cebu IT Park Twin Towers",
    "estimated_duration_minutes": 25,
    "google_maps_url": "https://maps.google.com/?..."
  },
  "reminders": {
    "sms_1_day_before": true,
    "whatsapp_2_hours_before": true
  }
}
```

---

### 5. **Voice Bot Integration**

#### Initiate Voice Session (Twilio WebRTC)
```
POST /api/v1/voice/initiate-session
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "customer_id": "cust_abc123",
  "session_type": "PROPERTY_INQUIRY",
  "context": {
    "interested_property": "prop_001",
    "previous_messages": ["매물 위치요?", "수익률은?"]
  },
  "preferred_voice_tone": "PROFESSIONAL"
}

Response (200 OK):
{
  "session_id": "voice_sess_xyz",
  "twilio_token": "eyJhbGciOiJIUzI1NiIs...",
  "twilio_client_name": "browser_client_abc123",
  "voice_persona_id": "elevenlabs_prof_001",
  "initial_greeting": "안녕하세요, 홍길동님. 저는 케네스의 AI 부동산 어시스턴트입니다. Cebu IT Park Twin Towers에 대해 알려드리겠습니다.",
  "stream_url": "wss://twilio-stream.example.com/voice"
}
```

#### Voice Webhook (Twilio Media Streams)
```
WebSocket Connection:
wss://{your_server}/api/v1/voice/stream?session_id=voice_sess_xyz&token=eyJhbGc...

Message Format (Twilio → Your Server):
{
  "event": "start",
  "sequenceNumber": 1,
  "start": {
    "callSid": "CA1234567890",
    "accountSid": "AC1234567890",
    "mediaProperties": {
      "mediaConnectivity": "us1"
    }
  }
}

# Audio Media Event
{
  "event": "media",
  "sequenceNumber": 5,
  "media": {
    "payload": "base64_encoded_audio_data",
    "track": "inbound"  # 고객의 음성
  }
}

# Your Server → Twilio Response
{
  "event": "media",
  "streamSid": "MG1234567890",
  "media": {
    "payload": "base64_encoded_ai_response"
  }
}
```

#### End Voice Session & Get Summary
```
POST /api/v1/voice/{session_id}/end-session
Authorization: Bearer {TOKEN}

Response (200 OK):
{
  "session_id": "voice_sess_xyz",
  "duration_seconds": 345,
  "customer_sentiment": "POSITIVE",
  "topics_discussed": ["수익률", "위치", "투어 예약"],
  "next_action": "BOOKING_CREATED",
  "summary": "고객이 세부 IT Park 매물에 매우 관심을 보였으며, 현장 투어를 예약했습니다.",
  "recording_url": "https://storage.s3.amazonaws.com/voice/session_xyz.wav",
  "ai_confidence": 0.94
}
```

---

### 6. **AI Reports & Analytics**

#### Get Customer AI Score Analysis
```
GET /api/v1/analytics/customer/{customer_id}/ai-score
Authorization: Bearer {TOKEN}

Response (200 OK):
{
  "customer_id": "cust_abc123",
  "current_score": 78,
  "score_history": [45, 52, 68, 75, 78],
  "score_breakdown": {
    "engagement_factor": 0.85,    # 웹사이트 시간, 클릭 수
    "investment_seriousness": 0.90, # 예산 명시, 문의 구체성
    "response_speed": 0.80,       # 빠른 답변에 대한 반응
    "communication_quality": 0.75  # 메시지 수, 음성 통화 참여
  },
  "predicted_conversion": 0.68,    # 계약 확률 68%
  "recommended_action": "SEND_VOICE_OFFER"
}
```

#### Get Lead Funnel Analytics
```
GET /api/v1/analytics/funnel?
  date_from=2026-04-01&
  date_to=2026-04-15&
  location=Cebu

Authorization: Bearer {TOKEN}

Response (200 OK):
{
  "period": "2026-04-01 ~ 2026-04-15",
  "funnel": {
    "total_visitors": 1250,
    "leads_generated": 187,
    "sms_opened": 142,
    "voice_engaged": 98,
    "appointments_booked": 62,
    "contracts_signed": 12
  },
  "conversion_rates": {
    "visitor_to_lead": 0.15,
    "lead_to_sms_open": 0.76,
    "sms_to_voice": 0.69,
    "voice_to_appointment": 0.63,
    "appointment_to_contract": 0.19
  },
  "roi": {
    "cost_per_lead": 15,
    "cost_per_appointment": 47,
    "cost_per_contract": 235
  }
}
```

---

## 🔄 Webhook Events

### Event: Customer High-Priority Lead Detected
```json
{
  "event_type": "high_priority_lead_detected",
  "timestamp": "2026-04-15T14:35:00Z",
  "customer_id": "cust_abc123",
  "ai_score": 82,
  "action": "INITIATE_VOICE_CALL",
  "details": {
    "customer_name": "홍길동",
    "phone_number": "+639123456789",
    "interested_property": "prop_001",
    "engagement_indicator": "Spent 8 minutes on property details"
  }
}
```

### Event: Appointment Completed
```json
{
  "event_type": "appointment_completed",
  "timestamp": "2026-04-18T10:45:00Z",
  "appointment_id": "appt_012",
  "customer_id": "cust_abc123",
  "property_id": "prop_001",
  "broker_notes": "고객이 매우 관심 있음. 오늘 중 계약금 납입 의사 표현.",
  "customer_feedback_url": "https://k-irea.com/feedback/appt_012"
}
```

---

## ⚙️ Integration Checklist

### Frontend (Next.js)
- [ ] Twilio Client JS SDK 임베딩
- [ ] ElevenLabs Speech Recognition 컴포넌트
- [ ] Cal.com iFrame 임베딩
- [ ] Supabase Auth 구성
- [ ] Real-time Listening (Supabase Realtime)

### Backend (FastAPI)
- [ ] Twilio API 래퍼 클래스 생성
- [ ] ElevenLabs API 통합
- [ ] LangGraph Agent Flow 정의
- [ ] Webhook 수신 엔드포인트
- [ ] Error Handling & Retry Logic

### Database (Supabase)
- [ ] 모든 테이블 마이그레이션 실행
- [ ] RLS 정책 설정
- [ ] Vector Extension 활성화 (RAG용)
- [ ] Realtime 구독 설정

---

**Next Step:** 각 API 엔드포인트별 상세 구현 코드를 다음 문서에서 다룹니다.
