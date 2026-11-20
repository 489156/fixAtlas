# 다이슨 무선청소기 배터리: 근거 보강 노트 (1편)

- 작성일·열람일: 2026-11-20(아래 모든 URL 공통)
- 범위: 국내 정품 배터리 가격·부품번호, 보증과 직구품 처리, 배터리 관리 지침·교체 신호, V8 싸이클론 등 모델 사양, 센터 교체와 사용자 경험·불만 통계
- 접근 원칙: dyson.co.kr·dyson.com·각국 다이슨 사이트는 봇 차단(403)이라 우회하지 않았습니다(웹 아카이브·캐시·헤드리스 우회·UA 변경·프록시 모두 미사용). robots.txt를 먼저 받고 허용 경로만 열었습니다. 네이버는 자동 조회하지 않았습니다.
- "로딩" 표기: `curl`=기본 UA 일반 HTTP, `Chromium`=Playwright 헤드리스 기본 UA(블로그 검증기와 같은 방식, `networkidle` 45초). 검증기는 Chromium 실패 시 curl로 넘어가므로 둘 중 하나가 원문을 주면 통과합니다. PDF는 검증기가 curl+pdftotext로 읽습니다.
- 인용 문구는 원문 그대로입니다. PDF는 pdftotext 출력, HTML은 Chromium 또는 curl 본문과 검증기 방식(공백 압축)으로 일치합니다(8절 끝 검증 결과).

## 0. 요약

| 항목 | 결과 |
|---|---|
| 국내 정품 배터리 가격 | 다이슨 원문은 차단으로 확인 불가. 열리는 출처는 제3자 블로그 1곳(공식몰 2026-08-06 확인 기준 V6·V7·V8 슬림·V10·V11 모두 129,000원, 전 모델 품절)뿐. 2021년 소비자원 시험 당시 다이슨(SV17) 배터리 129,000원(데일리안). |
| 기존 스니펫 대조 | "V10~V15 129,000원"은 V10·V11에 한해 블로그로 뒷받침됨(V12·V15는 열리는 출처 없음). "V8 99,000원"은 V8 슬림(969106-01)이 129,000원이라는 블로그 값과 별개 품목(967834)이며, 열리는 출처가 없어 미확인으로 남김. |
| 보증 | 다이슨 한국어 설명서(V11 2020, V10 2017): 구입일부터 2년, 배터리 수명·사용에 따른 방전 시간 감소는 보증 제외, 보증은 구입 국가에서 사용할 때만 유효, 비정품 부품·비공식 수리 제외. 2026년 현재 판매 페이지(컬리, V12 디텍트 슬림) 상품정보고시도 "2년간 품질보증/소비자과실제외". |
| 직구품 | 다이슨 문서상 "구입한 국가에서 사용할 때만 유효". 언론 근거는 ZDNet 2019(직구품 AS 접수 불가, 배터리 구매는 가능)뿐. 2024~2026년 정책 변화 보도는 찾지 못함. |
| 관리 지침·교체 신호 | 설명서: 일반·중간/자동 모드 사용, 방전 직후 충전 금지(식힌 뒤 충전), 5°C 이하 작동·충전 차단, 여분 배터리 번갈아 사용, 배터리 교체 필요 시 헬프라인 문의, LED "Battery fault"(V8 싸이클론)·"배터리 결함"(V10), 2025년형 "비정품 배터리" 경고. TechRadar(2026-01): 다이슨 배터리 관리 페이지 기준 월 1회 완전 방전 권고, 3°C 미만 작동·충전 안 됨. |
| V8 싸이클론 | 다나와 등록 2025년 08월, 사용시간 1시간(최대), 충전 4시간, 배터리 분리형(1개), 배터리 KC 안전확인 XU103838-25002(품목 전지, 모델명 140669, 인증일 2025-05-16). 해외: 대만·중국 2025-08 출시(TWD 14,900), 영국 2025-09-17 £349.99, 60분(V8 Advanced 40분). 국내 정가 549,000원은 열리는 출처 없음. |
| 전압·용량 | 다이슨이 공개한 수치는 허용 경로에서 찾지 못함. 참고로 James Dyson(2018): V10 배터리 "800 charge cycles", "15년 매일 써도 80%" 발언(TechRadar). |
| 센터 교체 | 회사 발표·방문기: 접수 후 약 10분 점검, 부품 있으면 당일 수리, 72시간 목표·초과 시 대여, 평균 1.6일, 고장 아닌 소모품은 유상, 오프라인 센터 52곳·프리미엄 22곳(2026-06). 배터리 교체 공임은 블로그 추정(V6~V8 공임 포함 109,000~119,000원)뿐. |
| 불만 통계 | 다이슨 단독 수치는 2023년(1~10월 1372 접수 864건, 청소기 181건, 청소기 불만은 급격한 배터리 소모 중심)이 최신. 2024~2026년 다이슨 단독 통계 없음. 품목 단위로 2025 피해구제 연보 전기진공청소기 138건(세계일보 2026-06). |

## 1. 정품 배터리 가격·부품번호 (국내)

**1-1. 국내 공식몰 가격(제3자 블로그가 공식몰을 확인한 값)**
- 값: V6 967810-24, V7 968670-02, V8 슬림 969106-01, V10 969352-02, V11 970145-04 모두 129,000원, 다섯 모델 모두 품절(블로그 확인일 2026-08-06)
- URL: https://earn-on-everything.com/entry/%EB%8B%A4%EC%9D%B4%EC%8A%A8-%EC%B2%AD%EC%86%8C%EA%B8%B0-v6-v7-v8-v10-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%85%80%ED%94%84-%EA%B5%90%EC%B2%B4-%EB%B0%A9%EB%B2%95-%EA%B5%AC%EB%A7%A4-%EB%B0%A9%EB%B2%95/ (글 갱신 2026-08-05 표기, 2023-09-19 최초 작성)
- 인용: "V6~V11 모두 129,000원" / "2026-08-06 다이슨 공식 사이트에서 확인한 값입니다"
- 로딩: curl 200, Chromium 200 (검증 결과는 8절)
- 신뢰도: 중간 이하. 제휴 링크가 붙은 정보성 블로그이며 공식 원문은 차단으로 대조하지 못했습니다. 원고에는 "다이슨 공식몰 표시가(제3자 확인, 2026-08 기준)"처럼 출처 성격을 밝히는 편이 안전합니다.

**1-2. 2021년 한국소비자원 비교시험 당시 다이슨 배터리 가격**
- 값: 다이슨(SV17) 배터리 교체 비용 12만9000원(= 129,000원), 시험 7종 중 삼성 16만 원 다음으로 높음
- URL: https://www.dailian.co.kr/news/view/1067219/%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-%ED%8B%88%EC%83%88-%EB%A8%BC%EC%A7%80-%EC%A0%9C%EA%B1%B0-%EB%8B%A4%EC%9D%B4%EC%8A%A8%EC%82%BC%EC%84%B1-2021 (데일리안 2021-12-27)
- 인용: "다이슨 12만9000원이었으며"
- 로딩: curl 200(301 후), Chromium 200
- 주의: 24개월 초과 자료. 현재가가 아니라 "2021년에도 12만 9천 원이었다"는 비교용으로만 쓸 수 있습니다. 같은 기사 "연속사용시간은 다이슨이 80분으로 가장 긴 것으로".

