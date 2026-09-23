# G0.1 Báo cáo hiện trạng repo `comtech-web-app`

| Mục | Giá trị |
|---|---|
| Phase/Gate | G0 Discovery và rà soát hiện trạng |
| Ngày rà soát | 23/09/2026 |
| Căn cứ | MASTER PROMPT V4.0, Technical Specification V2.0 (SPEC) |
| Nguồn kiểm chứng | `https://github.com/infocomtechvietnam-hub/comtech-web-app` (nhánh `main`, commit `aaad9c6`) và file `comtech_full_project_backup.md` trong chính repo |
| Phạm vi | Chỉ đọc, chạy thử, đo. Không viết code tính năng. |

---

## 1. Tóm tắt điều hành (đọc phần này nếu chỉ có 2 phút)

1. **Mã nguồn M4 đến M8 không có trong lịch sử git.** Nhánh `main` chỉ có code M1 đến M3 (3 PR đã merge). Toàn bộ M4 đến M8 (thư viện công việc, nhân viên, dashboard, báo cáo, chấm công, thông báo, app mobile, Dockerfile, 34 file test) chỉ tồn tại dưới dạng **một file Markdown 1,18 MB** (`comtech_full_project_backup.md`, commit "Add files via upload" ngày 14/09/2026). README trong bản backup ghi "đã merge vào main", điều này **không đúng** với repo. Đây là rủi ro số 1: mất lịch sử, không review được, không build được từ git.
2. **Repo là public.** Clone được không cần xác thực. Bản backup chứa seed với mật khẩu mặc định cho 8 tài khoản (ví dụ `admin@comtech.vn`), cấu trúc bảo mật và toàn bộ logic nghiệp vụ. Cần chuyển private ngay (xem mục 7).
3. **Chất lượng code nền khá tốt**: khôi phục 271 file từ backup, 556/556 test pass, 7 migration chạy sạch trên PostgreSQL 16 thật, schema Prisma khớp 100% với DB sau migrate (19 bảng, 207 cột). Repo **đã là monorepo pnpm + Turborepo**, nên ADR-001 là "nâng cấp", không phải "chuyển đổi".
4. **Có lỗ hổng phân quyền thật trên API hiện tại** (IDOR và lộ dữ liệu cá nhân), dù test pass: mọi user đăng nhập đều đọc được dữ liệu riêng tư của mọi nhân viên, xuất CSV toàn bộ khách hàng, sửa hoặc xóa bất kỳ công việc nào. Chi tiết mục 6.
5. **Next.js 14.2.35 có 2 lỗ hổng Critical (RCE)**, chỉ vá từ 15.5.24. Đã xác minh bằng `pnpm audit` hôm nay.
6. **Một số thông tin hiện trạng trong MASTER PROMPT V4 Mục 4 chưa chính xác** (Redis + Bull không được dùng, RBAC có 5 role chứ không phải 4, dữ liệu sinh trắc học đang lưu ở server). Đã ghi vào Open Issues.
7. **Khoảng cách tới SPEC rất lớn**: SPEC Mục 10 có 104 bảng; hiện có 19 bảng; dữ liệu hiện có chỉ chảy vào 23 bảng đích, 81 bảng còn lại tạo mới hoàn toàn. Chi tiết ở G0.2.

---

## 2. Cách kiểm chứng đã thực hiện

