import { chucVuRepository } from '../repositories/chucvu.repository';
import { ChucVu } from '../entities';

export class ChucVuService {
  async getAll(): Promise<ChucVu[]> {
    return chucVuRepository.findAll();
  }
}

export const chucVuService = new ChucVuService();
