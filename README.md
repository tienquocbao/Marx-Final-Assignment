# VÙNG CỒN XANH v8.0 — MLN122

Visual novel mô phỏng giáo dục về quan hệ lợi ích kinh tế giữa nông dân, HTX, doanh nghiệp và vai trò điều tiết của Nhà nước. Giữ truyện, 5 nhân vật, 40 portrait, 9 chứng cứ, 3 khu điều tra, 3 mini-game và kết thúc A/B/C.

## Chạy game offline

- Mở **[index.html](index.html)** bằng Chrome/Edge hiện đại. Giữ `scripts/`, `styles/`, `assets/` cùng thư mục. Không cần cài thư viện để chơi.
- Bản một file: **[dist/Vung_Con_Xanh_v8_0_Offline.html](dist/Vung_Con_Xanh_v8_0_Offline.html)**. Có thể chép riêng file này sang máy trình chiếu. Bản này được build từ source rời và kiểm tra trong trình duyệt khi ngắt mạng.
- Nếu máy chặn tài nguyên `file://`, chạy `python -m http.server 8000 --bind 127.0.0.1` tại thư mục hiện tại, mở `http://127.0.0.1:8000/`. Đây là server tĩnh trên máy, không phải backend.
- ZIP lồng `Vung_Con_Xanh_Repo.zip` không được dùng làm source hoặc đầu vào build.

## Những gì có ở v8.0

- Simulation tính điều kiện tối thiểu, quyền từ chối ký, lo ngại thiết yếu, tính khả thi, niềm tin riêng và lợi ích cộng đồng. Tổng lợi ích cao không thay thế đồng thuận.
- NPC nhớ đề xuất bất lợi và phản hồi khi điều khoản được sửa. Lịch sử ghi chứng cứ, được/mất, phản ứng và hệ quả.
- **🐟 Kiến thức** giải thích tình huống theo 5 mục và nối 9 chứng cứ với chủ thể, quyết định, khái niệm.
- **💬 Tranh biện** tại phòng họp: chọn luận điểm, căn cứ, nguyên nhân, cách xử lý và sắp lập luận; rubric 4 tiêu chí, không gọi AI.
- **🌱 Học tập** và debrief cuối game: 5 chỉ báo hành vi, giải thích kết quả, mâu thuẫn còn tồn tại; quiz 10 tình huống giải thích từng phương án; xuất báo cáo TXT gồm nhật ký và khuyến nghị ôn tập.
- Save schema v8, kiểm tra dữ liệu, tiếp tục save v71/v7/v6/v4 còn hợp lệ; giữ nguyên key cũ. Lưu chỉ trên trình duyệt hiện tại.
- Giữ phong cách cũ, bổ sung focus, dialog, tương phản, typewriter có hỗ trợ giảm chuyển động và nhạc căng thẳng khi biến cố.

## Kiến trúc Modular Vanilla

`game.js` là điểm khởi tạo và nối module. Core state, simulation, NPC memory, story/dialogue, exploration/evidence, negotiation, learning, assessment, UI, audio và save/load có trách nhiệm riêng. State được inject vào module, engine không dùng DOM. Không đổi schema/key save v8 hoặc gameplay.

Module factory có scope riêng và dependency tường minh, dùng classic script để vẫn mở source bằng `file://`. Chỉ namespace `VCX` nằm trên browser; không cần framework hoặc bước build để chơi source. Xem [kiến trúc và cách mở rộng](docs/ARCHITECTURE_V80.md). Bản standalone tiếp tục được build và test cold offline thực tế.

## Cách chơi và trình chiếu

Bắt đầu → khám phá ruộng/HTX/nhà máy → ghép 3 nút thắt → mời ba bên bằng chứng cứ → sửa 3 điều khoản và chọn 4 công cụ Nhà nước → ứng phó độ mặn → xem debrief và quiz.

Bản đồ dùng WASD/phím mũi tên, nhấp vị trí để đi, **E** tương tác; điện thoại có nút chạm. Dùng **Tab**, **Enter**, **Space** để điều khiển; **Escape** đóng bảng đang mở. Nhạc bắt đầu sau thao tác người chơi, có bật/tắt và thanh âm lượng.

Bật **Chế độ trình chiếu** trước khi bắt đầu: truyện rút gọn, mỗi nơi chuẩn bị 2 chứng cứ hỗ trợ, bàn họp có sẵn 2 điều khoản + 2 công cụ; lớp quyết định 3 mục còn lại. Mục tiêu 5–7 phút cần diễn tập, chưa đo trên lớp thật. Tranh biện và quiz thích hợp cho phần thảo luận sau đó.

## Build và kiểm thử

```sh
python tools/build_offline.py
node tools/test_simulation.cjs
node tools/test_modules.cjs
uv run --with-requirements tools/requirements-qa.txt python tools/run_qa.py
```

QA cần Node 18+, Python 3.10+, `uv` và Chromium/Edge. Script tự tìm trình duyệt cục bộ; đặt `VCX_BROWSER=/đường/dẫn/trình-duyệt` nếu cần. Nếu chưa có browser, dùng `uv run --with playwright playwright install chromium` (chỉ cần mạng lúc chuẩn bị công cụ).

Audit WCAG bổ sung cần axe-core dành riêng cho QA:

```sh
npm install --prefix /tmp/vcx-qa axe-core@4.14.0
# hoặc đặt VCX_AXE=/đường/dẫn/axe.min.js
```

Không có axe thì suite ghi **BLOCKED**, không ghi PASS. Game không dùng các gói QA, CDN, font ngoài, API, backend hay dịch vụ AI. Kiểm thử gồm contract trước/sau refactor, dependency/state/save và production browser không QA bridge. Baseline trước Modular ở `artifacts/modular-baseline/`. Kết quả hiện tại ở `artifacts/qa/`; screenshot mới ở `screenshots/v80/`.

## Tài liệu và giới hạn

- [Báo cáo phát hành](docs/FINAL_RELEASE_REPORT_V80.md), [kết quả QA](docs/TEST_REPORT_V80.md), [baseline](docs/V80_BASELINE.md).
- [Hướng dẫn chơi](docs/USER_GUIDE_V80.md), [kiến trúc](docs/ARCHITECTURE_V80.md), [cân bằng](docs/GAMEPLAY_BALANCE_V80.md), [bản đồ học thuật](docs/ACADEMIC_CONTENT_MAP_V80.md), [changelog](docs/CHANGELOG_V80.md).
- Không có PDF/slide MLN122 gốc trong repository: nội dung mới là diễn giải học tập từ tình huống và tài liệu nhóm, **cần giảng viên đối chiếu**, không trích nguyên văn hay xác nhận số trang.
- Chỉ số mô phỏng và rubric không phải dữ liệu kinh tế, khuyến nghị chính sách hay điểm đánh giá năng lực chính thức. Tranh biện chỉ chấm các cấu trúc đã thiết kế.
- Cần kiểm tra âm thanh nghe thực tế, máy chiếu, màn hình cảm ứng, công cụ đọc màn hình và trình duyệt đích trên máy của nhóm. Xem phạm vi cụ thể trong báo cáo QA.
