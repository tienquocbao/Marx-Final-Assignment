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
