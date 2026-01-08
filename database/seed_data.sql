-- =============================================
-- ERP Tiểu Đoàn - Seed Data Script
-- Guard Management Module
-- =============================================
-- Chạy: psql -h <host> -U postgres -d erp_tieu_doan -f seed_data.sql
-- =============================================

BEGIN;

-- =============================================
-- NHÓM 1: MASTER TABLES
-- =============================================

-- 1.1 Vai Trò (Roles)
INSERT INTO vaitro (maquyen, tenquyen) VALUES
('VT01', 'Admin'),
('VT02', 'Cán bộ'),
('VT03', 'Học viên'),
('VT04', 'Viewer')
ON CONFLICT (maquyen) DO NOTHING;

-- 1.2 Vi Phạm (Violations)
INSERT INTO vipham (mavipham, tenvipham, diemtru) VALUES
('VP0001', 'Ngủ gác', 10),
('VP0002', 'Rời vị trí không phép', 8),
('VP0003', 'Không mang VKTB', 5),
('VP0004', 'Trang phục không đúng quy định', 3),
('VP0005', 'Đến trễ ca gác', 2),
('VP0006', 'Vi phạm khác', 1)
ON CONFLICT (mavipham) DO NOTHING;

-- 1.3 Loại VKTB (Equipment Types)
INSERT INTO loaivktb (maloaivktb, tenloai) VALUES
('LVK001', 'Súng'),
('LVK002', 'Đạn'),
('LVK003', 'Lựu đạn'),
('LVK004', 'Dao găm'),
('LVK005', 'Trang bị bảo hộ')
ON CONFLICT (maloaivktb) DO NOTHING;

-- 1.4 Chức Vụ (Positions)
INSERT INTO chucvu (machucvu, tenchucvu, kyhieu) VALUES
('CV001', 'Tiểu đội trưởng', 'TĐT'),
('CV002', 'Tiểu đội phó', 'TĐP'),
('CV003', 'Trung đội trưởng', 'TrĐT'),
('CV004', 'Trung đội phó', 'TrĐP'),
('CV005', 'Đại đội trưởng', 'ĐĐT'),
('CV006', 'Đại đội phó', 'ĐĐP'),
('CV007', 'Tiểu đoàn trưởng', 'TDoT'),
('CV008', 'Tiểu đoàn phó', 'TDoP')
ON CONFLICT (machucvu) DO NOTHING;

-- 1.5 Quân Hàm (Ranks)
INSERT INTO quanham (maquanham, tenquanham, kyhieu) VALUES
('QH001', 'Binh nhì', 'B2'),
('QH002', 'Binh nhất', 'B1'),
('QH003', 'Hạ sĩ', 'HS'),
('QH004', 'Trung sĩ', 'TS'),
('QH005', 'Thượng sĩ', 'ThS'),
('QH006', 'Thiếu úy', 'ThU'),
('QH007', 'Trung úy', 'TrU'),
('QH008', 'Thượng úy', 'ThgU'),
('QH009', 'Đại úy', 'DU'),
('QH010', 'Thiếu tá', 'ThT')
ON CONFLICT (maquanham) DO NOTHING;

-- =============================================
-- NHÓM 2: ĐƠN VỊ & NHÂN SỰ
-- =============================================

-- 2.1 Đơn Vị (Units)
INSERT INTO donvi (madonvi, tendonvi, tongquanso, kyhieu, madonvitren) VALUES
('DV0001', 'Tiểu đoàn 1', 120, 'TD1', NULL),
('DV0002', 'Đại đội 1', 40, 'DD1', 'DV0001'),
('DV0003', 'Đại đội 2', 40, 'DD2', 'DV0001'),
('DV0004', 'Đại đội 3', 40, 'DD3', 'DV0001'),
('DV0005', 'Tiểu đội 1 - ĐĐ1', 10, 'TD1-1', 'DV0002'),
('DV0006', 'Tiểu đội 2 - ĐĐ1', 10, 'TD1-2', 'DV0002')
ON CONFLICT (madonvi) DO NOTHING;

