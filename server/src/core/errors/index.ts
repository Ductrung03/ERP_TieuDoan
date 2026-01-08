export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Yêu cầu không hợp lệ', code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Không có quyền truy cập', code?: string) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Bạn không có quyền thực hiện hành động này', code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Không tìm thấy tài nguyên', code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Dữ liệu đã tồn tại', code?: string) {
    super(message, 409, code);
  }
}

export class ValidationError extends AppError {
  errors: any[];

  constructor(message: string = 'Dữ liệu không hợp lệ', errors: any[] = []) {
    super(message, 422);
    this.errors = errors;
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Lỗi máy chủ nội bộ', code?: string) {
    super(message, 500, code);
  }
}
