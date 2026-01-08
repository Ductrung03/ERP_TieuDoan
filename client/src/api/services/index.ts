// Shared entity services
export { donViService } from './donvi.service';
export { canBoService } from './canbo.service';
export { hocVienService } from './hocvien.service';

// Guard management services
export { lichGacService } from './lichgac.service';
export {
  caGacService,
  vongGacService,
  phanCongGacService,
  kiemTraGacService,
  vktbService,
} from './guard.service';

// Re-export types
export type { DonVi, CreateDonViDto } from './donvi.service';
export type { CanBo, CreateCanBoDto } from './canbo.service';
export type { HocVien, CreateHocVienDto } from './hocvien.service';
export type { LichGac, CreateLichGacDto } from './lichgac.service';
export type {
  CaGac,
  VongGac,
  PhanCongGac,
  CreatePhanCongDto,
  KiemTraGac,
  VKTB,
} from './guard.service';
