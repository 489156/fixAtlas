# R11. 미국 블로그 레퍼런스 + 디자인 패턴

작성 2026-11-18 · 웹 데스크리서치 · **모든 페이지 열람일 2026-11-18** · 출처 ID는 문서 끝 목록 참고 · 인용은 출처당 15단어 이하

## 결론 3줄
1. 미국 비용 가이드는 첫 화면을 대부분 **범위 + 평균 + 갱신일 + 견적 CTA**로 짠다. 표본 수를 숫자로 밝힌 곳은 TOH의 "2,000명 설문" 하나뿐이다 [U1]. FixAtlas의 "표본 N·출처·기준일" 칩은 그대로 차별점이 된다.
2. 신뢰도 차이는 저자 이름보다 **검수자, 방법론 링크, 날짜, 숫자 일관성**에서 났다. 그대로 가져다 쓰기 좋은 사례는 셋이다. Bankrate는 작성·편집·검수 3단 바이라인을 쓴다 [U9]. RepairPal은 공임과 부품을 나누고 갱신일을 밝힌다 [U4]. iFixit은 난이도·시간·도구를 맨 위에 두고 단계마다 주의 라벨을 붙인다 [U6].
3. 공개 반응 신호를 보여준 곳은 10곳 중 iFixit뿐이었다(댓글 0, 조회 2.5K) [U6]. 디자인 규칙은 NN/g의 역피라미드·F패턴·모바일 표 연구 [D1–D3]와 WCAG 기준(CJK 40자, 줄간격 1.5, 색만으로 정보 전달 금지) [D5–D9]을 근거로 정했다. Mobbin 상세 패턴 페이지는 403으로 막혀 볼 수 없었다 [M2].

## 1. 레퍼런스 10개

