# 수집 폼 3종과 범용 견적 스키마 (수집형 블로그 단계)

원칙
1. **글 1편 = 폼 1개(프리필).** 글이 다루는 품목·증상·견적 유형이 미리 채워진 링크로 보낸다. 사용자가 고르는 칸을 줄일수록 완료율이 오른다.
2. **필수 칸은 비교에 꼭 필요한 것만.** 연락처·실명은 받지 않는다. 결과 리포트 수신용 이메일은 *별도 선택 동의*로만.
3. **새 영역(가구·구매/설치 견적)은 개발하지 않고 외부 폼으로 시작한다.** 월 30건 이상이 2개월 연속 들어오면 사이트에 구조화 폼을 만든다(아래 게이트). 가전 수리비는 이미 만든 사이트 폼을 쓴다.
4. 영수증·견적서 사진은 **선택**이며 이름·주소·전화·카드번호를 가린 뒤 올리도록 안내한다. 외부 폼 단계에서는 사진 업로드를 받지 않는 것을 기본으로 한다(개인정보 위험 대비 실익이 낮음).

---

## 폼 A. 가전 수리비 제보 — 기존 사이트 폼 (구현 완료)

- 경로: `/submit-repair?product=<slug>&symptom=<sym-id>` (+ UTM). 목록에 없는 모델은 `?model=<검색어>`로 직접 입력 모드.
- 필드: 국가·도시, 제품(또는 직접 입력), 증상, 에러코드, 수리경로, 구매연도, 견적금액, 실제 결제금액(모름=비움, 무료=0), 통화, 수리항목, 해결 여부, 후기, 영수증(선택, 비공개), 개인정보 동의(필수).
- 로그인은 제출 순간에만 요구하고 입력값은 보존된다(초안 저장).
- 증상 ID: sym-1 충전 안 됨 · sym-2 흡입력 약함 · sym-3 배터리 빨리 닳음 · sym-4 도크 오류 · sym-5 센서 오류 · sym-6 브러시 회전 안 됨 · sym-7 소음 큼 · sym-8 물걸레 · sym-9 앱 연결 · sym-10 에러코드 · sym-11 누수 · sym-12 전원·멈춤 · sym-13 주행·맵핑.

## 폼 B. 자가수리 결과 제보 ("해봤어요") — 외부 폼으로 시작

T2(자가수리 가이드) 글 하단에서만 연결한다. **Safe Check·Caution 항목만** 받는다(Expert Only·Do Not DIY 작업의 성공담은 받지도, 게시하지도 않는다).

| # | 필드 | 형식 | 필수 | 비고 |
|---|---|---|---|---|
| 1 | 영역 | 선택: 가전 / 가구 | ● | 글에서 프리필 |
| 2 | 품목 | 선택(분류표) + 기타 | ● | 예: 가구 > 수납 > 서랍장 |
| 3 | 브랜드·모델 또는 제품 유형 | 텍스트 | | 가구는 모델명 대신 유형·크기 허용 |
| 4 | 증상 | 선택 + 기타 | ● | 글에서 프리필 |
| 5 | 시도한 방법 | 선택(글의 단계 번호) + 기타 | ● | 어떤 단계에서 해결됐는지 |
| 6 | 사용한 부품 | 텍스트 | | 예: 서랍 레일 450mm 1쌍 |
| 7 | 부품 구입처 유형 | 선택: 공식몰·AS센터 / 오픈마켓 / 철물점·오프라인 / 부품 없음 | | 업체명은 받지 않음 |
| 8 | 부품비 합계 | 숫자(원) | | 모름=비움 |
| 9 | 소요 시간 | 선택: 15분 이내 / 30분 / 1시간 / 2시간+ | ● | |
| 10 | 난이도 | 1~5 | ● | |
| 11 | 결과 | 선택: 해결 / 일부 해결 / 실패 / 악화 | ● | |
| 12 | 안전 문제 | 선택: 없음 / 다칠 뻔함 / 제품 손상 + 설명 | ● | "있음"이면 운영자가 글의 안전등급을 재검토 |
| 13 | 직접 하지 않았다면 냈을 견적 | 숫자(원), 선택 | | 자가수리로 절약한 금액 추정용 |
| 14 | 개인정보 동의 | 체크 | ● | 아래 동의문 |
| 15 | 결과 리포트 받기(이메일) | 이메일 + 별도 동의 | | 선택 |

## 폼 C. 구매·설치 견적 제보 ("받은 견적 올리기") — 외부 폼으로 시작

T3(견적서 체크리스트) 글 하단에서 연결한다. 핵심은 **항목별(line item) 금액**이다. 총액만 받으면 비교가 안 된다(배관 길이·층수·추가 작업이 다르기 때문).

