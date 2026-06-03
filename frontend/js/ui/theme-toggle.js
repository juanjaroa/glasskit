const toggle = document.getElementById("theme-toggle");

function applyTheme() {
  document.documentElement.classList.toggle("dark", toggle.checked);
}

function animateGlass() {
  document.querySelectorAll(".glass").forEach((el) => {
    el.classList.remove("jump");
    void el.offsetWidth;
    el.classList.add("jump");
  });
}

toggle.addEventListener("change", () => {
  const run = () => {
    applyTheme();
    animateGlass();
  };
  if (!document.startViewTransition) {
    run();
  } else {
    document.startViewTransition(run);
  }
});
applyTheme();
