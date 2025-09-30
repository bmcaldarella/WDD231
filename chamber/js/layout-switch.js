const discoverEl = document.querySelector("#discover");
const switcher = document.querySelector(".layout-switch");

if (discoverEl && switcher) {
  switcher.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-layout]");
    if (!btn) return;
    discoverEl.classList.remove("layout-a", "layout-b", "layout-c");
    discoverEl.classList.add(btn.dataset.layout);
  });
}
