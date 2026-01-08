import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './environment';
import { logger } from '../core/logger';
import { AppError } from '../core/errors';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: environment.isDevelopment ? true : environment.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP request logging
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: environment.nodeEnv,
    });
  });

  return app;
}

// Global error handler
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { 
      statusCode: err.statusCode, 
      path: req.path 
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err instanceof (require('../core/errors').ValidationError) && { errors: (err as any).errors }),
      },
    });
    return;
  }

  // Unhandled errors
  logger.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      message: environment.isDevelopment ? err.message : 'Lỗi máy chủ nội bộ',
    },
  });
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Không tìm thấy route: ${req.method} ${req.path}`,
    },
  });
}
