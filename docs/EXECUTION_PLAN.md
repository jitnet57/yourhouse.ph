# Development Execution Plan (실행 계획)
## K-IREA Platform - Week-by-Week Roadmap

**Project Start:** 2026-04-15  
**MVP Target:** 2026-05-13 (4 weeks)  
**Full Launch:** 2026-06-30 (12 weeks)

---

## 📅 TIMELINE OVERVIEW

```
Week 1         Week 2         Week 3         Week 4         
(Setup)        (Landing)      (Voice Bot)    (Integration)  
└─ Days 1-7    └─ Days 8-14   └─ Days 15-21  └─ Days 22-28

                              Week 5-12 (Advanced Features)
                              └─ CRM, Analytics, Automation
```

---

## 🎯 PHASE 1: MVP (Weeks 1-4, Apr 15 - May 13)

### Week 1: Foundation & Setup (Apr 15-21)

#### **Day 1-2: Local Environment Setup**

**Tasks:**
```
☐ Kenneth: Project Repository 생성 (GitHub)
  └─ git init, .gitignore, README.md 작성
  └─ Branch Strategy: main, develop, feature/* 설정
  └─ GitHub Actions 기본 설정

☐ Kenneth: Monorepo Setup (pnpm)
  └─ pnpm workspace 설정
  └─ root package.json 구성
  
☐ Kenneth: Docker & Local Development
  └─ docker-compose.yml 작성
  └─ Local Supabase 인스턴스 실행
  └─ Redis 컨테이너 추가
```

**Deliverables:**
- ✅ Git Repository with branching strategy
- ✅ Docker Compose running locally
- ✅ Development environment checklist

**Success Criteria:**
```bash
docker-compose up -d  # ✅ All services running
pnpm install         # ✅ Dependencies installed
npm run dev          # ✅ Dev server starts without errors
```

---

#### **Day 3: Supabase Project Setup**

**Tasks:**
```
☐ Kenneth: Create Supabase Project
  └─ Project name: k-irea-production
  └─ Region: AP Southeast (Philippines/Singapore closest)
  └─ Database: PostgreSQL
  
☐ Kenneth: Database Schema Migration
  └─ SQL migrations/001_initial_schema.sql 실행
    ├─ customers table
    ├─ properties table
    ├─ communication_logs table
    ├─ appointments table
    ├─ voice_sessions table
    └─ crm_automations table
    
☐ Kenneth: Row-Level Security (RLS) 정책 설정
  └─ customers: 소유 고객만 접근
  └─ communication_logs: 관련 고객만 접근
  └─ properties: 공개 읽기 권한
```

**Schema Files Location:**
```
/apps/api
  └─ /migrations
      ├─ 001_initial_schema.sql (★ Critical)
      ├─ 002_rls_policies.sql
      └─ 003_vector_setup.sql (RAG용)
```

**Test Command:**
```bash
# Supabase CLI로 마이그레이션 테스트
supabase migration up
supabase db remote push
```

---

#### **Day 4-5: Environment & Configuration**

**Tasks:**
```
☐ Kenneth: API Keys & Environment Variables
  └─ Twilio Account 생성 (free tier)
    ├─ Account SID
    ├─ Auth Token
    └─ Phone Number (한국어 지원)
    
  └─ ElevenLabs API Key 생성
    └─ 최소 100만 characters 주기 (테스트용)
    
  └─ Cal.com 연동 준비
    └─ OAuth token 발급
    
  └─ Supabase Keys
    ├─ Project URL
    ├─ Anon Key
    └─ Service Role Key

☐ Kenneth: .env 파일 생성
  └─ Location: /apps/api/.env (절대 커밋X)
  └─ Sample: .env.example 생성 (커밋O)
  
☐ Kenneth: Frontend Environment
  └─ /apps/web/.env.local 설정
  └─ Next.js public variables (NEXT_PUBLIC_*)
```

**Checklist:**
```
✅ Twilio Account SID verified
✅ ElevenLabs API key tested (simple TTS call)
✅ Cal.com integration token working
✅ Supabase connection string working
✅ All .env variables loaded correctly
```

---

#### **Day 6-7: Database & Backend Bootstrap**

**Tasks:**
```
☐ Kenneth: FastAPI Project Scaffold
  └─ /apps/api/main.py 작성
    ├─ Fast API app initialization
    ├─ CORS 설정 (localhost:3000 허용)
    ├─ Middleware: logging, error handling
    └─ Health check endpoint (/health)
    
☐ Kenneth: Supabase Python Client 설정
  └─ /apps/api/app/integrations/supabase_client.py
  └─ Connection pooling 설정
  
☐ Kenneth: First Simple Endpoint
  └─ GET /api/health → {"status": "ok"}
  └─ Test with: curl http://localhost:8000/api/health

☐ Kenneth: Requirements.txt 생성
  └─ fastapi==0.104.1
  └─ supabase-py==2.0.0
  └─ python-dotenv==1.0.0
  └─ twilio==8.10.0
  └─ elevenlabs==0.2.27
  └─ langgraph==0.1.0
```

