# VÙNG CỒN XANH – CHARACTER BIBLE & TECHNICAL ART SPECIFICATION
**Tài liệu Định chuẩn Nhận diện Nhân vật & Quy cách Kỹ thuật Đồ họa (2D Technical Art)**  
*Dự án Game Phiêu lưu Giáo dục: Vùng Cồn Xanh (Học phần MLN122 – Triết học & Kinh tế Chính trị Mác - Lênin)*  
*Phiên bản: 2.0 (Hậu kiểm toán & Tái thiết kế toàn diện 2026-11)*

---

## 1. TỔNG QUAN HỆ THỐNG NHÂN VẬT

Dự án **Vùng Cồn Xanh** xây dựng câu chuyện giải quyết xung đột lợi ích kinh tế giữa ba chủ thể chính trong chuỗi liên kết lúa gạo chất lượng cao tại Đồng bằng sông Cửu Long, dưới sự điều phối của Nhà nước:
1. **Nông dân (Chú Bảy)** – Người trực tiếp sản xuất, chịu rủi ro thiên tai và áp lực chi phí đầu vào.
2. **Hợp tác xã (Chị Sen)** – Cầu nối kinh tế tập thể, đại diện xã viên, tổ chức dịch vụ chung và kiểm soát chất lượng.
3. **Doanh nghiệp (Anh Khoa)** – Nhà tiêu thụ, chế biến, bao tiêu và chịu áp lực thị trường, đơn hàng xuất khẩu.
4. **Điều phối viên (Minh An)** – Người chơi, đại diện cho vai trò định hướng, hòa giải và điều tiết của Nhà nước.
5. **Linh vật (Cá Bống)** – Biểu tượng hướng dẫn sư phạm, giải thích khái niệm kinh tế chính trị một cách trực quan, gần gũi.

---

## 2. QUY CHUẨN KỸ THUẬT ĐỒ HỌA (TECHNICAL ART STANDARDS)

### 2.1. Chuẩn hóa Khung Chân Dung (Portrait Canvas)
- **Độ phân giải Master Canvas:** `512 × 640 px` (Tỷ lệ khung hình chuẩn 4:5, tỉ số $0.800$).
- **Định dạng file:** PNG 32-bit (RGB + Alpha trong suốt thực thụ, không nền màu, không viền rác).
- **Quy tắc căn lề & Neo tọa độ (Baseline Anchoring):**
  - Trục đối xứng ngang: $X = 256\text{ px}$.
  - Đường chân đế nhân vật (Baseline): $Y = 635\text{ px}$.
  - Khoảng trống phía trên đỉnh đầu (Headroom): Tối thiểu $25\text{ px}$ đến $45\text{ px}$ để đảm bảo không bị chạm mép hoặc cắt xén nón lá/kiểu tóc khi chuyển đổi biểu cảm.
- **Xử lý Biên dạng (Alpha Matte Antialiasing):**
  - Tách nền sử dụng thuật toán floodfill thích ứng kết hợp làm mịn biên Gaussian subpixel.
  - Loại bỏ triệt để viền trắng (white halo), viền xám bẩn hoặc vết răng cưa (aliasing).
  - Bảo toàn 100% các chi tiết màu trắng tự nhiên của nhân vật: tròng trắng mắt, phản chiếu tròng đen, áo trắng, viền nón lá, sổ tay, răng.
  - Tuyệt đối không chứa watermark, icon emoji vẽ đè, text cố định hoặc rác hình ảnh nhân vật khác.

### 2.2. Chuẩn hóa CSS & Tương thích Hiển thị
- Khung hiển thị bắt buộc: `object-fit: contain !important; object-position: center bottom !important; transform-origin: center bottom;`
- Bóng đổ tiêu chuẩn: `filter: drop-shadow(0 6px 14px rgba(10, 32, 20, 0.20));`
- Tuyệt đối không dùng `scaleY()` bóp méo toàn bộ cơ thể để giả lập chớp mắt.
- Chuyển động hội thoại (`talkPulse`): Chỉ dịch chuyển nhẹ nhàng $2\text{ px}$ theo phương thẳng đứng (`translateY(-2px)`), không co giãn tỉ lệ.
- Chuyển động căng thẳng (`tensePulse`): Dịch chuyển rung vi mô $1.5\text{ px}$ biên độ thấp trong $0.32\text{ s}$, không rung lắc cơ thể bạo lực.
- Tuân thủ khả năng tiếp cận `prefers-reduced-motion: reduce`: Tắt toàn bộ chuyển động transform/animation, giữ tĩnh sạch sẽ.

---

## 3. HỒ SƠ CHI TIẾT 5 NHÂN VẬT CHÍNH

### 3.1. MINH AN – CÁN BỘ ĐIỀU PHỐI VIÊN TRẺ (NGƯỜI CHƠI)

