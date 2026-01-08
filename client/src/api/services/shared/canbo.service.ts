import axiosInstance from '../../axios.instance';
import { API_ENDPOINTS } from '../../endpoints';
import type { ApiResponse } from '../../endpoints';

export interface CanBo {
  macanbo: string;
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  thoigiandi?: Date;
  madonvi?: string;
  
  // Joined fields
  machucvu?: string;
  tenchucvu?: string;
  maquanham?: string;
  tenquanham?: string;
}

export interface CreateCanBoDto {
  hoten: string;
  ngaysinh?: Date;
  diachi?: string;
  sdt?: string;
  gmail?: string;
  thoigianden?: Date;
  madonvi?: string;
  
  // Required
  machucvu: string;
  maquanham: string;
}

export const canBoService = {
  getAll: async (donviId?: string): Promise<CanBo[]> => {
    const params = donviId ? { donviId } : {};
    const response = await axiosInstance.get<ApiResponse<CanBo[]>>(API_ENDPOINTS.CAN_BO, { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<CanBo> => {
    const response = await axiosInstance.get<ApiResponse<CanBo>>(`${API_ENDPOINTS.CAN_BO}/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateCanBoDto): Promise<CanBo> => {
    const response = await axiosInstance.post<ApiResponse<CanBo>>(API_ENDPOINTS.CAN_BO, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateCanBoDto>): Promise<CanBo> => {
    const response = await axiosInstance.put<ApiResponse<CanBo>>(`${API_ENDPOINTS.CAN_BO}/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.CAN_BO}/${id}`);
  },
};
