// ============================================================
// IDL cart-v2 — shared cart drawer logic.
//
// Self-contained: injects its own drawer markup, holds the cart
// state, and exposes a small API every page's add-to-cart buttons
// call. One definition, so the cart is identical on every page.
//
//   window.IDLCart.add({ key, name, price, image, size }, opts)
//       opts.open  — slide the drawer open after adding (default false)
//       opts.toast — toast message to flash (default null)
//   window.IDLCart.open()  / .close()  / .render()
//
// Optional integrations, all degrade gracefully when absent:
//   window.IDL_CATALOG        (product-catalog.js) — powers the
//       "Pair it with" upsell rail and the Size/Cut meta lines.
//   window.IDLCurrency        (currency-selector.js) — price format.
//   window.IDL_CART_CONTEXT.productKey — the current PDP product, so
//       the upsell can lead with its sibling cut / team; null off a PDP.
// ============================================================
(function () {
  'use strict';

  var SHOP = 'standout-assets/shop-products/';
  var FREE_SHIP_THRESHOLD = 2500000; // IDR — mirrors the "$160" promo banner
  var MAX_QTY = 10;

  var DRAWER_HTML =
    '<div class="drawer-scrim" data-close-drawer></div>' +
    '<aside class="bag-drawer cart-v2" id="bag-drawer" aria-hidden="true" aria-labelledby="bag-title">' +
      '<header class="drawer-header">' +
        '<div class="drawer-head-left">' +
          '<i data-lucide="shopping-bag" aria-hidden="true"></i>' +
          '<h2 id="bag-title">Cart</h2>' +
          '<span class="drawer-count" data-count>0</span>' +
        '</div>' +
        '<button class="drawer-close-icon" type="button" data-close-drawer aria-label="Close cart"><i data-lucide="x" aria-hidden="true"></i></button>' +
      '</header>' +
      '<div class="drawer-body">' +
        '<div class="cart-ship" data-ship hidden>' +
          '<div class="cart-ship-track"><div class="cart-ship-fill" data-ship-fill></div><p class="cart-ship-msg" data-ship-msg></p></div>' +
        '</div>' +
        '<div class="drawer-items"></div>' +
        '<section class="cart-upsell" data-upsell hidden>' +
          '<div class="cart-upsell-top">' +
            '<p class="cart-upsell-head">Pair it with</p>' +
            '<div class="cart-upsell-arrows" data-upsell-arrows hidden>' +
              '<button type="button" class="cart-upsell-arrow" data-upsell-prev aria-label="Previous"><i data-lucide="chevron-left" aria-hidden="true"></i></button>' +
              '<button type="button" class="cart-upsell-arrow" data-upsell-next aria-label="Next"><i data-lucide="chevron-right" aria-hidden="true"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-upsell-viewport" data-upsell-viewport><div class="cart-upsell-track" data-upsell-track></div></div>' +
        '</section>' +
      '</div>' +
      '<footer class="drawer-footer">' +
        '<div class="drawer-subtotal"><span>Subtotal</span><span data-total>Rp 0</span></div>' +
        '<button class="button primary cart-checkout" type="button"><span class="button-label">Checkout</span><span class="button-icon"><i data-lucide="arrow-up-right" aria-hidden="true"></i></span></button>' +
        '<p class="cart-trust">Tax and shipping calculated at the next step</p>' +
      '</footer>' +
    '</aside>' +
    '<div class="toast" role="status" aria-live="polite"></div>';

  var EMPTY_HTML =
    '<div class="drawer-empty">' +
      '<div class="drawer-empty-logo" role="img" aria-label="IDL"><span class="del-base"></span><span class="del-red"></span><span class="del-cyan"></span></div>' +
      '<p class="drawer-empty-head">There&#39;s nothing in your cart</p>' +
    '</div>' +
    '<div class="drawer-empty-actions">' +
      '<a class="button primary drawer-empty-action" href="idl-merch-redesign-v2.html#team-kits"><span class="button-label">Shop by team</span><span class="button-icon"><i data-lucide="arrow-right" aria-hidden="true"></i></span></a>' +
      '<a class="button primary drawer-empty-action is-alt" href="idl-merch-redesign-v2.html#look-title"><span class="button-label">Shop city series</span><span class="button-icon"><i data-lucide="arrow-right" aria-hidden="true"></i></span></a>' +
    '</div>';

  function init() {
    // Inject the drawer once; skip if a page still ships it inline.
    if (!document.querySelector('.bag-drawer.cart-v2')) {
      var wrap = document.createElement('div');
      wrap.innerHTML = DRAWER_HTML;
      while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    }

    var body = document.body;
    var catalog = window.IDL_CATALOG || null;
    var currencyApi = window.IDLCurrency || null;

    var bagButton = document.querySelector('.bag-button');
    var bagDrawer = document.querySelector('.bag-drawer.cart-v2');
    var drawerScrim = document.querySelector('.drawer-scrim');
    var drawerItems = bagDrawer.querySelector('.drawer-items');
    var drawerTotal = bagDrawer.querySelector('[data-total]');
    var drawerFooter = bagDrawer.querySelector('.drawer-footer');
    var toast = document.querySelector('.toast');
    var shipEl = bagDrawer.querySelector('[data-ship]');
    var shipFill = bagDrawer.querySelector('[data-ship-fill]');
    var shipMsg = bagDrawer.querySelector('[data-ship-msg]');
    var upsellEl = bagDrawer.querySelector('[data-upsell]');
    var upsellTrack = bagDrawer.querySelector('[data-upsell-track]');
    var upsellViewport = bagDrawer.querySelector('[data-upsell-viewport]');
    var upsellArrows = bagDrawer.querySelector('[data-upsell-arrows]');
    var upsellPrev = bagDrawer.querySelector('[data-upsell-prev]');
    var upsellNext = bagDrawer.querySelector('[data-upsell-next]');

    var cart = [];
    var toastTimer;

    var currency = currencyApi ? currencyApi.normalizeCurrency(window.localStorage ? window.localStorage.getItem('idl-currency') : null) : 'IDR';
    function formatPrice(amount) {
      return currencyApi
        ? currencyApi.formatPrice(amount, currency)
        : 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(amount));
    }

    var refreshIcons = function () { if (window.lucide) window.lucide.createIcons(); };
    var cartQty = function () { return cart.reduce(function (n, i) { return n + i.qty; }, 0); };
    var cartSubtotal = function () { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); };
    var inStockSizes = function (p) { return p ? p.sizes.filter(function (s) { return p.out.indexOf(s) === -1; }) : []; };
    var shotSrc = function (key, variant) { return SHOP + key + (variant ? '-' + variant : '') + '.jpg'; };
    var currentProductKey = function () { return (window.IDL_CART_CONTEXT && window.IDL_CART_CONTEXT.productKey) || null; };

    function showToast(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
    }

    // Merge on key + size so a repeat add bumps the quantity.
    function addItem(item) {
      var existing = cart.find(function (i) { return i.key === item.key && i.size === (item.size || null); });
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + 1);
      else cart.push({ key: item.key, name: item.name, price: item.price, image: item.image, size: item.size || null, qty: 1 });
    }

    function cutMarkup(item) {
      var product = catalog && catalog.products[item.key];
      if (!product || !product.cut) return '';
      return '<span>Cut: ' + product.cut + '</span>';
    }

    function metaMarkup(item) {
      var product = catalog && catalog.products[item.key];
      var sizeLine = '<span>Size: ' + (item.size || (product ? product.sizes[0] : '')) + '</span>';
      return '<div class="drawer-item-meta">' + sizeLine + cutMarkup(item) + '</div>';
    }

    function renderShip() {
      if (!shipEl) return;
      var subtotal = cartSubtotal();
      if (!cart.length) { shipEl.hidden = true; return; }
      shipEl.hidden = false;
      var pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
      shipFill.style.width = pct + '%';
      if (subtotal >= FREE_SHIP_THRESHOLD) {
        shipEl.classList.add('is-met');
        shipMsg.textContent = "You've unlocked free shipping";
      } else {
        shipEl.classList.remove('is-met');
        shipMsg.textContent = formatPrice(FREE_SHIP_THRESHOLD - subtotal) + ' away from free shipping';
      }
    }

    function updateUpsellArrows() {
      if (!upsellViewport || !upsellArrows) return;
      var overflow = upsellViewport.scrollWidth - upsellViewport.clientWidth > 4;
      upsellArrows.hidden = !overflow;
      if (!overflow) return;
      var x = upsellViewport.scrollLeft;
      if (upsellPrev) upsellPrev.disabled = x <= 2;
      if (upsellNext) upsellNext.disabled = x >= upsellViewport.scrollWidth - upsellViewport.clientWidth - 2;
    }

    function renderUpsell() {
      if (!upsellEl || !catalog) { if (upsellEl) upsellEl.hidden = true; return; }
      if (!cart.length) { upsellEl.hidden = true; return; }
      var inCart = {};
      cart.forEach(function (i) { inCart[i.key] = true; });
      var productKey = currentProductKey();
      var current = productKey ? catalog.products[productKey] : null;
      var ranked = [current && current.pair]
        .concat(catalog.order.filter(function (k) { return catalog.products[k].group === (current && current.group); }))
        .concat(catalog.order);
      var seen = {};
      var picks = [];
      for (var i = 0; i < ranked.length; i++) {
        var k = ranked[i];
        if (!k || seen[k] || inCart[k] || k === productKey) continue;
        var p = catalog.products[k];
        if (!p || p.soldOut) continue;
        seen[k] = true;
        picks.push(k);
        if (picks.length >= 6) break;
      }
      if (!picks.length) { upsellEl.hidden = true; return; }
      upsellEl.hidden = false;
      upsellTrack.innerHTML = picks.map(function (k) {
        var p = catalog.products[k];
        var sizes = inStockSizes(p);
        var oneSize = p.sizes.length === 1;
        var metaLine = oneSize
          ? ''
          : '<div class="upsell-meta">Size: <span class="upsell-size"><select data-upsell-size aria-label="Size for ' + p.name + '">' + sizes.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') + '</select></span></div>';
        return '<div class="upsell-card" data-upsell-key="' + k + '">' +
            '<img src="' + shotSrc(k, 'studio') + '" alt="' + p.name + '" loading="lazy">' +
            '<div class="upsell-body">' +
              '<div class="upsell-top">' +
                '<p class="upsell-name">' + p.name + '</p>' +
                '<button type="button" class="upsell-add" data-upsell-add="' + k + '" aria-label="Add ' + p.name + '"><i data-lucide="plus" aria-hidden="true"></i></button>' +
              '</div>' +
              metaLine +
              '<p class="upsell-price">' + formatPrice(p.price) + '</p>' +
            '</div>' +
          '</div>';
      }).join('');
      upsellViewport.scrollLeft = 0;
      window.requestAnimationFrame(updateUpsellArrows);
    }

    function renderBag() {
      if (!drawerItems) return;
      var qty = cartQty();
      var slots = document.querySelectorAll('[data-count]');
      for (var i = 0; i < slots.length; i++) {
        slots[i].textContent = String(qty);
        slots[i].classList.toggle('has-items', cart.length > 0);
      }
      drawerTotal.textContent = formatPrice(cartSubtotal());
      if (drawerFooter) drawerFooter.hidden = !cart.length;
      if (!cart.length) {
        drawerItems.innerHTML = EMPTY_HTML;
        renderShip();
        renderUpsell();
        refreshIcons();
        return;
      }
      drawerItems.innerHTML = cart.map(function (item, index) {
        var dec = item.qty > 1
          ? '<button type="button" data-qty-dec aria-label="Decrease quantity"><i data-lucide="minus" aria-hidden="true"></i></button>'
          : '<button type="button" data-qty-dec aria-label="Remove ' + item.name + '"><i data-lucide="trash-2" aria-hidden="true"></i></button>';
        return '<article class="drawer-item" data-index="' + index + '">' +
            '<img class="drawer-item-thumb" src="' + item.image + '" alt="">' +
            '<div class="drawer-item-main">' +
              '<div class="drawer-item-top">' +
                '<h3>' + item.name + '</h3>' +
                '<span class="drawer-item-price">' + formatPrice(item.price * item.qty) + '</span>' +
              '</div>' +
              metaMarkup(item) +
              '<div class="qty-stepper">' + dec +
                '<span class="qty-value">' + item.qty + '</span>' +
                '<button type="button" data-qty-inc aria-label="Increase quantity"' + (item.qty >= MAX_QTY ? ' disabled' : '') + '><i data-lucide="plus" aria-hidden="true"></i></button>' +
              '</div>' +
            '</div>' +
          '</article>';
      }).join('');
      renderShip();
      renderUpsell();
      refreshIcons();
    }

    function setDrawer(open) {
      bagDrawer.classList.toggle('open', open);
      if (drawerScrim) drawerScrim.classList.toggle('open', open);
      bagDrawer.setAttribute('aria-hidden', String(!open));
      // Pages with other overlays (mobile menu, dialogs) that also lock
      // scroll expose window.IDL_SET_BODY_LOCK, which recomputes 'locked'
      // from every open overlay — a naive toggle() here would unlock the
      // page even while one of those others is still open. Looked up at
      // call time (not cached), so it works regardless of script order.
      if (typeof window.IDL_SET_BODY_LOCK === 'function') window.IDL_SET_BODY_LOCK();
      else body.classList.toggle('locked', open);
    }

    if (bagButton) bagButton.addEventListener('click', function () { setDrawer(true); });
    document.querySelectorAll('[data-close-drawer]').forEach(function (node) {
      node.addEventListener('click', function () { setDrawer(false); });
    });

    // One delegated listener: quantity/remove, upsell add, carousel arrows.
    bagDrawer.addEventListener('click', function (event) {
      var itemEl = event.target.closest('.drawer-item');
      if (event.target.closest('[data-qty-inc]') && itemEl) {
        var inc = cart[Number(itemEl.dataset.index)];
        if (inc && inc.qty < MAX_QTY) { inc.qty += 1; renderBag(); }
        return;
      }
      if (event.target.closest('[data-qty-dec]') && itemEl) {
        var index = Number(itemEl.dataset.index);
        var it = cart[index];
        if (!it) return;
        if (it.qty > 1) { it.qty -= 1; renderBag(); }
        else { var removed = cart.splice(index, 1)[0]; renderBag(); showToast(removed.name + ' removed'); }
        return;
      }
      var addButton = event.target.closest('[data-upsell-add]');
      if (addButton) {
        var key = addButton.dataset.upsellAdd;
        var product = catalog && catalog.products[key];
        if (!product) return;
        var select = addButton.closest('.upsell-card').querySelector('[data-upsell-size]');
        var size = select ? select.value : (inStockSizes(product)[0] || null);
        addItem({ key: key, name: product.name, price: product.price, image: shotSrc(key, 'studio'), size: size });
        renderBag();
        showToast(product.name + ' added');
        return;
      }
      if (!upsellViewport) return;
      var page = upsellViewport.clientWidth;
      if (event.target.closest('[data-upsell-prev]')) { upsellViewport.scrollBy({ left: -page, behavior: 'smooth' }); return; }
      if (event.target.closest('[data-upsell-next]')) { upsellViewport.scrollBy({ left: page, behavior: 'smooth' }); }
    });

    if (upsellViewport) upsellViewport.addEventListener('scroll', updateUpsellArrows, { passive: true });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && bagDrawer.classList.contains('open')) setDrawer(false);
    });

    document.addEventListener('idl:currencychange', function (e) {
      currency = e.detail.currency;
      renderBag();
    });

    // Public API — each page's add-to-cart buttons call into this.
    window.IDLCart = {
      add: function (item, opts) {
        opts = opts || {};
        if (!item || !item.key) return;
        addItem(item);
        renderBag();
        if (opts.toast) showToast(opts.toast);
        if (opts.open) setDrawer(true);
      },
      open: function () { setDrawer(true); },
      close: function () { setDrawer(false); },
      render: function () { renderBag(); },
      toast: function (message) { showToast(message); },
      count: function () { return cartQty(); },
      items: cart
    };

    refreshIcons();
    renderBag();

    // lucide.min.js loads with `defer`, so it hasn't necessarily parsed by
    // the time this (synchronous) script runs — the call above can be a
    // no-op. One follow-up pass once the document (and every deferred
    // script, per spec) is ready catches the drawer's own static icons in
    // that case; createIcons() is idempotent, so this is harmless if the
    // first call already worked.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', refreshIcons, { once: true });
    }
  }

  // Always runs synchronously, right when this <script> executes — not
  // deferred to DOMContentLoaded. document.body already exists by then (it's
  // available as soon as the parser opens the tag, even mid-parse), and every
  // page includes this script AFTER its .bag-button markup, so the drawer
  // and its click-wiring are ready before anything on the page could need
  // them. Deferring to DOMContentLoaded was the bug, not the fix: a page's
  // own inline <script> placed after this one runs synchronously too,
  // *before* DOMContentLoaded fires — it would call document.querySelector
  // ('.bag-drawer') and cache null, since the deferred init() hadn't injected
  // the drawer yet.
  init();
})();
