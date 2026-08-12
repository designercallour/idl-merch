(function productImageZoomModule(root) {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getZoomOrigin(rect, clientX, clientY) {
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return { x: 50, y: 50 };
    }

    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  }

  function bindProductImageZoom(visuals) {
    Array.from(visuals || []).forEach(visual => {
      const resetOrigin = () => {
        visual.classList.remove('is-zooming');
        visual.style.setProperty('--product-zoom-x', '50%');
        visual.style.setProperty('--product-zoom-y', '50%');
      };

      visual.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        visual.classList.add('is-zooming');
        const origin = getZoomOrigin(
          visual.getBoundingClientRect(),
          event.clientX,
          event.clientY
        );
        visual.style.setProperty('--product-zoom-x', `${origin.x.toFixed(2)}%`);
        visual.style.setProperty('--product-zoom-y', `${origin.y.toFixed(2)}%`);
      });
      visual.addEventListener('pointerleave', resetOrigin);
      visual.addEventListener('pointercancel', resetOrigin);
      resetOrigin();
    });
  }

  const api = { getZoomOrigin, bindProductImageZoom };
  root.IDLProductImageZoom = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
