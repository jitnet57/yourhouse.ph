# K-IREA 배포 작업 히스토리 (학습용)

> **목적:** Claude와의 대화를 통해 진행된 배포 설계/구현 과정을 기록합니다.  
> **날짜:** 2026-04-21  
> **대상:** Cloudflare 풀스택 배포 (admin + web + API)

---

## 📚 1. 초기 질문과 학습 포인트

### 질문: "admin site and frontend site for deploy?"

**배운 점:**
- 어드민과 프론트엔드를 **별도 배포(Two Deployment)**로 분리하는 것이 표준 패턴
- 이유: 독립적 배포 주기, 보안 경계 분리, 번들 크기 최소화

---

## 🏗️ 2. 실제 프로젝트 구조 파악

### 처음 가정 vs 실제

| 항목 | 처음 가정 | 실제 |
|---|---|---|
| 프레임워크 | React + Vite | **Next.js 15** |
| 레포 구조 | 별도 레포 2개 | **모노레포** (`apps/admin`, `apps/web`, `apps/api`) |
| API | Cloudflare Worker | **Python FastAPI** |
| 인증 | NextAuth 구현됨 | **미구현** (package.json에만 있음) |
| Admin 배포 설정 | 없음 | **이미 `output: 'export'` 설정됨** |

**교훈:** 코드 파악 없이 스캐폴딩부터 하면 기존 작업을 덮어쓸 위험이 있다.

---

## 🔍 3. 핵심 확인 사항 (검증 과정)

### 확인 1: NextAuth가 실제로 쓰이는가?

```bash
# 검색 결과: 0 files
grep -r "next-auth|NextAuth|useSession" apps/admin --include="*.ts" --include="*.tsx"
```

**결론:** `package.json`에 의존성만 있고 코드에서 미사용 → **제거 가능**

### 확인 2: Admin의 Next.js 배포 방식

```js
// apps/admin/next.config.js
output: 'export',         // 정적 HTML/JS 생성
distDir: 'cloudflare-pages-dist'  // 배포 폴더
```

**결론:** 이미 정적 export 설정 완료 → `@cloudflare/next-on-pages` 불필요

### 확인 3: Dockerfile 오류

```dockerfile
# 기존 (잘못됨)
COPY requirements.txt .           # 최소 패키지만
CMD ["uvicorn", "main:app", ...]  # main.py (구버전)

# 수정됨
COPY requirements_admin.txt .     # 전체 패키지
CMD ["uvicorn", "main_updated:app", ...]  # main_updated.py (최신)
```

---

## 🎯 4. 최종 결정된 아키텍처

```
브라우저
  │
  ├─→ yourhouse.ph                  (Cloudflare Pages)    [공개]
  ├─→ admin.yourhouse.ph            (Cloudflare Pages)    [CF Access 보호]
  └─→ api.yourhouse.ph              (Google Cloud Run)    [CF Access JWT 검증]
             │
             └─→ Supabase PostgreSQL (DB)
```

### 인증 흐름 (CF Access)

```
사용자 브라우저
  │
  ├─[1] admin.yourhouse.ph 접속 시도
  ├─[2] Cloudflare Access가 로그인 요청
  ├─[3] 이메일/Google 로그인 완료
  ├─[4] CF Access가 JWT 발급 → 쿠키/헤더에 첨부
  ├─[5] Next.js 정적 앱 로드
  └─[6] API 호출 시 JWT 자동 전달 → FastAPI가 검증
```

---

## 🛠️ 5. 실제 변경된 파일 목록

| 파일 | 변경 내용 |
|---|---|
| `apps/api/Dockerfile` | `requirements.txt` → `requirements_admin.txt`, `main` → `main_updated`, `--reload` 제거 |
| `apps/api/main_updated.py` | CORS에 프로덕션 도메인 추가, TrustedHost에 `*.run.app` 추가 |
| `apps/api/app/middleware/cf_access.py` | **신규** — CF Access JWT 검증 FastAPI dependency |
| `apps/api/app/middleware/__init__.py` | **신규** — Python 패키지 초기화 |
| `apps/api/.env.example` | DATABASE_URL, SECRET_KEY, CF_ACCESS 변수 추가 |
| `apps/admin/wrangler.toml` | **신규** — admin용 Pages 배포 설정 |
| `apps/admin/package.json` | `next-auth` 제거 (미사용) |
| `apps/admin/.env.local.example` | **신규** — admin 환경변수 템플릿 |

---

## 📋 6. 배포 절차 (단계별)

### Phase 1: Supabase DB 설정 (수동)