**1-3. 서비스센터 교체 비용(공임 포함) — 블로그 추정**
- 값: V6·V7·V8 정품 99,000~109,000원, 센터 교체 공임 포함 109,000~119,000원 / V10·V11 정품 120,000~150,000원, 센터 공임 포함 130,000~160,000원 / Gen5·V15 정품 약 150,000~180,000원
- URL: https://ktrend.co.kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8-%EC%B2%AD%EC%86%8C%EA%B8%B0-%EB%AA%A8%EB%8D%B8%EB%B3%84-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EA%B5%90%EC%B2%B4-%EB%B9%84%EC%9A%A9/ (2024-12-19)
- 인용: "공임 포함 109,000원~119,000원"
- 로딩: curl 200, Chromium 200
- 신뢰도: 낮음. 근거 표시 없는 범위 추정입니다. 원고 본문 수치로 쓰지 말고 "공임은 확인 필요"의 배경으로만 참고하십시오. 공임이 별도라는 사용자 글(클리앙, "센터에 들고가서 교체받으면 109000원")은 검색 스니펫으로만 보였고 clien.net이 403이라 원문을 열지 못했습니다.

**1-4. 기존 미확인 스니펫과의 대조(교정)**
- "V10~V15 129,000원": V10(969352-02)·V11(970145-04)은 1-1 블로그가 같은 값을 기록. V12(965470-01)·V15(971447-03)·V12 디텍트 충전기 포함 팩 150,000원·디지털 슬림 140,000원은 열리는 출처가 없습니다.
- "V8 99,000원": 1-1 블로그 표의 V8 행은 V8 슬림(969106-01) 129,000원뿐입니다. 일반 V8(967834-07) 가격은 표에 없습니다. 99,000원은 2024-12 블로그 범위(99,000~109,000원)와 클리앙 스니펫(직구가 아닌 센터 구매 99,000원)과 방향은 맞지만 원문 확인 불가로 미확인 유지를 권합니다. 2026-08 블로그가 "V6~V11 모두 129,000원"이라 적었으므로 V8도 129,000원으로 올랐을 가능성이 있습니다(추정).
- 2019년 기사 값 "배터리 정품은 9만5000원"(뉴스클레임 2019-01-06, V8 카본 파이버 맥락)은 7년 전 값이라 현재가로 쓰지 않습니다.

**1-5. V8 싸이클론 배터리 식별 정보(KC)**
- 값: 다나와 V8 싸이클론 사양의 안전확인인증 XU103838-25002 → 제품안전정보센터 조회 결과 품목 "전지", 모델명 140669, 제조사 Flextronics Manufacturing (Zhuhai) Co., Ltd., 제조국 중국, 인증일자 2025-05-16, 인증변경 2025-07-28
- URL: https://prod.danawa.com/info/?pcode=96774743 / https://www.safetykorea.kr/release/certDetail?certNum=XU103838-25002
- 인용: "XU103838-25002"(다나와) / "Flextronics Manufacturing (Zhuhai) Co., Ltd."(제품안전정보센터)
- 로딩: 다나와 curl 200·Chromium 200 / 제품안전정보센터 curl 200, Chromium 502(검증기는 curl로 넘어가 통과)
- 주의: "140669"가 배터리 판매 부품번호인지는 확인하지 못했습니다(KC 모델명). 정품 V8 싸이클론 배터리 국내 가격은 찾지 못했습니다.

## 2. 보증(2년·배터리 마모 제외)과 직구품

**2-1. 다이슨 한국어 사용자 설명서(V11, PDF 2020-02)**
- URL: https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf
- 로딩: curl 200(PDF, pdftotext로 문구 일치 확인). dyson.co.uk robots.txt는 `/content/dam/`를 막지 않습니다.
- 인용(각각 원문 그대로):
  - 보증 기간: "다이슨 제품 구입일로부터 2년 동안"(문장 전체: "무료 2년 보증을 활성화한 후에는 보증 약관에 따라 다이슨 제품 구입일로부터 2년 동안 다이슨 무선 진공 청소기의 부품 교환 및 수리 (필터 제외)가 보장됩니다.")
  - 배터리 마모 제외: "배터리 수명 또는 사용으로 인한 배터리 방전 시간의 감소(해당할 경우)"
  - 구입 국가 한정: "이 보증은 제품을 구입한 국가에서 사용할 때만 유효합니다."
  - 비정품: "다이슨의 정품이 아닌 부품과 액세서리를 사용한 경우."
  - 비공식 수리: "다이슨이나 다이슨 공식 대리점 이외의 당사자가 실시한 수리나 개조."
  - 정품 배터리: "다이슨 배터리(부품 번호 355983)"
- 해석: 보증 2년 안에도 "닳아서 짧아진 사용 시간"은 무상 대상이 아니라는 문구입니다. 불량(셀 결함·충전 불가)과 노화(사용 시간 감소)를 가르는 판단은 다이슨이 합니다("다이슨의 판단 하에").

**2-2. 다이슨 V10 앱솔루트(SV12) 한국어 설명서(PDF 2017-09)**
- URL: https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/SV12_ABSOLUTE_UG_FEAST.pdf
- 인용: "구입일로부터 2년 동안 부품 교환 및 수리(필터 제외)가 보증됩니다." / "배터리 방전 지속 시간의 감소는 배터리의 수명이나 사용으로 인한 것입니다."(보증 범위 예외 목록) / "이 보증은 제품을 구입한 국가에서 사용할 때만 유효합니다."
- 로딩: curl 200(PDF)

**2-3. 2026년 판매 페이지의 보증 표기(상품정보제공고시)**
- 값: 품질보증기준 "2년간 품질보증/소비자과실제외", 수입자 다이슨코리아 유한회사, 배터리 KC XU101904-20007, A/S 080-300-4253(수신자 부담)/1588-4253(월-금 9~18시)
- URL: https://www.kurly.com/goods/1001940320 (마켓컬리, 다이슨 V12 디텍트 슬림 골드/골드, 판매자 주식회사 디라이트컴퍼니, 동일모델 출시년월 2023년 6월)
- 인용: "2년간 품질보증/소비자과실제외"
- 로딩: curl 200, Chromium 200. kurly.com robots.txt `User-agent: *` 허용.
- 주의: 판매자(다이슨 직영 아님)가 입력한 법정 고시입니다. 배터리를 따로 적지 않았으므로 "배터리 2년"의 근거로는 2-1 설명서와 함께 쓰십시오.

**2-4. 직구품 AS (언론, 2019)**
- URL: https://zdnet.co.kr/view/?no=20191113154413 (ZDNet Korea 2019-11-13)
- 인용: "다이슨은 해외 직구 제품의 경우 AS 접수를 받지 않는다." / "다만 청소기 배터리 구매는 가능하다."
- 로딩: curl 200, Chromium 200
- 주의: 24개월 초과. 2024~2026년 정책 변화를 다룬 기사·공식 문서를 찾지 못했습니다(7절). 원고에는 "2019년 보도 기준"과 2-1의 "구입한 국가에서 사용할 때만 유효" 문구를 함께 쓰는 구성이 안전합니다.

