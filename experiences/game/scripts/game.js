/* Composition root only. Features own their logic, state lives in one injected store. */
VCX.define(
  "app",
  [
    "core/state",
    "simulation/session",
    "ui/rendering",
    "audio",
    "storage/save-load",
    "story/dialogue",
    "exploration/evidence",
    "negotiation",
    "learning",
    "assessment",
    "assessment/report",
    "ui/ending",
    "ui/journal",
  ],
  (
    Core,
    createRules,
    createUI,
    createAudio,
    createStorage,
    createStory,
    createExploration,
    createNegotiation,
    createLearning,
    createAssessment,
    createReport,
    createEnding,
    createJournal,
  ) => {
    "use strict";
    const store = Core.createStore();
    const audio = createAudio();
    const rules = createRules(store);
    // Callbacks below connect feature boundaries; modules never import each other back.
    const ui = createUI(store, audio, {
      save: () => storage.save(),
      onWorld: () => exploration.enterWorld(),
      onLeaveWorld: () => exploration.stopMovement(),
      onDialogOpen: () => exploration.stopMovement(),
    });
    const storage = createStorage(store, ui.notify);
    const save = () => storage.save();
    const learning = createLearning({ store, ui, rules, save });
    const context = (key) => learning.knowledgeContext(key);
    const exploration = createExploration({
      store,
      ui,
      audio,
      rules,
      save,
      knowledgeContext: context,
    });
    const story = createStory({
      store,
      ui,
      audio,
      save,
      onExplore: exploration.renderWorld,
    });
    const report = createReport({ store, ui, rules });
    const assessment = createAssessment({
      store,
      ui,
      rules,
      save,
      onExport: report.createDecisionReport,
    });
    const ending = createEnding({
      store,
      ui,
      rules,
      onDebrief: assessment.renderDebrief,
    });
    const negotiation = createNegotiation({
      store,
      ui,
      audio,
      rules,
      save,
      knowledgeContext: context,
      onBoard: exploration.renderBoard,
      onEnding: ending.renderEnding,
    });
    const journal = createJournal({ store, ui, audio });
    const { $, show, notify } = ui;

    function reset() {
      store.session.resumeAvailable = false;
      store.state = Core.initialState();
      store.session.storyPos = 0;
      store.session.activePlace = "field";
      $("resumeBtn").hidden = true;
      show("home");
      notify("Đã bắt đầu hành trình mới.");
    }
    function begin() {
      store.session.resumeAvailable = false;
      store.state = Core.initialState();
      store.state.mode = $("demoMode").checked ? "demo" : "full";
      store.session.storyPos = 0;
      story.renderStory();
      show("story");
    }
    function resume() {
      store.session.resumeAvailable = false;
      store.state = storage.load() || Core.initialState();
      rules.ensureV7();
      store.session.storyPos = store.state.storyPos || 0;
      store.session.activePlace = store.state.activePlace || "field";
      const stage = store.state.stage;
      const renderers = {
        story: story.renderStory,
        explore: () => exploration.renderExplore(store.session.activePlace),
        board: exploration.renderBoard,
        invite: negotiation.renderInvitations,
        hall: negotiation.renderHall,
        ending: ending.renderEnding,
        home: () => {},
        world: exploration.renderWorld,
      };
      (renderers[stage] || exploration.renderWorld)();
      show(renderers[stage] ? stage : "world");
    }

    audio.init();
    exploration.init();
    negotiation.init();
    learning.init();
    assessment.init();
    journal.init();
    $("startBtn").addEventListener("click", () => {
      audio.unlockMusic();
      begin();
      audio.playSfx("invite", 0.65);
    });
    $("resumeBtn").addEventListener("click", () => {
      audio.unlockMusic();
      resume();
    });
    $("nextStory").addEventListener("click", story.nextStory);
    $("skipStory").addEventListener("click", () => {
      store.state.intro = true;
      exploration.renderWorld();
      show("world");
    });
    $("replay").addEventListener("click", reset);
    $("openNotes").addEventListener("click", () => learning.openKnowledge());
    $("downloadDecisionReport").addEventListener(
      "click",
      report.createDecisionReport,
    );
    $("restartBtn").addEventListener("click", () => {
      if (confirm("Bắt đầu lại từ đầu? Tiến độ hiện tại sẽ được thay thế."))
        reset();
    });
    $("soundToggle").addEventListener("click", audio.toggleSound);
    $("fullToggle").addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.();
    });
    $("learningClose").onclick = () => $("learningDialog").close();
    $("learningDialog").addEventListener("click", (e) => {
      if (e.target !== $("learningDialog")) return;
      const r = e.target.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        e.target.close();
    });
    $("reviseAgreement").onclick = () => {
      store.state.result = null;
      store.state.legacyResult = null;
      store.state.crisis = null;
      store.state.crisisSequence = [];
      negotiation.renderHall();
      show("hall");
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("questOverlay").hidden) exploration.closeSideQuest();
        exploration.closeClue();
        journal.closeJournal();
        $("crisisModal").classList.remove("show");
        if (store.session.scene === "hall") ui.setAtmosphere("meeting");
      }
      if (
        e.key === "Enter" &&
        store.session.scene === "story" &&
        !document.querySelector(".modal.show,dialog[open]") &&
        e.target.tagName !== "BUTTON"
      ) {
        e.preventDefault();
        story.nextStory();
      }
    });
    const previous = storage.load();
    if (previous && previous.stage !== "home") {
      store.session.resumeAvailable = true;
      $("resumeBtn").hidden = false;
    }
    return Object.freeze({
      store,
      ui,
      audio,
      storage,
      rules,
      story,
      exploration,
      negotiation,
      learning,
      assessment,
      report,
      ending,
      journal,
      begin,
      reset,
      resume,
      initialState: Core.initialState,
    });
  },
);
VCX.get("app");
