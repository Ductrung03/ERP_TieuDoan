# � TECHNICAL CONSTITUTION (Quy Tắc & Tiêu Chuẩn Kỹ Thuật)

> **Dự án: ERP Tiểu Đoàn**
> **Hiệu lực**: Ngay lập tức
> **Đối tượng áp dụng**: Toàn bộ Developer & AI Assistants

Tài liệu này định nghĩa "Luật Bất Khả Kháng" của dự án. Mọi dòng code được commit vào repository phải tuân thủ nghiêm ngặt các điều khoản dưới đây. Vi phạm sẽ bị từ chối Merge Request ngay lập tức.

---

## 1. 🛠️ Tech Stack & Môi Trường

### 1.1 Backend
- **Runtime**: Node.js (Latest LTS)
- **Framework**: Express.js + TypeScript (Strict Mode)
- **Database**: PostgreSQL 17 (Official Docker Image)
- **ORM**: TypeORM (hoặc Repository Pattern tự build with `pg`) - *Hiện tại dùng Repository Pattern thủ công.*
- **Authentication**: JWT

### 1.2 Frontend
- **Core**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: React Bootstrap (Bootstrap 5) - *Không dùng Tailwind trừ khi yêu cầu đặc biệt.*
- **State Management**: Redux Toolkit (Global) + Context API (Feature Scope)
- **Form Handling**: **React Hook Form** (BẮT BUỘC)
- **Icons**: Bootstrap Icons

---

## 2. 🏗️ Architecture (Kiến Trúc Hệ Thống)

### 2.1 Pattern: Modular Monolith
Hệ thống được chia thành các **Modules** độc lập về mặt nghiệp vụ (Business Domain).
- Ví dụ: `QuanLyCanhGac`, `QuanLyHocVien`, `QuanLyKhenThuong`.
- Các module giao tiếp qua **Internal Service Interfaces**, không gọi trực tiếp Database của nhau.

### 2.2 Layers (Phân Tầng)
Luồng dữ liệu **BẮT BUỘC** đi theo một chiều:

`Request` ➡️ **Controller** ➡️ **Service** ➡️ **Repository** ➡️ **Database**

1.  **Controller Layer**:
    - Nhiệm vụ: Nhận Request, Validate Input (DTO), Gọi Service, Trả về Response chuẩn.
    - ⛔ **CẤM**: Viết logic nghiệp vụ, gọi trực tiếp Repository, viết câu SQL.

2.  **Service Layer**:
    - Nhiệm vụ: Chứa toàn bộ Business Logic, Transaction management.
    - ⛔ **CẤM**: Truy cập trực tiếp `req`, `res` của Express.

3.  **Repository Layer**:
    - Nhiệm vụ: Tương tác trực tiếp với Database (CRUD).
    - ⛔ **CẤM**: Chứa logic nghiệp vụ phức tạp.

---

## 3. 📝 Naming Conventions (Quy Tắc Đặt Tên)

### 3.1 Files & Directories
Sử dụng `kebab-case` cho toàn bộ file và thư mục.
- ✅ `user-controller.ts`
- ✅ `auth-service.ts`
- ❌ `UserController.ts`, `AuthService.ts`

### 3.2 Code Identifiers
- **Class / Component**: `PascalCase` (e.g., `UserService`, `PromoteForm`)
- **Variable / Function**: `camelCase` (e.g., `isLoggedIn`, `getUserById`)
- **Constant**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Interface / Type**: `PascalCase` (e.g., `IUser`, `UserResponse`)

### 3.3 Database
- **Table Name**: `lowercase` hoặc `snake_case` (e.g., `hocvien`, `lich_gac`)
- **Column Name**: `lowercase` (e.g., `hoten`, `ngaysinh`)

---

## 4. 🎨 Frontend Standards (Tiêu Chuẩn Frontend)

### 4.1 Structure
```
client/src/
  ├── components/common/   # Shared UI (Button, Modal...)
  ├── modules/             # [QUAN TRỌNG] Code nghiệp vụ nằm ở đây
  │   └── [module-name]/
  │       ├── components/  # Local components
  │       ├── pages/       # Route pages
  │       ├── hooks/       # Local hooks
  │       └── types/       # Local types
  ├── pages/               # (Legacy/General) Các trang chung
```

