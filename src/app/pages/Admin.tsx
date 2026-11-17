import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Settings, Package, AlertCircle, MessageSquare, Users, Database, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { api, ApiError } from '../../lib/api';
import { formatMoney, CHANNEL_LABEL } from '../../lib/format';
import { SEO } from '../components/SEO';

interface AdminReport {
  id: string; product_id: string | null; product_name: string; symptom_name: string; custom_product: string;
  repair_channel: string; paid_price: number | null; currency: string; country: string; verified_status: string;
  hidden: boolean; has_receipt: boolean; review_text: string; created_at: string;
}
interface Post { id: string; title: string; body: string; type: string; status: string; hidden: boolean; verified: boolean }
interface ProductRow { id: string; category: string; brand: string; model_name: string; release_year: number }
interface AdminData { products: ProductRow[]; symptoms: { id: string; name_ko: string; name_en: string; risk_level: string }[]; reports: AdminReport[]; posts: Post[]; users: unknown[] }
interface Metrics {
  kpi: Record<string, number | string | null>;
  top_zero_result_queries: { q: string; n: number }[];
  top_queries: { q: string; n: number }[];
  top_requested_models: { q: string; n: number }[];
  thin_products: { product_id: string; brand: string; model_name: string; n_reports: number; n_priced: number }[];
  campaigns: { src: string; cmp: string; sessions: number; quote_checks: number; submits: number }[];
}

// RFP section 18 targets (90 days)
const TARGETS: { key: string; label: string; goal: number; unit?: string }[] = [
  { key: 'reports_total', label: '수리비 제보', goal: 100 },
  { key: 'reports_verified', label: '인증 제보', goal: 20 },
  { key: 'visitors', label: '방문자(익명 세션)', goal: 5000 },
  { key: 'calculator_uses', label: '계산기 사용', goal: 1000 },
  { key: 'signups', label: '회원가입', goal: 300 },
  { key: 'posts', label: '커뮤니티 게시글', goal: 100 },
  { key: 'comments', label: '댓글', goal: 300 },
];

