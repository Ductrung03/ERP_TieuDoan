import { Request, Response, NextFunction } from 'express';
import { roleService } from '../services';
import { CreateRoleDto, UpdateRoleDto } from '../entities';
import { BadRequestError } from '../../../core/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export class RoleController {
  /**
   * GET /api/v1/roles
   * Lấy danh sách tất cả vai trò
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await roleService.getAll();
      res.status(200).json({
        success: true,
        data: roles,
        total: roles.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/roles/:id
   * Lấy thông tin vai trò theo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const role = await roleService.getById(id);
      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/roles/:id/with-permissions
   * Lấy vai trò kèm danh sách permissions
   */
  getByIdWithPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const role = await roleService.getByIdWithPermissions(id);
      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/roles
   * Tạo vai trò mới
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const dto: CreateRoleDto = req.body;

      if (!dto.tenquyen) {
        throw new BadRequestError('Tên vai trò là bắt buộc');
      }

      const role = await roleService.create(dto, authReq.user?.mataikhoan);
      res.status(201).json({
        success: true,
        data: role,
        message: 'Tạo vai trò thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/roles/:id
   * Cập nhật vai trò
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateRoleDto = req.body;

      const role = await roleService.update(id, dto);
      res.status(200).json({
        success: true,
        data: role,
        message: 'Cập nhật vai trò thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/roles/:id
   * Xóa vai trò
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await roleService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa vai trò thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/roles/:id/permissions
   * Lấy danh sách permissions của vai trò
   */
  getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const permissions = await roleService.getPermissions(id);
      res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/roles/:id/permissions
   * Gán permissions cho vai trò (thay thế hoàn toàn)
   */
  assignPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        throw new BadRequestError('permissions phải là một mảng');
      }

      await roleService.assignPermissions(id, permissions, authReq.user?.mataikhoan);
      res.status(200).json({
        success: true,
        message: `Đã gán ${permissions.length} quyền cho vai trò`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/roles/:id/permissions/add
   * Thêm một permission vào vai trò
   */
  addPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const { permissionId } = req.body;

      if (!permissionId) {
        throw new BadRequestError('permissionId là bắt buộc');
      }

      await roleService.addPermission(id, permissionId, authReq.user?.mataikhoan);
      res.status(200).json({
        success: true,
        message: 'Đã thêm quyền vào vai trò',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/roles/:id/permissions/:permissionId
   * Xóa một permission khỏi vai trò
   */
  removePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, permissionId } = req.params;
      await roleService.removePermission(id, permissionId);
      res.status(200).json({
        success: true,
        message: 'Đã xóa quyền khỏi vai trò',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roleController = new RoleController();
