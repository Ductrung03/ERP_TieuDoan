import { lazy } from 'react';

// Guard Management Pages
const GuardDashboard = lazy(() => import('../../pages/guard-management/GuardDashboard'));
const LichGacList = lazy(() => import('../../pages/guard-management/LichGacList'));
const PhanCongGac = lazy(() => import('../../pages/guard-management/PhanCongGac'));
const QuanLyHocVien = lazy(() => import('../../pages/guard-management/QuanLyHocVien'));
const QuanLyVKTB = lazy(() => import('../../pages/guard-management/QuanLyVKTB'));
const QuanLyDonVi = lazy(() => import('../../pages/guard-management/QuanLyDonVi'));
const QuanLyCanBo = lazy(() => import('../../pages/guard-management/QuanLyCanBo'));
const KiemTraGac = lazy(() => import('../../pages/guard-management/KiemTraGac'));

export const RouteData = [
    // Guard Management Routes (relative paths for nested routing)
    { id: 100, path: 'guard-management/dashboard', element: <GuardDashboard /> },
    { id: 101, path: 'guard-management/lich-gac', element: <LichGacList /> },
    { id: 102, path: 'guard-management/phan-cong', element: <PhanCongGac /> },
    { id: 103, path: 'guard-management/hoc-vien', element: <QuanLyHocVien /> },
    { id: 104, path: 'guard-management/vktb', element: <QuanLyVKTB /> },
    { id: 105, path: 'guard-management/don-vi', element: <QuanLyDonVi /> },
    { id: 106, path: 'guard-management/can-bo', element: <QuanLyCanBo /> },
    { id: 107, path: 'guard-management/kiem-tra', element: <KiemTraGac /> },
];