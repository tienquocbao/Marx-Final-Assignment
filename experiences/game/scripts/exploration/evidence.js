/* exploration/evidence: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../game-data.js"),
      require("../simulation.js"),
    );
  else root.VCX.define("exploration/evidence", ["data", "simulation"], factory);
})(globalThis, (VCX_DATA, VCXSim) => {
  "use strict";
  return function create({ store, ui, audio, rules, save, knowledgeContext }) {
    const { SCENES, CHARS, KEY_CLUES, ISSUES, PROOF_TITLES } = VCX_DATA;
    const {
      $,
      esc,
      portrait,
      sceneSrc,
      show,
      notify,
      pulsePortrait,
      setAtmosphere,
    } = ui;
    const { sound, playSfx, soundCue } = audio;
    const { rememberDecision } = rules;
    let selectedEvidence = null;
    const SPRITES = {
      minh_an_walk_0: "assets/sprites/minh_an_walk_0.png",
      minh_an_walk_1: "assets/sprites/minh_an_walk_1.png",
      minh_an_walk_2: "assets/sprites/minh_an_walk_2.png",
      minh_an_walk_3: "assets/sprites/minh_an_walk_3.png",
    };
    function allDone() {
      return Object.values(store.state.done).every(Boolean);
    }
    function renderWorld() {
      let total = Object.values(store.state.done).filter(Boolean).length;
      $("mapCount").textContent = `${total} / 3 địa điểm hoàn thành`;
      $("mapGoal").textContent = allDone()
        ? "Đủ chứng cứ! Phòng đối thoại đã mở. Hãy ghép các manh mối và mời ba bên quay lại."
        : store.state.mode === "demo"
          ? "Chế độ trình chiếu: mỗi khu vực đã có sẵn hai chứng cứ nền. Hãy tìm tài liệu chủ chốt và hoàn thành thử thách."
          : "Đến gần ba địa điểm bằng WASD hoặc nhấp để đi. Tìm chứng cứ và nói chuyện với từng người; nhiệm vụ phụ giúp chuẩn bị ứng phó rủi ro.";
      document.querySelectorAll("[data-go]").forEach((btn) => {
        if (btn.dataset.go === "water" || btn.dataset.go === "dock") {
          btn.classList.toggle(
            "done",
            !!store.state.sideQuests?.[btn.dataset.go],
          );
          return;
        }
        if (btn.dataset.go === "hall") {
          btn.disabled = !allDone();
          btn.classList.toggle("lock", !allDone());
          btn.textContent = allDone()
            ? "🤝 Phòng đối thoại"
            : "🔒 Phòng đối thoại";
        } else {
          btn.classList.toggle("done", store.state.done[btn.dataset.go]);
          btn.textContent = `${SCENES[btn.dataset.go].icon} ${SCENES[btn.dataset.go].name.split(" ").slice(0, 2).join(" ")} ${store.state.done[btn.dataset.go] ? "✓" : ""}`;
        }
      });
      $("questSummary").textContent =
        `Nhiệm vụ phụ: ${Object.values(store.state.sideQuests || {}).filter(Boolean).length} / 2 · ${store.state.sideQuests?.water ? "✓ Trạm nước  " : ""}${store.state.sideQuests?.dock ? "✓ Bến giao hàng" : ""}`;
      $("inventory").innerHTML = Object.keys(SCENES)
        .flatMap((k) =>
          SCENES[k].hotspots.map(
            (h) =>
              `<div class="docChip ${store.state.found[k].includes(h.id) ? "" : "off"}">${store.state.found[k].includes(h.id) ? h.icon : "🔒"}<br>${esc(h.name)}</div>`,
          ),
        )
        .join("");
    }
    function enterPlace(key) {
      store.session.activePlace = key;
      if (store.state.mode === "demo" && store.state.found[key].length === 0) {
        const primary = {
          field: "field_buyer",
          coop: "coop_fees",
          factory: "factory_quality",
        }[key];
        store.state.found[key] = SCENES[key].hotspots
          .filter((h) => h.id !== primary)
          .map((h) => h.id);
        save();
      }
      renderExplore(key);
      show("explore");
    }

    const MINI_LOTS = [
      { id: "A", quality: "13,5%", qr: "Có", eligible: true },
      { id: "B", quality: "15,2%", qr: "Có", eligible: false },
      { id: "C", quality: "13,8%", qr: "Có", eligible: true },
      { id: "D", quality: "13,1%", qr: "Thiếu", eligible: false },
    ];
    function miniMarkup(key) {
      const flag = store.state.minis[key];
      if (flag)
        return `<div class="miniGame"><div class="miniHead"><h3>🎖️ Mini-game hoàn thành</h3><span class="miniTag">ĐÃ GIẢI</span></div><p>Bạn đã kiểm tra hồ sơ và có căn cứ trao đổi với ${SCENES[key].character}.</p></div>`;
      if (key === "field")
        return `<div class="miniGame"><div class="miniHead"><h3>🌾 Mini-game: Chốt khoảng giá có thể thương lượng</h3><span class="miniTag">1/3</span></div><p><b>Số liệu giả định:</b> chi phí nông dân 70 điểm, cần ít nhất 10 điểm phần dư; doanh nghiệp có thể trả tối đa 95 điểm. Kéo mức giá mà hai bên có thể tiếp tục bàn bạc.</p><label for="priceSlider">Giá đề xuất: <strong id="priceNum">82</strong> điểm</label><input id="priceSlider" type="range" min="65" max="105" value="82" step="1"><div class="miniFacts"><span>Chi phí: 70</span><span>Mức nông dân mong đợi: ≥80</span><span>Trần doanh nghiệp: 95</span></div><div class="miniResult" id="miniResult">Chú Bảy: cần bù chi phí • Anh Khoa: cần còn biên chế biến.</div><button class="miniButton" id="miniCheck">Gửi mức giá để hai bên xem xét</button></div>`;
      if (key === "coop")
        return `<div class="miniGame"><div class="miniHead"><h3>🏘️ Mini-game: Đối chiếu phí dịch vụ</h3><span class="miniTag">2/3</span></div><p>Ghép từng dịch vụ với <b>chứng từ xác minh</b>. Không mặc định bên nào phải trả: trách nhiệm thanh toán sẽ được đàm phán sau.</p>${[
          ["Kho bảo quản", "warehouse"],
          ["Lấy mẫu kiểm định", "test"],
          ["Truy xuất nguồn gốc", "trace"],
        ]
          .map(
            ([t, k]) =>
              `<div class="miniRow"><label for="match_${k}">${t}</label><select id="match_${k}"><option value="">Chọn chứng từ</option><option value="warehouse">Phiếu nhập/xuất kho</option><option value="test">Biên bản lấy mẫu</option><option value="trace">Nhật ký truy xuất QR</option></select></div>`,
          )
          .join(
            "",
          )}<div class="miniResult" id="miniResult">Minh bạch chi phí là tiền đề để các bên phân chia trách nhiệm.</div><button class="miniButton" id="miniCheck">Kiểm tra bộ chứng từ</button></div>`;
      return `<div class="miniGame"><div class="miniHead"><h3>🏭 Mini-game: Chọn lô nguyên liệu đạt yêu cầu</h3><span class="miniTag">3/3</span></div><p><b>Quy tắc giả định trong hợp đồng:</b> độ ẩm không quá 14,0% và có dữ liệu truy xuất. Nhấn chọn các lô đủ điều kiện, các lô khác cần xử lý/kiểm tra bổ sung.</p><div class="miniRow">${MINI_LOTS.map((l) => `<button type="button" class="miniLot" data-lot="${l.id}" aria-pressed="false"><strong>Lô ${l.id}</strong><small>Ẩm: ${l.quality} · QR: ${l.qr}</small></button>`).join("")}</div><div class="miniResult" id="miniResult">Anh Khoa: “Chất lượng phải được xác minh bằng tiêu chí đã thống nhất.”</div><button class="miniButton" id="miniCheck">Chốt các lô đạt yêu cầu</button></div>`;
    }
    function setupMini(key) {
      const el = $("miniGameArea");
      el.innerHTML = miniMarkup(key);
      if (store.state.minis[key]) return;
      el.querySelector("#miniCheck").addEventListener("click", () =>
        checkMini(key),
      );
      if (key === "field") {
        let slider = el.querySelector("#priceSlider");
        let update = () => {
          let v = +slider.value;
          el.querySelector("#priceNum").textContent = v;
          el.querySelector("#miniResult").textContent =
            v < 80
              ? "Nông dân: mức này chưa trang trải được chi phí và phần thu nhập tối thiểu theo giả định."
              : v > 95
                ? "Doanh nghiệp: mức này vượt trần ngân sách thu mua giả định."
                : "Cả hai có thể cân nhắc mức này, nhưng còn phải thỏa thuận chất lượng và rủi ro.";
        };
        slider.addEventListener("input", update);
        update();
      }
      if (key === "factory")
        el.querySelectorAll("[data-lot]").forEach((b) =>
          b.addEventListener("click", () => {
            let active = b.getAttribute("aria-pressed") === "true";
            b.setAttribute("aria-pressed", String(!active));
            b.classList.toggle("selected", !active);
            sound(500, 0.045);
          }),
        );
    }
    function checkMini(key) {
      store.state.learning.miniAttempts[key] =
        (store.state.learning.miniAttempts[key] || 0) + 1;
      const root = $("miniGameArea");
      let success = false,
        why = "";
      if (key === "field") {
        let v = +root.querySelector("#priceSlider").value;
        success = v >= 80 && v <= 95;
        why = success
          ? "Cả hai thấy mức giá có thể tiếp tục thương lượng. Giá cuối còn cần gắn với chất lượng, phí và rủi ro."
          : "Giá phải vừa cho người sản xuất có cơ hội bù đắp chi phí, vừa không đẩy bên mua vào một mức không thể thực hiện.";
      } else if (key === "coop") {
        success = ["warehouse", "test", "trace"].every(
          (k) => root.querySelector("#match_" + k).value === k,
        );
        why = success
          ? "Đã có chứng từ chứng minh ba dịch vụ phát sinh. Trách nhiệm thanh toán cần ghi rõ trong phụ lục."
          : "Cần kiểm tra đúng loại chứng từ cho từng dịch vụ. Không được tự áp toàn bộ chi phí lên một bên.";
      } else {
        let picked = [
          ...root.querySelectorAll('[data-lot][aria-pressed="true"]'),
        ]
          .map((x) => x.dataset.lot)
          .sort()
          .join(",");
        success = picked === "A,C";
        why = success
          ? "Đã tách được các lô đáp ứng tiêu chí hợp đồng giả định. Các lô còn lại phải xử lý/kiểm định lại, không tự động quy lỗi cho một bên."
          : "Kiểm tra cả độ ẩm và truy xuất nguồn gốc; đủ một tiêu chí vẫn chưa chắc đủ điều kiện.";
      }
      const box = root.querySelector("#miniResult");
      box.textContent = why;
      box.className = "miniResult " + (success ? "good" : "bad");
      if (success) {
        store.state.minis[key] = true;
        rememberDecision("mini", key, "complete", null, {
          choice: SCENES[key].character + " — hoàn thành thử thách",
          evidence: [...store.state.found[key]],
        });
        knowledgeContext(
          key === "field" ? "price" : key === "coop" ? "fees" : "rights",
        );
        $("finishPlace").disabled = false;
        $("npcFace").src = portrait(SCENES[key].person, "relieved");
        $("npcLine").textContent =
          `“Cảm ơn Minh An. Giờ tôi có bằng chứng rõ ràng hơn để trao đổi với hai bên.”`;
        $("exploreHint").textContent =
          "✅ Đã hoàn thành thử thách. Bạn có thể kết thúc điều tra tại đây.";
        root.querySelector("#miniCheck").disabled = true;
        notify("Đã hoàn thành mini-game • thêm căn cứ thương lượng");
        soundCue("solve");
        save();
      } else soundCue("error");
    }
    function renderExplore(key) {
      const d = SCENES[key],
        found = store.state.found[key];
      const mood =
        found.length === 3
          ? "relieved"
          : found.length === 2
            ? "thinking"
            : found.length === 0
              ? "stressed"
              : "worried";
      $("exploreTitle").textContent = `${d.icon} ${d.name.toUpperCase()}`;
      $("exploreBg").src = sceneSrc(d.bg);
      $("npcName").textContent = d.character;
      $("npcJob").textContent = d.job;
      $("npcFace").src = portrait(d.person, mood);
      $("npcLine").textContent =
        found.length === 0
          ? d.line
          : found.length === 3
            ? `“Ừ, giờ bạn đã hiểu lý do tôi lo rồi. Mong là mọi người chịu ngồi lại nói chuyện cho rõ.”`
            : `“Bạn cứ tìm thêm bằng chứng đi. Chuyện này không chỉ là ai muốn có lời nhiều hơn.”`;
      setAtmosphere(d.bg);
      pulsePortrait("npcFace", mood);
      $("hotspots").innerHTML = d.hotspots
        .map(
          (h) =>
            `<button class="spot ${found.includes(h.id) ? "done" : ""}" data-clue="${h.id}" style="left:${h.x}%;top:${h.y}%" aria-label="${esc(h.name)}">${found.includes(h.id) ? "✓" : h.icon} ${esc(h.name)}</button>`,
        )
        .join("");
      $("localClues").innerHTML = d.hotspots
        .map(
          (h) =>
            `<div class="clueSquare ${found.includes(h.id) ? "got" : ""}"><i>${found.includes(h.id) ? h.icon : "🔒"}</i>${esc(h.name)}</div>`,
        )
        .join("");
      $("exploreHint").textContent =
        found.length === 3
          ? store.state.minis[key]
            ? "✅ Có đủ chứng cứ và đã giải thử thách."
            : "🎲 Đã đủ chứng cứ: hoàn thành mini-game để thuyết phục nhân vật."
          : `💡 Đã tìm thấy ${found.length}/3 chứng cứ. Nhấn các điểm sáng trong cảnh.`;
      $("finishPlace").disabled = found.length !== 3 || !store.state.minis[key];
      $("miniGameArea").innerHTML =
        found.length === 3
          ? ""
          : '<div class="miniGame"><h3>🔒 Thử thách chưa mở</h3><p>Thu thập đủ 3 chứng cứ để được xử lý một vấn đề thực tế tại địa điểm này.</p></div>';
      if (found.length === 3) setupMini(key);
      document
        .querySelectorAll("[data-clue]")
        .forEach((el) =>
          el.addEventListener("click", () => openClue(el.dataset.clue)),
        );
    }
    function openClue(id) {
      const d = SCENES[store.session.activePlace],
        h = d.hotspots.find((x) => x.id === id);
      $("modalEmoji").innerHTML =
        `<img class="character-portrait character-portrait--modal" src="${portrait(d.person, h.mood)}" alt="${esc(d.character)}">`;
      $("modalTitle").textContent = h.name;
      $("modalText").textContent = h.details;
      $("modalLesson").textContent = h.lesson;
      $("clueModal").classList.add("show");
      $("clueModal").dataset.clue = id;
      $("npcFace").src = portrait(d.person, h.mood);
      pulsePortrait("npcFace", h.mood);
      sound(650);
    }
    function takeClue() {
      const id = $("clueModal").dataset.clue;
      const arr = store.state.found[store.session.activePlace];
      if (!SCENES[store.session.activePlace].hotspots.some((h) => h.id === id))
        return;
      if (!arr.includes(id)) {
        arr.push(id);
        knowledgeContext(id);
        rememberDecision("evidence", store.session.activePlace, id, null, {
          choice: PROOF_TITLES[id],
          evidence: [id],
          benefits: "Bổ sung hồ sơ xác minh",
          costs: "Cần đối chiếu với các bên.",
        });
        sound(820, 0.16);
        notify("Đã cất chứng cứ vào hồ sơ.");
        playSfx("clue", 0.65);
      }
      renderExplore(store.session.activePlace);
      save();
      /* Keep overlay until current click has fully dispatched, avoiding click-through onto hotspots. */ setTimeout(
        closeClue,
        90,
      );
    }
    function closeClue() {
      const wasOpen = $("clueModal").classList.contains("show");
      $("clueModal").classList.remove("show");
      if (wasOpen && store.session.scene === "explore") {
        const focus =
          document.querySelector("#hotspots .spot:not(.done)") ||
          $("miniCheck") ||
          $("finishPlace");
        focus?.focus({ preventScroll: true });
      }
    }
    function talkToNPC() {
      const idx = ["field", "coop", "factory"].indexOf(
        store.session.activePlace,
      );
      if (idx < 0) return;
      const a = VCXSim.ACTORS[idx],
        msg = VCXSim.dialogue(store.state, idx, VCX_DATA),
        m = store.state.memory[a.id];
      store.state.npcTalk[store.session.activePlace] =
        (store.state.npcTalk[store.session.activePlace] || 0) + 1;
      if (!store.state.learning.heard.includes(a.id))
        store.state.learning.heard.push(a.id);
      $("npcLine").textContent =
        m.lastDialogue === msg.text
          ? "“Những điều kiện tôi vừa nêu vẫn còn. Bạn có thể kiểm tra thêm chứng cứ hoặc sửa thỏa thuận, rồi hỏi lại tôi.”"
          : msg.text;
      m.lastDialogue = msg.text;
      $("npcFace").src = portrait(CHARS[idx].key, msg.mood);
      pulsePortrait("npcFace", msg.mood);
      save();
    }

    function completePlace() {
      if (
        store.state.found[store.session.activePlace].length < 3 ||
        !store.state.minis[store.session.activePlace]
      )
        return;
      store.state.done[store.session.activePlace] = true;
      sound(750, 0.15);
      notify(
        `${SCENES[store.session.activePlace].character} đã chia sẻ đủ thông tin.`,
      );
      renderWorld();
      show("world");
    }
    function renderBoard() {
      selectedEvidence = null;
      renderEvidence();
      renderSlots();
      $("enterHall").disabled = !ISSUES.every(
        (x) => store.state.board[x.id] === x.clue,
      );
      $("boardMsg").textContent =
        "Chọn chứng cứ và đặt vào nút thắt tương ứng.";
      $("boardMsg").className = "message";
    }
    function renderEvidence() {
      $("keyEvidence").innerHTML = KEY_CLUES.map((c) => {
        let used = Object.values(store.state.board).includes(c.id);
        return `<button class="evidenceTile ${selectedEvidence === c.id ? "selected" : ""} ${used ? "used" : ""}" data-evidence="${c.id}" draggable="${!used}" ${used ? "disabled" : ""}><span class="sym">${c.icon}</span><span><b>${esc(c.title)}</b><span class="small muted">${esc(c.info)}</span></span></button>`;
      }).join("");
      document.querySelectorAll("[data-evidence]").forEach((el) => {
        el.addEventListener("click", () => {
          selectedEvidence = el.dataset.evidence;
          renderEvidence();
          notify("Đã chọn chứng cứ. Nhấn vào một nút thắt ở cột bên phải.");
        });
        el.addEventListener("dragstart", (e) => {
          selectedEvidence = el.dataset.evidence;
          e.dataTransfer.setData("text/plain", selectedEvidence);
        });
      });
    }
    function renderSlots() {
      $("issueSlots").innerHTML = ISSUES.map((s) => {
        let clue = KEY_CLUES.find((k) => k.id === store.state.board[s.id]);
        return `<button class="slot ${clue ? "filled" : ""}" data-slot="${s.id}"><strong>${esc(s.title)}</strong><span>${clue ? `${clue.icon} ${clue.title} ✓` : esc(s.desc)}</span></button>`;
      }).join("");
      document.querySelectorAll("[data-slot]").forEach((el) => {
        el.addEventListener("click", () => fillSlot(el.dataset.slot));
        el.addEventListener("dragover", (e) => e.preventDefault());
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          selectedEvidence =
            e.dataTransfer.getData("text/plain") || selectedEvidence;
          fillSlot(el.dataset.slot);
        });
      });
    }
    function fillSlot(id) {
      const slot = ISSUES.find((s) => s.id === id);
      if (!selectedEvidence) {
        notify("Hãy chọn chứng cứ ở bên trái trước.");
        return;
      }
      if (!VCXSim.owned(store.state, selectedEvidence)) {
        notify("Bạn chưa thu thập chứng cứ này.");
        return;
      }
      if (slot.clue !== selectedEvidence) {
        $("boardMsg").className = "message danger";
        $("boardMsg").textContent =
          "Chưa khớp: thử tìm mối liên hệ trực tiếp hơn giữa chứng cứ và nút thắt.";
        sound(220);
        return;
      }
      store.state.board[id] = selectedEvidence;
      if (!store.state.learning.links.includes(id))
        store.state.learning.links.push(id);
      rememberDecision("link", id, selectedEvidence, null, {
        choice: slot.title,
        evidence: [selectedEvidence],
      });
      selectedEvidence = null;
      renderEvidence();
      renderSlots();
      sound(800, 0.14);
      let count = Object.keys(store.state.board).length;
      $("boardMsg").className = "message success";
      $("boardMsg").textContent =
        `Đã làm rõ ${count}/3 nút thắt. ${count === 3 ? "Bạn có thể đưa các bên trở lại bàn đàm phán." : ""}`;
      $("enterHall").disabled = count !== 3;
      save();
    }
    const MAP_SITES = {
      field: { x: 25, y: 43, name: "Ruộng lúa Chú Bảy" },
      coop: { x: 55, y: 20, name: "Hợp tác xã Chị Sen" },
      factory: { x: 75, y: 43, name: "Nhà máy Anh Khoa" },
      hall: { x: 50, y: 72, name: "Phòng đối thoại" },
      water: { x: 28, y: 77, name: "Trạm cảnh báo nước" },
      dock: { x: 77, y: 77, name: "Bến giao hàng" },
    };
    const mapWalking = {
      target: null,
      keys: new Set(),
      frame: 0,
      last: 0,
      prevSave: 0,
      near: null,
      faceLeft: false,
    };
    function clampWalk(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }
    function worldPos() {
      store.state.mapPos = store.state.mapPos || { x: 50, y: 56 };
      return store.state.mapPos;
    }
    function distWalk(a, b) {
      return Math.hypot(a.x - b.x, (a.y - b.y) * 1.6);
    }
    function nearbySite() {
      const p = worldPos();
      let nearest = null,
        dist = Infinity;
      for (const [id, loc] of Object.entries(MAP_SITES)) {
        const d = distWalk(p, loc);
        if (d < dist) {
          dist = d;
          nearest = id;
        }
      }
      return dist <= 10 ? nearest : null;
    }
    function syncAvatar() {
      let p = worldPos();
      const a = $("worldAvatar");
      if (!a) return;
      a.style.left = p.x + "%";
      a.style.top = p.y + "%";
      a.classList.toggle("facingLeft", mapWalking.faceLeft);
      a.classList.toggle(
        "walking",
        !!mapWalking.target || mapWalking.keys.size > 0,
      );
      const i = $("worldAvatarImg");
      const frame = String(mapWalking.frame % 4);
      if (i && i.dataset.frame !== frame) {
        i.dataset.frame = frame;
        i.src = SPRITES["minh_an_walk_" + frame];
      }
      const dot = $("mapDestination");
      if (mapWalking.target) {
        dot.hidden = false;
        dot.style.left = mapWalking.target.x + "%";
        dot.style.top = mapWalking.target.y + "%";
      } else dot.hidden = true;
    }
    function updateWalkUI() {
      if (store.session.scene !== "world") return;
      let near = nearbySite();
      mapWalking.near = near;
      const b = $("walkInteract"),
        status = $("walkStatus");
      if (near) {
        let loc = MAP_SITES[near];
        let locked = near === "hall" && !allDone();
        b.disabled = locked;
        b.textContent = locked ? "🔒 Cần 3 hồ sơ" : `✋ Tương tác: ${loc.name}`;
        status.textContent = locked
          ? "Phòng họp chưa mở: hoàn thành 3 cuộc điều tra trước."
          : `Đã đến gần ${loc.name}. Nhấn E hoặc nút Tương tác.`;
      } else {
        b.disabled = true;
        b.textContent = "🖐️ Đến gần địa điểm";
        status.textContent = mapWalking.target
          ? "Minh An đang đi tới điểm đã chọn…"
          : "Nhấp vào điểm đến hoặc di chuyển bằng WASD / phím mũi tên.";
      }
    }
    function travelTo(x, y) {
      const pos = worldPos();
      mapWalking.target = { x: clampWalk(x, 7, 94), y: clampWalk(y, 12, 88) };
      mapWalking.faceLeft = mapWalking.target.x < pos.x;
      syncAvatar();
      updateWalkUI();
    }
    function routeTo(site) {
      if (store.session.scene !== "world") return;
      const loc = MAP_SITES[site];
      if (!loc) return;
      if (site === "hall" && !allDone()) {
        notify("Cần điều tra xong 3 địa điểm trước khi vào phòng đối thoại.");
        return;
      }
      if (store.state.mode === "demo") {
        interactSite(site);
        return;
      }
      if (nearbySite() === site) {
        interactSite(site);
        return;
      }
      travelTo(loc.x, loc.y);
      notify(`Minh An đang tới ${loc.name}. Khi đến gần, nhấn E để tương tác.`);
    }
    function interactSite(site) {
      if (!site) return;
      if (site === "hall") {
        if (!allDone()) {
          notify("Phòng đối thoại còn khóa.");
          return;
        }
        renderBoard();
        show("board");
        return;
      }
      if (site === "water" || site === "dock") {
        openSideQuest(site);
        return;
      }
      enterPlace(site);
    }
    function tryInteract() {
      if (
        store.session.scene !== "world" ||
        document.querySelector(".modal.show, dialog[open]") ||
        !$("questOverlay").hidden
      )
        return;
      const site = nearbySite();
      if (!site) {
        notify("Hãy đến gần nhân vật hoặc địa điểm trước.");
        return;
      }
      interactSite(site);
    }
    function tickWalking(now) {
      requestAnimationFrame(tickWalking);
      if (
        store.session.scene !== "world" ||
        document.querySelector(".modal.show, dialog[open]") ||
        !$("questOverlay").hidden
      ) {
        mapWalking.keys.clear();
        mapWalking.last = now;
        return;
      }
      const dt = Math.min((now - (mapWalking.last || now)) / 1000, 0.06);
      mapWalking.last = now;
      let p = worldPos(),
        dx = 0,
        dy = 0;
      const k = mapWalking.keys;
      if (k.has("arrowleft") || k.has("a")) dx -= 1;
      if (k.has("arrowright") || k.has("d")) dx += 1;
      if (k.has("arrowup") || k.has("w")) dy -= 1;
      if (k.has("arrowdown") || k.has("s")) dy += 1;
      let active = false;
      if (dx || dy) {
        let norm = Math.hypot(dx, dy);
        dx /= norm;
        dy /= norm;
        p.x = clampWalk(p.x + dx * 31 * dt, 7, 94);
        p.y = clampWalk(p.y + dy * 31 * 0.75 * dt, 12, 88);
        mapWalking.target = null;
        active = true;
        mapWalking.faceLeft = dx < 0;
      } else if (mapWalking.target) {
        const t = mapWalking.target;
        let vx = t.x - p.x,
          vy = t.y - p.y;
        let d = Math.hypot(vx, vy);
        const step = 32 * dt;
        if (d <= step || d < 0.8) {
          p.x = t.x;
          p.y = t.y;
          mapWalking.target = null;
          save();
          sound(700, 0.055);
        } else {
          p.x = clampWalk(p.x + (vx / d) * step, 7, 94);
          p.y = clampWalk(p.y + (vy / d) * step, 12, 88);
          active = true;
          mapWalking.faceLeft = vx < 0;
        }
      }
      if (active) {
        if (Math.floor(now / 160) !== mapWalking.frame)
          mapWalking.frame = Math.floor(now / 160);
        if (now - mapWalking.prevSave > 1800) {
          save();
          mapWalking.prevSave = now;
        }
      }
      syncAvatar();
      if (active || mapWalking.near !== nearbySite()) updateWalkUI();
    }
    function worldKeyDown(e) {
      const key = e.key.toLowerCase();
      if (
        store.session.scene !== "world" ||
        document.querySelector(".modal.show, dialog[open]") ||
        !$("questOverlay").hidden
      )
        return;
      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          "e",
        ].includes(key)
      ) {
        if (
          e.target instanceof HTMLElement &&
          ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
        )
          return;
        e.preventDefault();
        if (key === "e" && !e.repeat) {
          tryInteract();
          return;
        }
        mapWalking.keys.add(key);
      }
    }
    function worldKeyUp(e) {
      const k = e.key.toLowerCase();
      if (mapWalking.keys.delete(k)) save();
    }
    function bindMapWalking() {
      const map = $("walkMap");
      map.addEventListener("click", (e) => {
        if (store.session.scene !== "world" || e.target.closest("button"))
          return;
        const r = map.getBoundingClientRect();
        travelTo(
          ((e.clientX - r.left) / r.width) * 100,
          ((e.clientY - r.top) / r.height) * 100,
        );
      });
      $("walkInteract").addEventListener("click", tryInteract);
      $("walkCenter").addEventListener("click", () => travelTo(50, 56));
      document.querySelectorAll("[data-walk]").forEach((el) => {
        const dir = el.dataset.walk;
        const k = { up: "w", down: "s", left: "a", right: "d" }[dir];
        const start = (e) => {
          e.preventDefault();
          mapWalking.keys.add(k);
          mapWalking.target = null;
        };
        const end = (e) => {
          mapWalking.keys.delete(k);
          save();
        };
        el.addEventListener("pointerdown", start);
        ["pointerup", "pointercancel", "pointerleave"].forEach((name) =>
          el.addEventListener(name, end),
        );
      });
      document.addEventListener("keydown", worldKeyDown);
      document.addEventListener("keyup", worldKeyUp);
      window.addEventListener("blur", () => mapWalking.keys.clear());
      document.querySelectorAll("[data-go]").forEach((el) => {
        el.addEventListener(
          "click",
          (e) => {
            if (store.session.scene !== "world") return;
            e.stopImmediatePropagation();
            if (el.disabled) return;
            routeTo(el.dataset.go);
          },
          true,
        );
      });
      requestAnimationFrame(tickWalking);
    }
    const SIDE_QUESTS = {
      water: {
        title: "Trạm nước – Cảnh báo sớm",
        intro:
          "Một trạm nước có ba bản ghi theo thời gian. Độ mặn đo trong mô phỏng tăng dần. Sắp xếp các dữ liệu theo thứ tự thời điểm để xác minh xu hướng và gửi cảnh báo tới các bên.",
        steps: [
          { id: "noon", title: "12:00", detail: "Độ mặn 3,5‰" },
          { id: "morning", title: "06:00", detail: "Độ mặn 0,8‰" },
          { id: "mid", title: "09:00", detail: "Độ mặn 1,6‰" },
        ],
        correct: ["morning", "mid", "noon"],
        reward:
          "Bạn đã giúp gửi cảnh báo sớm. Ở thử thách độ mặn cuối game, bước thông báo sẽ được hoàn thành trước.",
      },
      dock: {
        title: "Bến ghe – Nối lại đường giao hàng",
        intro:
          "Ngừng liên kết khiến việc giao hàng bị gián đoạn. Hãy xây lại quy trình giao nhận có trách nhiệm, từ tập hợp lúa đến kiểm định và bàn giao.",
        steps: [
          {
            id: "receive",
            title: "Bước nhận",
            detail: "Nhà máy xác nhận nhận hàng",
          },
          {
            id: "gather",
            title: "Bước tập hợp",
            detail: "HTX tập hợp lúa từ nông dân",
          },
          {
            id: "check",
            title: "Bước kiểm định",
            detail: "Kiểm tra chất lượng theo thỏa thuận",
          },
        ],
        correct: ["gather", "check", "receive"],
        reward:
          "Đã có lịch phối hợp giao hàng. Khi chọn điều khoản giá và phí minh bạch, sự phối hợp này giúp các bên yên tâm hơn.",
      },
    };
    let questCurrent = null,
      questChoices = [];
    function openSideQuest(id) {
      questCurrent = id;
      questChoices = [];
      renderSideQuest();
      $("questOverlay").hidden = false;
      mapWalking.keys.clear();
      mapWalking.target = null;
      syncAvatar();
      sound(660, 0.07);
    }
    function closeSideQuest() {
      questCurrent = null;
      questChoices = [];
      $("questOverlay").hidden = true;
      updateWalkUI();
      save();
    }
    function renderSideQuest() {
      const q = SIDE_QUESTS[questCurrent];
      if (!q) return;
      $("questTitle").textContent = q.title;
      let complete = !!store.state.sideQuests?.[questCurrent];
      $("questContent").innerHTML =
        `<p>${q.intro}</p>` +
        (complete
          ? `<div class="questSequence">✅ Đã hoàn thành: ${q.reward}</div>`
          : `<div class="questCards">${q.steps.map((item) => `<button type="button" class="questCard" data-step="${item.id}">${item.title}<span>${item.detail}</span></button>`).join("")}</div><div class="questSequence" id="sideSequence">Chưa chọn bước nào. Nhấp theo thứ tự đúng.</div>`);
      $("questFeedback").className = "questFeedback";
      $("questFeedback").textContent = complete
        ? "Đã ghi vào hồ sơ nhiệm vụ."
        : "Mỗi lần nhấn sẽ xếp thêm một bước; có thể thử lại nếu sai.";
      document
        .querySelectorAll("#questContent [data-step]")
        .forEach((b) =>
          b.addEventListener("click", () => chooseQuestStep(b.dataset.step)),
        );
    }
    function chooseQuestStep(id) {
      const q = SIDE_QUESTS[questCurrent];
      if (!q || questChoices.includes(id)) return;
      questChoices.push(id);
      let chosen = q.steps.filter((s) => questChoices.includes(s.id));
      const seq = $("sideSequence");
      seq.textContent =
        "Thứ tự đã chọn: " +
        questChoices
          .map((c, i) => i + 1 + ". " + q.steps.find((s) => s.id === c).title)
          .join(" → ");
      document.querySelectorAll("#questContent [data-step]").forEach((b) => {
        b.disabled = questChoices.includes(b.dataset.step);
        b.classList.toggle("chosen", questChoices.includes(b.dataset.step));
      });
      if (questChoices.length === 3) {
        if (questChoices.every((v, i) => v === q.correct[i])) {
          store.state.sideQuests[questCurrent] = true;
          rememberDecision("quest", questCurrent, "complete", null, {
            choice: q.title,
            benefits: q.reward,
            costs: "Cần chia sẻ thông tin và phối hợp lịch giữa các bên.",
            evidence:
              questCurrent === "water" &&
              VCXSim.owned(store.state, "field_sensor")
                ? ["field_sensor"]
                : [],
          });
          knowledgeContext(
            questCurrent === "water" ? "risk" : "factory_trucks",
          );
          $("questFeedback").textContent = "🎉 " + q.reward;
          $("questFeedback").className = "questFeedback";
          notify("Đã hoàn thành nhiệm vụ phụ!");
          soundCue("solve");
          renderWorld();
          save();
          renderSideQuest();
        } else {
          $("questFeedback").textContent =
            "Chưa đúng thứ tự. Bạn thử lại với quy trình và mốc thời gian phù hợp nhé.";
          $("questFeedback").className = "questFeedback bad";
          soundCue("error");
          const wrongQuest = questCurrent;
          setTimeout(() => {
            if (questCurrent !== wrongQuest) return;
            questChoices = [];
            renderSideQuest();
            $("questFeedback").textContent =
              "Thử lại: chú ý thời điểm hoặc thứ tự phối hợp.";
          }, 850);
        }
      }
    }
    function init() {
      $("backWorld").onclick = () => {
        renderWorld();
        show("world");
      };
      $("finishPlace").onclick = completePlace;
      $("modalOkay").onclick = takeClue;
      $("closeModal").onclick = closeClue;
      $("clueModal").onclick = (e) => {
        if (e.target === $("clueModal")) closeClue();
      };
      $("boardBack").onclick = () => {
        renderWorld();
        show("world");
      };
      $("talkNPC").onclick = talkToNPC;
      $("questClose").onclick = closeSideQuest;
      $("questExit").onclick = closeSideQuest;
      $("questOverlay").onclick = (e) => {
        if (e.target === $("questOverlay")) closeSideQuest();
      };
      bindMapWalking();
    }
    function stopMovement() {
      mapWalking.target = null;
      mapWalking.keys.clear();
    }
    function enterWorld() {
      syncAvatar();
      updateWalkUI();
    }
    return {
      init,
      renderWorld,
      enterPlace,
      renderExplore,
      renderBoard,
      openClue,
      closeClue,
      takeClue,
      completePlace,
      talkToNPC,
      nearbySite,
      closeSideQuest,
      stopMovement,
      enterWorld,
      mapWalking,
      spriteSources: () => Object.values(SPRITES),
    };
  };
});
