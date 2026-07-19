const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.getElementById("contact-form");
const productLinks = document.querySelectorAll("[data-product]");

function setSelectedProduct(product) {
  const select = document.getElementById("produto");
  if (!select || !product) return;

  const option = Array.from(select.options).find((item) => item.value === product);
  if (option) select.value = product;
}

function buildMailto(formData) {
  const nome = formData.get("nome") || "";
  const empresa = formData.get("empresa") || "-";
  const email = formData.get("email") || "";
  const telefone = formData.get("telefone") || "-";
  const produto = formData.get("produto") || "Ainda nao sei";
  const mensagem = formData.get("mensagem") || "-";

  const subject = encodeURIComponent(`Contacto via site Lumisland - ${nome}`);
  const body = encodeURIComponent(
    `Nome: ${nome}\n` +
    `Empresa: ${empresa}\n` +
    `E-mail: ${email}\n` +
    `Telefone: ${telefone}\n` +
    `Interesse: ${produto}\n\n` +
    `Mensagem:\n${mensagem}`
  );

  return `mailto:contacto@lumisland.pt?subject=${subject}&body=${body}`;
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

productLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setSelectedProduct(link.dataset.product);
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    const formData = new FormData(contactForm);

    if (status) {
      status.textContent = "A abrir o teu e-mail com a mensagem preenchida.";
    }

    window.location.href = buildMailto(formData);
  });
}
