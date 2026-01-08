import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../../../core/errors';
import { logger } from '../../../core/logger';
import { AuthRequest } from './auth.middleware';
import { AuthService } from '../services/auth.service';

/**
 * Permission check middleware factory
 * @param module - VD: 'QUAN_LY_CANH_GAC', 'USER_MANAGEMENT'
 * @param feature - VD: 'HOC_VIEN', 'LICH_GAC', 'NGUOI_DUNG'
 * @param action - VD: 'VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'
 */
export const requirePermission = (
  module: string,
  feature: string,
  action: string
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Chưa xác thực');
      }

      // Admin (VT01) bypass permission check
      if (req.user.maquyen === 'VT01') {
        logger.debug(`Admin bypass permission check: ${module}.${feature}.${action}`);
        return next();
      }

      // Check if user has the required permission
      const authService = new AuthService();
      const hasPermission = await authService.hasPermission(
        req.user.mataikhoan,
        module,
        feature,
        action
      );

      if (!hasPermission) {
        logger.warn(
          `Permission denied for user ${req.user.tendn}: ${module}.${feature}.${action}`
        );
        throw new ForbiddenError('Bạn không có quyền thực hiện hành động này');
      }

      logger.debug(
        `Permission granted for user ${req.user.tendn}: ${module}.${feature}.${action}`
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require any of the permissions (OR logic)
 * Useful when one endpoint needs one of multiple permissions
 */
export const requireAnyPermission = (
  permissions: Array<{ module: string; feature: string; action: string }>
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Chưa xác thực');
      }

      // Admin bypass
      if (req.user.maquyen === 'VT01') {
        return next();
      }

      // Check if user has any of the permissions
      const authService = new AuthService();
      let hasAnyPermission = false;

      for (const perm of permissions) {
        const has = await authService.hasPermission(
          req.user.mataikhoan,
          perm.module,
          perm.feature,
          perm.action
        );

        if (has) {
          hasAnyPermission = true;
          break;
        }
      }

      if (!hasAnyPermission) {
        logger.warn(
          `Permission denied for user ${req.user.tendn}: requires one of ${JSON.stringify(permissions)}`
        );
        throw new ForbiddenError('Bạn không có quyền thực hiện hành động này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require all permissions (AND logic)
 * Useful when one endpoint needs multiple permissions at once
 */
export const requireAllPermissions = (
  permissions: Array<{ module: string; feature: string; action: string }>
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Chưa xác thực');
      }

      // Admin bypass
      if (req.user.maquyen === 'VT01') {
        return next();
      }

      // Check if user has all permissions
      const authService = new AuthService();

      for (const perm of permissions) {
        const has = await authService.hasPermission(
          req.user.mataikhoan,
          perm.module,
          perm.feature,
          perm.action
        );

        if (!has) {
          logger.warn(
            `Permission denied for user ${req.user.tendn}: missing ${perm.module}.${perm.feature}.${perm.action}`
          );
          throw new ForbiddenError('Bạn không có quyền thực hiện hành động này');
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
