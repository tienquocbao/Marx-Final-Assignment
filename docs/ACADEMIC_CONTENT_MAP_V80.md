# Bản đồ nội dung học thuật v8.0

## Căn cứ và giới hạn xác minh

Đã đối chiếu README, kế hoạch v7.1, thiết kế giai đoạn 7, kịch bản MC, hướng dẫn và các bài học trong source rời. **Không có PDF/slide/giáo trình MLN122 gốc trong repo**: việc xác minh trực tiếp thuật ngữ, nguyên văn và số trang là **BLOCKED**. Các số trang được tài liệu cũ dẫn lại không được v8 trình bày như nguồn đã kiểm chứng.

Nội dung mới là diễn giải sư phạm của tình huống hư cấu, cần giảng viên đối chiếu. Mọi Knowledge Panel, quiz review, dashboard và báo cáo TXT có thông báo nguồn/giới hạn. Không dùng mô hình này như dữ liệu thực tế, dự báo chính sách hay luật hiện hành. Không thêm c/v, tỷ suất giá trị thặng dư hoặc điểm “đúng chính trị” vào HUD.

## Khái niệm

1. Lợi ích kinh tế: xác định khoản thu, chi, đầu ra và rủi ro của mỗi chủ thể trong hoạt động kinh tế.
2. Quan hệ lợi ích kinh tế: lợi ích được thực hiện trong quan hệ giữa các chủ thể, điều kiện của bên này ảnh hưởng bên khác.
3. Sự thống nhất: cùng cần chuỗi sản xuất – dịch vụ – chế biến hoạt động.
4. Mâu thuẫn: giá, phí, chất lượng và trách nhiệm rủi ro không tự thống nhất dù cùng muốn hợp tác.
5. Cá nhân – tập thể – xã hội: thu nhập hộ, năng lực HTX và môi trường cộng đồng cần xét đồng thời; hài hòa không đồng nghĩa chia đều.
6. Nhân tố ảnh hưởng: thông tin, công nghệ, tổ chức và bối cảnh thị trường thay đổi điều kiện thực hiện lợi ích trong tình huống.
7. Vai trò Nhà nước: bảo vệ lợi ích hợp pháp/tạo điều kiện, điều hòa, kiểm soát tác động tiêu cực, hỗ trợ giải quyết mâu thuẫn; không ép ký hoặc hứa bù lỗ vô điều kiện.
8. Kinh tế thị trường định hướng XHCN: minh họa sự kết hợp cơ chế thị trường với điều tiết nhằm hài hòa lợi ích và quan tâm xã hội. Game không diễn giải đầy đủ toàn bộ đặc trưng của nền kinh tế.

## Chứng cứ → chủ thể → khái niệm → vận dụng

| Chứng cứ | Chủ thể liên quan | Nội dung | Quyết định/tình huống |
|---|---|---|---|
| Sổ đầu tư | Bảy, Sen | Lợi ích kinh tế; nhân tố công nghệ | Giá, hỗ trợ kỹ thuật và tiếp cận vốn có điều kiện |
| Trạm cảm biến | Cả ba, cộng đồng | Cá nhân/tập thể/xã hội; thông tin; phòng ngừa | Phân rủi ro, giám sát, cảnh báo độ mặn |
| Phiếu thu mua | Bảy, Khoa | Mâu thuẫn, quan hệ lợi ích, thị trường | Giá sàn/tham chiếu, phụ lục và kiểm định |
| Sổ phí HTX | Cả ba | Tập thể, chi phí dịch vụ, trách nhiệm | Công khai phí, dòng tiền, điều hòa và hòa giải |
| Bản dự thảo | Cả ba | Quan hệ lợi ích, khuôn khổ Nhà nước | Quyền đối chiếu/khiếu nại và giải quyết bất đồng |
| Mã truy xuất | Cả ba | Thống nhất, tổ chức tập thể, phối hợp dữ liệu | Dịch vụ chung và kiểm soát rủi ro |
| Đơn hàng | Khoa, Bảy, Sen | Lợi ích riêng và nhu cầu chung | Giá, tiến độ và phân rủi ro |
| Bảng tiêu chuẩn | Khoa, Bảy, Sen | Mâu thuẫn chất lượng và bảo vệ quyền hợp pháp | Kiểm định, lấy mẫu, xử lý lô không đạt |
| Lịch xe | Khoa, Sen, Bảy | Thống nhất, tổ chức và điều kiện thị trường | Điều chỉnh giao nhận, nhiệm vụ bến hàng |

