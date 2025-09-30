(function () {
  const el = document.getElementById("visitMsg");
  if (!el) return;

  const last = localStorage.getItem("last-visit");
  const now = Date.now();

  if (last) {
    const days = Math.floor((now - Number(last)) / (1000 * 60 * 60 * 24));
    el.textContent =
      days === 0 ? "Welcome back! You visited earlier today." :
      days === 1 ? "Welcome back! Last visit: yesterday." :
      `Welcome back! Last visit: ${days} days ago.`;
  } else {
    el.textContent = "Welcome! This is your first visit 🎉";
  }

  localStorage.setItem("last-visit", String(now));
})();
