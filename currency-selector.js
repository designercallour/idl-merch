(function currencySelectorModule(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) root.IDLCurrency = api;
})(typeof window !== 'undefined' ? window : globalThis, function createCurrencySelector(root) {
  const supportedCurrencies = ['IDR', 'USD', 'EUR'];
  const rates = { IDR: 1, USD: 1 / 16000, EUR: 1 / 17500 };

  function normalizeCurrency(value) {
    const currency = String(value || '').toUpperCase();
    return supportedCurrencies.includes(currency) ? currency : 'IDR';
  }

  function formatPrice(idrValue, currencyValue) {
    const currency = normalizeCurrency(currencyValue);
    const value = Number(idrValue) * rates[currency];

    if (currency === 'IDR') {
      return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
    }

    const symbol = currency === 'USD' ? '$' : '€';
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  }

  function initCurrencySelector(doc = root.document) {
    if (!doc) return null;
    // Header and footer each carry a control; they share one currency value.
    const controls = Array.from(doc.querySelectorAll('[data-currency-control]'));
    if (!controls.length) return null;

    const storage = root.localStorage;
    let current = normalizeCurrency(storage?.getItem('idl-currency'));

    const widgets = controls.map(control => ({
      control,
      toggle: control.querySelector('[data-currency-toggle]'),
      label: control.querySelector('[data-currency-label]'),
      menu: control.querySelector('[data-currency-menu]'),
      options: Array.from(control.querySelectorAll('[data-currency-option]')),
    }));

    function closeMenu() {
      widgets.forEach(widget => {
        widget.menu.hidden = true;
        widget.toggle.setAttribute('aria-expanded', 'false');
        widget.control.classList.remove('is-open');
      });
    }

    function applyCurrency(currencyValue, persist = true) {
      current = normalizeCurrency(currencyValue);
      widgets.forEach(widget => {
        widget.label.textContent = current;
        widget.options.forEach(option => {
          const active = option.dataset.currencyOption === current;
          option.classList.toggle('is-active', active);
          option.setAttribute('aria-checked', String(active));
        });
      });

      doc.querySelectorAll('.official-product-card').forEach(card => {
        const amount = card.querySelector('[data-price]')?.dataset.price;
        const price = card.querySelector('.kit-showcase-price span');
        if (amount && price) price.textContent = formatPrice(amount, current);
      });

      if (persist) storage?.setItem('idl-currency', current);
      doc.dispatchEvent(new root.CustomEvent('idl:currencychange', {
        detail: { currency: current },
      }));
      closeMenu();
    }

    widgets.forEach(widget => {
      widget.toggle.addEventListener('click', () => {
        const willOpen = widget.menu.hidden;
        closeMenu();
        if (!willOpen) return;
        widget.menu.hidden = false;
        widget.toggle.setAttribute('aria-expanded', 'true');
        widget.control.classList.add('is-open');
        widget.options.find(option => option.dataset.currencyOption === current)?.focus();
      });

      widget.options.forEach(option => option.addEventListener('click', () => {
        applyCurrency(option.dataset.currencyOption);
        widget.toggle.focus();
      }));
    });

    doc.addEventListener('click', event => {
      if (!widgets.some(widget => widget.control.contains(event.target))) closeMenu();
    });
    doc.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const open = widgets.find(widget => !widget.menu.hidden);
      if (!open) return;
      closeMenu();
      open.toggle.focus();
    });

    applyCurrency(current, false);
    return {
      applyCurrency,
      getCurrency: () => current,
      closeMenu,
    };
  }

  if (root.document) {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', () => initCurrencySelector());
    } else {
      initCurrencySelector();
    }
  }

  return { formatPrice, initCurrencySelector, normalizeCurrency };
});
