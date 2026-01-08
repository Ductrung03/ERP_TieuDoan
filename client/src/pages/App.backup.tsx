import { Suspense } from "react"
import { Outlet, NavLink } from "react-router-dom"

// Simple menu items
const menuItems = [
    { path: '/guard-management/dashboard', title: 'Dashboard' },
    { path: '/guard-management/lich-gac', title: 'Lịch Gác' },
    { path: '/guard-management/phan-cong', title: 'Phân Công' },
    { path: '/guard-management/kiem-tra', title: 'Kiểm Tra' },
    { path: '/guard-management/hoc-vien', title: 'Học Viên' },
    { path: '/guard-management/can-bo', title: 'Cán Bộ' },
    { path: '/guard-management/don-vi', title: 'Đơn Vị' },
    { path: '/guard-management/vktb', title: 'VKTB' },
];

function App() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <nav style={{
                width: '250px',
                backgroundColor: '#212529',
                color: 'white',
                padding: '20px',
                flexShrink: 0
            }}>
                <h5 style={{ textAlign: 'center', marginBottom: '30px' }}>ERP Tiểu Đoàn</h5>
                <h6 style={{ color: '#6c757d', marginBottom: '15px' }}>QUẢN LÝ CANH GÁC</h6>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((item) => (
                        <li key={item.path} style={{ marginBottom: '5px' }}>
                            <NavLink
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'block',
                                    padding: '8px 12px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    backgroundColor: isActive ? '#0d6efd' : 'transparent'
                                })}
                            >
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main style={{ flexGrow: 1, backgroundColor: '#f8f9fa' }}>
                <header style={{
                    backgroundColor: 'white',
                    padding: '15px 20px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ margin: 0 }}>Quản Lý Canh Gác</h4>
                </header>
                <div style={{ padding: '20px' }}>
                    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}

export default App
