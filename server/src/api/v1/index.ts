import { Router, Request, Response } from 'express';
import { moduleLoader } from '../../modules/_loader';
import sharedRouter from './shared.routes';

const router = Router();

// API info endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'ERP Tiểu Đoàn API',
      version: '1.0.0',
      description: 'Hệ thống ERP Module-based cho cấp Tiểu Đoàn',
      modules: moduleLoader.getLoadedModules().map(m => ({
        name: m.name,
        displayName: m.displayName,
        version: m.version,
        route: m.baseRoute,
      })),
    },
  });
});

// Register shared routes (Core/Shared entities)
router.use('/shared', sharedRouter);

export default router;
