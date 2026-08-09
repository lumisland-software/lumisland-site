const GOOGLE_ADS_ID = 'AW-18334818619';
const GOOGLE_ADS_LEAD_CONVERSION = 'AW-18334818619/c9M_CNCYwdYcELvC3KZE';
const META_PIXEL_ID = '1837189070989213';
const CONSENT_KEY = 'lumisland_cookie_consent';
const LEAD_PENDING_KEY = 'lumisland_lead_pending';
const LEAD_PRODUCT_KEY = 'lumisland_lead_product';
const LEAD_RECORDED_KEY = 'lumisland_lead_recorded';

const CONSENT_COPY = {
  pt: {
    label: 'Preferências de cookies',
    title: 'Cookies e medição',
    description: 'Usamos Google Ads e Meta Pixel para medir contactos e melhorar campanhas. A medição só é carregada depois da sua aceitação.',
    learnMore: 'Saber mais',
    reject: 'Recusar',
    accept: 'Aceitar',
  },
  en: {
    label: 'Cookie preferences',
    title: 'Cookies and measurement',
    description: 'We use Google Ads and Meta Pixel to measure enquiries and improve campaigns. Measurement only loads after you give consent.',
    learnMore: 'Learn more',
    reject: 'Reject',
    accept: 'Accept',
  },
  es: {
    label: 'Preferencias de cookies',
    title: 'Cookies y medición',
    description: 'Utilizamos Google Ads y Meta Pixel para medir contactos y mejorar las campañas. La medición solo se carga después de que dé su consentimiento.',
    learnMore: 'Más información',
    reject: 'Rechazar',
    accept: 'Aceptar',
  },
  fr: {
    label: 'Préférences relatives aux cookies',
    title: 'Cookies et mesure',
    description: 'Nous utilisons Google Ads et Meta Pixel pour mesurer les demandes et améliorer les campagnes. La mesure ne se charge qu’après votre consentement.',
    learnMore: 'En savoir plus',
    reject: 'Refuser',
    accept: 'Accepter',
  },
  de: {
    label: 'Cookie-Einstellungen',
    title: 'Cookies und Erfolgsmessung',
    description: 'Wir verwenden Google Ads und Meta Pixel, um Anfragen zu messen und Kampagnen zu verbessern. Die Messung wird erst nach Ihrer Einwilligung geladen.',
    learnMore: 'Mehr erfahren',
    reject: 'Ablehnen',
    accept: 'Akzeptieren',
  },
  it: {
    label: 'Preferenze sui cookie',
    title: 'Cookie e misurazione',
    description: 'Utilizziamo Google Ads e Meta Pixel per misurare i contatti e migliorare le campagne. La misurazione viene caricata solo dopo il consenso.',
    learnMore: 'Scopri di più',
    reject: 'Rifiuta',
    accept: 'Accetta',
  },
};

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

function trackEvent(eventName, parameters = {}) {
  gtag('event', eventName, {
    ...parameters,
    transport_type: 'beacon',
  });
}

function trackMetaEvent(eventName, parameters = {}) {
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, parameters);
}

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});

