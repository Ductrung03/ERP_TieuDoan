/**
 * Entity: Cán Bộ
 * Bảng: canbo
 * Shared entity - Được sử dụng bởi nhiều modules
 */
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
}

export interface CreateCanBoDto {
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  madonvi?: string;
}

export interface UpdateCanBoDto {
  hoten?: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigiandi?: Date;
}
