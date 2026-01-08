# Hệ Thống ERP Tiểu Đoàn (Tiểu Đoàn ERP)

Chào mừng đến với dự án **Hệ thống ERP Module-based cho cấp Tiểu Đoàn**.
Dự án này là một web application quản lý toàn diện các hoạt động của tiểu đoàn theo mô hình module hóa (tương tự Odoo nhưng tùy biến cho đơn vị).

---

## 📚 Mục Lục
1. [Giới Thiệu](#1-giới-thiệu)
2. [Cấu Trúc Dự Án](#2-cấu-trúc-dự-án)
3. [Modules Hiện Có](#3-modules-hiện-có)
4. [Hướng Dẫn Cài Đặt (Quick Start)](#4-hướng-dẫn-cài-đặt)
5. [Tài Liệu Phát Triển (For Developers)](#5-tài-liệu-phát-triển)

---

## 1. Giới Thiệu
Hệ thống được thiết kế để số hóa các quy trình nghiệp vụ:
- Quản lý quân số (Đơn vị, Cán bộ, Học viên).
- Quản lý các hoạt động tác chiến, huấn luyện, canh gác.
- Kiến trúc **Module-based** cho phép mở rộng dễ dàng mà không ảnh hưởng core hệ thống.

**Công nghệ sử dụng:**
- **Backend:** Node.js, Express, TypeScript, PostgreSQL (Core Architecture).
- **Frontend:** React 19, Vite, Bootstrap, Axios (Clean UI).

---

## 📜 Quy Tắc & Tiêu Chuẩn (Project Rules)
Dự án tuân thủ nghiêm ngặt các quy tắc được định nghĩa trong:
👉 **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** (Đọc kỹ trước khi code!)

## 📖 Tài Liệu (Documentation)
Tài liệu chi tiết được tổ chức trong thư mục `docs/`:

- **Quy Tắc Chung**: [Project Rules](./docs/CONTRIBUTING.md)

---

## 2. Cấu Trúc Dự Án

Source code được tổ chức trong thư mục `/home/luckyboiz/LuckyBoiz/Projects/Reacts/ERPTieuDoan/`:

```bash
ERPTieuDoan/
├── client/                 # Mã nguồn Frontend (React)
│   ├── src/
│   │   ├── api/            # Kết nối Backend (Axios Services)
│   │   ├── pages/          # Giao diện người dùng (Clean UI)
│   │   └── shared/         # Components dùng chung
│
├── server/                 # Mã nguồn Backend (Node.js)
│   ├── src/
│   │   ├── core/           # Core System (Auth, DB, Logger)
│   │   ├── modules/        # CÁC MODULE NGHIỆP VỤ (Logic chính nằm ở đây)
│   │   └── shared/         # Entities dùng chung (DonVi, CanBo...)
│
├── database/               # SQL Scripts & Backups
└── docs/                   # 📂 TÀI LIỆU DỰ ÁN (Đọc kỹ phần này!)
    ├── MODULE_DEVELOPMENT.md  # Hướng dẫn tạo module mới từ A-Z
    └── AI_CONTEXT.md          # Tài liệu ngữ cảnh cho AI Assistant
```

---

## 3. Modules Hiện Có

### 🛡️ Quản Lý Canh Gác (`server/src/modules/quan-ly-canh-gac`)
Module này đã hoàn thiện 100% (Backend + Frontend).

**Chức năng:**
- **Lịch Gác**: Tạo lịch gác, mật khẩu hỏi/đáp.
- **Phân Công**: Gán học viên vào ca gác, vọng gác cụ thể.
- **Kiểm Tra**: Ghi nhận kết quả kiểm tra gác (Đạt/Vi phạm).
- **VKTB**: Quản lý vũ khí trang bị cho ca gác.
- **Quản Lý**: Đơn vị, Cán bộ, Học viên.

**Truy cập nhanh:**
- Dashboard: http://localhost:5173/guard-management/dashboard
- Phân công: http://localhost:5173/guard-management/phan-cong

---

## 4. Hướng Dẫn Cài Đặt

### Yêu cầu:
- Node.js >= 18
- Docker (chạy PostgreSQL)

### Bước 1: Khởi chạy Database
```bash
# Chạy container Postgres
docker start erp-postgres
# Hoặc import lại DB nếu cần (xem docs/MODULE_DEVELOPMENT.md)
```

### Bước 2: Chạy Backend
```bash
cd server
npm install
npm run dev
# Server chạy tại: http://localhost:3000
```

### Bước 3: Chạy Frontend
```bash
cd client
npm install
npm run dev
# Web chạy tại: http://localhost:5173
```

---
*Dự án được phát triển bởi đội ngũ kỹ thuật LuckyBoiz.*
