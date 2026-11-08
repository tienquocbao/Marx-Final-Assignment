/* audio: explicit dependencies; no gameplay bindings in global scope. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VCX.define("audio", [], factory);
})(globalThis, () => {
  "use strict";
  return function createAudio() {
    let soundOn = true,
      audioCtx = null;
    function sound(freq = 480, dur = 0.07) {
      if (!soundOn) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = audioCtx || new AC();
        const o = audioCtx.createOscillator(),
          g = audioCtx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, audioCtx.currentTime);
        g.gain.setValueAtTime(0.03, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        o.stop(audioCtx.currentTime + dur);
      } catch (e) {}
    }
    let ambientOscs = [];
    let ambientTimer = null;
    let ambientMode = "";
    function stopAmbient() {
      try {
        ambientOscs.forEach((x) => {
          x.o.stop();
          x.g.disconnect();
          x.o.disconnect();
        });
      } catch (e) {}
      ambientOscs = [];
      if (ambientTimer) {
        clearInterval(ambientTimer);
        ambientTimer = null;
      }
    }
    function addDrone(freq = 0.0, vol = 0.01, type = "sine") {
      if (!soundOn) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = audioCtx || new AC();
        const o = audioCtx.createOscillator(),
          g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = vol;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        ambientOscs.push({ o, g });
      } catch (e) {}
    }
    function setAmbient(mode = "meeting") {
      ambientMode = mode;
      stopAmbient();
      syncBackgroundMusic();
    }

    const SFX_ASSETS = {
      click: "assets/audio/sfx/sfx_click.ogg",
      clue: "assets/audio/sfx/sfx_clue.ogg",
      error: "assets/audio/sfx/sfx_error.ogg",
      invite: "assets/audio/sfx/sfx_invite.ogg",
      storm: "assets/audio/sfx/sfx_storm.ogg",
      success: "assets/audio/sfx/sfx_success.ogg",
      turn: "assets/audio/sfx/sfx_turn.ogg",
    };
    let musicOn = true,
      musicStarted = false,
      musicVolume = 0.45,
      currentMusic = "";
    const MUSIC = {
      day: document.getElementById("music_day"),
      tension: document.getElementById("music_tension"),
    };
    for (const m of Object.values(MUSIC)) {
      m.volume = musicVolume * 0.75;
    }
    function syncBackgroundMusic() {
      const key = ambientMode === "crisis" ? "tension" : "day";
      if (!musicOn || !musicStarted) {
        for (const m of Object.values(MUSIC)) m.pause();
        return;
      }
      for (const [k, m] of Object.entries(MUSIC)) {
        if (k !== key) {
          m.pause();
          m.currentTime = 0;
        }
      }
      const active = MUSIC[key];
      active.volume = musicVolume * 0.75;
      if (active.paused) {
        const p = active.play();
        if (p && p.catch) p.catch(() => {});
      }
      currentMusic = key;
    }
    function unlockMusic() {
      musicStarted = true;
      syncBackgroundMusic();
    }
    function updateAudioButtons() {
      const music = document.getElementById("musicToggle");
      const sfx = document.getElementById("soundToggle");
      music.textContent = musicOn ? "♫ Nhạc: Bật" : "♫ Nhạc: Tắt";
      music.setAttribute("aria-pressed", String(musicOn));
      sfx.textContent = soundOn ? "🔊 Hiệu ứng" : "🔇 Hiệu ứng";
      sfx.setAttribute("aria-pressed", String(soundOn));
    }
    function playSfx(key, volume = 0.6) {
      if (!soundOn || !SFX_ASSETS[key]) return;
      try {
        const a = new Audio(SFX_ASSETS[key]);
        a.volume = Math.max(0, Math.min(1, volume));
        a.play().catch(() => {});
      } catch (e) {}
    }
    function initAudioControls() {
      document.getElementById("musicToggle").addEventListener("click", () => {
        musicOn = !musicOn;
        musicStarted = true;
        syncBackgroundMusic();
        updateAudioButtons();
      });
      document.getElementById("musicVol").addEventListener("input", (e) => {
        musicVolume = +e.target.value / 100;
        for (const m of Object.values(MUSIC)) m.volume = musicVolume * 0.75;
      });
      updateAudioButtons();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          for (const m of Object.values(MUSIC)) m.pause();
        } else syncBackgroundMusic();
      });
    }

    function soundCue(kind) {
      if (!soundOn) return;
      playSfx(
        kind === "solve"
          ? "success"
          : kind === "storm"
            ? "storm"
            : kind === "error"
              ? "error"
              : "click",
        0.65,
      );
    }
    function toggleSound() {
      soundOn = !soundOn;
      updateAudioButtons();
      if (soundOn) playSfx("click", 0.5);
    }
    return {
      sound,
      playSfx,
      soundCue,
      setAmbient,
      unlockMusic,
      init: initAudioControls,
      toggleSound,
      get currentMusic() {
        return currentMusic;
      },
      get musicStarted() {
        return musicStarted;
      },
      MUSIC,
      sources: () => [
        MUSIC.day.src,
        MUSIC.tension.src,
        ...Object.values(SFX_ASSETS),
      ],
    };
  };
});
