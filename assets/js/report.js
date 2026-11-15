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

  var missing = (Array.isArray(r.missing) ? r.missing : Object.keys(target.requirements).map(function (key) {
    return { key: key, name: A.domains[key], score: r.domains[key], need: target.requirements[key] };
  }).filter(function (item) { return item.score < item.need; })).slice().sort(function (a, b) {
    return a.score - b.score;
  });
  var hasGaps = missing.length > 0;
  var firstGap = hasGaps ? missing[0] : null;
  var gapHeading = hasGaps
    ? (missing.length === 1 ? '先补这一块' : missing.length === 2 ? '先补这两块' : missing.length === 3 ? '先补这三块' : '先补这几块')
    : '能力门槛已达标';

  var gaps = hasGaps
    ? missing.map(function (gap, i) {
        return '<li><em>0' + (i + 1) + '</em><div><b>' + gap.name + ' · ' + gap.score + ' / ' + gap.need + '</b><span>' + (gapActions[gap.key] || '先补这一块。') + '</span></div></li>';
      }).join('')
    : '<li class="is-done"><em>✓</em><div><b>目标层级能力已达标</b><span>你的技能、思维和结果准备度已经覆盖 Level ' + r.targetLevel + ' 的门槛。下一步不是继续补基础，而是做真实交付。</span></div></li>';

  var summaryThird = hasGaps
    ? '<div><span>先补</span><b>' + firstGap.name + '</b><em>' + firstGap.score + ' / ' + firstGap.need + '</em></div>'
    : '<div><span>状态</span><b>已达标</b><em>直接做结果</em></div>';

  var nextSteps = (hasGaps ? [
    '先在结果板块完成一个 Level ' + r.startLevel + ' 的小结果：' + start.title + '。',
    '把「' + firstGap.name + '」从 ' + firstGap.score + ' 补到至少 ' + firstGap.need + '，只练这一个短板。',
    '24 小时内真实用一次，把过程记录到结果板块；下一次再来复测。'
  ] : [
    '在结果板块完成一个 Level ' + r.targetLevel + ' 的真实交付：' + target.title + '。',
    r.targetLevel < 3
      ? '能力已经达标，直接挑战 Level ' + (r.targetLevel + 1) + ' 的结果，不要停在课程里。'
      : '选一个最能代表你的结果，做成别人能看、能用、能复用的版本。',
    r.targetLevel < 3
      ? '14 天后复测；如果新结果做出来了，再往上走一层。'
      : '把作品放进真实场景，收集 3 个反馈后再复测。'
  ]).map(function (text, i) {
    return '<li><b>0' + (i + 1) + '</b><span>' + text + '</span></li>';
  }).join('');

  var targetNote;
  if (hasGaps) {
    targetNote = r.startLevel < r.targetLevel
      ? '<p class="rp-target-note">你的目标是 Level ' + r.targetLevel + '，但建议先从 Level ' + r.startLevel + ' 开始，把基础能力和结果交付补齐，再往上走。</p>'
      : '<p class="rp-target-note">你的目标层级还有 ' + missing.length + ' 项能力没有到门槛，先补齐再交付。</p>';
  } else {
    targetNote = '<p class="rp-target-note is-ready">你已经达到 ' + target.name + '（Level ' + r.targetLevel + '）的能力门槛，接下来用真实结果验证。</p>';
  }

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
          summaryThird +
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
      '<div><div class="rp-section-head"><p class="rp-kicker">' + (hasGaps ? 'GAPS' : 'READY') + '</p><h2>' + gapHeading + '</h2></div><ol class="rp-gaps' + (hasGaps ? '' : ' rp-gaps-done') + '">' + gaps + '</ol></div>' +
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