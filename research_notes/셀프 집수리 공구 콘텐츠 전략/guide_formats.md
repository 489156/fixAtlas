# 상황별 셀프 수리 가이드의 구조와 검색·AI 답변 노출 (조사 노트, 2026-11-19)

조사 방법과 접근 기록
- 조회일: 이 세션(시스템 날짜 2026-11-18, 과제 기준일 2026-11-19). 모든 가이드 페이지는 WebFetch로 한 건씩 열었고, robots.txt를 먼저 확인했다.
- 열지 못한 곳(자동 접근 안 함 또는 차단):
  - thespruce.com: WebFetch가 도메인을 거부했다. 직접 요청은 세션 권한에서 막혀 시도를 멈췄다.
  - homedepot.com, lowes.com: HTTP 403.
  - ohou.se(오늘의집): robots.txt까지 "Access Denied"라 접근하지 않았다.
  - blog.naver.com과 네이버 검색: robots 정책상 시도하지 않았다(저장소 R12 §1 참고).
  - YouTube: 시도하지 않았다.
  - searchengineland.com, i-boss.co.kr: 403.
  - searchadvisor.naver.com: WebFetch는 거부됐다. robots.txt(`Allow: /`, `/guide` 허용)를 확인한 뒤 curl로 가이드 4쪽만 받았다.
- 표기:
  - `[unverified]`: 원문을 직접 확인하지 못한 항목이다. 한 줄 확인 경로를 붙였고, 경로마다 담당 표시([AI]·[판단]·[현장])를 달았다.
  - `[검색 요약]`: 검색 엔진 결과 요약만 본 항목이다.

---

## 1. 선도 가이드는 상황별 수리를 어떻게 구성하는가 (미국·글로벌 / 한국)

### Takeaway
미국 편집 매체의 공통 골격은 다음과 같다.
1. 상단 요약칸(난이도·비용·시간)
2. 공구·재료 목록
3. 사진 1장이 붙은 번호 단계
4. 팁 callout

다만 "기사를 불러야 할 때"와 "직접 하면 얼마, 기사를 부르면 얼마" 비교는 분석한 가이드 본문 어디에도 없었다. 한국 제조사 자가조치 페이지는 반대로 증상 점검, 주의 상자, "출장 서비스 예약" CTA, "도움이 되셨나요" 피드백 구조다. 이쪽은 비용 숫자를 전혀 싣지 않는다. 두 구조의 빈칸인 **DIY 대 기사 비용 비교와 중단 기준**이 고장도감이 차지할 수 있는 자리다.

