/* =========================================================
   个人学习地图 STUDY MAP
   三层路径：思维 / 技能 / 结果
   ========================================================= */
(function () {
  'use strict';

  var MAP = [
    {
      id: 'thinking', num: '01', title: '思维', sub: '判断 · 拆解 · 沉淀',
      layers: [
        {
          title: '学习三个底层思维',
          desc: '先建立判断、拆解和沉淀的底层能力。',
          courses: [
            'AI底层能力一【场景拆解思维】',
            'AI底层能力二【调动资源思维】',
            'AI底层能力三【数据沉淀思维】'
          ]
        },
        {
          title: '底层思维 + 各种场景应用',
          desc: '把思维放进真实的工作、生活和学习场景。',
          courses: [
            'AI先导必修课：构建你的AI实操学习系统',
            'AI学习第一步：设计你的行动地图',
            'OPC商业认知篇：一个人如何跑通一个最小商业MVP',
            'OPC个人管理篇：如何构建自己的个人时间系统'
          ]
        },
        {
          title: '将思维「打包」成工具',
          desc: '把判断和拆解固化成 skill、工作流和知识库。',
          courses: [
            '用AI：创建一个skill',
            '用扣子：搭建一个工作流',
            '给本地知识库：嵌入AI'
          ]
        }
      ]
    },
    {
      id: 'skill', num: '02', title: '技能', sub: '工具 · 接口 · 智能体',
      layers: [
        {
          title: '聊天机器人、生图、生音乐、生视频、转文字',
          desc: '先掌握最常用的几种 AI 工具用法。',
          courses: [
            '用扣子：创建对话机器人',
            '用AI：生图',
            '用AI：生成视频',
            '用AI：音频转文字',
            '用AI：创建一个skill'
          ]
        },
        {
          title: 'AI 智能体、API、各种 AI 接口',
          desc: '从单点工具走到能调用的智能体。',
          courses: [
            '安装你的AI工作智能体：codex',
            '把AI智能体：接入飞书',
            '给本地知识库：嵌入AI',
            '用AI：爬取信息',
            '用扣子：搭建一个工作流'
          ]
        },
        {
          title: 'DIY 个人 AI 智能系统',
          desc: '把工具、接口和流程拼成自己的系统。',
          courses: [
            '安装你的AI工作智能体：codex',
            '把AI智能体：接入飞书',
            '给本地知识库：嵌入AI',
            '用扣子：搭建一个工作流'
          ]
        }
      ]
    },
    {
      id: 'result', num: '03', title: '结果', sub: '场景 · 业务 · 决策',
      layers: [
        {
          title: '日常聊天、问题咨询、基础办公、日常创作',
          desc: '先用 AI 解决每天最具体的小事。',
          courses: [
            'AI学习第一步：设计你的行动地图',
            'AI先导必修课：构建你的AI实操学习系统',
            '用AI：生图',
            '用AI：生成视频'
          ]
        },
        {
          title: '商业验证、自我管理、拆业务、项目管理、设计工作流',
          desc: '把 AI 放进真实业务和项目里。',
          courses: [
            'OPC商业认知篇：一个人如何跑通一个最小商业MVP',
            'OPC个人管理篇：如何构建自己的个人时间系统',
            'AI底层能力一【场景拆解思维】',
            'AI底层能力二【调动资源思维】',
            '用扣子：搭建一个工作流'
          ]
        },
        {
          title: '从 AI 赋能场景，到 AI 赋能注意力',
          desc: '从你让 AI 协助你做事，到你只需要做决策。',
          courses: [
            'AI底层能力三【数据沉淀思维】',
            '给本地知识库：嵌入AI',
            '把AI智能体：接入飞书'
          ]
        }
      ]
    }
  ];

  MAP = [MAP[1], MAP[0], MAP[2]];

  var VISION = {
    industry: {
      kicker: 'INDUSTRY',
      title: 'AI行业发展',
      intro: 'AI 正在进入各个行业，新的服务、硬件和商业模式不断出现。这里先看产业正在发生什么，再判断自己可以站在哪个位置。',
      topics: ['各关联行业产业发展', 'AI服务、AI硬件', 'AI未来前瞻想象'],
      link: 'https://aihot.news/'
    },
    policy: {
      kicker: 'POLICY',
      title: 'AI政策趋势',
      intro: '政策、补贴、新闻和法律会决定 AI 能做什么、不能做什么。这里把变化中的规则和信号收在一起。',
      topics: ['AI相关的政策补贴', 'AI发展的前沿新闻', '围绕AI的法律发展'],
      link: ''
    },
    academic: {
      kicker: 'ACADEMIC',
      title: 'AI学术学科',
      intro: '再往下看一层，是模型、智能体和数据背后的原理。这里不要求马上学会，只先知道这些问题在研究什么。',
      topics: ['大模型训练底层原理', '智能体框架算法逻辑', '数据采集标注的方法'],
      link: ''
    },
    more: {
      kicker: 'MORE',
      title: '更多 AI 探索',
      intro: '主线之外还有很多新工具、新案例和新方向。这里留一个继续往外看的入口，不急着一次看完。',
      topics: ['新工具与新平台', '新案例与新玩法', '新方向与新问题'],
      link: ''
    }
  };

  var DONE_KEY = 'study-map-done-v1';
  var done = {};
  try {
    (JSON.parse(localStorage.getItem(DONE_KEY) || '[]') || []).forEach(function (title) { done[title] = 1; });
  } catch (e) { done = {}; }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function saveDone() {
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(Object.keys(done)));
    } catch (e) {}
  }

  function courseIndex() {
    var index = {};
    (window.COURSE_LIBRARY || []).forEach(function (group) {
      group.courses.forEach(function (course) { index[course.title] = course.url; });
    });
    return index;
  }

  var COURSE_STORE_KEY = 'study-map-courses-v1';

  function readCourseStore() {
    try {
      var data = JSON.parse(localStorage.getItem(COURSE_STORE_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }

  function saveLayerCourses(layer) {
    var store = readCourseStore();
    store[layer.id] = layer.courses;
    try { localStorage.setItem(COURSE_STORE_KEY, JSON.stringify(store)); } catch (e) {}
  }

  var COURSE_DETAILS_KEY = 'study-map-course-details-v1';
  function readCourseDetails() {
    try {
      var data = JSON.parse(localStorage.getItem(COURSE_DETAILS_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }
  var courseDetails = readCourseDetails();

  function saveCourseDetail(courseId, detail) {
    if (!courseId) return;
    courseDetails[courseId] = detail;
    try { localStorage.setItem(COURSE_DETAILS_KEY, JSON.stringify(courseDetails)); } catch (e) {}
  }

  var MULTI_COURSES = {
    '用AI：生图+调用API': [
      { label: '生图', url: 'https://wgd91.xetlk.com/s/4DhWZb' },
      { label: '生视频', url: 'https://wgd91.xetlk.com/s/1jJD88' },
      { label: '转文字', url: 'https://wgd91.xetlk.com/s/tGqb6' }
    ]
  };

  function getMultiCourse(title) {
    if (MULTI_COURSES[title]) return MULTI_COURSES[title];
    var normalized = String(title || '').replace(/\s+/g, '');
    if (normalized.indexOf('生图+调用API') >= 0) return MULTI_COURSES['用AI：生图+调用API'];
    return null;
  }

  function imageFileToData(file, done) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1400;
        var scale = Math.min(1, max / img.width, max / img.height);
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function normalizeMapCourses() {
    var index = courseIndex();
    var store = readCourseStore();
    MAP.forEach(function (col) {
      col.layers.forEach(function (layer, layerIndex) {
        layer.id = col.id + '-l' + layerIndex;
        var custom = store[layer.id];
        if (Array.isArray(custom)) {
          layer.courses = custom.map(function (course, courseIndex) {
            return {
              id: course.id || layer.id + '-c' + courseIndex,
              title: course.title || '未命名课程',
              url: course.url || index[course.title] || '#'
            };
          });
        } else {
          layer.courses = layer.courses.map(function (course, courseIndex) {
            var title = typeof course === 'string' ? course : course.title;
            return {
              id: layer.id + '-c' + courseIndex,
              title: title,
              url: (typeof course === 'object' && course.url) || index[title] || '#'
            };
          });
        }
      });
    });
  }

  normalizeMapCourses();

  function coursesHtml(col, layer) {
    var isGoal = col.id === 'result';
    return layer.courses.map(function (course) {
      var title = course.title;
      var isDone = !!done[title];
      return '<div class="sm-course' + (isDone ? ' is-done' : '') + '" data-course-id="' + esc(course.id) + '">' +
        '<div class="sm-course-link" role="button" tabindex="0" data-url="' + esc(course.url || '#') + '" data-title="' + esc(title) + '" data-group="' + esc(col.title) + '"' + (isGoal ? ' data-result-item="1"' : '') + '>' +
          '<span class="sm-course-title" data-ekey="study.map.course.' + esc(course.id) + '.title"' + (isGoal ? ' data-result-course="' + esc(course.id) + '" data-result-field="title"' : '') + '>' + esc(title) + '</span>' +
        '</div>' +
        '<button class="sm-check' + (isDone ? ' done' : '') + '" type="button" data-title="' + esc(title) + '" aria-pressed="' + isDone + '" aria-label="标记完成：' + esc(title) + '"></button>' +
        '<div class="map-sort map-edit-only">' +
          '<button type="button" data-map-move="up" data-course-id="' + esc(course.id) + '" aria-label="上移课程">↑</button>' +
          '<button type="button" data-map-move="down" data-course-id="' + esc(course.id) + '" aria-label="下移课程">↓</button>' +
        '</div>' +
        '<button class="map-del-course map-edit-only" type="button" data-map-del-course="' + esc(course.id) + '" aria-label="删除课程">×</button>' +
      '</div>';
    }).join('');
  }

  function layerHtml(col, layer, layerIndex) {
    var layerKey = 'study.map.' + col.id + '.layer.' + layerIndex;
    var isGoal = col.id === 'result';
    return '<article class="sm-layer" data-col="' + col.num + '" data-layer="' + layerIndex + '">' +
      '<div class="sm-layer-head">' +
        '<span class="sm-step" aria-hidden="true">' + String(layerIndex + 1).padStart(2, '0') + '</span>' +
        '<div><b data-ekey="' + esc(layerKey + '.title') + '"' + (isGoal ? ' data-result-layer="' + esc(layer.id) + '" data-result-field="title"' : '') + '>' + esc(layer.title) + '</b><p data-ekey="' + esc(layerKey + '.desc') + '"' + (isGoal ? ' data-result-layer="' + esc(layer.id) + '" data-result-field="desc"' : '') + '>' + esc(layer.desc) + '</p></div>' +
        '<div class="map-layer-actions map-edit-only">' +
          '<button class="map-add-course" type="button" data-map-add-course="' + esc(col.id) + '" data-layer-index="' + layerIndex + '">+ 课程</button>' +
        '</div>' +
        (isGoal ? '<button class="result-item-add" type="button" data-result-item-add="' + esc(layer.id) + '">+ 目标</button>' : '') +
      '</div>' +
      '<div class="sm-branch"><div class="sm-course-list">' + coursesHtml(col, layer) + '</div></div>' +
    '</article>';
  }

  function findCourseRecord(courseId) {
    var found = null;
    MAP.forEach(function (col) {
      col.layers.forEach(function (layer) {
        layer.courses.forEach(function (course) {
          if (course.id === courseId) found = { course: course, layer: layer, col: col };
        });
      });
    });
    return found;
  }

  function openCoursePopup(trigger, title, url, group, courseId) {
    var old = document.querySelector('.course-pop');
    if (old) old.remove();

    var saved = courseDetails[courseId] || {};
    var intro = typeof saved.intro === 'string' ? saved.intro : '这门课会围绕「' + title + '」展开，从真实任务出发，学完就能用。';
    var rawExamples = Array.isArray(saved.examples) ? saved.examples : [];
    var examples = rawExamples.map(function (item) {
      if (typeof item === 'string') return { text: item, image: '' };
      return { text: item && item.text ? item.text : '', image: item && item.image ? item.image : '' };
    });
    var link = Object.prototype.hasOwnProperty.call(saved, 'url') ? saved.url : (url === '#' ? '' : url);
    var editing = document.body.classList.contains('editing');
    var multi = getMultiCourse(title);
    var detail = {
      intro: intro,
      examples: examples,
      url: Object.prototype.hasOwnProperty.call(saved, 'url') ? saved.url : undefined
    };
    var hasExamples = examples.length > 0;

    var examplesBlock = '';
    if (hasExamples || editing) {
      examplesBlock = '<div class="cp-examples-block">' +
        (hasExamples ? '<button class="cp-examples-toggle" type="button" aria-expanded="' + (editing ? 'true' : 'false') + '">看看示例' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>' : '') +
        '<div class="cp-examples' + (editing ? ' is-open' : '') + '">' +
          '<div class="cp-example-list"></div>' +
          (editing ? '<button class="cp-example-add" type="button">+ 示例</button>' : '') +
        '</div>' +
      '</div>';
    }

    var popup = document.createElement('div');
    popup.className = 'course-pop';
    popup.innerHTML = '<div class="cp-backdrop"></div>' +
      '<article class="cp-card" role="dialog" aria-modal="true" aria-label="课程介绍">' +
        '<button class="cp-close" type="button" aria-label="关闭">×</button>' +
        '<p class="cp-kicker">COURSE / ' + esc(group) + '</p>' +
        '<h3' + (editing ? ' contenteditable="plaintext-only" spellcheck="false" data-cp-title' : '') + '>' + esc(title) + '</h3>' +
        (editing ? '<p class="cp-edit-note">编辑模式：标题、介绍、示例和链接都可以直接改，自动保存。</p>' : '') +
        '<p class="cp-intro"' + (editing ? ' contenteditable="plaintext-only" spellcheck="false"' : '') + '>' + esc(intro) + '</p>' +
        examplesBlock +
        (editing && multi ? '<p class="cp-multi-note">这个课程固定有三个入口，链接不在这里改。</p>' : '') +
        (editing && !multi ? '<label class="cp-link-field"><span>课程链接（留空显示制作中）</span><input class="cp-link-input" type="text" value="' + esc(link) + '" placeholder="https://..."></label>' : '') +
        '<div class="cp-foot"></div>' +
      '</article>';
    document.body.appendChild(popup);

    var card = popup.querySelector('.cp-card');
    var introEl = popup.querySelector('.cp-intro');
    var titleEl = popup.querySelector('[data-cp-title]');
    var toggle = popup.querySelector('.cp-examples-toggle');
    var examplesBox = popup.querySelector('.cp-examples');
    var exampleList = popup.querySelector('.cp-example-list');
    var addExample = popup.querySelector('.cp-example-add');
    var linkInput = popup.querySelector('.cp-link-input');
    var foot = popup.querySelector('.cp-foot');

    function persistDetail() {
      detail.intro = introEl ? introEl.textContent.replace(/\s+$/, '') : intro;
      detail.examples = examples;
      saveCourseDetail(courseId, {
        intro: detail.intro,
        examples: examples,
        url: link
      });
    }

    function renderExamples() {
      if (!exampleList) return;
      if (toggle) toggle.style.display = examples.length ? '' : 'none';
      if (!examples.length) {
        exampleList.innerHTML = '<p class="cp-example-empty">' + (editing ? '还没有示例，点下面 + 示例 添加。' : '暂无示例。') + '</p>';
        return;
      }
      exampleList.innerHTML = examples.map(function (item, index) {
        var image = item.image ? '<img class="cp-example-image" src="' + esc(item.image) + '" alt="示例图片">' : '';
        var actions = editing ? '<div class="cp-example-actions">' +
          '<button class="cp-example-image-btn" type="button" data-example-upload="' + index + '">' + (item.image ? '换图' : '上传图片') + '</button>' +
          (item.image ? '<button class="cp-example-image-del" type="button" data-example-remove-image="' + index + '">移除图片</button>' : '') +
          '<button class="cp-example-del" type="button" data-example-del="' + index + '" aria-label="删除示例">×</button>' +
          '<input type="file" class="cp-example-file" data-example-file="' + index + '" accept="image/*" hidden>' +
        '</div>' : '';
        return '<div class="cp-example">' +
          '<div class="cp-example-main">' +
            '<span class="cp-example-text"' + (editing ? ' contenteditable="plaintext-only" spellcheck="false" data-example-index="' + index + '"' : '') + '>' + esc(item.text) + '</span>' +
            image +
          '</div>' +
          actions +
        '</div>';
      }).join('');
    }

    function renderFoot() {
      if (multi) {
        foot.innerHTML = '<div class="cp-multi">' +
          '<p class="cp-multi-label">三节专题课</p>' +
          '<div class="cp-multi-grid">' + multi.map(function (item, index) {
            return '<a class="cp-multi-btn" href="' + esc(item.url) + '" target="_blank" rel="noopener">' +
              '<span class="cp-multi-index">0' + (index + 1) + '</span>' +
              '<span class="cp-multi-title">' + esc(item.label) + '</span>' +
              '<span class="cp-multi-arrow">→</span>' +
            '</a>';
          }).join('') + '</div>' +
        '</div>';
        return;
      }
      if (link) {
        foot.innerHTML = '<a class="btn btn-lime cp-start" href="' + esc(link) + '" target="_blank" rel="noopener">开始学习</a>';
      } else {
        foot.innerHTML = '<p class="cp-soon">课程正在制作中，关于这块如果有实操和疑问可以先直接 <b>1v1 咨询小P</b></p>';
      }
    }

    renderExamples();
    renderFoot();

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = examplesBox.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    if (introEl && editing) {
      introEl.addEventListener('input', persistDetail);
    }

    if (titleEl && editing && courseId) {
      function applyCourseTitle(next, persistEdit) {
        if (!next) return;
        var record = findCourseRecord(courseId);
        if (record) {
          record.course.title = next;
          saveLayerCourses(record.layer);
          title = next;
        }
        Array.prototype.forEach.call(document.querySelectorAll('.sm-course[data-course-id="' + courseId + '"]'), function (row) {
          var label = row.querySelector('.sm-course-title');
          if (label) label.textContent = next;
          var link = row.querySelector('.sm-course-link');
          if (link) link.setAttribute('data-title', next);
          var check = row.querySelector('.sm-check');
          if (check) {
            check.setAttribute('data-title', next);
            check.setAttribute('aria-label', '标记完成：' + next);
          }
        });
        if (persistEdit && window.CaseEditor && window.CaseEditor.set) {
          window.CaseEditor.set('study.map.course.' + courseId + '.title', next);
        }
      }
      titleEl.addEventListener('input', function () {
        applyCourseTitle(titleEl.textContent.replace(/\s+$/, ''), false);
      });
      titleEl.addEventListener('blur', function () {
        var next = titleEl.textContent.replace(/\s+$/, '');
        if (!next) { titleEl.textContent = title; return; }
        applyCourseTitle(next, true);
      });
    }

    if (linkInput) {
      linkInput.addEventListener('input', function () {
        link = linkInput.value.trim();
        persistDetail();
        renderFoot();
      });
    }

    if (addExample) {
      addExample.addEventListener('click', function () {
        examples.push({ text: '', image: '' });
        if (examplesBox) examplesBox.classList.add('is-open');
        if (toggle) {
          toggle.style.display = '';
          toggle.setAttribute('aria-expanded', 'true');
        }
        renderExamples();
        persistDetail();
        var fields = exampleList.querySelectorAll('.cp-example-text');
        if (fields.length) fields[fields.length - 1].focus();
      });
    }

    if (exampleList) {
      exampleList.addEventListener('input', function (e) {
        var field = e.target.closest('[data-example-index]');
        if (!field) return;
        var index = Number(field.getAttribute('data-example-index'));
        examples[index].text = field.textContent.replace(/\s+$/, '');
        persistDetail();
      });
      exampleList.addEventListener('click', function (e) {
        var upload = e.target.closest('[data-example-upload]');
        if (upload) {
          var uploadIndex = Number(upload.getAttribute('data-example-upload'));
          var fileInput = exampleList.querySelector('[data-example-file="' + uploadIndex + '"]');
          if (fileInput) fileInput.click();
          return;
        }
        var removeImage = e.target.closest('[data-example-remove-image]');
        if (removeImage) {
          var imageIndex = Number(removeImage.getAttribute('data-example-remove-image'));
          examples[imageIndex].image = '';
          renderExamples();
          persistDetail();
          return;
        }
        var del = e.target.closest('[data-example-del]');
        if (!del) return;
        var index = Number(del.getAttribute('data-example-del'));
        examples.splice(index, 1);
        renderExamples();
        persistDetail();
      });
      exampleList.addEventListener('change', function (e) {
        var input = e.target.closest('[data-example-file]');
        if (!input || !input.files || !input.files[0]) return;
        var index = Number(input.getAttribute('data-example-file'));
        imageFileToData(input.files[0], function (data) {
          if (!examples[index]) return;
          examples[index].image = data;
          renderExamples();
          persistDetail();
        });
      });
    }

    var rect = trigger.getBoundingClientRect();
    var dx = rect.left + rect.width / 2 - window.innerWidth / 2;
    var dy = rect.top + rect.height / 2 - window.innerHeight / 2;
    card.style.setProperty('--dx', dx + 'px');
    card.style.setProperty('--dy', dy + 'px');

    window.requestAnimationFrame(function () {
      popup.classList.add('is-open');
    });

    function close() {
      popup.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      window.setTimeout(function () { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 520);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    popup.querySelector('.cp-backdrop').addEventListener('click', close);
    popup.querySelector('.cp-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  }

  function findLayerContext(el) {
    var layerEl = el.closest('.sm-layer');
    var colEl = el.closest('.sm-col');
    if (!layerEl || !colEl) return null;
    var ci = Number(colEl.getAttribute('data-col'));
    var li = Number(layerEl.getAttribute('data-layer'));
    var col = MAP[ci];
    var layer = col && col.layers[li];
    if (!col || !layer) return null;
    return { layerEl: layerEl, colEl: colEl, col: col, ci: ci, li: li, layer: layer };
  }

  function refreshMapEditor() {
    if (window.CaseEditor && window.CaseEditor.refresh) window.CaseEditor.refresh();
  }

  function addCourseToLayer(btn) {
    var ctx = findLayerContext(btn);
    if (!ctx) return;
    var title = window.prompt('课程名称', '新课程');
    if (!title) return;
    title = title.trim();
    if (!title) return;
    var url = window.prompt('课程链接（可留空）', '');
    if (url === null) url = '';
    ctx.layer.courses.push({
      id: 'course-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title: title,
      url: url.trim() || '#'
    });
    ctx.layerEl.classList.add('open');
    ctx.layerEl.querySelector('.sm-course-list').innerHTML = coursesHtml(ctx.col, ctx.layer);
    saveLayerCourses(ctx.layer);
    refreshMapEditor();
  }

  function removeCourseFromLayer(btn) {
    var ctx = findLayerContext(btn);
    if (!ctx) return;
    var id = btn.getAttribute('data-map-del-course');
    var i = -1;
    ctx.layer.courses.forEach(function (course, index) { if (course.id === id) i = index; });
    if (i < 0) return;
    if (!window.confirm('删除这门课程？')) return;
    ctx.layer.courses.splice(i, 1);
    ctx.layerEl.querySelector('.sm-course-list').innerHTML = coursesHtml(ctx.col, ctx.layer);
    saveLayerCourses(ctx.layer);
    refreshMapEditor();
  }

  function moveCourseInLayer(btn) {
    var ctx = findLayerContext(btn);
    if (!ctx) return;
    var id = btn.getAttribute('data-course-id');
    var dir = btn.getAttribute('data-map-move') === 'up' ? -1 : 1;
    var courses = ctx.layer.courses;
    var i = -1;
    courses.forEach(function (course, index) { if (course.id === id) i = index; });
    var j = i + dir;
    if (i < 0 || j < 0 || j >= courses.length) return;
    var temp = courses[i];
    courses[i] = courses[j];
    courses[j] = temp;
    ctx.layerEl.querySelector('.sm-course-list').innerHTML = coursesHtml(ctx.col, ctx.layer);
    saveLayerCourses(ctx.layer);
    refreshMapEditor();
  }

  function getResultColumn() {
    var col = null;
    MAP.forEach(function (item) { if (item.id === 'result') col = item; });
    return col;
  }

  function getResultColumnEl() {
    return document.querySelector('.sm-col[data-id="result"]');
  }

  function getResultLayerEl(layerIndex) {
    var colEl = getResultColumnEl();
    return colEl ? colEl.querySelector('.sm-layer[data-layer="' + layerIndex + '"]') : null;
  }

  function findResultLayer(layerId) {
    var col = getResultColumn();
    if (!col) return null;
    var found = null;
    col.layers.forEach(function (layer) { if (layer.id === layerId) found = layer; });
    return found;
  }

  function openResultItemPopup(layerId, courseId) {
    var col = getResultColumn();
    var layer = findResultLayer(layerId);
    if (!col || !layer) return;
    var courseIndex = -1;
    layer.courses.forEach(function (course, index) { if (course.id === courseId) courseIndex = index; });
    var existing = courseIndex >= 0 ? layer.courses[courseIndex] : null;
    var layerIndex = col.layers.indexOf(layer);
    var layerEl = getResultLayerEl(layerIndex);
    var row = layerEl && courseId ? layerEl.querySelector('.sm-course[data-course-id="' + courseId + '"]') : null;
    var domTitle = row ? row.querySelector('.sm-course-title').textContent.replace(/\s+$/, '') : '';
    if (existing && domTitle) existing.title = domTitle;

    var pop = document.createElement('div');
    pop.className = 'goal-pop';
    pop.innerHTML = '<div class="goal-backdrop"></div>' +
      '<article class="goal-card" role="dialog" aria-modal="true" aria-label="' + (existing ? '编辑目标' : '新增目标') + '">' +
        '<button class="goal-close" type="button" aria-label="关闭">×</button>' +
        '<p class="goal-kicker">GOAL / ' + (existing ? 'EDIT' : 'NEW') + '</p>' +
        '<h3>' + (existing ? '编辑目标' : '新增目标') + '</h3>' +
        '<label class="goal-field"><span>目标</span><input type="text" class="goal-title-input" value="' + esc(existing ? existing.title : '') + '" placeholder="写下一个具体目标"></label>' +
        '<label class="goal-field"><span>具体内容</span><textarea class="goal-note-input" rows="4" placeholder="这个目标具体要做什么，做到什么程度">' + esc(existing && existing.desc ? existing.desc : '') + '</textarea></label>' +
        '<div class="goal-foot">' +
          (existing ? '<button class="goal-delete" type="button">删除</button>' : '') +
          '<button class="goal-save" type="button">保存</button>' +
        '</div>' +
      '</article>';
    document.body.appendChild(pop);
    window.requestAnimationFrame(function () { pop.classList.add('is-open'); });

    function close() {
      pop.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      window.setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 260);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    pop.querySelector('.goal-backdrop').addEventListener('click', close);
    pop.querySelector('.goal-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    var titleInput = pop.querySelector('.goal-title-input');
    var noteInput = pop.querySelector('.goal-note-input');
    window.setTimeout(function () { titleInput.focus(); }, 80);

    function refreshList() {
      var layerIndex = col.layers.indexOf(layer);
      var layerEl = getResultLayerEl(layerIndex);
      if (!layerEl) return;
      var list = layerEl.querySelector('.sm-course-list');
      if (list) list.innerHTML = coursesHtml(col, layer);
      layerEl.classList.add('open');
    }

    pop.querySelector('.goal-save').addEventListener('click', function () {
      var title = titleInput.value.trim();
      if (!title) { titleInput.focus(); return; }
      var desc = noteInput.value.trim();
      if (existing) {
        existing.title = title;
        existing.desc = desc;
        if (window.CaseEditor && window.CaseEditor.set) {
          window.CaseEditor.set('study.map.course.' + existing.id + '.title', title);
        }
      } else {
        layer.courses.push({
          id: 'goal-' + Date.now(),
          title: title,
          desc: desc,
          url: '#'
        });
      }
      saveLayerCourses(layer);
      refreshList();
      close();
    });

    var del = pop.querySelector('.goal-delete');
    if (del) {
      del.addEventListener('click', function () {
        if (!window.confirm('删除这个目标？')) return;
        if (window.CaseEditor && window.CaseEditor.remove && existing) {
          window.CaseEditor.remove('study.map.course.' + existing.id + '.title');
        }
        layer.courses.splice(courseIndex, 1);
        saveLayerCourses(layer);
        refreshList();
        close();
      });
    }
  }

  function syncMapTextFromDom() {
    Array.prototype.forEach.call(document.querySelectorAll('#studyMap .sm-col'), function (colEl) {
      var ci = Number(colEl.getAttribute('data-col'));
      var col = MAP[ci];
      if (!col) return;
      var colTitle = colEl.querySelector('.sm-col-title h3');
      var colSub = colEl.querySelector('.sm-col-title p');
      if (colTitle) col.title = colTitle.textContent.replace(/\s+$/, '');
      if (colSub) col.sub = colSub.textContent.replace(/\s+$/, '');

      Array.prototype.forEach.call(colEl.querySelectorAll('.sm-layer'), function (layerEl) {
        var li = Number(layerEl.getAttribute('data-layer'));
        var layer = col.layers[li];
        if (!layer) return;
        var layerTitle = layerEl.querySelector('.sm-layer-head b');
        var layerDesc = layerEl.querySelector('.sm-layer-head p');
        if (layerTitle) layer.title = layerTitle.textContent.replace(/\s+$/, '');
        if (layerDesc) layer.desc = layerDesc.textContent.replace(/\s+$/, '');
        Array.prototype.forEach.call(layerEl.querySelectorAll('.sm-course[data-course-id]'), function (row) {
          var courseId = row.getAttribute('data-course-id');
          var courseTitle = row.querySelector('.sm-course-title');
          if (!courseTitle) return;
          layer.courses.forEach(function (course) {
            if (course.id === courseId) course.title = courseTitle.textContent.replace(/\s+$/, '');
          });
        });
      });
    });
  }

  function syncResultTextFromDom() {
    var col = getResultColumn();
    if (!col) return;
    col.layers.forEach(function (layer, index) {
      var layerEl = getResultLayerEl(index);
      if (!layerEl) return;
      var titleEl = layerEl.querySelector('.sm-layer-head b');
      var descEl = layerEl.querySelector('.sm-layer-head p');
      if (titleEl) layer.title = titleEl.textContent.replace(/\s+$/, '');
      if (descEl) layer.desc = descEl.textContent.replace(/\s+$/, '');
      layer.courses.forEach(function (course) {
        var row = layerEl.querySelector('.sm-course[data-course-id="' + course.id + '"]');
        if (!row) return;
        var courseTitle = row.querySelector('.sm-course-title');
        if (courseTitle) course.title = courseTitle.textContent.replace(/\s+$/, '');
      });
    });
  }

  function render() {
    var host = document.getElementById('studyMap');
    if (!host) return;
    var index = courseIndex();

    var downChevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
    var rightChevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

    host.innerHTML = '<div class="sm-grid">' + MAP.map(function (col, ci) {
      return '<div class="sm-col' + (col.id === 'thinking' ? ' is-open' : '') + '" data-col="' + ci + '" data-id="' + esc(col.id) + '">' +
        '<button class="sm-col-toggle" type="button" aria-expanded="' + (col.id === 'thinking') + '">' +
          '<span class="sm-col-num" aria-hidden="true"></span>' +
          '<span class="sm-col-title"><h3 data-ekey="study.map.' + esc(col.id) + '.title">' + esc(col.title) + '</h3><p data-ekey="study.map.' + esc(col.id) + '.sub">' + esc(col.sub) + '</p></span>' +
          '<span class="sm-col-chevron">' + rightChevron + '</span>' +
        '</button>' +
        '<div class="sm-col-body">' +
          '<div class="sm-layers">' + layerHtml(col, col.layers[0], 0) + '</div>' +
          '<button class="sm-layer-toggle" type="button" aria-label="展开下一层">' + downChevron + '</button>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    document.addEventListener('focusout', function (e) {
      var layerField = e.target.closest && e.target.closest('[data-result-layer]');
      if (layerField) {
        var layerId = layerField.getAttribute('data-result-layer');
        var field = layerField.getAttribute('data-result-field');
        var layer = findResultLayer(layerId);
        if (!layer) return;
        var text = layerField.textContent.replace(/\s+$/, '');
        if (field === 'title') layer.title = text;
        if (field === 'desc') layer.desc = text;
        return;
      }
      var courseField = e.target.closest && e.target.closest('[data-result-course]');
      if (courseField) {
        var courseId = courseField.getAttribute('data-result-course');
        var col = getResultColumn();
        if (!col) return;
        var text2 = courseField.textContent.replace(/\s+$/, '');
        col.layers.forEach(function (layer) {
          layer.courses.forEach(function (course) {
            if (course.id === courseId) course.title = text2;
          });
        });
        return;
      }
    });

    host.addEventListener('click', function (e) {
      if (document.body.classList.contains('editing') && e.target.closest('[data-ekey]')) return;

      var resultItemAdd = e.target.closest('[data-result-item-add]');
      if (resultItemAdd) {
        e.stopPropagation();
        openResultItemPopup(resultItemAdd.getAttribute('data-result-item-add'), null);
        return;
      }

      var addCourse = e.target.closest('[data-map-add-course]');
      if (addCourse) {
        e.stopPropagation();
        addCourseToLayer(addCourse);
        return;
      }

      var delCourse = e.target.closest('[data-map-del-course]');
      if (delCourse) {
        e.stopPropagation();
        removeCourseFromLayer(delCourse);
        return;
      }

      var moveCourse = e.target.closest('[data-map-move]');
      if (moveCourse) {
        e.stopPropagation();
        moveCourseInLayer(moveCourse);
        return;
      }

      var course = e.target.closest('.sm-course-link');
      if (course) {
        e.stopPropagation();
        if (course.getAttribute('data-result-item') === '1') {
          var itemLayerEl = course.closest('.sm-layer');
          var itemColEl = course.closest('.sm-col');
          var itemColIndex = Number(itemColEl.getAttribute('data-col'));
          var itemLayerIndex = Number(itemLayerEl.getAttribute('data-layer'));
          var itemLayer = MAP[itemColIndex] && MAP[itemColIndex].layers[itemLayerIndex];
          var itemRow = course.closest('.sm-course');
          if (itemLayer && itemRow) openResultItemPopup(itemLayer.id, itemRow.getAttribute('data-course-id'));
          return;
        }
        var courseRow = course.closest('.sm-course');
        var courseId = courseRow ? courseRow.getAttribute('data-course-id') : '';
        var courseTitleEl = course.querySelector('.sm-course-title');
        var currentTitle = courseTitleEl ? courseTitleEl.textContent.replace(/\s+$/, '') : course.getAttribute('data-title');
        if (!currentTitle) currentTitle = course.getAttribute('data-title');
        openCoursePopup(course, currentTitle, course.getAttribute('data-url'), course.getAttribute('data-group'), courseId);
        return;
      }

      var check = e.target.closest('.sm-check');
      if (check) {
        e.stopPropagation();
        var title = check.getAttribute('data-title');
        if (done[title]) delete done[title];
        else done[title] = 1;
        check.classList.toggle('done', !!done[title]);
        check.setAttribute('aria-pressed', String(!!done[title]));
        var row = check.closest('.sm-course');
        if (row) row.classList.toggle('is-done', !!done[title]);
        saveDone();
        return;
      }

      var colToggle = e.target.closest('.sm-col-toggle');
      if (colToggle) {
        var colEl = colToggle.closest('.sm-col');
        var open = !colEl.classList.contains('is-open');
        colEl.classList.toggle('is-open', open);
        colToggle.setAttribute('aria-expanded', String(open));
        return;
      }

      var layerToggle = e.target.closest('.sm-layer-toggle');
      if (layerToggle) {
        var colEl2 = layerToggle.closest('.sm-col');
        var ci = Number(colEl2.getAttribute('data-col'));
        var layersBox = colEl2.querySelector('.sm-layers');
        var current = layersBox.querySelectorAll('.sm-layer').length;
        var all = MAP[ci].layers.length;

        if (layerToggle.classList.contains('is-up')) {
          if (current > 1 && layersBox.getAttribute('data-collapsing') !== '1') {
            var lastLayer = layersBox.lastElementChild;
            layersBox.setAttribute('data-collapsing', '1');
            lastLayer.style.maxHeight = lastLayer.scrollHeight + 'px';
            void lastLayer.offsetHeight;
            lastLayer.classList.add('is-leaving');
            window.setTimeout(function () {
              if (lastLayer.parentNode) lastLayer.parentNode.removeChild(lastLayer);
              layersBox.removeAttribute('data-collapsing');
              if (layersBox.querySelectorAll('.sm-layer').length <= 1) {
                layerToggle.classList.remove('is-up');
                layerToggle.setAttribute('aria-label', '展开下一层');
              }
            }, 320);
          }
          return;
        }

        if (current < all) {
          layersBox.insertAdjacentHTML('beforeend', layerHtml(MAP[ci], MAP[ci].layers[current], current, index));
          layersBox.lastElementChild.classList.add('is-new');
          if (window.CaseEditor && window.CaseEditor.refresh) window.CaseEditor.refresh();
          if (current + 1 >= all) {
            layerToggle.classList.add('is-up');
            layerToggle.setAttribute('aria-label', '收起一层');
          }
        }
        return;
      }

      if (e.target.closest('a')) return;
      var layer = e.target.closest('.sm-layer');
      if (layer) layer.classList.toggle('open');
    });
  }

  function renderVisionDetail(id, box) {
    var item = VISION[id];
    if (!item || !box) return;

    box.innerHTML = '<p class="vd-intro" data-ekey="vision.' + esc(id) + '.intro">' + esc(item.intro) + '</p>' +
      (item.link ? '<a class="vd-link" href="' + esc(item.link) + '" target="_blank" rel="noopener">前往探索 ↗</a>' : '') +
      '<div class="vd-topics">' +
        item.topics.map(function (topic, i) {
          return '<div class="vd-topic"><i></i><span data-ekey="vision.' + esc(id) + '.topic.' + i + '">' + esc(topic) + '</span></div>';
        }).join('') +
      '</div>';

    box.classList.add('is-open');
    if (window.CaseEditor && window.CaseEditor.refresh) window.CaseEditor.refresh();
  }

  function initVision() {
    var card = document.getElementById('visionCard');
    var eye = document.getElementById('visionEye');
    var body = document.getElementById('visionBody');
    var blocks = document.querySelectorAll('.vision-block');
    if (!card || !eye || !body) return;

    body.setAttribute('aria-hidden', 'true');

    function setOpen(open) {
      card.classList.toggle('is-open', open);
      body.classList.toggle('is-open', open);
      body.setAttribute('aria-hidden', String(!open));
      eye.classList.toggle('is-open', open);
      eye.setAttribute('aria-expanded', String(open));
      if (!open) {
        blocks.forEach(function (block) { block.classList.remove('is-active'); });
        document.querySelectorAll('.vision-detail').forEach(function (detail) {
          detail.classList.remove('is-open');
          detail.innerHTML = '';
        });
      }
    }

    eye.addEventListener('click', function () {
      setOpen(!card.classList.contains('is-open'));
    });

    blocks.forEach(function (block) {
      block.addEventListener('click', function (e) {
        if (document.body.classList.contains('editing') && e.target.closest('[data-ekey]')) return;
        var id = block.getAttribute('data-vision');
        var col = block.closest('.vision-col');
        var detail = col ? col.querySelector('.vision-detail') : null;
        if (!detail) return;

        if (detail.classList.contains('is-open')) {
          detail.classList.remove('is-open');
          detail.innerHTML = '';
          block.classList.remove('is-active');
          return;
        }

        block.classList.add('is-active');
        renderVisionDetail(id, detail);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && card.classList.contains('is-open')) setOpen(false);
    });
  }

  function exportActionMapImage(sheet, btn) {
    if (!btn) return;
    syncMapTextFromDom();
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '导出中…';

    var W = 1600;
    var scale = 2;
    var margin = 64;
    var gap = 28;
    var colW = (W - margin * 2 - gap * 2) / 3;
    var root = sheet ? window.getComputedStyle(sheet) : window.getComputedStyle(document.documentElement);
    function css(name, fallback) {
      var value = root.getPropertyValue(name).trim();
      return value || fallback;
    }
    var bg = css('--bg', '#F3F3ED');
    var ink = css('--ink', '#111110');
    var muted = css('--muted', '#77776C');
    var line = css('--line', 'rgba(17,17,16,.14)');
    var lime = css('--lime', '#C9F14F');
    var limeInk = '#101208';
    var dark = !!(sheet && sheet.closest('.action-map') && sheet.closest('.action-map').classList.contains('is-dark'));
    var accent = css('--am-accent', dark ? '#C9F14F' : '#A95842');
    var cardBg = dark ? 'rgba(243,243,237,.025)' : 'rgba(17,17,16,.018)';

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var bodyFont = '"Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';
    var displayFont = '"Arial Black","Microsoft YaHei","PingFang SC",sans-serif';
    function font(weight, size, family) { ctx.font = weight + ' ' + size + 'px ' + (family || bodyFont); }
    function wrap(text, weight, size, maxWidth, family) {
      font(weight, size, family);
      var chars = String(text || '').split('');
      var lines = [];
      var cur = '';
      chars.forEach(function (ch) {
        if (ctx.measureText(cur + ch).width > maxWidth && cur) {
          lines.push(cur);
          cur = ch;
        } else {
          cur += ch;
        }
      });
      if (cur || !lines.length) lines.push(cur);
      return lines;
    }
    function fit(text, weight, size, maxWidth, family) {
      font(weight, size, family);
      var value = String(text || '');
      if (ctx.measureText(value).width <= maxWidth) return value;
      while (value.length && ctx.measureText(value + '…').width > maxWidth) value = value.slice(0, -1);
      return value + '…';
    }
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }
    }

    var layouts = MAP.map(function (col) {
      var layers = col.layers.map(function (layer) {
        var titleLines = wrap(layer.title, '700', 15, colW - 40, displayFont);
        var descLines = wrap(layer.desc, '400', 9.5, colW - 40);
        var h = 18 + titleLines.length * 21 + 4 + descLines.length * 15 + 10 +
          layer.courses.length * 32 + 16;
        return { layer: layer, titleLines: titleLines, descLines: descLines, h: h };
      });
      var total = layers.reduce(function (sum, item) { return sum + item.h + 12; }, 0);
      return { col: col, layers: layers, height: total };
    });

    var headerH = 158;
    var maxHeight = Math.max.apply(null, layouts.map(function (item) { return item.height; }));
    var H = headerH + 22 + maxHeight + 80;
    canvas.width = W * scale;
    canvas.height = H * scale;
    ctx.scale(scale, scale);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    font('400', 8.5, undefined);
    ctx.fillStyle = accent;
    ctx.fillText('STUDY MAP / 2026  ·  1X100 AI航海研习社', margin, 48);
    font('900', 38, displayFont);
    ctx.fillStyle = ink;
    ctx.fillText('我的学习地图', margin, 94);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, 122);
    ctx.lineTo(W - margin, 122);
    ctx.stroke();

    layouts.forEach(function (entry, ci) {
      var x = margin + ci * (colW + gap);
      var y = headerH + 12;
      font('900', 24, displayFont);
      ctx.fillStyle = accent;
      ctx.fillRect(x, y - 19, 8, 8);
      ctx.fillStyle = ink;
      ctx.fillText(entry.col.title, x + 16, y);
      font('400', 9.5);
      ctx.fillStyle = muted;
      ctx.fillText(fit(entry.col.sub, '400', 9.5, colW - 20), x, y + 18);
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(x, y + 30);
      ctx.lineTo(x + colW, y + 30);
      ctx.stroke();

      var ly = y + 44;
      entry.layers.forEach(function (item) {
        var layer = item.layer;
        rr(x, ly, colW, item.h, 10);
        ctx.fillStyle = cardBg;
        ctx.fill();
        ctx.strokeStyle = line;
        ctx.stroke();

        var tx = x + 18;
        var ty = ly + 22;
        font('700', 15, displayFont);
        ctx.fillStyle = ink;
        item.titleLines.forEach(function (line) {
          ctx.fillText(line, tx, ty);
          ty += 21;
        });
        ty += 1;
        font('400', 9.5);
        ctx.fillStyle = muted;
        item.descLines.forEach(function (line) {
          ctx.fillText(line, tx, ty);
          ty += 15;
        });
        ty += 9;

        layer.courses.forEach(function (course) {
          var isDone = !!done[course.title];
          rr(x + 18, ty, colW - 36, 27, 6);
          if (isDone) {
            ctx.fillStyle = lime;
            ctx.fill();
            ctx.strokeStyle = lime;
          } else {
            ctx.fillStyle = dark ? 'rgba(243,243,237,.02)' : 'rgba(255,255,255,.45)';
            ctx.fill();
            ctx.strokeStyle = line;
          }
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + 30, ty + 13.5, 6.5, 0, Math.PI * 2);
          ctx.strokeStyle = isDone ? limeInk : accent;
          ctx.stroke();
          if (isDone) {
            font('700', 7);
            ctx.fillStyle = limeInk;
            ctx.fillText('✓', x + 27.3, ty + 16);
          }
          font('400', 10);
          ctx.fillStyle = isDone ? limeInk : ink;
          ctx.fillText(fit(course.title, '400', 10, colW - 78), x + 44, ty + 17);
          ty += 32;
        });

        ly += item.h + 12;
      });
    });

    function doneExport() {
      btn.disabled = false;
      btn.textContent = originalText;
    }
    canvas.toBlob(function (blob) {
      if (!blob) { doneExport(); return; }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '我的学习地图.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      doneExport();
    }, 'image/png');
  }

  function initActionMap() {
    var btn = document.getElementById('actionMapBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (document.querySelector('.action-map')) return;
      syncMapTextFromDom();

      var columns = MAP.map(function (col) {
        var layers = col.layers.map(function (layer) {
          var courses = layer.courses.map(function (course) {
            var isDone = !!done[course.title];
            return '<div class="am-course' + (isDone ? ' is-done' : '') + '">' +
              '<span class="am-dot">' + (isDone ? '✓' : '○') + '</span>' +
              '<span>' + esc(course.title) + '</span>' +
            '</div>';
          }).join('');
          return '<div class="am-layer">' +
            '<div class="am-layer-head"><b>' + esc(layer.title) + '</b><p>' + esc(layer.desc) + '</p></div>' +
            '<div class="am-courses">' + (courses || '<p class="am-empty">这一层还没有课程。</p>') + '</div>' +
          '</div>';
        }).join('');
        return '<section class="am-col">' +
          '<header><h3>' + esc(col.title) + '</h3><p>' + esc(col.sub) + '</p></header>' +
          '<div class="am-layers">' + layers + '</div>' +
        '</section>';
      }).join('');

      var layer = document.createElement('div');
      layer.className = 'action-map';
      if (document.documentElement.getAttribute('data-theme') === 'dark') layer.classList.add('is-dark');
      layer.innerHTML = '<div class="am-backdrop"></div>' +
        '<article class="am-sheet" role="dialog" aria-modal="true" aria-label="我的学习地图">' +
          '<header class="am-head">' +
            '<div><p class="am-kicker">STUDY MAP / 2026 · 1X100 AI航海研习社</p><h2>我的学习地图</h2></div>' +
            '<div class="am-actions">' +
              '<button class="am-tool am-theme" type="button" id="amThemeBtn" data-am-action aria-label="切换到暗色" title="切换到暗色">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>' +
              '</button>' +
              '<button class="am-tool" type="button" id="amExportBtn" data-am-action>导出图片</button>' +
              '<button class="am-close" type="button" aria-label="关闭">×</button>' +
            '</div>' +
          '</header>' +
          '<div class="am-grid">' + columns + '</div>' +
        '</article>';
      document.body.appendChild(layer);
      document.body.classList.add('action-map-open');
      window.requestAnimationFrame(function () { layer.classList.add('is-open'); });

      var panel = document.getElementById('settingsPanel');
      var settingsBtn = document.getElementById('settingsBtn');
      if (panel) panel.hidden = true;
      if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');

      function close() {
        layer.classList.remove('is-open');
        document.body.classList.remove('action-map-open');
        document.removeEventListener('keydown', onKey);
        window.setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 300);
      }
      function onKey(e) { if (e.key === 'Escape') close(); }

      layer.querySelector('.am-backdrop').addEventListener('click', close);
      layer.querySelector('.am-close').addEventListener('click', close);

      var themeBtn = layer.querySelector('#amThemeBtn');
      var moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
      var sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
      function themeLabel() {
        var dark = layer.classList.contains('is-dark');
        if (!themeBtn) return;
        themeBtn.innerHTML = dark ? sunIcon : moonIcon;
        var label = dark ? '切换到亮色' : '切换到暗色';
        themeBtn.setAttribute('aria-label', label);
        themeBtn.title = label;
      }
      themeLabel();
      if (themeBtn) {
        themeBtn.addEventListener('click', function () {
          layer.classList.toggle('is-dark');
          themeLabel();
        });
      }

      var exportBtn = layer.querySelector('#amExportBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', function () {
          exportActionMapImage(layer.querySelector('.am-sheet'), exportBtn);
        });
      }

      document.addEventListener('keydown', onKey);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(); initVision(); initActionMap(); });
  } else {
    render();
    initVision();
    initActionMap();
  }

  window.addEventListener('load', function () {
    window.setTimeout(syncResultTextFromDom, 500);
  });
})();
