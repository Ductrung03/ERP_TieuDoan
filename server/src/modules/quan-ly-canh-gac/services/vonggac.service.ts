import { vongGacRepository } from '../repositories';
import { VongGac, CreateVongGacDto, UpdateVongGacDto } from '../entities';
import { NotFoundError } from '../../../core/errors';

export class VongGacService {
  async getAll(): Promise<VongGac[]> {
    return vongGacRepository.findAll();
  }

  async getById(id: string): Promise<VongGac> {
    const vongGac = await vongGacRepository.findById(id);
    if (!vongGac) {
      throw new NotFoundError(`Không tìm thấy vòng gác với mã: ${id}`);
    }
    return vongGac;
  }

  async create(data: CreateVongGacDto): Promise<VongGac> {
    return vongGacRepository.create(data);
  }

  async update(id: string, data: UpdateVongGacDto): Promise<VongGac> {
    await this.getById(id);
    const updated = await vongGacRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy vòng gác với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await vongGacRepository.delete(id);
  }
}

export const vongGacService = new VongGacService();
