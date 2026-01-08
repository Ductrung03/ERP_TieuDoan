import { db } from '../../../core/database/connection';
import { CaGac, CreateCaGacDto, UpdateCaGacDto } from '../entities';

export class CaGacRepository {
  private tableName = 'cagac';

  async findAll(): Promise<CaGac[]> {
    const result = await db.query<CaGac>(
      `SELECT * FROM ${this.tableName} ORDER BY thoigianbatdau`
    );
    return result.rows;
  }

  async findById(id: string): Promise<CaGac | null> {
    const result = await db.query<CaGac>(
      `SELECT * FROM ${this.tableName} WHERE macagac = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateCaGacDto): Promise<CaGac> {
    const result = await db.query<CaGac>(
      `INSERT INTO ${this.tableName} (thoigianbatdau, thoigianketthuc)
       VALUES ($1, $2)
       RETURNING *`,
      [data.thoigianbatdau, data.thoigianketthuc]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateCaGacDto): Promise<CaGac | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.thoigianbatdau !== undefined) {
      fields.push(`thoigianbatdau = $${paramIndex++}`);
      values.push(data.thoigianbatdau);
    }
    if (data.thoigianketthuc !== undefined) {
      fields.push(`thoigianketthuc = $${paramIndex++}`);
      values.push(data.thoigianketthuc);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<CaGac>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE macagac = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE macagac = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const caGacRepository = new CaGacRepository();
