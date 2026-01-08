/**
 * Entity: Ca Gác
 * Bảng: cagac
 */
export interface CaGac {
  macagac: string;
  thoigianbatdau: Date;
  thoigianketthuc: Date;
}

export interface CreateCaGacDto {
  thoigianbatdau: Date;
  thoigianketthuc: Date;
}

export interface UpdateCaGacDto {
  thoigianbatdau?: Date;
  thoigianketthuc?: Date;
}
