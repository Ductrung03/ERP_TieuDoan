import { db } from '../../../core/database/connection';
import { DataScope, CreateDataScopeDto, UpdateDataScopeDto, DataScopeWithUnits, UserDataScope } from '../entities';
import { logger } from '../../../core/logger';

export class DataScopeRepository {
  private tableName = 'phamvidulieu';
  private userScopeTable = 'taikhoan_phamvi';
  private scopeUnitsTable = 'phamvi_donvi';

  /**
   * Lấy tất cả data scopes
   */
  async findAll(): Promise<DataScope[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE trangthai = 'Active'
      ORDER BY ngaytao DESC
    `;
    const result = await db.query<DataScope>(query);
    return result.rows;
  }

  /**
   * Tìm data scope theo mã
   */
  async findById(id: string): Promise<DataScope | null> {
    const query = `
      SELECT * FROM ${this.tableName} WHERE maphamvi = $1
    `;
    const result = await db.query<DataScope>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Lấy data scope kèm danh sách đơn vị (cho CUSTOM type)
   */
  async findByIdWithUnits(id: string): Promise<DataScopeWithUnits | null> {
    const scope = await this.findById(id);
    if (!scope) return null;

    const units = await this.getUnits(id);
    return {
      ...scope,
      units,
    };
  }

  /**
   * Tạo data scope mới
   */
  async create(data: CreateDataScopeDto): Promise<DataScope> {
    const query = `
      INSERT INTO ${this.tableName} (tenphamvi, loaiphamvi, mota, trangthai)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query<DataScope>(query, [
      data.tenphamvi,
      data.loaiphamvi,
      data.mota,
      data.trangthai || 'Active',
    ]);
    logger.info(`Created new data scope: ${data.tenphamvi}`);
    return result.rows[0];
  }

  /**
   * Cập nhật data scope
   */
  async update(id: string, data: UpdateDataScopeDto): Promise<DataScope | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tenphamvi !== undefined) {
      fields.push(`tenphamvi = $${paramIndex++}`);
      values.push(data.tenphamvi);
    }
    if (data.loaiphamvi !== undefined) {
      fields.push(`loaiphamvi = $${paramIndex++}`);
      values.push(data.loaiphamvi);
    }
    if (data.mota !== undefined) {
      fields.push(`mota = $${paramIndex++}`);
      values.push(data.mota);
    }
    if (data.trangthai !== undefined) {
      fields.push(`trangthai = $${paramIndex++}`);
      values.push(data.trangthai);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
      UPDATE ${this.tableName} 
      SET ${fields.join(', ')} 
      WHERE maphamvi = $${paramIndex}
      RETURNING *
    `;
    const result = await db.query<DataScope>(query, values);
    return result.rows[0] || null;
  }

  /**
   * Xóa data scope
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE maphamvi = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Lấy danh sách đơn vị trong data scope CUSTOM
   */
  async getUnits(scopeId: string): Promise<string[]> {
    const query = `
      SELECT madonvi FROM ${this.scopeUnitsTable}
      WHERE maphamvi = $1
    `;
    const result = await db.query<{ madonvi: string }>(query, [scopeId]);
    return result.rows.map((row) => row.madonvi);
  }

  /**
   * Gán đơn vị cho data scope CUSTOM
   */
  async assignUnits(scopeId: string, unitIds: string[]): Promise<void> {
    // Xóa tất cả đơn vị cũ
    await db.query(`DELETE FROM ${this.scopeUnitsTable} WHERE maphamvi = $1`, [scopeId]);

    // Thêm đơn vị mới
    if (unitIds.length > 0) {
      const values: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      unitIds.forEach((unitId) => {
        values.push(`($${paramIndex++}, $${paramIndex++})`);
        params.push(scopeId, unitId);
      });

      await db.query(
        `INSERT INTO ${this.scopeUnitsTable} (maphamvi, madonvi) VALUES ${values.join(', ')}`,
        params
      );
    }

    logger.info(`Assigned ${unitIds.length} units to data scope: ${scopeId}`);
  }

  // ============ User-DataScope mapping ============

  /**
   * Lấy data scopes của user
   */
  async getUserDataScopes(userId: string): Promise<DataScope[]> {
    const query = `
      SELECT pv.*
      FROM ${this.userScopeTable} up
      INNER JOIN ${this.tableName} pv ON up.maphamvi = pv.maphamvi
      WHERE up.mataikhoan = $1 AND pv.trangthai = 'Active'
    `;
    const result = await db.query<DataScope>(query, [userId]);
    return result.rows;
  }

  /**
   * Gán data scope cho user
   */
  async assignToUser(userId: string, scopeId: string, nguoicap?: string): Promise<boolean> {
    try {
      await db.query(
        `INSERT INTO ${this.userScopeTable} (mataikhoan, maphamvi, nguoicap) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [userId, scopeId, nguoicap]
      );
      return true;
    } catch (error) {
      logger.error('Error assigning data scope to user:', error);
      return false;
    }
  }

  /**
   * Xóa data scope của user
   */
  async removeFromUser(userId: string, scopeId: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.userScopeTable} WHERE mataikhoan = $1 AND maphamvi = $2`,
      [userId, scopeId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Gán data scope cho user (thay thế hoàn toàn)
   */
  async setUserDataScopes(userId: string, scopeIds: string[], nguoicap?: string): Promise<void> {
    // Xóa tất cả scopes cũ
    await db.query(`DELETE FROM ${this.userScopeTable} WHERE mataikhoan = $1`, [userId]);

    // Thêm scopes mới
    if (scopeIds.length > 0) {
      const values: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      scopeIds.forEach((scopeId) => {
        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(userId, scopeId, nguoicap);
      });

      await db.query(
        `INSERT INTO ${this.userScopeTable} (mataikhoan, maphamvi, nguoicap) VALUES ${values.join(', ')}`,
        params
      );
    }

    logger.info(`Set ${scopeIds.length} data scopes for user: ${userId}`);
  }
}

export const dataScopeRepository = new DataScopeRepository();
