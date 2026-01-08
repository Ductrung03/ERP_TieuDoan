import { db } from '../../../core/database/connection';
import { VKTB, CreateVKTBDto, UpdateVKTBDto } from '../entities';

export class VKTBRepository {
  private tableName = 'vktb';

  async findAll(loaiId?: string): Promise<VKTB[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (loaiId) {
      query += ' WHERE maloaivktb = $1';
      params.push(loaiId);
    }
    
    query += ' ORDER BY tenvktb';
    
    const result = await db.query<VKTB>(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<VKTB | null> {
    const result = await db.query<VKTB>(
      `SELECT * FROM ${this.tableName} WHERE mavktb = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateVKTBDto): Promise<VKTB> {
    const result = await db.query<VKTB>(
      `INSERT INTO ${this.tableName} (tenvktb, donvitinh, tinhtrang, ghichu, maloaivktb)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.tenvktb, data.donvitinh, data.tinhtrang, data.ghichu, data.maloaivktb]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateVKTBDto): Promise<VKTB | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tenvktb !== undefined) {
      fields.push(`tenvktb = $${paramIndex++}`);
      values.push(data.tenvktb);
    }
    if (data.donvitinh !== undefined) {
      fields.push(`donvitinh = $${paramIndex++}`);
      values.push(data.donvitinh);
    }
    if (data.tinhtrang !== undefined) {
      fields.push(`tinhtrang = $${paramIndex++}`);
      values.push(data.tinhtrang);
    }
    if (data.ghichu !== undefined) {
      fields.push(`ghichu = $${paramIndex++}`);
      values.push(data.ghichu);
    }
    if (data.maloaivktb !== undefined) {
      fields.push(`maloaivktb = $${paramIndex++}`);
      values.push(data.maloaivktb);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<VKTB>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE mavktb = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE mavktb = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const vktbRepository = new VKTBRepository();
