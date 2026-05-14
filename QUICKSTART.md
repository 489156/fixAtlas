# FixAtlas 빠른 시작 (Supabase Postgres)

## 1) Supabase 프로젝트 준비 (약 5분)

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트 생성.
2. **Settings → API**에서 URL, **anon** 키, **service_role** 키 복사.
3. 로컬에 `.env` 생성: `.env.example` 참고 후 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 입력.

## 2) DB 마이그레이션

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 3) Edge Function 배포 및 시크릿

```bash
supabase secrets set SUPABASE_URL=https://YOUR_REF.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=서비스롤_키
supabase functions deploy make-server-3e8c4785
```

## 4) 인증 설정

- **Email**: 매직 링크는 `/auth`에서 `signInWithOtp` 사용. **Authentication → URL configuration**에 로컬/배포 Redirect URL 등록.
- **Google**: Provider에서 Google 활성화 후 클라이언트 ID/Secret 입력, Google 콘솔에 Supabase 콜백 URL 등록.

## 5) 관리자 지정

SQL 편집기에서:

```sql
update public.profiles set role = 'admin' where email = '내이메일@example.com';
```

(첫 가입자 자동 관리자 로직은 사용하지 않습니다.)

## 6) 로컬 실행

```bash
npm install
npm run dev
```

## 7) 시드 데이터

1. 매직 링크 또는 Google로 로그인.
2. 위 5)로 관리자 권한 부여.
3. `/admin` → **초기 데이터 생성** 클릭.

## 8) RFP 예시 URL

앱에서 다음으로 접속 시 기존 라우트로 리다이렉트됩니다.

- `/submit-repair-report` → `/submit-repair`
- `/calculator/repair-vs-replace` → `/calculator`
- `/products/robot-vacuum/roborock-s8-pro-ultra` → `/products/robot-vacuum/prod-1`

## 자세한 설명

전체 단계와 트러블슈팅은 `SETUP.md`를 참고하세요.
