import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services';
import type { UserInfo, LoginDto } from '../api/services';

interface AuthContextType {
    user: UserInfo | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginDto) => Promise<void>;
    logout: () => Promise<void>;
    hasPermission: (module: string, feature: string, action: string) => boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    // Token invalid, clear it
                    authService.removeToken();
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, [token]);

    const login = useCallback(async (data: LoginDto) => {
        const response = await authService.login(data);
        authService.setToken(response.token);
        setToken(response.token);

        // Fetch full user info with permissions
        const userData = await authService.getCurrentUser();
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
        setToken(null);
    }, []);

    const refreshUser = useCallback(async () => {
        if (token) {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        }
    }, [token]);

    const hasPermission = useCallback((module: string, feature: string, action: string): boolean => {
        if (!user) return false;

        // Admin (VT01) bypass all permission checks
        if (user.maquyen === 'VT01') return true;

        // Check if user has this specific permission
        const modulePerms = user.permissions?.[module];
        if (!modulePerms) return false;

        const featureActions = modulePerms[feature];
        if (!featureActions) return false;

        return featureActions.includes(action);
    }, [user]);

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        hasPermission,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
