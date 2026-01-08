import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface KiemTraGac {
  maktgac: string;
  ngay?: Date;
  trangthai?: string;
  nhiemvuhocvien?: string;
  macagac?: string;
  mavp?: string;
  macanbo?: string;
}

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
