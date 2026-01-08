import { db } from '../../core/database/connection';
import { HocVien, CreateHocVienDto, UpdateHocVienDto } from '../entities';

export class HocVienRepository {
  private tableName = 'hocvien';

  async findAll(donviId?: string): Promise<HocVien[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (donviId) {
      query += ' WHERE madonvi = $1';
      params.push(donviId);
    }
    
    query += ' ORDER BY hoten';
    
    const result = await db.query<HocVien>(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<HocVien | null> {
    const result = await db.query<HocVien>(
      `SELECT * FROM ${this.tableName} WHERE mahocvien = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateHocVienDto): Promise<HocVien> {
    const result = await db.query<HocVien>(
      `INSERT INTO ${this.tableName} (hoten, ngaysinh, diachi, sdt, gmail, madonvi)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.hoten, data.ngaysinh, data.diachi, data.sdt, data.gmail, data.madonvi]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateHocVienDto): Promise<HocVien | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.hoten !== undefined) {
      fields.push(`hoten = $${paramIndex++}`);
      values.push(data.hoten);
    }
    if (data.ngaysinh !== undefined) {
      fields.push(`ngaysinh = $${paramIndex++}`);
      values.push(data.ngaysinh);
    }
    if (data.diachi !== undefined) {
      fields.push(`diachi = $${paramIndex++}`);
      values.push(data.diachi);
    }
    if (data.sdt !== undefined) {
      fields.push(`sdt = $${paramIndex++}`);
      values.push(data.sdt);
    }
    if (data.gmail !== undefined) {
      fields.push(`gmail = $${paramIndex++}`);
      values.push(data.gmail);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<HocVien>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE mahocvien = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE mahocvien = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const hocVienRepository = new HocVienRepository();
