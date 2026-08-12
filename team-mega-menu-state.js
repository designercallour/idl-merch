(function attachTeamMegaMenuState(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLTeamMegaMenu = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createTeamMegaMenuState() {
  function nextMenuState(currentOpen, action) {
    if (action === 'toggle') return !currentOpen;
    if (action === 'open') return true;
    if (action === 'close') return false;
    return currentOpen;
  }

  return { nextMenuState };
}));
