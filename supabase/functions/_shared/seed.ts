// Catalog seed. Product facts are descriptive only (category-level) and MUST be reviewed against
// manufacturer pages before public launch (see docs/PLAN_REINFORCEMENT.md, "데이터 검수").
import type { SafetyLevel } from './types.ts';

export const SYMPTOMS = [
  { id: 'sym-1', code: 'not_charging', name_ko: '충전 안 됨', name_en: 'Not charging', name_zh: '无法充电', risk_level: 'caution', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['충전 불량', '충전이 안', '충전 안되', '충전 불가', '충전이 안돼', '충전이 안되', '충전 안돼', "won't charge", 'no charge', 'charging problem', 'not charging'] },
  { id: 'sym-2', code: 'weak_suction', name_ko: '흡입력 약함', name_en: 'Weak suction', name_zh: '吸力弱', risk_level: 'safe', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['흡입력 저하', '흡입력이 약', '흡입이 약', '흡입력 떨어', '흡입 약', '힘이 약', 'low suction', 'suction loss', 'weak suction'] },
  { id: 'sym-3', code: 'battery_drain', name_ko: '배터리 빨리 닳음', name_en: 'Battery drains quickly', name_zh: '电池快速耗尽', risk_level: 'caution', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['배터리 수명', '배터리 광탈', '배터리가 빨리', '배터리 소모', '배터리 교체', '배터리 약', 'battery life', 'battery drain', 'short battery'] },
  { id: 'sym-4', code: 'dock_error', name_ko: '도크 오류', name_en: 'Dock error', name_zh: '底座错误', risk_level: 'caution', self_check_allowed: true,
    categories: ['robot-vacuum'],
    synonyms: ['도크 에러', '스테이션 오류', '스테이션 에러', '도크 복귀', '복귀 실패', '자동 비움 오류', 'dock error', 'station error'] },
  { id: 'sym-5', code: 'sensor_error', name_ko: '센서 오류', name_en: 'Sensor error', name_zh: '传感器错误', risk_level: 'expert', self_check_allowed: true,
    categories: ['robot-vacuum'],
    synonyms: ['센서 에러', '센서 불량', '장애물 인식', '낭떠러지 센서', '절벽 센서', '라이다 오류', 'cliff sensor', 'sensor error'] },
  { id: 'sym-6', code: 'brush_not_rotating', name_ko: '브러시 회전 안 됨', name_en: 'Brush not rotating', name_zh: '刷子不旋转', risk_level: 'safe', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['브러시 안 돌', '브러시가 안', '브러쉬 안', '브러시 멈춤', '롤러 안 돌', 'brush not spinning', 'brush stuck', 'brush not rotating'] },
  { id: 'sym-7', code: 'loud_noise', name_ko: '소음 큼', name_en: 'Loud noise', name_zh: '噪音大', risk_level: 'caution', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['소음 심', '소리가 커', '소리가 이상', '이상한 소리', '덜덜', 'noisy', 'strange noise', 'loud noise'] },
  { id: 'sym-8', code: 'mop_not_working', name_ko: '물걸레 작동 안 됨', name_en: 'Mop not working', name_zh: '拖把不工作', risk_level: 'safe', self_check_allowed: true,
    categories: ['robot-vacuum'],
    synonyms: ['물걸레 안', '물걸레 오류', '걸레 안 돌', '물이 안 나', '급수 안', 'mop not working', 'mop problem'] },
  { id: 'sym-9', code: 'app_connection', name_ko: '앱 연결 안 됨', name_en: 'App not connecting', name_zh: '应用无法连接', risk_level: 'safe', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['앱 연결', '와이파이 연결', '와이파이 안', '앱이 안', '연동 안', '오프라인', 'wifi problem', 'app not connecting', 'offline'] },
  { id: 'sym-10', code: 'error_code', name_ko: '에러코드 발생', name_en: 'Error code', name_zh: '错误代码', risk_level: 'expert', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['에러 코드', '에러', '오류 코드', '오류코드', 'error', 'led 점멸', '깜빡'] },
  { id: 'sym-11', code: 'water_leak', name_ko: '누수', name_en: 'Water leak', name_zh: '漏水', risk_level: 'expert', self_check_allowed: true,
    categories: ['robot-vacuum'],
    synonyms: ['물이 샘', '물 샘', '물이 새', '물 새', '물이 흘러', '누수 발생', 'leaking', 'water leak', 'leak'] },
  { id: 'sym-12', code: 'no_power', name_ko: '전원 안 켜짐·멈춤', name_en: 'Won\'t turn on / stops', name_zh: '无法开机', risk_level: 'caution', self_check_allowed: true,
    categories: ['robot-vacuum', 'cordless-vacuum'],
    synonyms: ['전원 안', '전원이 안', '안 켜져', '안켜져', '켜지지 않', '작동 안 됨', '작동 불가', '작동이 안', '갑자기 꺼', '자꾸 꺼', '멈춤', '멈춰', '꺼짐', "won't turn on", 'dead', 'shuts off'] },
  { id: 'sym-13', code: 'navigation_error', name_ko: '주행·맵핑 오류', name_en: 'Navigation / mapping error', name_zh: '导航建图错误', risk_level: 'safe', self_check_allowed: true,
    categories: ['robot-vacuum'],
    synonyms: ['맵핑 오류', '맵핑 불량', '지도 오류', '길을 잃', '같은 곳 맴돌', '주행 이상', '주행 오류', '벽에 부딪', 'mapping error', 'navigation error', 'gets lost'] },
] as const;