**2-5. 2023-11 AS 정책 발표(언론)**
- URL: https://zdnet.co.kr/view/?no=20231122141806 (ZDNet Korea 2023-11-22)
- 인용: "72시간 업무 시간 이내에 모든 제품 수리를 완료하거나" / "보증기간 이후 최대 2년간 헤어 케어 제품 유상 수리 비용 인하"
- 로딩: curl 200, Chromium 200
- 주의: 보증 후 유상 수리비 인하는 이 기사 기준 헤어케어 제품 대상입니다. 청소기 배터리 유상 교체가 싸졌다는 근거로 쓰면 안 됩니다. 다이슨 뉴스룸 원문은 차단입니다.

## 3. 배터리 관리 지침과 교체 신호 (다이슨 설명서 우선)

| 내용 | 인용(원문) | 출처 | 로딩 |
|---|---|---|---|
| 방전 직후 충전하지 말고 식힌 뒤 충전 | "배터리 수명을 연장하기 위해서는 방전 후 바로 충전하지 마십시오." | V11 설명서 PDF(2-1), V10 설명서 PDF(2-2)에도 같은 문장 | curl·PDF |
| 교체가 필요하면 헬프라인 문의 | "배터리 교체가 필요한 경우 다이슨 헬프라인에 문의하십시오." | V11 설명서 PDF | curl·PDF |
| 일반·중간/자동 모드 권장 | "최적의 배터리 성능과 수명을 유지하려면 일반 모드 또는 중간/자동 모드를 사용하십시오." | V12s 디텍트 슬림 서브마린(N620H) 한국어 설명서 PDF 2023-06 | curl·PDF |
| 여분 배터리 번갈아 쓰기 | "추가 교체형 배터리가 있는 경우, 배터리 성능을 유지할 수 있도록 서로" | N620H 설명서 | curl·PDF |
| 5°C 이하 작동·충전 차단 | "실내 온도가 5°C(41°F) 이하인 경우, 청소기를 작동하거나 충전할 수 없습니다." | V16 피스톤 애니멀(표지 "다이슨 DS60 피스톤 애니멀", N692B) 한국어 설명서 PDF 2025-06 | curl·PDF |
| 비정품 배터리 경고 화면 | "다이슨 정품이 아닌 배터리가 감지되었습니다." | N692B 설명서 | curl·PDF |
| 고장 신호(LED) | "배터리 결함-다이슨 헬프라인으로 전화 문의" | V10(SV12) 한국어 설명서 PDF 2017-09 | curl·PDF |
| 고장 신호(LED) | "Flashing blue Battery fault"(배터리 LED 파란색 깜빡임 = 배터리 고장) | V8 싸이클론(SV55) 영문 설명서 PDF 2025-08(홍콩 경로) | curl·PDF |
| 부스트는 짧게 | "For best performance and battery life, use Boost mode only" | V8 싸이클론 설명서 | curl·PDF |
| 월 1회 완전 방전(다이슨 배터리 관리 페이지 인용) | "drain to completely empty at least once a month" | TechRadar 2026-01-15 | curl 200, Chromium networkidle 시간 초과(검증기 curl 경로로 통과) |
| 3°C 미만 작동·충전 안 됨 | "won't charge or operate if the temperature is below 37F / 3C" | TechRadar 2026-01-15 | 위와 같음 |
| 평소엔 Auto·Normal | "designed to be used in Auto or Normal mode for everyday cleaning" | TechRadar 2026-01-15(다이슨 문구 인용) | 위와 같음 |
| 먼지통·필터 관리가 배터리 수명에도 영향 | "필터만 주기적으로 청소해도 흡입력과 배터리 수명을 오랫동안 유지할 수 있다" | 세계일보 2026-06-27, 다이슨 신사 센터 엔지니어 발언 | curl·Chromium 200 |

URL
- N620H: https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/DYS_P231478_J0004_T01_VX-165653_N620H-CN_2022_OUG_Master_ko-KR_Digital_1_0_0%20(1).pdf
- N692B: https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/N692B_OUG.pdf
- V8 싸이클론: https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/hk_hk/vacuums/Dyson_V8-Cyclone_SV55_User%20Manual_EN.pdf
- TechRadar 관리: https://www.techradar.com/home/vacuums/how-to-preserve-your-dyson-vacuum-battery
- 세계일보: https://www.segye.com/newsView/20260626513467

충돌 기록
- 저온 기준이 문서마다 다릅니다: V11 설명서 10°C(배터리 온도), V10 설명서 3°C, N620H·N692B·V8 싸이클론 5°C, TechRadar(다이슨 페이지 인용) 3°C. 원고에는 "모델별로 3~10°C 아래에서는 작동·충전이 막힌다"처럼 범위로 쓰거나 모델을 특정해야 합니다.
- "월 1회 완전 방전"(다이슨 해외 관리 페이지, TechRadar 인용)은 리튬이온 일반 지침과 어긋납니다. 다이슨 원문을 직접 열지 못했으므로 "TechRadar가 전한 다이슨 안내"로만 인용하십시오.
- TechRadar 기사에서 다이슨 전력 시스템 책임자 Amit Gupta는 BMS가 "배터리가 권장 온도로 식은 뒤에만 충전을 시작한다"고 설명했습니다(인용 문구: "will only initiate charging once it has cooled to the recommended level"). 이는 "방전 직후 충전 금지" 설명서 문구의 이유로 쓸 수 있습니다.

교체 시점에 관한 다이슨 수치
- James Dyson(2018-03, V10 출시 행사): "Fifteen years of daily use might get you down to 80% battery", 기사 본문 "battery is good for 800 charge cycles" — https://www.techradar.com/news/james-dyson-promises-15-year-battery-life-for-the-cyclone-v10-cordless-vacuum (curl 200). 창업자 발언이며 보증 조건과 별개입니다. 2-1의 "배터리 수명·사용에 따른 방전 시간 감소는 보증 제외" 문구와 나란히 두면 독자 판단에 도움이 됩니다.
- 해외 지원 페이지의 "12회 이상 깜빡임" 교체 신호는 다이슨 사이트(차단)에만 있어 확인하지 못했습니다(7절).

## 4. 모델 사양: V8 싸이클론과 비교 대상

**4-1. V8 싸이클론(국내)**
- 다나와 https://prod.danawa.com/info/?pcode=96774743 : 등록년월 2025년 08월, 흡입력 150W, 사용시간 1시간(최대), 충전시간 4시간, 배터리 분리형(1개), 무게 2.5kg, KC 적합성 R-R-DkL-SV55-A, 안전확인 XU103838-25002, 출시연도 2025년형.
  - 인용(값만): "1시간(최대)", "분리형(1개)", "2025년 08월"
  - 로딩: curl 200, Chromium 200. 주의: Chromium 본문에서는 사양표 칸 사이 공백이 없어져("사용시간1시간(최대)") 라벨을 붙인 인용은 실패합니다. 값만 인용하십시오.
