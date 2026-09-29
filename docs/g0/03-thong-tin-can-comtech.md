# G0.3 Danh sách thông tin cần COMTECH cung cấp

| Mục | Giá trị |
|---|---|
| Phase/Gate | G0 |
| Nguồn | SPEC Mục 3.4 (14 mục) + các câu hỏi phát sinh khi rà soát repo (G0.1, G0.2) |
| Cách dùng | Mỗi mục có mã để trả lời. Mục chưa trả lời được ghi thành `verification_items` khi Data Verification Center có ở G2 |

Mức chặn: **A** chặn G1 (không viết được migration đúng), **B** chặn G2, **C** chặn G3 trở đi.

---

## A. Chặn G1: cần trả lời trước khi viết schema và migration

| Mã | Câu hỏi / thông tin | Vì sao cần | Gợi ý mặc định nếu COMTECH đồng ý |
|---|---|---|---|
| A1 | Có môi trường CRM nào **đang chạy với dữ liệu thật** không? Nếu có: ở đâu, ai quản trị, bao nhiêu user/khách hàng/deal/task, có bản backup gần nhất không? | Quyết định migration phải bảo toàn dữ liệu thật hay chỉ cần chạy trên DB trống | Nếu chưa có dữ liệu thật: G1 vẫn viết migration có backfill, nhưng diễn tập trên DB seed |
| A2 | Mã nguồn gốc M4 đến M8 (có lịch sử commit) còn trên máy ai không? | Git chỉ có M1 đến M3; SPEC 6.2 yêu cầu giữ lịch sử | Nếu không còn: commit bản khôi phục từ file backup (đã chuẩn bị, 271 file) thành 1 commit có ghi chú |
| A3 | Đồng ý chuyển repo GitHub sang **private** ngay? Ai giữ quyền owner? | Repo đang public, lộ mã và mật khẩu seed | Private, 2 owner (COMTECH + Tech Lead) |
| A4 | Lựa chọn hạ tầng: VPS/Cloud tại Việt Nam (nhà cung cấp nào), NAS hiện có (model, dung lượng, giao thức SMB/NFS) (SPEC 3.4 #11) | Chốt storage provider, bản PostgreSQL, extension được phép | VPS trong nước + Docker Compose; MinIO; PostgreSQL 16 |
| A5 | Khách hàng đang ở trạng thái **"lead"** trong CRM cũ: chuyển thành khách hàng PROSPECT, hay chuyển sang bảng **Lead** riêng? | SPEC tách Lead khỏi Customer | Chuyển thành PROSPECT, giữ dấu vết `legacy_status='lead'` |
| A6 | Danh sách phân loại khách hàng hiện có: khách nào là **nhà mạng** (OPERATOR), đơn vị trực thuộc (ví dụ MobiFone Lâm Đồng thuộc MobiFone), cơ quan nhà nước, nhà cung cấp? | Schema cũ chỉ có company/individual | Mặc định ENTERPRISE, PO phân loại lại qua màn hình xác minh |
| A7 | Ai là **SUPER_ADMIN** (hệ thống) và ai là **ADMIN** (nghiệp vụ)? SUPER_ADMIN có được xem dữ liệu CONFIDENTIAL không (SPEC 15.1 cho phép tách nhiệm vụ)? | Seed role và gán quyền đầu tiên | 1 SUPER_ADMIN (IT), không xem CONFIDENTIAL; ADMIN cho người quản lý hiện tại |
| A8 | Quy tắc gán role cho nhân viên cũ đang có role `employee`: theo phòng ban (Kinh doanh → SALES, Kỹ thuật → TECHNICAL) có đúng không? | Ánh xạ role cũ sang role mới (G0.2 mục 5.4) | Theo phòng ban như trên |
| A9 | Trạng thái nhân viên: "Thử việc" và "Đang nghỉ" ánh xạ thế nào (SPEC chỉ có ACTIVE/INACTIVE/SUSPENDED/TERMINATED)? | G0.2 mục 5.3 | Thử việc = ACTIVE + cờ thử việc; Đang nghỉ = SUSPENDED |
| A10 | Dữ liệu HR đang lưu nhưng SPEC chưa có chỗ: ngày ký/hết hạn hợp đồng lao động, giới tính, địa chỉ theo CCCD. Giữ, chuyển sang module HRM sau, hay xóa? | Không mất dữ liệu vs tối thiểu hóa dữ liệu cá nhân | Giữ trong `employee_private`, chỉ HR xem |
| A11 | **Dữ liệu khuôn mặt** (vector sinh trắc học) đang lưu trên server: đồng ý xóa sau khi chuyển sang xác thực trên thiết bị? Đã có văn bản đồng ý của nhân viên chưa? `[LEGAL REVIEW REQUIRED]` | SPEC 17, Luật BVDLCN 91/2025/QH15 | Cô lập ngay, xóa sau khi có ý kiến pháp lý |
| A12 | Địa điểm văn phòng dùng cho chấm công GPS (bảng `office_locations`): quản lý như một loại **Trạm/Site** (loại OFFICE) hay bảng riêng? | SPEC không có bảng này | Site loại OFFICE, dùng chung bán kính check-in |
| A13 | Giờ chốt hạn công việc khi chuyển hạn từ "ngày" sang "ngày giờ" (ví dụ 17:30) | G0.2 OI-G2-06 | 17:30 giờ Việt Nam |
| A14 | Nguồn danh mục đơn vị hành chính 2 cấp chính thức (file Excel/CSV của cơ quan nhà nước) và bảng ánh xạ tên tỉnh cũ sang tỉnh mới `[DATA SOURCE REQUIRED]` | Bảng `admin_units`, chuyển địa chỉ cũ | Dev tìm nguồn công khai, COMTECH xác nhận |

---

## B. Chặn G2: IAM, phân quyền, tổ chức

| Mã | Thông tin | SPEC | Hạn |
|---|---|---|---|
| B1 | Sơ đồ tổ chức: danh sách phòng ban (mã, tên, cấp cha), chức danh, **đội kỹ thuật theo vùng** (tên đội, tỉnh phụ trách, đội trưởng) | 3.4 #6 | G2 |
| B2 | Xác nhận ma trận quyền mặc định SPEC 15.3 (đặc biệt: HR xem toàn bộ dữ liệu riêng tư; FINANCE xem giá trị hợp đồng; MANAGER xem hợp đồng mức nào) | 15.3 | G2 |
| B3 | Chính sách lưu trữ: thời hạn giữ ảnh hiện trường, log ứng dụng, audit (SPEC gợi ý ≥ 5 năm), hồ sơ ứng viên (gợi ý 12 tháng), ảnh bằng chứng chấm công (gợi ý 90 ngày) | 3.4 #13, NFR-13 | G2 |
| B4 | Kỹ thuật viên hiện trường có email công ty không? Đăng nhập bằng SĐT hay mã nhân viên? | 13.1 | G2 |
| B5 | Có dùng Microsoft 365 hay Google Workspace (cho SSO P1 và email P0)? | 3.4 #10 | G2 (email), G4 |
| B6 | Chính sách 2FA: ngoài SUPER_ADMIN/ADMIN/DIRECTOR/FINANCE, có bắt buộc cho MANAGER không? Dùng app nào (Google Authenticator, Microsoft Authenticator)? | 13.3 | G2 |
| B7 | Người đại diện COMTECH duyệt Gate (Product Owner) và Tech Lead người thật review code (SPEC 40.1 bắt buộc khi dùng AI coding agent) | 40.1 | Trước G1 |

---

## C. Chặn G3 trở đi (từ SPEC 3.4, giữ nguyên)

| Mã | Thông tin | Dùng cho | Hạn | Nhãn hiện tại |
|---|---|---|---|---|
| C1 | Số liệu "trạm và dịch vụ" chính thức và phạm vi năm (profile ghi 9.674 cho 2013 đến 2025, biểu đồ dùng phạm vi khác) | Trang chủ, Năng lực | G3 | [DATA CONFLICT - VERIFY BEFORE PUBLICATION] |
| C2 | Địa chỉ trụ sở, chi nhánh theo địa giới hành chính mới (từ 01/07/2025) | Liên hệ, schema.org, footer | G3 | [DATA CONFLICT - VERIFY BEFORE PUBLICATION] |
| C3 | Mã số thuế, D-U-N-S, giấy chứng nhận, chứng chỉ | Về COMTECH | G3 | [COMTECH INPUT REQUIRED] |
| C4 | Danh sách dự án được phép công khai, ảnh, khách hàng đồng ý nêu tên | Case study | G3 | [VERIFY BEFORE PUBLICATION] |
| C5 | Văn bản cho phép dùng logo khách hàng/hãng | Trang chủ, logo wall | G3 | [VERIFY BEFORE PUBLICATION] |
| C6 | Số nhân sự, doanh thu, giải thưởng (chỉ khi muốn công bố) | Năng lực | G3 | [DATA SOURCE REQUIRED] |
| C7 | Danh sách URL website cũ có traffic (hoặc quyền xem Google Search Console) | Redirect 301 | G3 | [COMTECH INPUT REQUIRED] |
| C8 | Người phụ trách nội dung tiếng Anh | Song ngữ | G3 | [COMTECH INPUT REQUIRED] |
| C9 | Quyền cấu hình DNS `comtechvietnam.vn` (tạo `app.`, `api.`) | Triển khai | G3 | [COMTECH INPUT REQUIRED] |
| C10 | Nhà cung cấp SMS brandname, Zalo OA (nếu có) | Thông báo P2 | G4 | [COMTECH INPUT REQUIRED] |
| C11 | Danh mục công việc chuẩn (mã, tên, đơn vị tính, checklist, số ảnh tối thiểu, có tính KPI không) | Work Library | G5 | [COMTECH INPUT REQUIRED] |
| C12 | Quy trình duyệt (task, tài liệu, nghỉ phép, mua hàng) | Workflow | G5 | [COMTECH INPUT REQUIRED] |
| C13 | File dữ liệu cũ để import thử: Excel khách hàng, danh sách trạm (KMZ + Excel theo tỉnh của bản đồ tuyến truyền dẫn) | Import, Sites | G5 | [COMTECH INPUT REQUIRED] |
| C14 | Công thức KPI theo phòng ban/vị trí | KPI engine | G6 | [COMTECH INPUT REQUIRED] |
| C15 | Xác nhận quy mô NFR: khoảng 200 nhân sự, 1.000 khách hàng, vài nghìn trạm, 1 đến 2 TB file/năm | NFR, sizing | G1 | [VERIFY] |

---

## D. Mẫu trả lời nhanh

Có thể trả lời theo mã, ví dụ:

```
A1: Chưa có dữ liệu thật, chỉ chạy thử trên máy dev.
A3: Đồng ý private. Owner: ...
A5: Theo mặc định.
A11: Tạm cô lập, chờ luật sư.
```

Mục nào trả lời "theo mặc định" sẽ được ghi vào ADR hoặc biên bản Gate để truy vết.
