document.documentElement.classList.remove('no-js');
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
  const setMenuOpen = (open, restoreFocus = false) => {
    siteNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (!open) siteNav.querySelectorAll('.nav-dropdown[open]').forEach(item => item.removeAttribute('open'));
    if (restoreFocus) navToggle.focus();
  };
  navToggle.addEventListener('click', () => {
    setMenuOpen(!siteNav.classList.contains('is-open'));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) setMenuOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) setMenuOpen(false);
  });
  siteNav.addEventListener('focusout', event => {
    if (event.relatedTarget && !siteNav.contains(event.relatedTarget) && !navToggle.contains(event.relatedTarget)) setMenuOpen(false);
  });
  matchMedia('(min-width: 1001px)').addEventListener('change', () => setMenuOpen(false));
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
  let submitting = false;
  contactForm.noValidate = true;
  const fields = [...contactForm.querySelectorAll('input:not([type="hidden"]):not(.hidden-field), textarea, select')];
  let status = contactForm.querySelector('.form-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'form-status form-full';
    status.setAttribute('role', 'status');
    contactForm.append(status);
  }
  function validateField(field, index) {
    const errorId = `field-error-${index}`;
    let error = document.getElementById(errorId);
    const missing = field.required && (field.type === 'checkbox' ? !field.checked : !field.value.trim());
    const invalid = missing || !field.validity.valid;
    field.setAttribute('aria-invalid', String(invalid));
    if (invalid) {
      if (!error) {
        error = document.createElement('span');
        error.className = 'field-error';
        error.id = errorId;
        field.closest('label')?.append(error);
      }
      error.textContent = field.type === 'checkbox' ? 'Confirme que leu a política para enviar o pedido.' : missing ? 'Preencha este campo para continuar.' : 'Indique um endereço de e-mail válido, como nome@empresa.pt.';
      const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      describedBy.add(errorId);
      field.setAttribute('aria-describedby', [...describedBy].join(' '));
    } else if (error) {
      error.remove();
      const describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errorId);
      if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
      else field.removeAttribute('aria-describedby');
    }
    return !invalid;
  }
  fields.forEach((field, index) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field, index);
    });
    if (field.tagName === 'TEXTAREA') {
      field.addEventListener('input', () => {
        field.style.height = 'auto';
        field.style.height = `${field.scrollHeight + 2}px`;
      });
    }
  });

  contactForm.addEventListener('submit', (event) => {
    if (submitting) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    const results = fields.map(validateField);
    if (results.includes(false)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      status.textContent = 'Verifique os campos assinalados. Os seus dados foram mantidos.';
      fields[results.indexOf(false)].focus();
      return;
    }
    if (!submitButton) return;
    submitting = true;
    status.textContent = 'A encaminhar o pedido para envio…';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.style.minWidth = `${submitButton.getBoundingClientRect().width}px`;
    submitButton.innerHTML = 'A enviar…';
  }, { capture: true });

  window.addEventListener('pageshow', () => {
    if (!submitButton || !originalButtonContent) return;
    submitting = false;
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    submitButton.style.removeProperty('min-width');
    submitButton.innerHTML = originalButtonContent;
    status.textContent = '';
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
