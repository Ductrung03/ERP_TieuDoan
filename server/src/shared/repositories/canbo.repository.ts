import { db } from '../../core/database/connection';
import { CanBo, CreateCanBoDto, UpdateCanBoDto } from '../entities';

export class CanBoRepository {
  private tableName = 'canbo';

  async findAll(donviId?: string): Promise<CanBo[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (donviId) {
      query += ' WHERE madonvi = $1';
      params.push(donviId);
    }
    
    query += ' ORDER BY hoten';
    
    const result = await db.query<CanBo>(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<CanBo | null> {
    const result = await db.query<CanBo>(
      `SELECT * FROM ${this.tableName} WHERE macanbo = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateCanBoDto): Promise<CanBo> {
    const result = await db.query<CanBo>(
      `INSERT INTO ${this.tableName} (hoten, ngaysinh, diachi, sdt, gmail, thoigianden, madonvi)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.hoten, data.ngaysinh, data.diachi, data.sdt, data.gmail, data.thoigianden, data.madonvi]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateCanBoDto): Promise<CanBo | null> {
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
    if (data.thoigiandi !== undefined) {
      fields.push(`thoigiandi = $${paramIndex++}`);
      values.push(data.thoigiandi);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<CanBo>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE macanbo = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE macanbo = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const canBoRepository = new CanBoRepository();
