import { donViRepository, canBoRepository, hocVienRepository } from '../repositories';
import { DonVi, CreateDonViDto, UpdateDonViDto } from '../entities';
import { NotFoundError, BadRequestError } from '../../core/errors';

export class DonViService {
  async getAll(): Promise<DonVi[]> {
    return donViRepository.findAll();
  }

  async getById(id: string): Promise<DonVi> {
    const donVi = await donViRepository.findById(id);
    if (!donVi) {
      throw new NotFoundError(`Không tìm thấy đơn vị với mã: ${id}`);
    }
    return donVi;
  }

  async getByParent(parentId: string): Promise<DonVi[]> {
    return donViRepository.findByParent(parentId);
  }

  async create(data: CreateDonViDto): Promise<DonVi> {
    return donViRepository.create(data);
  }

  async update(id: string, data: UpdateDonViDto): Promise<DonVi> {
    await this.getById(id);
    const updated = await donViRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy đơn vị với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    try {
      const donVi = await this.getById(id);

      // Cascade Delete Strategy: Delete children and related data first
      
      // 1. Delete all students in this unit
      await hocVienRepository.deleteByDonVi(id);

      // 2. Delete all officers in this unit
      await canBoRepository.deleteByDonVi(id);

      // 3. Handle child units (Recursive delete or just direct children)
      const childUnits = await donViRepository.findByParent(id);
      for (const child of childUnits) {
         // Recursively delete child units to ensure their dependencies are also cleared
         await this.delete(child.madonvi);
      }

      // 4. Delete the unit itself
      await donViRepository.delete(id);
    } catch (error: any) {
      console.error('DonViService Delete Error:', error);
      if (error.code === '23503') {
         throw new BadRequestError('Không thể xóa: Dữ liệu (Cán bộ/Học viên) đang được sử dụng ở chức năng khác (Phân công/Lịch trực).');
      }
      throw error;
    }
  }
}

export const donViService = new DonViService();
