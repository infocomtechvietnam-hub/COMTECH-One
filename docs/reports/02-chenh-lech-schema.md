# G0.2 Bảng chênh lệch schema: hiện tại so với SPEC Mục 10

| Mục | Giá trị |
|---|---|
| Phase/Gate | G0 |
| Schema hiện tại | `apps/api/prisma/schema.prisma` bản M8 (khôi phục từ backup), 19 bảng, 207 cột, 7 migration; đã migrate thử sạch trên PostgreSQL 16, không drift |
| Schema đích | SPEC V2.0 Mục 8 (nguyên tắc), Mục 10 (DDL tham chiếu, 104 bảng) |
| Mục đích | Đầu vào cho G1: thiết kế migration **expand → migrate → contract**, không mất dữ liệu |

Ký hiệu hành động: **GIỮ** (giữ bảng, đổi/thêm cột), **ĐỔI TÊN**, **TÁCH**, **GỘP**, **THAY** (tạo bảng mới, chuyển dữ liệu, bảng cũ giữ read-only đến bước contract), **BỔ SUNG** (bảng ngoài SPEC, cần quyết định), **MỚI** (chưa có).

---

## 1. Tổng quan

| Chỉ số | Số lượng |
|---|---|
| Bảng SPEC Mục 10 | 104 |
| Bảng hiện có | 19 |
| Bảng hiện có ánh xạ được sang SPEC | 17 |
| Bảng hiện có không có trong SPEC | 2 (`password_reset_tokens`, `office_locations`) |
| Bảng SPEC nhận dữ liệu chuyển đổi từ schema hiện tại | 23 |
| Bảng SPEC không có dữ liệu nguồn (tạo trống) | 81 |
| Bảng SPEC được nhắc tới nhưng không có DDL | 3 (`project_role_permissions`, `kpi_task_facts`, `search_documents`) |

---

## 2. Chênh lệch xuyên suốt (áp dụng cho mọi bảng nghiệp vụ)

