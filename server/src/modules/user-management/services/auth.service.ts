import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { db } from '../../../core/database/connection';
import { UnauthorizedError } from '../../../core/errors';
import { logger } from '../../../core/logger';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';

export class AuthService {
  private db = db;
  private logger = logger;

  /**
   * Login user và tạo JWT token
   */
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    try {
      // 1. Tìm user theo username
      const query = `
        SELECT
          tk.mataikhoan,
          tk.tendn,
          tk.matkhau,
          tk.salt,
          tk.maquyen,
          tk.madonvi,
          tk.sdt,
          tk.trangthai,
          vt.tenquyen,
          dv.tendonvi
        FROM taikhoan tk
        LEFT JOIN vaitro vt ON tk.maquyen = vt.maquyen
        LEFT JOIN donvi dv ON tk.madonvi = dv.madonvi
        WHERE tk.tendn = $1 AND tk.trangthai = 'Active'
      `;

      const result = await this.db.query(query, [dto.username]);

      if (result.rows.length === 0) {
        this.logger.warn(`Login failed: user not found - ${dto.username}`);
        throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không đúng');
      }

      const user = result.rows[0];

      // 2. Verify password
      const isPasswordValid = await bcrypt.compare(dto.password, user.matkhau);

      if (!isPasswordValid) {
        this.logger.warn(`Login failed: invalid password - ${dto.username}`);
        throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không đúng');
      }

      // 3. Generate JWT token
      const secret = process.env.JWT_SECRET || 'default-secret-key';
      const token = jwt.sign(
        {
          mataikhoan: user.mataikhoan,
          tendn: user.tendn,
          maquyen: user.maquyen,
          madonvi: user.madonvi,
        },
        secret,
        { expiresIn: '24h' }  // Fixed to 24h for now
      );

      // 4. Update last login time
      await this.db.query(
        'UPDATE taikhoan SET landangnhapcuoi = CURRENT_TIMESTAMP WHERE mataikhoan = $1',
        [user.mataikhoan]
      );

      // 5. Log nhật ký truy cập
      await this.db.query(
        `INSERT INTO nhatkytruycap (mataikhoan, hanhdong) VALUES ($1, $2)`,
        [user.mataikhoan, 'Đăng nhập']
      );

      this.logger.info(`User logged in successfully: ${user.tendn} (${user.mataikhoan})`);

      // 6. Return token & user info (không trả về password)
      return {
        success: true,
        token,
        user: {
          mataikhoan: user.mataikhoan,
          tendn: user.tendn,
          maquyen: user.maquyen,
          tenquyen: user.tenquyen,
          madonvi: user.madonvi,
          tendonvi: user.tendonvi,
          sdt: user.sdt,
          trangthai: user.trangthai,
        },
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách quyền của user
   */
  async getUserPermissions(mataikhoan: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT q.maquyen, q.mamodule, q.machucnang, q.hanhdonh
      FROM taikhoan tk
      INNER JOIN vaitro_quyen vq ON tk.maquyen = vq.maquyen_vt
      INNER JOIN quyen q ON vq.maquyen_q = q.maquyen
      WHERE tk.mataikhoan = $1 AND q.trangthai = 'Active'
      ORDER BY q.mamodule, q.machucnang, q.hanhdonh
    `;

    const result = await this.db.query(query, [mataikhoan]);
    return result.rows.map((row: any) => row.maquyen);
  }

  /**
   * Lấy chi tiết quyền của user (grouped by module)
   */
  async getUserPermissionsDetailed(mataikhoan: string): Promise<any> {
    const query = `
      SELECT DISTINCT
        q.maquyen,
        q.tenquyen,
        q.mamodule,
        q.machucnang,
        q.hanhdonh,
        q.mota
      FROM taikhoan tk
      INNER JOIN vaitro_quyen vq ON tk.maquyen = vq.maquyen_vt
      INNER JOIN quyen q ON vq.maquyen_q = q.maquyen
      WHERE tk.mataikhoan = $1 AND q.trangthai = 'Active'
      ORDER BY q.mamodule, q.machucnang, q.hanhdonh
    `;

    const result = await this.db.query(query, [mataikhoan]);

    // Group by module
    const grouped: any = {};
    result.rows.forEach((perm: any) => {
      if (!grouped[perm.mamodule]) {
        grouped[perm.mamodule] = {};
      }
      if (!grouped[perm.mamodule][perm.machucnang]) {
        grouped[perm.mamodule][perm.machucnang] = [];
      }
      grouped[perm.mamodule][perm.machucnang].push(perm.hanhdonh);
    });

    return grouped;
  }

  /**
   * Lấy phạm vi dữ liệu của user
   */
  async getUserDataScopes(mataikhoan: string): Promise<any[]> {
    const query = `
      SELECT
        pv.maphamvi,
        pv.tenphamvi,
        pv.loaiphamvi,
        pv.mota
      FROM taikhoan_phamvi tp
      INNER JOIN phamvidulieu pv ON tp.maphamvi = pv.maphamvi
      WHERE tp.mataikhoan = $1 AND pv.trangthai = 'Active'
    `;

    const result = await this.db.query(query, [mataikhoan]);
    return result.rows;
  }

  /**
   * Kiểm tra user có quyền cụ thể không
   */
  async hasPermission(
    mataikhoan: string,
    module: string,
    feature: string,
    action: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM taikhoan tk
      INNER JOIN vaitro_quyen vq ON tk.maquyen = vq.maquyen_vt
      INNER JOIN quyen q ON vq.maquyen_q = q.maquyen
      WHERE tk.mataikhoan = $1
        AND q.mamodule = $2
        AND q.machucnang = $3
        AND q.hanhdonh = $4
        AND q.trangthai = 'Active'
    `;

    const result = await this.db.query(query, [mataikhoan, module, feature, action]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token đã hết hạn');
      }
      throw new UnauthorizedError('Token không hợp lệ');
    }
  }

  /**
   * Lấy thông tin user hiện tại (dùng cho /me endpoint)
   */
  async getCurrentUser(mataikhoan: string): Promise<any> {
    const query = `
      SELECT
        tk.mataikhoan,
        tk.tendn,
        tk.maquyen,
        tk.madonvi,
        tk.sdt,
        tk.trangthai,
        tk.landangnhapcuoi,
        vt.tenquyen,
        dv.tendonvi
      FROM taikhoan tk
      LEFT JOIN vaitro vt ON tk.maquyen = vt.maquyen
      LEFT JOIN donvi dv ON tk.madonvi = dv.madonvi
      WHERE tk.mataikhoan = $1
    `;

    const result = await this.db.query(query, [mataikhoan]);

    if (result.rows.length === 0) {
      throw new UnauthorizedError('User không tồn tại');
    }

    const user = result.rows[0];

    // Lấy permissions và data scopes
    const permissions = await this.getUserPermissionsDetailed(mataikhoan);
    const dataScopes = await this.getUserDataScopes(mataikhoan);

    return {
      ...user,
      permissions,
      dataScopes,
    };
  }
}