- 국내 정가 549,000원·출시일: dyson.co.kr 스니펫에만 있고 열리는 출처는 없습니다(7절). 다나와 최저가는 매일 바뀌므로 원장 값으로 부적합합니다(열람 시 312,620원).
- 기존 V8(2021년 등록) 비교: https://prod.danawa.com/info/?pcode=21760133 — 사용시간 40분(최대), 충전시간 5시간, 흡입력 115W. 인용 "40분(최대)". 로딩: curl 200, Chromium은 networkidle 시간 초과(검증기 curl 경로로 통과).

**4-2. V8 싸이클론(해외 보도)**
- Notebookcheck 2025-08-22 https://www.notebookcheck.net/Dyson-launches-new-powerful-V8-Cyclone-Cordless-Vacuum.1094011.0.html : 대만·중국 먼저 출시, "a longer run time of 60 minutes compared to the 40 minutes offered by the V8 Advanced", "fully recharges in four hours", "priced at TWD 14,900", 중국 CNY 2,999. 로딩: curl 200(Chromium 결과는 8절).
- TechRadar https://www.techradar.com/home/vacuums/dyson-just-released-the-vacuum-we-actually-wanted-an-upgraded-v8-that-costs-basically-the-same-as-the-original : "available from 17 September 2025, at a list price of £349.99"(영국), "can now last up to a full hour on a single charge", "the battery is now removable". 로딩: curl 200.
- 다이슨 V8 싸이클론 설명서(4시간 충전, 버튼 분리 교체형): 3절 URL. 인용 "A full charge will take approximately 4 hours." / "Push firmly until it clicks into place."

**4-3. 비교 모델(국내 다나와 사양, 출시 보도)**

| 모델 | 국내 등록·출시 | 사용시간(최대) | 충전 | 배터리 | 출처 |
|---|---|---|---|---|---|
| V8(2021) | 다나와 2021년 10월 | 40분 | 5시간 | (표기 없음) | 다나와 21760133 |
| V8 싸이클론 | 다나와 2025년 08월 | 1시간 | 4시간 | 분리형(1개) | 다나와 96774743 |
| V15 디텍트 컴플리트 | 다나와 2021년 05월, 출시 2021-05-25 129만원 | 1시간(일반 모드 60분) | 4시간30분 | 분리형(1개) | 다나와 14270219, ZDNet 2021-05-25 |
| V12 디텍트 슬림(골드) | 다나와 2022년 11월(2023년형), 최초 출시 2021-05-25 109만원 | 1시간 | 4시간 | 분리형(1개) | 다나와 27415658, ZDNet 2021-05-25 |
| Gen5 디텍트 | 다나와 2022년 09월 | 1시간10분, "최장 70분" | 4시간30 | 분리형(1개) | 다나와 20295149, 서울신문 2022-09-26 |
| V16 피스톤 애니멀(DS60) | 다나와 2025.06, 6월 국내 출시·한국 글로벌 첫 출시, 129만원/서브마린 149만원 | 70분(해외 보도 "up to 70 minutes", 3.5시간 충전) | (해외 보도 3.5시간) | 교체형(설명서 "교체형 배터리 충전하기") | 다나와 93071342, 뉴데일리 2025-09-05, Notebookcheck 2025-08-28, N692B 설명서 |
| 디지털 슬림(SV18, 2020년형) | 다나와 2022년 09월 | 40분 | 3시간30분 | 분리형(1개) | 다나와 17785652 |
| 싸이클론 V10(2023년 등록 판) | 다나와 2023년 10월 | 1시간 | 3시간30분 | (표기 없음) | 다나와 28552007 |
| V11 앱솔루트 | 다나와 2019년 04월 | 1시간 | 4시간30분 | 분리형(1개) | 다나와 17381300 |

URL
- ZDNet 2021-05-25: https://zdnet.co.kr/view/?no=20210525135243 — "모두 일반 모드로 사용시 60분 이용 가능하며", "V15 디텍트 무게는 3kg며, 가격은 129만원이다.", "가격은 109만원"
- 서울신문 2022-09-26(입력): https://m.seoul.co.kr/news/2022/09/27/20220927019009 — "최장 70분 연속 사용이 가능하다"(Chromium networkidle 시간 초과, curl 200)
- 뉴데일리 2025-09-05: https://biz.newdaily.co.kr/site/data/html/2025/09/05/2025090500176.html — "가격대는 129만원, 물걸레 청소 서브라인이 탑재된 제품은 149만원", "이 제품은 한국에서 글로벌 첫 출시된 후"
- Notebookcheck 2025-08-28(V16): https://www.notebookcheck.net/Dyson-releasing-new-powerful-V16-Piston-Animal-cordless-vacuum-cleaner-globally.1098837.0.html — "it should run for up to 70 minutes on a single charge, fully recharging in 3.5 hours"
- 뉴데일리 본문의 "최대 70분간 315AW의 흡입력을 지속할 정도다"는 사용 시간과 흡입력을 섞은 부정확한 문장이라 인용하지 않습니다.

**4-4. 전압·용량·셀**
- 다이슨이 공개한 전압·용량(V·mAh·Wh)은 허용 경로(설명서 PDF 7종, 언론, 다나와, 제품안전정보센터)에서 찾지 못했습니다. 설명서에는 수치가 없습니다. 제품안전정보센터 상세정보 칸도 비어 있습니다.
- 호환품 판매처·리뷰 DB의 25.2V/3,600mAh 같은 값은 다이슨 수치가 아니므로 원장에 넣지 않았습니다.

## 5. 센터 교체·사용자 경험·불만 통계

**5-1. 다이슨 센터 운영(방문기·회사 발표)**
- ZDNet 2025-06-09 https://zdnet.co.kr/view/?no=20250609135532 (curl·Chromium 200)
  - "전문 상담사가 약 10분간 제품을 곧장 점검해준다"
  - "부품이 센터에 구비된 경우 당일 바로 수리도 가능하다."
  - "다만 제품 이상이 아닌 경우 소모품은 교체 비용을 부담해야 한다."
  - "72시간 안에 완료하는 것을 목표로 삼았다"
  - "AS 처리 시간은 평균 1.6일로 전년 대비 84% 단축"(회사 측 설명)
- 세계일보 2026-06-27 https://www.segye.com/newsView/20260626513467 (curl·Chromium 200)
  - "전국에 52개 오프라인 서비스 센터를 가동 중이며"
  - "서울·인천·부산·대전 등에서 22곳 운영 중인데"
  - 신사 센터 엔지니어 "하루 40~50명의 고객과 수많은 제품을 4명의 인원이 정밀 정비"
- 배터리 교체 비용(부품+공임)을 기사로 확인한 출처는 없습니다. 1-3 블로그 추정뿐입니다. 공식 근거가 필요하면 [현장] 다이슨 고객센터(1588-4253) 문의 1건이 가장 빠릅니다.

**5-2. 불만 통계**
- 다이슨 단독(최신이 2023년): 아이뉴스24 2023-11-17 https://www.inews24.com/view/1655790 (curl·Chromium 200)
  - "다이슨 관련 불만 신고는 864건으로"(2023년 1~10월, 1372소비자상담센터, 한국소비자연맹 집계, 전년 같은 기간 대비 66.8% 증가)
  - "청소기 181건"
  - "청소기는 급격한 배터리 소모에 따른 짧은 작동 시간"
  - 주의: 같은 기사는 헤어기기 572건을 "전체의 75%"라고 적었으나 572/864는 66.2%입니다(다른 매체는 66.2%로 보도). 비율은 인용하지 마십시오.
