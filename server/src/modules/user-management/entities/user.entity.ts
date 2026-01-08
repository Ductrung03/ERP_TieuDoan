/**
 * Entity: User (Tài khoản)
 * Bảng: taikhoan
 * Module: User Management
 */
export interface User {
  mataikhoan: string;
  tendn: string;
  matkhau: string;
  salt?: string;
  sdt?: string;
  landangnhapcuoi?: Date | null;
  trangthai: string;
  ngaytao: Date;
  maquyen: string;
  madonvi?: string;
  // Relations (optional - được load khi cần)
  tenquyen?: string;
  tendonvi?: string;
}

export interface UserWithoutPassword extends Omit<User, 'matkhau' | 'salt'> {}

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

export interface ChangePasswordDto {
  mataikhoan: string;
  matkhaucu: string;
  matkhaumoi: string;
}

export interface ResetPasswordDto {
  mataikhoan: string;
  matkhaumoi: string;
}
