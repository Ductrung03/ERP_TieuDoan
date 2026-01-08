import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { BadRequestError } from '../../../core/errors';
import { logger } from '../../../core/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  private authService = new AuthService();

  /**
   * POST /api/v1/auth/login
   * Login endpoint
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDto = req.body;

      // Validate input
      if (!dto.username || !dto.password) {
        throw new BadRequestError('Tên đăng nhập và mật khẩu là bắt buộc');
      }

      // Login
      const result = await this.authService.login(dto);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   * Get current logged in user info
   * Requires auth middleware
   */
  getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        throw new BadRequestError('User không tồn tại trong request');
      }

      const user = await this.authService.getCurrentUser(authReq.user.mataikhoan);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/permissions
   * Get current user's permissions
   * Requires auth middleware
   */
  getUserPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        throw new BadRequestError('User không tồn tại trong request');
      }

      const permissions = await this.authService.getUserPermissionsDetailed(
        authReq.user.mataikhoan
      );

      res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/check-permission
   * Check if user has specific permission
   * Requires auth middleware
   */
  checkPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { module, feature, action } = req.body;

      if (!authReq.user) {
        throw new BadRequestError('User không tồn tại trong request');
      }

      if (!module || !feature || !action) {
        throw new BadRequestError('module, feature, action là bắt buộc');
      }

      const hasPermission = await this.authService.hasPermission(
        authReq.user.mataikhoan,
        module,
        feature,
        action
      );

      res.status(200).json({
        success: true,
        data: {
          hasPermission,
          module,
          feature,
          action,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   * Logout endpoint (client-side mainly, just log the action)
   * Requires auth middleware
   */
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authReq = req as AuthRequest;

      if (authReq.user) {
        // Log nhật ký
        await this.authService['db'].query(
          `INSERT INTO nhatkytruycap (mataikhoan, hanhdong) VALUES ($1, $2)`,
          [authReq.user.mataikhoan, 'Đăng xuất']
        );

        logger.info(`User logged out: ${authReq.user.tendn}`);
      }

      res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}
