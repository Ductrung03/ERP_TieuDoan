import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../endpoints';

export interface DonVi {
  madonvi: string;
  tendonvi: string;
  tongquanso?: number;
  kyhieu?: string;
  madonvitren?: string;
}

export interface CreateDonViDto {
  tendonvi: string;
  tongquanso?: number;
  kyhieu?: string;
  madonvitren?: string;
}

export const donViService = {
  getAll: async (): Promise<DonVi[]> => {
    const response = await axiosInstance.get<ApiResponse<DonVi[]>>(API_ENDPOINTS.DON_VI);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<DonVi> => {
    const response = await axiosInstance.get<ApiResponse<DonVi>>(`${API_ENDPOINTS.DON_VI}/${id}`);
    return response.data.data!;
  },

  getByParent: async (parentId: string): Promise<DonVi[]> => {
    const response = await axiosInstance.get<ApiResponse<DonVi[]>>(`${API_ENDPOINTS.DON_VI}/parent/${parentId}`);
    return response.data.data || [];
  },

  create: async (data: CreateDonViDto): Promise<DonVi> => {
    const response = await axiosInstance.post<ApiResponse<DonVi>>(API_ENDPOINTS.DON_VI, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateDonViDto>): Promise<DonVi> => {
    const response = await axiosInstance.put<ApiResponse<DonVi>>(`${API_ENDPOINTS.DON_VI}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.DON_VI}/${id}`);
  },
};
