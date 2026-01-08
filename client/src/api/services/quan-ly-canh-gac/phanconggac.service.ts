import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

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
