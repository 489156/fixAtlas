import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Settings, Package, AlertCircle, MessageSquare, Users, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE, supabase } from '../../lib/supabase';

interface AdminData {
  products: Record<string, unknown>[];
  symptoms: Record<string, unknown>[];
  reports: Record<string, unknown>[];
  posts: Record<string, unknown>[];
  users: Record<string, unknown>[];
}

export function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        alert(t('admin.needLogin'));
        navigate('/auth');
        return;
      }
      fetchAdminData(session.access_token);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/auth');
    }
  };

  const fetchAdminData = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/data`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const adminData = await response.json();
        setData(adminData);
      } else {
        const errorData = await response.json();
        alert(errorData.error || t('admin.loadFail'));
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('초기 데이터를 생성하시겠습니까? 이미 데이터가 있다면 중복될 수 있습니다.')) {
      return;
    }

    setSeeding(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        alert(t('admin.needLogin'));
        return;
      }

      const response = await fetch(`${API_BASE}/admin/seed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert('초기 데이터가 생성되었습니다.');
        fetchAdminData(session.access_token);
      } else {
        alert(result.error || '데이터 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Seed error:', error);
      alert('데이터 생성 중 오류가 발생했습니다.');
    } finally {
      setSeeding(false);
    }
  };

  const moderatePost = async (postId: string, patch: { hidden?: boolean; verified?: boolean }) => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return;
    const response = await fetch(`${API_BASE}/admin/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(patch),
    });
    if (response.ok) {
      fetchAdminData(session.access_token);
    } else {
      const err = await response.json().catch(() => ({}));
      alert(err.error || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('admin.loading')}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('admin.loadFail')}</p>
      </div>
    );
  }

  const stats = [
    { icon: Package, label: t('admin.productsTitle'), count: data.products.length, iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
    { icon: AlertCircle, label: t('admin.symptomsTitle'), count: data.symptoms.length, iconBg: 'bg-yellow-100', iconText: 'text-yellow-600' },
    { icon: Database, label: t('admin.reportsTitle'), count: data.reports.length, iconBg: 'bg-green-100', iconText: 'text-green-600' },
    { icon: MessageSquare, label: t('admin.communityTitle'), count: data.posts.length, iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
    { icon: Users, label: t('admin.profileStats'), count: data.users.length, iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
        </div>
        <button
          onClick={handleSeedData}
          disabled={seeding}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {seeding ? t('admin.seeding') : t('admin.seed')}
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconText}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.postsTitle')}</h2>
        {data.posts.length > 0 ? (
          <div className="space-y-3">
            {data.posts.slice(0, 25).map((post) => (
              <div key={String(post.id)} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{String(post.title)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    hidden: {String(post.hidden)} · verified: {String(post.verified)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moderatePost(String(post.id), { hidden: !post.hidden })}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    {post.hidden ? t('admin.show') : t('admin.hide')}
                  </button>
                  <button
                    type="button"
                    onClick={() => moderatePost(String(post.id), { verified: !post.verified })}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    {post.verified ? t('admin.unverify') : t('admin.verify')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">—</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.productsTitle')}</h2>
        {data.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">카테고리</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">브랜드</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">모델명</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">출시년도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={String(product.id)} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{String(product.category)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{String(product.brand)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{String(product.model_name)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{String(product.release_year)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">아직 제품이 없습니다.</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.symptomsTitle')}</h2>
        {data.symptoms.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {data.symptoms.map((symptom) => (
              <div key={String(symptom.id)} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">{String(symptom.name_ko)}</p>
                <p className="text-sm text-gray-600">{String(symptom.name_en)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    symptom.risk_level === 'safe' ? 'bg-green-100 text-green-700' :
                    symptom.risk_level === 'caution' ? 'bg-yellow-100 text-yellow-700' :
                    symptom.risk_level === 'expert' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {String(symptom.risk_level)}
                  </span>
                  {symptom.self_check_allowed && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      자가점검 가능
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">아직 증상이 없습니다.</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.reportsTitle')}</h2>
        {data.reports.length > 0 ? (
          <div className="space-y-3">
            {data.reports.slice(0, 10).map((report) => (
              <div key={String(report.id)} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">제품: {String(report.product_id)}</p>
                    <p className="text-sm text-gray-600">증상: {String(report.symptom_id)}</p>
                    <p className="text-sm text-gray-600">경로: {String(report.repair_channel)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {Number(report.paid_price).toLocaleString()} {String(report.currency)}
                    </p>
                    <p className="text-xs text-gray-500">{String(report.country)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">아직 제보가 없습니다.</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.communityTitle')}</h2>
        {data.posts.length > 0 ? (
          <div className="space-y-3">
            {data.posts.slice(0, 10).map((post) => (
              <div key={`recent-${String(post.id)}`} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">{String(post.title)}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{String(post.body)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">{String(post.type)}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{String(post.status)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">아직 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
