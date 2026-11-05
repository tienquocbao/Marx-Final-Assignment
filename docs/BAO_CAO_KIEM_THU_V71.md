# Báo cáo kiểm thử – Vùng Cồn Xanh v7.1

**Ngày:** 04/11/2026. **Công cụ:** Chromium headless + Playwright, kiểm tra tĩnh JavaScript bằng Node.js.

## Đã thực hiện

| Bài kiểm thử | Phạm vi | Kết quả |
|---|---|---|
| Cú pháp mã JS | Script của HTML đóng gói | PASS |
| Luồng A | Mở đầu → 3 địa điểm → mini-game → ghép chứng cứ → mời họp → 3 quyết định trực tiếp ở chế độ trình chiếu → biến cố → A | PASS |
| Luồng B | Mở đầu → 3 địa điểm → ghép chứng cứ → mời họp → 3 điều khoản + 4 biện pháp → biến cố → B | PASS |
| Luồng C (mobile) | Luồng đầy đủ trên 390×844, nhiều quyết định bất lợi nhưng có cơ sở → C | PASS |
| Phương án A khác | Bộ giá tham chiếu từng đợt + quỹ dự phòng + kiểm định toàn bộ + các công cụ tương ứng (có nhiệm vụ phụ) | PASS (A) |
| Gắn chứng cứ trước khi đề xuất | Không cho chọn công cụ khi chưa gắn chứng cứ; cho chọn sau khi gắn | PASS |
| Phản biện nhiều vấn đề | Tổ hợp làm Chú Bảy, Chị Sen, Anh Khoa lần lượt có 3/2/4 vấn đề cần cân nhắc | PASS |
| Màn hình 1280×720 | Không bị cuộn ngang trong màn đàm phán | PASS |
| Xuất báo cáo TXT | Có chứng cứ, đánh đổi, phản hồi và nhật ký lựa chọn | PASS |
| Lưu/khôi phục trạng thái | Kiểm thử logic bằng localStorage mô phỏng trong trình duyệt không có origin | PASS (mô phỏng) |

**Không phát hiện lỗi JavaScript** trong các luồng đã thử.

## Phạm vi chưa xác nhận
- Chưa thực hiện kiểm thử tự động lưu/tiếp tục với localStorage thật của `file://` trên máy của nhóm; chính sách localStorage của trình duyệt có thể khác nhau.
- Chưa thực hiện kiểm thử với projector vật lý hoặc kiểm thử người chơi không biết trước game.
- Chưa xác nhận thời lượng 5–7 phút trong một buổi diễn tập thực tế; đây là mục tiêu thiết kế.
- Các con số tác động là giả lập, không phải phép đo hay dự báo chính sách.

## Gợi ý kiểm tra trước ngày thuyết trình
1. Mở HTML bằng Chrome/Edge trên laptop của nhóm.
2. Thử một vòng chế độ trình chiếu, bật toàn màn hình.
3. Chơi lại một nhánh sai rồi sửa, thử đổi bằng chứng và nghe phản ứng cả ba nhân vật.
4. Thử lưu/tiếp tục và xuất TXT tại chính máy sẽ dùng để thuyết trình.
5. Chuẩn bị một video quay màn hình dự phòng phòng trường hợp trình duyệt hoặc máy chiếu gặp lỗi.
