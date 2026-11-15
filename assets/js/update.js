/* =========================================================
   版本更新 / 清除旧缓存
   - 检查 version.json，发现新版本后带新版本号重载
   - 清理 Cache Storage 与 Service Worker；不动用户的文字修改、主题和报告
   ========================================================= */
(function () {
  'use strict';

  var BUILD = '20261106-113';
  var VERSION_URL = 'version.json';

  function setVersion() {
    var nodes = document.querySelectorAll('[data-site-version]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = BUILD;
  }

  function clearRuntimeCaches() {
    var jobs = [];

    if ('caches' in window) {
      jobs.push(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) { return caches.delete(key); }));
      }));
    }

    if ('serviceWorker' in navigator) {
      jobs.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
        return Promise.all(regs.map(function (reg) { return reg.unregister(); }));
      }));
    }

    try { sessionStorage.removeItem('page-wipe'); } catch (e) {}

    return Promise.all(jobs).catch(function () {});
  }

  function reloadWithBuild(build) {
    var base = location.href.split('#')[0].split('?')[0];
    var stamp = Date.now();
    var target = base + '?build=' + encodeURIComponent(build + '-' + stamp);
    try {
      location.replace(target);
    } catch (e) {
      location.reload();
    }
  }

  function checkUpdate(btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = '检查中…';

    var remote = null;
    var request;

    if ('fetch' in window) {
      request = fetch(VERSION_URL + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) { return data && data.build ? String(data.build) : null; })
        .catch(function () { return null; });
    } else {
      request = Promise.resolve(null);
    }

    request.then(function (build) {
      remote = build;
      if (build && build !== BUILD) {
        btn.textContent = '发现新版本，正在更新…';
      } else if (build === BUILD) {
        btn.textContent = '已是最新，正在刷新…';
      } else {
        btn.textContent = '正在清理缓存…';
      }
      return clearRuntimeCaches();
    }).then(function () {
      var target = remote && remote !== BUILD ? remote : BUILD;
      window.setTimeout(function () { reloadWithBuild(target); }, 420);
    }).catch(function () {
      window.setTimeout(function () { reloadWithBuild(BUILD); }, 300);
    });
  }

  function init() {
    setVersion();
    var buttons = document.querySelectorAll('[data-check-update]');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () { checkUpdate(btn); });
      })(buttons[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
