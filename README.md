# VÙNG CỒN XANH — Repository sửa lỗi tương tác

## Mở game

1. Giải nén toàn bộ ZIP (không mở `index.html` trực tiếp ngay trong giao diện của file ZIP).
2. Vào thư mục `Vung_Con_Xanh_Repo_Day_Du_Avatar_Fixed`.
3. Nhấp đúp `index.html` để mở bằng Google Chrome hoặc Microsoft Edge.
4. Chọn **Bắt đầu hành trình**, rồi **Tiếp tục** để xem diễn biến.

Game không cần Internet. Khi bấm **Bắt đầu hành trình**, trình duyệt mới cho phép phát nhạc nền; có nút **Nhạc** và **Hiệu ứng** để bật/tắt.

Nếu trình duyệt có chính sách chặn tài nguyên từ `file://`, hãy chạy một web server tĩnh tại thư mục repo, ví dụ: `python -m http.server 8000` rồi mở `http://localhost:8000/`. Không cần backend hoặc dịch vụ ngoài.

## Cấu trúc

```text
Vung_Con_Xanh_Repo_Day_Du_Avatar_Fixed/
├── index.html                  # HTML giao diện, không chứa ảnh hoặc mã JS nhúng
├── styles/game.css             # CSS
├── scripts/game.js             # Logic đầy đủ: câu chuyện, điều tra, mini-game, đàm phán
├── assets/
│   ├── scene/                  # 5 cảnh SVG nét sắc, không có chữ mờ dính vào hình
│   ├── portrait/               # 40 avatar và biểu cảm tách riêng
│   ├── sprites/                # 4 frame di chuyển Minh An
│   ├── ui/                     # Hình nhóm nhân vật ở màn đầu
│   ├── audio/music/            # 2 nhạc nền OGG
│   ├── audio/sfx/              # 7 hiệu ứng OGG
│   └── reference/              # Các hình reference/moodboard cũ
├── docs/                       # Kịch bản, báo cáo và changelog
└── screenshots/                # Preview và ảnh kiểm thử
```

## Lỗi đã sửa (2026-11-04)

Khi tách bản một-file thành repo, đoạn JavaScript chứa định nghĩa `$`, `SCENES`, `STORY`, `initialState`... đã bị cắt nhầm. Điều này khiến nút vẫn có hiệu ứng nhấn nhưng hành động không thực hiện được.

- Khôi phục toàn bộ logic gốc từ bản HTML chạy được.
- Bóc tách mã thành `scripts/game.js`, CSS thành `styles/game.css`.
- Chuyển toàn bộ hình, nhạc và hiệu ứng khỏi inline base64 sang thư mục `assets`.
- Thay nền phòng họp và các cảnh cũ bị mờ bằng bối cảnh SVG mới.
- Kiểm tra liên kết asset, cú pháp JS và hành trình game trên Chromium.

**Lưu ý:** Các portrait cũ có một số đường viền/cạnh mặt đã bị cắt ngay từ bộ hình tham chiếu. Bản này tránh cắt thêm bằng CSS, nhưng không khôi phục lại các phần hình vốn thiếu trong ảnh gốc.

## Kiểm thử

- Bắt đầu → câu chuyện → bản đồ: đạt.
- Ba khu điều tra, ba mini-game và chín chứng cứ: đạt.
- Ghép nguyên nhân, mời họp, chọn điều khoản, công cụ Nhà nước, cảnh báo độ mặn: đạt.
- Kết thúc A và xuất nhật ký TXT: đạt.
- Màn hình di động 390px: không tràn ngang, mở đầu và bản đồ hoạt động.
- Tệp SVG, hình ảnh, nhạc và hiệu ứng: đường dẫn hợp lệ, không thiếu file trong repo.

Kiểm thử chạy trên Chromium tự động với asset được phục vụ từ bản sao nội bộ; chưa thay thế cho việc kiểm tra trực tiếp trên laptop thuyết trình của người dùng.

## Bản sửa avatar gần nhất

Đọc `docs/AVATAR_AUDIT.md` và mở `docs/AVATAR_40_KIEM_TRA.png` để xem toàn bộ 40 avatar sau chỉnh sửa; ảnh cũ giữ trong `assets/reference/avatar_legacy/` (không dùng trong game).


## Kiểm tra đóng gói mới

ZIP trước chỉ 1,45 MB là file bị hỏng/truncated. Gói này được tạo mới từ toàn bộ repository và được kiểm tra CRC, giải nén cùng so sánh SHA-256 từng tệp.

Lưu ý: không thể chạy thử trên Chromium trong môi trường đóng gói do hạn chế truy cập `file://` và localhost của trình duyệt kiểm thử. Các asset và cú pháp JS đã được kiểm tra.
