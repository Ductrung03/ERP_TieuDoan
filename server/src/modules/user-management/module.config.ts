import { Router } from 'express';
import { IModule, ModuleConfig } from '../_loader/module.interface';
import routes from './routes';

// Module implementation
const userManagementModule: IModule = {
  name: 'user-management',
  version: '1.0.0',
  description: 'Module quản lý người dùng, vai trò, quyền và phạm vi dữ liệu',
  dependencies: [],
  routes: (router: Router) => {
    // Mount all routes (auth at /auth, users/roles/permissions/data-scopes at root)
    router.use('/', routes);
  },
  onLoad: async () => {
    console.log('✅ User Management module loaded successfully');
  },
  onUnload: async () => {
    console.log('❌ User Management module unloaded');
  },
};

// Module configuration
export const moduleConfig: ModuleConfig = {
  name: 'user-management',
  displayName: 'Quản Lý Người Dùng & Phân Quyền',
  version: '1.0.0',
  description: 'Module quản lý người dùng, vai trò, quyền và phạm vi dữ liệu',
  enabled: true,
  dependencies: [],
  baseRoute: '',
  icon: 'bi-shield-lock',
};

// Export default module
export default userManagementModule;
