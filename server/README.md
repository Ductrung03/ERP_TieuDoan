# ERP Tiểu Đoàn - Backend Server

Backend cho hệ thống ERP Module-based dành cho cấp Tiểu Đoàn.

## Yêu Cầu Hệ Thống

- Node.js >= 18
- PostgreSQL 17
- npm hoặc yarn

## Cài Đặt

```bash
npm install
```

## Cấu Hình

Copy `.env.example` thành `.env` và điều chỉnh:

```env
DB_HOST=172.17.0.1
DB_PORT=5432
DB_NAME=erp_tieu_doan
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

## Chạy Development

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## Build Production

```bash
npm run build
npm start
```

## API Endpoints

- **Health Check**: `GET /health`
- **API Info**: `GET /api/v1`
- **Guard Management**: `GET /api/v1/canh-gac/*`

Xem [walkthrough.md](../../../.gemini/antigravity/brain/66530b3b-fa2c-453a-abb6-866b9cd68caa/walkthrough.md) để biết chi tiết đầy đủ.

## Cấu Trúc Project

```
src/
├── config/        # App configuration
├── core/          # Core services (DB, Logger, Errors)
├── modules/       # Business modules
│   ├── _loader/   # Module loader system
│   └── quan-ly-canh-gac/  # Sample module
├── api/           # API versioning
└── index.ts       # Entry point
```

## Thêm Module Mới

1. Tạo folder trong `src/modules/`
2. Implement `IModule` interface
3. Export module config
4. Server sẽ tự động load module

Xem [implementation_plan.md](../../../.gemini/antigravity/brain/66530b3b-fa2c-453a-abb6-866b9cd68caa/implementation_plan.md) để biết chi tiết.

## License

ISC
