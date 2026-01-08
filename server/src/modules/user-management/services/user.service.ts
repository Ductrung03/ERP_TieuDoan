import { userRepository } from '../repositories';
import { User, UserWithoutPassword, CreateUserDto, UpdateUserDto } from '../entities';
import { NotFoundError, ConflictError, BadRequestError } from '../../../core/errors';
import { logger } from '../../../core/logger';
import bcrypt from 'bcryptjs';

export class UserService {
  /**
   * Lấy tất cả users
   */
  async getAll(): Promise<UserWithoutPassword[]> {
    return userRepository.findAll();
  }

  /**
   * Lấy user theo ID
   */
  async getById(id: string): Promise<UserWithoutPassword> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Không tìm thấy người dùng với mã: ${id}`);
    }
    return user;
  }

  /**
   * Tạo user mới
   */
  async create(data: CreateUserDto): Promise<UserWithoutPassword> {
    // Validate username unique
    const exists = await userRepository.existsByUsername(data.tendn);
    if (exists) {
      throw new ConflictError(`Tên đăng nhập "${data.tendn}" đã tồn tại`);
    }

    // Validate password length
    if (data.matkhau.length < 6) {
      throw new BadRequestError('Mật khẩu phải có ít nhất 6 ký tự');
    }

    return userRepository.create(data);
  }

  /**
   * Cập nhật user
   */
  async update(id: string, data: UpdateUserDto): Promise<UserWithoutPassword> {
    // Kiểm tra user tồn tại
    await this.getById(id);

    // Nếu đổi username, kiểm tra unique
    if (data.tendn) {
      const existing = await userRepository.findByUsername(data.tendn);
      if (existing && existing.mataikhoan !== id) {
        throw new ConflictError(`Tên đăng nhập "${data.tendn}" đã tồn tại`);
      }
    }

    const updated = await userRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy người dùng với mã: ${id}`);
    }
    return updated;
  }

  /**
   * Xóa user
   */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await userRepository.delete(id);
    logger.info(`Deleted user: ${id}`);
  }

  /**
   * Reset mật khẩu
   */
  async resetPassword(id: string, newPassword: string): Promise<void> {
    await this.getById(id);

    if (newPassword.length < 6) {
      throw new BadRequestError('Mật khẩu phải có ít nhất 6 ký tự');
    }

    await userRepository.changePassword(id, newPassword);
    logger.info(`Password reset for user: ${id}`);
  }

  /**
   * Đổi mật khẩu (cần verify mật khẩu cũ)
   */
  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
    // Lấy user với password
    const user = await userRepository.findByUsername(
      ((await userRepository.findById(id))?.tendn) || ''
    );

    if (!user) {
      throw new NotFoundError(`Không tìm thấy người dùng với mã: ${id}`);
    }

    // Verify mật khẩu cũ
    const isValid = await bcrypt.compare(oldPassword, user.matkhau);
    if (!isValid) {
      throw new BadRequestError('Mật khẩu cũ không đúng');
    }

    if (newPassword.length < 6) {
      throw new BadRequestError('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    await userRepository.changePassword(id, newPassword);
    logger.info(`Password changed for user: ${id}`);
  }

  /**
   * Khóa/mở khóa tài khoản
   */
  async toggleStatus(id: string, status: 'Active' | 'Inactive'): Promise<void> {
    await this.getById(id);
    await userRepository.toggleStatus(id, status);
    logger.info(`User ${id} status changed to: ${status}`);
  }
}

export const userService = new UserService();