| # | 매체·유형 | 제목 공식 | 첫 화면·톤 | 가격·이미지·날짜·방법론 | 저자·검수 / 제휴 고지 | CTA / 공개 반응(보이는 그대로) | FixAtlas 한 줄 |
|---|---|---|---|---|---|---|---|
| 1 | This Old House (집 수리 비용) [U1] | 질문형 "How Much Does Appliance Repair Cost?" | 고지 2개 → H1 → 한 줄 범위("usually cost between $50 and $500") → 우편번호 견적 위젯 → 바이라인 → 목차 11개. 실용적, 독자에게 "당신"이라고 말하는 톤 | 표(Appliance Type / Average Repair Cost / Typical Cost Range). "Homeowner Insights" 박스에 설문 2,000명. "Updated 06/05/2026". 방법론은 한 문장. 본문 이미지는 히어로 1장 | 작성자 1명, 검수 라벨 없음. "Pro Tip" 박스로 전문가 인용. **고지는 H1 위**에 2개 | "Get Your Estimate". 누르면 제휴사(All Star Pros)로 넘어간다고 고지. 댓글·별점·도움됨 **없음**, 피드백은 이메일 | 설문 N 박스는 차용. 헤드라인 상한 $500과 표 상한 $650이 어긋나는 실수는 피함 |
| 2 | Bob Vila (집 수리 비용) [U2] | "How Much Does Water Heater Repair Cost?" | 히어로 → 두 줄 가격 박스("Typical Range" $221–$964 / "National Average" $591) → 도입 → CTA. 목차 없음. 안심시키면서 서두르게 하는 톤 | 표 없음, 수리 유형별 H3에 범위. 비용 요인 섹션 있음. 이미지 5장(alt 동일). **날짜 표시 없음**. 출처는 이탤릭 한 줄(Angi·HomeAdvisor·HomeGuide) | 기고 작가, 검수 없음. 제휴 고지는 확인 범위 안에서 없음 | 똑같은 "Find Pros Now" 블록 **5회**(Angi 연결). 반응 신호 없음 | 두 줄 가격 박스는 차용. 날짜 없음, CTA 반복은 금지 |
| 3 | Fixr (비용 가이드) [U3] | "How much does it cost to repair a dryer?" | 4칸 요약 박스(전국 평균 $150 / 평균 범위 $100–$200 / 최저 $50 / 최고 $450) + "Get local cost" + **"How we get this data" 링크** | 표 6개(유형·수리·부품·증상·브랜드·수리 vs 교체), 차트 없음. "Updated: January 31, 2025". 방법론은 가격 DB, 면허 업체, 업계 전문가 | **작성자와 검수자가 같은 사람**. 면책 문구는 푸터 | CTA 5곳(지역 비용·업체 찾기 2회·견적 비교·견적 받기). 반응 없음 | 4칸 박스 바로 밑에 방법론 링크, "증상별 표"가 FixAtlas와 가장 가까움 |
| 4 | RepairPal (자동차 수리 견적) [U4] | "[작업] Cost Estimate" | 총액 $335–$394, **공임 $122–$179 / 부품 $213–$215 분리**, "Estimates last updated September 3, 2026", 차종 선택 후 "Get My Estimate" | 면책 "does not include taxes and fees"와 "does not factor in your unique location". 표본·방법론 표시 없음. 차종별 범위는 카드 그리드로 | 저자 없음. "RepairPal Certified" 배지 | "Schedule Repair". 리뷰·별점 없음 | 공임/부품 분리와 "포함 안 된 것" 명시를 가격 박스 표준으로 |
| 5 | Family Handyman (DIY) [U5] | 증상 질문 + 약속: "Dryer Not Heating? Try Replacing This One Simple Part" | 아이콘 3행(Time / Complexity "Intermediate" / Cost "$20-50") + 공구 목록 + 오디오·영상. 1인칭 대화체 | 박스는 "$20-50"인데 도입부는 "less than $25"(불일치). 프로 출장 약 $200, 새 제품 약 $800을 글로 비교. 단계 사진. "Updated on Sep. 27, 2024" | 30년 이상 경력 수리기사, "Editorial Process" 링크. 검수 라벨 없음. 제휴 고지는 푸터 링크만 | 뉴스레터, 잡지, 외부 부품몰 링크. 반응 없음. 안전 문구는 박스 없이 굵은 글씨로 | "DIY 비용 vs 기사 호출 vs 교체" 3단 비교 차용 |
| 6 | iFixit (수리 가이드) [U6] | "[브랜드] [제품] [부품] Replacement" | 난이도 Moderate · 12단계 · "45 minutes - 1 hour" · 도구·부품 목록 | 도구 가격·평점 일부($16.95, 4.6). 단계마다 글머리표와 사진. "Last updated on Jun 12, 2026" | 작성자 평판 7,236, 작성 가이드 224개, 기여자 +2. 제휴 링크는 항목마다 "Affiliate link" 라벨 | 단계마다 "Add a comment". **댓글 0, 조회 2.5K(30일 514)**. 완료 수는 공개 숫자를 확인 못 함 | 맨 위에 난이도·시간·도구, 단계 안에 "Caution:" 라벨 |
| 7 | Reviewed (USA TODAY 계열, 제품 테스트) [U7] | "The Best Washing Machines of 2026" | **H1 바로 아래 고지** → "Why trust Reviewed?" → 번호 매긴 추천 카드(사진·한 줄·장단점·가격 버튼) → 요약 "The Rundown" | "Updated January 13, 2026". 테스트 항목은 얼룩 제거·마모·잔수·사이클 시간. 비교표 2개 | 4인 바이라인 + 직함(연구소 운영 매니저 등) | "Check Price at Home Depot". 반응 없음, "Editor's Choice" 배지만 | 제품 페이지는 카드 + 장단점 + 테스트 항목 명시 |
| 8 | RTINGS (전자제품 테스트, **부분 확인**) [U8] | "The 6 Best TVs of 2026" / "[모델] Review" | 사이트 차원 수치 "559 TVs bought and tested" 바로 아래 제휴·멤버십 고지 | 방법론 변경 이력 페이지("Test Bench 1.1: Changelog")가 있음. 본문(점수·날짜·저자)은 JS로 렌더링돼 확인 못 함 | 확인 못 함 | 도구 메뉴(Compare, Results Table Tool, Custom Ratings, Vote)만 보임. 투표 수는 없음 | "누적 검증 견적 N건" 수치 + 방법론 버전 이력 |
| 9 | Bankrate (금융) [U9] | 비용 + 결정형: "How much does a home inspection cost, and do I need one?" | "Advertiser Disclosure" → H1 → **Written / Edited / Reviewed by(CFP®)** + "Expert verified" 배지 → "Published on February 07, 2025 \| 4 min read" → 목차 | 평균 $343, 범위 $296–$424(HomeAdvisor 인용)를 강조 박스로. 출처 목록에 **접근일**. 표 없음 | "Bankrate is always editorially independent." 고지를 위아래 반복 | "Cite us"·공유 버튼. 공개 수치 없음. **비공개** "Did you find this page helpful?"(예/아니오 + 200자) | 작성·검수 2단 바이라인, 출처 접근일, 비공개 피드백 |
| 10 | Ahrefs 블로그 (마케팅 교육) [U10] | "주제: 입문 가이드" ("SEO Basics: Beginner's Guide…") | 상단 프로모 배너 3개 → H1 → Contributors·Reviewed by → 챕터 내비(01–09)·목차. 핵심 요약은 **글 끝**에 | 날짜는 "March 30, 2021"뿐이고 갱신 라벨이 없음(참고문헌 접근일은 2025년). 자사 도구 스크린샷, 참고문헌 1–8 | 검수자 표기 있음 | 가입 버튼·도구 링크. 반응 없음 | 시리즈 챕터 내비와 번호 참고문헌 차용. 옛 날짜만 남겨두는 실수는 피함 |

