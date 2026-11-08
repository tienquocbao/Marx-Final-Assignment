/* negotiation: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../game-data.js"),
      require("../simulation.js"),
    );
  else root.VCX.define("negotiation", ["data", "simulation"], factory);
})(globalThis, (VCX_DATA, VCXSim) => {
  "use strict";
  return function create({
    store,
    ui,
    audio,
    rules,
    save,
    knowledgeContext,
    onBoard,
    onEnding,
  }) {
    const {
      SCENES,
      POLICIES,
      CHARS,
      STATE_TOOLS,
      ISSUES,
      INVITE_PEOPLE,
      PROOF_TITLES,
    } = VCX_DATA;
    const { $, esc, portrait, show, notify, setAtmosphere } = ui;
    const { sound, soundCue } = audio;
    const { evaluate, rememberDecision, ensureV7 } = rules;
    const renderEnding = onEnding;
    function inviteReady() {
      return INVITE_PEOPLE.every((p) => store.state.invited?.[p.id]);
    }
    function renderInvitations() {
      if (!store.state.invited)
        store.state.invited = { bay: false, sen: false, khoa: false };
      const clues = Object.keys(SCENES).flatMap((k) => SCENES[k].hotspots);
      $("inviteDeck").innerHTML = clues
        .map((h) => {
          const selected = store.state.inviteSelection === h.id;
          return `<button class="inviteDoc ${selected ? "selected" : ""}" data-invite-clue="${h.id}" aria-pressed="${selected}"><span class="ico">${h.icon}</span><b>${esc(h.name)}</b><small>${esc(h.lesson.slice(0, 85))}</small></button>`;
        })
        .join("");
      document.querySelectorAll("[data-invite-clue]").forEach((el) =>
        el.addEventListener("click", () => {
          store.state.inviteSelection = el.dataset.inviteClue;
          renderInvitations();
          $("inviteSelected").textContent =
            "Đã chọn: " +
            clues.find((c) => c.id === store.state.inviteSelection).name +
            ". Hãy đưa chứng cứ này tới người phù hợp.";
          sound(560, 0.06);
          save();
        }),
      );
      $("invitePeople").innerHTML = INVITE_PEOPLE.map((p) => {
        const accepted = store.state.invited[p.id],
          mood = accepted ? "relieved" : "stressed";
        return `<div class="invitePerson ${accepted ? "accepted" : ""}"><img class="character-portrait character-portrait--invite" src="${portrait(p.char, mood)}" alt="${p.name} – ${accepted ? "nhẹ nhõm" : "căng thẳng"}"><h3>${p.name}</h3><div class="heart">${accepted ? "✅ Đã nhận lời" : "🗣️ Còn băn khoăn"}</div><p>${esc(accepted ? p.success : p.concern)}</p><button type="button" data-invite-person="${p.id}" ${accepted ? "disabled" : ""}>${accepted ? "✓ Sẽ đến họp" : "Đưa chứng cứ & mời họp"}</button></div>`;
      }).join("");
      document
        .querySelectorAll("[data-invite-person]")
        .forEach((el) =>
          el.addEventListener("click", () =>
            convincePerson(el.dataset.invitePerson),
          ),
        );
      $("inviteProgress").textContent =
        INVITE_PEOPLE.filter((p) => store.state.invited[p.id]).length +
        " / 3 người đồng ý";
      $("inviteProceed").disabled = !inviteReady();
      $("inviteSelected").textContent = store.state.inviteSelection
        ? "Đã chọn: " +
          (clues.find((c) => c.id === store.state.inviteSelection)?.name ||
            "") +
          ". Hãy đưa cho nhân vật phù hợp."
        : "Chọn một chứng cứ bên trái trước khi mời nhân vật.";
    }
    function convincePerson(personId) {
      const p = INVITE_PEOPLE.find((x) => x.id === personId);
      if (!p || store.state.invited[p.id]) return;
      const target = $("inviteMessage");
      if (!store.state.inviteSelection) {
        target.className = "inviteMessage danger";
        target.textContent =
          "🐟 Cá Bống: “Định đi mời họp tay không thiệt hả? Chọn một chứng cứ trước!”";
        soundCue("error");
        return;
      }
      if (!VCXSim.owned(store.state, store.state.inviteSelection)) {
        target.textContent = "Hãy thu thập chứng cứ trước khi dùng hồ sơ.";
        return;
      }
      if (store.state.inviteSelection !== p.proof) {
        target.className = "inviteMessage danger";
        target.textContent = p.name + ": " + p.wrong;
        soundCue("error");
        return;
      }
      store.state.invited[p.id] = true;
      if (!store.state.learning.invitations.includes(p.id))
        store.state.learning.invitations.push(p.id);
      rememberDecision("invite", p.id, p.proof, null, {
        choice: p.success,
        evidence: [p.proof],
      });
      store.state.inviteSelection = null;
      renderInvitations();
      target.className = "inviteMessage success";
      target.textContent =
        p.name + ": " + p.success + " • Kiến thức MLN122: " + p.lesson;
      soundCue("solve");
      save();
    }
    function enterHallFromInvitation() {
      if (!inviteReady()) return;
      renderHall();
      show("hall");
      soundCue("solve");
    }
    let hearingWho = 0;
    function governanceComplete() {
      ensureV7();
      return STATE_TOOLS.every((t) => VCXSim.validTool(store.state, t));
    }

    function gainFromTool(t) {
      return t.choices.find((c) => c.id === store.state.governance?.[t.id]);
    }
    function seedDemoNegotiation() {
      ensureV7();
      if (store.state.mode !== "demo" || store.state.preparedDemo) return;
      // Hai điều khoản & hai vai trò được chuẩn bị dựa trên chứng cứ đã khám phá, không phải do game 'chấm đúng'.
      store.state.policies.price ??= "fair";
      store.state.policies.fees ??= "fair";
      store.state.governance.rights ??= "document";
      store.state.govProof.rights ??= "coop_contract";
      store.state.governance.harmony ??= "training";
      store.state.govProof.harmony ??= "field_cost";
      store.state.preparedDemo = true;
      rememberDecision("prepared", "demo", "seed", null, {
        source: "prepared",
        choice: "Hồ sơ mẫu: giá, phí, pháp lý, điều hòa",
        evidence: ["coop_contract", "field_cost"],
      });
      save();
    }
    function effectiveness() {
      return VCXSim.effective(store.state, VCX_DATA);
    }

    function moodFor(n) {
      return n >= 75
        ? "relieved"
        : n >= 59
          ? "thinking"
          : n >= 43
            ? "worried"
            : "angry";
    }
    function renderDemoGuide() {
      const el = $("v71Guide");
      if (!el) return;
      if (store.state.mode !== "demo") {
        el.innerHTML =
          "<span>🧭 Chế độ đầy đủ: thử các lựa chọn, nghe phản biện và sử dụng chứng cứ để xây dựng công cụ điều tiết.</span>";
        return;
      }
      el.innerHTML = `<div><b>🎤 Bản trình chiếu – 3 lượt quyết định trực tiếp</b><p>Vụ việc đã chuẩn bị 2 điều khoản (giá, phí) và 2 vai trò (pháp lý, điều hòa). Lớp sẽ quyết định <b>rủi ro sản xuất</b>, <b>kiểm soát tác động tiêu cực</b>, rồi <b>giải quyết mâu thuẫn</b>. Cả 4 vai trò Nhà nước vẫn hiển thị.</p></div><button type="button" class="tinyBtn" id="demoExpand">${store.state.demoExpanded ? "Thu gọn mục đã chuẩn bị" : "Xem và sửa toàn bộ phương án"}</button>`;
      $("demoExpand").onclick = () => {
        store.state.demoExpanded = !store.state.demoExpanded;
        renderHall();
        save();
      };
    }
    function isPrepared(section, id) {
      return (
        store.state.mode === "demo" &&
        !store.state.demoExpanded &&
        ((section === "policy" && ["price", "fees"].includes(id)) ||
          (section === "gov" && ["rights", "harmony"].includes(id)))
      );
    }
    function renderHall() {
      knowledgeContext("negotiation");
      setAtmosphere("meeting");
      ensureV7();
      seedDemoNegotiation();
      renderDemoGuide();
      const e = evaluate();
      $("stakeholders").innerHTML = CHARS.map((c) => {
        let v = e.vals[c.idx],
          reasons = actorReasons(c.idx);
        let mood = VCXSim.mood(store.state, c.idx, VCX_DATA);
        return `<div class="stake"><img class="character-portrait character-portrait--stake" src="${portrait(c.key, mood)}" alt="${esc(c.name)}"><b>${esc(c.name)}</b><p>${reasons.length ? esc(reasons[0].text) : "Đang chờ điều khoản để cân nhắc."}</p><div class="reaction ${reasons.some((x) => x.type === "warn") ? "warn" : ""}">${e.actors[c.idx].accepted ? "✓ Đủ điều kiện cá thể để cân nhắc ký" : e.actors[c.idx].critical.length ? "⚠ Chưa chấp thuận: còn điều kiện thiết yếu" : "○ Cần thêm bảo đảm"}</div><small class="scenarioNumber">Lợi ích ${v}/100 · tin tưởng riêng ${e.actors[c.idx].trust}/100 (giả lập)</small></div>`;
      }).join("");
      $("policies").innerHTML = POLICIES.map((p) => {
        const chosen = p.choices.find(
            (c) => c.id === store.state.policies[p.id],
          ),
          prep = isPrepared("policy", p.id);
        return `<div class="policy ${prep ? "v71Prepared" : ""}"><h3>📌 ${p.title}</h3><small>${esc(p.explain)}</small>${prep ? `<div class="preparedLine">📁 Đã chuẩn bị từ hồ sơ: <b>${esc(chosen?.name || "")}</b><p>${esc(chosen?.accept || "")}</p></div>` : `<div class="choices">${p.choices.map((c) => `<button class="choice ${store.state.policies[p.id] === c.id ? "chosen" : ""}" data-policy="${p.id}" data-pick="${c.id}">${esc(c.name)}<small class="v71Trade">Đánh đổi: ${esc(c.accept)}</small></button>`).join("")}</div>`}</div>`;
      }).join("");
      document
        .querySelectorAll("[data-policy]")
        .forEach((el) =>
          el.addEventListener("click", () =>
            pickPolicy(el.dataset.policy, el.dataset.pick),
          ),
        );
      $("agreementItems").innerHTML = POLICIES.map((p) => {
        const selected = p.choices.find(
          (c) => c.id === store.state.policies[p.id],
        );
        return `<div class="agItem ${selected ? "done" : ""}">${selected ? "✅" : "⬜"} <b>${p.short}:</b> ${selected ? esc(selected.name) : "Chưa thống nhất"}</div>`;
      }).join("");
      $("governanceSection").hidden = POLICIES.some(
        (p) => !store.state.policies[p.id],
      );
      renderGovernance();
      renderHearing();
      renderImpact();
      $("checkAgreement").disabled =
        POLICIES.some((p) => !store.state.policies[p.id]) ||
        !governanceComplete();
      $("saltNews").hidden = $("checkAgreement").disabled;
      const filled = STATE_TOOLS.filter(
        (t) =>
          store.state.governance[t.id] &&
          t.proofs.includes(store.state.govProof[t.id]),
      ).length;
      $("agreementReadiness").textContent =
        filled === 4
          ? "Đủ chứng cứ và công cụ cho 4 vai trò. Thử thách độ mặn sẽ kiểm tra tính khả thi."
          : `Đã lập ${filled}/4 đề xuất có chứng cứ. Chọn chứng cứ rồi chọn biện pháp cho vai trò còn lại.`;
    }
    function renderGovernance() {
      const root = $("governanceCards");
      if (!root) return;
      ensureV7();
      root.innerHTML = STATE_TOOLS.map((t) => {
        const chosen = gainFromTool(t),
          proof = store.state.govProof[t.id],
          prep = isPrepared("gov", t.id);
        return `<article class="governanceRole ${chosen ? "complete" : ""} ${prep ? "v71Prepared" : ""}"><div class="govRoleHead"><div><small>VAI TRÒ ${t.role} · VẬN DỤNG TÌNH HUỐNG</small><h4>${t.icon} ${esc(t.title)}</h4></div><span class="govTick">${VCXSim.validTool(store.state, t) ? "✓ Có căn cứ" : "○ Chưa xong"}</span></div><p>${esc(t.context)}</p>${prep ? `<div class="preparedLine">📁 Hồ sơ đã chuẩn bị: <b>${esc(PROOF_TITLES[proof] || "")}</b><p>${esc(chosen?.title || "")}</p></div>` : `<div class="govClue">📁 Chọn tài liệu làm căn cứ (đã điều tra)</div><div class="proofChoices">${t.proofs.map((id) => `<button ${VCXSim.owned(store.state, id) ? "" : "disabled"} type="button" class="proofChoice ${proof === id ? "selected" : ""}" data-proof-tool="${t.id}" data-proof-id="${id}">${esc(PROOF_TITLES[id] || id)}</button>`).join("")}</div><div class="govChoices">${t.choices.map((c) => `<button type="button" class="govChoice ${store.state.governance[t.id] === c.id ? "chosen" : ""}" data-gov="${t.id}" data-gov-pick="${c.id}"><b>${esc(c.title)}</b><small>${esc(c.desc)}</small></button>`).join("")}</div>`}${chosen ? `<div class="govResponse"><b>Góc nhìn khác:</b> ${esc(chosen.reply)}</div>` : ""}</article>`;
      }).join("");
      root.querySelectorAll("[data-proof-tool]").forEach((el) =>
        el.addEventListener("click", () => {
          const tool = el.dataset.proofTool,
            id = el.dataset.proofId;
          if (
            !VCXSim.owned(store.state, id) ||
            store.state.govProof[tool] === id
          )
            return;
          const before = evaluate();
          store.state.govProof[tool] = id;
          rememberDecision("proof", tool, id, before, {
            choice: PROOF_TITLES[id],
            evidence: [id],
          });
          renderHall();
          document
            .querySelector(`[data-proof-tool="${tool}"][data-proof-id="${id}"]`)
            ?.focus({ preventScroll: true });
          notify("Đã gắn chứng cứ " + (PROOF_TITLES[el.dataset.proofId] || ""));
          save();
        }),
      );
      root
        .querySelectorAll("[data-gov]")
        .forEach((el) =>
          el.addEventListener("click", () =>
            pickGovernance(el.dataset.gov, el.dataset.govPick),
          ),
        );
      $("govProgress").textContent =
        `${STATE_TOOLS.filter((t) => store.state.governance[t.id] && t.proofs.includes(store.state.govProof[t.id])).length}/4 vai trò đã có căn cứ`;
    }

    function pickGovernance(toolId, choiceId) {
      const t = STATE_TOOLS.find((x) => x.id === toolId),
        c = t?.choices.find((x) => x.id === choiceId);
      if (!c || store.state.governance[toolId] === choiceId) return;
      if (
        !t.proofs.includes(store.state.govProof[toolId]) ||
        !VCXSim.owned(store.state, store.state.govProof[toolId])
      ) {
        notify("Hãy thu thập và chọn chứng cứ liên quan trước khi đề xuất.");
        return;
      }
      const before = evaluate();
      store.state.governance[toolId] = choiceId;
      rememberDecision("governance", toolId, choiceId, before, {
        choice: c.title,
        evidence: [store.state.govProof[toolId]],
        benefits: c.reply,
        costs: c.desc,
      });
      const after = evaluate();
      renderHall();
      $("debateBubble").innerHTML =
        `<b>${t.icon} ${esc(t.title)}</b><div>${esc(c.reply)}</div><small>Niềm tin: ${before.trust} → ${after.trust}; cộng đồng: ${before.society} → ${after.society}. Nghe từng bên để kiểm tra điều kiện ký.</small>`;
      document
        .querySelector(`[data-gov="${toolId}"][data-gov-pick="${choiceId}"]`)
        ?.focus({ preventScroll: true });
      soundCue("click");
      knowledgeContext(toolId);
      save();
    }

    function actorReasons(idx) {
      return VCXSim.concerns(store.state, idx, VCX_DATA);
    }

    function feedbackForActor(idx) {
      return (
        actorReasons(idx)
          .map((x) => (x.type === "warn" ? "⚠ " : "✓ ") + x.text)
          .join(" • ") || "Mỗi bên đang cân nhắc quyền lợi và trách nhiệm."
      );
    }
    function renderHearing() {
      const root = $("hearingPanel");
      if (!root) return;
      const e = evaluate(),
        c = CHARS[hearingWho];
      const lines = actorReasons(hearingWho);
      root.innerHTML = `<div class="hearingTabs">${CHARS.map((p, i) => `<button type="button" data-hear="${i}" class="hearingTab ${i === hearingWho ? "active" : ""}">${esc(p.name)}</button>`).join("")}</div><div class="hearingBody"><img class="character-portrait character-portrait--hearing" src="${portrait(c.key, VCXSim.mood(store.state, hearingWho, VCX_DATA))}" alt="Biểu cảm ${esc(c.name)}"><div><b>${esc(c.name)}: ${e.actors[hearingWho].accepted ? "Có thể cân nhắc ký" : "Cần giải quyết điều kiện"}</b><p>${esc(VCXSim.dialogue(store.state, hearingWho, VCX_DATA).text)}</p><ul class="v71Reasons">${lines.map((r) => `<li class="${r.type}">${r.type === "warn" ? "⚠" : "✓"} ${esc(r.text)}</li>`).join("")}</ul><small>Nhân vật phản ứng theo nhiều điều khoản, không chỉ theo điểm.</small></div></div>`;
      root.querySelectorAll("[data-hear]").forEach((b) =>
        b.addEventListener("click", () => {
          hearingWho = Number(b.dataset.hear);
          const id = VCXSim.ACTORS[hearingWho].id;
          if (!store.state.learning.heard.includes(id))
            store.state.learning.heard.push(id);
          renderHearing();
          document
            .querySelector(`[data-hear="${hearingWho}"]`)
            ?.focus({ preventScroll: true });
          save();
          sound(510, 0.04);
        }),
      );
    }
    function renderImpact() {
      const root = $("impactPanel");
      if (!root) return;
      const e = evaluate();
      const items = [
        { name: "Niềm tin giữa các bên", v: e.trust },
        { name: "Lợi ích cộng đồng / môi trường", v: e.society },
      ];
      root.innerHTML = `<div class="impactBars">${items.map((x) => `<div class="impactItem"><div><b>${x.name}</b><strong>${x.v}/100</strong></div><div class="impactTrack"><i style="width:${x.v}%"></i></div></div>`).join("")}</div><div class="causalTrail"><strong>Tiến độ mô phỏng:</strong> ${e.good}/3 điều khoản khả thi trong bối cảnh, ${e.govGood}/4 công cụ có điều kiện phù hợp. ${e.min < 60 ? "Một bên còn nhiều rủi ro; nghe phản biện để điều chỉnh." : "Các bên có cơ sở tiếp tục bàn bạc; kết quả còn phụ thuộc biến cố."}</div>`;
    }
    function renderPolicyReply(p, c) {
      const box = $("debateBubble");
      box.innerHTML = `<b>💬 Đánh đổi ở điều khoản ${esc(p.short)}</b><div>${esc(c.accept)}</div><small>${esc(feedbackForActor(0))}</small>`;
    }
    function pickPolicy(key, id) {
      const p = POLICIES.find((x) => x.id === key),
        c = p?.choices.find((x) => x.id === id);
      if (!c || store.state.policies[key] === id) return;
      const before = evaluate();
      store.state.policies[key] = id;
      rememberDecision("policy", key, id, before, {
        choice: c.name,
        benefits: c.delta
          .map((v, i) => (v > 0 ? CHARS[i].name + " +" + v : ""))
          .filter(Boolean)
          .join("; "),
        costs: c.accept,
        evidence: ISSUES.filter(
          (x) => x.id === key && VCXSim.owned(store.state, x.clue),
        ).map((x) => x.clue),
      });
      $("advice").textContent = c.accept;
      renderHall();
      renderPolicyReply(p, c);
      document
        .querySelector(`[data-policy="${key}"][data-pick="${id}"]`)
        ?.focus({ preventScroll: true });
      soundCue("click");
      knowledgeContext(key);
      save();
    }
    const CRISIS_ACTIONS = [
      {
        id: "verify",
        label: "🔍 Xác minh mức độ ảnh hưởng và chất lượng lô lúa",
        order: 2,
      },
      {
        id: "apply",
        label: "📜 Đối thoại, thực hiện điều khoản và điều chỉnh kế hoạch",
        order: 3,
      },
      {
        id: "alert",
        label: "📡 Thông báo cảnh báo đến nông dân, HTX và doanh nghiệp",
        order: 1,
      },
    ];
    let crisisSteps = [];
    function openCrisis() {
      if (
        POLICIES.some((p) => !store.state.policies[p.id]) ||
        !governanceComplete()
      ) {
        notify(
          "Hãy hoàn thành 3 điều khoản và 4 công cụ điều phối trước khi thử biến cố.",
        );
        return;
      }
      crisisSteps = store.state.sideQuests?.water ? ["alert"] : [];
      $("crisisMessage").textContent = store.state.sideQuests?.water
        ? "📡 Nhờ nhiệm vụ trạm nước, cảnh báo đã được gửi trước. Hãy xác minh dữ liệu rồi bàn cách xử lý."
        : "Gợi ý: không thể điều chỉnh hợp đồng dựa trên dữ liệu chưa xác minh.";
      setAtmosphere("crisis");
      $("crisisModal").classList.add("show");
      renderCrisis();
      soundCue("storm");
    }
    function renderCrisis() {
      $("crisisSequence").innerHTML = crisisSteps.length
        ? crisisSteps
            .map(
              (id) =>
                `<span class="token">${CRISIS_ACTIONS.find((x) => x.id === id).label}</span>`,
            )
            .join("<span>→</span>")
        : "Chưa có hành động nào";
      $("crisisChoices").innerHTML = CRISIS_ACTIONS.map(
        (a) =>
          `<button type="button" data-action="${a.id}" ${crisisSteps.includes(a.id) ? "disabled" : ""}>${esc(a.label)}</button>`,
      ).join("");
      $("crisisChoices")
        .querySelectorAll("[data-action]")
        .forEach((el) =>
          el.addEventListener("click", () => {
            crisisSteps.push(el.dataset.action);
            renderCrisis();
            sound(560, 0.06);
            if (crisisSteps.length === 3) {
              const right = crisisSteps.join(",") === "alert,verify,apply";
              $("crisisMessage").textContent = right
                ? "✅ Có căn cứ phối hợp: báo sớm → kiểm chứng → thực hiện cam kết. Bạn có thể xem kết thúc."
                : "⚠️ Các bước chưa đúng trình tự. Hãy thử lại: thông tin phải đến các bên trước, sau đó mới xác minh và điều chỉnh.";
            }
          }),
        );
      $("crisisCommit").disabled = crisisSteps.length !== 3;
    }
    function resetCrisis() {
      crisisSteps = store.state.sideQuests?.water ? ["alert"] : [];
      $("crisisMessage").textContent =
        "Đã đặt lại. Hãy suy nghĩ về cách xử lý sớm và bảo vệ quyền lợi hợp pháp.";
      renderCrisis();
    }
    function commitCrisis() {
      const correct = crisisSteps.join(",") === "alert,verify,apply";
      store.state.crisis = correct ? "prepared" : "unprepared";
      store.state.crisisSequence = [...crisisSteps];
      rememberDecision("crisis", "salinity", store.state.crisis, null, {
        choice: crisisSteps.join(" → "),
        evidence: VCXSim.owned(store.state, "field_sensor")
          ? ["field_sensor"]
          : [],
        benefits: correct
          ? "Cảnh báo và xác minh trước khi điều chỉnh"
          : "Quy trình chưa đủ căn cứ",
        costs: correct
          ? "Cần phối hợp và thời gian kiểm định"
          : "Rủi ro phản ứng chậm hoặc xử lý dựa trên tin chưa xác minh",
      });
      knowledgeContext("risk");
      $("crisisModal").classList.remove("show");
      if (correct) soundCue("solve");
      else soundCue("error");
      finish();
    }
    function finish() {
      if (
        POLICIES.some((p) => !store.state.policies[p.id]) ||
        !governanceComplete()
      ) {
        notify(
          "Cần hoàn thành điều khoản và công cụ điều phối trước khi đánh giá.",
        );
        return;
      }
      store.state.legacyResult = null;
      store.state.result = evaluate().result;
      renderEnding();
      show("ending");
      save();
    }
    function init() {
      $("enterHall").onclick = () => {
        renderInvitations();
        show("invite");
      };
      $("checkAgreement").onclick = openCrisis;
      $("crisisReset").onclick = resetCrisis;
      $("crisisCommit").onclick = commitCrisis;
      $("inviteBack").onclick = () => {
        onBoard();
        show("board");
      };
      $("inviteProceed").onclick = enterHallFromInvitation;
    }
    function selectHearing(index) {
      if (index >= 0 && index < CHARS.length) hearingWho = index;
    }
    return {
      init,
      inviteReady,
      renderInvitations,
      renderHall,
      renderHearing,
      renderCrisis,
      openCrisis,
      pickPolicy,
      pickGovernance,
      actorReasons,
      gainFromTool,
      selectHearing,
      governanceComplete,
    };
  };
});
