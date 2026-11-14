/* =========================================================
   能力报告：三条线 + 学习地图结果层级
   ========================================================= */
(function () {
  'use strict';

  var A = window.Assessment;
  var root = document.getElementById('reportRoot');
  if (!A || !root) return;

  var saved = A.getReport();
  if (!saved || !saved.result) {
    location.replace('test.html');
    return;
  }

  var r = saved.result;
  var target = r.target;
  var start = A.resultLevels.filter(function (l) { return l.level === r.startLevel; })[0] || A.resultLevels[0];
  var date = new Date(saved.completedAt || r.completedAt || Date.now());
  var dateText = date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0');

  var lineMeta = {
    skill: { name: '技能', en: 'SKILL', sub: '工具使用 · 接口 / API · 智能体' },
    thinking: { name: '思维', en: 'THINKING', sub: '场景拆解 · 资源调动 · 数据沉淀' },
    result: { name: '结果', en: 'RESULT', sub: '真实目标 · 交付 · 持续推进' }
  };

  function domainRows(lineKey) {
    return A.lineDomains[lineKey].map(function (key) {
      return '<div class="rp-domain"><span>' + A.domains[key] + '</span><b>' + r.domains[key] + '</b>' +
        '<i><span style="width:' + r.domains[key] + '%"></span></i></div>';
    }).join('');
  }

  var lineCards = Object.keys(lineMeta).map(function (key) {
    return '<article class="rp-line">' +
      '<header><div><span class="rp-line-kicker">' + lineMeta[key].en + '</span><h3>' + lineMeta[key].name + '</h3></div>' +
        '<b class="rp-line-score">' + r.line[key] + '</b></header>' +
      '<p>' + lineMeta[key].sub + '</p>' +
      '<div class="rp-domains">' + domainRows(key) + '</div>' +
    '</article>';
  }).join('');

  var levelCards = A.resultLevels.map(function (level) {
    var isTarget = level.level === r.targetLevel;
    var isStart = level.level === r.startLevel;
    var req = Object.keys(level.requirements).map(function (key) {
      var current = r.domains[key];
      var need = level.requirements[key];
      var met = current >= need;
      return '<li class="' + (met ? 'is-met' : 'is-missing') + '"><span>' + A.domains[key] + '</span><b>' + current + ' / ' + need + '</b></li>';
    }).join('');
    return '<article class="rp-level' + (isTarget ? ' is-target' : '') + (isStart ? ' is-start' : '') + '">' +
      '<header><span class="rp-level-num">LEVEL 0' + level.level + '</span>' +
        '<span class="rp-level-badges">' + (isTarget ? '<i class="tag-target">目标</i>' : '') + (isStart ? '<i class="tag-start">建议起点</i>' : '') + '</span>' +
      '</header>' +
      '<h3>' + level.name + '</h3>' +
      '<p>' + level.title + '</p>' +
      '<div class="rp-need"><b>需要掌握：</b>' + level.need + '</div>' +
      '<ul class="rp-req">' + req + '</ul>' +
    '</article>';
  }).join('');

  var gapActions = {
    tools: '先把常用工具装好，接进一条真实工作流',
    api: '从 API Key 和一次接口调用开始',
    agent: '安装一个智能体，跑通一个真实场景',
    scene: '把一个模糊目标拆成 3 个可执行场景',
    resource: '列出可调用的人、工具和资料，主动推进一次',
    data: '把一次实践沉淀成模板、复盘或可复用资产',
    result: '在结果板块选一个 Level ' + r.startLevel + ' 的目标，做出一个最小交付'
  };

  var gaps = r.gaps.map(function (gap, i) {
    return '<li><em>0' + (i + 1) + '</em><div><b>' + gap.name + ' · ' + gap.score + '</b><span>' + (gapActions[gap.key] || '先补这一块。') + '</span></div></li>';
  }).join('');

  var firstGap = r.gaps[0];
  var gapNeed = target.requirements[firstGap.key] || 50;
  var nextSteps = [
    '先在结果板块完成一个 Level ' + r.startLevel + ' 的小结果：' + start.title + '。',
    '把「' + firstGap.name + '」从 ' + firstGap.score + ' 补到至少 ' + gapNeed + '，只练这一个短板。',
    '24 小时内真实用一次，把过程记录到结果板块；下一次再来复测。'
  ].map(function (text, i) {
    return '<li><b>0' + (i + 1) + '</b><span>' + text + '</span></li>';
  }).join('');

  var targetNote = r.startLevel < r.targetLevel
    ? '<p class="rp-target-note">你的目标是 Level ' + r.targetLevel + '，但建议先从 Level ' + r.startLevel + ' 开始，把基础能力和结果交付补齐，再往上走。</p>'
    : '<p class="rp-target-note is-ready">你的能力准备度和目标层级匹配，可以直接从 Level ' + r.startLevel + ' 开始。</p>';

  root.innerHTML =
    '<section class="rp-hero">' +
      '<p class="rp-kicker">YOUR LEARNING REPORT · ' + dateText + '</p>' +
      '<h1>你的能力画像</h1>' +
      '<p class="rp-lead">按技能、思维、结果三条线，对照学习地图的结果板块，看看你现在适合从哪一层开始。</p>' +
      '<div class="rp-hero-row">' +
        '<div class="rp-overall"><b>' + r.overall + '</b><span>/ 100 综合准备度</span></div>' +
        '<div class="rp-summary">' +
          '<div><span>目标结果</span><b>Level ' + r.targetLevel + '</b><em>' + target.name + '</em></div>' +
          '<div><span>建议起点</span><b>Level ' + r.startLevel + '</b><em>' + start.name + '</em></div>' +
          '<div><span>先补</span><b>' + firstGap.name + '</b><em>' + firstGap.score + ' 分</em></div>' +
        '</div>' +
      '</div>' +
    '</section>' +
    targetNote +
    '<section class="rp-lines">' + lineCards + '</section>' +
    '<section class="rp-section">' +
      '<div class="rp-section-head"><p class="rp-kicker">RESULT MAP</p><h2>结果板块：你适合从哪一层开始</h2></div>' +
      '<p class="rp-section-desc">学习地图的结果板块是横向分级的目标：越往上，要求的不只是会用工具，还要能调动资源、沉淀数据、把事交付出来。</p>' +
      '<div class="rp-levels">' + levelCards + '</div>' +
    '</section>' +
    '<section class="rp-section rp-two-col">' +
      '<div><div class="rp-section-head"><p class="rp-kicker">GAPS</p><h2>先补这三块</h2></div><ol class="rp-gaps">' + gaps + '</ol></div>' +
      '<div><div class="rp-section-head"><p class="rp-kicker">NEXT</p><h2>接下来怎么做</h2></div><ol class="rp-next">' + nextSteps + '</ol></div>' +
    '</section>' +
    '<div class="rp-actions">' +
      '<a class="btn btn-lime" href="route.html">回到学习地图</a>' +
      '<button class="qbtn" type="button" id="reportRetake">重新测试</button>' +
    '</div>';

  var retake = document.getElementById('reportRetake');
  if (retake) {
    retake.addEventListener('click', function () {
      A.reset();
      location.href = 'test.html?retake=1';
    });
  }
})();