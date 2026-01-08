import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface HocVien {
  mahocvien: string;
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  madonvi?: string;
}

export interface CreateHocVienDto {
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  madonvi?: string;
}

export const hocVienService = {
  getAll: async (donviId?: string): Promise<HocVien[]> => {
    const params = donviId ? { donviId } : {};
    const response = await axiosInstance.get<ApiResponse<HocVien[]>>(API_ENDPOINTS.HOC_VIEN, { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<HocVien> => {
    const response = await axiosInstance.get<ApiResponse<HocVien>>(`${API_ENDPOINTS.HOC_VIEN}/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateHocVienDto): Promise<HocVien> => {
    const response = await axiosInstance.post<ApiResponse<HocVien>>(API_ENDPOINTS.HOC_VIEN, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateHocVienDto>): Promise<HocVien> => {
    const response = await axiosInstance.put<ApiResponse<HocVien>>(`${API_ENDPOINTS.HOC_VIEN}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.HOC_VIEN}/${id}`);
  },
};