| # | 필드 | 형식 | 필수 | 비고 |
|---|---|---|---|---|
| 1 | 견적 유형 | 선택(아래 코드) | ● | 글에서 프리필 |
| 2 | 품목·규격 | 선택 + 숫자 | ● | 예: 에어컨 벽걸이 / 붙박이장 폭(cm) |
| 3 | 브랜드(제품) | 텍스트 | | 업체(시공사) 이름은 받지 않음 |
| 4 | 견적 받은 곳 유형 | 선택: 제조사 / 판매점 / 설치 전문 기사 / 인테리어·가구 업체 / 중개 플랫폼 | ● | |
| 5 | 지역 | 시·도 (선택: 시·군·구) | ● | 지역 차이 분석용 |
| 6 | 주거 형태·층수 | 선택 + 숫자 | | 사다리차·실외기 작업에 영향 |
| 7 | 견적 시기 | 연-월 | ● | 성수기 차이 |
| 8 | **견적 항목** (반복) | 항목 코드·수량·단위·금액 | ● 최소 1개 | 예: 배관 연장 / 3 / m / 45,000 |
| 9 | 견적 총액 | 숫자(원) | ● | |
| 10 | VAT 포함 여부 | 포함 / 별도 / 모름 | ● | |
| 11 | 계약 여부·최종 결제액 | 선택 + 숫자 | | 견적→실결제 차이 |
| 12 | 현장 추가요금 | 없음 / 있음(사유·금액) | | 분쟁이 가장 많은 지점 |
| 13 | 개인정보 동의 | 체크 | ● | |

**항목 코드표** — 제조사 공식 요금표의 항목명에 맞춘다(삼성·LG 에어컨 표는 2026-11-17 원문 대조 [검증], `docs/research/R8`).
**단위를 반드시 함께 받는다**: 같은 항목도 회사마다 과금 단위가 다르다 — 용접은 삼성 *개소당* 4,000원 vs LG *실내기당* 15,000원, 냉매는 삼성 *0.1kg당* vs LG *실외기당*. 총액만 비교하면 오판한다.

| 코드 | 항목 | 단위 | 공식 기준 예시 [검증] |
|---|---|---|---|
| `pipe_copper` | 배관 연장(동관) | m | 삼성·LG 32.5㎡ 이하 19,000/m, 그 이상 22,000/m(삼성 100㎡ 이상 27,000/m) |
| `pipe_aluminum` | 배관 연장(알루미늄) | m | 13,000~15,000/m |
| `pipe_under_1m` | 1m 미만 배관 | 건 | 10,000 |
| `welding` | 용접 | 개소 / 실내기 | 삼성 4,000/개소 · LG 15,000/실내기 |
| `hole` | 추가 타공 | 개 | 기본 2회 무료, 추가 삼성 15,000 · LG 10,000 |
| `angle` | 실외기 앵글(재질 함께) | 대 | 삼성 알루미늄 110,000~130,000·스텐 180,000 · LG 120,000~140,000·함마톤 180,000 |
| `angle_customer` | 고객 보유 앵글 작업 | 대 | 70,000 |
| `height_work` | 지면 2m 이상 외부 작업 | 대 | 30,000(앵글비·스카이 이용 시 미청구) |
| `stand` | 실외기 받침대(단수 함께) | 대 | 삼성 1단 50,000·2단 130,000 · LG 60,000·160,000 |
| `refrigerant` | 냉매 추가(종류 함께) | 0.1kg / 실외기 | 삼성 R-32 4,000/0.1kg · LG R32 18,000/실외기 |
| `pipe_cleaning` · `leak_test` | 매립배관 세척 · 누설 테스트 | 회 | 50,000(실내기 1대) |
| `drain_pump` | 배수 펌프(양정 함께) | 대 | LG 70,000~150,000 |
| `removal` | 기존 제품 철거 | 대 | 벽걸이 20,000 · 스탠드 40,000 |
| `sky_truck` | 스카이차 | 시간 | LG 1시간 140,000 · 2시간 260,000 |
| `relocation_base` | 이전설치 기본(형태 함께) | 건 | 삼성 벽걸이 193,000 · 스탠드(81.8㎡ 이하) 313,000 |
| `distance` · `after_hours` · `pre_visit` | 이동거리 · 야간 · 사전방문 | 건 | 삼성 11~20km 25,000 · 19시 이후 33,000 · 사전방문 30,000/회 |
| `delivery` · `assembly` | 배송 · 조립(가구) | 건 | 이케아 공개 요금 [조사] |
| `ladder_truck` · `stairs_carry` | 사다리차 · 계단 운반 | 시간·층 | 공식표 없음 — 제보로만 |
| `disposal` | 폐기·수거(품목 함께) | 품목 | 지자체 대형폐기물 수수료(지역마다 다름) |
| `visit_fee` · `labor` · `part` · `other` | 출장비 · 공임 · 부품 · 기타 | 건 | — |

