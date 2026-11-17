# R6. 공식/공개 기준가 시드 데이터 (고장도감 FixAtlas)

- 작성일: 2026-11-17 (모든 `date_seen`은 이날 WebFetch/WebSearch로 확인한 날짜)
- 범위: 로봇청소기 / 무선(스틱)청소기의 정품 배터리, 소모품·부품, 공식 서비스 요금, 보증기간 (제조사 공식 사이트, 공식 온라인 스토어, 공식 고객지원 페이지만 사용)
- 라벨링 원칙: 이 표의 모든 값은 **'공식/공개 출처 기준가이며 사용자 제보가 아님'**. 앱에 시드할 때 `source_type = official_public`, `is_user_report = false`로 표시할 것.
- 제외: 포럼, 개인 블로그, 오픈마켓(11번가/쿠팡 등) 호환품 가격은 모두 제외. 언론 보도는 가격 행의 근거로 쓰지 않고 notes에서 '추정 근거'로만 언급.
- 가격은 정가(정상가/할인 전 판매가) 기준으로 기록했고, 할인가/회원가는 notes에 적음. 부가세(VAT) 포함 여부는 대부분 페이지에 명시가 없어 `VAT: unknown`으로 적음 (삼성 요금안내 페이지만 '부품비는 부가세 10% 포함'이라고 명시).
- 가격과 재고는 수시로 바뀌므로 시드 데이터에는 `date_seen`을 반드시 함께 보여줄 것.

## 1. 브랜드별 커버리지 요약

| 브랜드 | 검증 행 수 | 공식 가격 페이지 존재 여부 | 요약 |
|---|---|---|---|
| 삼성전자서비스 (삼성) | 29 | **있음** (소모품샵 samsungsvc.co.kr/shop, 요금안내 /info/fee) | 소모품샵에 배터리/필터/먼지통/브러시/물걸레/어댑터가 부품번호, 가격, 적용모델과 함께 공개됨 (제트 배터리 120,000~200,000원, 제트 봇 배터리 77,000~128,000원). 출장비는 공개되나 표 2개가 라벨 없이 병기. 청소기별 출장비/점검비/수리비(기술료) 기준표와 부품 가격표는 요금안내 페이지에 **없음**. samsung.com/sec의 배터리 상품 페이지(VCA-SBT90/VT 등)는 가격이 비어 있고 '상품 정보 확인만 가능'. |
| LG전자 | 30 | **있음** (LGE.COM 케어액세서리 카테고리, 센터 방문 예약 페이지의 출장비 안내) | 코드제로 A9/A9S 배터리 129,000원 등 배터리, 필터, 물걸레, 로보킹 소모품이 모델번호와 함께 정가/회원가로 공개됨. 출장비 28,000원(기본)~38,000원(성수기 할증)이 공개. 수리 기술료/부품 가격표는 없음. 카테고리 페이지는 144개/102개 중 첫 30개씩만 읽음(나머지는 '더보기' 뒤). |
| 다이슨 코리아 | 11 | **일부 있음** (dyson.co.kr 부품 판매 페이지에 배터리 가격 표시) | dyson.co.kr은 WebFetch에서 403이라 직접 열람 불가. 배터리 가격(대부분 129,000원, V8 99,000원, V12 팩 150,000원, 디지털 슬림 140,000원)은 WebSearch가 보여준 공식몰 페이지 스니펫으로만 확인. 출장/점검/수리 요금표는 찾지 못함(열람 불가라 '없음'으로 단정하지 않음). 보증은 2년(스니펫 기준). |
| 로보락 코리아 | 2 | **없음(확인됨)** | kr.roborock.com에는 소모품/배터리 가격 페이지가 없음(메뉴에 '액세서리' 컬렉션 링크가 있으나 전부 404). 서비스 및 보증 페이지는 보증 1년과 배터리/소모품 보증 제외만 명시하고 수리비, 출장비, 택배비 금액은 없음. |
| 드리미 코리아 | 4 | **없음(확인됨)** | store.kr.dreametech.com에 소모품/액세서리 카테고리 없음. A/S 정책 페이지에 보증기간표(로봇 본체 2년, 배터리 1년, 메인 브러시 등 6개월, 소모품 없음)는 있으나 금액은 없음. A/S 센터 안내 FAQ는 이미지라 읽지 못함. |
| 에코백스 코리아 | 2 | **없음(확인됨)** | ecovacs.com/kr 액세서리 페이지에 걸레패드 등 12개 상품이 있으나 가격이 표시되지 않고 구매처 안내만 있음. 보증서 페이지는 1년, 소모품/배터리 보증 제외, 배송/취급비 청구 가능(금액 없음). |
| iRobot 코리아 | 0 | **확인 불가** | www.irobot.co.kr 및 irobot.co.kr이 이 세션의 네트워크 허용 목록 밖이라 DNS 해석 실패. 허용 후 재시도 필요. 공식 가격 페이지 존재 여부는 미확인. |

