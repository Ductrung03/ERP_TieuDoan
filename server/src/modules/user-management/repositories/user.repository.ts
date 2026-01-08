import bcrypt from 'bcryptjs';
import { db } from '../../../core/database/connection';
import { User, UserWithoutPassword, CreateUserDto, UpdateUserDto } from '../entities';
import { logger } from '../../../core/logger';

export class UserRepository {
  private tableName = 'taikhoan';

  /**
   * Lấy tất cả users với thông tin vai trò và đơn vị
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    const query = `
      SELECT 
        tk.mataikhoan,
        tk.tendn,
        tk.sdt,
        tk.landangnhapcuoi,
        tk.trangthai,
        tk.ngaytao,
        tk.maquyen,
        tk.madonvi,
        vt.tenquyen,
        dv.tendonvi
      FROM ${this.tableName} tk
      LEFT JOIN vaitro vt ON tk.maquyen = vt.maquyen
      LEFT JOIN donvi dv ON tk.madonvi = dv.madonvi
      ORDER BY tk.ngaytao DESC
    `;
    const result = await db.query<UserWithoutPassword>(query);
    return result.rows;
  }

  /**
   * Tìm user theo mã tài khoản
   */
  async findById(id: string): Promise<UserWithoutPassword | null> {
    const query = `
      SELECT 
        tk.mataikhoan,
        tk.tendn,
        tk.sdt,
        tk.landangnhapcuoi,
        tk.trangthai,
        tk.ngaytao,
        tk.maquyen,
        tk.madonvi,
        vt.tenquyen,
        dv.tendonvi
      FROM ${this.tableName} tk
      LEFT JOIN vaitro vt ON tk.maquyen = vt.maquyen
      LEFT JOIN donvi dv ON tk.madonvi = dv.madonvi
      WHERE tk.mataikhoan = $1
    `;
    const result = await db.query<UserWithoutPassword>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Tìm user theo tên đăng nhập
   */
  async findByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT * FROM ${this.tableName} WHERE tendn = $1
    `;
    const result = await db.query<User>(query, [username]);
    return result.rows[0] || null;
  }

  /**
   * Tạo user mới
   */
  async create(data: CreateUserDto): Promise<UserWithoutPassword> {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.matkhau, salt);

    const query = `
      INSERT INTO ${this.tableName} (tendn, matkhau, salt, sdt, maquyen, madonvi, trangthai)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING mataikhoan, tendn, sdt, landangnhapcuoi, trangthai, ngaytao, maquyen, madonvi
    `;
    const result = await db.query<UserWithoutPassword>(query, [
      data.tendn,
      hashedPassword,
      salt,
      data.sdt,
      data.maquyen,
      data.madonvi,
      data.trangthai || 'Active',
    ]);
    logger.info(`Created new user: ${data.tendn}`);
    return result.rows[0];
  }

  /**
   * Cập nhật user
   */
  async update(id: string, data: UpdateUserDto): Promise<UserWithoutPassword | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.tendn !== undefined) {
      fields.push(`tendn = $${paramIndex++}`);
      values.push(data.tendn);
    }
    if (data.sdt !== undefined) {
      fields.push(`sdt = $${paramIndex++}`);
      values.push(data.sdt);
    }
    if (data.maquyen !== undefined) {
      fields.push(`maquyen = $${paramIndex++}`);
      values.push(data.maquyen);
    }
    if (data.madonvi !== undefined) {
      fields.push(`madonvi = $${paramIndex++}`);
      values.push(data.madonvi);
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
      WHERE mataikhoan = $${paramIndex}
      RETURNING mataikhoan, tendn, sdt, landangnhapcuoi, trangthai, ngaytao, maquyen, madonvi
    `;
    const result = await db.query<UserWithoutPassword>(query, values);
    return result.rows[0] || null;
  }

  /**
   * Xóa user
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM ${this.tableName} WHERE mataikhoan = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await db.query(
      `UPDATE ${this.tableName} SET matkhau = $1, salt = $2 WHERE mataikhoan = $3`,
      [hashedPassword, salt, id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Khóa/mở khóa tài khoản
   */
  async toggleStatus(id: string, status: 'Active' | 'Inactive'): Promise<boolean> {
    const result = await db.query(
      `UPDATE ${this.tableName} SET trangthai = $1 WHERE mataikhoan = $2`,
      [status, id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Kiểm tra username đã tồn tại chưa
   */
  async existsByUsername(username: string): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM ${this.tableName} WHERE tendn = $1`,
      [username]
    );
    return result.rows.length > 0;
  }
}

export const userRepository = new UserRepository();