export function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<AdminData | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const [d, m] = await Promise.all([api<AdminData>('/admin/data', { auth: true }), api<Metrics>('/admin/metrics', { auth: true })]);
      setData(d);
      setMetrics(m);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) navigate('/auth?next=%2Fadmin');
      else if (e instanceof ApiError && e.status === 403) navigate('/');
      else setNotice(e instanceof Error ? e.message : t('admin.loadFail'));
    } finally {
      setLoading(false);
    }
  }, [navigate, t]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => (session ? load() : navigate('/auth?next=%2Fadmin')));
  }, [load, navigate]);

  const act = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    setNotice('');
    try {
      await fn();
      await load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '처리 중 오류가 발생했습니다.');
    } finally {
      setBusy('');
    }
  };

  const reportPatch = (id: string, patch: Record<string, unknown>) =>
    act(`r-${id}`, () => api(`/admin/reports/${id}`, { method: 'PATCH', auth: true, body: patch }));
  const postPatch = (id: string, patch: Record<string, unknown>) =>
    act(`p-${id}`, () => api(`/admin/posts/${id}`, { method: 'PATCH', auth: true, body: patch }));

  const viewReceipt = async (id: string) => {
    try {
      const r = await api<{ url: string }>(`/admin/reports/${id}/receipt`, { auth: true });
      window.open(r.url, '_blank', 'noopener,noreferrer'); // 60-second signed URL, minted on demand
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '영수증을 불러오지 못했습니다.');
    }
  };

  const seed = async () => {
    if (!window.confirm('카탈로그 시드를 실행합니다. 제품·증상은 갱신되고 자가점검 카드는 교체됩니다. 계속할까요?')) return;
    await act('seed', async () => {
      const r = await api<{ counts: Record<string, number> }>('/admin/seed', { method: 'POST', auth: true });
      setNotice(`시드 완료: 제품 ${r.counts.products}, 증상 ${r.counts.symptoms}, 자가점검 ${r.counts.cards}, 기준가격 ${r.counts.reference_prices}`);
    });
  };

  if (loading) return <div className="text-center py-12" role="status"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" /><p className="mt-4 text-gray-600">{t('admin.loading')}</p></div>;
  if (!data) return <div className="text-center py-12"><p className="text-gray-600">{notice || t('admin.loadFail')}</p></div>;

  const k = metrics?.kpi ?? {};
  const num = (key: string) => Number(k[key] ?? 0);
  const unmapped = data.reports.filter((r) => !r.product_id);
  const pending = data.reports.filter((r) => r.product_id && r.verified_status === 'reported' && !r.hidden);
  const btn = 'px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50';
  const card = 'bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6';

  const stats = [
    { icon: Package, label: t('admin.productsTitle'), count: data.products.length },
    { icon: AlertCircle, label: t('admin.symptomsTitle'), count: data.symptoms.length },
    { icon: Database, label: t('admin.reportsTitle'), count: data.reports.length },
    { icon: MessageSquare, label: t('admin.communityTitle'), count: data.posts.length },
    { icon: Users, label: t('admin.profileStats'), count: data.users.length },
  ];

  return (
    <>
      <SEO title="관리자" noIndex />
      <div className="max-w-6xl mx-auto pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
          </div>
          <button onClick={seed} disabled={busy === 'seed'} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {busy === 'seed' ? t('admin.seeding') : t('admin.seed')}
          </button>
        </div>

        {notice && <p className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm" role="status">{notice}</p>}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
              <s.icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
              <div><p className="text-2xl font-bold text-gray-900">{s.count}</p><p className="text-xs text-gray-600">{s.label}</p></div>
            </div>
          ))}
        </div>

        <section className={card} aria-labelledby="kpi">
          <div className="flex items-center gap-2 mb-1"><BarChart3 className="w-5 h-5 text-blue-600" aria-hidden="true" /><h2 id="kpi" className="text-xl font-bold text-gray-900">90일 KPI 현황 (RFP 18)</h2></div>
          <p className="text-xs text-gray-500 mb-4">방문자·계산기·검색은 익명 세션 이벤트 기준(Do-Not-Track 사용자는 집계 제외). 7일 재방문율: 코호트 {num('returning_7d_cohort')}명 중 {k.returning_7d_pct ?? '—'}% (목표 10%)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {TARGETS.map((tg) => {
              const v = num(tg.key);
              const pct = Math.min(100, Math.round((v / tg.goal) * 100));
              return (
                <div key={tg.key}>
                  <div className="flex justify-between text-sm"><span>{tg.label}</span><span className="font-medium">{v.toLocaleString()} / {tg.goal.toLocaleString()}</span></div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-blue-500" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-700 mt-4">
            제보 퍼널: 시작 {num('submit_starts')} → 완료 {num('submit_done')}
            {num('submit_starts') > 0 && ` (${Math.round((num('submit_done') / num('submit_starts')) * 100)}%)`}
            {' · '}검색 {num('searches')}건 중 0건 {num('zero_result_searches')}건 · 견적 비교 {num('quote_checks')}회 · 미분류 제보 {num('reports_unmapped')}건
          </p>
        </section>

        <section className={card} aria-labelledby="camp">
          <h2 id="camp" className="text-xl font-bold text-gray-900 mb-1">블로그·캠페인 유입 (수집형 블로그 전환 조건)</h2>
          <p className="text-sm text-gray-700 mb-3">
            블로그 유입 세션 <strong>{num('blog_sessions')}</strong> (목표 월 500) · 블로그 경유 견적 비교 {num('blog_quote_checks')} · 블로그 경유 제보 완료 {num('blog_submit_done')} · 전체 캠페인 세션 {num('campaign_sessions')}
          </p>
          <p className="text-xs text-gray-500 mb-3">글 링크는 <code>node scripts/blog-link.mjs</code>로 만든 UTM 링크만 집계됩니다. 첫 유입 기준(세션 단위)입니다.</p>
          {metrics && metrics.campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500"><tr><th className="py-1 pr-3">출처</th><th className="py-1 pr-3">글(캠페인)</th><th className="py-1 pr-3">세션</th><th className="py-1 pr-3">견적 비교</th><th className="py-1">제보</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {metrics.campaigns.map((c) => (
                    <tr key={`${c.src}|${c.cmp}`}><td className="py-1 pr-3">{c.src}</td><td className="py-1 pr-3">{c.cmp || '—'}</td><td className="py-1 pr-3">{c.sessions}</td><td className="py-1 pr-3">{c.quote_checks}</td><td className="py-1">{c.submits}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-gray-500">아직 캠페인 유입이 없습니다.</p>}
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {([['검색 결과 0건 검색어', metrics?.top_zero_result_queries], ['모델 등록 요청', metrics?.top_requested_models], ['인기 검색어', metrics?.top_queries]] as const).map(([title, rows]) => (
            <section key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-3">{title}</h2>
              {rows && rows.length > 0 ? <ol className="text-sm space-y-1">{rows.slice(0, 10).map((r) => <li key={r.q} className="flex justify-between"><span className="truncate pr-2">{r.q}</span><span className="text-gray-500">{r.n}</span></li>)}</ol> : <p className="text-sm text-gray-500">아직 데이터가 없습니다.</p>}
            </section>
          ))}
        </div>

        <section className={card}>
          <h2 className="text-xl font-bold text-gray-900 mb-1">데이터 부족 제품 (가격 입력 제보 5건 미만)</h2>
          <p className="text-xs text-gray-500 mb-3">제보 유도(시딩·커뮤니티 공유)의 우선순위 목록입니다.</p>
          {metrics && metrics.thin_products.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {metrics.thin_products.map((p) => <div key={p.product_id} className="flex justify-between border-b border-gray-100 py-1"><span>{p.brand} {p.model_name}</span><span className="text-gray-500">제보 {p.n_reports} · 가격 {p.n_priced}</span></div>)}
            </div>
          ) : <p className="text-sm text-gray-500">모든 제품이 기준을 충족합니다.</p>}
        </section>

        <section className={card} aria-labelledby="rv">
          <h2 id="rv" className="text-xl font-bold text-gray-900 mb-1">수리비 제보 검토</h2>
          <p className="text-xs text-gray-500 mb-4">검토 대기 {pending.length}건 · 미등록 제품 {unmapped.length}건. 영수증은 60초짜리 비공개 링크로만 열립니다.</p>
          {data.reports.length === 0 && <p className="text-gray-500 text-center py-6">아직 제보가 없습니다.</p>}
          <div className="space-y-3">
            {data.reports.slice(0, 50).map((r) => (
              <div key={r.id} className={`p-4 border rounded-lg ${r.hidden || r.verified_status === 'rejected' ? 'bg-gray-50 opacity-70' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{r.product_id ? r.product_name : `미등록: ${r.custom_product}`} · {r.symptom_name}</p>
                    <p className="text-gray-600">{CHANNEL_LABEL[r.repair_channel] ?? r.repair_channel} · {formatMoney(r.paid_price, r.currency)} · {r.country} · {new Date(r.created_at).toLocaleDateString('ko-KR')}</p>
                    <p className="text-xs text-gray-500">상태: {r.verified_status}{r.hidden ? ' · 숨김' : ''}{r.has_receipt ? ' · 영수증 있음' : ''}</p>
                    {r.review_text && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{r.review_text}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    {r.has_receipt && <button className={btn} onClick={() => viewReceipt(r.id)}>영수증 보기</button>}
                    <button className={btn} disabled={busy === `r-${r.id}`} onClick={() => reportPatch(r.id, { verified_status: 'verified' })}>인증</button>
                    <button className={btn} disabled={busy === `r-${r.id}`} onClick={() => reportPatch(r.id, { verified_status: 'rejected' })}>반려</button>
                    <button className={btn} disabled={busy === `r-${r.id}`} onClick={() => reportPatch(r.id, { hidden: !r.hidden })}>{r.hidden ? '숨김 해제' : '숨김'}</button>
                    {!r.product_id && (
                      <select aria-label="제품 지정" className="px-2 py-1 text-sm border rounded-lg" defaultValue="" onChange={(e) => e.target.value && reportPatch(r.id, { product_id: e.target.value })}>
                        <option value="">제품 지정…</option>
                        {data.products.map((p) => <option key={p.id} value={p.id}>{p.brand} {p.model_name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.postsTitle')}</h2>
          {data.posts.length > 0 ? (
            <div className="space-y-3">
              {data.posts.slice(0, 25).map((p) => (
                <div key={p.id} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.type} · {p.status} · hidden: {String(p.hidden)} · verified: {String(p.verified)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className={btn} onClick={() => postPatch(p.id, { hidden: !p.hidden })}>{p.hidden ? t('admin.show') : t('admin.hide')}</button>
                    <button className={btn} onClick={() => postPatch(p.id, { verified: !p.verified })}>{p.verified ? t('admin.unverify') : t('admin.verify')}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-center py-6">아직 게시글이 없습니다.</p>}
        </section>

        <section className={card}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.productsTitle')} ({data.products.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['카테고리', '브랜드', '모델명', '출시'].map((h) => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-200">{data.products.map((p) => <tr key={p.id}><td className="px-3 py-2">{p.category}</td><td className="px-3 py-2">{p.brand}</td><td className="px-3 py-2">{p.model_name}</td><td className="px-3 py-2">{p.release_year}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
