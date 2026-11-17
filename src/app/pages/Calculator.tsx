import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Calculator as CalculatorIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { categoryLabel } from '../../lib/format';
import { calculate, type CalcResult, type FailurePart, type Usage, type Warranty } from '../../lib/repairVsReplace';
import { track } from '../../lib/analytics';
import { SEO } from '../components/SEO';

interface Product { id: string; slug: string; category: string; brand: string; model_name: string }

const PARTS: [FailurePart, string][] = [
  ['battery', '배터리'], ['motor', '모터'], ['mainboard', '메인보드'], ['sensor', '센서'], ['dock', '도크(스테이션)'], ['consumable', '소모품'], ['other', '기타'],
];

export function Calculator() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [f, setF] = useState({
    newPrice: '', repairCost: '', usedPrice: '', purchasePrice: '', purchaseYear: '',
    failurePart: 'battery' as FailurePart, usage: '' as Usage, warranty: 'unknown' as Warranty,
  });
  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    api<{ products: Product[] }>('/products').then((d) => {
      setProducts(d.products ?? []);
      const slug = params.get('product');
      const m = slug ? (d.products ?? []).find((p) => p.slug === slug || p.id === slug) : null;
      if (m) setProductId(m.id);
    }).catch(() => setProducts([]));
  }, []);

  const product = products.find((p) => p.id === productId) ?? null;
  const optional = (v: string) => (v === '' ? null : Number(v));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = calculate({
      newPrice: Number(f.newPrice), repairCost: Number(f.repairCost), purchaseYear: Number(f.purchaseYear),
      usedPrice: optional(f.usedPrice), purchasePrice: optional(f.purchasePrice),
      failurePart: f.failurePart, usage: f.usage, warranty: f.warranty,
    });
    setResult(r);
    if (r.ok) track('calculator_used', { verdict: r.verdict, ratio: Math.min(r.ratio, 999), part: f.failurePart, category: product?.category ?? 'none' });
  };

  const input = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none';
  const lab = 'block text-sm font-medium text-gray-700 mb-2';
  const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      <SEO title="수리 vs 교체 계산기" description="수리비와 신품가를 비교하여 수리와 교체 중 어느 것이 더 경제적인지 판단해보세요" />
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalculatorIcon className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">{t('calculator.title')}</h1>
          </div>
          <p className="text-gray-600 mb-8">{t('calculator.subtitle')}</p>

          <form onSubmit={submit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="prod" className={lab}>제품 (선택)</label>
              <select id="prod" value={productId} onChange={(e) => setProductId(e.target.value)} className={input}>
                <option value="">선택 안 함</option>
                {['robot-vacuum', 'cordless-vacuum'].map((cat) => (
                  <optgroup key={cat} label={categoryLabel(cat)}>
                    {products.filter((p) => p.category === cat).map((p) => <option key={p.id} value={p.id}>{p.brand} {p.model_name}</option>)}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">제품을 고르면 같은 모델의 수리비 제보로 바로 연결해 드립니다.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="np" className={lab}>현재 신품가 (원) <span className="text-red-500">*</span></label>
                <input id="np" type="number" inputMode="numeric" min={1} value={f.newPrice} onChange={(e) => setF({ ...f, newPrice: e.target.value })} placeholder="850000" className={input} />
              </div>
              <div>
                <label htmlFor="rc" className={lab}>수리비 (원) <span className="text-red-500">*</span></label>
                <input id="rc" type="number" inputMode="numeric" min={0} value={f.repairCost} onChange={(e) => setF({ ...f, repairCost: e.target.value })} placeholder="180000" className={input} />
              </div>
              <div>
                <label htmlFor="up" className={lab}>현재 중고가 (원)</label>
                <input id="up" type="number" inputMode="numeric" min={0} value={f.usedPrice} onChange={(e) => setF({ ...f, usedPrice: e.target.value })} placeholder="300000" className={input} />
              </div>
              <div>
                <label htmlFor="pp" className={lab}>구매가 (원)</label>
                <input id="pp" type="number" inputMode="numeric" min={0} value={f.purchasePrice} onChange={(e) => setF({ ...f, purchasePrice: e.target.value })} placeholder="1200000" className={input} />
              </div>
              <div>
                <label htmlFor="py" className={lab}>구매연도 <span className="text-red-500">*</span></label>
                <select id="py" value={f.purchaseYear} onChange={(e) => setF({ ...f, purchaseYear: e.target.value })} className={input}>
                  <option value="">선택하세요</option>
                  {years.map((y) => <option key={y} value={y}>{y}년</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="part" className={lab}>고장 부위</label>
                <select id="part" value={f.failurePart} onChange={(e) => setF({ ...f, failurePart: e.target.value as FailurePart })} className={input}>
                  {PARTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="usage" className={lab}>사용빈도</label>
                <select id="usage" value={f.usage} onChange={(e) => setF({ ...f, usage: e.target.value as Usage })} className={input}>
                  <option value="">선택 안 함</option>
                  <option value="daily">거의 매일</option>
                  <option value="weekly">주 1~3회</option>
                  <option value="rarely">가끔</option>
                </select>
              </div>
              <div>
                <label htmlFor="war" className={lab}>보증기간</label>
                <select id="war" value={f.warranty} onChange={(e) => setF({ ...f, warranty: e.target.value as Warranty })} className={input}>
                  <option value="unknown">모름</option>
                  <option value="active">보증 기간 내</option>
                  <option value="expired">만료</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">{t('calculator.calculate')}</button>
          </form>
        </div>

        {result && !result.ok && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg" role="alert">
            <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">{result.errors.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
        )}

        {result && result.ok && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" role="status">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                {result.verdict === 'repair' && <TrendingUp className="w-8 h-8 text-green-600" aria-hidden="true" />}
                {result.verdict === 'replace' && <TrendingDown className="w-8 h-8 text-red-600" aria-hidden="true" />}
                {result.verdict === 'conditional' && <Minus className="w-8 h-8 text-yellow-600" aria-hidden="true" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
              <p className="text-gray-600">{result.explanation}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2 text-center">수리비 비중 (신품가 대비)</p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 max-w-md">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden" aria-hidden="true">
                    <div className={`h-full ${result.ratio <= 25 ? 'bg-green-500' : result.ratio <= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(result.ratio, 100)}%` }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{result.ratioDisplay}</p>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">기준: 25% 이하 수리 / 25~50% 조건부 / 50% 초과 교체 (일반적인 경험칙이며 모델별 데이터로 보정되지 않았습니다)</p>
            </div>

            {result.factors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">추가 확인 사항</h3>
                <ul className="space-y-2">
                  {result.factors.map((x) => <li key={x} className="flex gap-2 text-sm text-gray-700"><span className="text-blue-600">•</span>{x}</li>)}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">다음 단계</h3>
              <ul className="space-y-2">
                {result.nextSteps.map((x) => <li key={x} className="flex gap-2 text-sm text-gray-700"><span className="text-blue-600">→</span>{x}</li>)}
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <Link to={product ? `/products/${product.category}/${product.slug}` : '/search'} className="flex-1 text-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {product ? `${product.brand} ${product.model_name} 유사 제보 보기` : '같은 모델 유사 제보 찾기'}
              </Link>
              <Link to={product ? `/submit-repair?product=${product.slug}` : '/submit-repair'} onClick={() => track('submit_start', { from: 'calculator' })} className="flex-1 text-center px-5 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                내 수리비 제보하기
              </Link>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-gray-700">{t('calculator.disclaimer')}</p></div>
          </div>
        )}
      </div>
    </>
  );
}