-- 2.2 Cán Bộ (Officers)
INSERT INTO canbo (macanbo, hoten, ngaysinh, diachi, sdt, gmail, thoigianden, madonvi) VALUES
('CB00001', 'Nguyễn Văn Hùng', '1985-03-15', 'Hà Nội', '0912345001', 'hung.nv@army.vn', '2020-01-01', 'DV0001'),
('CB00002', 'Trần Minh Đức', '1987-06-20', 'Hà Nam', '0912345002', 'duc.tm@army.vn', '2020-01-01', 'DV0002'),
('CB00003', 'Lê Hoàng Nam', '1988-09-10', 'Nam Định', '0912345003', 'nam.lh@army.vn', '2021-01-01', 'DV0003'),
('CB00004', 'Phạm Quang Huy', '1986-12-05', 'Hải Dương', '0912345004', 'huy.pq@army.vn', '2021-01-01', 'DV0004'),
('CB00005', 'Hoàng Văn Tùng', '1990-04-18', 'Thái Bình', '0912345005', 'tung.hv@army.vn', '2022-01-01', 'DV0005'),
('CB00006', 'Vũ Đình Thắng', '1989-07-22', 'Hưng Yên', '0912345006', 'thang.vd@army.vn', '2022-01-01', 'DV0006'),
('CB00007', 'Đặng Văn Kiên', '1991-02-28', 'Hà Nội', '0912345007', 'kien.dv@army.vn', '2023-01-01', 'DV0002'),
('CB00008', 'Bùi Công Danh', '1992-11-11', 'Bắc Ninh', '0912345008', 'danh.bc@army.vn', '2023-01-01', 'DV0003'),
('CB00009', 'Ngô Quốc Việt', '1988-08-08', 'Vĩnh Phúc', '0912345009', 'viet.nq@army.vn', '2022-06-01', 'DV0004'),
('CB00010', 'Đinh Văn Long', '1993-01-25', 'Phú Thọ', '0912345010', 'long.dv@army.vn', '2023-06-01', 'DV0005')
ON CONFLICT (macanbo) DO NOTHING;

-- 2.3 Học Viên (Students/Soldiers) - 30 records
INSERT INTO hocvien (mahocvien, hoten, ngaysinh, diachi, sdt, gmail, madonvi) VALUES
('HV00001', 'Nguyễn Văn An', '2002-01-15', 'Hà Nội', '0901234001', 'an.nv@student.vn', 'DV0005'),
('HV00002', 'Trần Văn Bình', '2002-02-20', 'Hà Nam', '0901234002', 'binh.tv@student.vn', 'DV0005'),
('HV00003', 'Lê Văn Cường', '2002-03-10', 'Nam Định', '0901234003', 'cuong.lv@student.vn', 'DV0005'),
('HV00004', 'Phạm Văn Dũng', '2002-04-05', 'Hải Dương', '0901234004', 'dung.pv@student.vn', 'DV0005'),
('HV00005', 'Hoàng Văn Em', '2002-05-18', 'Thái Bình', '0901234005', 'em.hv@student.vn', 'DV0005'),
('HV00006', 'Vũ Văn Phong', '2002-06-22', 'Hưng Yên', '0901234006', 'phong.vv@student.vn', 'DV0006'),
('HV00007', 'Đặng Văn Giang', '2002-07-28', 'Hà Nội', '0901234007', 'giang.dv@student.vn', 'DV0006'),
('HV00008', 'Bùi Văn Hải', '2002-08-11', 'Bắc Ninh', '0901234008', 'hai.bv@student.vn', 'DV0006'),
('HV00009', 'Ngô Văn Ích', '2002-09-08', 'Vĩnh Phúc', '0901234009', 'ich.nv@student.vn', 'DV0006'),
('HV00010', 'Đinh Văn Kiệt', '2002-10-25', 'Phú Thọ', '0901234010', 'kiet.dv@student.vn', 'DV0006'),
('HV00011', 'Nguyễn Văn Lâm', '2003-01-15', 'Hà Nội', '0901234011', 'lam.nv@student.vn', 'DV0005'),
('HV00012', 'Trần Văn Minh', '2003-02-20', 'Hà Nam', '0901234012', 'minh.tv@student.vn', 'DV0005'),
('HV00013', 'Lê Văn Nghĩa', '2003-03-10', 'Nam Định', '0901234013', 'nghia.lv@student.vn', 'DV0005'),
('HV00014', 'Phạm Văn Oanh', '2003-04-05', 'Hải Dương', '0901234014', 'oanh.pv@student.vn', 'DV0006'),
('HV00015', 'Hoàng Văn Phúc', '2003-05-18', 'Thái Bình', '0901234015', 'phuc.hv@student.vn', 'DV0006'),
('HV00016', 'Vũ Văn Quang', '2003-06-22', 'Hưng Yên', '0901234016', 'quang.vv@student.vn', 'DV0005'),
('HV00017', 'Đặng Văn Sơn', '2003-07-28', 'Hà Nội', '0901234017', 'son.dv@student.vn', 'DV0005'),
('HV00018', 'Bùi Văn Tâm', '2003-08-11', 'Bắc Ninh', '0901234018', 'tam.bv@student.vn', 'DV0006'),
('HV00019', 'Ngô Văn Uy', '2003-09-08', 'Vĩnh Phúc', '0901234019', 'uy.nv@student.vn', 'DV0006'),
('HV00020', 'Đinh Văn Vương', '2003-10-25', 'Phú Thọ', '0901234020', 'vuong.dv@student.vn', 'DV0005'),
('HV00021', 'Nguyễn Văn Xuân', '2004-01-15', 'Hà Nội', '0901234021', 'xuan.nv@student.vn', 'DV0005'),
('HV00022', 'Trần Văn Yên', '2004-02-20', 'Hà Nam', '0901234022', 'yen.tv@student.vn', 'DV0006'),
('HV00023', 'Lê Văn Zũng', '2004-03-10', 'Nam Định', '0901234023', 'zung.lv@student.vn', 'DV0006'),
('HV00024', 'Phạm Minh Anh', '2004-04-05', 'Hải Dương', '0901234024', 'anh.pm@student.vn', 'DV0005'),
('HV00025', 'Hoàng Đức Bảo', '2004-05-18', 'Thái Bình', '0901234025', 'bao.hd@student.vn', 'DV0005'),
('HV00026', 'Vũ Quốc Cường', '2004-06-22', 'Hưng Yên', '0901234026', 'cuong.vq@student.vn', 'DV0006'),
('HV00027', 'Đặng Hữu Duy', '2004-07-28', 'Hà Nội', '0901234027', 'duy.dh@student.vn', 'DV0006'),
('HV00028', 'Bùi Thành Đạt', '2004-08-11', 'Bắc Ninh', '0901234028', 'dat.bt@student.vn', 'DV0005'),
('HV00029', 'Ngô Anh Hùng', '2004-09-08', 'Vĩnh Phúc', '0901234029', 'hung.na@student.vn', 'DV0005'),
('HV00030', 'Đinh Quang Khải', '2004-10-25', 'Phú Thọ', '0901234030', 'khai.dq@student.vn', 'DV0006')
ON CONFLICT (mahocvien) DO NOTHING;

