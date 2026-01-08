import { kiemTraGacRepository } from '../repositories';
import { KiemTraGac, CreateKiemTraGacDto, UpdateKiemTraGacDto } from '../entities';
import { NotFoundError } from '../../../core/errors';

export class KiemTraGacService {
  async getAll(): Promise<KiemTraGac[]> {
    return kiemTraGacRepository.findAll();
  }

  async getById(id: string): Promise<KiemTraGac> {
    const kiemTra = await kiemTraGacRepository.findById(id);
    if (!kiemTra) {
      throw new NotFoundError(`Không tìm thấy kiểm tra gác với mã: ${id}`);
    }
    return kiemTra;
  }

  async getByDate(date: Date): Promise<KiemTraGac[]> {
    return kiemTraGacRepository.findByDate(date);
  }

  async create(data: CreateKiemTraGacDto): Promise<KiemTraGac> {
    return kiemTraGacRepository.create(data);
  }

  async update(id: string, data: UpdateKiemTraGacDto): Promise<KiemTraGac> {
    await this.getById(id);
    const updated = await kiemTraGacRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy kiểm tra gác với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await kiemTraGacRepository.delete(id);
  }
}

export const kiemTraGacService = new KiemTraGacService();
