# 수리기록(fixRecord) MVP — 옛 이름 FixAtlas·고장도감

로봇청소기·무선청소기의 **고장 증상, 실제 수리비, AS 경험**을 사용자가 제보·검색하고, 받은 견적이 같은 모델·증상 기준으로 정상 범위인지 확인하는 웹서비스.

> 기획 근거·시장/경쟁/수요 조사·로드맵: `docs/PLAN_REINFORCEMENT.md`, `docs/research/`
> 현재 단계(수집형 블로그) 운영 기획·글 템플릿·수집 폼: `docs/BLOG_PLAN.md`, `docs/blog/`

## 지금 되는 것 (2026-11 기준)

| 기능 | 상태 |
|---|---|
| 제품·증상 통합 검색 (한글 브랜드, "로보락 S8 충전 안 됨" 같은 복합 질의) | 구현 · 단위테스트 |
| 제품 상세: 증상별 수리비(중앙값·사분위, 표본 3/5/10건 기준 표시), 해결률, 자가점검(안전등급), 공식 기준가격 | 구현 |
| **내 견적 위치 확인** (같은 모델·증상·통화 분포에서의 백분위) | 구현 · 단위/API 테스트 |
| 수리비 제보 폼 (구매연도·에러코드·동의·영수증 검증, 로그인 지연형, 미등록 제품 직접 입력) | 구현 |
| 수리 vs 교체 계산기 (RFP 5.5 규칙, 입력 검증) | 구현 · 단위테스트 |
| 커뮤니티(질문/제보/해결후기/수리vs교체) + 댓글 + 도움됨(1인 1회) | 구현 |
| 관리자: KPI(RFP 18), 제보 검토(인증/반려/숨김/영수증 열람/제품 매핑), 게시글 관리, 시드 | 구현 |
| 익명 계측(쿠키·제3자 없음, DNT/GPC 존중) + 블로그 UTM 첫 유입 귀속·글별 집계 | 구현 · 실DB/e2e 테스트 |

미구현/후순위: 내 제품 수명카드, 공유 카드, 모델별 리포트(P1), 수리점 지도·구매 전 리포트(P2), 제품·증상 CRUD UI, 신고 버튼, 상세 페이지 SSR/프리렌더(SPA 한계는 계획서 참고), 제휴 링크 슬롯(의도적으로 비어 있음).

## 기술 스택

React 18 + TypeScript + Vite 6, Tailwind CSS 4, React Router 7, react-i18next(ko/en), Supabase(Postgres·Auth·Storage·Edge Function/Hono).

```
src/                      프런트엔드 (pages / components / lib)
supabase/functions/
  make-server-3e8c4785/   Edge Function 엔트리(Deno)
  _shared/                HTTP 앱·검색·통계·검증·DB 어댑터 (Node에서도 테스트 가능)
supabase/migrations/      스키마·RLS·보안 하드닝·KPI 함수
tests/                    단위(검색/통계/검증/API/계산기) + 실제 Postgres 통합 테스트
docs/                     기획 보강안, 조사(R1~R6), 블루프린트
```

## 시작하기

```bash
cp .env.example .env      # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 입력
npm ci
npm run dev
```

Supabase 준비(마이그레이션·Edge Function 배포·관리자 지정·시드)는 `SETUP.md`. 환경변수가 없으면 빈 화면 대신 설정 안내 화면이 뜬다.

## 테스트

```bash
npm test                  # 단위 + API 테스트 (의존성 없이 실행, 약 1초)
```

실제 PostgreSQL에서 마이그레이션·RLS·KPI 함수를 검증하는 통합 테스트(`tests/db/`)는 `embedded-postgres`와 `pg`가 설치된 디렉터리를 지정해 실행한다.

```bash
# 예: 별도 폴더에 npm i embedded-postgres pg 후
PG_NODE_MODULES=/path/to/that/folder node --test tests/db/security.test.mjs tests/db/catalog_events.test.mjs tests/db/contract.test.mjs
```

`tests/db/supabase_stub.sql`은 Supabase의 role·기본 권한을 모사한 것이며 실제 플랫폼과 100% 동일하지 않다. 스테이징 프로젝트에서 같은 시나리오를 한 번 더 확인할 것(계획서 5장).

## API (`/functions/v1/make-server-3e8c4785`)

공개: `GET /health` · `/search?q=` · `/products[?category=]` · `/products/:idOrSlug` · `/products/:idOrSlug/quote-check?symptom_id&currency&quote` · `/symptoms` · `/repair-reports?limit=` · `/community[?type=]` · `/community/:id` · `POST /events`(익명 계측)

로그인: `GET /user` · `POST /repair-reports` · `POST /community` · `POST /comments` · `POST /comments/:id/helpful`

운영진(admin/moderator): `GET /admin/data` · `/admin/metrics` · `PATCH /admin/posts/:id` · `PATCH /admin/reports/:id` · `GET /admin/reports/:id/receipt`(60초 서명 URL)
관리자 전용: `POST /admin/seed` · `POST /admin/products`

공개 응답에는 제보자 ID·영수증 경로·숨김 플래그가 **절대 포함되지 않는다**(테스트로 보장).

## 90일 성공 기준 (RFP 18)과 측정

관리자 화면의 KPI 패널이 제보 100건 · 인증 20건 · 방문자 5,000 · 계산기 1,000회 · 가입 300 · 게시글 100 · 댓글 300 · 7일 재방문율 10%를 `events`/DB에서 집계한다. 정의는 `supabase/migrations/20260517000200_*.sql` 주석 참고. 목표 수치 자체의 현실성은 `docs/PLAN_REINFORCEMENT.md` 3장에서 재검토했다.

## 운영 정책 고지

푸터와 각 화면에 RFP 16.1~16.3의 정보 제공·안전·후기 작성 고지가 표시된다. **정식 개인정보처리방침·이용약관(임시조치 절차 포함)은 공개 전 법무 검토 후 별도 게시**해야 한다(`docs/research/R5` 체크리스트).

## 라이선스

MVP 검증 목적. 자세한 UI 컴포넌트 출처는 `ATTRIBUTIONS.md`.
