import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { CreateUserDto, UpdateUserDto } from '../entities';
import { BadRequestError } from '../../../core/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  /**
   * GET /api/v1/users
   * Lấy danh sách tất cả users
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userService.getAll();
      res.status(200).json({
        success: true,
        data: users,
        total: users.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/:id
   * Lấy thông tin user theo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/users
   * Tạo user mới
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateUserDto = req.body;

      // Validate required fields
      if (!dto.tendn || !dto.matkhau || !dto.maquyen) {
        throw new BadRequestError('Tên đăng nhập, mật khẩu và vai trò là bắt buộc');
      }

      const user = await userService.create(dto);
      res.status(201).json({
        success: true,
        data: user,
        message: 'Tạo người dùng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/:id
   * Cập nhật user
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateUserDto = req.body;

      const user = await userService.update(id, dto);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Cập nhật người dùng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/users/:id
   * Xóa user
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa người dùng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/users/:id/reset-password
   * Reset mật khẩu user (admin only)
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { matkhaumoi } = req.body;

      if (!matkhaumoi) {
        throw new BadRequestError('Mật khẩu mới là bắt buộc');
      }

      await userService.resetPassword(id, matkhaumoi);
      res.status(200).json({
        success: true,
        message: 'Reset mật khẩu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/users/change-password
   * Đổi mật khẩu (user tự đổi)
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { matkhaucu, matkhaumoi } = req.body;

      if (!authReq.user) {
        throw new BadRequestError('User không tồn tại trong request');
      }

      if (!matkhaucu || !matkhaumoi) {
        throw new BadRequestError('Mật khẩu cũ và mật khẩu mới là bắt buộc');
      }

      await userService.changePassword(authReq.user.mataikhoan, matkhaucu, matkhaumoi);
      res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/:id/toggle-status
   * Khóa/mở khóa tài khoản
   */
  toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { trangthai } = req.body;

      if (!trangthai || !['Active', 'Inactive'].includes(trangthai)) {
        throw new BadRequestError('Trạng thái phải là Active hoặc Inactive');
      }

      await userService.toggleStatus(id, trangthai);
      res.status(200).json({
        success: true,
        message: `Đã ${trangthai === 'Active' ? 'mở khóa' : 'khóa'} tài khoản`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
