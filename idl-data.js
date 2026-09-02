/* IDL data provider — the SINGLE access point to product data.

   Purpose: every module (cart, size guide, fit finder, and the page render code)
   should read product data through window.IDL, never by reaching into
   window.IDL_CATALOG directly. Today this provider is a thin wrapper over the
   static catalog in product-catalog.js.

   Shopify migration: this file is the ONE thing that gets rewritten. Point the
   methods below at a Liquid-rendered blob (e.g. window.IDL_PRODUCT / a JSON
   <script>) or the Shopify AJAX APIs, and every consumer keeps working unchanged.

   Load order: after product-catalog.js, before any consumer. Consumers still
   fall back to window.IDL_CATALOG if this file is absent, so it is additive. */
(function () {
  'use strict';

  function catalog() { return window.IDL_CATALOG || null; }

  // The product being viewed: the selected cut button carries the switched-to
  // key, otherwise the URL's ?product=. (In Shopify: the current product handle.)
  function currentKey() {
    var picked = document.querySelector('.pdp-cut.is-selected');
    if (picked && picked.dataset.cutKey) return picked.dataset.cutKey;
    try { return new URLSearchParams(window.location.search).get('product'); }
    catch (e) { return null; }
  }

  function product(key) {
    var c = catalog();
    return (c && c.products && key) ? (c.products[key] || null) : null;
  }

  function group(key) {
    var c = catalog();
    return (c && c.groups && key) ? (c.groups[key] || null) : null;
  }

  function order() {
    var c = catalog();
    return (c && c.order) ? c.order : [];
  }

  function currentProduct() { return product(currentKey()); }

  // ---- inventory (Shopify: variant.available) ----------------------------
  // Today reads the prototype's hard-coded arrays; in Shopify, point these at
  // variant availability and DELETE the out[] / soldOut fields from the data.
  function soldOut(key) {
    var p = product(key);
    return !!(p && p.soldOut);
  }
  function available(key, size) {
    var p = product(key);
    if (!p) return false;
    if (p.soldOut) return false;
    if (size == null) return true;
    return !(p.out && p.out.indexOf(size) !== -1);
  }

  // ---- variants + checkout (Shopify: per-size variant IDs) ---------------
  var SHOP_ORIGIN = 'https://shop.idl.pro';

  // The per-size Shopify variant ID. The prototype only carries ONE id per
  // product (in the `shop` URL), so without a `variants` map this returns that
  // id for every size — WRONG SIZE at checkout until Shopify supplies the map
  // (product.variants = { "M": <id>, ... }). See SHOPIFY-METAFIELDS.md.
  function variantId(key, size) {
    var p = product(key);
    if (!p) return null;
    if (p.variants && size != null && p.variants[size] != null) return String(p.variants[size]);
    if (p.shop) {
      var m = /[?&]variant=(\d+)/.exec(p.shop);
      if (m) return m[1];
    }
    return null;
  }

  // A real Shopify cart permalink from cart items [{key,size,qty}] →
  // https://shop.idl.pro/cart/<variant>:<qty>,<variant>:<qty>
  function checkoutUrl(items) {
    var parts = [];
    (items || []).forEach(function (it) {
      var id = variantId(it.key, it.size);
      if (id) parts.push(id + ':' + (it.qty || 1));
    });
    return parts.length ? SHOP_ORIGIN + '/cart/' + parts.join(',') : null;
  }

  window.IDL = window.IDL || {};
  window.IDL.catalog = catalog;
  window.IDL.currentKey = currentKey;
  window.IDL.product = product;
  window.IDL.group = group;
  window.IDL.order = order;
  window.IDL.currentProduct = currentProduct;
  window.IDL.soldOut = soldOut;
  window.IDL.available = available;
  window.IDL.variantId = variantId;
  window.IDL.checkoutUrl = checkoutUrl;
  window.IDL.shopOrigin = SHOP_ORIGIN;
})();
