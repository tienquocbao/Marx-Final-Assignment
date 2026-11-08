/* ui/journal: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(require("../game-data.js"));
  else root.VCX.define("ui/journal", ["data"], factory);
})(globalThis, (VCX_DATA) => {
  "use strict";
  return function create({ store, ui, audio }) {
    const { SCENES, INVITE_PEOPLE } = VCX_DATA;
    const { $, esc } = ui;
    const { sound } = audio;

    const inviteReady = () =>
      INVITE_PEOPLE.every((p) => store.state.invited?.[p.id]);
    const JOURNAL_HINTS = {
      home: "Bắt đầu câu chuyện để hiểu vì sao ba bên từ hợp tác trở thành bất đồng.",
      story:
        "Đọc hành động của từng bên: mỗi bên đều có lợi ích chính đáng, nhưng điều kiện hợp tác đang thiếu rõ ràng.",
      world:
        "Ở mỗi địa điểm hãy tìm ba vật thể và giải một mini-game. Cần đủ ba bộ hồ sơ mới có thể kết nối chứng cứ.",
      explore:
        "Quan sát cảnh và bấm vào các điểm có biểu tượng. Chứng cứ được lưu sau khi bạn chọn “Cất vào hồ sơ”.",
      board:
        "Dùng Phiếu thu mua cho vấn đề giá; Sổ phí HTX cho trách nhiệm chi phí; Trạm cảm biến cho rủi ro chung.",
      invite:
        "Chú Bảy lo về giá; chị Sen lo về phí dịch vụ; anh Khoa lo về tiêu chuẩn. Hãy tìm tài liệu xác thực nỗi lo của từng người.",
      hall: "Hãy nhìn phản ứng của cả ba, không chỉ xem một bên được lợi. Thỏa thuận có thể điều chỉnh trước biến cố nước mặn.",
      ending:
        "Bạn có thể chơi lại để thử cách ứng phó khác, đối chiếu những vấn đề đã được tháo gỡ và những vấn đề còn tồn tại.",
    };
    function renderJournal() {
      const found = store.state.found || { field: [], coop: [], factory: [] };
      const total = Object.values(found).reduce(
        (n, v) => n + (v?.length || 0),
        0,
      );
      const doneCount = Object.values(store.state.done || {}).filter(
        Boolean,
      ).length;
      const sideCount = Object.values(store.state.sideQuests || {}).filter(
        Boolean,
      ).length;
      $("journalMission").innerHTML =
        `<b>Nhiệm vụ hiện tại:</b> ${esc(JOURNAL_HINTS[store.session.scene] || JOURNAL_HINTS.home)}<br><small>Đã thu thập ${total}/9 chứng cứ • Hoàn thành ${doneCount}/3 địa điểm • Mời họp ${INVITE_PEOPLE.filter((p) => store.state.invited?.[p.id]).length}/3 người • Nhiệm vụ phụ ${sideCount}/2</small>`;
      $("journalProgress").innerHTML = `<div class="journalProgress">${[
        "🌱 Hợp tác rồi tan vỡ",
        "🔎 Khám phá ba địa điểm",
        "🧩 Kết nối 3 nút thắt",
        "💌 Mời ba bên trở lại",
        "🤝 Sửa điều khoản hợp tác",
        "🌊 Thử thách nước mặn",
        "📡 Trạm cảnh báo nước",
        "🚤 Bến giao hàng",
      ]
        .map((x, i) => {
          const complete = [
            store.state.intro,
            doneCount === 3,
            Object.keys(store.state.board || {}).length === 3,
            inviteReady(),
            Object.keys(store.state.policies || {}).length === 3,
            !!store.state.crisis,
            !!store.state.sideQuests?.water,
            !!store.state.sideQuests?.dock,
          ][i];
          return `<div class="journalItem">${complete ? "✅" : "○"} ${x}</div>`;
        })
        .join("")}</div>`;
      const all = Object.keys(SCENES).flatMap((k) =>
        SCENES[k].hotspots.map((h) => ({ h, k })),
      );
      $("journalClues").innerHTML = all
        .map(({ h, k }) => {
          const yes = found[k]?.includes(h.id);
          return `<div class="journalClue ${yes ? "" : "missing"}">${yes ? h.icon : "🔒"} ${yes ? esc(h.name) : "Chưa tìm thấy"}</div>`;
        })
        .join("");
      $("journalLearning").innerHTML =
        `<div class="learnItem">🌾 <b>Lợi ích riêng:</b> giá bán, phí dịch vụ, chất lượng và tiến độ.</div><div class="learnItem">🧩 <b>Lợi ích chung:</b> ba bên cần nhau để duy trì chuỗi sản xuất.</div><div class="learnItem">⚖️ <b>Nhà nước:</b> thiết lập khuôn khổ, điều hòa và hỗ trợ xử lý mâu thuẫn.</div>`;
      $("journalHint").textContent =
        (JOURNAL_HINTS[store.session.scene] || JOURNAL_HINTS.home) +
        (store.session.scene === "world"
          ? " Di chuyển bằng WASD hoặc nhấp bản đồ, đến gần điểm đến rồi nhấn E. Hai nhiệm vụ phụ có ích ở giai đoạn biến cố và đàm phán."
          : "");
    }
    function openJournal() {
      renderJournal();
      $("journalModal").classList.add("show");
      sound(630, 0.05);
    }
    function closeJournal() {
      $("journalModal").classList.remove("show");
    }
    function init() {
      $("journalBtn").onclick = openJournal;
      $("journalClose").onclick = closeJournal;
      $("journalModal").onclick = (e) => {
        if (e.target === $("journalModal")) closeJournal();
      };
    }
    return { init, openJournal, closeJournal };
  };
});
