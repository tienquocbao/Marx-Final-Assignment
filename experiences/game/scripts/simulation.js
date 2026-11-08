/* simulation: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("./characters/memory.js"),
      require("./core/state.js"),
      require("./storage/migration.js"),
    );
  else
    root.VCX.define(
      "simulation",
      ["characters/memory", "core/state", "storage/migration"],
      factory,
    );
})(globalThis, (NPC, Core, Migration) => {
  "use strict";
  const VERSION = 8;
  const { ACTORS, freshMemory } = NPC;
  const { freshLearning } = Core;
  const { migrate } = Migration;
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const object = (x) => x && typeof x === "object" && !Array.isArray(x);
  const owned = (s, id) =>
    Object.values(s.found || {}).some(
      (a) => Array.isArray(a) && a.includes(id),
    );
  const validTool = (s, t) =>
    t.choices.some((c) => c.id === s.governance?.[t.id]) &&
    t.proofs.includes(s.govProof?.[t.id]) &&
    owned(s, s.govProof[t.id]);

  function effective(s, data) {
    const p = s.policies || {},
      g = s.governance || {};
    const active = (id) => {
      const t = data.STATE_TOOLS.find((x) => x.id === id);
      return validTool(s, t) ? g[id] : null;
    };
    let pol = 0,
      gov = 0;
    if (
      p.price === "fair" ||
      (p.price === "phased" && active("rights") === "document")
    )
      pol++;
    if (
      p.fees === "fair" ||
      (p.fees === "upfront" &&
        active("harmony") === "credit" &&
        active("rights") === "document") ||
      (p.fees === "deferred" &&
        active("harmony") === "link" &&
        active("rights") === "document")
    )
      pol++;
    if (
      p.risk === "fair" ||
      (p.risk === "reserve" && ["targeted", "full"].includes(active("prevent")))
    )
      pol++;
    if (["document", "independent"].includes(active("rights"))) gov++;
    if (
      ["training", "link"].includes(active("harmony")) ||
      (active("harmony") === "credit" &&
        p.price === "fair" &&
        active("rights") === "document")
    )
      gov++;
    if (
      active("prevent") === "full" ||
      (active("prevent") === "targeted" &&
        (s.sideQuests?.water || s.govProof.prevent === "field_sensor"))
    )
      gov++;
    if (["mediate", "neutral"].includes(active("resolve"))) gov++;
    return { pol, gov, active };
  }
  function concerns(s, idx, data) {
    const p = s.policies || {},
      eff = effective(s, data),
      g = Object.fromEntries(
        data.STATE_TOOLS.map((t) => [t.id, eff.active(t.id)]),
      ),
      out = [];
    const add = (id, text, critical = true) =>
      out.push({ id, text, type: "warn", critical });
    if (!p.risk)
      add(
        "risk_missing",
        "Chưa phân chia trách nhiệm và tổn thất khi rủi ro xảy ra.",
      );
    if (p.risk === "pause")
      add(
        "delivery_pause",
        "Hoãn toàn bộ lô chưa có thời hạn hay nguồn lực bù chi phí, không thể hứa duy trì chuỗi.",
      );
    if (g.resolve === "formal")
      add(
        "open_dispute",
        "Tranh chấp đang chờ cơ chế pháp lý; quyền yêu cầu được bảo vệ nhưng chưa thể ký lại.",
      );
    if (idx === 0) {
      if (!p.price)
        add("income", "Chưa có quy tắc xác định giá để dự toán thu nhập.");
      if (p.price === "phased" && g.rights !== "document")
        add(
          "price_floor",
          "Giá theo đợt cần phụ lục bảo đảm tối thiểu và quy tắc điều chỉnh.",
        );
      if (
        p.fees === "upfront" &&
        !(g.harmony === "credit" && g.rights === "document")
      )
        add(
          "cash",
          "Phí đầu vụ vượt dòng tiền; chưa có phương án vốn và nghĩa vụ rõ ràng.",
        );
      if (g.harmony === "credit")
        add(
          "debt",
          "Tiếp cận tín dụng vẫn cần đối chiếu điều kiện vay và khả năng trả nợ.",
          false,
        );
      if (g.rights === "template")
        add("appeal", "Mẫu gọn chưa bảo đảm cách phản đối kết quả kiểm định.");
    } else if (idx === 1) {
      if (!p.fees)
        add("fees", "Chưa xác định chi phí dịch vụ và trách nhiệm thanh toán.");
      if (
        p.fees === "deferred" &&
        !(g.harmony === "link" && g.rights === "document")
      )
        add(
          "coop_cash",
          "HTX ứng phí chưa có nguồn lực chia sẻ và lịch thu hồi, vượt khả năng vận hành.",
        );
      if (g.prevent === "full" && p.fees !== "fair")
        add(
          "sampling_cost",
          "Kiểm tra toàn bộ còn cần làm rõ chi phí và lịch trả kết quả.",
          false,
        );
    } else {
      if (!p.price)
        add("pricing", "Chưa có quy tắc mua hàng và kế hoạch thanh toán.");
      if (p.price === "premium")
        add(
          "margin",
          "Giá cao cố định trước kiểm định chưa có cơ sở bảo đảm khả năng thực hiện đơn hàng.",
        );
      if (g.rights === "template" && p.price === "phased")
        add(
          "quality",
          "Chốt giá sau kiểm định nhưng thiếu quyền đối chiếu kết quả.",
        );
      if (g.prevent === "full")
        add(
          "deadline",
          "Kiểm tra toàn bộ tăng thời gian; cần phối hợp lịch giao nhận.",
          false,
        );
    }
    if (!out.length)
      out.push({
        id: "balanced",
        type: "ok",
        critical: false,
        text: [
          "Có căn cứ dự toán thu nhập và cơ chế chia sẻ rủi ro; tôi có thể cân nhắc ký.",
          "Có phương án chi phí và vận hành; quyền lợi xã viên được giải thích rõ.",
          "Tiêu chuẩn và trách nhiệm khả thi giúp doanh nghiệp chủ động nguồn cung.",
        ][idx],
      });
    return out;
  }
  function initialScores() {
    return [37, 39, 38];
  }
  function evaluate(s, data) {
    const eff = effective(s, data);
    let vals = initialScores(),
      trust = 30,
      society = 44;
    for (const p of data.POLICIES) {
      const c = p.choices.find((c) => c.id === s.policies?.[p.id]);
      if (!c) continue;
      c.delta.forEach((d, i) => (vals[i] += d));
      trust += c.ok ? 6 : -3;
      if (p.id === "risk" && c.id === "pause") society += 3;
    }
    if (s.sideQuests?.dock) {
      [2, 4, 4].forEach((v, i) => (vals[i] += v));
      trust += 4;
    }
    if (s.sideQuests?.water) {
      trust += 4;
      society += 4;
    }
    for (const t of data.STATE_TOOLS) {
      if (!validTool(s, t)) continue;
      const c = t.choices.find((c) => c.id === s.governance[t.id]);
      c.delta.forEach((v, i) => (vals[i] += v));
      trust += c.trust;
      society += c.society;
      if (
        t.id === "prevent" &&
        c.id === "targeted" &&
        !s.sideQuests?.water &&
        s.govProof.prevent !== "field_sensor"
      ) {
        trust -= 7;
        society -= 7;
      }
      if (
        t.id === "harmony" &&
        c.id === "credit" &&
        s.policies.price !== "fair"
      )
        trust -= 8;
    }
    trust += Math.max(0, eff.pol - 1) * 2;
    vals = vals.map(clamp);
    const actors = ACTORS.map((a, i) => {
      const reasons = concerns(s, i, data),
        critical = reasons.filter((r) => r.critical),
        cautions = reasons.filter((r) => r.type === "warn" && !r.critical);
      const seen = s.memory?.[a.id]?.seenConcerns || [];
      // Once a harmful proposal is withdrawn it leaves a small bounded trace. Repeating clicks earns nothing.
      const scar = Math.min(
        6,
        seen.filter((id) => !critical.some((r) => r.id === id)).length * 2,
      );
      const evidence = (s.found?.[a.place] || []).length;
      let personal =
        38 +
        evidence * 3 +
        (s.invited?.[a.id] ? 5 : 0) +
        eff.pol * 3 -
        critical.length * 12 -
        cautions.length * 3 -
        scar;
      if (eff.active("rights") === "document") personal += i === 0 ? 9 : 6;
      if (eff.active("rights") === "independent") personal += i === 2 ? 10 : 6;
      if (eff.active("resolve") === "mediate") personal += i === 1 ? 10 : 7;
      if (eff.active("resolve") === "neutral") personal += i === 2 ? 10 : 8;
      if (
        (i === 0 && eff.active("harmony") === "training") ||
        (i === 1 && eff.active("harmony") === "link")
      )
        personal += 5;
      personal = clamp(personal);
      return {
        ...a,
        score: vals[i],
        trust: personal,
        concerns: reasons,
        critical: critical.map((r) => r.id),
        accepted:
          vals[i] >= a.minimum && personal >= 55 && critical.length === 0,
        scar,
      };
    });
    const complete =
      data.POLICIES.every((p) =>
        p.choices.some((c) => c.id === s.policies?.[p.id]),
      ) && data.STATE_TOOLS.every((t) => validTool(s, t));
    const feasibility = eff.pol === 3 && eff.gov >= 3;
    const community = {
      score: clamp(society),
      safe:
        clamp(society) >= 60 &&
        eff.active("prevent") !== null &&
        s.policies?.risk !== "pause",
    };
    const checks = {
      complete,
      participation: ACTORS.every((a) => s.invited?.[a.id]),
      minimums: actors.every((a) => a.score >= a.minimum),
      consent: actors.every((a) => a.critical.length === 0),
      trust: actors.every((a) => a.trust >= 55) && trust >= 60,
      feasibility,
      community: community.safe,
      crisis: s.crisis === "prepared",
    };
    const full = Object.values(checks).every(Boolean);
    const partial =
      complete &&
      checks.participation &&
      eff.pol >= 2 &&
      eff.gov >= 2 &&
      actors.every(
        (a) => a.score >= 43 && a.trust >= 35 && a.critical.length <= 1,
      ) &&
      trust >= 39 &&
      society >= 42;
    return {
      vals,
      good: eff.pol,
      govGood: eff.gov,
      trust: clamp(trust),
      society: clamp(society),
      min: Math.min(...vals),
      actors,
      community,
      checks,
      result: full ? "A" : partial ? "B" : "C",
    };
  }
  const record = (...args) => NPC.record(evaluate, ...args),
    mood = (...args) => NPC.mood(evaluate, ...args),
    dialogue = (...args) => NPC.dialogue(evaluate, ...args);
  return {
    initialScores,
    VERSION,
    ACTORS,
    owned,
    validTool,
    migrate,
    freshLearning,
    freshMemory,
    effective,
    evaluate,
    concerns,
    record,
    mood,
    dialogue,
  };
});