핵심 시사점
1. 공식 가격표가 실제로 공개되는 곳은 삼성(소모품샵)과 LG(LGE.COM)뿐이고, 다이슨은 배터리만 공개(추정). 로보락/드리미/에코백스는 공식 소모품 가격을 공개하지 않음 → 이 3개 브랜드의 로봇청소기 수리 비용은 사용자 제보로 채울 수밖에 없음.
2. 청소기 전용 '출장 점검비/수리비(기술료) 기준표'는 삼성/LG 모두 공개하지 않음. 공개되는 것은 가전 공통 출장비뿐이며, 수리비는 방문 후 엔지니어가 산정한다고 안내.
3. 삼성 출장비 표는 라벨 없이 2개가 병기돼 있어 어느 쪽이 현재 유효한지 페이지만으로는 확정 불가(높은 쪽이 2026-01-08 인상분으로 추정). 시드 시 `notes`를 그대로 노출하거나, 삼성 출장비는 보류하고 LG 값만 사용 권장.
4. 보증기간이 수리 vs 교체 판단에 중요한 값: LG 청소기 1년(A9/A9S 인버터모터 10년), LG A9/A9S 배터리 1년(공식 기획전 문구), 로보락 1년(배터리/소모품 제외), 드리미 로봇 2년/배터리 1년, 에코백스 1년(소모품 제외), 다이슨 2년(배터리 포함, 스니펫 기준). 삼성은 청소기 보증기간 자체가 확인 가능한 공식 페이지에서 나오지 않음(재고장 보증 2개월/12개월만 확인).

데이터 사용 시 주의
- 표의 삼성 소모품샵 행은 개별 상품 상세 페이지를 열어 확인했다. 예외는 `DJ44-00013A` 무선청소기 아답터 1건(목록 페이지에서만 확인, 적용모델 미확인)이며 notes에 표시함.
- LG 행 중 `EAC63382208`, `EAC63419404`는 상품 상세 페이지에서 직접 확인했고 나머지는 카테고리 목록 페이지에서 정상가를 확인함(상세 URL 패턴은 `…/care-accessories/<카테고리>/<모델번호>`).
- 다이슨 행은 위 설명대로 스니펫 기반이라 시드 전 재검증을 권장함.

## 2. 가격 표 (공식/공개 출처, 사용자 제보 아님)

`price_KRW`는 정수(원). `-`는 금액 없음(보증기간 등 정보성 행, 또는 금액 미게시). 부가세 여부는 notes의 `VAT:` 항목 참조. 동일 내용의 JSON 배열은 `R6_public_prices.json`에 있으며 키는 `brand, category, model_or_compatible_models, item, item_type, price_KRW, source_name, source_URL, date_seen, notes`임.

