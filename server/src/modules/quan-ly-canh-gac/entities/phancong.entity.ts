/**
 * Entity: Phân Công Gác
 * Bảng: pcgac
 */
export interface PhanCongGac {
  mapc: string;
  mahocvien?: string;
  macagac?: string;
  mavonggac?: string;
  malichgac?: string;
}

export interface CreatePhanCongGacDto {
  mahocvien: string;
  macagac: string;
  mavonggac: string;
  malichgac: string;
}

export interface PhanCongGacDetail extends PhanCongGac {
  tenhocvien?: string;
  tencagac?: string;
  tenvonggac?: string;
  ngaygac?: Date;
}
