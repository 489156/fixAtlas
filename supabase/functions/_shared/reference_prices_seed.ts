// Official / public-source reference prices.
// RULE: a row may be added only after someone opened the source page and saw this price (date_seen).
// Rows below were read directly on 2026-11-17 (see docs/research/R6_public_prices.md for the full candidate
// list, including rows that are NOT seeded because the page could not be opened, e.g. dyson.co.kr -> HTTP 403).
export interface ReferencePriceSeed {
  brand: string;
  category: string | null;
  product_slug: string | null;
  item: string;
  item_type: 'battery' | 'consumable' | 'part' | 'visit_fee' | 'inspection_fee' | 'shipping_fee' | 'warranty';
  price_krw: number;
  vat_included: boolean | null;
  source_name: string;
  source_url: string;
  date_seen: string;
  notes: string;
}

const SEEN = '2026-11-17';

export const REFERENCE_PRICES: ReferencePriceSeed[] = [
  {
    brand: 'Samsung', category: 'cordless-vacuum', product_slug: 'samsung-bespoke-jet',
    item: 'BESPOKE 제트 220W 배터리 (DJ96-00242D)', item_type: 'battery', price_krw: 160000, vat_included: null,
    source_name: '삼성전자서비스 소모품샵', source_url: 'https://www.samsungsvc.co.kr/shop/product/0000090680', date_seen: SEEN,
    notes: '판매가격 표기. 적용 모델은 페이지의 모델 목록으로 확인하세요.',
  },
  {
    brand: 'LG', category: 'cordless-vacuum', product_slug: 'lg-cordzero-a9',
    item: '청소기 A9/A9S 배터리 (EAC63382208)', item_type: 'battery', price_krw: 129000, vat_included: null,
    source_name: 'LG전자 케어 액세서리', source_url: 'https://www.lge.co.kr/care-accessories/a9-vacuum-cleaner/eac63382208', date_seen: SEEN,
    notes: '정상가 기준. 로그인 시 회원할인가가 별도로 표시됩니다.',
  },
  {
    brand: 'LG', category: 'robot-vacuum', product_slug: 'lg-cordzero-r9',
    item: '로봇청소기 R9 배터리 (EAC63419404)', item_type: 'battery', price_krw: 190000, vat_included: null,
    source_name: 'LG전자 케어 액세서리', source_url: 'https://www.lge.co.kr/care-accessories/robotic-vacuum-cleaner/eac63419404', date_seen: SEEN,
    notes: '할인 전 판매가 기준. 적용 모델(R9 계열)은 페이지에서 확인하세요.',
  },
  ...([
    ['출장점검료 (기본, 거리 무관)', 28000, '평일 일반 시간. 수리 여부와 관계없이 방문 시 청구될 수 있음'],
    ['출장점검료 (평일 18시 이후·주말·공휴일)', 33000, '야간·휴일 할증'],
    ['출장점검료 (여름 성수기 6~8월, 기본)', 33000, '6~8월 성수기'],
    ['출장점검료 (여름 성수기, 평일 18시 이후·주말·공휴일)', 38000, '6~8월 성수기 + 야간·휴일'],
  ] as const).map(([item, price, notes]) => ({
    brand: 'LG', category: null, product_slug: null, item, item_type: 'visit_fee' as const, price_krw: price, vat_included: null,
    source_name: 'LG전자 서비스센터 방문 예약 안내', source_url: 'https://www.lge.co.kr/support/visit-center-reservation?seq=182', date_seen: SEEN,
    notes: `LG전자 가전 공통 출장비(청소기 전용 아님). ${notes}`,
  })),
];
