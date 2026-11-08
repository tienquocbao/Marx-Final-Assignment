# Vùng Cồn Xanh — baseline v8.0

Ngày 2026-11-08. Chỉ đọc source rời; không mở ZIP lồng. Bản sao source trước chỉnh sửa tại `/tmp/vcx-baseline` (tạm thời). Manifest SHA-256 118 asset tại `artifacts/qa/assets-before.json` để kiểm tra không mất tài nguyên.

- `node --check scripts/game.js`: PASS.
- 58 đường dẫn asset runtime: PASS, không thiếu; 40 portrait, 4 sprite, 5 cảnh, 9 audio.
- Python QA chạy nguyên trạng: BLOCKED (chưa cài Playwright; sau khi dùng uv, đường dẫn Edge `/opt/microsoft/msedge/msedge` không tồn tại).
- Chạy QA gốc trên bản sao, chỉ đổi executable sang Edge Linux có sẵn: xem số thực tế và từng assertion trong `artifacts/qa/baseline-legacy.txt`. Bộ cũ có 34 assertion nhưng nhiều ca chỉ render kết thúc bằng gán state, không kiểm chứng điều kiện A/B/C hoặc chơi mini-game thực sự.
- Browser smoke mở file và bắt đầu truyện được kiểm tra riêng; console/network sẽ được bộ v8 giám sát và ghi riêng, bộ cũ không đo các mục này.
- Không có validator HTML/CSS chuyên dụng trong repo; chưa kiểm tra W3C (NOT TESTED). Sẽ bổ sung parse DOM, CSSOM và đường dẫn trong QA v8.

## Sai lệch và rủi ro tìm thấy

1. README chỉ sai tên thư mục giải nén; docs/README và hướng dẫn v7 hứa ba file offline nhưng cả ba đều không tồn tại.
2. Tiêu đề HTML, README và tài liệu không cùng phiên bản.
3. Không có Slides_MLN122.pdf để kiểm tra các số trang đã nêu trong tài liệu cũ. Nội dung v8 phải đánh dấu diễn giải cần đối chiếu.
4. Save có fallback v71/v7/v6/v4 nhưng chỉ kiểm tra hai thuộc tính; dữ liệu sai kiểu có thể làm game lỗi, lỗi ghi bị nuốt.
5. NPC hỏi thêm xoay vòng ba câu cố định; lịch sử quyết định chỉ lưu kind/key/id, không lưu hệ quả; trust dùng chung.
6. Ending có nhiều ngưỡng nhưng chưa có veto cá thể tường minh; lời phản biện bị cắt còn bốn và không hết lo khi đã bổ sung bảo đảm.
7. Các nút chứng cứ công cụ/mời họp không kiểm tra sở hữu tại hàm xử lý; cuối game ghi cứng 9/9 chứng cứ.
8. Escape đóng biến cố nhưng chưa phục hồi nhạc; modal chưa khóa focus, phím bản đồ có thể chạy khi modal mở.
9. `.git` không chứa metadata Git hợp lệ: không thể tạo diff/commit; ghi manifest file thay đổi trong release.

Giữ nguyên truyện, 3 nơi điều tra, 9 chứng cứ, 3 mini-game, 3 điều khoản, 4 nhóm công cụ, biến cố, ending và bộ asset. Không dùng báo cáo cũ như bằng chứng cho v8.