-- 2.4 Tài Khoản (Accounts) - password: 123456 (hashed with bcrypt)
INSERT INTO taikhoan (mataikhoan, tendn, matkhau, salt, sdt, trangthai, maquyen, madonvi) VALUES
('TK00001', 'admin', '$2b$10$rIC/5X6UhZqH8.Z1K6UDOO.zQZ8VZqH8.Z1K6UDOOzQZ8VZqH8.Z1K', 'salt123', '0912345001', 'Active', 'VT01', 'DV0001'),
('TK00002', 'canbo01', '$2b$10$rIC/5X6UhZqH8.Z1K6UDOO.zQZ8VZqH8.Z1K6UDOOzQZ8VZqH8.Z1K', 'salt123', '0912345002', 'Active', 'VT02', 'DV0002'),
('TK00003', 'canbo02', '$2b$10$rIC/5X6UhZqH8.Z1K6UDOO.zQZ8VZqH8.Z1K6UDOOzQZ8VZqH8.Z1K', 'salt123', '0912345003', 'Active', 'VT02', 'DV0003'),
('TK00004', 'hocvien01', '$2b$10$rIC/5X6UhZqH8.Z1K6UDOO.zQZ8VZqH8.Z1K6UDOOzQZ8VZqH8.Z1K', 'salt123', '0901234001', 'Active', 'VT03', 'DV0005'),
('TK00005', 'viewer', '$2b$10$rIC/5X6UhZqH8.Z1K6UDOO.zQZ8VZqH8.Z1K6UDOOzQZ8VZqH8.Z1K', 'salt123', '0900000000', 'Active', 'VT04', 'DV0001')
ON CONFLICT (mataikhoan) DO NOTHING;

-- =============================================
-- NHÓM 3: CA GÁC & LỊCH
-- =============================================

-- 3.1 Ca Gác (Guard Shifts)
INSERT INTO cagac (macagac, thoigianbatdau, thoigianketthuc) VALUES
('CG0001', '2026-01-01 06:00:00', '2026-01-01 12:00:00'),
('CG0002', '2026-01-01 12:00:00', '2026-01-01 18:00:00'),
('CG0003', '2026-01-01 18:00:00', '2026-01-02 06:00:00')
ON CONFLICT (macagac) DO NOTHING;

