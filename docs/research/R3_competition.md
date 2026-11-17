# R3 공급측·경쟁 조사 (FixAtlas / 고장도감)

작성일 2026-11-17 · 방법: 웹 데스크 리서치(WebSearch/WebFetch) · 표기: 출처 [S번호]는 문서 끝 목록, `[미검증]`은 직접 열람 실패이며 확인 경로를 병기.

## 1. 결론 (3줄)
1. 한국에서 "모델×증상별 실결제 수리비 분포"를 구조화해 공개하는 서비스는 확인 가능한 범위(제조사·가격비교·검색 노출 블로그·Clien)에서 찾지 못했다. 가격 단서는 Clien·DC 등 비정형 후기와 출처 불명 SEO 블로그에 흩어져 있다. 단, 네이버 카페·블로그·인스타·Threads·Reddit은 도구로 열람 불가라 "부재 증거"가 약하다(§5).
2. 제조사는 견적을 "진단 후 통보"로 운영하고 증상별 가격표를 내지 않는다(LG만 출장점검료 공개). 가장 센 실전 경쟁자는 대형 네이버 카페(효녀로청, 회원 10만~15만 자체 주장 [미검증])와 검색 상위 SEO 블로그다.
3. 해자는 UI가 아니라 "영수증·접수증으로 검증된 데이터 + 증상 분류체계"다. 콜드스타트 위험이 크고 카페 운영자·다나와가 UI는 빠르게 복제할 수 있다. 판정: 초기 해자 약, 검증 데이터 축적 후 중간.

## 2. 경쟁 지도

| 카테고리 | 이름 / URL | 제공 내용·규모 | 수익모델 | 위협도 |
|---|---|---|---|---|
| 제조사 | 삼성전자서비스 samsungsvc.co.kr [S1][S2] | 스스로해결, AI봇, 요금안내 메뉴, 소모품샵. 로봇청소기 점검코드 C00~C09 표(2026-10-02) 있으나 가격 없음. 117개 센터에 로봇청소기 전담 인력(회사 주장, 2026-02-11) [S14] | AS·소모품·케어플러스(로봇청소기 미기재 [S33]) | 중 |
| 제조사 | LG전자 lge.co.kr/support [S3][S4][S5] | ThinQ 기반 고장 증상 진단, 소음 AI 진단. 요금=부품+기술료+출장비(점검료 28,000원, 저녁·휴일 33,000원). 재생부품가격 조회는 PC 제품 한정 | AS·구독 케어 | 중 |
| 제조사 | 다이슨코리아 [S6][S7] | 센터 9곳, 약 10분 진단 후 예상비용·시간 안내, 가격표 미공개(2025-06-09). 72시간 내 수리 불가 시 대여, AI챗봇(2026-09-07). 공식 사이트는 403으로 미열람 | 부품·Total Restore | 중하 |
| 제조사/유통 | 로보락(팅크웨어모바일) [S10][S11][S12] | 택배·직배수형 방문, 하이마트 300+개 접수, 22개 수리거점(2025-02-19). 에러코드·가격표 미확인 | AS·소모품 | 하 |
| 제조사/유통 | 드리미(콜론글로벌·SK네트웍스서비스) [S8][S9] | 직영 AS 없음, 센터 약 29+30곳, 하이마트 310+개 접수(2026-08-21). 가격 정보 없음 | AS | 하 |
| 제조사 | 에코백스·아이로봇 [S15] | 에코백스 공식 AS 페이지 미확인 [미검증]. 아이로봇은 2025-12 파산보호·피시아 인수, 한국 AS 상황 [미검증] | - | 하 |
| 독립 AS | 롯데하이마트 AS e-himart.co.kr/app/as [S13] | 다브랜드 수리 접수, 진단 후 전화로 금액 안내, 가격표 없음, 케어 플랜 | 수리·케어 | 중 |
| 현장 운영 | 마이스터즈 [S16] | 엔지니어 400+, 센터 25곳, 매출 270억(2025), B2B(쿠팡 등), 시리즈B 200억 추진, 소비자 가격정보 없음(2026-07-28) | 기업 위탁 | 중(데이터 보유자) |
| 매칭 | 숨고 [S44][S22] | 가전수리 평균 6만 원(숨고 안내, 검색 스니펫 [미검증]), 1,600만 고객·250만 고수(2026-07, 검색 스니펫 [미검증]), 견적 건당 과금 불만 글(2026-07-20, 일화) | 견적·구독 | 중하 |
| 매칭 | 이거해줘 [S34], 홈코 [S17] | 이거해줘 평점 105건. 홈코는 집수리 표준가격제, 시드 7억·TIPS(2025-09-17), 가전 무관 | 중개 | 하 |
| 부품 | 쿠팡·11번가 호환 소모품(예: 소모품 세트 45,900원, 시점 불명 [미검증]), 당근 배터리 수리점 | 소모품 어필리에이트와 직접 경쟁 | 판매 | 중 |
| 가격비교 | 다나와 [S29][S30], 에누리 [S31] | 다나와: 의견·질문·후기 탭, A/S 연락처만, 품질보증 항목 비어 있음. 구매 가이드는 AS 체크리스트만. 에누리: 별점·리뷰수, 정렬에 AS·고장 없음. 네이버쇼핑·쿠팡은 검색에서 AS·고장 정보를 못 찾았고 직접 열람은 안 함 [미검증], 오늘의집은 수리 정보 못 찾음 | 광고·제휴 | 중(복제력 높음) |
| 커뮤니티 | 네이버 카페 효녀로청, Clien, DC 갤러리 등(§3) | 후기·수리비 단건 공유. 카페 회원 10만~15만 자체 주장 [미검증] | 광고·공동구매 추정 [미검증] | 상(카페), 중(그 외) |
| 공공 | 소비자원·KMAC·KSA [S35][S36] | 보안실태·만족도지수(2026-10-02, 2026-08-27). 수리비 데이터 못 찾음 | - | 하 |

