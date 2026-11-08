# Kiến trúc v8.0

## Nguyên tắc

HTML5 + CSS + JavaScript thuần, asset cục bộ, không backend hay kết nối mạng runtime. Giữ các section màn chơi và phong cách cũ. Các file script chạy theo thứ tự với `defer`; bản standalone giữ cùng thứ tự khi nhúng.

| File | Trách nhiệm |
|---|---|
| `scripts/game-data.js` | Catalog SCENES, POLICIES, CHARS, STATE_TOOLS; export UMD dùng chung browser/Node |
| `scripts/simulation.js` | Hàm thuần evaluate/effective/concerns/dialogue/mood, history và migration; không DOM/storage/random |
| `scripts/learning-content.js` | Nội dung 9 chứng cứ, 8 nhóm khái niệm, quiz 10 câu, 3 tình huống tranh biện và rubric |
| `scripts/game.js` | Truyện, khám phá, mini-game, ghép chứng cứ, mời họp, đàm phán, biến cố, điều khiển/audio và storage adapter |
| `scripts/learning.js` | Knowledge Panel, concept map, debate, quiz, profile, debrief, TXT và focus/typewriter |
| `styles/game.css` | Giao diện gốc + thành phần học tập, breakpoint và reduced motion |
| `tools/build_offline.py` | Nhúng CSS/JS và 58 asset runtime vào `dist/`; manifest SHA-256, không đọc ZIP |

## State và dữ liệu dẫn xuất

Giữ `found`, `done`, `minis`, `board`, `invited`, `policies`, `governance`, `govProof`, `mode`, `mapPos`, `npcTalk`, `sideQuests`, `crisis`, `result`. Mở rộng `saveVersion:8`, `decisionSerial`, `crisisSequence`, `memory`, `learning`, `decisions`.

`evaluate(state,catalog)` trả `actors` chứa interest profile, score, trust riêng, concerns, critical IDs, minimum và accepted; trả `community`, `checks`, `result`. Không ghi ngược các chỉ số dẫn xuất vào save để tránh dữ liệu stale. Current event được biểu diễn bằng `crisis` và chuỗi hành động; nhiệm vụ phụ thay đổi điều kiện dữ liệu/tiến độ.

`memory[bay|sen|khoa]` chứa concern đã gặp, tối đa 60 sự kiện quan hệ gần nhất và hội thoại gần nhất. Mối lo cũ đã sửa để lại thận trọng tối đa 6 điểm; giữ nguy cơ quan hệ nhưng không khóa đường hồi phục. Bấm lặp không tích lũy bonus.

Mỗi quyết định quan trọng ghi serial tăng dần, thời điểm, nguồn player/prepared, loại, lựa chọn, chứng cứ, được/mất, biến động ba chủ thể, niềm tin và mối lo khi quyết định, hệ quả và snapshot điều khoản. Giữ tối đa 500 mục để giới hạn localStorage. Nhiệm vụ phụ và biến cố cũng có lịch sử. Quyết định cũ không có trường mới được giữ theo dữ liệu thực, không bịa hệ quả.

## Chu trình thay đổi

1. Kiểm tra lựa chọn và sở hữu chứng cứ tại handler.
2. Chụp evaluate trước; thay đúng một điều khoản/công cụ.
3. Tính lại từ catalog và phương án hiện tại, không cộng điểm lặp.
4. Ghi history/memory; render phản biện và điều kiện ký.
5. Cập nhật gợi ý kiến thức, lưu bằng adapter.
6. Chỉ finish khi có đủ 3 điều khoản và 4 công cụ có chứng cứ. Ending được quyết định bằng tập điều kiện, không bằng tổng.

Debate/quiz lưu học tập nhưng không thay điểm kinh tế hoặc buộc NPC đồng thuận. Debrief tính từ hành vi và phương án, tách hồ sơ chuẩn bị trình chiếu khỏi quyết định chủ động.

## Save

Đọc lần lượt `vcx_v80`, `vcx_v71`, `vcx_v7`, `vcx_v6`, `vcx_v4`. Migration chấp nhận JSON object hợp lệ, lọc ID/kiểu dữ liệu, giới hạn số, khử trùng, kiểm tra tiến độ hợp lý, chuẩn hóa history/learning. Dữ liệu thiếu không được suy thành hành vi đã học. Key cũ không bị xóa.

Ghi chỉ `vcx_v80`; lỗi quota/quyền truy cập được thông báo nhưng không làm ngừng game. Save từ phiên bản tương lai được giữ nguyên, adapter khóa ghi trong phiên đó. Màn đầu cho xem kiến thức mà không ghi đè checkpoint đang chờ Resume. Reset yêu cầu xác nhận người chơi trong UI; thao tác xác nhận tạo state v8 mới, key lịch sử vẫn còn.

Bản lưu legacy giữ ending cũ nếu có để không thay kết quả lượt chơi đã hoàn tất; gắn nhãn kết thúc cũ và hiển thị kết quả đối chiếu cùng các điều kiện theo luật v8. Muốn đánh giá lại, chọn “Trở lại sửa thỏa thuận” và chạy biến cố. Save nằm theo origin/file path và trình duyệt; đổi vị trí file hoặc sang standalone có thể tạo vùng lưu khác.

## Khả năng tiếp cận và offline

Dialog học tập dùng native `<dialog>`. Modal cũ có focus trap, phục hồi focus, làm inert header/main/footer khi mở. Khi chuyển màn, focus đến tiêu đề màn mới; khi thay lựa chọn, focus giữ ở nút mới tương ứng. Typewriter có bản text đầy đủ riêng cho assistive technology, tắt khi reduced motion. Nhạc chỉ chạy sau gesture, tension theo biến cố; SFX bật/tắt riêng.

Game giữ source tách file. Bản `dist` được tạo riêng, HTML/JS/CSS và asset nhúng; kiểm tra cold offline bằng file được copy sang thư mục tạm chỉ chứa đúng một file.

## Test và artifact

`tools/run_qa.py` lần lượt build, static/asset, Node simulation, QA cũ, browser regression, axe. Node và browser dùng cùng engine/catalog. Exhaustive duyệt phương án cuối; các chuỗi lịch sử dài dùng test biên xác định, không tuyên bố duyệt hết mọi lịch sử vô hạn. `artifacts/qa/*.json` và `.log` giữ dữ liệu kiểm thử, `screenshots/v80/` giữ minh chứng mới. Bộ QA dùng dependency phát triển riêng, không nhúng vào game.
