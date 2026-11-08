# FINAL QA – Vùng Cồn Xanh Infographic v8

**Thời điểm thực hiện:** 08/11/2026.  
**Nguồn xuất phát:** v7 repository do nhóm cung cấp trong cuộc hội thoại.  
**Phương pháp:** Chromium headless, Playwright; asset routing đọc trực tiếp các file HTML/CSS/JS/SVG trong repo (không dùng Internet).

## 1. Lỗi đã xử lý

- **Lỗi v7:** trục dọc đi thẳng qua tâm vòng số 01–06, khiến nét đường và dấu gạch xuất hiện phía trên chữ số.
- **Thay đổi v8:** trục được đặt trong **lề bảo vệ** riêng, các nhánh kết nối dừng trước vòng số ít nhất 12 px. Đường nằm dưới lớp typography. Mỗi nhánh có mốc riêng để biểu thị tiến trình đọc.
- Tính toán đường theo tọa độ thực của sáu mốc, nên không phụ thuộc chiều cao cố định mỗi khối.

## 2. Kiểm thử kích thước và hình học

| Kích thước viewport | Poster width | Poster height thực tế | Khoảng cách tối thiểu từ trục đến mép vòng số | Kiểm tra |
|---|---:|---:|---:|---|
| Desktop 1920×1080 | 1920 | 7583 | 51 px | PASS |
| Desktop 1600×900 | 1600 | 7588 | 51 px | PASS |
| Laptop 1366×768 | 1366 | 7264 | 27 px | PASS |
| Máy chiếu 1280×720 | 1280 | 7370 | 27 px | PASS |
| Laptop 1024×768 | 1024 | 7675 | 27 px | PASS |
| Điện thoại 390×844 | 390 | 9295 | đường trang trí được ẩn có chủ đích | PASS |

- Không có tràn ngang trong các viewport đã kiểm tra.
- Sáu khu vực vẫn có chiều cao theo nội dung; **không phải sáu slide 16:9 cố định**.
- Sáu nhánh desktop dừng bên ngoài badge số, không xuyên qua số hoặc chữ.

## 3. Kiểm thử chức năng

| Bài kiểm thử | Kết quả |
|---|---|
| Mở/đóng chi tiết: Chủ thể, Mâu thuẫn, Nhà nước, Giải pháp | PASS tại 1920×1080, 1280×720, 390×844 |
| Mở/đóng bảng nguồn | PASS |
| Bật/tắt chuyển động | PASS |
| Ngừng hợp tác / khôi phục hợp tác | PASS |
| Nhấn Esc đóng màn chi tiết | PASS |
| Không có lỗi JavaScript trong các luồng thử | PASS |
| Không thiếu file asset trong các luồng thử | PASS |
| Cú pháp JavaScript (node --check) | PASS |

## 4. Nội dung không tự ý thay đổi

- Sáu chủ đề và tư liệu MLN122 được giữ từ v7.
- Số liệu theo slide nhóm tiếp tục được gắn chú thích phạm vi như cũ. **Không phải số liệu được xác minh độc lập ngoài nguồn nhóm.**
- Các sơ đồ thể hiện cơ chế và hướng giải quyết, không phải bảo đảm kết quả chính sách.

## 5. Giới hạn còn lại

- Chưa kiểm tra bằng **máy chiếu vật lý** và chưa có đánh giá từ khán giả thật.
- Phần xuất PNG là screenshot tại 1920 px. Trong trình duyệt, trang giữ responsive theo viewport thực; chiều cao có thể khác giữa trình duyệt/font/mức zoom.
- Animation tắt khi `prefers-reduced-motion: reduce` hoặc khi bấm nút tắt chuyển động.
- Bản final của repo infographic độc lập; không thay thế web game cũ.

**Tư liệu:** `screenshots/final_master_1920x7583.png`, `screenshots/so_sanh_duong_v7_v8.jpg`, `screenshots/final_projector.png`, `screenshots/final_mobile.png`.
