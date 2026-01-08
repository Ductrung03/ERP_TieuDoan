import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface CaGac {
  macagac: string;
  thoigianbatdau: string;
  thoigianketthuc: string;
}

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
