# R9. 발행 자동화 & 플랫폼 정책 (고장도감 / FixAtlas)

- 조사일: 2026-11-18. 출처를 본 날짜도 모두 2026-11-18이다. 확인하지 못한 내용은 [unverified]로 표시했다.
- 이번 범위에서 뺀 것(다른 문서에서 이미 확인): Threads·Instagram·TikTok·YouTube API 한도, blog.naver.com robots.txt의 AI 봇 차단.

## 결론 5줄

1. **네이버 블로그는 자동발행 수단이 없다.** 현재 네이버 오픈API 목록에 블로그 글쓰기가 없다[S1]. 이용약관과 게시물 운영정책은 사전 허락 없이 자동화 수단(매크로·봇)으로 게시하는 것을 금지한다[S2][S3]. 남는 방법은 사람이 에디터에서 직접 쓰는 것뿐이고, RPA나 매크로는 쓰면 안 된다.
2. **AI 검색에 인용되려면 자체 사이트가 중심이어야 한다.** 네이버 블로그는 AI 봇을 막는다(기존 검증). 브런치와 Medium은 학습용 봇을 막는다[S20][S21]. 티스토리·Blogger·WordPress.com에는 AI 봇을 따로 막는 줄이 없다[S22–S24]. 자체 사이트는 Vite SPA라서 SSR이나 프리렌더가 필요하다. 네이버도 SPA에 SSR을 권장한다[S6].
3. **API로 예약발행까지 되는 블로그**는 WordPress(`status: future`), Ghost(`scheduled`), Blogger(`publishDate`) 세 곳이다[S13–S15]. 티스토리는 Open API를 2024년 2월까지 종료했고[S10][S11], Medium API는 지원이 끝났다[S16].
4. **X는 2026년부터 사용량 과금이다.** URL을 넣은 게시는 건당 $0.20으로, 일반 게시($0.015)의 약 13배다[S25]. **Reddit은 API 사용에 사전 승인이 필요하다.** 같은 홍보 글을 자동으로 올리는 행위는 명시적인 스팸 사례다[S30][S32]. 그래서 Reddit은 자동화에서 빼는 것을 권장한다.
5. **도구 조합:** SNS는 Buffer 하나로 Threads·IG·TikTok·YouTube·X·LinkedIn에 발행할 수 있다(Reddit·블로그는 미지원)[S40]. 블로그와 사이트는 n8n이나 Zapier로 WordPress·Ghost를 다룬다. 네이버 블로그와 티스토리를 지원하는 도구는 찾지 못했다.

## 1. 플랫폼별 표

| 플랫폼 | 공식 API | 예약 | 자동화 허용 범위 | 한도·비용 | 제재 위험 | 출처 |
|---|---|---|---|---|---|---|
| 네이버 블로그 | **없음.** 오픈API 목록에는 검색·로그인·카페·캘린더·공유하기만 있다. 글쓰기 API는 2020-05-06 종료(언론 보도, 2차 출처) | 에디터 예약발행 가능 범위는 [unverified] | 금지: "사전 허락 없이 자동화된 수단(예: 매크로 프로그램, 로봇(봇)…)을 이용하여 게재한 게시물" | — | 게시 제한, 이용 정지·해지. 상업 게시물 대량 게재 시 "아이디 보호조치" | S1–S4, S7 |
| 네이버 카페 | **있음.** 카페 게시판 글쓰기 API | — | API 경로는 허용. 동일·유사 홍보 글을 반복하면 게시 제한 | 200회/일, 카페 가입 50회/일 | 위와 같음 | S1, S3 |
| 네이버 검색(자사 사이트) | 서치어드바이저에서 IndexNow와 수집 요청 API 제공 | — | AI 사용 자체는 문제 삼지 않는다: "특정 기술의 활용 여부만으로는 판단하지 않습니다" | IndexNow는 "색인을 보장하지는 않습니다" | 저품질 대량 생성·스크래핑은 "노출 제외 또는 순위 하락" | S5, S8 |
| 티스토리 | **종료.** "23년 12월 말부터 순차 종료(2월 말까지)" | 에디터 예약발행 있음(미래 시점만) | API 없음. 외부 자동화 수단이 남지 않음 | — | [unverified] | S10–S12 |
| X | 있음(v2). 2026-02-06부터 사용량 과금(pay-per-use) | API 자체 예약 기능은 없음. 도구에서 처리 | 정해진 정보성 콘텐츠의 예약 게시는 허용. "Automated" 라벨, 바이오 공개, 사람 계정 연결 필요. 동일 콘텐츠 교차게시 금지 | 게시 $0.015, **URL 포함 $0.200**. POST /2/tweets: 사용자당 100/15분, 앱당 10,000/24시간. 신규 무료 크레딧 $20, 첫 자동충전 매칭 최대 $50 | 비공식 자동화는 "permanent suspension". 2026-02-23부터 프로그램 답글은 상대가 소환했을 때만 | S25–S29 |
| Reddit | 있음. **사전 승인 필수:** "request access and get explicit approval before accessing any Reddit data" | 공식 기능은 [unverified] | 앱은 등록하고 App 라벨을 받아야 함. 자동 게시로 스팸 금지, "identical or substantially similar content across subreddits" | 한도 초과·우회 금지 | 토큰 회수, 앱·계정 정지, "Suspending associated accounts, bots, domains" | S30–S33 |
| Instagram·Threads | (기존 검증) | (기존 검증) | Meta 스팸 기준: "either manually or automatically, at very high frequencies" 금지. 오해를 부르는 링크 금지 | (기존 검증) | 구체적인 제재 기준치는 공개되지 않음 | S34 |

