-- =============================================
-- ERP Tiểu Đoàn - RBAC Seed Data
-- Date: 2026-01-08
-- Description: Dữ liệu mẫu cho hệ thống phân quyền
-- =============================================

BEGIN;

-- =============================================
-- 1. CẬP NHẬT VAI TRÒ HIỆN TẠI
-- =============================================

UPDATE vaitro SET
    mota = 'Quản trị viên hệ thống - Toàn quyền',
    trangthai = 'Active',
    ngaytao = CURRENT_TIMESTAMP
WHERE maquyen = 'VT01';

UPDATE vaitro SET
    mota = 'Cán bộ quản lý - Quyền quản lý đơn vị',
    trangthai = 'Active',
    ngaytao = CURRENT_TIMESTAMP
WHERE maquyen = 'VT02';

UPDATE vaitro SET
    mota = 'Học viên - Chỉ xem thông tin',
    trangthai = 'Active',
    ngaytao = CURRENT_TIMESTAMP
WHERE maquyen = 'VT03';

UPDATE vaitro SET
    mota = 'Người xem - Xem và xuất báo cáo',
    trangthai = 'Active',
    ngaytao = CURRENT_TIMESTAMP
WHERE maquyen = 'VT04';

-- =============================================
-- 2. PHẠM VI DỮ LIỆU (Data Scopes)
-- =============================================

INSERT INTO phamvidulieu (maphamvi, tenphamvi, loaiphamvi, mota) VALUES
('PV001', 'Tất cả dữ liệu', 'ALL', 'Xem toàn bộ dữ liệu trong hệ thống'),
('PV002', 'Chỉ đơn vị mình', 'OWN_UNIT', 'Chỉ xem dữ liệu của đơn vị được gán'),
('PV003', 'Đơn vị và cấp dưới', 'SUB_UNITS', 'Xem đơn vị mình và các đơn vị cấp dưới'),
('PV004', 'Tùy chỉnh', 'CUSTOM', 'Chọn danh sách đơn vị cụ thể')
ON CONFLICT (maphamvi) DO NOTHING;

-- =============================================
-- 3. QUYỀN CHO MODULE QUẢN LÝ CANH GÁC
-- =============================================

