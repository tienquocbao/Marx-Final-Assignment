/* storage/save-load: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(
      require("../core/state.js"),
      require("./migration.js"),
      require("../game-data.js"),
    );
  else
    root.VCX.define(
      "storage/save-load",
      ["core/state", "storage/migration", "data"],
      factory,
    );
})(globalThis, (Core, Migration, VCX_DATA) => {
  "use strict";
  return function createStorage(store, notify, backend) {
    const { initialState } = Core;
    let storageLocked = false,
      storageWarning = false;
    function load() {
      for (const key of ["vcx_v80", "vcx_v71", "vcx_v7", "vcx_v6", "vcx_v4"]) {
        try {
          const raw = (backend || globalThis.localStorage).getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (parsed.saveVersion > 8) {
            notify(
              "Bản lưu mới hơn v8; giữ nguyên dữ liệu, hãy dùng phiên bản phù hợp.",
            );
            storageLocked = true;
            return null;
          }
          const migrated = Migration.migrate(parsed, initialState(), VCX_DATA);
          if (migrated) return migrated;
          notify("Bản lưu không hợp lệ; đang tìm bản cũ còn sử dụng được.");
        } catch (e) {
          notify("Không đọc được bản lưu: " + e.message);
        }
      }
      return null;
    }

    function save() {
      store.state.stage = store.session.scene;
      store.state.storyPos = store.session.storyPos;
      store.state.activePlace = store.session.activePlace;
      store.state.saveVersion = 8;
      if (
        storageLocked ||
        (store.session.scene === "home" && store.session.resumeAvailable)
      )
        return;
      try {
        (backend || globalThis.localStorage).setItem(
          "vcx_v80",
          JSON.stringify(store.state),
        );
        storageWarning = false;
      } catch (e) {
        if (!storageWarning) {
          storageWarning = true;
          notify(
            "Không lưu được tiến trình. Hãy xuất báo cáo trước khi đóng game.",
          );
        }
      }
    }
    return {
      load,
      save,
      get locked() {
        return storageLocked;
      },
    };
  };
});
