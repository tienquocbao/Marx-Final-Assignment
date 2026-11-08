# Báo cáo kiểm thử v8.0

Thời điểm tổng hợp UTC: 2026-11-08T05:07:41+00:00. Kết luận: **PASS trong phạm vi tự động**. Số đếm dưới đây lấy trực tiếp từ JSON/log đã chạy, không lấy từ báo cáo v7. Môi trường Linux x86_64, Node v22.23.3, Python 3.13 (uv), Playwright 1.64.1, Microsoft Edge Chromium 155.0.4283.45 headless, axe-core 4.14.0, tinycss2 1.5.1, html5lib 1.1.

## Trước và sau

Baseline: script Python nguyên trạng BLOCKED vì thiếu Playwright rồi đường dẫn Edge cố định không có. Bản sao source cũ chỉ đổi executable: **34/34 PASS**. Log nguyên vẹn: `artifacts/qa/baseline-legacy.txt`. Syntax PASS; 58 đường dẫn runtime hợp lệ; 118 asset gốc. Bộ cũ không đo console/network và một số ending chỉ được gán state để xem portrait.

Baseline bổ sung trước Modular: **230/230 assertion PASS**, build PASS trên commit `11067bf`. JSON/log được giữ tại `artifacts/modular-baseline/`.

| Suite sau nâng cấp và refactor | Assertion | PASS | FAIL | BLOCKED |
|---|---:|---:|---:|---:|
| assets | 52 | 52 | 0 | 0 |
| simulation | 16 | 16 | 0 | 0 |
| modules | 12 | 12 | 0 | 0 |
| modular-browser | 18 | 18 | 0 | 0 |
| legacy | 34 | 34 | 0 | 0 |
| browser | 130 | 130 | 0 | 0 |
| accessibility | 30 | 30 | 0 | 0 |
| Tổng assertion | 292 | 292 | 0 | 0 |

Build chạy riêng, trạng thái: PASS. Không cộng 1.417.176 mẫu exhaustive vào số assertion để tránh thổi phồng số test độc lập.

## Technical

- Asset integrity/manifest: 118 asset gốc giữ nguyên byte; 58 đường dẫn runtime tồn tại. Không đọc ZIP lồng.
- Node syntax cho 21 script, bao gồm các thư mục module con; HTML5 parse không lỗi; ID không trùng; CSS parse không lỗi; kiểm tra tham chiếu DOM.
- Không có dependency remote runtime. Bản source và standalone đều cold-start được khi context trình duyệt offline.
- Cả 49 hình runtime (40 portrait + 5 cảnh + 4 sprite) decode; 9 OGG load metadata trong source và standalone. Bản một file được chép vào thư mục tạm độc lập trước khi test.
- Console pageerror: **0**. HTTP error/thất bại tải thực: **0**. Request bị trình duyệt hủy do điều hướng/đóng context được ghi riêng (`cancelledRequests`), không coi như missing asset; mọi hình và audio có kiểm tra decode riêng.
- MIME OGG cố định trong packager sau khi phát hiện môi trường uv không có MIME table hệ điều hành. Test chống tái phát nằm trong asset suite.

## Gameplay và tính năng mới

PASS/FAIL thực tế từng assertion nằm trong `artifacts/qa/browser.json` và `.log`.

- Hành trình đầy đủ: mở truyện, Enter tiến đúng một câu, đọc hết mở đầu, di chuyển bản đồ bằng phím và đi tới điểm, ba cuộc điều tra/9 chứng cứ.
- Giải thật 3 mini-game, mỗi trò có thử sai; ghép chứng cứ sai rồi đúng; mời sai hồ sơ rồi mời đủ ba bên; cả hai nhiệm vụ phụ thử sai và hoàn thành.
- Chặn công cụ chưa có chứng cứ; đề xuất giá gây veto dù tổng lợi ích cao; sửa rồi NPC nhớ và thay đổi dialogue.
- Knowledge Panel, mapping 9 chứng cứ, giải thích HTX; ba bài tranh biện thử thiếu đầu vào, thứ tự sai rồi lập luận đầy đủ.
- Ending A qua toàn bộ luồng; B/C và A chiến lược khác đi từ checkpoint thật đã hoàn thành điều tra, qua UI quyết định/biến cố; không gán `state.result` để tính là kiểm thử ending.
- Demo hoàn chỉnh trên mobile 390px; chuẩn bị 2 điều khoản/2 công cụ không tự tính điểm học tập; 3 quyết định còn lại dẫn đến A.
- Debrief, 5 chỉ báo, quiz 10 câu có một câu sai để thử giải thích/ôn tập, tiếp tục quiz sau reload, TXT có history/profile/quiz.
- Save localStorage thật HTTP và file://; v71 migration giữ key cũ; JSON hỏng, dữ liệu lồng sai kiểu, phiên bản tương lai, lỗi quota; xem kiến thức ở home không ghi đè checkpoint. Reset hủy và xác nhận có test.
- Escape biến cố phục hồi nhạc ngày; modal trap focus; map không nhận phím xuyên modal; các màn mới fit 390px; Tab/Enter/Space và reduced motion.

