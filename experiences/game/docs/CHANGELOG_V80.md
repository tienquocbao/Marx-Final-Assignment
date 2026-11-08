# Changelog v8.0 — 2026-11-08

## Nâng cấp cốt lõi

- Tách catalog và engine dùng chung browser/Node, giữ gameplay, asset và nhận diện hiện có.
- Kết thúc dựa đồng thời điều kiện cá thể, veto, niềm tin riêng, khả thi, tham gia, môi trường và biến cố. Sửa phản biện để có thể giải quyết bằng cơ chế bảo đảm phù hợp.
- Memory lưu đề xuất gây lo và lịch sử quan hệ; dialogue/portrait theo chứng cứ, điều khoản, trust, concern, lịch sử và sự kiện.
- Nhật ký ghi lựa chọn, chứng cứ, được/mất, phản ứng và hệ quả; không cộng dồn khi thử lại.
- Thêm Knowledge Panel và concept map, debrief, 5 chỉ báo hành vi, quiz 10 tình huống, tranh biện theo rubric và TXT tổng hợp.
- Save v8, validation/migration/fallback; cảnh báo storage, giữ save tương lai, tránh ghi đè checkpoint khi xem kiến thức từ màn đầu.
- Sửa xác minh sở hữu chứng cứ tại handler, báo cáo cuối không còn ghi cứng 9/9.
- Giữ nhạc/SFX có sẵn; nhạc tension khi biến cố, phục hồi khi Escape; typewriter hỗ trợ trợ năng và reduced motion.
- Sửa focus khi đổi màn/tái tạo nút, dialog có trap/khôi phục focus, background inert, tương phản chữ phụ cũ.
- Build standalone riêng, kiểm tra cold offline, giữ source tách file.

## File thay đổi

**Sửa:** `index.html`, `scripts/game.js`, `styles/game.css`, `README.md`, `docs/README.md`, `docs/KICH_BAN_MC_7_PHUT.md`, `tools/test_game_qa.py`; thêm nhãn lịch sử và link tương đối cho một số tài liệu cũ.

**Thêm source:** `scripts/game-data.js`, `scripts/simulation.js`, `scripts/learning-content.js`, `scripts/learning.js`.

**Thêm công cụ:** `tools/browser_support.py`, `tools/build_offline.py`, `tools/test_simulation.cjs`, `tools/test_v80.py`, `tools/test_assets.py`, `tools/test_accessibility.py`, `tools/run_qa.py`, `tools/requirements-qa.txt`, `tools/write_release_reports.py`.

**Thêm tài liệu:** baseline, balance, academic map, architecture, user guide, test report, changelog và final release report v8.

**Thêm phát hành/minh chứng:** `dist/Vung_Con_Xanh_v8_0_Offline.html`, `dist/manifest.json`, `artifacts/qa/`, `screenshots/v80/`, `screenshots/v80-legacy/`.

**Xóa:** không xóa source, asset hay tài liệu cũ. Không đọc/sửa/giải nén ZIP lồng. 118 asset trước nâng cấp có manifest SHA-256 và được kiểm tra nguyên vẹn.

## Quyết định phạm vi

Không thêm mini-game cung cầu hoặc c/v; ưu tiên chiều sâu đàm phán, phản biện, simulation và học tập. Không dùng framework, backend, API AI hoặc tài nguyên mạng khi chơi. Không tạo tranh biện nhập tự do vì chấm NLP offline không đủ căn cứ trong phạm vi này; rubric áp dụng lựa chọn có cấu trúc và nêu rõ giới hạn.

## Nghiệm thu

Đọc `TEST_REPORT_V80.md` và `FINAL_RELEASE_REPORT_V80.md`. Kết quả cũ không được coi là bằng chứng cho v8. Chưa thể xác minh slide gốc, diễn tập lớp, âm thanh nghe thực, máy chiếu và công cụ đọc màn hình trên thiết bị đích.

## Bổ sung Modular Vanilla sau commit 11067bf

- Tiếp tục trên source v8 đã hoàn thành; chạy baseline 230/230 PASS trước refactor và lưu JSON/log tại `artifacts/modular-baseline/`.
- `scripts/game.js` giữ đường dẫn, trở thành composition root: tạo store/services, nối module và lifecycle; không xóa file hoặc thay UI/cốt truyện/luật mô phỏng.
- Thêm `scripts/core/{modules,state}.js`, `characters/memory.js`, `simulation/session.js`, `story/dialogue.js`, `exploration/evidence.js`, `negotiation/index.js`, `assessment/{model,index,report}.js`, `ui/{rendering,ending,journal}.js`, `audio.js`, `storage/{migration,save-load}.js`.
- Chuyển triển khai memory/dialogue/migration và assessment model vào đúng trách nhiệm; giữ API simulation v8 tương thích. Các feature có closure riêng, dependency theo tên và store được inject; không giữ tham chiếu state cũ sau reset/resume.
- Registry phát hiện dependency thiếu/trùng/vòng; không mạng, eval, framework hoặc dynamic loader. Classic script giữ source file://; đã đánh giá và chưa dùng ESM vì giới hạn module loader khi mở file trực tiếp.
- Nội dung học thuật, schema/key save, asset và cách trình chiếu giữ nguyên. Source được định dạng lại để đọc/bảo trì dễ hơn.
- Thêm `tools/test_modules.cjs`, `tools/test_modular_browser.py`, `tools/browser_test_bridge.js`; mở rộng runner/asset/DOM/syntax/hash sang thư mục module con. Test cũ dùng bridge chỉ do Playwright inject; bridge không có trong sản phẩm. Test production riêng không dùng bridge.
- Đối chiếu 48 contract gốc, exhaustive giữ cùng phân bố A/B/C; kiểm tra source và standalone offline thực tế, save v8 trước refactor, reset, UI và global scope. Kết quả cuối lấy từ báo cáo QA, không dùng số dự kiến.
- Lượt hồi quy đầu phát hiện test decode asset còn đọc bảng global cũ; chuyển test sang API module, giữ nguyên tiêu chí 49 hình/9 audio. Log FAIL ban đầu được giữ tại `artifacts/modular-first-run/`.
- Build lại `dist/`, cập nhật README, kiến trúc, hướng dẫn và báo cáo phát hành; không xóa file gameplay hoặc asset nào.