## 2. 블로그 플랫폼 비교

| 플랫폼 | 공식 API(글 생성) | 예약 | SSR(직접 확인) | AI 크롤러 robots.txt (2026-11-18 조회) |
|---|---|---|---|---|
| 네이버 블로그 | 없음 | 에디터 기능(범위 [unverified]) | — | GPTBot·OAI-SearchBot·PerplexityBot·ClaudeBot 등 Disallow(기존 검증). 참고: 이번 조회에서는 첫 블록이 `User-agent: Yeti / Disallow: /`였다. 해석은 별도 확인이 필요하다 |
| 티스토리 | 종료(2024-02) | 에디터 예약(미래 시점만) | O. 본문이 HTML에 들어 있음 | notice.tistory.com: `User-agent: *`에서 `/manage`·`/admin`·`/search` 등만 Disallow. AI 봇 전용 줄 없음 |
| WordPress | REST `POST /wp/v2/posts` | 상태값 "One of: publish, future, draft, pending, private" | O | wordpress.com: AI 봇 전용 줄 없음. 자체 호스팅이면 직접 정한다 |
| Ghost | Admin API | "set the status to scheduled… published_at… in the future" | O | ghost.org: `Allow: /`. 자체 도메인이면 직접 정한다 |
| Medium | 지원 종료: "The Medium API is no longer supported." 저장소는 2023-03-02 보관 처리 | API의 publishStatus는 public/draft/unlisted뿐 | [unverified]. Cloudflare 챌린지로 확인 못 함 | GPTBot·ClaudeBot·Amazonbot·GoogleOther·Applebot-Extended·meta-externalagent 등은 `Disallow: /`. OAI-SearchBot·PerplexityBot 전용 줄은 없음 |
| 브런치 | 공개 API 문서 찾지 못함 [unverified] | "발행 예약은 30일 이내, 1시간 단위로 설정이 가능" | O | `# AI training crawlers`(GPTBot·ClaudeBot·Google-Extended·CCBot 등)는 `Disallow: /`. OAI-SearchBot·ChatGPT-User·Claude-SearchBot·PerplexityBot은 일반 경로만 막고 Crawl-delay 2 |
| Blogger | API v3 `posts.insert` | `posts.publish`의 publishDate: "The date and time to schedule the publishing" | O | *.blogspot.com: `User-agent: *` / `Disallow: /search` / `Allow: /` |

**시사점:** GEO용 원본 문서는 자체 도메인(WordPress·Ghost 또는 현재 SPA를 SSR로 전환)에 두는 것이 맞다. 네이버 블로그는 사람이 쓰는 배포 채널로 남긴다. 네이버 공식 발표가 밝힌 AI 브리핑 관련 사실은 아래가 전부다.

