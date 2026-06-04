const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector("header");
const navLinks = document.querySelectorAll("nav a");
const themeToggle = document.getElementById("theme-toggle");

menuToggle.addEventListener("click", () => {
  header.classList.toggle("menu-open");
  menuToggle.classList.toggle("icon-xmark");
});

function closeMenu() {
  header.classList.remove("menu-open");
  menuToggle.classList.remove("icon-xmark");
}

navLinks.forEach(link => {
  link.addEventListener("click", closeMenu);
});

themeToggle.addEventListener("change", closeMenu);