export const API_ENDPOINTS = {
  // Shared Entities
  DON_VI: '/canh-gac/don-vi',
  CAN_BO: '/canh-gac/can-bo',
  HOC_VIEN: '/canh-gac/hoc-vien',
  QUAN_HAM: '/shared/quanhams',
  CHUC_VU: '/shared/chucvus',
  
  // Guard Management
  LICH_GAC: '/canh-gac/lich-gac',
  CA_GAC: '/canh-gac/ca-gac',
  VONG_GAC: '/canh-gac/vong-gac',
  PHAN_CONG: '/canh-gac/phan-cong',
  KIEM_TRA: '/canh-gac/kiem-tra',
  VKTB: '/canh-gac/vktb',
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
