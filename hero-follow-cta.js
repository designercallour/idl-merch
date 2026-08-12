(function attachHeroFollowCta(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLHeroFollowCta = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createHeroFollowCta() {
  const FOLLOW_SPEED = 0.15;

  function stepToward(current, target, speed) {
    if (!(speed > 0)) return current;
    if (speed >= 1) return target;
    return current + (target - current) * speed;
  }

  function clampAxis(value, elementSize, parentSize) {
    const half = elementSize / 2;

    // A button wider than its panel can never satisfy both edges, so centre it.
    if (parentSize <= elementSize) return parentSize / 2;

    return Math.max(half, Math.min(value, parentSize - half));
  }

  function nextPosition(pos, mouse, size, parent, speed = FOLLOW_SPEED) {
    return {
      x: stepToward(pos.x, clampAxis(mouse.x, size.width, parent.width), speed),
      y: stepToward(pos.y, clampAxis(mouse.y, size.height, parent.height), speed),
    };
  }

  return { FOLLOW_SPEED, stepToward, clampAxis, nextPosition };
}));
