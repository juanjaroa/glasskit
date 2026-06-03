const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector("header");

menuToggle.addEventListener("click", () => {
  header.classList.toggle("menu-open");
  menuToggle.classList.toggle("icon-xmark");
});