| brand | category | model or compatible models | item | item_type | price_KRW | source_name | source_URL | date_seen | notes |
|---|---|---|---|---|---|---|---|---|---|
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반(청소기 전용 요금 미표기) | 출장비 기본 - 평절기(1~5월, 9~12월) | visit_fee | 28,000 | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | VAT: unknown. 요금안내 페이지에 출장비 표 2개가 제목/적용일 없이 병기됨. 본 행은 금액이 높은 표 값이고 낮은 표 값은 25,000원 (낮은 표는 2025년 금액과 일치, 높은 표는 2026-01-08 인상 금액으로 추정되나 이는 언론 보도 기준이며 페이지 자체에는 적용일 미표기). 유상수리 시 거리 무관 부과. 고장이 아니거나 단순 소모품 교체/수리 취소 시에도 보증기간과 무관하게 청구. 제품군(청소기 등)별 구분은 페이지에 없음. 오늘(11월)은 평절기. |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반(청소기 전용 요금 미표기) | 할증 출장비 - 평절기, 평일 18시 이후 및 토/일/공휴일/대체휴일 | visit_fee | 33,000 | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | VAT: unknown. 요금안내 페이지에 출장비 표 2개가 제목/적용일 없이 병기됨. 본 행은 금액이 높은 표 값이고 낮은 표 값은 30,000원 (낮은 표는 2025년 금액과 일치, 높은 표는 2026-01-08 인상 금액으로 추정되나 이는 언론 보도 기준이며 페이지 자체에는 적용일 미표기). 유상수리 시 거리 무관 부과. 고장이 아니거나 단순 소모품 교체/수리 취소 시에도 보증기간과 무관하게 청구. 제품군(청소기 등)별 구분은 페이지에 없음.  |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반(청소기 전용 요금 미표기) | 출장비 기본 - 성수기(6~8월) | visit_fee | 33,000 | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | VAT: unknown. 요금안내 페이지에 출장비 표 2개가 제목/적용일 없이 병기됨. 본 행은 금액이 높은 표 값이고 낮은 표 값은 30,000원 (낮은 표는 2025년 금액과 일치, 높은 표는 2026-01-08 인상 금액으로 추정되나 이는 언론 보도 기준이며 페이지 자체에는 적용일 미표기). 유상수리 시 거리 무관 부과. 고장이 아니거나 단순 소모품 교체/수리 취소 시에도 보증기간과 무관하게 청구. 제품군(청소기 등)별 구분은 페이지에 없음.  |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반(청소기 전용 요금 미표기) | 할증 출장비 - 성수기, 평일 18시 이후 및 휴일 | visit_fee | 38,000 | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | VAT: unknown. 요금안내 페이지에 출장비 표 2개가 제목/적용일 없이 병기됨. 본 행은 금액이 높은 표 값이고 낮은 표 값은 35,000원 (낮은 표는 2025년 금액과 일치, 높은 표는 2026-01-08 인상 금액으로 추정되나 이는 언론 보도 기준이며 페이지 자체에는 적용일 미표기). 유상수리 시 거리 무관 부과. 고장이 아니거나 단순 소모품 교체/수리 취소 시에도 보증기간과 무관하게 청구. 제품군(청소기 등)별 구분은 페이지에 없음.  |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반 | 고객 요청 점검(제품 고장이 아닌 경우) 출장 점검 | inspection_fee | - | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | 점검비 금액은 페이지에 없음. '제품 고장이 아닌 고객 요청에 의한 제품 점검(보증기간 내라도 유상 수리)'이며 고장 아님/소모품 교체만 필요한 경우에도 출장비 청구. 제품 내부 먼지/이물 제거(세척)도 유상수리 대상(금액 미표기). 수리비(기술료) 기준표와 부품 가격표는 페이지에 없음. |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반 | 동일 부위 재고장 무상 보증(부품 미사용 수리) | warranty | - | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | 수리일로부터 2개월 이내. 제품별(청소기) 품질보증기간 자체는 이 페이지에 미표기. 보증기간 경과 후 무상/할인 수리 시에도 소비자분쟁해결기준에 따른 2개월 적용. |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 가전 전반 | 일반부품 교체 후 같은 부품 재고장 12개월 / 리퍼부품 교체 후 재고장 1년 | warranty | - | 삼성전자서비스 요금안내 | <https://www.samsungsvc.co.kr/info/fee> | 2026-11-17 | 페이지 문구: 일반부품 재고장 수리일로부터 12개월 이내, 리퍼부품 교체 후 재고장 수리일로부터 1년 이내. |
| 삼성전자서비스 | robot-vacuum + cordless-vacuum | 소모품샵 주문 전반 | 소모품샵 택배 배송비 | shipping_fee | 2,500 | 삼성전자서비스 소모품샵 상품상세(DJ96-00205B 청소기 배터리) | <https://www.samsungsvc.co.kr/shop/product/0000012975> | 2026-11-17 | VAT: unknown. 20,000원 미만 주문 시 배송비 2,500원, 20,000원 이상 무료. CJ대한통운만 가능, 결제 후 2~5일. 소모품샵 구매품은 삼성전자서비스 A/S 및 교환 가능(반품/환불은 소모품샵에서만). 이 상품 페이지는 '출시 예정입니다' 문구 표시. |
| 삼성전자서비스 | cordless-vacuum | 비스포크 제트 계열: VS20A95*/VS20B95*, VCA-SBTA95, VCA-SAPA95 등 143개 적용모델 | BESPOKE 제트 220W 배터리 (DJ96-00242D) | battery | 160,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000090680> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 페이지: 부품은 제품 모델에 따라 다를 수 있으니 적용모델 확인 안내. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | 제트 계열: VS20R9*, VS20T7*/VS20T8282/VS20T9* 등 134개 적용모델 | 제트 배터리 (DJ96-00221C) | battery | 150,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000127342> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 재입고알림 버튼 표시(일시품절 추정; 목록에는 '일시품절'). 최대 주문 3개. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | VS15A6031P1, VS15R85*, VS15T703*, VS19R1004BF, VCA-SBT90E 등 80개 적용모델 | 제트용 배터리 (DJ96-00227A) | battery | 150,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000024961> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 상태 문구 없음(구매 버튼 표시). 최대 주문 5개. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | 제트 200W SE용: VS20B7512*, VS20R9056*, VS20T75*, VS20T92* 등 30개 적용모델 | 제트 200W SE용 배터리 (DJ96-00227C) | battery | 150,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000085295> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 상세정보에 'VCA-SBT90 비호환' 문구가 있으나 적용모델 목록에는 VCA-SBT90EB 포함: 구매 전 확인 필요. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | VCA-SBT60, VS03R6523J2, VS60K6030*/VS60K6050KW (7개 적용모델) | 청소기 배터리 (DJ96-00205D) | battery | 120,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000171956> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 상태 문구 없음(구매 버튼 표시). 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | 파워건: VS80M8* (9개), VCA-SBT80 | 파워건 배터리 (DJ96-00214A) | battery | 200,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000011071> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 상태 문구 없음. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | robot-vacuum | 비스포크 제트 봇: VR30T80313*, VR30T85513/85514 (33개 적용모델) | BESPOKE 제트 봇 배터리 (DJ96-00233A) | battery | 77,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000090642> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 상태 문구 없음. 최대 주문 5개. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | robot-vacuum | 비스포크 제트 봇 AI 계열: VR50B9563*, VR50B95936*, VR50C95A46A, VR50T959*, VR50T95735W (28개 적용모델) | BESPOKE 제트 봇 배터리 (DJ96-00234A) | battery | 128,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000090678> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 페이지 본문이 길어(약 16만 자) 앞 10만 자까지만 읽었으나 가격과 적용모델 앞부분은 확인됨. 배터리 목록: https://www.samsungsvc.co.kr/shop/product?category=10424&directory=10770 (9개 상품). |
| 삼성전자서비스 | cordless-vacuum | 비스포크 제트 청정스테이션용: VS20A95* (52개 적용모델) | 비스포크 제트용 청정스테이션 먼지봉투 (DJ67-00906A) 1장 | consumable | 4,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000029477> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 페이지에 '먼지봉투 1장의 가격'이라고 명시. |
| 삼성전자서비스 | robot-vacuum | 비스포크 제트 봇: VR30T85*, VR50T959*, VR50B95*, VCA-RDB95, VR7MD*, VR70F00/VR80F01/VR90F01 등 (74개 적용모델) | BESPOKE 제트 봇 먼지봉투 (DJ67-00878B) | consumable | 4,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000079860> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 재입고알림 버튼만 표시(구매 불가 추정; 목록에는 '일시품절'). 수량 단위(1장/묶음)는 페이지에서 미확인. |
| 삼성전자서비스 | cordless-vacuum | VS15R8543S1, VS19R1004BF, VS20R90* 등 제트 계열 16개 적용모델 | 제트 먼지통 필터 (DJ97-02649B) | consumable | 21,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000069222> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | robot-vacuum | 비스포크 제트 봇: VR30T80313*, VR30T85513/85514 (22개 적용모델) | BESPOKE 제트 봇 모터 필터 (DJ97-02924A) | consumable | 20,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000086185> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | cordless-vacuum | 비스포크 제트 계열: VS20A956~959*, VS20B956/957* (97개 적용모델) | 청소기 모터 필터 (DJ97-03090A) | consumable | 17,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000069262> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | robot-vacuum | VR50B9563*, VR50C95A46*, VR50T95735W* 등 (31개 적용모델) | 먼지통 ASSY CASE CYCLONE (DJ97-02918A) | part | 64,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000172585> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | robot-vacuum | 구형 로봇청소기 VC-R*/VCR8*/VR10* 계열 (237개 적용모델) | 로봇청소기 사이드 브러쉬(오른쪽) (DJ97-01330C) | consumable | 13,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000083571> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 페이지에 '출시 예정입니다' 문구가 있어 실제 판매 여부 불확실. |
| 삼성전자서비스 | robot-vacuum | 비스포크 제트 봇: VR30T80313*, VR30T85513/85514 (35개 적용모델) | 비스포크 제트봇 코너 브러쉬 1개 (DJ97-02985A) | consumable | 10,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000084307> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | cordless-vacuum | 제트 200W 계열: VS20T92*, VS15R85*, VS15T7037PA, VCA-WB652, VCA-SPW92 (20개 적용모델) | 제트 200W용 물걸레 브러쉬 다회용청소포 (DJ98-01152A) | consumable | 26,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000079074> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | cordless-vacuum | 제트 계열: VS20A956/957, VS20B956/957, VS15R854/857, VS20T*, VCA-WB* (94개 적용모델) | 제트 200W용 물걸레 브러쉬 일회용포 장착패드 (DJ98-01153A) | consumable | 20,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000079022> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내).  |
| 삼성전자서비스 | cordless-vacuum | 제트 200W: VS20T8282B2, VS20T92*, VCA-WB652 (25개 적용모델) | 제트 200W용 물걸레 브러시 (DJ97-02801A) | part | 120,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000024969> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). '물걸레(패드)는 미포함' 명시. 페이지에 '출시 예정입니다' 문구. |
| 삼성전자서비스 | cordless-vacuum | 핸디청소기 VC-PS80~86, VC-PH70/71 (9개 적용모델) | 핸디청소기 아답터 (DJ96-00039A) | part | 31,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product/0000007967> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 무선 핸디형 구형 모델용 충전 어댑터(스틱형 제트 계열과 호환 여부는 미확인). |
| 삼성전자서비스 | cordless-vacuum | 무선청소기(적용모델 상세 미확인) | 무선청소기 아답터 (DJ44-00013A) | part | 49,000 | 삼성전자서비스 소모품샵 | <https://www.samsungsvc.co.kr/shop/product?category=175707397&directory=401594162&option=401597097&page=1> | 2026-11-17 | VAT: unknown(해당 상품 페이지에 부가세 포함 여부 미표기; 요금안내 페이지는 '부품비는 부가세 10% 포함'이라고만 안내). 목록 페이지(카테고리: 아답터)에서만 확인; 상품 상세와 적용모델은 열지 못함. |
| LG전자 | robot-vacuum + cordless-vacuum | LG전자 가전 전반(청소기 전용 요금 미구분) | 출장비(출장점검료) 기본 | visit_fee | 28,000 | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=182> | 2026-11-17 | VAT: unknown. 거리와 무관하게 동일, 제품 수리 여부와 상관없이 출장을 요구하는 유상수리에 적용. 수리 시 점검비(출장점검료)는 수리비에 합산. seq=184, seq=235 페이지에도 동일 금액 확인. |
| LG전자 | robot-vacuum + cordless-vacuum | LG전자 가전 전반 | 출장비 - 평일 18시 이후, 주말/공휴일 | visit_fee | 33,000 | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=182> | 2026-11-17 | VAT: unknown. 거리와 무관하게 동일, 제품 수리 여부와 상관없이 출장을 요구하는 유상수리에 적용. 수리 시 점검비(출장점검료)는 수리비에 합산. 예외 1. |
| LG전자 | robot-vacuum + cordless-vacuum | LG전자 가전 전반 | 출장비 - 여름 성수기(6~8월) 기본 | visit_fee | 33,000 | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=182> | 2026-11-17 | VAT: unknown. 거리와 무관하게 동일, 제품 수리 여부와 상관없이 출장을 요구하는 유상수리에 적용. 수리 시 점검비(출장점검료)는 수리비에 합산. 예외 2. |
| LG전자 | robot-vacuum + cordless-vacuum | LG전자 가전 전반 | 출장비 - 여름 성수기(6~8월) 평일 18시 이후, 주말/공휴일 | visit_fee | 38,000 | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=182> | 2026-11-17 | VAT: unknown. 거리와 무관하게 동일, 제품 수리 여부와 상관없이 출장을 요구하는 유상수리에 적용. 수리 시 점검비(출장점검료)는 수리비에 합산. 예외 2. |
| LG전자 | robot-vacuum + cordless-vacuum | LG전자 가전 전반(청소기 포함) | 고객 요청 점검(제품 이상유무 점검) 출장점검료 | inspection_fee | 28,000 | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=184> | 2026-11-17 | VAT: unknown. '제품 이상유무 점검' 등 고객 요청 점검은 보증기간 내라도 유상, 금액은 출장점검료와 동일 기준(기본 28,000원, 위 할증 적용). 제품 내부 먼지/필터 막힘으로 인한 서비스 요청도 유상. 별도 점검비 항목은 없음. |
| LG전자 | robot-vacuum + cordless-vacuum | 청소기(일반제품) | 청소기 일반 품질보증기간 | warranty | - | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=184> | 2026-11-17 | 청소기는 일반제품으로 보증기간 1년(페이지의 일반제품 목록에 청소기 포함). 영업/업무용 사용 시 보증기간 절반. 동일 부위/증상 재고장: 부품 미사용 수리 2개월, 부품 사용 시 동일 부품 1년. |
| LG전자 | cordless-vacuum | A9, A9S, A9X, 싸이킹 전체(인버터모터); A9 Air, R5 시리즈, ODM(인버터모터) | 인버터모터 핵심부품 보증 | warranty | - | LG전자 고객지원 - 센터 방문 예약(출장비 안내) | <https://www.lge.co.kr/support/visit-center-reservation?seq=184> | 2026-11-17 | A9/A9S/A9X/싸이킹 인버터모터 10년, A9 Air/R5 시리즈/ODM 제품 인버터모터 1년(페이지 표기). 필터 막힘/내부 먼지로 인한 서비스는 유상. |
| LG전자 | cordless-vacuum | A9/A9S 배터리(EAC63382212 표기) | LGE.COM/ThinQ앱/서비스센터 구매 A9/A9S 정품 배터리 무상 보증 | warranty | - | LGE.COM 정품 배터리 혜택 기획전(종료) | <https://www.lge.co.kr/benefits/exhibitions/detail-PE00157001> | 2026-11-17 | 페이지 문구: 'LGE.COM, ThinQ앱, 서비스 센터에서 구입한 A9/A9S 배터리의 무상 보증 기간은 1년'. 기획전은 종료 표시. 해당 기획전이 안내한 상품 URL(eac63382212)은 404였고, 카테고리 목록의 A9/A9S 배터리 품번은 EAC63382208. |
| LG전자 | cordless-vacuum | 코드제로 A9/A9S (263개 적용모델) | 청소기 A9/A9S 배터리 (EAC63382208) | battery | 129,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382208> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 104,000원 표시. 상품 상세 페이지에서 직접 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9/A9S/A7 | 청소기 A9/A9S/A7 배터리 (EAC63382216) | battery | 129,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 104,000원 표시. 목록 페이지에서 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9/A9S | 청소기 A9/A9S 배터리 2개입 (AGM76872995) | battery | 232,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 220,400원 표시. 목록 페이지에서 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A5 | 청소기 A5 배터리 (COV30090401) | battery | 111,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 105,400원 표시. 목록 페이지에서 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9 Air | 청소기 A9 Air 배터리 (COV37742601) | battery | 97,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 92,100원 표시. 목록 페이지에서 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로보킹 R9 계열 24개 적용모델(R96*/R97* 등) | 로봇청소기 R9 배터리 (EAC63419404) | battery | 190,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/care-accessories/robotic-vacuum-cleaner/eac63419404> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 180,500원 표시. 상품 상세 페이지에서 직접 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로봇청소기 HIT(구 로보킹) / M9 | 로봇청소기 HIT/M9 배터리 커넥터 포함 (AGM30061001) | battery | 78,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 74,100원 표시. 목록 페이지에서 확인. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9S | 청소기 A9S 프리필터 (ADQ75807101) | consumable | 15,700 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 14,900원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9 | 청소기 A9 배기필터+커버 분리형 카밍베이지 (ADQ75804701) | consumable | 35,100 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 33,300원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9/A9S/A7/A5/M9 | 물걸레 4개입 (AAA77685216) | consumable | 28,300 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 26,800원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9/A9S/A7/A5/M9 | 일회용 물걸레 청소포 부착패드 2개입 (AGM76949503) | consumable | 16,800 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 15,900원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9S 안심 스팀 물걸레 흡입구 전용 | 스팀 물걸레 4개입 (AAA77685256) | consumable | 42,500 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 40,300원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | cordless-vacuum | 코드제로 A9 시리즈 / 올인원타워 | 자가관리키트 A타입(프리필터, 배기필터, 먼지봉투 포함) (AGF78838473) | consumable | 91,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/a9-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 86,400원 표시. 목록 페이지; 키트 구성품 합산가. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로봇청소기 R5 | R5 필터(흡입+물걸레) (EBZ64603001) | consumable | 6,900 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 6,500원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로봇청소기 R5 | R5 물걸레 (EBZ64604501) | consumable | 5,300 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 5,000원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로봇청소기 R5 | R5 먼지통 (EBZ64602901) | part | 18,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 17,100원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로봇청소기 R5 | R5 물통 (EBZ64604203) | part | 53,900 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 51,200원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로보킹 AI 올인원 | 로보킹 AI 올인원 먼지봉투 3개입 (AGF78838478) | consumable | 25,200 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 23,900원 표시. 목록 페이지; 3개입 가격. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로보킹 AI 올인원 | 로보킹 측면 회전솔(우) (ABC73130003) | consumable | 8,400 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 7,900원 표시. 목록 페이지; 좌측(ABC73129903)도 정상가 8,400원. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로보킹 AI 올인원 | 로보킹 AI 올인원 기본 브러시 (AHR74152602) | consumable | 30,400 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 28,800원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum | 로보킹 AI 올인원 | 로보킹 AI 올인원 엉킴 방지 브러시 (AHR74152601) | consumable | 24,200 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/category/care-accessories/robotic-vacuum-cleaner> | 2026-11-17 | VAT: unknown(페이지에 부가세 문구 없음). 정상가(할인 전 판매가) 기준; 일반회원 할인가 22,900원 표시. 목록 페이지. 택배 3,000원(2만원 이상 무료). |
| LG전자 | robot-vacuum + cordless-vacuum | LGE.COM 케어액세서리 주문 전반 | 택배배송비 | shipping_fee | 3,000 | LG전자 케어액세서리(LGE.COM) | <https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382208> | 2026-11-17 | VAT: unknown. '택배배송 3,000원 (2만원 이상 무료 배송)' 문구가 상품 상세 페이지(A9/A9S 배터리, R9 배터리)에 표시. |
| 다이슨 코리아 | cordless-vacuum | V8 (SV10, SV10E; SV10K 제외) | V8 배터리 967834-07 | battery | 99,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/dyson-v8-battery> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. |
| 다이슨 코리아 | cordless-vacuum | V8 슬림 (SV10K) | V8 슬림 배터리 969106-01 | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/support/dyson-v8-slim-battery?bv=971174-01> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. URL의 bv=971174-01과 스니펫의 부품번호 969106-01이 다르게 표기됨. |
| 다이슨 코리아 | cordless-vacuum | V10 전 모델 | V10 배터리 (부품번호 스니펫상 969352-02) | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/support/dyson-v10-battery?bv=973267-01> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. URL의 bv=973267-01과 스니펫의 부품번호 969352-02가 다르게 표기됨. |
| 다이슨 코리아 | cordless-vacuum | V11 플러피, V11 컴플리트, V11 220 에어와트 등 (고정형 배터리) | V11 고정형 배터리 팩 970145-04 | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/dyson-v11-battery-970145-04> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 재고 있음 표시. |
| 다이슨 코리아 | cordless-vacuum | V11 교체형(클릭인) 배터리 모델 | V11 충전기 포함 교체형 배터리 팩 970343-03 | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/dyson-v11-click-in-battery-970343-03> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. |
| 다이슨 코리아 | cordless-vacuum | V12 디텍트 슬림, V12s 서브마린, V12 오리진 | V12 무선 청소기 배터리 965470-01 | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/dyson-v12-battery> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. |
| 다이슨 코리아 | cordless-vacuum | V12 디텍트(오리진/서브마린과는 호환 불가) | V12 충전기 포함 배터리 팩 971450-03 | battery | 150,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/v12-power-pack-charger-kit> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. 충전기 포함 구성. |
| 다이슨 코리아 | cordless-vacuum | V15 디텍트, 아웃사이즈, V15 오리진 | V15 디텍트 배터리 971447-03 | battery | 129,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/dyson-v15-click-in-battery-971447-03> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내.  |
| 다이슨 코리아 | cordless-vacuum | 다이슨 디지털 슬림 전 모델 | 디지털 슬림 교체형 배터리 970774-01 | battery | 140,000 | 다이슨 코리아 공식몰(dyson.co.kr) | <https://www.dyson.co.kr/click-in-battery-970774-01> | 2026-11-17 | VAT: unknown. 이 행은 WebFetch가 dyson.co.kr에서 403(접근 거부)이라 직접 열람하지 못하고 WebSearch 결과(공식몰 페이지 스니펫)로만 확인 - 신뢰도 중간, 재확인 필요. 배터리 페이지에는 '사용 중인 제품이 2년 미만이라면 보증 적용 가능, 다이슨 헬프라인 문의' 안내. 검색 시점 품절 표시. |
| 다이슨 코리아 | cordless-vacuum | 다이슨 무선청소기(공식몰 약관) | 무선청소기 제품 품질보증기간 | warranty | - | 다이슨 코리아 웹사이트 판매 약관 | <https://www.dyson.co.kr/footer-secondary-links/terms-of-sale> | 2026-11-17 | 스니펫 기준 2년 무상 보증(구입일 또는 배송일부터, 구매 증빙 필요). 배터리도 구매 후 2년 보증, 리퍼브 제품은 1년. 직접 fetch는 403이라 WebSearch 스니펫으로만 확인 - 재확인 필요. |
| 다이슨 코리아 | cordless-vacuum | 다이슨 전 제품 | 보증기간(2년) 이후 추가 2년 유상수리 지원 및 유상 수리비 인하(2023-11 공지) | warranty | - | 다이슨 뉴스룸 - 한국 고객에 대한 AS 지원 및 헌신 약속 | <https://www.dyson.co.kr/newsroom/2023-as-policy-update> | 2026-11-17 | 스니펫이 '모든 제품 대상'이라는 요약과 '헤어 케어 제품 대상'이라는 요약으로 갈려 적용 범위가 불명확. 구체 금액 미표기. 2023-11-22 공지로 현재 유효 여부 불확실. 직접 fetch 403. |
| 로보락 코리아 | robot-vacuum + cordless-vacuum | 로보락 로봇청소기/무선청소기 전반 | 신제품 품질보증기간 | warranty | - | 로보락 코리아 서비스 및 보증 | <https://kr.roborock.com/pages/roborock-service-warranty> | 2026-11-17 | 구매일로부터 1년(재료/제작 결함). 수리/교체 제품은 완료일로부터 90일과 잔여 보증기간 중 긴 쪽. 페이지에 수리비/출장비/택배비 금액 없음. |
| 로보락 코리아 | robot-vacuum + cordless-vacuum | 로보락 전반 | 배터리 등 소모품, 필터/브러시/액세서리 보증 제외 | warranty | - | 로보락 코리아 서비스 및 보증 | <https://kr.roborock.com/pages/roborock-service-warranty> | 2026-11-17 | '배터리와 같은 소모품'은 보증 제외(소모품이 아닌 부품의 재료/제작 결함은 예외). 필터, 브러시 등 액세서리도 제외. 공식 스토어(kr.roborock.com)에는 소모품/배터리 가격 페이지를 찾지 못함(액세서리 컬렉션 링크는 404). |
| 드리미 코리아 | robot-vacuum | 드리미 로봇청소기 시리즈 | 로봇청소기 본체 보증 | warranty | - | 드리미 코리아 A/S 정책(공식 스토어) | <https://store.kr.dreametech.com/pages/a-s-policy> | 2026-11-17 | 2년(5. 주요 부품의 보증 기간 표). 품질 결함이 보증 범위면 검사비/재료비/인건비/배송비를 드리미가 부담. 보증 외/고객 과실 시 수리비+부품비+편도 배송비 고객 부담(금액 미표기), 유상수리 취소 시 왕복 배송비 고객 부담. |
| 드리미 코리아 | robot-vacuum | 드리미 로봇청소기 시리즈 | 로봇청소기 배터리 보증 | warranty | - | 드리미 코리아 A/S 정책(공식 스토어) | <https://store.kr.dreametech.com/pages/a-s-policy> | 2026-11-17 | 1년. |
| 드리미 코리아 | robot-vacuum | 드리미 로봇청소기 시리즈 | 메인 브러시, 메인 브러시 커버, 오수통, 청수통 보증 | warranty | - | 드리미 코리아 A/S 정책(공식 스토어) | <https://store.kr.dreametech.com/pages/a-s-policy> | 2026-11-17 | 0.5년(6개월). 로봇청소기 소모품은 '보증 없음'. |
| 드리미 코리아 | cordless-vacuum | 드리미 무선(진공)청소기 시리즈 | 무선청소기 본체 보증 / 소모품 보증 없음 | warranty | - | 드리미 코리아 A/S 정책(공식 스토어) | <https://store.kr.dreametech.com/pages/a-s-policy> | 2026-11-17 | 본체 1년, 소모품 보증 없음. (습건식 청소기 본체 1년, 롤러 브러시/소모품 보증 없음.) 페이지에 방문 출장비/점검비 금액 없음. 공식 스토어/사이트에 소모품·배터리 가격 페이지는 찾지 못함. |
| 에코백스 코리아 | robot-vacuum | DEEBOT/WINBOT 전반 | 제품 보증기간 | warranty | - | ECOVACS 한국 보증서 | <https://help.ecovacs.com/kr/support/warranty> | 2026-11-17 | 구매일로부터 1년(재료/제작 결함). 수리/교체는 무료이나 '배송 및 취급 비용이 청구될 수 있음'(금액 미표기). 구매 영수증과 시리얼 번호 필요. 방문/택배 구분 미표기. |
| 에코백스 코리아 | robot-vacuum | DEEBOT/WINBOT 전반 | 배터리(리모컨/세이프티 팟 배터리), 걸레, 필터, 브러시 등 소모성 부품 보증 제외 | warranty | - | ECOVACS 한국 보증서 | <https://help.ecovacs.com/kr/support/warranty> | 2026-11-17 | 소모품은 'Worn out components'로 보증 제외. 로봇 본체 배터리의 별도 보증기간은 페이지에 없음. 액세서리 페이지(www.ecovacs.com/kr/deebot-winbot-accessories)에 걸레패드 등 12개 상품이 있으나 가격 미표시. |

