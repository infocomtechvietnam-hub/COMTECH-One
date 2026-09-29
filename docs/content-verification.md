# Báo cáo kiểm tra nội dung website

Sinh tự động bằng `pnpm --filter @comtech/content report:md` ngày 23/09/2026. Cột **Production** cho biết mục đó có xuất hiện trên website thật hay không. Muốn một mục lên production: Product Owner duyệt câu chữ rồi thêm id vào `packages/content/src/approvals.ts` (mục còn nhãn phải đóng nhãn trước).

| # | id | Loại | Nội dung | Production | Lý do chặn / ghi chú |
|---|---|---|---|---|---|
| 1 | `setting.company-legal-name` | setting | company.legal_name | Hiển thị |  |
| 2 | `setting.company-short-name` | setting | company.short_name | Hiển thị |  |
| 3 | `setting.company-brand` | setting | company.brand | Hiển thị |  |
| 4 | `setting.company-founded-date` | setting | company.founded_date | Hiển thị |  |
| 5 | `setting.company-founded-place` | setting | company.founded_place | Hiển thị |  |
| 6 | `setting.company-website` | setting | company.website | Hiển thị |  |
| 7 | `setting.company-hotline` | setting | company.hotline | Hiển thị |  |
| 8 | `setting.company-phone` | setting | company.phone | Hiển thị |  |
| 9 | `setting.company-email` | setting | company.email | Hiển thị |  |
| 10 | `setting.company-slogan` | setting | company.slogan | Hiển thị |  |
| 11 | `setting.company-hq-address` | setting | company.hq_address | Chặn | status=IN_REVIEW; verification_status=CONFLICT; nhãn mở: [DATA CONFLICT - VERIFY BEFORE PUBLICATION]; Tên phường/địa chỉ khác nhau giữa các phần profile; cần cập nhật theo đơn vị hành chính 2 cấp từ 01/07/2025 (G0.3 C2) |
| 12 | `setting.company-tax-code` | setting | company.tax_code | Chặn | status=IN_REVIEW; verification_status=MISSING; nhãn mở: [COMTECH INPUT REQUIRED]; Chưa có trong nguồn (G0.3 C3) |
| 13 | `setting.stats-sites-and-services` | setting | stats.sites_and_services | Chặn | status=IN_REVIEW; verification_status=CONFLICT; nhãn mở: [DATA CONFLICT - VERIFY BEFORE PUBLICATION]; Profile ghi 9.674 cho giai đoạn 2013-2025; biểu đồ thống kê dùng phạm vi năm khác (G0.3 C1). Chưa xác minh thì ẩn cả ô. |
| 14 | `setting.stats-provinces-served` | setting | stats.provinces_served | Chặn | status=IN_REVIEW; verification_status=MISSING; nhãn mở: [DATA SOURCE REQUIRED]; Chưa có nguồn số tỉnh đã phục vụ |
| 15 | `setting.workspace-url` | setting | workspace.url | Chặn | status=IN_REVIEW; verification_status=MISSING; nhãn mở: [COMTECH INPUT REQUIRED]; Workspace (app.comtechvietnam.vn) chưa triển khai; ẩn nút Đăng nhập |
| 16 | `capability.t` | capability | Viễn thông | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 17 | `capability.e` | capability | Năng lượng | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 18 | `capability.m` | capability | Cơ điện (M&E) | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 19 | `capability.c2` | capability | Phòng cháy chữa cháy | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 20 | `capability.c` | capability | Camera an ninh | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 21 | `capability.o` | capability | Hạ tầng CNTT văn phòng | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 22 | `capability.h` | capability | Smart Home | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 23 | `solution.ha-tang-vien-thong` | solution | Hạ tầng viễn thông | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 24 | `solution.tram-bts-mang-di-dong` | solution | Trạm BTS và mạng di động 2G-5G | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 25 | `solution.cap-quang-truyen-dan` | solution | Cáp quang và truyền dẫn | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 26 | `solution.c-ran-remote-sector` | solution | C-RAN và Remote Sector | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 27 | `solution.he-thong-nguon-48vdc` | solution | Hệ thống nguồn 48VDC, tủ nguồn và acquy | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 28 | `solution.nang-luong-tai-tao` | solution | Năng lượng tái tạo | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 29 | `solution.co-dien-cong-trinh` | solution | Cơ điện công trình | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 30 | `solution.phong-chay-chua-chay` | solution | Phòng cháy chữa cháy và truyền tin báo cháy | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 31 | `solution.camera-giam-sat` | solution | Camera an ninh và giám sát | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 32 | `solution.ha-tang-cntt-van-phong` | solution | Hạ tầng CNTT văn phòng | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 33 | `solution.data-center-phong-may` | solution | Data Center và phòng máy | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 34 | `solution.nha-thong-minh` | solution | Nhà thông minh | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 35 | `solution.smart-building-city` | solution | Smart Building và Smart City | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 36 | `service.khao-sat` | service | Khảo sát | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 37 | `service.thiet-ke` | service | Thiết kế | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 38 | `service.thi-cong` | service | Thi công xây lắp | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 39 | `service.lap-dat` | service | Lắp đặt | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 40 | `service.tich-hop` | service | Tích hợp | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 41 | `service.do-kiem` | service | Đo kiểm | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 42 | `service.commissioning` | service | Commissioning | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 43 | `service.toi-uu` | service | Tối ưu | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 44 | `service.bao-duong` | service | Bảo dưỡng | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 45 | `service.swap-di-doi` | service | Swap, di dời, tháo dỡ | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 46 | `service.ung-cuu-thong-tin` | service | Ứng cứu thông tin | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 47 | `service.ho-tro-ky-thuat` | service | Hỗ trợ kỹ thuật | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 48 | `case.mau-nang-cap-5g` | case-study | [Mẫu] Nâng cấp thiết bị 5G cho cụm trạm đô thị | Chặn | status=IN_REVIEW; verification_status=PENDING; data_origin=DEMO |
| 49 | `case.mau-bao-duong-nguon` | case-study | [Mẫu] Bảo dưỡng hệ thống nguồn DC theo lịch | Chặn | status=IN_REVIEW; verification_status=PENDING; data_origin=DEMO |
| 50 | `news.mau-kiem-tra-acquy` | news | [Mẫu] Góc kỹ thuật: các bước kiểm tra acquy trạm viễn thông | Chặn | status=IN_REVIEW; verification_status=PENDING; data_origin=DEMO |
| 51 | `news.mau-tin-cong-ty` | news | [Mẫu] Tin công ty | Chặn | status=IN_REVIEW; verification_status=PENDING; data_origin=DEMO |
| 52 | `client.vnpt` | client | VinaPhone / VNPT | Hiển thị |  |
| 53 | `client.mobifone` | client | MobiFone | Hiển thị |  |
| 54 | `client.viettel` | client | Viettel | Hiển thị |  |
| 55 | `client.vietnamobile` | client | Vietnamobile | Hiển thị |  |
| 56 | `client.vishipel` | client | Vishipel | Hiển thị |  |
| 57 | `client.logos` | client-logos | Logo khách hàng | Chặn | status=IN_REVIEW; verification_status=PENDING; nhãn mở: [VERIFY BEFORE PUBLICATION]; Cần văn bản cho phép dùng logo (G0.3 C5) |
| 58 | `vendor.huawei` | equipment | Huawei | Hiển thị |  |
| 59 | `vendor.ericsson` | equipment | Ericsson | Hiển thị |  |
| 60 | `vendor.nokia` | equipment | Nokia | Hiển thị |  |
| 61 | `vendor.zte` | equipment | ZTE | Hiển thị |  |
| 62 | `page.privacy-policy` | page | Chính sách xử lý dữ liệu cá nhân | Chặn | status=IN_REVIEW; verification_status=PENDING; nhãn mở: [LEGAL REVIEW REQUIRED], [COMTECH INPUT REQUIRED]; Bản nháp kỹ thuật theo SPEC 17; cần luật sư duyệt, điền thời hạn lưu và địa chỉ trụ sở |
| 63 | `page.about-intro` | page | Giới thiệu (Về COMTECH) | Chặn | status=IN_REVIEW; verification_status=PENDING |
| 64 | `page.why-comtech` | page | Vì sao chọn COMTECH | Chặn | status=IN_REVIEW; verification_status=PENDING |