- 품목 단위(2025 연보): 세계일보 2026-06-27 — 재봉·세탁·청소용품 분야 피해구제 511건 중 로봇청소기 144건, "전기진공청소기(138건)". 브랜드 구분 없음.
- 2024~2026년 다이슨 단독 1372·피해구제 통계는 찾지 못했습니다(7절).

**5-3. 사용자 경험(열람 가능한 것만)**
- 2-4(직구품 AS 불가·배터리 구매 가능), 5-2(배터리 소모 불만)가 열리는 언론 근거입니다.
- 클리앙(센터 배터리 구매 99,000원·센터 교체 109,000원, Gen5 정품 배터리 25만 원 안내 등), 다모앙(센터에서 교환만 가능·15만 원 전후)은 403이라 원문 미확인입니다. 유튜브 "대구 다이슨 서비스센터 이용 후기 (다이슨V8 배터리 교체)"는 동의 페이지로 넘어가 설명란을 읽지 못했습니다.

## 6. 원장 행 (붙여 넣기용)

  - 129,000원 | https://earn-on-everything.com/entry/%EB%8B%A4%EC%9D%B4%EC%8A%A8-%EC%B2%AD%EC%86%8C%EA%B8%B0-v6-v7-v8-v10-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%85%80%ED%94%84-%EA%B5%90%EC%B2%B4-%EB%B0%A9%EB%B2%95-%EA%B5%AC%EB%A7%A4-%EB%B0%A9%EB%B2%95/ | 2026-11-20 | 제3자 블로그가 다이슨 공식몰에서 확인한 V6·V7·V8 슬림·V10·V11 정품 배터리 정가(블로그 확인일 2026-08-06, 전 모델 품절, 공식 원문 미대조) | V6~V11 모두 129,000원
  - 969352-02 | https://earn-on-everything.com/entry/%EB%8B%A4%EC%9D%B4%EC%8A%A8-%EC%B2%AD%EC%86%8C%EA%B8%B0-v6-v7-v8-v10-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%85%80%ED%94%84-%EA%B5%90%EC%B2%B4-%EB%B0%A9%EB%B2%95-%EA%B5%AC%EB%A7%A4-%EB%B0%A9%EB%B2%95/ | 2026-11-20 | 블로그 표의 V10 정품 배터리 부품번호(V11 970145-04, V8 슬림 969106-01도 같은 표) | 2026-08-06 다이슨 공식 사이트에서 확인한 값입니다
  - 129,000원 | https://www.dailian.co.kr/news/view/1067219/%EB%AC%B4%EC%84%A0%EC%B2%AD%EC%86%8C%EA%B8%B0-%ED%8B%88%EC%83%88-%EB%A8%BC%EC%A7%80-%EC%A0%9C%EA%B1%B0-%EB%8B%A4%EC%9D%B4%EC%8A%A8%EC%82%BC%EC%84%B1-2021 | 2026-11-20 | 계산: 원문 표기 12만9000원 — 2021년 한국소비자원 비교시험 다이슨(SV17) 배터리 교체 비용(데일리안 2021-12-27, 24개월 초과) | 다이슨 12만9000원이었으며
  - 109,000원~119,000원 | https://ktrend.co.kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8-%EC%B2%AD%EC%86%8C%EA%B8%B0-%EB%AA%A8%EB%8D%B8%EB%B3%84-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EA%B5%90%EC%B2%B4-%EB%B9%84%EC%9A%A9/ | 2026-11-20 | 블로그 추정(2024-12-19, 근거 미표시): V6·V7·V8 센터 교체 공임 포함 비용 — 본문 수치로 쓰지 말 것 | 공임 포함 109,000원~119,000원
  - XU103838-25002 | https://prod.danawa.com/info/?pcode=96774743 | 2026-11-20 | V8 싸이클론 안전확인인증 번호(배터리 KC) | XU103838-25002
  - 140669 | https://www.safetykorea.kr/release/certDetail?certNum=XU103838-25002 | 2026-11-20 | 제품안전정보센터: XU103838-25002 품목 전지, 모델명 140669, 인증일자 20250516, 중국 제조(Chromium 502, curl 200) | Flextronics Manufacturing (Zhuhai) Co., Ltd.
  - 2년 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서(2020-02) 보증 기간: 구입일부터 2년 부품 교환·수리(필터 제외) | 다이슨 제품 구입일로부터 2년 동안
  - 배터리 마모 보증 제외 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 보증 범위 예외 | 배터리 수명 또는 사용으로 인한 배터리 방전 시간의 감소(해당할 경우)
  - 구입 국가에서만 보증 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 품질 보증 범위(직구품 관련) | 이 보증은 제품을 구입한 국가에서 사용할 때만 유효합니다.
  - 비정품 부품 보증 제외 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 보증 범위 예외 | 다이슨의 정품이 아닌 부품과 액세서리를 사용한 경우.
  - 비공식 수리 보증 제외 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 보증 범위 예외 | 다이슨이나 다이슨 공식 대리점 이외의 당사자가 실시한 수리나 개조.
  - 배터리 교체는 헬프라인 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 배터리 안전 지침 | 배터리 교체가 필요한 경우 다이슨 헬프라인에 문의하십시오.
  - 방전 직후 충전 금지 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/ko-kr/%EB%8B%A4%EC%9D%B4%EC%8A%A8%20V11%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%84%A4%EB%AA%85%EC%84%9C.pdf | 2026-11-20 | 다이슨 V11 한국어 설명서 충전 및 보관 | 배터리 수명을 연장하기 위해서는 방전 후 바로 충전하지 마십시오.
  - 2년 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/SV12_ABSOLUTE_UG_FEAST.pdf | 2026-11-20 | 다이슨 V10 앱솔루트(SV12) 한국어 설명서(2017-09) 보증 기간 | 구입일로부터 2년 동안 부품 교환 및 수리(필터 제외)가 보증됩니다.
  - 배터리 마모 보증 제외 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/SV12_ABSOLUTE_UG_FEAST.pdf | 2026-11-20 | 다이슨 V10 한국어 설명서 보증 범위 예외 | 배터리 방전 지속 시간의 감소는 배터리의 수명이나 사용으로 인한 것입니다.
  - 배터리 결함 표시 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/SV12_ABSOLUTE_UG_FEAST.pdf | 2026-11-20 | 다이슨 V10 한국어 설명서 조명 진단(교체 신호) | 배터리 결함-다이슨 헬프라인으로 전화 문의
  - 일반·중간/자동 모드 권장 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/DYS_P231478_J0004_T01_VX-165653_N620H-CN_2022_OUG_Master_ko-KR_Digital_1_0_0%20(1).pdf | 2026-11-20 | 다이슨 V12s 디텍트 슬림 서브마린 한국어 설명서(2023-06) 배터리 관리 | 최적의 배터리 성능과 수명을 유지하려면 일반 모드 또는 중간/자동 모드를 사용하십시오.
  - 여분 배터리 번갈아 사용 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/DYS_P231478_J0004_T01_VX-165653_N620H-CN_2022_OUG_Master_ko-KR_Digital_1_0_0%20(1).pdf | 2026-11-20 | 다이슨 V12s 한국어 설명서 교체형 배터리 | 추가 교체형 배터리가 있는 경우, 배터리 성능을 유지할 수 있도록 서로
  - 5°C | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/N692B_OUG.pdf | 2026-11-20 | 다이슨 V16 피스톤 애니멀(DS60) 한국어 설명서(2025-06) 저온 차단 | 실내 온도가 5°C(41°F) 이하인 경우, 청소기를 작동하거나 충전할 수 없습니다.
  - 비정품 배터리 경고 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/kr_kr/cordless-vacuums/sticks/N692B_OUG.pdf | 2026-11-20 | 다이슨 V16 피스톤 애니멀(DS60) 한국어 설명서 화면 경고 | 다이슨 정품이 아닌 배터리가 감지되었습니다.
  - 4 hours | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/hk_hk/vacuums/Dyson_V8-Cyclone_SV55_User%20Manual_EN.pdf | 2026-11-20 | 다이슨 V8 싸이클론(SV55) 영문 설명서(2025-08) 완충 약 4시간 | A full charge will take approximately 4 hours.
  - 버튼 분리 교체형 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/hk_hk/vacuums/Dyson_V8-Cyclone_SV55_User%20Manual_EN.pdf | 2026-11-20 | 다이슨 V8 싸이클론 설명서 배터리 교체(딸깍 장착) | Push firmly until it clicks into place.
  - Battery fault | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/hk_hk/vacuums/Dyson_V8-Cyclone_SV55_User%20Manual_EN.pdf | 2026-11-20 | 다이슨 V8 싸이클론 설명서 배터리 LED 파란색 깜빡임 = 배터리 고장 | Flashing blue Battery fault
  - 부스트는 짧게 | https://www.dyson.co.uk/content/dam/dyson/maintenance/user-guides/hk_hk/vacuums/Dyson_V8-Cyclone_SV55_User%20Manual_EN.pdf | 2026-11-20 | 다이슨 V8 싸이클론 설명서 배터리 관리 | For best performance and battery life, use Boost mode only
  - 2년 | https://www.kurly.com/goods/1001940320 | 2026-11-20 | 마켓컬리 다이슨 V12 디텍트 슬림 상품정보제공고시 품질보증기준(판매자 디라이트컴퍼니, 수입자 다이슨코리아) | 2년간 품질보증/소비자과실제외
  - 1588-4253 | https://www.kurly.com/goods/1001940320 | 2026-11-20 | 같은 고시의 A/S 책임자 전화(080-300-4253 수신자 부담, 월-금 9~18시) | 080-300-4253
  - 직구품 AS 접수 불가 | https://zdnet.co.kr/view/?no=20191113154413 | 2026-11-20 | ZDNet Korea 2019-11-13(24개월 초과) | 다이슨은 해외 직구 제품의 경우 AS 접수를 받지 않는다.
  - 직구품 배터리 구매 가능 | https://zdnet.co.kr/view/?no=20191113154413 | 2026-11-20 | ZDNet Korea 2019-11-13 | 다만 청소기 배터리 구매는 가능하다.
  - 72시간 | https://zdnet.co.kr/view/?no=20231122141806 | 2026-11-20 | 다이슨 2023-11 AS 정책 발표(수령 후 72시간 내 수리 또는 대여) | 72시간 업무 시간 이내에 모든 제품 수리를 완료하거나
  - 2년 | https://zdnet.co.kr/view/?no=20231122141806 | 2026-11-20 | 보증 후 유상 수리비 인하는 헤어케어 제품 대상(청소기 배터리 아님) | 보증기간 이후 최대 2년간 헤어 케어 제품 유상 수리 비용 인하
  - 약 10분 | https://zdnet.co.kr/view/?no=20250609135532 | 2026-11-20 | 다이슨 프리미엄 센터 방문기(2025-06-09): 접수 후 현장 점검 | 전문 상담사가 약 10분간 제품을 곧장 점검해준다
  - 당일 수리 | https://zdnet.co.kr/view/?no=20250609135532 | 2026-11-20 | 부품 재고가 있으면 당일 수리 | 부품이 센터에 구비된 경우 당일 바로 수리도 가능하다.
  - 소모품 유상 | https://zdnet.co.kr/view/?no=20250609135532 | 2026-11-20 | 고장 아닌 소모품 교체는 고객 부담 | 다만 제품 이상이 아닌 경우 소모품은 교체 비용을 부담해야 한다.
  - 72시간 | https://zdnet.co.kr/view/?no=20250609135532 | 2026-11-20 | 수리 완료 목표(업무시간 기준, 제품 수령 시점부터) | 72시간 안에 완료하는 것을 목표로 삼았다
  - 1.6일 / 84% | https://zdnet.co.kr/view/?no=20250609135532 | 2026-11-20 | 회사 측 설명: 2024년 말 기준 평균 AS 처리 시간 | AS 처리 시간은 평균 1.6일로 전년 대비 84% 단축
  - 52곳 / 22곳 | https://www.segye.com/newsView/20260626513467 | 2026-11-20 | 세계일보 2026-06-27: 오프라인 서비스 센터 52곳, 프리미엄 센터 22곳 | 전국에 52개 오프라인 서비스 센터를 가동 중이며
  - 138건 | https://www.segye.com/newsView/20260626513467 | 2026-11-20 | 한국소비자원 2025 피해구제 연보 인용: 전기진공청소기 피해구제 접수(브랜드 구분 없음) | 전기진공청소기(138건)
  - 배터리 수명 관리 팁 | https://www.segye.com/newsView/20260626513467 | 2026-11-20 | 다이슨 신사 프리미엄 센터 엔지니어 발언 | 필터만 주기적으로 청소해도 흡입력과 배터리 수명을 오랫동안 유지할 수 있다
  - 864건 | https://www.inews24.com/view/1655790 | 2026-11-20 | 한국소비자연맹 집계 2023년 1~10월 1372 다이슨 불만(24개월 초과, 2024~2026 단독 통계 없음) | 다이슨 관련 불만 신고는 864건으로
  - 181건 | https://www.inews24.com/view/1655790 | 2026-11-20 | 같은 집계의 청소기 건수 | 청소기 181건
  - 배터리 소모 불만 | https://www.inews24.com/view/1655790 | 2026-11-20 | 청소기 불만의 주된 내용 | 청소기는 급격한 배터리 소모에 따른 짧은 작동 시간
  - 1시간(최대) | https://prod.danawa.com/info/?pcode=96774743 | 2026-11-20 | 다나와 V8 싸이클론 사양: 사용시간(최대), 충전 4시간, 등록 2025년 08월 — Chromium에서 표 칸 공백이 사라져 값만 인용 | 1시간(최대)
  - 4시간 | https://prod.danawa.com/info/?pcode=96774743 | 2026-11-20 | 다나와 V8 싸이클론 충전시간·배터리 분리형(1개) | 분리형(1개)
  - 2025년 08월 | https://prod.danawa.com/info/?pcode=96774743 | 2026-11-20 | 다나와 V8 싸이클론 등록년월(국내 출시 시점 대용, 공식 출시일 미확인) | 2025년 08월
  - 40분(최대) | https://prod.danawa.com/info/?pcode=21760133 | 2026-11-20 | 다나와 다이슨 V8(2021년 10월 등록) 사용시간, 충전 5시간 | 40분(최대)
  - 4시간30분 | https://prod.danawa.com/info/?pcode=14270219 | 2026-11-20 | 다나와 V15 디텍트 컴플리트 충전시간(사용시간 1시간 최대, 2021년 05월 등록) | 4시간30분
  - 1시간10분(최대) | https://prod.danawa.com/info/?pcode=20295149 | 2026-11-20 | 다나와 Gen5 디텍트 컴플리트 사용시간(2022년 09월 등록) | 1시간10분(최대)
  - 1시간(최대) | https://prod.danawa.com/info/?pcode=27415658 | 2026-11-20 | 다나와 V12 디텍트 슬림(골드/골드, 2022년 11월 등록) 사용시간 | 2022년 11월
  - 3시간30분 | https://prod.danawa.com/info/?pcode=17785652 | 2026-11-20 | 다나와 다이슨 디지털 슬림(SV18) 충전시간·사용시간 40분(최대), 2022년 09월 등록 | 40분(최대)
  - 1시간(최대) | https://prod.danawa.com/info/?pcode=28552007 | 2026-11-20 | 다나와 다이슨 싸이클론 V10(2023년 10월 등록) 사용시간, 충전 3시간30분 | 2023년 10월
  - 4시간30분 | https://prod.danawa.com/info/?pcode=17381300 | 2026-11-20 | 다나와 다이슨 V11 앱솔루트(2019년 04월 등록) 충전시간, 사용시간 1시간(최대), 배터리 분리형(1개) | 2019년 04월
  - 2025.06 | https://prod.danawa.com/info/?pcode=93071342 | 2026-11-20 | 다나와 V16 피스톤 애니멀 DS60 등록월 | 등록월: 2025.06.
  - 129만원 | https://biz.newdaily.co.kr/site/data/html/2025/09/05/2025090500176.html | 2026-11-20 | 계산: 원문 129만원·149만원 표기 — V16 피스톤 애니멀 가격대, 서브마린 포함 149만원(뉴데일리 2025-09-05) | 가격대는 129만원, 물걸레 청소 서브라인이 탑재된 제품은 149만원
  - 한국 글로벌 첫 출시 | https://biz.newdaily.co.kr/site/data/html/2025/09/05/2025090500176.html | 2026-11-20 | V16 피스톤 애니멀(구 DS60) 2025년 6월 국내 출시 | 이 제품은 한국에서 글로벌 첫 출시된 후
  - 70 minutes | https://www.notebookcheck.net/Dyson-releasing-new-powerful-V16-Piston-Animal-cordless-vacuum-cleaner-globally.1098837.0.html | 2026-11-20 | V16 피스톤 애니멀 사용 시간·충전 시간(다이슨 발표 인용, 2025-08-28) | it should run for up to 70 minutes on a single charge
  - 60 minutes | https://www.notebookcheck.net/Dyson-launches-new-powerful-V8-Cyclone-Cordless-Vacuum.1094011.0.html | 2026-11-20 | V8 싸이클론 사용 시간 60분, 기존 V8 Advanced 40분(2025-08-22 대만·중국 출시 보도) | a longer run time of 60 minutes compared to the 40 minutes offered by the V8 Advanced
  - TWD 14,900 | https://www.notebookcheck.net/Dyson-launches-new-powerful-V8-Cyclone-Cordless-Vacuum.1094011.0.html | 2026-11-20 | V8 싸이클론 대만 가격(중국 CNY 2,999) | priced at TWD 14,900
  - £349.99 | https://www.techradar.com/home/vacuums/dyson-just-released-the-vacuum-we-actually-wanted-an-upgraded-v8-that-costs-basically-the-same-as-the-original | 2026-11-20 | V8 싸이클론 영국 출시일·정가 | available from 17 September 2025, at a list price of £349.99
  - 교체형 배터리 | https://www.techradar.com/home/vacuums/dyson-just-released-the-vacuum-we-actually-wanted-an-upgraded-v8-that-costs-basically-the-same-as-the-original | 2026-11-20 | V8 싸이클론부터 V8 계열 배터리를 분리·교체 가능 | the battery is now removable
  - 60분 | https://zdnet.co.kr/view/?no=20210525135243 | 2026-11-20 | V15 디텍트·V12 디텍트 슬림 2021-05-25 국내 출시, 일반 모드 사용 시간 | 모두 일반 모드로 사용시 60분 이용 가능하며
  - 129만원 | https://zdnet.co.kr/view/?no=20210525135243 | 2026-11-20 | 계산: 원문 129만원 표기 — V15 디텍트 국내 출시가(V12 디텍트 슬림 109만원) | V15 디텍트 무게는 3kg며, 가격은 129만원이다.
  - 70분 | https://m.seoul.co.kr/news/2022/09/27/20220927019009 | 2026-11-20 | Gen5 디텍트 국내 공개(2022-09) 최장 연속 사용 시간(Chromium 시간 초과, curl 200) | 최장 70분 연속 사용이 가능하다
  - 월 1회 완전 방전 | https://www.techradar.com/home/vacuums/how-to-preserve-your-dyson-vacuum-battery | 2026-11-20 | TechRadar 2026-01-15가 인용한 다이슨 배터리 관리 페이지 권고(다이슨 원문은 차단) | drain to completely empty at least once a month
  - 3°C | https://www.techradar.com/home/vacuums/how-to-preserve-your-dyson-vacuum-battery | 2026-11-20 | 3°C 미만에서 작동·충전 안 됨(TechRadar 인용) | won't charge or operate if the temperature is below 37F / 3C
  - Auto·Normal 모드 | https://www.techradar.com/home/vacuums/how-to-preserve-your-dyson-vacuum-battery | 2026-11-20 | 다이슨 문구 인용: 평소엔 Auto·Normal, Max·Boost는 짧게 | designed to be used in Auto or Normal mode for everyday cleaning
  - 80% | https://www.techradar.com/news/james-dyson-promises-15-year-battery-life-for-the-cyclone-v10-cordless-vacuum | 2026-11-20 | James Dyson 2018-03 발언(V10 출시): 15년 매일 사용 시 80% | Fifteen years of daily use might get you down to 80% battery
  - 800 cycles | https://www.techradar.com/news/james-dyson-promises-15-year-battery-life-for-the-cyclone-v10-cordless-vacuum | 2026-11-20 | 같은 기사: V10 배터리 충전 사이클 800회 | battery is good for 800 charge cycles

