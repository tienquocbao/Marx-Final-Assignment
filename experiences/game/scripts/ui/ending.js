/* ui/ending: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../game-data.js"),
      require("../simulation.js"),
    );
  else root.VCX.define("ui/ending", ["data", "simulation"], factory);
})(globalThis, (VCX_DATA, VCXSim) => {
  "use strict";
  return function create({ store, ui, rules, onDebrief }) {
    const { CHARS, STATE_TOOLS, INVITE_PEOPLE } = VCX_DATA;
    const { $, esc, portrait, setAtmosphere } = ui;

    const { evaluate } = rules;
    const renderDebrief = onDebrief;
    const actorReasons = (idx) => VCXSim.concerns(store.state, idx, VCX_DATA);
    const gainFromTool = (t) =>
      t.choices.find((c) => c.id === store.state.governance[t.id]);
    function renderEnding() {
      setAtmosphere(store.state.result === "C" ? "crisis" : "meeting");
      const result = store.state.result || "C";
      const d = {
        A: {
          badge: "🌱 CÁC BÊN TÌM LẠI TIẾNG NÓI CHUNG",
          heading: "Cồn Xanh hồi sinh",
          text: "Ba bên tự nguyện đồng ý với điều khoản minh bạch hơn về giá, chi phí và trách nhiệm khi gặp rủi ro. Họ chưa chắc có lợi nhuận cao nhất, nhưng có thể cùng duy trì chuỗi sản xuất.",
          mood: "happy",
        },
        B: {
          badge: "🌤️ THỎA THUẬN TỪNG PHẦN",
          heading: "Một cơ hội mới",
          text: "Nhiều nút thắt đã được tháo gỡ, nhưng vẫn còn nội dung khiến một bên muốn kiểm tra thêm trước khi ký trọn vẹn. Đối thoại được duy trì, chưa thể coi liên kết đã phục hồi hoàn toàn.",
          mood: "thinking",
        },
        C: {
          badge: "🌧️ LIÊN KẾT CHƯA THỂ PHỤC HỒI",
          heading: "Còn đường nào khác?",
          text: "Một hoặc nhiều bên vẫn thấy mình chịu phần chi phí hoặc rủi ro bất hợp lý. Nhà nước có thể tiếp tục hỗ trợ khuôn khổ và hòa giải, nhưng không thể thay quyền tự quyết của các chủ thể.",
          mood: "worried",
        },
      }[result];
      $("endingBadge").textContent = d.badge;
      $("endingHeading").textContent = d.heading;
      $("endingNarrative").textContent = d.text;
      $("endFaces").innerHTML = CHARS.map(
        (c) =>
          `<img class="character-portrait character-portrait--ending" src="${portrait(c.key, d.mood)}" alt="${esc(c.name)}">`,
      ).join("");
      const e = evaluate();
      $("endingReport").innerHTML =
        `${store.state.legacyResult ? `<p class="sourceNote"><b>Kết thúc ${esc(store.state.legacyResult)} được giữ từ bản lưu cũ.</b> Theo điều kiện v8 hiện tại: ${e.result}. Chọn Trở lại sửa thỏa thuận để đánh giá lại bằng lượt ứng phó mới.</p>` : ""}<p><b>Đã thu thập:</b> ${Object.values(store.state.found).flat().length}/9 chứng cứ; ${Object.keys(store.state.board).length}/3 nút thắt.</p><p><b>Đã mời trở lại:</b> ${INVITE_PEOPLE.filter((p) => store.state.invited?.[p.id]).length}/3 người.</p><p><b>Điều khoản khả thi theo bối cảnh:</b> ${e.good}/3; <b>công cụ điều tiết phù hợp:</b> ${e.govGood}/4.</p><p><b>Niềm tin:</b> ${e.trust}/100; <b>cộng đồng/môi trường:</b> ${e.society}/100.</p><p><b>Nhiệm vụ phụ:</b> ${store.state.sideQuests?.water ? "✓ Trạm nước" : "Chưa làm trạm nước"}; ${store.state.sideQuests?.dock ? "✓ Bến giao hàng" : "Chưa làm bến giao hàng"}. ${store.state.sideQuests?.dock ? "Lịch giao nhận rõ ràng hỗ trợ thỏa thuận nếu giá và phí được minh bạch." : ""}</p><p><b>Ứng phó biến cố:</b> ${store.state.crisis === "prepared" ? "Đã sắp xếp đúng các bước phối hợp" : "Chưa có quy trình phối hợp phù hợp"}.</p><p><b>Phản hồi cuối:</b> ${CHARS.map((c, i) => c.name + ": " + (e.actors[i].accepted ? "đủ điều kiện cá thể" : e.actors[i].critical.length ? "từ chối ký khi còn lo ngại thiết yếu" : "cần thêm bảo đảm")).join(" • ")}.</p><p><b>Vấn đề cần tiếp tục xử lý:</b> ${CHARS.map(
          (c, i) => {
            const concerns = actorReasons(i).filter((r) => r.type === "warn");
            return (
              esc(c.name) +
              ": " +
              (concerns.length
                ? concerns.length + " băn khoăn còn lại"
                : "chưa có phản đối lớn")
            );
          },
        ).join(
          " • ",
        )}.</p><p><b>Điều kiện kết thúc:</b> ${store.state.result === "A" ? "Thỏa thuận có căn cứ và phương án ứng phó đủ điều kiện trong mô phỏng." : store.state.result === "B" ? "Còn điều khoản hoặc công cụ cần rà soát; chưa khôi phục hoàn toàn." : "Rủi ro và lo ngại chưa được giải quyết đủ để ba bên tiếp tục."}</p><p class="small muted">Các trạng thái phản hồi là quy tắc mô phỏng được xây dựng cho game, không phải dự báo hành vi thực tế.</p>`;
      const lines = STATE_TOOLS.map((t) => {
        const c = gainFromTool(t);
        return `<li><b>${t.role}. ${esc(t.title)}:</b> ${esc(c?.title || "Chưa chọn")}<br><span class="small muted">${esc(c?.reply || "")}</span></li>`;
      }).join("");
      $("endingReport").innerHTML +=
        `<hr><p><b>Vai trò Nhà nước được vận dụng:</b> ${e.govGood}/4 phương án có cơ sở trong kịch bản.</p><ul>${lines}</ul><p><b>Niềm tin:</b> ${e.trust}/100 · <b>Lợi ích cộng đồng và môi trường:</b> ${e.society}/100.</p><p><b>Bài học:</b> Hài hòa lợi ích không đồng nghĩa chia đều lợi nhuận hay ép tất cả ký; cần bảo vệ quyền lợi hợp pháp, bảo đảm điều kiện hợp tác, giám sát rủi ro và xử lý tranh chấp có căn cứ.</p><p class="small muted">Mọi chỉ số và phản ứng trong trò chơi là mô phỏng sư phạm, không phải kết quả nghiên cứu hoặc dự đoán tác động chính sách.</p>`;
      renderDebrief();
    }

    return { renderEnding };
  };
});
