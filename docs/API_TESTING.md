# HỆ THỐNG AUTHENTICATION & RBAC - API TESTING GUIDE

> **Ngày:** 2026-01-08
> **Status:** Phase 1 hoàn thành ✅
> **Server:** http://localhost:3001

---

## 🎉 PHASE 1 HOÀN THÀNH - BACKEND CORE

### ✅ Đã Implement:

1. **Database Schema** - RBAC System
   - ✅ Bảng `quyen` (54 permissions)
   - ✅ Bảng `vaitro_quyen` (111 role-permission mappings)
   - ✅ Bảng `phamvidulieu` (4 data scopes)
   - ✅ Bảng `taikhoan_phamvi` (user-scope mappings)
   - ✅ Bảng `phamvi_donvi` (custom scope units)

2. **Backend Module** - User Management
   - ✅ Auth Service (login, JWT, permissions)
   - ✅ Auth Middleware (JWT verification)
   - ✅ Permission Middleware (check permissions)
   - ✅ Data Scope Middleware (filter by units)
   - ✅ Auth Controller & Routes

3. **API Endpoints**
   - ✅ POST `/api/v1/auth/login` - Login
   - ✅ GET `/api/v1/auth/me` - Get current user
   - ✅ GET `/api/v1/auth/permissions` - Get user permissions
   - ✅ POST `/api/v1/auth/check-permission` - Check specific permission
   - ✅ POST `/api/v1/auth/logout` - Logout

---

## 🔐 TEST ACCOUNTS

### Admin Account (Full Access)
```
Username: admin
Password: 123456
Role: VT01 (Admin)
Data Scope: ALL (Tất cả dữ liệu)
```

### Cán Bộ Account (Manager)
```
Username: canbo01
Password: 123456
Role: VT02 (Cán bộ)
Data Scope: SUB_UNITS (Đơn vị và cấp dưới)
Permissions: VIEW, CREATE, UPDATE, APPROVE, EXPORT (không DELETE)
```

### Học Viên Account (Student)
```
Username: hocvien01
Password: 123456
Role: VT03 (Học viên)
Data Scope: OWN_UNIT (Chỉ đơn vị mình)
Permissions: VIEW only
```

### Viewer Account (Read-only)
```
Username: viewer
Password: 123456
Role: VT04 (Viewer)
Data Scope: ALL
Permissions: VIEW, EXPORT
```

**Note:** Password đã được update cho tất cả accounts = `123456` (hashed với bcrypt)

---

## 📋 API ENDPOINTS - TESTING

### 1. Login (Public)

**POST** `/api/v1/auth/login`

```bash
curl -X POST 'http://localhost:3001/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "mataikhoan": "TK00001",
    "tendn": "admin",
    "maquyen": "VT01",
    "tenquyen": "Admin",
    "madonvi": "DV0001",
    "tendonvi": "Đại đội 157",
    "sdt": "0912345001",
    "trangthai": "Active"
  }
}
```

---

### 2. Get Current User Info (Protected)

**GET** `/api/v1/auth/me`

```bash
# Lấy token từ response login trước
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET 'http://localhost:3001/api/v1/auth/me' \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mataikhoan": "TK00001",
    "tendn": "admin",
    "maquyen": "VT01",
    "madonvi": "DV0001",
    "sdt": "0912345001",
    "trangthai": "Active",
    "landangnhapcuoi": "2026-01-08T06:55:32.373Z",
    "tenquyen": "Admin",
    "tendonvi": "Đại đội 157",
    "permissions": {
      "QUAN_LY_CANH_GAC": {
        "HOC_VIEN": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "CAN_BO": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "DON_VI": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "LICH_GAC": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "PHAN_CONG": ["VIEW", "CREATE", "UPDATE", "DELETE", "APPROVE"],
        "KIEM_TRA": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "VKTB": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
        "DASHBOARD": ["VIEW", "EXPORT"]
      },
      "USER_MANAGEMENT": {
        "NGUOI_DUNG": ["VIEW", "CREATE", "UPDATE", "DELETE", "RESET_PASSWORD", "TOGGLE_STATUS"],
        "VAI_TRO": ["VIEW", "CREATE", "UPDATE", "DELETE", "ASSIGN_PERMISSIONS"],
        "QUYEN": ["VIEW", "CREATE", "UPDATE", "DELETE"],
        "DATA_SCOPE": ["VIEW", "UPDATE"]
      }
    },
    "dataScopes": [
      {
        "maphamvi": "PV001",
        "tenphamvi": "Tất cả dữ liệu",
        "loaiphamvi": "ALL",
        "mota": "Xem toàn bộ dữ liệu trong hệ thống"
      }
    ]
  }
}
```

---

### 3. Get User Permissions (Protected)

**GET** `/api/v1/auth/permissions`

```bash
curl -X GET 'http://localhost:3001/api/v1/auth/permissions' \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "QUAN_LY_CANH_GAC": {
      "HOC_VIEN": ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"],
      ...
    },
    "USER_MANAGEMENT": {
      ...
    }
  }
}
```

---

### 4. Check Specific Permission (Protected)

**POST** `/api/v1/auth/check-permission`

```bash
curl -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "module": "QUAN_LY_CANH_GAC",
    "feature": "HOC_VIEN",
    "action": "CREATE"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hasPermission": true,
    "module": "QUAN_LY_CANH_GAC",
    "feature": "HOC_VIEN",
    "action": "CREATE"
  }
}
```

---

### 5. Logout (Protected)

**POST** `/api/v1/auth/logout`

