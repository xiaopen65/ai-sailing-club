/* =========================================================
   网页内文字编辑
   - 点「编辑文案」即可直接改文字
   - 自动保存到 assets/js/edits.js（需用「编辑文案.bat」启动）
   - 没有服务时退回浏览器本地保存
   ========================================================= */
(function () {
  'use strict';

  var LS_KEY = 'case-site-edits-v1';
  var EDITS = {};
  var editing = false;
  var saveTimer = null;
  var statusEl = null;
  var localNewer = false;
  var isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  var allowed = (function () {
    try {
      if (new URLSearchParams(location.search).get('edit') === '1') return true;
    } catch (e) {}
    if (location.protocol === 'file:') return true;
    return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  })();

  /* ---------- 读取已有修改 ---------- */
  var CASE_TITLE_MARKER = 'sp-case-titles-v4';
  var CASE_TITLES = {
    growth: '赋能你的时间管理、目标管理、行动计划',
    learning: '赋能你的主题学习、知识串联、深度追问',
    ppt: '赋能你的内容拆解、脚本生成、演示表达',
    opc: '赋能你的选品盘点、出摊内容、成交记录',
    rock: '赋能你的动力识别、阻力拆解、行动复盘',
    pm: '赋能你的项目拆解、进度跟踪、协作交接',
    sea: '赋能你的任务设计、工具练习、学习闯关',
    biz: '赋能你的业务诊断、问题定位、方案生成',
    kaishuo: '赋能你的活动策划、内容生产、现场主持',
    xp: '赋能你的信息检索、网页阅读、研究整理',
    office: '赋能你的任务派发、AI 协作、工作流管理'
  };
  var LEGACY_CASE_TITLES = {
    '个人成长系统': CASE_TITLES.growth,
    '涌现式学习': CASE_TITLES.learning,
    'AI 漫剧 · 一问一答 PPT': CASE_TITLES.ppt,
    'OPC 出摊工作台': CASE_TITLES.opc,
    '推石头模型 3D': CASE_TITLES.rock,
    '项目管理表': CASE_TITLES.pm,
    '漂流的海上餐厅': CASE_TITLES.sea,
    '业务拆解器': CASE_TITLES.biz,
    '开说工作台': CASE_TITLES.kaishuo,
    'XP Browser': CASE_TITLES.xp,
    '小P办公室': CASE_TITLES.office
  };

  function migrateTerms(value, key) {
    var next = value.replace(/案例/g, '方案');
    next = next.replace(/这个方案库收录/g, '这个专区收录');
    next = next.replace(/方案库/g, '全面赋能');
    next = next.replace(/学习路线/g, '系统学习');
    if (key === 'hero.feature.name' && next === 'XP Browser') {
      next = '信息检索、阅读与研究';
    }
    if (key && /^case\.[^.]+\.title$/.test(key) && LEGACY_CASE_TITLES[next]) {
      next = LEGACY_CASE_TITLES[next];
    }
    return next;
  }

  function loadEdits() {
    var serverEdits = window.EDITS || {};
    var serverAt = window.EDITS_UPDATED || 0;
    var local = null;
    try { local = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {}
    var localAt = local && local.at ? local.at : 0;

    EDITS = Object.assign({}, serverEdits);
    if (local && local.data && localAt > serverAt) {
      Object.keys(local.data).forEach(function (k) { EDITS[k] = local.data[k]; });
      localNewer = true;
    }

    /* 术语迁移：案例 → 方案；方案库 → 全面赋能；学习路线 → 系统学习 */
    var migrated = false;
    Object.keys(EDITS).forEach(function (k) {
      if (typeof EDITS[k] === 'string') {
        var next = migrateTerms(EDITS[k], k);
        if (next !== EDITS[k]) {
          EDITS[k] = next;
          migrated = true;
        }
      }
    });

    /* 一次性把旧的案例标题覆盖成新的功能性标题；之后用户再编辑不会被重置 */
    var titlesMigrated = false;
    try { titlesMigrated = localStorage.getItem(CASE_TITLE_MARKER) === '1'; } catch (e) {}
    if (!titlesMigrated) {
      Object.keys(EDITS).forEach(function (k) {
        var match = /^case\.([^.]+)\.title$/.exec(k);
        if (match && CASE_TITLES[match[1]] && EDITS[k] !== CASE_TITLES[match[1]]) {
          EDITS[k] = CASE_TITLES[match[1]];
          migrated = true;
        }
      });
      try { localStorage.setItem(CASE_TITLE_MARKER, '1'); } catch (e) {}
    }

    if (migrated) {
      localNewer = true;
      saveLocal(Date.now());
    }

    return EDITS;
  }

  /* ---------- 把修改写回页面 ---------- */
  function apply() {
    var nodes = document.querySelectorAll('[data-ekey]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-ekey');
      if (!Object.prototype.hasOwnProperty.call(EDITS, key)) continue;
      if (el === document.activeElement) continue;
      var val = EDITS[key];
      if (el.textContent !== val) el.textContent = val;
    }
    if (editing) setEditable(nodes, true);
  }

  function setEditable(nodes, on) {
    for (var i = 0; i < nodes.length; i++) {
      if (on) {
        nodes[i].setAttribute('contenteditable', 'plaintext-only');
        nodes[i].setAttribute('spellcheck', 'false');
      } else {
        nodes[i].removeAttribute('contenteditable');
        nodes[i].removeAttribute('spellcheck');
      }
    }
  }

  /* ---------- 保存 ---------- */
  function setStatus(text, ok) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('warn', ok === false);
  }

  function saveLocal(now) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ at: now, data: EDITS })); } catch (e) {}
  }

  function saveNow() {
    clearTimeout(saveTimer);
    var now = Date.now();
    saveLocal(now);

    if (!isHttp) {
      setStatus('已保存到浏览器 · ' + timeLabel());
      return Promise.resolve(false);
    }

    setStatus('保存中…');
    return fetch('/api/edits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(EDITS)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setStatus('已保存到文件 · ' + timeLabel());
      return true;
    }).catch(function () {
      setStatus('已保存在浏览器（未连接编辑服务）', false);
      return false;
    });
  }

  function scheduleSave() {
    setStatus('保存中…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 600);
  }

  function timeLabel() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  /* ---------- 进入 / 退出编辑 ---------- */
  function setEditing(on) {
    if (!allowed) return;
    editing = on;
    document.body.classList.toggle('editing', on);
    setEditable(document.querySelectorAll('[data-ekey]'), on);
    apply();

    var actions = document.getElementById('editActions');
    var panel = document.getElementById('settingsPanel');
    var settingsBtn = document.getElementById('settingsBtn');
    if (actions) actions.hidden = !on;
    if (panel) panel.hidden = true;
    if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
    if (on && window.closeMobileMenu) window.closeMobileMenu();

    if (on) {
      setStatus(isHttp ? '自动保存已开启' : '仅存浏览器 · 用「编辑文案.bat」可写回文件', isHttp);
      var done = document.getElementById('editDone');
      if (done) done.focus({ preventScroll: true });
    } else {
      saveNow().then(function (server) {
        showToast(server ? '已保存到文件' : (isHttp ? '已保存在浏览器' : '已保存到浏览器'));
      });
    }
  }

  var toastEl = null;
  var toastTimer = null;
  function showToast(text) {
    if (!toastEl) toastEl = document.getElementById('saveToast');
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function resetAll() {
    if (!confirm('清除所有文字修改，恢复原始文案？')) return;
    Object.keys(EDITS).forEach(function (k) { delete EDITS[k]; });
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    saveNow().then(function () {
      setTimeout(function () { location.reload(); }, 150);
    });
  }

  /* ---------- 导出 / 导入全部数据 ---------- */
  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }

  function exportEdits() {
    var payload = JSON.stringify({
      at: Date.now(),
      data: EDITS,
      studyMapCourses: readJson('study-map-courses-v1'),
      studyMapCourseDetails: readJson('study-map-course-details-v1'),
      studyCatalogHelps: readJson('study-catalog-helps-v1'),
      caseCourseLinks: readJson('case-course-links-v1'),
      caseCardStacks: readJson('case-card-stacks-v1'),
      abilityAssessment: readJson('ability-assessment-v2'),
      studyCatalogHelpDeleted: readJson('study-catalog-help-deleted-v1'),
      studyMapDone: readJson('study-map-done-v1')
    }, null, 2);
    var blob = new Blob([payload], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'AI案例库-全部数据.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast('已导出全部数据');
  }

  function importData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return 0;
    var count = 0;
    Object.keys(data).forEach(function (k) {
      if (typeof data[k] === 'string') {
        EDITS[k] = migrateTerms(data[k], k);
        count += 1;
      }
    });
    saveLocal(Date.now());
    apply();
    saveNow().then(function () {
      showToast('已导入 ' + count + ' 条修改');
    });
    return count;
  }

  function importAll(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    var data = obj.data && typeof obj.data === 'object' ? obj.data : null;
    if (data) importData(data);
    if (obj.studyMapCourses !== undefined) {
      try { localStorage.setItem('study-map-courses-v1', JSON.stringify(obj.studyMapCourses)); } catch (e) {}
    }
    if (obj.studyMapCourseDetails !== undefined) {
      try { localStorage.setItem('study-map-course-details-v1', JSON.stringify(obj.studyMapCourseDetails)); } catch (e) {}
    }
    if (obj.studyCatalogHelps !== undefined) {
      try { localStorage.setItem('study-catalog-helps-v1', JSON.stringify(obj.studyCatalogHelps)); } catch (e) {}
    }
    if (obj.caseCourseLinks !== undefined) {
      try { localStorage.setItem('case-course-links-v1', JSON.stringify(obj.caseCourseLinks)); } catch (e) {}
    }
    if (obj.caseCardStacks !== undefined) {
      try { localStorage.setItem('case-card-stacks-v1', JSON.stringify(obj.caseCardStacks)); } catch (e) {}
    }
    if (obj.abilityAssessment !== undefined) {
      try { localStorage.setItem('ability-assessment-v2', JSON.stringify(obj.abilityAssessment)); } catch (e) {}
    }
    if (obj.studyCatalogHelpDeleted !== undefined) {
      try { localStorage.setItem('study-catalog-help-deleted-v1', JSON.stringify(obj.studyCatalogHelpDeleted)); } catch (e) {}
    }
    if (obj.studyMapResultGoals !== undefined) {
      try { localStorage.setItem('study-map-result-goals-v1', JSON.stringify(obj.studyMapResultGoals)); } catch (e) {}
    }
    if (obj.studyMapGoals !== undefined) {
      try { localStorage.setItem('study-map-goals-v1', JSON.stringify(obj.studyMapGoals)); } catch (e) {}
    }
    if (obj.studyMapDone !== undefined) {
      try { localStorage.setItem('study-map-done-v1', JSON.stringify(obj.studyMapDone)); } catch (e) {}
    }
    showToast('已导入全部数据，正在刷新');
    setTimeout(function () { location.reload(); }, 450);
  }

  function importFile(file) {
    if (!file) return;
    file.text().then(function (txt) {
      var obj = JSON.parse(txt);
      importAll(obj);
    }).catch(function () {
      showToast('导入失败：文件格式不对');
    });
  }

  /* ---------- 事件 ---------- */
  function bind() {
    statusEl = document.getElementById('editStatus');
    var start = document.getElementById('editStart');
    var done = document.getElementById('editDone');
    var reset = document.getElementById('editReset');

    if (start) start.addEventListener('click', function () { setEditing(true); });
    if (done) done.addEventListener('click', function () { setEditing(false); });
    if (reset) reset.addEventListener('click', resetAll);

    var exportBtn = document.getElementById('editsExport');
    var importBtn = document.getElementById('editsImport');
    var fileInput = document.getElementById('editsFile');
    if (exportBtn) exportBtn.addEventListener('click', exportEdits);
    if (importBtn && fileInput) {
      importBtn.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        importFile(fileInput.files && fileInput.files[0]);
        fileInput.value = '';
      });
    }

    document.addEventListener('click', function (e) {
      if (!editing) return;
      var el = e.target.closest && e.target.closest('[data-ekey]');
      if (el && e.target.closest('a')) e.preventDefault();
    }, true);

    document.addEventListener('input', function (e) {
      if (!editing) return;
      var el = e.target.closest && e.target.closest('[data-ekey]');
      if (!el) return;
      var key = el.getAttribute('data-ekey');
      EDITS[key] = el.textContent.replace(/\u00a0/g, ' ').replace(/\s+$/, '');
      saveLocal(Date.now());
      scheduleSave();
    });

    document.addEventListener('focusout', function (e) {
      if (!editing) return;
      if (e.target.closest && e.target.closest('[data-ekey]')) saveNow();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e' && !e.shiftKey) {
        e.preventDefault();
        setEditing(!editing);
      }
      if (editing && e.key === 'Escape') {
        var el = document.activeElement;
        if (el && el.closest && el.closest('[data-ekey]')) el.blur();
      }
    });

    if (new URLSearchParams(location.search).get('edit') === '1') {
      setTimeout(function () { setEditing(true); }, 60);
    }
  }

  /* ---------- 给 app.js 调用 ---------- */
  window.CaseEditor = {
    apply: apply,
    refresh: function () { apply(); if (editing) setEditable(document.querySelectorAll('[data-ekey]'), true); },
    save: saveNow,
    start: function () { setEditing(true); },
    stop: function () { setEditing(false); },
    get: function (key, fallback) {
      return Object.prototype.hasOwnProperty.call(EDITS, key) ? EDITS[key] : fallback;
    },
    set: function (key, value) {
      if (!key) return;
      EDITS[key] = String(value == null ? '' : value);
      saveLocal(Date.now());
      saveNow();
    },
    remove: function (key) {
      if (!key) return;
      delete EDITS[key];
      saveLocal(Date.now());
      saveNow();
    },
    entriesFor: function (prefix) {
      return Object.keys(EDITS).filter(function (k) { return k.indexOf(prefix) === 0; })
        .map(function (k) { return EDITS[k]; }).join(' ');
    },
    importData: importData
  };

  function init() {
    loadEdits();
    bind();
    if (!allowed) {
      var row = document.getElementById('editRow');
      var editsRow = document.getElementById('editsRow');
      var actions = document.getElementById('editActions');
      if (row) row.style.display = 'none';
      if (editsRow) editsRow.style.display = 'none';
      if (actions) actions.hidden = true;
    }
    apply();

    /* 浏览器里有比文件更新的修改：自动写回 edits.js，避免只留在本地缓存 */
    if (isHttp && localNewer && Object.keys(EDITS).length) {
      setTimeout(function () {
        saveNow().then(function (ok) {
          if (ok) showToast('已把浏览器里的修改同步到文件');
        });
      }, 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
