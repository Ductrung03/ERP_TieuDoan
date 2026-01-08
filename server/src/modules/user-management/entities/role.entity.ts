/**
 * Entity: Role (Vai trò)
 * Bảng: vaitro
 * Module: User Management
 */
export interface Role {
  maquyen: string;
  tenquyen: string;
  mota?: string;
  trangthai: string;
  ngaytao: Date;
  nguoitao?: string;
}

export interface CreateRoleDto {
  tenquyen: string;
  mota?: string;
  trangthai?: string;
}

export interface UpdateRoleDto {
  tenquyen?: string;
  mota?: string;
  trangthai?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: string[]; // Array of maquyen from quyen table
}
