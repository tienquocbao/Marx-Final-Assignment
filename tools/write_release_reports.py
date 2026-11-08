"""Generate honest release documentation from executed QA artifacts.
Run after tools/run_qa.py. Does not run or fabricate tests.
"""
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone
import json
import hashlib

ROOT=Path(__file__).resolve().parent.parent
ART=ROOT/'artifacts/qa'
read=lambda name:json.loads((ART/name).read_text())
summary=read('summary.json')
suites={item['suite']:read(item['suite']+'.json') for item in summary if item['suite']!='build'}
counts={name:Counter(t['status'] for t in item['tests']) for name,item in suites.items()}
sim=suites['simulation'];browser=suites['browser'];manifest=json.loads((ROOT/'dist/manifest.json').read_text())
total=Counter()
for value in counts.values():total.update(value)
def row(name):
    c=counts[name]
    return f"| {name} | {sum(c.values())} | {c['PASS']} | {c['FAIL']} | {c['BLOCKED']} |"
script_count=len(list((ROOT/'scripts').rglob('*.js')))
now=datetime.now(timezone.utc).isoformat(timespec='seconds')
status='PASS trong phạm vi tự động' if all(r['status']=='PASS' for r in summary) else 'CHƯA ĐẠT bộ kiểm tra phát hành; xem FAIL/BLOCKED'
failures=[f"- {name}: {t['name']} — {t.get('details',t.get('detail','xem JSON'))}" for name,item in suites.items() for t in item['tests'] if t['status']!='PASS']
incomplete=sum(sum(x['nodes'] for x in t.get('incomplete',[])) for t in suites['accessibility']['tests'])
report=f'''# Báo cáo kiểm thử v8.0

Thời điểm tổng hợp UTC: {now}. Kết luận: **{status}**. Số đếm dưới đây lấy trực tiếp từ JSON/log đã chạy, không lấy từ báo cáo v7. Môi trường Linux x86_64, Node v22.23.3, Python 3.13 (uv), Playwright 1.64.1, Microsoft Edge Chromium 155.0.4283.45 headless, axe-core 4.14.0, tinycss2 1.5.1, html5lib 1.1.

## Trước và sau

Baseline: script Python nguyên trạng BLOCKED vì thiếu Playwright rồi đường dẫn Edge cố định không có. Bản sao source cũ chỉ đổi executable: **34/34 PASS**. Log nguyên vẹn: `artifacts/qa/baseline-legacy.txt`. Syntax PASS; 58 đường dẫn runtime hợp lệ; 118 asset gốc. Bộ cũ không đo console/network và một số ending chỉ được gán state để xem portrait.

Baseline bổ sung trước Modular: **230/230 assertion PASS**, build PASS trên commit `11067bf`. JSON/log được giữ tại `artifacts/modular-baseline/`.

| Suite sau nâng cấp và refactor | Assertion | PASS | FAIL | BLOCKED |
|---|---:|---:|---:|---:|
{chr(10).join(row(n) for n in suites)}
| Tổng assertion | {sum(total.values())} | {total['PASS']} | {total['FAIL']} | {total['BLOCKED']} |

Build chạy riêng, trạng thái: {next(r['status'] for r in summary if r['suite']=='build')}. Không cộng 1.417.176 mẫu exhaustive vào số assertion để tránh thổi phồng số test độc lập.

## Technical

- Asset integrity/manifest: 118 asset gốc giữ nguyên byte; 58 đường dẫn runtime tồn tại. Không đọc ZIP lồng.
- Node syntax cho {script_count} script, bao gồm các thư mục module con; HTML5 parse không lỗi; ID không trùng; CSS parse không lỗi; kiểm tra tham chiếu DOM.
- Không có dependency remote runtime. Bản source và standalone đều cold-start được khi context trình duyệt offline.
- Cả 49 hình runtime (40 portrait + 5 cảnh + 4 sprite) decode; 9 OGG load metadata trong source và standalone. Bản một file được chép vào thư mục tạm độc lập trước khi test.
- Console pageerror: **{len(browser['errors'])}**. HTTP error/thất bại tải thực: **{len(browser['failedRequests'])}**. Request bị trình duyệt hủy do điều hướng/đóng context được ghi riêng (`cancelledRequests`), không coi như missing asset; mọi hình và audio có kiểm tra decode riêng.
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

- `{counts['modules']['PASS']}/{sum(counts['modules'].values())}` nhóm Node: dependency graph không vòng, registry lỗi/khởi tạo một lần, import không DOM, state độc lập/thay state, save adapter/legacy/future/quota và assessment thuần.
- Đối chiếu đúng 48 contract evaluate/dialogue/migrate chụp từ engine commit `11067bf`; mẫu được giữ ở `artifacts/modular-baseline/contracts.json`. Không thay luật ending để làm test qua.
- `{counts['modular-browser']['PASS']}/{sum(counts['modular-browser'].values())}` assertion trên source và standalone cold offline **không dùng QA bridge**: không rò binding gameplay global, resume save v8 trước refactor, UI đạt A, sửa thỏa thuận, reset/begin/thu chứng cứ, keyboard và mobile.
- Các bộ UI cũ chỉ nạp `tools/browser_test_bridge.js` qua Playwright cho white-box assertions. Bridge không có trong HTML sản phẩm hoặc bản đóng gói. Kiểm tra decode asset dùng API liệt kê asset của module.
- Lượt regression đầu có một FAIL do test cũ đọc `PORTRAITS` global sau khi đã đóng scope. Giữ log/JSON thật tại `artifacts/modular-first-run/`; đã sửa test dùng API module, không giảm yêu cầu 49 hình/9 audio.

## Simulation

**{sim['cases']:,}** trạng thái cuối (3^7 lựa chọn × 3^4 proof × 4 nhiệm vụ phụ × 2 kết quả biến cố).

| Kết quả | Số trạng thái |
|---|---:|
| A | {sim['counts']['A']:,} |
| B | {sim['counts']['B']:,} |
| C | {sim['counts']['C']:,} |

**{sim['successfulStrategies']}** bộ phương án điều khoản/công cụ có thể dẫn tới A. Mọi A phải qua toàn bộ checks, không critical concern, đủ minimum/trust/environment/crisis. Đây không phải xác suất thắng. Exhaustive dùng memory ban đầu; lịch sử dài dùng các test xác định riêng, không tuyên bố duyệt mọi chuỗi hành vi vô hạn.

## Accessibility

axe audit các màn home, hồ sơ cũ, story, map, explore, chứng cứ, board, invitation, hall, crisis, ending, knowledge, dashboard, debate, quiz ở 1366 và 390px. Kết quả {counts['accessibility']['PASS']}/{sum(counts['accessibility'].values())} PASS theo các tag WCAG2A/AA/2.1AA. Còn {incomplete} node-check trong mục `incomplete` yêu cầu đánh giá thủ công; axe PASS không phải chứng nhận toàn bộ WCAG. Bộ browser kiểm tra thêm 1920×1080, 1366×768, 1280×720, 390×844 và reduced motion. Device scale factor 1.25 trong suite cũ là HiDPI, không thay kiểm thử browser zoom thực.

## FAIL/BLOCKED trong bộ đã chạy

{chr(10).join(failures) if failures else 'Không còn assertion FAIL hoặc BLOCKED trong các suite đã chạy.'}

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
'''
(ROOT/'docs/TEST_REPORT_V80.md').write_text(report)
release=f'''# Báo cáo phát hành Vùng Cồn Xanh v8.0

Ngày 2026-11-08. **{status}**. Source rời là nguồn chính; ZIP lồng được bỏ qua hoàn toàn. Chưa có xác nhận trình diễn trên máy trường, không coi sản phẩm đã được chứng nhận hoàn hảo.

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
- Sau: **{total['PASS']}/{sum(total.values())} assertion PASS**, {total['FAIL']} FAIL, {total['BLOCKED']} BLOCKED trong suite chạy. Build {next(r['status'] for r in summary if r['suite']=='build')}.
- Exhaustive **{sim['cases']:,}** trạng thái: A={sim['counts']['A']:,}, B={sim['counts']['B']:,}, C={sim['counts']['C']:,}; {sim['successfulStrategies']} bộ phương án có thể đạt A. Kiểm tra veto khi tổng cao, khắc phục dòng tiền HTX, nhiều chiến lược, memory/hội thoại, dữ liệu biên và migration.
- Modular: {counts['modules']['PASS']} nhóm Node PASS và {counts['modular-browser']['PASS']} assertion production source/standalone offline không bridge PASS; kiểm tra không global, save v8 cũ, state mới và đạt A qua UI.
- Console JS: {len(browser['errors'])}; lỗi tải thực: {len(browser['failedRequests'])}. 118 asset gốc giữ nguyên hash, 49 hình decode và 9 OGG load trong source/standalone.
- Browser đi thật toàn bộ full journey và demo mobile; B/C cùng A khác qua checkpoint hợp lệ và các quyết định UI; standalone đặt thư mục độc lập, tắt mạng và chơi đến A.
- axe {counts['accessibility']['PASS']}/{sum(counts['accessibility'].values())} màn/viewport PASS; còn mục `incomplete` và kiểm tra máy thật được công khai trong báo cáo QA.

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

Bản standalone: **{manifest['bytes']:,} byte**, SHA-256 `{manifest['sha256']}`. Manifest `dist/manifest.json`. Build `python tools/build_offline.py`; không nhúng base64 vào source chính.

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
'''
(ROOT/'docs/FINAL_RELEASE_REPORT_V80.md').write_text(release)
source_files=[ROOT/'index.html',ROOT/'styles/game.css',*sorted((ROOT/'scripts').rglob('*.js'))]
(ART/'source-sha256.json').write_text(json.dumps({str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in source_files},indent=2))
print('Generated TEST_REPORT_V80.md, FINAL_RELEASE_REPORT_V80.md and source manifest from actual QA artifacts.')
