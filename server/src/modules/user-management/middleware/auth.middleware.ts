import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../core/errors';
import { logger } from '../../../core/logger';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
  user?: {
    mataikhoan: string;
    tendn: string;
    maquyen: string;
    madonvi: string;
    permissions?: string[];
    dataScopes?: any[];
    allowedUnits?: string[];
  };
}

/**
 * Auth middleware - Xác thực JWT token
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token không hợp lệ');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // 2. Verify JWT token
    const authService = new AuthService();
    const decoded = await authService.verifyToken(token);

    // 3. Load user permissions & data scopes
    const permissions = await authService.getUserPermissions(decoded.mataikhoan);
    const dataScopes = await authService.getUserDataScopes(decoded.mataikhoan);

    // 4. Attach user info to request
    (req as AuthRequest).user = {
      mataikhoan: decoded.mataikhoan,
      tendn: decoded.tendn,
      maquyen: decoded.maquyen,
      madonvi: decoded.madonvi,
      permissions,
      dataScopes,
    };

    logger.debug(`Auth successful for user: ${decoded.tendn}`);
    next();
  } catch (error: any) {
    logger.warn('Auth failed:', error.message);

    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Xác thực thất bại',
    });
  }
};

/**
 * Optional auth middleware - Không bắt buộc phải login
 * Nếu có token thì attach user info, không có thì vẫn cho qua
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const authService = new AuthService();
      const decoded = await authService.verifyToken(token);

      const permissions = await authService.getUserPermissions(decoded.mataikhoan);
      const dataScopes = await authService.getUserDataScopes(decoded.mataikhoan);

      (req as AuthRequest).user = {
        mataikhoan: decoded.mataikhoan,
        tendn: decoded.tendn,
        maquyen: decoded.maquyen,
        madonvi: decoded.madonvi,
        permissions,
        dataScopes,
      };
    }
    next();
  } catch (error) {
    // Không throw error, chỉ log warning
    logger.debug('Optional auth failed, continuing without auth');
    next();
  }
};
