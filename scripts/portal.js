(() => {
  'use strict';
  const KEYS = ['infographic', 'game', 'video'];
  const TITLES = {infographic:'Infographic', game:'Web game', video:'Video'};
  const PATHS = {
    infographic: 'experiences/infographic/index.html',
    game: 'experiences/game/index.html',
    video: 'assets/video/nha-nuoc-nong-nghiep-cnc.mp4'
  };
  const tabs = Object.fromEntries(KEYS.map(k => [k, document.getElementById('tab-' + k)]));
  const panels = Object.fromEntries(KEYS.map(k => [k, document.getElementById('view-' + k)]));
  const tabList = document.querySelector('.tablist');
  const counter = document.getElementById('sectionCounter');
  const announcement = document.getElementById('tabAnnouncement');
  const video = document.getElementById('featureVideo');
  const frames = {
    infographic: document.getElementById('iframe-infographic'),
    game: document.getElementById('iframe-game')
  };
  const openSeparate = document.getElementById('openSeparate');
  const fullScreenButton = document.getElementById('fullScreenButton');
  let active = 'infographic';
  const savedMuted = new WeakMap();

  // All original iframe files are preserved byte-for-byte. This shell only handles navigation.
  function muteFrame(k, shouldMute) {
    const iframe = frames[k];
    if (!iframe || !iframe.getAttribute('src')) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.querySelectorAll('audio, video').forEach(media => {
        if (shouldMute) {
          if (!savedMuted.has(media)) savedMuted.set(media, media.muted);
          media.muted = true;
        } else if (savedMuted.has(media)) {
          media.muted = savedMuted.get(media);
          savedMuted.delete(media);
        }
      });
    } catch (e) {
      // Some file:// browser policies isolate frame origins; each website still works independently.
    }
  }

  function onFrameLoaded(k) {
    const loading = document.getElementById('loading-' + k);
    if (loading) loading.classList.add('is-loaded');
    if (k !== active) muteFrame(k, true);
  }

  Object.entries(frames).forEach(([k, frame]) => {
    frame.addEventListener('load', () => onFrameLoaded(k));
    frame.addEventListener('error', () => {
      const loading = document.getElementById('loading-' + k);
      if (loading) loading.innerHTML = '<strong>Không mở được nội dung.</strong><span>Hãy giữ nguyên toàn bộ thư mục của website.</span>';
    });
    // An iframe loaded from cache (or a srcdoc preview) can finish before this
    // deferred shell script attaches its load listener. Avoid a stuck loader.
    try {
      const doc = frame.contentDocument;
      if (doc && doc.readyState === 'complete' && doc.URL !== 'about:blank') {
        onFrameLoaded(k);
      }
    } catch (e) { /* Cross-origin file:// restrictions: wait for the load event. */ }
  });

  function selectTab(next, { updateHash = true, focusTab = false } = {}) {
    if (!KEYS.includes(next)) return;
    const previous = active;
    if (previous !== next) {
      if (previous === 'video') video.pause();
      if (frames[previous]) muteFrame(previous, true);
      active = next;
    }

    KEYS.forEach((k, i) => {
      const selected = (k === active);
      const button = tabs[k];
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      panels[k].classList.toggle('is-active', selected);
      panels[k].setAttribute('aria-hidden', String(!selected));
      panels[k].inert = !selected;
      if (selected) counter.textContent = String(i + 1).padStart(2, '0') + ' / 03';
    });
    tabList.dataset.active = active;

    if (frames[active]) {
      const frame = frames[active];
      if (!frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
      else muteFrame(active, false);
    }
    announcement.textContent = 'Đang xem ' + TITLES[active];
    if (focusTab) tabs[active].focus();
    if (updateHash && location.hash !== '#' + active) history.pushState({tab:active}, '', '#' + active);
  }

  tabList.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    btn.addEventListener('keydown', event => {
      const index = KEYS.indexOf(btn.dataset.tab);
      let target;
      if (event.key === 'ArrowRight') target = KEYS[(index + 1) % KEYS.length];
      if (event.key === 'ArrowLeft') target = KEYS[(index + KEYS.length - 1) % KEYS.length];
      if (event.key === 'Home') target = KEYS[0];
      if (event.key === 'End') target = KEYS[KEYS.length - 1];
      if (target) { event.preventDefault(); selectTab(target, {focusTab:true}); }
    });
  });

  const followHistory = () => selectTab(KEYS.includes(location.hash.substring(1)) ? location.hash.substring(1) : 'infographic', {updateHash:false});
  window.addEventListener('hashchange', followHistory);
  window.addEventListener('popstate', followHistory);
  openSeparate.addEventListener('click', () => window.open(PATHS[active], '_blank', 'noopener,noreferrer'));
  fullScreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen?.() || Promise.resolve()).catch(() => {});
    } else document.exitFullscreen?.().catch(() => {});
  });
  document.addEventListener('fullscreenchange', () => {
    const isFull = !!document.fullscreenElement;
    fullScreenButton.title = isFull ? 'Thoát toàn màn hình' : 'Toàn màn hình';
    fullScreenButton.setAttribute('aria-label', fullScreenButton.title);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });

  selectTab(KEYS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'infographic', {updateHash:false});
})();
