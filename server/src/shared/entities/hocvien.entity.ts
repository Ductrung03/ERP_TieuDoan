/**
 * Entity: Học Viên
 * Bảng: hocvien
 * Shared entity - Được sử dụng bởi nhiều modules
 */
export interface HocVien {
  mahocvien: string;
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  madonvi?: string;
}

export interface CreateHocVienDto {
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  madonvi?: string;
}

export interface UpdateHocVienDto {
  hoten?: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
}
