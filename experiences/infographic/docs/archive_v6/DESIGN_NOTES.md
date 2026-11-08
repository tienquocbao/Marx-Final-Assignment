# Thiết kế infographic v6 — 6 vùng tổng quan, xanh lá

## Nguyên tắc

1. **Infographic first.** Người xem bắt đầu bằng một poster dọc thật sự, thấy liên tục đầy đủ mạch thông tin.
2. **Poster grammar.** Header ribbon + số thứ tự + infographic schematic + các box gọn + lời chốt. Mỗi vùng không phải màn slide độc lập.
3. **Phân tầng.** Thông điệp ngắn nằm ở poster; nội dung theo giáo trình/slide được mở sâu sau thao tác bấm.
4. **Màu sắc.** Xanh lá đậm `#124731`, xanh trung `#3d9460`, nền kem `#fcfbf2`, cam `#ca6e38` dành cho mâu thuẫn, vàng lúa `#e5c56c` cho trọng tâm.
5. **Chuyển cảnh có ý nghĩa.** Bấm từ biểu tượng trong poster → biểu tượng phóng đi vào khung minh họa trong lớp chi tiết. Không điều hướng sang một web-slide khác.
6. **Đọc được trên máy chiếu.** Trọng tâm không dùng chữ in sẵn trong ảnh bitmap. Các minh họa SVG và chữ HTML giữ sắc nét khi mở rộng.

## Tỉ lệ

- Desktop 1920px: **6 × 1080px = 6480px**, mỗi vùng một nhóm infographic nằm trong poster chung.
- Máy chiếu 1280px và di động: ưu tiên responsive, tăng chiều cao theo nội dung thay vì cắt chữ.

## Giải pháp kỹ thuật

- Chỉ một `index.html`, còn lại CSS, JavaScript, SVG, ảnh reference, nhạc tách riêng.
- Sử dụng inline event delegation trên `[data-detail]` và một modal dialog phi-điều-hướng.
- Shared ghost image cho cảm giác cùng phần tử bay từ poster vào khung chi tiết; tôn trọng giảm chuyển động.
- Sau khi đóng modal, khôi phục `scrollY` và focus cũ.
- Chỉ sử dụng `VCX_CONTENT` kế thừa từ v5 để không tự sáng tác thêm dữ kiện.

## Những gì cố ý không làm

- Không render lại 32 slide.
- Không tái sử dụng ảnh avatar đã từng lỗi ở web game Vùng Cồn Xanh.
- Không chạy nhạc khi chưa có thao tác bật.
- Không tạo biểu đồ % không có nguồn hay thống kê mới.
