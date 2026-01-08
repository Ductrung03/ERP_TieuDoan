import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './shared/redux/store.tsx';

// Lazy load components
const App = lazy(() => import('./pages/App.tsx'));
const GuardDashboard = lazy(() => import('./pages/guard-management/GuardDashboard'));
const LichGacList = lazy(() => import('./pages/guard-management/LichGacList'));
const PhanCongGac = lazy(() => import('./pages/guard-management/PhanCongGac'));
const QuanLyHocVien = lazy(() => import('./pages/guard-management/QuanLyHocVien'));
const QuanLyVKTB = lazy(() => import('./pages/guard-management/QuanLyVKTB'));
const QuanLyDonVi = lazy(() => import('./pages/guard-management/QuanLyDonVi'));
const QuanLyCanBo = lazy(() => import('./pages/guard-management/QuanLyCanBo'));
const KiemTraGac = lazy(() => import('./pages/guard-management/KiemTraGac'));
const Error404 = lazy(() => import('./components/pages/error/404-error/404-error.tsx'));

import RootWrapper from './pages/Rootwrapper.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RootWrapper>
      <BrowserRouter>
        <Suspense fallback={<div className="text-center p-5">Đang tải...</div>}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="guard-management/dashboard" replace />} />
              <Route path="guard-management/dashboard" element={<GuardDashboard />} />
              <Route path="guard-management/lich-gac" element={<LichGacList />} />
              <Route path="guard-management/phan-cong" element={<PhanCongGac />} />
              <Route path="guard-management/hoc-vien" element={<QuanLyHocVien />} />
              <Route path="guard-management/vktb" element={<QuanLyVKTB />} />
              <Route path="guard-management/don-vi" element={<QuanLyDonVi />} />
              <Route path="guard-management/can-bo" element={<QuanLyCanBo />} />
              <Route path="guard-management/kiem-tra" element={<KiemTraGac />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </RootWrapper>
  </Provider>
);