-- 3.2 Vòng Gác (Guard Rounds)
INSERT INTO vonggac (mavonggac, tenvonggac, giobatdau, gioketthuc, mota) VALUES
('VG001', 'Vòng 1 - Cổng chính', '2026-01-01 00:00:00', '2026-01-01 23:59:59', 'Canh gác cổng chính'),
('VG002', 'Vòng 2 - Kho vũ khí', '2026-01-01 00:00:00', '2026-01-01 23:59:59', 'Canh gác kho vũ khí'),
('VG003', 'Vòng 3 - Khu nhà ở', '2026-01-01 00:00:00', '2026-01-01 23:59:59', 'Tuần tra khu nhà ở'),
('VG004', 'Vòng 4 - Phòng làm việc', '2026-01-01 00:00:00', '2026-01-01 23:59:59', 'Canh gác khu làm việc')
ON CONFLICT (mavonggac) DO NOTHING;

-- 3.3 Nhiệm Vụ (Tasks)
INSERT INTO nhiemvu (manhiemvu, tennhiemvu, mavonggac) VALUES
('NV0001', 'Kiểm tra giấy tờ ra vào', 'VG001'),
('NV0002', 'Ghi sổ nhật ký', 'VG001'),
('NV0003', 'Tuần tra định kỳ 30 phút', 'VG002'),
('NV0004', 'Kiểm tra khóa cửa kho', 'VG002'),
('NV0005', 'Tuần tra quanh nhà ở', 'VG003'),
('NV0006', 'Kiểm tra đèn chiếu sáng', 'VG003'),
('NV0007', 'Canh gác hành lang', 'VG004'),
('NV0008', 'Kiểm tra phòng làm việc', 'VG004')
ON CONFLICT (manhiemvu) DO NOTHING;

-- 3.4 Lịch Gác (Guard Schedule) - 2 tuần
INSERT INTO lichgac (malichgac, ngaygac, ghichu, matkhauhoi, matkhaudap, madonvi) VALUES
('LG000001', '2026-01-06', 'Lịch gác thứ 2', 'Ai đó?', 'Bạn tôi', 'DV0005'),
('LG000002', '2026-01-07', 'Lịch gác thứ 3', 'Ai đó?', 'Đồng chí', 'DV0005'),
('LG000003', '2026-01-08', 'Lịch gác thứ 4', 'Mật khẩu?', 'Chiến thắng', 'DV0005'),
('LG000004', '2026-01-09', 'Lịch gác thứ 5', 'Khẩu hiệu?', 'Quyết thắng', 'DV0005'),
('LG000005', '2026-01-10', 'Lịch gác thứ 6', 'Ai đó?', 'Bạn tôi', 'DV0005'),
('LG000006', '2026-01-11', 'Lịch gác thứ 7', 'Mật khẩu?', 'An toàn', 'DV0006'),
('LG000007', '2026-01-12', 'Lịch gác Chủ nhật', 'Khẩu hiệu?', 'Bảo vệ', 'DV0006'),
('LG000008', '2026-01-13', 'Lịch gác thứ 2', 'Ai đó?', 'Bạn tôi', 'DV0006'),
('LG000009', '2026-01-14', 'Lịch gác thứ 3', 'Mật khẩu?', 'Chiến thắng', 'DV0006'),
('LG000010', '2026-01-15', 'Lịch gác thứ 4', 'Khẩu hiệu?', 'Quyết thắng', 'DV0005'),
('LG000011', '2026-01-16', 'Lịch gác thứ 5', 'Ai đó?', 'Bạn tôi', 'DV0005'),
('LG000012', '2026-01-17', 'Lịch gác thứ 6', 'Mật khẩu?', 'An toàn', 'DV0005'),
('LG000013', '2026-01-18', 'Lịch gác thứ 7', 'Khẩu hiệu?', 'Bảo vệ', 'DV0006'),
('LG000014', '2026-01-19', 'Lịch gác Chủ nhật', 'Ai đó?', 'Đồng chí', 'DV0006')
ON CONFLICT (malichgac) DO NOTHING;

-- =============================================
-- NHÓM 4: PHÂN CÔNG & KIỂM TRA
-- =============================================

