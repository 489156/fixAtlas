# FixAtlas — 데이터 수집·저장·배포 블루프린트 (정정본 2026-11-17)

> 이전 버전(2026-09-26)의 오류를 조사 결과(`docs/research/R3`, `R5`, `R6`)로 바로잡았다.
> 핵심 변경: **크롤링은 후순위**, **사용자 제보 + 공식 공개 가격(수작업 확인)이 1순위**.

## 0. 정정 사항

| 이전 서술 | 문제 | 정정 |
|---|---|---|
| "FCC 도면·내부 보드 사진은 public domain" | 오류. 미국법상 공적 영역은 *연방 공무원이 직무로 작성한 저작물*(17 U.S.C. §105)뿐이다. 신청자가 제출한 회로도·사진은 신청자 저작물이고 기밀 처리될 수 있다. | 외형·시험 리포트 등은 **링크로만** 안내하고 복제·재게시하지 않는다. (R5) |
| iFixit·eReplacementParts 콘텐츠를 추출해 JSON-LD로 적재 | iFixit 가이드는 CC BY-NC-SA 3.0이며 **상업적 이용·LLM 학습은 별도 라이선스** 필요. 제휴 수익이 있는 서비스는 본문 복제 불가. | **출처 링크 + 짧은 인용(출처 표기)** 만. 본문 DB 적재 금지. 필요하면 iFixit와 라이선스 협의. (R5) |
| 분해(disassembly) 단계별 가이드 수집 | RFP 5.6의 안전 원칙("배터리·도크 내부 분해 금지", Do Not DIY)과 정면 충돌. | 분해 절차는 수집·게시하지 않는다. 자가점검은 사용자가 안전하게 할 수 있는 항목으로 제한한다. |
| `manuals` 테이블 | 마이그레이션에 존재하지 않음(문서만 있고 구현 없음). | 매뉴얼 본문은 저장하지 않고 URL만 `reference_prices.source_url`/별도 링크로 보관한다. |
| 크롤링이 수리비 데이터를 만든다는 암시 | iFixit·FCC·매뉴얼에는 **한국 수리비 견적**이 없다. RFP의 핵심 자산(모델×증상×실결제 수리비)은 크롤링으로 얻을 수 없다. | 수리비는 사용자 제보 + 공식 가격표(수작업 확인)로 시드한다. |
| "Crawl4AI/Firecrawl로 Zero-CLI 추출" | Clien·DC 등은 robots.txt/서버에서 AI 크롤러를 차단한다(R3). 정보통신망법 제48조·부정경쟁방지법(데이터 부정사용) 위험. | **스크래핑 금지**. robots/약관 준수, 로그인·보호 우회 금지. |

## 1. 데이터 소스 우선순위

1. **사용자 제보** (`repair_reports`) — 핵심 자산. 영수증은 비공개 버킷, 관리자 검증 후 `verified`.
2. **공식·공개 기준가격** (`reference_prices`) — 제조사·공식 스토어·서비스 안내 페이지에서 *사람이 열어 확인한* 가격만. 출처 URL·확인일 필수, 사용자 제보 통계와 섞지 않는다.
   - 현재 시드: 삼성 BESPOKE 제트 배터리, LG A9/A9S·R9 배터리, LG 출장점검료 4종(2026-11-17 확인). 다이슨은 공식 페이지가 403이라 **보류**(후보는 `docs/research/R6_public_prices.json`).
3. **카테고리 단위 자가점검 카드** (`self_check_cards`) — 직접 작성·검수. 안전등급 4단계(Safe Check / Caution / Expert Only / Do Not DIY).
4. (보류) 외부 문서 링크 — 크롤링 없이 링크만.

## 2. 저장 구조 (Supabase Postgres)

핵심 테이블: `products`(slug, brand_ko), `symptoms`(synonyms, categories), `self_check_cards`(category 카드 + safety_level),
`repair_reports`(영수증은 `receipt_path`만, 공개 컬럼 제한), `reference_prices`, `events`(익명 계측), `community_posts`, `comments`.
보안·권한 설계는 `supabase/migrations/20260517*.sql`과 `tests/db/`(실제 Postgres 검증) 참고.

## 3. 배포

- 프런트: Vite 정적 빌드(`npm run build`) → Cloudflare Pages / Vercel / Netlify. SPA 폴백 설정은 `public/_redirects`, `vercel.json` 포함. `npm run build` 전에 `sitemap.xml`·`robots.txt`가 자동 생성된다(`SITE_URL` 지정).
- 환경변수: `.env.example` 참고(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, 선택 `VITE_SITE_URL`).
- `prototype/index.html`은 **샘플 데이터 데모**다. 공개 배포 시 데모 배너가 반드시 보이는 상태로만 올린다. (실서비스 배포 대상 아님)
- SEO 한계: 현재는 클라이언트 렌더링(SPA)이다. 상세 페이지 프리렌더/SSR 전환은 `docs/PLAN_REINFORCEMENT.md` 4장의 게이트 기준으로 결정한다.
