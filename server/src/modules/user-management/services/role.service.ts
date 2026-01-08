import { roleRepository } from '../repositories';
import { Role, CreateRoleDto, UpdateRoleDto, RoleWithPermissions } from '../entities';
import { NotFoundError, ConflictError, BadRequestError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class RoleService {
  /**
   * Lấy tất cả vai trò
   */
  async getAll(): Promise<Role[]> {
    return roleRepository.findAll();
  }

  /**
   * Lấy vai trò theo ID
   */
  async getById(id: string): Promise<Role> {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError(`Không tìm thấy vai trò với mã: ${id}`);
    }
    return role;
  }

  /**
   * Lấy vai trò kèm danh sách permissions
   */
  async getByIdWithPermissions(id: string): Promise<RoleWithPermissions> {
    const role = await roleRepository.findByIdWithPermissions(id);
    if (!role) {
      throw new NotFoundError(`Không tìm thấy vai trò với mã: ${id}`);
    }
    return role;
  }

  /**
   * Tạo vai trò mới
   */
  async create(data: CreateRoleDto, nguoitao?: string): Promise<Role> {
    if (!data.tenquyen || data.tenquyen.trim() === '') {
      throw new BadRequestError('Tên vai trò không được để trống');
    }

    return roleRepository.create(data, nguoitao);
  }

  /**
   * Cập nhật vai trò
   */
  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    await this.getById(id);

    const updated = await roleRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy vai trò với mã: ${id}`);
    }
    return updated;
  }

  /**
   * Xóa vai trò
   */
  async delete(id: string): Promise<void> {
    // Không cho xóa các vai trò mặc định
    const protectedRoles = ['VT01', 'VT02', 'VT03', 'VT04'];
    if (protectedRoles.includes(id)) {
      throw new BadRequestError('Không thể xóa vai trò mặc định của hệ thống');
    }

    await this.getById(id);
    await roleRepository.delete(id);
    logger.info(`Deleted role: ${id}`);
  }

  /**
   * Lấy danh sách permissions của vai trò
   */
  async getPermissions(roleId: string): Promise<string[]> {
    await this.getById(roleId);
    return roleRepository.getPermissions(roleId);
  }

  /**
   * Gán permissions cho vai trò
   */
  async assignPermissions(roleId: string, permissionIds: string[], nguoicap?: string): Promise<void> {
    await this.getById(roleId);
    await roleRepository.assignPermissions(roleId, permissionIds, nguoicap);
    logger.info(`Assigned ${permissionIds.length} permissions to role: ${roleId}`);
  }

  /**
   * Thêm một permission vào vai trò
   */
  async addPermission(roleId: string, permissionId: string, nguoicap?: string): Promise<void> {
    await this.getById(roleId);
    await roleRepository.addPermission(roleId, permissionId, nguoicap);
  }

  /**
   * Xóa một permission khỏi vai trò
   */
  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await this.getById(roleId);
    await roleRepository.removePermission(roleId, permissionId);
  }
}

export const roleService = new RoleService();