## 3. 읽지 못한 페이지 / 확인 못 한 항목 (could not read)

아래는 가격을 추측하지 않고 제외한 항목이다.

**다이슨 코리아 (WebFetch 403으로 전부 직접 열람 불가, 접근 우회는 시도하지 않음)**
- https://www.dyson.co.kr/support/journey/fees-and-warranty
- https://www.dyson.co.kr/support/replacement-parts/replacement-batteries
- https://www.dyson.co.kr/dyson-v10-battery
- https://www.dyson.co.kr/replacement-parts/cordless-battery
- https://www.dyson.co.kr/newsroom/2023-as-policy-update
- https://www.dyson.co.kr/footer-secondary-links/terms-of-sale
- 표의 다이슨 배터리 가격은 WebSearch 결과로만 확인. 필터(헤파 필터 29,000원으로 보였으나 V15 부품 페이지 URL을 특정하지 못함), 먼지통, 충전 거치대(페이지마다 133,000원/190,000원으로 엇갈림), 어댑터 가격은 검증 실패로 제외. 다이슨 출장/점검/택배 수리 요금표 유무도 확인 못 함.

**삼성 (samsung.com/sec 배터리 상품 페이지: 가격 칸이 비어 있고 '현재 삼성닷컴에서 상품 정보 확인만 가능')**
- https://www.samsung.com/sec/living-accessories/accessory-vca-sbtc97-d2c/VCA-SBTC97/ (Bespoke AI 제트 대용량 배터리, VS90F*/VS28D*/VS30D*/VS28C*/VS25C* 호환) - 가격 미표시
- https://www.samsung.com/sec/living-accessories/accessory-vca-sbt90vt-d2c2/VCA-SBT90/VT/ (제트 200W용) - 가격 미표시 (검색 스니펫은 128,000원이라 했으나 페이지 본문에서 확인 불가 → 제외)
- VCA-SBTA95/VT, VCA-SBT90E/VT 페이지는 검색 결과로만 확인(품절/판매중지 표시) - 미열람
- https://www.samsung.com/sec/dispute-resolution - 청소기/배터리 보증기간이 별표를 인용만 하고 표가 없음
- 삼성 요금안내(https://www.samsungsvc.co.kr/info/fee)에 수리비(기술료) 기준표와 부품 가격표는 없음
- 소모품샵 목록 중 필터 2~3페이지, 먼지통 2페이지, 브러쉬 2~4페이지(총 38개 중 12개만 확인), 적용모델이 읽히지 않은 목록 항목(예: 핸디청소기 아답터 DJ96-00069A 29,000원은 목록에서만 보였고 상세 미열람으로 제외)
- 삼성 청소기 제품 자체의 품질보증기간을 명시한 공식 페이지는 찾지 못함

**LG전자**
- https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382212 - HTTP 404 (기획전이 안내한 A9/A9S 배터리 상품; 카테고리 목록에서는 EAC63382208)
- LGE.COM 케어액세서리 목록의 '더보기' 이후 항목(무선청소기 114개, 로봇청소기 72개)은 로드되지 않아 읽지 못함 (총 144개/102개 중 30개씩 확인)
- 상품 상세 페이지에 제품별 보증기간 문구는 없음('요금/보증' 링크만 존재). 수리 기술료/부품 가격표도 없음
- https://www.lge.co.kr/support/solutions-20154121275460 은 TV 수리비 산정 안내라 청소기 정보 없음

**로보락 코리아**
- https://kr.roborock.com/collections/accessories-s8-series, accessories-q-revo, accessories-stickwet, accessories-rockdock - 모두 HTTP 404 (메뉴에 링크는 있으나 페이지 없음)
- https://kr.roborock.com/pages/contact-us - 서비스 요금/방문/택배 안내 없음 (연락처만)

**드리미 코리아**
- https://kr.dreametech.com/support/faq?no=78 (A/S 서비스센터 안내) - 본문이 이미지라 읽지 못함
- https://kr.dreametech.com/support/service_center - 문의 양식만 있고 요금/보증 정보 없음

**에코백스 코리아**
- https://www.ecovacs.co.kr/ - HTTP 503
- https://www.ecovacs.com/kr/deebot-winbot-accessories 및 /mopping-pad-x5 - 가격 미표시
- https://help.ecovacs.com/kr/support/contact-us - 미열람

**iRobot 코리아**
- https://www.irobot.co.kr/ , https://irobot.co.kr/ - DNS 해석 실패(세션 네트워크 허용 목록 밖). 허용 후 재시도 필요. 이 때문에 iRobot은 0행.

**규제/공공 출처**
- https://www.law.go.kr/행정규칙/소비자분쟁해결기준 - 페이지가 메뉴만 반환하고 별표(품목별 품질보증기간/부품보유기간) 본문을 읽지 못함 (고시 제2025-14호, 시행 2025-12-18로만 확인)

**조사 한계**
- WebSearch 호출 한도(턴당 200회, 에이전트 공동 사용)에 도달해 조사 후반부 검색이 막힘. 그 결과 다음이 미수행: LG 청소기 품질보증/배터리 보증 공식 페이지 추가 탐색, 로보락·에코백스·드리미의 공식 AS 요금 페이지 추가 탐색, 다이슨 소모품(필터/먼지통) 개별 페이지 확인, 삼성 로봇청소기 외 모델의 추가 소모품 확인. 후속 요청으로 이어서 조사 가능.
- 이번 조사는 개별 공개 페이지를 하나씩 열람하는 방식으로만 진행했고, 접근이 막힌 사이트(다이슨 403, 에코백스 503)는 우회하지 않음.
