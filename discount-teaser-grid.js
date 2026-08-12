(function attachDiscountTeaserGrid(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.IDLDiscountTeaserGrid = api;
  }
}(typeof window !== 'undefined' ? window : globalThis, function createDiscountTeaserGrid() {
  // 10 columns over 12 rows: on the 120px square each cell lands 12x10px, the
  // slight landscape ratio of the flag blocks, instead of a 1:1 pixel.
  const COLS = 10;
  const ROWS = 12;
  // Three brightness steps, matching the reference: most cells sit dim, a few
  // burn full volt. A flat opacity reads as a solid block instead of a grid.
  const LEVELS = [0.22, 0.55, 1];
  // One shared cycle, deliberately. Varied cycles read as organic twinkle, but
  // they let the cells drift out of phase and the zigzag dissolves after a few
  // seconds. Uniform cycle + a phase offset along the path is what keeps a
  // single crest travelling for as long as the pointer is down.
  const CYCLE = 900;
  // The crest takes this long to snake the whole plate. Held at exactly two
  // cycles -- one full up-and-back of the alternating pulse -- so precisely one
  // crest is on the plate at a time. Any other value and you get a fraction of
  // a wave, which reads as a stutter at the wrap.
  const SWEEP = CYCLE * 2;
  // Nudges each cell off the path so the wave front is a soft edge rather than
  // a hard scanline.
  const JITTER = 60;

  // Deterministic scatter. Math.random would repaint a different pattern on
  // every reload and could not be asserted in tests -- this hash gives the same
  // arrangement every time while still reading as random.
  function noise(index, salt) {
    let h = Math.imul(index + 1, 2654435761) ^ Math.imul(salt + 1, 40503);
    h ^= h >>> 15;
    h = Math.imul(h, 2246822519);
    h ^= h >>> 13;
    return (h >>> 0) / 4294967295;
  }

  function isLit(index) {
    return noise(index, 1) > 0.42;
  }

  function levelAt(index) {
    const n = noise(index, 3);
    if (n > 0.78) return 2;
    if (n > 0.44) return 1;
    return 0;
  }

  // Boustrophedon: the first row runs left to right, the next one right to
  // left, and so on. Walking the cells in this order gives the zigzag path the
  // light travels down; a plain row-major order would snap back to the left
  // edge on every row and read as a scanline instead.
  function sweepIndexAt(index, cols = COLS) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return row * cols + (row % 2 === 0 ? col : cols - 1 - col);
  }

  // The plate is clipped to polygon(0 0, 100% 100%, 0 100%), so a cell only
  // shows if its centre falls in the lower-left triangle. Ranking the sweep
  // over every grid slot spends most of the window on rows that are almost
  // entirely clipped away, and the crest vanishes for most of its travel.
  function isVisible(index, cols = COLS, rows = ROWS) {
    const x = ((index % cols) + 0.5) / cols;
    const y = (Math.floor(index / cols) + 0.5) / rows;
    return x <= y;
  }

  // `along` is the cell's position on the path, 0 to 1, handed down by cells().
  function delayAt(along, index) {
    const jitter = (noise(index, 2) - 0.5) * JITTER;
    return Math.max(0, Math.round(along * SWEEP + jitter));
  }

  function cycleAt() {
    return CYCLE;
  }

  function cellAt(index, cols = COLS, along = 0) {
    return {
      index,
      // 1-based: these land straight in grid-column / grid-row.
      col: (index % cols) + 1,
      row: Math.floor(index / cols) + 1,
      level: LEVELS[levelAt(index)],
      delay: delayAt(along, index),
      cycle: cycleAt(),
    };
  }

  // Only cells that are both lit and inside the triangle are built. A dark or
  // clipped cell is an invisible node, and the teaser is a fixed overlay that
  // ships on every page view.
  //
  // Delay comes from the cell's rank along the boustrophedon path among the
  // cells that survive, not from its raw grid index -- so the crest moves at an
  // even pace across what is actually on screen.
  function cells(cols = COLS, rows = ROWS) {
    const kept = [];
    for (let i = 0; i < cols * rows; i += 1) {
      if (isLit(i) && isVisible(i, cols, rows)) kept.push(i);
    }

    kept.sort((a, b) => sweepIndexAt(a, cols) - sweepIndexAt(b, cols));

    const span = Math.max(1, kept.length - 1);
    return kept.map((index, rank) => cellAt(index, cols, rank / span));
  }

  return {
    COLS,
    ROWS,
    LEVELS,
    CYCLE,
    SWEEP,
    JITTER,
    noise,
    isLit,
    isVisible,
    levelAt,
    sweepIndexAt,
    delayAt,
    cycleAt,
    cellAt,
    cells,
  };
}));
