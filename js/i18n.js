/* Site-wide locale owner. Public copy only; never translates user input or contracts. */
(() => {
  'use strict';
  const locales = ['pt-PT', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'];
  const names = ['Português', 'English', 'Español', 'Français', 'Deutsch', 'Italiano'];
  const version = '20260925-2';
  const sourceLocale = 'pt-PT';
  const key = 'lumisland_locale';
  const normalize = value => value.trim().replace(/\s+/g, ' ');
  const ignored = 'script,style,noscript,textarea,[translate="no"],.cookie-banner';
  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const linkSources = new WeakMap();
  const cache = new Map([[sourceLocale, {}]]);
  let locale = sourceLocale;
  let dictionary = {};
  let request = 0;
  let controller;
  let pendingLocale = null;
  let scheduled = false;
  const savedLocale = (() => {
    try { return localStorage.getItem(key) || localStorage.getItem('tvde_site_locale'); }
    catch { return null; }
  })();

  const box = document.createElement('div');
  box.className = 'site-language';
  box.setAttribute('translate', 'no');
  const select = document.createElement('select');
  select.id = 'site-locale';
  select.setAttribute('aria-label', 'Idioma');
  locales.forEach((value, index) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = names[index];
    option.lang = value;
    select.append(option);
  });
  const status = document.createElement('span');
  status.className = 'locale-status';
  status.setAttribute('role', 'status');
  box.append(select, status);
  const header = document.querySelector('.header-inner');
  if (header) header.append(box);
  else {
    box.classList.add('standalone-language');
    document.body.prepend(box);
  }

  function translate(value) { return dictionary[normalize(value)] ?? value; }
  function translateValue(current, record) {
    if (!record || current !== record.rendered) record = { source: current, rendered: current };
    const translated = dictionary[normalize(record.source)];
    record.rendered = translated === undefined ? record.source : record.source.replace(/\S[\s\S]*\S|\S/, translated);
    return record;
  }
  function apply() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement || node.parentElement.closest(ignored) || !node.nodeValue.trim()) continue;
      const record = translateValue(node.nodeValue, textRecords.get(node));
      textRecords.set(node, record);
      if (node.nodeValue !== record.rendered) node.nodeValue = record.rendered;
    }
    document.querySelectorAll('[aria-label],[title],[placeholder],[alt],meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(element => {
      if (element.closest(ignored)) return;
      const records = attributeRecords.get(element) || {};
      const keys = element.tagName === 'META' ? ['content'] : attributes;
      keys.forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        const record = translateValue(element.getAttribute(attribute), records[attribute]);
        records[attribute] = record;
        if (element.getAttribute(attribute) !== record.rendered) element.setAttribute(attribute, record.rendered);
      });
      attributeRecords.set(element, records);
    });
    document.querySelectorAll('a[href]').forEach(link => {
      if (!linkSources.has(link)) linkSources.set(link, link.getAttribute('href'));
      const source = linkSources.get(link);
      const url = new URL(source, location.href);
      const field = url.hostname === 'wa.me' ? 'text' : url.protocol === 'mailto:' ? 'subject' : null;
      if (!field || !url.searchParams.has(field)) return;
      const value = translate(url.searchParams.get(field));
      if (locale === sourceLocale) link.setAttribute('href', source);
      else { url.searchParams.set(field, value); link.setAttribute('href', url.href); }
    });
    if (document.documentElement.lang !== locale) document.documentElement.lang = locale;
    select.value = pendingLocale || locale;
    select.setAttribute('aria-label', translate('Idioma'));
    observe();
  }

  // External DOM updates (validation, menu labels, animation state) retain their source.
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; apply(); });
  });
  function observe() {
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
  }
  async function changeLocale(next) {
    if (!locales.includes(next)) return;
    const sequence = ++request;
    controller?.abort();
    controller = new AbortController();
    pendingLocale = next;
    select.value = next;
    select.setAttribute('aria-busy', 'true');
    status.textContent = translate('A carregar idioma…');
    status.classList.remove('is-error');
    try {
      if (!cache.has(next)) {
        const response = await fetch(`/locales/${next}.json?v=${version}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Locale unavailable');
        const data = await response.json();
        if (!data || typeof data !== 'object' || Array.isArray(data) || Object.values(data).some(value => typeof value !== 'string')) throw new Error('Invalid locale');
        cache.set(next, data);
      }
      if (sequence !== request) return;
      locale = next;
      dictionary = cache.get(next);
      pendingLocale = null;
      apply();
      try { localStorage.setItem(key, locale); } catch { /* Usable for this page when storage is disabled. */ }
      status.textContent = '';
      window.dispatchEvent(new CustomEvent('lumisland:locale', { detail: locale }));
    } catch (error) {
      if (sequence !== request || error.name === 'AbortError') return;
      pendingLocale = null;
      select.value = locale;
      status.textContent = translate('Não foi possível mudar o idioma. Tente novamente.');
      status.classList.add('is-error');
    } finally {
      if (sequence === request) select.removeAttribute('aria-busy');
    }
  }
  select.addEventListener('change', () => changeLocale(select.value));
  window.addEventListener('storage', event => { if (event.key === key && locales.includes(event.newValue)) changeLocale(event.newValue); });
  observe();
  if (locales.includes(savedLocale) && savedLocale !== sourceLocale) changeLocale(savedLocale);
})();
