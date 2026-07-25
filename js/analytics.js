const GOOGLE_ADS_ID = 'AW-18334818619';
const GOOGLE_ADS_LEAD_CONVERSION = 'AW-18334818619/c9M_CNCYwdYcELvC3KZE';
const CONSENT_KEY = 'lumisland_cookie_consent';
const LEAD_PENDING_KEY = 'lumisland_lead_pending';
const LEAD_PRODUCT_KEY = 'lumisland_lead_product';
const LEAD_RECORDED_KEY = 'lumisland_lead_recorded';

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

function applyConsent(value) {
  const granted = value === 'accepted' ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  });
  if (value === 'accepted') loadGoogleTag();
}

function buildConsentBanner() {
  if (localStorage.getItem(CONSENT_KEY)) return;
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Preferências de cookies');
  banner.innerHTML = `
    <div>
      <strong>Cookies e medição</strong>
      <p>Usamos Google Ads/Google Tag para medir contactos e melhorar campanhas. A medição só é carregada depois da sua aceitação.</p>
      <a href="cookies.html">Saber mais</a>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-secondary" data-consent="rejected">Recusar</button>
      <button type="button" class="cookie-primary" data-consent="accepted">Aceitar</button>
    </div>`;

  banner.querySelectorAll('[data-consent]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.consent;
      localStorage.setItem(CONSENT_KEY, value);
      applyConsent(value);
      if (value === 'accepted') trackConfirmedLead();
      banner.remove();
    });
  });
  document.body.appendChild(banner);
}

function trackContactFunnel() {
  const form = document.getElementById('contact-form');

  document.querySelectorAll('a[href="#contacto"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('contact_cta_click', {
        content_name: link.dataset.product || link.textContent.trim().slice(0, 80),
      });
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
