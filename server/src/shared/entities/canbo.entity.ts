/**
 * Entity: Cán Bộ
 * Bảng: canbo
 * Shared entity - Được sử dụng bởi nhiều modules
 */
// Extended interface for fetching
export interface CanBo {
  macanbo: string;
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  thoigiandi?: Date;
  madonvi?: string;
  
  // Joined fields
  machucvu?: string;
  tenchucvu?: string;
  maquanham?: string;
  tenquanham?: string;
}

export interface CreateCanBoDto {
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  madonvi?: string; // Optional
  
  // Required new fields
  machucvu: string;
  maquanham: string;
}

export interface UpdateCanBoDto {
  hoten?: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  thoigiandi?: Date;
  machucvu?: string;
  maquanham?: string;
  madonvi?: string;
}
