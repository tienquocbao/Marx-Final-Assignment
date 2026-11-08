/* QA only. Never referenced by index.html or the offline packager.
 * Lets the original regression suite inspect factory-scoped APIs without
 * shipping legacy globals in the product. UI interactions stay unchanged.
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = VCX.get('app');
  const aliases = { ...VCX.get('data'), ...app.ui, ...app.rules, ...app.story,
    ...app.exploration, ...app.negotiation, ...app.learning, ...app.assessment,
    ...app.ending, ...app.journal, begin: app.begin, reset: app.reset,
    resume: app.resume, initialState: app.initialState,
    VCXSim: VCX.get('simulation'), VCX_DATA: VCX.get('data'),
    VCXContent: VCX.get('learning/content') };
  Object.assign(window, aliases);
  Object.defineProperty(window, 'state', {get: () => app.store.state, set: value => {app.store.state = value;}});
  for (const key of ['scene', 'storyPos', 'activePlace']) {
    Object.defineProperty(window, key, {get: () => app.store.session[key], set: value => {app.store.session[key] = value;}});
  }
  Object.defineProperty(window, 'hearingWho', {set: value => app.negotiation.selectHearing(value)});
  for (const key of ['currentMusic', 'musicStarted', 'MUSIC']) {
    Object.defineProperty(window, key, {get: () => app.audio[key]});
  }
});
