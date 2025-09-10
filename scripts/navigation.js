// Accessible hamburger menu (mobile)
const btn = document.querySelector('#menu');
const nav = document.querySelector('#site-nav');

btn?.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  nav.hidden = open;
});
