import { useState } from 'react';
import { Calculator as CalculatorIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';

export function Calculator() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPrice: '',
    repairCost: '',
    usedPrice: '',
    purchaseYear: '',
    failureType: 'battery',
  });

  const [result, setResult] = useState<{
    recommendation: string;
    ratio: number;
    icon: 'repair' | 'replace' | 'conditional';
    explanation: string;
    factors: string[];
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const currentPrice = parseFloat(formData.currentPrice);
    const repairCost = parseFloat(formData.repairCost);
    const usedPrice = parseFloat(formData.usedPrice) || 0;
    const purchaseYear = parseInt(formData.purchaseYear);
    const productAge = new Date().getFullYear() - purchaseYear;

    const ratio = (repairCost / currentPrice) * 100;

    let recommendation = '';
    let icon: 'repair' | 'replace' | 'conditional' = 'conditional';
    let explanation = '';
    const factors: string[] = [];

    // Calculate based on ratio
    if (ratio <= 25) {
      recommendation = '수리 우선 검토';
      icon = 'repair';
      explanation = '수리비가 신품 가격의 25% 이하입니다. 경제적으로 수리가 유리합니다.';
    } else if (ratio <= 50) {
      recommendation = '조건부 수리 검토';
      icon = 'conditional';
      explanation = '수리비가 신품 가격의 25~50% 사이입니다. 제품 연식과 상태를 고려하여 결정하세요.';
    } else {
      recommendation = '교체 우선 검토';
      icon = 'replace';
      explanation = '수리비가 신품 가격의 50%를 초과합니다. 신제품 구매를 고려하세요.';
    }

    // Adjust for product age
    if (productAge >= 4 && ['motor', 'mainboard', 'battery'].includes(formData.failureType)) {
      factors.push('제품 연식이 4년 이상이며 핵심 부품 고장으로 교체 검토 권장');
      if (icon === 'repair') icon = 'conditional';
    }

    if (formData.failureType === 'consumable') {
      factors.push('소모품성 고장으로 수리 또는 소모품 교체 권장');
      if (icon === 'replace') icon = 'conditional';
    }

    if (productAge <= 1) {
      factors.push('제품이 비교적 최신이므로 수리 우선 검토');
    }

    if (usedPrice > 0 && repairCost > usedPrice * 0.8) {
      factors.push('수리비가 중고가의 80% 이상으로 교체 검토 권장');
    }

    setResult({
      recommendation,
      ratio: Math.round(ratio),
      icon,
      explanation,
      factors,
    });
  };

  return (
    <>
      <SEO
        title="수리 vs 교체 계산기"
        description="수리비와 신품가를 비교하여 수리와 교체 중 어느 것이 더 경제적인지 판단해보세요"
      />
      <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalculatorIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('calculator.title')}</h1>
        </div>
        <p className="text-gray-600 mb-8">
          {t('calculator.subtitle')}
        </p>

        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Current Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 신품가 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
              placeholder="850000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Repair Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수리비 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.repairCost}
              onChange={(e) => setFormData({ ...formData, repairCost: e.target.value })}
              placeholder="180000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Used Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">현재 중고가 (원)</label>
            <input
              type="number"
              value={formData.usedPrice}
              onChange={(e) => setFormData({ ...formData, usedPrice: e.target.value })}
              placeholder="300000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Purchase Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구매연도 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.purchaseYear}
              onChange={(e) => setFormData({ ...formData, purchaseYear: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">선택하세요</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          {/* Failure Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">고장 부위</label>
            <select
              value={formData.failureType}
              onChange={(e) => setFormData({ ...formData, failureType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="battery">배터리</option>
              <option value="motor">모터</option>
              <option value="mainboard">메인보드</option>
              <option value="consumable">소모품</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('calculator.calculate')}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              {result.icon === 'repair' && <TrendingUp className="w-8 h-8 text-green-600" />}
              {result.icon === 'replace' && <TrendingDown className="w-8 h-8 text-red-600" />}
              {result.icon === 'conditional' && <Minus className="w-8 h-8 text-yellow-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.recommendation}</h2>
            <p className="text-gray-600">{result.explanation}</p>
          </div>

          {/* Ratio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2 text-center">수리비 비중</p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 max-w-md">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      result.ratio <= 25
                        ? 'bg-green-500'
                        : result.ratio <= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(result.ratio, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{result.ratio}%</p>
            </div>
          </div>

          {/* Additional Factors */}
          {result.factors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">추가 확인 사항</h3>
              <ul className="space-y-2">
                {result.factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              {t('calculator.disclaimer')}
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
