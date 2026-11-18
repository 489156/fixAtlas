# R12. GEO·SNS 자동게시 — 적대적 검증을 통과한 사실 (2026-11-18)

방법: deep-research 워크플로(검색 5각도 → 출처 23개 수집 → 주장 108개 추출 → 상위 25개를 3표 적대 검증 → 21개 확인·4개 기각) + 네이버 블로그 robots.txt 직접 확인.
표기: 확인된 주장만 싣는다. 기각된 주장은 맨 아래에 "쓰지 말 것"으로 남긴다.

## 1. 네이버 블로그는 AI 검색 크롤러를 차단한다 [직접 확인 2026-11-18]

`https://blog.naver.com/robots.txt` 원문 발췌:

```
# BOT ACCESS FOR THE PURPOSES OF AI TRAINING AND RETRIEVAL-AUGMENTED GENERATION (RAG) IS STRICTLY PROHIBITED.
User-agent: GPTBot            Disallow: /
User-agent: OAI-SearchBot     Disallow: /
User-agent: PerplexityBot     Disallow: /
User-agent: Google-Extended   Disallow: /
User-agent: ClaudeBot         Disallow: /
User-agent: Claude-SearchBot  Disallow: /
User-agent: meta-externalagent / Applebot-Extended / CCBot   Disallow: /
```

Googlebot(일반 `*` 규칙)은 일부 경로만 막혀 있다.
**의미**: 네이버 블로그 글은 네이버 검색과 구글 검색에는 유통되지만 ChatGPT 검색·Perplexity·Claude의 검색 크롤러는 정책상 가져갈 수 없다. AI 답변 인용 경로는 **자체 사이트**가 맡아야 한다. 사용자 요청으로 실행되는 수집기(ChatGPT-User, Perplexity-User)는 robots.txt를 따르지 않을 수 있다는 점이 OpenAI·Perplexity 문서에 있으나, 이를 노린 전략은 세우지 않는다.

## 2. GEO — 확인된 사실

