import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import { Package, AlertTriangle, TrendingUp, CheckCircle, XCircle, ShieldAlert, BadgeInfo } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { categoryLabel, formatMoney, CHANNEL_LABEL, RESOLVED_LABEL, SAFETY_LABEL } from '../../lib/format';
import { track } from '../../lib/analytics';
import { AffiliateSlot } from '../components/AffiliateSlot';
import { QuoteCheck } from '../components/QuoteCheck';
import { SEO } from '../components/SEO';

interface Product {
  id: string; slug: string; category: string; brand: string; brand_ko: string; model_name: string;
  alternate_names: string[]; release_year: number; description: string;
}
interface Symptom { id: string; code: string; name_ko: string; name_en: string; risk_level: string; categories: string[] }
interface Report {
  id: string; symptom_id: string; paid_price: number | null; quoted_price: number | null; currency: string;
  repair_channel: string; resolved_status: string; review_text: string; error_code: string;
  purchase_year: number | null; created_at: string;
}
interface Card { id: string; symptom_id: string | null; title_ko: string; body_ko: string; sort_order: number; safety_level: string }
interface Stat {
  symptom_id: string; currency: string; n_reports: number; n_priced: number;
  price: { n: number; level: 'none' | 'low' | 'ok' | 'good'; min: number | null; max: number | null; p25: number | null; median: number | null; p75: number | null };
  resolved_rate: number | null; recurred_rate: number | null;
  by_channel: { channel: string; n_priced: number; median: number | null }[];
}
interface RefPrice { id: string; item: string; item_type: string; price_krw: number; source_name: string; source_url: string; date_seen: string; notes: string }
interface Payload { product: Product; reports: Report[]; stats: Stat[]; symptoms: Symptom[]; self_check_cards: Card[]; reference_prices: RefPrice[] }

const REF_TYPE_LABEL: Record<string, string> = {
  battery: '배터리', consumable: '소모품', part: '부품', visit_fee: '출장 점검료', inspection_fee: '점검비', shipping_fee: '택배 서비스비', warranty: '보증',
};
const SAMPLE_LABEL = { none: '표본 부족', low: '표본 적음', ok: '참고 가능', good: '표본 충분' } as const;

