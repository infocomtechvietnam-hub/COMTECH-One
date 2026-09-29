# ADR-001: COMTECH One, dự án mới theo hướng website trước

| Mục | Giá trị |
|---|---|
| Trạng thái | **Đã chấp nhận** (quyết định của COMTECH ngày 23/09/2026) |
| Thay thế | ADR-001 "Stack và monorepo" của đợt rà soát G0 (lưu tại `docs/g0/ADR-G0-001-...-SUPERSEDED.md`) |
| Căn cứ | Chỉ đạo COMTECH: tạm gác CRM (M4-M8 không có trong git), xây website trước, kết nối CRM sau, bỏ git cũ, lập dự án "COMTECH One" |

## 1. Bối cảnh

- Rà soát G0 cho thấy mã CRM M4-M8 chỉ tồn tại trong một file backup, không có lịch sử git, và có lỗ hổng phân quyền.
- COMTECH quyết định: không kế thừa repo `comtech-web-app`; tạo repo mới **COMTECH One**; ưu tiên **Public Website + Lead**; CRM kết nối sau.
- Quyết định này **lệch** MASTER PROMPT V4 Mục 4 ("codebase CRM là hạt nhân, không xây lại từ đầu"). Theo MASTER PROMPT Mục 0.2, lệch phải ghi lại: xem Mục 5.

## 2. Quyết định

### 2.1 Phạm vi giai đoạn 1 (tương ứng G3 của SPEC, làm trước G1/G2)

- `apps/web`: website công khai theo SPEC 31-35 (sitemap, menu 7 mục + CTA, trang chủ 13 section, template giải pháp, form lead, SEO, WCAG 2.2 AA).
- `apps/api`: **chỉ** API công khai `POST /api/v1/public/leads` + `/health` + `/ready`, đúng quy ước SPEC 18 (envelope, mã lỗi, Idempotency-Key, rate limit).
- `apps/api` worker: outbox relay gửi email lead (SPEC 20.1).
- Nội dung website lưu **dạng file trong repo** (`packages/content`), mô phỏng đúng `cms_entries/verification_items` để chuyển sang CMS không phải thiết kế lại.

### 2.2 Vì sao vẫn có API + DB ngay từ đầu

Lead là dữ liệu khách hàng thật. Lưu ngay vào bảng `leads` đúng schema SPEC 10.5 nghĩa là khi CRM được xây, CRM **đọc chung bảng này** (N1: một nguồn sự thật), không phải nhập lại lead từ email.

### 2.3 Cấu trúc

```
comtech-one/
├── apps/
│   ├── web/        Next.js 16 App Router, SSG, Tailwind 4 (website công khai)
│   └── api/        NestJS 12 (API /api/v1) + worker outbox (src/worker.ts)
├── packages/
│   ├── contracts/  zod schema + danh mục + mã lỗi dùng chung web/api/mobile
│   ├── content/    nội dung website + quản trị xác minh + sổ duyệt
│   ├── db/         Prisma 7 schema, migration SQL, client (chỉ api/worker dùng)
│   └── config/     tsconfig dùng chung
├── infra/          docker-compose DEV (Postgres 16, Mailpit)
├── docs/           ADR, báo cáo G0, báo cáo nội dung
└── .github/        CI
```

Web **không** import `@comtech/db` (N2). Form lead gọi API qua HTTP.

### 2.4 Phiên bản đã chốt (npm, 23/09/2026)

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Node.js | 22 LTS | |
| pnpm / Turborepo | 10.34.5 / 2.11.3 | |
| TypeScript | 5.9.3 | Chưa lên 7.x (công cụ chưa theo kịp) |
| Next.js / React | 16.3.6 / 19.3.0 | Không còn lỗ hổng Critical của Next 14 |
| Tailwind CSS | 4.3.3 | Token SPEC 33 khai báo bằng `@theme` |
| NestJS | 12.0.4 | NestJS 12 là ESM; build CJS chạy được nhờ `require(esm)` của Node 22; test dùng Vitest + SWC |
| Prisma | 7.10.0 + `@prisma/adapter-pg` | Client không cần engine nhị phân khi chạy |
| PostgreSQL | 16 | Extension citext, pgcrypto, unaccent, pg_trgm |
| Font | Be Vietnam Pro, Inter, JetBrains Mono qua `@fontsource` | Tự host (SPEC 33.2) |

