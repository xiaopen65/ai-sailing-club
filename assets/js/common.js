(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0C0C0D' : '#F3F3ED');
    $$('[data-theme-set]').forEach(function (btn) {
      var on = btn.getAttribute('data-theme-set') === theme;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function initTheme() {
    var saved;
    try { saved = localStorage.getItem('sp-case-theme'); } catch (e) {}
    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(dark ? 'dark' : 'light');

    $$('[data-theme-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-theme-set');
        applyTheme(next);
        try { localStorage.setItem('sp-case-theme', next); } catch (e) {}
      });
    });
  }

  /* ---------- settings ---------- */
  function initSettings() {
    var btn = $('#settingsBtn');
    var panel = $('#settingsPanel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- mobile menu ---------- */
  function closeMenu() {
    var menu = $('#mobileMenu');
    var btn = $('#menuBtn');
    if (menu) {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function initMenu() {
    var btn = $('#menuBtn');
    var menu = $('#mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.classList.contains('open')) { closeMenu(); return; }
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      var panel = $('#settingsPanel');
      if (panel) panel.hidden = true;
      var settingsBtn = $('#settingsBtn');
      if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || btn.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        btn.focus({ preventScroll: true });
      }
    });

    $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ---------- header state ---------- */
  function initHeader() {
    var nav = $('#nav');
    if (!nav) return;
    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function init() {
    initTheme();
    initSettings();
    initMenu();
    initHeader();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SiteCommon = { applyTheme: applyTheme, closeMenu: closeMenu };
})();
