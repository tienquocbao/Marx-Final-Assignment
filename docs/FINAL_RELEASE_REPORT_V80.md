# Báo cáo phát hành Vùng Cồn Xanh v8.0

Ngày 2026-11-08. **PASS trong phạm vi tự động**. Source rời là nguồn chính; ZIP lồng được bỏ qua hoàn toàn. Chưa có xác nhận trình diễn trên máy trường, không coi sản phẩm đã được chứng nhận hoàn hảo.

## 1. Tính năng nâng cấp và mới

Giữ nguyên hành trình 5 nhân vật/40 portrait, 3 khu điều tra, 9 chứng cứ, 3 mini-game, 3 nhóm điều khoản, 4 vai trò Nhà nước, mời họp, biến cố, A/B/C, trình chiếu và TXT. Không xóa asset cũ.

- Simulation dùng điều kiện riêng và veto từng chủ thể, tính khả thi, niềm tin cá thể cùng quan hệ chung, môi trường và biến cố. Không dùng tổng điểm thay đồng thuận.
- Memory có interest/concern profile, lịch sử quan hệ và phản ứng theo đề xuất trước; thoại và portrait thay đổi có căn cứ, không ngẫu nhiên. Sửa phương án có thể khôi phục đường hợp tác.
- History ghi lựa chọn, chứng cứ, được/mất, phản ứng, hệ quả; nhiệm vụ phụ/biến cố cũng được lưu.
- Knowledge Panel 5 mục, 9 liên kết chứng cứ–khái niệm–chủ thể–quyết định; giải thích mở theo tình huống. Nội dung diễn giải cần đối chiếu slide gốc.
- Debrief giải thích ưu tiên lợi ích, mâu thuẫn đã xử lý/còn tồn tại, chứng cứ, vai trò Nhà nước và lý do ending; learning profile 5 chỉ báo từ hành vi thực.
- Quiz 10 tình huống lưu tiến độ, giải thích cả phương án sai, kết quả và ôn tập; báo cáo TXT gồm simulation, profile, history, knowledge, debate và quiz.
- Tranh biện ba tình huống: chọn luận điểm/chứng cứ/nguyên nhân/giải pháp và thứ tự lập luận, rubric 4×0–2. Không AI, không keyword matching, không chấm văn bản tự do.

## 2. Gameplay, UI/UX và save

Tận dụng toàn bộ portrait và cảnh cũ; giữ palette nông nghiệp. Typewriter thân thiện assistive technology, fade/feedback nhẹ, tắt khi reduced motion. Nhạc/SFX cục bộ; tension ở biến cố, khôi phục khi quay lại; có bật/tắt/âm lượng và gesture gating.

Màn kiến thức/debate/quiz/dashboard đồng nhất với sổ tay cũ. Focus có viền, native dialog và modal trap/restore, inert background, sửa chữ phụ thiếu tương phản. Các màn mới được chạy ở 390px.

Save version 8, migration từ v71/v7/v6/v4, lọc schema và lỗi dữ liệu lồng, fallback, cảnh báo quota. Giữ key cũ, bảo vệ save tương lai, không ghi đè checkpoint khi mở kiến thức ở home. Kết thúc lưu cũ được gắn nhãn và đối chiếu luật v8; có nút trở lại sửa để đánh giá lại.

## 3. File và kiến trúc

Source chính vẫn HTML/CSS/Vanilla JS. Bổ sung Modular Vanilla: core state, simulation, NPC memory, story, exploration/evidence, negotiation, learning, assessment, UI, audio, storage. Factory có dependency tường minh; `game.js` chỉ bootstrap/wiring/lifecycle, state không còn là global. Classic script giữ mở trực tiếp file://; không chuyển ESM vì yêu cầu này. Danh sách đầy đủ tại [CHANGELOG_V80.md](CHANGELOG_V80.md), kiến trúc tại [ARCHITECTURE_V80.md](ARCHITECTURE_V80.md).

Giữ `game.js` ở cùng đường dẫn, chuyển các trách nhiệm vào module riêng trong `scripts/`. Catalog và nội dung học thuật giữ nguyên; simulation giữ API tương thích. `index.html` nạp registry đầu tiên, bootstrap cuối; build giữ thứ tự đó. Source scan/hash mở rộng sang các thư mục con. Thêm Node architecture tests, production offline tests và QA bridge riêng cho bộ test cũ. Không xóa source, nội dung, asset hay tài liệu cũ. Hash source phát hành tại `artifacts/qa/source-sha256.json`.

## 4. Kết quả trước và sau