```text
Identity: Nữ, ~23-25 tuổi, cán bộ trẻ ngành nông nghiệp & phát triển nông thôn.
Tính cách: Trẻ trung, thông minh, chuẩn mực, lắng nghe, kiên nhẫn và thấu hiểu.
Trang phục: Áo sơ mi xanh bạc hà tươi sáng, vest gile công tác gọn gàng, kẹp tóc thanh lịch, cầm sổ tay ghi chép.
```

- **Bảng mã màu nhận diện:**
  - Xanh bạc hà chủ đạo: `#3b8057` / `#5cb87a`
  - Áo sơ mi ngà nhạt: `#f5f9f4`
  - Tóc đen chì mềm mại: `#23282b`
  - Sổ tay công tác: Da nâu ấm `#7a4d27`
- **8 Biểu cảm chuẩn mực:**
  1. `normal`: Ánh mắt tự tin, mỉm cười nhẹ, sổ tay cầm ngay ngắn.
  2. `happy`: Cười tươi rạng rỡ, mắt cong hình bán nguyệt, năng lượng tích cực.
  3. `worried`: Lông mày hơi nhíu nâng ở đuôi trong, ánh mắt thoáng ưu tư trước rủi ro của bà con.
  4. `confused`: Đầu hơi nghiêng, mắt mở to, một bên lông mày nhướng nhẹ đặt câu hỏi.
  5. `stressed`: Lông mày hạ thấp tập trung, miệng mím nhẹ trước áp lực xung đột lợi ích.
  6. `angry`: Ánh mắt kiên quyết phản đối hành vi vi phạm cam kết hoặc ép giá thiếu minh bạch.
  7. `thinking`: Đưa tay lên cằm hoặc nhìn nghiêng suy ngẫm giải pháp hài hòa lợi ích.
  8. `relieved`: Thở phào nhẹ nhõm, mắt khép dịu dàng, nụ cười an tâm khi tìm được tiếng nói chung.
- **Quy chuẩn Sprite di chuyển trên bản đồ (`minh_an_walk_*.png`):**
  - Canvas: $158 \times 215\text{ px}$.
  - Chu kỳ bước đi: 4 khung hình tuần hoàn (0: tiếp đất chân trước, 1: thu chân vung qua, 2: tiếp đất chân đối diện, 3: thu chân đối diện).
  - Tỷ lệ cơ thể tự nhiên, trang phục đồng bộ, hướng nhìn mặc định sang phải, đảo chiều lật gương bằng CSS `.facingLeft { transform: scaleX(-1); }`.

---

### 3.2. CHÚ BẢY – NÔNG DÂN KỲ CỰU ĐẠI DIỆN HỘ CANH TÁC

```text
Identity: Nam, ~55-60 tuổi, lão nông tri điền vùng châu thổ Cồn Xanh.
Tính cách: Bộc trực, dạn dày kinh nghiệm ruộng đồng, chất phác, giàu tình cảm nhưng sẵn sàng phản ứng mạnh khi bị thua thiệt.
Trang phục: Nón lá Nam Bộ truyền thống, áo bà ba nâu đất sờn vai, khăn rằn vắt chéo cổ.
```

- **Bảng mã màu nhận diện:**
  - Nón lá rơm khô: `#e8cf8d` / `#d1b268`
  - Áo bà ba nâu đất phù sa: `#633c1a` / `#4a2c13`
  - Khăn rằn caro Nam Bộ: Sọc đen trắng ngà `#3d3b37` & `#ede8d8`
  - Làn da rám nắng: `#b87b47`
- **8 Biểu cảm chuẩn mực:**
  1. `normal`: Nét mặt trầm ngâm hiền hậu, miệng mỉm đôn hậu, nón lá ngay ngắn.
  2. `happy`: Nụ cười sảng khoái thấy rõ răng, mắt híp lại phấn khởi như trúng mùa được giá.
  3. `worried`: Chân mày nhíu sâu, đuôi mắt trĩu xuống lo lắng sâu bệnh hoặc mặn xâm nhập.
  4. `confused`: Tay gãi đầu hoặc nhấc nhẹ vành nón lá, miệng hé hỏi vì sao giá thu mua lại giảm.
  5. `stressed`: Khóe miệng trễ sâu, trán hằn nếp nhăn lo toan nợ nần vật tư nông nghiệp.
  6. `angry`: Chân mày dựng ngược, mắt mở to phẫn nộ, miệng phản đối gay gắt việc thương lái ép giá bẻ cọc.
  7. `thinking`: Tay vuốt cằm, mắt nhìn xa xăm cân nhắc tham gia đề án lúa chất lượng cao.
  8. `relieved`: Nụ cười nhẹ nhõm, vai hạ lỏng, an lòng khi có hợp đồng bảo hiểm và giá sàn nhà nước trợ lực.