## 3. 경쟁 계정 목록 (열람 확인분만; 구독자는 대부분 미확인)

| # | 플랫폼·이름 | URL | 규모 | 콘텐츠·수익 |
|---|---|---|---|---|
| 1 | 네이버 카페 효녀로청(효로청)/로사모 | cafe.naver.com/robotclear (X @RosamoCafe 안내) | 10만(인스타 소개) ~15만(2024-01 유튜브 설명), 검색 스니펫 [미검증]. 확인: 카페 정보란 | 제품별 사용기. 수익 [미검증] |
| 2 | 인스타 효녀로청(로바TV) | instagram.com/rovatv21 | 429 오류, [미검증] | 로봇청소기 정보 |
| 3 | 유튜브 로봇청소기정보로바TV | youtube.com/@rovatv | 구독자 [미검증] | 샤오미 분해·교체 수리 영상(검색 노출) |
| 4 | 유튜브 홍반장 기술노트 | youtube.com/@hbj-technote | [미검증] | 샤오미 바퀴 고장 수리과정 |
| 5 | 유튜브 다이마니아 DIY Mania | youtube.com/@diymania | [미검증] | LG 로보킹 수리 |
| 6 | 유튜브 생존청소 | youtube.com/@생존청소AZ | [미검증] | 로보락 분해청소 |
| 7 | 유튜브 직구정보통 | youtube.com/@lukeplus_deals | [미검증] | 다이슨 V10 분해(직구 제품 셀프수리) |
| 8 | 유튜브 회사원워니 | youtube.com/@wony | [미검증] | 다이슨 V10 분해·배터리 리필 |
| 9 | Clien (모두의공원·사용기 등) | clien.net | 수리비 검색 20건 중 로봇청소기 수리비 글 약 4건, 2020-02~2026-06 [S21]. 개별 글 조회 7,581~26,178 [S18][S20] | 수리비 실결제 후기, 광고 모델 [미검증] |
| 10 | DC 로봇청소기 마이너 갤러리 | gall.dcinside.com/mgallery/board/lists/?id=robotcleaner | 열람 실패, 검색 노출만 | 수리 후기·보험 이야기 [미검증] |
| 11 | 다모앙 | damoang.net | 403, 검색 노출만 | 배터리 리필 비용 글 [미검증] |
| 12 | 다나와 DPG 커뮤니티 | dpg.danawa.com | 검색 노출만 | AS 소감 단문 |
| 13 | Samsung Members 커뮤니티 | community.samsung.com/kr [S32] | 답글 0건(2025-09-01 글), 직원은 이메일 진단 유도, 가격 없음 | 공식 포럼 |
| 14 | SEO 블로그 잡가이버 | jab-guyver.co.kr [S28] | 2025-12-23 글, 광고 슬롯, 다이슨 V11 배터리 약 129,000원 등 부품가를 링크 없이 "공식 가격"이라 표기 | 광고 추정 |
| 15 | 롱테일 SEO(머니리페어 product-repair.com [S26], make2t [S27], yellowit.co.kr는 검색 노출만) | 각 URL | product-repair는 로보락 공식 AS를 자처하나 운영사 불명, 가격 없음, 리다이렉트 중심 | 리드/제휴 추정 |