## Modular regression

- `12/12` nhóm Node: dependency graph không vòng, registry lỗi/khởi tạo một lần, import không DOM, state độc lập/thay state, save adapter/legacy/future/quota và assessment thuần.
- Đối chiếu đúng 48 contract evaluate/dialogue/migrate chụp từ engine commit `11067bf`; mẫu được giữ ở `artifacts/modular-baseline/contracts.json`. Không thay luật ending để làm test qua.
- `18/18` assertion trên source và standalone cold offline **không dùng QA bridge**: không rò binding gameplay global, resume save v8 trước refactor, UI đạt A, sửa thỏa thuận, reset/begin/thu chứng cứ, keyboard và mobile.
- Các bộ UI cũ chỉ nạp `tools/browser_test_bridge.js` qua Playwright cho white-box assertions. Bridge không có trong HTML sản phẩm hoặc bản đóng gói. Kiểm tra decode asset dùng API liệt kê asset của module.
- Lượt regression đầu có một FAIL do test cũ đọc `PORTRAITS` global sau khi đã đóng scope. Giữ log/JSON thật tại `artifacts/modular-first-run/`; đã sửa test dùng API module, không giảm yêu cầu 49 hình/9 audio.

## Simulation

**1,417,176** trạng thái cuối (3^7 lựa chọn × 3^4 proof × 4 nhiệm vụ phụ × 2 kết quả biến cố).

| Kết quả | Số trạng thái |
|---|---:|
| A | 37,692 |
| B | 360,504 |
| C | 1,018,980 |

**124** bộ phương án điều khoản/công cụ có thể dẫn tới A. Mọi A phải qua toàn bộ checks, không critical concern, đủ minimum/trust/environment/crisis. Đây không phải xác suất thắng. Exhaustive dùng memory ban đầu; lịch sử dài dùng các test xác định riêng, không tuyên bố duyệt mọi chuỗi hành vi vô hạn.

## Accessibility

axe audit các màn home, hồ sơ cũ, story, map, explore, chứng cứ, board, invitation, hall, crisis, ending, knowledge, dashboard, debate, quiz ở 1366 và 390px. Kết quả 30/30 PASS theo các tag WCAG2A/AA/2.1AA. Còn 176 node-check trong mục `incomplete` yêu cầu đánh giá thủ công; axe PASS không phải chứng nhận toàn bộ WCAG. Bộ browser kiểm tra thêm 1920×1080, 1366×768, 1280×720, 390×844 và reduced motion. Device scale factor 1.25 trong suite cũ là HiDPI, không thay kiểm thử browser zoom thực.

## FAIL/BLOCKED trong bộ đã chạy

Không còn assertion FAIL hoặc BLOCKED trong các suite đã chạy.

## BLOCKED và NOT TESTED ngoài automation

| Mục | Trạng thái | Lý do / việc cần làm |
|---|---|---|
| Đối chiếu nguyên văn và số trang giáo trình/slide MLN122 | BLOCKED | Không có tài liệu gốc; nội dung v8 gắn nhãn diễn giải cần giảng viên đối chiếu |
| Diff/commit Git | PASS | Đã nối lại lịch sử nhánh `main` từ repository GitHub khi chuẩn bị xuất bản; manifest/hash vẫn giữ bằng chứng QA |
| Nghe âm thanh qua loa/HDMI thực | NOT TESTED | Metadata/playback browser không chứng minh âm lượng và chất lượng trên thiết bị |
| Máy chiếu thật, toàn màn hình theo chính sách máy trường | NOT TESTED | Cần chạy trên laptop/thiết bị đích |
| Người học mới, thời lượng MC 5–7 phút | NOT TESTED | Chưa có playtest/diễn tập thực tế |
| NVDA/VoiceOver/Orca, zoom thực 125–200%, cảm ứng vật lý | NOT TESTED | Focus/ARIA/axe và viewport automation chưa thay trải nghiệm máy thật |
| Firefox/Safari và tất cả chính sách storage file:// | NOT TESTED | Chỉ xác minh Edge Chromium hiện có |
| W3C conformance và mọi tiêu chí WCAG | NOT TESTED | Có HTML/CSS parser/axe, chưa là chứng nhận standards đầy đủ |

## Bằng chứng và tái lập

`artifacts/qa/summary.json`, `assets.json`, `simulation.json`, `legacy.json`, `browser.json`, `accessibility.json`, `modules.json`, `modular-browser.json`; log cùng tên. Screenshot mới `screenshots/v80/`, hồi quy portrait `screenshots/v80-legacy/`. `learning-report.txt` là báo cáo thực tải từ browser QA.

```sh
npm install --prefix /tmp/vcx-qa axe-core@4.14.0
uv run --with-requirements tools/requirements-qa.txt python tools/run_qa.py
```

Đặt `VCX_BROWSER` và `VCX_AXE` nếu công cụ ở vị trí khác. Có thể chạy độc lập `node tools/test_simulation.cjs`, `python tools/build_offline.py`. QA dependencies chỉ cần khi kiểm thử, game chơi offline không cần chúng.
