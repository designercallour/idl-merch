(function initProductCatalogSort(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.IDLProductCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createProductCatalogSort() {
  function sortEntries(entries, mode = 'featured') {
    return [...entries].sort((first, second) => {
      if (mode === 'price-asc') {
        return first.price - second.price || first.index - second.index;
      }
      if (mode === 'price-desc') {
        return second.price - first.price || first.index - second.index;
      }
      if (mode === 'name-asc') {
        return first.title.localeCompare(second.title, undefined, { sensitivity: 'base' })
          || first.index - second.index;
      }
      return first.index - second.index;
    });
  }

  function visibleCount(entries) {
    return entries.reduce((count, entry) => count + (entry.hidden ? 0 : 1), 0);
  }

  return { sortEntries, visibleCount };
});
