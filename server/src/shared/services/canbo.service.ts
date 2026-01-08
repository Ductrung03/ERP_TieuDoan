import { canBoRepository } from '../repositories';
import { CanBo, CreateCanBoDto, UpdateCanBoDto } from '../entities';
import { NotFoundError, BadRequestError } from '../../core/errors';

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
    if (!data.machucvu) throw new BadRequestError('Vui lòng chọn chức vụ');
    if (!data.maquanham) throw new BadRequestError('Vui lòng chọn quân hàm');
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
    try {
      await canBoRepository.delete(id);
    } catch (error: any) {
      if (error.code === '23503') { // ForeignKeyViolation in Postgres
        throw new BadRequestError('Không thể xóa cán bộ này vì dữ liệu đang được sử dụng ở chức năng khác (VD: Lịch trực, Phân công).');
      }
      throw error;
    }
  }
}

export const canBoService = new CanBoService();