게시 빈도는 전 계정 확인 불가 [미검증]. 확인 경로: 각 채널·카페 정보란 직접 확인.

## 4. 글로벌 사례와 교훈

- **iFixit** [S38]: 무료 가이드 + 부품·공구 판매, FixBot 앱(2025-12 출시, 프리미엄 월 $4.99는 검색 요약 [미검증]). 트래픽 3개월 약 980만 방문(Similarweb 추정, 2026-10). 교훈: 지식은 무료, 수익은 부품 판매라 FixAtlas의 소모품·부품 제휴 구상과 같은 구조. 가이드가 아닌 지불 가격 분포가 차별점.
- **RepairPal** [S37]: 2007년 설립, 인증 정비소 4,000+. 소개 페이지에 견적 산출 근거 설명 없음. 교훈: 수익은 제휴 업체망. 견적 신뢰는 데이터 출처 공개로 앞설 수 있음.
- **Fixya** [S43]: 광고+유료 전문가($10~20), SEO 유입, 2018년 VerticalScope 인수(검색 스니펫 [미검증]). 교훈: 증상 Q&A는 검색·포럼에 흡수됨.
- **Repair Café** [S39]: 3,818곳, 공개 수리 DB 305,649건(2025-10), 필드는 제품군·브랜드·연식·고장·시도·결과 등이고 비용 필드는 나열되지 않음. 교훈: 오픈 수리 데이터 표준의 증상 분류를 차용하되 "지불 가격"이 빈칸.
- **CHOICE** [S40]: 스틱청소기 구매자 1,361명(2026-04), 문제 경험 43%, 수리 9%, 비용 발생 시 평균 A$154, 브랜드 표본 52~831. 교훈: 브랜드 단위는 수백 건이면 되나 모델×증상 셀은 훨씬 희박.
- **Consumer Reports** [S41]: 135,906대 설문, 무선은 배터리 노화·로봇은 머리카락 엉킴이 1위 문제(2026-03-28), 비용은 확인 못 함(유료). **Which?**는 404로 [미검증].
- **일본 도시바** [S42]: 증상별 가격 범위 표(2023-07-01 기준), 로봇청소기 제외. 교훈: 가격 공개 관행이 가능하나 로봇은 빠짐. **가격닷컴·샤오홍슈·Reddit(r/roborock 등)**: 열람·확인 실패 [미검증].
- 한국 제도: 순환경제사회전환촉진법상 수리정보 제공은 "노력" 수준(검색 요약, 2차 출처 [미검증] [S47]).