---

### 3.3. CHỊ SEN – GIÁM ĐỐC HỢP TÁC XÃ CỒN XANH

```text
Identity: Nữ, ~38-42 tuổi, người điều hành kinh tế tập thể tiêu biểu.
Tính cách: Trách nhiệm, chu đáo, hiểu luật pháp, tháo vát, kiên cường đứng mũi chịu sào vì hàng trăm xã viên.
Trang phục: Áo sơ mi lụa xanh lá sen tao nhã, kẹp tóc gọn gàng, đeo thẻ công tác HTX, tác phong quản lý chuyên nghiệp.
```

- **Bảng mã màu nhận diện:**
  - Xanh lá sen HTX: `#2d704a` / `#428b5e`
  - Áo sơ mi lụa ngà: `#fffaf0`
  - Thẻ công tác & dây đeo: Dây đỏ tươi `#b82e2e`, huy hiệu đồng `#d4a34b`
  - Mái tóc đen chấm vai uốn nhẹ: `#282321`
- **8 Biểu cảm chuẩn mực:**
  1. `normal`: Gương mặt nghiêm túc, đĩnh đạc, ánh mắt hòa nhã của người quản lý tập thể.
  2. `happy`: Cười tươi tự hào khi HTX đạt chuẩn VietGAP và bảo vệ được quyền lợi xã viên.
  3. `worried`: Ánh mắt âu lo trước sự đứt gãy niềm tin giữa nông dân và doanh nghiệp.
  4. `confused`: Lông mày hơi chau, mắt bối rối khi số liệu cân đo nguyên liệu bị sai lệch.
  5. `stressed`: Tay giữ ngực hoặc day nhẹ trán, chịu áp lực nghìn cân từ khoản phí kho bãi và giao hàng chậm.
  6. `angry`: Ánh mắt sắc bén nghiêm nghị, kiên quyết phê phán thái độ thiếu trách nhiệm của đối tác.
  7. `thinking`: Mắt nhìn tài liệu hợp đồng mẫu, cân đối bài toán chi phí dịch vụ và quỹ tích lũy HTX.
  8. `relieved`: Nụ cười ấm áp, phong thái tự tin khi ký kết thành công thỏa thuận phân chia lợi nhuận 3 bên.

---

### 3.4. ANH KHOA – ĐẠI DIỆN DOANH NGHIỆP THU MUA CHẾ BIẾN XUẤT KHẨU

```text
Identity: Nam, ~32-35 tuổi, giám đốc thu mua & chuỗi cung ứng doanh nghiệp gạo.
Tính cách: Năng động, thực tế, tư duy kinh tế thị trường sắc bén, tính toán rủi ro đơn hàng quốc tế khắt khe.
Trang phục: Áo sơ mi công sở xanh lam nhạt, áo vest gile navy lịch lãm, đeo kính gọng chữ nhật hiện đại.
```

- **Bảng mã màu nhận diện:**
  - Xanh navy doanh nghiệp: `#1b3a57` / `#28537d`
  - Sơ mi lam nhạt: `#e2edf7`
  - Gọng kính kim loại: Xám titan `#424d57`
  - Đồng hồ đeo tay: Thép bạc `#7b8894`
- **8 Biểu cảm chuẩn mực:**
  1. `normal`: Thần thái tự tin, điềm đạm, đôi mắt sau kính sắc sảo theo dõi thị trường.
  2. `happy`: Nụ cười thỏa mãn, bắt tay hợp tác khi lô hàng xuất khẩu sang châu Âu được thông quan.
  3. `worried`: Mắt mở rộng sau tròng kính, lo ngại tàu container trễ lịch hoặc thị trường thế giới biến động.
  4. `confused`: Đẩy nhẹ gọng kính, chau mày trước bảng kết quả phân tích mẫu gạo không đạt chuẩn độ ẩm.
  5. `stressed`: Cởi lỏng nút cổ áo hoặc giữ thái dương căng thẳng vì nguy cơ bị đối tác ngoại phạt hợp đồng.
  6. `angry`: Nét mặt đanh lại, ánh mắt gay gắt phản đối việc nông dân bán lúa non ra bên ngoài cho thương lái lạ.
  7. `thinking`: Đưa ngón tay lên cọng kính hoặc cằm, cân nhắc biên lợi nhuận và mức hỗ trợ vận chuyển.
  8. `relieved`: Nở nụ cười hòa nhã, cởi mở tiếp nhận cơ chế bảo lãnh tài chính và hòa giải từ phía Nhà nước.

---

### 3.5. CÁ BỐNG – LINH VẬT HƯỚNG DẪN DÂN GIAN (MASCOT MENTOR)

