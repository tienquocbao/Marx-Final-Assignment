/* assessment/model: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../simulation.js"),
      require("../game-data.js"),
      require("../learning-content.js"),
    );
  else
    root.VCX.define(
      "assessment/model",
      ["simulation", "data", "learning/content"],
      factory,
    );
})(globalThis, (VCXSim, VCX_DATA, CONTENT) => {
  "use strict";
  function learningProfile(state) {
    const l = state.learning,
      decisions = state.decisions.filter((d) => d.source !== "prepared"),
      e = VCXSim.evaluate(state, VCX_DATA);
    const actualPolicies = new Set(
      decisions.filter((d) => d.kind === "policy").map((d) => d.key),
    );
    const tools = new Set(
      decisions
        .filter(
          (d) =>
            d.kind === "governance" &&
            d.evidence?.some((id) => VCXSim.owned(state, id)),
        )
        .map((d) => d.key),
    );
    const proofs = new Set(
      decisions
        .filter((d) => ["governance", "proof", "invite"].includes(d.kind))
        .flatMap((d) => d.evidence || []),
    );
    const debates = Object.values(l.debates),
      contextScore = debates.filter((d) => d.rubric[2] === 2).length;
    const measures = [
      {
        title: "Nhận diện lợi ích kinh tế",
        value: l.heard.length,
        max: 3,
        evidence:
          l.heard.length +
          "/3 chủ thể đã chủ động hỏi hoặc nghe tab phản biện.",
        review:
          "Hỏi thêm cả ba nhân vật, xác định khoản thu, chi và rủi ro riêng.",
      },
      {
        title: "Nhận diện mâu thuẫn lợi ích",
        value: l.links.length,
        max: 3,
        evidence: l.links.length + "/3 nút thắt đã tự ghép đúng chứng cứ.",
        review: "Đối chiếu giá – chất lượng, phí dịch vụ và rủi ro chung.",
      },
      {
        title: "Sử dụng chứng cứ",
        value: Math.min(7, proofs.size),
        max: 7,
        evidence:
          proofs.size +
          " chứng cứ khác nhau đã dùng để mời họp hoặc bảo vệ công cụ.",
        review: "Chọn hồ sơ có quan hệ trực tiếp với điều kiện cần giải quyết.",
      },
      {
        title: "Điều phối và cân bằng lợi ích",
        value: Math.min(
          6,
          [...actualPolicies].filter((id) => {
            const p = state.policies[id];
            return id === "price"
              ? p === "fair" ||
                  (p === "phased" && state.governance.rights === "document")
              : id === "fees"
                ? p === "fair" ||
                  (p === "upfront" &&
                    state.governance.harmony === "credit" &&
                    state.governance.rights === "document") ||
                  (p === "deferred" &&
                    state.governance.harmony === "link" &&
                    state.governance.rights === "document")
                : p === "fair" ||
                  (p === "reserve" &&
                    ["targeted", "full"].includes(state.governance.prevent));
          }).length + contextScore,
        ),
        max: 6,
        evidence:
          actualPolicies.size +
          " nhóm điều khoản do bạn chọn; " +
          contextScore +
          "/3 phản biện vận dụng đúng quan hệ nguyên nhân và cách xử lý.",
        review:
          "Thử sửa phương án gây veto và hoàn thành tranh biện của từng bên.",
      },
      {
        title: "Nhận thức vai trò Nhà nước",
        value: tools.size,
        max: 4,
        evidence:
          tools.size +
          "/4 vai trò đã chủ động đề xuất với chứng cứ thu thập được.",
        review:
          "Phân biệt khuôn khổ, điều hòa, phòng ngừa và giải quyết mâu thuẫn.",
      },
    ];
    return measures.map((m) => ({
      ...m,
      score: Math.round((m.value / m.max) * 100),
    }));
  }
  function priorityText(state) {
    const e = VCXSim.evaluate(state, VCX_DATA);
    const max = Math.max(...e.vals),
      names = e.actors.filter((a) => a.score === max).map((a) => a.name);
    return (
      names.join(", ") +
      " có mức lợi ích mô phỏng cao nhất (" +
      max +
      "/100). Đây là kết quả phương án hiện tại, không suy đoán ý định người chơi."
    );
  }
  const CHECK_LABELS = {
    complete: "Đủ điều khoản và chứng cứ công cụ",
    participation: "Ba bên tham gia tự nguyện",
    minimums: "Mức lợi ích tối thiểu từng bên",
    consent: "Không còn lo ngại thiết yếu",
    trust: "Niềm tin chung và từng NPC",
    feasibility: "Khả năng thực hiện điều khoản",
    community: "Điều kiện cộng đồng / môi trường",
    crisis: "Quy trình ứng phó biến cố",
  };
  function quizScore(state) {
    return CONTENT.quiz.reduce(
      (n, q, i) => n + (state.learning.quiz.answers[i] === q.answer ? 1 : 0),
      0,
    );
  }
  return { learningProfile, priorityText, quizScore, CHECK_LABELS };
});
