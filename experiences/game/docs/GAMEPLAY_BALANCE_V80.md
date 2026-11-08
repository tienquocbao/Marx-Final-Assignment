# Cân bằng simulation v8.0

## Các điều kiện độc lập

Chỉ số lợi ích dùng catalog delta cũ, clamp 0–100. Không cộng dồn khi bấm sửa. Một số phương án tốt làm chỉ số chạm trần; vì vậy điểm không được dùng thay tính khả thi hoặc đồng thuận. Đây là thiết kế luật chơi sư phạm, không phải số liệu hay mô hình định lượng kinh tế thực nghiệm.

| Chủ thể | Thiết yếu / veto | Có thể khắc phục |
|---|---|---|
| Chú Bảy | Chưa rõ giá; giá theo đợt thiếu bảo đảm; thu phí đầu vụ thiếu phương án vốn/nguồn nghĩa vụ; mẫu gọn thiếu quyền đối chiếu | Giá theo đợt + phụ lục; phí đầu vụ + tín dụng phù hợp điều kiện + phụ lục |
| Chị Sen | Chưa rõ phí; ứng phí thiếu nguồn lực chia sẻ và lịch thu hồi | Phí công khai; hoặc ứng phí với tổ chức dịch vụ chung qua HTX và phụ lục |
| Anh Khoa | Giá cao cố định chưa có căn cứ khả năng thực hiện; giá theo đợt nhưng thiếu quyền đối chiếu | Quy tắc giá/kiểm định khả thi; đồng ý nhượng bộ khi minh bạch hơn |
| Cả ba | Rủi ro chưa phân; hoãn toàn bộ không hạn/nguồn bù; tranh chấp còn chờ cơ chế pháp lý | Sửa cơ chế trách nhiệm, bảo đảm khả năng thực hiện; không ép ký |

Vốn vay vẫn có nghĩa vụ trả nợ. Kiểm tra toàn bộ vẫn có rủi ro tiến độ/chi phí. Các lo ngại này được giữ ở mức cần theo dõi khi có đủ bảo đảm, không giả định biến mất mọi rủi ro.

## Niềm tin và memory

Niềm tin riêng dựa vào chứng cứ địa điểm, lời mời tự nguyện, khả thi điều khoản, mức lo ngại và công cụ bảo đảm phù hợp ưu tiên mỗi người. Bảy phản ứng rõ với tập huấn và bảo đảm quyền; Sen với dịch vụ chung/biên bản; Khoa với kiểm định độc lập/bên trung lập. Niềm tin chung vẫn hiện như một chỉ số quan hệ, nhưng không quyết định thay niềm tin từng NPC.

Lưu đề xuất gây concern bằng ID ổn định, không đếm lặp để cộng/trừ vô hạn. Đề xuất đã sửa để lại thận trọng 2 điểm/lo ngại, tối đa 6 điểm. Bấm cùng phương án trong UI không tạo thêm quyết định; lịch sử cũ có thể được nhắc lại trong dialogue. Draft còn thiếu không được ghi như một lần thất hứa. Các chuỗi harmful → repair vẫn có thể đạt A.

## Điều kiện ending

A phải đạt đồng thời:

- Đủ ba điều khoản và bốn công cụ có chứng cứ đã sở hữu.
- Cả ba nhận lời tham gia.
- Lợi ích riêng tối thiểu Bảy 59, Sen 57, Khoa 57.
- Không còn critical concern của bất kỳ chủ thể nào.
- Trust riêng mỗi người ≥55 và trust chung ≥60.
- 3/3 điều khoản khả thi, ít nhất 3/4 công cụ có điều kiện phù hợp.
- Cộng đồng/môi trường ≥60, có công cụ phòng ngừa, không hoãn toàn bộ vô thời hạn.
- Biến cố có trình tự cảnh báo → xác minh → phối hợp thực hiện thỏa thuận.

B: đủ hồ sơ, tham gia; ít nhất 2 điều khoản và 2 công cụ khả thi; mỗi người lợi ích ≥43, trust ≥35, không quá một critical concern; trust chung ≥39, cộng đồng ≥42. Có thể còn veto một điều kiện: đây là tiến triển/đối thoại, chưa phục hồi đầy đủ. Thất bại trình tự biến cố ngăn A.

C: chưa đủ điều kiện cho B hoặc A. Không sử dụng tổng ba chỉ số để phân loại. Phản hồi cuối và debrief giải thích cụ thể điều kiện chưa đạt, không gán “đồng thuận” chỉ vì điểm cao.

## Phương án A tham khảo

Không phải danh sách khuyến nghị chính sách thực tế; mọi công cụ cần gắn chứng cứ hợp lệ.

1. Giá sàn + phí theo dịch vụ + cùng cảnh báo/chia tổn thất; phụ lục, tập huấn, kiểm tra theo rủi ro có dữ liệu cảm biến, đối thoại có biên bản.
2. Giá theo đợt + phí công khai + quỹ dự phòng; phụ lục bảo đảm, tổ chức dịch vụ chung, kiểm tra theo rủi ro, bên trung lập.
3. Phí đầu vụ đi cùng giá sàn, tín dụng có điều kiện và phụ lục minh bạch; vẫn cần quản trị rủi ro, giải quyết mâu thuẫn và các điều kiện còn lại.
4. HTX ứng phí đi cùng nguồn lực dịch vụ chung qua HTX và phụ lục; vẫn xét mức lợi ích và khả năng thực hiện.

## Kiểm thử không gian trạng thái

`node tools/test_simulation.cjs` duyệt toàn bộ 3^7 lựa chọn điều khoản/công cụ × 3^4 chứng cứ công cụ × 4 tổ hợp nhiệm vụ phụ × 2 kết quả biến cố = **1.417.176 trạng thái cuối**. Mỗi trạng thái kiểm tra giới hạn chỉ số; mọi A phải vượt toàn bộ điều kiện và không được có veto. Catalog dùng chính file game, không dựng engine thứ hai trong test.

Kết quả phân bố và số bộ phương án A nằm tại `artifacts/qa/simulation.json` và báo cáo QA. Có 124 bộ lựa chọn điều khoản/công cụ đạt A ở ít nhất một bối cảnh kiểm thử. Đây không phải xác suất người chơi đạt A: không gian được duyệt đều, không mô hình hóa tần suất hành vi.

Kiểm thử memory dùng chuỗi có chủ đích: đề xuất gây hại → sửa, lặp phản đối, bấm lặp không farm trust, giới hạn scar, migration và dữ liệu sai. Không exhaustive toàn bộ lịch sử quyết định vì chuỗi thao tác có thể dài vô hạn. Các số liệu exhaustive lấy memory ban đầu rỗng; ảnh hưởng lịch sử được kiểm tra riêng.

## Giới hạn thiết kế

Không mô phỏng giá trị, cung cầu hay dòng tiền thực bằng phương trình kinh tế; dùng điều kiện định tính, chỉ số giả định và phản biện để dạy quan hệ lợi ích. Không thêm mini-game cung cầu/c-v vì không cần cho trọng tâm nâng cấp. Cần playtest người học mới để xác định độ khó, độ rõ của veto và thời lượng; việc này chưa được thay thế bởi automation.
