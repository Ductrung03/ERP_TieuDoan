import { db } from '../../core/database/connection';
import { ChucVu } from '../entities';

export class ChucVuRepository {
  private tableName = 'chucvu';

  async findAll(): Promise<ChucVu[]> {
    const result = await db.query<ChucVu>(`SELECT * FROM ${this.tableName} ORDER BY machucvu`);
    return result.rows;
  }

  async findByName(name: string): Promise<ChucVu | null> {
    const result = await db.query<ChucVu>(
      `SELECT * FROM ${this.tableName} WHERE tenchucvu = $1`,
      [name]
    );
    return result.rows[0] || null;
  }

  async create(tenchucvu: string, kyhieu?: string): Promise<ChucVu> {
    const result = await db.query<ChucVu>(
      `INSERT INTO ${this.tableName} (tenchucvu, kyhieu) VALUES ($1, $2) RETURNING *`,
      [tenchucvu, kyhieu]
    );
    return result.rows[0];
  }
}

export const chucVuRepository = new ChucVuRepository();