**Success Test:**
```bash
cd /apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Terminal에서 보이는 것:
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

#### **Week 1 Deliverables:**
```
✅ GitHub Repository with CI/CD
✅ Local Docker Environment (3 containers)
✅ Supabase Database with schema
✅ FastAPI backend skeleton (health check)
✅ Environment variables configured
✅ Team ready for frontend development
```

---

### Week 2: Landing Page Implementation (Apr 22-28)

#### **Day 8-10: Next.js Frontend Setup & Design System**

**Tasks:**
```
☐ Kenneth: Next.js App Initialization
  └─ npx create-next-app@latest k-irea-web
  └─ App Router 선택
  └─ Tailwind CSS 선택
  └─ TypeScript 선택
  
☐ Kenneth: TrusTech Design System 적용
  └─ /apps/web/tailwind.config.js
    ├─ Deep Navy: #001F3F
    ├─ Electric Blue: #0074D9
    ├─ Soft Gold: #FFD700
    └─ Slate Gray: #F8FAFC, #E2E8F0
    
  └─ /apps/web/app/globals.css
    ├─ Font 임포트 (Inter)
    ├─ Global color variables
    └─ Base component styles
    
☐ Kenneth: ShadcnUI 컴포넌트 설치
  └─ npx shadcn-ui@latest init
  └─ Button, Card, Input, Dialog 추가
```

**File Structure Created:**
```
/apps/web
├── app/
│   ├── layout.tsx (Global wrapper + theme)
│   ├── page.tsx (Landing page structure)
│   ├── globals.css (TrusTech colors)
│   └── favicon.ico
├── components/
│   └── ui/ (ShadcnUI components)
├── public/
│   └── images/ (Hero images, logos)
└── tailwind.config.js (Color palette config)
```

---

#### **Day 11-14: Landing Page Components**

**Tasks:**
```
☐ Kenneth: Hero Section Component
  └─ /apps/web/components/landing/HeroSection.tsx
  └─ Props:
    ├─ Main title (데이터로 증명하는...)
    ├─ Subtitle
    ├─ CTA buttons (무료 AI 분석 리포트)
    └─ Background image
    
☐ Kenneth: Problem Section
  └─ /apps/web/components/landing/ProblemSection.tsx
  └─ 3 problem cards with numbers:
    ├─ 24.5% 허위 매물
    ├─ 10% 숨은 비용
    └─ 3.5배 행정 지연
    
☐ Kenneth: Services Section
  └─ /apps/web/components/landing/ServicesSection.tsx
  └─ 3 service cards:
    ├─ AI 검증 엔진 (99.8%)
    ├─ GPS 인프라 리포트
    └─ Net ROI 시뮬레이터
    
☐ Kenneth: Testimonials Section
  └─ /apps/web/components/landing/TestimonialsSection.tsx
  └─ 2 customer testimonials:
    ├─ 투자자 A님: 연 8.2% 수익률
    └─ 은퇴자 B님: 예산 15% 절감
    
☐ Kenneth: CTA / Footer
  └─ /apps/web/components/landing/CTASection.tsx
  └─ "무료 리포트 체험 시작하기" Button
```

**Component Template Example:**
```typescript
// /apps/web/components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    <header className="relative bg-[#001F3F] text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-6">
          데이터로 증명하는 세부 부동산,<br/>
          <span className="text-[#0074D9]">0.1%의 오차도</span> 허용하지 않습니다.
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          15년 크루즈 운영의 정밀함과 AI 기술의 결합...
        </p>
        <button className="bg-[#0074D9] hover:bg-[#001F3F] text-white px-8 py-4 rounded-lg">
          무료 AI 수익률 분석 리포트 받기
        </button>
      </div>
    </header>
  );
}
```

**Week 2 Deliverables:**
```
✅ Next.js project running on localhost:3000
✅ TrusTech Design System applied (Navy/Gold/Blue)
✅ Landing page with all 5 sections
✅ Responsive mobile design verified
✅ Lighthouse score > 90 for performance
```

---

### Week 3: Voice Bot Integration (Apr 29 - May 5)

#### **Day 15-17: Twilio & Voice Architecture**

**Tasks:**
```
☐ Kenneth: Twilio Backend Setup
  └─ /apps/api/app/integrations/twilio_client.py
  └─ Functions:
    ├─ send_sms(phone, message)
    ├─ send_whatsapp(phone, message)
    ├─ initiate_call(phone_number)
    └─ setup_voice_webhooks()
    