Catalog máy đọc tại `scripts/learning-content.js`. Panel trình bày 5 mục: tình huống, khái niệm, chủ thể, quan hệ lợi ích, ghi nhớ. Phần ghi nhớ và toàn bản đồ mở theo nhu cầu bằng details, không bắt người chơi bấm Next qua giáo trình. Header Kiến thức bám chứng cứ/quyết định vừa gặp; tại bàn họp có lời mời xem giải thích. Đọc trước chứng cứ được cho phép như hỗ trợ học tập, nhưng không được tính là đã thu thập hoặc làm chứng cứ hành động.

## Đánh giá dựa hành vi

| Tiêu chí | Căn cứ trong lượt chơi | Mẫu số và giới hạn |
|---|---|---|
| Nhận diện lợi ích | Chủ động hỏi NPC hoặc mở tab phản biện từng người | 3 chủ thể; ghi nhận tiếp cận góc nhìn, chưa chứng minh hiểu sâu |
| Nhận diện mâu thuẫn | Tự ghép đúng chứng cứ vào ba nút thắt | 3 nút; không lấy từ ending |
| Sử dụng chứng cứ | Chứng cứ khác nhau dùng khi mời họp, gắn/đề xuất công cụ | Tối đa 7 loại chứng cứ có liên hệ trực tiếp các thao tác này; không tính chỉ mở panel |
| Điều phối, cân bằng | Điều khoản tự chọn hiện còn khả thi + tranh biện vận dụng đúng nguyên nhân và xử lý | 3 nhóm điều khoản + 3 tình huống tranh biện; phương án mẫu không tính như tự quyết |
| Vai trò Nhà nước | Tự đề xuất công cụ có chứng cứ sở hữu | 4 vai trò; chỉ là chỉ báo hành vi, không tự khẳng định hiểu lý thuyết |

Điểm mỗi mục là tỷ lệ hành vi quan sát được, hiển thị cùng căn cứ và khuyến nghị. Không chuyển điểm ending thành điểm học tập; không thưởng điểm kinh tế cho đáp án quiz hoặc rubric. Save cũ chỉ sử dụng lịch sử thực có, không suy diễn hành vi từ việc đã tới một màn. Hồ sơ chuẩn bị sẵn có `source: prepared`.

## Tranh biện

Ba tình huống sâu: giá cao cố định; HTX ứng phí; hoãn toàn bộ lô. Mỗi tình huống cần chọn khái niệm, một chứng cứ đã sở hữu, quan hệ nguyên nhân và hướng xử lý; rồi xếp luận điểm → căn cứ/phân tích → đề xuất. Có phản biện lại ý kiến NPC và cho sửa.

Rubric 0–2 cho từng mục: khái niệm đúng; logic kết hợp thứ tự và quan hệ nguyên nhân; vận dụng kết hợp nguyên nhân và cách xử lý; chứng cứ kết hợp độ phù hợp của tài liệu với nguyên nhân. Một chứng cứ đúng nhưng lập luận sai chỉ được tối đa 1 ở mục chứng cứ. Không matching từ khóa, không nhập văn bản tự do, không API AI. Chấm chỉ có hiệu lực trong cấu trúc tình huống đã thiết kế, không thay đánh giá của giảng viên.

## Quiz 10 câu tình huống

| Câu | Bối cảnh | Năng lực quan sát |
|---|---|---|
| 1 | Đầu tư cảm biến rồi mất đầu ra | Nhận diện đầy đủ lợi ích |
| 2 | Cả ba thiệt hại do đứt chuỗi | Phân biệt thống nhất và đồng nhất |
| 3 | HTX ứng phí toàn vụ | Cá nhân gắn năng lực tập thể |
| 4 | Giá tham chiếu biến động | Vận dụng bảo đảm có căn cứ |
| 5 | Tranh cãi chất lượng | Quyền kiểm chứng và vai trò Nhà nước |
| 6 | Cảnh báo mặn chưa xác minh | Trình tự phối hợp có thông tin |
| 7 | Kiểm tra toàn bộ gây chậm xe | Phân tích đánh đổi cộng đồng và chủ thể |
| 8 | Tranh chấp theo cơ chế pháp lý | Bảo vệ quyền không đồng nghĩa phục hồi tức thì |
| 9 | Tổng cao nhưng HTX thiếu nguồn lực | Điều kiện cá thể và tính khả thi |
| 10 | Tự thương lượng trong khuôn khổ minh bạch | Thị trường kết hợp điều tiết, phạm vi minh họa |

Mỗi câu có bốn phương án, giải thích cả bốn sau khi nộp. Lưu lựa chọn khi đang làm; kết quả và nội dung nên ôn theo câu sai có trong TXT. Quiz là hoạt động sau ending, không chặn cốt truyện hoặc quyết định quyền ký của NPC.
