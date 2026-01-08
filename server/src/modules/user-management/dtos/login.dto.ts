export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
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