function loadGoogleTag() {
  if (document.querySelector(`script[src*="${GOOGLE_ADS_ID}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);
  gtag('js', new Date());
  gtag('config', GOOGLE_ADS_ID);
}

function loadMetaPixel() {
  if (document.querySelector('script[data-meta-pixel]')) return;

  window.fbq = window.fbq || function fbq() {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.dataset.metaPixel = META_PIXEL_ID;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
}

function applyConsent(value) {
  const granted = value === 'accepted' ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  });
  if (value === 'accepted') {
    loadGoogleTag();
    loadMetaPixel();
  }
}

function consentLocale() {
  const pageLocale = document.documentElement.lang?.toLowerCase().split('-')[0];
  return CONSENT_COPY[pageLocale] ? pageLocale : 'pt';
}

function updateConsentBannerCopy(banner) {
  const copy = CONSENT_COPY[consentLocale()];
  banner.setAttribute('aria-label', copy.label);
  banner.querySelector('[data-consent-title]').textContent = copy.title;
  banner.querySelector('[data-consent-description]').textContent = copy.description;
  banner.querySelector('[data-consent-learn-more]').textContent = copy.learnMore;
  banner.querySelector('[data-consent="rejected"]').textContent = copy.reject;
  banner.querySelector('[data-consent="accepted"]').textContent = copy.accept;
}

function buildConsentBanner() {
  if (localStorage.getItem(CONSENT_KEY)) return;
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div>
      <strong data-consent-title></strong>
      <p data-consent-description></p>
      <a href="/cookies.html" data-consent-learn-more></a>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-secondary" data-consent="rejected"></button>
      <button type="button" class="cookie-primary" data-consent="accepted"></button>
    </div>`;

  updateConsentBannerCopy(banner);
  const localeObserver = new MutationObserver(() => updateConsentBannerCopy(banner));
  localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  banner.querySelectorAll('[data-consent]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.consent;
      localStorage.setItem(CONSENT_KEY, value);
      applyConsent(value);
      if (value === 'accepted') trackConfirmedLead();
      localeObserver.disconnect();
      banner.remove();
    });
  });
  document.body.appendChild(banner);
}

function trackContactFunnel() {
  const form = document.getElementById('contact-form');

  document.querySelectorAll('a[data-product]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('product_cta_click', {
        content_name: link.dataset.product.slice(0, 80),
        destination_host: new URL(link.href, window.location.href).host,
      });
    });
  });

  document.querySelectorAll('a[href="#contacto"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('contact_cta_click', {
        content_name: link.dataset.product || link.textContent.trim().slice(0, 80),
      });
    });
  });

  document.querySelectorAll('a[href*="wa.me/"], a[href*="whatsapp.com/"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('contact_whatsapp_click', {
        contact_method: 'whatsapp',
        link_url: link.getAttribute('href'),
      });
      trackMetaEvent('Contact', { content_name: 'WhatsApp' });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('contact_email_click', {
        contact_method: 'email',
        link_url: link.getAttribute('href'),
      });
    });
  });

  if (!form) return;

  let formStarted = false;
  form.addEventListener('input', () => {
    if (formStarted) return;
    formStarted = true;
    trackEvent('form_start', { form_id: form.id });
  }, { once: true });

  form.addEventListener('submit', () => {
    const product = document.getElementById('produto')?.value || 'Ainda não sei';
    sessionStorage.setItem(LEAD_PENDING_KEY, 'true');
    sessionStorage.setItem(LEAD_PRODUCT_KEY, product);
    sessionStorage.removeItem(LEAD_RECORDED_KEY);
    trackEvent('lead_form_submit', {
      form_id: form.id,
      product,
    });
  });
}

function trackConfirmedLead() {
  if (!document.body.classList.contains('thanks-page')) return;
  if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;
  if (sessionStorage.getItem(LEAD_PENDING_KEY) !== 'true') return;
  if (sessionStorage.getItem(LEAD_RECORDED_KEY) === 'true') return;

  const product = sessionStorage.getItem(LEAD_PRODUCT_KEY) || 'Não indicado';
  trackEvent('conversion', {
    send_to: GOOGLE_ADS_LEAD_CONVERSION,
  });
  trackEvent('generate_lead', {
    product,
  });
  trackMetaEvent('Lead', {
    content_name: product,
  });

  sessionStorage.setItem(LEAD_RECORDED_KEY, 'true');
  sessionStorage.removeItem(LEAD_PENDING_KEY);
  sessionStorage.removeItem(LEAD_PRODUCT_KEY);
}

const savedConsent = localStorage.getItem(CONSENT_KEY);
if (savedConsent) applyConsent(savedConsent);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    buildConsentBanner();
    trackContactFunnel();
    trackConfirmedLead();
  });
} else {
  buildConsentBanner();
  trackContactFunnel();
  trackConfirmedLead();
}
