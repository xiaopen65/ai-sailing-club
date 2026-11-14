/* =========================================================
   学习地图 / 板块导览
   数据来自 assets/js/courses.js（游戏地图里的课程链接库）
   ========================================================= */
(function () {
  'use strict';

  var CATALOG = [
    {
      id: 'tools',
      title: 'AI工具课',
      sub: '装好 · 跑通 · 接进工作流',
      intro: '先把工具装好、连好、跑通。从安装配置到生图、视频、音频、智能体和工作流，再到常见报错和素材资源，解决「工具不会用、环境跑不起来」的问题。',
      helps: [
        '把常用 AI 工具装好，并接进自己的工作流',
        '用生图、视频、音频和智能体完成具体任务',
        '遇到安装、网络、模型配置问题能自己排查'
      ],
      groups: ['practice', 'resource']
    },
    {
      id: 'thinking',
      title: 'AI思维课',
      sub: '判断 · 拆解 · 沉淀',
      intro: '先建立判断、拆解和沉淀的底层能力。解决「不知道该不该用 AI、一个模糊目标不知道怎么拆、做完没有留下资产」的问题。',
      helps: [
        '判断一个任务该不该交给 AI',
        '把模糊目标拆成可执行步骤',
        '把经验沉淀成可复用的资产'
      ],
      groups: ['required']
    },
    {
      id: 'application',
      title: 'AI应用课',
      sub: '业务 · MVP · 个人系统',
      intro: '把 AI 放进真实业务，跑通一个最小闭环。解决「学了很多工具，但不知道怎么用到自己的业务里」的问题。',
      helps: [
        '拆解一个真实商业场景',
        '跑通一个最小商业 MVP',
        '搭一套自己的个人时间系统'
      ],
      groups: ['ability']
    },
    {
      id: 'vision',
      title: 'AI视野课',
      sub: '案例 · 过程 · 借鉴',
      intro: '看别人怎么把想法做成作品。解决「不知道 AI 能做成什么、自己该从哪里开始」的问题。',
      helps: [
        '看到一个作品从 0 到 1 的完整过程',
        '理解别人为什么这样做',
        '找到自己能借鉴的做法'
      ],
      groups: ['case']
    }
  ];

  var HELP_STORE_KEY = 'study-catalog-helps-v1';
  function readHelpStore() {
    try {
      var data = JSON.parse(localStorage.getItem(HELP_STORE_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }
  var helpStore = readHelpStore();
  function saveHelpStore() {
    try { localStorage.setItem(HELP_STORE_KEY, JSON.stringify(helpStore)); } catch (e) {}
  }

  var HELP_DELETED_KEY = 'study-catalog-help-deleted-v1';
  function readDeletedHelp() {
    try {
      var data = JSON.parse(localStorage.getItem(HELP_DELETED_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }
  var deletedHelpStore = readDeletedHelp();
  function saveDeletedHelp() {
    try { localStorage.setItem(HELP_DELETED_KEY, JSON.stringify(deletedHelpStore)); } catch (e) {}
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function renderRoulette(lib) {
    var track = document.getElementById('rouletteTrack');
    var viewport = document.querySelector('.roulette-viewport');
    var button = document.getElementById('rouletteBtn');
    var hint = document.getElementById('rouletteHint');
    if (!track || !viewport || !button) return;

    var flat = [];
    lib.forEach(function (group) {
      group.courses.forEach(function (course) {
        flat.push({ title: course.title, url: course.url, group: group.title, sub: group.sub });
      });
    });
    if (!flat.length) return;

    var count = flat.length;
    var middle = count;
    var current = middle;
    var spinning = false;
    var cards = [];

    var cardHtml = flat.map(function (course, i) {
      return '<a class="roulette-card" href="' + esc(course.url) + '" target="_blank" rel="noopener" data-course="' + i + '">' +
        '<span class="rc-group">' + esc(course.group) + ' · ' + esc(course.sub) + '</span>' +
        '<b class="rc-title">' + esc(course.title) + '</b>' +
        '<span class="rc-foot"><span class="rc-num">' + String(i + 1).padStart(2, '0') + '</span><span class="rc-arrow">↗</span></span>' +
      '</a>';
    }).join('');

    // 三份卡片，中间一份作为起点，第三份作为滚动目标
    track.innerHTML = cardHtml + cardHtml + cardHtml;
    cards = Array.prototype.slice.call(track.querySelectorAll('.roulette-card'));

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
      button.disabled = true;
      track.classList.add('spinning');
      if (hint) hint.textContent = '正在翻…';

      var currentCourse = current % count;
      var next = Math.floor(Math.random() * count);
      if (count > 1 && next === currentCourse) next = (next + 1) % count;

      var target = middle * 2 + next;
      setCenter(target, true);

      window.setTimeout(function () {
        track.style.transition = 'none';
        current = middle + next;
        setCenter(current, false);
        spinning = false;
        button.disabled = false;
        track.classList.remove('spinning');
        if (hint) hint.textContent = '翻到了：' + flat[next].title + ' · 点中间的卡片查看';
      }, 1680);
    }

    button.addEventListener('click', spin);
    window.requestAnimationFrame(function () { setCenter(middle, false); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (!spinning) setCenter(current, false);
      }, 150);
    });
  }

  function render() {
    var lib = window.COURSE_LIBRARY;
    if (!Array.isArray(lib) || !lib.length) return;

    var tabs = document.getElementById('sectionTabs');
    var panel = document.getElementById('sectionPanel');

    var catalog = CATALOG.map(function (item) {
      var courses = [];
      item.groups.forEach(function (groupId) {
        var group = lib.filter(function (g) { return g.id === groupId; })[0];
        if (group) courses = courses.concat(group.courses);
      });
      return {
        id: item.id,
        title: item.title,
        sub: item.sub,
        intro: item.intro,
        helps: item.helps,
        courses: courses
      };
    });

    var active = catalog[0].id;

    function refreshEditor() {
      if (window.CaseEditor && window.CaseEditor.refresh) window.CaseEditor.refresh();
    }

    function initCatalogToggle() {
      var toggle = document.getElementById('catalogToggle');
      var body = document.getElementById('catalogBody');
      if (!toggle || !body) return;

      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.classList.toggle('is-open', open);
        body.classList.toggle('is-open', open);
      });
    }

    initCatalogToggle();

    function renderPanel(id) {
      if (!panel) return;
      var cat = catalog.filter(function (item) { return item.id === id; })[0] || catalog[0];
      var custom = Array.isArray(helpStore[cat.id]) ? helpStore[cat.id] : [];
      var deleted = Array.isArray(deletedHelpStore[cat.id]) ? deletedHelpStore[cat.id] : [];
      var helpItems = cat.helps.map(function (item, i) {
        if (deleted.indexOf(i) >= 0) return '';
        return '<li><span data-ekey="study.catalog.' + cat.id + '.help.' + i + '">' + esc(item) + '</span>' +
          '<button class="help-del" type="button" data-help-del data-help-base="' + i + '" aria-label="删除这条帮助">×</button></li>';
      }).join('') + custom.map(function (item) {
        return '<li><span data-ekey="study.catalog.' + cat.id + '.custom.' + esc(item.id) + '">' + esc(item.text) + '</span>' +
          '<button class="help-del" type="button" data-help-del data-help-custom="' + esc(item.id) + '" aria-label="删除这条帮助">×</button></li>';
      }).join('');

      panel.innerHTML = '<h3>' + esc(cat.title) + '</h3>' +
        '<p class="section-func" data-ekey="study.catalog.' + cat.id + '.intro">' + esc(cat.intro) + '</p>' +
        '<div class="section-helps" data-help-cat="' + esc(cat.id) + '"><b>这个板块能帮你</b><ul>' + helpItems + '</ul>' +
          '<button class="help-add" type="button" data-help-add="' + esc(cat.id) + '">+ 新增一条</button>' +
        '</div>';

      refreshEditor();
    }

    if (panel) {
      panel.addEventListener('click', function (e) {
        var del = e.target.closest('[data-help-del]');
        if (del) {
          var wrap = del.closest('[data-help-cat]');
          var id = wrap ? wrap.getAttribute('data-help-cat') : '';
          if (!id) return;
          if (!window.confirm('删除这条帮助？')) return;
          var base = del.getAttribute('data-help-base');
          if (base !== null) {
            if (!Array.isArray(deletedHelpStore[id])) deletedHelpStore[id] = [];
            var baseIndex = Number(base);
            if (deletedHelpStore[id].indexOf(baseIndex) < 0) deletedHelpStore[id].push(baseIndex);
            saveDeletedHelp();
          } else {
            var customId = del.getAttribute('data-help-custom');
            var list = Array.isArray(helpStore[id]) ? helpStore[id] : [];
            helpStore[id] = list.filter(function (item) { return item.id !== customId; });
            saveHelpStore();
            if (window.CaseEditor && window.CaseEditor.remove) {
              window.CaseEditor.remove('study.catalog.' + id + '.custom.' + customId);
            }
          }
          renderPanel(id);
          return;
        }

        var add = e.target.closest('[data-help-add]');
        if (!add) return;
        var addId = add.getAttribute('data-help-add');
        var item = { id: 'help-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5), text: '新增一条帮助' };
        if (!Array.isArray(helpStore[addId])) helpStore[addId] = [];
        helpStore[addId].push(item);
        saveHelpStore();
        renderPanel(addId);
        window.setTimeout(function () {
          var target = panel.querySelector('[data-ekey="study.catalog.' + addId + '.custom.' + item.id + '"]');
          if (!target) return;
          target.focus();
          var range = document.createRange();
          range.selectNodeContents(target);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }, 80);
      });
    }

    if (tabs) {
      tabs.innerHTML = catalog.map(function (cat) {
        return '<button class="section-tab' + (cat.id === active ? ' active' : '') + '" type="button" data-section="' + esc(cat.id) + '">' +
          '<span class="st-main"><b>' + esc(cat.title) + '</b></span>' +
        '</button>';
      }).join('');

      tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.section-tab');
        if (!btn) return;
        active = btn.getAttribute('data-section');
        Array.prototype.forEach.call(tabs.querySelectorAll('.section-tab'), function (el) {
          el.classList.toggle('active', el === btn);
        });
        renderPanel(active);
      });
    }

    renderPanel(active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
