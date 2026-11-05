# NHẬT KÝ THAY ĐỔI TÀI NGUYÊN (ASSET CHANGELOG)
**Dự án:** Vùng Cồn Xanh (Học phần MLN122 – Triết học & Kinh tế Chính trị Mác - Lênin)  
**Phiên bản:** Release 2.0 – Character Art, Avatar & Visual Effects Overhaul  
**Ngày cập nhật:** 2026-11-05

---

## 1. DANH MỤC PORTRAIT ĐƯỢC XÂY DỰNG LẠI (40 FILE CHÂN DUNG)
*Vị trí lưu trữ:* `assets/portrait/*.png`  
*Quy cách kỹ thuật:* PNG 32-bit (RGBA), Kích thước: **$512 \times 640\text{ px}$** (Chuẩn tỉ lệ 4:5, tỉ số $0.800$), Màu sắc: sRGB, Nền: Trong suốt $100\%$, Căn lề chân đế: $Y = 625\text{ px}$, Tâm ngang: $X = 256\text{ px}$, Lề an toàn $X \ge 26\text{ px}$, Khử viền trắng (Color Decontamination) triệt để.

| File Name | Nhân vật | Cảm xúc | Nguồn gốc / Phương pháp xử lý |
|---|---|---|---|
| `minh_an_normal.png` | Minh An | Normal | Bóc tách từ `bang_bieu_cam_goc.png`, khử viền halo, Lanczos upscale 512×640 |
| `minh_an_happy.png` | Minh An | Happy | Bóc tách từ `bang_bieu_cam_goc.png`, làm mịn subpixel alpha |
| `minh_an_worried.png` | Minh An | Worried | Bóc tách từ `bang_bieu_cam_goc.png`, khử đốm xám biên |
| `minh_an_confused.png` | Minh An | Confused | Bóc tách từ `bang_bieu_cam_goc.png`, căn giữa trục X |
| `minh_an_stressed.png` | Minh An | Stressed | **Tái tạo chính chủ:** Xóa bỏ hoàn toàn ảnh ghép emoji 😰, trích xuất nét vẽ stressed gốc |
| `minh_an_angry.png` | Minh An | Angry | **Tái tạo chính chủ:** Xóa bỏ hoàn toàn ảnh ghép emoji 💢, trích xuất nét vẽ angry gốc |
| `minh_an_thinking.png` | Minh An | Thinking | **Tái tạo chính chủ:** Xóa bỏ hoàn toàn ảnh ghép emoji 🤔, trích xuất nét vẽ thinking gốc |
| `minh_an_relieved.png` | Minh An | Relieved | Phục hồi hoàn chỉnh phần má nhân vật bị khuyết do thuật toán cũ, giữ làn khí thở sạch |
| `chu_bay_normal.png` | Chú Bảy | Normal | Bóc tách mở rộng headroom, nón lá nguyên vẹn không bị cắt đỉnh |
| `chu_bay_happy.png` | Chú Bảy | Happy | Nụ cười híp mắt sảng khoái nguyên bản, khử viền áo sạch |
| `chu_bay_worried.png` | Chú Bảy | Worried | Bóc tách nguyên bản từ ô gốc, nón lá cân đối |
| `chu_bay_confused.png` | Chú Bảy | Confused | Cử chỉ bối rối nguyên bản, bảo toàn chi tiết khăn rằn |
| `chu_bay_stressed.png` | Chú Bảy | Stressed | **Tái tạo chính chủ:** Xóa emoji 😰, phục hồi nét mặt nhăn trán lo âu gốc |
| `chu_bay_angry.png` | Chú Bảy | Angry | **Tái tạo chính chủ:** Xóa emoji 💢, phục hồi nét mặt tức giận phản đối gốc |
| `chu_bay_thinking.png` | Chú Bảy | Thinking | **Tái tạo chính chủ:** Xóa emoji 🤔, phục hồi cử chỉ vuốt cằm suy nghĩ gốc |
| `chu_bay_relieved.png` | Chú Bảy | Relieved | Nụ cười an lòng, bảo toàn 100% sọc caro khăn rằn Nam Bộ |
| `chi_sen_normal.png` | Chị Sen | Normal | Chân dung nữ giám đốc HTX đĩnh đạc, thẻ công tác rõ nét |
| `chi_sen_happy.png` | Chị Sen | Happy | Nụ cười tươi rạng rỡ, phục hồi lọn tóc bên phải bị crop cũ |
| `chi_sen_worried.png` | Chị Sen | Worried | Ánh mắt lo toan xã viên, bảo toàn chi tiết áo sơ mi ngà |
| `chi_sen_confused.png` | Chị Sen | Confused | Chau mày thắc mắc số liệu nguyên bản |
| `chi_sen_stressed.png` | Chị Sen | Stressed | **Tái tạo chính chủ:** Xóa emoji 😰, phục hồi nét mặt áp lực giữ trán gốc |
| `chi_sen_angry.png` | Chị Sen | Angry | **Tái tạo chính chủ:** Xóa emoji 💢, phục hồi ánh mắt nghiêm nghị sắc sảo gốc |
| `chi_sen_thinking.png` | Chị Sen | Thinking | **Tái tạo chính chủ:** Xóa emoji 🤔, phục hồi dáng suy ngẫm hồ sơ gốc |
| `chi_sen_relieved.png` | Chị Sen | Relieved | Nụ cười ấm áp nhẹ nhõm, khử sạch bóng mờ cũ |
| `anh_khoa_normal.png` | Anh Khoa | Normal | Khử viền ẩu cũ, bảo toàn gọng kính titan và tròng mắt kính phản quang |
| `anh_khoa_happy.png` | Anh Khoa | Happy | Nụ cười đắc thắng doanh nhân nguyên bản |
| `anh_khoa_worried.png` | Anh Khoa | Worried | Phục hồi góc cà vạt bị xén, ánh mắt ưu tư thị trường |
| `anh_khoa_confused.png` | Anh Khoa | Confused | Cử chỉ đẩy kính bối rối nguyên bản |
| `anh_khoa_stressed.png` | Anh Khoa | Stressed | **Tái tạo chính chủ:** Xóa emoji 😰, phục hồi nét căng thẳng cởi cổ áo gốc |
| `anh_khoa_angry.png` | Anh Khoa | Angry | **Tái tạo chính chủ:** Xóa emoji 💢, phục hồi nét mặt bạnh hàm gay gắt gốc |
| `anh_khoa_thinking.png` | Anh Khoa | Thinking | **Tái tạo chính chủ:** Xóa emoji 🤔, phục hồi ngón tay đặt lên cằm tính toán gốc |
| `anh_khoa_relieved.png` | Anh Khoa | Relieved | Gương mặt cởi mở an lòng khi đạt thỏa thuận |
| `ca_bong_normal.png` | Cá Bống | Normal | Vây bơi mềm mại, mắt tròn xoe, alpha trong suốt hoàn hảo |
| `ca_bong_happy.png` | Cá Bống | Happy | Nhảy múa vui vẻ, bảo toàn từng bọt nước li ti |
| `ca_bong_worried.png` | Cá Bống | Worried | Đuôi cụp ái ngại nguyên bản, vây đuôi trọn vẹn |
| `ca_bong_confused.png` | Cá Bống | Confused | Vòng xoắn ốc khó hiểu sắc nét, không răng cưa |
| `ca_bong_stressed.png` | Cá Bống | Stressed | **Tái tạo chính chủ:** Xóa emoji 😰, phục hồi giọt mồ hôi hột và miệng há hốc gốc |
| `ca_bong_angry.png` | Cá Bống | Angry | **Tái tạo chính chủ:** Xóa emoji 💢, phục hồi hai má phồng to đỏ ửng gốc |
| `ca_bong_thinking.png` | Cá Bống | Thinking | **Tái tạo chính chủ:** Xóa emoji 🤔, phục hồi vây chống cằm suy ngẫm gốc |
| `ca_bong_relieved.png` | Cá Bống | Relieved | Vây bụng trọn vẹn, tư thế bơi thư thái nhẹ nhõm |

