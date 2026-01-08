import { Request, Response, NextFunction } from 'express';
import { donViService, canBoService, hocVienService } from '../services';
import { ApiResponse } from '../../modules/_loader';

// ==================== DonVi Controller ====================
export class DonViController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await donViService.getAll();
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await donViService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getByParent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parentId } = req.params;
      const data = await donViService.getByParent(parentId);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await donViService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo đơn vị thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await donViService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật đơn vị thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await donViService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa đơn vị thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// ==================== CanBo Controller ====================
export class CanBoController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donviId = req.query.donviId as string | undefined;
      const data = await canBoService.getAll(donviId);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await canBoService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await canBoService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo cán bộ thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await canBoService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật cán bộ thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await canBoService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa cán bộ thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// ==================== HocVien Controller ====================
export class HocVienController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donviId = req.query.donviId as string | undefined;
      const data = await hocVienService.getAll(donviId);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await hocVienService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await hocVienService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo học viên thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await hocVienService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật học viên thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await hocVienService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa học viên thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export const donViController = new DonViController();
export const canBoController = new CanBoController();
export const hocVienController = new HocVienController();
