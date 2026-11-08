/* assessment/report: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../game-data.js"),
      require("../learning-content.js"),
      require("./model.js"),
    );
  else
    root.VCX.define(
      "assessment/report",
      ["data", "learning/content", "assessment/model"],
      factory,
    );
})(globalThis, (VCX_DATA, VCXContent, Model) => {
  "use strict";
  return function create({ store, ui, rules }) {
    const { POLICIES, STATE_TOOLS, PROOF_TITLES } = VCX_DATA;
    const { esc } = ui;

    const { evaluate } = rules;
    const CONTENT = VCXContent;
    const { CHECK_LABELS } = Model;
    const learningProfile = () => Model.learningProfile(store.state),
      priorityText = () => Model.priorityText(store.state),
      quizScore = () => Model.quizScore(store.state);
    const gainFromTool = (t) =>
      t.choices.find((c) => c.id === store.state.governance[t.id]);
    function learningReportText() {
      const e = evaluate(),
        l = store.state.learning;
      return [
        "HỒ SƠ HỌC TẬP V8.0",
        store.state.legacyResult
          ? "Kết thúc lưu theo luật cũ: " +
            store.state.legacyResult +
            "; đối chiếu điều kiện v8 hiện tại: " +
            e.result
          : "Đánh giá điều kiện v8: " + e.result,
        priorityText(),
        ...learningProfile().map(
          (m) => `${m.title}: ${m.score}/100. ${m.evidence}`,
        ),
        "",
        "ĐIỀU KIỆN KẾT THÚC",
        ...Object.entries(e.checks).map(
          ([k, v]) => `${v ? "Đạt" : "Chưa đạt"}: ${CHECK_LABELS[k]}`,
        ),
        "",
        ...e.actors.map(
          (a) =>
            `${a.name}: lợi ích ${a.score}; tin tưởng ${a.trust}; ${a.accepted ? "đủ điều kiện cá thể" : "chưa đủ điều kiện"}. ${a.concerns.map((r) => r.text).join(" ")}`,
        ),
        "",
        "LỊCH SỬ QUYẾT ĐỊNH",
        ...store.state.decisions.map(
          (d) =>
            `#${esc(d.serial || d.at)} [${d.source || "legacy"} / ${d.kind}] ${d.choice || d.id}\n  Được: ${d.benefits || "Chưa ghi ở save cũ"}\n  Chi phí/rủi ro: ${d.costs || "Chưa ghi ở save cũ"}\n  Chứng cứ: ${(d.evidence || []).map((k) => PROOF_TITLES[k] || k).join(", ")}\n  Hệ quả: ${(d.consequences || []).join("; ")}\n  Phản ứng: ${(d.effects || []).map((x) => x.actor + " " + x.delta + "; tin tưởng " + x.trust + "; " + (x.concerns || []).join("; ")).join(" | ")}`,
        ),
        "",
        "KIẾN THỨC ĐÃ MỞ",
        ...l.viewed.map(
          (id) =>
            PROOF_TITLES[id] +
            ": " +
            (CONTENT.map[id]?.concepts || [])
              .map((c) => CONTENT.concepts[c].title)
              .join(", "),
        ),
        "",
        "TRANH BIỆN",
        ...Object.entries(l.debates).map(
          ([id, d]) =>
            `${id}: ${d.rubric.join(" / ")} (khái niệm / logic / vận dụng / chứng cứ). ${d.explanation}`,
        ),
        "",
        "QUIZ",
        l.quiz.submitted
          ? `${quizScore()}/10`
          : l.quiz.answers.filter((n) => Number.isInteger(n)).length +
            "/10 câu đã chọn, chưa nộp",
        ...(l.quiz.submitted
          ? CONTENT.quiz.map(
              (q, i) =>
                `${i + 1}. ${q.q}\n  Đã chọn: ${q.options[l.quiz.answers[i]]}\n  Giải thích: ${q.explain[l.quiz.answers[i]]}`,
            )
          : []),
        "",
        "KHUYẾN NGHỊ",
        ...learningProfile()
          .filter((m) => m.score < 100)
          .map((m) => m.review),
        ...CONTENT.quiz
          .filter((q, i) => l.quiz.submitted && l.quiz.answers[i] !== q.answer)
          .map((q) => "Ôn " + CONTENT.concepts[q.concept].title),
        CONTENT.sourceNote,
      ].join("\n");
    }
    function createDecisionReport() {
      const e = evaluate();
      const lines = [
        "VÙNG CỒN XANH – NHẬT KÝ ĐIỀU PHỐI (GIẢ LẬP)",
        "MLN122 Group 2 | Câu chuyện về quan hệ lợi ích và vai trò Nhà nước",
        "",
        `Kết thúc: ${store.state.result || "Chưa hoàn thành"}`,
        `Điều khoản khả thi trong bối cảnh: ${e.good}/3; công cụ Nhà nước: ${e.govGood}/4`,
        `Niềm tin: ${e.trust}/100; lợi ích cộng đồng / môi trường: ${e.society}/100`,
        ...POLICIES.map((p) => {
          let c = p.choices.find((x) => x.id === store.state.policies[p.id]);
          return `THỎA THUẬN: ${p.title}: ${c?.name || "Chưa chọn"}`;
        }),
        "",
        ...STATE_TOOLS.map((t) => {
          const c = gainFromTool(t);
          return `VAI TRÒ ${t.role} – ${t.title}: ${c?.title || "Chưa chọn"}
  Chứng cứ: ${PROOF_TITLES[store.state.govProof?.[t.id]] || "Chưa gắn"}
  Đánh đổi: ${c?.desc || ""}
  Phản hồi: ${c?.reply || ""}`;
        }),
        "",
        `Cảnh báo và ứng phó: ${store.state.crisis || "Chưa thực hiện"}`,
        `Trạm nước: ${store.state.sideQuests?.water ? "Đã làm" : "Chưa làm"}; bến giao hàng: ${store.state.sideQuests?.dock ? "Đã làm" : "Chưa làm"}`,
        "",
        "Nội dung: diễn giải từ tài liệu thiết kế của nhóm; chưa có slide gốc trong repo để xác minh. Cần giảng viên đối chiếu.",
        "Các quyết định và điểm số là tình huống giả lập, không phải dữ liệu thực tế.",
      ];
      lines.push("", learningReportText());
      const blob = new Blob([lines.join("\n")], {
        type: "text/plain;charset=utf-8",
      });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "Vung_Con_Xanh_Nhat_Ky_Dieu_Phoi.txt";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    return { createDecisionReport };
  };
});