에어컨 추가 필드: 실내기 형태(벽걸이/스탠드/2in1), 냉매 종류, 배관 총길이와 기본 제공 길이, 실외기 위치(베란다/외벽 난간/옥상)와 지면 2m 이상 여부, 비교 기준이 된 공식표 버전(삼성은 2027-01-01 인상 예고, LG는 '23 기준).

## 동의문 초안 (법무 검토 전 — 발행 전 필수 검토)

> 수집 항목: 위 양식에 입력한 내용(제품·증상·금액·지역(시·도) 등), 선택 시 이메일. 이용 목적: 수리·견적 비용 통계 작성과 공개, 제보 확인. 공개 방식: 작성자를 알 수 없는 집계·요약 형태로만 공개합니다. 보관: 통계 작성 목적 달성 시까지(이메일은 리포트 발송 중단 요청 시 즉시 삭제). 동의를 거부할 수 있으며, 거부 시 제보가 접수되지 않습니다.

외부 폼 도구를 쓰면 해당 사업자가 개인정보를 처리하므로 개인정보처리방침에 **처리 위탁(및 해외 서버라면 국외 이전)**을 적어야 한다 — 가능하면 국내 저장 도구를 택하고, 이메일 칸 외 개인정보 칸을 만들지 않는다(`docs/research/R5`).

---

## 범용 견적 스키마 (설계안 — 게이트 통과 후 마이그레이션)

지금의 `repair_reports`(가전 수리비)는 그대로 두고, 새 영역은 아래 구조로 확장한다. 기존 통계 원칙(통화 분리, 표본 3/5/10건, 반려·숨김 제외)을 **항목 단위**로 적용하는 것이 핵심이다 — 예: "에어컨 배관 연장 m당 단가 중앙값(서울·2026년 여름, 표본 n건)".

```sql
CREATE TABLE item_categories (            -- 분류표: 가전/가구 > 대분류 > 품목
  id TEXT PRIMARY KEY, parent_id TEXT REFERENCES item_categories(id),
  domain TEXT NOT NULL CHECK (domain IN ('appliance', 'furniture')),
  name_ko TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE quote_reports (               -- 수리·자가수리·구매·설치·철거 견적의 공통 레코드
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),  -- 외부 폼 가져오기는 NULL
  source TEXT NOT NULL CHECK (source IN ('site', 'form_import')),
  kind TEXT NOT NULL CHECK (kind IN ('repair', 'diy', 'purchase', 'install', 'removal')),
  category_id TEXT NOT NULL REFERENCES item_categories(id),
  product_id TEXT REFERENCES products(id), -- 카탈로그 모델이 있을 때
  item_label TEXT NOT NULL DEFAULT '', brand TEXT NOT NULL DEFAULT '', spec JSONB NOT NULL DEFAULT '{}',
  region_sido TEXT, housing TEXT, floor INT,
  vendor_type TEXT CHECK (vendor_type IN ('manufacturer','retailer','installer','furniture_vendor','platform','self')),
  quoted_total NUMERIC, paid_total NUMERIC, currency TEXT NOT NULL DEFAULT 'KRW', vat_included BOOLEAN,
  quoted_month DATE,                       -- 월 단위
  outcome TEXT,                            -- diy: resolved/partial/failed/worse · 견적: contracted/declined/pending
  difficulty SMALLINT CHECK (difficulty BETWEEN 1 AND 5), duration_min INT,
  extra_charge NUMERIC, extra_reason TEXT NOT NULL DEFAULT '',
  safety_issue TEXT NOT NULL DEFAULT 'none',
  review_text TEXT NOT NULL DEFAULT '', receipt_path TEXT NOT NULL DEFAULT '',
  verified_status TEXT NOT NULL DEFAULT 'reported' CHECK (verified_status IN ('reported','verified','rejected')),
  hidden BOOLEAN NOT NULL DEFAULT true,    -- 외부 폼 가져오기는 검토 후 공개
  consent_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quote_line_items (            -- 비교 가능성의 핵심
  report_id UUID NOT NULL REFERENCES quote_reports(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL, code TEXT NOT NULL,      -- 위 항목 코드표
  label TEXT NOT NULL DEFAULT '', qty NUMERIC, unit TEXT, -- m / ea / set / hour / floor
  unit_price NUMERIC, amount NUMERIC NOT NULL,
  PRIMARY KEY (report_id, position)
);
```

보안은 기존과 동일하게: 브라우저 role 쓰기 금지·읽기 금지, Edge Function이 공개용 컬럼만 반환, `quote_line_items`는 집계 결과만 공개.

## 사이트 구현 게이트

| 영역 | 외부 폼 유지 | 사이트 구조화 폼 구현 |
|---|---|---|
| 자가수리 결과(B) | 기본 | 월 30건 이상 × 2개월 연속, 또는 누적 100건 |
| 구매·설치 견적(C) | 기본 | 같은 기준 + 한 견적 유형에서 항목 코드가 채워진 비율 ≥70% |
| 가전 수리비(A) | — | 이미 구현 |
