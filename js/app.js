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
      siteNav.querySelectorAll('.nav-dropdown[open]').forEach((dropdown) => {
        dropdown.removeAttribute('open');
      });
    });
  });
}

document.addEventListener('click', (event) => {
  document.querySelectorAll('.nav-dropdown[open]').forEach((dropdown) => {
    if (!dropdown.contains(event.target)) dropdown.removeAttribute('open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.nav-dropdown[open]').forEach((dropdown) => {
    dropdown.removeAttribute('open');
    dropdown.querySelector('summary')?.focus();
  });
});

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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteHeader = document.querySelector('.site-header');

function updateHeaderDepth() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeaderDepth();
window.addEventListener('scroll', updateHeaderDepth, { passive: true });

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealTargets = document.querySelectorAll('main > section:not(:first-child), main article, .showcase-image, .product-preview, .tvde-preview, .aurea-preview, .founder-card');
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${(index % 5) * 55}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  revealTargets.forEach((element) => revealObserver.observe(element));

  document.querySelectorAll('[data-tilt]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      element.style.setProperty('--tilt-x', `${(-y * 2.4).toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${(x * 2.4).toFixed(2)}deg`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
    });
  });
}
