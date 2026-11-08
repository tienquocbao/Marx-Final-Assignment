/* Tiny synchronous module registry for file://; no network loader or eval. */
(function (root) {
  "use strict";
  const definitions = new Map(),
    instances = new Map(),
    resolving = new Set();
  function define(name, deps, factory) {
    if (definitions.has(name)) throw Error("Duplicate module: " + name);
    definitions.set(name, { deps: [...deps], factory });
  }
  function get(name) {
    if (instances.has(name)) return instances.get(name);
    const entry = definitions.get(name);
    if (!entry) throw Error("Missing module: " + name);
    if (resolving.has(name))
      throw Error("Circular dependency: " + [...resolving, name].join(" -> "));
    resolving.add(name);
    try {
      const api = entry.factory(...entry.deps.map(get));
      instances.set(name, api);
      return api;
    } finally {
      resolving.delete(name);
    }
  }
  function graph() {
    return Object.fromEntries(
      [...definitions].map(([name, d]) => [name, [...d.deps]]),
    );
  }
  const api = Object.freeze({ define, get, graph });
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.defineProperty(root, "VCX", { value: api });
})(globalThis);
