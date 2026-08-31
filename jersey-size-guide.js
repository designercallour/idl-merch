/* IDL jersey size guide.
   Builds the modal and the PDP fit block from window.IDL_JERSEY_SIZING, which is
   generated from the factory tech pack. Nothing here hard-codes a measurement.

   Two charts, never merged: the short sleeve is oversized, the long sleeve runs
   a full size small, so the same shopper needs opposite advice on two products
   that look almost identical. The guide opens straight to the garment on screen.

   The surface is dark in both the light and the dark product page: the supplied
   how-to-measure diagram carries its own dark background (its garment outlines
   are near white), so a light shell would frame it badly. */
(function () {
  'use strict';

  var DATA = window.IDL_JERSEY_SIZING;
  if (!DATA) return;

  var META = DATA.meta;
  var BY_ID = {};
  DATA.garments.forEach(function (g) { BY_ID[g.id] = g; });

  var unit = 'in'; // inches is the default, per the brief
  var dialog = null;
  var activeGarment = null;

  // The chart carries 2XL; the size buttons on the page say XXL. A shopper is
  // matching a row to a button, so the guide speaks the button's language.
  function sizeLabel(size) { return size === '2XL' ? 'XXL' : size; }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function withUnit(value) {
    return unit === 'in' ? esc(value) + '&quot;' : esc(value) + ' cm';
  }

  // ---- current product ---------------------------------------------------
  // The selected cut button is the most reliable read: switching cut rewrites
  // the URL, and the button carries the key it switched to.
  function currentKey() {
    var picked = document.querySelector('.pdp-cut.is-selected');
    if (picked && picked.dataset.cutKey) return picked.dataset.cutKey;
    var fromUrl = new URLSearchParams(window.location.search).get('product');
    return fromUrl || null;
  }

  function garmentFor(key) {
    if (!key || !window.IDL_JERSEY_GARMENT) return null;
    var catalog = window.IDL_CATALOG;
    var product = catalog && catalog.products ? catalog.products[key] : null;
    return window.IDL_JERSEY_GARMENT(key, product);
  }

  // ---- guide markup ------------------------------------------------------
  function fitScale(filled, max) {
    var cells = '';
    for (var i = 1; i <= max; i += 1) {
      cells += '<span class="jg-scale-seg' + (i <= filled ? ' is-on' : '') + '"></span>';
    }
    return '<div class="jg-scale"><div class="jg-scale-track">' + cells + '</div>'
      + '<div class="jg-scale-ends"><span>' + esc(META.scaleFrom) + '</span>'
      + '<span>' + esc(META.scaleTo) + '</span></div></div>';
  }

  function findTable(g) {
    var head = '<tr>' + META.findCols.map(function (c) {
      return '<th scope="col">' + esc(c) + '</th>';
    }).join('') + '</tr>';
    var rows = g.sizes.map(function (size, i) {
      return '<tr><th scope="row">' + esc(sizeLabel(size)) + '</th>'
        + '<td>' + withUnit(g.bodyChest[unit][i]) + '</td>'
        + '<td>' + withUnit(g.circumference[unit][i]) + '</td></tr>';
    }).join('');
    return '<div class="jg-scroll"><table class="jg-table"><thead>' + head
      + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function flatTable(g) {
    var head = '<tr><th scope="col"><span class="jg-sr">Measurement</span></th>'
      + g.sizes.map(function (s) { return '<th scope="col">' + esc(sizeLabel(s)) + '</th>'; }).join('')
      + '</tr>';
    var rows = g.measurements.map(function (m) {
      return '<tr><th scope="row">' + esc(m.name) + '</th>'
        + m[unit].map(function (v) { return '<td>' + withUnit(v) + '</td>'; }).join('')
        + '</tr>';
    }).join('');
    return '<div class="jg-scroll"><table class="jg-table jg-table--flat"><thead>' + head
      + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function garmentSection(g) {
    return '<section class="jg-garment" data-jg-garment="' + esc(g.id) + '">'
      + '<div class="jg-garment-head">'
      + '<h3>' + esc(g.heading) + '</h3>'
      + '<p class="jg-sub">' + esc(g.subhead) + '</p>'
      + '<p class="jg-here">You’re looking at this one</p>'
      + '</div>'
      + fitScale(g.fitScale, g.fitScaleMax)
      + '<p class="jg-body">' + esc(g.body) + '</p>'
      + '<p class="jg-advice">' + g.advice + '</p>'
      + '<h4 class="jg-h4">' + esc(META.findHeading) + '</h4>'
      + findTable(g)
      + '<p class="jg-note">' + esc(META.findNote) + '</p>'
      + (g.extraNote ? '<p class="jg-note jg-note--flag">' + esc(g.extraNote) + '</p>' : '')
      + '<h4 class="jg-h4">' + esc(META.flatHeading) + '</h4>'
      + flatTable(g)
      + '<p class="jg-note">' + esc(META.flatNote) + '</p>'
      + '</section>';
  }

  function measureSection() {
    var key = META.measureKey.map(function (row) {
      return '<li><span class="jg-key-mark">' + esc(row[0]) + '</span>'
        + '<span><b>' + esc(row[1]) + ':</b> ' + esc(row[2]) + '</span></li>';
    }).join('');
    return '<section class="jg-measure">'
      + '<h3>' + esc(META.measureHeading) + '</h3>'
      + '<p class="jg-body">' + esc(META.measureBody) + '</p>'
      + '<img class="jg-diagram" src="' + esc(META.diagram) + '" alt="Flat drawings of the short sleeve and long sleeve jerseys, drawn to one true scale, with the five measurement points marked A to E." loading="lazy">'
      + '<ul class="jg-key">' + key + '</ul>'
      + '</section>';
  }

  function bodyHTML() {
    return '<div class="jg-banner"><p class="jg-banner-label">' + esc(META.bannerLabel) + '</p>'
      + '<p class="jg-banner-copy">' + META.banner + '</p></div>'
      + '<div class="jg-units" role="group" aria-label="Units">'
      + '<button type="button" data-jg-unit="in"' + (unit === 'in' ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + '>Inches</button>'
      + '<button type="button" data-jg-unit="cm"' + (unit === 'cm' ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + '>CM</button>'
      + '</div>'
      + DATA.garments.map(garmentSection).join('')
      + measureSection()
      + '<p class="jg-footer">' + META.footer + '</p>';
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'jersey-guide';
    dialog.setAttribute('aria-labelledby', 'jersey-guide-title');
    dialog.innerHTML =
      '<div class="jg-head">'
      + '<div><p class="jg-eyebrow">' + esc(META.eyebrow) + '</p>'
      + '<h2 id="jersey-guide-title">' + esc(META.title) + '</h2></div>'
      + '<button class="jg-close" type="button" data-jg-close aria-label="Close size guide">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
      + '</button></div>'
      + '<div class="jg-body-scroll" data-jg-body>' + bodyHTML() + '</div>';
    document.body.appendChild(dialog);

    dialog.addEventListener('click', function (event) {
      if (event.target.closest('[data-jg-close]')) { dialog.close(); return; }
      var unitBtn = event.target.closest('[data-jg-unit]');
      if (unitBtn) { setUnit(unitBtn.dataset.jgUnit); return; }
      // A click that lands outside the panel box is a click on the backdrop.
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('locked');
    });
  }

  function setUnit(next) {
    if (next === unit) return;
    unit = next;
    var scroller = dialog.querySelector('[data-jg-body]');
    var keepTop = scroller.scrollTop;
    scroller.innerHTML = bodyHTML();
    markActive();
    scroller.scrollTop = keepTop; // swapping units should not lose the reader's place
  }

  function markActive() {
    if (!dialog) return;
    dialog.querySelectorAll('[data-jg-garment]').forEach(function (section) {
      section.classList.toggle('is-current', section.dataset.jgGarment === activeGarment);
    });
  }

  function open(garmentId) {
    if (!dialog) build();
    activeGarment = garmentId || DATA.garments[0].id;
    markActive();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('locked');
    // Land on the garment the shopper is actually looking at. The short sleeve
    // already sits at the top, so only the long sleeve needs the jump — the
    // "read this first" banner stays above it either way.
    var scroller = dialog.querySelector('[data-jg-body]');
    var section = dialog.querySelector('[data-jg-garment="' + activeGarment + '"]');
    scroller.scrollTop = 0;
    if (section && activeGarment !== DATA.garments[0].id) {
      // Measured, not offsetTop: the section's offsetParent is the dialog, not
      // the scroller, so offsetTop overshoots by the header's height.
      scroller.scrollTop = section.getBoundingClientRect().top
        - scroller.getBoundingClientRect().top - 8;
    }
  }

  // ---- wiring ------------------------------------------------------------
  function init() {
    // Take the size-guide trigger before the page's own handler, but only for
    // the jerseys — everything else keeps the generic guide it has today.
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-size-guide]');
      if (!trigger) return;
      var gid = garmentFor(currentKey());
      if (!gid) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open(gid);
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.IDLJerseySizeGuide = { open: open };
})();
