import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { CheckCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { api, ApiError } from '../../lib/api';
import { categoryLabel } from '../../lib/format';
import { loadDraft, saveDraft, clearDraft } from '../../lib/draft';
import { track } from '../../lib/analytics';
import { SEO } from '../components/SEO';

interface Product { id: string; slug: string; category: string; brand: string; model_name: string }
interface Symptom { id: string; name_ko: string; name_en: string; categories: string[] }

const DRAFT_KEY = 'report';
const CUSTOM = '__custom__';
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const RECEIPT_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic' };

const EMPTY = {
  country: '한국', city: '', product_id: '', custom_product: '', symptom_id: '', repair_channel: 'official',
  quoted_price: '', paid_price: '', currency: 'KRW', repair_item: '', resolved_status: 'resolved',
  review_text: '', purchase_year: '', error_code: '', privacy_consent: false,
};
type Form = typeof EMPTY;

interface Summary { similar_count: number; position: { band: string; percentile: number; message: string } | null }

export function SubmitRepair() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ summary: Summary; productSlug: string | null; custom: boolean } | null>(null);
  const started = useRef(false);
  const hydrated = useRef(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    if (!started.current) { started.current = true; track('submit_start', { from: params.get('product') ? 'product' : 'form' }); }
    setForm((f) => ({ ...f, [k]: v }));
  };

  // Load catalog, then apply (a) URL prefill, else (b) a draft saved before a login redirect.
  useEffect(() => {
    Promise.all([api<{ products: Product[] }>('/products'), api<{ symptoms: Symptom[] }>('/symptoms')])
      .then(([p, s]) => {
        setProducts(p.products ?? []);
        setSymptoms(s.symptoms ?? []);
        const slug = params.get('product');
        const model = params.get('model');
        const symptom = params.get('symptom');
        const match = slug ? (p.products ?? []).find((x) => x.slug === slug || x.id === slug) : null;
        const draft = loadDraft<Form>(DRAFT_KEY);
        if (match || model || symptom) {
          setForm((f) => ({
            ...f,
            product_id: match ? match.id : model ? CUSTOM : '',
            custom_product: model ?? '',
            symptom_id: symptom ?? '',
          }));
        } else if (draft) {
          setForm({ ...EMPTY, ...draft, privacy_consent: false });
        }
        hydrated.current = true;
      })
      .catch(() => setErrors(['제품·증상 목록을 불러오지 못했습니다. 새로고침해 주세요.']));
  }, []);

  // Keep the draft up to date (never the receipt file, never the consent flag).
  useEffect(() => {
    if (!hydrated.current || done) return;
    saveDraft(DRAFT_KEY, { ...form, privacy_consent: false });
  }, [form, done]);

  const chosenProduct = products.find((p) => p.id === form.product_id) ?? null;
  const visibleSymptoms = symptoms.filter((s) => !chosenProduct || !s.categories?.length || s.categories.includes(chosenProduct.category));
  const byCategory = (cat: string) => products.filter((p) => p.category === cat);

  const validate = (): string[] => {
    const e: string[] = [];
    if (!form.product_id) e.push('제품을 선택해 주세요. 목록에 없으면 "직접 입력"을 선택하세요.');
    if (form.product_id === CUSTOM && !form.custom_product.trim()) e.push('제품명(브랜드+모델)을 입력해 주세요.');
    if (!form.symptom_id) e.push('증상을 선택해 주세요.');
    const price = (v: string) => (v === '' ? null : Number(v));
    for (const [label, v] of [['견적금액', price(form.quoted_price)], ['실제 결제금액', price(form.paid_price)]] as const) {
      if (v !== null && (!Number.isFinite(v) || v < 0)) e.push(`${label}은 0 이상의 숫자여야 합니다.`);
      if (form.currency === 'KRW' && v !== null && v > 0 && v < 1000) e.push(`${label}을 원 단위로 입력해 주세요. (예: 13만원 → 130000)`);
    }
    if (receiptFile) {
      if (!RECEIPT_TYPES[receiptFile.type]) e.push('영수증은 JPG, PNG, WebP, HEIC 이미지만 올릴 수 있습니다.');
      if (receiptFile.size > MAX_RECEIPT_BYTES) e.push('영수증 이미지는 5MB 이하여야 합니다.');
    }
    if (!form.privacy_consent) e.push('개인정보 수집·이용에 동의해 주세요.');
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const problems = validate();
    setErrors(problems);
    if (problems.length) return window.scrollTo({ top: 0, behavior: 'smooth' });

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Deferred login: keep everything the user typed, come back here afterwards.
        saveDraft(DRAFT_KEY, { ...form, privacy_consent: false });
        track('login_prompt', { from: 'submit_repair' });
        navigate('/auth?next=%2Fsubmit-repair');
        return;
      }

      let receipt_path = '';
      if (receiptFile) {
        const ext = RECEIPT_TYPES[receiptFile.type];
        receipt_path = `${session.user.id}/${crypto.randomUUID()}.${ext}`; // never reuse the original file name
        const { error: upErr } = await supabase.storage.from('receipts').upload(receipt_path, receiptFile, { upsert: false, contentType: receiptFile.type });
        if (upErr) throw new Error(`영수증 업로드에 실패했습니다: ${upErr.message}`);
      }

      const isCustom = form.product_id === CUSTOM;
      const res = await api<{ summary: Summary }>('/repair-reports', {
        method: 'POST',
        auth: true,
        body: {
          ...form,
          product_id: isCustom ? '' : form.product_id,
          custom_product: isCustom ? form.custom_product.trim() : '',
          quoted_price: form.quoted_price === '' ? null : Number(form.quoted_price),
          paid_price: form.paid_price === '' ? null : Number(form.paid_price),
          purchase_year: form.purchase_year === '' ? null : Number(form.purchase_year),
          receipt_path,
          privacy_consent: true,
        },
      });
      clearDraft(DRAFT_KEY);
      track('submit_done', { custom: isCustom, has_price: form.paid_price !== '' });
      setDone({ summary: res.summary, productSlug: chosenProduct?.slug ?? null, custom: isCustom });
      window.scrollTo({ top: 0 });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        saveDraft(DRAFT_KEY, { ...form, privacy_consent: false });
        navigate('/auth?next=%2Fsubmit-repair');
        return;
      }
      setErrors([err instanceof Error ? err.message : '제보 제출 중 오류가 발생했습니다.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const { summary } = done;
    return (
      <>
        <SEO title="수리비 제보 완료" noIndex />
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('submit.successTitle')}</h1>
            <p className="text-gray-600 mb-2">{t('submit.successBody')}</p>
            {done.custom ? (
              <p className="text-sm text-gray-700 mb-6">목록에 없는 모델이라 운영자가 제품을 확인·등록한 뒤 공개됩니다.</p>
            ) : (
              <p className="text-sm text-gray-700 mb-6" role="status">
                같은 모델·증상의 다른 제보는 현재 <strong>{summary.similar_count}건</strong>입니다.{' '}
                {summary.position ? summary.position.message : summary.similar_count < 5 ? '비교하려면 최소 5건이 필요해 아직 위치를 계산하지 않았습니다.' : ''}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              {done.productSlug && (
                <Link to={`/products/${chosenProduct?.category}/${done.productSlug}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">이 제품 제보 보기</Link>
              )}
              <button onClick={() => { setDone(null); setForm(EMPTY); setReceiptFile(null); started.current = false; }} className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                {t('submit.again')}
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">{t('submit.home')}</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const field = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none';
  const label = 'block text-sm font-medium text-gray-700 mb-2';
  const thisYear = new Date().getFullYear();

  return (
    <>
      <SEO title="수리비 제보" description="제품 수리비와 AS 경험을 제보하여 다른 사용자에게 도움을 주세요" />
      <div className="max-w-3xl mx-auto pb-24 md:pb-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('submit.title')}</h1>
          <p className="text-gray-600 mb-4">{t('submit.subtitle')}</p>
          <p className="flex gap-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            먼저 내용을 모두 입력하세요. 제출할 때만 로그인(이메일 링크)이 필요하고, 입력한 내용은 로그인 후에도 그대로 남아 있습니다.
          </p>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg" role="alert">
              <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="country" className={label}>국가 <span className="text-red-500">*</span></label>
                <select id="country" value={form.country} onChange={(e) => set('country', e.target.value)} className={field}>
                  {['한국', '미국', '중국', '일본', '기타'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="city" className={label}>도시</label>
                <input id="city" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="예: 서울" maxLength={100} className={field} />
              </div>
            </div>

            <div>
              <label htmlFor="product" className={label}>제품 <span className="text-red-500">*</span></label>
              <select id="product" value={form.product_id} onChange={(e) => set('product_id', e.target.value)} className={field}>
                <option value="">제품을 선택하세요</option>
                {['robot-vacuum', 'cordless-vacuum'].map((cat) => (
                  <optgroup key={cat} label={categoryLabel(cat)}>
                    {byCategory(cat).map((p) => <option key={p.id} value={p.id}>{p.brand} {p.model_name}</option>)}
                  </optgroup>
                ))}
                <option value={CUSTOM}>목록에 없는 제품 (직접 입력)</option>
              </select>
              {form.product_id === CUSTOM && (
                <div className="mt-3">
                  <label htmlFor="custom" className="sr-only">제품명</label>
                  <input id="custom" value={form.custom_product} onChange={(e) => set('custom_product', e.target.value)} placeholder="브랜드 + 모델명 (예: 로보락 S9 MaxV Ultra)" maxLength={100} className={field} />
                  <p className="text-xs text-gray-500 mt-1">운영자가 확인해 제품으로 등록한 뒤 공개됩니다.</p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="symptom" className={label}>증상 <span className="text-red-500">*</span></label>
                <select id="symptom" value={form.symptom_id} onChange={(e) => set('symptom_id', e.target.value)} className={field}>
                  <option value="">증상을 선택하세요</option>
                  {visibleSymptoms.map((s) => <option key={s.id} value={s.id}>{s.name_ko} ({s.name_en})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="err" className={label}>에러코드</label>
                <input id="err" value={form.error_code} onChange={(e) => set('error_code', e.target.value)} placeholder="예: Error 13" maxLength={50} className={field} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="channel" className={label}>수리경로 <span className="text-red-500">*</span></label>
                <select id="channel" value={form.repair_channel} onChange={(e) => set('repair_channel', e.target.value)} className={field}>
                  <option value="official">공식 AS</option>
                  <option value="third_party">사설 수리점</option>
                  <option value="self_check">자가조치</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className={label}>구매연도</label>
                <select id="year" value={form.purchase_year} onChange={(e) => set('purchase_year', e.target.value)} className={field}>
                  <option value="">모름</option>
                  {Array.from({ length: 12 }, (_, i) => thisYear - i).map((y) => <option key={y} value={y}>{y}년</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="quoted" className={label}>견적금액</label>
                <input id="quoted" type="number" inputMode="numeric" min={0} value={form.quoted_price} onChange={(e) => set('quoted_price', e.target.value)} placeholder="모르면 비워두세요" className={field} />
              </div>
              <div>
                <label htmlFor="paid" className={label}>실제 결제금액</label>
                <input id="paid" type="number" inputMode="numeric" min={0} value={form.paid_price} onChange={(e) => set('paid_price', e.target.value)} placeholder="무료였다면 0" className={field} />
              </div>
              <div>
                <label htmlFor="currency" className={label}>통화 <span className="text-red-500">*</span></label>
                <select id="currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} className={field}>
                  {[['KRW', 'KRW (원)'], ['USD', 'USD ($)'], ['CNY', 'CNY (¥)'], ['JPY', 'JPY (¥)'], ['EUR', 'EUR (€)']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 -mt-3">금액을 비워 두면 "모름"으로 처리되어 통계에서 제외됩니다. 0원은 실제로 무료였을 때만 입력하세요.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="item" className={label}>수리항목</label>
                <input id="item" value={form.repair_item} onChange={(e) => set('repair_item', e.target.value)} placeholder="예: 배터리 교체, 모터 수리" maxLength={200} className={field} />
              </div>
              <div>
                <label htmlFor="resolved" className={label}>해결 여부 <span className="text-red-500">*</span></label>
                <select id="resolved" value={form.resolved_status} onChange={(e) => set('resolved_status', e.target.value)} className={field}>
                  <option value="resolved">해결</option>
                  <option value="unresolved">미해결</option>
                  <option value="recurred">재발</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="review" className={label}>후기</label>
              <textarea id="review" value={form.review_text} onChange={(e) => set('review_text', e.target.value)} placeholder="수리 경험을 사실 위주로 적어 주세요 (200~500자 권장)" rows={4} maxLength={2000} className={field} />
              <p className="text-xs text-gray-500 mt-1">{t('layout.reviewNotice')}</p>
            </div>

            <div>
              <label htmlFor="receipt" className={label}>{t('submit.receiptLabel')}</label>
              <p className="text-xs text-gray-500 mb-2">{t('submit.receiptHint')}</p>
              <input id="receipt" type="file" accept={Object.keys(RECEIPT_TYPES).join(',')} onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)} className="w-full text-sm" />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800 mb-1">{t('submit.privacyTitle')}</p>
              <p className="text-sm text-gray-600 mb-3">{t('submit.privacyBody')}</p>
              <label className="flex items-start gap-2 text-sm text-gray-800">
                <input type="checkbox" checked={form.privacy_consent} onChange={(e) => set('privacy_consent', e.target.checked)} className="mt-1 w-4 h-4" />
                <span>위 내용을 확인했으며 개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span></span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
              {loading ? t('submit.submitting') : t('submit.submit')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
