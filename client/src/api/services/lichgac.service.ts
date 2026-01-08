import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../endpoints';

export interface LichGac {
  malichgac: string;
  ngaygac: Date;
  ghichu?: string;
  matkhauhoi?: string;
  matkhaudap?: string;
  madonvi?: string;
}

export interface CreateLichGacDto {
  ngaygac: Date;
  ghichu?: string;
  matkhauhoi?: string;
  matkhaudap?: string;
  madonvi?: string;
}

export const lichGacService = {
  getAll: async (donviId?: string): Promise<LichGac[]> => {
    const params = donviId ? { donviId } : {};
    const response = await axiosInstance.get<ApiResponse<LichGac[]>>(API_ENDPOINTS.LICH_GAC, { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<LichGac> => {
    const response = await axiosInstance.get<ApiResponse<LichGac>>(`${API_ENDPOINTS.LICH_GAC}/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateLichGacDto): Promise<LichGac> => {
    const response = await axiosInstance.post<ApiResponse<LichGac>>(API_ENDPOINTS.LICH_GAC, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateLichGacDto>): Promise<LichGac> => {
    const response = await axiosInstance.put<ApiResponse<LichGac>>(`${API_ENDPOINTS.LICH_GAC}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.LICH_GAC}/${id}`);
  },
};