```text
Identity: Cá bống tượng sông Tiền/sông Hậu cách điệu chibi ngộ nghĩnh.
Tính cách: Hóm hỉnh, thông thái, giàu hình ảnh ví von dân gian Nam Bộ, đồng hành sư phạm tin cậy.
Tạo hình: Thân hình mũm mĩm, vây bơi linh hoạt, hoa văn vảy cá cách điệu sóng nước phù sa.
```

- **Bảng mã màu nhận diện:**
  - Da cá cam phù sa ấm áp: `#e07a38` / `#f09a56`
  - Bụng vàng kem nhạt: `#fff2c7`
  - Vây và sóng nước ngọc bích: `#2f8574` / `#47a894`
  - Mắt tròn to long lanh: `#1d2e28`
- **8 Biểu cảm chuẩn mực:**
  1. `normal`: Mắt tròn xoe thân thiện, vây bơi vẫy chào người chơi.
  2. `happy`: Nhảy tung tăng, mắt tít hình chữ V cười toe toét, bọt nước bay quanh.
  3. `worried`: Đuôi cụp xuống, mắt mở to ái ngại trước nguy cơ tan vỡ liên kết.
  4. `confused`: Vây gãi đầu cá, vòng xoắn ốc nhỏ quanh đầu diễn tả sự khó hiểu.
  5. `stressed`: Toát mồ hôi hột, vây quạt lia lịa trước tình thế khẩn cấp.
  6. `angry`: Hai má phồng to đỏ ửng, phụng phịu bất bình trước những hành vi ích kỷ cục bộ.
  7. `thinking`: Đặt vây lên má ngẫm nghĩ, bóng bóng ý tưởng hiện lên giải thích nguyên lý kinh tế.
  8. `relieved`: Thở phào khoan khoái, lượn vòng duyên dáng chúc mừng các bên tìm lại tiếng nói chung.

---

## 4. MA TRẬN PHÂN BỔ BIỂU CẢM THEO TIẾN TRÌNH GAMEPLAY

| Màn chơi / Giai đoạn | Minh An | Chú Bảy | Chị Sen | Anh Khoa | Cá Bống |
|---|---|---|---|---|---|
| **Màn hình chính (Home)** | `normal` (gián tiếp) | `normal` | `normal` | `normal` | `happy` (icon) |
| **Tuần 1: Khởi đầu liên kết** | `normal` | `happy` | `happy` | `happy` | `happy` |
| **Tuần 2–4: Rạn nứt âm ỉ** | `thinking` | `worried` | `stressed` | `thinking` | `worried` |
| **Tuần 6: Đổ vỡ hoàn toàn** | `thinking` | `angry` | `stressed` | `angry` | `confused` |
| **Bản đồ thế giới (Map Walk)** | 4-frame Sprite | — | — | — | — |
| **Khám phá Ruộng lúa** | — | `stressed` / `worried` / `relieved` | — | — | — |
| **Khám phá Hợp tác xã** | — | — | `stressed` / `worried` / `relieved` | — | — |
| **Khám phá Nhà máy** | — | — | — | `stressed` / `thinking` / `relieved` | — |
| **Màn mời quay lại (Invite)** | — | `stressed` $\to$ `relieved` | `stressed` $\to$ `relieved` | `stressed` $\to$ `relieved` | — |
| **Hội trường đối thoại (Hall)** | — | `angry` / `worried` / `relieved` | `stressed` / `thinking` / `relieved` | `angry` / `thinking` / `relieved` | — |
| **Biến cố xâm nhập mặn** | `stressed` | `worried` | `worried` | `stressed` | `stressed` |
| **Kết thúc A: Hợp tác bền vững** | `happy` | `happy` | `happy` | `happy` | `happy` |
| **Kết thúc B: Thỏa thuận có điều kiện** | `thinking` | `thinking` | `thinking` | `thinking` | `thinking` |
| **Kết thúc C: Đổ vỡ liên kết** | `worried` | `worried` | `worried` | `worried` | `worried` |

---

## 5. CHECKLIST KIỂM ĐỊNH BẢO VỆ CHẤT LƯỢNG (QA INTEGRITY CHECKLIST)
- [x] Đủ 40/40 biểu cảm chân dung gốc từ `bang_bieu_cam_goc.png`, tuyệt đối không dùng emoji ghép đè.
- [x] Đúng 4 khung hình Sprite di chuyển bước chân tự nhiên cho Minh An, không cắt khúc ngang thân, không chân que.
- [x] Kích thước đồng nhất $512 \times 640\text{ px}$ (ratio 0.8), neo chân đế tại $Y = 635\text{ px}$.
- [x] Xóa bỏ triệt để biến dạng mặt `scaleY()` và rung chấn giật hình `portraitBounce`.
- [x] Đã kiểm thử trình duyệt thực tế qua Playwright tại 4 độ phân giải màn hình + zoom 125% + reduced-motion đạt 100% Pass.
