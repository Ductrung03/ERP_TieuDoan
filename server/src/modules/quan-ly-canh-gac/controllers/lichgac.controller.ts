import { Request, Response, NextFunction } from 'express';
import { lichGacService } from '../services';
import { ApiResponse } from '../../_loader';

export class LichGacController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donviId = req.query.donviId as string | undefined;
      const lichGacs = await lichGacService.getAll(donviId);
      
      const response: ApiResponse = {
        success: true,
        data: lichGacs,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lichGac = await lichGacService.getById(id);
      
      const response: ApiResponse = {
        success: true,
        data: lichGac,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lichGac = await lichGacService.create(req.body);
      
      const response: ApiResponse = {
        success: true,
        data: lichGac,
        message: 'Tạo lịch gác thành công',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lichGac = await lichGacService.update(id, req.body);
      
      const response: ApiResponse = {
        success: true,
        data: lichGac,
        message: 'Cập nhật lịch gác thành công',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await lichGacService.delete(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Xóa lịch gác thành công',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const lichGacController = new LichGacController();
