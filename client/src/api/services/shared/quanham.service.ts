import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface QuanHam {
  maquanham: string;
  tenquanham: string;
  kyhieu?: string;
}

export const quanHamService = {
  getAll: async (): Promise<QuanHam[]> => {
    const response = await axiosInstance.get<ApiResponse<QuanHam[]>>(API_ENDPOINTS.QUAN_HAM);
    return response.data.data || [];
  },
};