-- 4.1 Phân Công Gác (Guard Assignments) - 42 records (3 người/ca x 3 ca x ~5 ngày)
INSERT INTO pcgac (mapc, mahocvien, macagac, mavonggac, malichgac) VALUES
-- Ngày 06/01
('PC000001', 'HV00001', 'CG0001', 'VG001', 'LG000001'),
('PC000002', 'HV00002', 'CG0001', 'VG002', 'LG000001'),
('PC000003', 'HV00003', 'CG0001', 'VG003', 'LG000001'),
('PC000004', 'HV00004', 'CG0002', 'VG001', 'LG000001'),
('PC000005', 'HV00005', 'CG0002', 'VG002', 'LG000001'),
('PC000006', 'HV00011', 'CG0002', 'VG003', 'LG000001'),
('PC000007', 'HV00012', 'CG0003', 'VG001', 'LG000001'),
('PC000008', 'HV00013', 'CG0003', 'VG002', 'LG000001'),
('PC000009', 'HV00016', 'CG0003', 'VG003', 'LG000001'),
-- Ngày 07/01
('PC000010', 'HV00017', 'CG0001', 'VG001', 'LG000002'),
('PC000011', 'HV00020', 'CG0001', 'VG002', 'LG000002'),
('PC000012', 'HV00021', 'CG0001', 'VG003', 'LG000002'),
('PC000013', 'HV00024', 'CG0002', 'VG001', 'LG000002'),
('PC000014', 'HV00025', 'CG0002', 'VG002', 'LG000002'),
('PC000015', 'HV00028', 'CG0002', 'VG003', 'LG000002'),
('PC000016', 'HV00029', 'CG0003', 'VG001', 'LG000002'),
('PC000017', 'HV00001', 'CG0003', 'VG002', 'LG000002'),
('PC000018', 'HV00002', 'CG0003', 'VG003', 'LG000002'),
-- Ngày 08/01
('PC000019', 'HV00003', 'CG0001', 'VG001', 'LG000003'),
('PC000020', 'HV00004', 'CG0001', 'VG002', 'LG000003'),
('PC000021', 'HV00005', 'CG0001', 'VG003', 'LG000003'),
('PC000022', 'HV00006', 'CG0002', 'VG001', 'LG000003'),
('PC000023', 'HV00007', 'CG0002', 'VG002', 'LG000003'),
('PC000024', 'HV00008', 'CG0002', 'VG003', 'LG000003'),
('PC000025', 'HV00009', 'CG0003', 'VG001', 'LG000003'),
('PC000026', 'HV00010', 'CG0003', 'VG002', 'LG000003'),
('PC000027', 'HV00011', 'CG0003', 'VG003', 'LG000003'),
-- Ngày 09/01
('PC000028', 'HV00012', 'CG0001', 'VG001', 'LG000004'),
('PC000029', 'HV00013', 'CG0001', 'VG002', 'LG000004'),
('PC000030', 'HV00014', 'CG0001', 'VG003', 'LG000004'),
('PC000031', 'HV00015', 'CG0002', 'VG001', 'LG000004'),
('PC000032', 'HV00016', 'CG0002', 'VG002', 'LG000004'),
('PC000033', 'HV00017', 'CG0002', 'VG003', 'LG000004'),
('PC000034', 'HV00018', 'CG0003', 'VG001', 'LG000004'),
('PC000035', 'HV00019', 'CG0003', 'VG002', 'LG000004'),
('PC000036', 'HV00020', 'CG0003', 'VG003', 'LG000004'),
-- Ngày 10/01
('PC000037', 'HV00021', 'CG0001', 'VG001', 'LG000005'),
('PC000038', 'HV00022', 'CG0001', 'VG002', 'LG000005'),
('PC000039', 'HV00023', 'CG0001', 'VG003', 'LG000005'),
('PC000040', 'HV00024', 'CG0002', 'VG001', 'LG000005'),
('PC000041', 'HV00025', 'CG0002', 'VG002', 'LG000005'),
('PC000042', 'HV00026', 'CG0002', 'VG003', 'LG000005')
ON CONFLICT (mapc) DO NOTHING;