| # | Quy tắc SPEC | Hiện tại | Xử lý đề xuất ở G1 |
|---|---|---|---|
| X1 | Cột chuẩn 8.2: `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `deleted_reason`, `version`, `data_origin` | Chỉ có `created_at`, `updated_at`, một số bảng có `deleted_at` hoặc `archived_at`; `created_by_id` ở 3 bảng | Expand: thêm cột nullable/có default. `version` default 1. `data_origin` default `'REAL'`, **dữ liệu seed hiện có được gắn `'DEMO'`** theo danh sách mã seed. `archived_at` của employees sao sang `deleted_at` rồi mới bỏ ở bước contract |
| X2 | PK UUID v7 sinh ở ứng dụng | UUID v4 `@default(uuid())` | Giữ nguyên ID cũ (không đổi khóa). Bản ghi mới dùng v7. Không ảnh hưởng tham chiếu |
| X3 | Unique theo nghiệp vụ là partial `WHERE deleted_at IS NULL` | Unique toàn phần trên `code`, `email` | Thay bằng partial unique index qua SQL thô trong migration (Prisma không biểu diễn được partial index, ghi chú trong schema) |
| X4 | Mã nghiệp vụ sinh bởi `code_sequences` trong transaction; mã không đổi sau khi tạo | Sinh bằng `max+1` ngoài transaction; mẫu mã lệch SPEC | **Không đổi mã cũ.** Tạo `code_sequences`, khởi tạo `last_value` lớn hơn mã cũ lớn nhất theo từng mẫu; bản ghi mới dùng mẫu SPEC. Cột code nới lên `VARCHAR(20)` sau khi kiểm tra độ dài thực tế |
| X5 | Extension `pgcrypto`, `unaccent`, `pg_trgm`, `citext` (và `ltree` nếu giữ kiểu LTREE, xem OI-06) | Chưa bật | Migration đầu G1 bật extension |
| X6 | Email/username kiểu `CITEXT` | `VARCHAR(255)` | Đổi kiểu sau khi kiểm tra không có email trùng khác hoa/thường |
| X7 | Tiền `NUMERIC(18,2)` + `currency CHAR(3)` | `DECIMAL(15,2)`, `currency VARCHAR(10)` | Nới kiểu (an toàn, không mất dữ liệu) |
| X8 | `classification` trên customer, project, file, document; `public_visibility` + `verification_status` | Không có | Thêm với default theo SPEC 8.4 |
| X9 | Không cột `district`; địa chỉ = `address_line` + `commune_id` + `province_id` (+ `legacy_address_text`) | `customers.address`, `customers.city` tự do | Giữ văn bản cũ ở `legacy_address_text`; `province_id` điền sau khi có danh mục `admin_units` `[DATA SOURCE REQUIRED]` |
| X10 | Master data qua ID, không nhập tự do | `industry`, `source`, `category`, `job_title`, `work_area` là chuỗi tự do | Chuyển sang `lookup_values`/`positions`; giá trị cũ không khớp → giữ ở `custom_fields.legacy_*` + tạo `verification_items` |
| X11 | JSON API snake_case | camelCase | Không thuộc schema DB, nhưng ảnh hưởng hợp đồng API. Xử lý ở ADR-001 mục 5 |

---

## 3. Ánh xạ bảng hiện có sang SPEC

| # | Bảng hiện tại | Bảng đích SPEC | Hành động | Ghi chú chuyển dữ liệu |
|---|---|---|---|---|
| 1 | `users` | `users` (10.1) | GIỮ | Xem 4.1 |
| 2 | `refresh_tokens` | `sessions` (10.1) | THAY | Mỗi token còn hiệu lực → 1 session, `token_family` mới, `client_type='WEB'`. Hash hiện tại là hash của token thô nên chuyển được sang `refresh_token_hash` |
| 3 | `password_reset_tokens` | (không có trong SPEC) | BỔ SUNG | Đề xuất giữ, thêm vào SPEC (OI-10). Token còn hạn tối đa 30 phút nên có thể bỏ qua dữ liệu |
| 4 | `roles` | `roles` (10.2) | GIỮ | `name` → `code` (chữ hoa); thêm `is_system`, `status`, cột chuẩn; seed 14 role SPEC 15.1 + `HR_MANAGER` |
| 5 | `permissions` | `permissions` (10.2) | THAY | Mã cũ `customers:read:own` (scope trong mã) → mã mới `customer.view` (scope ở grant). Bảng seed lại toàn bộ từ khai báo module |
| 6 | `role_permissions` | `role_permissions` (10.2) | THAY | Thêm `scope`, `effect`; PK thành `(role_id, permission_id, scope)`. Sinh lại từ ma trận SPEC 15.3 |
| 7 | `user_roles` | `role_assignments` (10.2) | THAY | Mỗi dòng → 1 `role_assignments` với role mới theo bảng 5.1; giữ `assigned_at` → `valid_from`, `assigned_by` → `granted_by` |
| 8 | `departments` | `departments` (10.3) | GIỮ | `manager_id` → `manager_employee_id`; thêm `path`, `sort_order`, `status`; `description` giữ (SPEC không có, đề xuất giữ) |
| 9 | `employees` | `employees` + `employee_private` (10.3) | TÁCH | Xem 4.2 |
| 10 | `customers` | `customers` + `customer_contacts` (10.5) | GIỮ + TÁCH | Xem 4.3 |
| 11 | `deals` | `opportunities` (10.5) | ĐỔI TÊN + ALTER | Xem 4.4 |
| 12 | `deal_activities` | `customer_activities` (10.5) | GỘP | Hoạt động gắn `opportunity_id` và `customer_id` (lấy qua deal). Loại `stage_change`, `created` không có trong enum SPEC (OI-G2-01) |
| 13 | `task_templates` | `work_items` + `work_categories` (10.7) | THAY | Xem 4.5 |
| 14 | `tasks` | `tasks` + `task_assignments` + `task_events` (10.7) | GIỮ + TÁCH | Xem 4.6 |
| 15 | `audit_logs` | `audit_logs` (10.13, partition theo tháng, hash chain) | THAY | Xem 4.7 |
| 16 | `attendance_records` | `attendance_records` (10.8, P2) | GIỮ + ALTER | Xem 4.8 |
| 17 | `office_locations` | (không có trong SPEC) | BỔ SUNG | Đề xuất: thành `sites` với `site_type='OFFICE'` (cần thêm giá trị enum) hoặc giữ bảng riêng `work_locations`. Cần quyết định (OI-10) |
| 18 | `notifications` | `announcements` + `notifications` (10.10) | TÁCH | `type='announcement'` → `announcements` (audience JSON từ `target_scope`); `type='birthday'` → `notifications` hệ thống. `status='pending_approval'` → dùng `approval_requests` khi có module duyệt |
| 19 | `notification_reads` | `notification_recipients` (10.10) | THAY | Mỗi dòng đã đọc → recipient có `read_at`. **Lưu ý:** mô hình cũ không lưu người nhận chưa đọc; cần sinh recipients từ audience tại thời điểm migrate |

---

## 4. Chênh lệch cấp cột cho các bảng chính

### 4.1 `users`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `email VARCHAR(255) UNIQUE NOT NULL` | `email CITEXT` nullable, partial unique | Nới NOT NULL, đổi kiểu, đổi index |
| (không có) | `username CITEXT UNIQUE`, `phone VARCHAR(20)` partial unique | Thêm (kỹ thuật viên đăng nhập bằng SĐT/username, SPEC 13.1) |
| `password_hash` (bcrypt) | `password_hash` (Argon2id) | Giữ cột. Rehash sang Argon2id khi user đăng nhập thành công lần kế tiếp; không thể chuyển đổi offline |
| `is_active`, `is_locked`, `locked_at`, `locked_reason` | `status` ACTIVE/INACTIVE/SUSPENDED/LOCKED/TERMINATED, `locked_until` | Suy ra `status`: `is_locked` → LOCKED, `!is_active` → INACTIVE, còn lại ACTIVE. Giữ cột cũ tới contract |
| `failed_attempts` | `failed_login_count` | Đổi tên |
| `last_login_ip` | (không có; chuyển vào `sessions.ip_address`) | Giữ tới contract |
| (quan hệ qua `employees.user_id`) | `users.employee_id UNIQUE` | **Đảo chiều khóa ngoại.** Điền `users.employee_id` từ `employees.user_id`; bỏ `employees.user_id` ở contract |
| (không có) | `user_type`, `mfa_enabled`, `mfa_secret_ref`, `password_changed_at`, `must_change_password`, `permission_version`, `locale`, cột chuẩn | Thêm với default |

### 4.2 `employees`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `code` | `employee_code` | Đổi tên; giữ giá trị `NV-XXXX` (trùng mẫu SPEC) |
| `work_email`, `company_phone` | `work_email CITEXT`, `work_phone` | Đổi tên/kiểu |
| `avatar_url` | `avatar_file_id` | Giữ URL ở `custom_fields.legacy_avatar_url` cho tới khi có module file (G4) |
| `department_id` nullable | `department_id NOT NULL` | Nhân viên chưa có phòng ban → gán phòng ban kỹ thuật `CHUA_PHAN_BO` + verification item (DQ-04). Chỉ đặt NOT NULL ở bước contract |
| `job_title` (tự do) | `position_id` → `positions` | Sinh `positions` từ các giá trị `job_title` khác nhau (chuẩn hóa), cần PO rà |
| `manager_id` | `manager_id` | Giữ |
| `first_start_date`, `official_start_date` | `join_date` | `join_date = first_start_date`; `official_start_date` giữ ở `custom_fields` (SPEC chưa có) |
| `contract_sign_date`, `contract_end_date` | (không có) | Dữ liệu HR, SPEC chưa có. Đề xuất đưa vào `employee_private` hoặc HRM tương lai. Cần quyết định |
| `status` (`probation` mặc định, …) | `status` ACTIVE/INACTIVE/SUSPENDED/TERMINATED + `employment_type` | Ánh xạ ở 5.3. `probation` không có trong SPEC |
| `archived_at` | `deleted_at` | Sao chép rồi bỏ ở contract |
| `personal_phone`, `emergency_contact_phone`, `id_card_address`, `current_address`, `date_of_birth`, `gender` | `employee_private` (quyền `employee.view_private`) | **TÁCH** sang `employee_private`: `personal_phone`, `home_address = current_address`, `emergency_contact = {phone}`, `date_of_birth`. `id_card_address` và `gender` SPEC không có: giữ trong `employee_private` dạng JSON phụ, cần quyết định |
| `work_area` (tự do) | `team_members` / `teams.region_province_ids` | Giữ ở `custom_fields.legacy_work_area` cho tới khi COMTECH cung cấp danh sách đội |
| `face_encoding JSONB` | **Không có** (SPEC 17: xác thực trên thiết bị, server chỉ lưu kết quả) | **Không migrate sang bảng mới.** Việc xóa dữ liệu cũ chờ quyết định COMTECH + pháp lý (OI-11). Trong lúc chờ: cô lập ở bảng tạm `legacy_biometric_templates` chỉ SUPER_ADMIN đọc được, có hạn xóa |
| (không có) | `skills`, `notes`, `employment_type`, `leave_date`, cột chuẩn | Thêm |

### 4.3 `customers`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `code` `KH-0000` | `customer_code` `KH-000000` | Đổi tên cột, **giữ giá trị cũ**; mã mới dùng mẫu 6 số (X4) |
| `name` | `name`, `legal_name`, `short_name`, `normalized_name NOT NULL` | Thêm; `normalized_name` tính bằng hàm chuẩn hóa 11.2 (unaccent + bỏ hậu tố loại hình). Chạy dò trùng sau migrate, ghi `verification_items` |
| `type` company/individual | `customer_type` OPERATOR/ENTERPRISE/GOVERNMENT/VENDOR/INDIVIDUAL | `individual` → INDIVIDUAL; `company` → **ENTERPRISE tạm thời** + verification item để PO phân loại lại nhà mạng (OPERATOR) |
| `contact_person` | `customer_contacts` (is_primary) | Tách thành 1 contact chính; `email`, `phone` của khách hàng giữ ở bảng customers |
| `tax_code VARCHAR(50)` | `tax_code VARCHAR(20)` + partial unique `(tax_code, parent)` | Kiểm tra độ dài và trùng trước khi thu hẹp; trùng → verification item, không chặn migrate |
| `industry` (tự do) | `industry_code` (lookup) | X10 |
| `source` | (không có trong customers; có ở `leads`) | Giữ ở `custom_fields.legacy_source` |
| `status` lead/prospect/active/inactive | PROSPECT/ACTIVE/INACTIVE/MERGED | Ánh xạ ở 5.1. **`lead` cần quyết định** (xem G0.3 câu A5) |
| `address`, `city` | `address_line`, `commune_id`, `province_id`, `legacy_address_text` | X9 |
| `assigned_to_id` | `owner_employee_id`, `owner_department_id` | Đổi tên; `owner_department_id` lấy từ phòng ban của owner |
| `created_by_id` | `created_by` | Đổi tên |
| (không có) | `parent_customer_id`, `merged_into_id`, `country`, `classification`, `public_visibility`, `public_display_name`, `logo_file_id`, `tags`, `custom_fields`, cột chuẩn | Thêm |

### 4.4 `deals` → `opportunities`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `code` `CH-0000` | `code VARCHAR(20)` | Giữ giá trị; mẫu mã mới chờ SPEC (OI-09) |
| `value DECIMAL(15,2)` | `expected_value NUMERIC(18,2)` | Đổi tên + nới |
| `stage` (6 giá trị) | `stage_code` (lookup `opportunity_stage`) + `status` OPEN/WON/LOST | Seed lookup từ 4 giai đoạn mở; `closed_won`/`closed_lost` → giữ stage cuối + `status` WON/LOST |
| `assigned_to_id` nullable | `owner_employee_id NOT NULL` | Deal chưa có người phụ trách → gán người tạo (qua `created_by → employee`) hoặc verification item |
| `source`, `description`, `closed_at` | (không có) | SPEC thiếu; đề xuất giữ `closed_at` và `description` (cần cho báo cáo pipeline), `source` vào `custom_fields` |
| (không có) | `lead_id`, `project_id`, `classification` (mặc định CONFIDENTIAL), cột chuẩn | Thêm |

### 4.5 `task_templates` → `work_categories` + `work_items`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `code` `TMPL-0000` | `work_code` `W000` | Giữ mã cũ; mã mới theo W000. **Lưu ý:** SPEC 42.3 dùng W001 "Khảo sát trạm BTS" làm kịch bản nghiệm thu, mã này phải dành cho danh mục chuẩn của COMTECH |
| `category` (tự do) | `category_id NOT NULL` → `work_categories` | Sinh categories từ giá trị cũ + nhóm `LEGACY` cho giá trị rỗng |
| `priority`, `estimated_days` | `default_duration_hours` | `estimated_days × 8`; priority không có ở work item (thuộc task) |
| `is_active` | `status` | Suy ra |
| (không có) | `unit_code NOT NULL`, `checklist`, `required_evidence`, `approval_required`, `kpi_eligible`, `kpi_weight`… | Default `unit_code='LAN'`, `kpi_eligible=false` cho dữ liệu cũ (tránh tính KPI sai) |

Dữ liệu seed hiện tại (Onboarding, Chăm sóc khách hàng, Soạn hợp đồng…) là dữ liệu mẫu văn phòng, không phải danh mục công việc viễn thông. Đề xuất gắn `DEMO`, không dùng ở production.

### 4.6 `tasks`

| Cột hiện tại | Cột SPEC | Hành động |
|---|---|---|
| `code` `TASK-00000` | `task_code` `T-YYMM-00000` | Giữ giá trị cũ |
| `template_id` | `work_item_id` | Theo ánh xạ 4.5 |
| `assigned_to_id NOT NULL` | `task_assignments` (đúng 1 `is_primary`) | Mỗi task → 1 assignment primary, `assigned_by = created_by_id` (thiếu → user hệ thống) |
| `status` pending/in_progress/done/overdue | state machine 8 trạng thái | Ánh xạ ở 5.2 |
| `progress INT` | `progress_percent NUMERIC(5,2)` | Đổi kiểu |
| `due_date DATE` | `due_date TIMESTAMPTZ` | Chuyển thành 17:30 giờ VN (10:30 UTC) của ngày đó; giờ chốt cần xác nhận |
| `completed_at` | `approved_at` (+ `submitted_at`) | Task `done` → `approved_at = completed_at` |
| (không có) | `department_id NOT NULL` | Lấy từ phòng ban của assignee |
| (không có) | `project_id`, `site_id`, `customer_id`, `team_id`, `parent_task_id`, `recurrence_*`, `planned/actual_quantity`, `quality_score`, `checklist_state`, `classification`… | Thêm (nullable) |
| (lịch sử) | `task_events` | Sinh 1 event `MIGRATED` cho mỗi task để giữ vết |

### 4.7 `audit_logs`

| Hiện tại | SPEC | Hành động |
|---|---|---|
| Bảng thường, `id UUID` | `id BIGSERIAL`, PK `(id, occurred_at)`, `PARTITION BY RANGE (occurred_at)` theo tháng | Tạo bảng mới `audit_logs` (partitioned) bằng SQL thô; đổi tên bảng cũ thành `audit_logs_legacy`; chép dữ liệu theo thứ tự `created_at`, **tính hash chain ngay trong migration**; lưu UUID cũ vào `metadata.legacy_id` |
| `user_id`, `user_email` | `actor_type`, `actor_id` | `actor_type='USER'` khi có user, `'SYSTEM'` khi null |
| `old_values`, `new_values` | `before`, `after` | Đổi tên |
| `resource_type`, `resource_id` | `entity_type`, `entity_id` | Đổi tên |
| `location` | (không có) | Vào `metadata` |
| (không có) | `request_id`, `session_id`, `device_id`, `on_behalf_of`, `prev_hash`, `row_hash` | Thêm |
| Role DB ứng dụng có toàn quyền | Chỉ `INSERT, SELECT` | Tạo role DB riêng `app_rw`; REVOKE UPDATE/DELETE trên audit |

Prisma không quản lý bảng partitioned: khai báo model để đọc/ghi, phần DDL partition và tạo partition tháng tới do migration SQL + job hằng tháng.

### 4.8 `attendance_records` (P2, `ATTENDANCE_ENABLED=false` mặc định)

| Hiện tại | SPEC | Hành động |
|---|---|---|
| `date` | `work_date` | Đổi tên |
| `check_in_latitude/longitude` | `check_in_lat/lng` + `check_in_accuracy_m` | Đổi tên; accuracy null |
| `check_in_photo_url` | `evidence_file_id` + `evidence_expires_at` | Giữ URL cũ tạm; đặt `evidence_expires_at = check_in_at + 90 ngày` `[LEGAL REVIEW REQUIRED]` |
| `check_in_match_score` | `face_verification` VERIFIED/FAILED/… | Suy từ ngưỡng 0,6 hiện tại; điểm số thô có thể bỏ ở contract |
| `status` present/late/early_leave/absent | `status` VALID/NEEDS_REVIEW/APPROVED/REJECTED | Khác nghĩa: "đi muộn" là thuộc tính công, không phải trạng thái duyệt. Giữ giá trị cũ ở cột `legacy_status` |
| `UNIQUE(employee_id, date)` | `UNIQUE(employee_id, work_date, check_in_at)` | Nới ràng buộc (an toàn) |
| (không có) | `site_id`, `task_id`, `device_id`, `location_verification`, `client_command_id`, cột chuẩn | Thêm |

---

## 5. Ánh xạ giá trị trạng thái và role

### 5.1 Trạng thái khách hàng

| Hiện tại | SPEC | Ghi chú |
|---|---|---|
| `lead` | PROSPECT **hoặc** tạo bản ghi `leads` | Chờ COMTECH (G0.3 A5) |
| `prospect` | PROSPECT | |
| `active` | ACTIVE | |
| `inactive` | INACTIVE | |

### 5.2 Trạng thái task

| Hiện tại | Điều kiện | SPEC |
|---|---|---|
| `pending` | | ASSIGNED (đã có assignee) |
| `in_progress` | | IN_PROGRESS |
| `done` | | APPROVED, actor SYSTEM, `task_events.comment='Chuyển đổi từ hệ thống cũ'` |
| `overdue` | progress = 0 | ASSIGNED |
| `overdue` | progress > 0 | IN_PROGRESS |

"Quá hạn" trong SPEC là thuộc tính suy ra (`due_date < now()` và chưa APPROVED/CANCELLED), không phải trạng thái.

### 5.3 Trạng thái nhân viên

| Hiện tại | SPEC `status` | SPEC `employment_type` |
|---|---|---|
| `probation` (Thử việc) | ACTIVE | FULL_TIME (thử việc lưu ở `custom_fields.probation=true`) hoặc thêm giá trị PROBATION, chờ quyết định |
| `active` (Chính thức) | ACTIVE | FULL_TIME |
| `on_leave` (Đang nghỉ) | SUSPENDED (hoặc ACTIVE nếu là nghỉ phép ngắn) | Chờ quyết định |
| `resigned` (Đã nghỉ) | TERMINATED + `leave_date` (nếu không có, để trống + verification item) | User liên kết chuyển TERMINATED (DQ-08) |

Bốn giá trị trên lấy từ `employees.service.ts#stats` và giao diện. DTO hiện **không ràng buộc** giá trị `status` (không có `@IsIn`), nên DB thật có thể chứa giá trị khác: phải truy vấn `SELECT DISTINCT status` trên DB thật trước khi chốt.