| # | 사실 | 신뢰 | 출처 |
|---|---|---|---|
| G1 | 구글은 생성형 AI 검색 최적화를 "여전히 SEO"로 본다. AI Overviews·AI Mode에 나오려면 ① 색인 ② 스니펫 표시 가능 ③ Search Console의 생성형 AI 기능 포함 설정(기본 포함, 2026-08-31 전 세계 적용)이 필요(필요조건). | 높음 (3-0) | [Google AI 최적화 가이드](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (2026-07-10 갱신), [Search Console 도움말](https://support.google.com/webmasters/answer/16908024) |
| G2 | 구글 검색은 llms.txt, AI 전용 텍스트·마크업·Markdown 파일, 청킹, AI 전용 schema를 쓰지 않는다. 구조화 데이터는 AI 기능에 필수 아님(리치 결과용으로는 유용). fan-out 변형마다 페이지를 대량 생성하지 말라는 경고도 있다. | 높음 (3-0) | 위 가이드 |
| G3 | 클라이언트 렌더링 SPA는 본문·메타·내비게이션을 서버 렌더링 또는 사전 렌더링해야 안전하다. "AI 크롤러는 JS를 실행하지 않는다"는 단정은 기각(1-2) — **"실행을 보장할 수 없다"**로 읽을 것. | 중간 (3-0) | [Vercel 2024-12-17 — 오래된·벤더 자료](https://vercel.com/blog/the-rise-of-the-ai-crawler), [Google JS SEO 기본](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [OpenAI 봇](https://developers.openai.com/api/docs/bots), [Perplexity 봇](https://docs.perplexity.ai/guides/bots) |
| G4 | 키워드 반복은 생성형 엔진 노출에 효과가 없거나 손해. 2024 Princeton 시뮬레이션의 "최대 약 40%" 개선은 후속 연구(C-SEO Bench, NeurIPS 2025)에서 실제 엔진으로 잘 옮겨가지 않는다는 반론을 받았다. | 높음 (3-0) | [arXiv 2311.09735](https://arxiv.org/abs/2311.09735) (2024), [arXiv 2506.11097](https://arxiv.org/abs/2506.11097), [arXiv 2607.14035](https://arxiv.org/abs/2607.14035) |
| G5 | AI 인용은 페이지 속성보다 **그 엔진의 검색이 가져오는가**와 **질문·주제 일치**에 좌우된다. ChatGPT 인용 URL 22,315개 전부가 ChatGPT 자체 검색 결과 안에 있었고, 같은 사이트 안 인용 차이의 32%를 검색 결과, 2.8%를 페이지 속성이 설명. 같은 사이트 안에서 유의한 콘텐츠 요인은 "질문과 맞는 제목·문단"뿐(FAQ·schema·속도는 유의하지 않음). | 중간 (3-0, 프리프린트) | [arXiv 2610.15033](https://arxiv.org/abs/2610.15033) (2026-10), [arXiv 2605.25517](https://arxiv.org/abs/2605.25517) (SIGIR '26, 벤더 저자) |
| G6 | 수치·정의·비교·절차를 담은 페이지가 답변에 더 많이 반영되는 경향(상관). 통제 실험에서 가격 명시, 최신 날짜(대 오래된 날짜)가 첫 인용 가능성을 높였다. 날짜 없음 대 최신 날짜는 일관되지 않음 → **"오래된 날짜를 방치하지 말라"**로 해석. | 중간 (3-0 / 2-1) | [arXiv 2604.25707](https://arxiv.org/abs/2604.25707), [arXiv 2605.25517](https://arxiv.org/abs/2605.25517) |

**한계**: 학술 근거는 영어·미국 시장 기준이며 한국어·네이버 AI 브리핑은 연구되지 않았다. 구글 문서는 구글 검색에만 해당한다.

## 3. SNS 공식 자동게시 API — 확인된 사실

| 플랫폼 | 공식 API·권한 | 한도 | 예약 | 주의 | 출처(확인 2026-11-18) |
|---|---|---|---|---|---|
| Threads | Threads API, `threads_basic` + `threads_content_publish`. 컨테이너 생성 → `threads_publish` 2단계 | 프로필당 24시간 롤링 250건(캐러셀 1건) | API 파라미터 없음 → 자체 큐 | 고급 접근은 App Review(전에는 테스터 계정만). 2025-12-22부터 링크 6개 이상 게시물 오류 | [overview](https://developers.facebook.com/docs/threads/overview), [publishing](https://developers.facebook.com/docs/threads/reference/publishing), [changelog](https://developers.facebook.com/docs/threads/changelog) |
| Instagram | Content Publishing API, **프로페셔널 계정만**. `/media` → `/media_publish` | 24시간 100건 — 같은 문서 캐러셀 항목엔 50건(충돌) → `content_publishing_limit`로 실측 | 파라미터 없음 | 이미지 JPEG만, 쇼핑 태그·필터 불가, App Review 필요할 수 있음 | [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) |
| TikTok | Content Posting API Direct Post, `video.publish` + **클라이언트 감사 통과** | init 사용자 토큰당 분당 6회, 크리에이터당 하루 "typically around 15" | 파라미터 없음 | 감사 전에는 비공개 게시만. 감사된 외부 스케줄러를 쓰면 대체 가능 | [Direct Post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post), [Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) |
| YouTube | Data API `videos.insert` | 'Video Uploads' 버킷 기본 하루 100회(1 unit/호출, 증설 신청 가능) | `publishAt` 별도 확인 필요 | 2026-11-02부터 미검증 프로젝트 업로드도 비공개 강제 해제 — 고객센터 문서와 불일치, 실제 업로드로 시험 | [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) (2026-11-12 갱신), [revision history](https://developers.google.com/youtube/v3/revision_history) |

공통: 네 API 모두 게시 시각을 예약하는 파라미터를 문서에서 확인하지 못했다(YouTube는 미확인) → 예약은 자체 큐/외부 스케줄러가 맡는다. 모든 한도는 실제 API 응답으로 재확인.

## 4. 기각된 주장 — 쓰지 말 것

- "출처 인용·인용문·통계 추가가 각각 30~40% 노출 개선" (0-3)
- "주요 AI 크롤러는 JS를 실행하지 않는다"는 단정 (1-2)
- ChatGPT/Google/Perplexity 인용 수·흡수도 비교 수치 (1-2)
- scaled content abuse 관련 복합 주장 (0-3, 단 fan-out 대량 페이지 경고 자체는 가이드에 있음)

## 5. 이 검증 세트가 다루지 못한 것

네이버 블로그 글쓰기 API·예약발행·운영정책, X·Reddit API, Zapier/Make/n8n/Buffer, Mobbin, 국내외 블로그 레퍼런스 → `R9`, `R10`, `R11`에서 보완.
