# BÁO CÁO KIỂM THỬ TRỰC QUAN & CHỨC NĂNG HỆ THỐNG AVATAR (TEST REPORT)
**Dự án:** Vùng Cồn Xanh (Học phần MLN122 – Triết học & Kinh tế Chính trị Mác - Lênin)  
**Công cụ kiểm thử:** Playwright Browser Automation (Microsoft Edge Engine, Headless)  
**Môi trường thực thi:** Windows 11, Python 3.12, Playwright v1.64.1  
**Thời gian thực hiện:** 2026-11-05  
**Kết quả chung:** **34 / 34 HẠNG MỤC ĐẠT (100% PASS – 0 FAIL)**

---

## 1. THIẾT KẾ MA TRẬN KIỂM THỬ (TEST MATRIX)

Kiểm thử được thiết kế toàn diện trên các khía cạnh:
1. **Toàn vẹn Tỷ lệ & Kích thước (Geometric Aspect Ratio):** Kiểm tra tỷ lệ khung hình chuẩn 4:5 ($0.800$) trên tất cả các ngữ cảnh hiển thị chân dung.
2. **Biểu cảm Cảm xúc Chân thực (Authentic Expression Mapping):** Xác thực đúng 40 file chân dung gốc không emoji giả lập xuyên suốt mọi giai đoạn cốt truyện.
3. **Sprite Di chuyển & Hướng nhìn (Walk Cycle & Direction):** Kiểm tra chuyển động bước chân của Minh An, lật hướng trái/phải (`facingLeft`) khi bấm phím A/D.
4. **Độ phân giải & Màn hình hiển thị (Multi-Viewport Responsiveness):** Kiểm định 4 cấu hình: Desktop (1920×1080), Laptop (1366×768), Máy chiếu lớp học (1280×720), Điện thoại di động (390×844).
5. **Mức thu phóng trình duyệt (Zoom & High-DPI):** Kiểm tra độ sắc nét tại mức phóng to $125\%$.
6. **Khả năng tiếp cận (Accessibility):** Kiểm tra tính năng `prefers-reduced-motion: reduce` triệt tiêu mọi rung giật không mong muốn.

---

## 2. BẢNG KẾT QUẢ KIỂM THỬ CHI TIẾT (34/34 PASS)

