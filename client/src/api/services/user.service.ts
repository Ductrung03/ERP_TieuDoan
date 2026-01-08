import axiosInstance from '../axios.instance';

export interface User {
  mataikhoan: string;
  tendn: string;
  sdt?: string;
  landangnhapcuoi?: string;
  trangthai: string;
  ngaytao?: string;
  maquyen: string;
  madonvi?: string;
  tenquyen?: string;
  tendonvi?: string;
}

export interface CreateUserDto {
  tendn: string;
  matkhau: string;
  sdt?: string;
  maquyen: string;
  madonvi?: string;
  trangthai?: string;
}

export interface UpdateUserDto {
  tendn?: string;
  sdt?: string;
  maquyen?: string;
  madonvi?: string;
  trangthai?: string;
}

const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: User[]; total: number }>('/users');
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await axiosInstance.post<{ success: boolean; data: User }>('/users', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await axiosInstance.put<{ success: boolean; data: User }>(`/users/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  resetPassword: async (id: string, matkhaumoi: string): Promise<void> => {
    await axiosInstance.post(`/users/${id}/reset-password`, { matkhaumoi });
  },

  toggleStatus: async (id: string, trangthai: 'Active' | 'Inactive'): Promise<void> => {
    await axiosInstance.put(`/users/${id}/toggle-status`, { trangthai });
  },
};

export default userService;