☐ Kenneth: Twilio Webhook Handler
  └─ /apps/api/app/routes/twilio_webhook.py
  └─ Endpoints:
    ├─ POST /webhooks/sms (inbound SMS처리)
    ├─ POST /webhooks/whatsapp (inbound WhatsApp)
    ├─ POST /webhooks/voice-incoming (수신전화)
    └─ POST /webhooks/voice-status (통화상태변경)
    
☐ Kenneth: Twilio WebRTC Browser Integration
  └─ /apps/web/components/voice-bot/TwilioWebRTC.ts
  └─ Browser microphone/speaker 접근
  └─ Real-time audio streaming
```

**Twilio Webhook Test:**
```bash
# 로컬 환경 테스트용 ngrok 사용
ngrok http 8000

# Twilio Console에서 Webhook URL 설정:
# SMS Inbound: https://abc123.ngrok.io/webhooks/sms
# Voice Answer: https://abc123.ngrok.io/webhooks/voice-incoming
```

---

#### **Day 18-20: ElevenLabs Voice Integration**

**Tasks:**
```
☐ Kenneth: ElevenLabs API Client
  └─ /apps/api/app/integrations/elevenlabs_client.py
  └─ Functions:
    ├─ text_to_speech(text, voice_id)
    ├─ speech_to_text(audio_file)
    ├─ list_available_voices()
    └─ create_custom_voice_clone("Kenneth's voice")
    
☐ Kenneth: Voice Persona Configuration
  └─ /apps/api/app/agents/voice_persona.py
  └─ Define personas:
    ├─ PROFESSIONAL: "이것은 세부 IT Park 콘도 매물입니다..."
    ├─ FRIENDLY: "네, 안녕하세요! 저는..."
    └─ TECHNICAL: "ROI 분석 결과를 보여드리겠습니다..."
    
☐ Kenneth: Stream Integration (FastAPI)
  └─ Real-time audio stream 처리
  └─ WebSocket endpoint for voice chat
  └─ Buffer management & error handling
```

**ElevenLabs Test:**
```python
# Simple TTS Test
from elevenlabs import ElevenLabs, Voice, VoiceSettings

client = ElevenLabs(api_key="YOUR_API_KEY")
audio = client.generate(
    text="세부 부동산 투자, 안녕하세요?",
    voice=Voice(
        voice_id="selected_voice_id",
        settings=VoiceSettings(stability=0.71, similarity_boost=0.75)
    ),
    model="eleven_monolingual_v1",
)
# ✅ 한국어 음성 파일 생성됨
```

---

#### **Day 21: Voice Widget Frontend**

**Tasks:**
```
☐ Kenneth: Floating Voice Button Component
  └─ /apps/web/components/voice-bot/FloatingButton.tsx
  └─ Features:
    ├─ Navy background + Gold border
    ├─ Animated microphone icon
    ├─ Click to open voice chat
    └─ Badge showing "Live AI"
    
☐ Kenneth: Voice Visualizer (Wave Animation)
  └─ /apps/web/components/voice-bot/VoiceVisualizer.tsx
  └─ Uses: Framer Motion + Canvas
  └─ Shows real-time audio spectrum
  
☐ Kenneth: Voice Chat Modal
  └─ /apps/web/components/voice-bot/VoiceWidget.tsx
  └─ Contains:
    ├─ Visualizer
    ├─ Transcript display
    ├─ Status indicator ("듣고 있습니다...")
    └─ Close button
```

**Component Code Example:**
```typescript
// /apps/web/components/voice-bot/FloatingButton.tsx
import React, { useState } from 'react';

