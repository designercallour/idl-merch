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
  var dialog = null;

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
    var head = '<tr><th scope="col"><span class="jg-sr">Measurement</span></th>'
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

  // ---- body --------------------------------------------------------------
  function body() {
    var g = BY_ID[active];
    return tabs()
      // One quiet line, the single most useful sentence for this garment.
      + '<p class="jg-lead"><b>' + (active === 'ss-jersey' ? 'Take your usual size.' : 'Size up one from your usual.') + '</b> '
      + esc(g.subhead) + '.</p>'
      // The cross-cut reminder, always present, kept to one line.
      + '<p class="jg-cross">' + META.banner.replace('<b>', '<b>').replace('Same team, different cut.', 'Same team, different cut.') + '</p>'
      + units()
      + findTable(g)
      + '<p class="jg-note">' + esc(META.findNote) + '</p>'
      + (g.extraNote ? '<p class="jg-note jg-note--flag">' + esc(g.extraNote) + '</p>' : '')
      // Both tables sit out in the open — the garment spec directly under the
      // find-your-size chart, no disclosure.
      + '<h3 class="jg-h3">' + esc(META.flatHeading) + '</h3>'
      + flatTable(g)
      + '<p class="jg-note">' + esc(META.flatNote) + '</p>'
      // How to measure, visible like the reference — the supplied diagram plays
      // the part its model photo does.
      + '<h3 class="jg-h3">' + esc(META.measureHeading) + '</h3>'
      + '<p class="jg-measure-body">' + esc(META.measureBody) + '</p>'
      + '<img class="jg-diagram" src="' + esc(META.diagram) + '" alt="Flat drawings of the short sleeve and long sleeve jerseys, one true scale, with the five measurement points A to E." loading="lazy">'
      + measureKey()
      + '<p class="jg-footer">' + META.footer + '</p>';
  }

  function render() {
    var scroller = dialog.querySelector('[data-jg-body]');
    var keep = scroller.scrollTop;
    scroller.innerHTML = body();
    scroller.scrollTop = keep;
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'jersey-guide';
    dialog.setAttribute('aria-labelledby', 'jersey-guide-title');
    dialog.innerHTML =
      '<div class="jg-head">'
      + '<h2 id="jersey-guide-title">' + esc(META.title) + '</h2>'
      + '<button class="jg-close" type="button" data-jg-close>Close</button></div>'
      + '<div class="jg-body-scroll" data-jg-body></div>';
    document.body.appendChild(dialog);

    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-jg-close]')) { dialog.close(); return; }
      var unitBtn = e.target.closest('[data-jg-unit]');
      if (unitBtn) { if (unitBtn.dataset.jgUnit !== unit) { unit = unitBtn.dataset.jgUnit; render(); } return; }
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
    dialog.addEventListener('close', function () { document.body.classList.remove('locked'); });
  }

  function open(garmentId) {
    if (!dialog) build();
    active = garmentId || DATA.garments[0].id;
    dialog.querySelector('[data-jg-body]').scrollTop = 0;
    render();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('locked');
  }

  function init() {
    // Intercept the size-guide trigger before the page's own handler, but only
    // for the jerseys — everything else keeps its generic guide.
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-size-guide]');
      if (!trigger) return;
      var gid = garmentFor(currentKey());
      if (!gid) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open(gid);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IDLJerseySizeGuide = { open: open };
})();