---

## 2. DANH MỤC SPRITE DI CHUYỂN BẢN ĐỒ (WALK SPRITES)
*Vị trí lưu trữ:* `assets/sprites/*.png`  
*Quy cách kỹ thuật:* PNG 32-bit (RGBA), Kích thước: **$158 \times 215\text{ px}$**, Tâm ngang: $X = 79\text{ px}$, Chân tiếp đất: $Y = 208\text{ px}$.

| File Name | Khung hình | Nội dung nâng cấp |
|---|---|---|
| `minh_an_walk_0.png` | Frame 0 | Chân phải chạm đất trước (Contact), dáng người thẳng thắn, sổ tay cầm gọn, xóa bỏ hoàn toàn chân que và vết cắt ngang thân |
| `minh_an_walk_1.png` | Frame 1 | Chân trái co vung lướt qua (Passing), tay đung đưa tự nhiên theo nhịp cơ học sinh học |
| `minh_an_walk_2.png` | Frame 2 | Chân trái tiếp đất (Opposite Contact), trọng tâm chuyển dịch mượt mà |
| `minh_an_walk_3.png` | Frame 3 | Chân phải co vung lướt qua (Opposite Passing), hoàn tất chu kỳ 4 bước đi bộ tuần hoàn |

---

## 3. CẢI TIẾN MÃ NGUỒN FRONTEND (STYLES & SCRIPTS)

