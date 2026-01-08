import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface ChucVu {
  machucvu: string;
  tenchucvu: string;
  kyhieu?: string;
}

export const chucVuService = {
  getAll: async (): Promise<ChucVu[]> => {
    const response = await axiosInstance.get<ApiResponse<ChucVu[]>>(API_ENDPOINTS.CHUC_VU);
    return response.data.data || [];
  },
};
