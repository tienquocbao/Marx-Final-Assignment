# Kết quả kiểm thử — Vùng Cồn Xanh Infographic v7

Kiểm thử bằng Playwright/Chromium với URL dữ liệu được phục vụ qua mock router, dùng **chính file HTML, CSS, JS và asset của repo**. Không dùng Internet.

| Hạng mục | Kết quả |
|---|---|
| Infographic liền mạch, không còn 6 section bằng nhau | PASS |
| 1920×1080: poster 1920×7582, mọi vùng tự co giãn, không cắt nội dung | PASS |
| 1280×720: poster 1280×7366, không tràn ngang | PASS |
| 390×844: poster responsive, không tràn ngang | PASS |
| 5 đoạn chuyển ý giữa sáu chủ đề | PASS |
| Trục SVG nối từ số 01 tới 06 theo tọa độ thực | PASS |
| Sơ đồ 4 dòng mâu thuẫn → Nhà nước → giải pháp, link click được | PASS |
| Mở/đóng chi tiết cả sáu chủ đề, đổi tab, quay về vị trí cuộn | PASS |
| Mô phỏng ngừng/khôi phục liên kết | PASS |
| Nút nguồn, tắt chuyển động, phím Escape | PASS |
| Không có lỗi JavaScript hoặc yêu cầu asset thiếu trong lượt thử | PASS |

**Giới hạn:** chưa có kiểm thử người chơi không biết trước chủ đề, chưa xác minh trên màn hình máy chiếu vật lý, chưa xác minh độc lập các nguồn thống kê trong slide nhóm. Việc kiểm thử dùng trình duyệt headless; cần chạy demo trên máy thuyết trình thật trước khi nộp.

Chạy lại: `python tests/regression_v7.py`.
