import axiosInstance from '../axios.instance';

export interface Role {
  maquyen: string;
  tenquyen: string;
  mota?: string;
  trangthai: string;
  ngaytao?: string;
  nguoitao?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: string[];
}

export interface CreateRoleDto {
  tenquyen: string;
  mota?: string;
  trangthai?: string;
}

export interface UpdateRoleDto {
  tenquyen?: string;
  mota?: string;
  trangthai?: string;
}

const roleService = {
  getAll: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: Role[]; total: number }>('/roles');
    return response.data.data;
  },

  getById: async (id: string): Promise<Role> => {
    const response = await axiosInstance.get<{ success: boolean; data: Role }>(`/roles/${id}`);
    return response.data.data;
  },

  getByIdWithPermissions: async (id: string): Promise<RoleWithPermissions> => {
    const response = await axiosInstance.get<{ success: boolean; data: RoleWithPermissions }>(`/roles/${id}/with-permissions`);
    return response.data.data;
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await axiosInstance.post<{ success: boolean; data: Role }>('/roles', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const response = await axiosInstance.put<{ success: boolean; data: Role }>(`/roles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },

  getPermissions: async (roleId: string): Promise<string[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: string[] }>(`/roles/${roleId}/permissions`);
    return response.data.data;
  },

  assignPermissions: async (roleId: string, permissions: string[]): Promise<void> => {
    await axiosInstance.post(`/roles/${roleId}/permissions`, { permissions });
  },
};

export default roleService;
