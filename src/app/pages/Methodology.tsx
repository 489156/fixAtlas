import { Link } from 'react-router';
import { SEO } from '../components/SEO';

// Public methodology page. Blog posts cite this page for FixAtlas's own rules (sample thresholds, exclusions).
// Keep it in sync with supabase/functions/_shared/stats.ts and docs/blog/EDITORIAL_STANDARDS.md.
export const METHODOLOGY_VERSION = 'v1.0';
export const METHODOLOGY_DATE = '2026-11-18';

const section = 'bg-white rounded-xl p-6 shadow-sm border border-gray-200';

export function Methodology() {
  return (
    <>
      <SEO
        title="수리비 데이터 방법론"
        description="고장도감이 수리비 범위를 계산하고 공개하는 기준: 표본 3건·5건·10건 규칙, 제외 기준, 공식 가격 확인 방법, 갱신 주기."
      />
      <article className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-8 leading-relaxed">
        <header className="space-y-2">
          <p className="text-sm text-gray-500">방법론 {METHODOLOGY_VERSION} · {METHODOLOGY_DATE} 기준 · 광고·제휴 없음</p>
          <h1 className="text-3xl font-bold text-gray-900">수리비 데이터는 이렇게 계산하고 공개합니다</h1>
          <p className="text-gray-700">
            고장도감의 숫자는 두 종류입니다. <strong>사용자가 제보한 실제 지불액</strong>과, 제조사·공식몰·정부 기관이 공개한
            <strong> 공식·공개 기준가격</strong>입니다. 두 숫자는 섞지 않고 따로 표시합니다.
          </p>
        </header>

        <section className={section} aria-labelledby="m-sample">
          <h2 id="m-sample" className="text-xl font-bold text-gray-900 mb-3">표본이 몇 건이면 무엇을 보여주나요?</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500"><tr><th className="py-2 pr-3">같은 모델·증상·통화의 금액 제보</th><th className="py-2">공개하는 것</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 pr-3">3건 미만</td><td className="py-2">범위를 표시하지 않고 건수만 보여줍니다.</td></tr>
              <tr><td className="py-2 pr-3">3~4건</td><td className="py-2">최저~최고 범위만 "참고용(표본 적음)"으로 보여줍니다.</td></tr>
              <tr><td className="py-2 pr-3">5건 이상</td><td className="py-2">중앙값과 중간 50% 구간(25~75%)을 보여주고, 견적 위치 비교를 엽니다.</td></tr>
              <tr><td className="py-2 pr-3">10건 이상</td><td className="py-2">"표본 충분"으로 표시합니다.</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-3">해결률·재발률은 같은 모델·증상 제보가 5건 이상일 때만 표시합니다. 평균 대신 중앙값을 쓰는 이유는 극단적인 금액 한두 건이 결과를 흔들지 않게 하기 위해서입니다.</p>
        </section>

        <section className={section} aria-labelledby="m-excl">
          <h2 id="m-excl" className="text-xl font-bold text-gray-900 mb-3">계산에서 빼는 것</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>운영자가 반려했거나 숨긴 제보</li>
            <li>금액을 입력하지 않은 제보(금액 모름)</li>
            <li>0원 제보 중 자가조치가 아닌 것 — 0원은 직접 고쳐서 실제로 무료였을 때만 가격으로 셉니다</li>
            <li>다른 통화의 제보 — 원화와 달러 등은 섞지 않고 통화별로 따로 계산합니다</li>
            <li>목록에 없는 모델로 들어온 제보 — 운영자가 제품을 확인해 연결하기 전까지는 공개하지 않습니다</li>
          </ul>
        </section>

        <section className={section} aria-labelledby="m-official">
          <h2 id="m-official" className="text-xl font-bold text-gray-900 mb-3">공식·공개 기준가격은 어떻게 확인하나요?</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>사람이 원문 페이지를 직접 열어 본 가격만 싣고, 그 날짜를 "확인일"로 함께 적습니다.</li>
            <li>정상가·회원가·할인가, 부가세 포함 여부, 적용 모델을 구분해 적습니다.</li>
            <li>원문을 열 수 없었던 가격(접속 차단 등)은 싣지 않습니다.</li>
            <li>분기마다 원문을 다시 확인하고, 바뀌면 숫자와 갱신 이력을 고칩니다.</li>
          </ul>
        </section>

        <section className={section} aria-labelledby="m-verify">
          <h2 id="m-verify" className="text-xl font-bold text-gray-900 mb-3">제보는 어떻게 확인하나요?</h2>
          <p className="text-gray-700">영수증이나 견적서를 함께 올린 제보는 운영자가 확인한 뒤 "인증"으로 표시합니다. 이미지는 비공개로 보관하며 공개 화면에는 나오지 않습니다. 제보자의 계정 정보도 공개하지 않습니다.</p>
        </section>

        <section className={section} aria-labelledby="m-limit">
          <h2 id="m-limit" className="text-xl font-bold text-gray-900 mb-3">한계</h2>
          <p className="text-gray-700">제보는 실제로 수리를 겪은 사람이 남기므로 모든 소유자를 대표하지 않습니다. 그래서 "고장률"이 아니라 "제보된 수리비"로만 표현합니다. 지역·업체·부품 수급에 따라 실제 비용은 달라질 수 있습니다.</p>
        </section>

        <p className="text-sm text-gray-500">
          변경 이력: {METHODOLOGY_VERSION} ({METHODOLOGY_DATE}) 최초 공개. ·{' '}
          <Link to="/search" className="text-blue-600 underline">제품·증상 검색</Link> ·{' '}
          <Link to="/submit-repair" className="text-blue-600 underline">수리비 제보하기</Link>
        </p>
      </article>
    </>
  );
}