## 5. 갭·해자·리스크 판정

**갭**: 직접 열람한 제조사 페이지(S2,S4,S5,S13), 다나와·에누리(S29~S31)에는 모델×증상 수리비 분포가 없다. Clien 후기는 실재하나 단건·비정형이다(삼성 로봇청소기 바퀴 교체 약 19.2만 원 중 공임 약 1.4만 원, 2024-02-21 [S18]; 샤오미 모터 사설 수리 합계 89,500원, 2018-12-11 [S19]; 로보락 S6 MaxV 견적 20만 원대 후 유통사가 신품 교환, 2021-10-21 [S20]). 즉 "데이터는 존재하나 구조화·검증이 없는" 갭이다.

**부재 증거의 약점**: 네이버 카페·블로그는 도구가 차단했고(WebFetch 불가, WebSearch가 blog.naver.com 거부), 인스타 429, Reddit 불가. 가장 큰 UGC 저수지를 못 봤으므로 "아무도 안 한다"는 결론은 유보. 검색 예산 소진으로 모델×증상 분포 전용 검색 3건은 미실행(검색 로그 참조). 확인 경로: 네이버 카페 내 "수리비" 검색, DC 갤러리 내 검색.

**해자 판정(솔직히)**: 데이터 해자는 가입 UI가 아니라 (a) 영수증·AS 접수증 검증, (b) 모델·증상·부품 표준 분류, (c) 병행수입 여부·보증 상태 필드에서 나온다. 콜드스타트는 심각하다. CHOICE 기준 브랜드 표본이 수십~수백이므로 모델×증상 셀을 채우려면 수천 건 제출이 필요하다. 초기에는 공식 부품가(삼성 소모품샵, 다이슨 부품가)와 공개 후기 요약(출처 링크 방식)으로 시드를 만들어야 한다. 복제 위험: 대형 네이버 카페는 게시판·양식을 며칠 내 추가할 수 있고(판단) 회원 10만+ 규모로 제출량에서 앞선다 [미검증]. 다나와는 의견 탭 UI가 있어 "AS·수리비 탭"을 몇 주 내 추가 가능하나 과거 노출이 없어 의지는 낮다. 제조사는 가격 분포 공개가 이해충돌(국산 브랜드 수리비가 높다는 후기가 다수 [S18])이라 공개 가능성이 낮다. 마이스터즈는 현장 작업 데이터를 보유할 가능성이 있어 현실적 잠재 진입자다(추정, 기사에 데이터 언급 없음). 결론: 6개월 방어력 낮음, 18개월 뒤에는 검증 데이터 규모가 해자.

**공급측 리스크**
- 제조사: 고객과실 판정·직구 제품 수리 제한 안내(S13)와 과실 판정 분쟁 사례(S20)가 있어 게시 가격의 모호성이 분쟁을 부를 수 있다. 명예훼손·허위 후기 대응 정책, 법률 검토 필요 [미검증].
- 수리점: 가격 투명성에 대한 저항 가능. 숨고 전문가는 단가 하락 압박을 호소(일화) [S22]. 반대로 업체가 홍보 글을 위장 게시할 위험은 S26 사례가 보여준다.
- ToS·스크래핑: Clien robots.txt는 `?` 포함 URL과 AI 크롤러(ClaudeBot 등)를 차단하고 서버 단에서 봇 403 처리를 명시 [S23]. DC도 AI 크롤러 전면 차단 [S24]. 네이버 약관·카페 robots는 열람 불가 [미검증]. 권고: 스크래핑 금지, 사용자 제출+출처 링크·요약만, 개인정보 미수집.

