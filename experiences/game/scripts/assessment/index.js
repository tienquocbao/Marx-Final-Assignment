/* assessment: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../game-data.js"),
      require("../simulation.js"),
      require("../learning-content.js"),
      require("./model.js"),
    );
  else
    root.VCX.define(
      "assessment",
      ["data", "simulation", "learning/content", "assessment/model"],
      factory,
    );
})(globalThis, (VCX_DATA, VCXSim, VCXContent, Model) => {
  "use strict";
  return function create({ store, ui, rules, save, onExport }) {
    const { STATE_TOOLS, PROOF_TITLES } = VCX_DATA;
    const { $, esc, notify, openLearning } = ui;

    const { evaluate } = rules;
    const CONTENT = VCXContent;
    let quizIndex = 0;
    const { CHECK_LABELS } = Model;
    const learningProfile = () => Model.learningProfile(store.state),
      priorityText = () => Model.priorityText(store.state),
      quizScore = () => Model.quizScore(store.state);
    const gainFromTool = (t) =>
      t.choices.find((c) => c.id === store.state.governance[t.id]);
    const createDecisionReport = onExport;
    function debriefHTML() {
      const e = evaluate(),
        history = store.state.decisions
          .filter(
            (d) =>
              ["policy", "governance", "crisis"].includes(d.kind) &&
              d.source !== "prepared",
          )
          .slice(-10),
        profile = learningProfile();
      const quiz = store.state.learning.quiz,
        debates = Object.entries(store.state.learning.debates);
      return `<h3>🌱 Nhìn lại hành trình · ${esc(store.state.result || "Đang chơi")}</h3><p>${esc(priorityText())}</p><div class="assessmentGrid">${profile.map((m) => `<article class="assessmentItem"><b>${esc(m.title)}</b><strong>${m.score}/100</strong><progress max="100" value="${m.score}" aria-label="${esc(m.title)}"></progress><small>${esc(m.evidence)}</small></article>`).join("")}</div><p class="small muted">Chỉ báo hành vi có giới hạn, không phải điểm năng lực chính thức. Mục chuẩn bị sẵn không tính như quyết định của bạn. Đọc panel chỉ ghi nội dung đã mở, không tự tăng điểm.</p><div class="knowledgeCard"><h4>Kiểm tra và tranh biện</h4><p>Quiz: ${quiz.submitted ? quizScore() + "/10 · đã nộp, xem giải thích trong 10 tình huống sau game" : quiz.answers.filter((n) => Number.isInteger(n)).length + "/10 câu đã chọn · chưa nộp"}.</p><p>${debates.length ? debates.map(([id, d]) => esc(VCXSim.ACTORS.find((a) => a.id === id)?.name || id) + ": " + d.rubric.reduce((a, b) => a + b, 0) + "/8 điểm lập luận").join(" · ") : "Chưa có bài tranh biện được nộp."}</p></div><details open><summary>Vì sao dẫn đến kết quả hiện tại?</summary><ul>${Object.entries(
        e.checks,
      )
        .map(([k, v]) => `<li>${v ? "✓" : "○"} ${CHECK_LABELS[k]}</li>`)
        .join("")}</ul></details><div class="debriefActors">${e.actors
        .map(
          (a) =>
            `<article class="knowledgeCard"><h4>${esc(a.name)} · lợi ích ${a.score}, tin tưởng ${a.trust}</h4><p>${a.accepted ? "Đủ điều kiện cá thể để cân nhắc hợp tác." : "Chưa đủ điều kiện cá thể để ký."}</p><p>${
              a.concerns
                .filter((r) => r.type === "warn")
                .map(
                  (r) =>
                    (r.critical ? "Thiết yếu: " : "Cần theo dõi: ") +
                    esc(r.text),
                )
                .join("<br>") ||
              "Các mâu thuẫn trọng yếu đã có cơ chế xử lý trong bản dự thảo."
            }</p>${a.scar ? "<small>Đề xuất trước đã được sửa nhưng vẫn để lại thận trọng trong quan hệ.</small>" : ""}</article>`,
        )
        .join(
          "",
        )}</div><details><summary>Quyết định và hệ quả gần nhất</summary>${history.length ? history.map((d) => `<article class="decisionEntry"><b>#${esc(d.serial || d.at)} ${esc(d.choice || d.id)}</b><p>Được: ${esc(d.benefits || "Đối chiếu điều kiện hợp tác")}<br>Đánh đổi: ${esc(d.costs || "Cần nguồn lực và phối hợp")}</p><small>Chứng cứ: ${(d.evidence || []).map((x) => esc(PROOF_TITLES[x] || x)).join(", ") || "Chưa gắn"}<br>${(d.effects || []).map((x) => esc(VCXSim.ACTORS.find((a) => a.id === x.actor)?.name || x.actor) + ": " + (x.delta >= 0 ? "+" : "") + x.delta).join(" · ")}</small></article>`).join("") : "Chưa có quyết định chủ động được ghi nhận."}</details><h4>Vai trò Nhà nước đã vận dụng</h4><ul>${STATE_TOOLS.map((t) => `<li>${esc(t.title)}: ${esc(gainFromTool(t)?.title || "Chưa chọn")} · ${esc(PROOF_TITLES[store.state.govProof[t.id]] || "Chưa gắn chứng cứ")}</li>`).join("")}</ul><h4>Nội dung nên ôn</h4><ul>${
        profile
          .filter((m) => m.score < 100)
          .map((m) => `<li>${esc(m.review)}</li>`)
          .join("") ||
        "<li>Thử một chiến lược khác và giải thích vì sao các bên vẫn có thể đồng thuận.</li>"
      }</ul><p class="sourceNote">${esc(CONTENT.sourceNote)}</p>`;
    }
    function renderDebrief() {
      const el = $("debriefSection");
      if (el) el.innerHTML = debriefHTML();
    }
    function openDashboard() {
      openLearning("Hồ sơ học tập của bạn");
      $("learningBody").innerHTML =
        debriefHTML() +
        `<div class="learningActions"><button type="button" class="btn soft" id="dashboardExport">Xuất báo cáo TXT</button>${store.state.result ? '<button type="button" class="btn primary" id="dashboardQuiz">Làm / xem lại 10 tình huống</button>' : "<p>Quiz mở sau khi hoàn thành một kết thúc.</p>"}</div>`;
      $("dashboardExport").onclick = createDecisionReport;
      $("dashboardQuiz")?.addEventListener("click", openQuiz);
    }
    function openQuiz() {
      if (!store.state.result) {
        notify("Hoàn thành một kết thúc để mở quiz.");
        return;
      }
      quizIndex = 0;
      openLearning("10 tình huống sau hành trình");
      renderQuiz();
    }
    function renderQuiz() {
      const quiz = store.state.learning.quiz;
      if (quiz.submitted) {
        renderQuizResults();
        return;
      }
      const q = CONTENT.quiz[quizIndex];
      $("learningBody").innerHTML =
        `<div class="eyebrow">TÌNH HUỐNG ${quizIndex + 1}/10</div><h3>${esc(q.q)}</h3><fieldset class="quizOptions"><legend>Chọn cách phân tích phù hợp nhất</legend>${q.options.map((o, i) => `<label><input type="radio" name="quizAnswer" value="${i}" ${quiz.answers[quizIndex] === i ? "checked" : ""}> <span>${esc(o)}</span></label>`).join("")}</fieldset><p id="quizFeedback" aria-live="polite"></p><div class="learningActions"><button type="button" class="btn soft" id="quizPrev" ${quizIndex === 0 ? "disabled" : ""}>← Câu trước</button><button type="button" class="btn primary" id="quizNext">${quizIndex === 9 ? "Nộp và xem giải thích" : "Câu tiếp →"}</button></div>`;
      const question = $("learningBody").querySelector("h3");
      question.tabIndex = -1;
      question.focus({ preventScroll: true });
      document.querySelectorAll("[name=quizAnswer]").forEach(
        (r) =>
          (r.onchange = () => {
            quiz.answers[quizIndex] = Number(r.value);
            save();
          }),
      );
      $("quizPrev").onclick = () => {
        quizIndex--;
        renderQuiz();
      };
      $("quizNext").onclick = () => {
        if (!Number.isInteger(quiz.answers[quizIndex])) {
          $("quizFeedback").textContent = "Chọn một phương án để tiếp tục.";
          return;
        }
        if (quizIndex === 9) {
          quiz.submitted = true;
          save();
          renderQuizResults();
          renderDebrief();
        } else {
          quizIndex++;
          renderQuiz();
        }
      };
    }
    function renderQuizResults() {
      const score = quizScore();
      const wrong = CONTENT.quiz.filter(
        (q, i) => store.state.learning.quiz.answers[i] !== q.answer,
      );
      $("learningBody").innerHTML =
        `<h3>Đã hoàn thành: ${score}/10</h3><p>${score >= 8 ? "Bạn phân tích tốt các tình huống trong bài. Hãy thử giải thích một chiến lược khác với bạn học." : score >= 5 ? "Bạn đã nhận ra một số quan hệ lợi ích; cần xem lại đánh đổi và điều kiện thực hiện." : "Hãy xem lại các chủ thể, chứng cứ và bốn vai trò Nhà nước trước khi chơi lại."}</p><p>Nên ôn: ${[...new Set(wrong.map((q) => CONTENT.concepts[q.concept].title))].map(esc).join(", ") || "Thử vận dụng sang một tình huống mới."}</p>${CONTENT.quiz.map((q, i) => `<details class="quizReview"><summary>${i + 1}. ${store.state.learning.quiz.answers[i] === q.answer ? "✓" : "○"} ${esc(q.q)}</summary><p>Bạn chọn: ${esc(q.options[store.state.learning.quiz.answers[i]] || "Chưa chọn")}</p><ul>${q.options.map((o, j) => `<li><b>${j === q.answer ? "✓ " : ""}${esc(o)}</b><br>${esc(q.explain[j])}</li>`).join("")}</ul></details>`).join("")}<button type="button" class="btn soft" id="quizExport">Xuất báo cáo gồm kết quả quiz</button><p class="sourceNote">${esc(CONTENT.sourceNote)}</p>`;
      $("quizExport").onclick = createDecisionReport;
    }
    function init() {
      $("learningBtn").onclick = openDashboard;
      $("quizBtn").onclick = openQuiz;
    }

    return { init, renderDebrief, openDashboard, openQuiz, learningProfile };
  };
});
