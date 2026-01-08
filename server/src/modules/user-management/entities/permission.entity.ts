/**
 * Entity: Permission (Quyền)
 * Bảng: quyen
 * Module: User Management
 */
export interface Permission {
  maquyen: string;
  tenquyen: string;
  mamodule: string;
  machucnang: string;
  hanhdonh: string;
  mota?: string;
  trangthai: string;
  ngaytao: Date;
}

export interface CreatePermissionDto {
  tenquyen: string;
  mamodule: string;
  machucnang: string;
  hanhdonh: string;
  mota?: string;
  trangthai?: string;
}

export interface UpdatePermissionDto {
  tenquyen?: string;
  mamodule?: string;
  machucnang?: string;
  hanhdonh?: string;
  mota?: string;
  trangthai?: string;
}

export interface PermissionGroup {
  module: string;
  features: {
    [feature: string]: Permission[];
  };
}