| Bước | Lệnh / cách làm | Kết quả |
|---|---|---|
| Clone repo | `git clone` HTTPS không token | Thành công (repo public) |
| Kiểm tra nhánh | `git ls-remote origin` | `main`, `feat/milestone-1`, `feat/m2-customer-module`, `feat/m3-deals-module`. Không có nhánh M4 trở đi |
| Khôi phục M1 đến M8 | Script tách 276 mục trong backup ra file thật | 271 file văn bản khôi phục; 5 file nhị phân không có trong backup (icon, 4 model nhận diện khuôn mặt) |
| Cài phụ thuộc | `pnpm install` (không có lockfile trong backup) | Thành công; `bcrypt` không build được native trong sandbox (dùng `bcryptjs` thay thế **chỉ khi chạy test**) |
| Test | `jest --coverage` | **34/34 suite, 556/556 test pass**, coverage statements 99,57%, branches 97,85% |
| Typecheck | `tsc --noEmit` | 1 lỗi ở `prisma/seed.ts:450` (null vs undefined); có thể do phiên bản Prisma resolve khác vì thiếu lockfile |
| Migration | Áp 7 file SQL lần lượt vào PostgreSQL 16 trống | Sạch, không lỗi |
| Drift schema | So cột DB sau migrate với `schema.prisma` | 207/207 cột khớp, không drift |
| Lỗ hổng phụ thuộc | `pnpm audit` cho api + web | 2 Critical, 12 High, 21 Moderate, 5 Low |
| Rà code bảo mật | Đọc guard, service, controller | Xem mục 6 |

Giới hạn: không chạy được `prisma migrate` bằng engine chính thức (mạng sandbox chặn `binaries.prisma.sh`), nên migration được áp bằng `psql`. Chưa chạy được app mobile (thiếu model nhị phân). Chưa có quyền truy cập DB thật của COMTECH (nếu có).

---

## 3. Kiến trúc và stack thực tế

| Lớp | Thực tế trong repo | SPEC / MASTER PROMPT yêu cầu | Đánh giá |
|---|---|---|---|
| Monorepo | pnpm 9.15.9 workspaces + Turborepo 2.1; `apps/api`, `apps/web`, `apps/mobile`, `packages/types` | pnpm + Turbo; `apps/web`, `apps/app`, `apps/api`, `apps/worker`, `packages/{ui,contracts,config,db,i18n}` | Nền đúng, thiếu app/package |
| Web | Next.js **14.2.35** App Router, React 18.3, Tailwind, shadcn/ui, React Query | Next.js stable đã vá, tách `web` (public) và `app` (Workspace BFF) | Phải nâng major; hiện chỉ có Workspace, chưa có website công khai |
| API | NestJS 10.4, Swagger 7, class-validator (whitelist + forbidNonWhitelisted), helmet, throttler, compression | NestJS, REST, OpenAPI 3.1, `/api/v1` | Tiền tố hiện là `/api`, Swagger ở `/api/docs` |
| ORM / DB | Prisma 5.20, PostgreSQL 15 (compose) | Prisma + PG ≥ 15, extension `pgcrypto`, `unaccent`, `pg_trgm`, `citext` | Chưa bật extension nào |
| Queue / cache | **Không có.** Không có Redis trong compose, không có package bull/bullmq/ioredis. Chỉ có `@nestjs/schedule` (1 cron sinh nhật 7h) | Redis + BullMQ, `apps/worker` tách process | MASTER PROMPT Mục 4 ghi "Redis + Bull" là **không đúng** |
| Storage | Không có. Ảnh chấm công lưu dạng URL chuỗi | S3/MinIO, presigned URL, ClamAV | Chưa có |
| Auth | JWT HS256 access 15 phút (Bearer, lưu trong bộ nhớ trình duyệt) + refresh 7 ngày cookie HttpOnly `comtech_refresh`, xoay vòng; bcrypt cost 12; khóa sau 5 lần sai | JWT ngắn hạn, BFF cookie `__Host-`, phát hiện tái sử dụng token family, Argon2id, 2FA TOTP, RS256/EdDSA | Nền hợp lý, thiếu nhiều |
| Phân quyền | 5 role cố định (`admin`, `manager`, `employee`, `hr`, `hr_manager`), ma trận hard-code trong `common/permissions.ts`; **danh sách quyền nhét trong JWT**; hai cơ chế song song `@Roles` và `@RequirePermissions` | Permission engine Mục 14, `resource.action` + scope ở grant, không nhét quyền vào JWT, `permission_version` | Phải thay thế |
| Mobile | Expo SDK 57, React Native 0.81, 4 màn hình (đăng nhập, chấm công, đăng ký khuôn mặt, lịch sử) | React Native + Expo, SQLite offline, sync protocol | Chỉ có chấm công; không có offline/sync |
| CI/CD | **Không có** (`.github/` không tồn tại) | Pipeline Mục 37 | Chưa có |
| Quan sát | Không có | OTel, Prometheus, Loki, Sentry, `/health`, `/ready` | Chưa có |
| Container | Dockerfile multi-stage non-root cho api và web, `docker-compose.prod.yml` | Docker, Compose staging/prod | Có nền; Dockerfile không chạy `migrate deploy` |

