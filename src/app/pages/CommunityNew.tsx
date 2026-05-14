import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { API_BASE, supabase } from '../../lib/supabase';

interface Product {
  id: string;
  category: string;
  brand: string;
  model_name: string;
}

interface Symptom {
  id: string;
  name_ko: string;
}

export function CommunityNew() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'question',
    product_id: '',
    symptom_id: '',
    title: '',
    body: '',
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert('글을 작성하려면 먼저 로그인해야 합니다.');
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE}/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/community/${data.post.id}`);
      } else {
        alert(data.error || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'robot-vacuum') return '로봇청소기';
    if (category === 'cordless-vacuum') return '무선청소기';
    return category;
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-8">
      <Link
        to="/community"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        커뮤니티로 돌아가기
      </Link>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">새 게시글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게시글 유형 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="question">질문</option>
              <option value="solved">해결후기</option>
              <option value="report">수리비 제보</option>
              <option value="repair_or_replace">수리 vs 교체 고민</option>
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제품</label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">선택 안 함</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {getCategoryLabel(product.category)} - {product.brand} {product.model_name}
                </option>
              ))}
            </select>
          </div>

          {/* Symptom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">증상</label>
            <select
              value={formData.symptom_id}
              onChange={(e) => setFormData({ ...formData, symptom_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">선택 안 함</option>
              {symptoms.map((symptom) => (
                <option key={symptom.id} value={symptom.id}>
                  {symptom.name_ko}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="내용을 입력하세요"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-2">커뮤니티 운영 원칙</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 사실 기반 후기를 작성해주세요</li>
              <li>• 업체·기사에 대한 비방성 표현은 제한됩니다</li>
              <li>• 위험한 자가수리 권장은 금지됩니다</li>
              <li>• 광고성 게시글은 삭제될 수 있습니다</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? '작성 중...' : '게시글 작성'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
