import { Router } from 'express';
import { lichGacController, caGacController, vongGacController, phanCongGacController, kiemTraGacController, vktbController } from '../controllers';
import { donViController, canBoController, hocVienController } from '../../../shared/controllers';

const router = Router();

// ==================== Shared Entity Routes ====================
// Đơn Vị
router.get('/don-vi', donViController.getAll);
router.get('/don-vi/:id', donViController.getById);
router.get('/don-vi/parent/:parentId', donViController.getByParent);
router.post('/don-vi', donViController.create);
router.put('/don-vi/:id', donViController.update);
router.delete('/don-vi/:id', donViController.delete);

// Cán Bộ
router.get('/can-bo', canBoController.getAll);
router.get('/can-bo/:id', canBoController.getById);
router.post('/can-bo', canBoController.create);
router.put('/can-bo/:id', canBoController.update);
router.delete('/can-bo/:id', canBoController.delete);

// Học Viên
router.get('/hoc-vien', hocVienController.getAll);
router.get('/hoc-vien/:id', hocVienController.getById);
router.post('/hoc-vien', hocVienController.create);
router.put('/hoc-vien/:id', hocVienController.update);
router.delete('/hoc-vien/:id', hocVienController.delete);

// ==================== Lịch Gác Routes ====================
router.get('/lich-gac', lichGacController.getAll);
router.get('/lich-gac/:id', lichGacController.getById);
router.post('/lich-gac', lichGacController.create);
router.put('/lich-gac/:id', lichGacController.update);
router.delete('/lich-gac/:id', lichGacController.delete);

// ==================== Ca Gác Routes ====================
router.get('/ca-gac', caGacController.getAll);
router.get('/ca-gac/:id', caGacController.getById);
router.post('/ca-gac', caGacController.create);
router.put('/ca-gac/:id', caGacController.update);
router.delete('/ca-gac/:id', caGacController.delete);

// ==================== Vòng Gác Routes ====================
router.get('/vong-gac', vongGacController.getAll);
router.get('/vong-gac/:id', vongGacController.getById);
router.post('/vong-gac', vongGacController.create);
router.put('/vong-gac/:id', vongGacController.update);
router.delete('/vong-gac/:id', vongGacController.delete);

// ==================== Phân Công Gác Routes ====================
router.get('/phan-cong', phanCongGacController.getAll);
router.get('/phan-cong/lich/:lichGacId', phanCongGacController.getByLichGac);
router.post('/phan-cong', phanCongGacController.create);
router.post('/phan-cong/bulk', phanCongGacController.createBulk);
router.delete('/phan-cong/:id', phanCongGacController.delete);

// ==================== Kiểm Tra Gác Routes ====================
router.get('/kiem-tra', kiemTraGacController.getAll);
router.get('/kiem-tra/:id', kiemTraGacController.getById);
router.post('/kiem-tra', kiemTraGacController.create);
router.put('/kiem-tra/:id', kiemTraGacController.update);
router.delete('/kiem-tra/:id', kiemTraGacController.delete);

// ==================== VKTB Routes ====================
router.get('/vktb', vktbController.getAll);
router.get('/vktb/:id', vktbController.getById);
router.post('/vktb', vktbController.create);
router.put('/vktb/:id', vktbController.update);
router.delete('/vktb/:id', vktbController.delete);

export default router;
