# Kiểm thử — Poster Infographic v6

Kiểm thử bằng Playwright + Chromium trên một bản dựng từ **chính tệp HTML/CSS/JS/SVG đã đóng gói**, với URL tài nguyên được phục vụ qua mock router nội bộ (không truy cập Internet). Mã nguồn kiểm thử: `tests/smoke.py`.

| Kiểm thử | Kết quả |
|---|---|
| Poster đúng 1920 × 6480 ở viewport 1920 | PASS |
| 6 vùng có đủ chiều cao, không tràn/cắt nội dung ở desktop | PASS |
| Mở và đóng chi tiết cả 6 vùng | PASS |
| Đổi tab chi tiết, mở bảng nguồn | PASS |
| Quay lại đúng vị trí cuộn | PASS |
| Nút mô phỏng đứt/nối liên kết | PASS |
| Chế độ tắt chuyển động, phím Escape | PASS |
| Viewport desktop 1920×1080 | PASS |
| Viewport máy chiếu 1280×720 | PASS |
| Viewport điện thoại 390×844 không tràn ngang | PASS |
| Không có lỗi JS và không thiếu asset trong lượt thử | PASS |

**Giới hạn:** Chưa kiểm thử trên laptop/máy chiếu vật lý của nhóm, chưa kiểm thử bằng người xem chưa biết nội dung, chưa xác minh độc lập số liệu báo chí trên slide. Giao diện thiết kế để chạy offline, nhưng cũng nên thử bằng `index.html` trên Chrome/Edge của nhóm trước buổi trình chiếu.