## 2. 신뢰성 장치 패턴

**가격 범위**
- 가장 많은 형식은 범위와 평균을 함께 쓰는 것이다(TOH·Bob Vila·Fixr·Bankrate) [U1–U3, U9]. 최저·최고값까지 두면 4칸이 된다(Fixr) [U3].
- 금액을 쪼개 보여주는 곳도 있다. RepairPal은 공임/부품 [U4], Fixr는 진단비·시급을 따로 적는다 [U3].
- 가격에 무엇이 빠졌는지 적은 곳은 RepairPal뿐이다(세금·지역) [U4].
- **숫자가 서로 어긋나는 사례가 2건** 있었다. TOH 헤드라인 $500 vs 표 $650 [U1], FH 박스 $20-50 vs 본문 <$25 [U5]. 신뢰를 직접 깎는다.

**업데이트일**
- 8곳은 날짜를 맨 위에 둔다. 갱신일로 쓰는 곳(Updated·Last updated)과 발행일로 쓰는 곳(Published)이 섞여 있다.
- Bob Vila는 날짜가 화면에 없다 [U2]. Ahrefs는 2021년 날짜만 남아 있다 [U10].
- RepairPal은 문서가 아니라 **"추정치" 갱신일**을 적는다 [U4]. 데이터형 서비스에 맞는 표현이다.

**방법론·출처**
- 요약 박스 바로 아래에 방법론 링크를 둔다(Fixr) [U3].
- 테스트 항목을 나열한다(Reviewed) [U7]. 방법론 버전과 변경 이력 페이지를 둔다(RTINGS) [U8].
- 출처 목록에 접근일을 적는다(Bankrate) [U9]. 출처를 이탤릭 한 줄로만 적는 곳도 있다(Bob Vila) [U2].
- 표본 수는 TOH 설문 2,000명이 유일하다 [U1].