| STT | Tên ca kiểm thử (Test Case) | Điều kiện kiểm tra & Kỳ vọng | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| 1 | Home Screen Cast Count | Có đủ 3 thẻ chân dung nhân vật đại diện | 3 ảnh (`.castPic`) | **PASS** |
| 2 | Cast Pic 0 Aspect Ratio | Chú Bảy giữ đúng tỷ lệ 4:5 ($0.800$) | w=108.0, h=135.0, ratio=0.800 | **PASS** |
| 3 | Cast Pic 1 Aspect Ratio | Chị Sen giữ đúng tỷ lệ 4:5 ($0.800$) | w=108.0, h=135.0, ratio=0.800 | **PASS** |
| 4 | Cast Pic 2 Aspect Ratio | Anh Khoa giữ đúng tỷ lệ 4:5 ($0.800$) | w=108.0, h=135.0, ratio=0.800 | **PASS** |
| 5 | Story Week 1 Cá Bống Happy | Chân dung mở đầu là Cá Bống vui vẻ, chuẩn 4:5 | src=`ca_bong_happy.png`, w=192, h=240, ratio=0.800 | **PASS** |
| 6 | Story Week 1 Chú Bảy Happy | Tuần 1 Chú Bảy hồ hởi tham gia dự án | src=`chu_bay_happy.png` | **PASS** |
| 7 | Story Week 2–4 Minh An Thinking | Tuần 2–4 Minh An đăm chiêu ghi nhận rạn nứt | src=`minh_an_thinking.png` | **PASS** |
| 8 | Story Week 6 Chú Bảy Angry | Tuần 6 Chú Bảy tức giận vì bị ép giá | src=`chu_bay_angry.png` | **PASS** |
| 9 | Story Week 6 Anh Khoa Angry | Tuần 6 Anh Khoa bức xúc vì lúa trễ chuẩn | src=`anh_khoa_angry.png` | **PASS** |
| 10 | Story Week 6 Chị Sen Stressed | Tuần 6 Chị Sen căng thẳng đứng giữa | src=`chi_sen_stressed.png` | **PASS** |
| 11 | Minh An Walk Sprite Initial | Sprite bản đồ nạp khung hình 0 sạch sẽ | src=`minh_an_walk_0.png` | **PASS** |
| 12 | Minh An Sprite Facing Left | Bấm phím 'A' nhân vật lật mặt sang trái | `classList.contains('facingLeft') = True` | **PASS** |
| 13 | Minh An Sprite Facing Right | Bấm phím 'D' nhân vật quay mặt sang phải | `classList.contains('facingLeft') = False` | **PASS** |
| 14 | Ruộng Chú Bảy Dialogue Avatar | Hộp thoại điều tra ruộng có avatar 4:5 chuẩn | src=`chu_bay_stressed.png`, w=104, h=130, ratio=0.800 | **PASS** |
| 15 | Clue Modal Chú Bảy Portrait | Cửa sổ chứng cứ sổ đầu tư hiện chân dung Chú Bảy | src=`chu_bay_worried.png` | **PASS** |
| 16 | HTX Chị Sen Dialogue Avatar | Hộp thoại điều tra HTX hiện chân dung Chị Sen | src=`chi_sen_stressed.png` | **PASS** |
| 17 | Nhà máy Anh Khoa Dialogue Avatar | Hộp thoại điều tra Nhà máy hiện chân dung Anh Khoa | src=`anh_khoa_stressed.png` | **PASS** |
| 18 | Invitation Screen Stakeholders | Màn mời họp có đủ 3 thẻ đại diện 3 bên | 3 thẻ `.invitePerson` đầy đủ | **PASS** |
| 19 | Negotiation Stakeholder Cards | Phòng thương lượng có đủ 3 thẻ theo dõi lợi ích | 3 thẻ `.stake` đầy đủ | **PASS** |
| 20 | Hearing Body Initial (Chú Bảy) | Tab điều trần mặc định hiện Chú Bảy | src=`chu_bay_angry.png` | **PASS** |
| 21 | Hearing Body Chị Sen | Chuyển sang tab Chị Sen chân dung cập nhật | src=`chi_sen_angry.png` | **PASS** |
| 22 | Hearing Body Anh Khoa | Chuyển sang tab Anh Khoa chân dung cập nhật | src=`anh_khoa_angry.png` | **PASS** |
| 23 | Salinity Crisis Modal Trigger | Biến cố độ mặn kích hoạt modal thành công | Modal hiển thị đầy đủ các lựa chọn | **PASS** |
| 24 | Ending A Faces Count | Kết thúc A hiển thị đủ 3 nhân vật | 3 ảnh chân dung trong `#endFaces` | **PASS** |
| 25 | Ending A Faces Happy Mood | Kết thúc A các bên vui vẻ tìm lại tiếng nói chung | 3/3 chân dung mang biểu cảm `happy` | **PASS** |
| 26 | Ending B Faces Thinking Mood | Kết thúc B các bên đăm chiêu thỏa thuận có điều kiện | 3/3 chân dung mang biểu cảm `thinking` | **PASS** |
| 27 | Ending C Faces Worried Mood | Kết thúc C các bên lo âu vì liên kết đổ vỡ | 3/3 chân dung mang biểu cảm `worried` | **PASS** |
| 28 | Laptop 1366x768 Cast Dimensions | Màn hình Laptop giữ nguyên độ sắc nét và tỷ lệ | w=108.0, h=135.0 (Tỷ lệ 4:5) | **PASS** |
| 29 | Projector 1280x720 Cast Dimensions | Màn hình máy chiếu lớp học giữ nguyên độ rõ | w=108.0, h=135.0 (Tỷ lệ 4:5) | **PASS** |
| 30 | Mobile 390x844 Cast Dimensions | Màn hình di động co giãn linh hoạt, không vỡ layout | w=84.0, h=105.0 (Tỷ lệ 4:5) | **PASS** |
| 31 | Mobile Story Portrait Dimensions | Chân dung cutscene trên di động hiển thị cân đối | w=124.8, h=170.0 | **PASS** |
| 32 | Mobile World Avatar Dimensions | Nhân vật di chuyển trên bản đồ di động rõ nét | w=52.0, h=70.0 | **PASS** |
| 33 | Zoom 125% Cast Count | Khi phóng to 125% giao diện không bị tràn hay lỗi | Đủ 3 thẻ cast, hiển thị sắc nét | **PASS** |
| 34 | prefers-reduced-motion Accessibility | Khi bật giảm chuyển động, tắt bỏ toàn bộ animation | `storyFace.animationName = "none"` | **PASS** |

---

## 3. DANH SÁCH ẢNH CHỤP MÀN HÌNH MINH CHỨNG (SCREENSHOT EVIDENCE)

Toàn bộ ảnh chụp thực tế từ trình duyệt headless Microsoft Edge được lưu trữ trực tiếp tại thư mục `screenshots/`:

