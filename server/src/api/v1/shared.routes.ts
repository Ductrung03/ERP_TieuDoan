import { Router } from 'express';
import { 
    donViController, 
    canBoController, 
    hocVienController,
    quanHamController,
    chucVuController 
} from '../../shared/controllers/shared.controller';

const router = Router();

// === Don Vi ===
router.get('/donvis', donViController.getAll.bind(donViController));
router.get('/donvis/:id', donViController.getById.bind(donViController));
router.post('/donvis', donViController.create.bind(donViController));
router.put('/donvis/:id', donViController.update.bind(donViController));
router.delete('/donvis/:id', donViController.delete.bind(donViController));

// === Can Bo ===
router.get('/canbos', canBoController.getAll.bind(canBoController));
router.get('/canbos/:id', canBoController.getById.bind(canBoController));
router.post('/canbos', canBoController.create.bind(canBoController));
router.put('/canbos/:id', canBoController.update.bind(canBoController));
router.delete('/canbos/:id', canBoController.delete.bind(canBoController));

// === Hoc Vien ===
router.get('/hocviens', hocVienController.getAll.bind(hocVienController));
router.get('/hocviens/:id', hocVienController.getById.bind(hocVienController));
router.post('/hocviens', hocVienController.create.bind(hocVienController));
router.put('/hocviens/:id', hocVienController.update.bind(hocVienController));
router.delete('/hocviens/:id', hocVienController.delete.bind(hocVienController));

// === Quan Ham ===
router.get('/quanhams', quanHamController.getAll.bind(quanHamController));

// === Chuc Vu ===
router.get('/chucvus', chucVuController.getAll.bind(chucVuController));

export default router;
