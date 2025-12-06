// js/loader.js

$(function () {
  // 1. Theme SOFORT setzen (bevor Header lädt), damit die Seite nicht flackert
  applySavedTheme();

  // 2. Header laden
  $("header").load("components/header.html", function () {
    // Diese Funktionen erst starten, wenn das HTML da ist:
    initHeader(); 
    initThemeListeners(); // <-- Hier den Button aktivieren
  });

  // 3. Footer laden
  $("footer").load("components/footer.html");
});

/* --- FUNKTIONEN --- */

function applySavedTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    html.setAttribute('data-theme', 'dark');
  }
}

function initThemeListeners() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  if (toggleBtn) {
    // Status des Buttons initial setzen (optional, falls Icon wechseln soll)
    // z.B. toggleBtn.checked = html.getAttribute('data-theme') === 'dark';

    toggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  } else {
    console.warn("Theme-Toggle Button nicht gefunden (vielleicht ID im HTML prüfen?)");
  }
}

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
  
  // Event Delegation für Links im Menü (besser als direkt auf nav)
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Zustand zurücksetzen bei Resize
  const mq = window.matchMedia('(min-width: 769px)');
  const handle = (e) => { if (e.matches) closeMenu(); }; // e.matches ist sicherer
  mq.addEventListener('change', handle);
}