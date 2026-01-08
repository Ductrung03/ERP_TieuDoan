import { Router } from 'express';
import { IModule } from '../_loader';
import { moduleConfig } from './module.config';
import routes from './routes';
import { logger } from '../../core/logger/index';

/**
 * Module: Quản Lý Canh Gác
 * 
 * Module này cung cấp các chức năng quản lý:
 * - Lịch gác theo ngày
 * - Ca gác (shifts)
 * - Vòng gác (guard posts)
 * - Phân công gác cho học viên
 * - Kiểm tra gác
 */
const quanLyCanhGacModule: IModule = {
  name: moduleConfig.name,
  version: moduleConfig.version,
  description: moduleConfig.description,
  dependencies: moduleConfig.dependencies,

  routes: (router: Router) => {
    router.use('/', routes);
  },

  onLoad: async () => {
    logger.info(`Module ${moduleConfig.displayName} đã sẵn sàng`);
  },

  onUnload: async () => {
    logger.info(`Module ${moduleConfig.displayName} đã tắt`);
  },
};

export default quanLyCanhGacModule;
export { moduleConfig };
