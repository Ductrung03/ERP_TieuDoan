/**
 * Entity: Đơn Vị
 * Bảng: donvi
 * Shared entity - Được sử dụng bởi nhiều modules
 */
export interface DonVi {
  madonvi: string;
  tendonvi: string;
  tongquanso?: number;
  kyhieu?: string;
  madonvitren?: string;
}

export interface CreateDonViDto {
  tendonvi: string;
  tongquanso?: number;
  kyhieu?: string;
  madonvitren?: string;
}

export interface UpdateDonViDto {
  tendonvi?: string;
  tongquanso?: number;
  kyhieu?: string;
  madonvitren?: string;
}
