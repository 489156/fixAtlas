import { Link, Outlet, useLocation } from 'react-router';
import { Home, Search, PlusCircle, Calculator, MessageSquare, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AffiliateSlot } from './AffiliateSlot';

export function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const isActive = (path: string) => location.pathname === path;

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
                <h1 className="text-xl font-bold text-gray-900">{t('layout.brand')}</h1>
                <p className="text-xs text-gray-500">{t('layout.tagline')}</p>
              </div>
            </Link>

            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className={`flex items-center gap-1 text-sm ${
                  isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                {t('layout.navHome')}
              </Link>
              <Link
                to="/search"
                className={`flex items-center gap-1 text-sm ${
                  isActive('/search') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4" />
                {t('layout.navSearch')}
              </Link>
              <Link
                to="/submit-repair"
                className={`flex items-center gap-1 text-sm ${
                  isActive('/submit-repair') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                {t('layout.navSubmit')}
              </Link>
              <Link
                to="/calculator"
                className={`flex items-center gap-1 text-sm ${
                  isActive('/calculator') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calculator className="w-4 h-4" />
                {t('layout.navCalculator')}
              </Link>
              <Link
                to="/community"
                className={`flex items-center gap-1 text-sm ${
                  location.pathname.startsWith('/community') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {t('layout.navCommunity')}
              </Link>
              <Link
                to="/admin"
                className={`flex items-center gap-1 text-sm ${
                  location.pathname.startsWith('/admin') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                {t('layout.navAdmin')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-sm text-gray-600">
        <div className="container mx-auto px-4 space-y-2">
          <p className="text-xs text-gray-500">{t('layout.legalNotice')}</p>
          <p className="text-xs text-gray-400">{t('layout.affiliateStub')}</p>
          <AffiliateSlot />
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">{t('layout.navHome')}</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/search') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">{t('layout.navSearch')}</span>
          </Link>
          <Link
            to="/submit-repair"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive('/submit-repair') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-xs">{t('layout.navSubmitShort')}</span>
          </Link>
          <Link
            to="/community"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location.pathname.startsWith('/community') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">{t('layout.navCommunity')}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
