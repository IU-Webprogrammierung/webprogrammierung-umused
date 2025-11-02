// js/loader.js
$(function () {
  // Header laden
  $("header").load("components/header.html", function () {
    initHeader(); // <-- Menü aktivieren, wenn Header fertig geladen ist
  });

  // Footer laden (optional, keine Extra-Init nötig)
  $("footer").load("components/footer.html");
});

// Hamburger / Off-Canvas-Logik
function initHeader() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mainnav');
  const backdrop = document.querySelector('.backdrop');

  if (!btn || !nav || !backdrop) return;

  const openMenu = () => {
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
  };

  const toggleMenu = () => {
    document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
  };

  btn.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Zustand zurücksetzen, wenn wieder größer
  const mq = window.matchMedia('(min-width: 769px)');
  const handle = () => { if (mq.matches) closeMenu(); };
  mq.addEventListener ? mq.addEventListener('change', handle) : mq.addListener(handle);
}