- AI 브리핑은 "답변의 근거로 활용된 블로그 등 출처 콘텐츠"를 함께 보여준다[S9a].
- 네이버 메이트는 "AI 브리핑 인용 수, 주제별 전문성, 활동성 등을 기준으로" 선정한다[S9b][S9c].
- 출처 선정 알고리즘 자체는 공개되지 않았다.

## 3. 자동화 도구 지원 매트릭스 (공식 연동 페이지·문서 기준)

| 대상 | Zapier | Make | n8n | Buffer |
|---|---|---|---|---|
| Threads | O. "Threads by Unshape"(제3자 앱), Create Post | 앱 목록에 없음 [unverified] | 전용 노드 없음(HTTP 노드로 직접 호출) | O |
| Instagram | O. Publish Photo(s), Publish Video(릴스) | O. Instagram for Business, Create a photo post 등 | 전용 노드 없음(Facebook Graph API·HTTP 노드) | O |
| TikTok | 게시 X. Lead Generation 트리거만 있음 | 게시 X. 광고·리포트 모듈과 legacy 영상 조회 모듈만 있음 | 전용 노드 없음 | O |
| YouTube | O. Upload Video(Publish_at 지원) | O. Upload a Video | O. Upload a video | O |
| X | X. 연동이 "stopped working (effective August 31, 2023)" | 앱 목록에 없음 [unverified] | O. Create a tweet(자기 API 크레딧 필요) | O |
| Reddit | O. Create Post(링크·텍스트) | O. Submit a Post | O. Submit a post | X(채널 목록에 없음) |
| LinkedIn | O. Create Share/Company Update | O. User·Company Text Post 등 | O. Post Create | O |
| 네이버 블로그 | X(앱 없음) | X | X | X |
| 티스토리 | X(앱 없음) | X | X | X |
| WordPress | O. Create Post | O. Create a Post | O. Create a post | X |
| Ghost | O. Create Post | O. Create a Post | O. Admin API Create a post | X |

- 위 표에 없는 블로그 연동: Make는 Blogger의 Publish a Post를 지원하고 Medium은 "legacy"로 표시한다. n8n에는 Medium 노드가 있다.
- 요금은 페이지에 나온 것만 적었다.
  - Buffer Free: 채널 3개, "10 scheduled posts per channel", API 키 1개(채널당 월 1,000회 요청).
  - Buffer Essentials: 채널당 월 $5(연간 결제 기준).
  - Zapier: Free 플랜은 "checks for new data every 15 min"(새 데이터 확인 주기 15분).
- **권장 구성:** Supabase에서 글을 올리면 자체 사이트(SSR)에 발행된다. 웹훅으로 n8n이나 Zapier를 부르고, Buffer API로 Threads·IG·TikTok·YouTube·X·LinkedIn에 발행한다. 네이버 블로그는 사람이 예약발행한다. Reddit은 사람이 직접 참여한다.

## 4. 확인 못 한 항목

- **네이버 블로그 예약발행 가능 범위**(최대 며칠, 시간 단위). 고객센터가 SPA라 내용을 못 읽었고, 검색 도구가 naver.com을 막았다. 확인 방법: 스마트에디터 [발행] 설정 화면과 블로그 고객센터.
- **네이버 블로그 글쓰기 API 종료 공지 원문.** 지금 근거는 뉴스핌 2020-04-13 기사(2차 출처)뿐이다. 확인 방법: developers.naver.com 공지나 포럼 보관본.
- **네이버 블로그 전용 운영정책의 외부 링크·AI 생성글 조항.** 통합 게시물 운영정책과 검색 스팸 기준만 확인했다.
- **AI 브리핑의 출처 선정 기준과 외부 웹문서 인용 여부.** 공식 문서가 없다.
- **Medium의 SSR 여부와 네이티브 예약 기능.** 브런치에 공개 API가 정말 없는지.
- **Make의 Threads·X 지원.** make.com이 403을 돌려줬고, apps.make.com 앱 목록(3,554개)에는 없었다.
- **X 정책 원문과 Basic/Pro 요금.** help.x.com 자동화 규칙 원문은 403이라 docs.x.com 가이드로 대체했다. Basic/Pro는 "remain available"이라고만 나오고 현재 가격은 없다.
- **Reddit 커뮤니티별 홍보 비율 규칙, reddiquette 원문**(가져오지 못함). **Meta의 자동 게시 제재 기준치**(공개되지 않음).

