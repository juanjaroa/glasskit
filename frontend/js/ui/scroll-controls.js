const scrollNextButton = document.querySelector(".scroll-next");
const scrollPrevButton = document.querySelector(".scroll-prev");
let viewportMainContent = document.querySelector("main > .content-wrapper");

scrollNextButton.addEventListener("click", () => {
  console.log("Scroll next clicked");
  if (!viewportMainContent) {
    viewportMainContent = document.querySelector("main > .content-wrapper");
  }

  if (!viewportMainContent) return;

  viewportMainContent.scrollBy({
    top: viewportMainContent.clientHeight - 66,
    behavior: "smooth",
  });
});

scrollPrevButton.addEventListener("click", () => {
  if (!viewportMainContent) {
    viewportMainContent = document.querySelector("main > .content-wrapper");
  }

  if (!viewportMainContent) return;

  viewportMainContent.scrollBy({
    top: -viewportMainContent.clientHeight + 66,
    behavior: "smooth",
  });
});
