import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { roleController } from '../controllers/role.controller';
import { permissionController } from '../controllers/permission.controller';
import { dataScopeController } from '../controllers/data-scope.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router = Router();
const authController = new AuthController();

// =============================================
// AUTH ROUTES (Public - không cần auth)
// =============================================

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authController.login);

// =============================================
// AUTH ROUTES (Protected - cần auth)
// =============================================

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route GET /api/v1/auth/permissions
 * @desc Get current user's permissions
 * @access Private
 */
router.get('/permissions', authMiddleware, authController.getUserPermissions);

/**
 * @route POST /api/v1/auth/check-permission
 * @desc Check if user has specific permission
 * @access Private
 */
router.post('/check-permission', authMiddleware, authController.checkPermission);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

// =============================================
// USER MANAGEMENT ROUTES
// =============================================

// User routes
router.get('/users', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'VIEW'), userController.getAll);
router.get('/users/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'VIEW'), userController.getById);
router.post('/users', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'CREATE'), userController.create);
router.put('/users/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'UPDATE'), userController.update);
router.delete('/users/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'DELETE'), userController.delete);
router.post('/users/:id/reset-password', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'RESET_PASSWORD'), userController.resetPassword);
router.put('/users/:id/toggle-status', authMiddleware, requirePermission('USER_MANAGEMENT', 'NGUOI_DUNG', 'TOGGLE_STATUS'), userController.toggleStatus);
router.post('/users/change-password', authMiddleware, userController.changePassword);

// Role routes
router.get('/roles', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'VIEW'), roleController.getAll);
router.get('/roles/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'VIEW'), roleController.getById);
router.get('/roles/:id/with-permissions', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'VIEW'), roleController.getByIdWithPermissions);
router.post('/roles', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'CREATE'), roleController.create);
router.put('/roles/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'UPDATE'), roleController.update);
router.delete('/roles/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'DELETE'), roleController.delete);
router.get('/roles/:id/permissions', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'VIEW'), roleController.getPermissions);
router.post('/roles/:id/permissions', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS'), roleController.assignPermissions);
router.post('/roles/:id/permissions/add', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS'), roleController.addPermission);
router.delete('/roles/:id/permissions/:permissionId', authMiddleware, requirePermission('USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS'), roleController.removePermission);

// Permission routes
router.get('/permissions', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'VIEW'), permissionController.getAll);
router.get('/permissions/grouped', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'VIEW'), permissionController.getGrouped);
router.get('/permissions/module/:module', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'VIEW'), permissionController.getByModule);
router.get('/permissions/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'VIEW'), permissionController.getById);
router.post('/permissions', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'CREATE'), permissionController.create);
router.put('/permissions/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'UPDATE'), permissionController.update);
router.delete('/permissions/:id', authMiddleware, requirePermission('USER_MANAGEMENT', 'QUYEN', 'DELETE'), permissionController.delete);

// Data Scope routes
router.get('/data-scopes', authMiddleware, dataScopeController.getAll);
router.get('/data-scopes/:id', authMiddleware, dataScopeController.getById);
router.get('/data-scopes/:id/with-units', authMiddleware, dataScopeController.getByIdWithUnits);
router.post('/data-scopes', authMiddleware, dataScopeController.create);
router.put('/data-scopes/:id', authMiddleware, dataScopeController.update);
router.delete('/data-scopes/:id', authMiddleware, dataScopeController.delete);
router.post('/data-scopes/:id/units', authMiddleware, dataScopeController.assignUnits);
router.get('/data-scopes/user/:userId', authMiddleware, dataScopeController.getUserDataScopes);
router.post('/data-scopes/user/:userId', authMiddleware, dataScopeController.setUserDataScopes);

export default router;

