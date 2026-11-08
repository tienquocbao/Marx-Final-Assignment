/* storage/migration: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../characters/memory.js"),
      require("../core/state.js"),
    );
  else
    root.VCX.define(
      "storage/migration",
      ["characters/memory", "core/state"],
      factory,
    );
})(globalThis, (NPC, Core) => {
  "use strict";
  const VERSION = 8;
  const { ACTORS, freshMemory } = NPC;
  const { freshLearning } = Core;
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

  function migrate(raw, base, data) {
    if (!object(raw) || !object(raw.found) || !object(raw.policies))
      return null;
    if (Number(raw.saveVersion) > VERSION)
      throw Error("Bản lưu thuộc phiên bản mới hơn.");
    const s = JSON.parse(JSON.stringify(base));
    for (const place of Object.keys(data.SCENES)) {
      const list = raw.found[place];
      if (list !== undefined && !Array.isArray(list)) return null;
      s.found[place] = [
        ...new Set(
          (list || []).filter((id) =>
            data.SCENES[place].hotspots.some((h) => h.id === id),
          ),
        ),
      ];
      s.minis[place] = raw.minis?.[place] === true;
      s.done[place] =
        raw.done?.[place] === true &&
        s.found[place].length === 3 &&
        s.minis[place];
      s.npcTalk[place] = Number.isInteger(raw.npcTalk?.[place])
        ? Math.max(0, raw.npcTalk[place])
        : 0;
    }
    for (const p of data.POLICIES)
      if (p.choices.some((c) => c.id === raw.policies[p.id]))
        s.policies[p.id] = raw.policies[p.id];
    for (const t of data.STATE_TOOLS) {
      if (
        t.proofs.includes(raw.govProof?.[t.id]) &&
        owned(s, raw.govProof[t.id])
      )
        s.govProof[t.id] = raw.govProof[t.id];
      if (t.choices.some((c) => c.id === raw.governance?.[t.id]))
        s.governance[t.id] = raw.governance[t.id];
    }
    for (const [id, clue] of Object.entries({
      price: "field_buyer",
      fees: "coop_fees",
      risk: "field_sensor",
    }))
      if (raw.board?.[id] === clue && owned(s, clue)) s.board[id] = clue;
    for (const a of ACTORS) s.invited[a.id] = raw.invited?.[a.id] === true;
    for (const id of ["water", "dock"])
      s.sideQuests[id] = raw.sideQuests?.[id] === true;
    s.mode = raw.mode === "demo" ? "demo" : "full";
    s.intro = raw.intro === true;
    for (const k of ["preparedDemo", "demoExpanded"]) s[k] = raw[k] === true;
    s.storyPos = Number.isInteger(raw.storyPos)
      ? Math.max(0, Math.min(raw.storyPos, s.mode === "demo" ? 6 : 9))
      : 0;
    s.activePlace = Object.hasOwn(data.SCENES, raw.activePlace)
      ? raw.activePlace
      : "field";
    s.mapPos = {
      x: Number.isFinite(raw.mapPos?.x)
        ? Math.max(7, Math.min(94, raw.mapPos.x))
        : 50,
      y: Number.isFinite(raw.mapPos?.y)
        ? Math.max(12, Math.min(88, raw.mapPos.y))
        : 56,
    };
    s.stage = [
      "home",
      "story",
      "world",
      "explore",
      "board",
      "invite",
      "hall",
      "ending",
    ].includes(raw.stage)
      ? raw.stage
      : "world";
    if (
      ["board", "invite", "hall", "ending"].includes(s.stage) &&
      !Object.values(s.done).every(Boolean)
    )
      s.stage = "world";
    if (
      ["hall", "ending"].includes(s.stage) &&
      !ACTORS.every((a) => s.invited[a.id])
    )
      s.stage = "invite";
    s.crisis = ["prepared", "unprepared"].includes(raw.crisis)
      ? raw.crisis
      : null;
    s.crisisSequence = Array.isArray(raw.crisisSequence)
      ? raw.crisisSequence
          .filter((x) => ["alert", "verify", "apply"].includes(x))
          .slice(0, 3)
      : [];
    s.result = ["A", "B", "C"].includes(raw.result) ? raw.result : null;
    s.legacyResult = ["A", "B", "C"].includes(raw.legacyResult)
      ? raw.legacyResult
      : raw.saveVersion !== 8 && s.result
        ? s.result
        : null;
    if (s.stage === "ending" && !s.result) s.stage = "hall";
    // Legacy decisions remain auditable; no invented behavioral evidence for old saves.
    const cleanText = (value, max = 2000) =>
      typeof value === "string" ? value.slice(0, max) : "";
    s.decisions = Array.isArray(raw.decisions)
      ? raw.decisions
          .filter(object)
          .slice(-500)
          .map((d) => {
            const entry = {
              kind: cleanText(d.kind, 40),
              key: cleanText(d.key, 80),
              id: cleanText(d.id, 80),
              at: typeof d.at === "number" ? d.at : cleanText(d.at, 50),
            };
            if (Number.isSafeInteger(d.serial) && d.serial > 0)
              entry.serial = d.serial;
            for (const key of ["choice", "benefits", "costs"])
              if (typeof d[key] === "string") entry[key] = cleanText(d[key]);
            if (d.source)
              entry.source = ["player", "prepared"].includes(d.source)
                ? d.source
                : "legacy";
            if (Array.isArray(d.evidence))
              entry.evidence = d.evidence
                .filter((id) => typeof id === "string" && owned(s, id))
                .slice(0, 9);
            if (Array.isArray(d.consequences))
              entry.consequences = d.consequences
                .filter((x) => typeof x === "string")
                .map((x) => cleanText(x))
                .slice(0, 20);
            if (Array.isArray(d.effects))
              entry.effects = d.effects
                .filter(
                  (x) => object(x) && ACTORS.some((a) => a.id === x.actor),
                )
                .slice(0, 3)
                .map((x) => ({
                  actor: x.actor,
                  delta: Number.isFinite(x.delta) ? x.delta : 0,
                  trust: Number.isFinite(x.trust) ? clamp(x.trust) : 0,
                  concerns: Array.isArray(x.concerns)
                    ? x.concerns
                        .filter((c) => typeof c === "string")
                        .map((c) => cleanText(c))
                        .slice(0, 20)
                    : [],
                }));
            if (object(d.snapshot))
              entry.snapshot = {
                policies: object(d.snapshot.policies)
                  ? d.snapshot.policies
                  : {},
                governance: object(d.snapshot.governance)
                  ? d.snapshot.governance
                  : {},
              };
            return entry;
          })
      : [];
    s.decisionSerial = Math.max(
      Number.isSafeInteger(raw.decisionSerial) ? raw.decisionSerial : 0,
      s.decisions.length,
    );
    s.memory = freshMemory();
    for (const a of ACTORS) {
      const m = raw.memory?.[a.id];
      if (!object(m)) continue;
      s.memory[a.id] = {
        seenConcerns: Array.isArray(m.seenConcerns)
          ? [
              ...new Set(m.seenConcerns.filter((x) => typeof x === "string")),
            ].slice(-30)
          : [],
        history: Array.isArray(m.history)
          ? m.history.filter(object).slice(-60)
          : [],
        lastDialogue:
          typeof m.lastDialogue === "string"
            ? m.lastDialogue.slice(0, 800)
            : "",
      };
    }
    s.learning = freshLearning();
    const l = object(raw.learning) ? raw.learning : {};
    const allowed = {
      viewed: Object.values(data.SCENES).flatMap((v) =>
        v.hotspots.map((h) => h.id),
      ),
      heard: ACTORS.map((a) => a.id),
      links: ["price", "fees", "risk"],
      invitations: ACTORS.map((a) => a.id),
    };
    for (const k of ["viewed", "heard", "links", "invitations"])
      s.learning[k] = Array.isArray(l[k])
        ? [...new Set(l[k].filter((x) => allowed[k].includes(x)))]
        : [];
    if (object(l.miniAttempts))
      for (const [k, n] of Object.entries(l.miniAttempts))
        if (Number.isSafeInteger(n) && n >= 0) s.learning.miniAttempts[k] = n;
    if (object(l.debates))
      for (const a of ACTORS) {
        const d = l.debates[a.id];
        if (
          object(d) &&
          Array.isArray(d.rubric) &&
          d.rubric.length === 4 &&
          d.rubric.every((n) => Number.isInteger(n) && n >= 0 && n <= 2)
        )
          s.learning.debates[a.id] = d;
      }
    if (object(l.quiz) && Array.isArray(l.quiz.answers)) {
      s.learning.quiz.answers = l.quiz.answers
        .slice(0, 10)
        .map((n) => (Number.isInteger(n) && n >= 0 && n < 4 ? n : null));
      s.learning.quiz.submitted =
        l.quiz.submitted === true &&
        s.learning.quiz.answers.length === 10 &&
        s.learning.quiz.answers.every((n) => n !== null);
    }
    s.saveVersion = VERSION;
    return s;
  }
  return { migrate };
});
