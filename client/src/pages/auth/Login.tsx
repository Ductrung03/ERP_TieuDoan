import React, { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Login Page
 * Trang đăng nhập hệ thống ERP Tiểu Đoàn
 */
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/guard-management/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsLoading(true);
        try {
            await login({ username, password });
            toast.success('Đăng nhập thành công!');
            const from = (location.state as any)?.from?.pathname || '/guard-management/dashboard';
            navigate(from, { replace: true });
        } catch (error: any) {
            console.error('Login error:', error);
            // Toast already shown by axios interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-1">ERP Tiểu Đoàn</h4>
                                    <p className="text-muted small">Đăng nhập để tiếp tục</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Username */}
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label small fw-semibold">
                                            Tên đăng nhập
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="username"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="Nhập tên đăng nhập"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                autoFocus
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label small fw-semibold">
                                            Mật khẩu
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                className="form-control border-start-0 border-end-0 ps-0"
                                                placeholder="Nhập mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="input-group-text bg-light border-start-0"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex={-1}
                                            >
                                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Đăng nhập
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Footer */}
                                <div className="text-center mt-4">
                                    <small className="text-muted">
                                        © 2026 ERP Tiểu Đoàn - LuckyBoiz Team
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
