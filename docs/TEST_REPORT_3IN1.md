# Báo cáo kiểm tra website tích hợp 3 trong 1

## Phạm vi tích hợp

- Infographic: giữ nguyên toàn bộ tệp trong ZIP được người dùng gửi, đặt dưới `experiences/infographic/`.
- Web game: giữ nguyên toàn bộ tệp nội dung trong ZIP được gửi, đặt dưới `experiences/game/`; **không chép `.git/` của ZIP vào thư mục con**.
- Video: sao chép byte-for-byte tệp MP4; đổi tên file đường dẫn cho an toàn trên GitHub Pages, không chỉnh nội dung hay mã hóa lại.
- Thêm `index.html`, `styles/portal.css`, `scripts/portal.js`, logo và ảnh poster chụp từ video, tài liệu và các bài kiểm thử. Không chỉnh code của hai web gốc.

## Kết quả

| Kiểm tra | Kết quả | Giới hạn |
|---|---|---|
| Tệp nguồn toàn vẹn SHA-256 | PASS (361 file) | Không tính `.git` nằm trong ZIP game |
| Tải tab infographic | PASS | Chạy QA bằng iframe `srcdoc` từ file gốc, không mở trực tiếp URL do chính sách sandbox |
| Bấm tab game và bắt đầu Chương 1 | PASS | QA nạp JS/CSS nguyên bản vào khung thử trong bộ nhớ |
| Chuyển game → video → game không mất trang Chương 1 | PASS | Trạng thái trong iframe được giữ |
| Âm thanh game không phát chồng khi chuyển tab | PASS | Chỉ kiểm tra `audio` DOM trên cùng origin; nếu file:// phân quyền theo origin, khả năng tắt âm có thể khác |
| Trang video hiển thị controls và đúng URL MP4 | PASS | Chưa kiểm tra phát video bằng trình duyệt thực tế; file MP4 đã được FFmpeg giải mã khung hình thành công |
| Bố cục desktop 1920×1080 | PASS | Không tràn ngang trong lớp điều hướng |
| Bố cục máy chiếu 1280×720 | PASS | Không tràn ngang trong lớp điều hướng |
| Bố cục mobile 390×844 | PASS | Không tràn ngang trong lớp điều hướng |
| JavaScript exception của cổng điều hướng | PASS | Không phát hiện trong QA giả lập |
| Node.js syntax check portal JS | PASS | Kiểm tra cú pháp |

**Giới hạn quan trọng:** Chromium của môi trường này chặn `file://`, localhost và điều hướng HTTPS thử nghiệm. Vì vậy, không thể xác nhận trực tiếp luồng mạng HTTP/Range và các tài nguyên động bên trong iframes trên phiên bản đã triển khai thật. Kiểm thử GUI được thực hiện bằng bản dựng tạm nạp nguyên JS/CSS của từng app trong iframe `srcdoc`, giúp xác minh điều hướng và chuyển trạng thái nhưng không kiểm chứng mọi hình nền động. Kiểm tra trên GitHub Pages thực tế vẫn cần làm sau khi push.

## Bàn giao

- ZIP chứa đủ các dự án và video cùng cổng điều hướng mới.
- Trước khi push: giải nén, mở trang qua `python -m http.server 8000`, kiểm tra lại cả ba tab.
- Sau push: xác nhận GitHub Pages mở được, video play/seek và âm thanh không phát chồng.
