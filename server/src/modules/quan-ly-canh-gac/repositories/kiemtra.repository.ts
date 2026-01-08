import { db } from '../../../core/database/connection';
import { KiemTraGac, CreateKiemTraGacDto, UpdateKiemTraGacDto } from '../entities';

export class KiemTraGacRepository {
  private tableName = 'kiemtragac';

  async findAll(): Promise<KiemTraGac[]> {
    const result = await db.query<KiemTraGac>(
      `SELECT * FROM ${this.tableName} ORDER BY ngay DESC`
    );
    return result.rows;
  }

  async findById(id: string): Promise<KiemTraGac | null> {
    const result = await db.query<KiemTraGac>(
      `SELECT * FROM ${this.tableName} WHERE maktgac = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByDate(date: Date): Promise<KiemTraGac[]> {
    const result = await db.query<KiemTraGac>(
      `SELECT * FROM ${this.tableName} WHERE ngay = $1`,
      [date]
    );
    return result.rows;
  }

  async create(data: CreateKiemTraGacDto): Promise<KiemTraGac> {
    const result = await db.query<KiemTraGac>(
      `INSERT INTO ${this.tableName} (ngay, trangthai, nhiemvuhocvien, macagac, mavp, macanbo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.ngay, data.trangthai, data.nhiemvuhocvien, data.macagac, data.mavp, data.macanbo]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateKiemTraGacDto): Promise<KiemTraGac | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.trangthai !== undefined) {
      fields.push(`trangthai = $${paramIndex++}`);
      values.push(data.trangthai);
    }
    if (data.nhiemvuhocvien !== undefined) {
      fields.push(`nhiemvuhocvien = $${paramIndex++}`);
      values.push(data.nhiemvuhocvien);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<KiemTraGac>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE maktgac = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE maktgac = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const kiemTraGacRepository = new KiemTraGacRepository();
