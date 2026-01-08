import { db } from '../../../core/database/connection';
import { PhanCongGac, CreatePhanCongGacDto, PhanCongGacDetail } from '../entities';

export class PhanCongGacRepository {
  private tableName = 'pcgac';

  async findAll(): Promise<PhanCongGac[]> {
    const result = await db.query<PhanCongGac>(
      `SELECT * FROM ${this.tableName}`
    );
    return result.rows;
  }

  async findById(id: string): Promise<PhanCongGac | null> {
    const result = await db.query<PhanCongGac>(
      `SELECT * FROM ${this.tableName} WHERE mapc = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByLichGac(lichGacId: string): Promise<PhanCongGacDetail[]> {
    const result = await db.query<PhanCongGacDetail>(
      `SELECT 
        pc.*,
        hv.hoten as tenhocvien,
        vg.tenvonggac,
        lg.ngaygac
       FROM ${this.tableName} pc
       LEFT JOIN hocvien hv ON pc.mahocvien = hv.mahocvien
       LEFT JOIN vonggac vg ON pc.mavonggac = vg.mavonggac
       LEFT JOIN lichgac lg ON pc.malichgac = lg.malichgac
       WHERE pc.malichgac = $1
       ORDER BY vg.tenvonggac`,
      [lichGacId]
    );
    return result.rows;
  }

  async create(data: CreatePhanCongGacDto): Promise<PhanCongGac> {
    const result = await db.query<PhanCongGac>(
      `INSERT INTO ${this.tableName} (mahocvien, macagac, mavonggac, malichgac)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.mahocvien, data.macagac, data.mavonggac, data.malichgac]
    );
    return result.rows[0];
  }

  async createBulk(assignments: CreatePhanCongGacDto[]): Promise<PhanCongGac[]> {
    const results: PhanCongGac[] = [];
    
    await db.transaction(async (client) => {
      for (const data of assignments) {
        const result = await client.query<PhanCongGac>(
          `INSERT INTO ${this.tableName} (mahocvien, macagac, mavonggac, malichgac)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [data.mahocvien, data.macagac, data.mavonggac, data.malichgac]
        );
        results.push(result.rows[0]);
      }
    });
    
    return results;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE mapc = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async deleteByLichGac(lichGacId: string): Promise<number> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE malichgac = $1`,
      [lichGacId]
    );
    return result.rowCount ?? 0;
  }
}

export const phanCongGacRepository = new PhanCongGacRepository();
