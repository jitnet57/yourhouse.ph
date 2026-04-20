# K-IREA Admin Dashboard — 사용 가이드

> **K-IREA**: Korea-integrated Real Estate AI Admin  
> URL: `http://localhost:3001` (개발) / `https://admin.yourhouse.ph` (운영)

---

## 목차

1. [개요](#1-개요)
2. [시작하기](#2-시작하기)
3. [화면 구성](#3-화면-구성)
4. [메뉴별 기능 설명](#4-메뉴별-기능-설명)
   - [대시보드](#41-대시보드-dashboard)
   - [부동산 관리](#42-부동산-관리-properties)
   - [리드 관리](#43-리드-관리-leads)
   - [AI 에이전트](#44-ai-에이전트-agents)
   - [사용자 관리](#45-사용자-관리-users)
   - [보고서](#46-보고서-reports)
   - [설정](#47-설정-settings)
5. [부동산 입력 방법](#5-부동산-입력-방법)
6. [엑셀 일괄 등록](#6-엑셀-일괄-등록)
7. [다국어 지원](#7-다국어-지원)
8. [API 연동](#8-api-연동)
9. [자주 묻는 질문](#9-자주-묻는-질문)

---

## 1. 개요

K-IREA Admin Dashboard는 YourHouse.PH 플랫폼을 관리하는 백오피스 시스템입니다.

| 항목 | 내용 |
|------|------|
| 기술 스택 | Next.js 15, React 18, Tailwind CSS, Recharts |
| 포트 | `3001` (개발), `3000`은 웹앱 |
| 언어 | 영어 / 한국어 / 일본어 / 중국어 |
| 인증 | JWT Bearer Token (30분 만료) |
| 배포 | Cloudflare Pages |

---

## 2. 시작하기

### 개발 서버 실행

```bash
cd apps/admin
npm install
npm run dev
# → http://localhost:3001 접속
```

### 빌드 (운영 배포)

```bash
npm run build
# 성공 시 .next/ 폴더에 빌드 결과물 생성

# Cloudflare Pages 배포
wrangler pages deploy cloudflare-pages-dist
```

### 환경 변수 설정 (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

---

## 3. 화면 구성

```
┌─────────────────────────────────────────────────┐
│  사이드바 (좌)          │  메인 콘텐츠 (우)        │
│                        │  ┌─────────────────┐   │
│  🌟 K-IREA             │  │  Top Bar (헤더)  │   │
│  Real Estate Intel     │  │  검색 / 언어 선택 │   │
│                        │  └─────────────────┘   │
│  [대시보드]             │                        │
│  [부동산]               │  페이지 콘텐츠          │
│  [리드]                 │                        │
│  [에이전트]             │                        │
│  [사용자]               │                        │
│  [보고서]               │                        │
│  [설정]                 │                        │
│                        │                        │
│  [Admin User]           │                        │
│  [Collapse]             │                        │
└─────────────────────────────────────────────────┘
```

### 사이드바

- **펼치기/접기**: 하단 `Collapse` 버튼 클릭
- **펼침 상태**: 아이콘 + 메뉴명 표시 (너비 288px)
- **접힘 상태**: 아이콘만 표시 (너비 80px), hover 시 메뉴명 tooltip

### 상단 바 (Top Bar)

| 요소 | 설명 |
|------|------|
| 검색창 | 전체 플랫폼 검색 (현재 UI만 구현됨) |
| 언어 선택 | English / 한국어 / 日本語 / 中文 |
| 알림 벨 | 미읽은 알림 표시 (핑크 배지) |
| Secure 뱃지 | 로그인 상태 표시 (초록 점) |

---

## 4. 메뉴별 기능 설명

### 4.1 대시보드 (Dashboard)

**URL**: `/dashboard`

대시보드는 플랫폼 전체 현황을 한눈에 볼 수 있는 메인 화면입니다.

#### 구성 요소

**히어로 배너**
- 오늘의 신규 리드 수, 대기 중인 작업 수
- [View Report] 버튼 → 보고서 페이지 이동
- [+ New Property] 버튼 → 부동산 등록

**핵심 지표 카드 (5개)**

| 카드 | 설명 | 단위 |
|------|------|------|
| Active Listings | 현재 활성 매물 수 | 건 |
| Open Leads | 미처리 리드 수 | 명 |
| Conversion Rate | 리드 → 계약 전환율 | % |
| Monthly Revenue | 이번 달 수익 | ₱M |
| Avg Response | AI 에이전트 평균 응답 | 초 |

각 카드에는 **이전 기간 대비 트렌드** (▲ 상승 / ▼ 하락) 표시.

**차트 섹션**
- **Lead Pipeline**: 리드 유입 → 연락 → 관심 → 협상 → 계약 퍼널 차트
- **Conversion Trend**: 월별 전환율 추이 (Area 차트)

**최근 활동 피드**
- 최근 발생한 이벤트 (리드 생성, 매물 등록, 캠페인 발송 등)

**AI Insights 패널**
- 전환 가능성이 높은 리드 Top 3 자동 추천
- [Open AI Assistant] 버튼

---

### 4.2 부동산 관리 (Properties)

**URL**: `/properties`

매물 목록 조회, 신규 등록, 엑셀 일괄 등록을 관리합니다.

#### 매물 목록 테이블

| 컬럼 | 설명 |
|------|------|
| Property | 썸네일 + 제목 + 주소 |
| Details | 타입, 방 개수, 면적 |
| Price | 매물 가격 (₱) |
| Status | Active / Pending / Sold / For Rent |
| AI Score | AI 추천 점수 (0~100%) |
| Actions | 상세보기/수정/삭제 메뉴 |

#### 매물 상태 종류

| 상태 | 색상 | 의미 |
|------|------|------|
| Active | 초록 | 현재 거래 가능 |
| Pending | 노랑 | 검토 중 / 협상 중 |
| Sold | 회색 | 거래 완료 |
| For Rent | 파랑 | 임대 매물 |

> 자세한 등록 방법은 [5장](#5-부동산-입력-방법) 참조

---

### 4.3 리드 관리 (Leads)

**URL**: `/leads`

고객 문의(리드)를 추적하고 관리합니다.

#### 주요 기능
- 리드 목록 조회 (이름, 연락처, 관심 매물, 상태)
- 리드 → 에이전트 배정
- 리드 상태 변경 (New → Contacted → Interested → Closed)
- 리드에게 이메일 발송
- 대화 메시지 기록 조회

#### 리드 상태 흐름

```
New → Contacted → Interested → Negotiating → Closed (Win)
                                           ↘ Lost
```

---

### 4.4 AI 에이전트 (Agents)

**URL**: `/agents`

AI 챗봇 에이전트를 생성하고 모니터링합니다.

#### 주요 기능
- 에이전트 목록 및 실시간 지표 (활성 수, 응답 시간, 정확도)
- 에이전트 ON/OFF 토글
- 에이전트 테스트 실행
- 새 에이전트 생성 (이름, 타입, 언어 설정)

#### 에이전트 지표

| 지표 | 설명 |
|------|------|
| Active Agents | 현재 활성화된 에이전트 수 |
| Avg Response Time | 평균 응답 시간 (ms) |
| Avg Accuracy | 답변 정확도 (%) |
| Today Calls | 오늘 처리한 대화 수 |

---

### 4.5 사용자 관리 (Users)

**URL**: `/users`

플랫폼 사용자 계정을 관리합니다.

#### 주요 기능
- 사용자 목록 (이름, 이메일, 역할, 가입일)
- 사용자 추가 / 수정 / 삭제
- 역할 변경 (Admin / Agent / Viewer)
- 사용자별 권한 설정
- 이용 통계 조회

#### 역할별 권한

| 역할 | 매물 관리 | 리드 관리 | 에이전트 제어 | 사용자 관리 | 보고서 |
|------|-----------|-----------|---------------|-------------|--------|
| Admin | ✅ 전체 | ✅ 전체 | ✅ | ✅ | ✅ |
| Agent | ✅ 자신의 것 | ✅ 배정된 것 | ❌ | ❌ | ✅ 읽기 |
| Viewer | ✅ 읽기 | ✅ 읽기 | ❌ | ❌ | ✅ 읽기 |

---

### 4.6 보고서 (Reports)

**URL**: `/reports`

플랫폼 데이터를 분석하고 보고서를 생성합니다.

#### 보고서 종류

| 보고서 | 설명 |
|--------|------|
| Sales Report | 매출 / 거래 현황 |
| Lead Report | 리드 유입 및 전환 현황 |
| Agent Performance | 에이전트별 성과 |
| Property Analytics | 매물별 조회수/관심도 |

#### 기능
- 기간 필터 (일/주/월/분기/연도)
- 차트 (막대/선/도넛)
- Excel / PDF 내보내기
- 보고서 자동 발송 스케줄 설정

---

### 4.7 설정 (Settings)

**URL**: `/settings`

시스템 환경 설정을 관리합니다.

#### 설정 항목

| 섹션 | 내용 |
|------|------|
| General | 사이트명, 기본 언어, 시간대 |
| Integrations | Twilio (SMS), ElevenLabs (음성), CRM 연동 |
| Notifications | 이메일/SMS 알림 규칙 |
| Security | 비밀번호 정책, 2FA, 세션 만료 |
| API Keys | 외부 서비스 API 키 관리 |

---

## 5. 부동산 입력 방법

`Properties` 메뉴 → 우상단 **[Add Property]** 버튼 클릭

### 입력 항목

| 필드 | 필수 | 설명 |
|------|------|------|
| Property Photos | 권장 | 드래그&드롭 또는 클릭으로 업로드. 첫 번째 사진이 커버 이미지. JPG/PNG/WEBP |
| Title | ✅ | 매물 제목 (예: 3BR Luxury Condo in BGC) |
| Address | ✅ | 전체 주소 (Street, City, Province) |
| Price (₱) | ✅ | 숫자만 입력 (쉼표 불필요) |
| Property Type | - | Condo / House & Lot / Townhouse / Commercial / Land / Apartment |
| Bedrooms | - | 방 개수 |
| Bathrooms | - | 화장실 수 |
| Area (sqm) | - | 전용 면적 (평방미터) |
| Status | - | Active / Pending / Sold / For Rent |
| Description | - | 매물 설명, 주변 편의시설 등 |

### 사진 업로드

1. 드래그&드롭 영역에 사진 파일을 끌어다 놓거나 클릭하여 선택
2. 여러 장 동시 업로드 가능
3. 첫 번째 사진 = **커버 이미지** (목록에서 썸네일로 표시)
4. 각 사진 위에 마우스 올리면 ❌ 버튼으로 개별 삭제 가능
5. 우하단 `+` 버튼으로 사진 추가 가능

---

## 6. 엑셀 일괄 등록

여러 매물을 한 번에 등록할 때 사용합니다.

`Properties` 메뉴 → **[Excel Import]** 버튼 클릭

### 1단계: 템플릿 다운로드

모달 내 **[Download .xlsx]** 버튼을 클릭하면 `properties_template.xlsx` 파일이 다운로드됩니다.

### 2단계: 엑셀 작성

| 컬럼 | 필수 | 예시 |
|------|------|------|
| title | ✅ | Luxury Condo in BGC |
| address | ✅ | Fort Bonifacio, Taguig |
| price | ✅ | 5500000 (쉼표 없이 숫자만) |
| type | - | Condo |
| status | - | active |
| bedrooms | - | 3 |
| bathrooms | - | 2 |
| area | - | 120 |
| description | - | Prime location near BGC |

> **주의**: 첫 번째 행은 반드시 헤더(컬럼명)여야 합니다. 두 번째 행부터 데이터를 입력하세요.

### 3단계: 파일 업로드

- 완성된 파일을 드래그&드롭 영역에 끌어다 놓거나 클릭하여 선택
- 지원 형식: `.xlsx`, `.xls`, `.csv`

### 4단계: 미리보기 확인

업로드 후 자동으로 데이터 파싱이 되고, 미리보기 테이블이 표시됩니다.
- 오류가 있는 경우 붉은 색으로 오류 메시지 표시
- 정상 데이터만 카운트되어 "N rows ready to import" 표시

### 5단계: 가져오기

**[Import N Properties]** 버튼 클릭 → 목록에 즉시 추가됩니다.

### 주의사항
- 이미지는 엑셀로 일괄 등록 불가 → 등록 후 개별적으로 추가
- `status` 컬럼값: `active`, `pending`, `sold`, `for_rent` 중 하나
- `type` 컬럼값: `Condo`, `House & Lot`, `Townhouse`, `Commercial`, `Land`, `Apartment` 중 하나
- 가격은 필리핀 페소(₱) 기준 정수값

---

## 7. 다국어 지원

상단 바 언어 선택 드롭다운에서 변경 가능합니다.

| 코드 | 언어 |
|------|------|
| en | English |
| ko | 한국어 |
| ja | 日本語 |
| zh | 中文 |

> 현재 사이드바, 헤더 영역 번역 지원. 각 페이지 콘텐츠 번역은 추후 확장 예정.

---

## 8. API 연동

Admin Dashboard는 `apps/api` (FastAPI) 서버와 통신합니다.

### API 서버 실행

```bash
cd apps/api
python main_updated.py
# → http://localhost:8000
```

### API 엔드포인트 문서

브라우저에서 `http://localhost:8000/docs` 접속 시 Swagger UI 제공

### 인증 방식

```
POST /api/auth/login
Body: { "email": "admin@test.com", "password": "password123" }

Response:
{
  "access_token": "eyJ...",   // 30분 만료
  "refresh_token": "eyJ...", // 7일 만료
  "token_type": "bearer"
}
```

이후 모든 API 요청 헤더에 포함:
```
Authorization: Bearer <access_token>
```

### 주요 API 그룹

| 그룹 | 경로 | 설명 |
|------|------|------|
| 인증 | `/api/auth/*` | 로그인, 회원가입, 토큰 갱신 |
| 부동산 | `/api/properties/*` | CRUD, 검색, 통계 |
| 리드 | `/api/leads/*` | CRUD, 배정, 상태 변경 |
| 에이전트 | `/api/agents/*` | CRUD, 토글, 지표 |
| 사용자 | `/api/users/*` | CRUD, 역할, 권한 |
| 보고서 | `/api/reports/*` | 생성, 내보내기, 스케줄 |

---

## 9. 자주 묻는 질문

**Q. Admin 사이트가 안 열려요 (404 에러)**  
→ `cd apps/admin && npm run dev` 실행 후 `http://localhost:3001` 접속

**Q. "Hydration mismatch" 에러가 브라우저 콘솔에 표시돼요**  
→ Grammarly, Endic 등 브라우저 확장 프로그램이 DOM을 수정하기 때문입니다. 시크릿 창에서 접속하면 에러가 없습니다. 운영 환경에서는 발생하지 않습니다.

**Q. 스타일이 전혀 적용되지 않아요 (민낯 HTML)**  
→ `postcss.config.js`와 `app/globals.css`가 있어야 합니다. 두 파일 모두 존재하는지 확인하세요.

**Q. 엑셀 업로드 후 사진은 어떻게 추가하나요?**  
→ 엑셀로 가져온 매물을 테이블에서 클릭 → 수정 모달에서 사진 추가 (향후 구현 예정)

**Q. AI Score는 어떻게 계산되나요?**  
→ 조회수, 리드 반응률, 가격 대비 시장 평균 등을 AI가 종합 분석하여 0~100점으로 표시합니다. (현재는 mock 데이터)

**Q. 운영 배포는 어떻게 하나요?**  
```bash
cd apps/admin
npm run build
wrangler pages deploy cloudflare-pages-dist
```

---

## 파일 구조

```
apps/admin/
├── app/
│   ├── layout.tsx          # 공통 레이아웃 (사이드바 + 헤더)
│   ├── globals.css         # Tailwind 기본 + 커스텀 스타일
│   ├── page.tsx            # 루트 → /dashboard 리다이렉트
│   ├── dashboard/
│   │   └── page.tsx        # 대시보드 메인
│   ├── properties/
│   │   └── page.tsx        # 매물 목록 + 등록 + 엑셀 임포트
│   ├── leads/
│   │   └── page.tsx        # 리드 관리
│   ├── agents/
│   │   └── page.tsx        # AI 에이전트 관리
│   ├── users/
│   │   └── page.tsx        # 사용자 관리
│   ├── reports/
│   │   └── page.tsx        # 보고서
│   └── settings/
│       └── page.tsx        # 설정
├── components/
│   └── dashboard/
│       ├── MetricCard.tsx  # 지표 카드 컴포넌트
│       └── ChartWidget.tsx # 차트 컴포넌트
├── lib/
│   └── api.ts              # API 클라이언트 (axios)
├── tailwind.config.ts      # Tailwind 디자인 시스템
├── postcss.config.js       # PostCSS (Tailwind 처리)
├── next.config.js          # Next.js 설정
└── package.json
```

---

*최종 업데이트: 2026-04-21 | 작성: Claude Code*
