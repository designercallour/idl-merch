(function attachHeroLogoScroll(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLHeroLogoScroll = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createHeroLogoScroll() {
  const RANGE = 220;
  const MAX_WIDTH = 240;
  const WIDTH_FRACTION = 0.34;
  // The logo shares the navbar's centre line, so it must also share its band --
  // any taller and it slides under the announcement bar stacked above.
  const HEADER_FRACTION = 0.92;

  function progressAt(scrollY, range = RANGE) {
    if (!(range > 0)) return 1;
    if (!(scrollY > 0)) return 0;
    return Math.min(1, scrollY / range);
  }

  // Ease-out: the logo leaves its hero size quickly, then settles gently into
  // the header rather than snapping the last few pixels.
  function ease(progress) {
    const p = Math.min(1, Math.max(0, progress));
    return 1 - (1 - p) * (1 - p);
  }

  function maxScaleFor(viewportWidth, logoWidth, logoHeight, headerHeight) {
    if (!(logoWidth > 0)) return 1;

    const byWidth = Math.min(MAX_WIDTH, viewportWidth * WIDTH_FRACTION) / logoWidth;
    const byHeight = logoHeight > 0 && headerHeight > 0
      ? (headerHeight * HEADER_FRACTION) / logoHeight
      : Infinity;

    return Math.max(1, Math.min(byWidth, byHeight));
  }

  // Scale only: the logo stays centred on the navbar line the whole way, so
  // progress 1 lands on scale 1 -- its real header size, in place.
  function frameAt(progress, maxScale) {
    return maxScale + (1 - maxScale) * ease(progress);
  }

  // Threshold, not per-frame interpolation. Recomputing the scale on every
  // scroll frame ties the logo to the scroll's own frame rate, so one dropped
  // frame reads as a stutter. Flipping between two states instead lets a CSS
  // transition run it on the compositor, where scrolling cannot reach it.
  //
  // The two bounds sit apart on purpose: a single threshold would flap if the
  // scroll came to rest right on it.
  const SHRINK_AT = 60;
  const GROW_AT = 20;

  function shrinkStateAt(scrollY, wasShrunk, shrinkAt = SHRINK_AT, growAt = GROW_AT) {
    if (!(scrollY > growAt)) return false;
    if (scrollY >= shrinkAt) return true;
    return Boolean(wasShrunk);
  }

  return {
    RANGE,
    MAX_WIDTH,
    WIDTH_FRACTION,
    HEADER_FRACTION,
    SHRINK_AT,
    GROW_AT,
    progressAt,
    ease,
    maxScaleFor,
    frameAt,
    shrinkStateAt,
  };
}));
