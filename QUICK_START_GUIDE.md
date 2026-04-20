# Kenneth's Action Plan - 즉시 시작 가이드
## K-IREA Go-Live Checklist

**Date:** 2026-04-15 14:45:00  
**Status:** Ready to Launch  
**Required Time Commitment:** 4-6 weeks full-time development

---

## 🎯 오늘(04-15) 해야 할 일 (Critical Path)

### ✅ COMPLETED (지금까지 생성된 문서들)
- [x] Master Plan 작성 (통합 전략)
- [x] API Specification 작성 (기술 상세)
- [x] Execution Plan 작성 (주간 일정)
- [x] 프로젝트 폴더 구조 초기화
- [x] FastAPI main.py 기본 골격

### ⏰ TODAY (본인이 즉시 해야 할 일)

#### **오후 15:00-17:00 (2시간)** - 외부 서비스 승인 받기

```
1️⃣  Twilio Account 생성
   └─ https://www.twilio.com/console
   └─ Sign up (SMS 월 $0.0075/개)
   └─ Verify phone number (테스트용)
   └─ Account SID & Auth Token 복사 → 메모장에 저장
   예: 
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx9

2️⃣  ElevenLabs API Key 생성
   └─ https://elevenlabs.io/app/settings/api
   └─ Create new API key
   └─ Free tier = 최대 100만 characters/월 (테스트 충분)
   └─ API Key 복사 → 메모장에 저장
   예:
   ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

3️⃣  Supabase Project 생성
   └─ https://app.supabase.com
   └─ "New Project" 클릭
   └─ Project name: k-irea-production
   └─ Region: Singapore (Philippines에서 가장 빠름)
   └─ Password 설정
   └─ Create project (약 1분 소요)
   └─ Project URL & Keys 복사:
      ├─ SUPABASE_URL=https://xxxxxx.supabase.co
      ├─ SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
      └─ SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIs...

4️⃣  Cal.com Account 설정 (Optional for now)
   └─ https://cal.com/sign-up
   └─ Calendar integration은 Week 4에 진행
   └─ 지금은 가입만 해두면 됨
```

**Expected Output:**
```
✅ Twilio: SMS 테스트 성공
✅ ElevenLabs: 음성 샘플 생성 테스트
✅ Supabase: Database 연결 성공
✅ 모든 API keys 안전하게 저장됨 (.env 파일 준비)
```

---

#### **오후 17:00-19:00 (2시간)** - 로컬 개발 환경 설정

```
1️⃣  Node.js 및 Python 설치 확인
   └─ node --version (v18+ 필요)
   └─ python --version (3.10+ 필요)
   
2️⃣  Project Repository 초기화
   
   # Terminal/PowerShell에서 실행
   cd m:\yourhouse.ph
   git init
   git config user.name "Kenneth"
   git config user.email "kenneth@example.com"
   
   # GitHub (선택사항이지만 권장)
   # https://github.com/new → k-irea-platform repo 생성
   # git remote add origin https://github.com/YOUR_USERNAME/k-irea-platform.git
   
3️⃣  Dependencies 설치
   
   # Frontend 준비
   cd m:\yourhouse.ph\apps\web
   npm install (또는 pnpm install)
   
   # Backend 준비
   cd m:\yourhouse.ph\apps\api
   python -m venv venv
   venv\Scripts\activate  # Windows의 경우
   pip install requirements.txt (생성 필요)
   
4️⃣  Environment Files 생성
   
   /apps/api/.env
   ───────────────────────────────────
   ENVIRONMENT=development
   DEBUG=true
   
   # Supabase
   SUPABASE_URL=https://xxxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
   
   # Twilio
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx9
   TWILIO_PHONE_NUMBER=+1415xxxxxxx
   
   # ElevenLabs
   ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ───────────────────────────────────

5️⃣  Docker 시작 (Optional)
   
   docker-compose up -d
   # (Supabase + Redis 로컬 인스턴스 시작)
```

**Success Check:**
```
✅ npm install 완료 (node_modules 생성됨)
✅ pip install 완료 (venv에 패키지 설치됨)
✅ .env 파일 생성됨
✅ 환경 변수 로드 확인
```

---

#### **밤 20:00-21:00 (1시간)** - 첫 테스트 실행

```
Terminal 1: FastAPI Backend 시작
─────────────────────────────────
cd m:\yourhouse.ph\apps\api
venv\Scripts\activate
python main.py

Expected output:
  INFO:     Uvicorn running on http://127.0.0.1:8000
  INFO:     Application startup complete


Terminal 2: Next.js Frontend 시작
─────────────────────────────────
cd m:\yourhouse.ph\apps\web
npm run dev

Expected output:
  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000

✅ 브라우저에서 확인:
   http://localhost:3000 → 페이지 로드 (기본 Next.js 페이지 보임)
   http://localhost:8000/health → {"status": "ok"} JSON 응답


Browser Test
─────────────────────────────────
1. http://localhost:8000/api/health 방문
   → 모든 dependency 체크됨

2. http://localhost:3000 방문
   → Next.js 기본 페이지 표시됨
```

