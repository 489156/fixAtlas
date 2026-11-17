import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Search as SearchIcon, Package, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { categoryLabel } from '../../lib/format';
import { track } from '../../lib/analytics';
import { SEO } from '../components/SEO';

interface Product {
  id: string;
  slug: string;
  category: string;
  brand: string;
  brand_ko: string;
  model_name: string;
  alternate_names: string[];
}
interface Symptom { id: string; code: string; name_ko: string; name_en: string }
interface SearchResponse {
  products: Product[];
  symptoms: Symptom[];
  parsed: { unmatched_models: string[]; symptom_ids: string[]; brands: string[] };
  reason: 'ok' | 'symptom_only' | 'brand_fallback' | 'empty_query' | 'no_match';
}

export function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [input, setInput] = useState(q);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setInput(q);
    if (!q.trim()) { setData(null); return; }
    let alive = true;
    setLoading(true);
    setError('');
    api<SearchResponse>(`/search?q=${encodeURIComponent(q)}`)
      .then((d) => {
        if (!alive) return;
        setData(d);
        const n = d.products.length + d.symptoms.length;
        track('search', { q: q.slice(0, 100), n });
        if (n === 0) track('search_zero_result', { q: q.slice(0, 100) });
      })
      .catch(() => alive && setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSearchParams({ q: input.trim() });
  };

  const symptomId = data?.parsed.symptom_ids?.[0];
  const productLink = (p: Product) => `/products/${p.category}/${p.slug}${symptomId ? `?symptom=${symptomId}` : ''}`;
  const hasAny = !!data && (data.products.length > 0 || data.symptoms.length > 0);
  const unmatched = data?.parsed.unmatched_models ?? [];

  return (
    <>
      <SEO
        title={q ? `${q} 검색 결과` : '제품·증상 검색'}
        description={q ? `${q}에 대한 제품 및 증상 검색 결과` : '제품명, 브랜드, 모델명, 증상으로 검색하세요'}
        noIndex={!!q}
      />
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
        <form onSubmit={submit} className="mb-8" role="search">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 로보락 S8 충전 안 됨 / Dyson V10 weak suction"
              aria-label="제품·증상 검색"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>
        </form>

        {loading && (
          <div className="text-center py-12" role="status">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">{t('search.searching')}</p>
          </div>
        )}

        {error && <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">{error}</p>}

        {!loading && !error && data && (
          <>
            {data.symptoms.length > 0 && (
              <p className="mb-4 text-sm text-gray-600">
                인식한 증상: {data.symptoms.map((s) => <span key={s.id} className="inline-block mr-2 px-2 py-1 bg-blue-50 text-blue-700 rounded">{s.name_ko}</span>)}
              </p>
            )}

            {unmatched.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3" role="status">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-gray-800">
                  <p><strong>{unmatched.map((m) => m.toUpperCase()).join(', ')}</strong> 모델은 아직 등록되지 않았습니다. 같은 브랜드의 등록된 모델을 보여드립니다.</p>
                  <Link
                    to={`/submit-repair?model=${encodeURIComponent(q)}`}
                    onClick={() => track('product_request', { q: q.slice(0, 100) })}
                    className="inline-block mt-2 text-blue-600 underline"
                  >
                    이 모델로 수리비 제보하기 (모델 등록 요청)
                  </Link>
                </div>
              </div>
            )}

            {data.reason === 'symptom_only' && (
              <h2 className="text-lg font-bold mb-4">어떤 제품을 사용 중이신가요? 제품을 선택하면 해당 증상의 점검 방법과 수리비를 보여드립니다.</h2>
            )}

            {data.products.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  {t('search.products')} ({data.products.length})
                </h2>
                <div className="space-y-4">
                  {data.products.map((p) => (
                    <Link
                      key={p.id}
                      to={productLink(p)}
                      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{categoryLabel(p.category)}</p>
                          <h3 className="text-lg font-bold text-gray-900">{p.brand} {p.model_name}</h3>
                          {p.brand_ko && <p className="text-sm text-gray-600 mt-1">{p.brand_ko}</p>}
                        </div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full whitespace-nowrap">{t('search.detail')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {!hasAny && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700 mb-2">{t('search.noResults', { q })}</p>
                <p className="text-sm text-gray-500 mb-4">브랜드·모델명·증상 중 일부만 입력해 보세요. 찾는 모델이 없다면 알려주세요.</p>
                <Link
                  to={`/submit-repair?model=${encodeURIComponent(q)}`}
                  onClick={() => track('product_request', { q: q.slice(0, 100) })}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('search.ctaSubmit')}
                </Link>
              </div>
            )}
          </>
        )}

        {!loading && !error && !q && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600">{t('search.emptyState')}</p>
          </div>
        )}
      </div>
    </>
  );
}
