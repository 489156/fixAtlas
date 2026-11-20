# 1편 배터리 글 보강: 다이슨 외 브랜드 근거 (조사일 2026-11-20)

대상 원고: `docs/blog/naver/01-battery-price.md`. 앞선 조사(`research_notes/수리기록 명칭과 무선청소기 배터리 확장/` 네 파일)에서 확인된 값은 다시 조사하지 않았고, 빈칸과 충돌만 메웠다. 다이슨은 `dyson.md`(다른 담당) 몫이다.

표기
- "평문 HTTP": curl(기본 UA)로 받은 HTML에서 인용 문구를 찾았는지.
- "Chromium": Playwright 헤드리스 Chromium(기본 UA)으로 열어 `document.body.textContent`에서 찾았는지. 블로그 점검기(`verify-sources`)는 Chromium을 먼저 쓰고, 실패하면 curl로 다시 연다.
- "점검기 실측": 아래 원장 행을 임시 원고에 넣고 `scripts/verify-sources.mjs`를 실제로 돌린 결과(§10).
- 인용 문구는 모두 페이지 원문을 그대로 옮겼다. 이미지 안에만 있는 문구는 "이미지:"로 표시했다.

접근 기록(robots·차단)
- robots 허용 확인 후 연 곳: community.samsung.com, www.samsungsvc.co.kr(`/*?q=`만 금지), www.samsung.com(`/sec/support/model/`, 상품 페이지, `/hk_en/`), www.lge.co.kr(`/shop/`·`/search` 등만 금지), www.lg.co.kr, www.lg.com(`/au/`·`/ca_en/`·`/sg/`), prod.danawa.com, search.danawa.com(Crawl-delay 10초를 지켜 검색 6회), www.sharkninja.co.kr, www.consumernews.co.kr, www.ksa.or.kr, www.safetykorea.kr.
- miwhole.co.kr: robots가 `User-agent: *`를 `Disallow: /`로 막고 `Claude-User`는 허용한다(Crawl-delay 10). curl·Chromium으로는 열지 않았고, 사용자 요청형 조회(WebFetch) 3회만 했다. 점검기는 일반 UA라 이 주소를 자동으로 열면 robots 위반이 된다 → §11 [판단].
- 11st.co.kr, item.gmarket.co.kr, itempage3.auction.co.kr: robots가 `*`를 막고 Claude-User 등에만 상품 페이지를 연다. 11번가 상품 1건은 WebFetch에서 HTTP 520, 지마켓 1건은 무관 상품이라 쓰지 않았다. 호환 배터리 가격은 다나와(허용)만 썼다.
- www.danawa.com, www.coupang.com: robots.txt 자체가 Akamai 403이라 열지 않았다.
- manualslib.com: robots는 허용하지만 Cloudflare 챌린지("Just a moment...")가 떠서 우회하지 않았다.
- downloadcenter.samsung.com(삼성 사용설명서 PDF 서버): robots.txt가 `User-agent: *` `Disallow: /`다. robots 확인과 PDF 2건 내려받기를 한 명령에 묶어 실행하는 바람에 robots 결과를 보기 전에 PDF 2개(VS28D95 설명서, VS9700/VS9500 수리 가이드)가 내려받아졌다. 열어 보지 않고 바로 지웠으며 이 문서에 쓰지 않았다(요청 2회).
- ks-sqi.ksa.or.kr: DNS 실패·연결 재설정. www.ksa.or.kr 보도자료 게시판으로 대신했다.

---

## 1. 삼성 Bespoke AI 제트 Lite 280W·AI 제트 400W 배터리, 삼성 배터리 보증

### 확인한 값

| 사실 | 값 | URL | 원문 인용 | 평문 HTTP | Chromium |
|---|---|---|---|---|---|
| AI 제트 Lite 280W(VS28D950AIW) 배터리 전압 | 25.2V, 리튬 이온 | https://www.samsung.com/sec/support/model/VS28D950AIW/ | "배터리 전압 25.2 V" | O | X(타임아웃) → 점검기 curl로 일치 |
| AI 제트 Lite 사용 시간(기본 배터리 1개) | 핸디 일반 60분·강력 30분·초강력 10분·제트 1분, 충전 210분 | 같은 페이지 | "핸디 : 일반 60 min / 강력 30 min / 초강력 10 min / 제트 1 min" | O | X → curl 일치 |
| AI 제트 400W(VS90F40CSK) 배터리 전압 | 25.2V | https://www.samsung.com/sec/support/model/VS90F40CSK/ | "배터리 전압 25.2 V" | O | X → curl |
| AI 제트 400W 대용량·기본 배터리 | 대용량: 핸디 일반 100분, 충전 300분, 흡입력 400W / 기본: 핸디 일반 60분, 충전 210분, 250W | 같은 페이지 | "충전시간 대용량 배터리 300 min / 기본 배터리 210 min" | O | X → curl |
| AI 제트 400W 대용량 배터리 용량 | 3,970mAh | https://www.samsung.com/sec/vacuum-cleaners/Bespoke-jet-vs90f40cs-d2c/VS90F40CSK/ | "3,970mAh의 대용량 배터리로" | O | X(타임아웃) |
| 2023년 비스포크 제트 AI 배터리 두 종류 | 일반 250W·60분, 대용량 280W·100분 | https://www.samsungsvc.co.kr/solution/1482790 (게시 2023-06-29) | "대용량배터리 장착 시에는 최대 280W의 흡입력과 최장 100분의 사용시간" | O | O |
| 해외 부품번호·용량(대용량) | VCA-SBTC97, 25.2V, 3970mAh, 175×83×40mm, 호환 VS28C979FQK | https://www.samsung.com/hk_en/home-appliance-accessories/jet-vc-renewal-accessory-battery3-vca-sbtc97/ | "large capacity battery (3970mAh)" | O | 점검기 [curl]로 일치 |
| 해외 부품번호·용량(일반) | VCA-SBTC97S, 25.2V, 2200mAh, 152×78×37mm | https://www.samsung.com/hk_en/home-appliance-accessories/jet-vc-renewal-accessory-battery2-vca-sbtc97s/ | "Battery Pack (25.2V) 2200mAh" | O | 점검기 [curl]로 일치 |
| 홍콩 삼성의 배터리 보증 조건(홍콩 판매분) | 2년, 정상 마모 제외, 500사이클 미만·잔량 70% 초과 시 무상 교체, 2023년 1월 이후 판매 BESPOKE Jet 전 모델 | VCA-SBTC97 페이지 | "The 2 year warranty is limited to the battery only and excludes normal wear and tear" | O | 점검기 [curl]로 일치 |
| 삼성 멤버스 배터리 수명·보증 안내(새 주소) | 500 Cycle 후 20~30% 저하, 주 3회 약 2년, 보증 구입 후 2년 | https://community.samsung.com/kr/conversations/18b9c2/%EA%B6%81%EA%B8%88%ED%95%B4%EC%9A%94-%EC%82%BC%EC%84%B1-%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%A0%9C%ED%8A%B8-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%88%98%EB%AA%85-%EA%B4%80%EB%A6%AC-%EB%B0%A9%EB%B2%95/r1_24839365 | "500 Cycle 사용 후 20~30% 성능이 떨어져요" / "구입 후 2년이며, 무상 보증 기간 내 불량 발생 시 무상 교체가 가능해요" | O | O |
| 제트 200W SE용 배터리(DJ96-00227C) 상세 이미지 | "2년 무상보증 배터리" 인증 마크(이미지 alt 문구로 판독), 500회 충방전 후 70% | https://www.samsungsvc.co.kr/shop/product/0000085295 | 이미지 옆 제목 "최대 60분 사용 대용량 배터리" | O(alt 포함) | 본문엔 alt 없음 → 이미지 행 |
| 220W 배터리(DJ96-00242D) 적용 모델 | VS20A95*·VS20B956AXE 등 143개(다나와 2025 BEST 7위 VS20B956AXE 포함). VS20C·VS25C·VS28·VS30·VS90 없음 | https://www.samsungsvc.co.kr/shop/product/0000090680 | "VS20B956AXE" | O | O |
| 소모품샵 청소기 배터리 목록 | 9종(DJ96-00205D·00221C·00233A·00234A·00227C·00227A·00242D·00214A·00221A). 9종의 "상품 적용 모델"을 모두 대조했고 VS28D·VS90F·VS25C·VS30D·VS20C 모델은 하나도 없다 | https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 | Chromium "총 9개의 상품이 있습니다" / curl "총 9 개" → 원장 인용 "총 9개" | O | O |
| 고객 자가수리 스틱청소기 부품 분류 | 먼지통·필터·아답터·파이프·바디·브러쉬(배터리 분류 없음) | https://www.samsungsvc.co.kr/shop/product?category=175707397&directory=401594162&option=401596793 | "먼지통 필터 아답터 파이프 바디 브러쉬" | O | 미시험 |