---

## 4. Kiểm kê module

### 4.1 Backend (`apps/api/src`, 85 endpoint)

| Module | Endpoint | Test | Bảng | Ánh xạ sang module SPEC Mục 7 |
|---|---|---|---|---|
| auth | 5 | có | users, refresh_tokens, password_reset_tokens | 01 identity |
| users | 6 | có | users, user_roles | 01 identity + 02 access |
| departments | 7 | có | departments | 03 organization |
| employees | 7 | có | employees | 04 employees |
| customers | 7 | có | customers | 06 customers |
| deals | 12 | có | deals, deal_activities | 08 sales (opportunities) |
| task-library | 12 | có | task_templates, tasks | 12 work-library + 13 tasks |
| dashboard | 5 | có | (đọc) | 23 reports (widget) |
| reports | 3 | có | (đọc) | 23 reports |
| audit | 2 | có | audit_logs | 30 audit |
| attendance | 10 | có | attendance_records, office_locations | 16 attendance (P2) |
| notifications | 9 | có | notifications, notification_reads | 20 notifications + 21 communication |

Không có: projects, sites, contracts, leads, files/folders/documents, approvals, KPI, CMS, search, import/export, settings, feature flags, menu, integrations, webhooks, sync, system health.

### 4.2 Frontend (`apps/web`, 35 trang)

Khu `(auth)`: đăng nhập, quên mật khẩu, đặt lại mật khẩu. Khu `(app)`: dashboard, khách hàng (4), cơ hội (4), thư viện công việc (6), nhân viên (2), phòng ban (2), chấm công (4), báo cáo (4), thông báo, nhật ký audit, cài đặt hồ sơ, quản lý người dùng.

Quan sát:
- Menu hard-code trong `src/lib/nav.ts` theo role (vi phạm N6). Có mục "Công việc" trỏ tới `/activities`, **route này không tồn tại** (link hỏng).
- `middleware.ts` chỉ kiểm tra có cookie refresh hay không; bảo vệ route thực hiện ở client (`(app)/layout.tsx`). Chưa có route guard theo permission (SPEC 14.6).
- Không có test frontend (README cũng ghi nhận).
- Chưa có design token theo SPEC Mục 33 (màu `#FA9D0E` + chữ navy, font Be Vietnam Pro/Inter). Cần kiểm tra thực tế khi dựng `packages/ui`.

### 4.3 Mobile (`apps/mobile`)

14 file nguồn: đăng nhập, chấm công GPS + khuôn mặt (face-api), đăng ký khuôn mặt, lịch sử. Gọi thẳng API `/api/...`. README gốc ghi app "nằm ngoài pnpm workspace", nhưng `pnpm-workspace.yaml` khai báo `apps/*` nên thực tế **nằm trong** workspace. Cần làm rõ.

---

## 5. Hiện trạng dữ liệu