## 7. Still not found (시도한 경로 포함)

1. 다이슨 코리아 공식 배터리 가격(모델별 현재가·재고), V8(967834) 99,000원, V12 129,000원·V12 디텍트 충전기 포함 팩 150,000원, V15 129,000원, Gen5 디텍트 배터리, 디지털 슬림 140,000원, V8 싸이클론·V16 배터리 가격
   - 시도: dyson.co.kr·dyson.com·dyson.co.th(직접 1회 403, 이후 중단), 다나와 정품 배터리 상품(pcode 59749514 "다이슨 V11 전용 교체형 배터리" 정품·등록 2024.07이나 "일시 품절", 가격 없음), 다나와 검색(WebSearch 도메인 한정), 에누리, 컬리, 코오롱몰 다이슨 브랜드관(배터리 미판매), 롯데ON·하이마트·G마켓·옥션·SSG·Hmall·11번가·쿠팡·카카오선물(아래 접근 기록), 언론 검색(정품 배터리 현재가 보도 없음), 블로그 검색(eoe 1곳만 날짜 있는 확인값).
2. V8 싸이클론 국내 정가(549,000원)와 공식 출시일 — dyson.co.kr 스니펫에만 있음. 다나와는 등록월(2025년 08월)과 최저가만 표시. 국내 언론 출시 기사 검색 결과 없음.
3. 다이슨 배터리 전압·용량·셀 수(V8, V12, V15, Gen5, V8 싸이클론, V16) — 설명서 7종에 수치 없음, 제품안전정보센터 상세정보 칸 비어 있음, 다이슨 엔지니어링·뉴스룸 페이지 차단. dyson.com `/content/dam/.../for-business/` 제품 매트릭스 PDF는 허용 경로(dyson.co.uk 사용 설명서)가 아니고 dyson.com이 차단 대상이라 열지 않았습니다.
4. 센터 배터리 교체 공임·총액·소요 시간 공식 근거 — 언론은 "소모품 유상"까지만. 클리앙·다모앙 403, 유튜브 후기는 동의 페이지로 넘어감.
5. 2024~2026년 다이슨 단독 불만 통계(1372, 피해구제, 국감 자료) — 검색 3회, 결과는 모두 2023년 수치 재인용. 2025 피해구제 연보는 품목 단위(전기진공청소기 138건)만 세계일보로 확인. kca.go.kr은 기존 조사 기록대로 자동 조회하지 않았습니다.
6. 2024~2026년 직구·병행수입품 처리 정책 — 공식 문서는 설명서의 "구입한 국가에서 사용할 때만 유효" 문구, 언론은 2019년 기사뿐. 블로그 글은 근거 미표시.
7. 다이슨 해외 지원 페이지의 교체 신호("12회 이상 깜빡임", "MAX가 아닌 모드에서도 사용 시간 감소")와 V8 나사 3개 교체 안내 원문 — 다이슨 사이트 차단, 설명서에 해당 문구 없음.
8. 다이슨 한국 2023-11 AS 정책 원문(뉴스룸)·판매 약관(terms-of-sale) — 차단. 내용은 ZDNet 2023-11-22로 대체.
9. V12 디텍트 슬림 등 다나와 표가 "배터리 분리형"을 적지 않은 모델(V8 2021, 싸이클론 V10)의 배터리 방식 — 다나와에는 칸이 없습니다. V11 설명서(교체형)와 기존 조사(V8·V10 나사 고정형)로 보완해야 합니다.

