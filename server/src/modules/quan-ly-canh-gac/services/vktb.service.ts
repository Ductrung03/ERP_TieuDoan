import { vktbRepository } from '../repositories';
import { VKTB, CreateVKTBDto, UpdateVKTBDto } from '../entities';
import { NotFoundError } from '../../../core/errors';

export class VKTBService {
  async getAll(loaiId?: string): Promise<VKTB[]> {
    return vktbRepository.findAll(loaiId);
  }

  async getById(id: string): Promise<VKTB> {
    const vktb = await vktbRepository.findById(id);
    if (!vktb) {
      throw new NotFoundError(`Không tìm thấy vũ khí trang bị với mã: ${id}`);
    }
    return vktb;
  }

  async create(data: CreateVKTBDto): Promise<VKTB> {
    return vktbRepository.create(data);
  }

  async update(id: string, data: UpdateVKTBDto): Promise<VKTB> {
    await this.getById(id);
    const updated = await vktbRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy vũ khí trang bị với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await vktbRepository.delete(id);
  }
}

export const vktbService = new VKTBService();
