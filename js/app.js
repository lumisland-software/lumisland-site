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

  return `mailto:contato.lumisland@gmail.com?subject=${subject}&body=${body}`;
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

const adminForm = document.getElementById("admin-form");

if (adminForm) {
  const fields = ["headline", "subheadline", "primaryCta", "email"];
  const preview = document.getElementById("admin-preview");
  const exportButton = document.getElementById("export-content");
  const resetButton = document.getElementById("reset-content");
  const storageKey = "lumisland-content";

  function getAdminData() {
    return fields.reduce((acc, field) => {
      acc[field] = document.getElementById(field).value.trim();
      return acc;
    }, {});
  }

  function renderPreview(data) {
    if (!preview) return;
    preview.innerHTML = `
      <p class="eyebrow">Pre-visualizacao</p>
      <h2>${data.headline || "Titulo principal"}</h2>
      <p>${data.subheadline || "Texto de apoio"}</p>
      <p><strong>CTA:</strong> ${data.primaryCta || "Botao principal"}</p>
      <p><strong>E-mail:</strong> ${data.email || "email@exemplo.com"}</p>
    `;
  }

  function saveData() {
    const data = getAdminData();
    localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
    renderPreview(data);
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      fields.forEach((field) => {
        if (data[field]) document.getElementById(field).value = data[field];
      });
      renderPreview(data);
    } catch {
      localStorage.removeItem(storageKey);
    }
  } else {
    renderPreview(getAdminData());
  }

  adminForm.addEventListener("input", saveData);

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(getAdminData(), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lumisland-content.json";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      window.location.reload();
    });
  }
}
