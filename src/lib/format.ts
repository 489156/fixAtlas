export const CATEGORY_LABEL: Record<string, string> = {
  'robot-vacuum': '로봇청소기',
  'cordless-vacuum': '무선청소기',
};
export const categoryLabel = (c: string) => CATEGORY_LABEL[c] ?? c;

const SYMBOL: Record<string, string> = { USD: '$', CNY: '¥', JPY: '¥', EUR: '€' };

/** null/undefined = unknown (never shown as 0). KRW keeps the 원 suffix. */
export function formatMoney(n: number | null | undefined, currency = 'KRW'): string {
  if (n === null || n === undefined) return '금액 미입력';
  const s = Math.round(n).toLocaleString('ko-KR');
  return currency === 'KRW' ? `${s}원` : `${SYMBOL[currency] ?? ''}${s}${SYMBOL[currency] ? '' : ` ${currency}`}`;
}

export const CHANNEL_LABEL: Record<string, string> = { official: '공식 AS', third_party: '사설 수리', self_check: '자가조치' };
export const RESOLVED_LABEL: Record<string, string> = { resolved: '해결', unresolved: '미해결', recurred: '재발' };

export const SAFETY_LABEL: Record<string, { label: string; cls: string; hint: string }> = {
  safe_check: { label: 'Safe Check', cls: 'bg-green-100 text-green-800 border-green-300', hint: '사용자가 직접 확인할 수 있는 항목' },
  caution: { label: 'Caution', cls: 'bg-yellow-100 text-yellow-800 border-yellow-300', hint: '제품 설명서를 먼저 확인하세요' },
  expert_only: { label: 'Expert Only', cls: 'bg-orange-100 text-orange-800 border-orange-300', hint: '전문가 또는 공식 AS를 권장합니다' },
  do_not_diy: { label: 'Do Not DIY', cls: 'bg-red-100 text-red-800 border-red-300', hint: '안전사고 위험으로 직접 수리 금지' },
};
