/* story/dialogue: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VCX.define("story/dialogue", [], factory);
})(globalThis, () => {
  "use strict";
  return function create({ store, ui, audio, save, onExplore }) {
    const { $, portrait, sceneSrc, show, pulsePortrait, setAtmosphere } = ui;
    const { sound, playSfx } = audio;

    const renderWorld = onExplore;
    const STORY = [
      {
        time: "TUẦN 1 • HỢP TÁC",
        bg: "meeting",
        name: "Người dẫn chuyện",
        role: "Hồi tưởng",
        face: "ca_bong",
        mood: "happy",
        text: "Ở Vùng Cồn Xanh, ba bên ký thỏa thuận nguyên tắc để cùng làm dự án 100 tấn lúa chất lượng cao. Hôm đó ai cũng cười tươi.",
      },
      {
        time: "TUẦN 1 • HỢP TÁC",
        bg: "field",
        name: "Chú Bảy",
        role: "Nông dân",
        face: "chu_bay",
        mood: "happy",
        text: "“Có đầu ra ổn định, bà con mình mạnh dạn đầu tư công nghệ mới. Vụ này mà thành là khỏe rồi!”",
      },
      {
        time: "TUẦN 1 • HỢP TÁC",
        bg: "coop",
        name: "Chị Sen",
        role: "Hợp tác xã",
        face: "chi_sen",
        mood: "happy",
        text: "“HTX sẽ đứng ra liên kết sản xuất, lo kiểm định và truy xuất. Mình cùng làm ăn lâu dài nha!”",
      },
      {
        time: "TUẦN 1 • HỢP TÁC",
        bg: "factory",
        name: "Anh Khoa",
        role: "Doanh nghiệp",
        face: "anh_khoa",
        mood: "happy",
        text: "“Tôi cần lúa đạt chuẩn, mọi người cần đầu ra. Cả ba cùng hợp tác thì có cơ hội tăng hiệu quả.”",
      },
      {
        time: "TUẦN 2–4 • RẠN NỨT",
        bg: "field",
        name: "Người dẫn chuyện",
        role: "Chuyện kể",
        face: "minh_an",
        mood: "thinking",
        text: "Nhưng công nghệ, kho bãi và kiểm định khiến nhiều chi phí mới xuất hiện. Những điều khoản quan trọng vẫn được hẹn “để bàn sau”.",
      },
      {
        time: "TUẦN 6 • ĐỔ VỠ",
        bg: "meeting",
        name: "Chú Bảy",
        role: "Nông dân",
        face: "chu_bay",
        mood: "angry",
        text: "“Giá còn chưa chốt, chi phí thì cứ thêm hoài! Tui không thể đem cả vụ mùa ra đánh cược!”",
      },
      {
        time: "TUẦN 6 • ĐỔ VỠ",
        bg: "meeting",
        name: "Anh Khoa",
        role: "Doanh nghiệp",
        face: "anh_khoa",
        mood: "angry",
        text: "“Tôi đâu thể cam kết giá cao nếu tiêu chuẩn kiểm định chưa rõ. Doanh nghiệp cũng đâu phải làm không công!”",
      },
      {
        time: "TUẦN 6 • ĐỔ VỠ",
        bg: "meeting",
        name: "Chị Sen",
        role: "Hợp tác xã",
        face: "chi_sen",
        mood: "stressed",
        text: "“Hai bên cứ đẩy qua đẩy lại, còn chi phí HTX gánh thì sao? Thôi, ngừng lại cho rõ mọi chuyện!”",
      },
      {
        time: "TUẦN 6 • ĐỔ VỠ",
        bg: "meeting",
        name: "Cá Bống",
        role: "Linh vật",
        face: "ca_bong",
        mood: "confused",
        text: "Nhóm chat “Cùng nhau phát tài” thông báo: Chú Bảy đã rời nhóm. Anh Khoa đã rời nhóm. Chị Sen đã tắt thông báo… “Ủa, còn tui với cái sticker lúa thôi hả?”",
      },
      {
        time: "TUẦN 7 • NHIỆM VỤ MỚI",
        bg: "map",
        name: "Minh An",
        role: "Người điều phối",
        face: "minh_an",
        mood: "thinking",
        text: "“Không thể ép họ ký lại ngay. Mình phải đi gặp cả ba, nghe từng bên kể chuyện và thu thập chứng cứ trước đã.”",
      },
    ];
    function storySequence() {
      return store.state.mode === "demo"
        ? [0, 2, 4, 5, 7, 8, 9]
        : STORY.map((_, i) => i);
    }
    function activeStory() {
      return STORY[
        storySequence()[
          Math.min(store.session.storyPos, storySequence().length - 1)
        ]
      ];
    }
    function renderStory() {
      const s = activeStory();
      $("storyBg").src = sceneSrc(s.bg);
      $("storyFace").src = portrait(s.face, s.mood);
      $("storyTime").textContent = s.time;
      $("storyName").textContent = s.name;
      $("storyRole").textContent = s.role;
      $("storySpeaker").textContent = s.name;
      $("storyText").textContent = s.text;
      $("nextStory").textContent =
        store.session.storyPos === storySequence().length - 1
          ? "Bắt đầu khám phá →"
          : "Tiếp tục →";
      $("storyDots").innerHTML = storySequence()
        .map(
          (_, i) =>
            `<span class="${i <= store.session.storyPos ? "done" : ""}"></span>`,
        )
        .join("");
      setAtmosphere(
        s.bg === "meeting" && s.time.includes("ĐỔ VỠ") ? "crisis" : s.bg,
      );
      pulsePortrait("storyFace", s.mood);
      const chat = $("phoneChat");
      if (chat) {
        const breakup = s.time.includes("ĐỔ VỠ");
        chat.classList.toggle("show", breakup);
        chat.innerHTML = breakup
          ? '<b>📱 NHÓM CHAT: CÙNG NHAU PHÁT TÀI</b><div class="chatLine exit">Chú Bảy đã rời nhóm.</div><div class="chatLine exit">Anh Khoa đã rời nhóm.</div><div class="chatLine">Chị Sen đã tắt thông báo.</div><div class="chatLine">Cá Bống: ...ủa?</div>'
          : "";
      }
      save();
    }
    function nextStory() {
      sound(530);
      playSfx("turn", 0.55);
      if (++store.session.storyPos >= storySequence().length) {
        store.state.intro = true;
        renderWorld();
        show("world");
        return;
      }
      renderStory();
    }
    let typeTimer = null;
    function paintStoryText() {
      clearTimeout(typeTimer);
      const el = $("storyText"),
        text = activeStory().text;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = text;
        return;
      }
      el.replaceChildren();
      const accessible = document.createElement("span"),
        visual = document.createElement("span");
      accessible.className = "sr";
      accessible.textContent = text;
      visual.setAttribute("aria-hidden", "true");
      el.append(accessible, visual);
      let n = 0;
      const step = () => {
        if (store.session.scene !== "story") {
          visual.textContent = text;
          return;
        }
        n = Math.min(text.length, n + 4);
        visual.textContent = text.slice(0, n);
        if (n < text.length) typeTimer = setTimeout(step, 22);
      };
      step();
    }
    new MutationObserver(() => {
      if (store.session.scene === "story") paintStoryText();
    }).observe($("storyDots"), { childList: true });
    return { renderStory, nextStory, activeStory, storySequence };
  };
});