-- 4.2 Kiểm Tra Gác (Guard Inspections)
INSERT INTO kiemtragac (maktgac, ngay, trangthai, nhiemvuhocvien, macagac, mavp, macanbo) VALUES
('KT000001', '2026-01-06', 'Đảm bảo', 'Thực hiện tốt nhiệm vụ', 'CG0001', NULL, 'CB00002'),
('KT000002', '2026-01-06', 'Vi phạm nhẹ', 'Đến trễ 5 phút', 'CG0002', 'VP0005', 'CB00002'),
('KT000003', '2026-01-07', 'Đảm bảo', 'Canh gác đúng quy định', 'CG0001', NULL, 'CB00003'),
('KT000004', '2026-01-07', 'Đảm bảo', 'Hoàn thành nhiệm vụ', 'CG0003', NULL, 'CB00003'),
('KT000005', '2026-01-08', 'Vi phạm', 'Ngủ gác', 'CG0003', 'VP0001', 'CB00002'),
('KT000006', '2026-01-08', 'Đảm bảo', 'Tốt', 'CG0001', NULL, 'CB00004'),
('KT000007', '2026-01-09', 'Đảm bảo', 'Hoàn thành tốt', 'CG0002', NULL, 'CB00005'),
('KT000008', '2026-01-09', 'Vi phạm nhẹ', 'Trang phục chưa đúng', 'CG0001', 'VP0004', 'CB00005'),
('KT000009', '2026-01-10', 'Đảm bảo', 'Thực hiện đúng quy định', 'CG0001', NULL, 'CB00006'),
('KT000010', '2026-01-10', 'Đảm bảo', 'Hoàn thành nhiệm vụ tốt', 'CG0002', NULL, 'CB00006')
ON CONFLICT (maktgac) DO NOTHING;

-- 4.3 Lịch Sử Nghỉ Gác (Leave History)
INSERT INTO lichsunghigac (manghigac, ngaybd, ngaykt, lydo, mahocvien, canboduyet) VALUES
('NG00001', '2026-01-05', '2026-01-06', 'Nghỉ phép thường niên', 'HV00006', 'CB00002'),
('NG00002', '2026-01-07', '2026-01-08', 'Ốm đau', 'HV00007', 'CB00003'),
('NG00003', '2026-01-08', '2026-01-10', 'Công tác ngoài', 'HV00008', 'CB00002'),
('NG00004', '2026-01-09', '2026-01-09', 'Việc gia đình', 'HV00014', 'CB00004'),
('NG00005', '2026-01-10', '2026-01-11', 'Ốm đau', 'HV00015', 'CB00005')
ON CONFLICT (manghigac) DO NOTHING;

-- =============================================
-- NHÓM 5: VKTB
-- =============================================

-- 5.1 VKTB (Equipment)
INSERT INTO vktb (mavktb, tenvktb, donvitinh, tinhtrang, ghichu, maloaivktb) VALUES
('VK00001', 'Súng AK-47 #001', 'Khẩu', 'Tốt', 'Mới bảo dưỡng', 'LVK001'),
('VK00002', 'Súng AK-47 #002', 'Khẩu', 'Tốt', '', 'LVK001'),
('VK00003', 'Súng AK-47 #003', 'Khẩu', 'Cần sửa chữa', 'Hỏng khóa nòng', 'LVK001'),
('VK00004', 'Súng AK-47 #004', 'Khẩu', 'Tốt', '', 'LVK001'),
('VK00005', 'Súng AK-47 #005', 'Khẩu', 'Tốt', '', 'LVK001'),
('VK00006', 'Đạn AK 7.62mm', 'Hộp', 'Tốt', '100 viên/hộp', 'LVK002'),
('VK00007', 'Đạn AK 7.62mm', 'Hộp', 'Tốt', '100 viên/hộp', 'LVK002'),
('VK00008', 'Lựu đạn F1', 'Quả', 'Tốt', 'Lựu đạn huấn luyện', 'LVK003'),
('VK00009', 'Dao găm chiến đấu', 'Cái', 'Tốt', '', 'LVK004'),
('VK00010', 'Dao găm chiến đấu', 'Cái', 'Tốt', '', 'LVK004'),
('VK00011', 'Áo giáp chống đạn', 'Cái', 'Tốt', '', 'LVK005'),
('VK00012', 'Áo giáp chống đạn', 'Cái', 'Tốt', '', 'LVK005'),
('VK00013', 'Mũ sắt', 'Cái', 'Tốt', '', 'LVK005'),
('VK00014', 'Mũ sắt', 'Cái', 'Hỏng', 'Bị móp', 'LVK005'),
('VK00015', 'Đèn pin chiến thuật', 'Cái', 'Tốt', '', 'LVK005')
ON CONFLICT (mavktb) DO NOTHING;

-- 5.2 Biên Bản Mượn Trả VKTB
INSERT INTO bbmuontravktb (mabb, thoigian, muonhaytra, mavktb) VALUES
('BB000001', '2026-01-06 05:45:00', true, 'VK00001'),
('BB000002', '2026-01-06 12:15:00', false, 'VK00001'),
('BB000003', '2026-01-06 05:45:00', true, 'VK00002'),
('BB000004', '2026-01-06 12:15:00', false, 'VK00002'),
('BB000005', '2026-01-07 05:45:00', true, 'VK00001'),
('BB000006', '2026-01-07 12:15:00', false, 'VK00001'),
('BB000007', '2026-01-08 05:45:00', true, 'VK00004'),
('BB000008', '2026-01-08 12:15:00', false, 'VK00004'),
('BB000009', '2026-01-09 05:45:00', true, 'VK00005'),
('BB000010', '2026-01-09 12:15:00', false, 'VK00005')
ON CONFLICT (mabb) DO NOTHING;

