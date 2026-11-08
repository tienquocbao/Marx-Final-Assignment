# VÙNG CỒN XANH – FINAL INFOGRAPHIC v8

**Group 2 · MLN122 · Kinh tế chính trị Mác–Lênin**

Infographic học thuật tương tác về **vai trò của Nhà nước trong điều tiết quan hệ lợi ích giữa nông dân, hợp tác xã và doanh nghiệp trong nông nghiệp công nghệ cao tại ĐBSCL**.

## Chạy nhanh

1. Giải nén ZIP ra một thư mục, không mở trực tiếp HTML ở bên trong file ZIP.
2. Mở `index.html` bằng Google Chrome hoặc Microsoft Edge.
3. Cuộn xem **một poster infographic xanh lá liền mạch** gồm sáu chủ đề. Bấm vào thẻ hoặc mốc nội dung để mở giải thích chi tiết; nút `Trở lại infographic` đưa bạn về vị trí cũ.
4. Thử vùng 03 với nút `Ngừng hợp tác / Khôi phục liên kết`. Thanh trên có `Nguồn`, `Chuyển động` và `Nhạc` (nhạc không tự phát trước thao tác người dùng).

Trang hoạt động offline, không phụ thuộc CDN. Nếu một trình duyệt hạn chế tài nguyên `file://`, chạy `python -m http.server 8000` trong thư mục rồi mở `http://localhost:8000/`.

## Sáu phần trong infographic

1. ĐBSCL và bối cảnh ứng dụng công nghệ cao.
2. Ba chủ thể và chuỗi giá trị.
3. Lợi ích thống nhất và mâu thuẫn.
4. Bốn vai trò điều tiết của Nhà nước.
5. Ba trụ cột giải pháp và chỉ tiêu đánh giá.
6. Kết luận: hợp tác minh bạch và phát triển bền vững.

Mạch hình ảnh chạy xuyên suốt các phần; các bậc thang trình bày có chiều cao tự nhiên theo nội dung, **không phải sáu slide cố định**.

## Có gì mới ở v8?

**Sửa lỗi quan trọng:** trục xanh/cam từ v7 chạy qua chữ số đầu mục đã được chuyển hoàn toàn sang một lane riêng ở lề trái. Chỉ có các nhánh ngắn chỉ đến số 01–06 và đều dừng trước vòng số. Có sáu chấm tiến trình trực quan và viền số đủ tương phản.

**Polish:** sơ đồ xuất hiện theo thứ tự ngắn, các đường liên hệ mâu thuẫn → vai trò → giải pháp rõ hơn; cải thiện khoảng cách, bóng nhẹ và trạng thái hover/focus mà không biến nó thành giao diện slide/game.

**An toàn chuyển động:** hỗ trợ người dùng tắt animation qua nút `Chuyển động`, đồng thời tôn trọng `prefers-reduced-motion`.

## Cấu trúc

```text
Vung_Con_Xanh_Infographic_Final_v8/
├── index.html
├── styles/
│   ├── base.css
│   ├── poster.css
│   ├── detail.css
│   ├── infographic-v7.css
│   └── final-polish-v8.css
├── scripts/app.js
├── data/content.js
├── assets/
│   ├── vector/
│   ├── reference/
│   └── audio/
├── docs/
│   ├── SOURCE_MAPPING.md
│   ├── RELEASE_NOTES_V8.md
│   └── FINAL_QA_V8.md
├── screenshots/
└── tests/
    ├── qa_final_v8.py
    └── qa_extra_v8.py
```

## Tài liệu kiểm thử

- `docs/FINAL_QA_V8.md`: viewport, khoảng cách an toàn, kiểm thử tương tác và giới hạn.
- `docs/SOURCE_MAPPING.md`: đối chiếu khung nội dung với nguồn nhóm.
- `screenshots/final_master_1920x7583.png`: ảnh thực tế poster tổng được xuất từ Chromium.
- `screenshots/so_sanh_duong_v7_v8.jpg`: so sánh trước và sau khi sửa lỗi đường đè lên badge.

**Lưu ý về số liệu:** những con số minh họa được giữ theo slide nhóm. Phải chú thích phạm vi và nguồn khi sử dụng, không mặc định áp dụng cho toàn bộ ĐBSCL. Chưa kiểm tra trên máy chiếu vật lý của nhóm.