- Baseline cũ: 34/34 assertion PASS khi sửa executable browser trong bản sao; script nguyên trạng BLOCKED bởi môi trường. Không thiếu 58 asset được tham chiếu.
- Trước Modular: **230/230 assertion PASS**, build PASS; giữ bằng chứng và 48 contract gốc.
- Sau: **292/292 assertion PASS**, 0 FAIL, 0 BLOCKED trong suite chạy. Build PASS.
- Exhaustive **1,417,176** trạng thái: A=37,692, B=360,504, C=1,018,980; 124 bộ phương án có thể đạt A. Kiểm tra veto khi tổng cao, khắc phục dòng tiền HTX, nhiều chiến lược, memory/hội thoại, dữ liệu biên và migration.
- Modular: 12 nhóm Node PASS và 18 assertion production source/standalone offline không bridge PASS; kiểm tra không global, save v8 cũ, state mới và đạt A qua UI.
- Console JS: 0; lỗi tải thực: 0. 118 asset gốc giữ nguyên hash, 49 hình decode và 9 OGG load trong source/standalone.
- Browser đi thật toàn bộ full journey và demo mobile; B/C cùng A khác qua checkpoint hợp lệ và các quyết định UI; standalone đặt thư mục độc lập, tắt mạng và chơi đến A.
- axe 30/30 màn/viewport PASS; còn mục `incomplete` và kiểm tra máy thật được công khai trong báo cáo QA.

Chi tiết, lỗi từng ca và bằng chứng: [TEST_REPORT_V80.md](TEST_REPORT_V80.md). Không cộng các mẫu exhaustive thành hàng triệu test độc lập.

## 5. Lỗi đã phát hiện và xử lý

Sửa thiếu validation save, handler chưa kiểm tra sở hữu chứng cứ, ghi cứng 9/9, NPC thoại lặp, tổng điểm che lo ngại, checkpoint bị ghi đè từ kiến thức home, focus còn ở màn ẩn, chữ phụ thiếu tương phản và MIME OGG sai khi build bằng Python uv. Mỗi nhóm có kiểm tra regression tương ứng. Không còn assertion FAIL trong bản được coi PASS; nếu mục 4 ghi FAIL thì release vẫn chưa đạt.

Không khẳng định không còn bug trên mọi thiết bị. Chỉ số lợi ích có thể chạm trần, không dùng như dữ liệu thực; learning rubric có giới hạn; history giữ tối đa 500 quyết định/60 sự kiện quan hệ mỗi NPC; save phụ thuộc browser/origin/file path. Bản một file có dung lượng lớn hơn source HTML vì nhúng asset.

## 6. BLOCKED và phần chưa triển khai

- **BLOCKED:** thiếu giáo trình/slide MLN122 gốc để xác minh nguyên văn/số trang; cần giảng viên đối chiếu. Không tạo trích dẫn giả.
- Giới hạn Git tại thời điểm kiểm thử đã được xử lý khi xuất bản: nối lại lịch sử `main` từ `git@github.com:tienquocbao/Marx-Final-Assignment.git`, giữ nguyên source và bằng chứng QA.
- Không thêm mini-game cung cầu/c-v, framework, backend, AI API hay tự do nhập bài tranh biện. Đây là quyết định phạm vi nhằm giữ trọng tâm và độ tin cậy.
- NOT TESTED: người học mới, thời lượng thực 5–7 phút, loa/HDMI, máy chiếu, screen reader, zoom thực, cảm ứng vật lý, Firefox/Safari. Các mục này không được gộp thành PASS.

## 7. Cách chạy và bản phát hành

Mở `index.html` với thư mục asset/scripts/styles kèm theo, hoặc chép riêng **`dist/Vung_Con_Xanh_v8_0_Offline.html`** và mở bằng Chrome/Edge hiện đại. Không cần mạng. Nếu file:// bị chính sách máy chặn: `python -m http.server 8000 --bind 127.0.0.1`, mở `http://127.0.0.1:8000/`.

Bản standalone: **18,353,648 byte**, SHA-256 `0b34483e9cdbb3940b33a2a1cca8bc791b0faa28e2e9efa9abcf68ac7a728b23`. Manifest `dist/manifest.json`. Build `python tools/build_offline.py`; không nhúng base64 vào source chính.

Test:

```sh
node tools/test_simulation.cjs
node tools/test_modules.cjs
npm install --prefix /tmp/vcx-qa axe-core@4.14.0
uv run --with-requirements tools/requirements-qa.txt python tools/run_qa.py
python tools/write_release_reports.py
```

Công cụ QA cần chuẩn bị dependencies/browser; game không cần cài. Hướng dẫn người chơi: [USER_GUIDE_V80.md](USER_GUIDE_V80.md); MC: [KICH_BAN_MC_7_PHUT.md](KICH_BAN_MC_7_PHUT.md).

## 8. Việc cần kiểm tra trên máy thật trước buổi học

1. Mở source và standalone khi tắt Wi-Fi trên laptop trình chiếu; thử save/đóng/mở/tiếp tục và TXT trong Downloads.
2. Kiểm tra loa/HDMI, âm lượng trang và toàn hệ thống, nhạc căng thẳng, SFX và nút tắt nhạc.
3. Bật toàn màn hình trên máy chiếu, xem độ rõ chữ/portrait, thử mức zoom mong muốn và Tab/Enter/Space/Escape.
4. Diễn tập MC 5–7 phút, thống nhất không làm hết debate/quiz trong khung thời gian này; chuẩn bị video dự phòng.
5. Nhờ giảng viên đối chiếu diễn giải MLN122; nhờ người chơi mới thử và ghi nơi chưa hiểu.
6. Nếu lớp cần trợ năng, thử trình đọc màn hình và giảm chuyển động trên thiết bị của người dùng thực.
