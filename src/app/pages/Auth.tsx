import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

export function Auth() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signupMeta, setSignupMeta] = useState({
    nickname: '',
    country: '한국',
  });

  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: !isLogin,
          data: {
            nickname: signupMeta.nickname,
            country: signupMeta.country,
          },
        },
      });
      if (error) {
        alert(`${t('auth.magicFail')}: ${error.message}`);
      } else {
        alert(t('auth.magicSent'));
      }
    } catch (err) {
      console.error(err);
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl },
      });
      if (error) alert(error.message);
    } catch (err) {
      console.error(err);
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(`${t('auth.loginFail')}: ${error.message}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24 md:pb-8">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <LogIn className="w-5 h-5" />
            {t('auth.loginTab')}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            {t('auth.signupTab')}
          </button>
        </div>

        {!isLogin && (
          <p className="text-sm text-gray-600 mb-4">{t('auth.signupMagicHint')}</p>
        )}

        <form onSubmit={handleMagicLink} className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Mail className="w-4 h-4" />
            {t('auth.magicHeading')}
          </div>
          <p className="text-xs text-gray-500">{t('auth.magicHint')}</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.nickname')}</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={signupMeta.nickname}
                  onChange={(e) => setSignupMeta({ ...signupMeta, nickname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.country')}</label>
                <select
                  value={signupMeta.country}
                  onChange={(e) => setSignupMeta({ ...signupMeta, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="한국">한국</option>
                  <option value="미국">미국</option>
                  <option value="중국">중국</option>
                  <option value="일본">일본</option>
                </select>
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? t('auth.sending') : t('auth.sendLink')}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-6 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100"
        >
          {t('auth.google')}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">{t('auth.divider')}</span>
          </div>
        </div>

        {isLogin && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="text-sm font-medium text-gray-800">{t('auth.passwordHeading')}</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>{t('auth.noteTitle')}:</strong> {t('auth.noteBody')}
          </p>
        </div>
      </div>
    </div>
  );
}
