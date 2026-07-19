const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const productLinks = document.querySelectorAll("[data-product]");

function setSelectedProduct(product) {
  const select = document.getElementById("produto");
  if (!select || !product) return;

  const option = Array.from(select.options).find((item) => item.value === product);
  if (option) select.value = product;
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
