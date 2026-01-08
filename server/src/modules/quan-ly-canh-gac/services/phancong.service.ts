import { phanCongGacRepository } from '../repositories';
import { PhanCongGac, CreatePhanCongGacDto, PhanCongGacDetail } from '../entities';
import { NotFoundError } from '../../../core/errors';

export class PhanCongGacService {
  async getAll(): Promise<PhanCongGac[]> {
    return phanCongGacRepository.findAll();
  }

  async getById(id: string): Promise<PhanCongGac> {
    const phanCong = await phanCongGacRepository.findById(id);
    if (!phanCong) {
      throw new NotFoundError(`Không tìm thấy phân công với mã: ${id}`);
    }
    return phanCong;
  }

  async getByLichGac(lichGacId: string): Promise<PhanCongGacDetail[]> {
    return phanCongGacRepository.findByLichGac(lichGacId);
  }

  async create(data: CreatePhanCongGacDto): Promise<PhanCongGac> {
    return phanCongGacRepository.create(data);
  }

  async createBulk(assignments: CreatePhanCongGacDto[]): Promise<PhanCongGac[]> {
    return phanCongGacRepository.createBulk(assignments);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await phanCongGacRepository.delete(id);
  }

  async deleteByLichGac(lichGacId: string): Promise<number> {
    return phanCongGacRepository.deleteByLichGac(lichGacId);
  }
}

export const phanCongGacService = new PhanCongGacService();
