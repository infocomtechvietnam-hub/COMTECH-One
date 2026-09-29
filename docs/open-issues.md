# Open Issues: COMTECH One giai đoạn website

| Mã | Nội dung | Mức | Cần ai | Hạn |
|---|---|---|---|---|
| OI-W-01 | Chính sách xử lý dữ liệu cá nhân là bản nháp kỹ thuật `[LEGAL REVIEW REQUIRED]`. Form lead production khóa cho tới khi duyệt | Chặn go-live form | Luật sư + COMTECH | Trước go-live |
| OI-W-02 | CSP còn `'unsafe-inline'` cho script (trang SSG không dùng được nonce). SPEC 16.2 yêu cầu không unsafe-inline | Trung bình | Tech Lead | Trước go-live, xử lý ở proxy (hash) |
| OI-W-03 | Rate limit đếm trong bộ nhớ: đúng với 1 instance API; chạy >1 instance cần Redis storage | Thấp | DevOps | Khi scale |
| OI-W-04 | Chưa có audit_logs cho lead từ website (bảng lead đã lưu IP, thời điểm đồng ý) | Thấp | G2 | G2 |
| OI-W-05 | `prisma migrate diff` trong CI để non-blocking vì partial index/CHECK khai báo bằng SQL; chưa kiểm được trong sandbox (mạng chặn engine Prisma) | Thấp | Tech Lead | Lần chạy CI đầu |
| OI-W-06 | Logo chính thức COMTECH (SVG) chưa có; đang dùng wordmark chữ `[CONTENT REQUIRED]` | Trung bình | COMTECH | Trước go-live |
| OI-W-07 | Ảnh hiện trường thật cho hero, case study `[CONTENT REQUIRED]`; hiện dùng minh họa vector | Trung bình | COMTECH | Trước go-live |
| OI-W-08 | Tỉnh/thành trên form là văn bản tự do; cần danh mục địa giới 2 cấp `[DATA SOURCE REQUIRED]` | Thấp | Dev + COMTECH | Phase sau |
| OI-W-09 | Đính kèm file trên form lead (SPEC 34.3) chưa làm: cần storage + quét virus | Thấp | Phase File | Phase sau |
| OI-W-10 | Hộp thư nhận lead `LEAD_NOTIFY_TO` và SMTP (M365/Google/khác) `[COMTECH INPUT REQUIRED]` | Chặn go-live form | COMTECH | Trước go-live |
| OI-W-11 | Cloudflare Turnstile: cần tài khoản + site key/secret (API từ chối khởi động ở production nếu thiếu) | Chặn go-live | COMTECH/DevOps | Trước go-live |
| OI-W-12 | Hạ tầng, tên miền, DNS cho www/api `[COMTECH INPUT REQUIRED]` | Chặn go-live | COMTECH | Trước go-live |
| OI-W-13 | Danh sách URL website cũ để redirect 301 | Trung bình | COMTECH | Trước go-live |
| OI-W-14 | Trang tiếng Anh `/en` chưa có (cần người phụ trách bản dịch) | Thấp | COMTECH | Phase sau |
| OI-W-15 | Các trang con Năng lực (`/nang-luc/doi-ngu`, `/chat-luong-an-toan`, `/ho-so-nang-luc`), `/ve-comtech/to-chuc`, `/dieu-khoan-su-dung` chưa có nội dung `[CONTENT REQUIRED]` | Thấp | COMTECH | Phase sau |

Các mục thông tin công ty còn thiếu hoặc xung đột (địa chỉ, MST, số liệu 9.674 trạm) nằm trong `docs/content-verification.md` và `docs/g0/03-thong-tin-can-comtech.md` (nhóm C).