-- 5.3 Gác VKTB (Equipment Assignment)
INSERT INTO gacvktb (magvktb, mapc, mabb) VALUES
('GVK000001', 'PC000001', 'BB000001'),
('GVK000002', 'PC000001', 'BB000002'),
('GVK000003', 'PC000002', 'BB000003'),
('GVK000004', 'PC000002', 'BB000004'),
('GVK000005', 'PC000010', 'BB000005'),
('GVK000006', 'PC000010', 'BB000006'),
('GVK000007', 'PC000019', 'BB000007'),
('GVK000008', 'PC000019', 'BB000008'),
('GVK000009', 'PC000028', 'BB000009'),
('GVK000010', 'PC000028', 'BB000010')
ON CONFLICT (magvktb) DO NOTHING;

-- 5.4 Lượt Biên Chế (Equipment Assignment History)
INSERT INTO luotbienche (maluotbienche, thoigianbatdau, thoigianketthuc, ghichu, mavktb) VALUES
('LBC00001', '2025-01-01', NULL, 'Biên chế ban đầu', 'VK00001'),
('LBC00002', '2025-01-01', NULL, 'Biên chế ban đầu', 'VK00002'),
('LBC00003', '2025-01-01', '2025-12-31', 'Đã chuyển đơn vị khác', 'VK00003'),
('LBC00004', '2025-06-01', NULL, 'Biên chế bổ sung', 'VK00004'),
('LBC00005', '2025-06-01', NULL, 'Biên chế bổ sung', 'VK00005')
ON CONFLICT (maluotbienche) DO NOTHING;

-- =============================================
-- NHÓM 6: MANY-TO-MANY RELATIONS
-- =============================================

-- 6.1 Cán Bộ - Chức Vụ
INSERT INTO canbo_chucvu (macanbo, machucvu, tgbonhiem, tgketthuc) VALUES
('CB00001', 'CV007', '2020-01-01', NULL),
('CB00002', 'CV005', '2020-01-01', NULL),
('CB00003', 'CV005', '2021-01-01', NULL),
('CB00004', 'CV005', '2021-01-01', NULL),
('CB00005', 'CV003', '2022-01-01', NULL),
('CB00006', 'CV003', '2022-01-01', NULL),
('CB00007', 'CV001', '2023-01-01', NULL),
('CB00008', 'CV001', '2023-01-01', NULL),
('CB00009', 'CV003', '2022-06-01', NULL),
('CB00010', 'CV001', '2023-06-01', NULL)
ON CONFLICT (macanbo, machucvu) DO NOTHING;

-- 6.2 Cán Bộ - Quân Hàm
INSERT INTO canbo_quanham (macanbo, maquanham, tgthangquanham, tgketthuc) VALUES
('CB00001', 'QH010', '2020-01-01', NULL),
('CB00002', 'QH009', '2020-01-01', NULL),
('CB00003', 'QH009', '2021-01-01', NULL),
('CB00004', 'QH008', '2021-01-01', NULL),
('CB00005', 'QH007', '2022-01-01', NULL),
('CB00006', 'QH007', '2022-01-01', NULL),
('CB00007', 'QH006', '2023-01-01', NULL),
('CB00008', 'QH006', '2023-01-01', NULL),
('CB00009', 'QH007', '2022-06-01', NULL),
('CB00010', 'QH006', '2023-06-01', NULL)
ON CONFLICT (macanbo, maquanham) DO NOTHING;

-- 6.3 Học Viên - Chức Vụ
INSERT INTO hocvien_chucvu (mahocvien, machucvu, tgbonhiem, tgketthuc) VALUES
('HV00001', 'CV001', '2025-01-01', NULL),
('HV00002', 'CV002', '2025-01-01', NULL),
('HV00006', 'CV001', '2025-01-01', NULL),
('HV00007', 'CV002', '2025-01-01', NULL),
('HV00011', 'CV001', '2025-06-01', NULL),
('HV00012', 'CV002', '2025-06-01', NULL),
('HV00014', 'CV001', '2025-06-01', NULL),
('HV00015', 'CV002', '2025-06-01', NULL),
('HV00021', 'CV001', '2025-09-01', NULL),
('HV00022', 'CV002', '2025-09-01', NULL)
ON CONFLICT (mahocvien, machucvu) DO NOTHING;

