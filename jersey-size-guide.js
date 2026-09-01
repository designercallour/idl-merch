/* IDL jersey size guide.
   One question, one answer: "what size am I?" The default view is a single
   Find-your-size table for the garment on screen, an inches/cm toggle, and a
   one-line fit note. Everything heavier — the flat garment spec and the
   how-to-measure diagram — sits behind a disclosure, per the brief's own order
   of what to cut first.

   The one thing that can't collapse: the two jerseys are cut on different
   blocks, so a short-sleeve M is a long-sleeve L. A garment toggle keeps them
   separate; opening the guide preselects whichever the shopper is looking at.

   Built from window.IDL_JERSEY_SIZING (generated from the factory tech pack);
   nothing here hard-codes a measurement. */
(function () {
  'use strict';

  var DATA = window.IDL_JERSEY_SIZING;
  if (!DATA) return;

  var META = DATA.meta;
  var BY_ID = {};
  DATA.garments.forEach(function (g) { BY_ID[g.id] = g; });

  var unit = 'in';                       // inches default
  var active = DATA.garments[0].id;      // which garment's chart is shown
  var productKey = null;                  // the product being viewed (for the photo)
  var dialog = null;

  // How-to-measure photo: the main full-body studio shot (arms at sides), cropped
  // to the torso by CSS. The tape lines below sit at these heights of that crop.
  var TAPE_CHEST = 39;   // % from top of the framed photo
  var TAPE_WAIST = 64;

  // The chart carries 2XL; the size buttons on the page say XXL. A shopper is
  // matching a row to a button, so the guide speaks the button's language.
  function sizeLabel(s) { return s === '2XL' ? 'XXL' : s; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function u(v) { return unit === 'in' ? esc(v) + '&quot;' : esc(v) + ' cm'; }

  // Read the garment from the selected cut button (it carries the switched-to
  // key), falling back to the URL.
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

  // ---- pieces ------------------------------------------------------------
  function tabs() {
    return '<div class="jg-tabs" role="tablist" aria-label="Jersey cut">'
      + DATA.garments.map(function (g) {
          var on = g.id === active;
          return '<button type="button" role="tab" data-jg-garment-tab="' + esc(g.id) + '"'
            + ' aria-selected="' + on + '"' + (on ? ' class="is-on"' : '') + '>'
            + esc(g.heading.replace(/ Jersey$/, '')) + '</button>';
        }).join('')
      + '</div>';
  }

  function units() {
    return '<div class="jg-units" role="group" aria-label="Units">'
      + '<button type="button" data-jg-unit="in"' + (unit === 'in' ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + '>Inches</button>'
      + '<span class="jg-units-sep" aria-hidden="true">|</span>'
      + '<button type="button" data-jg-unit="cm"' + (unit === 'cm' ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + '>CM</button>'
      + '</div>';
  }

  function findTable(g) {
    var head = '<tr>' + META.findCols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr>';
    var rows = g.sizes.map(function (size, i) {
      return '<tr><th scope="row">' + esc(sizeLabel(size)) + '</th>'
        + '<td>' + u(g.bodyChest[unit][i]) + '</td>'
        + '<td>' + u(g.circumference[unit][i]) + '</td></tr>';
    }).join('');
    return '<div class="jg-scroll"><table class="jg-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function flatTable(g) {
    var head = '<tr><th scope="col">Product Label</th>'
      + g.sizes.map(function (s) { return '<th scope="col">' + esc(sizeLabel(s)) + '</th>'; }).join('') + '</tr>';
    var rows = g.measurements.map(function (m) {
      return '<tr><th scope="row">' + esc(m.name) + '</th>'
        + m[unit].map(function (v) { return '<td>' + u(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="jg-scroll"><table class="jg-table jg-table--flat"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function measureKey() {
    return '<ul class="jg-key">' + META.measureKey.map(function (r) {
      return '<li><span class="jg-key-mark">' + esc(r[0]) + '</span><span><b>' + esc(r[1]) + ':</b> ' + esc(r[2]) + '</span></li>';
    }).join('') + '</ul>';
  }

  // How-to-measure: a real photo of the jersey on the body with two wrap-around
  // tape marks (chest, waist), matching the reference storefronts. The photo is
  // the product on screen, so it stays on-brand per colourway.
  function photoSrc() {
    var key = productKey || currentKey();
    return key ? 'standout-assets/shop-products/' + key + '.jpg' : '';
  }

  // Where each measurement mark sits on the framed photo (% of the crop box),
  // one set per cut because the sleeves differ. Keyed by the measureKey letter
  // so the marks stay in lock-step with the table rows and the step list.
  //   v: [x, y1, y2]        vertical line + end ticks
  //   h: [y, x1, x2]        horizontal line + arrow at x2
  //   l: [x1, y1, x2, y2]   free line along a sleeve
  //   chip: [x, y]          the A–E label
  var MARKS = {
    'ss-jersey': {
      A: { v: [30, 33, 68], chip: [13, 41], lead: [30, 41] },
      B: { h: [46, 33, 66], chip: [13, 55], lead: [33, 49] },
      C: { h: [34, 38, 60], chip: [88, 33], lead: [60, 34] },
      D: { l: [64, 38, 70, 50], chip: [88, 47], lead: [70, 49] },
      E: { h: [51, 63, 71], chip: [88, 61], lead: [71, 52] }
    },
    'ls-jersey': {
      A: { v: [30, 32, 66], chip: [13, 41], lead: [30, 41] },
      B: { h: [45, 33, 64], chip: [13, 55], lead: [33, 47] },
      C: { h: [32, 37, 60], chip: [88, 31], lead: [60, 33] },
      D: { l: [62, 37, 67, 68], chip: [88, 50], lead: [65, 52] },
      E: { h: [70, 62, 71], chip: [88, 64], lead: [71, 70] }
    }
  };

  function drawMark(cfg) {
    if (cfg.v) {
      var x = cfg.v[0], y1 = cfg.v[1], y2 = cfg.v[2];
      return '<path class="jg-tape-front" d="M' + x + ',' + y1 + ' L' + x + ',' + y2 + '"/>'
        + '<path class="jg-tape-tick" d="M' + (x - 3) + ',' + y1 + ' L' + (x + 3) + ',' + y1
        + ' M' + (x - 3) + ',' + y2 + ' L' + (x + 3) + ',' + y2 + '"/>';
    }
    if (cfg.h) {
      // A dimension line with a tick at each end — reads as a span, and (unlike
      // an arrow) points at nothing, so lines never appear to collide.
      var y = cfg.h[0], a = cfg.h[1], b = cfg.h[2];
      return '<path class="jg-tape-front" d="M' + a + ',' + y + ' L' + b + ',' + y + '"/>'
        + '<path class="jg-tape-tick" d="M' + a + ',' + (y - 2.4) + ' L' + a + ',' + (y + 2.4)
        + ' M' + b + ',' + (y - 2.4) + ' L' + b + ',' + (y + 2.4) + '"/>';
    }
    var lx1 = cfg.l[0], ly1 = cfg.l[1], lx2 = cfg.l[2], ly2 = cfg.l[3];
    return '<path class="jg-tape-front" d="M' + lx1 + ',' + ly1 + ' L' + lx2 + ',' + ly2 + '"/>'
      + '<path class="jg-tape-tick" d="M' + (lx2 - 3) + ',' + (ly2 - 2) + ' L' + (lx2 + 3) + ',' + (ly2 + 2) + '"/>';
  }

  function measurePhoto() {
    var src = photoSrc();
    var img = src
      ? '<div class="jg-measure-img" role="img" aria-label="How to measure the jersey for sizing" style="background-image:url(\'' + esc(src) + '\')"></div>'
      : '';
    var marks = MARKS[active] || MARKS[DATA.garments[0].id];
    var svg = '', chips = '';
    META.measureKey.forEach(function (r) {
      var letter = r[0], cfg = marks[letter];
      if (!cfg) return;
      // Leader from the margin chip to the measurement, so labels sit in the
      // clear space beside the figure and never collide with the marks.
      if (cfg.lead) {
        svg += '<path class="jg-tape-lead" d="M' + cfg.chip[0] + ',' + cfg.chip[1] + ' L' + cfg.lead[0] + ',' + cfg.lead[1] + '"/>';
      }
      svg += '<g class="jg-tape-g">' + drawMark(cfg) + '</g>';
      chips += '<span class="jg-tape-lbl" style="left:' + cfg.chip[0] + '%;top:' + cfg.chip[1] + '%">' + esc(letter) + '</span>';
    });
    var steps = META.measureKey.map(function (r) {
      return '<div class="jg-ms-row">'
        + '<span class="jg-ms-chip">' + esc(r[0]) + '</span>'
        + '<div class="jg-ms-txt"><p class="jg-ms-title">' + esc(r[1]).toUpperCase() + '</p>'
        + '<p class="jg-ms-desc">' + esc(r[2]) + '</p></div>'
        + '</div>';
    }).join('');
    return '<div class="jg-measure">'
      + '<div class="jg-measure-photo">' + img
      + '<svg class="jg-tape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + svg + '</svg>'
      + chips
      + '</div>'
      + '<div class="jg-measure-steps">' + steps + '</div>'
      + '</div>';
  }

  // ---- body --------------------------------------------------------------
  function body() {
    var g = BY_ID[active];
    // No garment toggle and no garment heading here: the header title carries
    // the garment name ("Size Guide — Long Sleeve Jersey").
    return units()
      // Garment measurements, laid flat — shown in the open, no disclosure.
      + '<h3 class="jg-h3 jg-h3--first">' + esc(META.flatHeading) + '</h3>'
      + flatTable(g)
      // How to measure yourself — a real photo with wrap-around tape marks.
      + '<h3 class="jg-h3">' + esc(META.measureHeading) + '</h3>'
      + '<p class="jg-measure-body">' + esc(META.measureBody) + '</p>'
      + measurePhoto();
  }

  function render() {
    var scroller = dialog.querySelector('[data-jg-body]');
    var keep = scroller.scrollTop;
    scroller.innerHTML = body();
    scroller.scrollTop = keep;
  }

  // ---- size recommender (the drawer's bottom CTA) -----------------------
  // Replaces the removed find-your-size table with something interactive: the
  // shopper enters their chest and we map it onto the garment's body-chest
  // bands (the same derived ranges) to name a size.
  function renderFoot() {
    var foot = dialog.querySelector('[data-jg-foot]');
    if (!foot) return;
    // Same button as Add to cart — the storefront's primary button, lime with
    // the dark icon plate on the right.
    foot.innerHTML = '<button class="jg-reco-cta newsletter-submit button primary" type="button" data-jg-reco-open>'
      + '<span class="button-label">Recommend My Size</span>'
      + '<span class="button-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="8" width="20" height="8" rx="1"></rect><line x1="6.5" y1="8" x2="6.5" y2="12"></line><line x1="11" y1="8" x2="11" y2="12"></line><line x1="15.5" y1="8" x2="15.5" y2="12"></line><line x1="20" y1="8" x2="20" y2="12"></line></svg></span>'
      + '</button>';
  }

  function openReco() {
    var foot = dialog.querySelector('[data-jg-foot]');
    foot.innerHTML =
      '<div class="jg-reco">'
      + '<label class="jg-reco-label" for="jg-reco-input">Your chest, around (' + (unit === 'in' ? 'inches' : 'cm') + ')</label>'
      + '<div class="jg-reco-row">'
      + '<input class="jg-reco-input" id="jg-reco-input" type="number" inputmode="decimal" min="0" step="0.5" placeholder="' + (unit === 'in' ? 'e.g. 39' : 'e.g. 99') + '" data-jg-reco-input>'
      + '<button class="jg-reco-close" type="button" data-jg-reco-cancel aria-label="Cancel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>'
      + '</div>'
      + '<p class="jg-reco-out" data-jg-reco-out aria-live="polite">Measure around the fullest part of your chest, tape level.</p>'
      + '</div>';
    var input = foot.querySelector('[data-jg-reco-input]');
    if (input) input.focus();
  }

  function recommend(value) {
    var g = BY_ID[active];
    var ranges = g.bodyChest[unit];
    for (var i = 0; i < ranges.length; i += 1) {
      var r = String(ranges[i]).toLowerCase();
      var hi;
      if (r.indexOf('up to') !== -1) {
        hi = parseFloat(r.replace(/[^0-9.]/g, ''));
      } else {
        var parts = r.split(/[–—-]/).map(function (x) { return parseFloat(x); }).filter(function (x) { return !isNaN(x); });
        hi = parts.length ? parts[parts.length - 1] : NaN;
      }
      if (!isNaN(hi) && value <= hi) return g.sizes[i];
    }
    return g.sizes[g.sizes.length - 1]; // above every band -> the largest made
  }

  function runReco() {
    var out = dialog.querySelector('[data-jg-reco-out]');
    var input = dialog.querySelector('[data-jg-reco-input]');
    if (!out || !input) return;
    var v = parseFloat(input.value);
    if (isNaN(v) || v <= 0) {
      out.className = 'jg-reco-out';
      out.innerHTML = 'Measure around the fullest part of your chest, tape level.';
      return;
    }
    var size = sizeLabel(recommend(v));
    out.className = 'jg-reco-out jg-reco-out--hit';
    out.innerHTML = 'We recommend size <b>' + esc(size) + '</b>.';
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'jersey-guide';
    dialog.setAttribute('aria-labelledby', 'jersey-guide-title');
    dialog.innerHTML =
      '<div class="jg-head">'
      + '<h2 id="jersey-guide-title">' + esc(META.title) + '</h2>'
      + '<button class="jg-close" type="button" data-jg-close aria-label="Close size guide">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
      + '</button></div>'
      + '<div class="jg-body-scroll" data-jg-body></div>'
      + '<div class="jg-foot" data-jg-foot></div>';
    document.body.appendChild(dialog);
    renderFoot();

    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-jg-close]')) { dialog.close(); return; }
      if (e.target.closest('[data-jg-reco-open]')) { openReco(); return; }
      if (e.target.closest('[data-jg-reco-cancel]')) { renderFoot(); return; }
      var unitBtn = e.target.closest('[data-jg-unit]');
      // Switching units would reinterpret a typed number, so the recommender
      // resets when the unit changes.
      if (unitBtn) { if (unitBtn.dataset.jgUnit !== unit) { unit = unitBtn.dataset.jgUnit; render(); renderFoot(); } return; }
      var tab = e.target.closest('[data-jg-garment-tab]');
      if (tab) {
        if (tab.dataset.jgGarmentTab !== active) {
          active = tab.dataset.jgGarmentTab;
          var s = dialog.querySelector('[data-jg-body]'); s.scrollTop = 0;
          render();
        }
        return;
      }
      if (e.target === dialog) dialog.close(); // backdrop
    });
    dialog.addEventListener('input', function (e) {
      if (e.target.closest('[data-jg-reco-input]')) runReco();
    });
    dialog.addEventListener('close', function () { document.body.classList.remove('locked'); });
  }

  function open(garmentId, key) {
    if (!dialog) build();
    active = garmentId || DATA.garments[0].id;
    productKey = key || currentKey();
    // Title carries the garment: "Size Guide — Long Sleeve Jersey".
    dialog.querySelector('#jersey-guide-title').textContent = META.title + ' ' + BY_ID[active].heading;
    dialog.querySelector('[data-jg-body]').scrollTop = 0;
    render();
    renderFoot();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('locked');
  }

  function init() {
    // Intercept the size-guide trigger before the page's own handler, but only
    // for the jerseys — everything else keeps its generic guide.
    document.addEventListener('click', function (e) {
      var reco = e.target.closest('[data-recommend-size]');
      var trigger = reco || e.target.closest('[data-size-guide]');
      if (!trigger) return;
      var key = currentKey();
      var gid = garmentFor(key);
      if (!gid) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open(gid, key);
      // "Recommend my size" lands straight on the chest input.
      if (reco) openReco();
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IDLJerseySizeGuide = { open: open };
})();
