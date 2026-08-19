(function attachSportTeamLogoRotator(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLSportTeamLogoRotator = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createSportTeamLogoRotator() {
  function nextIndex(currentIndex, total) {
    if (total <= 0) return 0;
    return (currentIndex + 1) % total;
  }

  return { nextIndex };
}));
