// Shared entity services
export { donViService } from './shared/donvi.service';
export { canBoService } from './shared/canbo.service';
export { hocVienService } from './shared/hocvien.service';
export { quanHamService } from './shared/quanham.service';
export { chucVuService } from './shared/chucvu.service';

// Auth services
export { default as authService } from './auth/auth.service';
export { default as userService } from './auth/user.service';
export { default as roleService } from './auth/role.service';
export { default as permissionService } from './auth/permission.service';

// Guard management services
export { lichGacService } from './quan-ly-canh-gac/lichgac.service';
export { caGacService } from './quan-ly-canh-gac/cagac.service';
export { vongGacService } from './quan-ly-canh-gac/vonggac.service';
export { phanCongGacService } from './quan-ly-canh-gac/phanconggac.service';
export { kiemTraGacService } from './quan-ly-canh-gac/kiemtragac.service';
export { vktbService } from './quan-ly-canh-gac/vktb.service';

// Re-export types
export type { DonVi, CreateDonViDto } from './shared/donvi.service';
export type { CanBo, CreateCanBoDto } from './shared/canbo.service';
export type { HocVien, CreateHocVienDto } from './shared/hocvien.service';
export type { QuanHam } from './shared/quanham.service';
export type { ChucVu } from './shared/chucvu.service';
export type { LoginDto, LoginResponse, UserInfo } from './auth/auth.service';
export type { User, CreateUserDto, UpdateUserDto } from './auth/user.service';
export type { Role, RoleWithPermissions, CreateRoleDto, UpdateRoleDto } from './auth/role.service';
export type { Permission, PermissionGroup } from './auth/permission.service';
export type { LichGac, CreateLichGacDto } from './quan-ly-canh-gac/lichgac.service';
export type { CaGac } from './quan-ly-canh-gac/cagac.service';
export type { VongGac } from './quan-ly-canh-gac/vonggac.service';
export type { PhanCongGac, CreatePhanCongDto } from './quan-ly-canh-gac/phanconggac.service';
export type { KiemTraGac } from './quan-ly-canh-gac/kiemtragac.service';
export type { VKTB } from './quan-ly-canh-gac/vktb.service';
