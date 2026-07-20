const GOOGLE_ADS_ID = 'AW-18334818619';
const CONSENT_KEY = 'lumisland_cookie_consent';

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
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
      banner.remove();
    });
  });
  document.body.appendChild(banner);
}

const savedConsent = localStorage.getItem(CONSENT_KEY);
if (savedConsent) applyConsent(savedConsent);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildConsentBanner);
} else {
  buildConsentBanner();
}