### 5.4 Role cũ sang role SPEC 15.1

| Role cũ | Role mới | Ghi chú |
|---|---|---|
| `admin` | ADMIN | SUPER_ADMIN chỉ gán cho người được COMTECH chỉ định (G0.3 A7); bắt buộc 2FA |
| `manager` | MANAGER | Nếu là trưởng phòng Kỹ thuật và quản lý dự án thì thêm PROJECT_MANAGER sau khi có module dự án |
| `employee` | EMPLOYEE + (SALES nếu thuộc phòng Kinh doanh; TECHNICAL nếu thuộc phòng Kỹ thuật) | Quy tắc theo phòng ban cần COMTECH xác nhận |
| `hr` | HR | |
| `hr_manager` | HR_MANAGER (role bổ sung SPEC 15.1) | Kế thừa HR + duyệt |

---

## 6. Bảng SPEC chưa có, nhóm theo gate triển khai

| Gate | Nhóm | Bảng mới |
|---|---|---|
| G1/G2 | Identity | `user_identities`, `sessions`, `devices`, `api_clients` |
| G1/G2 | Access | `role_assignments`, `user_grants`, `acl_entries`, `delegations` (+ `project_role_permissions`, thiếu DDL) |
| G1/G2 | Tổ chức | `positions`, `teams`, `team_members`, `employee_private`, `employee_certifications` |
| G1/G2 | Master data | `admin_units`, `lookup_values`, `custom_field_definitions`, `code_sequences` |
| G1/G2 | Hệ thống | `menu_sets`, `menu_items`, `module_registry`, `feature_flags`, `settings`, `verification_items`, `templates` |
| G1/G2 | Audit / sự kiện | `security_events`, `domain_events`, `idempotency_keys` |
| G3 | CMS / website | `cms_entries`, `cms_translations`, `cms_revisions`, `media_assets`, `redirects`, `leads`, `job_postings`, `job_applications`, `partners` |
| G4 | File / tài liệu | `storage_providers`, `folders`, `files`, `file_versions`, `upload_sessions`, `share_links`, `documents`, `document_versions` |
| G4 | Truyền thông | `notification_recipients`, `notification_templates`, `notification_preferences`, `announcements`, `calendar_events` (+ `search_documents`, thiếu DDL) |
| G5 | Nghiệp vụ lõi | `customer_contacts`, `customer_activities`, `customer_merges`, `projects`, `project_members`, `project_milestones`, `sites`, `site_equipment`, `project_sites`, `contracts`, `contract_projects`, `work_categories`, `work_items`, `task_assignments`, `task_events`, `task_comments`, `task_evidences`, `approval_workflows`, `approval_steps`, `approval_requests`, `approval_actions`, `import_jobs`, `import_rows` |
| G6 | KPI / báo cáo | `kpi_definitions`, `kpi_periods`, `kpi_assignments`, `kpi_results` (+ `kpi_task_facts`, thiếu DDL), `report_datasets`, `reports`, `dashboards`, `dashboard_widgets`, `report_exports`, `scheduled_reports` |
| G7 | API / mobile | `sync_changes`, `sync_commands`, `integrations`, `integration_runs`, `webhooks`, `webhook_deliveries`, `forms`, `form_versions`, `form_submissions` |
| P2 | Mở rộng | `incidents` |

