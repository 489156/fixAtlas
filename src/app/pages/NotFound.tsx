import { Link } from 'react-router';
import { SEO } from '../components/SEO';

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center py-16 space-y-4">
      <SEO title="페이지를 찾을 수 없습니다" noIndex />
      <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">홈으로</Link>
        <Link to="/search" className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">제품·증상 검색</Link>
      </div>
    </div>
  );
}
