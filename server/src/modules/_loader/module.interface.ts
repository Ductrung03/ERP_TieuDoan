import { Router } from 'express';

/**
 * Interface cho một module ERP
 * Mỗi module phải implement interface này để có thể được load động
 */
export interface IModule {
  name: string;
  version: string;
  description: string;
  dependencies?: string[];
  routes: (router: Router) => void;
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
}

/**
 * Cấu hình cho module
 */
export interface ModuleConfig {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  dependencies: string[];
  baseRoute: string;
  displayName: string;
  icon?: string;
}

/**
 * Kết quả trả về từ API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    errors?: any[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query params cho phân trang
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
