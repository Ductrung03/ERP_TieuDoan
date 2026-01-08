import { canBoRepository } from '../repositories';
import { CanBo, CreateCanBoDto, UpdateCanBoDto } from '../entities';
import { NotFoundError } from '../../core/errors';

export class CanBoService {
  async getAll(donviId?: string): Promise<CanBo[]> {
    return canBoRepository.findAll(donviId);
  }

  async getById(id: string): Promise<CanBo> {
    const canBo = await canBoRepository.findById(id);
    if (!canBo) {
      throw new NotFoundError(`Không tìm thấy cán bộ với mã: ${id}`);
    }
    return canBo;
  }

  async create(data: CreateCanBoDto): Promise<CanBo> {
    return canBoRepository.create(data);
  }

  async update(id: string, data: UpdateCanBoDto): Promise<CanBo> {
    await this.getById(id);
    const updated = await canBoRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy cán bộ với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await canBoRepository.delete(id);
  }
}

export const canBoService = new CanBoService();
