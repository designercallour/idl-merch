/* IDL jersey fit finder — a step-by-step "Recommend my size" wizard, modelled
   on Attaquer's Find My Size: one question per screen, height + weight do real
   work, chest/waist optional, a fit preference, then a size with its reasoning.

   IMPORTANT: the height / weight / waist BANDS below are PROVISIONAL estimates,
   anchored to the accurate chest bands in jersey-sizing.js. They are NOT from
   the IDL tech pack yet — replace weightKg / heightCm / waistIn with real IDL
   ranges when available. The chest bands (window.IDL_JERSEY_SIZING) are real. */
(function () {
  'use strict';

  var SIZING = window.IDL_JERSEY_SIZING;
  if (!SIZING) return;
  var BY_ID = {};
  SIZING.garments.forEach(function (g) { BY_ID[g.id] = g; });

  // Provisional body bands per garment. Each array is the UPPER bound of that
  // size (like the chest bands' "up to X"): value <= bands[i] -> size i.
  var BANDS = {
    'ss-jersey': {
      weightKg: [60, 70, 80, 90, 100, 112],
      heightCm: [168, 174, 182, 188, 194, 210],
      waistIn:  [28, 31, 34, 37, 40, 44]
    },
    'ls-jersey': {
      weightKg: [70, 80, 90, 100, 112],
      heightCm: [174, 182, 188, 194, 210],
      waistIn:  [31, 34, 37, 40, 44]
    }
  };

  // ---- product / garment resolution (mirrors the size guide) --------------
  function currentKey() {
    var picked = document.querySelector('.pdp-cut.is-selected');
    if (picked && picked.dataset.cutKey) return picked.dataset.cutKey;
    return new URLSearchParams(window.location.search).get('product');
  }
  function garmentFor(key) {
    if (!key || !window.IDL_JERSEY_GARMENT) return null;
    var cat = window.IDL_CATALOG;
    var product = cat && cat.products ? cat.products[key] : null;
    return window.IDL_JERSEY_GARMENT(key, product);
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function sizeLabel(s) { return s === '2XL' ? 'XXL' : s; }
  function clamp(i, lo, hi) { return Math.max(lo, Math.min(hi, i)); }
  function round(n) { return Math.round(n); }

  // ---- unit helpers -------------------------------------------------------
  function cmToFtIn(cm) { var t = cm / 2.54; return { ft: Math.floor(t / 12), in: round(t % 12) }; }
  function ftInToCm(ft, inch) { return round((ft * 12 + inch) * 2.54); }
  function kgToLb(kg) { return round(kg * 2.2046226); }
  function lbToKg(lb) { return lb / 2.2046226; }
  function inToCm(inch) { return round(inch * 2.54); }

  // ---- band lookup --------------------------------------------------------
  function bandIndex(value, arr) {
    for (var i = 0; i < arr.length; i += 1) { if (value <= arr[i]) return i; }
    return arr.length - 1;
  }
  // Chest uses the real bands from jersey-sizing.js (string ranges, inches).
  function chestIndex(g, inches) {
    var ranges = g.bodyChest.in;
    for (var i = 0; i < ranges.length; i += 1) {
      var r = String(ranges[i]).toLowerCase(), hi;
      if (r.indexOf('up to') !== -1) hi = parseFloat(r.replace(/[^0-9.]/g, ''));
      else {
        var parts = r.split(/[–—-]/).map(parseFloat).filter(function (x) { return !isNaN(x); });
        hi = parts.length ? parts[parts.length - 1] : NaN;
      }
      if (!isNaN(hi) && inches <= hi) return i;
    }
    return ranges.length - 1;
  }

  // ---- state --------------------------------------------------------------
  var dialog = null;
  var gid = null, productKey = null, g = null, bands = null;
  var state = null;

  function freshState() {
    return {
      step: 0,
      heightCm: 178,        // canonical
      weightKg: 75,         // canonical
      chestInVal: 39,       // canonical (inches), working value
      waistInVal: 33,       // canonical (inches)
      chestIn: null,        // committed (inches) or null when skipped
      waistIn: null,
      fit: 'true',
      units: { height: 'cm', weight: 'kg', chest: 'in', waist: 'in' }
    };
  }

  var STEPS = ['height', 'weight', 'chest', 'waist', 'fit', 'result'];

  // ---- recommendation -----------------------------------------------------
  function recommend() {
    var sizes = g.sizes;
    var wIdx = bandIndex(state.weightKg, bands.weightKg);
    var hIdx = bandIndex(state.heightCm, bands.heightCm);
    var cIdx = state.chestIn != null ? chestIndex(g, state.chestIn) : null;
    var waistIdx = state.waistIn != null ? bandIndex(state.waistIn, bands.waistIn) : null;

    // Chest is what has to fit, so it leads when we have it; otherwise weight
    // leads with height as a lighter cross-check.
    var base = cIdx != null ? cIdx : Math.round((2 * wIdx + hIdx) / 3);
    var fitAdj = state.fit === 'closer' ? -1 : (state.fit === 'roomier' ? 1 : 0);
    var idx = clamp(base + fitAdj, 0, sizes.length - 1);

    return {
      idx: idx, size: sizes[idx],
      wIdx: wIdx, hIdx: hIdx, cIdx: cIdx, waistIdx: waistIdx, base: base, fitAdj: fitAdj
    };
  }

  // ---- rendering pieces ---------------------------------------------------
  function photoSrc() { return productKey ? 'standout-assets/shop-products/' + productKey + '.jpg' : ''; }

  function unitToggle(kind, a, b) {
    var cur = state.units[kind];
    return '<div class="ff-units" role="group">'
      + '<button type="button" data-ff-unit="' + kind + '" data-ff-unit-val="' + a.v + '"' + (cur === a.v ? ' class="is-on"' : '') + '>' + a.l + '</button>'
      + '<button type="button" data-ff-unit="' + kind + '" data-ff-unit-val="' + b.v + '"' + (cur === b.v ? ' class="is-on"' : '') + '>' + b.l + '</button>'
      + '</div>';
  }

  function bigValue(kind) {
    if (kind === 'height') {
      if (state.units.height === 'cm') return state.heightCm + '<span class="ff-unit">cm</span>';
      var f = cmToFtIn(state.heightCm);
      return f.ft + '<span class="ff-unit">\'</span> ' + f.in + '<span class="ff-unit">"</span>';
    }
    if (kind === 'weight') {
      return state.units.weight === 'kg'
        ? state.weightKg + '<span class="ff-unit">kg</span>'
        : kgToLb(state.weightKg) + '<span class="ff-unit">lb</span>';
    }
    if (kind === 'chest') {
      return state.units.chest === 'in'
        ? round(state.chestInVal) + '<span class="ff-unit">"</span>'
        : inToCm(state.chestInVal) + '<span class="ff-unit">cm</span>';
    }
    if (kind === 'waist') {
      return state.units.waist === 'in'
        ? round(state.waistInVal) + '<span class="ff-unit">"</span>'
        : inToCm(state.waistInVal) + '<span class="ff-unit">cm</span>';
    }
    return '';
  }

  // ---- ruler (custom, Attaquer-style) -------------------------------------
  function canonical(kind) {
    if (kind === 'height') return state.heightCm;
    if (kind === 'weight') return state.weightKg;
    if (kind === 'chest') return state.chestInVal;
    return state.waistInVal;
  }
  function setCanonical(kind, v) {
    if (kind === 'height') state.heightCm = v;
    else if (kind === 'weight') state.weightKg = v;
    else if (kind === 'chest') state.chestInVal = v;
    else state.waistInVal = v;
  }

  // The ruler works in the DISPLAY unit (1 tick = 1 inch in ft mode, 1 cm in cm
  // mode, ...), exactly like Attaquer: min/max/step and majors are all in the
  // shown unit, with toDisp/toCanon bridging to the canonical stored value.
  function mk(a, b, step) { var arr = [], v; for (v = a; v <= b; v += step) arr.push({ v: v, l: '' + v }); return arr; }
  function rulerConfig(kind) {
    if (kind === 'height') {
      if (state.units.height === 'ft') return { min: 55, max: 83, step: 1, majors: [{ v: 60, l: "5'" }, { v: 72, l: "6'" }], toDisp: function (cm) { return cm / 2.54; }, toCanon: function (i) { return Math.round(i * 2.54); } };
      return { min: 140, max: 210, step: 1, majors: mk(140, 210, 10), toDisp: function (cm) { return cm; }, toCanon: function (cm) { return cm; } };
    }
    if (kind === 'weight') {
      if (state.units.weight === 'lb') return { min: 100, max: 285, step: 1, majors: mk(100, 280, 20), toDisp: function (kg) { return kgToLb(kg); }, toCanon: function (lb) { return lbToKg(lb); } };
      return { min: 45, max: 130, step: 1, majors: mk(50, 130, 10), toDisp: function (kg) { return kg; }, toCanon: function (kg) { return kg; } };
    }
    if (kind === 'chest') {
      if (state.units.chest === 'cm') return { min: 76, max: 132, step: 1, majors: mk(80, 130, 10), toDisp: function (i) { return Math.round(i * 2.54); }, toCanon: function (cm) { return cm / 2.54; } };
      return { min: 30, max: 52, step: 1, majors: mk(30, 52, 4), toDisp: function (i) { return i; }, toCanon: function (i) { return i; } };
    }
    if (state.units.waist === 'cm') return { min: 61, max: 117, step: 1, majors: mk(65, 115, 10), toDisp: function (i) { return Math.round(i * 2.54); }, toCanon: function (cm) { return cm / 2.54; } };
    return { min: 24, max: 46, step: 1, majors: mk(24, 46, 4), toDisp: function (i) { return i; }, toCanon: function (i) { return i; } };
  }

  function ruler(kind) {
    var c = rulerConfig(kind), span = c.max - c.min, dv = c.toDisp(canonical(kind)), v;
    var majorAt = {}; c.majors.forEach(function (m) { majorAt[m.v] = 1; });
    var ticks = '';
    for (v = c.min; v <= c.max + 0.0001; v += c.step) {
      var xp = ((v - c.min) / span * 100).toFixed(4);
      ticks += '<span class="ff-tick' + (majorAt[Math.round(v)] ? ' is-major' : '') + '" style="left:' + xp + '%"></span>';
    }
    var hp = ((clamp(dv, c.min, c.max) - c.min) / span * 100).toFixed(3);
    var labels = c.majors.map(function (m) { return '<span class="ff-ruler-lbl" style="left:' + ((m.v - c.min) / span * 100).toFixed(4) + '%">' + m.l + '</span>'; }).join('');
    return '<div class="ff-ruler" data-ff-ruler="' + kind + '" tabindex="0" role="slider" aria-valuemin="' + c.min + '" aria-valuemax="' + c.max + '" aria-valuenow="' + round(dv) + '">'
      + '<div class="ff-ruler-box"><div class="ff-ruler-scale">' + ticks + '<div class="ff-ruler-handle" data-ff-handle style="left:' + hp + '%"></div></div></div>'
      + '<div class="ff-ruler-labels">' + labels + '</div>'
      + '</div>';
  }

  function metricStep(opts) {
    // Title + sub pin to the top; the controls centre in the space below.
    return '<div class="ff-q">'
      + '<h2 class="ff-title">' + esc(opts.title) + '</h2>'
      + '<p class="ff-sub">' + opts.sub + '</p>'
      + '<div class="ff-controls">'
      + unitToggle(opts.kind, opts.a, opts.b)
      + '<div class="ff-big" data-ff-big="' + opts.kind + '">' + bigValue(opts.kind) + '</div>'
      + '<p class="ff-hint">Drag the ruler to set it.</p>'
      + ruler(opts.kind)
      + '</div>'
      + '</div>';
  }

  function fitStep() {
    var opts = [
      ['closer', 'Slim', 'Sits close to the body — size down.'],
      ['true', 'Regular', 'How this jersey is meant to fit.'],
      ['roomier', 'Oversized', 'Loose and roomy — size up.']
    ];
    return '<div class="ff-q">'
      + '<h2 class="ff-title">How do you want it to fit?</h2>'
      + '<p class="ff-sub">' + (gid === 'ss-jersey' ? 'This short sleeve is cut oversized by default.' : 'This long sleeve is cut athletic by default.') + '</p>'
      + '<div class="ff-cards">'
      + opts.map(function (o) {
          var on = state.fit === o[0];
          return '<button type="button" class="ff-card' + (on ? ' is-on' : '') + '" data-ff-fit="' + o[0] + '">'
            + '<span class="ff-card-t">' + esc(o[1]) + '</span><span class="ff-card-d">' + esc(o[2]) + '</span></button>';
        }).join('')
      + '</div></div>';
  }

  function frac(inch) {
    var whole = Math.floor(inch), r = inch - whole;
    var f = r >= 0.75 ? '¾' : r >= 0.5 ? '½' : r >= 0.25 ? '¼' : '';
    return (whole || !f ? whole : '') + f;
  }

  function resultStep() {
    var r = recommend();
    var sizes = g.sizes;
    var lines = [];
    if (r.cIdx != null) {
      lines.push('A ' + frac(state.chestIn) + '" chest sits in ' + sizeLabel(sizes[r.cIdx]) + '. We size on the chest, because that is what has to fit.');
    } else {
      lines.push('Your weight puts you around ' + sizeLabel(sizes[r.wIdx]) + ', and your height around ' + sizeLabel(sizes[r.hIdx]) + '.');
    }
    if (r.waistIdx != null && r.waistIdx < r.idx) {
      lines.push('Your waist sits in ' + sizeLabel(sizes[r.waistIdx]) + ', so ' + sizeLabel(r.size) + ' will be a touch roomier through the waist.');
    }
    if (r.fitAdj !== 0) {
      lines.push(r.fitAdj < 0 ? 'You asked for a closer fit, so we sized down.' : 'You asked for more room, so we sized up.');
    }
    if (gid === 'ss-jersey') lines.push('Wearing ' + sizeLabel(r.size) + ' here? You will want one size up in the long sleeve — it is cut athletic.');

    return '<div class="ff-result">'
      + '<p class="ff-result-eyebrow">Your size</p>'
      + '<p class="ff-result-size">' + esc(sizeLabel(r.size)) + '</p>'
      + lines.map(function (l) { return '<p class="ff-result-line">' + l + '</p>'; }).join('')
      + '</div>';
  }

  function currentStepKey() {
    // Skip nothing — chest/waist are optional but still shown; the user skips
    // with the secondary link.
    return STEPS[state.step];
  }

  function stepBody() {
    var key = currentStepKey();
    if (key === 'height') return metricStep({ kind: 'height', title: 'How tall are you?', sub: 'Height and weight together give us a starting point.', a: { v: 'cm', l: 'Cm' }, b: { v: 'ft', l: 'Ft / In' } });
    if (key === 'weight') return metricStep({ kind: 'weight', title: 'What do you weigh?', sub: 'We hold a weight range for each size, so this does real work.', a: { v: 'kg', l: 'Kg' }, b: { v: 'lb', l: 'Lb' } });
    if (key === 'chest') return metricStep({ kind: 'chest', title: 'Do you know your chest?', sub: 'Optional. Measure around the fullest part, under the arms.', a: { v: 'in', l: 'In' }, b: { v: 'cm', l: 'Cm' } });
    if (key === 'waist') return metricStep({ kind: 'waist', title: 'And your waist?', sub: 'Optional. Measure around the narrowest part.', a: { v: 'in', l: 'In' }, b: { v: 'cm', l: 'Cm' } });
    if (key === 'fit') return fitStep();
    return resultStep();
  }

  // Same primary button as Add to cart: lime bar, uppercase label, icon plate.
  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  function primaryBtn(label, attr, icon) {
    return '<button class="ff-cta pdp-add newsletter-submit button primary" type="button" ' + attr + '>'
      + '<span class="button-label">' + esc(label) + '</span>'
      + '<span class="button-icon">' + icon + '</span></button>';
  }

  function backBtn() {
    return state.step > 0
      ? '<button class="ff-btn-back" type="button" data-ff-back>Back</button>'
      : '';
  }
  function footer() {
    var key = currentStepKey(), primary = '', links = '';
    if (key === 'result') {
      primary = primaryBtn('Select ' + sizeLabel(recommend().size), 'data-ff-select', ICON_CHECK);
      links = '<button class="ff-link" type="button" data-ff-chart>See the full size chart</button>'
        + '<button class="ff-link" type="button" data-ff-restart>Start again</button>';
    } else if (key === 'chest') {
      primary = primaryBtn('Use this measurement', 'data-ff-next', ICON_ARROW);
      links = '<button class="ff-link" type="button" data-ff-skip>I do not know it</button>';
    } else if (key === 'waist') {
      primary = primaryBtn('Use this measurement', 'data-ff-next', ICON_ARROW);
      links = '<button class="ff-link" type="button" data-ff-skip>Skip this one</button>';
    } else {
      primary = primaryBtn('Continue', 'data-ff-next', ICON_ARROW);
    }
    var split = state.step > 0 && primary ? ' ff-foot-row--split' : '';
    return '<div class="ff-foot-row' + split + '">' + backBtn() + primary + '</div>' + links;
  }

  function dots() {
    return STEPS.map(function (_, i) {
      return '<span class="ff-dot' + (i <= state.step ? ' is-on' : '') + '"></span>';
    }).join('');
  }

  function render() {
    dialog.querySelector('[data-ff-body]').innerHTML = stepBody();
    dialog.querySelector('[data-ff-foot]').innerHTML = footer();
    dialog.querySelector('[data-ff-dots]').innerHTML = dots();
    dialog.querySelector('[data-ff-body]').scrollTop = 0;
  }

  // ---- interactions -------------------------------------------------------
  // dv is in the display unit.
  function setRuler(kind, dv) {
    var c = rulerConfig(kind);
    dv = clamp(Math.round(dv / c.step) * c.step, c.min, c.max);
    setCanonical(kind, c.toCanon(dv));
    var big = dialog.querySelector('[data-ff-big="' + kind + '"]');
    if (big) big.innerHTML = bigValue(kind);
    var rl = dialog.querySelector('[data-ff-ruler="' + kind + '"]');
    if (rl) {
      var h = rl.querySelector('[data-ff-handle]');
      if (h) h.style.left = ((dv - c.min) / (c.max - c.min) * 100).toFixed(3) + '%';
      rl.setAttribute('aria-valuenow', Math.round(dv));
    }
  }
  function valueFromPointer(kind, clientX) {
    var rl = dialog.querySelector('[data-ff-ruler="' + kind + '"]');
    if (!rl) return null;
    // Measure against the box, not the whole ruler (labels add height only).
    var box = rl.querySelector('.ff-ruler-box') || rl;
    var c = rulerConfig(kind), rect = box.getBoundingClientRect();
    return c.min + ((clientX - rect.left) / rect.width) * (c.max - c.min);
  }

  function commitStep() {
    var key = currentStepKey();
    if (key === 'chest') state.chestIn = state.chestInVal;
    if (key === 'waist') state.waistIn = state.waistInVal;
  }
  function next() {
    if (state.step < STEPS.length - 1) { state.step += 1; render(); }
  }
  function skip(kind) {
    if (kind === 'chest') state.chestIn = null;
    if (kind === 'waist') state.waistIn = null;
    next();
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'fitfinder';
    dialog.setAttribute('aria-label', 'Recommend my size');
    dialog.innerHTML =
      '<div class="ff-head">'
      + '<h2 class="ff-head-title">Recommend My Size</h2>'
      + '<button class="ff-close" type="button" data-ff-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>'
      + '</div>'
      + '<div class="ff-dots" data-ff-dots></div>'
      + '<div class="ff-scroll">'
      + '<div class="ff-body" data-ff-body></div>'
      + '</div>'
      + '<div class="ff-foot" data-ff-foot></div>';
    document.body.appendChild(dialog);

    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-ff-close]')) { dialog.close(); return; }
      if (e.target.closest('[data-ff-back]')) { if (state.step > 0) { state.step -= 1; render(); } return; }
      if (e.target.closest('[data-ff-next]')) { commitStep(); next(); return; }
      if (e.target.closest('[data-ff-chart]')) { dialog.close(); if (window.IDLJerseySizeGuide) window.IDLJerseySizeGuide.open(gid, productKey); return; }
      if (e.target.closest('[data-ff-restart]')) { var u = state.units; state = freshState(); state.units = u; render(); return; }
      var skipBtn = e.target.closest('[data-ff-skip]');
      if (skipBtn) { skip(currentStepKey()); return; }
      var unitBtn = e.target.closest('[data-ff-unit]');
      if (unitBtn) {
        var kind = unitBtn.dataset.ffUnit, val = unitBtn.dataset.ffUnitVal;
        // Values are stored canonically, so a unit switch only re-labels.
        if (state.units[kind] !== val) { state.units[kind] = val; render(); }
        return;
      }
      var fitBtn = e.target.closest('[data-ff-fit]');
      if (fitBtn) { state.fit = fitBtn.dataset.ffFit; render(); return; }
      if (e.target.closest('[data-ff-select]')) { selectSize(); return; }
      if (e.target === dialog) dialog.close();
    });
    var drag = null;
    dialog.addEventListener('pointerdown', function (e) {
      var rl = e.target.closest('[data-ff-ruler]');
      if (!rl) return;
      drag = rl.dataset.ffRuler;
      try { rl.setPointerCapture(e.pointerId); } catch (err) {}
      var v = valueFromPointer(drag, e.clientX); if (v != null) setRuler(drag, v);
      e.preventDefault();
    });
    dialog.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var v = valueFromPointer(drag, e.clientX); if (v != null) setRuler(drag, v);
    });
    dialog.addEventListener('pointerup', function () { drag = null; });
    dialog.addEventListener('pointercancel', function () { drag = null; });
    dialog.addEventListener('keydown', function (e) {
      var rl = e.target.closest('[data-ff-ruler]');
      if (!rl) return;
      var kind = rl.dataset.ffRuler, dv = rulerConfig(kind).toDisp(canonical(kind));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { setRuler(kind, dv - 1); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { setRuler(kind, dv + 1); e.preventDefault(); }
    });
    dialog.addEventListener('close', function () { document.body.classList.remove('locked'); });
  }

  function selectSize() {
    var size = sizeLabel(recommend().size);
    // Click the matching size button on the PDP, then close.
    var btn = [].slice.call(document.querySelectorAll('.pdp-size, [data-size], .pdp-sizes button')).filter(function (b) {
      return b.textContent.trim().toUpperCase() === size;
    })[0];
    if (btn) btn.click();
    dialog.close();
  }

  function open(garmentId, key) {
    if (!dialog) build();
    gid = garmentId; productKey = key || currentKey();
    g = BY_ID[gid]; bands = BANDS[gid];
    state = freshState();
    render();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('locked');
  }

  function init() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-recommend-size]');
      if (!trigger) return;
      var key = currentKey();
      var id = garmentFor(key);
      if (!id) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open(id, key);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IDLFitFinder = { open: open };
})();
