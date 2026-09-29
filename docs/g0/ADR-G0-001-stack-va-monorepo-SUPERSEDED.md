# ADR-001: Stack công nghệ và cấu trúc monorepo

| Mục | Giá trị |
|---|---|
| Trạng thái | **Đề xuất** (chờ Tech Lead và COMTECH duyệt tại Gate G0) |
| Ngày | 23/09/2026 |
| Căn cứ | MASTER PROMPT V4 Mục 4, 6.1, 6.2; SPEC V2.0 Mục 5, 6, 36, 37; báo cáo G0.1 |
| Thay thế | Không (ADR đầu tiên) |
| ADR liên quan sẽ viết | ADR-002 Auth BFF, ADR-003 Permission model, ADR-004 Storage, ADR-005 Search (SPEC 6.2 bước 7) |

---

## 1. Bối cảnh

- MASTER PROMPT V4 quyết định codebase CRM `comtech-web-app` là **hạt nhân của Central Platform**, không xây hệ thống mới song song.
- Rà soát G0 cho thấy repo **đã là monorepo** pnpm 9 + Turborepo 2 với `apps/api` (NestJS 10), `apps/web` (Next.js 14, là Workspace nội bộ), `apps/mobile` (Expo), `packages/types`. Như vậy việc cần làm là **tái cấu trúc và nâng cấp**, không phải chuyển đổi.
- Vấn đề cấp bách:
  - Next.js 14.2.35 có 2 lỗ hổng Critical (RCE), chỉ vá ở ≥ 15.5.24 (`pnpm audit`, 23/09/2026).
  - Git chỉ chứa M1 đến M3; M4 đến M8 nằm trong một file Markdown backup.
  - Không có Redis/queue, worker, storage, CI, observability.
  - Tên app `web` hiện đang là Workspace, trong khi SPEC dành `apps/web` cho website công khai.
- SPEC 6.1 yêu cầu: `apps/{web,app,api,worker}`, `packages/{ui,contracts,config,db,i18n}`, `infra/`, `docs/`, `tests/`.

## 2. Quyết định

### 2.1 Một monorepo duy nhất, giữ repo và lịch sử git hiện có

- Tiếp tục repo `infocomtechvietnam-hub/comtech-web-app` (chuyển **private**). Đổi tên repo thành `comtech-platform` là **tùy chọn**, làm sau khi private (GitHub tự chuyển hướng URL cũ).
- Trước mọi thay đổi cấu trúc: đưa M4 đến M8 vào git (ưu tiên lịch sử commit gốc; nếu không có, 1 commit khôi phục từ backup), xóa file backup khỏi cây thư mục, gắn tag `v0.8.0-crm-baseline`.
- Mọi di chuyển thư mục dùng `git mv` trong PR riêng, không trộn với thay đổi logic, để `git log --follow` còn truy vết được.

### 2.2 Cấu trúc đích

```
comtech-web-app/                  (hoặc comtech-platform/)
├── apps/
│   ├── web/        Website công khai, Next.js App Router, SSG/ISR      (MỚI, G3)
│   ├── app/        Workspace + Admin, Next.js BFF                      (ĐỔI TÊN từ apps/web hiện tại)
│   ├── api/        NestJS, /api/v1, modular monolith                   (GIỮ, tái cấu trúc module)
│   ├── worker/     NestJS standalone, BullMQ consumers, outbox relay   (MỚI, G2)
│   └── mobile/     Expo, client của API                                (GIỮ, team mobile phụ trách, G7)
├── packages/
│   ├── db/         Prisma schema, migrations, seed, script backfill    (TÁCH từ apps/api/prisma)
│   ├── contracts/  OpenAPI sinh ra, type + SDK TypeScript, zod schema  (THAY packages/types)
│   ├── ui/         Design system COMTECH (shadcn/ui + Radix + tokens)  (TÁCH từ apps/web/src/components/ui)
│   ├── config/     eslint, tsconfig, tailwind preset, prettier         (MỚI)
│   └── i18n/       Chuỗi giao diện vi/en                                (MỚI)
├── infra/          docker-compose (dev, staging, prod), Dockerfile, cấu hình proxy
├── docs/           adr/, g0/, data-dictionary.xlsx, openapi.json, runbook/
└── tests/          e2e (Playwright + axe), load (k6), security
```

Quy tắc phụ thuộc (kiểm tra bằng ESLint `import/no-restricted-paths` hoặc `dependency-cruiser` trong CI):
- `apps/*` không import lẫn nhau.
- Chỉ `apps/api` và `apps/worker` import `packages/db`. `apps/web`, `apps/app`, `apps/mobile` **không bao giờ** import Prisma (N2: client chỉ qua API).
- `packages/contracts` là nguồn type duy nhất cho frontend và mobile; sinh từ OpenAPI của `apps/api`.
- Trong `apps/api`, controller không gọi Prisma trực tiếp (SPEC 14.3); repository nhận `PermissionContext` bắt buộc.

