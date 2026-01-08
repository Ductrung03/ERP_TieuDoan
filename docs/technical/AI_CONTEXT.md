# AI Context & Project Architecture Summary

**File này dành cho AI Assistant (ChatGPT, Claude, Gemini...) đọc để hiểu bối cảnh dự án ngay lập tức.**

---

## 1. Project Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL (driver `pg`).
- **Frontend**: React 19, Vite, TypeScript, Bootstrap 5 (React-Bootstrap), Axios.
- **Architecture**: Modular Monolith via Plugin/Module Loader pattern. Clean Architecture (Controller -> Service -> Repository).

## 2. Backend Structure (`server/`)

- **Entities**: Plain interfaces representing database tables (e.g., `src/shared/entities/`).
- **Repositories**: Direct SQL queries using `pg` Pool. Manual mapping logic (e.g., `src/shared/repositories/`).
- **Services**: Business logic. No direct DB access allowed here; must use repositories.
- **Controllers**: Handle HTTP `req`, `res`. Call services. catch errors.
- **Modules**: Located in `src/modules/`. Each module is self-contained with its own `entities`, `repositories`, `services`, `controllers`, `routes`.
- **Entry Point**: `src/index.ts` loads modules dynamically.

### Key Snippets (Backend)

**Repository Pattern:**
```typescript
// Use simple SQL strings with parameters
const query = 'SELECT * FROM table WHERE id = $1';
const result = await pool.query(query, [id]);
```

**Service Pattern:**
```typescript
// Services are objects with async methods
export const myService = {
  doSomething: async (data: MyDto) => { ... }
}
```

## 3. Frontend Structure (`client/`)

- **API Layer**: `src/api/services/`. Each entity has a service file (e.g., `donvi.service.ts`) exporting an object with CRUD methods. **Uses `axiosInstance`**.
- **Pages**: Located in `src/pages/guard-management/` (or other module folders). Use Functional Components + `useState` + `useEffect`.
- **Routing**: Defined in `src/shared/data/routingdata.tsx`. **Manual entry required** for new pages.
- **Components**: Use `react-bootstrap` components (`Card`, `Table`, `Button`, `Form`).

### Key Snippets (Frontend)

**Page Pattern:**
```tsx
const MyPage = () => {
    const [data, setData] = useState([]);
    useEffect(() => { loadData() }, []);
    // Use PageHeader component
    return (
        <div>
            <PageHeader title="..." />
            <Table>...</Table>
        </div>
    )
}
```

## 4. Database Schema Convention

- **Naming**: `lowercase`, no special chars.
- **Primary Keys**: UUID (preferred) or Serial.
- **Shared Tables**: `donvi`, `canbo`, `hocvien`.
- **Module Tables**: Specific to module logic (e.g., `lichgac`, `cagac`).

## 5. Workflow for AI Tasks

Khi được yêu cầu thêm một tính năng mới, AI cần:
1.  **Check DB**: Xem bảng liên quan đã có chưa? Nếu chưa, đề xuất câu SQL `CREATE TABLE`.
2.  **Backend Impl**: Tạo file theo thứ tự: Entity -> Repository -> Service -> Controller -> Route.
3.  **Frontend Impl**: Tạo API Service -> Page Component -> Update Routing.
4.  **Verify**: Nhắc user restart server/client và check URL.