**저자·검수**
- 검수 라벨을 쓴 곳은 Bankrate(자격증 보유 검수자 + 배지)·Ahrefs·Fixr 세 곳이다 [U9, U10, U3]. 그중 **Fixr는 작성자와 검수자가 같다** [U3].
- 실무 경력을 앞세우는 곳: FH(30년 수리기사), iFixit(커뮤니티 평판 점수) [U5, U6].
- NN/g는 신뢰의 네 요인 중 하나로 비용·수수료 공개 같은 **투명성**을 든다 [D4].

**제휴 고지**
- H1 위나 바로 아래에 둔다(TOH·Reviewed·Bankrate·RTINGS) [U1, U7, U9, U8]. iFixit은 링크마다 라벨을 붙인다 [U6].

## 3. 디자인 규칙 (근거 포함)

**공통 원칙**
- 결론을 맨 위에 둔다(역피라미드) [D2]. 첫 두 문단에 핵심을 담는다 [D1].
- 소제목은 정보가 가장 많은 단어로 시작한다. 관련 정보는 테두리나 배경으로 묶는다 [D1].

### (1) 네이버 블로그 글 (스타일 제한)
1. **제목**: 「[품목] [작업] 비용 | 실제 견적 N건 · 2026.11 기준」. 핵심 단어를 앞에 둔다 [D1]. 미국 사례는 질문형과 연도 표기가 다수다 [U1–U3, U7].
2. **첫 화면 = 인용구 박스 1개**에 네 줄만 넣는다: 범위·중앙값 / 표본 N / 기준일 / 안전 등급. Bob Vila 두 줄 박스와 Fixr 4칸 박스를 텍스트로 옮긴 형태다 [U2, U3]. 결론을 먼저 쓴다 [D2].
3. **표는 2~3열**까지만(항목 / 범위 / 비고). 첫 열은 항목명으로 한다. 글이 긴 비교는 2열이 한계다 [D3]. 표 위에 결론 한 문장을 둔다 [D2].
4. **출처·날짜 줄**: 요약 바로 아래에 「출처: 영수증 N · 공식 단가표 N | 기준일」을 둔다. 방법론 링크를 같은 자리에 둔 Fixr 패턴이다 [U3].
5. **안전 표시**는 텍스트 라벨로 한다. 예: 「[주의] 220V·가스 → 기사 호출」. 색만으로 표시하면 안 된다 [D9]. 해당 단계 안에도 반복한다(iFixit "Caution:") [U6].
6. **CTA는 2회**만 둔다: 요약 직후에 약하게, 글 끝에 강하게. 같은 블록 5회 반복은 하지 않는다 [U2, U3].
7. **문단은 2~3문장**으로 짧게 쓰고 굵은 글씨는 핵심 수치에만 쓴다 [D1, D10].

### (2) FixAtlas 사이트 글·제품 페이지
1. **위계**: 경로 표시(breadcrumb) → H1 → 한 줄 범위 문장 → 메타 칩 → 요약 박스 → 안전 배지 → 목차 → 비용 요인 → 항목·증상별 표 → DIY vs 기사 vs 교체 → 방법론 → 출처(접근일 포함) → FAQ → 견적 제출 CTA [U1, U3, U5, U9].
2. **요약 박스**: 중앙값 / 범위(P25–P75) / 최저·최고 / 표본 N / 공임·부품 분리 / "포함 안 됨"(출장비·VAT 등) [U3, U4].
3. **메타 칩**: 「기준일 2026-11」「표본 37건」「검수: ○○ 기사」「방법론 v1.0」. 날짜는 *데이터 갱신일*로 표기한다 [U4]. 방법론 버전 이력은 RTINGS를 참고한다 [U8]. 작성자와 검수자는 다른 사람이어야 한다 [U3 반례, U9].
4. **본문 폭·글자**:
   - 본문은 16px 이상 [D10], 줄간격 1.5 이상 [D7, D10].
   - 한 줄은 **CJK 40자 이하**로 한다(AAA 권고) [D5]. 데스크톱 최대 폭은 약 40em이다(추론: 16~17px 기준 640~680px).
   - 양쪽 정렬은 하지 않는다 [D5, D10]. 대비는 4.5:1 이상이다 [D8].
   - 12px 미만 텍스트는 쓰지 않는다 [D11].
