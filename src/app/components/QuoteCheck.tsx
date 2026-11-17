import { useState } from 'react';
import { Link } from 'react-router';
import { Gauge } from 'lucide-react';
import { api } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { track } from '../../lib/analytics';

interface Symptom { id: string; name_ko: string }
interface Check {
  sufficient: boolean;
  n: number;
  percentile: number | null;
  band: 'below_range' | 'low' | 'typical' | 'high' | 'above_range' | null;
  message: string;
  currency: string;
  summary: { min: number | null; p25: number | null; median: number | null; p75: number | null; max: number | null } | null;
}

const BAND_STYLE: Record<string, string> = {
  below_range: 'bg-green-50 border-green-300', low: 'bg-green-50 border-green-300', typical: 'bg-blue-50 border-blue-300',
  high: 'bg-orange-50 border-orange-300', above_range: 'bg-red-50 border-red-300',
};
const BAND_LABEL: Record<string, string> = {
  below_range: '범위보다 낮음', low: '낮은 편', typical: '중간 구간', high: '높은 편', above_range: '범위보다 높음',
};

/** The product's core promise: "is my quote normal for this model + symptom?" */
export function QuoteCheck({ productKey, productSlug, symptoms, defaultSymptomId }: {
  productKey: string; productSlug: string; symptoms: Symptom[]; defaultSymptomId?: string;
}) {
  const [symptomId, setSymptomId] = useState(defaultSymptomId ?? '');
  const [currency, setCurrency] = useState('KRW');
  const [quote, setQuote] = useState('');
  const [result, setResult] = useState<Check | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const q = Number(quote);
    if (!symptomId) return setError('증상을 선택해 주세요.');
    if (!Number.isFinite(q) || q < 0) return setError('견적 금액을 숫자로 입력해 주세요.');
    setLoading(true);
    try {
      const r = await api<Check>(`/products/${encodeURIComponent(productKey)}/quote-check?symptom_id=${encodeURIComponent(symptomId)}&currency=${currency}&quote=${q}`);
      setResult(r);
      track('quote_check', { sufficient: r.sufficient, n: r.n, band: r.band ?? 'none' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" aria-labelledby="qc-title">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <h2 id="qc-title" className="text-2xl font-bold text-gray-900">내 견적, 정상 범위일까?</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">받은 견적을 입력하면 같은 모델·증상으로 제보된 수리비와 비교해 드립니다. (입력한 금액은 저장되지 않습니다)</p>
      <form onSubmit={run} className="grid md:grid-cols-4 gap-3 items-end">
        <label className="md:col-span-2 text-sm text-gray-700">
          증상
          <select value={symptomId} onChange={(e) => setSymptomId(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">증상을 선택하세요</option>
            {symptoms.map((s) => <option key={s.id} value={s.id}>{s.name_ko}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-700">
          견적 금액
          <input inputMode="numeric" type="number" min={0} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="예: 145000"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </label>
        <div className="flex gap-2">
          <label className="text-sm text-gray-700 flex-1">
            통화
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg">
              {['KRW', 'USD', 'CNY', 'JPY', 'EUR'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button type="submit" disabled={loading} className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? '확인 중…' : '비교'}
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}

      {result && (
        <div className={`mt-4 p-4 border rounded-lg ${result.sufficient && result.band ? BAND_STYLE[result.band] : 'bg-gray-50 border-gray-300'}`} role="status">
          {result.sufficient && result.band ? (
            <>
              <p className="font-bold text-gray-900">{BAND_LABEL[result.band]} <span className="font-normal text-gray-600">· 제보 {result.n}건 기준 상위 {100 - (result.percentile ?? 0)}% 구간</span></p>
              <p className="text-sm text-gray-700 mt-1">{result.message}</p>
              {result.summary?.median != null && (
                <p className="text-xs text-gray-600 mt-2">
                  중앙값 {formatMoney(result.summary.median, result.currency)} · 25~75% {formatMoney(result.summary.p25, result.currency)} ~ {formatMoney(result.summary.p75, result.currency)}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-bold text-gray-900">아직 비교할 제보가 충분하지 않습니다.</p>
              <p className="text-sm text-gray-700 mt-1">{result.message}</p>
              <Link to={`/submit-repair?product=${productSlug}&symptom=${symptomId}`} onClick={() => track('submit_start', { from: 'quote_check' })} className="inline-block mt-2 text-blue-600 underline text-sm">
                이 모델 수리비를 제보하면 다음 사용자에게 도움이 됩니다
              </Link>
            </>
          )}
          <p className="text-xs text-gray-500 mt-2">사용자 제보 기반 참고 정보이며 지역·업체·부품에 따라 실제 비용은 다를 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}
