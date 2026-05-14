import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ProductDetail } from './pages/ProductDetail';
import { SubmitRepair } from './pages/SubmitRepair';
import { Calculator } from './pages/Calculator';
import { Community } from './pages/Community';
import { CommunityPost } from './pages/CommunityPost';
import { CommunityNew } from './pages/CommunityNew';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="products/:category/:id" element={<ProductDetail />} />
          <Route path="submit-repair" element={<SubmitRepair />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="community" element={<Community />} />
          <Route path="community/:id" element={<CommunityPost />} />
          <Route path="community/new" element={<CommunityNew />} />
          <Route path="auth" element={<Auth />} />
          <Route path="admin" element={<Admin />} />

          {/* RFP example paths → current routes */}
          <Route path="submit-repair-report" element={<Navigate to="/submit-repair" replace />} />
          <Route path="calculator/repair-vs-replace" element={<Navigate to="/calculator" replace />} />
          <Route
            path="products/robot-vacuum/roborock-s8-pro-ultra"
            element={<Navigate to="/products/robot-vacuum/prod-1" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
