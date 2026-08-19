(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.IDLCapsuleReveal = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function getCapsuleRevealState({
    scrollY,
    sectionTop,
    sectionHeight,
    viewportHeight,
    blindCount
  }) {
    const safeViewportHeight = Math.max(1, viewportHeight);
    const travel = Math.max(1, sectionHeight - safeViewportHeight);
    const entryLead = safeViewportHeight * 0.88;
    const entryProgress = clamp((scrollY - (sectionTop - entryLead)) / entryLead);
    const pinnedRevealDistance = Math.max(1, Math.min(travel * 0.22, safeViewportHeight * 0.42));
    const pinnedProgress = clamp((scrollY - sectionTop) / pinnedRevealDistance);
    const revealProgress = clamp((entryProgress * 0.78) + (pinnedProgress * 0.22));
    const contentProgress = clamp((entryProgress - 0.12) / 0.72);
    const middle = Math.max(0.5, (blindCount - 1) / 2);
    const blindScales = Array.from({ length: blindCount }, (_, index) => {
      const distance = Math.abs(index - middle) / middle;
      const delay = distance * 0.18;
      const localProgress = clamp((revealProgress - delay) / (1 - delay));
      const easedProgress = 1 - Math.pow(1 - localProgress, 3);
      return 1 - easedProgress;
    });

    return {
      revealProgress,
      contentProgress,
      blindScales
    };
  }

  return { getCapsuleRevealState };
});