-- 6.4 Học Viên - Quân Hàm
INSERT INTO hocvien_quanham (mahocvien, maquanham, tgthangquanham, tgketthuc) VALUES
('HV00001', 'QH003', '2025-01-01', NULL),
('HV00002', 'QH003', '2025-01-01', NULL),
('HV00003', 'QH002', '2025-01-01', NULL),
('HV00004', 'QH002', '2025-01-01', NULL),
('HV00005', 'QH002', '2025-01-01', NULL),
('HV00006', 'QH003', '2025-01-01', NULL),
('HV00007', 'QH003', '2025-01-01', NULL),
('HV00008', 'QH002', '2025-01-01', NULL),
('HV00009', 'QH002', '2025-01-01', NULL),
('HV00010', 'QH002', '2025-01-01', NULL),
('HV00011', 'QH002', '2025-06-01', NULL),
('HV00012', 'QH002', '2025-06-01', NULL),
('HV00013', 'QH001', '2025-06-01', NULL),
('HV00014', 'QH002', '2025-06-01', NULL),
('HV00015', 'QH002', '2025-06-01', NULL),
('HV00016', 'QH001', '2025-06-01', NULL),
('HV00017', 'QH001', '2025-06-01', NULL),
('HV00018', 'QH001', '2025-06-01', NULL),
('HV00019', 'QH001', '2025-06-01', NULL),
('HV00020', 'QH001', '2025-06-01', NULL),
('HV00021', 'QH001', '2025-09-01', NULL),
('HV00022', 'QH001', '2025-09-01', NULL),
('HV00023', 'QH001', '2025-09-01', NULL),
('HV00024', 'QH001', '2025-09-01', NULL),
('HV00025', 'QH001', '2025-09-01', NULL),
('HV00026', 'QH001', '2025-09-01', NULL),
('HV00027', 'QH001', '2025-09-01', NULL),
('HV00028', 'QH001', '2025-09-01', NULL),
('HV00029', 'QH001', '2025-09-01', NULL),
('HV00030', 'QH001', '2025-09-01', NULL)
ON CONFLICT (mahocvien, maquanham) DO NOTHING;

COMMIT;

-- =============================================
-- VERIFY
-- =============================================
SELECT 'vaitro' as table_name, COUNT(*) as count FROM vaitro
UNION ALL SELECT 'vipham', COUNT(*) FROM vipham
UNION ALL SELECT 'loaivktb', COUNT(*) FROM loaivktb
UNION ALL SELECT 'chucvu', COUNT(*) FROM chucvu
UNION ALL SELECT 'quanham', COUNT(*) FROM quanham
UNION ALL SELECT 'donvi', COUNT(*) FROM donvi
UNION ALL SELECT 'canbo', COUNT(*) FROM canbo
UNION ALL SELECT 'hocvien', COUNT(*) FROM hocvien
UNION ALL SELECT 'taikhoan', COUNT(*) FROM taikhoan
UNION ALL SELECT 'cagac', COUNT(*) FROM cagac
UNION ALL SELECT 'vonggac', COUNT(*) FROM vonggac
UNION ALL SELECT 'nhiemvu', COUNT(*) FROM nhiemvu
UNION ALL SELECT 'lichgac', COUNT(*) FROM lichgac
UNION ALL SELECT 'pcgac', COUNT(*) FROM pcgac
UNION ALL SELECT 'kiemtragac', COUNT(*) FROM kiemtragac
UNION ALL SELECT 'lichsunghigac', COUNT(*) FROM lichsunghigac
UNION ALL SELECT 'vktb', COUNT(*) FROM vktb
UNION ALL SELECT 'bbmuontravktb', COUNT(*) FROM bbmuontravktb
UNION ALL SELECT 'gacvktb', COUNT(*) FROM gacvktb
UNION ALL SELECT 'luotbienche', COUNT(*) FROM luotbienche
UNION ALL SELECT 'canbo_chucvu', COUNT(*) FROM canbo_chucvu
UNION ALL SELECT 'canbo_quanham', COUNT(*) FROM canbo_quanham
UNION ALL SELECT 'hocvien_chucvu', COUNT(*) FROM hocvien_chucvu
UNION ALL SELECT 'hocvien_quanham', COUNT(*) FROM hocvien_quanham
ORDER BY table_name;
