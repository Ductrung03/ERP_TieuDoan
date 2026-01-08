import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredModule?: string;
    requiredFeature?: string;
    requiredAction?: string;
}

/**
 * ProtectedRoute component
 * Wraps routes that require authentication and/or specific permissions
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredModule,
    requiredFeature,
    requiredAction,
}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const { can } = usePermission();
    const location = useLocation();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check permission if required
    if (requiredModule && requiredFeature && requiredAction) {
        if (!can(requiredModule, requiredFeature, requiredAction)) {
            return <Navigate to="/403" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