Đề xuất G1: tạo **toàn bộ** DDL đích ngay trong G1 (theo MASTER PROMPT G1 "chốt ERD và Prisma schema") nhưng chia migration theo nhóm; bảng của gate sau để trống, không có API. Cách này giữ ERD thống nhất và tránh đổi schema lớn ở giữa dự án.

---

## 7. Phác thảo chiến lược migration (để duyệt, chưa viết code)

1. **M-000 baseline**: đánh dấu 7 migration cũ đã áp dụng (`prisma migrate resolve --applied`) trên mọi DB hiện có. Kiểm tra drift bằng `migrate diff` trên bản sao DB thật.
2. **M-100 expand nền**: extension, `code_sequences`, cột chuẩn X1 (nullable/default), bảng master data, bảng access mới. Không xóa, không đổi tên cột cũ. Ứng dụng cũ vẫn chạy.
3. **M-200 backfill**: script có review, chạy theo lô, idempotent: role mới + `role_assignments`, `users.status`, `employee_private`, `customer_contacts`, `normalized_name`, `opportunities` (tạo bảng mới qua view hoặc đổi tên có view tương thích), `task_assignments`, `audit_logs` mới + hash chain, gắn `data_origin='DEMO'` cho seed. Mỗi bước ghi số dòng trước/sau vào báo cáo đối soát.
4. **M-300 chuyển code**: API v1 đọc/ghi cấu trúc mới; API cũ `/api/*` vẫn hoạt động qua lớp tương thích trong thời gian chuyển tiếp.
5. **M-900 contract** (release sau, khi đối soát đạt và web + mobile đã chuyển): xóa cột/bảng cũ, đặt NOT NULL, thu hẹp kiểu. Trước contract bắt buộc backup + ghi "không đảo ngược, cần restore".
6. Diễn tập toàn bộ chuỗi trên **bản sao DB thật** (SPEC 6.2 bước 5) và trên DB trống (tiêu chí G1).

