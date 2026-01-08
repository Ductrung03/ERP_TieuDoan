# KẾ HOẠCH TRIỂN KHAI HỆ THỐNG QUẢN LÝ NGƯỜI DÙNG VÀ PHÂN QUYỀN ĐỘNG

> **Dự án:** ERP Tiểu Đoàn - Module Quản Lý Người Dùng & Phân Quyền
> **Ngày tạo:** 2026-01-08
> **Kiến trúc:** Role-Based Access Control (RBAC) - Dynamic Permission System

---

## 📋 MỤC LỤC

1. [Phân Tích Hiện Trạng](#1-phân-tích-hiện-trạng)
2. [Thiết Kế Database Schema](#2-thiết-kế-database-schema)
3. [Kiến Trúc Backend](#3-kiến-trúc-backend)
4. [Kiến Trúc Frontend](#4-kiến-trúc-frontend)
5. [Roadmap Triển Khai](#5-roadmap-triển-khai)
6. [Testing Strategy](#6-testing-strategy)

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1 Database Hiện Tại

**Bảng `taikhoan` (Accounts):**
```sql
CREATE TABLE taikhoan (
    mataikhoan VARCHAR(20) PRIMARY KEY,          -- TK00001, TK00002...
    tendn VARCHAR(100) NOT NULL UNIQUE,          -- Username
    matkhau VARCHAR(255) NOT NULL,               -- Hashed password
    salt VARCHAR(255),                           -- Salt for bcrypt
    sdt VARCHAR(20),                             -- Phone number
    landangnhapcuoi TIMESTAMP,                   -- Last login
    trangthai VARCHAR(50) DEFAULT 'Active',      -- Active/Inactive
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Created date
    maquyen VARCHAR(20),                         -- FK -> vaitro
    madonvi VARCHAR(20)                          -- FK -> donvi
);
```

**Bảng `vaitro` (Roles):**
```sql
CREATE TABLE vaitro (
    maquyen VARCHAR(20) PRIMARY KEY,    -- VT01, VT02...
    tenquyen VARCHAR(100) NOT NULL      -- Admin, Cán bộ, Học viên, Viewer
);
```

**Seed Data Hiện Tại:**
- `VT01`: Admin
- `VT02`: Cán bộ
- `VT03`: Học viên
- `VT04`: Viewer

### 1.2 Vấn Đề Hiện Tại

❌ **Hạn chế của kiến trúc hiện tại:**

1. **Phân quyền tĩnh**: Mỗi vai trò chỉ có tên, không định nghĩa được quyền cụ thể
2. **Không linh hoạt**: Không thể tùy chỉnh quyền theo module/chức năng
3. **Thiếu phạm vi dữ liệu**: Không kiểm soát được user xem dữ liệu đơn vị nào
4. **Không có middleware Auth**: Backend chưa có JWT verification
5. **Không có UI quản lý**: Chưa có giao diện quản lý người dùng và phân quyền

---

## 2. THIẾT KẾ DATABASE SCHEMA

### 2.1 Kiến Trúc RBAC Động

```
User (taikhoan) ──┐
                  ├──> UserRoles ──> Role (vaitro) ──> RolePermissions ──> Permission (quyen)
                  │
                  └──> UserDataScope ──> DataScope (phamvidulieu)
```

### 2.2 Tables Cần Tạo Mới

#### 2.2.1 Bảng `quyen` (Permissions)
Định nghĩa các quyền cụ thể trong hệ thống.

```sql
CREATE SEQUENCE seq_quyen START WITH 1 INCREMENT BY 1;

CREATE TABLE quyen (
    maquyen VARCHAR(20) PRIMARY KEY DEFAULT ('Q' || LPAD(NEXTVAL('seq_quyen')::TEXT, 4, '0')),
    tenquyen VARCHAR(100) NOT NULL,              -- Tên quyền (VD: Xem danh sách học viên)
    mamodule VARCHAR(50) NOT NULL,               -- Module (VD: QUAN_LY_CANH_GAC, USER_MANAGEMENT)
    machucnang VARCHAR(50) NOT NULL,             -- Chức năng (VD: HOC_VIEN, LICH_GAC)
    hanhdonh VARCHAR(20) NOT NULL,               -- Action (VIEW, CREATE, UPDATE, DELETE, APPROVE)
    mota TEXT,                                   -- Mô tả chi tiết
    trangthai VARCHAR(20) DEFAULT 'Active',      -- Active/Inactive
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(mamodule, machucnang, hanhdonh)
);

CREATE INDEX idx_quyen_module ON quyen(mamodule);
CREATE INDEX idx_quyen_chucnang ON quyen(machucnang);

COMMENT ON TABLE quyen IS 'Bảng định nghĩa các quyền cụ thể trong hệ thống';
COMMENT ON COLUMN quyen.mamodule IS 'Module: QUAN_LY_CANH_GAC, USER_MANAGEMENT, DASHBOARD';
COMMENT ON COLUMN quyen.machucnang IS 'Chức năng: HOC_VIEN, CAN_BO, LICH_GAC, PHAN_CONG';
COMMENT ON COLUMN quyen.hanhdonh IS 'Hành động: VIEW, CREATE, UPDATE, DELETE, APPROVE, EXPORT';
```

**Ví dụ dữ liệu:**
| maquyen | tenquyen | mamodule | machucnang | hanhdonh | mota |
|---------|----------|----------|------------|----------|------|
| Q0001 | Xem danh sách học viên | QUAN_LY_CANH_GAC | HOC_VIEN | VIEW | Được xem danh sách học viên |
| Q0002 | Tạo học viên mới | QUAN_LY_CANH_GAC | HOC_VIEN | CREATE | Được thêm học viên mới |
| Q0003 | Sửa thông tin học viên | QUAN_LY_CANH_GAC | HOC_VIEN | UPDATE | Được chỉnh sửa thông tin học viên |
| Q0004 | Xóa học viên | QUAN_LY_CANH_GAC | HOC_VIEN | DELETE | Được xóa học viên |
| Q0005 | Xuất báo cáo học viên | QUAN_LY_CANH_GAC | HOC_VIEN | EXPORT | Được xuất file báo cáo |

#### 2.2.2 Bảng `vaitro_quyen` (Role Permissions - Many-to-Many)
Liên kết vai trò với các quyền.

```sql
CREATE TABLE vaitro_quyen (
    maquyen_vt VARCHAR(20) NOT NULL,    -- FK -> vaitro.maquyen
    maquyen_q VARCHAR(20) NOT NULL,     -- FK -> quyen.maquyen
    ngaycap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoicap VARCHAR(20),               -- FK -> taikhoan.mataikhoan

    PRIMARY KEY (maquyen_vt, maquyen_q),
    FOREIGN KEY (maquyen_vt) REFERENCES vaitro(maquyen) ON DELETE CASCADE,
    FOREIGN KEY (maquyen_q) REFERENCES quyen(maquyen) ON DELETE CASCADE
);

CREATE INDEX idx_vaitro_quyen_role ON vaitro_quyen(maquyen_vt);
CREATE INDEX idx_vaitro_quyen_perm ON vaitro_quyen(maquyen_q);

COMMENT ON TABLE vaitro_quyen IS 'Bảng liên kết vai trò và quyền (M-N)';
```

#### 2.2.3 Bảng `phamvidulieu` (Data Scopes)
Định nghĩa phạm vi dữ liệu mà user có thể truy cập.

```sql
CREATE SEQUENCE seq_phamvidulieu START WITH 1 INCREMENT BY 1;

CREATE TABLE phamvidulieu (
    maphamvi VARCHAR(20) PRIMARY KEY DEFAULT ('PV' || LPAD(NEXTVAL('seq_phamvidulieu')::TEXT, 3, '0')),
    tenphamvi VARCHAR(100) NOT NULL,             -- Tên phạm vi (VD: Tất cả, Chỉ đơn vị mình, Đơn vị cấp dưới)
    loaiphamvi VARCHAR(50) NOT NULL,             -- ALL, OWN_UNIT, SUB_UNITS, CUSTOM
    mota TEXT,
    trangthai VARCHAR(20) DEFAULT 'Active',
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE phamvidulieu IS 'Bảng định nghĩa các phạm vi dữ liệu';
COMMENT ON COLUMN phamvidulieu.loaiphamvi IS 'ALL: Tất cả, OWN_UNIT: Chỉ đơn vị mình, SUB_UNITS: Đơn vị cấp dưới, CUSTOM: Tùy chỉnh';
```

**Ví dụ dữ liệu:**
| maphamvi | tenphamvi | loaiphamvi | mota |
|----------|-----------|------------|------|
| PV001 | Tất cả dữ liệu | ALL | Xem tất cả dữ liệu trong hệ thống |
| PV002 | Chỉ đơn vị mình | OWN_UNIT | Chỉ xem dữ liệu của đơn vị mình |
| PV003 | Đơn vị cấp dưới | SUB_UNITS | Xem đơn vị mình và các đơn vị cấp dưới |
| PV004 | Tùy chỉnh | CUSTOM | Chọn danh sách đơn vị cụ thể |

#### 2.2.4 Bảng `taikhoan_phamvi` (User Data Scopes)
Gán phạm vi dữ liệu cho từng user.

```sql
CREATE TABLE taikhoan_phamvi (
    mataikhoan VARCHAR(20) NOT NULL,    -- FK -> taikhoan
    maphamvi VARCHAR(20) NOT NULL,      -- FK -> phamvidulieu
    ngaycap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoicap VARCHAR(20),               -- FK -> taikhoan (admin gán quyền)

    PRIMARY KEY (mataikhoan, maphamvi),
    FOREIGN KEY (mataikhoan) REFERENCES taikhoan(mataikhoan) ON DELETE CASCADE,
    FOREIGN KEY (maphamvi) REFERENCES phamvidulieu(maphamvi) ON DELETE CASCADE
);

CREATE INDEX idx_taikhoan_phamvi_user ON taikhoan_phamvi(mataikhoan);

COMMENT ON TABLE taikhoan_phamvi IS 'Bảng gán phạm vi dữ liệu cho user';
```

#### 2.2.5 Bảng `phamvi_donvi` (Custom Data Scope Units)
Danh sách đơn vị cụ thể cho phạm vi tùy chỉnh.

```sql
CREATE TABLE phamvi_donvi (
    maphamvi VARCHAR(20) NOT NULL,      -- FK -> phamvidulieu
    madonvi VARCHAR(20) NOT NULL,       -- FK -> donvi
    ngaythem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (maphamvi, madonvi),
    FOREIGN KEY (maphamvi) REFERENCES phamvidulieu(maphamvi) ON DELETE CASCADE,
    FOREIGN KEY (madonvi) REFERENCES donvi(madonvi) ON DELETE CASCADE
);

CREATE INDEX idx_phamvi_donvi_scope ON phamvi_donvi(maphamvi);

COMMENT ON TABLE phamvi_donvi IS 'Bảng chi tiết các đơn vị trong phạm vi CUSTOM';
```

#### 2.2.6 Cập Nhật Bảng `vaitro` (Roles)
Thêm các trường mô tả và trạng thái.

```sql
ALTER TABLE vaitro ADD COLUMN mota TEXT;
ALTER TABLE vaitro ADD COLUMN trangthai VARCHAR(20) DEFAULT 'Active';
ALTER TABLE vaitro ADD COLUMN ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vaitro ADD COLUMN nguoitao VARCHAR(20);

CREATE INDEX idx_vaitro_trangthai ON vaitro(trangthai);

COMMENT ON COLUMN vaitro.mota IS 'Mô tả vai trò';
COMMENT ON COLUMN vaitro.trangthai IS 'Trạng thái: Active/Inactive';
```

### 2.3 Migration Script

**File:** `database/migrations/002_add_rbac_system.sql`

```sql
-- =============================================
-- ERP Tiểu Đoàn - RBAC System Migration
-- Date: 2026-01-08
-- =============================================

BEGIN;

-- 1. Tạo sequences
CREATE SEQUENCE IF NOT EXISTS seq_quyen START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_phamvidulieu START WITH 1 INCREMENT BY 1;

-- 2. Tạo bảng quyen
CREATE TABLE IF NOT EXISTS quyen (
    maquyen VARCHAR(20) PRIMARY KEY DEFAULT ('Q' || LPAD(NEXTVAL('seq_quyen')::TEXT, 4, '0')),
    tenquyen VARCHAR(100) NOT NULL,
    mamodule VARCHAR(50) NOT NULL,
    machucnang VARCHAR(50) NOT NULL,
    hanhdonh VARCHAR(20) NOT NULL,
    mota TEXT,
    trangthai VARCHAR(20) DEFAULT 'Active',
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mamodule, machucnang, hanhdonh)
);

CREATE INDEX IF NOT EXISTS idx_quyen_module ON quyen(mamodule);
CREATE INDEX IF NOT EXISTS idx_quyen_chucnang ON quyen(machucnang);

-- 3. Tạo bảng vaitro_quyen
CREATE TABLE IF NOT EXISTS vaitro_quyen (
    maquyen_vt VARCHAR(20) NOT NULL,
    maquyen_q VARCHAR(20) NOT NULL,
    ngaycap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoicap VARCHAR(20),
    PRIMARY KEY (maquyen_vt, maquyen_q),
    FOREIGN KEY (maquyen_vt) REFERENCES vaitro(maquyen) ON DELETE CASCADE,
    FOREIGN KEY (maquyen_q) REFERENCES quyen(maquyen) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vaitro_quyen_role ON vaitro_quyen(maquyen_vt);
CREATE INDEX IF NOT EXISTS idx_vaitro_quyen_perm ON vaitro_quyen(maquyen_q);

-- 4. Tạo bảng phamvidulieu
CREATE TABLE IF NOT EXISTS phamvidulieu (
    maphamvi VARCHAR(20) PRIMARY KEY DEFAULT ('PV' || LPAD(NEXTVAL('seq_phamvidulieu')::TEXT, 3, '0')),
    tenphamvi VARCHAR(100) NOT NULL,
    loaiphamvi VARCHAR(50) NOT NULL,
    mota TEXT,
    trangthai VARCHAR(20) DEFAULT 'Active',
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tạo bảng taikhoan_phamvi
CREATE TABLE IF NOT EXISTS taikhoan_phamvi (
    mataikhoan VARCHAR(20) NOT NULL,
    maphamvi VARCHAR(20) NOT NULL,
    ngaycap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoicap VARCHAR(20),
    PRIMARY KEY (mataikhoan, maphamvi),
    FOREIGN KEY (mataikhoan) REFERENCES taikhoan(mataikhoan) ON DELETE CASCADE,
    FOREIGN KEY (maphamvi) REFERENCES phamvidulieu(maphamvi) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_taikhoan_phamvi_user ON taikhoan_phamvi(mataikhoan);

-- 6. Tạo bảng phamvi_donvi
CREATE TABLE IF NOT EXISTS phamvi_donvi (
    maphamvi VARCHAR(20) NOT NULL,
    madonvi VARCHAR(20) NOT NULL,
    ngaythem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (maphamvi, madonvi),
    FOREIGN KEY (maphamvi) REFERENCES phamvidulieu(maphamvi) ON DELETE CASCADE,
    FOREIGN KEY (madonvi) REFERENCES donvi(madonvi) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_phamvi_donvi_scope ON phamvi_donvi(maphamvi);

-- 7. Cập nhật bảng vaitro
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS mota TEXT;
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS trangthai VARCHAR(20) DEFAULT 'Active';
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS nguoitao VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_vaitro_trangthai ON vaitro(trangthai);

COMMIT;
```

### 2.4 Seed Data - Permissions & Scopes

**File:** `database/seeds/003_rbac_seed_data.sql`

```sql
BEGIN;

-- =============================================
-- SEED: Data Scopes (Phạm vi dữ liệu)
-- =============================================
INSERT INTO phamvidulieu (maphamvi, tenphamvi, loaiphamvi, mota) VALUES
('PV001', 'Tất cả dữ liệu', 'ALL', 'Xem toàn bộ dữ liệu trong hệ thống'),
('PV002', 'Chỉ đơn vị mình', 'OWN_UNIT', 'Chỉ xem dữ liệu của đơn vị được gán'),
('PV003', 'Đơn vị và cấp dưới', 'SUB_UNITS', 'Xem đơn vị mình và các đơn vị cấp dưới'),
('PV004', 'Tùy chỉnh', 'CUSTOM', 'Chọn danh sách đơn vị cụ thể')
ON CONFLICT (maphamvi) DO NOTHING;

-- =============================================
-- SEED: Permissions cho Module Quản Lý Canh Gác
-- =============================================

-- 1. Học Viên
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0001', 'Xem danh sách học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'VIEW', 'Xem danh sách học viên'),
('Q0002', 'Tạo học viên mới', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'CREATE', 'Thêm học viên mới vào hệ thống'),
('Q0003', 'Sửa thông tin học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'UPDATE', 'Chỉnh sửa thông tin học viên'),
('Q0004', 'Xóa học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'DELETE', 'Xóa học viên khỏi hệ thống'),
('Q0005', 'Xuất báo cáo học viên', 'QUAN_LY_CANH_GAC', 'HOC_VIEN', 'EXPORT', 'Xuất file báo cáo học viên')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 2. Cán Bộ
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0006', 'Xem danh sách cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'VIEW', 'Xem danh sách cán bộ'),
('Q0007', 'Tạo cán bộ mới', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'CREATE', 'Thêm cán bộ mới'),
('Q0008', 'Sửa thông tin cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'UPDATE', 'Chỉnh sửa thông tin cán bộ'),
('Q0009', 'Xóa cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'DELETE', 'Xóa cán bộ khỏi hệ thống'),
('Q0010', 'Xuất báo cáo cán bộ', 'QUAN_LY_CANH_GAC', 'CAN_BO', 'EXPORT', 'Xuất file báo cáo cán bộ')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 3. Lịch Gác
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0011', 'Xem lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'VIEW', 'Xem lịch gác'),
('Q0012', 'Tạo lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'CREATE', 'Tạo lịch gác mới'),
('Q0013', 'Sửa lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'UPDATE', 'Chỉnh sửa lịch gác'),
('Q0014', 'Xóa lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'DELETE', 'Xóa lịch gác'),
('Q0015', 'Xuất báo cáo lịch gác', 'QUAN_LY_CANH_GAC', 'LICH_GAC', 'EXPORT', 'Xuất file báo cáo lịch gác')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 4. Phân Công
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0016', 'Xem phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'VIEW', 'Xem phân công gác'),
('Q0017', 'Tạo phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'CREATE', 'Tạo phân công gác mới'),
('Q0018', 'Sửa phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'UPDATE', 'Chỉnh sửa phân công'),
('Q0019', 'Xóa phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'DELETE', 'Xóa phân công'),
('Q0020', 'Phê duyệt phân công', 'QUAN_LY_CANH_GAC', 'PHAN_CONG', 'APPROVE', 'Phê duyệt phân công gác')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 5. Kiểm Tra Gác
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0021', 'Xem kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'VIEW', 'Xem kết quả kiểm tra gác'),
('Q0022', 'Tạo kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'CREATE', 'Ghi nhận kiểm tra gác mới'),
('Q0023', 'Sửa kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'UPDATE', 'Chỉnh sửa kết quả kiểm tra'),
('Q0024', 'Xóa kiểm tra gác', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'DELETE', 'Xóa bản ghi kiểm tra'),
('Q0025', 'Xuất báo cáo kiểm tra', 'QUAN_LY_CANH_GAC', 'KIEM_TRA', 'EXPORT', 'Xuất file báo cáo kiểm tra')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 6. VKTB
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0026', 'Xem VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'VIEW', 'Xem danh sách VKTB'),
('Q0027', 'Tạo VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'CREATE', 'Thêm VKTB mới'),
('Q0028', 'Sửa VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'UPDATE', 'Chỉnh sửa thông tin VKTB'),
('Q0029', 'Xóa VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'DELETE', 'Xóa VKTB khỏi hệ thống'),
('Q0030', 'Xuất báo cáo VKTB', 'QUAN_LY_CANH_GAC', 'VKTB', 'EXPORT', 'Xuất file báo cáo VKTB')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 7. Dashboard
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0031', 'Xem Dashboard', 'QUAN_LY_CANH_GAC', 'DASHBOARD', 'VIEW', 'Xem trang thống kê tổng quan'),
('Q0032', 'Xuất báo cáo tổng hợp', 'QUAN_LY_CANH_GAC', 'DASHBOARD', 'EXPORT', 'Xuất báo cáo tổng hợp')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- =============================================
-- SEED: Permissions cho Module Quản Lý Người Dùng
-- =============================================

-- 8. User Management
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0033', 'Xem danh sách người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'VIEW', 'Xem danh sách tài khoản'),
('Q0034', 'Tạo người dùng mới', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'CREATE', 'Tạo tài khoản mới'),
('Q0035', 'Sửa thông tin người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'UPDATE', 'Chỉnh sửa thông tin tài khoản'),
('Q0036', 'Xóa người dùng', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'DELETE', 'Xóa tài khoản'),
('Q0037', 'Reset mật khẩu', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'RESET_PASSWORD', 'Reset mật khẩu người dùng'),
('Q0038', 'Khóa/Mở khóa tài khoản', 'USER_MANAGEMENT', 'NGUOI_DUNG', 'TOGGLE_STATUS', 'Khóa hoặc mở khóa tài khoản')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 9. Role Management
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0039', 'Xem danh sách vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'VIEW', 'Xem danh sách vai trò'),
('Q0040', 'Tạo vai trò mới', 'USER_MANAGEMENT', 'VAI_TRO', 'CREATE', 'Tạo vai trò mới'),
('Q0041', 'Sửa vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'UPDATE', 'Chỉnh sửa vai trò'),
('Q0042', 'Xóa vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'DELETE', 'Xóa vai trò'),
('Q0043', 'Gán quyền cho vai trò', 'USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS', 'Gán quyền cho vai trò')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- 10. Permission Management
INSERT INTO quyen (maquyen, tenquyen, mamodule, machucnang, hanhdonh, mota) VALUES
('Q0044', 'Xem danh sách quyền', 'USER_MANAGEMENT', 'QUYEN', 'VIEW', 'Xem danh sách quyền hệ thống'),
('Q0045', 'Tạo quyền mới', 'USER_MANAGEMENT', 'QUYEN', 'CREATE', 'Tạo quyền mới'),
('Q0046', 'Sửa quyền', 'USER_MANAGEMENT', 'QUYEN', 'UPDATE', 'Chỉnh sửa quyền'),
('Q0047', 'Xóa quyền', 'USER_MANAGEMENT', 'QUYEN', 'DELETE', 'Xóa quyền')
ON CONFLICT (mamodule, machucnang, hanhdonh) DO NOTHING;

-- =============================================
-- GÁN QUYỀN MẶC ĐỊNH CHO CÁC VAI TRÒ
-- =============================================

-- Admin (VT01): Full permissions
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT01', maquyen FROM quyen
ON CONFLICT DO NOTHING;

-- Cán bộ (VT02): Quyền xem, tạo, sửa (không xóa)
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT02', maquyen FROM quyen
WHERE hanhdonh IN ('VIEW', 'CREATE', 'UPDATE', 'APPROVE', 'EXPORT')
AND mamodule = 'QUAN_LY_CANH_GAC'
ON CONFLICT DO NOTHING;

-- Học viên (VT03): Chỉ xem
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT03', maquyen FROM quyen
WHERE hanhdonh = 'VIEW'
AND mamodule = 'QUAN_LY_CANH_GAC'
ON CONFLICT DO NOTHING;

-- Viewer (VT04): Xem tất cả
INSERT INTO vaitro_quyen (maquyen_vt, maquyen_q)
SELECT 'VT04', maquyen FROM quyen
WHERE hanhdonh IN ('VIEW', 'EXPORT')
ON CONFLICT DO NOTHING;

-- =============================================
-- GÁN PHẠM VI DỮ LIỆU MẶC ĐỊNH
-- =============================================

-- Admin: Tất cả dữ liệu
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV001' FROM taikhoan WHERE maquyen = 'VT01'
ON CONFLICT DO NOTHING;

-- Cán bộ: Đơn vị và cấp dưới
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV003' FROM taikhoan WHERE maquyen = 'VT02'
ON CONFLICT DO NOTHING;

-- Học viên: Chỉ đơn vị mình
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV002' FROM taikhoan WHERE maquyen = 'VT03'
ON CONFLICT DO NOTHING;

-- Viewer: Tất cả dữ liệu
INSERT INTO taikhoan_phamvi (mataikhoan, maphamvi)
SELECT mataikhoan, 'PV001' FROM taikhoan WHERE maquyen = 'VT04'
ON CONFLICT DO NOTHING;

COMMIT;
```

---

## 3. KIẾN TRÚC BACKEND

### 3.1 Module Structure

```
server/src/modules/user-management/
├── module.config.ts                      # Module configuration
├── controllers/
│   ├── user.controller.ts                # CRUD users
│   ├── role.controller.ts                # CRUD roles
│   ├── permission.controller.ts          # CRUD permissions
│   ├── data-scope.controller.ts          # CRUD data scopes
│   └── index.ts
├── services/
│   ├── user.service.ts
│   ├── role.service.ts
│   ├── permission.service.ts
│   ├── data-scope.service.ts
│   ├── auth.service.ts                   # Login, JWT verification
│   └── index.ts
├── repositories/
│   ├── user.repository.ts
│   ├── role.repository.ts
│   ├── permission.repository.ts
│   ├── data-scope.repository.ts
│   └── index.ts
├── entities/
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── permission.entity.ts
│   ├── data-scope.entity.ts
│   └── index.ts
├── dtos/
│   ├── user.dto.ts
│   ├── role.dto.ts
│   ├── permission.dto.ts
│   ├── data-scope.dto.ts
│   ├── login.dto.ts
│   └── index.ts
├── middleware/
│   ├── auth.middleware.ts                # JWT verification
│   ├── permission.middleware.ts          # Check permissions
│   ├── data-scope.middleware.ts          # Filter by data scope
│   └── index.ts
├── routes/
│   └── index.ts
└── index.ts
```

### 3.2 Core Auth Middleware

**File:** `server/src/modules/user-management/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../core/errors';
import { UserService } from '../services/user.service';

export interface AuthRequest extends Request {
  user?: {
    mataikhoan: string;
    tendn: string;
    maquyen: string;
    madonvi: string;
    permissions: string[];      // ['Q0001', 'Q0002'...]
    dataScopes: string[];       // ['PV001']
  };
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token không hợp lệ');
    }

    const token = authHeader.substring(7);

    // 2. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    // 3. Load user permissions & data scopes
    const userService = new UserService();
    const userPermissions = await userService.getUserPermissions(decoded.mataikhoan);
    const userDataScopes = await userService.getUserDataScopes(decoded.mataikhoan);

    // 4. Attach to request
    (req as AuthRequest).user = {
      mataikhoan: decoded.mataikhoan,
      tendn: decoded.tendn,
      maquyen: decoded.maquyen,
      madonvi: decoded.madonvi,
      permissions: userPermissions,
      dataScopes: userDataScopes,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token đã hết hạn',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Xác thực thất bại',
    });
  }
};
```

### 3.3 Permission Middleware

**File:** `server/src/modules/user-management/middleware/permission.middleware.ts`

```typescript
import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../../../core/errors';
import { AuthRequest } from './auth.middleware';

/**
 * Permission check middleware factory
 * @param module - VD: 'QUAN_LY_CANH_GAC'
 * @param feature - VD: 'HOC_VIEN'
 * @param action - VD: 'VIEW', 'CREATE', 'UPDATE', 'DELETE'
 */
export const requirePermission = (
  module: string,
  feature: string,
  action: string
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Chưa xác thực');
      }

      // Admin bypass permission check
      if (req.user.maquyen === 'VT01') {
        return next();
      }

      // Check if user has the required permission
      const hasPermission = await checkUserPermission(
        req.user.mataikhoan,
        module,
        feature,
        action
      );

      if (!hasPermission) {
        throw new ForbiddenError('Bạn không có quyền thực hiện hành động này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

async function checkUserPermission(
  mataikhoan: string,
  module: string,
  feature: string,
  action: string
): Promise<boolean> {
  // Query to check permission
  const query = `
    SELECT COUNT(*) as count
    FROM taikhoan tk
    INNER JOIN vaitro_quyen vq ON tk.maquyen = vq.maquyen_vt
    INNER JOIN quyen q ON vq.maquyen_q = q.maquyen
    WHERE tk.mataikhoan = $1
      AND q.mamodule = $2
      AND q.machucnang = $3
      AND q.hanhdonh = $4
      AND q.trangthai = 'Active'
  `;

  const result = await db.query(query, [mataikhoan, module, feature, action]);
  return parseInt(result.rows[0].count) > 0;
}
```

### 3.4 Data Scope Middleware

**File:** `server/src/modules/user-management/middleware/data-scope.middleware.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Database } from '../../../core/database/connection';

/**
 * Data scope filter middleware
 * Automatically filters queries based on user's data scope
 */
export const applyDataScope = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next();
    }

    // Get user's allowed unit IDs
    const allowedUnits = await getAllowedUnits(req.user.mataikhoan, req.user.madonvi);

    // Attach to request for use in repositories
    req.user.allowedUnits = allowedUnits;

    next();
  } catch (error) {
    next(error);
  }
};

async function getAllowedUnits(mataikhoan: string, userUnitId: string): Promise<string[]> {
  const db = Database.getInstance();

  const query = `
    SELECT pv.loaiphamvi, pv.maphamvi
    FROM taikhoan_phamvi tp
    INNER JOIN phamvidulieu pv ON tp.maphamvi = pv.maphamvi
    WHERE tp.mataikhoan = $1 AND pv.trangthai = 'Active'
  `;

  const result = await db.query(query, [mataikhoan]);

  if (result.rows.length === 0) {
    return [userUnitId]; // Default: own unit
  }

  const scope = result.rows[0];

  switch (scope.loaiphamvi) {
    case 'ALL':
      // Return all units
      const allUnits = await db.query('SELECT madonvi FROM donvi');
      return allUnits.rows.map((row: any) => row.madonvi);

    case 'OWN_UNIT':
      return [userUnitId];

    case 'SUB_UNITS':
      // Return own unit + sub units
      const subUnits = await db.query(`
        WITH RECURSIVE unit_tree AS (
          SELECT madonvi FROM donvi WHERE madonvi = $1
          UNION ALL
          SELECT d.madonvi FROM donvi d
          INNER JOIN unit_tree ut ON d.madonvitren = ut.madonvi
        )
        SELECT madonvi FROM unit_tree
      `, [userUnitId]);
      return subUnits.rows.map((row: any) => row.madonvi);

    case 'CUSTOM':
      // Return custom units
      const customUnits = await db.query(`
        SELECT madonvi FROM phamvi_donvi WHERE maphamvi = $1
      `, [scope.maphamvi]);
      return customUnits.rows.map((row: any) => row.madonvi);

    default:
      return [userUnitId];
  }
}
```

### 3.5 Auth Service

**File:** `server/src/modules/user-management/services/auth.service.ts`

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from '../../../core/database/connection';
import { UnauthorizedError } from '../../../core/errors';
import { LoginDto } from '../dtos/login.dto';

export class AuthService {
  private db = Database.getInstance();

  async login(dto: LoginDto): Promise<{ token: string; user: any }> {
    // 1. Find user by username
    const query = `
      SELECT tk.*, vt.tenquyen
      FROM taikhoan tk
      LEFT JOIN vaitro vt ON tk.maquyen = vt.maquyen
      WHERE tk.tendn = $1 AND tk.trangthai = 'Active'
    `;

    const result = await this.db.query(query, [dto.username]);

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const user = result.rows[0];

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.matkhau);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        mataikhoan: user.mataikhoan,
        tendn: user.tendn,
        maquyen: user.maquyen,
        madonvi: user.madonvi,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // 4. Update last login
    await this.db.query(
      'UPDATE taikhoan SET landangnhapcuoi = CURRENT_TIMESTAMP WHERE mataikhoan = $1',
      [user.mataikhoan]
    );

    // 5. Return token & user info (without password)
    delete user.matkhau;
    delete user.salt;

    return {
      token,
      user,
    };
  }

  async getUserPermissions(mataikhoan: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT q.maquyen
      FROM taikhoan tk
      INNER JOIN vaitro_quyen vq ON tk.maquyen = vq.maquyen_vt
      INNER JOIN quyen q ON vq.maquyen_q = q.maquyen
      WHERE tk.mataikhoan = $1 AND q.trangthai = 'Active'
    `;

    const result = await this.db.query(query, [mataikhoan]);
    return result.rows.map((row: any) => row.maquyen);
  }

  async getUserDataScopes(mataikhoan: string): Promise<string[]> {
    const query = `
      SELECT pv.maphamvi
      FROM taikhoan_phamvi tp
      INNER JOIN phamvidulieu pv ON tp.maphamvi = pv.maphamvi
      WHERE tp.mataikhoan = $1 AND pv.trangthai = 'Active'
    `;

    const result = await this.db.query(query, [mataikhoan]);
    return result.rows.map((row: any) => row.maphamvi);
  }
}
```

---

## 4. KIẾN TRÚC FRONTEND

### 4.1 Module Structure

```
client/src/modules/user-management/
├── pages/
│   ├── UserList.tsx                      # Danh sách người dùng
│   ├── UserForm.tsx                      # Form thêm/sửa user
│   ├── RoleList.tsx                      # Danh sách vai trò
│   ├── RoleForm.tsx                      # Form thêm/sửa vai trò
│   ├── RolePermissions.tsx               # Gán quyền cho vai trò
│   ├── PermissionList.tsx                # Danh sách quyền
│   └── DataScopeManagement.tsx           # Quản lý phạm vi dữ liệu
├── components/
│   ├── UserTable.tsx
│   ├── RoleTable.tsx
│   ├── PermissionTree.tsx                # Tree view permissions
│   ├── DataScopeSelector.tsx
│   └── PasswordResetModal.tsx
├── hooks/
│   ├── useAuth.tsx                       # Hook for auth context
│   ├── usePermission.tsx                 # Hook to check permission
│   └── useDataScope.tsx
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── role.service.ts
│   └── permission.service.ts
├── types/
│   ├── user.types.ts
│   ├── role.types.ts
│   └── permission.types.ts
└── routes.tsx
```

### 4.2 Auth Context

**File:** `client/src/modules/user-management/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  mataikhoan: string;
  tendn: string;
  maquyen: string;
  tenquyen: string;
  madonvi: string;
  permissions: string[];
  dataScopes: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, feature: string, action: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user info on mount
    if (token) {
      loadUserInfo();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Token invalid, logout
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('auth_token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const hasPermission = (module: string, feature: string, action: string): boolean => {
    if (!user) return false;

    // Admin bypass
    if (user.maquyen === 'VT01') return true;

    // Check if user has this specific permission
    // This requires fetching permission details from backend
    // For now, simplified check
    return user.permissions.length > 0;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 4.3 Permission Hook

**File:** `client/src/modules/user-management/hooks/usePermission.tsx`

```typescript
import { useAuth } from '../context/AuthContext';

export const usePermission = () => {
  const { user, hasPermission } = useAuth();

  const can = (module: string, feature: string, action: string): boolean => {
    return hasPermission(module, feature, action);
  };

  const canView = (module: string, feature: string) => can(module, feature, 'VIEW');
  const canCreate = (module: string, feature: string) => can(module, feature, 'CREATE');
  const canUpdate = (module: string, feature: string) => can(module, feature, 'UPDATE');
  const canDelete = (module: string, feature: string) => can(module, feature, 'DELETE');
  const canApprove = (module: string, feature: string) => can(module, feature, 'APPROVE');
  const canExport = (module: string, feature: string) => can(module, feature, 'EXPORT');

  return {
    can,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,
    canExport,
    isAdmin: user?.maquyen === 'VT01',
  };
};

// Usage example:
// const { canCreate, canDelete, isAdmin } = usePermission();
//
// {canCreate('QUAN_LY_CANH_GAC', 'HOC_VIEN') && (
//   <Button onClick={handleCreate}>Thêm mới</Button>
// )}
```

### 4.4 Protected Route Component

**File:** `client/src/modules/user-management/components/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  requiredFeature?: string;
  requiredAction?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredModule,
  requiredFeature,
  requiredAction,
}) => {
  const { user, isLoading } = useAuth();
  const { can } = usePermission();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If permission required, check it
  if (requiredModule && requiredFeature && requiredAction) {
    if (!can(requiredModule, requiredFeature, requiredAction)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};

// Usage example in routes:
// <Route
//   path="/guard-management/hoc-vien"
//   element={
//     <ProtectedRoute
//       requiredModule="QUAN_LY_CANH_GAC"
//       requiredFeature="HOC_VIEN"
//       requiredAction="VIEW"
//     >
//       <QuanLyHocVien />
//     </ProtectedRoute>
//   }
// />
```

### 4.5 UI Components

#### User List Page

**File:** `client/src/modules/user-management/pages/UserList.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal } from 'react-bootstrap';
import { usePermission } from '../hooks/usePermission';
import { userService } from '../services/user.service';
import { User } from '../types/user.types';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { canCreate, canUpdate, canDelete } = usePermission();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Quản Lý Người Dùng</h5>
        {canCreate('USER_MANAGEMENT', 'NGUOI_DUNG') && (
          <Button variant="primary" onClick={() => {}}>
            <i className="bi bi-plus-circle me-2"></i>
            Thêm người dùng
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Mã TK</th>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Đơn vị</th>
              <th>Trạng thái</th>
              <th>Đăng nhập cuối</th>
              {(canUpdate('USER_MANAGEMENT', 'NGUOI_DUNG') ||
                canDelete('USER_MANAGEMENT', 'NGUOI_DUNG')) && (
                <th>Hành động</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.mataikhoan}>
                <td>{user.mataikhoan}</td>
                <td>{user.tendn}</td>
                <td>{user.tenquyen}</td>
                <td>{user.tendonvi}</td>
                <td>
                  <Badge bg={user.trangthai === 'Active' ? 'success' : 'danger'}>
                    {user.trangthai}
                  </Badge>
                </td>
                <td>{user.landangnhapcuoi || 'Chưa đăng nhập'}</td>
                {(canUpdate('USER_MANAGEMENT', 'NGUOI_DUNG') ||
                  canDelete('USER_MANAGEMENT', 'NGUOI_DUNG')) && (
                  <td>
                    {canUpdate('USER_MANAGEMENT', 'NGUOI_DUNG') && (
                      <Button variant="warning" size="sm" className="me-2">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    )}
                    {canDelete('USER_MANAGEMENT', 'NGUOI_DUNG') && (
                      <Button variant="danger" size="sm">
                        <i className="bi bi-trash"></i>
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
```

#### Role Permissions Management

**File:** `client/src/modules/user-management/pages/RolePermissions.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Accordion } from 'react-bootstrap';
import { roleService } from '../services/role.service';
import { permissionService } from '../services/permission.service';

interface Permission {
  maquyen: string;
  tenquyen: string;
  mamodule: string;
  machucnang: string;
  hanhdonh: string;
  mota: string;
}

interface PermissionGroup {
  module: string;
  features: {
    [feature: string]: Permission[];
  };
}

export const RolePermissions: React.FC<{ roleId: string }> = ({ roleId }) => {
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [roleId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load all permissions grouped by module/feature
      const allPerms = await permissionService.getAll();
      const grouped = groupPermissions(allPerms);
      setPermissions(grouped);

      // Load current role permissions
      const rolePerms = await roleService.getPermissions(roleId);
      setSelectedPermissions(new Set(rolePerms.map((p: any) => p.maquyen)));
    } catch (error) {
      console.error('Failed to load permissions', error);
    } finally {
      setLoading(false);
    }
  };

  const groupPermissions = (perms: Permission[]): PermissionGroup[] => {
    const groups: { [module: string]: { [feature: string]: Permission[] } } = {};

    perms.forEach((perm) => {
      if (!groups[perm.mamodule]) {
        groups[perm.mamodule] = {};
      }
      if (!groups[perm.mamodule][perm.machucnang]) {
        groups[perm.mamodule][perm.machucnang] = [];
      }
      groups[perm.mamodule][perm.machucnang].push(perm);
    });

    return Object.entries(groups).map(([module, features]) => ({
      module,
      features,
    }));
  };

  const handleTogglePermission = (permId: string) => {
    const newSet = new Set(selectedPermissions);
    if (newSet.has(permId)) {
      newSet.delete(permId);
    } else {
      newSet.add(permId);
    }
    setSelectedPermissions(newSet);
  };

  const handleSave = async () => {
    try {
      await roleService.updatePermissions(roleId, Array.from(selectedPermissions));
      alert('Cập nhật quyền thành công!');
    } catch (error) {
      console.error('Failed to update permissions', error);
      alert('Cập nhật quyền thất bại!');
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5>Phân Quyền</h5>
      </Card.Header>
      <Card.Body>
        <Accordion>
          {permissions.map((group, idx) => (
            <Accordion.Item key={idx} eventKey={String(idx)}>
              <Accordion.Header>
                <strong>{group.module}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {Object.entries(group.features).map(([feature, perms]) => (
                  <div key={feature} className="mb-3">
                    <h6 className="text-primary">{feature}</h6>
                    {perms.map((perm) => (
                      <Form.Check
                        key={perm.maquyen}
                        type="checkbox"
                        id={perm.maquyen}
                        label={`${perm.tenquyen} (${perm.hanhdonh})`}
                        checked={selectedPermissions.has(perm.maquyen)}
                        onChange={() => handleTogglePermission(perm.maquyen)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <div className="mt-3">
          <Button variant="primary" onClick={handleSave}>
            <i className="bi bi-save me-2"></i>
            Lưu thay đổi
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
```

---

## 5. ROADMAP TRIỂN KHAI

### Phase 1: Database & Backend Core (3-4 ngày)
✅ **Mục tiêu:** Xây dựng nền tảng database và core authentication

**Tasks:**
1. Tạo migration script cho RBAC tables
2. Seed data cho permissions & data scopes
3. Implement Auth Service (login, JWT generation)
4. Implement Auth Middleware (JWT verification)
5. Implement Permission Middleware
6. Implement Data Scope Middleware
7. Testing middleware với Postman

### Phase 2: User Management Module - Backend (2-3 ngày)
✅ **Mục tiêu:** CRUD APIs cho User, Role, Permission

**Tasks:**
1. User Repository, Service, Controller, DTO
2. Role Repository, Service, Controller, DTO
3. Permission Repository, Service, Controller, DTO
4. Data Scope Repository, Service, Controller, DTO
5. API Routes registration
6. Testing APIs với Postman

### Phase 3: Frontend Authentication (2 ngày)
✅ **Mục tiêu:** Login page và Auth context

**Tasks:**
1. Create AuthContext & AuthProvider
2. Implement Login Page
3. Implement useAuth hook
4. Implement usePermission hook
5. Create ProtectedRoute component
6. Update App routing with auth protection

### Phase 4: Frontend User Management UI (3-4 ngày)
✅ **Mục tiêu:** UI quản lý user, role, permission

**Tasks:**
1. UserList page + UserForm
2. RoleList page + RoleForm
3. RolePermissions page (assign permissions to role)
4. PermissionList page (view only)
5. DataScopeManagement page
6. UI/UX polish

### Phase 5: Integration & Testing (2 ngày)
✅ **Mục tiêu:** Tích hợp và kiểm tra toàn hệ thống

**Tasks:**
1. Apply permission checks to existing Guard Management module
2. Apply data scope filters to existing APIs
3. Update frontend Guard Management pages with permission hooks
4. End-to-end testing
5. Bug fixes
6. Performance optimization

### Phase 6: Documentation (1 ngày)
✅ **Mục tiêu:** Tài liệu hóa hệ thống

**Tasks:**
1. Update README.md
2. Create API documentation
3. Create user manual for admins
4. Update CONTRIBUTING.md

---

## 6. TESTING STRATEGY

### 6.1 Unit Tests

**Backend:**
- Auth Service: login, JWT generation, password verification
- Permission Middleware: permission check logic
- Data Scope Middleware: unit filtering logic
- Repository layer: database queries

**Frontend:**
- useAuth hook: login, logout, user state
- usePermission hook: permission check logic
- Services: API calls

### 6.2 Integration Tests

**Backend:**
- API endpoints with authentication
- Permission middleware with various roles
- Data scope filtering in queries

**Frontend:**
- Login flow
- Protected routes
- Permission-based UI rendering

### 6.3 End-to-End Tests

**Scenarios:**
1. **Admin user:**
   - Login → View all data → Create/Update/Delete users/roles
2. **Cán bộ user:**
   - Login → View own unit + sub units → Create/Update (no delete)
3. **Học viên user:**
   - Login → View only own unit → Read-only access
4. **Viewer user:**
   - Login → View all data → Read-only + Export

### 6.4 Test Data

Create test accounts for each scenario:
```sql
-- Test accounts (password: Test123456)
INSERT INTO taikhoan (mataikhoan, tendn, matkhau, maquyen, madonvi, trangthai) VALUES
('TK99001', 'test_admin', '$2b$10$...', 'VT01', 'DV0001', 'Active'),
('TK99002', 'test_canbo', '$2b$10$...', 'VT02', 'DV0002', 'Active'),
('TK99003', 'test_hocvien', '$2b$10$...', 'VT03', 'DV0005', 'Active'),
('TK99004', 'test_viewer', '$2b$10$...', 'VT04', 'DV0001', 'Active');
```

---

## 7. KẾT LUẬN

### 7.1 Ưu Điểm Của Kiến Trúc

✅ **Phân quyền động:** Admin có thể tùy chỉnh quyền cho từng vai trò
✅ **Phạm vi dữ liệu:** Kiểm soát được user xem dữ liệu đơn vị nào
✅ **Scalable:** Dễ dàng thêm module/quyền mới
✅ **Clean Architecture:** Tuân thủ separation of concerns
✅ **Security:** JWT + bcrypt + middleware layers
✅ **UX-friendly:** Permission-based UI rendering

### 7.2 Lưu Ý Khi Triển Khai

⚠️ **Security:**
- Luôn validate input ở cả backend và frontend
- Hash password với bcrypt (cost factor >= 10)
- JWT secret phải strong và không commit vào git
- HTTPS cho production

⚠️ **Performance:**
- Index các bảng permission/role properly
- Cache permissions trong JWT payload (careful with token size)
- Optimize data scope queries (recursive CTE)

⚠️ **Maintainability:**
- Document tất cả permissions
- Versioning cho permission changes
- Migration strategy khi thay đổi schema

---


