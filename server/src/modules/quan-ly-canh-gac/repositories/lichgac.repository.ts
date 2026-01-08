import { db } from '../../../core/database/connection';
import { LichGac, CreateLichGacDto, UpdateLichGacDto } from '../entities';

export class LichGacRepository {
  private tableName = 'lichgac';

  async findAll(donviId?: string): Promise<LichGac[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (donviId) {
      query += ' WHERE madonvi = $1';
      params.push(donviId);
    }
    
    query += ' ORDER BY ngaygac DESC';
    
    const result = await db.query<LichGac>(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<LichGac | null> {
    const result = await db.query<LichGac>(
      `SELECT * FROM ${this.tableName} WHERE malichgac = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByDate(date: Date, donviId?: string): Promise<LichGac | null> {
    let query = `SELECT * FROM ${this.tableName} WHERE ngaygac = $1`;
    const params: any[] = [date];
    
    if (donviId) {
      query += ' AND madonvi = $2';
      params.push(donviId);
    }
    
    const result = await db.query<LichGac>(query, params);
    return result.rows[0] || null;
  }

  async create(data: CreateLichGacDto): Promise<LichGac> {
    const result = await db.query<LichGac>(
      `INSERT INTO ${this.tableName} (ngaygac, ghichu, matkhauhoi, matkhaudap, madonvi)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.ngaygac, data.ghichu, data.matkhauhoi, data.matkhaudap, data.madonvi]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateLichGacDto): Promise<LichGac | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.ngaygac !== undefined) {
      fields.push(`ngaygac = $${paramIndex++}`);
      values.push(data.ngaygac);
    }
    if (data.ghichu !== undefined) {
      fields.push(`ghichu = $${paramIndex++}`);
      values.push(data.ghichu);
    }
    if (data.matkhauhoi !== undefined) {
      fields.push(`matkhauhoi = $${paramIndex++}`);
      values.push(data.matkhauhoi);
    }
    if (data.matkhaudap !== undefined) {
      fields.push(`matkhaudap = $${paramIndex++}`);
      values.push(data.matkhaudap);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<LichGac>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE malichgac = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE malichgac = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const lichGacRepository = new LichGacRepository();
