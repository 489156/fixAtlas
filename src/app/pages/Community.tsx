import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MessageSquare, PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../../lib/supabase';
import { SEO } from '../components/SEO';

interface CommunityPost {
  id: string;
  type: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
  product_id: string;
  symptom_id: string;
}

export function Community() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? `${API_BASE}/community`
        : `${API_BASE}/community?type=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    if (type === 'question') return '질문';
    if (type === 'report') return '수리비 제보';
    if (type === 'solved') return '해결후기';
    if (type === 'repair_or_replace') return '수리 vs 교체 고민';
    return type;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      question: 'bg-blue-100 text-blue-700',
      report: 'bg-green-100 text-green-700',
      solved: 'bg-purple-100 text-purple-700',
      repair_or_replace: 'bg-yellow-100 text-yellow-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'solved') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'open') return <Clock className="w-5 h-5 text-gray-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'solved') return '해결';
    if (status === 'open') return '질문중';
    if (status === 'unresolved') return '미해결';
    return status;
  };

  return (
    <>
      <SEO
        title="커뮤니티"
        description="제품 고장, 수리비, AS 후기에 대한 질문과 해결후기를 공유하는 커뮤니티"
      />
      <div className="max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('community.title')}</h1>
        </div>
        <Link
          to="/community/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          {t('community.newPost')}
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: t('community.filterAll') },
          { value: 'question', label: t('community.filterQuestion') },
          { value: 'solved', label: t('community.filterSolved') },
          { value: 'report', label: t('community.filterReport') },
          { value: 'repair_or_replace', label: t('community.filterRor') },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('community.loading')}</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                  {getStatusIcon(post.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${getTypeBadge(post.type)}`}>
                      {getTypeLabel(post.type)}
                    </span>
                    <span className="text-xs text-gray-500">{getStatusLabel(post.status)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.body}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                    {post.product_id && <span>제품 ID: {post.product_id}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{t('community.empty')}</p>
          <Link
            to="/community/new"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('community.firstPost')}
          </Link>
        </div>
      )}
    </div>
    </>
  );
}