const R = 'robot-vacuum';
const C = 'cordless-vacuum';

export const PRODUCTS = [
  { id: 'prod-1', slug: 'roborock-s8-pro-ultra', category: R, brand: 'Roborock', brand_ko: '로보락', model_name: 'S8 Pro Ultra', alternate_names: ['S8 Pro', 'S8', '로보락 S8'], release_year: 2023, description: '자동 먼지 비움·물걸레 세척 도크가 포함된 프리미엄 로봇청소기' },
  { id: 'prod-2', slug: 'roborock-q-revo', category: R, brand: 'Roborock', brand_ko: '로보락', model_name: 'Q Revo', alternate_names: ['Q Revo'], release_year: 2023, description: '물걸레 기능이 있는 중가형 로봇청소기' },
  { id: 'prod-3', slug: 'dreame-l10s-ultra', category: R, brand: 'Dreame', brand_ko: '드리미', model_name: 'L10s Ultra', alternate_names: ['L10s', 'L10'], release_year: 2023, description: '자동 먼지 비움 도크가 있는 로봇청소기' },
  { id: 'prod-4', slug: 'ecovacs-deebot-x2-omni', category: R, brand: 'Ecovacs', brand_ko: '에코백스', model_name: 'Deebot X2 Omni', alternate_names: ['X2', 'X2 Omni', '디봇 X2'], release_year: 2023, description: '사각형 디자인의 프리미엄 로봇청소기' },
  { id: 'prod-5', slug: 'irobot-roomba-j7-plus', category: R, brand: 'iRobot', brand_ko: '아이로봇', model_name: 'Roomba j7+', alternate_names: ['j7', 'j7+', '룸바 j7'], release_year: 2021, description: '장애물 회피 기능이 있는 스마트 로봇청소기' },
  { id: 'prod-6', slug: 'samsung-jet-bot-ai-plus', category: R, brand: 'Samsung', brand_ko: '삼성전자', model_name: 'Jet Bot AI+', alternate_names: ['Jet Bot', '제트봇', '제트봇 AI'], release_year: 2021, description: 'AI 물체 인식 기능이 있는 로봇청소기' },
  { id: 'prod-7', slug: 'lg-cordzero-r9', category: R, brand: 'LG', brand_ko: 'LG전자', model_name: 'CordZero R9', alternate_names: ['R9', '코드제로 R9'], release_year: 2022, description: '자동 먼지 비움 기능이 있는 LG 로봇청소기 (모델 정보 검수 필요)' },
  { id: 'prod-8', slug: 'dyson-v15-detect', category: C, brand: 'Dyson', brand_ko: '다이슨', model_name: 'V15 Detect', alternate_names: ['V15', 'V15 디텍트'], release_year: 2021, description: '레이저 먼지 감지 기능이 있는 프리미엄 무선청소기' },
  { id: 'prod-9', slug: 'dyson-v12-slim', category: C, brand: 'Dyson', brand_ko: '다이슨', model_name: 'V12 Slim', alternate_names: ['V12', 'V12 슬림'], release_year: 2021, description: '가벼운 무선청소기' },
  { id: 'prod-10', slug: 'samsung-bespoke-jet', category: C, brand: 'Samsung', brand_ko: '삼성전자', model_name: 'Bespoke Jet', alternate_names: ['Jet', '제트', '비스포크 제트'], release_year: 2021, description: '프리미엄 스틱형 무선청소기' },
  { id: 'prod-11', slug: 'lg-cordzero-a9', category: C, brand: 'LG', brand_ko: 'LG전자', model_name: 'CordZero A9', alternate_names: ['A9', '코드제로 A9'], release_year: 2020, description: '듀얼 배터리 무선청소기' },
  { id: 'prod-12', slug: 'dreame-t30', category: C, brand: 'Dreame', brand_ko: '드리미', model_name: 'T30', alternate_names: ['T30'], release_year: 2022, description: '고성능 무선청소기' },
  { id: 'prod-13', slug: 'dyson-v10', category: C, brand: 'Dyson', brand_ko: '다이슨', model_name: 'V10', alternate_names: ['Cyclone V10', 'V10 사이클론', '사이클론 V10'], release_year: 2018, description: '다이슨 사이클론 V10 무선청소기' },
  { id: 'prod-14', slug: 'dyson-v8', category: C, brand: 'Dyson', brand_ko: '다이슨', model_name: 'V8', alternate_names: ['Cyclone V8', 'V8 앱솔루트'], release_year: 2016, description: '다이슨 V8 무선청소기' },
  { id: 'prod-15', slug: 'dyson-v11', category: C, brand: 'Dyson', brand_ko: '다이슨', model_name: 'V11', alternate_names: ['Cyclone V11', 'V11 다이나믹'], release_year: 2019, description: '다이슨 V11 무선청소기' },
  { id: 'prod-16', slug: 'roborock-s7-maxv-ultra', category: R, brand: 'Roborock', brand_ko: '로보락', model_name: 'S7 MaxV Ultra', alternate_names: ['S7', 'S7 MaxV', '로보락 S7'], release_year: 2022, description: '자동 먼지 비움·물걸레 세척 도크가 포함된 로봇청소기' },
] as const;

