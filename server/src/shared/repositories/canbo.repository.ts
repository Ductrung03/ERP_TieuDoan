import { db } from '../../core/database/connection';
import { CanBo, CreateCanBoDto, UpdateCanBoDto } from '../entities';

export class CanBoRepository {
  private tableName = 'canbo';

  async findAll(donviId?: string): Promise<CanBo[]> {
    let query = `
      SELECT 
        cb.*,
        cv.machucvu, cv.tenchucvu,
        qh.maquanham, qh.tenquanham
      FROM ${this.tableName} cb
      LEFT JOIN canbo_chucvu cbcv ON cb.macanbo = cbcv.macanbo AND cbcv.tgketthuc IS NULL
      LEFT JOIN chucvu cv ON cbcv.machucvu = cv.machucvu
      LEFT JOIN canbo_quanham cbqh ON cb.macanbo = cbqh.macanbo AND cbqh.tgketthuc IS NULL
      LEFT JOIN quanham qh ON cbqh.maquanham = qh.maquanham
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (donviId) {
      query += ` AND cb.madonvi = $${params.length + 1}`;
      params.push(donviId);
    }
    
    query += ' ORDER BY cb.hoten';
    
    const result = await db.query<CanBo>(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<CanBo | null> {
    const result = await db.query<CanBo>(
      `SELECT 
        cb.*,
        cv.machucvu, cv.tenchucvu,
        qh.maquanham, qh.tenquanham
      FROM ${this.tableName} cb
      LEFT JOIN canbo_chucvu cbcv ON cb.macanbo = cbcv.macanbo AND cbcv.tgketthuc IS NULL
      LEFT JOIN chucvu cv ON cbcv.machucvu = cv.machucvu
      LEFT JOIN canbo_quanham cbqh ON cb.macanbo = cbqh.macanbo AND cbqh.tgketthuc IS NULL
      LEFT JOIN quanham qh ON cbqh.maquanham = qh.maquanham
      WHERE cb.macanbo = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateCanBoDto): Promise<CanBo> {
    return db.transaction(async (client) => {
        // 1. Insert CanBo
        const insertCanBoQuery = `
            INSERT INTO ${this.tableName} (hoten, ngaysinh, diachi, sdt, gmail, thoigianden, madonvi)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING macanbo, hoten, ngaysinh, diachi, sdt, gmail, thoigianden, madonvi
        `;
        const canBoRes = await client.query<CanBo>(insertCanBoQuery, [
            data.hoten, data.ngaysinh, data.diachi, data.sdt, data.gmail, data.thoigianden, data.madonvi || null
        ]);
        const newCanBo = canBoRes.rows[0];

        // 2. Insert ChucVu
        await client.query(
            `INSERT INTO canbo_chucvu (macanbo, machucvu, tgbonhiem) VALUES ($1, $2, NOW())`,
            [newCanBo.macanbo, data.machucvu]
        );

        // 3. Insert QuanHam
        await client.query(
            `INSERT INTO canbo_quanham (macanbo, maquanham, tgthangquanham) VALUES ($1, $2, NOW())`,
            [newCanBo.macanbo, data.maquanham]
        );

        return this.findById(newCanBo.macanbo) as Promise<CanBo>;
    });
  }

  async update(id: string, data: UpdateCanBoDto): Promise<CanBo | null> {
    return db.transaction(async (client) => {
        // Get current state to check for changes
        const currentData = await this.findById(id);
        if (!currentData) return null;

        // Update CanBo basic info
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (data.hoten !== undefined) { fields.push(`hoten = $${paramIndex++}`); values.push(data.hoten); }
        if (data.ngaysinh !== undefined) { fields.push(`ngaysinh = $${paramIndex++}`); values.push(data.ngaysinh); }
        if (data.diachi !== undefined) { fields.push(`diachi = $${paramIndex++}`); values.push(data.diachi); }
        if (data.sdt !== undefined) { fields.push(`sdt = $${paramIndex++}`); values.push(data.sdt); }
        if (data.gmail !== undefined) { fields.push(`gmail = $${paramIndex++}`); values.push(data.gmail); }
        if (data.thoigianden !== undefined) { fields.push(`thoigianden = $${paramIndex++}`); values.push(data.thoigianden); }
        if (data.thoigiandi !== undefined) { fields.push(`thoigiandi = $${paramIndex++}`); values.push(data.thoigiandi); }
        if (data.madonvi !== undefined) { fields.push(`madonvi = $${paramIndex++}`); values.push(data.madonvi || null); }

        if (fields.length > 0) {
            values.push(id);
            await client.query(
                `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE macanbo = $${paramIndex}`,
                values
            );
        }

        // Update ChucVu if changed and different
        if (data.machucvu && data.machucvu !== currentData.machucvu) {
            // Close old position
            await client.query(
                `UPDATE canbo_chucvu SET tgketthuc = NOW() WHERE macanbo = $1 AND tgketthuc IS NULL`,
                [id]
            );
            // Add new position
            await client.query(
                `INSERT INTO canbo_chucvu (macanbo, machucvu, tgbonhiem) VALUES ($1, $2, NOW())`,
                [id, data.machucvu]
            );
        }

        // Update QuanHam if changed and different
        if (data.maquanham && data.maquanham !== currentData.maquanham) {
             // Close old rank
             await client.query(
                `UPDATE canbo_quanham SET tgketthuc = NOW() WHERE macanbo = $1 AND tgketthuc IS NULL`,
                [id]
            );
            // Add new rank
            await client.query(
                `INSERT INTO canbo_quanham (macanbo, maquanham, tgthangquanham) VALUES ($1, $2, NOW())`,
                [id, data.maquanham]
            );
        }

        return this.findById(id);
    });
  }

  async delete(id: string): Promise<boolean> {
     // Note: If cascading delete is configured in DB, this is simple.
     // If not, we might need to delete from junction tables first.
     // Assuming simple delete or cascade for now based on previous code.
    return db.transaction(async (client) => {
        // 1. Delete from junction tables first
        await client.query(`DELETE FROM canbo_chucvu WHERE macanbo = $1`, [id]);
        await client.query(`DELETE FROM canbo_quanham WHERE macanbo = $1`, [id]);

        // 2. Delete CanBo
        const result = await client.query(
            `DELETE FROM ${this.tableName} WHERE macanbo = $1`,
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    });
  }

  async deleteByDonVi(donviId: string): Promise<number> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE madonvi = $1`,
      [donviId]
    );
    return result.rowCount ?? 0;
  }
}

export const canBoRepository = new CanBoRepository();