## 6. 확인 못 한 항목
- 네이버 카페·블로그·인스타·Threads·Reddit·가격닷컴·샤오홍슈·Which? 직접 열람 및 모든 구독자·회원 수(YouTube 채널 전부, 효녀로청 수치는 검색 스니펫).
- 에코백스·아이로봇 한국 공식 AS 페이지, 다이슨코리아 공식 사이트(403), 로보락 에러코드·가격 페이지 존재 여부.
- 네이버쇼핑·쿠팡·오늘의집의 AS·고장 정보 노출 범위, 숨고 수수료율·월간 이용자(1,600만 고객·250만 고수는 검색 스니펫, 2026-07).
- 네이버 이용약관·카페 robots.txt, 한국 수리권 법제 세부.
- 모델×증상 분포 전용 검색 3건(미실행): "로봇청소기 모델별 증상별 수리비 평균 통계 실제 낸 수리비 모음", "가전 수리비 제보 사이트 실제 결제 수리비 공유 서비스 수리비 시세 사용자 제보 데이터베이스", "무선청소기 배터리 교체 수리비 후기 모음 다이슨 삼성 LG 모델별 수리비 표".

## 부록 A. 실행한 검색 (WebSearch, 2026-11-17)
1 로봇청소기 고장 수리비 후기 카페 모음 로봇청소기 수리 커뮤니티 / 2 로봇청소기 AS 수리비 견적 비교 플랫폼 가전 수리 매칭 앱 / 3 삼성전자서비스 셀프 진단 에러코드 로봇청소기 예상 수리비 조회 / 4 다이슨 코리아 서비스센터 수리 비용 안내 배터리 교체 가격 공식 / 5 LG전자 재생부품가격 조회 청소기 부품 가격 서비스센터 / 6 로보락 코리아 서비스센터 수리비 부품 가격표 공식 홈페이지 / 7 드리미 코리아 AS 서비스센터 수리 택배 접수 소모품 공식몰 / 8 로봇청소기 네이버 카페 회원수 로보락 사용자 모임 카페 / 9 cafe.naver.com 로봇청소기 카페 로봇청소기 정보 공유 커뮤니티 운영 / 10 로봇청소기 수리 유튜브 채널 분해 수리 셀프 수리 로보락 에러 해결 구독자 / 11 다이슨 청소기 수리 전문 업체 배터리 교체 수리점 블로그 가격 사설 수리 / 12 로봇청소기 수리 고장 에러 해결 (cafe.naver.com 한정, 결과 0) / 13 로봇청소기 수리 분해 에러 해결 영상 (youtube.com) / 14 로봇청소기 AS 수리비 후기 (clien.net, ppomppu.co.kr) / 15 로봇청소기 수리 전문 수리점 로보락 수리 센터 사설 (blog.naver.com·instagram·threads, API 400 거부) / 16 로봇청소기정보로바TV 구독자 유튜브 로봇청소기 수리 / 17 홍반장 기술노트 유튜브 구독자 수리 / 18 다이슨 청소기 수리 분해 배터리 교체 영상 유튜브 V10 V11 모터 고장 / 19 가전제품 수리 견적 비교 앱 스타트업 수리기사 매칭 투자 2025 가전 수리 플랫폼 / 20 숨고 가전 수리 로봇청소기 수리 전문가 견적 수수료 / 21 다나와 로봇청소기 AS 평가 고장 후기 상품의견 서비스센터 만족도 / 22 에누리 로봇청소기 AS 정보 만족도 조사 로봇청소기 고장률 순위 / 23 다나와 로봇청소기 상품의견 AS 후기 (danawa.com) / 24 로봇청소기 수리 후기 수리비 얼마 (damoang·ppomppu·dcinside·fmkorea·theqoo) / 25 로봇청소기 에러코드 수리비 자가진단 사이트 로봇청소기 고장 정보 서비스 (extended) / 26 로봇청소기 수리 보험 앨리스 보험 로봇청소기 유상수리 보장 수리비 누적 / 27 한국소비자원 로봇청소기 품질 AS 비교 조사 2025 2026 수리비 부품 가격 / 28 수리할 권리 한국 도입 수리비 공개 부품 가격 공개 가전 2026 공정위 소비자원 / 29 에어컨 AS 예상 수리비 조회 서비스 삼성전자서비스 LG 수리비 사전 견적 모델별 요금표 / 30 네이버 카페 로봇청소기 동호회 "로봇청소기" 카페 가입 회원 수 로청 카페 (extended) / 31 다이슨 무선청소기 사용자 모임 카페 네이버 다이슨 AS 후기 카페 / 32 효녀로청 로바TV 로봇청소기 네이버 카페 회원수 팔로워 / 33 효녀로청 로봇청소기 카페 공동구매 수익 로바TV 운영자 인터뷰 / 34 로봇청소기 사설 수리 전문 업체 택배 수리 로보락 샤오미 드리미 부품 교체 수리비 공개 (extended) / 35 로보락 정품 소모품 부품 스마트스토어 쿠팡 메인브러시 사이드브러시 필터 가격 호환 부품 / 36 오늘의집 가전 수리 서비스 로봇청소기 수리 오늘의집 시공 AS 연결 / 37 네이버 쇼핑 로봇청소기 상품정보제공고시 A/S 책임자 리뷰 고장 후기 네이버플러스 리뷰 AS 정보 / 38 LG전자 고객지원 재생부품가격 요금 보증 청소기 수리 요금 안내 (lge.co.kr) / 39 아이로봇 룸바 한국 AS 파산 2026 iRobot Korea 서비스 중단 소비자 피해 수리 / 40 에코백스 코리아 AS 서비스센터 디봇 수리 접수 공식 유통사 / 41 iFixit 2025 revenue users guides repair community answers Fix Finder business model parts store / 42 Repair Café Foundation number of repair cafés worldwide 2025 repair data Repair Monitor / 43 Consumer Reports vacuum cleaner reliability survey member data predicted reliability brand repair rates 2025 Which? reliability survey vacuum / 44 r/roborock subreddit members r/dyson subreddit weekly visitors / 45 Fixya troubleshooting community vacuum cleaner questions experts business model traffic / 46 価格.com ロボット掃除機 修理費用 目安 メーカー修理 料金 クチコミ 故障 / 47 小红书 扫地机器人 维修 费用 避坑 售后 笔记 追觅 石头 维修价格 / 48 くらしのマーケット 家電修理 ロボット掃除機 修理 料金 掲載 事業者数 ユーザー数 手数料 / 49 숨고 월간 이용자 수 누적 요청서 수수료 고수 견적 매칭 2025 2026 실적.
추가: Clien 사이트 검색(q=로봇청소기 수리비) 1회 열람.
제약: WebSearch는 US 기반이라 한국어 결과가 SEO 블로그에 치우침. 검색 한도 소진으로 미실행 3건은 §6.

