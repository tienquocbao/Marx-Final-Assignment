# Nhật ký sửa lỗi repo Vùng Cồn Xanh — 2026-11-04

## Hiện tượng
- Bấm nút có hiệu ứng nhấn, không chuyển màn hay có tiến triển.

## Nguyên nhân
- Tác vụ tách âm thanh/asset đã vô tình xoá đoạn định nghĩa JavaScript cốt lõi (`$`, `SCENES`, `STORY`, `initialState`, `load`, `save`...), làm chương trình không khởi tạo đầy đủ.
- Bộ asset còn trộn một số hình base64 trong HTML/CSS và chứa nền cũ mờ.

## Sửa chữa
- Khôi phục phần game logic từ mã một-file trước đó.
- Phân tách CSS và JavaScript thành file độc lập.
- Nối lại asset đường dẫn tương đối và thay năm cảnh bằng SVG nét sắc.
- Chuyển các ảnh còn nhúng thành tệp riêng và giữ lại reference trong repo.
- Kiểm tra cú pháp bằng `node --check` và kiểm tra luồng bằng Playwright/Chromium.

## Kết quả xác minh
- Nút bắt đầu dẫn đến màn story, tiếp tục đổi thoại.
- Điều tra 3 nơi, giải 3 mini-game, mời họp, đàm phán, biến cố, kết thúc A: thành công.
- Nhật ký TXT xuất được; giao diện mobile không tràn ngang.
- Không có lỗi JavaScript hoặc asset thất bại trong luồng kiểm thử sau cùng.

## Lưu ý
- Khả năng lưu/tiếp tục trên hệ thống file:// và mọi biến thể trình duyệt cần kiểm tra thêm tại thiết bị đích.
- Hình gốc đã bị cắt cạnh không thể sửa hoàn toàn chỉ bằng CSS.
