(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'route-profile-v1';

  /* 把小鹅通课程库链接填在这里，按钮就会直接跳转 */
  var COURSE_HUB_URL = '';

  var DIMENSIONS = {
    cognition: '认知',
    prompt: '提问',
    tools: '工具',
    workflow: '工作流',
    agent: '智能体',
    build: '场景落地'
  };

  var QUESTIONS = [
    {
      dim: 'cognition',
      q: '听到一个新 AI 工具时，你通常会？',
      options: [
        '先观望，等别人用明白',
        '看一眼介绍，知道它大概能做什么',
        '想清楚它适合解决哪类问题',
        '判断它该放进我的哪个工作流'
      ]
    },
    {
      dim: 'cognition',
      q: '你对 AI 的能力边界，大概是什么感觉？',
      options: [
        '不太清楚它能做什么、不能做什么',
        '知道它很会写东西、查资料',
        '知道哪些任务适合它、哪些不适合',
        '能判断它的输出哪里可能错、该怎么验'
      ]
    },
    {
      dim: 'prompt',
      q: '让 AI 帮你做一件事时，你通常怎么开口？',
      options: [
        '“帮我写个方案”这样一句话',
        '会补充一点背景和要求',
        '会给角色、目标、限制和示例',
        '会拆步骤、给判断标准，并让它先提问'
      ]
    },
    {
      dim: 'prompt',
      q: 'AI 第一次给的结果不好时，你会？',
      options: [
        '换个工具再试',
        '重新描述一遍',
        '拆解问题、补充上下文再试',
        '设计评估标准，迭代到稳定可用'
      ]
    },
    {
      dim: 'tools',
      q: '你实际用过的 AI 工具大概有多少？',
      options: [
        '基本没用过',
        '一两个聊天工具',
        '覆盖写作、图片、搜索等几类',
        '会按任务组合工具，也知道各自的边界'
      ]
    },
    {
      dim: 'tools',
      q: '遇到一个新任务，你怎么选工具？',
      options: [
        '别人推荐什么就用什么',
        '用自己最熟的那个',
        '会先看任务类型，再选合适的',
        '会组合两三个工具，拼成一条流程'
      ]
    },
    {
      dim: 'workflow',
      q: 'AI 在你的日常里是什么角色？',
      options: [
        '偶尔想起来才用',
        '会用来写东西、查资料',
        '已经固定接进某些重复流程',
        '有稳定的 AI 工作流，能持续产出'
      ]
    },
    {
      dim: 'workflow',
      q: '一件每周都要做的重复工作，你会？',
      options: [
        '继续手动做',
        '用 AI 帮其中一步',
        '把几步串成固定流程',
        '做成模板或自动化，交给 AI 跑'
      ]
    },
    {
      dim: 'agent',
      q: '你搭过自己的智能体或自动化吗？',
      options: [
        '没搭过，也不知道怎么搭',
        '用过别人搭好的',
        '照着教程搭过一个',
        '会为具体场景设计、调试并长期使用'
      ]
    },
    {
      dim: 'agent',
      q: '如果要让 AI 替你跑一件事，你会？',
      options: [
        '不知道从哪开始',
        '在聊天框里多问几轮',
        '会写清步骤和工具，让它按流程做',
        '会设计触发、工具、异常处理和验收'
      ]
    },
    {
      dim: 'build',
      q: '你有没有用 AI 解决过一个真实问题？',
      options: [
        '还没有',
        '试过，但结果没真正用起来',
        '解决过一个小问题，自己受益',
        '解决过业务或生活里的关键问题，并沉淀了方法'
      ]
    },
    {
      dim: 'build',
      q: '你做出过别人能用的 AI 作品吗？',
      options: [
        '没有',
        '做过只给自己用的',
        '给身边的人用过，收到反馈',
        '有对外发布、持续迭代的作品'
      ]
    }
  ];

  var COURSES = [
    {
      id: 'map', dim: 'cognition', title: 'AI 认知地图', level: '起步', hours: '2h',
      desc: '先看清 AI 能做什么、不能做什么，以及它在哪些任务上真的省时间。',
      outcome: '能判断一个任务该不该交给 AI。'
    },
    {
      id: 'prompt', dim: 'prompt', title: '提问与协作', level: '起步', hours: '3h',
      desc: '把模糊需求拆成角色、目标、限制和示例，让 AI 第一次就给到能用的结果。',
      outcome: '能把一个想法说成 AI 听得懂的指令。'
    },
    {
      id: 'tools', dim: 'tools', title: '工具链组合', level: '进阶', hours: '4h',
      desc: '不追新工具，按任务组合写作、图片、搜索、自动化几类工具。',
      outcome: '能为一件事选出 2–3 个工具并串起来。'
    },
    {
      id: 'workflow', dim: 'workflow', title: '工作流改造', level: '进阶', hours: '5h',
      desc: '找出每周重复的动作，把 AI 固定接进去，变成一条稳定的半自动流程。',
      outcome: '能改造一条自己的重复工作流。'
    },
    {
      id: 'agent', dim: 'agent', title: '智能体搭建', level: '进阶', hours: '6h',
      desc: '从单次对话走到能替你跑腿的智能体：触发、工具、异常和验收。',
      outcome: '能搭一个解决具体场景的小智能体。'
    },
    {
      id: 'build', dim: 'build', title: '场景作品实战', level: '实战', hours: '8h',
      desc: '把前面学的拼成一个别人能用的作品，从需求、界面到交付。',
      outcome: '能做出一个可展示、可迭代的 AI 作品。'
    }
  ];

  var state = {
    goal: { scenario: '工作', hours: 5, goal: '' },
    answers: new Array(QUESTIONS.length).fill(null),
    index: 0,
    result: null
  };

  var SAVED_REPORTS_KEY = 'route-saved-reports-v1';

  function saveReport() {
    if (!state.result) return false;
    var entry = {
      version: 1,
      at: new Date().toISOString(),
      goal: state.goal,
      result: state.result
    };
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(SAVED_REPORTS_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch (e) { list = []; }
    list.unshift(entry);
    list = list.slice(0, 30);
    try {
      localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(list));
    } catch (e) {
      toast('保存失败：浏览器存储不可用');
      return false;
    }
    // TODO(account): when accounts are ready, POST this entry to the user's report database.
    toast('报告已保存到本机 · 接入账号后会写入你的数据库');
    return true;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && typeof saved === 'object') {
        if (saved.goal) state.goal = Object.assign(state.goal, saved.goal);
        if (Array.isArray(saved.answers)) {
          state.answers = new Array(QUESTIONS.length).fill(null).map(function (_, i) {
            return typeof saved.answers[i] === 'number' ? saved.answers[i] : null;
          });
        }
        state.result = saved.result || null;
      }
    } catch (e) {}
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ goal: state.goal, answers: state.answers, result: state.result }));
    } catch (e) {}
  }

  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- goal ---------- */
  function syncGoalUI() {
    $$('#scenarioChips .chip').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === state.goal.scenario);
    });
    $$('#hoursChips .chip').forEach(function (btn) {
      btn.classList.toggle('active', Number(btn.getAttribute('data-hours')) === state.goal.hours);
    });
    var input = $('#goalInput');
    if (input && state.goal.goal) input.value = state.goal.goal;
  }

  function setGoalStatus(text, ok) {
    var el = $('#goalStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'form-note' + (ok ? ' ok' : '');
  }

  function bindGoal() {
    $$('#scenarioChips .chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.goal.scenario = btn.getAttribute('data-scenario');
        syncGoalUI();
      });
    });
    $$('#hoursChips .chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.goal.hours = Number(btn.getAttribute('data-hours'));
        syncGoalUI();
      });
    });

    $('#goalForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var text = ($('#goalInput').value || '').trim();
      if (text.length < 4) {
        setGoalStatus('再具体一点：写一个你真正想推进的目标。', false);
        $('#goalInput').focus();
        return;
      }
      state.goal.goal = text;
      save();
      setGoalStatus('目标已保存，去能力测试 →', true);
      updateMap();

      if (state.result) {
        state.result = computeResult();
        save();
        renderReport();
        renderCourses();
        toast('目标已更新，报告已按新目标调整');
      }
      setTimeout(function () { scrollToId('test'); }, 320);
    });
  }

  /* ---------- quiz ---------- */
  function answeredCount() {
    return state.answers.filter(function (a) { return typeof a === 'number'; }).length;
  }

  function firstUnanswered() {
    var i = state.answers.indexOf(null);
    return i === -1 ? 0 : i;
  }

  function updateStartButton() {
    var label = document.getElementById('quizStartLabel');
    if (!label) return;
    label.textContent = state.result ? '重新测试' : (answeredCount() ? '继续测试' : '开始测试');
  }

  function beginTest() {
    $('#quizStart').hidden = true;
    $('#quizBody').hidden = false;
    state.index = firstUnanswered();
    renderQuestion();
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var selected = state.answers[state.index];
    $('#quizProgressText').textContent = '问题 ' + (state.index + 1) + ' / ' + QUESTIONS.length;
    $('#quizDimension').textContent = DIMENSIONS[q.dim];
    $('#quizBar').style.width = ((state.index + 1) / QUESTIONS.length * 100) + '%';
    $('#quizQuestion').textContent = q.q;

    $('#quizOptions').innerHTML = q.options.map(function (text, i) {
      return '<button class="quiz-option' + (selected === i ? ' selected' : '') + '" type="button" data-score="' + i + '">' +
        '<span class="qo-key">' + String.fromCharCode(65 + i) + '</span><span>' + esc(text) + '</span></button>';
    }).join('');

    $$('#quizOptions .quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.answers[state.index] = Number(btn.getAttribute('data-score'));
        save();
        renderQuestion();
        updateMap();
      });
    });

    $('#quizPrev').disabled = state.index === 0;
    var last = state.index === QUESTIONS.length - 1;
    var next = $('#quizNext');
    next.textContent = last ? '生成报告 →' : '下一题 →';
    next.disabled = typeof selected !== 'number';
  }

  function bindQuiz() {
    $('#quizStartBtn').addEventListener('click', function () {
      if (state.result) {
        state.answers = new Array(QUESTIONS.length).fill(null);
        state.result = null;
        state.index = 0;
        save();
        renderReport();
        renderCourses();
        updateMap();
      }
      beginTest();
    });

    $('#quizPrev').addEventListener('click', function () {
      if (state.index > 0) { state.index -= 1; renderQuestion(); }
    });

    $('#quizNext').addEventListener('click', function () {
      if (typeof state.answers[state.index] !== 'number') return;
      if (state.index < QUESTIONS.length - 1) {
        state.index += 1;
        renderQuestion();
        return;
      }
      var missing = state.answers.indexOf(null);
      if (missing !== -1) {
        state.index = missing;
        renderQuestion();
        toast('还有一题没选，补完就能生成报告');
        return;
      }
      finishTest();
    });
    updateStartButton();
  }

  function finishTest() {
    state.result = computeResult();
    save();
    renderReport();
    renderCourses();
    updateMap();
    updateStartButton();
    if (reduced) scrollToId('report');
    else setTimeout(function () { scrollToId('report'); }, 120);
  }

  function levelOf(score) {
    if (score < 25) return { name: '起步者', line: '先把 AI 地图建起来' };
    if (score < 50) return { name: '使用者', line: '从会用到用得更好' };
    if (score < 75) return { name: '搭建者', line: '开始让 AI 替你跑' };
    return { name: '创造者', line: '把 AI 变成自己的工具' };
  }

  function computeResult() {
    var dims = Object.keys(DIMENSIONS).map(function (key) {
      var idxs = [];
      QUESTIONS.forEach(function (q, i) { if (q.dim === key) idxs.push(i); });
      var sum = idxs.reduce(function (s, i) {
        var v = state.answers[i];
        return s + (typeof v === 'number' ? v : 0);
      }, 0);
      var score = Math.round(sum / (idxs.length * 3) * 100);
      return { key: key, name: DIMENSIONS[key], score: score };
    });

    var overall = Math.round(dims.reduce(function (s, d) { return s + d.score; }, 0) / dims.length);
    var level = levelOf(overall);

    var bias = {
      '工作': ['workflow', 'build'],
      '生活': ['tools', 'build'],
      '学习': ['cognition', 'prompt'],
      '成长': ['agent', 'build']
    }[state.goal.scenario] || [];

    var sorted = dims.slice().sort(function (a, b) {
      var av = a.score - (bias.indexOf(a.key) !== -1 ? 8 : 0);
      var bv = b.score - (bias.indexOf(b.key) !== -1 ? 8 : 0);
      return av - bv;
    });
    var recDims = sorted.slice(0, 3).map(function (d) { return d.key; });
    var rec = recDims.map(function (key) {
      return COURSES.filter(function (c) { return c.dim === key; })[0];
    }).filter(Boolean);

    var strongest = dims.slice().sort(function (a, b) { return b.score - a.score; })[0];
    var weakest = sorted[0];

    return {
      dims: dims,
      overall: overall,
      level: level,
      rec: rec,
      strongest: strongest,
      weakest: weakest,
      at: Date.now()
    };
  }

  /* ---------- report ---------- */
  function renderReport() {
    var box = $('#reportBody');
    if (!box) return;
    var r = state.result;

    if (!r) {
      box.innerHTML = '<div class="report-empty"><h3>报告还没生成</h3>' +
        '<p>先完成上面的能力测试。做完之后，这里会出现你的能力画像、推荐课程和下一步行动。</p></div>';
      return;
    }

    var goalText = state.goal.goal
      ? state.goal.goal
      : '还没定目标。回到 Step 01 写一个具体想解决的问题，推荐会更准。';

    var bars = r.dims.map(function (d) {
      return '<div class="report-bar"><label>' + esc(d.name) + '<b>' + d.score + '</b></label>' +
        '<i><span style="width:' + d.score + '%"></span></i></div>';
    }).join('');

    var recs = r.rec.map(function (c, i) {
      return '<li><em>0' + (i + 1) + '</em><div><b>' + esc(c.title) + '</b><span>' + esc(c.outcome) + '</span></div></li>';
    }).join('');

    var step1 = r.rec[0] ? r.rec[0].title : 'AI 认知地图';
    var step2 = r.rec[1] ? r.rec[1].title : '提问与协作';
    var step3 = r.rec[2] ? r.rec[2].title : '场景作品实战';

    var plan = [
      ['D1–2', step1 + '：先把课程里的第一个方法，套到「' + goalText + '」上，写出一个最小版本。'],
      ['D3–4', step2 + '：用 30 分钟做一次真实练习，把结果交给 AI 改一遍，记下哪句指令最有用。'],
      ['D5–7', step3 + '：做出一个能给朋友看的版本；去海上餐厅做 1 个任务，练一次工具组合。']
    ].map(function (p) { return '<li><b>' + p[0] + '</b><span>' + esc(p[1]) + '</span></li>'; }).join('');

    box.innerHTML =
      '<div class="report-head">' +
        '<div><span class="report-kicker">YOUR LEARNING REPORT</span>' +
        '<h3 class="report-level"><span>' + esc(r.level.name) + '</span><em class="rl-sub">' + esc(r.level.line) + '</em></h3></div>' +
        '<div class="report-score"><b>' + r.overall + '</b>综合能力分 / 100</div>' +
      '</div>' +
      '<div class="report-goal"><b>YOUR GOAL · ' + esc(state.goal.scenario) + ' · 每周 ' + state.goal.hours + 'h</b>' + esc(goalText) + '</div>' +
      '<div class="report-bars">' + bars + '</div>' +
      '<div class="report-grid">' +
        '<div class="report-block"><h3>优先补的三块</h3><ul class="report-rec">' + recs + '</ul></div>' +
        '<div class="report-block"><h3>接下来 7 天</h3><ol class="report-plan">' + plan + '</ol></div>' +
      '</div>' +
      '<div class="report-actions">' +
        '<a class="btn btn-lime btn-sm" href="route.html">去课程库</a>' +
        '<button class="qbtn" type="button" data-save-report>保存报告</button>' +
        '<a class="qbtn" href="https://xiaopen65.github.io/ai-sea-restaurant/" target="_blank" rel="noopener">去海上餐厅 ↗</a>' +
        '<button class="qbtn" type="button" data-retest>重新测试</button>' +
      '</div>' +
      '<p class="report-goal" style="background:transparent;border:0;padding:12px 0 0;color:#9A9A8E">' +
        '最强：' + esc(r.strongest.name) + ' ' + r.strongest.score + ' · 优先补：' + esc(r.weakest.name) + ' ' + r.weakest.score +
      '</p>';

    $$('[data-go]', box).forEach(function (btn) {
      btn.addEventListener('click', function () { scrollToId(btn.getAttribute('data-go')); });
    });
    $$('[data-save-report]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!saveReport()) return;
        btn.textContent = '已保存 ✓';
        btn.disabled = true;
      });
    });
    $$('[data-retest]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.answers = new Array(QUESTIONS.length).fill(null);
        state.result = null;
        state.index = 0;
        save();
        renderReport();
        renderCourses();
        updateMap();
        updateStartButton();
        scrollToId('test');
        beginTest();
      });
    });
  }

  /* ---------- courses ---------- */
  function renderCourses() {
    var grid = $('#courseGrid');
    if (!grid) return;
    var recIds = state.result ? state.result.rec.map(function (c) { return c.id; }) : [];
    grid.innerHTML = COURSES.map(function (c) {
      var rec = recIds.indexOf(c.id) !== -1;
      return '<article class="course-card' + (rec ? ' recommended' : '') + '">' +
        (rec ? '<span class="course-badge">RECOMMENDED</span>' : '') +
        '<span class="course-dim">' + esc(DIMENSIONS[c.dim]) + ' · ' + esc(c.level) + '</span>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p>' + esc(c.desc) + '</p>' +
        '<div class="course-meta"><span>' + esc(c.hours) + '</span><span>' + esc(c.level) + '</span></div>' +
        '<div class="course-outcome"><b>学完能做到：</b>' + esc(c.outcome) + '</div>' +
      '</article>';
    }).join('');
  }

  function bindCourses() {
    var hub = $('#courseHub');
    if (!hub) return;
    hub.addEventListener('click', function () {
      if (COURSE_HUB_URL) {
        window.open(COURSE_HUB_URL, '_blank', 'noopener');
      } else {
        toast('课程库链接待接入：把链接发我就能接上');
      }
    });
  }

  /* ---------- vertical rail ---------- */
  function setRailActive(id) {
    $$('#routeRail .rail-step').forEach(function (step) {
      var on = step.getAttribute('href') === '#' + id;
      step.classList.toggle('active', on);
      if (on) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }

  function updateMap() {
    var done = {
      1: !!(state.goal && state.goal.goal),
      2: answeredCount() === QUESTIONS.length,
      3: !!state.result
    };
    $$('#routeRail .rail-step').forEach(function (step) {
      var n = step.getAttribute('data-step');
      step.classList.toggle('done', !!done[n]);
    });
  }

  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    setRailActive(id);
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }

  function bindRail() {
    var rail = document.getElementById('routeRail');
    var toggle = document.getElementById('railToggle');
    var sections = ['goal', 'test', 'report', 'courses', 'game'];
    var steps = $$('#routeRail .rail-step');

    function closeRail() {
      if (rail) {
        rail.classList.remove('open');
        rail.classList.remove('collapsed');
      }
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    function updateActive() {
      var y = window.scrollY + 150;
      var current = 'goal';
      sections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      });
      setRailActive(current);
    }

    steps.forEach(function (step) {
      step.addEventListener('mouseenter', function () {
        if (rail) rail.classList.remove('collapsed');
      });
      step.addEventListener('click', function (e) {
        e.preventDefault();
        var id = (step.getAttribute('href') || '').replace('#', '');
        closeRail();
        if (rail) rail.classList.add('collapsed');
        scrollToSection(id);
      });
    });

    if (rail) {
      rail.addEventListener('mouseleave', function () {
        rail.classList.remove('collapsed');
      });
    }

    if (toggle && rail) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !rail.classList.contains('open');
        rail.classList.toggle('open', open);
        if (open) rail.classList.remove('collapsed');
        toggle.setAttribute('aria-expanded', String(open));
      });

      document.addEventListener('click', function (e) {
        if (!rail.classList.contains('open')) return;
        if (rail.contains(e.target) || toggle.contains(e.target)) return;
        closeRail();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeRail();
      });
    }

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
  }

  function init() {
    load();
    syncGoalUI();
    bindGoal();
    bindQuiz();
    bindCourses();
    bindRail();
    updateMap();
    renderCourses();
    renderReport();
    updateStartButton();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