### 4.2 Validation (Nghiêm Ngặt)
Mọi form nhập liệu phải tuân thủ:
1.  **Library**: Sử dụng `react-hook-form`.
2.  **User Experience**:
    - Hiển thị lỗi ngay dưới field input (`<Form.Control.Feedback type="invalid">`).
    - Disable nút Submit khi đang `isSubmitting`.
    - Thông báo Toast (Success/Error) sau khi API trả về kết quả.
3.  **Data Formats**:
    - **Email**: Regex check domain.
    - **Phone**: Regex check numeric & length (10-11).
    - **Dates**: Input `type="date"` phải được parse chuẩn sang ISO string hoặc Date Object khi submit.

---

## 5. ⚙️ Backend Standards (Tiêu Chuẩn Backend)

### 5.1 API Response Format
Mọi API phải trả về theo cấu trúc thống nhất:
```json
{
  "success": boolean,
  "data": any | null,
  "message": string | null, // Chỉ dùng khi lỗi hoặc cần thông báo
  "errors": any | null      // Chi tiết lỗi validation (nếu có)
}
```

### 5.2 Error Handling
- Sử dụng `try-catch` trong Controller.
- Log lỗi ra console hoặc file log (dùng Logger Service).
- Luôn trả về HTTP Code đúng ngữ nghĩa (200, 201, 400, 401, 403, 404, 500).

---

## 6. 🤖 Protocol for AI Agents (Giao thức cho AI)

Nếu bạn là AI, bạn phải thực hiện quy trình sau trước khi viết code:

1.  **READ**: Đọc kỹ `MODULE_DEVELOPMENT.md` và file này (`RULES.md`).
2.  **PLAN**: Xác định file nào cần sửa, file nào cần tạo. Đừng code mò.
3.  **CHECK TYPES**: TypeScript là bắt buộc. Không dùng `any` trừ khi bất khả kháng.
4.  **NO DESTRUCTION**: Không xóa code cũ nếu không hiểu rõ. Dùng comment để đánh dấu code cũ (deprecated) thay vì xóa trắng.
5.  **FIX LINT**: Trước khi xong task, **phải** chạy linter hoặc tự fix các lỗi syntax/type cơ bản.
6.  **FOLLOW STRUCTURE** ⭐: **Tạo file mới phải đặt đúng vị trí theo cấu trúc project hiện tại**. Không được tạo file lung tung, phải xem xét các thư mục đã tồn tại và đặt file vào đúng chỗ phù hợp:
    - Components → `components/` hoặc `modules/[module-name]/components/`
    - Pages → `pages/` hoặc `modules/[module-name]/pages/`
    - Services → `api/services/` (Frontend) hoặc `modules/[module-name]/services/` (Backend)
    - Types → `types/` hoặc `modules/[module-name]/types/`
7.  **UI CONSISTENCY** ⭐: **Phải thống nhất giao diện với thiết kế đang dùng**:
    - Sử dụng các CSS variables đã định nghĩa trong `_variables.scss`
    - Dùng các utility classes và components từ template hiện có
    - Không tự ý thêm màu sắc, font, hoặc style mới nếu đã có sẵn
    - Tuân thủ dark/light theme đang được áp dụng
    - Tham khảo các components tương tự đã có trong project trước khi tạo mới
8.  **UPDATE DOCS** ⭐: **Khi hoàn thành tính năng mới, BẮT BUỘC phải cập nhật tài liệu**:
    - Cập nhật `README.md` nếu thêm module/feature mới
    - Cập nhật `docs/technical/AI_CONTEXT.md` với thông tin về những gì đã làm
    - Cập nhật `docs/MODULE_DEVELOPMENT.md` nếu thêm module mới
    - Ghi chú rõ ràng: tính năng gì, file nào, API endpoint nào đã tạo
    - Mục đích: Giúp developer/AI tiếp theo biết trạng thái hiện tại của dự án

---
**Vi phạm các quy tắc trên đồng nghĩa với việc Task thất bại.**
