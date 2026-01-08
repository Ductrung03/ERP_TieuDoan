import { db } from '../../core/database/connection';
import { QuanHam } from '../entities';

export class QuanHamRepository {
  private tableName = 'quanham';

  async findAll(): Promise<QuanHam[]> {
    const result = await db.query<QuanHam>(`SELECT * FROM ${this.tableName} ORDER BY maquanham`);
    return result.rows;
  }

  async findByName(name: string): Promise<QuanHam | null> {
    const result = await db.query<QuanHam>(
      `SELECT * FROM ${this.tableName} WHERE tenquanham = $1`,
      [name]
    );
    return result.rows[0] || null;
  }

  async create(tenquanham: string, kyhieu?: string): Promise<QuanHam> {
    const result = await db.query<QuanHam>(
      `INSERT INTO ${this.tableName} (tenquanham, kyhieu) VALUES ($1, $2) RETURNING *`,
      [tenquanham, kyhieu]
    );
    return result.rows[0];
  }
}

export const quanHamRepository = new QuanHamRepository();
