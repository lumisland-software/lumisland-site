const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const productLinks = document.querySelectorAll('[data-product]');
const contactForm = document.getElementById('contact-form');

function setSelectedProduct(product) {
  const select = document.getElementById('produto');
  if (!select || !product) return;
  const option = Array.from(select.options).find((item) => item.value === product);
  if (option) select.value = product;
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

productLinks.forEach((link) => {
  link.addEventListener('click', () => setSelectedProduct(link.dataset.product));
});

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton?.innerHTML;

  contactForm.addEventListener('submit', () => {
    if (!submitButton) return;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = 'A enviar…';
  });

  window.addEventListener('pageshow', () => {
    if (!submitButton || !originalButtonContent) return;
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    submitButton.innerHTML = originalButtonContent;
  });
}