부품번호·가격 결론
- 국내 AI 제트(2023~2026년형 VS28C/VS28D/VS25C/VS30D/VS90F)용 배터리의 국내 부품번호와 단품 가격은 공식 경로 어디에서도 찾지 못했다(시도 경로는 끝의 "Still not found"). 해외 삼성은 VCA-SBTC97(대용량 3970mAh)·VCA-SBTC97S(일반 2200mAh)를 판다. 국내 사양표의 "대용량 3,970mAh·25.2V"는 VCA-SBTC97 사양과 같지만, 국내 판매 부품이 같은 번호라는 공식 문구는 없다(추론).
- 홍콩 페이지 정가는 페이지에 "Out of Stock"과 템플릿 변수만 있어 가격을 읽지 못했다.

보증 결론
- 삼성 국내 공식 문서 중 무선청소기 배터리 보증을 숫자로 적은 것은 (1) 삼성 멤버스 생활가전담당 글(2023-12-28, 2년), (2) 제트 200W SE용 배터리 상세 이미지의 "2년 무상보증 배터리" 마크 두 가지다. 삼성전자 워런티 페이지에는 청소기 배터리 항목이 없다(앞선 조사).
- 삼성전자서비스 로봇·물걸레 안내는 "비스포크 스팀과 비스포크 AI 스팀의 배터리 보증기간은 1년이며, 일부 모델은 2년입니다. 정확한 보증기간은 제품 사용설명서를 확인해 주세요."라고 적는다(https://www.samsungsvc.co.kr/solution/3413522). 스틱청소기 문서는 아니지만 "모델별로 다르고 설명서가 기준"이라는 삼성의 입장을 보여 준다. 사용설명서 PDF 서버는 robots 차단이라 열지 않았다.
- 소비자가만드는신문 조사(2023-09-26)도 "배터리 보증기간은 삼성전자와 LG전자가 2년으로 긴 편이다"라고 적었다(§8, 24개월 초과 자료).

---

## 2. LG 코드제로 배터리 용량, A9/A9S·연식 구분

### 확인한 값

| 사실 | 값 | URL | 원문 인용 | 평문 HTTP | Chromium |
|---|---|---|---|---|---|
| EAC63382216(23~25년형, A9/A9S/A7) 용량 | 2,400mAh (LG 호주 공식 페이지, 상품명은 "LG A9X Vacuum Cleaner Genuine Battery") | https://www.lg.com/au/vacuum-cleaners/vacuum-cleaner-accessories/eac63382216/ | "Lithium-Ion Battery (2,400mAh)" | O | X(Access Denied 403) → curl 대체 |
| EAC63382208(19~22년형 A9/A9S) 용량 | 2,300mAh (LG 캐나다·싱가포르 공식) | https://www.lg.com/ca_en/care-accessories/vacuum-cleaners/battery-adapter-charger/eac63382208/ | "CordZero™ A9 Vacuum Cleaner Battery (2,300mAh)" | O | X(403) → curl |
| 계산: Wh | EAC63382216 약 60.5Wh, EAC63382208 약 58.0Wh (25.2V × 용량) | (위 두 페이지 + LG 국내 정격전압 25.2V) | — | — | — |
| EAC63382216 적용 모델 수와 가격 | 164개, 정상가 129,000원, 회원할인가 104,000원(19%), 리뷰 391개 | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382216 | "사용 가능한 모델 (총 164개)" | O | X(networkidle 타임아웃) → curl |
| EAC63382216에 2024 A9S·A7 Core·A9 AI 포함 | AX920BWE, AX958BWE, A720WA, AI958WA, AS720WA, AS920CWD, AX9604WE 등 | 같은 페이지 | "AX920BWE.AKOR (O920BWE.AKOR)", "A720WA.CKOR (O720WA.CKOR)" | O | → curl |
| EAC63382208 적용 모델 수 | 263개(A9100·A9300·A9570·AS9·AT9·AU9 계열 등), 리뷰 1,679개 | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382208 | "사용 가능한 모델 (총 263개)" | O | → curl |
| EAC63382214 단품 페이지 | LGE.COM에 없음(`/care-accessories/a9-vacuum-cleaner/eac63382214`, `/product/...` 둘 다 404). 호환표에는 216과 함께 표기 | — | — | 404 | — |
| A5 배터리 COV30090401 | 정상가 111,000원, 회원할인가 105,400원(5%), 리뷰 6개, 용량 표기 없음 | https://www.lge.co.kr/product/care-accessories/a9-vacuum-cleaner/cov30090401 | "COV30090401" ("청소기 A5 배터리"는 점검기 숫자 결합 규칙 때문에 불일치) | O | O |
| A5 본체 정격전압 | DC 18.5V(A9S·A7 Core는 25.2V) | https://www.lge.co.kr/product/vacuum-cleaners/as520wa | Chromium "정격전압 (V) (DC)18.5" / curl "정격전압 (V) (DC) 18.5" | O | O |
| 연식별 호환표(LG 문구) | 23~25년 A9S 배터리 = EAC63382214·EAC63382216 / 19~22년 = EAC63382208·EAC63382212 / 19년 이전 = EAC63382202·EAC63758601 | https://www.lge.co.kr/product/vacuum-cleaners/a720wa | "2019~2022년 출시 A9S/A9 제품은 19년~22년 출시 배터리 및 23년 출시 배터리 사용 가능합니다" | O | O |
| 같은 표의 다른 주석 | 2023년 출시 A9S는 2023년 출시 배터리만, 2019년 이전 A9는 19년 이전·19~22년 배터리 | 같은 페이지 | "2023년 출시 A9S 제품은 2023년 출시 배터리 사용 가능합니다." | O | O |
| 본체 출시 연월 확인 위치 | 각 제품 스펙의 "동일모델의 출시년월"(예: AX920BWE 2024-03, A720WA 2025-03, AS520WA 2025-02) | https://www.lge.co.kr/product/vacuum-cleaners/ax920bwe | Chromium "정격전압 (V) (DC)25.2" / curl "정격전압 (V) (DC) 25.2" (같은 표에 "동일모델의 출시년월 2024-03") | O | O |
| A9 배터리와 A9S 배터리 구분 | 충전 단자 모양: 동그란 구멍 3개(A9/A9S 배터리) vs 사각 구멍에 작은 사각 홈 4개(A9S 배터리) | https://www.lge.co.kr/product/care-accessories/a9-vacuum-cleaner/eac63382208 | 이미지 alt: "작은 동그란 구멍이 3개가 나열 되어있으며 A9S 배터리 충전단자 모양은 사각형 구멍에 작은 사각형 흠 4개" / 본문 앵커: "구매하시기 전에 사용하시는 청소기의 동일한 배터리인지 확인해 주세요" | O(alt) | 본문엔 alt 없음 → 이미지 행 |
| 모델명 확인 방법(LG 고객지원, 2026-05-29, 조회 160,457) | 배터리를 빼고 안쪽 은색 라벨 | https://www.lge.co.kr/support/solutions-20150332172261 | "밧데리 제거 후 안쪽면 은색 라벨" | O | O |
| A9 AI(2025)의 배터리 수명 표시 | 본체 화면에서 잔량과 수명 표시, 이상 시 씽큐 알림 | https://www.lg.co.kr/media/release/28915 (2025-04-30) | "제품에 탑재된 화면에서 배터리 잔량뿐 아니라 수명까지 확인 가능" | O | O |

독자가 자기 배터리를 고르는 법(공식 문구만으로 구성)
1. 배터리를 빼고 안쪽 은색 라벨에서 본체 모델명을 읽는다(LG 고객지원).
2. 모델명이 EAC63382216 상품 페이지의 "사용 가능한 모델" 164개에 있으면 23~25년형 배터리, EAC63382208의 263개에 있으면 19~22년형 배터리다(두 페이지 목록). 목록은 첫 쪽만 HTML에 있고 나머지는 페이지 넘김으로 나온다.
3. 손에 든 배터리는 충전 단자 모양으로 구분한다(동그란 구멍 3개 / 사각 구멍+사각 홈 4개).
4. 2019~2022년 본체는 23년형 배터리도 쓸 수 있지만, 2023년 이후 본체는 23년형 배터리만 쓴다(LG 호환표).

용량 결론
- LG 국내 페이지·다나와에는 용량(mAh) 표기가 없다. LG 해외 공식 페이지가 EAC63382216 2,400mAh, EAC63382208 2,300mAh를 적는다. A5(COV30090401)와 EAC63382214의 용량은 찾지 못했다.

---

## 3. 미홀 M22 교체 배터리(공식몰, WebFetch로만 열람)

| 사실 | 값 | URL | 원문 인용(WebFetch 판독) |
|---|---|---|---|
| M22 추가 배터리 가격·재고 | 정가 50,000원, 판매가 50,000원, "SOLD OUT" | https://m.miwhole.co.kr/goods/goods_view.php?goodsNo=1000000038 | "미홀 M22 추가 배터리" / "M22 전용 / 타 제품 호환불가" |
| 같은 검색의 다른 배터리 | M33 전용 배터리 59,000원(품절 표시 없음) | https://m.miwhole.co.kr/goods/goods_search.php?keyword=%EB%B0%B0%ED%84%B0%EB%A6%AC | "미홀 무선청소기 M33 전용 배터리" |
| 배터리 보증 | 배터리 전용 보증 문구 없음. 일반 A/S 문구만 있음 | 위 두 페이지 + 본체 https://m.miwhole.co.kr/goods/goods_view.php?goodsNo=1000000030 | "제품 수령 후 1년 이내 판매자 과실로 인한 A/S의 경우 왕복 배송비 6,000원(제품에 따라 상이)은 고객이 부담합니다." |
| A/S 창구 | 카카오채널 [디뷰코리아], 판매 주체 "미홀코리아(디뷰코리아)" | 본체 페이지 | "A/S는 카카오채널 [디뷰코리아]에서 확인 후 진행니다." |
| M22 본체 가격·KC | 정가 399,000원, 판매가 179,000원, 안전확인 XU102852-22001A | 본체 페이지 | "인증번호 : XU102852-22001A" |

주의
- 위 인용은 WebFetch 요약 모델이 돌려준 문장이다. 원문 HTML을 직접 대조하지 못했으므로 글자 단위 일치는 보장하지 못한다. 특히 "1년 이내 판매자 과실로 인한 A/S ... 고객이 부담" 문장은 뜻이 어색해(판매자 과실인데 고객 부담) 원문 오기인지 판독 오류인지 확인이 필요하다.
- 앞선 조사(`brand_as.md`)는 미홀 M22를 샤오미 AS망(위니아에이드) 맥락에 두었으나, 미홀 공식몰의 A/S 창구는 디뷰코리아 카카오채널이다. 샤오미코리아 AS 대상인지는 확인하지 못했다.

---

## 4. 호환 배터리 가격(다나와, 2026-11-20)과 KC 번호

| 품목 | 다나와 최저가 | 판매처 수·등록월·가격갱신일 | URL | 인용(제목·스펙) |
|---|---|---|---|---|
| 다이슨 V8 호환 4000mAh(비정품, 일반구매) | 36,900원 | 4곳, 2021.04 | https://prod.danawa.com/info/?pcode=14014652 | "다이슨 V8 호환 4000mAh 배터리" |
| 다이슨 V8 호환 5000mAh(비정품) | 81,900원 | 2024.02, 가격갱신일 2026.04.29(오래됨) | https://prod.danawa.com/info/?pcode=37350602 | "다이슨 V8 호환 5000mAh 배터리" |
| 다이슨 V10 호환 4000mAh(비정품, 일반구매) | 46,980원 | 6곳, 2021.03 | https://prod.danawa.com/info/?pcode=19647605 | "다이슨 V10 호환 4000mAh 배터리" |
| 기가셀 LG 코드제로 A9·A9S 호환 2500mAh KC-BT2500L(비정품) | 44,130원 | 2곳, 2024.06, 가격갱신일 2026.05.28 | https://prod.danawa.com/info/?pcode=56139131 | "KC-BT2500L" |
| LG 코드제로 A9 호환 배터리(비정품) | 60,610원 | 5곳, 2020.02 | https://prod.danawa.com/info/?pcode=116353126 | "LG 코드제로 A9 호환 배터리" |
| 삼성 제트 70(VS15T7032P4, VCA-SBT90E) 호환 | 46,530원 | 가격갱신일 2026.11.15 | https://prod.danawa.com/info/?pcode=31642349 | "VCA-SBT90E" |

- 비교 기준(정품, 같은 날 공식몰): LG EAC63382216·EAC63382208 정상가 129,000원(회원 104,000원), 삼성 220W DJ96-00242D 160,000원, 삼성 DJ96-00227C(제트 200W SE) 150,000원, 다이슨은 `dyson.md` 참조.
- KC 번호: 다나와 호환 배터리 상세정보의 KC 칸은 모두 "상세설명 / 판매 사이트 문의"였다(예: pcode 56139131). 다나와 기준으로는 호환 배터리의 KC 번호를 확인할 수 없다. 판매 페이지(11번가·지마켓)는 robots가 일반 UA를 막아 점검기가 다시 열 수 없다. 제품안전정보센터 인증 검색(POST)은 삼성 정품 번호 XU102502-21001로 시험해도 "검색 결과가 없습니다"가 나와 이번에는 쓸 수 없었다.
- 다나와 페이지의 "제조회사" 칸은 신뢰하기 어렵다. pcode 31642349(호환품)는 제조회사를 "삼성전자"로, 116353126은 "LG전자"로 적었다.
- 다이슨 V11 호환 검색은 결과가 스크립트로만 그려져 정적 HTML에서 읽지 못했다.

---

## 5. 쿠쿠 무선청소기 배터리

| 사실 | 값 | URL | 인용 |
|---|---|---|---|
| 파워클론 슬림 CVC-G820NWM(2024년형) | 배터리 분리형 1개, 리튬이온 2000mAh, 최대 55분, 다나와 최저가 182,690원, 본체 안전확인 YU102096-24001 | https://prod.danawa.com/info/?pcode=61842860 | "배터리용량 2000mAh" / "안전확인인증 YU102096-24001" |
| 파워클론 하이퍼 CVC-HE0710EG(2025년형) | 2,000mAh, 최대 35분, 최저가 223,250원, 안전확인 YU102201-25001 | https://prod.danawa.com/info/?pcode=94445447 | "2,000mAh" (Chromium 본문에서는 "배터리용량 2,000mAh"가 이어져 있지 않음) |
| 쿠쿠 배터리 단품 가격·부품번호·보증 | 찾지 못함 | — | — |

- 다나와 "쿠쿠 무선청소기 배터리" 검색 상위 6개는 모두 본체였다. cuckoo.co.kr은 403, mall·service 서브도메인은 연결 실패(502), cuckoo.co.kr·m.cuckoo.co.kr의 robots.txt는 302로 넘어갔다.

---

## 6. 샤크닌자 코리아 AS 경로와 배터리

| 사실 | 값 | URL | 원문 인용 | 평문 HTTP | Chromium |
|---|---|---|---|---|---|
| 접수 경로 | 고객센터 1644-9245 또는 카카오톡 '샤크닌자', 평일 09:00~18:00 | https://www.sharkninja.co.kr/ | "샤크닌자 고객센터(1644-9245) 또는 카카오톡에서 '샤크닌자'를 검색해 문의해 주세요" | O | X(타임아웃) → curl |
| 무선청소기 무상 수리 기간 | 최대 3년(기본 1년), 공식몰 구매 후 제품 등록 시만 연장, 본체 기능 고장만 | 같은 페이지 | "최대 3년* (기본 1년)" | O | → curl |
| 배터리 제외 | 연장 무상수리에서 배터리 제외 | 같은 페이지 | "배터리, 필터, 칼날 등 소모품 및 액세서리는 제외됩니다" | O | → curl |
| 공식몰 배터리 단품 | Accessories 50개 중 배터리는 "샤크 무선청소기 WV250 배터리"(핸디형, 자체상품코드 XSBT250KR) 하나, 49,000원, 품절 | https://www.sharkninja.co.kr/product/%EC%83%A4%ED%81%AC-%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-wv250-%EB%B0%B0%ED%84%B0%EB%A6%AC/299/category/142/display/1/ | "XSBT250KR" / "품절 재입고 알림 신청" | O | 점검기 [curl]로 일치 |
| 스틱(에보파워 LC·파워클린 IW) 배터리 단품 | 공식몰 Accessories 1~5쪽 어디에도 없음 | https://www.sharkninja.co.kr/category/Accessories/142/ | — | O | — |

- 공식몰 첫 화면 배너 문구는 "최대 4년* 무상 수리 서비스"지만, 4년은 선풍기 등 계절성 제품(기본 2년)이다. 무선청소기는 최대 3년이다.
- 택배 수거·센터 방문 절차를 적은 공식 페이지는 찾지 못했다. FAQ 1~2쪽은 회원·쿠폰 질문뿐이고, 제품 지원 게시판(LC156KRGY1 등)은 "등록된 FAQ가 없습니다"였다.
- 실제 AS 사례는 §8의 2026-01-18 기사(샤크 에보, 부품 재고 없음)를 쓸 수 있다.

---

## 7. LG 배터리턴 2026(하반기)

| 사실 | 값 | URL | 원문 인용 | 평문 HTTP | Chromium |
|---|---|---|---|---|---|
| 기간 | 2026-10-01~11-30 | https://www.lg.co.kr/media/release/30631 (2026-10-02) | "LG전자는 10월 1일부터 11월 30일까지 배터리턴 캠페인을 진행한다" | O | O |
| 반납 대상 | 제조사 무관 무선청소기 폐배터리, 전국 LG 서비스센터·LGE.COM(비대면) | 같은 페이지 | "제조사와 관계없이 사용하던 무선청소기 폐배터리를" | O | O |
| 누적 실적 | 2022년부터 올해 상반기까지 약 156톤, 34만 개 이상, 희유금속 13톤 이상, 올해 1차 3만여 명·약 29톤·6만4천 개 | 같은 페이지 | "약 156톤, 수량은 34만 개가 넘는다" | O | O |
| 센터 반납 할인 | A9/A9S/A7 배터리(EAC63382208·EAC63382216) 소비자가 129,000원 → 30,000원 할인 → 99,000원. 배터리+슬림 마루 흡입구 동시 반납 시 86,000원 할인 | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | "단일 품목 반납/구매 시 30,000원 할인" / "최종 혜택가: 99,000원" | O | O |
| 온라인 할인 | 회원 5% + 추가 15%, 최대혜택가 104,000원(19%) | 같은 페이지 | "최대혜택가: 104,000원 (19% 할인)" | O | O |
| 타사 배터리 인정 | 센터 반납 대상에 타사 청소기 배터리 포함 | 같은 페이지 | "LG전자 및 타사 청소기 배터리" | O | O |
| 수량 제한 | 제품별 인당 최대 3개, 한정 수량·조기 종료 가능 | 같은 페이지 | "제품별 인당 최대 3개까지" | O | O |
| 기간(행사 페이지 표기) | 2026.10.1(목)~11.30(월) | 같은 페이지 | "캠페인 기간: 2026.10.1(목) ~ 11.30(월)" | O | O |

- 보도자료에는 할인 금액이 없고 "구매 할인 혜택"만 있다. 금액은 행사 페이지에만 있다.
- 원고 발행일(2026-11-24) 뒤 6일이면 끝난다. 날짜를 문장에 넣어야 한다.

---

## 8. 사용자 경험·AS 사례(2024~2026 우선)

### 8-1. 2026 한국서비스품질지수(KS-SQI) 원문과 두 회사 발표

| 출처 | 값 | URL | 원문 인용 | 평문 HTTP | Chromium |
|---|---|---|---|---|---|
| 한국표준협회 보도자료(2026-07-02) | 가전제품 A/S 지수 +1.8점, 가전제품 A/S 등 7개 업종에서 1위 기업이 바뀜(어느 회사인지는 적지 않음) | https://www.ksa.or.kr/bbs/ksa_kr/192/1590551/artclView.do | Chromium 본문: "가전제품 A/S 등 7개 업종에서는 1위 기업이 바뀌었다" | O(띄어쓰기 다름: "7 개 업종에서는 1 위") | O |
| LG전자 보도자료(2026-07-02) | 가전제품 A/S 부문 1위, 3년 연속 | https://www.lg.co.kr/media/release/30305 | "가전제품 A/S 부문 1위에 올랐다. 재작년부터 3년 연속 1위다" | O | O |
| 삼성전자서비스 뉴스(2026-07-02) | 가전·휴대전화·컴퓨터 AS 전 부문 1위, 가전 통산 22회 | https://www.samsungsvc.co.kr/intro/news/3036846 | "가전제품 AS 부문에서도 통산 22회 1위로" | O | O |

- 협회 원문은 가전제품 A/S의 1위 기업이 "바뀌었다"고만 쓴다. LG의 "3년 연속 1위"와 삼성의 "1위"가 함께 성립하려면 공동 1위 구성이 바뀐 경우여야 한다. 원문에서 1위 기업 명단은 확인하지 못했다(KS-SQI 전용 사이트 접속 실패). 글에는 "두 회사가 모두 1위라고 발표했고, 협회는 가전 A/S 1위 기업이 바뀌었다고 밝혔다"까지만 쓴다.
- 앞선 메모의 "공동 1위"는 기사 표현이며 협회 원문으로는 확인되지 않았다.

### 8-2. 사례 후보

A. 샤크닌자 무선청소기 부품 재고 없음(언론 보도, 2026-01-18) — 가장 최근, 브랜드 AS 경험
- 소비자가만드는신문(정은영 기자, 승인 2026-01-18). 서울 송파구 소비자가 2024년 11월 샤크 에보를 77만9000원에 사서 1년 1개월째인 2025-12-29 AS 접수. 업체는 본체 일부 파손으로 부품 교체가 필요하나 재고가 없다고 답하고, 품질보증 1년이 지나 부품 수리비 17만 원을 안내. 소비자는 일주일 뒤 다른 청소기를 샀다. 업체는 "수입 및 통관 절차로 인해 시간이 소요"되며 2월 내 완료 예상이라고 답했다.
- 인용: "현재 재고가 없고 언제 수급될 지 알 수 없어 기다려봐야 한다"
- 한계: 배터리 고장이 아니라 본체·브러시 결착 문제다. "보증 1년이 지나면 부품비가 붙는다", "수입 브랜드 부품 대기"의 사례로만 쓴다.
- URL: https://www.consumernews.co.kr/news/articleView.html?idxno=747459 (평문 HTTP O, Chromium 타임아웃 → curl)

B. 무선청소기 배터리 불만 유형과 브랜드별 배터리 보증(언론 보도, 2023-09-26, 24개월 초과)
- 소비자고발센터에 그해 접수된 무선청소기 불만 30여 건(삼성·LG·다이슨·신일 등). 유형은 짧은 사용시간, 배터리 재고 부족으로 교체 지연, 비싼 배터리, 짧은 보증기간. 당시 배터리 가격 삼성 15만 원, LG 12만 원, 신일 5만 원. 배터리 보증 삼성·LG 2년, 테팔·신일 1년, 다이슨 제품 동봉 2년·별도 구매 1년.
- 인용: "배터리 재고 부족으로 교체 지연" / "배터리 보증기간은 삼성전자와 LG전자가 2년으로 긴 편이다"
- URL: https://www.consumernews.co.kr/news/articleView.html?idxno=689058

C. LG 배터리턴(제조사 공지, 2026-10-02) — 사례라기보다 "지금 할 수 있는 일". §7 참조.

D. 이미 원고에 있는 LG전자 고객센터 회신(2026-11-18, `firsthand`)은 그대로 유효하다.

찾지 못한 것: 2024~2026년 스틱청소기 "배터리" 자체를 다룬 소비자원 피해구제·분쟁조정 사례, 1372 브랜드별 통계(kca.go.kr은 robots 차단, korea.kr에서 해당 보도자료를 찾지 못함), 한국소비자연맹 2024 이후 청소기 보고서.

---

## 9. 삼성 멤버스 글 새 주소

- 원고의 옛 주소 `r1.community.samsung.com/t5/.../ba-p/24839365`는 앞선 조사대로 301로 넘어간다.
- 과제에 적힌 형태(`/kr/conversations/유용한-가전-정보/.../r1_24839365`)로 열면 다시 `/kr/conversations/18b9c2/.../r1_24839365`로 넘어간다. 원장에는 최종 주소(18b9c2)를 쓰는 편이 안전하다.
- 평문 HTTP(curl -L): 200, 926,561바이트. Chromium: 200, 제목 "[궁금해요] 삼성 무선청소기 제트 배터리 수명 관리 방법 | 삼성 멤버스 커뮤니티".
- 원문 그대로: "배터리의 수명은 자사 내부 시험치 기준 500Cycle(완충완방 기준) 사용 가능하고 사용자 환경에 따라 편차가 있는데 500 Cycle 사용 후 20~30% 성능이 떨어져요. 보통 일주일에 3회 제품 사용시 약 2년 사용 후 20~30% 성능 감소 예상돼요."
- 작성자 "생활가전담당 Moderator", 게시 "2023년 12월 28일 목요일 09:34 오전"(datePublished 2023-12-28T09:34:13.526Z). 2025-01-26 댓글 1건(배터리 무상보증 문의)이 달려 있다.
- 원고 claims의 인용 "500 Cycle 사용 후 20~30% 성능이 떨어져요"는 새 주소에서 평문·Chromium 모두 일치한다.

---

## 10. 점검기 실측(verify-sources)

방법: 위 원장 후보 행을 임시 원고(스크래치 폴더)에 넣고 `NODE_PATH=$(npm root -g) node scripts/verify-sources.mjs <임시원고> --evidence=<스크래치>`로 실행했다(`--write` 없음, 저장소 파일 변경 없음). 미홀 행은 robots 때문에 넣지 않았다.

1차(57행): 일치 49, 이미지 1, 불일치 7. 불일치 원인과 조치
- 삼성 소모품샵 목록 "총 9 개": Chromium 본문은 "총 9개의 상품이 있습니다". → 인용을 "총 9개"로 바꿈(curl 본문 "총 9 개"도 점검기의 숫자·단위 결합 뒤 "총 9개"가 됨).
- LG A5 배터리 "청소기 A5 배터리": 점검기가 본문의 "숫자+공백+배"를 붙여("A5 배터리" → "A5배터리") 인용과 어긋남. → 인용 "COV30090401". 같은 이유로 "A7 배터리"가 들어간 번들 인용도 "배터리모델명EAC63382216"으로 바꿈.
- LG 정격전압 2건: Chromium 본문은 "정격전압 (V) (DC)18.5"처럼 붙어 있다(curl은 띄어 씀). → Chromium 형태로 바꿈. Chromium이 실패해 curl로 넘어가면 이 두 행은 불일치가 난다.
- LG 배터리턴 "156톤 / 34만 개": 값 칸의 "34만"을 점검기가 340,000으로 바꿔 대조. → 값 칸을 "156톤"으로 줄임.
- 쿠쿠 하이퍼 "배터리용량 2,000mAh": Chromium 본문에서 두 낱말이 이어져 있지 않음. → 인용 "2,000mAh".

2차(수정 10행 + 단독 1행): 모두 일치(계산 2, 이미지 1 포함). "모든 출처 기록이 원문과 일치합니다."

읽기 경로(점검기 표시)
- [browser]: community.samsung.com, samsungsvc.co.kr 상품·목록, lge.co.kr 상품·케어액세서리·고객지원·기획전, lg.co.kr 보도자료, ksa.or.kr, prod.danawa.com
- [curl](Chromium 실패 후 대체): samsung.com/sec 지원·상품 페이지, samsung.com/hk_en, lg.com/au·ca_en(Chromium은 Access Denied 403), samsungsvc.co.kr/solution/1482790, sharkninja.co.kr, consumernews.co.kr
- curl 대체 경로에서 띄어쓰기가 달라지는 행: KS-SQI 인용("7 개 업종에서는 1 위"), LG 정격전압 2건, LG 번들 행. Chromium이 뜨지 않는 날에는 이 행들이 불일치로 나온다.

점검기 동작에서 확인한 제약(원고 작성 시 주의)
- 값 칸의 단위는 원·%·년·회·개월·건·명·배·시간 등만 숫자로 대조한다. mAh·V·W·분 값은 인용 문구로만 확인된다.
- 값 칸의 "17만 원", "77만9000원", "34만 개"는 170,000원 등으로 바뀌어 대조되므로, 기사 원문이 한국식 금액이면 값 칸에 넣지 말고 인용 문구에 둔다.
- 인용 문구에 "숫자 + 공백 + (%·원·년·건·개월·회·명·배)"가 있으면 본문 쪽만 붙여져 항상 불일치한다.

---

## 11. 원장 행(붙여 넣기용)

이미지 행은 숫자를 점검기가 읽지 못하므로 캡처로 확인한다. 한국식 금액("17만 원", "77만9000원")은 점검기가 170,000원으로 바꿔 대조하므로 기사 원문과 맞지 않는다. 그래서 사례 행의 값 칸에는 기사 속 금액을 넣지 않았다.

```
  - 30% | https://community.samsung.com/kr/conversations/18b9c2/%EA%B6%81%EA%B8%88%ED%95%B4%EC%9A%94-%EC%82%BC%EC%84%B1-%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%A0%9C%ED%8A%B8-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%88%98%EB%AA%85-%EA%B4%80%EB%A6%AC-%EB%B0%A9%EB%B2%95/r1_24839365 | 2026-11-20 | 삼성 멤버스 생활가전담당 안내(2023-12-28), 옛 r1 주소에서 이동한 최종 주소 | 500 Cycle 사용 후 20~30% 성능이 떨어져요
  - 2년 | https://community.samsung.com/kr/conversations/18b9c2/%EA%B6%81%EA%B8%88%ED%95%B4%EC%9A%94-%EC%82%BC%EC%84%B1-%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-%EC%A0%9C%ED%8A%B8-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%88%98%EB%AA%85-%EA%B4%80%EB%A6%AC-%EB%B0%A9%EB%B2%95/r1_24839365 | 2026-11-20 | 삼성 멤버스 생활가전담당: 제트 배터리 보증 구입 후 2년, 기간 내 불량 시 무상 교체 | 구입 후 2년이며, 무상 보증 기간 내 불량 발생 시 무상 교체가 가능해요
  - 25.2V | https://www.samsung.com/sec/support/model/VS28D950AIW/ | 2026-11-20 | Bespoke AI 제트 Lite 280W 공식 스펙(배터리 리튬 이온) | 배터리 전압 25.2 V
  - 60분 | https://www.samsung.com/sec/support/model/VS28D950AIW/ | 2026-11-20 | AI 제트 Lite 기본 배터리 1개 기준 핸디 사용 시간, 충전 210분 | 핸디 : 일반 60 min / 강력 30 min / 초강력 10 min / 제트 1 min
  - 25.2V | https://www.samsung.com/sec/support/model/VS90F40CSK/ | 2026-11-20 | Bespoke AI 제트 400W 공식 스펙 | 배터리 전압 25.2 V
  - 100분 / 300분 | https://www.samsung.com/sec/support/model/VS90F40CSK/ | 2026-11-20 | AI 제트 400W 대용량 배터리 핸디 일반 100분·충전 300분, 기본 배터리 250W·60분·210분 | 충전시간 대용량 배터리 300 min / 기본 배터리 210 min
  - 3,970mAh | https://www.samsung.com/sec/vacuum-cleaners/Bespoke-jet-vs90f40cs-d2c/VS90F40CSK/ | 2026-11-20 | AI 제트 400W 대용량 배터리 용량(삼성닷컴 상품 페이지) | 3,970mAh의 대용량 배터리로
  - 280W | https://www.samsungsvc.co.kr/solution/1482790 | 2026-11-20 | 비스포크 제트 AI(2023): 일반 배터리 250W·60분, 대용량 배터리 280W·100분(게시 2023-06-29) | 대용량배터리 장착 시에는 최대 280W의 흡입력과 최장 100분의 사용시간
  - 3970mAh | https://www.samsung.com/hk_en/home-appliance-accessories/jet-vc-renewal-accessory-battery3-vca-sbtc97/ | 2026-11-20 | 홍콩 삼성: Bespoke Jet AI 대용량 배터리 VCA-SBTC97, 25.2V(국내 판매 부품번호는 미확인) | large capacity battery (3970mAh)
  - 2200mAh | https://www.samsung.com/hk_en/home-appliance-accessories/jet-vc-renewal-accessory-battery2-vca-sbtc97s/ | 2026-11-20 | 홍콩 삼성: Bespoke Jet AI 일반 배터리 VCA-SBTC97S | Battery Pack (25.2V) 2200mAh
  - 70% | https://www.samsung.com/hk_en/home-appliance-accessories/jet-vc-renewal-accessory-battery3-vca-sbtc97/ | 2026-11-20 | 홍콩 판매분 배터리 보증 2년, 정상 마모 제외(국내 조건 아님) | The 2 year warranty is limited to the battery only and excludes normal wear and tear
  - 9종 | https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 | 2026-11-20 | 계산: 소모품샵 청소기 배터리 9종의 상품 적용 모델을 모두 대조, VS28D·VS90F·VS25C·VS30D·VS20C 모델 없음 | 총 9개
  - VS20B956AXE | https://www.samsungsvc.co.kr/shop/product/0000090680 | 2026-11-20 | 220W 배터리(DJ96-00242D) 적용 모델에 다나와 2025 BEST 7위 VS20B956AXE 포함 | VS20B956AXE
  - 2년 | https://www.samsungsvc.co.kr/shop/product/0000085295 | 2026-11-20 | 이미지: 제트 200W SE용 배터리(DJ96-00227C) 상세 이미지에 '2년 무상보증 배터리' 인증 마크와 '500회 충방전 후 70% 성능 유지' 문구(이미지 alt로 판독) 캡처:samsung-200w-se@다음이미지 | 최대 60분 사용 대용량 배터리
  - 2,400mAh | https://www.lg.com/au/vacuum-cleaners/vacuum-cleaner-accessories/eac63382216/ | 2026-11-20 | LG 호주 공식: EAC63382216(23~25년형 A9/A9S/A7) 용량 | Lithium-Ion Battery (2,400mAh)
  - 2,300mAh | https://www.lg.com/ca_en/care-accessories/vacuum-cleaners/battery-adapter-charger/eac63382208/ | 2026-11-20 | LG 캐나다 공식: EAC63382208(19~22년형 A9/A9S) 용량 | CordZero™ A9 Vacuum Cleaner Battery (2,300mAh)
  - 60.5Wh / 58.0Wh | https://www.lg.com/au/vacuum-cleaners/vacuum-cleaner-accessories/eac63382216/ | 2026-11-20 | 계산: 25.2V × 2.4Ah, 25.2V × 2.3Ah(정격전압은 LG 국내 제품 고지) |
  - 129,000원 / 104,000원 | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382216 | 2026-11-20 | LG A9/A9S/A7 배터리 EAC63382216 정상가·회원할인가, 적용 모델 164개 | 사용 가능한 모델 (총 164개)
  - AX920BWE | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382216 | 2026-11-20 | EAC63382216 적용 모델에 2024년형 A9S 올인원타워 AX920BWE 포함 | AX920BWE.AKOR (O920BWE.AKOR)
  - A720WA | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382216 | 2026-11-20 | EAC63382216 적용 모델에 A7 Core A720WA 포함 | A720WA.CKOR (O720WA.CKOR)
  - 263개 | https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382208 | 2026-11-20 | EAC63382208(19~22년형) 적용 모델 수 | 사용 가능한 모델 (총 263개)
  - 111,000원 / 105,400원 | https://www.lge.co.kr/product/care-accessories/a9-vacuum-cleaner/cov30090401 | 2026-11-20 | LG A5 배터리 COV30090401 정상가·회원할인가(할인율 5%, 용량 표기 없음) | COV30090401
  - 18.5V | https://www.lge.co.kr/product/vacuum-cleaners/as520wa | 2026-11-20 | LG A5 본체 정격전압(A9S·A7 Core는 25.2V). 인용은 Chromium 본문 형태 | 정격전압 (V) (DC)18.5
  - 25.2V | https://www.lge.co.kr/product/vacuum-cleaners/ax920bwe | 2026-11-20 | A9S AX920BWE 정격전압, 동일모델 출시 2024-03. 인용은 Chromium 본문 형태 | 정격전압 (V) (DC)25.2
  - 23~25년 | https://www.lge.co.kr/product/vacuum-cleaners/a720wa | 2026-11-20 | LG 배터리 호환표: 19~22년형 본체는 23년형 배터리도 사용 가능 | 2019~2022년 출시 A9S/A9 제품은 19년~22년 출시 배터리 및 23년 출시 배터리 사용 가능합니다
  - 2023년 출시 | https://www.lge.co.kr/product/vacuum-cleaners/a720wa | 2026-11-20 | LG 배터리 호환표: 2023년 이후 A9S는 23년형 배터리만 | 2023년 출시 A9S 제품은 2023년 출시 배터리 사용 가능합니다
  - 100,400원 / 22% | https://www.lge.co.kr/product/vacuum-cleaners/a720wa | 2026-11-20 | A720WA와 함께 살 때의 번들할인가(배터리 단품가 아님). 인용은 Chromium 본문 형태 | 배터리모델명EAC63382216
  - 단자 모양 | https://www.lge.co.kr/product/care-accessories/a9-vacuum-cleaner/eac63382208 | 2026-11-20 | 이미지: A9/A9S 배터리는 충전 단자에 동그란 구멍 3개, A9S 배터리는 사각 구멍에 사각 홈 4개(이미지 alt로 판독) 캡처:lg-terminal@다음이미지 | 구매하시기 전에 사용하시는 청소기의 동일한 배터리인지 확인해 주세요
  - 모델 확인 | https://www.lge.co.kr/support/solutions-20150332172261 | 2026-11-20 | LG 고객지원(2026-05-29): 배터리 모델은 배터리를 뺀 안쪽 은색 라벨로 확인 | 밧데리 제거 후 안쪽면 은색 라벨
  - 교체 주기 미지정 | https://www.lge.co.kr/support/solutions-20150332172261 | 2026-11-20 | LG 고객지원(2026-05-29): 기간 기준 교체 주기 없음. solutions-20150373882418의 '권장 주기 2년'과 다름 | 기간에 따른 권장 교체 주기는 별도로 지정되어 있지 않습니다
  - 수명 표시 | https://www.lg.co.kr/media/release/28915 | 2026-11-20 | LG 보도자료(2025-04-30): A9 AI 본체 화면에서 배터리 수명 확인 | 제품에 탑재된 화면에서 배터리 잔량뿐 아니라 수명까지 확인 가능
  - 50,000원 | https://m.miwhole.co.kr/goods/goods_view.php?goodsNo=1000000038 | 2026-11-20 | 미홀 공식몰 M22 추가 배터리 정가·판매가, SOLD OUT(WebFetch 판독. robots가 일반 UA를 막아 verify-sources 자동 대조 대상 아님) | M22 전용 / 타 제품 호환불가
  - 179,000원 | https://m.miwhole.co.kr/goods/goods_view.php?goodsNo=1000000030 | 2026-11-20 | 미홀 M22 본체 판매가(정가 399,000원), A/S는 카카오채널 [디뷰코리아](WebFetch 판독, 자동 대조 대상 아님) | 인증번호 : XU102852-22001A
  - 36,900원 | https://prod.danawa.com/info/?pcode=14014652 | 2026-11-20 | 다나와 최저가: 다이슨 V8 호환 4000mAh(비정품, 판매처 4곳) | 다이슨 V8 호환 4000mAh 배터리
  - 46,980원 | https://prod.danawa.com/info/?pcode=19647605 | 2026-11-20 | 다나와 최저가: 다이슨 V10 호환 4000mAh(비정품, 판매처 6곳) | 다이슨 V10 호환 4000mAh 배터리
  - 44,130원 | https://prod.danawa.com/info/?pcode=56139131 | 2026-11-20 | 다나와 최저가: 기가셀 LG 코드제로 A9·A9S 호환 2500mAh(비정품), 가격갱신일 2026.05.28 | KC-BT2500L
  - 60,610원 | https://prod.danawa.com/info/?pcode=116353126 | 2026-11-20 | 다나와 최저가: LG 코드제로 A9 호환 배터리(비정품, 판매처 5곳) | LG 코드제로 A9 호환 배터리
  - 46,530원 | https://prod.danawa.com/info/?pcode=31642349 | 2026-11-20 | 다나와 최저가: 삼성 제트 70(VS15T7032P4) 호환 배터리, 가격갱신일 2026.11.15 | VCA-SBT90E
  - KC 미표시 | https://prod.danawa.com/info/?pcode=56139131 | 2026-11-20 | 다나와는 호환 배터리 KC 번호를 '판매 사이트 문의'로만 표시 | 상세설명 / 판매 사이트 문의
  - 2000mAh | https://prod.danawa.com/info/?pcode=61842860 | 2026-11-20 | 쿠쿠 파워클론 슬림 CVC-G820NWM 배터리(분리형 1개, 최대 55분) | 배터리용량 2000mAh
  - 2,000mAh | https://prod.danawa.com/info/?pcode=94445447 | 2026-11-20 | 쿠쿠 파워클론 하이퍼 CVC-HE0710EG 배터리(최대 35분) | 2,000mAh
  - 1644-9245 | https://www.sharkninja.co.kr/ | 2026-11-20 | 샤크닌자 A/S 접수: 고객센터·카카오톡 | 샤크닌자 고객센터(1644-9245) 또는 카카오톡에서 '샤크닌자'를 검색해 문의해 주세요
  - 3년 / 1년 | https://www.sharkninja.co.kr/ | 2026-11-20 | 샤크닌자 무선청소기 무상수리 최대 3년(기본 1년), 공식몰 구매 후 등록 시 | 최대 3년* (기본 1년)
  - 배터리 제외 | https://www.sharkninja.co.kr/ | 2026-11-20 | 샤크닌자 연장 무상수리에서 배터리 제외 | 배터리, 필터, 칼날 등 소모품 및 액세서리는 제외됩니다
  - 49,000원 | https://www.sharkninja.co.kr/product/%EC%83%A4%ED%81%AC-%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-wv250-%EB%B0%B0%ED%84%B0%EB%A6%AC/299/category/142/display/1/ | 2026-11-20 | 샤크 공식몰 유일한 배터리 단품(핸디형 WV250용, 품절). 스틱 배터리 단품 없음 | XSBT250KR
  - 10월 1일 / 11월 30일 | https://www.lg.co.kr/media/release/30631 | 2026-11-20 | LG전자 보도자료(2026-10-02) 배터리턴 하반기 기간 | LG전자는 10월 1일부터 11월 30일까지 배터리턴 캠페인을 진행한다
  - 제조사 무관 | https://www.lg.co.kr/media/release/30631 | 2026-11-20 | 타사 무선청소기 폐배터리도 LG 서비스센터·LGE.COM으로 반납 | 제조사와 관계없이 사용하던 무선청소기 폐배터리를
  - 156톤 | https://www.lg.co.kr/media/release/30631 | 2026-11-20 | 2022년부터 2026년 상반기까지 누적 수거량(34만 개는 인용 문구로만 대조) | 약 156톤, 수량은 34만 개가 넘는다
  - 30,000원 | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | 2026-11-20 | 배터리턴: 서비스센터에 배터리 반납 후 A9/A9S/A7 정품 배터리 구매 시 할인 | 단일 품목 반납/구매 시 30,000원 할인
  - 99,000원 | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | 2026-11-20 | 배터리턴: 센터 반납 시 최종 혜택가(소비자가 129,000원) | 최종 혜택가: 99,000원
  - 104,000원 / 19% | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | 2026-11-20 | 배터리턴: 온라인 구매(회원 5%+추가 15%) | 최대혜택가: 104,000원 (19% 할인)
  - 타사 배터리 | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | 2026-11-20 | 배터리턴: 센터 반납 대상에 타사 청소기 배터리 포함 | LG전자 및 타사 청소기 배터리
  - 3개 | https://www.lge.co.kr/benefits/exhibitions/detail-PE01017005 | 2026-11-20 | 배터리턴: 제품별 인당 최대 3개, 한정 수량 | 제품별 인당 최대 3개까지
  - 1위 변경 | https://www.ksa.or.kr/bbs/ksa_kr/192/1590551/artclView.do | 2026-11-20 | 한국표준협회 2026 KS-SQI 발표(2026-07-02): 가전제품 A/S 1위 기업 변경, 지수 +1.8점 | 가전제품 A/S 등 7개 업종에서는 1위 기업이 바뀌었다
  - 3년 | https://www.lg.co.kr/media/release/30305 | 2026-11-20 | LG전자 보도자료(2026-07-02): KS-SQI 가전제품 A/S 1위 | 가전제품 A/S 부문 1위에 올랐다. 재작년부터 3년 연속 1위다
  - 22회 | https://www.samsungsvc.co.kr/intro/news/3036846 | 2026-11-20 | 삼성전자서비스 뉴스(2026-07-02): KS-SQI 가전·휴대전화·컴퓨터 AS 1위 | 가전제품 AS 부문에서도 통산 22회 1위로
  - 1년 | https://www.consumernews.co.kr/news/articleView.html?idxno=747459 | 2026-11-20 | 사례: 소비자가만드는신문 2026-01-18, 샤크닌자 '샤크 에보' 무선청소기 AS 접수 후 부품 재고 없음, 품질보증 1년 경과로 부품 수리비 안내 | 현재 재고가 없고 언제 수급될 지 알 수 없어 기다려봐야 한다
  - 2년 | https://www.consumernews.co.kr/news/articleView.html?idxno=689058 | 2026-11-20 | 사례: 소비자가만드는신문 2023-09-26, 소비자고발센터 무선청소기 불만 30여 건 중 배터리 재고 부족으로 교체 지연(24개월 초과) | 배터리 재고 부족으로 교체 지연
  - 2년 | https://www.consumernews.co.kr/news/articleView.html?idxno=689058 | 2026-11-20 | 소비자가만드는신문 2023-09-26 조사: 배터리 보증 삼성·LG 2년(24개월 초과) | 배터리 보증기간은 삼성전자와 LG전자가 2년으로 긴 편이다
```

원고 claims에서 바꿀 줄
- `30% / 3회 / 2년 | https://r1.community.samsung.com/...` → 위 첫 줄의 18b9c2 주소로 교체(인용 문구는 그대로 일치).
- `129,000원 / 104,000원 / 19% | .../eac63382208` 줄은 19~22년형용이다. 판매 1위 2024년형 A9S·A7 Core 독자를 위해 EAC63382216 줄(164개 모델)을 함께 넣는다.

---

## 12. 앞선 메모에서 바로잡을 것

1. LG "100,400원"(top_vacuums.md §4)은 A720WA 본체와 함께 살 때의 번들할인가다. 배터리 단품 회원할인가는 104,000원(EAC63382216·EAC63382208 동일)이다.
2. LG 교체 권장 주기: LG 고객지원 두 문서가 다르다. solutions-20150373882418(원고 인용)은 "교체 권장 주기는 2년", solutions-20150332172261(2026-05-29)은 "기간에 따른 권장 교체 주기는 별도로 지정되어 있지 않습니다". 같은 문서는 A9S "강" 모드 약 20분이라고 적어 원고 표의 "터보 약 7분"과 모드 이름이 다르다.
3. KS-SQI "LG·삼성 공동 1위"(brand_as.md §3)는 협회 원문으로 확인되지 않는다. 협회는 "가전제품 A/S 등 7개 업종에서는 1위 기업이 바뀌었다"고만 적었다.
4. 미홀 M22의 공식 A/S 창구는 카카오채널 [디뷰코리아]다(샤오미코리아 AS망 여부는 미확인).
5. 샤크닌자 공식몰 배너의 "최대 4년"은 계절가전 기준이고, 무선청소기는 최대 3년(기본 1년)이다. 배터리는 연장 대상에서 빠진다.
6. 삼성 소모품샵에는 2023년 이후 비스포크 제트 AI·AI 제트(VS20C/VS25C/VS28C/VS28D/VS30D/VS90F)용 배터리가 없다. 220W 배터리(DJ96-00242D)는 2021~2022년형 VS20A95*·VS20B95*용이다.
7. 삼성 AI 제트의 국내 사양표에는 배터리 용량이 없고 400W 상품 페이지만 3,970mAh를 적는다. 일반 배터리 2,200mAh는 해외 페이지(VCA-SBTC97S) 값이다.

---

## Still not found (시도한 경로 전부)

1. 삼성 AI 제트(VS28C/VS28D/VS25C/VS30D/VS90F) 배터리의 국내 부품번호·단품 가격 [AI]
   - samsungsvc.co.kr 소모품샵 청소기>배터리 9종의 적용 모델 전수 대조(해당 없음), 고객 자가수리>스틱 청소기(배터리 분류 없음), 상품 ID 0000095605(보조배터리팩, 무관), samsung.com/sec 액세서리 URL(`jet-vc-renewal-accessory-battery3-vca-sbtc97`, `...battery2-vca-sbtc97s` → 일반 안내 페이지), samsung.com/sec 상품·지원 페이지(용량·부품번호 없음), 다나와 검색 "삼성 제트 호환 배터리", 웹 검색 "VCA-SBTC97 가격", "3970mAh 삼성 제트 배터리 정품 가격", "비스포크 AI 제트 배터리 단품".
   - 다음 경로: [판단] 삼성 사용설명서 PDF 서버(downloadcenter.samsung.com, robots 전체 차단)를 사람이 열어 볼지 결정. [현장] 삼성전자서비스 1588-3366에 VS28D950/VS90F40 배터리 부품번호·가격 문의(회신 정리는 [AI]).
2. 삼성 무선청소기 배터리 보증의 현행 공식 문서(AI 제트 기준) [AI]
   - samsung.com/sec/support/warranty(앞선 조사, 항목 없음), samsungsvc FAQ·solution 40880/40849/40903/3413522/1993248, 소모품샵 상품 6건의 A/S 안내, samsung.com/sec 상품 페이지 2건(모터 10년만 표기), 웹 검색 3회. 사용설명서 PDF는 robots 차단으로 열지 않음.
   - 다음 경로: 위 1번과 같다.
3. LG A5(COV30090401)·EAC63382214 용량, 23~25년 배터리 KC 번호 [AI]
   - lge.co.kr 상품 페이지, lg.com 해외(AU·CA·SG) 검색, manualslib(Cloudflare 챌린지), 웹 검색 4회, safetykorea 인증 검색(정품 번호로도 "검색 결과가 없습니다").
   - 다음 경로: [현장] 실물 배터리 라벨 촬영(원고 photo 슬롯과 같은 행위). 사진 판독은 [AI].
4. 호환 배터리 KC 안전확인 번호 3~5건 [AI]
   - 다나와 상품 7건(모두 "판매 사이트 문의"), 11번가 WebFetch(HTTP 520), 지마켓 WebFetch(무관 상품), 웹 검색 2회, safetykorea 인증 검색(POST, 결과 없음).
   - 다음 경로: [판단] robots가 일반 UA를 막는 오픈마켓 상품 페이지를 점검기 대상에 넣을지, 또는 사람이 브라우저로 열어 캡처할지 결정. safetykorea 공개 API(`/release/openapi`)는 [현장] 키 발급이 필요한지 확인 후 [AI]가 조회.
5. 쿠쿠 배터리 단품 가격·부품번호·보증 [AI]
   - cuckoo.co.kr(403), mall·service 서브도메인(접속 실패), 다나와 검색(본체만), 웹 검색 1회.
   - 다음 경로: [현장] 쿠쿠 고객센터(1588-8899, 컬리 판매 페이지 표기라 공식 여부 미확인) 문의.
6. 샤크닌자 택배 수거·센터 방문 절차, 스틱 배터리 단품 가격 [AI]
   - 공식몰 첫 화면·FAQ 1~2쪽·제품 지원 게시판·Accessories 1~5쪽, 웹 검색 1회.
   - 다음 경로: [현장] 1644-9245 문의.
7. 미홀 M22 배터리 보증 기간, 원문 글자 단위 대조 [판단]
   - WebFetch 3회(검색·배터리·본체). 배터리 보증 문구 없음.
   - 다음 경로: [판단] robots가 일반 UA를 막는 미홀 공식몰을 원장에 둘지(점검기가 열면 robots 위반), 사람이 캡처할지 결정.
8. 2024~2026 스틱청소기 배터리 소비자원 사례·1372 브랜드별 통계, 한국소비자연맹 보고서 [AI]
   - 웹 검색 4회, consumernews 사이트 검색(검색어가 적용되지 않음), korea.kr 기존 사본(2018·2021)만 확인. kca.go.kr는 robots 차단이라 열지 않음.
   - 다음 경로: [판단] 소비자원 사례 페이지 단건 열람 허용 여부(CASES.md §5).
9. KS-SQI 가전제품 A/S 1위 기업 명단 원문 [AI]
   - ksa.or.kr 보도자료(명단 없음), ks-sqi.ksa.or.kr(DNS 실패·연결 재설정).
   - 다음 경로: [AI] ks-sqi.ksa.or.kr 재시도.
