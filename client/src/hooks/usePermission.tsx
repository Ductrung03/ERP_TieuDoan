import { useAuth } from '../context/AuthContext';

/**
 * Hook for checking user permissions
 * Provides convenience methods for common permission checks
 */
export const usePermission = () => {
    const { user, hasPermission } = useAuth();

    const can = (module: string, feature: string, action: string): boolean => {
        return hasPermission(module, feature, action);
    };

    // Convenience methods
    const canView = (module: string, feature: string) => can(module, feature, 'VIEW');
    const canCreate = (module: string, feature: string) => can(module, feature, 'CREATE');
    const canUpdate = (module: string, feature: string) => can(module, feature, 'UPDATE');
    const canDelete = (module: string, feature: string) => can(module, feature, 'DELETE');
    const canApprove = (module: string, feature: string) => can(module, feature, 'APPROVE');
    const canExport = (module: string, feature: string) => can(module, feature, 'EXPORT');

    return {
        can,
        canView,
        canCreate,
        canUpdate,
        canDelete,
        canApprove,
        canExport,
        isAdmin: user?.maquyen === 'VT01',
        isCanBo: user?.maquyen === 'VT02',
        isHocVien: user?.maquyen === 'VT03',
        isViewer: user?.maquyen === 'VT04',
    };
};

export default usePermission;
