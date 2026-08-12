(function attachHeaderTone(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLHeaderTone = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createHeaderTone() {
  // The header only needs to change tone while the light section is actually
  // behind it -- that is, overlapping the band from y=0 to the header's height.
  function overlapsBand(sectionTop, sectionBottom, bandHeight) {
    if (!(bandHeight > 0)) return false;
    if (!(sectionBottom > sectionTop)) return false;

    return sectionTop < bandHeight && sectionBottom > 0;
  }

  // A sticky row is pinned once its top has reached the offset it sticks at.
  // The 1px slack absorbs the fractional rects browsers hand back.
  function isPinned(rectTop, pinTop) {
    return rectTop <= pinTop + 1;
  }

  function anyOverlapsBand(rects, bandHeight) {
    if (!Array.isArray(rects)) return false;

    return rects.some((rect) => overlapsBand(rect.top, rect.bottom, bandHeight));
  }

  return { overlapsBand, anyOverlapsBand, isPinned };
}));
