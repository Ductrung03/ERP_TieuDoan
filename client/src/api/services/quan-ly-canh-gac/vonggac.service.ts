import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface VongGac {
  mavonggac: string;
  tenvonggac: string;
  giobatdau?: string;
  gioketthuc?: string;
  mota?: string;
}

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
