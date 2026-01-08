import { permissionRepository } from '../repositories';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionGroup } from '../entities';
import { NotFoundError, ConflictError, BadRequestError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class PermissionService {
  /**
   * Lấy tất cả permissions
   */
  async getAll(): Promise<Permission[]> {
    return permissionRepository.findAll();
  }

  /**
   * Lấy tất cả permissions (bao gồm inactive)
   */
  async getAllIncludingInactive(): Promise<Permission[]> {
    return permissionRepository.findAllIncludingInactive();
  }

  /**
   * Lấy permission theo ID
   */
  async getById(id: string): Promise<Permission> {
    const perm = await permissionRepository.findById(id);
    if (!perm) {
      throw new NotFoundError(`Không tìm thấy quyền với mã: ${id}`);
    }
    return perm;
  }

  /**
   * Lấy permissions theo module
   */
  async getByModule(module: string): Promise<Permission[]> {
    return permissionRepository.findByModule(module);
  }

  /**
   * Lấy permissions grouped by module
   */
  async getGroupedByModule(): Promise<PermissionGroup[]> {
    return permissionRepository.groupByModule();
  }

  /**
   * Tạo permission mới
   */
  async create(data: CreatePermissionDto): Promise<Permission> {
    // Validate required fields
    if (!data.tenquyen || data.tenquyen.trim() === '') {
      throw new BadRequestError('Tên quyền không được để trống');
    }
    if (!data.mamodule || data.mamodule.trim() === '') {
      throw new BadRequestError('Module không được để trống');
    }
    if (!data.machucnang || data.machucnang.trim() === '') {
      throw new BadRequestError('Chức năng không được để trống');
    }
    if (!data.hanhdonh || data.hanhdonh.trim() === '') {
      throw new BadRequestError('Hành động không được để trống');
    }

    // Check duplicate
    const exists = await permissionRepository.exists(data.mamodule, data.machucnang, data.hanhdonh);
    if (exists) {
      throw new ConflictError(`Quyền với module "${data.mamodule}", chức năng "${data.machucnang}", hành động "${data.hanhdonh}" đã tồn tại`);
    }

    return permissionRepository.create(data);
  }

  /**
   * Cập nhật permission
   */
  async update(id: string, data: UpdatePermissionDto): Promise<Permission> {
    await this.getById(id);

    const updated = await permissionRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy quyền với mã: ${id}`);
    }
    return updated;
  }

  /**
   * Xóa permission
   */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await permissionRepository.delete(id);
    logger.info(`Deleted permission: ${id}`);
  }
}

export const permissionService = new PermissionService();