5. **모바일 표**:
   - 첫 열을 고정하고 머리행은 sticky로 둔다. 가로 스크롤은 잘린 열로 드러낸다 [D3].
   - 표는 리플로우 예외다. 다만 주변 제목·필터는 320px에서 리플로우돼야 한다 [D6].
   - 숫자 표는 4열까지 쓰고, 설명형 표는 2열로 한다 [D3].
6. **안전 배지**: 3단계(직접 가능 / 주의 / 기사 필수)로 둔다. 아이콘 + 텍스트 + 형태로 구분하고 색만 쓰지 않는다 [D9]. 위치는 요약 박스와 해당 단계 두 곳이다 [U6].
7. **CTA 배치**:
   - 요약 박스 아래에 보조 버튼, 가격 표 직후에 맥락형 문구(「이 범위보다 비쌌나요? 견적 공유」), 글 끝에 주 버튼을 둔다. 최대 3개다.
   - 제3자 리드 폼을 H1 위나 바로 아래에 두지 않는다 [U1, U2].
8. **반응 신호**: 공개 좋아요 대신 표본 N과 "이 글로 견적 비교한 사람 N"을 쓴다. 숫자가 작을 때는 Bankrate식 비공개 도움됨 위젯을 둔다 [U9]. iFixit처럼 "댓글 0"이 그대로 보이면 역효과일 수 있다 [U6].
9. **제품 페이지**: 카드(사진·한 줄 평·장단점·가격·판매처) + 스펙 블록 + "가격은 게시 시점 기준" 문구 [U7].

## 4. Mobbin 접근 결과
- 홈페이지(mobbin.com)는 열람됐다. 화면 60만 개 이상을 다루고 무료 계정은 "limited access"라고 적혀 있다. 패턴 유형으로 대화상자·내비게이션·폼·표 등을 든다 [M1].
- `/explore`, `/explore/mobile/screens/article-detail`, `/explore/web/screens/post-detail`은 모두 **HTTP 403**이었다. 그래서 실제 화면 예시는 확인하지 못했다 [M2].
- 검색 결과 요약에는 "Article Detail" 패턴(모바일 1,767 화면)과 Medium·Pinterest 예시가 나왔다. 페이지를 직접 열지 못해 근거로 쓰지 않았다.
- 대체 근거로 NN/g [D1–D4], WCAG [D5–D9], USWDS [D10], Lighthouse [D11]를 썼다.
- Material Design 타이포 페이지(m3·m2)는 JS로만 렌더링돼 본문을 받지 못했다. 그래서 USWDS로 대체했다.

## 5. FixAtlas에 적용할 것 / 피할 것

**적용할 것**
- 4칸 가격 박스 + 공임·부품 분리 + "포함 안 됨" [U3, U4]
- 표본 N을 박스 안에 둔다. 미국 사례에서 유일하게 차별화되는 지점이다 [U1]
- 요약 박스 바로 아래 방법론 링크와 방법론 버전 이력 [U3, U8]
- 작성/검수 분리 바이라인과 출처 접근일 [U9]
- 난이도·시간·도구 메타, 단계 안 주의 라벨 [U5, U6]
- 제휴가 있으면 H1 바로 아래 한 줄 고지 [U7]

**피할 것**
- 요약과 표의 숫자 불일치 [U1, U5]
- 날짜 없음, 옛 날짜만 남김 [U2, U10]
- 작성자가 곧 검수자 [U3]
- 같은 CTA 5회 반복 [U2, U3]
- H1 위 프로모 배너·리드 폼 [U1, U10]
- 색만으로 표시하는 안전 등급 [D9]