Cấu trúc một module backend theo SPEC 6.1 (`domain/`, `application/`, `infrastructure/`, `api/`, `events/`, `permissions.ts`, `menu.seed.ts`, `__tests__/`). Module cũ được chuyển dần vào `apps/api/src/modules/<tên>` khi được nâng cấp ở gate tương ứng, không chuyển hàng loạt.

### 2.3 Phiên bản baseline

Ghi nhận phiên bản trên npm ngày 23/09/2026. MASTER PROMPT yêu cầu "bản stable được hỗ trợ tại thời điểm khởi tạo"; Tech Lead pin **chính xác** trong `package.json` + lockfile ở PR đầu tiên của G1.

| Thành phần | Hiện tại | Quyết định | Lý do |
|---|---|---|---|
| Node.js | ≥ 18 (engines) | **22 LTS** (dev, CI, image) | LTS; Next 16 yêu cầu ≥ 20.9 |
| pnpm | 9.15.9 | **10.x** (10.34.5), pin qua `packageManager` | Giữ major gần với hiện tại, giảm rủi ro lockfile; xem lại khi lên 11+ |
| Turborepo | 2.1 | **2.x mới nhất** (2.11.3) | Không phá vỡ |
| TypeScript | 5.6 | **5.9.x**, `strict: true` | TS 7.x (bản port mới) chưa chắc tương thích ts-jest/ESLint; đánh giá lại ở G8 |
| Next.js (web, app) | 14.2.35 | **16.x** (16.3.6) + React 19 | Vá 2 RCE Critical + 9 High; nhảy thẳng từ 14 lên 16 vì Workspace hiện chỉ 35 trang, chi phí một lần. Tối thiểu chấp nhận được: 15.5.26 nếu 16 gặp chặn |
| NestJS | 10.4 | **12.x** (12.0.4) | Hệ sinh thái đã có bản 12 (`@nestjs/swagger` 12.0.1, `@nestjs/bullmq` 12.0.0). Fallback 11.2.x nếu có package thiếu |
| Prisma | 5.20 | **6.x** (6.19.3) ở G1; ADR riêng cho Prisma 7 | Prisma 7 thay đổi lớn cách chạy client; không nên đổi đồng thời với viết lại 104 bảng. Migration vẫn là SQL, không khóa lựa chọn sau này |
| PostgreSQL | 15 (compose) | **16** (tối thiểu 15) | Migration hiện có đã chạy sạch trên 16; extension `pgcrypto`, `unaccent`, `pg_trgm`, `citext` |
| Redis | không có | **Redis 7** + **BullMQ** (qua `@nestjs/bullmq`) | SPEC 6.2; AOF bật cho queue |
| Object storage | không có | **MinIO** (S3 API) P0, adapter NAS | Quyết định chi tiết ở ADR-004 |
| Mật khẩu | bcrypt | **Argon2id** (`argon2`), rehash khi đăng nhập | SPEC 13.3; bỏ luôn phụ thuộc `bcrypt` → xử lý lỗ hổng `tar` qua node-pre-gyp |
| UUID | v4 ở DB | **v7 sinh ở ứng dụng** (thư viện `uuid`) | SPEC 8.1; không phụ thuộc phiên bản PostgreSQL |
| Cây phòng ban | (chưa có) | **Materialized path dạng TEXT** | Tránh thêm extension `ltree` ngoài danh sách (OI-06); đủ cho vài trăm phòng ban |
| Mobile | Expo SDK 57, RN 0.81 | Giữ | Ngoài phạm vi giai đoạn này (SPEC 3.2) |
| Test | Jest 30 + ts-jest 29 (lệch major) | **Jest + ts-jest cùng major**; Testcontainers cho integration; Playwright + axe; k6 | SPEC 41 |
| CI | không có | **GitHub Actions** theo pipeline SPEC 37 | Repo đã ở GitHub |
| Quan sát | không có | OpenTelemetry, Prometheus + Grafana, Loki, GlitchTip (tự host) | SPEC 38; tự host để dữ liệu ở Việt Nam |

### 2.4 Chiến lược API trong giai đoạn chuyển tiếp

- API mới: `/api/v1/*`, JSON **snake_case**, envelope SPEC 18.2, OpenAPI 3.1 xuất ra `docs/openapi.json`.
- API cũ `/api/*` (camelCase) được **đóng băng**: chỉ vá lỗi và bảo mật, không thêm tính năng. Vẫn chạy để app mobile chấm công và Workspace cũ không gãy.
- Mỗi màn hình Workspace chuyển sang `/api/v1` khi module tương ứng được nâng cấp. Khi không còn client nào gọi `/api/*` (đo bằng log truy cập 30 ngày), gỡ bỏ trong release có thông báo, kèm header `Deprecation`/`Sunset`.
- Swagger chuyển từ `/api/docs` sang `/api-docs`, tắt công khai ở production (SPEC 19.3).

