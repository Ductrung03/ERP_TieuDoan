import { lichGacRepository } from '../repositories';
import { LichGac, CreateLichGacDto, UpdateLichGacDto } from '../entities';
import { NotFoundError, ConflictError } from '../../../core/errors';

export class LichGacService {
  async getAll(donviId?: string): Promise<LichGac[]> {
    return lichGacRepository.findAll(donviId);
  }

  async getById(id: string): Promise<LichGac> {
    const lichGac = await lichGacRepository.findById(id);
    if (!lichGac) {
      throw new NotFoundError(`Không tìm thấy lịch gác với mã: ${id}`);
    }
    return lichGac;
  }

  async getByDate(date: Date, donviId?: string): Promise<LichGac | null> {
    return lichGacRepository.findByDate(date, donviId);
  }

  async create(data: CreateLichGacDto): Promise<LichGac> {
    // Check if schedule already exists for this date
    const existing = await lichGacRepository.findByDate(data.ngaygac, data.madonvi);
    if (existing) {
      throw new ConflictError(`Lịch gác cho ngày này đã tồn tại`);
    }
    return lichGacRepository.create(data);
  }

  async update(id: string, data: UpdateLichGacDto): Promise<LichGac> {
    await this.getById(id); // Ensure exists
    const updated = await lichGacRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy lịch gác với mã: ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Ensure exists
    await lichGacRepository.delete(id);
  }
}

export const lichGacService = new LichGacService();
