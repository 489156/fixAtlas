import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Search, PlusCircle, Calculator, MessageSquare, Settings, LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AffiliateSlot } from './AffiliateSlot';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { track } from '../../lib/analytics';

type Role = 'user' | 'admin' | 'moderator' | null;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const isActive = (path: string) => location.pathname === path;
  const startsWith = (p: string) => location.pathname.startsWith(p);

  useEffect(() => {
    track('page_view');
  }, [location.pathname]);

  useEffect(() => {
    let alive = true;
    const load = async (hasSession: boolean) => {
      if (!alive) return;
      setSignedIn(hasSession);
      if (!hasSession) return setRole(null);
      try {
        const r = await api<{ user: { role?: Role } }>('/user', { auth: true });
        if (alive) setRole((r.user?.role as Role) ?? 'user');
      } catch {
        if (alive) setRole('user');
      }
    };
    supabase.auth.getSession().then(({ data }) => load(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { void load(Boolean(session)); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const isStaff = role === 'admin' || role === 'moderator';
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  const navCls = (active: boolean) =>
    `flex items-center gap-1 text-sm ${active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-tight">{t('layout.brand')}</p>
                <p className="text-xs text-gray-500">{t('layout.tagline')}</p>
              </div>
            </Link>

            <nav className="hidden md:flex gap-6 items-center" aria-label="주 메뉴">
              <Link to="/" className={navCls(isActive('/'))}><Home className="w-4 h-4" />{t('layout.navHome')}</Link>
              <Link to="/search" className={navCls(isActive('/search'))}><Search className="w-4 h-4" />{t('layout.navSearch')}</Link>
              <Link to="/submit-repair" className={navCls(isActive('/submit-repair'))}><PlusCircle className="w-4 h-4" />{t('layout.navSubmit')}</Link>
              <Link to="/calculator" className={navCls(isActive('/calculator'))}><Calculator className="w-4 h-4" />{t('layout.navCalculator')}</Link>
              <Link to="/community" className={navCls(startsWith('/community'))}><MessageSquare className="w-4 h-4" />{t('layout.navCommunity')}</Link>
              {isStaff && (
                <Link to="/admin" className={navCls(startsWith('/admin'))}><Settings className="w-4 h-4" />{t('layout.navAdmin')}</Link>
              )}
              {signedIn ? (
                <button type="button" onClick={logout} className={navCls(false)}><LogOut className="w-4 h-4" />{t('layout.logout')}</button>
              ) : (
                <Link to="/auth" className={navCls(isActive('/auth'))}><LogIn className="w-4 h-4" />{t('layout.login')}</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 pb-24 md:pb-6 text-sm text-gray-600">
        <div className="container mx-auto px-4 space-y-2">
          <p className="text-xs text-gray-500">{t('layout.legalNotice')}</p>
          <p className="text-xs text-gray-500">{t('layout.safetyNotice')}</p>
          <p className="text-xs text-gray-500">{t('layout.reviewNotice')}</p>
          <AffiliateSlot />
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10" aria-label="하단 메뉴">
        <div className="flex justify-around py-1">
          {[
            { to: '/', icon: Home, label: t('layout.navHome'), active: isActive('/') },
            { to: '/search', icon: Search, label: t('layout.navSearch'), active: isActive('/search') },
            { to: '/submit-repair', icon: PlusCircle, label: t('layout.navSubmitShort'), active: isActive('/submit-repair') },
            { to: '/calculator', icon: Calculator, label: t('layout.navCalculator'), active: isActive('/calculator') },
            { to: '/community', icon: MessageSquare, label: t('layout.navCommunity'), active: startsWith('/community') },
          ].map(({ to, icon: Icon, label, active }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] ${active ? 'text-blue-600' : 'text-gray-600'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
