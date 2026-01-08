import { db } from '../../core/database/connection';
import { DonVi, CreateDonViDto, UpdateDonViDto } from '../entities';

export class DonViRepository {
  private tableName = 'donvi';

  async findAll(): Promise<DonVi[]> {
    const result = await db.query<DonVi>(
      `SELECT * FROM ${this.tableName} ORDER BY tendonvi`
    );
    return result.rows;
  }

  async findById(id: string): Promise<DonVi | null> {
    const result = await db.query<DonVi>(
      `SELECT * FROM ${this.tableName} WHERE madonvi = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByParent(parentId: string): Promise<DonVi[]> {
    const result = await db.query<DonVi>(
      `SELECT * FROM ${this.tableName} WHERE madonvitren = $1 ORDER BY tendonvi`,
      [parentId]
    );
    return result.rows;
  }

  async create(data: CreateDonViDto): Promise<DonVi> {
    const result = await db.query<DonVi>(
      `INSERT INTO ${this.tableName} (tendonvi, tongquanso, kyhieu, madonvitren)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.tendonvi, data.tongquanso || 0, data.kyhieu, data.madonvitren]
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateDonViDto): Promise<DonVi | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tendonvi !== undefined) {
      fields.push(`tendonvi = $${paramIndex++}`);
      values.push(data.tendonvi);
    }
    if (data.tongquanso !== undefined) {
      fields.push(`tongquanso = $${paramIndex++}`);
      values.push(data.tongquanso);
    }
    if (data.kyhieu !== undefined) {
      fields.push(`kyhieu = $${paramIndex++}`);
      values.push(data.kyhieu);
    }
    if (data.madonvitren !== undefined) {
      fields.push(`madonvitren = $${paramIndex++}`);
      values.push(data.madonvitren);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query<DonVi>(
      `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE madonvi = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE madonvi = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const donViRepository = new DonViRepository();
