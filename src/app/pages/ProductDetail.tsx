import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Package, AlertTriangle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../../lib/supabase';
import { AffiliateSlot } from '../components/AffiliateSlot';
import { SEO } from '../components/SEO';

interface Product {
  id: string;
  category: string;
  brand: string;
  model_name: string;
  alternate_names: string[];
  release_year: number;
  description: string;
}

interface RepairReport {
  id: string;
  symptom_id: string;
  paid_price: number;
  currency: string;
  repair_channel: string;
  resolved_status: string;
  review_text: string;
  created_at: string;
}

interface Symptom {
  id: string;
  name_ko: string;
  name_en: string;
  risk_level: string;
  self_check_allowed: boolean;
}

interface SelfCheckCard {
  id: string;
  product_id: string;
  symptom_id: string | null;
  title_ko: string;
  body_ko: string;
  sort_order: number;
}

export function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [reports, setReports] = useState<RepairReport[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selfCheckCards, setSelfCheckCards] = useState<SelfCheckCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      const data = await response.json();
      setProduct(data.product);
      setReports(data.reports || []);
      setSymptoms(data.symptoms || []);
      setSelfCheckCards(data.self_check_cards || []);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'robot-vacuum') return t('product.categoryRobot');
    if (category === 'cordless-vacuum') return t('product.categoryCordless');
    return category;
  };

  const getRepairChannelLabel = (channel: string) => {
    if (channel === 'official') return t('product.channelOfficial');
    if (channel === 'third_party') return t('product.channelThird');
    if (channel === 'self_check') return t('product.channelSelf');
    return channel;
  };

  const getResolvedStatusLabel = (status: string) => {
    if (status === 'resolved') return t('product.statusResolved');
    if (status === 'unresolved') return t('product.statusUnresolved');
    if (status === 'recurred') return t('product.statusRecurred');
    return status;
  };

  const getResolvedStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'unresolved') return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const getRiskLevelBadge = (level: string) => {
    if (level === 'safe') return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{t('product.riskSafe')}</span>;
    if (level === 'caution') return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">{t('product.riskCaution')}</span>;
    if (level === 'expert') return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">{t('product.riskExpert')}</span>;
    if (level === 'dangerous') return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{t('product.riskDanger')}</span>;
    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('product.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('product.notFound')}</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('product.backHome')}
        </Link>
      </div>
    );
  }

  const symptomStats = reports.reduce((acc: Record<string, { count: number; prices: number[]; resolved: number }>, report) => {
    const key = report.symptom_id;
    if (!acc[key]) {
      acc[key] = { count: 0, prices: [], resolved: 0 };
    }
    acc[key].count++;
    if (report.paid_price > 0) {
      acc[key].prices.push(report.paid_price);
    }
    if (report.resolved_status === 'resolved') {
      acc[key].resolved++;
    }
    return acc;
  }, {});

  return (
    <>
      <SEO
        title={product ? `${product.brand} ${product.model_name}` : '제품 상세'}
        description={product ? `${product.brand} ${product.model_name}의 고장 증상, 수리비 범위, 해결률 정보` : '제품 상세 정보'}
      />
      <div className="max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{getCategoryLabel(product.category)}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.brand} {product.model_name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
            {product.alternate_names && product.alternate_names.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {product.alternate_names.join(', ')}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">{t('product.releaseYear', { year: product.release_year })}</p>
            <div className="mt-4">
              <AffiliateSlot productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {selfCheckCards.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('product.selfCheckTitle')}</h2>
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mb-4">{t('product.selfCheckDisclaimer')}</p>
          <ul className="space-y-4">
            {selfCheckCards.map((card) => (
              <li key={card.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-900">{card.title_ko}</p>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{card.body_ko}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t('product.symptomsTitle')}</h2>
        </div>
        {Object.keys(symptomStats).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(symptomStats).map(([symptomId, stats]) => {
              const symptom = symptoms.find(s => s.id === symptomId);
              if (!symptom) return null;

              const minPrice = stats.prices.length > 0 ? Math.min(...stats.prices) : 0;
              const maxPrice = stats.prices.length > 0 ? Math.max(...stats.prices) : 0;
              const resolveRate = stats.count > 0 ? Math.round((stats.resolved / stats.count) * 100) : 0;

              const sample = reports.find(r => r.symptom_id === symptomId);
              const cur = sample?.currency ?? 'KRW';
              return (
                <div key={symptomId} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{symptom.name_ko}</h3>
                        {getRiskLevelBadge(symptom.risk_level)}
                      </div>
                      <p className="text-sm text-gray-500">{symptom.name_en}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{t('product.reportCount')}</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.count}</p>
                    </div>
                  </div>
                  {stats.prices.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">{t('product.priceRange')}</p>
                        <p className="font-medium text-gray-900">
                          {minPrice.toLocaleString()} ~ {maxPrice.toLocaleString()}{' '}
                          {cur === 'KRW' ? '원' : cur}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('product.resolveRate')}</p>
                        <p className="font-medium text-gray-900">{resolveRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{t('product.noStats')}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t('product.noStatsHint')}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('product.reportsTitle')}</h2>
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.slice(0, 10).map((report) => {
              const symptom = symptoms.find(s => s.id === report.symptom_id);
              return (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{symptom?.name_ko || report.symptom_id}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {getRepairChannelLabel(report.repair_channel)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {report.paid_price.toLocaleString()} {report.currency}
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {getResolvedStatusIcon(report.resolved_status)}
                        <span className="text-sm text-gray-600">
                          {getResolvedStatusLabel(report.resolved_status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {report.review_text && (
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                      {report.review_text}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(report.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{t('product.noReports')}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/submit-repair"
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          {t('product.ctaSubmit')}
        </Link>
        <Link
          to="/calculator"
          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          {t('product.ctaCalculator')}
        </Link>
      </div>
    </div>
    </>
  );
}