---

## 📅 내일부터(04-16) 시작할 일

### Week 1 (Apr 15-21): Foundation
- [ ] Git repository 커밋 구조 정리
- [ ] Supabase DB 마이그레이션 실행
- [ ] FastAPI 라우터 구조 완성
- [ ] Twilio SMS 테스트 (첫 메시지 전송)

### Week 2 (Apr 22-28): Landing Page
- [ ] Next.js 컴포넌트 개발 시작
- [ ] TrusTech 디자인 시스템 적용
- [ ] Hero + Problem + Services 섹션 완성

### Week 3 (Apr 29-May 5): Voice Bot
- [ ] Floating button 구현
- [ ] Twilio WebRTC 연동
- [ ] ElevenLabs 음성 통합

### Week 4 (May 6-13): Testing & Launch
- [ ] End-to-end 워크플로우 테스트
- [ ] 성능 최적화
- [ ] MVP 배포 준비

---

## 💾 생성된 파일 구조

```
m:\yourhouse.ph\
├── 📄 2026-04-15_MASTER_PLAN_K-IREA_Integrated_Solution.md ⭐
├── 📁 docs\
│   ├── 📄 API_SPECIFICATION.md ⭐
│   ├── 📄 EXECUTION_PLAN.md ⭐
│   ├── DATABASE_SCHEMA.md (다음 생성)
│   ├── VOICE_BOT_GUIDE.md (다음 생성)
│   └── DEPLOYMENT_GUIDE.md (다음 생성)
├── 📁 apps\
│   ├── web\ (Next.js - 아직 scaffold 필요)
│   │   ├── app\
│   │   ├── components\
│   │   └── public\
│   └── api\ (FastAPI - 시작됨)
│       ├── main.py ⭐ (방금 생성)
│       ├── app\
│       │   ├── agents\
│       │   ├── routes\
│       │   ├── integrations\
│       │   └── tasks\
│       ├── tests\
│       └── requirements.txt (다음 생성)
├── 📁 shared\
├── 📁 infrastructure\
└── 📁 scripts\
```

---

## 🚀 즉시 액션 (다음 60분)

**Kenneth님, 지금 바로:**

1. **📱 Twilio + ElevenLabs + Supabase 가입** (30분)
   - 3개 서비스 모두 무료 티어 사용 가능
   - API keys 저장

2. **🖥️ 로컬 환경 설정** (20분)
   - Frontend + Backend 디렉토리 준비
   - .env 파일 생성

3. **✅ 첫 테스트** (10분)
   - Backend health check 성공
   - Frontend 로딩 성공

**Result:**
✅ 개발 환경 완성 → Week 1 시작 준비 완료

---

## 📞 질문 시 확인 사항

만약 문제가 발생하면:

1. **API Key 오류**
   ```
   → 모든 .env 변수가 정확히 복사되었는지 확인
   → Spaces나 따옴표 오류 확인
   ```

2. **Connection Timeout**
   ```
   → Firewall이 localhost 포트 차단했는지 확인
   → VPN 끄고 테스트
   ```

3. **npm/pip 오류**
   ```
   → 최신 버전인지 확인 (npm --version, python --version)
   → 기존 node_modules, venv 삭제 후 재설치
   ```

---

## 📚 참고 매뉴얼

| 문서 | 내용 |
|------|------|
| **MASTER_PLAN.md** | 전체 프로젝트 전략 + 기술 스택 |
| **API_SPECIFICATION.md** | 모든 REST API 엔드포인트 정의 |
| **EXECUTION_PLAN.md** | 주 단위 개발 일정 및 체크리스트 |
| **DATABASE_SCHEMA.md** | SQL 마이그레이션 파일 (다음 생성) |
| **VOICE_BOT_GUIDE.md** | Twilio + ElevenLabs 통합 상세 (다음 생성) |

---

## 🎯 최종 목표

```
2026-05-13:  ✅ MVP Launch (완벽한 부동산 AI 플랫폼)
           ├─ Landing Page
           ├─ AI 수익률 리포트
           ├─ 음성 챗봇
           ├─ 자동 예약(Cal.com)
           └─ CRM 기본 기능

2026-06-30:  ✅ Phase 1 Complete (500 active users)
           ├─ Advanced CRM Automation
           ├─ Multi-channel nurturing
           ├─ Analytics Dashboard
           └─ Referral Program
```

---

**Kenneth님, 이제 시작하실 준비가 되셨나요? 🚀**

모든 문서가 준비되어 있습니다. 궁금한 점이 있으시면 언제든 말씀해주세요!

