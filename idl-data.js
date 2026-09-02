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

  window.IDL = window.IDL || {};
  window.IDL.catalog = catalog;
  window.IDL.currentKey = currentKey;
  window.IDL.product = product;
  window.IDL.group = group;
  window.IDL.order = order;
  window.IDL.currentProduct = currentProduct;
})();