1. [supabase.com](https://supabase.com) → New project 생성
2. Project name: `yourhouse-ph`
3. Region: **Southeast Asia (Singapore)** 선택 (필리핀 서버와 가장 가까움)
4. 생성 후: Settings → Database → Connection string (URI) 복사
5. `apps/api/.env` 파일에 `DATABASE_URL` 설정

### Phase 2: Cloud Run API 배포 (수동)

```bash
# 1. Google Cloud 프로젝트 생성 후
gcloud auth login
gcloud config set project yourhouse-ph

# 2. Container Registry에 빌드 & 푸시
cd apps/api
gcloud builds submit --tag gcr.io/yourhouse-ph/k-irea-api

# 3. Cloud Run 배포
gcloud run deploy k-irea-api \
  --image gcr.io/yourhouse-ph/k-irea-api \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="...",CF_ACCESS_TEAM_DOMAIN="...",SECRET_KEY="..."
```

4. 배포 후 URL 확인: `https://k-irea-api-xxxx-as.a.run.app`
5. Cloudflare DNS: `api.yourhouse.ph` → CNAME → Cloud Run URL

### Phase 3: Admin Cloudflare Pages 배포 (수동)

```bash
# 1. 빌드
cd apps/admin
npm install
npm run build
# cloudflare-pages-dist/ 폴더 생성됨

# 2. 배포 (wrangler login 필요)
wrangler login   # 브라우저 인증
cd e:/yourhouse.ph
wrangler pages deploy apps/admin/cloudflare-pages-dist --project-name=yourhouse-admin
```

3. Cloudflare Dashboard → Pages → yourhouse-admin → Custom domain → `admin.yourhouse.ph`

### Phase 4: Cloudflare Access 설정 (수동)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Zero Trust → Access → Applications
2. Add application → Self-hosted
3. 설정:
   - Name: `YourHouse Admin`
   - Application domain: `admin.yourhouse.ph`
   - Session duration: `24 hours`
4. Policy:
   - Action: `Allow`
   - Include: `Emails` → 관리자 이메일 입력
5. 생성 후 **AUD Tag** 복사 → `apps/api/.env`의 `CF_ACCESS_AUD`에 입력

---

## 🔐 7. CF Access JWT 검증 코드 설명

```python
# apps/api/app/middleware/cf_access.py

def verify_cf_access(
    cf_access_jwt_assertion: str | None = Header(alias="CF-Access-Jwt-Assertion")
) -> dict:
    """
    FastAPI dependency로 사용.
    - 로컬 개발: CF_ACCESS_TEAM_DOMAIN이 없으면 mock 사용자 반환
    - 프로덕션: CF Access JWT 검증 → claims(이메일 등) 반환
    """
```

**사용법 (보호가 필요한 라우트):**
```python
from app.middleware.cf_access import verify_cf_access
from fastapi import Depends

@router.get("/properties")
async def get_properties(user=Depends(verify_cf_access)):
    user_email = user["email"]  # 로그인한 사람 이메일
    ...
```

---

## 💰 8. 예상 비용

| 서비스 | 용도 | 비용 |
|---|---|---|
| Cloudflare Pages (×2) | web + admin 호스팅 | **$0** |
| Cloudflare Access (50명까지) | admin 인증 | **$0** |
| Google Cloud Run | FastAPI API | **$0~3/월** (scale-to-zero) |
| Supabase | PostgreSQL DB | **$0** (free tier 500MB) |
| **합계** | | **$0~3/월** |

---

## ⚠️ 9. 주요 결정 이유 기록

### Q: Fly.io 사용 안 한 이유?
→ **2024년에 무료 tier 삭제됨** (pay-as-you-go로 변경). 처음엔 추천했다가 수정함.

### Q: NextAuth 사용 안 한 이유?
→ 코드에 실제 구현 없음. CF Access가 인증을 대신하므로 추가 구현 불필요.

### Q: `@cloudflare/next-on-pages` 사용 안 한 이유?
→ admin이 이미 `output: 'export'`로 설정됨. 정적 HTML로 충분.
→ SSR이 필요한 경우에만 어댑터를 사용해야 함.

### Q: Python FastAPI를 Cloudflare Workers로 변환 안 한 이유?
→ Python은 Cloudflare Workers에서 실행 불가 (Node.js/WASM만 지원).
→ 기존 코드 구조 변경 없이 Docker로 Cloud Run에 배포하는 것이 최선.

---

## 📝 10. 다음 작업 (TODO)

- [ ] Supabase 프로젝트 생성 및 DB 스키마 설정
- [ ] Cloud Run 배포 (`gcloud` CLI 설치 필요)
- [ ] `apps/admin`에서 `npm run build` 테스트
- [ ] `wrangler login` 후 admin Pages 배포
- [ ] Cloudflare Access application 생성
- [ ] FastAPI 라우트에 `verify_cf_access` dependency 추가
- [ ] DB 연결 코드 완성 (현재 모든 라우트가 TODO stub)

---

*이 문서는 학습 및 작업 추적 목적으로 작성되었습니다.*
