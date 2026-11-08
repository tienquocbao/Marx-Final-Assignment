/* learning: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("./game-data.js"),
      require("./simulation.js"),
      require("./learning-content.js"),
    );
  else
    root.VCX.define(
      "learning",
      ["data", "simulation", "learning/content"],
      factory,
    );
})(globalThis, (VCX_DATA, VCXSim, VCXContent) => {
  "use strict";
  return function create({ store, ui, rules, save }) {
    const { POLICIES, STATE_TOOLS, PROOF_TITLES } = VCX_DATA;
    const { $, esc, notify, openLearning } = ui;

    const { rememberDecision } = rules;
    const CONTENT = VCXContent;
    let knowledgeCurrent = "coop_contract",
      debateActor = "bay";
    const decisionLabel = (ids) =>
      ids
        .split(" / ")
        .map(
          (id) =>
            POLICIES.find((p) => p.id === id)?.short ||
            STATE_TOOLS.find((t) => t.id === id)?.title ||
            { dock: "Lịch giao hàng" }[id] ||
            id,
        )
        .join(" · ");
    let debateDraft = {
      concept: null,
      cause: null,
      response: null,
      proof: "",
      order: [],
    };
    function knowledgeContext(key) {
      knowledgeCurrent = CONTENT.context[key] || key;
      if (!CONTENT.map[knowledgeCurrent]) knowledgeCurrent = "coop_contract";
      const n = $("knowledgeNudge");
      if (n)
        n.innerHTML = `🐟 Tình huống này liên quan đến <b>${esc(CONTENT.concepts[CONTENT.map[knowledgeCurrent].concepts[0]].title)}</b>. <button type="button" class="tinyBtn" id="contextKnowledge">Xem giải thích</button>`;
      $("contextKnowledge")?.addEventListener("click", () =>
        openKnowledge(knowledgeCurrent),
      );
      const b = $("knowledgeBtn");
      if (b) {
        b.title =
          "Giải thích tình huống: " +
          (PROOF_TITLES[knowledgeCurrent] || "Thỏa thuận");
        b.dataset.context = knowledgeCurrent;
      }
    }
    function openKnowledge(id = knowledgeCurrent) {
      knowledgeCurrent = CONTENT.map[id] ? id : "coop_contract";
      openLearning("Từ chứng cứ đến khái niệm");
      renderKnowledge();
    }
    function renderKnowledge() {
      const id = knowledgeCurrent,
        item = CONTENT.map[id];
      if (!store.state.learning.viewed.includes(id))
        store.state.learning.viewed.push(id);
      save();
      $("learningBody").innerHTML =
        `<p class="small muted">🐟 Cá Bống: Xem điều kiện của từng bên trước khi chọn giải pháp.</p><label for="knowledgeSelect">Bản đồ chứng cứ – khái niệm</label><select id="knowledgeSelect">${Object.keys(
          CONTENT.map,
        )
          .map(
            (k) =>
              `<option value="${k}" ${id === k ? "selected" : ""}>${VCXSim.owned(store.state, k) ? "✓" : "○"} ${esc(PROOF_TITLES[k])}</option>`,
          )
          .join(
            "",
          )}</select><article class="knowledgeCard"><span class="eyebrow">${VCXSim.owned(store.state, id) ? "CHỨNG CỨ ĐÃ CÓ" : "CHỨNG CỨ CÓ THỂ ĐIỀU TRA"}</span><h3>1. Tình huống · ${esc(PROOF_TITLES[id])}</h3><p>${esc(item.situation)}</p><h3>2. Khái niệm</h3><div class="pills">${item.concepts.map((k) => `<span class="pill">${esc(CONTENT.concepts[k].title)}</span>`).join("")}</div><h3>3. Các chủ thể</h3><p>${esc(item.analysis)}</p><h3>4. Quan hệ lợi ích</h3><p>${esc(item.relation)}</p><details><summary>5. Ghi nhớ và vận dụng</summary>${item.concepts.map((k) => `<p><b>${esc(CONTENT.concepts[k].title)}:</b> ${esc(CONTENT.concepts[k].remember)}</p>`).join("")}<p>Điểm quyết định liên quan: ${esc(decisionLabel(item.decision))}.</p></details></article><details><summary>Xem toàn bộ liên kết khái niệm</summary><div class="conceptMap">${Object.entries(
          CONTENT.map,
        )
          .map(
            ([k, v]) =>
              `<button type="button" class="conceptNode" data-concept-clue="${k}"><b>${esc(PROOF_TITLES[k])}</b><span>${v.actors.map((a) => VCXSim.ACTORS.find((x) => x.id === a).name).join(" · ")}</span><span>→ ${v.concepts.map((c) => esc(CONTENT.concepts[c].title)).join(" → ")}</span><small>Quyết định: ${esc(decisionLabel(v.decision))}</small></button>`,
          )
          .join(
            "",
          )}</div></details><p class="sourceNote">${esc(CONTENT.sourceNote)}</p>`;
      $("knowledgeSelect").onchange = (e) => {
        knowledgeCurrent = e.target.value;
        renderKnowledge();
        $("knowledgeSelect").focus();
      };
      document.querySelectorAll("[data-concept-clue]").forEach(
        (b) =>
          (b.onclick = () => {
            knowledgeCurrent = b.dataset.conceptClue;
            renderKnowledge();
            $("knowledgeSelect").focus();
          }),
      );
    }
    function openDebate(actor = "bay") {
      if (store.session.scene !== "hall") {
        notify("Tranh biện mở tại bàn đàm phán.");
        return;
      }
      debateActor = actor;
      const last = store.state.learning.debates[actor]?.selection;
      debateDraft =
        last && Array.isArray(last.order)
          ? JSON.parse(JSON.stringify(last))
          : {
              concept: null,
              cause: null,
              response: null,
              proof: "",
              order: [],
            };
      openLearning("Tranh biện với các bên");
      renderDebate();
    }
    function renderDebate() {
      const d = CONTENT.debates[debateActor];
      const select = (id, label, options, value) =>
        `<label for="${id}">${label}</label><select id="${id}"><option value="">Chọn một phương án</option>${options.map((o, i) => `<option value="${i}" ${value === i ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      $("learningBody").innerHTML =
        `<nav class="hearingTabs" aria-label="Chọn người tranh biện">${VCXSim.ACTORS.map((a) => `<button class="hearingTab ${a.id === debateActor ? "active" : ""}" type="button" data-debate-actor="${a.id}">${a.name}</button>`).join("")}</nav><h3>${esc(d.title)}</h3><p class="small">Chọn luận điểm, căn cứ, cách xử lý; xếp trật tự trình bày. Rubric 4 tiêu chí, mỗi tiêu chí 0–2. Đây là chấm lập luận có cấu trúc theo kịch bản, không đánh giá văn bản tự do hay dùng AI.</p><div class="debateForm">${select("debateConcept", "1. Luận điểm / khái niệm", d.concepts, debateDraft.concept)}<label for="debateProof">2. Chứng cứ bạn đã thu thập</label><select id="debateProof"><option value="">Chọn chứng cứ</option>${Object.keys(
          PROOF_TITLES,
        )
          .filter((id) => VCXSim.owned(store.state, id))
          .map(
            (id) =>
              `<option value="${id}" ${debateDraft.proof === id ? "selected" : ""}>${esc(PROOF_TITLES[id])}</option>`,
          )
          .join(
            "",
          )}</select>${select("debateCause", "3. Quan hệ nguyên nhân trong tình huống", d.causes, debateDraft.cause)}${select("debateResponse", "4. Phản biện và đề xuất", d.responses, debateDraft.response)}</div><h4>Sắp xếp lập luận</h4><div class="learningActions">${[
          ["response", "Đề xuất xử lý"],
          ["claim", "Luận điểm"],
          ["evidence", "Chứng cứ và phân tích"],
        ]
          .map(
            ([id, label]) =>
              `<button type="button" class="tinyBtn" data-order="${id}" ${debateDraft.order.includes(id) ? "disabled" : ""}>${label}</button>`,
          )
          .join(
            "",
          )}<button type="button" class="tinyBtn" id="debateReset">Xếp lại</button></div><p id="debateSequence" aria-live="polite">${debateDraft.order.map((k) => ({ claim: "Luận điểm", evidence: "Chứng cứ và phân tích", response: "Đề xuất xử lý" })[k]).join(" → ") || "Chưa xếp bước nào"}</p><button type="button" class="btn primary" id="submitDebate">Trình bày và nhận phản hồi</button><div id="debateResult" aria-live="polite">${store.state.learning.debates[debateActor] ? "<p>Lần đã nộp gần nhất: " + store.state.learning.debates[debateActor].rubric.reduce((a, b) => a + b, 0) + "/8. Bạn có thể sửa cấu trúc và trình bày lại.</p>" : ""}</div>`;
      document
        .querySelectorAll("[data-debate-actor]")
        .forEach((b) => (b.onclick = () => openDebate(b.dataset.debateActor)));
      for (const [id, key] of [
        ["debateConcept", "concept"],
        ["debateCause", "cause"],
        ["debateResponse", "response"],
        ["debateProof", "proof"],
      ])
        $(id).onchange = (e) => {
          debateDraft[key] =
            key === "proof"
              ? e.target.value
              : e.target.value === ""
                ? null
                : Number(e.target.value);
        };
      document.querySelectorAll("[data-order]").forEach(
        (b) =>
          (b.onclick = () => {
            debateDraft.order.push(b.dataset.order);
            renderDebate();
            (debateDraft.order.length === 3
              ? $("submitDebate")
              : $("debateReset")
            ).focus({ preventScroll: true });
          }),
      );
      $("debateReset").onclick = () => {
        debateDraft.order = [];
        renderDebate();
        document.querySelector("[data-order]")?.focus({ preventScroll: true });
      };
      $("submitDebate").onclick = submitDebate;
    }
    function submitDebate() {
      if (
        ["concept", "cause", "response"].some((k) => debateDraft[k] === null) ||
        !VCXSim.owned(store.state, debateDraft.proof) ||
        debateDraft.order.length !== 3
      ) {
        $("debateResult").textContent =
          "Cần chọn đủ luận điểm, chứng cứ, nguyên nhân, đề xuất và xếp ba bước.";
        return;
      }
      const result = CONTENT.gradeDebate(debateActor, debateDraft);
      store.state.learning.debates[debateActor] = result;
      rememberDecision("debate", debateActor, "submitted", null, {
        choice: CONTENT.debates[debateActor].title,
        evidence: [debateDraft.proof],
        benefits: result.explanation,
        costs:
          "Rubric chỉ áp dụng các lựa chọn được thiết kế; không phải đánh giá toàn diện năng lực tranh biện.",
      });
      save();
      $("debateResult").innerHTML =
        `<h4>${result.rubric.reduce((a, b) => a + b, 0)}/8 điểm lập luận</h4><ul>${["Đúng khái niệm", "Logic lập luận", "Vận dụng tình huống", "Chứng cứ phù hợp"].map((k, i) => `<li>${k}: ${result.rubric[i]}/2</li>`).join("")}</ul><p>${esc(result.explanation)}</p><p class="small">Luận điểm cần cân nhắc cả hai phía; dữ liệu phải hỗ trợ nguyên nhân đã nêu; phương án xử lý cần theo sau căn cứ. Bạn có thể sửa và trình bày lại. Tranh biện không cộng điểm lợi ích hay buộc NPC ký.</p>`;
    }
    function init() {
      $("knowledgeBtn").onclick = () => openKnowledge();
      $("debateBtn").onclick = () => openDebate();
      knowledgeContext("negotiation");
    }

    function legacyNotes() {
      alert(
        "KIẾN THỨC MLN122\n\n1. Lợi ích kinh tế thúc đẩy mỗi chủ thể hoạt động.\n2. Lợi ích các bên có sự thống nhất (cần hợp tác) và mâu thuẫn (giá, chi phí, rủi ro).\n3. Nhà nước tạo môi trường thuận lợi, bảo vệ lợi ích hợp pháp, điều hòa lợi ích, kiểm soát tác động tiêu cực và hỗ trợ giải quyết mâu thuẫn.\n\nGame dùng một tình huống giả định, không phải số liệu thực tế.",
      );
    }
    return { init, knowledgeContext, openKnowledge, openDebate, legacyNotes };
  };
});
