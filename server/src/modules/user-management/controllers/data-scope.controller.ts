import { Request, Response, NextFunction } from 'express';
import { dataScopeService } from '../services';
import { CreateDataScopeDto, UpdateDataScopeDto } from '../entities';
import { BadRequestError } from '../../../core/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export class DataScopeController {
  /**
   * GET /api/v1/data-scopes
   * Lấy danh sách tất cả phạm vi dữ liệu
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scopes = await dataScopeService.getAll();
      res.status(200).json({
        success: true,
        data: scopes,
        total: scopes.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/data-scopes/:id
   * Lấy thông tin phạm vi theo ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const scope = await dataScopeService.getById(id);
      res.status(200).json({
        success: true,
        data: scope,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/data-scopes/:id/with-units
   * Lấy phạm vi dữ liệu kèm đơn vị
   */
  getByIdWithUnits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const scope = await dataScopeService.getByIdWithUnits(id);
      res.status(200).json({
        success: true,
        data: scope,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/data-scopes
   * Tạo phạm vi dữ liệu mới
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateDataScopeDto = req.body;

      if (!dto.tenphamvi || !dto.loaiphamvi) {
        throw new BadRequestError('Tên phạm vi và loại phạm vi là bắt buộc');
      }

      const scope = await dataScopeService.create(dto);
      res.status(201).json({
        success: true,
        data: scope,
        message: 'Tạo phạm vi dữ liệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/data-scopes/:id
   * Cập nhật phạm vi dữ liệu
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateDataScopeDto = req.body;

      const scope = await dataScopeService.update(id, dto);
      res.status(200).json({
        success: true,
        data: scope,
        message: 'Cập nhật phạm vi dữ liệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/data-scopes/:id
   * Xóa phạm vi dữ liệu
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await dataScopeService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa phạm vi dữ liệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/data-scopes/:id/units
   * Gán đơn vị cho phạm vi CUSTOM
   */
  assignUnits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { units } = req.body;

      if (!Array.isArray(units)) {
        throw new BadRequestError('units phải là một mảng');
      }

      await dataScopeService.assignUnits(id, units);
      res.status(200).json({
        success: true,
        message: `Đã gán ${units.length} đơn vị cho phạm vi dữ liệu`,
      });
    } catch (error) {
      next(error);
    }
  };

  // ============ User-DataScope endpoints ============

  /**
   * GET /api/v1/data-scopes/user/:userId
   * Lấy phạm vi dữ liệu của user
   */
  getUserDataScopes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const scopes = await dataScopeService.getUserDataScopes(userId);
      res.status(200).json({
        success: true,
        data: scopes,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/data-scopes/user/:userId
   * Gán phạm vi dữ liệu cho user
   */
  setUserDataScopes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { userId } = req.params;
      const { scopeIds } = req.body;

      if (!Array.isArray(scopeIds)) {
        throw new BadRequestError('scopeIds phải là một mảng');
      }

      await dataScopeService.setUserDataScopes(userId, scopeIds, authReq.user?.mataikhoan);
      res.status(200).json({
        success: true,
        message: `Đã gán ${scopeIds.length} phạm vi dữ liệu cho người dùng`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const dataScopeController = new DataScopeController();
