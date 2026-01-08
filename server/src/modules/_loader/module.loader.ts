import { Router } from 'express';
import { IModule, ModuleConfig } from './module.interface';
import { logger } from '../../core/logger';
import path from 'path';
import fs from 'fs';

/**
 * Module Loader - Quản lý load/unload các module động
 */
class ModuleLoader {
  private modules: Map<string, IModule> = new Map();
  private configs: Map<string, ModuleConfig> = new Map();
  private loadOrder: string[] = [];

  /**
   * Load một module từ đường dẫn
   */
  async loadModule(modulePath: string): Promise<void> {
    try {
      const moduleExports = await import(modulePath);
      const module: IModule = moduleExports.default;
      const config: ModuleConfig = moduleExports.moduleConfig;

      if (!config) {
        throw new Error(`Module tại ${modulePath} thiếu moduleConfig`);
      }

      if (!config.enabled) {
        logger.info(`Module ${config.name} bị vô hiệu hóa, bỏ qua...`);
        return;
      }

      // Kiểm tra dependencies
      for (const dep of config.dependencies) {
        if (!this.modules.has(dep)) {
          throw new Error(`Module ${config.name} yêu cầu ${dep} phải được load trước`);
        }
      }

      // Lưu module và config
      this.modules.set(config.name, module);
      this.configs.set(config.name, config);
      this.loadOrder.push(config.name);

      // Gọi hook onLoad nếu có
      if (module.onLoad) {
        await module.onLoad();
      }

      logger.info(`✓ Đã load module: ${config.displayName} v${config.version}`);
    } catch (error) {
      logger.error(`Lỗi khi load module từ ${modulePath}:`, error);
      throw error;
    }
  }

  /**
   * Load tất cả modules từ thư mục
   */
  async loadAllModules(modulesDir: string): Promise<void> {
    const moduleFolders = fs.readdirSync(modulesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
      .map(dirent => dirent.name);

    for (const folder of moduleFolders) {
      const modulePath = path.join(modulesDir, folder, 'index');
      if (fs.existsSync(path.join(modulesDir, folder, 'index.ts'))) {
        await this.loadModule(modulePath);
      }
    }

    logger.info(`Đã load ${this.modules.size} modules`);
  }

  /**
   * Đăng ký routes cho tất cả modules
   */
  registerRoutes(apiRouter: Router): void {
    for (const [name, module] of this.modules) {
      const config = this.configs.get(name)!;
      const moduleRouter = Router();
      
      module.routes(moduleRouter);
      apiRouter.use(config.baseRoute, moduleRouter);
      
      logger.debug(`Đã đăng ký routes cho ${name} tại ${config.baseRoute}`);
    }
  }

  /**
   * Lấy danh sách modules đã load
   */
  getLoadedModules(): ModuleConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Kiểm tra module đã load chưa
   */
  isLoaded(moduleName: string): boolean {
    return this.modules.has(moduleName);
  }

  /**
   * Unload một module
   */
  async unloadModule(moduleName: string): Promise<void> {
    const module = this.modules.get(moduleName);
    if (!module) {
      throw new Error(`Module ${moduleName} chưa được load`);
    }

    // Kiểm tra có module nào phụ thuộc không
    for (const [name, config] of this.configs) {
      if (config.dependencies.includes(moduleName)) {
        throw new Error(`Không thể unload ${moduleName} vì ${name} phụ thuộc vào nó`);
      }
    }

    // Gọi hook onUnload nếu có
    if (module.onUnload) {
      await module.onUnload();
    }

    this.modules.delete(moduleName);
    this.configs.delete(moduleName);
    this.loadOrder = this.loadOrder.filter(n => n !== moduleName);

    logger.info(`Đã unload module: ${moduleName}`);
  }
}

export const moduleLoader = new ModuleLoader();
