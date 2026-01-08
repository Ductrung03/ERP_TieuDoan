import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../endpoints';

export interface CaGac {
  macagac: string;
  thoigianbatdau: string;
  thoigianketthuc: string;
}

export interface VongGac {
  mavonggac: string;
  tenvonggac: string;
  giobatdau?: string;
  gioketthuc?: string;
  mota?: string;
}

export interface PhanCongGac {
  mapc: string;
  mahocvien: string;
  macagac: string;
  mavonggac: string;
  malichgac: string;
}

export interface CreatePhanCongDto {
  mahocvien: string;
  macagac: string;
  mavonggac: string;
  malichgac: string;
}

export interface KiemTraGac {
  maktgac: string;
  ngay?: Date;
  trangthai?: string;
  nhiemvuhocvien?: string;
  macagac?: string;
  mavp?: string;
  macanbo?: string;
}

export interface VKTB {
  mavktb: string;
  tenvktb: string;
  donvitinh?: string;
  tinhtrang?: string;
  ghichu?: string;
  maloaivktb?: string;
}

// Ca Gác Service
export const caGacService = {
  getAll: async (): Promise<CaGac[]> => {
    const response = await axiosInstance.get<ApiResponse<CaGac[]>>(API_ENDPOINTS.CA_GAC);
    return response.data.data || [];
  },
  
  create: async (data: Partial<CaGac>): Promise<CaGac> => {
    const response = await axiosInstance.post<ApiResponse<CaGac>>(API_ENDPOINTS.CA_GAC, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CaGac>): Promise<CaGac> => {
    const response = await axiosInstance.put<ApiResponse<CaGac>>(`${API_ENDPOINTS.CA_GAC}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.CA_GAC}/${id}`);
  },
};

// Vòng Gác Service
export const vongGacService = {
  getAll: async (): Promise<VongGac[]> => {
    const response = await axiosInstance.get<ApiResponse<VongGac[]>>(API_ENDPOINTS.VONG_GAC);
    return response.data.data || [];
  },
  
  create: async (data: Partial<VongGac>): Promise<VongGac> => {
    const response = await axiosInstance.post<ApiResponse<VongGac>>(API_ENDPOINTS.VONG_GAC, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<VongGac>): Promise<VongGac> => {
    const response = await axiosInstance.put<ApiResponse<VongGac>>(`${API_ENDPOINTS.VONG_GAC}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.VONG_GAC}/${id}`);
  },
};

// Phân Công Gác Service
export const phanCongGacService = {
  getAll: async (): Promise<PhanCongGac[]> => {
    const response = await axiosInstance.get<ApiResponse<PhanCongGac[]>>(API_ENDPOINTS.PHAN_CONG);
    return response.data.data || [];
  },

  getByLichGac: async (lichGacId: string): Promise<PhanCongGac[]> => {
    const response = await axiosInstance.get<ApiResponse<PhanCongGac[]>>(`${API_ENDPOINTS.PHAN_CONG}/lich/${lichGacId}`);
    return response.data.data || [];
  },
  
  create: async (data: CreatePhanCongDto): Promise<PhanCongGac> => {
    const response = await axiosInstance.post<ApiResponse<PhanCongGac>>(API_ENDPOINTS.PHAN_CONG, data);
    return response.data.data!;
  },

  createBulk: async (assignments: CreatePhanCongDto[]): Promise<PhanCongGac[]> => {
    const response = await axiosInstance.post<ApiResponse<PhanCongGac[]>>(`${API_ENDPOINTS.PHAN_CONG}/bulk`, { assignments });
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PHAN_CONG}/${id}`);
  },
};

// Kiểm Tra Gác Service
export const kiemTraGacService = {
  getAll: async (): Promise<KiemTraGac[]> => {
    const response = await axiosInstance.get<ApiResponse<KiemTraGac[]>>(API_ENDPOINTS.KIEM_TRA);
    return response.data.data || [];
  },
  
  create: async (data: Partial<KiemTraGac>): Promise<KiemTraGac> => {
    const response = await axiosInstance.post<ApiResponse<KiemTraGac>>(API_ENDPOINTS.KIEM_TRA, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<KiemTraGac>): Promise<KiemTraGac> => {
    const response = await axiosInstance.put<ApiResponse<KiemTraGac>>(`${API_ENDPOINTS.KIEM_TRA}/${id}`, data);
    return response.data.data!;
  },
};

// VKTB Service
export const vktbService = {
  getAll: async (loaiId?: string): Promise<VKTB[]> => {
    const params = loaiId ? { loaiId } : {};
    const response = await axiosInstance.get<ApiResponse<VKTB[]>>(API_ENDPOINTS.VKTB, { params });
    return response.data.data || [];
  },
  
  create: async (data: Partial<VKTB>): Promise<VKTB> => {
    const response = await axiosInstance.post<ApiResponse<VKTB>>(API_ENDPOINTS.VKTB, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<VKTB>): Promise<VKTB> => {
    const response = await axiosInstance.put<ApiResponse<VKTB>>(`${API_ENDPOINTS.VKTB}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.VKTB}/${id}`);
  },
};