```bash
curl -X POST 'http://localhost:3001/api/v1/auth/logout' \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Admin Full Access

```bash
# 1. Login as admin
TOKEN=$(curl -s -X POST 'http://localhost:3001/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"123456"}' | jq -r '.token')

# 2. Get user info
curl -s -X GET 'http://localhost:3001/api/v1/auth/me' \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Check permission (should return true for everything)
curl -s -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"module":"QUAN_LY_CANH_GAC","feature":"HOC_VIEN","action":"DELETE"}' | jq .
```

**Expected:** All permissions return `true`

---

### Scenario 2: Cán Bộ Limited Access

```bash
# 1. Login as canbo
TOKEN=$(curl -s -X POST 'http://localhost:3001/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username":"canbo01","password":"123456"}' | jq -r '.token')

# 2. Check DELETE permission (should fail)
curl -s -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"module":"QUAN_LY_CANH_GAC","feature":"HOC_VIEN","action":"DELETE"}' | jq .

# 3. Check CREATE permission (should pass)
curl -s -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"module":"QUAN_LY_CANH_GAC","feature":"HOC_VIEN","action":"CREATE"}' | jq .
```

**Expected:**
- DELETE returns `false`
- CREATE returns `true`

---

### Scenario 3: Học Viên Read-Only

```bash
# 1. Login as hocvien
TOKEN=$(curl -s -X POST 'http://localhost:3001/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username":"hocvien01","password":"123456"}' | jq -r '.token')

# 2. Check VIEW permission (should pass)
curl -s -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"module":"QUAN_LY_CANH_GAC","feature":"HOC_VIEN","action":"VIEW"}' | jq .

# 3. Check CREATE permission (should fail)
curl -s -X POST 'http://localhost:3001/api/v1/auth/check-permission' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"module":"QUAN_LY_CANH_GAC","feature":"HOC_VIEN","action":"CREATE"}' | jq .
```

**Expected:**
- VIEW returns `true`
- CREATE returns `false`

---

### Scenario 4: Invalid Token

```bash
curl -X GET 'http://localhost:3001/api/v1/auth/me' \
  -H "Authorization: Bearer invalid-token-here"
```

**Expected:**
```json
{
  "success": false,
  "message": "Token không hợp lệ"
}
```

---

### Scenario 5: Missing Token

```bash
curl -X GET 'http://localhost:3001/api/v1/auth/me'
```

**Expected:**
```json
{
  "success": false,
  "message": "Token không hợp lệ"
}
```

---

## 📊 PERMISSIONS MATRIX

| Module | Feature | Admin | Cán Bộ | Học Viên | Viewer |
|--------|---------|-------|--------|----------|--------|
| QUAN_LY_CANH_GAC | HOC_VIEN.VIEW | ✅ | ✅ | ✅ | ✅ |
| QUAN_LY_CANH_GAC | HOC_VIEN.CREATE | ✅ | ✅ | ❌ | ❌ |
| QUAN_LY_CANH_GAC | HOC_VIEN.UPDATE | ✅ | ✅ | ❌ | ❌ |
| QUAN_LY_CANH_GAC | HOC_VIEN.DELETE | ✅ | ❌ | ❌ | ❌ |
| QUAN_LY_CANH_GAC | HOC_VIEN.EXPORT | ✅ | ✅ | ❌ | ✅ |
| USER_MANAGEMENT | NGUOI_DUNG.* | ✅ | ❌ | ❌ | ❌ |
| USER_MANAGEMENT | VAI_TRO.* | ✅ | ❌ | ❌ | ❌ |

---

## 🔍 DATA SCOPE TESTING

### Admin - PV001 (ALL)
```sql
-- Admin có thể thấy tất cả đơn vị
SELECT * FROM donvi;  -- Returns: DV0001, DV0002, DV0003, DV0004...
```

### Cán Bộ - PV003 (SUB_UNITS)
```sql
-- Cán bộ DV0002 có thể thấy DV0002 + các đơn vị con
-- VD: DV0002 (Đại đội 1) + DV0005, DV0006 (Tiểu đội 1-1, 1-2)
```

### Học Viên - PV002 (OWN_UNIT)
```sql
-- Học viên DV0005 chỉ thấy DV0005
```

---

## 🎯 NEXT STEPS (Phase 2+)

### Phase 2: User Management CRUD APIs
- [ ] User CRUD endpoints
- [ ] Role CRUD endpoints
- [ ] Permission CRUD endpoints
- [ ] Data Scope configuration endpoints

### Phase 3: Frontend Authentication
- [ ] Login page
- [ ] AuthContext & Provider
- [ ] useAuth & usePermission hooks
- [ ] ProtectedRoute component

### Phase 4: Frontend UI
- [ ] UserList & UserForm
- [ ] RoleList & RoleForm
- [ ] RolePermissions page
- [ ] DataScopeManagement page

---

## 🐛 TROUBLESHOOTING

### Problem: "Token không hợp lệ"
**Solution:** Check if JWT_SECRET in `.env` matches

### Problem: "Cannot read properties of undefined"
**Solution:** Make sure module exports default from index.ts

### Problem: Login returns "Tên đăng nhập hoặc mật khẩu không đúng"
**Solution:** Update password hash:
```sql
UPDATE taikhoan SET matkhau = '$2b$10$sb8aysYy.pJABh3wSYe4OuLVeueqd3nrSpF4.iPVlgmxOpsrDfiFG'
WHERE tendn = 'admin';
```

---

**Tác giả:** Claude AI (Sonnet 4.5)
**Ngày:** 2026-01-08
**Status:** Phase 1 Complete ✅
