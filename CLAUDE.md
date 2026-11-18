# FixAtlas(고장도감) — 작업 안내

가전·가구 수리비를 사용자 제보와 공식 자료로 비교하는 서비스다. React/Vite 사이트(`src/`)와 Supabase Edge Function(`supabase/`), 네이버 블로그 원고(`docs/blog/`)가 있다. 기획 문서는 `docs/BLOG_PLAN.md`와 `docs/PLAN_REINFORCEMENT.md`, 조사 자료는 `docs/research/`에 있다.

## 블로그 글 상시 규칙 (운영자 지시, 2026-11-18)

**매번 발행 전에 그 글의 수요자를 예상해 한 문장으로 정의한다. 이 체계를 계속 유지한다.**

1. **수요자 문장이 먼저다.** 원고 front matter의 `demand:`에 "[누가] [어떤 상황에서] [무엇을 판단하려고] ['실제 검색어'를] 검색할 때 이 글을 읽습니다."를 쓴다. 이 문장을 쓸 수 없으면 글을 쓰지 않는다. 함께 `reader`·`need`·`urgency`·`scale`·`queries`를 채운다(틀: `docs/blog/naver/_TEMPLATE.md`). 비어 있거나 문장이 아니면 `check-claims`가 실패 처리하고 `naver-export`가 발행본을 만들지 않는다.
2. **공급이 아니라 수요에서 시작한다.** 실제 검색 질의(구글 자동완성, 네이버 키워드 도구)를 먼저 모으고, 질의마다 질문형 소제목으로 답한다. 규모는 공개 지표(공식 문서 조회수, 리뷰 수)로 보인다. 근거와 대응표는 `docs/blog/DEMAND_GEO.md`.
3. **한 글은 한 품목, 한 독자만 다룬다.** 제목은 질문+숫자 답 또는 서술 문장으로 쓴다(명사 나열 금지).
4. **문체는 격식체(합니다체)로 쓴다.** 한 줄에 1~2문장만 쓰고 작업 보고 문장("열어 대조했고 캡처해 붙였어요")은 쓰지 않는다. 확인 날짜는 출처 줄과 캡처 설명에 쓴다. 광고·제휴 표기는 인용구 한 줄이다.
5. **숫자와 정책 문장은 원문으로 확인한다.** 원고 `claims:`에 값·출처·확인일·원문 인용 문구를 적고, 발행 전날 `verify-sources`로 실제 페이지와 대조한다. 편집자가 직접 한 확인(문의·촬영)이 글마다 1건 이상 있어야 한다.
6. **네이버 블로그에 자동화 도구로 올리지 않는다.** 약관과 운영정책이 금지한다. 사람이 스마트에디터에서 예약발행한다.

## 사람 몫과 AI 몫 (운영자 지시, 2026-11-18)

**"사람만 할 수 있는 일"은 사람의 판단이 필요한 일만 가리킨다.** 사람이 컴퓨터 앞에서 해야 하는 작업이라는 뜻이 아니다. 그런 작업은 AI가 한다.

| 구분 | 무엇 | 예 | 원고 표기 |
|---|---|---|---|
| [판단] | 사람만 정할 수 있는 결정: 신원 공개, 돈, 위험 감수, 발행 승인, 제휴 참여 | 바이라인, 제휴 가입 여부, 도메인 | `[[판단: …]]` |
| [현장] | 판단은 아니지만 사람 본인이나 실물이 있어야 하는 행위 | 고객센터 통화, 제품 사진, 계정 키 발급 | `[[현장: …]]` |
| [AI] | 나머지 전부: 도구 실행, 원문·캡처·이미지 판독, 대조, 조사, 글쓰기·고치기, 결과 기록 | 이미지 속 숫자 확인, 확인일 갱신, 문체 판단, 경고 처리 | 칸으로 남기지 않는다 |

- 사람 칸에는 행위나 결정만 적는다. 결과를 받아 본문·`firsthand`·출처 줄로 옮기는 일은 AI가 한다. `check-claims`는 사람 칸에 컴퓨터 작업(원문·캡처·대조·검색·글쓰기)이 들어 있으면 `ai_task_in_slot`으로 실패 처리한다.
- 접근이 막힌 컴퓨터 작업(로그인·robots 차단 등)도 [AI] 몫이다. 사람에게 넘길 것은 "접근을 허용할지"라는 [판단]이나 키 발급 같은 [현장]뿐이다.
- 할 일 목록과 보고에는 항상 담당 표시([AI]·[판단]·[현장])를 붙인다(`npm run blog:status`).

상세: `docs/blog/EDITORIAL_STANDARDS.md`(§4~§11), 사용자 검수 교훈 `docs/blog/LESSONS.md`, 발행 절차 `docs/blog/naver/README.md`.

## 발행 전 점검 명령

```bash
npm run blog:demand   # 실제 검색어 수집·본문 공백 분석·태그 후보 (scripts/demand-research.mjs)
```
```bash
npm run blog:check    # 원고 점검. WARN은 발행을 막지 않음, --strict면 실패 (scripts/check-claims.mjs)
```
```bash
npm run blog:verify   # 원문 대조·캡처 QA·확인일 자동 갱신·누락 출처 제안 (scripts/verify-sources.mjs --write --suggest)
```
```bash
npm run blog:status   # 발행 현황판 docs/blog/STATUS.md, D-2 미준비 시 exit 1 (scripts/blog-status.mjs)
```
```bash
SITE_URL=https://실제도메인 node scripts/naver-export.mjs docs/blog/naver/<글>.md
```

## 테스트

- 단위·API: `npm test` (Node 22는 `node --test`에 디렉터리 인자를 넣으면 실패하므로 package.json의 glob 형태를 쓴다)
- e2e: `npm run build:e2e && node tests/e2e/e2e.mjs`
- 실제 Postgres 테스트는 embedded-postgres가 필요하다(`PG_NODE_MODULES` 환경 변수).