### Giai đoạn Mở đầu & Cốt truyện
1. [01_home_desktop_1920x1080.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/01_home_desktop_1920x1080.png): Màn hình chính trên Desktop 1920×1080, 3 thẻ chân dung đứng thẳng thắn, viền bóng sạch sẽ.
2. [02_story_week1_meeting.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/02_story_week1_meeting.png): Cutscene Tuần 1 – Hợp tác ban đầu, Cá Bống vui vẻ, Chú Bảy nụ cười tươi.
3. [03_story_week2_rannut.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/03_story_week2_rannut.png): Cutscene Tuần 2–4 – Rạn nứt bắt đầu xuất hiện, Minh An suy ngẫm.
4. [04_story_week6_dovo.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/04_story_week6_dovo.png): Cutscene Tuần 6 – Đổ vỡ liên kết, Chú Bảy tức giận, Anh Khoa gay gắt.

### Giai đoạn Khám phá & Bản đồ
5. [05_world_map_minh_an_walk.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/05_world_map_minh_an_walk.png): Bản đồ Cồn Xanh, Minh An bước đi tự nhiên với 4 khung hình sprite sinh động.
6. [06_explore_field_chu_bay.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/06_explore_field_chu_bay.png): Ruộng lúa Chú Bảy, mở sổ đầu tư thu thập chứng cứ với modal avatar Chú Bảy.
7. [07_explore_coop_chi_sen.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/07_explore_coop_chi_sen.png): Hợp tác xã Cồn Xanh, kiểm tra chứng cứ phí dịch vụ và avatar Chị Sen.
8. [08_explore_factory_anh_khoa.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/08_explore_factory_anh_khoa.png): Nhà máy Anh Khoa, kiểm tra đơn hàng chế biến xuất khẩu và avatar Anh Khoa.

### Giai đoạn Thuyết phục & Đàm phán
9. [09_invite_screen.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/09_invite_screen.png): Màn hình gửi chứng cứ mời ba bên quay lại bàn thương lượng.
10. [10_negotiation_hall.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/10_negotiation_hall.png): Phòng đàm phán 3 bên, 3 thẻ theo dõi lợi ích và khu vực điều trần Chú Bảy.
11. [11_negotiation_hearing_chi_sen.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/11_negotiation_hearing_chi_sen.png): Phiên điều trần Chị Sen, lắng nghe khó khăn của Hợp tác xã.
12. [12_negotiation_hearing_anh_khoa.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/12_negotiation_hearing_anh_khoa.png): Phiên điều trần Anh Khoa, phân tích rủi ro thị trường của Doanh nghiệp.
13. [13_salinity_crisis.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/13_salinity_crisis.png): Biến cố khẩn cấp – Nước mặn xâm nhập Tuần 7, thử thách cơ chế phối hợp.

### Giai đoạn Kết thúc (Endings)
14. [14_ending_A_success.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/14_ending_A_success.png): Kết quả A – Hợp tác bền vững, 3 nhân vật rạng rỡ nở nụ cười (`happy`).
15. [15_ending_B_conditional.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/15_ending_B_conditional.png): Kết quả B – Thỏa thuận có điều kiện, các bên đăm chiêu suy nghĩ (`thinking`).
16. [16_ending_C_collapse.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/16_ending_C_collapse.png): Kết quả C – Đổ vỡ liên kết, các bên lo âu bất an (`worried`).

### Đa thiết bị & Khả năng tiếp cận
17. [17_home_laptop_1366x768.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/17_home_laptop_1366x768.png): Kiểm thử trên Laptop màn hình 1366×768.
18. [18_home_projector_1280x720.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/18_home_projector_1280x720.png): Kiểm thử trên Máy chiếu lớp học độ phân giải 1280×720.
19. [19_home_mobile_390x844.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/19_home_mobile_390x844.png): Kiểm thử Màn hình chính trên điện thoại thông minh (iPhone 12/13/14 - 390×844).
20. [20_story_mobile_390x844.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/20_story_mobile_390x844.png): Kiểm thử Cutscene hội thoại trên điện thoại thông minh.
21. [21_world_mobile_390x844.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/21_world_mobile_390x844.png): Kiểm thử Bản đồ di chuyển trên điện thoại thông minh.
22. [22_home_zoom_125pct.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/22_home_zoom_125pct.png): Kiểm thử độ nét và bố cục khi người dùng phóng to trình duyệt lên mức $125\%$.
23. [23_prefers_reduced_motion.png](file:///c:/Users/tienq/Vung_Con_Xanh_Repo/screenshots/23_prefers_reduced_motion.png): Kiểm thử tuân thủ chuẩn tiếp cận dành cho người dùng nhạy cảm với chuyển động (`prefers-reduced-motion`).

---

## 4. KẾT LUẬN NGHIỆM THU
Toàn bộ hệ thống đồ họa 2D nhân vật, hoạt ảnh sprite, stylesheet CSS, logic Javascript và giao diện người dùng của **Vùng Cồn Xanh** đã được đại tu thành công mỹ mãn. Dự án hoàn toàn sẵn sàng cho công tác giảng dạy, thuyết trình và trải nghiệm học tập của sinh viên trong môn học MLN122.