### 2.5 Thứ tự thực hiện (Phase 0 còn lại, ước tính 2 tuần, SPEC 40.2)

| PR | Nội dung | Điều kiện merge |
|---|---|---|
| PR-0 | Khôi phục M4 đến M8 vào git, xóa backup, tag baseline | 556 test pass; migration sạch |
| PR-1 | Hotfix bảo mật trên code cũ (S2, S3, S4 ở G0.1) + test hồi quy | Test mới chứng minh lỗi đã đóng |
| PR-2 | `git mv apps/web apps/app`; tạo `packages/config`; chuẩn hóa tsconfig/eslint | Build + test xanh, không đổi logic |
| PR-3 | Tách `apps/api/prisma` → `packages/db`; `packages/types` → `packages/contracts` | Build + test xanh |
| PR-4 | Nâng Next.js 16 + React 19 cho `apps/app` | Build, lint, smoke thủ công 35 trang; `pnpm audit` không còn Critical |
| PR-5 | Nâng NestJS 12, Prisma 6, TS 5.9, sửa lệch Jest/ts-jest | 556 test pass |
| PR-6 | CI GitHub Actions: lint, typecheck, test, build, audit, gitleaks, `prisma migrate diff` | Pipeline xanh trên `main` |
| PR-7 | `infra/docker-compose.dev.yml` thêm Redis 7, MinIO, ClamAV; khung `apps/worker` rỗng | `docker compose up` chạy được |

`apps/web` (website công khai), `packages/ui`, `packages/i18n` được tạo khi vào G3; không tạo khung rỗng sớm.

## 3. Phương án đã cân nhắc

| Phương án | Lý do không chọn |
|---|---|
| Repo mới `comtech-platform`, bỏ repo cũ | Mất lịch sử, trái MASTER PROMPT 4 và SPEC 6.2 bước 2 |
| Nhiều repo (web, app, api riêng) | Khó chia sẻ contracts/ui, khó đảm bảo "một nguồn type" (N2) |
| Nx thay Turborepo | Mạnh hơn về generator và ràng buộc phụ thuộc, nhưng repo đã dùng Turbo, đội nhỏ; ràng buộc phụ thuộc làm được bằng ESLint/dependency-cruiser |
| Giữ Next.js 14, chỉ vá bằng cấu hình (tắt Image Optimization) | Không đóng hết lỗ hổng High; vẫn phải nâng major trước go-live |
| Nâng Next.js 15.5.x trước, 16 sau | Hai lần di chuyển cho cùng codebase nhỏ; chỉ dùng làm phương án dự phòng |
| Microservices ngay từ đầu | Trái MASTER PROMPT 6.1 (modular monolith, tách khi có số liệu tải) |

## 4. Hệ quả

Tích cực:
- Giữ được toàn bộ giá trị đã xây M1 đến M8 và 556 test.
- Đóng lỗ hổng Critical trước khi mở rộng.
- Ranh giới rõ giữa website công khai, Workspace, API, worker; đúng sơ đồ SPEC 5.1.

Tiêu cực / chi phí:
- Khoảng 2 tuần chưa có tính năng mới (đúng ước tính Phase 0 của SPEC).
- Chạy song song `/api` và `/api/v1` một thời gian: tăng bề mặt cần bảo mật, phải test cả hai.
- Nâng React 18 → 19 có thể làm gãy một số thư viện UI (`@dnd-kit`, form); cần smoke test đầy đủ.
- Nâng NestJS và Prisma có thể làm hỏng một số test mock; chi phí sửa ước tính 1 đến 2 ngày.

Rủi ro:
- Nếu không lấy lại được lịch sử commit M4 đến M8, không truy vết được tác giả từng thay đổi (chỉ ảnh hưởng audit mã nguồn, không ảnh hưởng chức năng).
- Phiên bản ghi trong ADR có thể đã cũ khi bắt đầu G1; quy tắc là lấy bản stable mới nhất cùng major đã chốt.

## 5. Tiêu chí kiểm chứng ADR

- `pnpm install --frozen-lockfile && pnpm turbo run lint typecheck test build` xanh trên CI.
- `pnpm audit --prod` không còn Critical/High có bản vá.
- `apps/app`, `apps/mobile` không có import `@prisma/client` (kiểm tra CI).
- Migration chạy sạch trên DB trống và trên bản sao DB hiện có.
