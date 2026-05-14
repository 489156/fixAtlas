import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE, supabase } from '../../lib/supabase';
import { SEO } from '../components/SEO';

interface Post {
  id: string;
  type: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
}

interface Comment {
  id: string;
  body: string;
  helpful_count: number;
  created_at: string;
}

export function CommunityPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [helpingId, setHelpingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/community/${id}`);
      const data = await response.json();
      setPost(data.post);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert(t('community.loginComment'));
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          post_id: id,
          body: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchPost();
      } else {
        const data = await response.json();
        alert(data.error || t('community.commentFail'));
      }
    } catch (error) {
      console.error('Submit comment error:', error);
      alert(t('community.commentFail'));
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (commentId: string) => {
    setHelpingId(commentId);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert(t('community.loginComment'));
        navigate('/auth');
        return;
      }
      const response = await fetch(`${API_BASE}/comments/${commentId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        fetchPost();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || t('community.commentFail'));
      }
    } catch (error) {
      console.error('Helpful error:', error);
    } finally {
      setHelpingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('community.loading')}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
        <Link to="/community" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('community.back')}
        </Link>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    if (type === 'question') return '질문';
    if (type === 'report') return '수리비 제보';
    if (type === 'solved') return '해결후기';
    if (type === 'repair_or_replace') return '수리 vs 교체 고민';
    return type;
  };

  return (
    <>
      <SEO
        title={post ? post.title : '게시글'}
        description={post ? post.body.substring(0, 160) : '커뮤니티 게시글 상세'}
      />
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <Link
        to="/community"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('community.back')}
      </Link>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
            {getTypeLabel(post.type)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {new Date(post.created_at).toLocaleDateString('ko-KR')}
        </p>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            댓글 ({comments.length})
          </h2>
        </div>

        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('community.commentPlaceholder')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {submitting ? t('community.posting') : t('community.postComment')}
          </button>
        </form>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-3">{comment.body}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(comment.created_at).toLocaleDateString('ko-KR')}</span>
                  <button
                    type="button"
                    disabled={helpingId === comment.id}
                    onClick={() => markHelpful(comment.id)}
                    className="flex items-center gap-1 hover:text-blue-600 disabled:opacity-50"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {t('community.helpful')} {comment.helpful_count}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t('community.noComments')}
          </div>
        )}
      </div>
    </div>
    <SEO
      title={post ? post.title : '게시글'}
      description={post ? post.body.substring(0, 160) : '커뮤니티 게시글 상세'}
    />
  </div>
</>
```
