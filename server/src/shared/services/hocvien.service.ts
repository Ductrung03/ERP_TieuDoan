import { hocVienRepository } from '../repositories';
import { HocVien, CreateHocVienDto, UpdateHocVienDto } from '../entities';
import { NotFoundError } from '../../core/errors';

export class HocVienService {
  async getAll(donviId?: string): Promise<HocVien[]> {
    return hocVienRepository.findAll(donviId);
  }

  async getById(id: string): Promise<HocVien> {
    const hocVien = await hocVienRepository.findById(id);
    if (!hocVien) {
      throw new NotFoundError(`Không tìm thấy học viên với mã: ${id}`);
    }
    return hocVien;
  }

  async create(data: CreateHocVienDto): Promise<HocVien> {
    return hocVienRepository.create(data);
  }

  async update(id: string, data: UpdateHocVienDto): Promise<HocVien> {
    await this.getById(id);
    const updated = await hocVienRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy học viên với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await hocVienRepository.delete(id);
  }
}

export const hocVienService = new HocVienService();