## 5. 출처 (모두 2026-11-18에 봄)

- S1 https://developers.naver.com/products/intro/plan/plan.md · https://developers.naver.com/docs/common/openapiguide/apilist.md
- S2 네이버 이용약관(시행 2026-10-01): https://policy.naver.com/policy/service.html. "IP를 지속적으로 바꿔가며 접속하는 행위" 등 우회 금지
- S3 게시물 운영정책(시행 2026-07-07): https://policy.naver.com/policy/service_group.html
- S4 계정 운영정책(시행 2023-09-15): https://policy.naver.com/policy/service_group2.html
- S5 웹 콘텐츠 스팸사례: https://searchadvisor.naver.com/guide/content-abusing
- S6 자바스크립트 검색 최적화: https://searchadvisor.naver.com/guide/seo-advanced-javascript
- S7 뉴스핌 2020-04-13(2차 출처): https://newspim.com/news/view/20200413000737
- S8 IndexNow 소개: https://searchadvisor.naver.com/guide/indexnow-about
- S9a https://www.navercorp.com/media/pressReleasesDetail?seq=10034578 (2026-08-07) · S9b …?seq=10034346 (2026-06-04) · S9c …?seq=10034478 (2026-07-15) · https://www.navercorp.com/story/storyDetail?seq=32525 (2025-05-23)
- S10 https://notice.tistory.com/2664 (2023-12-22) · S11 https://tistory.github.io/document-tistory-apis/ · S12 https://notice.tistory.com/2324 (2016-05-26)
- S13 https://developer.wordpress.org/rest-api/reference/posts/ · S14 https://docs.ghost.org/admin-api/posts/scheduling-a-post · S15 https://developers.google.com/blogger/docs/3.0/reference/posts/publish
- S16 https://github.com/Medium/medium-api-docs · S17 https://brunch.co.kr/@brunch/356 (2024-08-19)
- S20 https://brunch.co.kr/robots.txt(파일에 Last updated 2026-04-22) · S21 https://medium.com/robots.txt · S22 https://notice.tistory.com/robots.txt · S23 https://googleblog.blogspot.com/robots.txt · S24 https://wordpress.com/robots.txt, https://ghost.org/robots.txt
- S25 https://docs.x.com/x-api/getting-started/pricing · S26 https://docs.x.com/x-api/fundamentals/rate-limits · S27 https://docs.x.com/changelog (2026-02-06 사용량 과금 출시, 2026-02-23 LLM 스팸 대응, 2026-04-20 단가 변경) · S28 https://docs.x.com/developer-guidelines · S29 https://docs.x.com/x-api/getting-started/free-credits
- S30 Responsible Builder Policy(수정 2026-10-05): https://support.reddithelp.com/hc/articles/42728983564564
- S31 Data API Terms(최종 개정 2026-07-20): https://redditinc.com/policies/data-api-terms · Developer Terms(최종 개정 2026-03-24): https://redditinc.com/policies/developer-terms
- S32 Spam(수정 2026-10-30): https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam. "Programming a bot that continuously promotes specific products or services"
- S33 Reddit Rules 2조 "do not spam": https://redditinc.com/policies/reddit-rules
- S34 https://transparency.meta.com/policies/community-standards/spam/ (help.instagram.com/477434105621119로 접속하면 이 커뮤니티 규정으로 리디렉션됨)
- S40 https://buffer.com/ · https://buffer.com/pricing
- Zapier: https://zapier.com/apps/{instagram-for-business, youtube, reddit, linkedin, wordpress, ghost, threads-by-unshape, tiktok-lead-generation}/integrations · https://zapier.com/l/twitter-integration-faq
- Make: https://apps.make.com/{instagram-business, youtube, reddit, linkedin, wordpress, ghost, tiktok, blogger}
- n8n: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.{twitter, linkedin, reddit, wordpress, ghost, youtube, facebookgraphapi}/
