(function attachProductTeamFilter(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLProductFilter = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createProductTeamFilter() {
  function matchesTeam(productTeam, activeTeam) {
    if (activeTeam === 'all') return true;
    if (!productTeam) return false;
    return productTeam === activeTeam;
  }

  return { matchesTeam };
}));
