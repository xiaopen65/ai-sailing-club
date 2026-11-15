/* =========================================================
   能力测试 v2：技能 / 思维 / 结果三条线
   ========================================================= */
(function () {
  'use strict';

  var KEY = 'ability-assessment-v2';

  var DOMAINS = {
    tools: '工具使用',
    api: '接口 / API',
    agent: '智能体',
    scene: '场景拆解',
    resource: '资源调动',
    data: '数据沉淀',
    result: '结果推进'
  };

  var LINE_DOMAINS = {
    skill: ['tools', 'api', 'agent'],
    thinking: ['scene', 'resource', 'data'],
    result: ['result']
  };

  var LINE_LABELS = { skill: '技能', thinking: '思维', result: '结果' };

  var RESULT_LEVELS = [
    {
      level: 1,
      name: '日常效率',
      title: '日常聊天、问题咨询、基础办公、创作',
      need: '工具使用 + 场景拆解',
      requirements: { tools: 35, scene: 35 }
    },
    {
      level: 2,
      name: '业务闭环',
      title: '商业验证、自我管理、拆业务、项目管理、设计工作流',
      need: '工具 / API + 资源调动 + 数据沉淀',
      requirements: { tools: 55, api: 50, resource: 55, data: 50 }
    },
    {
      level: 3,
      name: '个人系统',
      title: '创造个人 AI 智能系统、思考决策系统、AI 作品 / 产品',
      need: '智能体 / 接口 + 资源调动 + 数据沉淀',
      requirements: { agent: 65, api: 60, resource: 60, data: 65 }
    }
  ];

  var QUESTIONS = [
    {
      id: 'tools-use', line: 'skill', domain: 'tools',
      q: '你用 AI 工具处理过哪些任务？',
      options: [
        { label: '几乎没用过', score: 0 },
        { label: '聊天、写作、查资料', score: 1 },
        { label: '生图、视频、音频、文档等多类', score: 2 },
        { label: '能按任务组合工具，也知道边界', score: 3 }
      ]
    },
    {
      id: 'tools-new', line: 'skill', domain: 'tools',
      q: '遇到一个新 AI 工具，你通常会？',
      options: [
        { label: '等别人用明白', score: 0 },
        { label: '看介绍，知道大概', score: 1 },
        { label: '上手试一个真实任务', score: 2 },
        { label: '判断它该放进哪条工作流', score: 3 }
      ]
    },
    {
      id: 'tools-create', line: 'skill', domain: 'tools',
      q: '生图、生视频、音频转文字这类创作工具，你能独立完成吗？',
      options: [
        { label: '没试过', score: 0 },
        { label: '跟着教程做过', score: 1 },
        { label: '能独立做出可用结果', score: 2 },
        { label: '能组合成一条内容生产流程', score: 3 }
      ]
    },
    {
      id: 'tools-flow', line: 'skill', domain: 'tools',
      q: '你平时的 AI 使用更接近？',
      options: [
        { label: '偶尔打开', score: 0 },
        { label: '固定用来写作 / 搜索', score: 1 },
        { label: '接进几个重复任务', score: 2 },
        { label: '有稳定工作流，持续产出', score: 3 }
      ]
    },
    {
      id: 'api-concept', line: 'skill', domain: 'api',
      q: 'API / 接口，你的理解是？',
      options: [
        { label: '不知道是什么', score: 0 },
        { label: '听过，没实际用过', score: 1 },
        { label: '知道它是让系统互相调用', score: 2 },
        { label: '能看懂文档并接进自己的流程', score: 3 }
      ]
    },
    {
      id: 'api-key', line: 'skill', domain: 'api',
      q: '你配置过模型接口或 API Key 吗？',
      options: [
        { label: '没有', score: 0 },
        { label: '看别人配过', score: 1 },
        { label: '自己配通过一次', score: 2 },
        { label: '能处理额度、报错、代理等常见问题', score: 3 }
      ]
    },
    {
      id: 'api-connect', line: 'skill', domain: 'api',
      q: '把 AI 接进飞书、知识库或自己的工作系统，你做过吗？',
      options: [
        { label: '没做过', score: 0 },
        { label: '想过，没动手', score: 1 },
        { label: '接通过一个入口', score: 2 },
        { label: '能稳定接入并维护', score: 3 }
      ]
    },
    {
      id: 'agent-install', line: 'skill', domain: 'agent',
      q: '你安装 / 配置过智能体或桌面 AI 工具吗？',
      options: [
        { label: '没有', score: 0 },
        { label: '装过但没跑通', score: 1 },
        { label: '按教程跑通过', score: 2 },
        { label: '能独立安装、配置、更新', score: 3 }
      ]
    },
    {
      id: 'agent-build', line: 'skill', domain: 'agent',
      q: '你搭过自己的智能体 / 机器人吗？',
      options: [
        { label: '没搭过', score: 0 },
        { label: '用过别人的', score: 1 },
        { label: '搭过一个简单场景', score: 2 },
        { label: '为具体场景设计并长期使用', score: 3 }
      ]
    },
    {
      id: 'agent-debug', line: 'skill', domain: 'agent',
      q: '智能体跑不通时，你通常会？',
      options: [
        { label: '不知道从哪查', score: 0 },
        { label: '重启或换工具', score: 1 },
        { label: '看报错、查文档逐步排查', score: 2 },
        { label: '能定位是模型、接口、权限还是流程问题', score: 3 }
      ]
    },
    {
      id: 'think-scene', line: 'thinking', domain: 'scene',
      q: '一个模糊目标，你会先做什么？',
      options: [
        { label: '直接让 AI 写', score: 0 },
        { label: '先想一下要什么', score: 1 },
        { label: '拆成几个具体场景', score: 2 },
        { label: '拆场景、定边界、定判断标准', score: 3 }
      ]
    },
    {
      id: 'think-judge', line: 'thinking', domain: 'scene',
      q: '你能判断什么该交给 AI、什么不该吗？',
      options: [
        { label: '不太能', score: 0 },
        { label: '知道大概', score: 1 },
        { label: '会按任务类型判断', score: 2 },
        { label: '会考虑风险、验证成本和责任', score: 3 }
      ]
    },
    {
      id: 'think-input', line: 'thinking', domain: 'scene',
      q: '让 AI 做一件事前，你会补充什么？',
      options: [
        { label: '一句话需求', score: 0 },
        { label: '背景和要求', score: 1 },
        { label: '角色、目标、限制、示例', score: 2 },
        { label: '步骤、判断标准、验收方式', score: 3 }
      ]
    },
    {
      id: 'think-resource', line: 'thinking', domain: 'resource',
      q: '遇到不会的问题，你通常会？',
      options: [
        { label: '卡住', score: 0 },
        { label: '问 AI', score: 1 },
        { label: '找工具、资料、人对比', score: 2 },
        { label: '能快速找到资源并判断哪个可用', score: 3 }
      ]
    },
    {
      id: 'think-block', line: 'thinking', domain: 'resource',
      q: '一个业务或项目卡住时，你会？',
      options: [
        { label: '不知道从哪下手', score: 0 },
        { label: '先做最容易的', score: 1 },
        { label: '拆环节找卡点', score: 2 },
        { label: '找关键约束，排优先级', score: 3 }
      ]
    },
    {
      id: 'think-bring', line: 'thinking', domain: 'resource',
      q: '你能调动外部资源（人、工具、渠道）吗？',
      options: [
        { label: '基本靠自己', score: 0 },
        { label: '会问熟人', score: 1 },
        { label: '会主动找合作或工具', score: 2 },
        { label: '能组资源把事推进到结果', score: 3 }
      ]
    },
    {
      id: 'think-record', line: 'thinking', domain: 'data',
      q: '做完一件事，你会留下什么？',
      options: [
        { label: '做完就结束', score: 0 },
        { label: '记一点笔记', score: 1 },
        { label: '留模板或复盘', score: 2 },
        { label: '沉淀成可复用系统或资产', score: 3 }
      ]
    },
    {
      id: 'think-iterate', line: 'thinking', domain: 'data',
      q: 'AI 结果不好时，你会？',
      options: [
        { label: '换工具', score: 0 },
        { label: '重写提示', score: 1 },
        { label: '查上下文、补数据再试', score: 2 },
        { label: '设计评估标准，稳定迭代', score: 3 }
      ]
    },
    {
      id: 'think-share', line: 'thinking', domain: 'data',
      q: '你会把经验整理成别人也能用的东西吗？',
      options: [
        { label: '不会', score: 0 },
        { label: '偶尔分享', score: 1 },
        { label: '有模板或文档', score: 2 },
        { label: '有可复用的方法、课程或工具', score: 3 }
      ]
    },
    {
      id: 'result-target', line: 'result', domain: 'result', target: true,
      q: '你最想先拿到哪种结果？',
      options: [
        { label: '日常效率：聊天、咨询、基础办公、创作', target: 1 },
        { label: '业务闭环：商业验证、项目管理、工作流设计', target: 2 },
        { label: '个人系统：自己的 AI 智能体、作品或产品', target: 3 }
      ]
    },
    {
      id: 'result-current', line: 'result', domain: 'result',
      q: '你目前有一个正在推进的真实 AI 目标吗？',
      options: [
        { label: '没有', score: 0 },
        { label: '想过，没开始', score: 1 },
        { label: '有一个，偶尔推进', score: 2 },
        { label: '有明确目标，持续推进', score: 3 }
      ]
    },
    {
      id: 'result-deliver', line: 'result', domain: 'result',
      q: '你做出过别人能用的成果吗？',
      options: [
        { label: '没有', score: 0 },
        { label: '只给自己用', score: 1 },
        { label: '给身边人用过', score: 2 },
        { label: '有对外发布或持续迭代', score: 3 }
      ]
    },
    {
      id: 'result-project', line: 'result', domain: 'result',
      q: '一个项目从想法到交付，你能独立推进吗？',
      options: [
        { label: '没试过', score: 0 },
        { label: '需要别人带', score: 1 },
        { label: '能完成一小段', score: 2 },
        { label: '能独立负责完整交付', score: 3 }
      ]
    },
    {
      id: 'result-role', line: 'result', domain: 'result',
      q: '你希望 AI 在你工作里承担什么角色？',
      options: [
        { label: '偶尔帮个忙', score: 0 },
        { label: '固定帮我处理一类事', score: 1 },
        { label: '替我跑一条流程', score: 2 },
        { label: '成为我的系统或团队一部分', score: 3 }
      ]
    }
  ];

  function emptyState() {
    return { draft: null, report: null };
  }

  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!data || typeof data !== 'object') return emptyState();
      return {
        draft: data.draft && typeof data.draft === 'object' ? data.draft : null,
        report: data.report && typeof data.report === 'object' ? data.report : null
      };
    } catch (e) {
      return emptyState();
    }
  }

  function write(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function getDraft() {
    var data = read();
    return data.draft;
  }

  function getReport() {
    var data = read();
    return data.report;
  }

  function saveDraft(draft) {
    var data = read();
    data.draft = draft;
    write(data);
    return draft;
  }

  function clearDraft() {
    var data = read();
    data.draft = null;
    write(data);
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function startDraft(force) {
    var data = read();
    if (!force && data.draft && !data.report) return data.draft;
    data.draft = { answers: {}, index: 0, startedAt: Date.now() };
    write(data);
    return data.draft;
  }

  function finish(answers) {
    var result = compute(answers);
    var data = read();
    data.draft = null;
    data.report = { result: result, answers: answers, completedAt: Date.now() };
    write(data);
    return result;
  }

  function compute(answers) {
    var sums = {};
    var counts = {};
    var targetLevel = 2;

    Object.keys(DOMAINS).forEach(function (key) { sums[key] = 0; counts[key] = 0; });

    QUESTIONS.forEach(function (q) {
      var idx = answers[q.id];
      if (typeof idx !== 'number' || !q.options[idx]) return;
      var opt = q.options[idx];
      if (q.target) { targetLevel = opt.target; return; }
      sums[q.domain] += opt.score;
      counts[q.domain] += 1;
    });

    var domains = {};
    Object.keys(DOMAINS).forEach(function (key) {
      domains[key] = counts[key] ? Math.round(sums[key] / (counts[key] * 3) * 100) : 0;
    });

    var line = {};
    Object.keys(LINE_DOMAINS).forEach(function (key) {
      var list = LINE_DOMAINS[key];
      var total = list.reduce(function (s, d) { return s + domains[d]; }, 0);
      line[key] = Math.round(total / list.length);
    });

    var overall = Math.round(line.skill * 0.4 + line.thinking * 0.35 + line.result * 0.25);
    var readyLevel = overall < 35 ? 1 : overall < 65 ? 2 : 3;
    var startLevel = Math.max(1, Math.min(targetLevel, readyLevel));
    var target = RESULT_LEVELS.filter(function (l) { return l.level === targetLevel; })[0] || RESULT_LEVELS[1];
    var missing = Object.keys(target.requirements).map(function (key) {
      return { key: key, name: DOMAINS[key], score: domains[key], need: target.requirements[key] };
    }).filter(function (item) { return item.score < item.need; });

    var ordered = Object.keys(DOMAINS).map(function (key) {
      return { key: key, name: DOMAINS[key], score: domains[key] };
    }).sort(function (a, b) { return a.score - b.score; });

    return {
      answers: answers,
      domains: domains,
      line: line,
      overall: overall,
      readyLevel: readyLevel,
      startLevel: startLevel,
      targetLevel: targetLevel,
      target: target,
      missing: missing,
      gaps: ordered.slice(0, 3),
      strongest: ordered[ordered.length - 1],
      completedAt: Date.now()
    };
  }

  function bindSettings() {
    var view = document.getElementById('viewAbilityReport');
    var retake = document.getElementById('retakeAbilityTest');
    if (view) {
      view.addEventListener('click', function () {
        location.href = getReport() ? 'report.html' : 'test.html';
      });
    }
    if (retake) {
      retake.addEventListener('click', function () {
        reset();
        location.href = 'test.html?retake=1';
      });
    }
  }

  window.Assessment = {
    questions: QUESTIONS,
    domains: DOMAINS,
    resultLevels: RESULT_LEVELS,
    lineDomains: LINE_DOMAINS,
    lineLabels: LINE_LABELS,
    getDraft: getDraft,
    getReport: getReport,
    saveDraft: saveDraft,
    clearDraft: clearDraft,
    reset: reset,
    startDraft: startDraft,
    finish: finish,
    compute: compute
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSettings);
  } else {
    bindSettings();
  }
})();