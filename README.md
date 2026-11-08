# VÙNG CỒN XANH — WEBSITE 3 TRONG 1

Bản tích hợp ba sản phẩm **nguyên bản** của nhóm trên một website, với ba tab chuyển cảnh mượt:

1. **Infographic** — `experiences/infographic/index.html`
2. **Web game** — `experiences/game/index.html`
3. **Video** — `assets/video/nha-nuoc-nong-nghiep-cnc.mp4`

**Không sửa nội dung học thuật, cốt truyện, hình ảnh, nhạc, kịch bản, mã nguồn game hoặc infographic.** Hai dự án gốc được tách riêng và giữ nguyên từng byte, chỉ thêm một `index.html` ở root, `styles/portal.css`, `scripts/portal.js` và ảnh poster video ở root. Video MP4 cũng được chép nguyên byte, chỉ đặt tên file ASCII để dễ deploy.

**Ngoại lệ kỹ thuật:** bỏ `.git/` nằm bên trong ZIP game. Thư mục này là lịch sử Git, không phải nội dung website; khi push vào repository Git hiện có thì phải dùng `.git` của repository đó. Các file game khác, gồm tài liệu/ảnh tham khảo/screenshot, được giữ lại.

## Cách sử dụng

Tải và giải nén ZIP, sau đó mở `index.html` bằng Chrome/Edge. Không được chỉ lấy riêng file `index.html` vì website cần ba thư mục `experiences/`, `assets/`, `scripts/`, `styles/`.

- **Infographic:** xem poster và các tương tác, theo đúng bản gốc.
- **Web game:** bắt đầu hành trình và chơi bình thường, theo đúng bản gốc.
- **Video:** phát / tạm dừng / tua bằng trình phát video của trình duyệt.
- **Chuyển tab:** thanh trên cùng. Nhớ trang đang xem bằng URL `#infographic`, `#game` hoặc `#video`.
- **Mở riêng:** biểu tượng mở trong tab mới ở góc phải, hữu ích khi muốn dùng toàn bộ màn hình cho sản phẩm gốc.
- **Toàn màn hình:** biểu tượng khung mở rộng ở góc phải.

Khi đổi tab, website **không hủy iframe đã tải**, nhằm giữ lại trạng thái đang xem hoặc đang chơi; video được tạm dừng khi chuyển sang tab khác. Âm thanh của các phần nhúng được tắt khi ẩn và khôi phục khi quay lại, trên các trình duyệt cho phép truy cập iframe cùng origin. Với trình duyệt áp chính sách riêng cho `file://`, bạn có thể mở bằng localhost (xem dưới đây).

## Chạy bằng web server tĩnh (nếu trình duyệt hạn chế file://)

Trong thư mục chứa `index.html`:

```powershell
python -m http.server 8000
```

Truy cập `http://localhost:8000`. Không cần backend hoặc cài thư viện JavaScript.

## Triển khai lên GitHub Pages

Giữ nguyên `.git` hiện tại của repo GitHub. Có thể chạy file PowerShell `COPY_TO_EXISTING_GIT_REPO.ps1` (chỉ sao chép, **không xóa hay tự push**) hoặc chép thủ công toàn bộ nội dung thư mục này vào:

`C:\Users\tienq\Vung_Con_Xanh_Repo`

Sau khi kiểm tra bằng trình duyệt:

```powershell
cd C:\Users\tienq\Vung_Con_Xanh_Repo
git status
git add -A
git commit -m "Integrate infographic, web game and video into one website"
git push origin main
```

Nếu nhánh hiện tại không phải `main`, thay `main` bằng tên nhánh thực tế từ `git branch --show-current`. Bật **Settings → Pages → Deploy from a branch → main / (root)** trên GitHub. GitHub Pages có giới hạn dung lượng/băng thông, nên kiểm tra tình trạng triển khai sau khi push.

**Lưu ý khi chép đè vào repo cũ:** Script không tự xóa các file cũ ở root, vì xóa hàng loạt có thể làm mất dữ liệu đã commit của bạn. Các file cũ dư thừa không cản trang chủ mới hoạt động nhưng khiến repository nặng hơn. Nếu muốn dọn, hãy tạo commit backup trước rồi kiểm tra từng file cần xóa.

## Cấu trúc

```text
Vung_Con_Xanh_3in1_GitHub_Pages/
├── index.html                       # Cổng điều hướng mới
├── styles/portal.css                # CSS cổng mới
├── scripts/portal.js                # Logic tabs, giữ trạng thái, âm thanh
├── assets/
│   ├── site-logo.svg                # Logo mới cho cổng chung
│   └── video/
│       ├── poster.jpg               # Ảnh chụp từ video gốc
│       └── nha-nuoc-nong-nghiep-cnc.mp4
├── experiences/
│   ├── infographic/                 # Nguyên file từ ZIP infographic
│   └── game/                        # Nguyên file từ ZIP game (trừ .git/)
├── docs/
│   └── CONTENT_INTEGRITY.json       # SHA-256 các file gốc + đầu vào
├── tests/
│   └── qa_threeinone.py
└── .nojekyll                        # GitHub Pages phục vụ asset không qua Jekyll
```

## Bảo toàn nội dung

Mọi file trong `experiences/game/`, `experiences/infographic/` và file MP4 đều khớp SHA-256 đầu vào, có thể kiểm tra bằng `docs/CONTENT_INTEGRITY.json`. Việc thêm tab không cần sửa bất kỳ file gốc nào.