- 19 bảng, 207 cột, 7 migration (M1, M2, M3, M4, M6, M7, sửa FK). M5 và M8 không thêm bảng.
- ID: UUID v4 sinh ở DB. Thời gian: `timestamptz` (đạt). Tiền: `DECIMAL(15,2)` (SPEC: 18,2).
- Tên cột snake_case (đạt). JSON API trả **camelCase** (SPEC: snake_case). Đổi là breaking change cho web và mobile.
- Soft delete không đồng nhất: `deleted_at` (users, departments, customers, deals, tasks), `archived_at` (employees), không có (task_templates, notifications, office_locations).
- Không có cột `created_by/updated_by` chuẩn, `version`, `data_origin` ở bảng nào.
- Unique trên `code` là unique toàn phần, không partial theo `deleted_at` (không tạo lại mã đã xóa được).
- Sinh mã nghiệp vụ bằng `findFirst orderBy code desc` + 1, **ngoài transaction**: hai request đồng thời sinh trùng mã, request sau lỗi unique. Mẫu mã lệch SPEC: `KH-0000` (SPEC `KH-000000`), `TASK-00000` (SPEC `T-YYMM-00000`), `TMPL-0000` (SPEC `W000`), `CH-0000` (SPEC chưa định nghĩa mẫu mã cơ hội).
- Seed tạo dữ liệu mẫu **không gắn cờ DEMO** (vi phạm MASTER PROMPT 3.3), có tên doanh nghiệp có thật ("FPT Solutions"), và **không có chặn chạy ở production**.
- Chưa biết DB đang chạy thật (nếu có) chứa dữ liệu REAL hay chỉ seed. Đây là câu hỏi then chốt cho migration G1 (xem G0.3).

---

## 6. Phát hiện bảo mật và tuân thủ (đã xác minh trong code)

| # | Mức | Phát hiện | Vị trí | Vi phạm |
|---|---|---|---|---|
| S1 | **Critical** | Next.js 14.2.35: 2 RCE không cần xác thực (Image Optimization với AVIF; server chạy Windows) và 9 lỗi High (DoS, SSRF, bypass middleware). Vá ở ≥ 15.5.24 | `apps/web/package.json` | NFR-08 |
| S2 | **High** | `GET /employees` và `GET /employees/:id` chỉ yêu cầu đăng nhập, trả SĐT cá nhân, ngày sinh, địa chỉ CCCD, địa chỉ hiện tại, SĐT khẩn cấp của **mọi** nhân viên cho **mọi** user | `employees.controller.ts`, `employees.service.ts#mapEmployee` | N4, N5, SPEC 14.6, Luật 91/2025 |
| S3 | **High** | `GET /reports/customers?format=csv` và `/reports/sales` chỉ yêu cầu đăng nhập; lọc theo `employeeId`/`departmentId` **lấy từ query string** chứ không từ quyền user: nhân viên thường xuất được toàn bộ khách hàng | `reports.controller.ts`, `reports.service.ts#assigneeFilter` | N4, SPEC 14.3, 27.2 |
| S4 | **High** | `PATCH /task-library/tasks/:id`, `PATCH .../:id/progress` và **`DELETE /task-library/tasks/:id`** không có `@Roles` hay kiểm tra object: mọi user đăng nhập sửa hoặc xóa mềm được mọi công việc; `GET .../tasks/:id` xem được mọi công việc. Body của `/progress` khai báo kiểu inline nên không qua class-validator | `task-library.controller.ts` | N5 (IDOR), N8 |
| S5 | High | Dữ liệu sinh trắc học: vector khuôn mặt lưu ở server (`employees.face_encoding`) và so khớp ở server | `attendance.service.ts` | SPEC 17, MASTER PROMPT 9, Luật 91/2025. [LEGAL REVIEW REQUIRED] |
| S6 | High | Repo public + bản backup lộ toàn bộ mã và 8 mật khẩu seed mặc định | GitHub | SPEC 16.4 |
| S7 | Medium | Quyền nhét trong JWT; `JwtStrategy.validate` không kiểm tra trạng thái user: khóa/đổi quyền chỉ có hiệu lực sau tối đa 15 phút | `jwt.strategy.ts` | SPEC 13.2, 42.2 |
| S8 | Medium | Refresh token: không có token family, dùng lại token cũ không thu hồi cả chuỗi | `auth.service.ts#refresh` | SPEC 13.2, test bảo mật số 5 |
| S9 | Medium | Audit log là bảng thường, UUID, không hash chain, không tách quyền DB, ghi ngoài transaction nghiệp vụ | `audit.service.ts` | N8, SPEC 16.5 |
| S10 | Medium | Hai cơ chế phân quyền song song (`@Roles` ở 5 controller, `@RequirePermissions` ở 5 controller); `hr_manager` bị bỏ sót ở các `@Roles('admin','hr')` | các controller | N6, SPEC 2.2 #8 |
| S11 | Low | Mật khẩu bcrypt (SPEC: Argon2id); không có 2FA; không có danh sách mật khẩu phổ biến, lịch sử mật khẩu | `auth.service.ts` | SPEC 13.3 |
| S12 | Low | Không CSRF token (hiện ổn vì access token là Bearer; sẽ bắt buộc khi chuyển BFF cookie) | | SPEC 13.2 |