## 부록 B. 출처 (열람일 2026-11-17, 괄호는 게시·기준일)
S1 https://www.samsungsvc.co.kr · S2 https://www.samsungsvc.co.kr/solution/39116 (2026-10-02) · S3 https://www.lge.co.kr/support · S4 https://www.lge.co.kr/support/rates-warranty-guide · S5 https://www.lge.co.kr/support/recyclable-parts-notice (2026-11 기준) · S6 https://zdnet.co.kr/view/?no=20250609135532 (2025-06-09) · S7 https://byline.network/2026/09/7-496/ (2026-09-07) · S8 https://www.ddaily.co.kr/page/view/2026082115171226719 (2026-08-21) · S9 https://news.bizwatch.co.kr/article/industry/2025/12/15/0005 (2025-12-15) · S10 https://biz.newdaily.co.kr/site/data/html/2025/02/19/2025021900110.html (2025-02-19) · S11 https://meet-roborock.com/main/security/sub03.html (날짜 없음) · S12 https://kr.roborock.com/ · S13 https://www.e-himart.co.kr/app/as/mainPage · S14 https://www.hankyung.com/article/202602119008g (2026-02-11) · S15 https://www.hankyung.com/article/2025121546227 (2025-12-15) · S16 https://www.mt.co.kr/article/2026072411230857103 (2026-07-28) · S17 https://www.unicornfactory.co.kr/article/2025091709492342059 (2025-09-17) · S18 https://www.clien.net/service/board/park/18599093 (2024-02-21) · S19 https://www.clien.net/service/board/park/12930477 (2018-12-11) · S20 https://www.clien.net/service/board/use/16613800 (2021-10-21) · S21 https://www.clien.net/service/search?q=로봇청소기+수리비 · S22 https://www.clien.net/service/board/park/19230815 (2026-07-20) · S23 https://www.clien.net/robots.txt · S24 https://gall.dcinside.com/robots.txt · S26 https://product-repair.com/%EB%A1%9C%EB%B3%B4%EB%9D%BD-as%EC%84%BC%ED%84%B0%EF%BD%9C%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EA%B3%A0%EC%9E%A5-%EC%8B%9C-%EC%A0%91%EC%88%98%EB%B6%80%ED%84%B0-%EC%88%98%EB%A6%AC%EA%B9%8C/ (2025-07-01) · S27 https://www.make2t.kr/2026/11/roborock-service-center-as-repair-guide.html (2026-11-09) · S28 https://jab-guyver.co.kr/1616 (2025-12-23) · S29 https://prod.danawa.com/info/?pcode=2441347 · S30 https://plan.danawa.com/info/?nPlanSeq=13065 · S31 https://price.enuri.com/list?category=0503 · S32 https://r1.community.samsung.com/t5/%EA%B8%B0%ED%83%80/%EB%B9%84%EC%8A%A4%ED%8F%AC%ED%81%AC-ai%EC%8A%A4%ED%8C%80-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%A0%80%EB%A7%8C-%EA%B3%A0%EC%9E%A5-%EB%B0%98%EB%B3%B5/m-p/34799484 (2025-09-01) · S33 https://www.samsung.com/sec/careplus/applySubscribeView · S34 https://apps.apple.com/kr/app/id6742811576 · S35 https://core.asiae.co.kr/article/2026100208393100373 (2026-10-02) · S36 https://news.mtn.co.kr/news-detail/2026082717344726205 (2026-08-27) · S37 https://www.repairpal.com/about-us · S38 https://www.ifixit.com/Info/about, https://www.similarweb.com/website/ifixit.com/ (2026-10 추정), https://www.ifixit.com/News/109277 (2025-04-08) · S39 https://en.wikipedia.org/wiki/Repair_Caf%C3%A9 (2025-10 수치) · S40 https://www.choice.com.au/home-and-living/laundry-and-cleaning/vacuum-cleaners/articles/kmart-stick-vacuums-rated-one-of-the-least-reliable-brands-in-choice-survey (설문 2026-04-13~05-07) · S41 https://www.bgr.com/2132733/most-reliable-vacuum-cleaner-brands-consumer-reports/ (2026-03-28) · S42 https://www.toshiba-lifestyle.com/jp/support/ryokin/cleaners/ (2023-07-01 기준) · S43 https://thenextweb.com/news/fixya-announces-24-million-monthly-users-as-it-rolls-out-its-html5-qa-site-for-mobile-users (검색 스니펫만 확인) · S44 https://byline.network/2026/06/611-2/ (2026-06-11, 숨고 요청 수) · S47 https://www.vegannews.co.kr/news/article.html?no=384272, https://inews24.com/view/2002704 (검색 결과만 확인) · YouTube 채널은 oEmbed로 이름만 확인(2026-11-17): youtube.com/@rovatv, @hbj-technote, @diymania, @생존청소AZ, @lukeplus_deals, @wony.
