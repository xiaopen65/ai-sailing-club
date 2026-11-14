/* =========================================================
   AI 航海研习社 · 全面赋能 · v2
   主题切换 / 卡片交互 / 详情弹窗 / 迭代路径 / 视差
   ========================================================= */
(function () {
  'use strict';

  var CASES = window.CASES || [];
  var CATEGORIES = window.CATEGORIES || [];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = { category: 'all', query: '', openCase: null, galleryIndex: 0, tab: 'preview', lastTrigger: null };
  var CASE_LINK_KEY = 'case-course-links-v1';
  function readCaseLinks() {
    try {
      var data = JSON.parse(localStorage.getItem(CASE_LINK_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }
  var caseLinks = readCaseLinks();
  function saveCaseLinks() {
    try { localStorage.setItem(CASE_LINK_KEY, JSON.stringify(caseLinks)); } catch (e) {}
  }

  var CASE_STACK_KEY = 'case-card-stacks-v1';
  function readCaseStacks() {
    try {
      var data = JSON.parse(localStorage.getItem(CASE_STACK_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }
  var caseStacks = readCaseStacks();
  function saveCaseStacks() {
    try { localStorage.setItem(CASE_STACK_KEY, JSON.stringify(caseStacks)); } catch (e) {}
  }
  function stackFor(item) {
    if (Array.isArray(caseStacks[item.id])) return caseStacks[item.id];
    return (item.stack || []).map(function (text, i) {
      return { id: item.id + '-s' + i, text: text };
    });
  }
  var arrowSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  /* ---------------- theme ---------------- */
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

    initSettings();
  }

  function initSettings() {
    var btn = $('#settingsBtn');
    var panel = $('#settingsPanel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) closeMobileMenu();
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

  function closeMobileMenu() {
    var menu = $('#mobileMenu');
    var btn = $('#menuBtn');
    if (menu) {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function initMobileMenu() {
    var btn = $('#menuBtn');
    var menu = $('#mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.classList.contains('open')) {
        closeMobileMenu();
        return;
      }
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
      closeMobileMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMobileMenu();
        btn.focus({ preventScroll: true });
      }
    });

    $$('#mobileMenu a').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });

    window.closeMobileMenu = closeMobileMenu;
  }

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

  /* ---------------- ticker ---------------- */
  function initTicker() {
    var track = $('#tickerTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  /* ---------------- hero ---------------- */
  function initHero() {
    var visual = $('#heroVisual');
    var hero = $('.hero');
    if (visual && hero && window.matchMedia('(pointer:fine)').matches && !reduced) {
      hero.addEventListener('mousemove', function (e) {
        if (document.body.classList.contains('editing')) return;
        var r = hero.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        visual.style.setProperty('--mx', mx.toFixed(3));
        visual.style.setProperty('--my', my.toFixed(3));
      });
      hero.addEventListener('mouseleave', function () {
        visual.style.setProperty('--mx', '0');
        visual.style.setProperty('--my', '0');
      });
    }

    $$('[data-case]').forEach(function (el) {
      if (el.classList.contains('card')) return;
      el.addEventListener('click', function (e) {
        if (document.body.classList.contains('editing') && e.target.closest('[data-ekey]')) return;
        e.preventDefault();
        var item = CASES.filter(function (c) { return c.id === el.getAttribute('data-case'); })[0];
        if (item) openModal(item, 'preview', el);
      });
    });

    if (!reduced) {
      $$('.hero-stats b').forEach(function (el) {
        var target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        var start = null;
        var dur = 1000;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }

  /* ---------------- capability chart ---------------- */
  var CAP = [
    { pct: 0.1, name: '创造工具', text: '能够用好 AI，去开发自己生活、业务、工作、成长等各种场景，能够快速地创造属于自己的高效工具，以及创造能够帮助各种各样的人解决问题的工具和价值。' },
    { pct: 1, name: '解决问题', text: '已经能够熟练掌握各种各样的技术，通过 AI 去实现各种各样的功能，解决各种各样的问题。' },
    { pct: 10, name: '部署智能体', text: '主要是部署了自己的 AI 智能体（仅部署为止）。' },
    { pct: 30, name: '聊天机器人', text: '在用 AI，主要是以聊天机器人为主。' },
    { pct: 60, name: '还没用 AI', text: '还没有怎么用，甚至没有用 AI。' }
  ];

  function initCapChart() {
    var chart = document.getElementById('capChart');
    if (!chart) return;
    var rows = $$('.cap-row', chart);
    var title = document.getElementById('capDetailTitle');
    var text = document.getElementById('capDetailText');
    if (!rows.length) return;

    var active = -1;
    function setActive(i) {
      if (i === active) return;
      active = i;
      rows.forEach(function (row, idx) {
        var on = idx === i;
        row.classList.toggle('active', on);
        row.setAttribute('aria-pressed', String(on));
      });
      if (!title || !text) return;
      text.style.opacity = '0';
      setTimeout(function () {
        title.textContent = CAP[i].pct + '% · ' + CAP[i].name;
        text.textContent = CAP[i].text;
        text.style.opacity = '1';
      }, 120);
    }

    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function () { setActive(i); });
      row.addEventListener('focus', function () { setActive(i); });
      row.addEventListener('click', function () { setActive(i); });
    });
    setActive(0);

    var counted = false;
    function reveal() {
      if (chart.classList.contains('cap-in')) return;
      chart.classList.add('cap-in');
      if (counted) return;
      counted = true;
      rows.forEach(function (row, i) {
        var el = row.querySelector('.cap-pct');
        if (!el) return;
        var target = CAP[i].pct;
        var decimals = i === 0 ? 1 : 0;
        if (reduced) {
          el.textContent = target.toFixed(decimals) + '%';
          return;
        }
        var start = null;
        var dur = 1000 + i * 60;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + '%';
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { reveal(); io.disconnect(); }
        });
      }, { threshold: 0.3 });
      io.observe(chart);
    } else {
      reveal();
    }
  }

  /* ---------------- filters ---------------- */
  function renderFilters() {
    var box = $('#filters');
    if (!box) return;
    box.innerHTML = CATEGORIES.map(function (cat) {
      var count = cat.id === 'all' ? CASES.length : CASES.filter(function (c) { return c.category === cat.id; }).length;
      return '<button class="chip' + (cat.id === state.category ? ' active' : '') + '" data-cat="' + cat.id + '" role="tab" aria-selected="' + (cat.id === state.category) + '">' +
        esc(cat.name) + '<b>' + String(count).padStart(2, '0') + '</b></button>';
    }).join('');
  }

  /* ---------------- cards ---------------- */
  function cardMarkup(item) {
    var tags = stackFor(item).map(function (tag) {
      return '<span class="tag"><span class="tag-text" data-ekey="case.' + esc(item.id) + '.stack.' + esc(tag.id) + '">' + esc(tag.text) + '</span>' +
        '<button class="tag-del" type="button" data-tag-del="' + esc(tag.id) + '" data-case-id="' + esc(item.id) + '" aria-label="删除标签">×</button></span>';
    }).join('') + '<button class="tag-add" type="button" data-tag-add="' + esc(item.id) + '">+ 标签</button>';
    return '<article class="card reveal" data-id="' + esc(item.id) + '" tabindex="0" role="button" aria-label="查看 ' + esc(item.title) + '">' +
      '<div class="card-cover">' +
        '<img src="' + esc(item.cover) + '" alt="' + esc(item.title) + ' 界面预览" decoding="async">' +
        '<span class="card-go">' + arrowSvg + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span>' + esc(item.index) + ' / ' + esc(item.year.slice(0, 4)) + '</span></div>' +
        '<h3 class="card-title" data-ekey="case.' + esc(item.id) + '.subtitle">' + esc(item.subtitle || item.title) + '</h3>' +
        '<p class="card-sub" data-ekey="case.' + esc(item.id) + '.summary">' + esc(item.summary) + '</p>' +
        '<div class="card-foot"><div class="tags">' + tags + '</div><span class="card-arrow">' + arrowSvg + '</span></div>' +
      '</div>' +
    '</article>';
  }

  function ctaTileMarkup() {
    return '<div class="card card-cta-tile reveal" aria-hidden="true"><div>' +
      '<div class="cta-plus">+</div>' +
      '<h3>下一个，正在路上</h3>' +
      '<p>这里会一直长。想到什么，就把它做出来。</p>' +
    '</div></div>';
  }

  function currentList() {
    var q = state.query.trim().toLowerCase();
    return CASES.filter(function (item) {
      if (state.category !== 'all' && item.category !== state.category) return false;
      if (!q) return true;
      var extra = window.CaseEditor ? window.CaseEditor.entriesFor('case.' + item.id + '.') : '';
      var hay = [item.title, item.subtitle, item.summary, item.categoryName, (item.stack || []).join(' '), (item.highlights || []).map(function (h) { return h.t + ' ' + h.d; }).join(' ')].join(' ') + ' ' + extra;
      return hay.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderCards() {
    var grid = $('#caseGrid');
    var empty = $('#emptyState');
    if (!grid) return;
    var list = currentList();
    grid.innerHTML = list.map(cardMarkup).join('') + (list.length === CASES.length && !state.query ? ctaTileMarkup() : '');
    if (empty) empty.classList.toggle('show', list.length === 0);
    observeReveals();
    if (window.CaseEditor) window.CaseEditor.refresh();
  }

  /* ---------------- reveal ---------------- */
  var observer;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    }
    $$('.reveal:not(.in)').forEach(function (el, i) {
      if (!el.dataset.delay) {
        el.dataset.delay = '1';
        el.style.transitionDelay = Math.min(i, 8) * 55 + 'ms';
      }
      observer.observe(el);
    });
  }

  /* ---------------- modal ---------------- */
  function statusClassOf(item) { return item.status === 'online' ? '' : item.status; }

  function openModal(item, initialTab, trigger) {
    state.openCase = item;
    state.galleryIndex = 0;
    state.tab = 'preview';
    state.lastTrigger = trigger || null;

    var modal = $('#modal');
    var sheet = $('#sheet');
    var preview = $('#sheetPreview');
    var detail = $('#sheetDetail');
    var images = (item.gallery && item.gallery.length ? item.gallery : [item.cover]);

    var tabs = '<div class="preview-tabs" role="tablist">' +
      '<button class="preview-tab active" data-tab="preview" role="tab" aria-selected="true">预览图</button>' +
      '<button class="preview-tab" data-tab="demo" role="tab" aria-selected="false"' + (item.demo ? '' : ' disabled title="该方案没有可在线运行的演示"') + '>' +
        (item.demo ? (item.demoLabel ? '试用 Demo' : '在线体验') : '暂无 Demo') +
      '</button>' +
      (item.demo ? '<button class="preview-fullscreen" type="button" aria-label="全屏查看在线体验" title="全屏查看" hidden>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg>' +
      '</button>' : '') +
      '</div>';

    preview.innerHTML = tabs +
      '<button class="case-jump prev" data-nav="prev" aria-label="上一个方案"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button class="case-jump next" data-nav="next" aria-label="下一个方案"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<div class="preview-stage" id="stage"><img src="' + esc(images[0]) + '" alt="' + esc(item.title) + ' 预览" id="stageImg"></div>' +
      '<div class="preview-thumbs" id="thumbs">' +
        images.map(function (src, i) {
          return '<button class="thumb' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" aria-label="查看第 ' + (i + 1) + ' 张图"><img src="' + esc(src) + '" alt=""></button>';
        }).join('') +
      '</div>';

    var paragraphs = String(item.description || '').split('\n\n').filter(Boolean).map(function (p, i) {
      return '<p data-ekey="case.' + esc(item.id) + '.desc.' + i + '">' + esc(p) + '</p>';
    }).join('');
    var iterations = (item.iterations || []).map(function (it, i) {
      return '<li><span class="iter-dot"></span>' +
        '<div class="iter-head"><b>' + esc(it.v) + '</b><span data-ekey="case.' + esc(item.id) + '.iter.' + i + '.t">' + esc(it.t) + '</span>' + (it.meta ? '<em data-ekey="case.' + esc(item.id) + '.iter.' + i + '.meta">' + esc(it.meta) + '</em>' : '') + '</div>' +
        (it.d ? '<p data-ekey="case.' + esc(item.id) + '.iter.' + i + '.d">' + esc(it.d) + '</p>' : '') +
      '</li>';
    }).join('');
    var caseIndex = CASES.map(function (c) { return c.id; }).indexOf(item.id);
    var total = String(CASES.length).padStart(2, '0');
    var courseLink = caseLinks[item.id] || '';

    detail.innerHTML =
      '<div class="detail-cat"><span class="pill">' + esc(item.categoryName) + '</span><span class="idx">SOLUTION ' + esc(item.index) + ' / 2026</span></div>' +
      '<h2 data-ekey="case.' + esc(item.id) + '.title">' + esc(item.title) + '</h2>' +
      '<p class="detail-sub" data-ekey="case.' + esc(item.id) + '.subtitle">' + esc(item.subtitle) + '</p>' +
      '<div class="detail-meta"><span>' + esc(item.form) + '</span><i></i><span>' + esc(item.year) + '</span><i></i><span class="meta-status ' + statusClassOf(item) + '">' + esc(item.statusText) + '</span></div>' +
      '<div class="detail-body">' + paragraphs + '</div>' +
      (iterations ? '<h4 class="detail-h3">迭代路径</h4><ol class="iter">' + iterations + '</ol>' : '') +
      '<div class="detail-course-action"' + (courseLink ? '' : ' hidden') + '>' +
        '<a class="btn btn-lime btn-sm" href="' + esc(courseLink || '#') + '" target="_blank" rel="noopener">进入案例课 ' + arrowSvg + '</a>' +
      '</div>' +
      '<div class="case-course-link-edit">' +
        '<label><span>案例课链接</span><input class="case-course-link-input" type="text" value="' + esc(courseLink) + '" placeholder="粘贴链接；留空则不显示按钮"></label>' +
      '</div>' +
      '<div class="detail-nav">' +
        '<button data-nav="prev">← 上一个</button>' +
        '<span class="nav-count">' + esc(item.index) + ' / ' + total + '</span>' +
        '<button data-nav="next">下一个 →</button>' +
      '</div>' +
      '<p class="detail-note">' + (item.demo ? 'Demo 为原始作品文件，直接在浏览器里运行；部分功能需要本地服务或 API Key。' : item.external ? '该方案为外部链接或本地应用，点击按钮前往。' : '该方案为本地桌面应用，需在对应目录启动；此处展示界面截图。') + '</p>';

    var courseLinkInput = detail.querySelector('.case-course-link-input');
    if (courseLinkInput) {
      courseLinkInput.addEventListener('input', function () {
        var next = courseLinkInput.value.trim();
        caseLinks[item.id] = next;
        saveCaseLinks();
        var action = detail.querySelector('.detail-course-action');
        var link = action ? action.querySelector('a') : null;
        if (!action || !link) return;
        if (next) {
          link.setAttribute('href', next);
          action.hidden = false;
        } else {
          action.hidden = true;
        }
      });
    }

    detail.scrollTop = 0;
    if (window.CaseEditor) window.CaseEditor.refresh();

    /* 从卡片位置“弹出来” */
    if (sheet) {
      var rect = trigger && trigger.getBoundingClientRect ? trigger.getBoundingClientRect() : null;
      if (rect && !reduced) {
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = Math.max(-160, Math.min(160, cx - window.innerWidth / 2));
        var dy = Math.max(-120, Math.min(120, cy - window.innerHeight / 2));
        sheet.style.transition = 'none';
        sheet.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.88)';
        sheet.style.opacity = '0';
      }
    }

    modal.classList.add('open');
    document.body.classList.add('locked');
    if (sheet && !reduced) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          sheet.style.transition = '';
          sheet.style.transform = '';
          sheet.style.opacity = '';
        });
      });
    }

    if (initialTab === 'demo' && item.demo) setTimeout(function () { switchTab('demo'); }, 40);

    if (trigger) {
      setTimeout(function () {
        var closeBtn = $('#modal .sheet-close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      }, 80);
    }
  }

  function goCase(dir) {
    if (!state.openCase) return;
    var ids = CASES.map(function (c) { return c.id; });
    var idx = ids.indexOf(state.openCase.id);
    if (idx < 0) return;
    var next = (idx + (dir === 'next' ? 1 : -1) + CASES.length) % CASES.length;
    openModal(CASES[next], 'preview', null);
    setTimeout(function () {
      var btn = document.querySelector('[data-nav="' + dir + '"]');
      if (btn) btn.focus({ preventScroll: true });
    }, 100);
  }

  function closeModal() {
    var modal = $('#modal');
    if (!modal.classList.contains('open')) return;
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    modal.classList.remove('open');
    document.body.classList.remove('locked');
    var stage = $('#stage');
    if (stage && stage.querySelector('iframe')) stage.querySelector('iframe').remove();
    var trigger = state.lastTrigger;
    state.openCase = null;
    state.lastTrigger = null;
    setTimeout(function () {
      if (!modal.classList.contains('open')) {
        $('#sheetPreview').innerHTML = '';
        $('#sheetDetail').innerHTML = '';
      }
      if (window.CaseEditor) window.CaseEditor.refresh();
    }, 450);
    if (trigger && trigger.focus) trigger.focus({ preventScroll: true });
  }

  function setGallery(i) {
    if (!state.openCase) return;
    var imgs = state.openCase.gallery && state.openCase.gallery.length ? state.openCase.gallery : [state.openCase.cover];
    var next = (i + imgs.length) % imgs.length;
    state.galleryIndex = next;
    var img = $('#stageImg');
    if (img) {
      img.style.opacity = '0';
      setTimeout(function () {
        img.src = imgs[next];
        img.style.opacity = '1';
      }, 120);
    }
    $$('.thumb').forEach(function (t) { t.classList.toggle('active', Number(t.dataset.i) === next); });
  }

  function switchTab(tab) {
    if (!state.openCase) return;
    state.tab = tab;
    $$('.preview-tab').forEach(function (t) {
      var active = t.dataset.tab === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    var stage = $('#stage');
    var thumbs = $('#thumbs');
    if (!stage) return;
    var fullscreenBtn = $('.preview-fullscreen');
    if (fullscreenBtn) fullscreenBtn.hidden = !(tab === 'demo' && state.openCase.demo);
    if (tab === 'demo') {
      if (!state.openCase.demo) return;
      stage.innerHTML = '<iframe src="' + esc(state.openCase.demo) + '" title="' + esc(state.openCase.title) + ' 在线演示" loading="eager" allowfullscreen allow="fullscreen"></iframe>';
      if (thumbs) thumbs.style.display = 'none';
    } else {
      var imgs = state.openCase.gallery && state.openCase.gallery.length ? state.openCase.gallery : [state.openCase.cover];
      stage.innerHTML = '<img src="' + esc(imgs[state.galleryIndex]) + '" alt="' + esc(state.openCase.title) + ' 预览" id="stageImg">';
      if (thumbs) thumbs.style.display = '';
    }
  }

  /* ---------------- scroll ---------- */
  function initScroll() {
    var nav = $('#nav');
    var progress = $('#progress');
    var onScroll = function () {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 18);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- events ---------------- */
  function bindEvents() {
    var filters = $('#filters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        state.category = chip.dataset.cat;
        $$('.chip').forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('active', on);
          c.setAttribute('aria-selected', String(on));
        });
        renderCards();
      });
    }

    var search = $('#searchInput');
    if (search) {
      var timer;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.query = search.value;
          renderCards();
        }, 130);
      });
    }

    document.addEventListener('input', function (e) {
      var field = e.target.closest ? e.target.closest('[data-ekey]') : null;
      if (!field) return;
      var key = field.getAttribute('data-ekey') || '';
      var titleMatch = key.match(/^case\.([^.]+)\.title$/);
      var subtitleMatch = key.match(/^case\.([^.]+)\.subtitle$/);
      if (titleMatch) {
        var titleText = field.textContent;
        Array.prototype.forEach.call(document.querySelectorAll('.cr-card[data-id="' + titleMatch[1] + '"] .cr-body b'), function (el) {
          if (el !== field) el.textContent = titleText;
        });
      }
      if (subtitleMatch) {
        var subtitleText = field.textContent;
        Array.prototype.forEach.call(document.querySelectorAll('.card[data-id="' + subtitleMatch[1] + '"] .card-title'), function (el) {
          if (el !== field) el.textContent = subtitleText;
        });
      }
    });

    var grid = $('#caseGrid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var addTag = e.target.closest('[data-tag-add]');
        if (addTag) {
          e.stopPropagation();
          var caseId = addTag.getAttribute('data-tag-add');
          var item = CASES.filter(function (c) { return c.id === caseId; })[0];
          if (!item) return;
          var list = stackFor(item).slice();
          var tag = { id: 'tag-' + Date.now() + '-' + Math.random().toString(36).slice(2, 4), text: '新标签' };
          list.push(tag);
          caseStacks[caseId] = list;
          saveCaseStacks();
          renderCards();
          window.setTimeout(function () {
            var target = document.querySelector('[data-ekey="case.' + caseId + '.stack.' + tag.id + '"]');
            if (!target) return;
            target.focus();
            var range = document.createRange();
            range.selectNodeContents(target);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }, 80);
          return;
        }

        var delTag = e.target.closest('[data-tag-del]');
        if (delTag) {
          e.stopPropagation();
          var deleteCaseId = delTag.getAttribute('data-case-id');
          var deleteTagId = delTag.getAttribute('data-tag-del');
          var deleteItem = CASES.filter(function (c) { return c.id === deleteCaseId; })[0];
          if (!deleteItem) return;
          if (!window.confirm('删除这个标签？')) return;
          caseStacks[deleteCaseId] = stackFor(deleteItem).filter(function (tag) { return tag.id !== deleteTagId; });
          saveCaseStacks();
          if (window.CaseEditor && window.CaseEditor.remove) {
            window.CaseEditor.remove('case.' + deleteCaseId + '.stack.' + deleteTagId);
          }
          renderCards();
          return;
        }

        if (document.body.classList.contains('editing') && e.target.closest('[data-ekey]')) return;
        var card = e.target.closest('.card[data-id]');
        if (!card) return;
        var item = CASES.filter(function (c) { return c.id === card.dataset.id; })[0];
        if (item) openModal(item, 'preview', card);
      });
      grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (document.body.classList.contains('editing')) return;
        var card = e.target.closest('.card[data-id]');
        if (!card) return;
        e.preventDefault();
        var item = CASES.filter(function (c) { return c.id === card.dataset.id; })[0];
        if (item) openModal(item, 'preview', card);
      });
      grid.addEventListener('mousemove', function (e) {
        var card = e.target.closest('.card');
        if (!card) return;
        var r = card.getBoundingClientRect();
        card.style.setProperty('--px', (e.clientX - r.left) + 'px');
        card.style.setProperty('--py', (e.clientY - r.top) + 'px');
      });
    }

    var modal = $('#modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) { closeModal(); return; }
        if (e.target.closest('[data-close]')) { closeModal(); return; }
        var fsBtn = e.target.closest('.preview-fullscreen');
        if (fsBtn) {
          var stage = $('#stage');
          if (!stage) return;
          var target = stage;
          if (document.fullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            return;
          }
          var request = target.requestFullscreen || target.webkitRequestFullscreen;
          if (request) {
            try {
              var fsPromise = request.call(target);
              if (fsPromise && fsPromise.catch) fsPromise.catch(function () {});
            } catch (err) {}
          }
          return;
        }
        var tab = e.target.closest('.preview-tab');
        if (tab && !tab.disabled) { switchTab(tab.dataset.tab); return; }
        var thumb = e.target.closest('.thumb');
        if (thumb) { switchTab('preview'); setGallery(Number(thumb.dataset.i)); return; }
        var navBtn = e.target.closest('[data-nav]');
        if (navBtn) { goCase(navBtn.dataset.nav); }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!state.openCase) return;
      if (e.key === 'Escape') closeModal();
      if (state.tab === 'preview' && e.key === 'ArrowRight') setGallery(state.galleryIndex + 1);
      if (state.tab === 'preview' && e.key === 'ArrowLeft') setGallery(state.galleryIndex - 1);
    });
  }

  /* ---------------- random case roulette ---------------- */
  function initCaseRoulette() {
    var track = $('#caseRouletteTrack');
    var viewport = $('.cr-viewport');
    var btn = $('#caseRouletteBtn');
    var hint = $('#caseRouletteHint');
    if (!track || !viewport || !btn) return;

    var count = CASES.length;
    if (!count) return;
    var middle = count;
    var current = middle;
    var spinning = false;
    var cards = [];

    function cardHtml(item) {
      return '<button class="cr-card" type="button" data-id="' + esc(item.id) + '" aria-label="查看 ' + esc(item.title) + '">' +
        '<span class="cr-cover"><img src="' + esc(item.cover) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async"></span>' +
        '<span class="cr-body"><span class="cr-cat">' + esc(item.categoryName) + '</span><b data-ekey="case.' + esc(item.id) + '.title">' + esc(item.title) + '</b></span>' +
        '<span class="cr-foot"><span>' + esc(item.index) + ' / 2026</span><span>↗</span></span>' +
      '</button>';
    }

    var html = CASES.map(cardHtml).join('');
    track.innerHTML = html + html + html;
    cards = Array.prototype.slice.call(track.querySelectorAll('.cr-card'));

    function setCenter(index, animate) {
      var card = cards[index];
      if (!card) return;
      var offset = viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      if (animate) {
        track.style.transition = 'transform 1.65s cubic-bezier(.12,.82,.16,1)';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = 'translate3d(' + offset + 'px,0,0)';
      cards.forEach(function (el) { el.classList.toggle('is-center', el === card); });
    }

    function spin() {
      if (spinning) return;
      spinning = true;
      btn.disabled = true;
      track.classList.add('spinning');
      if (hint) hint.textContent = '正在翻…';

      var currentCase = current % count;
      var next = Math.floor(Math.random() * count);
      if (count > 1 && next === currentCase) next = (next + 1) % count;

      setCenter(middle * 2 + next, true);
      window.setTimeout(function () {
        track.style.transition = 'none';
        current = middle + next;
        setCenter(current, false);
        spinning = false;
        btn.disabled = false;
        track.classList.remove('spinning');
        if (hint) hint.textContent = '翻到了：' + CASES[next].title + ' · 点中间卡片查看';
      }, 1680);
    }

    btn.addEventListener('click', spin);
    track.addEventListener('click', function (e) {
      if (spinning) return;
      var card = e.target.closest('.cr-card');
      if (!card) return;

      if (card.classList.contains('is-center')) {
        var item = CASES.filter(function (c) { return c.id === card.getAttribute('data-id'); })[0];
        if (item) openModal(item, 'preview', card);
        return;
      }

      var index = cards.indexOf(card);
      if (index < 0) return;
      setCenter(index, true);
      if (hint) hint.textContent = '已移到中间 · 点中间卡片查看';
      window.setTimeout(function () {
        track.style.transition = 'none';
        current = index;
        setCenter(index, false);
      }, 1680);
    });

    window.requestAnimationFrame(function () { setCenter(middle, false); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (!spinning) setCenter(current, false);
      }, 150);
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    initTheme();
    initMobileMenu();
    initTicker();
    initHero();
    initCapChart();
    initScroll();
    renderFilters();
    renderCards();
    initCaseRoulette();
    bindEvents();
    observeReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
