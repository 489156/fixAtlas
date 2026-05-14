import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../../lib/supabase';
import { SEO } from '../components/SEO';

interface RepairReport {
  id: string;
  product_id: string;
  symptom_id: string;
  country: string;
  paid_price: number;
  currency: string;
  created_at: string;
}

export function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReports, setRecentReports] = useState<RepairReport[]>([]);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const response = await fetch(`${API_BASE}/repair-reports`);
      const data = await response.json();
      if (data.reports) {
        setRecentReports(data.reports.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <SEO
        title={t('home.heroTitle1')}
        description={t('home.heroSubtitle')}
      />
      <div className="max-w-6xl mx-auto space-y-12 pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {t('home.heroTitle1')}
          <br />
          {t('home.heroTitle2')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('home.heroSubtitle')}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
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

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <Link
            to="/submit-repair"
            className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t('home.ctaSubmit')}
          </Link>
          <Link
            to="/calculator"
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('home.ctaCalculator')}
          </Link>
        </div>
      </section>

      {/* Popular Symptoms */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t('home.popularTitle')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { ko: '충전 안 됨', en: 'not_charging' },
            { ko: '흡입력 약함', en: 'weak_suction' },
            { ko: '배터리 빨리 닳음', en: 'battery_drain' },
            { ko: '도크 오류', en: 'dock_error' },
            { ko: '센서 오류', en: 'sensor_error' },
          ].map((symptom) => (
            <Link
              key={symptom.en}
              to={`/search?q=${encodeURIComponent(symptom.ko)}`}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <p className="font-medium text-gray-900">{symptom.ko}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Reports */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t('home.recentTitle')}</h2>
        </div>
        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">제품 ID: {report.product_id}</p>
                    <p className="text-sm text-gray-600 mt-1">증상 ID: {report.symptom_id}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(report.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {report.paid_price.toLocaleString()} {report.currency}
                    </p>
                    <p className="text-xs text-gray-500">{report.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('home.noReports')}</p>
            <Link
              to="/submit-repair"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('home.firstReport')}
            </Link>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('home.flowTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">{t('home.flow1Title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('home.flow1Body')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">{t('home.flow2Title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('home.flow2Body')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">{t('home.flow3Title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('home.flow3Body')}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('home.bannerTitle')}</h2>
        <p className="mb-6 text-blue-100">
          {t('home.bannerBody')}
        </p>
        <Link
          to="/submit-repair"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          {t('home.bannerCta')}
        </Link>
      </section>
    </div>
    </>
  );
}