[판단] 공식 가격·출시가를 원문으로 넣으려면 다이슨 코리아 페이지를 사람이 일반 브라우저로 열어 캡처하는 방식을 허용할지 정해야 합니다. [현장] 다이슨 고객센터(1588-4253) 문의 1건이면 모델별 배터리 가격, 센터 교체 공임, 직구품 접수 여부를 한 번에 받을 수 있습니다.

## 8. 접근 기록 (2026-11-20)

| 도메인 | robots.txt | 결과 |
|---|---|---|
| www.dyson.co.uk | 200, `/content/dam/` 미차단 | 한국어·영문 설명서 PDF 7건 200(V11 ko-kr, SV14 ko-kr, SV12, N620H, N692B, Gen5 QSG, V8 싸이클론 hk_hk). 지원 페이지는 열지 않음 |
| www.dyson.co.th | 200(제품 경로 미차단) | 제품 페이지 1회 403(Cloudflare), 이후 다이슨 사이트 시도 중단 |
| www.dyson.hk / www.dyson.in / www.dyson.co.id | 200 | robots만 받고 페이지는 열지 않음(다이슨 사이트 차단 방침) |
| community.dyson.com | TLS 핸드셰이크 실패 | 미열람 |
| prod.danawa.com | 200, `/info/?pcode=` 허용 | 7개 상품 200. Chromium 본문은 사양표 칸 공백 없음, 21760133은 networkidle 시간 초과 |
| price.enuri.com | 200, 허용(crawl-delay 1) | V8(2021) 1건 200 |
| www.safetykorea.kr | 200, 전체 허용 | certDetail GET 200(curl), Chromium 502. XU101904-20007은 "인증정보가 존재하지 않습니다" |
| www.kurly.com | 200, `*` 허용 | 상품 4건 200(다이슨 본체만, 배터리 미판매) |
| www.kolonmall.com | 200, `*` 그룹 없음 | 다이슨 브랜드관 200, 배터리 없음 |
| www.11st.co.kr | 200, `User-agent: *` `Disallow: /` | 미열람. 기존 조사(replacement_experience.md)가 11번가 상품 URL을 원장 후보로 썼다면 검증기 기본 UA 기준 robots 위반이므로 교체 권장 |
| www.ssg.com / www.hmall.com | 200, `*` 전체 차단(특정 AI 에이전트만 허용) | 미열람 |
| gift.kakao.com | 200, AI·RAG 목적 접근 금지 명시 | 미열람 |
| www.lotteon.com | 200, 허용 | 열람 안 함(검색 결과에 정품 배터리 상품 없음) |
| www.e-himart.co.kr | 200, 허용 | 열람 안 함(검색 결과에 정품 배터리 상품 없음) |
| www.gmarket.co.kr / www.auction.co.kr | 200, 허용 | 열람 안 함(기존 기록상 검색 페이지 curl 403) |
| www.etland.co.kr / www.compuzone.co.kr | 연결 재설정(000) | 미열람 |
| m.11st.co.kr / byline.network / www.clien.net / www.newstree.kr | robots부터 403(Cloudflare·IP 차단) | 미열람 |
| www.hankyung.com | 200 | 기사 Cloudflare "Just a moment"(curl 403, Chromium 시간 초과) |
| zdnet.co.kr | 200, 허용 | 기사 5건 200 |
| www.segye.com | 200, `*` 허용 | 기사 2건 200 |
| biz.newdaily.co.kr / www.inews24.com / m.seoul.co.kr / www.dailian.co.kr / www.newsclaim.co.kr / www.fortunekorea.co.kr / www.heraldk.com / www.mydaily.co.kr | 200, 허용 | 기사 200(서울신문 Chromium 시간 초과, curl 정상) |
| www.techradar.com / www.notebookcheck.net | 200, 기사 경로 허용 | 기사 200(TechRadar Chromium networkidle 시간 초과, curl 정상) |
| earn-on-everything.com / ktrend.co.kr / jab-guyver.co.kr | 200, 허용 | 블로그 200 |
| www.youtube.com | 200, `/watch` 허용 | 302(동의 페이지), 설명란 미확보 |
| www.conrad.com | 403 | 미열람 |

요청 수: 페이지 약 45회, robots 약 40회, WebSearch 약 40회. 같은 호스트 요청 사이 1~3초 간격.
