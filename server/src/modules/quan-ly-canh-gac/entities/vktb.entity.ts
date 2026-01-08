/**
 * Entity: Vũ Khí Trang Bị
 * Bảng: vktb
 */
export interface VKTB {
  mavktb: string;
  tenvktb: string;
  donvitinh?: string;
  tinhtrang?: string;
  ghichu?: string;
  maloaivktb?: string;
}

export interface CreateVKTBDto {
  tenvktb: string;
  donvitinh?: string;
  tinhtrang?: string;
  ghichu?: string;
  maloaivktb?: string;
}

export interface UpdateVKTBDto {
  tenvktb?: string;
  donvitinh?: string;
  tinhtrang?: string;
  ghichu?: string;
  maloaivktb?: string;
}
