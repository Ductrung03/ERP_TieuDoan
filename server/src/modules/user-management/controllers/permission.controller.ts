import { Request, Response, NextFunction } from 'express';
import { permissionService } from '../services';
import { CreatePermissionDto, UpdatePermissionDto } from '../entities';
import { BadRequestError } from '../../../core/errors';

export class PermissionController {
  /**
   * GET /api/v1/permissions
   * Lấy danh sách tất cả permissions
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const permissions = includeInactive
        ? await permissionService.getAllIncludingInactive()
        : await permissionService.getAll();

      res.status(200).json({
        success: true,
        data: permissions,
        total: permissions.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/permissions/grouped
   * Lấy permissions grouped by module
   */
  getGrouped = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const grouped = await permissionService.getGroupedByModule();
      res.status(200).json({
        success: true,
        data: grouped,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/permissions/:id
   * Lấy thông tin permission theo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const permission = await permissionService.getById(id);
      res.status(200).json({
        success: true,
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/permissions/module/:module
   * Lấy permissions theo module
   */
  getByModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { module } = req.params;
      const permissions = await permissionService.getByModule(module);
      res.status(200).json({
        success: true,
        data: permissions,
        total: permissions.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/permissions
   * Tạo permission mới
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreatePermissionDto = req.body;

      if (!dto.tenquyen || !dto.mamodule || !dto.machucnang || !dto.hanhdonh) {
        throw new BadRequestError('Tên quyền, module, chức năng và hành động là bắt buộc');
      }

      const permission = await permissionService.create(dto);
      res.status(201).json({
        success: true,
        data: permission,
        message: 'Tạo quyền thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/permissions/:id
   * Cập nhật permission
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdatePermissionDto = req.body;

      const permission = await permissionService.update(id, dto);
      res.status(200).json({
        success: true,
        data: permission,
        message: 'Cập nhật quyền thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/permissions/:id
   * Xóa permission
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await permissionService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa quyền thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const permissionController = new PermissionController();
