import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Search as SearchIcon, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../../lib/supabase';
import { SEO } from '../components/SEO';

interface Product {
  id: string;
  category: string;
  brand: string;
  model_name: string;
  alternate_names: string[];
}

interface Symptom {
  id: string;
  code: string;
  name_ko: string;
  name_en: string;
}

export function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data.products || []);
      setSymptoms(data.symptoms || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'robot-vacuum') return '로봇청소기';
    if (category === 'cordless-vacuum') return '무선청소기';
    return category;
  };

  return (
    <>
      <SEO
        title={initialQuery ? `${initialQuery} 검색 결과` : '제품·증상 검색'}
        description={initialQuery ? `${initialQuery}에 대한 제품 및 증상 검색 결과` : '제품명, 브랜드, 모델명, 증상으로 검색하세요'}
      />
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('search.searching')}</p>
        </div>
      )}

      {!loading && initialQuery && (
        <>
          {/* Products Results */}
          {products.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {t('search.products')} ({products.length})
              </h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.category}/${product.id}`}
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{getCategoryLabel(product.category)}</p>
                        <h3 className="text-lg font-bold text-gray-900">
                          {product.brand} {product.model_name}
                        </h3>
                        {product.alternate_names && product.alternate_names.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            별칭: {product.alternate_names.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {t('search.detail')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Symptoms Results */}
          {symptoms.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t('search.symptoms')} ({symptoms.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => {
                      setSearchQuery(symptom.name_ko);
                      setSearchParams({ q: symptom.name_ko });
                      performSearch(symptom.name_ko);
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-900">{symptom.name_ko}</p>
                    <p className="text-xs text-gray-500 mt-1">{symptom.name_en}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {products.length === 0 && symptoms.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">
                {t('search.noResults', { q: initialQuery })}
              </p>
              <Link
                to="/submit-repair"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('search.ctaSubmit')}
              </Link>
            </div>
          )}
        </>
      )}

      {!loading && !initialQuery && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">{t('search.emptyState')}</p>
        </div>
      )}
    </div>
    </>
  );
}
