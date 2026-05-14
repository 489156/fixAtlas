# FixAtlas / 고장도감 MVP

제품 고장, 수리비, AS 후기, 자가점검, 수리/교체 판단 정보를 사용자가 제보·검색·공유하는 커뮤니티형 웹서비스

## 프로젝트 개요

**FixAtlas / 고장도감**은 소비자가 제품 구매 후 고장 상황에서 필요한 정보를 찾기 쉽게 하는 플랫폼입니다.

### 핵심 기능 (P0 - MVP)

1. **홈 화면** - 제품/증상 통합 검색, 최근 수리비 제보, 인기 고장 증상
2. **검색** - 제품명, 브랜드, 모델명, 증상으로 검색
3. **제품 상세** - 제품별 고장 증상, 수리비 범위, 해결률, 최근 제보
4. **수리비 제보** - 수리비, AS 경험 제보 폼
5. **Repair vs Replace 계산기** - 수리/교체 판단 보조 도구
6. **커뮤니티** - 질문, 수리비 제보, 해결후기, 수리 vs 교체 고민 게시판
7. **관리자 대시보드** - 제품, 증상, 제보, 게시글 관리

### 초기 제품 카테고리

- 로봇청소기
- 무선청소기

### 브랜드

**로봇청소기**: Roborock, Dreame, Ecovacs, iRobot, Samsung, LG  
**무선청소기**: Dyson, Samsung, LG, Dreame

## 기술 스택

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Backend**: Supabase (Edge Functions with Hono)
- **Database**: Supabase Postgres (`profiles`, `products`, `symptoms`, `repair_reports`, `community_posts`, `comments`, `self_check_cards`)
- **Auth**: Supabase Auth (magic link / email OTP + optional password sign-in + Google OAuth on `/auth`)
- **Icons**: Lucide React

## 시작하기

### 1. Supabase 연결

`.env`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를 넣고, DB 마이그레이션과 Edge Function 배포는 `SETUP.md`를 따르세요.

### 2. 초기 데이터 생성

1. `/auth`에서 매직 링크 또는 Google로 로그인합니다.
2. Supabase SQL 또는 Table Editor에서 `public.profiles`의 해당 사용자 `role`을 `admin`으로 올립니다 (`SETUP.md` 참고).
3. `/admin`에서 **초기 데이터 생성**을 실행합니다.

이렇게 하면 다음 데이터가 생성됩니다:
- 10가지 증상 (충전 안 됨, 흡입력 약함, 배터리 빨리 닳음 등)
- 12개 제품 (로봇청소기 7개, 무선청소기 5개)

### 3. 주요 페이지

- `/` - 홈 (검색, 최근 제보, 인기 증상)
- `/search?q=검색어` - 검색 결과
- `/products/:category/:id` - 제품 상세
- `/submit-repair` - 수리비 제보
- `/calculator` - 수리 vs 교체 계산기
- `/community` - 커뮤니티 게시판
- `/community/new` - 게시글 작성
- `/auth` - 로그인/회원가입
- `/admin` - 관리자 대시보드

## 사용자 플로우

### 검색 사용자

1. 홈에서 제품명/증상 검색
2. 검색 결과에서 제품 선택
3. 제품 상세 페이지에서 수리비 범위, 해결률 확인
4. 필요시 계산기로 수리/교체 판단
5. 수리비 제보 (로그인 필요)

### 제보 사용자

1. 수리비 제보 페이지 방문
2. 제품, 증상, 수리비, 경로 입력
3. 후기 작성 (선택)
4. 제보 제출 (로그인 필요)

### 커뮤니티 사용자

1. 커뮤니티 게시판 방문
2. 질문/후기 작성 (로그인 필요)
3. 댓글로 정보 공유

## 백엔드 API 구조

모든 API는 `/functions/v1/make-server-3e8c4785` 경로를 사용합니다.

### 공개 엔드포인트

- `GET /health` - 헬스체크
- `GET /search?q=검색어` - 제품/증상 검색
- `GET /products` - 전체 제품 목록
- `GET /products/:id` - 제품 상세 (응답에 `self_check_cards` 포함)
- `GET /symptoms` - 전체 증상 목록
- `GET /repair-reports` - 수리비 제보 목록
- `GET /community` - 커뮤니티 게시글 목록
- `GET /community/:id` - 게시글 상세

### 인증 필요 엔드포인트

- `GET /user` - 사용자 프로필 (`profiles` 행)
- `POST /repair-reports` - 수리비 제보 생성
- `POST /community` - 게시글 생성
- `POST /comments` - 댓글 생성
- `POST /comments/:id/helpful` - 댓글 “도움됨” 카운트 증가

### 관리자 전용 엔드포인트

- `GET /admin/data` - 전체 데이터 조회
- `POST /admin/seed` - 초기 데이터 생성
- `PATCH /admin/posts/:id` - 게시글 `hidden` / `verified` 플래그 (JSON body)

## 데이터 모델

### User
- id, email, nickname, country, role, created_at

### Product
- id, category, brand, model_name, alternate_names, release_year, description

### Symptom
- id, code, name_ko, name_en, name_zh, risk_level, self_check_allowed

### RepairReport
- id, user_id, product_id, symptom_id, country, city, repair_channel
- quoted_price, paid_price, currency, repair_item
- resolved_status, review_text, verified_status, created_at

### CommunityPost
- id, user_id, type, product_id, symptom_id
- title, body, status, images, tags, created_at

### Comment
- id, post_id, user_id, body, helpful_count, created_at

## 환경 변수

Supabase 연결 시 자동으로 설정됩니다:
- `SUPABASE_URL` - Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY` - Supabase Anon 키
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role 키

## MVP 성공 기준 (90일)

- 월 방문자: 5,000명 이상
- 수리비 제보: 100건 이상 ⭐ **가장 중요**
- 인증 제보: 20건 이상
- 계산기 사용: 1,000회 이상
- 회원가입: 300명 이상
- 커뮤니티 게시글: 100개 이상
- 댓글: 300개 이상
- 7일 재방문율: 10% 이상

## 향후 확장 계획

### P1 기능
- 내 제품 수명카드
- 공유 카드 생성
- 모델별 고장 리포트

### P2 기능
- 수리점·AS센터 후기 지도
- 구매 전 내구성 리포트

### 추가 제품 카테고리
- 세탁기, 건조기, 냉장고, 에어컨
- 노트북, 태블릿, 스마트폰
- 전기자전거, 전동킥보드

## 중요 안내

⚠️ **Make는 프로토타입 및 MVP 검증 목적입니다**

- 개인정보 수집 최소화
- 영수증 이미지 업로드 시 개인정보 가림 안내 필수
- 프로덕션 환경에서는 별도의 보안 검토 필요

## 운영 정책

### 정보 제공 고지
고장도감/FixAtlas의 정보는 사용자 제보와 공개자료를 기반으로 한 참고 정보입니다. 실제 수리비, 보증 적용 여부, 부품 수급, 안전성은 제품 상태, 지역, 수리업체, 제조사 정책에 따라 달라질 수 있습니다.

### 안전 고지
고전압, 배터리, 냉매, 가스, 방수 구조와 관련된 작업은 안전사고 위험이 있으므로 전문가 또는 공식 서비스센터를 이용하십시오.

### 후기 작성 고지
AS 후기와 수리점 후기는 사실에 기반해 작성해야 하며, 욕설, 허위사실, 개인정보 노출, 비방 목적의 게시물은 제한될 수 있습니다.

## 라이선스

이 프로젝트는 MVP 검증 목적으로 작성되었습니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
