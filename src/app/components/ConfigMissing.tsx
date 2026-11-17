/** Shown instead of a blank page when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. */
export function ConfigMissing() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg bg-white border border-amber-300 rounded-xl p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-3">환경 설정이 필요합니다</h1>
        <p className="text-sm text-gray-700 mb-4">
          Supabase 연결 정보가 없어 앱을 시작할 수 없습니다. 프로젝트 루트에 <code>.env</code> 파일을 만들고
          아래 값을 채운 뒤 다시 실행하세요. (호스팅 환경에서는 같은 이름의 환경변수로 설정)
        </p>
        <pre className="text-xs bg-gray-100 rounded p-3 overflow-x-auto mb-4">
{`VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY`}
        </pre>
        <p className="text-xs text-gray-500">
          예시는 <code>.env.example</code>, 전체 절차는 <code>SETUP.md</code>를 참고하세요.
          service_role 키는 프런트엔드 환경변수에 넣지 마세요.
        </p>
      </div>
    </div>
  );
}
