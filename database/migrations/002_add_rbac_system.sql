-- =============================================
-- ERP Tiểu Đoàn - RBAC System Migration
-- Date: 2026-01-08
-- Description: Thêm hệ thống phân quyền động (RBAC)
-- =============================================

BEGIN;

-- =============================================
-- 1. TẠO SEQUENCES
-- =============================================

CREATE SEQUENCE IF NOT EXISTS seq_quyen START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_phamvidulieu START WITH 1 INCREMENT BY 1;

-- =============================================
-- 2. TẠO BẢNG QUYEN (Permissions)
-- =============================================

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
CREATE INDEX IF NOT EXISTS idx_quyen_trangthai ON quyen(trangthai);

COMMENT ON TABLE quyen IS 'Bảng định nghĩa các quyền cụ thể trong hệ thống';
COMMENT ON COLUMN quyen.mamodule IS 'Module: QUAN_LY_CANH_GAC, USER_MANAGEMENT, DASHBOARD';
COMMENT ON COLUMN quyen.machucnang IS 'Chức năng: HOC_VIEN, CAN_BO, LICH_GAC, PHAN_CONG';
COMMENT ON COLUMN quyen.hanhdonh IS 'Hành động: VIEW, CREATE, UPDATE, DELETE, APPROVE, EXPORT';

-- =============================================
-- 3. TẠO BẢNG VAITRO_QUYEN (Role-Permission Mapping)
-- =============================================

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

COMMENT ON TABLE vaitro_quyen IS 'Bảng liên kết vai trò và quyền (Many-to-Many)';

-- =============================================
-- 4. TẠO BẢNG PHAMVIDULIEU (Data Scopes)
-- =============================================

CREATE TABLE IF NOT EXISTS phamvidulieu (
    maphamvi VARCHAR(20) PRIMARY KEY DEFAULT ('PV' || LPAD(NEXTVAL('seq_phamvidulieu')::TEXT, 3, '0')),
    tenphamvi VARCHAR(100) NOT NULL,
    loaiphamvi VARCHAR(50) NOT NULL,
    mota TEXT,
    trangthai VARCHAR(20) DEFAULT 'Active',
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_phamvidulieu_loai ON phamvidulieu(loaiphamvi);
CREATE INDEX IF NOT EXISTS idx_phamvidulieu_trangthai ON phamvidulieu(trangthai);

COMMENT ON TABLE phamvidulieu IS 'Bảng định nghĩa các phạm vi dữ liệu';
COMMENT ON COLUMN phamvidulieu.loaiphamvi IS 'ALL: Tất cả, OWN_UNIT: Chỉ đơn vị mình, SUB_UNITS: Đơn vị cấp dưới, CUSTOM: Tùy chỉnh';

-- =============================================
-- 5. TẠO BẢNG TAIKHOAN_PHAMVI (User-DataScope Mapping)
-- =============================================

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
CREATE INDEX IF NOT EXISTS idx_taikhoan_phamvi_scope ON taikhoan_phamvi(maphamvi);

COMMENT ON TABLE taikhoan_phamvi IS 'Bảng gán phạm vi dữ liệu cho user';

-- =============================================
-- 6. TẠO BẢNG PHAMVI_DONVI (Custom Data Scope Units)
-- =============================================

CREATE TABLE IF NOT EXISTS phamvi_donvi (
    maphamvi VARCHAR(20) NOT NULL,
    madonvi VARCHAR(20) NOT NULL,
    ngaythem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (maphamvi, madonvi),
    FOREIGN KEY (maphamvi) REFERENCES phamvidulieu(maphamvi) ON DELETE CASCADE,
    FOREIGN KEY (madonvi) REFERENCES donvi(madonvi) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_phamvi_donvi_scope ON phamvi_donvi(maphamvi);
CREATE INDEX IF NOT EXISTS idx_phamvi_donvi_unit ON phamvi_donvi(madonvi);

COMMENT ON TABLE phamvi_donvi IS 'Bảng chi tiết các đơn vị trong phạm vi CUSTOM';

-- =============================================
-- 7. CẬP NHẬT BẢNG VAITRO (Roles)
-- =============================================

ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS mota TEXT;
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS trangthai VARCHAR(20) DEFAULT 'Active';
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vaitro ADD COLUMN IF NOT EXISTS nguoitao VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_vaitro_trangthai ON vaitro(trangthai);

COMMENT ON COLUMN vaitro.mota IS 'Mô tả vai trò';
COMMENT ON COLUMN vaitro.trangthai IS 'Trạng thái: Active/Inactive';

-- =============================================
-- 8. CẬP NHẬT BẢNG TAIKHOAN (Accounts)
-- =============================================

-- Thêm index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_taikhoan_trangthai ON taikhoan(trangthai);
CREATE INDEX IF NOT EXISTS idx_taikhoan_maquyen ON taikhoan(maquyen);
CREATE INDEX IF NOT EXISTS idx_taikhoan_madonvi ON taikhoan(madonvi);

COMMIT;

-- =============================================
-- VERIFY MIGRATION
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Migration 002_add_rbac_system.sql completed successfully!';
    RAISE NOTICE 'Created tables: quyen, vaitro_quyen, phamvidulieu, taikhoan_phamvi, phamvi_donvi';
    RAISE NOTICE 'Updated table: vaitro';
END $$;