## 6. 확인 못 한 항목
- **차단됨**:
  - WebFetch 차단: Wirecutter(nytimes.com), Serious Eats
  - HTTP 403: Consumer Reports, HomeGuide, Angi, Forbes Home, Mobbin 탐색 페이지
  - 검색·열람 모두 불가: The Spruce, Good Housekeeping
- **본문 미수신**:
  - NerdWallet: 내비게이션만 받음
  - Thumbtack: 빈 페이지
  - RTINGS: 점수·날짜·저자 등 본문이 JS 렌더링이라 못 받음
  - Material Design: 본문 못 받음
- RTINGS "Tested using Methodology" 줄은 검색 요약에만 나와 미검증이다.
- iFixit "완료" 수는 로그인 상태에 따라 다른 문구라 공개 숫자를 확인하지 못했다.
- Bob Vila·FH의 제휴 고지가 정말 없는지는 추출된 텍스트 기준이다. 화면 렌더링으로 재확인이 필요하다.
- 네이버 스마트에디터 ONE에서 표·인용구가 모바일에 어떻게 보이는지는 확인하지 못했다. 공식 브로셔 PDF는 용량 초과였고, 찾은 보도자료는 2007년 구버전이었다. 실제 앱에서 시험 게시가 필요하다.
- 데스크톱 최대 폭 640~680px은 WCAG 40자를 바탕으로 한 추론이다. 실측하지 않았다.

## 출처 (모두 열람 2026-11-18)
- [U1] https://www.thisoldhouse.com/home-finances/appliance-repair-cost
- [U2] https://www.bobvila.com/articles/water-heater-repair-cost/
- [U3] https://www.fixr.com/costs/dryer-repair
- [U4] https://repairpal.com/estimator/brake-pad-replacement-cost
- [U5] https://www.familyhandyman.com/project/replace-hi-limit-fuse/
- [U6] https://www.ifixit.com/Guide/Whirlpool+Dryer+Belt+Replacement/207502
- [U7] https://www.reviewed.com/laundry/best-right-now/best-washers
- [U8] https://www.rtings.com/tv/reviews/best/tvs-on-the-market · https://www.rtings.com/tv/reviews/lg/c5-oled · https://www.rtings.com/robot-vacuum/tests/changelogs/1-1
- [U9] https://www.bankrate.com/mortgages/how-much-does-home-inspection-cost/
- [U10] https://ahrefs.com/blog/seo-basics/
- [D1] NN/g, F-Shaped Pattern (Pernice 2017, 재검토 2026-08-19) https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- [D2] NN/g, Inverted Pyramid (Schade 2018) https://www.nngroup.com/articles/inverted-pyramid/
- [D3] NN/g, Mobile Tables (Schade 2017) https://www.nngroup.com/articles/mobile-tables/
- [D4] NN/g, Trustworthy Design (Harley 2016) https://www.nngroup.com/articles/trustworthy-design/
- [D5] WCAG 2.2 SC 1.4.8 (AAA) https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
- [D6] WCAG 2.2 SC 1.4.10 Reflow (AA) https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- [D7] WCAG 2.2 SC 1.4.12 Text Spacing (AA) https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- [D8] WCAG 2.2 SC 1.4.3 Contrast (AA) https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- [D9] WCAG 2.2 SC 1.4.1 Use of Color (A) https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- [D10] U.S. Web Design System, Typography https://designsystem.digital.gov/components/typography/
- [D11] Chrome Lighthouse, legible font sizes https://developer.chrome.com/docs/lighthouse/seo/font-size
- [M1] https://mobbin.com/ · [M2] https://mobbin.com/explore (403), https://mobbin.com/explore/mobile/screens/article-detail (403), https://mobbin.com/explore/web/screens/post-detail (403)