### 3.1. `styles/game.css`
- **Xóa bỏ `@keyframes blinkPulse` cũ:** Loại bỏ hoàn toàn `transform: scaleY(.06)` gây méo dẹp nhân vật; thay bằng vi điều chỉnh độ mờ nhẹ tự nhiên $0.92$ không biến dạng cơ thể.
- **Chuẩn hóa `@keyframes talkPulse`:** Giảm biên độ xuống cử động micro-bob $2\text{ px}$ (`translateY(-2px)`), xóa bỏ thuộc tính `scale(1.015, .988)` làm giãn hình nhân vật.
- **Tiết chế `@keyframes tensePulse`:** Rung vi mô $1.5\text{ px}$ trong $0.32\text{ s}$, triệt tiêu hiện tượng rung lắc bạo lực.
- **Xóa bỏ `@keyframes portraitBounce`:** Thay bằng `@keyframes portraitEnter` với độ chuyển mượt $6\text{ px}$ fade-in nhẹ, không còn hiện tượng nhảy $22\text{ px}$ phóng to thu nhỏ.
- **Đồng bộ hóa kiến trúc Class BEM:**
  - `.character-portrait` (nền tảng chung)
  - `.character-portrait--story` ($192 \times 240\text{ px}$)
  - `.character-portrait--dialogue` ($104 \times 130\text{ px}$)
  - `.character-portrait--cast` ($108 \times 135\text{ px}$)
  - `.character-portrait--stake` ($100 \times 125\text{ px}$)
  - `.character-portrait--invite` ($120 \times 150\text{ px}$)
  - `.character-portrait--ending` ($128 \times 160\text{ px}$)
  - `.character-portrait--hearing` ($80 \times 100\text{ px}$)
  - `.character-portrait--modal` ($112 \times 140\text{ px}$)
- **Hỗ trợ Tiếp cận:** Bổ sung khối `@media (prefers-reduced-motion: reduce)` vô hiệu hóa $100\%$ transform và animation của nhân vật.

### 3.2. `scripts/game.js`
- Gán semantic classes `.character-portrait` và modifier classes tương ứng vào các hàm render động: `openClue()`, `renderInvitations()`, `renderStakes()`, `renderHearing()`, `renderEnding()`.
- Làm sạch hàm `pulsePortrait(id, mood)` kết hợp cùng CSS mới đảm bảo không bao giờ ghi đè biến dạng transform.

### 3.3. `index.html`
- Gán semantic classes chuẩn vào các thẻ ảnh chân dung tĩnh tại màn hình chính (`.homeCast`), khung cutscene (`#storyFace`), và khung điều tra (`#npcFace`).

---

## 4. TÀI LIỆU VÀ CÔNG CỤ TẠO MỚI (TOOLS & DOCS)
- `tools/rebuild_all_40_portraits.py`: Script tự động tách nền, lọc biên, upscale Lanczos và xuất 40 chân dung chuẩn.
- `tools/rebuild_walk_sprites.py`: Script xử lý và tối ưu hóa 4 khung hình sprite bước đi cho Minh An.
- `tools/test_game_qa.py`: Bộ kịch bản kiểm thử tự động toàn diện qua Playwright trên Microsoft Edge (34 ca kiểm thử, 4 viewports, zoom, accessibility).
- `docs/CHARACTER_BIBLE.md`: Sổ tay định chuẩn phong cách và đặc tả nhận diện 5 nhân vật.
- `docs/AVATAR_AUDIT.md`: Báo cáo kiểm toán đối chiếu Before & After cho 40 chân dung và 4 sprites.
- `docs/TEST_REPORT.md`: Báo cáo kết quả kiểm thử trình duyệt thực tế kèm 23 ảnh chụp màn hình.
- `docs/AVATAR_40_KIEM_TRA.png`: Bảng tổng hợp đối chiếu trực quan 40 biểu cảm.
- `docs/minh_an_walk_cycle_preview.png`: Bảng tổng hợp chu kỳ 4 bước đi của Minh An.
- `docs/avatar_source_map.json`: File dữ liệu nguồn ánh xạ trạng thái $100\%$ hợp lệ.
