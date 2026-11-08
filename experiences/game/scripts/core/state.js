/* core/state: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(require("../characters/memory.js"));
  else root.VCX.define("core/state", ["characters/memory"], factory);
})(globalThis, (NPC) => {
  "use strict";
  function freshLearning() {
    return {
      viewed: [],
      heard: [],
      debates: {},
      quiz: { answers: [], submitted: false },
      miniAttempts: {},
      links: [],
      invitations: [],
    };
  }
  function initialState() {
    return {
      saveVersion: 8,
      memory: NPC.freshMemory(),
      learning: freshLearning(),
      decisionSerial: 0,
      crisisSequence: [],
      intro: false,
      found: { field: [], coop: [], factory: [] },
      done: { field: false, coop: false, factory: false },
      minis: { field: false, coop: false, factory: false },
      board: {},
      policies: {},
      crisis: null,
      invited: { bay: false, sen: false, khoa: false },
      inviteSelection: null,
      mode: "full",
      stage: "home",
      storyPos: 0,
      activePlace: "field",
      mapPos: { x: 50, y: 56 },
      sideQuests: { water: false, dock: false },
      npcTalk: { field: 0, coop: 0, factory: 0 },
      governance: {},
      govProof: {},
      preparedDemo: false,
      demoExpanded: false,
      decisions: [],
    };
  }
  function createStore() {
    let current = initialState();
    const session = {
      scene: "home",
      storyPos: 0,
      activePlace: "field",
      resumeAvailable: false,
    };
    return {
      get state() {
        return current;
      },
      set state(next) {
        if (!next || typeof next !== "object" || Array.isArray(next))
          throw TypeError("State must be an object");
        current = next;
      },
      session,
    };
  }
  return { initialState, freshLearning, createStore };
});
