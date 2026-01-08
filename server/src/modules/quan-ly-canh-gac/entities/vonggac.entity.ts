/**
 * Entity: Vòng Gác
 * Bảng: vonggac
 */
export interface VongGac {
  mavonggac: string;
  tenvonggac?: string;
  giobatdau?: Date;
  gioketthuc?: Date;
  mota?: string;
}

export interface CreateVongGacDto {
  tenvonggac: string;
  giobatdau?: Date;
  gioketthuc?: Date;
  mota?: string;
}

export interface UpdateVongGacDto {
  tenvonggac?: string;
  giobatdau?: Date;
  gioketthuc?: Date;
  mota?: string;
}