Điểm tốt đã có: 404 thay vì 403 cho khách hàng và cơ hội ngoài scope; ValidationPipe chặn mass assignment; helmet; throttler toàn cục; cookie Secure mặc định ở production; kiểm tra `JWT_SECRET` tối thiểu 16 ký tự khi khởi động.

**Nhận xét quan trọng:** coverage 99% nhưng các lỗi S2 đến S4 vẫn lọt, vì test là unit test mock Prisma, không có **test ma trận quyền** và **test IDOR** chạy trên DB thật. Đây chính là loại test G2 bắt buộc (SPEC Mục 41).

---

## 7. Đề xuất xử lý ngay (trước G1, không phải tính năng)

| # | Việc | Ai | Lý do |
|---|---|---|---|
| H1 | Chuyển repo GitHub sang **private** | COMTECH (chủ repo) | S6 |
| H2 | Đưa M4 đến M8 vào git thật: tạo nhánh `chore/restore-m4-m8` từ bản code gốc trên máy dev (ưu tiên, giữ lịch sử commit); nếu không còn thì commit bản khôi phục từ backup (đã chuẩn bị sẵn, 271 file). Sau đó xóa file backup 1,18 MB khỏi repo | Dev phụ trách CRM cũ + Tech Lead | Rủi ro số 1; SPEC 6.2 bước 2 "giữ nguyên lịch sử git" |
| H3 | Nếu có môi trường đang chạy: đổi toàn bộ mật khẩu seed, xoay `JWT_SECRET` | COMTECH/DevOps | S6 |
| H4 | Vá nóng S2, S3, S4 trên bản đang chạy (nếu đang có người dùng thật) hoặc chặn truy cập ngoài nội bộ | Dev | Lỗ hổng đang mở |
| H5 | Nâng Next.js lên nhánh đã vá (xem ADR-001) | Dev | S1 |
| H6 | Tạm tắt chức năng đăng ký khuôn mặt cho tới khi có legal review | COMTECH | S5 |

Theo MASTER PROMPT, các hotfix H4, H5 là "vá lỗi", không phải tính năng mới; cần COMTECH xác nhận trước khi làm.

---

## 8. Đánh giá mức tái sử dụng cho Central Platform

| Thành phần | Giữ | Nâng cấp | Viết lại |
|---|---|---|---|
| Khung monorepo, Turbo, Docker | x | | |
| Auth (login, lock, reset, refresh cookie) | | x (Argon2id rehash-on-login, session + token family, 2FA, username/SĐT) | |
| RBAC | | | x (permission engine Mục 14) |
| Customers, Deals (UI + logic scope) | | x (schema SPEC, dò trùng, merge, contacts) | |
| Employees, Departments | | x (tách `employee_private`, positions, teams) | |
| Task library / Tasks | | | x phần domain (work_items + state machine Mục 23); giữ UI làm tham khảo |
| Dashboard, Reports | | | x (semantic layer Mục 30) |
| Audit | | | x (append-only, partition, hash chain) |
| Attendance | Giữ bản ghi | x (xác thực trên thiết bị, sites) | phần khuôn mặt server |
| Notifications | | x (tách announcements / notifications / recipients) | |
| Test unit hiện có | x | x (thêm authorization test sinh từ route) | |