export function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#001F3F] border-2 border-[#FFD700] shadow-lg hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
      >
        🎤
      </button>

      {/* Voice Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl p-6 border-l-4 border-[#0074D9]">
          <VoiceWidget onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
```

**Week 3 Deliverables:**
```
✅ Twilio SMS/WhatsApp working
✅ Twilio Voice API initialized
✅ ElevenLabs TTS/STT integrated
✅ Floating voice button visible on landing page
✅ Real-time audio streaming working (test with ngrok)
✅ Wave animation displaying spectrum
```

---

### Week 4: Integration & Testing (May 6-13)

#### **Day 22-24: End-to-end Workflow**

**Tasks:**
```
☐ Kenneth: Complete Customer Journey Test
  1. Customer visits landing page
  2. Clicks "무료 리포트 받기" CTA
  3. Fills form (name, phone, email)
  4. Submits → API POST /api/v1/customers
  5. ✅ Receives WhatsApp welcome message (Twilio)
  6. AI score calculated (starts at 45)
  
  ☐ High-engagement click: Opens floating voice button
  7. Browser requests Twilio token
  8. Voice widget connects to backend
  9. ElevenLabs generates greeting
  10. Customer hears: "안녕하세요, 홍길동님..."
  11. Customer responds: "세부 콘도 추천해줘"
  12. LangGraph + GPT-4 generates response
  13. ElevenLabs speaks response
  14. ✅ Customer happy, AI score → 75
  
  ☐ Booking trigger: AI detects booking intent
  15. Cal.com widget appears in voice chat
  16. Customer selects time: "2026-04-18 10:00 AM"
  17. ✅ Appointment created in Supabase
  18. Broker receives SMS + calendar invite
  
☐ Kenneth: Error Handling Testing
  └─ Network disconnection during call
  └─ Supabase connection timeout
  └─ ElevenLabs API rate limit
  └─ Invalid customer data
```

**Full Test Checklist:**
```
Landing Page:
☐ 페이지 로드 < 2초
☐ CTA 버튼 클릭 작동
☐ Form validation 작동

Customer Creation:
☐ API responds with 201 Created
☐ Supabase row created
☐ Twilio SMS sent within 10sec
☐ AI score calculated

Voice Bot:
☐ Microphone permission 요청
☐ Twilio token 획득
☐ Audio stream connected
☐ ElevenLabs response received
☐ Browser speaker output working

Appointment:
☐ Cal.com widget loaded
☐ Time selection works
☐ Supabase appointment row created
☐ Broker calendar updated
```

---

#### **Day 25-26: Performance & Security**

**Tasks:**
```
☐ Kenneth: Performance Optimization
  └─ Frontend:
    ├─ Code splitting (React.lazy for pages)
    ├─ Image optimization (next/image)
    ├─ CSS minification
    └─ Check Lighthouse scores
    
  └─ Backend:
    ├─ Database query optimization
    ├─ Connection pooling
    ├─ ElevenLabs cache for common phrases
    └─ Response time < 500ms target
    
☐ Kenneth: Security Audit
  └─ HTTPS only (no HTTP)
  └─ CORS properly configured
  └─ API rate limiting (prevent abuse)
  └─ Authentication for sensitive endpoints
  └─ Input validation on all forms
  └─ Environment variables never exposed
```

**Performance Benchmark:**
```
❌ Before: Lighthouse = 65/100
✅ After:  Lighthouse = 92/100

❌ Before: API response time = 2000ms
✅ After:  API response time = 350ms

❌ Before: First voice interaction = 8 seconds
✅ After:  First voice interaction = 2 seconds
```

---

#### **Day 27-28: Documentation & Handoff**

**Tasks:**
```
☐ Kenneth: README.md 작성
  └─ Project overview
  └─ Quick start guide
  └─ Architecture diagram
  └─ Contributing guidelines
  
☐ Kenneth: Deployment Preparation
  └─ Production environment setup
  └─ Staging environment setup
  └─ CI/CD pipeline (GitHub Actions)
  └─ Database backups configured
  
☐ Kenneth: Team Handoff Materials
  └─ API Documentation (Swagger/OpenAPI)
  └─ Database schema diagram
  └─ Video walkthrough of MVP
  └─ Known issues & future improvements
```

---

## 📊 MVP Success Metrics (Week 4 End)

```
✅ Uptime:         99.5% (acceptable for MVP)
✅ Response Time:  < 500ms
✅ Voice Latency:  < 2 seconds
✅ Lighthouse:     > 90/100
✅ Conversion:     15% (form submission)
✅ Customer NPS:   Collect first 5 responses

Customer Journey Completion:
☐ 1. Landing page visit ✅
☐ 2. Form submission ✅
☐ 3. Auto SMS received ✅
☐ 4. Voice bot interaction ✅
☐ 5. Appointment booked ✅
```

---

## 🎉 PHASE 1 COMPLETE: May 13

### MVP Ready for Beta Testing
- ✅ 50-100 landing page visitors/day
- ✅ 10-15 leads generated/week
- ✅ 3-5 appointments booked/week
- ✅ 1-2 contracts signed/week

### Next Phase (Phase 2: CRM Automation)
- Advanced AI Lead Scoring
- Multi-channel nurturing automation
- Post-sale management
- Referral program automation

---

## 📎 Supporting Documents

- [API Specification](./API_SPECIFICATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Voice Bot Guide](./VOICE_BOT_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Kenneth님, 이 계획대로 진행하면, 정확히 2026-05-13에 완벽한 MVP를 보유하게 됩니다. 🚀**

