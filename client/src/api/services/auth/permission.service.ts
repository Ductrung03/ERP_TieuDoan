import axiosInstance from '../../axios.instance';

export interface Permission {
  maquyen: string;
  tenquyen: string;
  mamodule: string;
  machucnang: string;
  hanhdonh: string;
  mota?: string;
  trangthai: string;
  ngaytao?: string;
}

export interface PermissionGroup {
  module: string;
  features: {
    [feature: string]: Permission[];
  };
}

const permissionService = {
  getAll: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: Permission[]; total: number }>('/permissions');
    return response.data.data;
  },

  getGrouped: async (): Promise<PermissionGroup[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: PermissionGroup[] }>('/permissions/grouped');
    return response.data.data;
  },

  getById: async (id: string): Promise<Permission> => {
    const response = await axiosInstance.get<{ success: boolean; data: Permission }>(`/permissions/${id}`);
    return response.data.data;
  },

  getByModule: async (module: string): Promise<Permission[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: Permission[] }>(`/permissions/module/${module}`);
    return response.data.data;
  },
};

export default permissionService;
