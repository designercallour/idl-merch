(function attachCapsuleSlider(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLCapsuleSlider = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createCapsuleSlider() {
  // A page is one railful of cards, so paging never lands mid-card.
  function maxOffset(scrollWidth, clientWidth) {
    return Math.max(0, scrollWidth - clientWidth);
  }

  function nextOffset(scrollLeft, clientWidth, scrollWidth, direction) {
    const max = maxOffset(scrollWidth, clientWidth);
    const target = scrollLeft + direction * clientWidth;

    return Math.min(max, Math.max(0, target));
  }

  // A sub-pixel slack keeps the end states from flickering: browsers report
  // fractional scrollLeft, so an exact comparison would never settle.
  function atStart(scrollLeft) {
    return scrollLeft <= 1;
  }

  function atEnd(scrollLeft, clientWidth, scrollWidth) {
    return scrollLeft >= maxOffset(scrollWidth, clientWidth) - 1;
  }

  function overflows(scrollWidth, clientWidth) {
    return maxOffset(scrollWidth, clientWidth) > 1;
  }

  return { maxOffset, nextOffset, atStart, atEnd, overflows };
}));