export function ProductDetail() {
  const { id: key } = useParams();
  const [params] = useSearchParams();
  const focusSymptom = params.get('symptom') ?? '';
  const { t } = useTranslation();
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    setLoading(true);
    setFailed(false);
    api<Payload>(`/products/${encodeURIComponent(key)}`)
      .then((d) => { if (alive) { setData(d); track('product_view', { product: d.product.slug, has_reports: d.reports.length > 0 }); } })
      .catch(() => alive && (setData(null), setFailed(true)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [key]);

  const symptomName = (sid: string) => data?.symptoms.find((s) => s.id === sid)?.name_ko ?? sid;
  const applicable = useMemo(() => (data ? data.symptoms.filter((s) => !s.categories.length || s.categories.includes(data.product.category)) : []), [data]);

  if (loading) {
    return (
      <div className="text-center py-12" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">{t('product.loading')}</p>
      </div>
    );
  }
  if (failed || !data) {
    return (
      <div className="text-center py-12">
        <SEO title="제품을 찾을 수 없습니다" noIndex />
        <p className="text-gray-600">{t('product.notFound')}</p>
        <Link to="/search" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">제품 검색하기</Link>
      </div>
    );
  }

  const { product, reports, stats, self_check_cards: cards, reference_prices: refs } = data;
  const name = `${product.brand} ${product.model_name}`;
  const safetyCards = cards.filter((c) => c.symptom_id === null);
  const symptomCards = cards.filter((c) => c.symptom_id !== null);
  const statsBySymptom = stats.reduce<Record<string, Stat[]>>((acc, s) => ((acc[s.symptom_id] ??= []).push(s), acc), {});
  const noData = reports.length === 0 && refs.length === 0;

  // FAQ markup only from real data (n_priced >= 5): never from templates.
  const faq = stats.filter((s) => s.price.level === 'ok' || s.price.level === 'good').slice(0, 5).map((s) => ({
    '@type': 'Question',
    name: `${name} ${symptomName(s.symptom_id)} 수리비는 얼마인가요?`,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `사용자 제보 ${s.price.n}건 기준 중앙값은 ${formatMoney(s.price.median, s.currency)}, 중간 50% 구간은 ${formatMoney(s.price.p25, s.currency)}~${formatMoney(s.price.p75, s.currency)}입니다. 지역·업체·부품에 따라 달라질 수 있는 참고 정보입니다.`,
    },
  }));
  const jsonLd: Record<string, unknown>[] = [
    { '@context': 'https://schema.org', '@type': 'Product', name, brand: { '@type': 'Brand', name: product.brand }, category: categoryLabel(product.category), description: product.description },
  ];
  if (faq.length) jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq });

  const reportCount = stats.reduce((n, s) => n + s.n_reports, 0);

  return (
    <>
      <SEO
        title={`${name} 고장·수리비`}
        description={`${name}의 고장 증상별 자가점검, 사용자 제보 수리비 범위, 해결률${reportCount ? ` (제보 ${reportCount}건)` : ''}.`}
        noIndex={noData}
        jsonLd={jsonLd}
      />
      <div className="max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">
        <nav aria-label="경로" className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">홈</Link> › <Link to={`/search?q=${encodeURIComponent(product.brand)}`} className="hover:underline">{product.brand}</Link> › <span>{product.model_name}</span>
        </nav>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Package className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{categoryLabel(product.category)}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name} 고장·수리비</h1>
              <p className="text-gray-600">{product.description}</p>
              {product.alternate_names.length > 0 && <p className="text-sm text-gray-500 mt-2">다른 이름: {product.alternate_names.join(', ')}</p>}
              <p className="text-sm text-gray-500 mt-1">{t('product.releaseYear', { year: product.release_year })}</p>
              <div className="mt-4"><AffiliateSlot productId={product.id} /></div>
            </div>
          </div>
        </div>

        <QuoteCheck productKey={product.id} productSlug={product.slug} symptoms={applicable} defaultSymptomId={focusSymptom} />

        {safetyCards.map((c) => (
          <div key={c.id} className="p-5 bg-red-50 border-2 border-red-300 rounded-xl flex gap-3" role="note">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold text-red-800">[Do Not DIY] {c.title_ko}</p>
              <p className="text-sm text-red-900 mt-2 whitespace-pre-wrap">{c.body_ko}</p>
            </div>
          </div>
        ))}

        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" aria-labelledby="stats-title">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" aria-hidden="true" />
            <h2 id="stats-title" className="text-2xl font-bold text-gray-900">{t('product.symptomsTitle')}</h2>
          </div>
          {stats.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(statsBySymptom).map(([sid, rows]) => {
                const sym = data.symptoms.find((s) => s.id === sid);
                return (
                  <div key={sid} className={`p-6 border rounded-lg ${sid === focusSymptom ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{sym?.name_ko ?? sid}</h3>
                      {sym && <span className="text-xs text-gray-500">{sym.name_en}</span>}
                    </div>
                    {rows.map((s) => (
                      <div key={s.currency} className="grid md:grid-cols-3 gap-4 py-3 border-t border-gray-100 first:border-t-0 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">제보 수 ({s.currency})</p>
                          <p className="text-2xl font-bold text-blue-600">{s.n_reports}<span className="text-sm font-normal text-gray-500"> 건 · 금액 입력 {s.n_priced}건</span></p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">수리비 ({SAMPLE_LABEL[s.price.level]})</p>
                          {s.price.level === 'none' && <p className="text-gray-700">표본이 부족해 범위를 표시하지 않습니다. (3건 이상부터 표시)</p>}
                          {s.price.level === 'low' && (
                            <p className="font-medium text-gray-900">{formatMoney(s.price.min, s.currency)} ~ {formatMoney(s.price.max, s.currency)} <span className="text-xs text-amber-700">참고용 (표본 {s.price.n}건)</span></p>
                          )}
                          {(s.price.level === 'ok' || s.price.level === 'good') && (
                            <>
                              <p className="font-bold text-gray-900">중앙값 {formatMoney(s.price.median, s.currency)}</p>
                              <p className="text-xs text-gray-600">중간 50%: {formatMoney(s.price.p25, s.currency)} ~ {formatMoney(s.price.p75, s.currency)}</p>
                              <p className="text-xs text-gray-500">전체: {formatMoney(s.price.min, s.currency)} ~ {formatMoney(s.price.max, s.currency)}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">해결률 · 재발률</p>
                          {s.resolved_rate === null ? <p className="text-gray-700">표본 부족 (5건 이상부터)</p> : <p className="font-medium text-gray-900">{s.resolved_rate}% · {s.recurred_rate}%</p>}
                          {s.by_channel.filter((c) => c.median !== null).map((c) => (
                            <p key={c.channel} className="text-xs text-gray-600">{CHANNEL_LABEL[c.channel] ?? c.channel} 중앙값 {formatMoney(c.median, s.currency)} ({c.n_priced}건)</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{t('product.noStats')}</p>
              <p className="text-sm text-gray-500 mt-2">{t('product.noStatsHint')}</p>
              <Link to={`/submit-repair?product=${product.slug}`} onClick={() => track('submit_start', { from: 'product_empty' })} className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                이 제품 수리비 제보하기
              </Link>
            </div>
          )}
        </section>

        {refs.length > 0 && (
          <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" aria-labelledby="ref-title">
            <div className="flex items-center gap-2 mb-2">
              <BadgeInfo className="w-6 h-6 text-blue-600" aria-hidden="true" />
              <h2 id="ref-title" className="text-2xl font-bold text-gray-900">공식·공개 자료 기준 가격</h2>
            </div>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mb-4">
              사용자 제보가 아닌 제조사·공식 스토어 등 공개 출처의 표기 가격입니다. 확인일 이후 변경될 수 있으니 구매·접수 전에 출처를 다시 확인하세요.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500"><tr><th className="py-2 pr-4">구분</th><th className="py-2 pr-4">항목</th><th className="py-2 pr-4">가격</th><th className="py-2">출처 · 확인일</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {refs.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 pr-4 whitespace-nowrap">{REF_TYPE_LABEL[r.item_type] ?? r.item_type}</td>
                      <td className="py-2 pr-4">{r.item}{r.notes && <span className="block text-xs text-gray-500">{r.notes}</span>}</td>
                      <td className="py-2 pr-4 font-medium whitespace-nowrap">{formatMoney(r.price_krw)}</td>
                      <td className="py-2"><a href={r.source_url} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-600 underline">{r.source_name}</a><span className="block text-xs text-gray-500">{r.date_seen}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cards.length > 0 && (
          <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" aria-labelledby="self-title">
            <h2 id="self-title" className="text-2xl font-bold text-gray-900 mb-2">{t('product.selfCheckTitle')}</h2>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mb-4">{t('product.selfCheckDisclaimer')}</p>
            <div className="space-y-3">
              {symptomCards.map((c) => {
                const sf = SAFETY_LABEL[c.safety_level] ?? SAFETY_LABEL.caution;
                const open = c.symptom_id === focusSymptom;
                return (
                  <details key={c.id} open={open} onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track('self_check_view', { symptom: c.symptom_id ?? '' })} className="border border-gray-200 rounded-lg bg-gray-50">
                    <summary className="p-4 cursor-pointer flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium border rounded ${sf.cls}`} title={sf.hint}>{sf.label}</span>
                      <span className="font-medium text-gray-900">{c.title_ko}</span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-xs text-gray-500 mb-2">{sf.hint}</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.body_ko}</p>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200" aria-labelledby="recent-title">
          <h2 id="recent-title" className="text-2xl font-bold text-gray-900 mb-6">{t('product.reportsTitle')}</h2>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.slice(0, 10).map((r) => (
                <div key={r.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{symptomName(r.symptom_id)}{r.error_code && <span className="ml-2 text-xs font-mono px-1.5 py-0.5 bg-gray-100 rounded">{r.error_code}</span>}</p>
                      <p className="text-sm text-gray-600 mt-1">{CHANNEL_LABEL[r.repair_channel] ?? r.repair_channel}{r.purchase_year ? ` · ${r.purchase_year}년 구매` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{formatMoney(r.paid_price, r.currency)}</p>
                      {r.quoted_price !== null && r.paid_price !== null && r.quoted_price !== r.paid_price && <p className="text-xs text-gray-500">견적 {formatMoney(r.quoted_price, r.currency)}</p>}
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {r.resolved_status === 'resolved' ? <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" /> : r.resolved_status === 'unresolved' ? <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" /> : <AlertTriangle className="w-4 h-4 text-yellow-600" aria-hidden="true" />}
                        <span className="text-sm text-gray-600">{RESOLVED_LABEL[r.resolved_status] ?? r.resolved_status}</span>
                      </div>
                    </div>
                  </div>
                  {r.review_text && <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded whitespace-pre-wrap">{r.review_text}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg"><p className="text-gray-600">{t('product.noReports')}</p></div>
          )}
        </section>

        <div className="flex flex-col md:flex-row gap-4">
          <Link to={`/submit-repair?product=${product.slug}`} onClick={() => track('submit_start', { from: 'product_cta' })} className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center">
            {t('product.ctaSubmit')}
          </Link>
          <Link to={`/calculator?product=${product.slug}`} className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
            {t('product.ctaCalculator')}
          </Link>
        </div>
      </div>
    </>
  );
}
