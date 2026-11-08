# V7 – Quyết định thiết kế để loại bỏ cảm giác trình chiếu

## 1. Nguyên nhân v6 còn giống slide

V6 ép sáu khu vực có chiều cao chính xác 1080px; mỗi khu còn có đường phân cách dưới và footnote 01/06. Vì thế khi cuộn, người đọc vẫn thấy sáu tấm bảng có kích thước gần như bằng nhau. Dù nội dung đã có sơ đồ và nút tương tác, quan hệ hình thức giữa các khu chưa mạnh.

## 2. Những thay đổi có thể kiểm tra trong source

1. `styles/infographic-v7.css`: bỏ chiều cao cố định và viền ngăn, đặt nền giấy thống nhất, giảm hiệu ứng thẻ slide, tạo biên đọc rộng theo tỷ lệ poster.
2. `index.html`: thêm tuyến SVG `#narrativeRoute`, năm nhịp chuyển `concept-bridge`, một sơ đồ liên kết chéo bốn dòng `logic-crosswalk` và một `poster-legend` dùng cho toàn trang.
3. `scripts/app.js`: tính đường route theo vị trí thực tế của sáu số đầu mục; tự cập nhật khi resize và đổi font. Bổ sung nút cuối trang trở lên và làm nổi vùng được mở chi tiết.
4. `styles/infographic-v7.css`: giảm độ tối của nền khi mở kiến thức sâu; giữ bối cảnh poster bên dưới thay vì chuyển hẳn sang slide khác.

## 3. Mạch lập luận đã liên kết

- Bối cảnh tạo ra giá trị → Ba chủ thể tham gia sản xuất và chia sẻ giá trị.
- Lợi ích thống nhất nhưng mục tiêu khác → mâu thuẫn giá, phí, chất lượng, môi trường.
- Mâu thuẫn cần quy tắc và cơ chế xử lý → bốn vai trò Nhà nước.
- Vai trò Nhà nước phải đi vào thực thi → ba trụ cột giải pháp cụ thể.
- Giải pháp cần được đánh giá bằng dữ liệu → kết luận về phát triển bền vững.

### Sơ đồ đối chiếu ba lớp

| Mâu thuẫn | Cơ chế Nhà nước | Nhóm giải pháp |
|---|---|---|
| Giá mua & thanh toán | Bảo vệ lợi ích hợp pháp | Hợp đồng và thông tin minh bạch |
| Phí, dịch vụ HTX | Điều hòa lợi ích | Nâng năng lực liên kết |
| Chất lượng và môi trường | Kiểm soát tác động tiêu cực | Giám sát và chia sẻ rủi ro |
| Bất đồng tiêu chuẩn | Giải quyết mâu thuẫn | Đối thoại, thủ tục có chứng cứ |

Đây là sơ đồ **vận dụng minh họa**, không phải khẳng định mỗi công cụ tự động chữa được vấn đề tương ứng.

## 4. Kích thước và khả năng trình chiếu

- Desktop tại viewport 1920px: master poster 1920×7582px, các vùng cao tự nhiên 1170 / 1082 / 1142 / 1450 / 989 / 948px, chưa tính năm nhịp chuyển.
- Máy chiếu viewport 1280px: cao khoảng 7366px, không có cuộn ngang.
- Điện thoại 390px: cao khoảng 9292px, nút và thẻ tự xếp để đọc được.
- Thay đổi chiều cao trên các môi trường là **có chủ ý**: infographic là tài liệu dạng dọc, không phải ảnh/slide được ép cùng tỷ lệ.

## 5. Những điều không thay đổi

- Sáu chủ đề Group 2 và nội dung kiến thức MLN122.
- Thông tin nguồn và giới hạn của số liệu trong `data/content.js`.
- Các SVG được vẽ sẵn, toàn bộ tài liệu tham khảo, âm thanh nền.
- Các chức năng bấm xem sâu, mô phỏng đứt/nối, quay lại vị trí và trợ năng giảm chuyển động.
