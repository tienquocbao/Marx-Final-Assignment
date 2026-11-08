/* characters/memory: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VCX.define("characters/memory", [], factory);
})(globalThis, () => {
  "use strict";
  const ACTORS = [
    {
      id: "bay",
      place: "field",
      name: "Chú Bảy",
      interests: ["Thu nhập", "Đầu ra", "Chi phí", "Rủi ro sản xuất"],
      minimum: 59,
    },
    {
      id: "sen",
      place: "coop",
      name: "Chị Sen",
      interests: [
        "Minh bạch phí",
        "Dòng tiền HTX",
        "Năng lực vận hành",
        "Quyền lợi xã viên",
      ],
      minimum: 57,
    },
    {
      id: "khoa",
      place: "factory",
      name: "Anh Khoa",
      interests: ["Chất lượng", "Nguồn cung", "Tiến độ", "Biên chi phí"],
      minimum: 57,
    },
  ];

  function freshMemory() {
    return Object.fromEntries(
      ACTORS.map((a) => [
        a.id,
        { seenConcerns: [], history: [], lastDialogue: "" },
      ]),
    );
  }
  function record(evaluate, s, data, kind, key, id, before, meta = {}) {
    s.memory ??= freshMemory();
    s.decisions ??= [];
    const after = evaluate(s, data);
    const item = {
      serial: (s.decisionSerial || 0) + 1,
      kind,
      key,
      id,
      at: new Date().toISOString(),
      source: meta.source || "player",
      evidence: meta.evidence || [],
      choice: meta.choice || id,
      benefits: meta.benefits || "",
      costs: meta.costs || "",
      effects: ACTORS.map((a, i) => ({
        actor: a.id,
        delta: after.vals[i] - (before?.vals[i] ?? after.vals[i]),
        trust: after.actors[i].trust,
        concerns: after.actors[i].concerns
          .filter((r) => r.type === "warn")
          .map((r) => r.text),
      })),
      consequences: after.actors.flatMap((a) =>
        a.critical.map(
          (id) => a.name + ": " + a.concerns.find((r) => r.id === id).text,
        ),
      ),
      snapshot: {
        policies: { ...s.policies },
        governance: { ...s.governance },
      },
      ...meta,
    };
    s.decisionSerial = item.serial;
    s.decisions.push(item);
    if (s.decisions.length > 500) s.decisions.shift();
    // Incomplete drafts do not create a breach of trust. Only actual proposals create memory.
    for (const a of after.actors) {
      const m = s.memory[a.id];
      const ids = a.critical.filter(
        (id) => !["risk_missing", "income", "fees", "pricing"].includes(id),
      );
      m.seenConcerns = [...new Set([...m.seenConcerns, ...ids])];
      m.history.push({
        serial: item.serial,
        choice: item.choice,
        critical: ids,
        evidence: item.evidence,
      });
      if (m.history.length > 60) m.history.shift();
    }
    return item;
  }
  function mood(evaluate, s, idx, data, event = "") {
    const a = evaluate(s, data).actors[idx];
    if (event === "crisis") return a.critical.length ? "stressed" : "worried";
    if (a.critical.length >= 2 || a.trust < 30) return "angry";
    if (a.critical.length) return "stressed";
    if (a.accepted)
      return s.memory?.[a.id]?.seenConcerns.length ? "relieved" : "happy";
    if (!(s.found?.[a.place] || []).length) return "confused";
    if (a.concerns.some((r) => r.type === "warn")) return "worried";
    return a.trust >= 50 ? "thinking" : "normal";
  }
  function dialogue(evaluate, s, idx, data) {
    const a = evaluate(s, data).actors[idx],
      m = s.memory?.[a.id],
      found = s.found?.[a.place] || [],
      p = s.policies || {};
    const past = m?.history?.find((h) => h.critical?.length);
    const intro = past
      ? a.critical.length
        ? "Tôi vẫn nhớ đề xuất trước: " + past.choice + ". "
        : "Đề xuất " +
          past.choice +
          " trước đây từng làm tôi lo. Bản sửa đã giải quyết được điểm chính. "
      : "";
    const proof = found.length
      ? "Bạn đã đối chiếu " +
        data.SCENES[a.place].hotspots
          .filter((h) => found.includes(h.id))
          .map((h) => h.name)
          .join(", ") +
        ". "
      : "Hãy kiểm tra hồ sơ của tôi trước khi đưa lời hứa. ";
    const chosen = Object.keys(p).length
      ? "Điều khoản hiện tại: " +
        data.POLICIES.filter((x) => p[x.id])
          .map((x) => x.choices.find((c) => c.id === p[x.id])?.name)
          .join("; ") +
        ". "
      : "";
    return {
      text:
        intro +
        proof +
        chosen +
        a.concerns.map((r) => r.text).join(" ") +
        " Mức tin tưởng hiện tại: " +
        a.trust +
        "/100 (giả lập).",
      mood: mood(evaluate, s, idx, data),
    };
  }
  return { ACTORS, freshMemory, record, mood, dialogue };
});
