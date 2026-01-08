# Hướng Dẫn Phát Triển Module Mới (Module Development Workflow)

Tài liệu này hướng dẫn chi tiết quy trình thêm một module nghiệp vụ mới vào hệ thống ERP Tiểu Đoàn.

---

## 1. Quy Trình Tổng Quát (High-Level Workflow)

Để thêm một module mới (ví dụ: `QuanLyKhenThuong`), bạn cần thực hiện theo thứ tự:

1.  **Database**: Thiết kế bảng và migrate dữ liệu.
2.  **Backend (Server)**:
    - Tạo Entity & DTO.
    - Tạo Repository.
    - Tạo Service.
    - Tạo Controller.
    - Đăng ký Route & Module.
3.  **Frontend (Client)**:
    - Khai báo Type & API Service.
    - Tạo Page/Component UI.
    - Đăng ký Route.

---

## 2. Chi Tiết Các Bước

### Bước 1: Database Setup
Tạo bảng trong PostgreSQL. Quy ước tên bảng là `lowercase` không dấu.

```sql
CREATE TABLE khenthuong (
    makhenthuong UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngaykhenthuong DATE NOT NULL,
    noidung TEXT,
    mahocvien UUID REFERENCES hocvien(mahocvien)
);
```

### Bước 2: Backend Implementation (`server/src/modules/`)

Tạo thư mục: `server/src/modules/quan-ly-khen-thuong/`

#### 2.1. Entity (`entities/khenthuong.entity.ts`)
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'; // Ví dụ giả lập hoặc dùng plain class nếu dùng pg driver thuần
// Trong dự án này đang dùng 'pg' thuần + Repository Pattern tự viết

export interface KhenThuong {
    makhenthuong: string;
    ngaykhenthuong: Date;
    noidung: string;
    mahocvien: string;
}
```

#### 2.2. Repository (`repositories/khenthuong.repository.ts`)
Kế thừa từ `BaseRepository` hoặc viết query trực tiếp.
```typescript
class KhenThuongRepository {
    async create(data: KhenThuong) { ... }
    async findAll() { ... }
}
export const khenThuongRepository = new KhenThuongRepository();
```

#### 2.3. Service (`services/khenthuong.service.ts`)
Chứa business logic. Gọi Repository.
```typescript
export const khenThuongService = {
    getAll: async () => { return await khenThuongRepository.findAll(); }
};
```

#### 2.4. Controller (`controllers/khenthuong.controller.ts`)
Xử lý Request/Response. Gọi Service.
```typescript
export class KhenThuongController {
    static async getAll(req: Request, res: Response) {
        const data = await khenThuongService.getAll();
        res.json({ success: true, data });
    }
}
```

#### 2.5. Routes (`routes/index.ts`)
Định nghĩa đường dẫn API.
```typescript
const router = Router();
router.get('/khen-thuong', KhenThuongController.getAll);
export default router;
```

#### 2.6. Module Entry (`index.ts`)
Implement `IModule`.
```typescript
export const QuanLyKhenThuongModule: IModule = {
    name: 'QuanLyKhenThuong',
    routes: (router) => router.use('/khen-thuong', khenThuongRoutes)
};
```

### Bước 3: Frontend Implementation (`client/src/`)

#### 3.1. API Service (`api/services/khenthuong.service.ts`)
Dùng `axiosInstance` để gọi Backend.

```typescript
export const khenThuongService = {
    getAll: async () => axiosInstance.get('/khen-thuong')
};
```

#### 3.2. Page UI (`pages/khen-thuong/KhenThuongList.tsx`)
Dùng React Functional Component + Hooks.

```tsx
const KhenThuongList = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        khenThuongService.getAll().then(res => setData(res.data));
    }, []);
    
    return <Table>...</Table>;
}
```

#### 3.3. Register Route (`shared/data/routingdata.tsx`)

```tsx
{ id: 200, path: `${import.meta.env.BASE_URL}khen-thuong`, element: <KhenThuongList /> }
```

---

## 3. Quy Tắc Code (Coding Standards)

- **File Naming**: `kebab-case` (vd: `user-profile.component.tsx`, `auth.service.ts`).
- **Variable/Function**: `camelCase`.
- **Component**: `PascalCase`.
- **Tuyệt đối tuân thủ Clean Architecture**: Controller -> Service -> Repository -> Database. Không gọi tắt.