### Cited Findings
**This Old House — "How to Repair a Dripping Single-Handled Faucet"** ([원문](https://www.thisoldhouse.com/plumbing/how-to-repair-a-dripping-single-handled-faucet))
- 상단 "Project details"는 세 칸이다.
  - Skill: "1 out of 5" "Easy" + 한 줄 설명 "Just keep the pieces in order for proper reassembly"
  - Cost: "About $8 to $40, depending on faucet make and model"
  - Estimated Time: "30 minutes"
- 바이라인은 Richard Weir이고 "Updated 06/03/2026"이 붙어 있다. 영상은 없다.
- "Tools & Materials"에는 공구 4개(Pocket knife, Screwdriver, Slip joint pliers, Needle nose pliers)가 사진과 함께 있다. 판매처 링크는 없다.
- 단계는 5개이고 각 단계에 이미지가 1장씩 있다.
  - 1단계는 구조도(diagram)다.
  - 사진마다 촬영자 크레딧(Craig Raine 등)이 붙어 있다.
  - 굵은 "Pro Tip:" callout이 2개 있다.
- 별도의 안전 섹션, 문제 해결, '전문가 호출' 섹션은 없다. DIY 대 기사 비용 비교도 없다. 비용은 DIY 범위만 있다.

**Bob Vila — "How to Fix a Leaky Faucet"** ([원문](https://www.bobvila.com/articles/how-to-fix-a-leaky-faucet/))
- 메타데이터의 최초 게시일은 2013-06-11, 수정일은 2025-05-12다. 저자는 Timothy Dale과 Michael Franco다.
- 도입부는 외부 통계를 인용한다.
  - NAHB: 수전 수명 약 15년
  - USGS 계산기: 분당 1방울이면 연 34갤런
- "Talk to a Pro" 리드 수집 상자("A top-tier local pro can take care of the issue for you.")가 2번 나온다.
- 이어지는 순서는 다음과 같다.
  1. "Before You Begin": 단수, 압력 빼기, 배수구 막기, 수전 유형 식별
  2. 유형별 분기 절차: 압축식(compression)과 무와셔식(cartridge, ball, ceramic-disk)
  3. 각 절차의 "SUPPLIES" 목록과 H3 "Step N:" 7단계(마지막 단계는 항상 시험)
  4. "Final Thoughts"
  5. "FAQs"
  6. 저자 소개
- DIY·배관공 비용 숫자는 없다("relatively inexpensive"만 있다).

**iFixit — "How To Fix A Leaky Faucet"** ([원문](https://www.ifixit.com/Guide/How+To+Fix+A+Leaky+Faucet/39117))
- Difficulty "Moderate", Time Required "15 - 30 minutes", 13단계다.
- 도입은 한 줄이다("Use this guide to stop a leak in a common cartridge faucet.").
- 공구 목록에는 가격과 평점이 붙어 있다.
- 단계마다 사진(예: "image 1 of 2")과 글머리 지시, 단계별 "Add a comment", "Ask FixBot"이 있다.
- 결론은 "follow these instructions in reverse order"다.
- 완료 집계("4 other people completed this guide", "Mark complete")가 보인다.
- 저자 신뢰 신호가 공개돼 있다. 평판 93,175, 작성 가이드 88개, "with 5 other contributors"다.
- 조회 통계가 공개돼 있다. 누적 11,704회, 최근 30일 598회다.
- "Last updated on Oct 20, 2026"이다.

**iFixit 기기 허브 "Faucet"** ([원문](https://www.ifixit.com/Device/Faucet))
- 가이드를 부품 단위(Aerator, Cartridge, Handle, O-ring, Stem)로 나눈다.
- Disassembly·Techniques·Troubleshooting 묶음이 따로 있다. 문제 해결 페이지 예: [Leaky Faucet](https://www.ifixit.com/Troubleshooting/Faucet/Leaky+Faucet/535185).
- 자사 공구 상품 링크(Adjustable Wrench 등)가 함께 있다.

**Family Handyman**
- 열람한 페이지([원문](https://www.familyhandyman.com/?p=184251), "Updated on Apr. 09, 2024")의 구성은 다음과 같다.
  - 바이라인과 "Family Handyman's Editorial Process" 링크가 있다.
  - 44장 슬라이드에 사진·크레딧이 붙어 있다.
  - 일부 항목에 DIY 절감액이 있다. 예: 온수기 점화 "$20, if you do it yourself"
- 프로젝트 페이지의 상단 필드는 검색 요약에서만 봤다. 요약은 Time "An hour or less", Complexity "Beginner", Cost "Less than $20"이었다. 이 요약도 공식 도메인이 아닌 TMBI 스테이징 미러(f-cce-*.fhm.r.tmbi.com)에서 나왔다. `[unverified]` — [AI] familyhandyman.com의 faucet cartridge 프로젝트 페이지를 직접 열어 필드명·값을 대조한다.

**열지 못한 곳**
- The Spruce: "Project Overview(Working Time / Total Time / Skill Level / Estimated Cost)", "What You'll Need(Equipment/Tools, Materials)", "When to Call a Professional" 섹션 구조는 기억에 의존한 것이다. `[unverified]` — [판단] 이 도메인에 접근할지를 정한다. 허용되면 [AI]가 수동 열람 1건으로 확인한다.
- Home Depot와 Lowe's DIY 프로젝트 페이지: 403이다. 검색 요약에는 Home Depot 수전 가이드가 "2-4 hours, Beginner"로 나왔다. `[unverified]` — [판단] 접근 방식을 정한다. 대안으로 [AI]가 검색 결과의 캐시나 스니펫으로 필드명만 확인한다.

**삼성전자서비스 — 자가해결 허브** ([TV 간단 가이드](https://www.samsungsvc.co.kr/solution/26330))
- 날짜 2019-06-05, 조회수 11,197이다.
- 하위 메뉴가 7개다. "안전을 위한 주의 사항", "자가진단 방법", "아주 쉬운 자가해결 동영상" 등이다.
- 동영상은 증상 질문형 링크 9개로 묶여 있다. 예: "TV 화면이 안 나오는가요? 확인해 보세요"
- 피드백은 "위의 내용으로 궁금증 해결에 조금이나마 도움이 되셨나요?" 네/아니요다.
- CTA는 "출장서비스 예약"과 "AI CS Bot 상담"이다.
- 금액은 없다. "무상 보증기간 이내라도 … 별도의 요금이 부과됩니다"라는 안내만 있다.

**삼성전자서비스 — 세탁기 기능 활용 페이지** ([원문](https://www.samsungsvc.co.kr/solution/1479918))
- 2023-06-22 게시, 조회수 21,377이다.
- 제품별 동영상 목록, "알아두면 좋아요", 비고장 출장 유료 안내가 있다.
- CTA는 "전화상담 예약", "출장서비스 예약", "AI CS Bot 상담"이다.
- 수리비·부품비는 없다. "소모품샵"은 상단 메뉴에만 있다.

**LG전자 — "LG 냉장고 자가 점검으로 음식을 신선하게 보관하세요."** ([원문](https://www.lge.co.kr/support/solutions-20153050762361))
- 경로는 홈 > 고객지원 > 스스로 해결이다.
- "자가 점검 포인트" 6개가 명령형 소제목으로 나온다. 예: "설정온도를 확인하세요."
- 그림은 약 10장이고 영상은 없다.
- 상자가 세 종류다.
  - "주의해 주세요!": 뒷커버를 분리하지 말 것
  - "참고해 주세요!": 에러코드는 서비스 점검 대상
  - "잠깐! 더 알아보세요."
- 얼음 항목에만 "원인"/"조치방법" 라벨이 있다.
- CTA는 "출장 서비스 예약", 1544-7777, AI Chat이다.
- 피드백은 "궁금증 해결에 도움이 되셨나요?"와 120자 의견란이다.
- 날짜 2026.07.22, "조회 215972"다.
- 부품 구매 링크는 없다. 유료 기계실 청소 서비스(LG 베스트케어)로 연결된다.

**IKEA 코리아**
- 나사·손잡이·플러그 같은 소형 조립 부품은 셀프 서비스로 무료 신청할 수 있다. 수령까지 2~4주가 걸린다. ([공식 예비 부품 페이지](https://www.ikea.com/kr/ko/customer-service/spare-parts/)) `[검색 요약]`
- 조립은 공식 파트너나 생활대행 플랫폼(애니맨·짬짬이)을 통해 신청할 수 있다고 2019년에 보도됐다. ([뉴데일리 2019-10-01](https://biz.newdaily.co.kr/site/data/html/2019/10/01/2019100100014.amp.html)) — 24개월을 넘는 자료다.

**한국 DIY 유튜브**
- 찾은 기사는 2020~2021년 것이다. "김팀장 크래프트" 구독자 58만, 최고 영상 200만 회 이상([디지털타임스](https://www.dt.co.kr/article/11430745))처럼 목공과 집 꾸미기 중심이다. 상황별 수리 채널의 최근 지표는 찾지 못했다.

### Inferences
**구성 요소 비교** (O 있음 / △ 부분 / X 없음 / ? 미확인)

| 요소 | TOH | Bob Vila | iFixit | FH | 삼성 | LG |
|---|---|---|---|---|---|---|
| 난이도 | O(1/5) | X | O | ?(미러) | X | X |
| 시간 | O | X | O | ?(미러) | X | X |
| 비용 | O(DIY만) | X | △(공구 가격) | ?(미러) | X | X |
| 공구·재료 목록 | O | O | O | △ | X | X |
| 안전·중단 | △ | △ | △ | X | O(별도 페이지) | O(주의 상자) |
| 단계 사진 | O | △ | O | O | 영상 | 그림 |
| 문제 해결 분기 | △ | O(유형별) | O(별도 페이지) | X | O(증상 링크) | O(점검 포인트) |
| 전문가 호출 | X | O(리드 상자) | X | X | O(출장 예약) | O(출장 예약) |
| DIY 대 기사 비용 | X | X | X | X | X | X |
| 작성자·갱신일 | O | 메타만 | O | O | 날짜만 | 날짜만 |
| 피드백·완료 | X | X | O(완료 집계) | X | O(도움 여부) | O(도움+의견) |

**고장도감 가이드 청사진** (근거가 된 사례를 괄호에 적었다)
1. **질문형 제목 + 숫자 답**: 예) "욕실 실리콘 재시공, 직접 하면 재료비 얼마, 몇 시간 걸립니까?" (편집 규칙 3, R12 G5: 질문과 맞는 제목·문단만 인용에 유의)
2. **첫 화면 요약칸**: 난이도(5단계), 작업 시간, 직접 할 때 비용(재료+없는 공구), 기사 공임 범위(출처·확인일), "이럴 땐 직접 하지 마십시오" 1줄 (TOH Project details, iFixit 헤더, 삼성·LG 주의 상자)
3. **내 경우가 맞는지 확인**: 증상별 분기와 원인 갈래 (Bob Vila 유형 분기, LG 점검 포인트, iFixit Troubleshooting)
4. **안전과 중단 조건**: 단수·전원 차단, 하면 안 되는 것 (LG "주의해 주세요!", 삼성 안전 페이지)
5. **준비물 상자**: 공구(용도, 대체품, "이미 있으면 0원"), 소모품(규격·가격·확인일), 여러 판매처 (구글 리뷰 지침 "links to multiple sellers") — 제휴 표기는 글 첫 부분에 둔다(4번 질문 참조)
6. **번호 단계**: 단계당 1~2문장과 직접 찍은 사진 1장, "팁"·"주의" callout (TOH·iFixit)
7. **끝났는지 확인하는 법과 실패 시 점검**: 마지막 단계를 시험으로 둔다 (Bob Vila Step 7, iFixit)
8. **DIY 대 기사 비용 표**: 재료+공구(재사용 가능성 표시) 대 공임+출장비, 출처와 표본 수 — 분석한 어느 가이드에도 없는 고장도감 고유 요소
9. **기사를 불러야 하는 경우**: 고장도감 비용 페이지로 연결 (Angi 실패 통계, 2번 질문)
10. **검증 가능한 사례 1건**: 소비자원·언론·제보 (편집 규칙 6)
11. **누가·어떻게·왜**: 작성자, 출처·확인일, 만든 방법 (구글 Who/How/Why)
12. **피드백**: "따라 해 보셨나요? 결과 알려 주기"를 제보 폼과 연결 (iFixit 완료 집계, 삼성·LG 도움 여부)

### Gaps
- The Spruce, Home Depot, Lowe's, 오늘의집 노하우, 한샘 조립 가이드는 원문 구조를 확인하지 못했다(위 접근 기록 참고).
  - [판단] 차단 사이트에 접근할지 정한다.
  - [AI] 허용 범위 안에서 검색 결과 스니펫으로 필드명만 대조한다.
- 한국 상황별 수리 유튜버(실리콘·경첩·수전)의 2025~2026 조회수와 구조는 확인하지 못했다.
  - [현장] YouTube Data API 키를 발급한다.
  - [AI] 질의별 상위 영상의 조회수·챕터·설명란 구조를 수집한다(robots에 걸리는 /results 크롤링은 하지 않는다).

---

## 2. 어떤 요소가 신뢰와 완주(따라 하기 성공)와 관련되는가 — 공개 근거

### Takeaway
요소별(난이도칸·시간칸 등) 참여·완주 데이터는 공개된 것을 찾지 못했다. 근거는 세 갈래로 수렴한다.
1. 플랫폼 지침: 구글과 네이버 모두 "직접 경험·작업 증거(사진)·출처·정확한 수치·읽기 쉬운 구조·최신성"을 요구한다.
2. 실험 연구: 절차 과제에서는 영상이나 그림+글이 글만 있을 때보다 오류와 시간이 적다. 다만 대부분 소규모이거나 오래된 연구다.
3. 업계 설문: DIY 4건 중 1건가량이 결국 전문가를 부른다. 그래서 "중단 기준"과 "전문가 호출"이 실제로 필요하다.

### Cited Findings
**구글 "helpful, reliable, people-first content"** ([원문](https://developers.google.com/search/docs/fundamentals/creating-helpful-content))
- Who·How·Why 틀을 제시한다.
  - 작성자가 "self-evident"인가를 묻는다.
  - 작업 증거로 "evidence of the work involved, such as photographs"를 든다.
  - 자동화·AI 사용을 밝히라고 한다.
- "clearly demonstrate first-hand expertise"를 요구한다.
- "Attribution or giving credit to other sources doesn't replace the need for original effort."라고 쓴다.
- 페이지 갱신일은 표시돼 있지 않다.

**구글 AI 최적화 가이드** ([원문](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), 2026-05-15 공개, [발표 글](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing))
- commodity 콘텐츠(일반 팁 나열)는 "could originate from anyone"이라고 설명한다.
- 권장하는 것은 "unique expert or experienced takes"와 "a first-hand review provides a unique perspective based on personal experience"다.

**구글 리뷰 작성 지침** ([원문](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews))
- "Provide evidence such as visuals, audio, or other links of your own experience"
- "Share quantitative measurements"
- "Discuss the benefits and drawbacks"
- "Consider including links to multiple sellers"

**구글 품질평가 가이드라인**
- 2025-01-23 개정에서 생성형 AI 정의를 추가했다. 대량 저노력 콘텐츠와 재서술 콘텐츠를 최저 등급으로 명시했다. ([ppc.land](https://ppc.land/google-updates-quality-rater-guidelines-with-ai-content-evaluation-criteria/), [Search Engine Land](https://searchengineland.com/google-quality-raters-content-ai-generated-lowest-quality-454161)) `[검색 요약]` — [AI] 원본 PDF(guidelines.raterhub.com)의 개정 이력 표로 날짜를 대조한다.

**네이버 서치어드바이저 "콘텐츠 작성시 권장 사항"** ([원문](https://searchadvisor.naver.com/guide/content-basic), robots 허용 경로를 curl로 열람, 페이지 날짜 표시 없음) — 5대 원칙
- ① 전문성과 경험
  - "직접 겪은 문제 해결 과정, 실패 경험, 상세한 사용 후기 등을 구체적으로 공유해 주세요"
  - 공식 기관 자료·통계 인용을 권한다.
- ② 일관된 주제
  - "전체 콘텐츠의 절반 이상이 핵심 주제로 구성되어 있나요?"
  - "장단점을 균형 있게 비교하는 콘텐츠가 독자의 신뢰를 얻습니다"
- ③ 진정성과 투명성
  - "AI 도구를 활용하는 경우, 단순 생성·요약에 그치지 말고 운영자의 경험과 관점을 더해"
  - 원문 링크로 출처를 밝히라고 한다.
- ④ 읽기 쉬운 구조
  - "실제 예시나 정확한 수치를 들어 구체적으로 설명"
  - "제목, 소제목, 문단 나누기, 번호 매기기 등을 적극 활용"
  - "중요한 정보를 이미지 안에만 담지 않고 텍스트로도 표현했나요?"
- ⑤ 최신 정보 유지
  - "가격, 정책, 법규 등 자주 변경되는 정보는 최신 상태로 유지"
  - 낚시성 제목·썸네일을 금지한다.
- 사이트 설정 항목에 "중요한 정보는 텍스트로"와 alt 속성 사용이 있다.

**네이버 AI 브리핑 인용 원칙** ([더팩트 2026-05-29, 다음 게재](https://v.daum.net/v/20260529165306668))
- 네이버가 밝힌 5원칙은 직접 경험한 지식, 일관된 주제, 거짓 없는 진정성, 읽기 쉬운 구조, 최신성 유지다.
- 네이버 공식 블로그 입장은 AI 도구로 작성해도 불이익은 없다는 것이다. 다만 "최종 검토와 편집을 통해 창작자의 실제 경험과 지식이 콘텐츠에 충분히 반영되는 것이 중요"하다고 했다.

**영상·그림 대 글 지시문 실험** `[검색 요약: 초록·발췌만 봄]`
- Norris & Wong(1997, 쿡탑 발열체 교체)
  - 영상 조건의 평균 오류는 2.6회, 글 조건은 5.6회였다.
  - 영상은 보는 시간이 길었지만 과제를 더 빨리 끝냈다.
  - [오타고대 토론 논문](https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/master/Papers/1997/97-03/dp1997-03-print.pdf) — 오래된 자료다.
- Chirumalla 외(2015): 글+그림·사진·영상은 수행 시간이 비슷했다. 글만 있을 때는 약 3배 오래 걸렸다. ([Design Society](https://designsociety.org/publication/38033/THE+INFLUENCE+OF+DIFFERENT+MEDIA+INSTRUCTIONS+ON+SOLVING+A+PROCEDURAL+TASK))
- Faye 외(2025, 헬기 정비 조립): 영상 형식이 조립 시간을 줄이고 행동 순서를 바로잡았다. 대신 참조 시간은 길었다. ([SAE 2025](https://saemobilus.sae.org/papers/optimizing-comprehension-performance-technical-documentation-adding-multimedia-written-instructions-help-safely-accurately-perform-maintenance-tasks-f-0081-2025-0144))
- 위 연구들은 대부분 소표본이거나 오래됐다. 무관한 삽화는 글과 차이가 없다는 리뷰도 있다.
- [AI] 확인 경로: 각 논문 PDF 원문에서 표본·조건을 대조한다.

**iFixit 완료 집계** ([원문](https://www.ifixit.com/Guide/How+To+Fix+A+Leaky+Faucet/39117))
- 누적 조회 11,704회에 완료 표시는 4~5건이었다.
- 완료 표시는 자발적이므로 완주율로 해석할 수 없다.

**DIY 실패 설문**
- Angi([보도 페이지](https://www.angi.com/press/diy-dreams-vs-reality), "Updated Aug 4, 2026", 표본·방법 미기재)
  - 주택 소유자의 25%가 DIY를 고치거나 마무리하려고 기사를 불렀다. 그중 55%가 후회했다.
  - 기사들이 꼽은 실패 다발 작업은 석고보드 55%, 배관 51%, 전기 51%, 바닥재 48%였다.
  - 11%는 집 손상·부상·안전 위험을 겪었다.
  - 기사를 부른 사람의 87%는 계획보다 시간이 더 들었다(평균 3주). 비용은 평균 $862 더 들었다.
- Insight DIY(영국, 2025-08): DIY 시도자의 29%가 우려가 현실이 됐고, 기사 보수에 평균 £235를 썼다. ([원문](https://www.insightdiy.co.uk/news/study-reveals-the-repairs-uk-homeowners-will-and-wont-risk-attempting/15432.htm)) `[검색 요약]`

### Inferences
- 신뢰 신호로 직접 효과가 확인된 것은 "작업 증거(실사진)·출처·정확한 수치·작성자·갱신일"이다. 구글과 네이버 지침이 같은 방향을 가리킨다. 고장도감의 기존 규칙(원문 대조, AI 이미지 금지, 사례 1건)은 이 방향과 맞는다.
- 완주에는 "단계마다 실사진"과 "유형 분기"가 가장 근거가 두텁다. 실험 연구와 Bob Vila·iFixit의 실무가 이를 뒷받침한다. 영상이 있으면 좋지만 필수는 아니다. 단계별 실사진이 최소 요건이다.
- 실패율이 높은 범주(배관·전기)는 "중단 기준"과 "기사 호출" 섹션을 반드시 둘 근거가 된다. Angi 51%, 실패 4건 중 1건이 그 근거다. 이 섹션은 고장도감의 공임 데이터로 바로 이어지는 연결점이기도 하다.
- 네이버 ④의 "중요한 정보는 텍스트로"는 요약칸·비용표를 이미지가 아니라 에디터 표나 텍스트로 넣어야 하는 공식 근거다. 기존 EDITORIAL_STANDARDS §43과 일치한다.

### Gaps
- 요소별(난이도·시간·비용 상자, 공구 상자, 영상) 체류·완주·전환 데이터는 공개된 것을 찾지 못했다. NN/g 등 UX 연구도 이번에 확인하지 못했다.
  - [AI] 자체 사이트에서 섹션별 스크롤·클릭을 계측한다(기존 UTM·계측 체계 활용).
- 구글 helpful content 문서의 단어 수 관련 문구("preferred word count? No")는 이번 세션에서 원문을 재확인하지 못했다. `[unverified]` — [AI] 같은 문서를 다시 열어 문구를 대조한다.

---

## 3. 2025~2026 검색 노출: 구조화 데이터, 네이버, AI 답변 엔진, 영상의 역할

### Takeaway
구글의 HowTo 리치 결과는 2023-09-14에 폐지됐다. FAQ 리치 결과는 2026-05-07부로 모든 사이트에서 사라졌다. 남은 수단은 세 가지다.
- VideoObject(시청 페이지 한정, key moments)
- 이미지
- 일반 SEO

구글은 AI 기능용 특수 마크업이 필요 없다고 명시했다. 네이버 서치어드바이저는 HowTo·FAQ 구조화 데이터 문서가 없다. 네이버 AI 브리핑은 네이버 블로그를 가장 많이 인용한다(업체 조사 46.5%). ChatGPT와 Gemini는 네이버 블로그를 인용하지 않는다. 그래서 채널 분담은 이렇게 된다.
- 네이버 AI 브리핑: 네이버 블로그
- 구글·ChatGPT 인용: 자체 사이트

### Cited Findings
**구글 HowTo**
- 2023-08-08 데스크톱 한정으로 축소됐다.
- 2023-09-14 갱신문: "Google Search no longer shows How-to rich results on desktop, which means this result type is now deprecated." ([Search Central 블로그](https://developers.google.com/search/blog/2023/08/howto-faq-changes))

**구글 FAQ**
- 2023-08에 "well-known, authoritative government and health websites"로 한정됐다. (같은 글)
- 2026-05-08 변경 기록: "This feature will no longer appear in Google Search starting May 7, 2026."
- 2026-06-15 문서 삭제: "The FAQ rich result feature is no longer shown in Google Search results". ([문서 변경 기록](https://developers.google.com/search/updates))
- Search Console API 지원 종료(2026-08)는 2차 인용이다. ([ppc.land 2026-05-10](https://ppc.land/google-kills-faq-rich-results-what-seos-saw-coming-since-2019/)) `[unverified]` — [AI] 변경 기록 2026-08 항목을 대조한다.

**구글의 기타 정리**
- 2025-06-12 단순화 예고 후, 2025-09-09에 course info, estimated salary, learning video, special announcement, vehicle listing 문서를 삭제했다.
- 2025-11-05에 practice problem과 dataset의 단계적 폐지를 예고했다.
- 2026-01-06에 practice problem 문서를 삭제했다.
- 2026-05-15에 "spam policies also apply to generative AI responses"를 명시했다.
- 2026-07-24에 리뷰 스니펫에 "fake and undisclosed incentivized reviews" 지침을 추가했다.
- ([문서 변경 기록](https://developers.google.com/search/updates))

**VideoObject** ([원문](https://developers.google.com/search/docs/appearance/structured-data/video))
- 필수 속성은 `name`, `thumbnailUrl`, `uploadDate`다.
- key moments는 `Clip` 또는 `SeekToAction`으로 지정한다.
- "VideoObject structured data must be added to a page where users can watch the video."
- YouTube 영상은 설명란 타임스탬프로 key moments가 자동 생성될 수 있다.
- 2026-09-24에 `creator` 속성과 `interactionStatistic` 유형을 문서화했다. ([변경 기록](https://developers.google.com/search/updates))

**이미지와 선호 출처**
- 2026-03-02: 썸네일은 schema.org 마크업과 `og:image`를 모두 참조한다.
- 2026-05-27: 선호 출처(preferred sources)가 AI Overviews와 AI Mode로 확대된다. ([변경 기록](https://developers.google.com/search/updates))

**구글 AI 기능 문서** ([원문](https://developers.google.com/search/docs/appearance/ai-features))
- "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."
- 권장 사항: 크롤링 허용, 내부 링크, 페이지 경험, "structured data matches the visible text", "high-quality images and videos".
- AI Overviews는 "query fan-out" 방식을 쓰고, 고전 검색에 보탬이 될 때만 뜬다.

**구글 AI 최적화 가이드** ([원문](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide))
- fan-out 예시가 바로 how-to다. "how to fix a lawn that's full of weeds"가 "best herbicides for lawns"로 파생된다.
- 하지 않아도 되는 것: "no requirement to break your content into tiny pieces", "no special schema.org markup", llms.txt 같은 AI용 파일.
- 측정은 Search Console의 "Generative AI performance report"로 한다.

**AI Overviews와 YouTube**
- Ahrefs(2025-05-19, 데이터 기준 2025-06-15, 데스크톱 AIO 약 5,580만 건)
  - youtube.com이 AIO 언급 도메인 4위다(2,063,355회).
  - AIO 키워드의 97.70%가 정보형 의도다.
  - ([원문](https://ahrefs.com/blog/insights-from-56-million-ai-overviews))
- BrightEdge 조사를 옮긴 2차 자료는 이렇게 전한다. 2025-01-01 이후 AIO의 YouTube 인용이 25% 이상 늘었다. 교육형 콘텐츠 인용은 35.6% 늘었고, 그중 "how-to" 질의가 22.4%로 가장 많다. ([userp.io 요약](https://userp.io/news/google-ai-overviews-youtube-citations-surge-by-25-21/); [SEL 원문](https://searchengineland.com/youtube-citations-google-ai-overviews-surge-2025-451852)은 403) `[unverified]` — [AI] BrightEdge 원 보고서 페이지를 열어 수치와 기간을 대조한다.
- Surfer(2025-03~08, AIO 3,600만 건)는 YouTube 약 23.3%를 보고했다. ([원문](https://surferseo.com/blog/ai-citation-report)) `[검색 요약]`
- 위 수치는 출처마다 정의가 달라(언급 수, 인용 점유율) 서로 비교할 수 없다.

**한국 AI 답변 인용 출처** — 적정마케팅연구소 조사 ([디지털인사이트 2026-10-15](https://ditoday.com/?p=154900))
- 조사 개요:
  - 비브랜드 검색어 635개, 2026-08-26~09-24
  - AI 답변 21,225건, 인용 출처 85,392건
  - GEO 솔루션 판매사의 조사다.
- 네이버 AI 브리핑: 네이버 블로그 46.5%
- 구글 AIO: 네이버 블로그 7.7%, YouTube·SNS 29.4%
- ChatGPT: 공공기관·단체 사이트 18.0%, 네이버 블로그 0%
- Gemini: 네이버 외 블로그 13.1%, 네이버 블로그 0%
- "소제목·표·FAQ 등 문서 구조 요소는 인용에 큰 영향이 없었다."
- 검색 1페이지와 겹치는 비율: AI 브리핑 50.2%, ChatGPT 4.2%

**네이버 AI 브리핑의 출처 정책**
- 네이버는 AI 브리핑이 인용하는 콘텐츠의 70%가 이용자 생산 콘텐츠라고 밝혔다.
- '네이버 메이트'는 2026년 1월부터 누적한 AI 브리핑 인용 수로 매달 3,000명을 뽑는다. 활동비는 연 약 200억원이다. ([더팩트 2026-05-29](https://v.daum.net/v/20260529165306668))
- 출처는 신뢰도로 정렬한다. 공문서와 공식 사이트가 블로그·카페보다 우선한다.
- 전문 검색이 따로 있다. 공공·건강은 2025-09, 금융은 2025-11에 생겼다.
- 2026-05-14부터 '공식 블로그' 엠블럼(AI 출처 정보)을 붙인다. ([뉴스1 2026-05-13, 다음 게재](https://v.daum.net/v/20260513060234380))
- 원인·이유를 묻는 검색어에는 AI 브리핑이 안정적으로 떴다. 광고가 많은 추천·비교 검색어에서는 잘 뜨지 않았다는 관찰이 있다. ([i-boss](https://www.i-boss.co.kr/ab-6141-71347), 403) `[unverified]` — [AI] 검색 결과 캐시로 원문·표본을 확인한다.

**네이버 서치어드바이저 구조화 데이터** ([소개](https://searchadvisor.naver.com/guide/structured-data-intro))
- schema.org를 쓰고 Microdata 또는 JSON-LD를 권장한다.
- "정상적으로 마크업했을 경우라도 검색결과에 반영된다고 보장하지 않습니다"
- 사이트맵(2026-11-18 조회)의 구조화 데이터 문서 목록:
  - 있음: video, breadcrumb, carousel, rating, recipe, review, restaurant, tvseries, movie, software, address, channel
  - 없음: HowTo, FAQ, Article
- 동영상 검색([원문](https://searchadvisor.naver.com/guide/structured-data-video))
  - VideoObject와 채널(Person) JSON-LD를 쓴다.
  - "한 페이지에 VideoObject를 여러 개 작성하지 마세요"
  - "네이버 제휴제안 작성을 통해 신청"해야 한다. 자동 수집이 아니라 제휴 절차다.

**네이버의 SPA 처리** ([원문](https://searchadvisor.naver.com/guide/seo-advanced-javascript))
- SPA 수집과 색인을 지원한다.
- "HTML의 주요 영역 생성은 … 서버에서 렌더링 … 하는 것을 권장"한다.
- fragment(#) URL은 퍼머링크로 바꾸라고 한다.
- JS·CSS 수집을 막지 말라고 한다.
- JS URL에 timestamp·hash를 넣는 것은 비권장이다.

**저장소 R12(2026-11-18)의 기존 확인 사항** (`docs/research/R12_geo_sns_verified.md`)
- blog.naver.com robots.txt는 GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot 등을 `Disallow: /`로 막는다.
- AI 인용은 그 엔진의 검색이 해당 페이지를 가져오는지, 그리고 질문과 맞는 제목·문단이 있는지에 좌우된다. FAQ·schema·속도는 유의하지 않았다(프리프린트).

### Inferences
- 고장도감 가이드에서 구조화 데이터는 리치 결과용 최소한으로 둔다.
  - BreadcrumbList
  - 자체 영상이 있을 때만 VideoObject(시청 페이지, Clip)
  - 선택적으로 Article
  - HowTo·FAQ 마크업은 구글 노출 효과가 없다. 네이버도 문서가 없다. 다른 엔진이 읽을 수는 있지만 우선순위는 낮다.
- FAQ 리치 결과는 없어졌지만, 질문형 소제목과 바로 아래 1~2문장 답은 여전히 유효하다. 근거는 R12 G5(제목·문단과 질문 일치)와 네이버 ④다. 마크업이 아니라 본문 구조로 대응한다.
- how-to 질의는 fan-out에서 공구·재료 질의로 갈라진다(구글 예시). 그래서 "준비물 상자"는 이렇게 쓴다.
  - 구체적 공구명, 규격, 용도, 대체품을 텍스트로 쓴다.
  - 하위 질의("실리콘 제거 칼 뭐 써요")에 답하는 문단을 둔다.
- 반면 추천·비교·광고성 질의는 AI 브리핑이 잘 뜨지 않는다는 관찰이 있다(`[unverified]`). 제목과 첫 문단은 "원인·방법" 질의에 맞춘다. 공구 추천은 본문 하위 섹션에 둔다.
- 영상은 AI 인용에서 비중이 커지고 있다. 다만 영상의 노출 경로는 페이지에 영상을 넣는 것보다 주로 YouTube 자체를 통한다.
  - 영상을 만든다면 YouTube에 올리고 설명란에 챕터 타임스탬프를 넣는다.
  - 자체 사이트 가이드 페이지에 임베드하고 VideoObject를 단다.
  - 네이버 동영상 검색은 제휴 신청 절차가 필요하다([판단] 사안).

### Gaps
- 네이버 '지식스니펫'의 공식 노출 조건 문서를 서치어드바이저 사이트맵에서 찾지 못했다.
  - [AI] 네이버 검색 공식 블로그 공지를 검색 엔진 결과로 찾는다(blog.naver.com 자동 수집은 하지 않는다).
- 네이버 AI 브리핑이 how-to·생활 수리 질의에서 어떤 출처 유형(블로그·카페·지식iN·클립·외부 웹)을 인용하는지 범주별 데이터는 없다.
  - [AI] 대표 질의 20개를 수동 열람 기록으로 표본 조사한다.
  - [판단] 네이버 검색을 자동 질의할지는 robots·약관상 하지 않는 것이 기본이다. 수동 조사 범위만 정한다.
- ChatGPT·Perplexity의 how-to 출처 선정에 관한 공개 연구는 R12 수준(일반 질의) 이상을 찾지 못했다.

---

## 4. 신뢰받는 가이드 매체는 공구 추천·제휴 링크를 어떻게 결합하는가, 무엇이 신뢰를 깎는가

### Takeaway
세 가지 모델이 있다.
1. 자사 상품을 직접 판매하고 제휴는 따로 표시(iFixit)
2. 단계 섹션 안에 아마존 제휴 링크를 넣고, 전문가 리드 상자도 함께 둔다(Bob Vila)
3. 공구를 사진으로만 보여 주고 링크를 걸지 않는다(This Old House 해당 페이지)

신뢰를 깎는 요인으로 근거가 있는 것은 다음과 같다.
- 수수료 사실 공개 자체가 진술 신뢰를 낮춘다(실험). 그래서 표기는 하되, 추천의 근거와 대안을 함께 보여 주는 쪽이 해법이다.
- 표기 누락이나 불명확 표기는 법 위반이다(한국 2024-12 개정).
- 무조건 칭찬, 단일 판매처, 숨은 인센티브는 플랫폼 지침 위반이다.

### Cited Findings
**iFixit** ([가이드](https://www.ifixit.com/Guide/How+To+Fix+A+Leaky+Faucet/39117), [허브](https://www.ifixit.com/Device/Faucet))
- 공구 목록에 자사 상품(Adjustable Wrench $28.95, 평점 4.8)이 가격·평점과 함께 링크돼 있다.
- 자사가 팔지 않는 품목(Shop Towel)은 아마존 검색으로 연결되고 "Affiliate link"와 "Available for sale on Amazon"이 붙는다. 소유 상품과 제휴 상품을 라벨로 구분하는 방식이다.

**Bob Vila** ([원문](https://www.bobvila.com/articles/how-to-fix-a-leaky-faucet/))
- 절차 섹션 안 "SUPPLIES" 목록이 아마존으로 연결되고 추적 태그(`bv-how-to-fix-a-leaky-faucet-20`)가 붙는다. 일부 링크에는 태그가 없다.
- 받아 온 본문 텍스트에서는 제휴 고지를 찾지 못했다(스크립트로 렌더링됐을 가능성이 있다).
- 같은 사이트의 다른 글에는 "We may earn revenue from the products available on this page and participate in affiliate programs. Learn More ›"가 상단에 있다. ([검색 결과 표제](https://bobvila.com/articles/most-stressful-diy-projects))
- 같은 페이지에 "Talk to a Pro" 리드 상자가 2회 나온다.

**Family Handyman** ([원문](https://www.familyhandyman.com/?p=184251))
- "Our editors and experts handpick every product we feature. We may earn a commission from your purchases."
- "Learn more" 링크와 "Editorial Process" 링크가 있다.
- 아마존 링크에 제휴 태그가 붙어 있다.

**This Old House** ([원문](https://www.thisoldhouse.com/plumbing/how-to-repair-a-dripping-single-handled-faucet))
- 공구 4개를 사진으로만 보여 주고 판매 링크는 없다.

**삼성·LG 자가조치 페이지** ([삼성](https://www.samsungsvc.co.kr/solution/1479918), [LG](https://www.lge.co.kr/support/solutions-20153050762361))
- 본문에 부품 구매 링크가 없다. 소모품샵은 메뉴에만 있다.
- LG는 본문에서 자사 유료 청소 서비스로 연결한다.
- 두 곳 모두 "고장이 아닌 경우 출장 요금 부과"를 고지한다.

**구글 리뷰 지침** ([원문](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews))
- 여러 판매처 링크와 장단점 서술을 권장한다.
- 제휴 링크 자체는 인정한다("Reviews often use affiliate links…").
- `rel="sponsored"` 사용 지침은 이번 세션에 원문 확인을 못 했다. `[unverified]` — [AI] Search Central "Qualify your outbound links" 문서에서 affiliate 링크 속성 문구를 대조한다.

**네이버 서치어드바이저** ([원문](https://searchadvisor.naver.com/guide/content-basic))
- "제품이나 서비스를 소개할 때는 무조건적인 칭찬보다 장단점을 균형 있게 비교하는 콘텐츠가 독자의 신뢰를 얻습니다"
- 허위·과장은 품질 평가에서 불이익을 받는다.

**신뢰 실험**
- 스폰서십 고지는 리뷰어에 대한 신뢰를 낮춘다. 그중 대가나 판매 수수료를 밝힌 고지가 가장 크게 낮췄다. ([UGA Grady](https://grady.uga.edu/research/effects-of-different-sponsorship-disclosure-message-types-on-consumers-trust-and-attitudes), 날짜 미표기)
- 반대 증거도 있다. 제휴 플랫폼 Levanta의 2025-11 미국 1,000명 설문은 "고지가 신뢰를 해치지 않는다"고 했다. 이해관계자 조사다. ([원문 PDF](https://get.levanta.io/hubfs/2025%20Rebranding/Sellers/Gated%20Assets/Affiliate%20After%20AI%20Consumer%20Report/Levanta-Research-Affiliate-After-AI-2025.pdf?hsLang=en))

**한국 법·프로그램** (저장소 `docs/research/R14_affiliate.md`, 2026-11-18 검증본)
- 2024-12-01 개정 추천·보증 심사지침은 구매링크 판매실적 수수료를 표시 대상 예시에 넣었다.
- 블로그는 "제목 또는 첫 부분"에 표시해야 한다.
- "받을 수 있음" 같은 조건부 문구는 불명확 예시다.
- 근거는 공정위 보도참고자료 2024-11-15(korea.kr newsId=156660604 첨부 PDF, R14 §2 출처 목록)다. 이번 세션에서 다시 열지는 않았다.
- 쿠팡 광고 스크립트로 인한 개인정보 수집 과징금 사례(2026-06)가 있어, 자체 사이트에는 텍스트 링크만 쓰도록 권고돼 있다.

### Inferences
**가이드 안 공구 추천의 배치 규칙**
1. 글 첫 부분에 인용구 한 줄로 제휴 표기를 한다(편집 규칙 4, 공정위).
2. "준비물 상자"는 링크보다 먼저 판단 정보를 준다. 용도, 규격, "집에 있는 것으로 대체 가능한지", "이 작업 한 번이면 사지 말고 빌릴지"를 쓴다.
3. 링크는 상자 안에만 넣는다. 가능하면 판매처 2곳 이상(쇼핑 커넥트와 다른 판매처)을 텍스트 링크로 단다.
4. 단계 본문에는 링크를 넣지 않는다. 이는 Bob Vila와 반대 방식이며, 읽는 흐름을 지키기 위한 판단이다.

**이해상충의 해법은 비용표다**
- 수수료는 "공구·재료 구매"에서만 생긴다(R14 §0-6).
- 그래서 DIY 대 기사 비용표에 "공구를 새로 사면 DIY가 기사보다 비싸지는 경우"까지 정직하게 적는다.
- 그러면 제휴가 판단을 왜곡하지 않았다는 증거가 된다. 분석한 매체 중 이 장치를 둔 곳은 없다.

**소유 대 추천 구분**
- 고장도감은 상품을 팔지 않는다. iFixit식 "자사/제휴" 라벨 대신, "직접 써 본 공구"와 "써 보지 않고 사양만 비교한 공구"를 구분해 표시하는 편이 신뢰 신호로 맞다.
- 구글 리뷰 지침의 "evidence … of your own experience"와 네이버 ①이 근거다.
- 이 구분 표시를 할지는 [판단]이다.

**신뢰를 깎는 패턴** (근거 있음)
- 표기 누락이나 하단 표기(법)
- 단일 판매처, 무조건 칭찬(네이버·구글 지침)
- 리드 상자와 제휴 링크가 겹쳐 수익 동기가 과도하게 드러나는 배치(Bob Vila의 이중 구조): 위험 추정이며 직접 근거는 없다.
- 숨은 인센티브(구글 2026-07 리뷰 스니펫 지침)

### Gaps
- Home Depot·Lowe's의 "shop this project" 모듈(소매업체가 소유한 상품 묶음)을 열람하지 못했다. 403이다. 확인 경로는 1번 질문과 같다.
- 가이드 안 제휴 링크의 위치(상단·상자·본문)별 클릭률이나 신뢰 차이를 다룬 공개 연구는 찾지 못했다.
  - [AI] 자체 사이트에서 위치별 클릭을 계측하고, 쇼핑 커넥트 대시보드의 상품별 클릭을 기록한다.

---

## 5. 네이버 블로그 글과 자체 사이트 가이드 페이지는 이 형식에서 무엇이 달라야 하는가

### Takeaway
두 지면은 도달하는 엔진이 다르다.
- 네이버 블로그는 네이버 검색과 AI 브리핑(인용 46.5%)용이다. AI 크롤러가 차단돼 ChatGPT·Gemini·Perplexity에서는 사실상 인용되지 않는다(0%).
- 자체 사이트는 구글(AIO 포함)과 ChatGPT·Perplexity 인용의 유일한 경로다. 구조화 데이터(VideoObject·Breadcrumb), 서버·사전 렌더링, 퍼머링크, 계측을 쓸 수 있다.

그래서 같은 주제를 이렇게 나눈다.
- 블로그는 사람 독자용 완결형으로, 사진·짧은 문장·에디터 표를 쓴다.
- 자체 사이트는 갱신되는 정본으로, 비용표·출처·영상·제보 연결을 둔다.

### Cited Findings
**네이버 블로그 robots** (저장소 R12 §1, 2026-11-18 직접 확인)
- AI 학습·RAG 목적 봇 접근을 금지한다.
- GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot 등이 `Disallow: /`다.
- Googlebot은 일부 경로만 막혀 있다.

**인용 분포** ([디지털인사이트 2026-10-15](https://ditoday.com/?p=154900))
- 네이버 블로그 인용률은 AI 브리핑 46.5%, 구글 AIO 7.7%, ChatGPT 0%, Gemini 0%다.

**네이버 보상 구조** ([더팩트 2026-05-29](https://v.daum.net/v/20260529165306668))
- 네이버는 블로그를 포함한 UGC 창작자를 AI 브리핑 인용 수로 선발하고 보상한다(메이트).
- 네이버 블로그 지면을 유지할 직접 유인이다.

**자체 사이트(SPA)의 네이버 수집 조건** ([서치어드바이저 JS 가이드](https://searchadvisor.naver.com/guide/seo-advanced-javascript))
- 주요 HTML 영역은 서버 렌더링을 권장한다.
- fragment URL은 금지하고, JS·CSS 수집은 허용해야 한다.
- 고장도감의 사전 렌더링(prerender) 구조와 맞는다.

**자체 사이트의 구글 수단**
- 구조화 데이터는 보이는 텍스트와 일치해야 한다. 이미지와 영상으로 본문을 보강한다. ([AI 기능 문서](https://developers.google.com/search/docs/appearance/ai-features))
- VideoObject는 시청 페이지에 단다. ([원문](https://developers.google.com/search/docs/appearance/structured-data/video))
- 생성형 AI 성과는 Search Console에서 측정한다. ([AI 최적화 가이드](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide))

**네이버 콘텐츠 지침** ([원문](https://searchadvisor.naver.com/guide/content-basic))
- 중요한 정보는 이미지 안에만 넣지 말고 텍스트로도 쓴다.
- 가격·정책은 최신 상태로 유지한다.
- 웹 문서와 블로그 모두에 적용되는 원칙이다.

**저장소의 기존 네이버 원고 제약** (`docs/blog/EDITORIAL_STANDARDS.md`, naver-export 검사)
- 이미지 3~6장
- 제목 45자 이하
- 태그 10개 이하
- 표 3열 이하
- 표는 이미지가 아니라 에디터 표로 넣는다.

### Inferences
**지면별 분담안**

| 항목 | 네이버 블로그 원고 | 자체 사이트 가이드 페이지 |
|---|---|---|
| 역할 | 네이버 검색·AI 브리핑 인용, 사람 독자 완결 | 정본(갱신), 구글·ChatGPT·Perplexity 인용, 제보 수집 |
| 분량 | 핵심 단계와 비용 요약. 사진 3~6장 제약 안에서 단계 사진을 고른다 | 전 단계(단계마다 사진), 유형별 분기 전부, 상세 비용표 |
| 비용 정보 | 요약 숫자 1~2개 + 확인일 + 사이트 비용 페이지 링크(UTM) | 공임 분포·표본 수·출처 전체, 갱신일 |
| 공구 상자 | 3열 이하 에디터 표, 쇼핑 커넥트 링크(네이버 정책상 불이익 없음이 공식 확인된 유일한 형태, R14 §0-5) | 텍스트 링크 2곳 이상, 스크립트·배너 없음(R14 §0-7) |
| 구조화 데이터 | 해당 없음 | BreadcrumbList, (자체 영상 시) VideoObject+Clip, 선택적 Article. HowTo·FAQ 마크업은 우선순위 낮음 |
| 영상 | 네이버 동영상(클립) 삽입은 선택 | YouTube 임베드 + 시청 페이지 VideoObject. 네이버 동영상 검색은 제휴 신청([판단]) |
| 갱신 | 발행 후 수정 최소. 가격 변동 시 사이트 링크로 위임 | 확인일과 데이터 갱신을 상시 반영(네이버 ⑤, R12 G6 "오래된 날짜 방치 금지") |
| 피드백 | 댓글 | "따라 해 보셨나요" 버튼 → 제보 폼(iFixit 완료 집계·삼성 도움 여부 모델) |

- 같은 글을 두 곳에 통째로 복제하는 대신 역할을 나눈다.
  - 블로그는 "한 품목·한 독자" 요약 완결본으로 쓴다.
  - 사이트는 분기와 표가 많은 정본으로 쓴다.
  - 중복 문서 문제와 갱신 부담을 함께 줄이는 판단이다.
- 네이버 지침에는 "다른 사이트를 무단으로 복제하거나 짜깁기"하지 말라는 점검 항목이 있다. 자기 콘텐츠의 교차 게시가 어떻게 취급되는지는 확인하지 못했다(아래 Gaps).

### Gaps
- 네이버가 같은 운영자의 블로그 글과 자체 사이트 문서를 중복으로 보는지, 공식 기준을 찾지 못했다.
  - [AI] 서치어드바이저 가이드(seo-basic·content-abusing 등 robots 허용 경로)를 추가로 열람한다.
- 네이버 블로그의 분량·이미지 수와 노출의 관계에 대한 공식 근거는 없다(업계 통설뿐이다).
  - [AI] 저장소 R10(국내 블로그 레퍼런스)과 대조한다.
- 자체 사이트 가이드가 네이버 웹문서 검색과 지식스니펫에 실제로 노출되는지는 발행 후에만 확인할 수 있다.
  - [AI] 서치어드바이저 수집 현황을 점검한다.
  - [현장] 서치어드바이저 소유 확인에 계정 로그인이 필요하다.