So với ADR G0 (đề xuất Prisma 6): chọn Prisma 7 vì dự án mới không có migration cũ phải chuyển, và client Prisma 7 chạy không cần tải engine nhị phân.

### 2.5 Quản trị nội dung (No Fake Data)

- Mỗi mục nội dung có `governance`: `status`, `verification_status`, `open_labels`, `data_origin`, `source`.
- **Production** chỉ hiển thị mục PUBLISHED + VERIFIED + không còn nhãn + REAL.
- **Xem trước** (`CONTENT_PREVIEW=true`, chỉ STAGING) hiển thị thêm mục chờ duyệt và DEMO, luôn có nhãn "CHỜ DUYỆT" / "DỮ LIỆU MẪU". Build bị chặn nếu bật preview với `APP_ENV=production`.
- Số liệu CONFLICT/MISSING (ví dụ 9.674 trạm, địa chỉ trụ sở) **không hiển thị ở bất kỳ chế độ nào**.
- Duyệt: Product Owner thêm id vào `packages/content/src/approvals.ts` qua Pull Request. Hệ thống từ chối duyệt mục DEMO hoặc còn nhãn mở.
- **Form lead tự khóa ở production** cho tới khi trang Chính sách xử lý dữ liệu cá nhân được duyệt pháp lý (SPEC 17); thay bằng hotline/email.

## 3. Phương án đã cân nhắc

| Phương án | Lý do không chọn |
|---|---|
| Website tĩnh, form chỉ gửi email | Lead không vào DB, sau này phải nhập tay vào CRM (trái N1) |
| CMS + DB ngay từ đầu | Đúng kiến trúc cuối nhưng chậm có website; COMTECH chọn file trong repo |
| Giữ repo `comtech-web-app` | COMTECH quyết định bỏ (M4-M8 không có trong git) |

## 4. Hệ quả

- Website có thể lên STAGING ngay; lên PRODUCTION khi COMTECH duyệt nội dung và pháp lý (xem `docs/content-verification.md`).
- Khi xây CRM/Workspace: thêm module vào `apps/api`, thêm `apps/app`, dùng chung `packages/db` (bảng `leads` đã sẵn).
- Cần làm lại IAM, permission engine, audit (G1/G2 của SPEC) trước khi có bất kỳ API nội bộ nào.

## 5. Lệch so với MASTER PROMPT/SPEC (ghi nhận theo MASTER PROMPT 0.2)

| # | Nội dung | Lý do | Xử lý về sau |
|---|---|---|---|
| D1 | Không kế thừa CRM hiện có (MASTER PROMPT 4) | Quyết định COMTECH | Khi xây CRM, dùng G0.2 làm tài liệu tham khảo nghiệp vụ |
| D2 | Làm G3 (website) trước G1/G2 | Quyết định COMTECH | Website không có dữ liệu nội bộ, chỉ ghi lead; rủi ro thấp |
| D3 | Nội dung dạng file, chưa có CMS có workflow duyệt | Quyết định COMTECH | Sổ duyệt `approvals.ts` + review PR thay tạm workflow CMS |
| D4 | Chưa có audit_logs cho lead tạo từ website | Chưa có module audit | Bổ sung ở G2 |
| D5 | `domain_events.next_attempt_at` thêm ngoài DDL SPEC | Cần lùi lịch thử lại | Đề xuất bổ sung vào SPEC |
| D6 | Worker chạy polling, chưa có Redis/BullMQ | Tải thấp | Chuyển BullMQ khi có Redis |
| D7 | Chưa có bản tiếng Anh (/en) | Chưa có bản dịch được duyệt; SPEC 31.5 cấm trang EN rỗng | Thêm khi có bản dịch REVIEWED |
