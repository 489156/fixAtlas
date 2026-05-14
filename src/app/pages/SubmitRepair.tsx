import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE, supabase } from '../../lib/supabase';
import { SEO } from '../components/SEO';

interface Product {
  id: string;
  category: string;
  brand: string;
  model_name: string;
}

interface Symptom {
  id: string;
  name_ko: string;
  name_en: string;
}

export function SubmitRepair() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    country: '한국',
    city: '',
    product_id: '',
    symptom_id: '',
    repair_channel: 'official',
    quoted_price: '',
    paid_price: '',
    currency: 'KRW',
    repair_item: '',
    resolved_status: 'resolved',
    review_text: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, symptomsRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/symptoms`),
      ]);
      const productsData = await productsRes.json();
      const symptomsData = await symptomsRes.json();
      setProducts(productsData.products || []);
      setSymptoms(symptomsData.symptoms || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert('수리비를 제보하려면 먼저 로그인해야 합니다.');
        navigate('/auth');
        return;
      }

      let receipt_image_url = '';
      if (receiptFile) {
        const path = `${session.user.id}/${crypto.randomUUID()}-${receiptFile.name.replace(/[^\w.-]+/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('receipts').upload(path, receiptFile, {
          upsert: false,
        });
        if (upErr) {
          console.error(upErr);
          alert(upErr.message);
          return;
        }
        const { data: signed, error: signErr } = await supabase.storage.from('receipts').createSignedUrl(path, 60 * 60 * 24 * 365);
        if (signErr) {
          console.error(signErr);
          alert(signErr.message);
          return;
        }
        receipt_image_url = signed?.signedUrl ?? path;
      }

      const response = await fetch(`${API_BASE}/repair-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          quoted_price: parseFloat(formData.quoted_price) || 0,
          paid_price: parseFloat(formData.paid_price) || 0,
          receipt_image_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(data.error || '제보 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('제보 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'robot-vacuum') return '로봇청소기';
    if (category === 'cordless-vacuum') return '무선청소기';
    return category;
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="수리비 제보 완료"
          description="제품 수리비와 AS 경험을 제보하여 다른 사용자에게 도움을 주세요"
        />
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('submit.successTitle')}</h2>
            <p className="text-gray-600 mb-6">
              {t('submit.successBody')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('submit.home')}
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setReceiptFile(null);
                  setFormData({
                    country: '한국',
                    city: '',
                    product_id: '',
                    symptom_id: '',
                    repair_channel: 'official',
                    quoted_price: '',
                    paid_price: '',
                    currency: 'KRW',
                    repair_item: '',
                    resolved_status: 'resolved',
                    review_text: '',
                  });
                }}
                className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('submit.again')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="수리비 제보"
        description="제품 수리비와 AS 경험을 제보하여 다른 사용자에게 도움을 주세요"
      />
      <div className="max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('submit.title')}</h1>
        <p className="text-gray-600 mb-8">
          {t('submit.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              국가 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="한국">한국</option>
              <option value="미국">미국</option>
              <option value="중국">중국</option>
              <option value="일본">일본</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">도시</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="예: 서울"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제품 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">제품을 선택하세요</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {getCategoryLabel(product.category)} - {product.brand} {product.model_name}
                </option>
              ))}
            </select>
          </div>

          {/* Symptom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증상 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.symptom_id}
              onChange={(e) => setFormData({ ...formData, symptom_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">증상을 선택하세요</option>
              {symptoms.map((symptom) => (
                <option key={symptom.id} value={symptom.id}>
                  {symptom.name_ko} ({symptom.name_en})
                </option>
              ))}
            </select>
          </div>

          {/* Repair Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수리경로 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.repair_channel}
              onChange={(e) => setFormData({ ...formData, repair_channel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="official">공식 AS</option>
              <option value="third_party">사설 수리점</option>
              <option value="self_check">자가조치</option>
            </select>
          </div>

          {/* Prices */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">견적금액</label>
              <input
                type="number"
                value={formData.quoted_price}
                onChange={(e) => setFormData({ ...formData, quoted_price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">실제 결제금액</label>
              <input
                type="number"
                value={formData.paid_price}
                onChange={(e) => setFormData({ ...formData, paid_price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              통화 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="KRW">KRW (원)</option>
              <option value="USD">USD ($)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* Repair Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">수리항목</label>
            <input
              type="text"
              value={formData.repair_item}
              onChange={(e) => setFormData({ ...formData, repair_item: e.target.value })}
              placeholder="예: 배터리 교체, 모터 수리"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Resolved Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              해결 여부 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.resolved_status}
              onChange={(e) => setFormData({ ...formData, resolved_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="resolved">해결</option>
              <option value="unresolved">미해결</option>
              <option value="recurred">재발</option>
            </select>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">후기</label>
            <textarea
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              placeholder="수리 경험을 공유해주세요 (200~500자)"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('submit.receiptLabel')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('submit.receiptHint')}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-800 mb-1">{t('submit.privacyTitle')}</p>
            <p className="text-sm text-gray-600">
              {t('submit.privacyBody')}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? t('submit.submitting') : t('submit.submit')}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
