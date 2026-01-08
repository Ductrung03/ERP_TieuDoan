import { donViRepository } from '../repositories';
import { DonVi, CreateDonViDto, UpdateDonViDto } from '../entities';
import { NotFoundError } from '../../core/errors';

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
    await this.getById(id);
    await donViRepository.delete(id);
  }
}

export const donViService = new DonViService();