export interface CardSeed {
  category: string;
  symptom_code: string | null; // null = category-wide card
  safety_level: SafetyLevel;
  title_ko: string;
  steps_ko: string[];
  stop_if_ko?: string;
}

const GENERIC_NOTE = '아래는 일반적인 점검 순서이며 제품 설명서와 다를 수 있습니다. 설명서를 우선하세요.';

export const SELF_CHECK_CARDS: CardSeed[] = [
  // ---- category-wide safety card (always first) ----
  { category: R, symptom_code: null, safety_level: 'do_not_diy', title_ko: '배터리·충전부 이상 징후 — 즉시 사용 중지',
    steps_ko: ['본체 또는 도크가 뜨겁거나 배터리가 부풀어 오른 경우', '타는 냄새·연기·"치직" 소리가 나는 경우', '충전 중 전원을 분리하고 가연물에서 떨어진 곳에 두세요'],
    stop_if_ko: '위 증상이 하나라도 있으면 사용·충전을 멈추고 공식 서비스센터에 문의하세요. 배터리·도크 내부 분해는 하지 마세요.' },
  { category: C, symptom_code: null, safety_level: 'do_not_diy', title_ko: '배터리·충전부 이상 징후 — 즉시 사용 중지',
    steps_ko: ['본체·배터리가 뜨겁거나 부풀어 오른 경우', '타는 냄새·연기·"치직" 소리가 나는 경우', '충전 중 전원을 분리하고 가연물에서 떨어진 곳에 두세요'],
    stop_if_ko: '위 증상이 하나라도 있으면 사용·충전을 멈추고 공식 서비스센터에 문의하세요. 배터리 팩을 임의로 분해하지 마세요.' },

  // ---- robot vacuum ----
  { category: R, symptom_code: 'not_charging', safety_level: 'caution', title_ko: '로봇청소기 충전이 안 될 때',
    steps_ko: ['도크 전원 어댑터와 콘센트 연결, 표시등 상태를 확인합니다.', '전원을 분리한 뒤 본체 하단과 도크의 충전 접점을 마른 부드러운 천이나 면봉으로 닦습니다.', '도크를 평평한 바닥, 벽에서 떨어진 곳에 두고 앞쪽 공간을 비웁니다. (권장 거리는 설명서 확인)', '본체를 도크에 직접 올려 충전 표시가 뜨는지 봅니다.', '앱에서 배터리 잔량과 에러 알림을 확인하고, 설명서대로 재부팅합니다.'],
    stop_if_ko: GENERIC_NOTE + ' 개선되지 않으면 배터리·도크를 열지 말고 공식 AS를 이용하세요.' },
  { category: R, symptom_code: 'weak_suction', safety_level: 'safe_check', title_ko: '로봇청소기 흡입력이 약할 때',
    steps_ko: ['먼지통을 비우고 먼지 봉투(도크)가 가득 찼는지 확인합니다.', '필터를 설명서 방식대로 털거나 세척하고, 물세척 후에는 완전히 말립니다.', '메인 브러시·사이드 브러시에 감긴 머리카락과 이물질을 제거합니다.', '흡입구와 흡입 통로에 막힌 이물이 없는지 봅니다.', '앱에서 흡입 모드가 "조용"으로 설정되어 있지 않은지 확인합니다.', '소모품(필터·브러시) 교체 주기를 확인합니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: R, symptom_code: 'battery_drain', safety_level: 'caution', title_ko: '로봇청소기 배터리가 빨리 닳을 때',
    steps_ko: ['강력 흡입 모드·넓은 면적 설정은 소모가 큽니다. 모드와 청소 면적을 확인합니다.', '도크에서 완전히 충전되는지, 충전 접점이 깨끗한지 확인합니다.', '펌웨어(앱) 업데이트를 확인합니다.', '구매 후 오래 사용했다면 배터리 노화가 원인일 수 있습니다. 교체 가능 여부와 비용은 공식 서비스센터에 먼저 문의하세요.'],
    stop_if_ko: '배터리 팩 분리·분해는 화재 위험이 있어 직접 하지 마세요. ' + GENERIC_NOTE },
  { category: R, symptom_code: 'dock_error', safety_level: 'caution', title_ko: '도크(스테이션) 오류가 날 때',
    steps_ko: ['도크 전원과 위치(평평한 바닥)를 확인합니다.', '물탱크·오수통·먼지 봉투가 올바르게 장착되어 있는지 확인합니다.', '먼지 봉투가 가득 찼거나 배출구에 이물이 끼지 않았는지 봅니다.', '급수·배수 호스 연결부와 필터 막힘을 확인합니다. (전원을 분리한 상태에서)', '충전 접점을 마른 천으로 닦습니다.'],
    stop_if_ko: GENERIC_NOTE + ' 도크 내부(펌프·히터·전기부) 분해는 하지 마세요.' },
  { category: R, symptom_code: 'sensor_error', safety_level: 'caution', title_ko: '센서 오류·장애물/낭떠러지 오인식',
    steps_ko: ['본체 하단 낭떠러지 센서, 앞 범퍼, 상단 센서 창을 마른 천으로 닦습니다.', '범퍼가 눌린 채 끼어 있지 않은지 확인합니다.', '검은색·반사 바닥은 센서가 오인할 수 있습니다. 해당 구역에서만 증상이 나는지 봅니다.', '본체를 재부팅하고 지도를 다시 생성해 봅니다.'],
    stop_if_ko: GENERIC_NOTE + ' 라이다·센서 모듈을 분해하지 마세요.' },
  { category: R, symptom_code: 'brush_not_rotating', safety_level: 'safe_check', title_ko: '브러시가 돌지 않을 때',
    steps_ko: ['전원을 끄고 브러시를 분리해 머리카락·실이 감겨 있는지 확인하고 제거합니다.', '브러시 장착 방향과 잠금 상태를 확인합니다.', '브러시 결합부(베어링)에 이물이 끼어 있지 않은지 봅니다.', '재장착 후 동작을 확인합니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: R, symptom_code: 'loud_noise', safety_level: 'caution', title_ko: '평소보다 소음이 클 때',
    steps_ko: ['브러시·바퀴에 이물이 끼어 있는지 확인합니다.', '먼지통과 필터가 올바르게 장착됐는지 확인합니다.', '흡입 모드를 낮추고 소리가 달라지는지 확인합니다.', '바닥 재질(카펫·매트)에 따라 소리가 달라지는지 확인합니다.'],
    stop_if_ko: '갈리는 소리·타는 냄새가 나면 사용을 멈추세요. ' + GENERIC_NOTE },
  { category: R, symptom_code: 'mop_not_working', safety_level: 'safe_check', title_ko: '물걸레가 작동하지 않을 때',
    steps_ko: ['물탱크에 물이 있고 올바르게 장착되어 있는지 확인합니다.', '걸레·걸레판이 정확히 끼워져 있는지 확인합니다.', '급수구가 막혔는지 확인합니다. (물때 제거는 제조사 권장 방법 사용)', '도크의 걸레 세척 트레이와 거름망 상태를 확인합니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: R, symptom_code: 'app_connection', safety_level: 'safe_check', title_ko: '앱 연결이 안 될 때',
    steps_ko: ['많은 제품이 2.4GHz Wi-Fi만 지원합니다. 공유기 대역을 확인합니다.', '공유기 비밀번호를 바꿨다면 제품의 Wi-Fi 설정을 다시 합니다.', '앱과 제품 펌웨어를 최신으로 업데이트합니다.', '앱의 위치·블루투스 권한, VPN 사용 여부를 확인합니다.', '설명서대로 Wi-Fi 초기화 후 기기를 다시 등록합니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: R, symptom_code: 'error_code', safety_level: 'caution', title_ko: '에러코드가 표시될 때',
    steps_ko: ['앱이나 설명서에서 해당 에러코드의 의미를 확인합니다. (코드 의미는 모델마다 다릅니다)', '코드가 가리키는 부위(바퀴·브러시·범퍼·팬 등)를 점검하고 이물을 제거합니다.', '재부팅 후 같은 코드가 반복되는지 확인합니다.', '반복되면 코드 번호를 메모해 서비스센터에 알리고, 제보 시 에러코드를 함께 입력하면 같은 사례를 모으는 데 도움이 됩니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: R, symptom_code: 'water_leak', safety_level: 'expert_only', title_ko: '누수·물이 샐 때',
    steps_ko: ['즉시 전원을 끄고 충전을 중지합니다.', '물탱크·오수통의 장착 상태와 고무 패킹(실링)이 제자리인지 확인합니다.', '탱크에 균열이 없는지, 도크 호스 연결부가 느슨하지 않은지 확인합니다.', '바닥의 물을 닦고 본체 하단·충전 접점이 젖지 않았는지 봅니다.'],
    stop_if_ko: '본체 내부나 충전 접점에 물이 들어갔다면 전원을 켜지 말고 공식 서비스센터에 문의하세요. 분해·건조 시도는 하지 마세요.' },
  { category: R, symptom_code: 'no_power', safety_level: 'caution', title_ko: '전원이 안 켜지거나 도중에 멈출 때',
    steps_ko: ['도크에 올려 충전되는지, 배터리 잔량이 있는지 확인합니다.', '바퀴·브러시·범퍼에 이물이 끼어 멈추는지 확인합니다.', '설명서대로 재부팅 또는 초기화를 해 봅니다.', '특정 구역에서만 멈추면 그 구역의 바닥·문턱·전선을 확인합니다.'],
    stop_if_ko: '충전 중 열이 나거나 냄새가 나면 즉시 중지하세요. ' + GENERIC_NOTE },
  { category: R, symptom_code: 'navigation_error', safety_level: 'safe_check', title_ko: '주행·맵핑이 이상할 때',
    steps_ko: ['센서 창과 바퀴를 닦고 범퍼 끼임을 확인합니다.', '바닥의 전선·문턱·어두운 매트가 원인인지 확인하고 치웁니다.', '조명이 너무 어둡거나 반사가 심하지 않은지 확인합니다.', '앱에서 지도를 초기화하고 다시 생성합니다. 가상벽·금지구역 설정도 확인합니다.'],
    stop_if_ko: GENERIC_NOTE },

  // ---- cordless vacuum ----
  { category: C, symptom_code: 'not_charging', safety_level: 'caution', title_ko: '무선청소기 충전이 안 될 때',
    steps_ko: ['어댑터·거치대 전원 연결과 표시등을 확인합니다.', '충전 접점을 마른 천으로 닦습니다.', '분리형 배터리는 설명서에 따라 분리 후 다시 장착합니다.', '다른 콘센트에서 충전해 봅니다.'],
    stop_if_ko: '배터리가 뜨겁거나 부풀면 즉시 중지하세요. ' + GENERIC_NOTE },
  { category: C, symptom_code: 'weak_suction', safety_level: 'safe_check', title_ko: '무선청소기 흡입력이 약할 때',
    steps_ko: ['먼지통을 비웁니다.', '필터를 설명서대로 세척하고 안내된 시간 동안 완전히 말린 뒤 장착합니다.', '흡입구·파이프·헤드에 막힌 이물을 제거합니다. (전원을 끈 상태에서)', '브러시바에 감긴 머리카락을 제거합니다.', '흡입 모드와 배터리 잔량을 확인합니다. 배터리가 약하면 출력이 낮아질 수 있습니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: C, symptom_code: 'battery_drain', safety_level: 'caution', title_ko: '무선청소기 배터리가 빨리 닳을 때',
    steps_ko: ['강력 모드·전동 헤드는 소모가 큽니다. 모드별 사용 시간을 설명서에서 확인합니다.', '필터가 막히면 모터 부하가 늘어 소모가 커질 수 있습니다. 필터를 점검합니다.', '오래 사용했다면 배터리 노화일 수 있습니다. 정품 배터리 교체 가능 여부와 비용을 공식 서비스에 문의하세요.'],
    stop_if_ko: '비정품 배터리 사용이나 배터리 팩 분해는 하지 마세요. ' + GENERIC_NOTE },
  { category: C, symptom_code: 'brush_not_rotating', safety_level: 'safe_check', title_ko: '무선청소기 브러시가 돌지 않을 때',
    steps_ko: ['전원을 끄고 헤드를 분리해 브러시바의 머리카락·실을 제거합니다.', '브러시바 장착과 잠금을 확인합니다.', '과부하 보호로 멈췄을 수 있으니 이물 제거 후 다시 켜 봅니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: C, symptom_code: 'loud_noise', safety_level: 'caution', title_ko: '무선청소기 소음이 클 때',
    steps_ko: ['필터와 먼지통이 올바르게 장착되었는지 확인합니다.', '흡입 통로가 막히면 소리가 달라질 수 있습니다. 막힘을 확인합니다.', '브러시·헤드에 이물이 낀 소리인지 확인합니다.'],
    stop_if_ko: '갈리는 소리·타는 냄새가 나면 사용을 멈추세요. ' + GENERIC_NOTE },
  { category: C, symptom_code: 'error_code', safety_level: 'caution', title_ko: '표시등이 깜빡이거나 오류가 표시될 때',
    steps_ko: ['설명서에서 표시등 점멸 패턴 또는 오류 표시의 의미를 확인합니다. (모델마다 다릅니다)', '필터·막힘·배터리 상태를 점검합니다.', '완전히 충전한 뒤 다시 확인합니다.'],
    stop_if_ko: GENERIC_NOTE },
  { category: C, symptom_code: 'no_power', safety_level: 'caution', title_ko: '전원이 꺼지거나 켜졌다 꺼질 때',
    steps_ko: ['필터가 막혔거나 흡입 통로가 막히면 보호 기능으로 멈출 수 있습니다. 필터·통로를 점검합니다.', '배터리를 충전하고 접점을 닦습니다.', '트리거(스위치)에 이물이 끼지 않았는지 확인합니다.', '과열 보호로 멈춘 경우 충분히 식힌 뒤 다시 시도합니다.'],
    stop_if_ko: '반복되거나 열·냄새가 있으면 중지하고 공식 서비스에 문의하세요. ' + GENERIC_NOTE },
  { category: C, symptom_code: 'app_connection', safety_level: 'safe_check', title_ko: '앱·기기 연결이 안 될 때',
    steps_ko: ['블루투스·Wi-Fi 연결 상태와 앱 권한을 확인합니다.', '앱과 제품 펌웨어를 업데이트합니다.', '설명서대로 연결을 초기화하고 다시 등록합니다.'],
    stop_if_ko: GENERIC_NOTE },
];

export function cardBody(c: CardSeed): string {
  const steps = c.steps_ko.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return c.stop_if_ko ? `${steps}\n\n중단 기준: ${c.stop_if_ko}` : steps;
}
