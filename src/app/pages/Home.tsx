import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { track } from '../../lib/analytics';
import { SEO } from '../components/SEO';

interface RecentReport {
  id: string;
  product_name: string;
  symptom_name: string;
  paid_price: number | null;
  currency: string;
  country: string;
  created_at: string;
}

// Head-of-funnel shortcuts. Symptom list follows the Korea Consumer Agency complaint mix
// (sensor / won't run / extra functions / leakage) plus the RFP's core symptoms.
const POPULAR_SYMPTOMS = ['충전 안 됨', '흡입력 약함', '배터리 빨리 닳음', '도크 오류', '센서 오류', '누수', '전원 안 켜짐·멈춤', '앱 연결 안 됨', '에러코드 발생', '물걸레 작동 안 됨'];
const BRANDS = ['로보락', '드리미', '에코백스', '삼성', 'LG', '다이슨'];

export function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);

  useEffect(() => {
    api<{ reports: RecentReport[] }>('/repair-reports?limit=5')
      .then((d) => setRecentReports(d.reports ?? []))
      .catch(() => setRecentReports([]));
  }, []);

  const goSearch = (q: string) => {
    const query = q.trim();
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    goSearch(searchQuery);
  };

  return (
    <>
      <SEO title={t('home.heroTitle1')} description={t('home.heroSubtitle')} />
      <div className="max-w-6xl mx-auto space-y-12 pb-24 md:pb-8">
        <section className="text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t('home.heroTitle1')}
            <br />
            {t('home.heroTitle2')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('home.heroSubtitle')}</p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto" role="search">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                aria-label={t('home.searchCta')}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('home.searchCta')}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 justify-center" aria-label="브랜드 바로가기">
            {BRANDS.map((b) => (
              <Link key={b} to={`/search?q=${encodeURIComponent(b)}`} className="px-3 py-1 text-sm border border-gray-300 rounded-full bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600">
                {b}
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-2">
            <Link to="/submit-repair" className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              {t('home.ctaSubmit')}
            </Link>
            <Link to="/calculator" className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              {t('home.ctaCalculator')}
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900">{t('home.popularTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {POPULAR_SYMPTOMS.map((name) => (
              <Link
                key={name}
                to={`/search?q=${encodeURIComponent(name)}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="font-medium text-gray-900">{name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-blue-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900">{t('home.recentTitle')}</h2>
          </div>
          {recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{report.product_name}</p>
                      <p className="text-sm text-gray-600 mt-1">{report.symptom_name}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(report.created_at).toLocaleDateString('ko-KR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{formatMoney(report.paid_price, report.currency)}</p>
                      <p className="text-xs text-gray-500">{report.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('home.noReports')}</p>
              <Link to="/submit-repair" onClick={() => track('submit_start', { from: 'home_empty' })} className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {t('home.firstReport')}
              </Link>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('home.flowTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{n}</div>
                <h3 className="font-bold text-lg mb-2">{t(`home.flow${n}Title`)}</h3>
                <p className="text-gray-600 text-sm">{t(`home.flow${n}Body`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('home.bannerTitle')}</h2>
          <p className="mb-6 text-blue-100">{t('home.bannerBody')}</p>
          <Link to="/submit-repair" className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            {t('home.bannerCta')}
          </Link>
        </section>
      </div>
    </>
  );
}