Ước tính: khoảng 40% backend và 50% UI Workspace dùng lại được sau nâng cấp. Con số này là ước tính kỹ thuật để lập kế hoạch, cần Tech Lead xác nhận.

---

## 9. Rủi ro và Open Issues

| # | Nội dung | Loại |
|---|---|---|
| OI-01 | MASTER PROMPT Mục 4 ghi stack có "Redis + Bull"; repo không dùng. Ghi "RBAC 4 role"; thực tế 5 role (`hr_manager`) | Mâu thuẫn prompt với repo |
| OI-02 | README backup ghi "M1 đến M8 đã merge vào main"; git chỉ có M1 đến M3 | Mâu thuẫn tài liệu với repo |
| OI-03 | SPEC 19.1 dòng "Privacy" bị cắt cụt ngay trong file docx (`POST /admin/privacy/export/{employeeId`); thiếu các endpoint quyền chủ thể dữ liệu | Lỗi SPEC |
| OI-04 | SPEC 23.2 dùng quyền `task.reopen` nhưng danh mục 15.2 không có | Lỗi SPEC |
| OI-05 | SPEC 14.5 nhắc bảng `project_role_permissions`, 9.2 nhắc `kpi_task_facts`, 29 nhắc `search_documents`, nhưng Mục 10 không có DDL | Lỗi SPEC |
| OI-06 | SPEC 10.3 dùng kiểu `LTREE` nhưng danh sách extension (MASTER PROMPT 6.2) không có `ltree` | Lỗi SPEC |
| OI-07 | SPEC 15.1 dùng scope `SHARED`, `CMS` không thuộc enum scope 14.1 | Lỗi SPEC |
| OI-08 | SPEC 8.5 yêu cầu `legacy_address_text` cho địa chỉ, nhưng DDL `customers` không có cột này | Lỗi SPEC |
| OI-09 | SPEC 8.1 không có mẫu mã cho Cơ hội (hiện dùng `CH-0000`) | Thiếu SPEC |
| OI-10 | SPEC không có bảng cho token đặt lại mật khẩu và địa điểm văn phòng (geofence chấm công) mà hệ thống hiện đang dùng | Thiếu SPEC |
| OI-11 | Nguyên tắc "migration không mất dữ liệu" mâu thuẫn với yêu cầu tối thiểu hóa dữ liệu sinh trắc học (`face_encoding`) | Cần quyết định COMTECH + pháp lý |
| OI-12 | MASTER PROMPT 9 bắt buộc 2FA cho SUPER ADMIN/ADMIN; SPEC 13.3 thêm DIRECTOR, FINANCE. Áp dụng SPEC (chi tiết kỹ thuật) | Đã xử lý theo quy tắc |
| OI-13 | Đổi JSON sang snake_case và tiền tố `/api/v1` phá vỡ web + mobile hiện tại | Xử lý trong ADR-001 mục chiến lược API |

Placeholder đã dùng trong tài liệu G0: `[LEGAL REVIEW REQUIRED]` (S5), `[COMTECH INPUT REQUIRED]` và `[DATA SOURCE REQUIRED]` (G0.3).

---

## 10. Việc tiếp theo

1. COMTECH trả lời các câu hỏi chặn G1 trong G0.3 (nhóm A).
2. Thực hiện H1 đến H3 trong mục 7.
3. Tech Lead duyệt G0.2 (bảng chênh lệch) và ADR-001.
4. Khi 1 đến 3 xong: mở G1 (ERD, Prisma schema, migration expand/contract, data dictionary, OpenAPI skeleton, seed role/permission/menu).
