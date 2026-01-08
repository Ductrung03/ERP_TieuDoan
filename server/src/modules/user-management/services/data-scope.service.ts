import { dataScopeRepository } from '../repositories';
import { DataScope, CreateDataScopeDto, UpdateDataScopeDto, DataScopeWithUnits } from '../entities';
import { NotFoundError, BadRequestError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class DataScopeService {
  /**
   * Lấy tất cả data scopes
   */
  async getAll(): Promise<DataScope[]> {
    return dataScopeRepository.findAll();
  }

  /**
   * Lấy data scope theo ID
   */
  async getById(id: string): Promise<DataScope> {
    const scope = await dataScopeRepository.findById(id);
    if (!scope) {
      throw new NotFoundError(`Không tìm thấy phạm vi dữ liệu với mã: ${id}`);
    }
    return scope;
  }

  /**
   * Lấy data scope kèm danh sách đơn vị
   */
  async getByIdWithUnits(id: string): Promise<DataScopeWithUnits> {
    const scope = await dataScopeRepository.findByIdWithUnits(id);
    if (!scope) {
      throw new NotFoundError(`Không tìm thấy phạm vi dữ liệu với mã: ${id}`);
    }
    return scope;
  }

  /**
   * Tạo data scope mới
   */
  async create(data: CreateDataScopeDto): Promise<DataScope> {
    // Validate
    if (!data.tenphamvi || data.tenphamvi.trim() === '') {
      throw new BadRequestError('Tên phạm vi không được để trống');
    }

    const validTypes = ['ALL', 'OWN_UNIT', 'SUB_UNITS', 'CUSTOM'];
    if (!validTypes.includes(data.loaiphamvi)) {
      throw new BadRequestError(`Loại phạm vi phải là một trong: ${validTypes.join(', ')}`);
    }

    return dataScopeRepository.create(data);
  }

  /**
   * Cập nhật data scope
   */
  async update(id: string, data: UpdateDataScopeDto): Promise<DataScope> {
    // Không cho sửa các scope mặc định
    const protectedScopes = ['PV001', 'PV002', 'PV003', 'PV004'];
    if (protectedScopes.includes(id)) {
      throw new BadRequestError('Không thể sửa phạm vi dữ liệu mặc định của hệ thống');
    }

    await this.getById(id);

    if (data.loaiphamvi) {
      const validTypes = ['ALL', 'OWN_UNIT', 'SUB_UNITS', 'CUSTOM'];
      if (!validTypes.includes(data.loaiphamvi)) {
        throw new BadRequestError(`Loại phạm vi phải là một trong: ${validTypes.join(', ')}`);
      }
    }

    const updated = await dataScopeRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy phạm vi dữ liệu với mã: ${id}`);
    }
    return updated;
  }

  /**
   * Xóa data scope
   */
  async delete(id: string): Promise<void> {
    // Không cho xóa các scope mặc định
    const protectedScopes = ['PV001', 'PV002', 'PV003', 'PV004'];
    if (protectedScopes.includes(id)) {
      throw new BadRequestError('Không thể xóa phạm vi dữ liệu mặc định của hệ thống');
    }

    await this.getById(id);
    await dataScopeRepository.delete(id);
    logger.info(`Deleted data scope: ${id}`);
  }

  /**
   * Gán đơn vị cho data scope CUSTOM
   */
  async assignUnits(id: string, unitIds: string[]): Promise<void> {
    const scope = await this.getById(id);
    
    if (scope.loaiphamvi !== 'CUSTOM') {
      throw new BadRequestError('Chỉ có thể gán đơn vị cho phạm vi loại CUSTOM');
    }

    await dataScopeRepository.assignUnits(id, unitIds);
    logger.info(`Assigned ${unitIds.length} units to data scope: ${id}`);
  }

  // ============ User-DataScope operations ============

  /**
   * Lấy data scopes của user
   */
  async getUserDataScopes(userId: string): Promise<DataScope[]> {
    return dataScopeRepository.getUserDataScopes(userId);
  }

  /**
   * Gán data scope cho user
   */
  async assignToUser(userId: string, scopeId: string, nguoicap?: string): Promise<void> {
    // Kiểm tra scope tồn tại
    await this.getById(scopeId);
    await dataScopeRepository.assignToUser(userId, scopeId, nguoicap);
  }

  /**
   * Xóa data scope của user
   */
  async removeFromUser(userId: string, scopeId: string): Promise<void> {
    await dataScopeRepository.removeFromUser(userId, scopeId);
  }

  /**
   * Gán data scopes cho user (thay thế hoàn toàn)
   */
  async setUserDataScopes(userId: string, scopeIds: string[], nguoicap?: string): Promise<void> {
    // Validate tất cả scope IDs
    for (const scopeId of scopeIds) {
      await this.getById(scopeId);
    }
    await dataScopeRepository.setUserDataScopes(userId, scopeIds, nguoicap);
  }
}

export const dataScopeService = new DataScopeService();
