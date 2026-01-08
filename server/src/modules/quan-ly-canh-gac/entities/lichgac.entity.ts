/**
 * Entity: Lịch Gác
 * Bảng: lichgac
 */
export interface LichGac {
  malichgac: string;
  ngaygac: Date;
  ghichu?: string;
  matkhauhoi?: string;
  matkhaudap?: string;
  madonvi?: string;
}

export interface CreateLichGacDto {
  ngaygac: Date;
  ghichu?: string;
  matkhauhoi?: string;
  matkhaudap?: string;
  madonvi: string;
}

export interface UpdateLichGacDto {
  ngaygac?: Date;
  ghichu?: string;
  matkhauhoi?: string;
  matkhaudap?: string;
}
