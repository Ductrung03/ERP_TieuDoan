import { caGacRepository } from '../repositories';
import { CaGac, CreateCaGacDto, UpdateCaGacDto } from '../entities';
import { NotFoundError } from '../../../core/errors';

export class CaGacService {
  async getAll(): Promise<CaGac[]> {
    return caGacRepository.findAll();
  }

  async getById(id: string): Promise<CaGac> {
    const caGac = await caGacRepository.findById(id);
    if (!caGac) {
      throw new NotFoundError(`Không tìm thấy ca gác với mã: ${id}`);
    }
    return caGac;
  }

  async create(data: CreateCaGacDto): Promise<CaGac> {
    return caGacRepository.create(data);
  }

  async update(id: string, data: UpdateCaGacDto): Promise<CaGac> {
    await this.getById(id);
    const updated = await caGacRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy ca gác với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await caGacRepository.delete(id);
  }
}

export const caGacService = new CaGacService();
