/* simulation/session: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../simulation.js"),
      require("../game-data.js"),
    );
  else root.VCX.define("simulation/session", ["simulation", "data"], factory);
})(globalThis, (Sim, data) => {
  "use strict";
  return function createRules(store) {
    function ensureV7() {
      store.state.memory ??= Sim.freshMemory();
      store.state.learning ??= Sim.freshLearning();
      if (!store.state.governance || typeof store.state.governance !== "object")
        store.state.governance = {};
      if (!store.state.govProof || typeof store.state.govProof !== "object")
        store.state.govProof = {};
      if (!Array.isArray(store.state.decisions)) store.state.decisions = [];
    }
    return {
      ensureV7,
      evaluate: () => Sim.evaluate(store.state, data),
      rememberDecision: (...args) => {
        ensureV7();
        return Sim.record(store.state, data, ...args);
      },
    };
  };
});
