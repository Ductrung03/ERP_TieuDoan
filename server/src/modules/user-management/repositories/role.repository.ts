import { db } from '../../../core/database/connection';
import { Role, CreateRoleDto, UpdateRoleDto, RoleWithPermissions } from '../entities';
import { logger } from '../../../core/logger';

export class RoleRepository {
  private tableName = 'vaitro';
  private rolePermissionTable = 'vaitro_quyen';

  /**
   * Lấy tất cả vai trò
   */
  async findAll(): Promise<Role[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      ORDER BY ngaytao DESC
    `;
    const result = await db.query<Role>(query);
    return result.rows;
  }

  /**
   * Tìm vai trò theo mã
   */
  async findById(id: string): Promise<Role | null> {
    const query = `
      SELECT * FROM ${this.tableName} WHERE maquyen = $1
    `;
    const result = await db.query<Role>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Lấy vai trò kèm danh sách permissions
   */
  async findByIdWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    const role = await this.findById(id);
    if (!role) return null;

    const permissions = await this.getPermissions(id);
    return {
      ...role,
      permissions,
    };
  }

  /**
   * Tạo vai trò mới
   */
  async create(data: CreateRoleDto, nguoitao?: string): Promise<Role> {
    const query = `
      INSERT INTO ${this.tableName} (tenquyen, mota, trangthai, nguoitao)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query<Role>(query, [
      data.tenquyen,
      data.mota,
      data.trangthai || 'Active',
      nguoitao,
    ]);
    logger.info(`Created new role: ${data.tenquyen}`);
    return result.rows[0];
  }

  /**
   * Cập nhật vai trò
   */
  async update(id: string, data: UpdateRoleDto): Promise<Role | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tenquyen !== undefined) {
      fields.push(`tenquyen = $${paramIndex++}`);
      values.push(data.tenquyen);
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
      WHERE maquyen = $${paramIndex}
      RETURNING *
    `;
    const result = await db.query<Role>(query, values);
    return result.rows[0] || null;
  }

  /**
   * Xóa vai trò
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE maquyen = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Lấy danh sách permissions của vai trò
   */
  async getPermissions(roleId: string): Promise<string[]> {
    const query = `
      SELECT maquyen_q FROM ${this.rolePermissionTable}
      WHERE maquyen_vt = $1
    `;
    const result = await db.query<{ maquyen_q: string }>(query, [roleId]);
    return result.rows.map((row) => row.maquyen_q);
  }

  /**
   * Gán permissions cho vai trò (thay thế hoàn toàn)
   */
  async assignPermissions(roleId: string, permissionIds: string[], nguoicap?: string): Promise<void> {
    // Xóa tất cả permissions cũ
    await db.query(`DELETE FROM ${this.rolePermissionTable} WHERE maquyen_vt = $1`, [roleId]);

    // Thêm permissions mới
    if (permissionIds.length > 0) {
      const values: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      permissionIds.forEach((permId) => {
        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(roleId, permId, nguoicap);
      });

      await db.query(
        `INSERT INTO ${this.rolePermissionTable} (maquyen_vt, maquyen_q, nguoicap) VALUES ${values.join(', ')}`,
        params
      );
    }

    logger.info(`Assigned ${permissionIds.length} permissions to role: ${roleId}`);
  }

  /**
   * Thêm một permission vào vai trò
   */
  async addPermission(roleId: string, permissionId: string, nguoicap?: string): Promise<boolean> {
    try {
      await db.query(
        `INSERT INTO ${this.rolePermissionTable} (maquyen_vt, maquyen_q, nguoicap) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [roleId, permissionId, nguoicap]
      );
      return true;
    } catch (error) {
      logger.error('Error adding permission to role:', error);
      return false;
    }
  }

  /**
   * Xóa một permission khỏi vai trò
   */
  async removePermission(roleId: string, permissionId: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.rolePermissionTable} WHERE maquyen_vt = $1 AND maquyen_q = $2`,
      [roleId, permissionId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const roleRepository = new RoleRepository();
