import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface VKTB {
  mavktb: string;
  tenvktb: string;
  donvitinh?: string;
  tinhtrang?: string;
  ghichu?: string;
  maloaivktb?: string;
}

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
