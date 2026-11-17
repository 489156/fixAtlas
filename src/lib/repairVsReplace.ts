// Repair-vs-replace rules (RFP 5.5 v0.1). Pure and unit-tested; the page only renders the result.
export type Verdict = 'repair' | 'conditional' | 'replace';
export type FailurePart = 'battery' | 'motor' | 'mainboard' | 'sensor' | 'dock' | 'consumable' | 'other';
export type Usage = 'daily' | 'weekly' | 'rarely' | '';
export type Warranty = 'active' | 'expired' | 'unknown';

export interface CalcInput {
  newPrice: number; // current new price, required > 0
  repairCost: number; // quoted repair cost, required >= 0
  purchaseYear: number;
  usedPrice?: number | null;
  purchasePrice?: number | null;
  failurePart: FailurePart;
  usage?: Usage;
  warranty?: Warranty;
}

export type CalcResult =
  | { ok: false; errors: string[] }
  | { ok: true; verdict: Verdict; ratio: number; ratioDisplay: string; title: string; explanation: string; factors: string[]; nextSteps: string[] };

export const CORE_PARTS: FailurePart[] = ['battery', 'motor', 'mainboard'];
export const THRESHOLDS = { repair: 25, conditional: 50 } as const;

const TITLE: Record<Verdict, string> = {
  repair: '수리 우선 검토',
  conditional: '조건부 수리 검토',
  replace: '교체 우선 검토',
};

export function calculate(i: Partial<CalcInput>, now = new Date()): CalcResult {
  const errors: string[] = [];
  const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : NaN);
  const newPrice = num(i.newPrice);
  const repairCost = num(i.repairCost);
  const year = num(i.purchaseYear);
  if (!(newPrice > 0) || newPrice > 100_000_000) errors.push('현재 신품가는 1원 이상 1억 원 이하로 입력해 주세요.');
  if (!(repairCost >= 0) || repairCost > 100_000_000) errors.push('수리비는 0원 이상 1억 원 이하로 입력해 주세요.');
  if (!Number.isInteger(year) || year < 2000 || year > now.getFullYear()) errors.push('구매연도를 확인해 주세요.');
  for (const [label, v] of [['중고가', i.usedPrice], ['구매가', i.purchasePrice]] as const) {
    if (v !== null && v !== undefined && !(num(v) >= 0 && num(v) <= 100_000_000)) errors.push(`${label}는 0원 이상 1억 원 이하로 입력해 주세요.`);
  }
  if (errors.length) return { ok: false, errors };

  const part = i.failurePart ?? 'other';
  const age = now.getFullYear() - year;
  const ratio = (repairCost / newPrice) * 100;
  const factors: string[] = [];

  let verdict: Verdict = ratio <= THRESHOLDS.repair ? 'repair' : ratio <= THRESHOLDS.conditional ? 'conditional' : 'replace';
  let explanation =
    verdict === 'repair'
      ? '수리비가 신품가의 25% 이하입니다. 경제적으로는 수리 쪽이 유리합니다.'
      : verdict === 'conditional'
        ? '수리비가 신품가의 25~50%입니다. 제품 연식·상태·보증을 함께 보고 결정하세요.'
        : '수리비가 신품가의 50%를 넘습니다. 새 제품 구매를 우선 검토할 만합니다.';

  if (age >= 4 && CORE_PARTS.includes(part)) {
    factors.push(`제품 연식이 ${age}년이고 핵심 부품(배터리·모터·메인보드) 고장이라 교체 쪽에 무게를 둘 만합니다.`);
    if (verdict === 'repair') verdict = 'conditional';
  }
  if (part === 'consumable') {
    factors.push('소모품성 고장입니다. 본체 수리보다 소모품 단품 교체 비용이 훨씬 저렴한지 먼저 확인하세요.');
    if (verdict === 'replace') verdict = 'conditional';
  }
  if (age <= 1) factors.push('구매한 지 얼마 되지 않았습니다. 무상 보증이나 판매처 교환 가능 여부를 먼저 확인하세요.');
  if (i.warranty === 'active') {
    factors.push('무상 보증기간 내라면 수리비를 내지 않을 수 있습니다. 견적을 받기 전에 공식 서비스에 보증 적용 여부를 문의하세요.');
  }
  const used = i.usedPrice ?? 0;
  if (used > 0 && repairCost > used * 0.8) factors.push('수리비가 중고 시세의 80%를 넘습니다. 수리해도 재판매 가치가 수리비를 따라가지 못할 수 있습니다.');
  if (used > 0 && repairCost <= used * 0.3) factors.push('수리비가 중고 시세의 30% 이하입니다. 수리해서 계속 쓰는 편이 합리적일 수 있습니다.');
  if (i.usage === 'daily' && verdict !== 'replace') factors.push('매일 쓰는 제품이라 수리 후 사용 기간이 길수록 비용 대비 효용이 커집니다.');
  if (i.usage === 'rarely' && verdict !== 'repair') factors.push('거의 쓰지 않는 제품이라면 비싼 수리보다 처분·교체가 나을 수 있습니다.');

  if (verdict !== (ratio <= THRESHOLDS.repair ? 'repair' : ratio <= THRESHOLDS.conditional ? 'conditional' : 'replace')) {
    explanation += ' (아래 추가 확인 사항이 판단에 반영되었습니다.)';
  }

  return {
    ok: true,
    verdict,
    ratio: Math.round(ratio),
    ratioDisplay: ratio > 999 ? '999% 초과' : `${Math.round(ratio)}%`,
    title: TITLE[verdict],
    explanation,
    factors,
    nextSteps: [
      '같은 모델·증상의 다른 사용자 수리비 제보를 확인하세요.',
      '가능하면 견적을 2곳 이상 비교하세요. (공식 AS와 사설 수리의 차이가 클 수 있습니다)',
      '견적서에 부품비·공임·출장비가 나뉘어 있는지 확인하세요.',
    ],
  };
}
