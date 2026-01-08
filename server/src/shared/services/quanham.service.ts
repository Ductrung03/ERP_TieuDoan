import { quanHamRepository } from '../repositories/quanham.repository';
import { QuanHam } from '../entities';

export class QuanHamService {
  async getAll(): Promise<QuanHam[]> {
    return quanHamRepository.findAll();
  }
}

export const quanHamService = new QuanHamService();
