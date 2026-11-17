// Honest price statistics for model x symptom cells.
// Rules (derived from the RFP "no false precision" requirement):
//  - never mix currencies;
//  - never compute a range from fewer than MIN_N_LOW priced reports;
//  - only show quartiles from MIN_N_OK; flag "good" sample from MIN_N_GOOD;
//  - min-max alone is outlier-fragile, so the headline is the median + interquartile range.
import type { PublicReport } from './types.ts';

export const MIN_N_LOW = 3;
export const MIN_N_OK = 5;
export const MIN_N_GOOD = 10;

export type SampleLevel = 'none' | 'low' | 'ok' | 'good';

export function levelFor(n: number): SampleLevel {
  if (n >= MIN_N_GOOD) return 'good';
  if (n >= MIN_N_OK) return 'ok';
  if (n >= MIN_N_LOW) return 'low';
  return 'none';
}

/** Linear-interpolated quantile (R type 7) on an ascending array. */
export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export interface PriceSummary {
  n: number;
  level: SampleLevel;
  min: number | null;
  max: number | null;
  p25: number | null; // only when level >= ok
  median: number | null; // only when level >= ok
  p75: number | null; // only when level >= ok
}

export function summarize(values: number[]): PriceSummary {
  const v = [...values].sort((a, b) => a - b);
  const n = v.length;
  const level = levelFor(n);
  if (level === 'none') return { n, level, min: null, max: null, p25: null, median: null, p75: null };
  const base = { n, level, min: v[0], max: v[n - 1] };
  if (level === 'low') return { ...base, p25: null, median: null, p75: null };
  return { ...base, p25: quantile(v, 0.25), median: quantile(v, 0.5), p75: quantile(v, 0.75) };
}

/** A price counts when it is a known number; 0 is a valid price only for self-fix. */
export function pricedValue(r: Pick<PublicReport, 'paid_price' | 'repair_channel'>): number | null {
  if (r.paid_price === null || r.paid_price === undefined) return null;
  if (r.paid_price > 0) return r.paid_price;
  return r.repair_channel === 'self_check' ? 0 : null;
}

export interface SymptomStat {
  symptom_id: string;
  currency: string;
  n_reports: number;
  n_priced: number;
  price: PriceSummary;
  resolved_rate: number | null; // null when n_reports < MIN_N_OK
  recurred_rate: number | null;
  by_channel: { channel: string; n_priced: number; median: number | null }[];
  last_report_at: string | null;
}

const rate = (num: number, den: number) => (den >= MIN_N_OK ? Math.round((num / den) * 100) : null);

export function symptomStats(reports: PublicReport[]): SymptomStat[] {
  const live = reports.filter((r) => r.verified_status !== 'rejected');
  const groups = new Map<string, PublicReport[]>();
  for (const r of live) {
    const key = `${r.symptom_id}\u0000${r.currency}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
  }
  const out: SymptomStat[] = [];
  for (const [key, rows] of groups) {
    const [symptom_id, currency] = key.split('\u0000');
    const values = rows.map(pricedValue).filter((x): x is number => x !== null);
    const channels = new Map<string, number[]>();
    for (const r of rows) {
      const pv = pricedValue(r);
      if (pv !== null) (channels.get(r.repair_channel) ?? channels.set(r.repair_channel, []).get(r.repair_channel)!).push(pv);
    }
    out.push({
      symptom_id,
      currency,
      n_reports: rows.length,
      n_priced: values.length,
      price: summarize(values),
      resolved_rate: rate(rows.filter((r) => r.resolved_status === 'resolved').length, rows.length),
      recurred_rate: rate(rows.filter((r) => r.resolved_status === 'recurred').length, rows.length),
      by_channel: [...channels.entries()]
        .map(([channel, vals]) => ({ channel, n_priced: vals.length, median: vals.length >= MIN_N_LOW ? quantile([...vals].sort((a, b) => a - b), 0.5) : null }))
        .sort((a, b) => b.n_priced - a.n_priced),
      last_report_at: rows.map((r) => r.created_at).sort().at(-1) ?? null,
    });
  }
  return out.sort((a, b) => b.n_reports - a.n_reports || a.currency.localeCompare(b.currency));
}

/** Mid-rank percentile (0-100) of `value` within `sorted` (ascending). */
export function percentileRank(value: number, sorted: number[]): number {
  if (sorted.length === 0) return NaN;
  const below = sorted.filter((x) => x < value).length;
  const equal = sorted.filter((x) => x === value).length;
  return Math.round(((below + equal / 2) / sorted.length) * 100);
}

export type QuoteBand = 'below_range' | 'low' | 'typical' | 'high' | 'above_range';

export interface QuoteCheck {
  currency: string;
  n: number;
  level: SampleLevel;
  sufficient: boolean;
  percentile: number | null;
  band: QuoteBand | null;
  summary: PriceSummary | null;
  message: string;
}

/**
 * Where does a quote sit among what owners of the same model + symptom paid?
 * Only answers when there are at least MIN_N_OK priced reports in that currency.
 */
export function quoteCheck(reports: PublicReport[], q: { symptom_id: string; currency: string; quote: number }): QuoteCheck {
  const values = reports
    .filter((r) => r.verified_status !== 'rejected' && r.symptom_id === q.symptom_id && r.currency === q.currency)
    .map(pricedValue)
    .filter((x): x is number => x !== null)
    .sort((a, b) => a - b);
  const summary = summarize(values);
  if (values.length < MIN_N_OK) {
    return {
      currency: q.currency,
      n: values.length,
      level: summary.level,
      sufficient: false,
      percentile: null,
      band: null,
      summary: null,
      message: `같은 모델·증상 제보가 ${values.length}건뿐이라 견적이 정상 범위인지 판단하기 어렵습니다. (최소 ${MIN_N_OK}건 필요)`,
    };
  }
  const p25 = summary.p25 as number;
  const p75 = summary.p75 as number;
  const percentile = percentileRank(q.quote, values);
  let band: QuoteBand;
  if (q.quote < (summary.min as number)) band = 'below_range';
  else if (q.quote > (summary.max as number)) band = 'above_range';
  else if (q.quote < p25) band = 'low';
  else if (q.quote > p75) band = 'high';
  else band = 'typical';
  const text: Record<QuoteBand, string> = {
    below_range: '제보된 금액 중 가장 낮은 수준보다도 낮습니다.',
    low: '제보 범위의 낮은 편(하위 25% 이내)입니다.',
    typical: '제보 범위의 중간 구간(25~75%)에 해당합니다.',
    high: '제보 범위의 높은 편(상위 25% 이내)입니다. 다른 견적도 받아보세요.',
    above_range: '제보된 금액 중 가장 높은 수준보다도 높습니다. 다른 견적을 꼭 받아보세요.',
  };
  return { currency: q.currency, n: values.length, level: summary.level, sufficient: true, percentile, band, summary, message: text[band] };
}
