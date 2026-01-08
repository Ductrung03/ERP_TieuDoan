import { Request, Response, NextFunction } from 'express';
import { caGacService, vongGacService, phanCongGacService, kiemTraGacService, vktbService } from '../services';
import { ApiResponse } from '../../_loader';

// Ca Gác Controller
export class CaGacController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await caGacService.getAll();
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await caGacService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await caGacService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo ca gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await caGacService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật ca gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await caGacService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa ca gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// Vòng Gác Controller
export class VongGacController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vongGacService.getAll();
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vongGacService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vongGacService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo vòng gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vongGacService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật vòng gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vongGacService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa vòng gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// Phân Công Gác Controller
export class PhanCongGacController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await phanCongGacService.getAll();
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getByLichGac(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lichGacId } = req.params;
      const data = await phanCongGacService.getByLichGac(lichGacId);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await phanCongGacService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Phân công thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async createBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await phanCongGacService.createBulk(req.body.assignments);
      res.status(201).json({ 
        success: true, 
        data, 
        message: `Đã phân công ${data.length} nhiệm vụ` 
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await phanCongGacService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa phân công thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// Kiểm Tra Gác Controller
export class KiemTraGacController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await kiemTraGacService.getAll();
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await kiemTraGacService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await kiemTraGacService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo kiểm tra gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await kiemTraGacService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật kiểm tra gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await kiemTraGacService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa kiểm tra gác thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

// VKTB Controller
export class VKTBController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loaiId = req.query.loaiId as string | undefined;
      const data = await vktbService.getAll(loaiId);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vktbService.getById(req.params.id);
      res.json({ success: true, data } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vktbService.create(req.body);
      res.status(201).json({ success: true, data, message: 'Tạo VKTB thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vktbService.update(req.params.id, req.body);
      res.json({ success: true, data, message: 'Cập nhật VKTB thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vktbService.delete(req.params.id);
      res.json({ success: true, message: 'Xóa VKTB thành công' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export const caGacController = new CaGacController();
export const vongGacController = new VongGacController();
export const phanCongGacController = new PhanCongGacController();
export const kiemTraGacController = new KiemTraGacController();
export const vktbController = new VKTBController();
