import axiosInstance from '../axios.instance';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    mataikhoan: string;
    tendn: string;
    maquyen: string;
    tenquyen: string;
    madonvi: string;
    tendonvi?: string;
    sdt?: string;
    trangthai: string;
  };
}

export interface UserInfo {
  mataikhoan: string;
  tendn: string;
  maquyen: string;
  tenquyen: string;
  madonvi: string;
  tendonvi?: string;
  sdt?: string;
  trangthai: string;
  landangnhapcuoi?: string;
  permissions: Record<string, Record<string, string[]>>; // {MODULE: {FEATURE: ['VIEW', 'CREATE']}}
  dataScopes: Array<{
    maphamvi: string;
    tenphamvi: string;
    loaiphamvi: string;
    mota?: string;
  }>;
}

const authService = {
  /**
   * Đăng nhập
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/login', data);
    return response.data;
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await axiosInstance.get<{ success: boolean; data: UserInfo }>('/me');
    return response.data.data;
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      // Ignore errors on logout
    }
    localStorage.removeItem('auth_token');
  },

  /**
   * Kiểm tra có token không
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Lưu token
   */
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Xóa token
   */
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },
};

export default authService;
