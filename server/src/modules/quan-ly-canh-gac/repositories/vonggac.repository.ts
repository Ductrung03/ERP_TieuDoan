import { db } from '../../../core/database/connection';
import { VongGac, CreateVongGacDto, UpdateVongGacDto } from '../entities';

export class VongGacRepository {
  private tableName = 'vonggac';

  async findAll(): Promise<VongGac[]> {
    const result = await db.query<VongGac>(
      `SELECT * FROM ${this.tableName} ORDER BY tenvonggac`
    );
    return result.rows;
  }

  async findById(id: string): Promise<VongGac | null> {
    const result = await db.query<VongGac>(
      `SELECT * FROM ${this.tableName} WHERE mavonggac = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateVongGacDto): Promise<VongGac> {
    const result = await db.query<VongGac>(
      `INSERT INTO ${this.tableName} (tenvonggac, giobatdau, gioketthuc, mota)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.tenvonggac, data.giobatdau, data.gioketthuc, data.mota]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateVongGacDto): Promise<VongGac | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tenvonggac !== undefined) {
      fields.push(`tenvonggac = $${paramIndex++}`);
      values.push(data.tenvonggac);
    }
    if (data.giobatdau !== undefined) {
      fields.push(`giobatdau = $${paramIndex++}`);
      values.push(data.giobatdau);
    }
    if (data.gioketthuc !== undefined) {
      fields.push(`gioketthuc = $${paramIndex++}`);
      values.push(data.gioketthuc);
    }
    if (data.mota !== undefined) {
      fields.push(`mota = $${paramIndex++}`);
      values.push(data.mota);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<VongGac>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE mavonggac = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE mavonggac = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const vongGacRepository = new VongGacRepository();
