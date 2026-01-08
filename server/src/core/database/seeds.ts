import { quanHamRepository } from '../../shared/repositories/quanham.repository';
import { chucVuRepository } from '../../shared/repositories/chucvu.repository';
import { logger } from '../logger';
import { seedOfficers } from './officer_seeder';

export const seedDatabase = async () => {
  try {
    // Seed QuanHam
    const quanHams = [
      'Thiếu úy', 'Trung úy', 'Thượng úy', 'Đại úy',
      'Thiếu tá', 'Trung tá', 'Thượng tá'
    ];

    for (const qh of quanHams) {
      const exists = await quanHamRepository.findByName(qh);
      if (!exists) {
        await quanHamRepository.create(qh);
        logger.info(`Seeding: Created QuanHam ${qh}`);
      }
    }

    // Seed ChucVu
    const chucVus = [
      'Trợ lý', 'Đại đội trưởng', 'Đại đội phó',
      'Chính trị viên phó', 'Chính trị viên',
      'Phó tiểu đoàn trưởng', 'Chính trị viên phó tiểu đoàn',
      'Học viên', 'Lớp trưởng'
    ];

    for (const cv of chucVus) {
      const exists = await chucVuRepository.findByName(cv);
      if (!exists) {
        await chucVuRepository.create(cv);
        logger.info(`Seeding: Created ChucVu ${cv}`);
      }
    }

    // Seed Officers (Battalion & Company)
    await seedOfficers();

    logger.info('Database seeding completed.');
  } catch (error) {
    logger.error('Database seeding failed:', error);
  }
};
