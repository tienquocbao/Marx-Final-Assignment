/* ui/rendering: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VCX.define("ui/rendering", [], factory);
})(globalThis, () => {
  "use strict";
  return function createUI(
    store,
    audio,
    { save, onWorld, onLeaveWorld, onDialogOpen },
  ) {
    let toastId = null;
    const SCENE_ASSETS = {
      map: "assets/scene/map.svg",
      meeting: "assets/scene/meeting.svg",
      field: "assets/scene/field.svg",
      coop: "assets/scene/coop.svg",
      factory: "assets/scene/factory.svg",
    };
    const PORTRAITS = {
      anh_khoa_angry: "assets/portrait/anh_khoa_angry.png",
      anh_khoa_confused: "assets/portrait/anh_khoa_confused.png",
      anh_khoa_happy: "assets/portrait/anh_khoa_happy.png",
      anh_khoa_normal: "assets/portrait/anh_khoa_normal.png",
      anh_khoa_relieved: "assets/portrait/anh_khoa_relieved.png",
      anh_khoa_stressed: "assets/portrait/anh_khoa_stressed.png",
      anh_khoa_thinking: "assets/portrait/anh_khoa_thinking.png",
      anh_khoa_worried: "assets/portrait/anh_khoa_worried.png",
      ca_bong_angry: "assets/portrait/ca_bong_angry.png",
      ca_bong_confused: "assets/portrait/ca_bong_confused.png",
      ca_bong_happy: "assets/portrait/ca_bong_happy.png",
      ca_bong_normal: "assets/portrait/ca_bong_normal.png",
      ca_bong_relieved: "assets/portrait/ca_bong_relieved.png",
      ca_bong_stressed: "assets/portrait/ca_bong_stressed.png",
      ca_bong_thinking: "assets/portrait/ca_bong_thinking.png",
      ca_bong_worried: "assets/portrait/ca_bong_worried.png",
      chi_sen_angry: "assets/portrait/chi_sen_angry.png",
      chi_sen_confused: "assets/portrait/chi_sen_confused.png",
      chi_sen_happy: "assets/portrait/chi_sen_happy.png",
      chi_sen_normal: "assets/portrait/chi_sen_normal.png",
      chi_sen_relieved: "assets/portrait/chi_sen_relieved.png",
      chi_sen_stressed: "assets/portrait/chi_sen_stressed.png",
      chi_sen_thinking: "assets/portrait/chi_sen_thinking.png",
      chi_sen_worried: "assets/portrait/chi_sen_worried.png",
      chu_bay_angry: "assets/portrait/chu_bay_angry.png",
      chu_bay_confused: "assets/portrait/chu_bay_confused.png",
      chu_bay_happy: "assets/portrait/chu_bay_happy.png",
      chu_bay_normal: "assets/portrait/chu_bay_normal.png",
      chu_bay_relieved: "assets/portrait/chu_bay_relieved.png",
      chu_bay_stressed: "assets/portrait/chu_bay_stressed.png",
      chu_bay_thinking: "assets/portrait/chu_bay_thinking.png",
      chu_bay_worried: "assets/portrait/chu_bay_worried.png",
      minh_an_angry: "assets/portrait/minh_an_angry.png",
      minh_an_confused: "assets/portrait/minh_an_confused.png",
      minh_an_happy: "assets/portrait/minh_an_happy.png",
      minh_an_normal: "assets/portrait/minh_an_normal.png",
      minh_an_relieved: "assets/portrait/minh_an_relieved.png",
      minh_an_stressed: "assets/portrait/minh_an_stressed.png",
      minh_an_thinking: "assets/portrait/minh_an_thinking.png",
      minh_an_worried: "assets/portrait/minh_an_worried.png",
    };

    function sceneSrc(name) {
      return SCENE_ASSETS[name] || SCENE_ASSETS.meeting;
    }

    const $ = (id) => document.getElementById(id);
    const portrait = (name, mood) =>
      PORTRAITS[name + "_" + mood] || PORTRAITS[name + "_normal"];
    const esc = (s) =>
      String(s).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    function notify(text) {
      const t = $("toast");
      t.textContent = text;
      t.classList.add("show");
      clearTimeout(toastId);
      toastId = setTimeout(() => t.classList.remove("show"), 2800);
    }
    function pulsePortrait(id, mood = "normal") {
      const el = $(id);
      if (!el) return;
      el.classList.remove("talking", "blinking", "tense");
      void el.offsetWidth;
      el.classList.add("talking");
      if (["thinking", "worried", "confused"].includes(mood))
        el.classList.add("blinking");
      if (["angry", "stressed"].includes(mood)) el.classList.add("tense");
      setTimeout(() => el.classList.remove("talking"), 520);
      setTimeout(() => el.classList.remove("blinking", "tense"), 1800);
    }
    function setAtmosphere(mode = "meeting") {
      document.body.dataset.atmo = mode === "map" ? "field" : mode;
      audio.setAmbient(mode === "map" ? "field" : mode);
    }
    function rememberStage() {
      document.body.dataset.stage = store.state.presentMode
        ? "present"
        : "full";
    }

    function show(id) {
      store.session.scene = id;
      document
        .querySelectorAll("main.screens>section")
        .forEach((e) => e.classList.toggle("active", e.id === id));
      if (id === "world") {
        onWorld();
      } else {
        onLeaveWorld();
      }
      const labels = {
        home: "CHƯƠNG 0 · KHỞI ĐẦU",
        story: "CHƯƠNG 1 · TAN VỠ",
        world: "CHƯƠNG 2 · KHÁM PHÁ",
        explore: "CHƯƠNG 2 · ĐIỀU TRA",
        board: "CHƯƠNG 3 · SỰ THẬT",
        invite: "CHƯƠNG 3.5 · MỜI HỌP",
        hall: "CHƯƠNG 4 · ĐÀM PHÁN",
        ending: "CHƯƠNG 5 · KẾT THÚC",
      };
      $("progressBadge").textContent = labels[id];
      const focus = $(id).querySelector(".sectionHead b,h2,h1") || $(id);
      focus.tabIndex = -1;
      focus.focus({ preventScroll: true });
      save();
      scrollTo({ top: 0, behavior: "instant" });
    }
    function openLearning(title) {
      $("learningTitle").textContent = title;
      const d = $("learningDialog");
      if (!d.open) d.showModal();
      onDialogOpen();
    }
    const legacyModals = [...document.querySelectorAll(".modal,.questOverlay")];
    let legacyFocus = null,
      lastModal = null;
    function activeLegacyModal() {
      return legacyModals.find(
        (el) =>
          el.classList.contains("show") ||
          (el.id === "questOverlay" && !el.hidden),
      );
    }
    new MutationObserver(() => {
      const modal = activeLegacyModal();
      if (modal === lastModal) return;
      document.querySelectorAll(".top,main.screens,.foot").forEach((el) => {
        el.inert = !!modal;
      });
      if (modal) {
        if (!lastModal) legacyFocus = document.activeElement;
        modal
          .querySelector("button:not(:disabled),select,input,[tabindex]")
          ?.focus();
      } else if (lastModal && legacyFocus?.isConnected) legacyFocus.focus();
      lastModal = modal;
    }).observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden"],
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || $("learningDialog").open) return;
      const modal = activeLegacyModal();
      if (!modal) return;
      const buttons = [
        ...modal.querySelectorAll(
          'button:not(:disabled),select,input,[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      if (!buttons.length) return;
      const first = buttons[0],
        last = buttons.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    $("progressBadge").setAttribute("role", "status");
    $("progressBadge").setAttribute("aria-live", "polite");
    $("restartBtn").setAttribute("aria-label", "Bắt đầu lại từ đầu");
    return {
      $,
      esc,
      portrait,
      sceneSrc,
      imageSources: () => [
        ...Object.values(PORTRAITS),
        ...Object.values(SCENE_ASSETS),
      ],
      notify,
      pulsePortrait,
      setAtmosphere,
      rememberStage,
      show,
      openLearning,
    };
  };
});
