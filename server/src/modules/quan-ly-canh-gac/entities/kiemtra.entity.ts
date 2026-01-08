/**
 * Entity: Kiểm Tra Gác
 * Bảng: kiemtragac
 */
export interface KiemTraGac {
  maktgac: string;
  ngay?: Date;
  trangthai?: string;
  nhiemvuhocvien?: string;
  macagac?: string;
  mavp?: string;
  macanbo?: string;
}

export interface CreateKiemTraGacDto {
  ngay: Date;
  trangthai?: string;
  nhiemvuhocvien?: string;
  macagac: string;
  mavp?: string;
  macanbo?: string;
}

export interface UpdateKiemTraGacDto {
  trangthai?: string;
  nhiemvuhocvien?: string;
}
