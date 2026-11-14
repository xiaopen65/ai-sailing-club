/* =========================================================
   全站横向页面切换
   所有页面统一加载，file:// 和本地服务都生效
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var leaving = false;

  document.addEventListener('click', function (e) {
    if (leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!a || a.target || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:' && url.protocol !== 'file:') return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    leaving = true;
    try { sessionStorage.setItem('site-page-transition', '1'); } catch (err) {}
    location.href = url.href;
  }, true);

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'dsh-page-in') {
      document.documentElement.classList.remove('page-enter');
    }
  });

  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.body.classList.remove('page-leave');
    document.documentElement.classList.remove('page-enter');
  });

  // 动画事件没触发时的兜底
  if (document.documentElement.classList.contains('page-enter')) {
    window.setTimeout(function () {
      document.documentElement.classList.remove('page-enter');
    }, 600);
  }
})();
