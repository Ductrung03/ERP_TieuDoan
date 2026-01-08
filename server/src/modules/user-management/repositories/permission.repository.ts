import { db } from '../../../core/database/connection';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionGroup } from '../entities';
import { logger } from '../../../core/logger';

export class PermissionRepository {
  private tableName = 'quyen';

  /**
   * Lấy tất cả permissions
   */
  async findAll(): Promise<Permission[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE trangthai = 'Active'
      ORDER BY mamodule, machucnang, hanhdonh
    `;
    const result = await db.query<Permission>(query);
    return result.rows;
  }

  /**
   * Lấy tất cả permissions (bao gồm inactive)
   */
  async findAllIncludingInactive(): Promise<Permission[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      ORDER BY mamodule, machucnang, hanhdonh
    `;
    const result = await db.query<Permission>(query);
    return result.rows;
  }

  /**
   * Tìm permission theo mã
   */
  async findById(id: string): Promise<Permission | null> {
    const query = `
      SELECT * FROM ${this.tableName} WHERE maquyen = $1
    `;
    const result = await db.query<Permission>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Tìm permissions theo module
   */
  async findByModule(module: string): Promise<Permission[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE mamodule = $1 AND trangthai = 'Active'
      ORDER BY machucnang, hanhdonh
    `;
    const result = await db.query<Permission>(query, [module]);
    return result.rows;
  }

  /**
   * Lấy permissions grouped by module
   */
  async groupByModule(): Promise<PermissionGroup[]> {
    const permissions = await this.findAll();
    
    const groups: { [module: string]: { [feature: string]: Permission[] } } = {};
    
    permissions.forEach((perm) => {
      if (!groups[perm.mamodule]) {
        groups[perm.mamodule] = {};
      }
      if (!groups[perm.mamodule][perm.machucnang]) {
        groups[perm.mamodule][perm.machucnang] = [];
      }
      groups[perm.mamodule][perm.machucnang].push(perm);
    });

    return Object.entries(groups).map(([module, features]) => ({
      module,
      features,
    }));
  }

  /**
   * Tạo permission mới
   */
  async create(data: CreatePermissionDto): Promise<Permission> {
    const query = `
      INSERT INTO ${this.tableName} (tenquyen, mamodule, machucnang, hanhdonh, mota, trangthai)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query<Permission>(query, [
      data.tenquyen,
      data.mamodule,
      data.machucnang,
      data.hanhdonh,
      data.mota,
      data.trangthai || 'Active',
    ]);
    logger.info(`Created new permission: ${data.tenquyen}`);
    return result.rows[0];
  }

  /**
   * Cập nhật permission
   */
  async update(id: string, data: UpdatePermissionDto): Promise<Permission | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tenquyen !== undefined) {
      fields.push(`tenquyen = $${paramIndex++}`);
      values.push(data.tenquyen);
    }
    if (data.mamodule !== undefined) {
      fields.push(`mamodule = $${paramIndex++}`);
      values.push(data.mamodule);
    }
    if (data.machucnang !== undefined) {
      fields.push(`machucnang = $${paramIndex++}`);
      values.push(data.machucnang);
    }
    if (data.hanhdonh !== undefined) {
      fields.push(`hanhdonh = $${paramIndex++}`);
      values.push(data.hanhdonh);
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
    const result = await db.query<Permission>(query, values);
    return result.rows[0] || null;
  }

  /**
   * Xóa permission
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE maquyen = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Kiểm tra permission đã tồn tại (theo module, chức năng, hành động)
   */
  async exists(module: string, feature: string, action: string): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM ${this.tableName} WHERE mamodule = $1 AND machucnang = $2 AND hanhdonh = $3`,
      [module, feature, action]
    );
    return result.rows.length > 0;
  }
}

export const permissionRepository = new PermissionRepository();
