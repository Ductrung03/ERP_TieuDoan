/**
 * Entity: Data Scope (Phạm vi dữ liệu)
 * Bảng: phamvidulieu
 * Module: User Management
 */
export interface DataScope {
  maphamvi: string;
  tenphamvi: string;
  loaiphamvi: string; // ALL, OWN_UNIT, SUB_UNITS, CUSTOM
  mota?: string;
  trangthai: string;
  ngaytao: Date;
}

export interface CreateDataScopeDto {
  tenphamvi: string;
  loaiphamvi: string;
  mota?: string;
  trangthai?: string;
}

export interface UpdateDataScopeDto {
  tenphamvi?: string;
  loaiphamvi?: string;
  mota?: string;
  trangthai?: string;
}

export interface DataScopeWithUnits extends DataScope {
  units: string[]; // Array of madonvi for CUSTOM type
}

export interface UserDataScope {
  mataikhoan: string;
  maphamvi: string;
  ngaycap: Date;
  nguoicap?: string;
}