-- 3.1. HỌC VIÊN (HOC_VIEN)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0001', 'Xem danh sách học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'VIEW', 'Xem danh sách học viên'),
('Q0002', 'Tạo học viên mới', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'CREATE', 'Thêm học viên mới vào hệ thống'),
('Q0003', 'Sửa thông tin học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'UPDATE', 'Chỉnh sửa thông tin học viên'),
('Q0004', 'Xóa học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'DELETE', 'Xóa học viên khỏi hệ thống'),
('Q0005', 'Xuất báo cáo học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'EXPORT', 'Xuất file báo cáo học viên')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.2. CÁN BỘ (CAN_BO)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0006', 'Xem danh sách cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'VIEW', 'Xem danh sách cán bộ'),
('Q0007', 'Tạo cán bộ mới', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'CREATE', 'Thêm cán bộ mới'),
('Q0008', 'Sửa thông tin cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'UPDATE', 'Chỉnh sửa thông tin cán bộ'),
('Q0009', 'Xóa cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'DELETE', 'Xóa cán bộ khỏi hệ thống'),
('Q0010', 'Xuất báo cáo cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'EXPORT', 'Xuất file báo cáo cán bộ')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.3. ĐƠN VỊ (DON_VI)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0011', 'Xem danh sách đơn vị', 'QUAN_LY_CANH_GAC', 'DON_VI', 'VIEW', 'Xem danh sách đơn vị'),
('Q0012', 'Tạo đơn vị mới', 'QUAN_LY_CANH_GAC', 'DON_VI', 'CREATE', 'Thêm đơn vị mới'),
('Q0013', 'Sửa thông tin đơn vị', 'QUAN_LY_CANH_GAC', 'DON_VI', 'UPDATE', 'Chỉnh sửa thông tin đơn vị'),
('Q0014', 'Xóa đơn vị', 'QUAN_LY_CANH_GAC', 'DON_VI', 'DELETE', 'Xóa đơn vị'),
('Q0015', 'Xuất báo cáo đơn vị', 'QUAN_LY_CANH_GAC', 'DON_VI', 'EXPORT', 'Xuất file báo cáo đơn vị')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.4. LỊCH GÁC (LICH_GAC)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0016', 'Xem lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'VIEW', 'Xem lịch gác'),
('Q0017', 'Tạo lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'CREATE', 'Tạo lịch gác mới'),
('Q0018', 'Sửa lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'UPDATE', 'Chỉnh sửa lịch gác'),
('Q0019', 'Xóa lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'DELETE', 'Xóa lịch gác'),
('Q0020', 'Xuất báo cáo lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'EXPORT', 'Xuất file báo cáo lịch gác')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.5. PHÂN CÔNG (PHAN_CONG)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0021', 'Xem phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'VIEW', 'Xem phân công gác'),
('Q0022', 'Tạo phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'CREATE', 'Tạo phân công gác mới'),
('Q0023', 'Sửa phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'UPDATE', 'Chỉnh sửa phân công'),
('Q0024', 'Xóa phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'DELETE', 'Xóa phân công'),
('Q0025', 'Phê duyệt phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'APPROVE', 'Phê duyệt phân công gác')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.6. KIỂM TRA GÁC (KIEM_TRA)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0026', 'Xem kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'VIEW', 'Xem kết quả kiểm tra gác'),
('Q0027', 'Tạo kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'CREATE', 'Ghi nhận kiểm tra gác mới'),
('Q0028', 'Sửa kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'UPDATE', 'Chỉnh sửa kết quả kiểm tra'),
('Q0029', 'Xóa kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'DELETE', 'Xóa bản ghi kiểm tra'),
('Q0030', 'Xuất báo cáo kiểm tra', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'EXPORT', 'Xuất file báo cáo kiểm tra')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.7. VKTB
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0031', 'Xem VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'VIEW', 'Xem danh sách VKTB'),
('Q0032', 'Tạo VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'CREATE', 'Thêm VKTB mới'),
('Q0033', 'Sửa VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'UPDATE', 'Chỉnh sửa thông tin VKTB'),
('Q0034', 'Xóa VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'DELETE', 'Xóa VKTB khỏi hệ thống'),
('Q0035', 'Xuất báo cáo VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'EXPORT', 'Xuất file báo cáo VKTB')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3.8. DASHBOARD
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0036', 'Xem Dashboard', 'QUAN_LY_CANH_GAC', 'DASHBOARD', 'VIEW', 'Xem trang thống kê tổng quan'),
('Q0037', 'Xuất báo cáo tổng hợp', 'QUAN_LY_CANH_GAC', 'DASHBOARD', 'EXPORT', 'Xuất báo cáo tổng hợp')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- =============================================
-- 4. QUYỀN CHO MODULE QUẢN LÝ NGƯỜI DÙNG
-- =============================================

-- 4.1. NGƯỜI DÙNG (NGUOI_DUNG)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0038', 'Xem danh sách người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'VIEW', 'Xem danh sách tài khoản'),
('Q0039', 'Tạo người dùng mới', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'CREATE', 'Tạo tài khoản mới'),
('Q0040', 'Sửa thông tin người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'UPDATE', 'Chỉnh sửa thông tin tài khoản'),
('Q0041', 'Xóa người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'DELETE', 'Xóa tài khoản'),
('Q0042', 'Reset mật khẩu', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'RESET_PASSWORD', 'Reset mật khẩu người dùng'),
('Q0043', 'Khóa/Mở khóa tài khoản', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'TOGGLE_STATUS', 'Khóa hoặc mở khóa tài khoản')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 4.2. VAI TRÒ (VAI_TRO)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0044', 'Xem danh sách vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'VIEW', 'Xem danh sách vai trò'),
('Q0045', 'Tạo vai trò mới', 'USER_MANAGEMENT', 'VAI_TRO', 'CREATE', 'Tạo vai trò mới'),
('Q0046', 'Sửa vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'UPDATE', 'Chỉnh sửa vai trò'),
('Q0047', 'Xóa vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'DELETE', 'Xóa vai trò'),
('Q0048', 'Gán quyền cho vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS', 'Gán quyền cho vai trò')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 4.3. QUYỀN (QUYEN)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0049', 'Xem danh sách quyền', 'USER_MANAGEMENT', 'QUYEN', 'VIEW', 'Xem danh sách quyền hệ thống'),
('Q0050', 'Tạo quyền mới', 'USER_MANAGEMENT', 'QUYEN', 'CREATE', 'Tạo quyền mới'),
('Q0051', 'Sửa quyền', 'USER_MANAGEMENT', 'QUYEN', 'UPDATE', 'Chỉnh sửa quyền'),
('Q0052', 'Xóa quyền', 'USER_MANAGEMENT', 'QUYEN', 'DELETE', 'Xóa quyền')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 4.4. PHẠM VI DỮ LIỆU (DATA_SCOPE)
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0053', 'Xem phạm vi dữ liệu', 'USER_MANAGEMENT', 'DATA_SCOPE', 'VIEW', 'Xem cấu hình phạm vi dữ liệu'),
('Q0054', 'Cấu hình phạm vi dữ liệu', 'USER_MANAGEMENT', 'DATA_SCOPE', 'UPDATE', 'Cấu hình phạm vi dữ liệu cho user')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- =============================================
-- 5. GÁN QUYỀN CHO CÁC VAI TRÒ
-- =============================================

-- 5.1. Admin (VT01): Toàn quyền
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT01', maquyen FROM quyen
ON CONFLICT DO NOTHING;

-- 5.2. Cán bộ (VT02): Quyền xem, tạo, sửa, phê duyệt, xuất (không xóa)
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT02', maquyen FROM quyen
WHERE hanhdonh IN ('VIEW', 'CREATE', 'UPDATE', 'APPROVE', 'EXPORT')
AND mamodule = 'QUAN_LY_CANH_GAC'
ON CONFLICT DO NOTHING;

-- 5.3. Học viên (VT03): Chỉ xem
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT03', maquyen FROM quyen
WHERE hanhdonh = 'VIEW'
AND mamodule = 'QUAN_LY_CANH_GAC'
ON CONFLICT DO NOTHING;

-- 5.4. Viewer (VT04): Xem và xuất báo cáo
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT04', maquyen FROM quyen
WHERE hanhdonh IN ('VIEW', 'EXPORT')
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. GÁN PHẠM VI DỮ LIỆU MẶC ĐỊNH CHO USERS HIỆN TẠI
-- =============================================

-- 6.1. Admin: Tất cả dữ liệu
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV001' FROM taikhoan WHERE maquyen = 'VT01'
ON CONFLICT DO NOTHING;

-- 6.2. Cán bộ: Đơn vị và cấp dưới
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV003' FROM taikhoan WHERE maquyen = 'VT02'
ON CONFLICT DO NOTHING;

-- 6.3. Học viên: Chỉ đơn vị mình
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV002' FROM taikhoan WHERE maquyen = 'VT03'
ON CONFLICT DO NOTHING;

-- 6.4. Viewer: Tất cả dữ liệu
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV001' FROM taikhoan WHERE maquyen = 'VT04'
ON CONFLICT DO NOTHING;

COMMIT;

-- =============================================
-- VERIFY SEED DATA
-- =============================================

DO $$
DECLARE
    perm_count INT;
    role_perm_count INT;
    scope_count INT;
    user_scope_count INT;
BEGIN
    SELECT COUNT(*) INTO perm_count FROM quyen;
    SELECT COUNT(*) INTO role_perm_count FROM vaitro_quyen;
    SELECT COUNT(*) INTO scope_count FROM phamvidulieu;
    SELECT COUNT(*) INTO user_scope_count FROM taikhoan_phamvi;

    RAISE NOTICE 'Seed data completed successfully!';
    RAISE NOTICE 'Permissions created: %', perm_count;
    RAISE NOTICE 'Role-Permission mappings: %', role_perm_count;
    RAISE NOTICE 'Data scopes created: %', scope_count;
    RAISE NOTICE 'User-Scope mappings: %', user_scope_count;
END $$;
