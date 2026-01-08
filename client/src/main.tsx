import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './shared/redux/store.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Lazy load components
const App = lazy(() => import('./pages/App.tsx'));
const Login = lazy(() => import('./pages/auth/Login.tsx'));
const GuardDashboard = lazy(() => import('./pages/guard-management/GuardDashboard'));
const LichGacList = lazy(() => import('./pages/guard-management/LichGacList'));
const PhanCongGac = lazy(() => import('./pages/guard-management/PhanCongGac'));
const QuanLyHocVien = lazy(() => import('./pages/guard-management/QuanLyHocVien'));
const QuanLyVKTB = lazy(() => import('./pages/guard-management/QuanLyVKTB'));
const QuanLyDonVi = lazy(() => import('./pages/guard-management/QuanLyDonVi'));
const QuanLyCanBo = lazy(() => import('./pages/guard-management/QuanLyCanBo'));
const KiemTraGac = lazy(() => import('./pages/guard-management/KiemTraGac'));
const Error404 = lazy(() => import('./components/pages/error/404-error/404-error.tsx'));

// User Management pages
const UserList = lazy(() => import('./pages/user-management/UserList.tsx'));
const RoleList = lazy(() => import('./pages/user-management/RoleList.tsx'));
const RolePermissions = lazy(() => import('./pages/user-management/RolePermissions.tsx'));

import RootWrapper from './pages/Rootwrapper.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthProvider>
      <RootWrapper>
        <BrowserRouter>
          <Suspense fallback={<div className="text-center p-5">Đang tải...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="guard-management/dashboard" replace />} />

                {/* Guard Management */}
                <Route path="guard-management/dashboard" element={<GuardDashboard />} />
                <Route path="guard-management/lich-gac" element={<LichGacList />} />
                <Route path="guard-management/phan-cong" element={<PhanCongGac />} />
                <Route path="guard-management/hoc-vien" element={<QuanLyHocVien />} />
                <Route path="guard-management/vktb" element={<QuanLyVKTB />} />
                <Route path="guard-management/don-vi" element={<QuanLyDonVi />} />
                <Route path="guard-management/can-bo" element={<QuanLyCanBo />} />
                <Route path="guard-management/kiem-tra" element={<KiemTraGac />} />

                {/* User Management */}
                <Route path="user-management/users" element={
                  <ProtectedRoute requiredModule="USER_MANAGEMENT" requiredFeature="NGUOI_DUNG" requiredAction="VIEW">
                    <UserList />
                  </ProtectedRoute>
                } />
                <Route path="user-management/roles" element={
                  <ProtectedRoute requiredModule="USER_MANAGEMENT" requiredFeature="VAI_TRO" requiredAction="VIEW">
                    <RoleList />
                  </ProtectedRoute>
                } />
                <Route path="user-management/roles/:roleId/permissions" element={
                  <ProtectedRoute requiredModule="USER_MANAGEMENT" requiredFeature="VAI_TRO" requiredAction="VIEW">
                    <RolePermissions />
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RootWrapper>
    </AuthProvider>
  </Provider>
);