Tiêu chí đối soát tối thiểu sau M-200: số user/employee/customer/deal/task/audit trước và sau bằng nhau; mọi khóa ngoại hợp lệ; mọi trường bị ánh xạ "tạm thời" đều có `verification_items`.

---

## 8. Open Issues phát sinh từ đối chiếu schema

| # | Nội dung | Cần ai |
|---|---|---|
| OI-G2-01 | Enum `customer_activities.activity_type` thiếu STAGE_CHANGE; SPEC không có bảng lịch sử giai đoạn cơ hội | Tech Lead chốt: thêm enum hoặc bảng `opportunity_stage_history` |
| OI-G2-02 | SPEC không có `closed_at`, `description`, `source` cho opportunities; `source` cho customers | Tech Lead |
| OI-G2-03 | Dữ liệu HR hiện có (ngày ký/hết hạn hợp đồng lao động, giới tính, địa chỉ CCCD) không có chỗ trong SPEC | COMTECH HR + Tech Lead |
| OI-G2-04 | `probation` không có trong enum SPEC | COMTECH HR |
| OI-G2-05 | Kiểu `path` phòng ban: `LTREE` (cần extension `ltree`) hay materialized path text | Tech Lead (đề xuất text, xem ADR-001) |
| OI-G2-06 | Giờ chốt khi đổi `due_date` từ DATE sang TIMESTAMPTZ | COMTECH PO |
| OI-G2-07 | Bảng thiếu DDL: `project_role_permissions`, `kpi_task_facts`, `search_documents` | Tech Lead bổ sung ở G1 |
