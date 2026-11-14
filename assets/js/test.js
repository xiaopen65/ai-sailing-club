/* =========================================================
   能力测试页：一次只显示一个问题
   ========================================================= */
(function () {
  'use strict';

  var A = window.Assessment;
  if (!A) return;

  var questions = A.questions;
  var total = questions.length;
  var params = new URLSearchParams(location.search);
  var draft;

  if (params.get('retake') === '1') {
    draft = A.startDraft(true);
    try { history.replaceState(null, '', 'test.html'); } catch (e) {}
  } else {
    draft = A.getDraft();
    if (!draft) draft = A.startDraft(true);
  }

  if (!draft.answers) draft.answers = {};
  if (typeof draft.index !== 'number' || draft.index < 0 || draft.index >= total) draft.index = 0;

  var qText = document.getElementById('quizQuestion');
  var options = document.getElementById('quizOptions');
  var progress = document.getElementById('quizProgressText');
  var bar = document.getElementById('quizBar');
  var line = document.getElementById('quizLine');
  var kicker = document.getElementById('quizKicker');
  var prev = document.getElementById('quizPrev');
  var next = document.getElementById('quizNext');

  function current() { return questions[draft.index]; }

  function render() {
    var q = current();
    if (!q) return;
    var selected = draft.answers[q.id];
    var lineName = A.lineLabels[q.line] || '能力';
    var domainName = A.domains[q.domain] || '';

    progress.textContent = String(draft.index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    bar.style.width = ((draft.index + 1) / total * 100) + '%';
    line.textContent = lineName + ' · ' + domainName;
    kicker.textContent = 'ABILITY TEST / ' + lineName;
    qText.textContent = q.q;

    options.innerHTML = q.options.map(function (opt, i) {
      return '<button class="assessment-option' + (selected === i ? ' is-selected' : '') + '" type="button" data-opt="' + i + '">' +
        '<span class="ao-index">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="ao-label">' + opt.label + '</span>' +
      '</button>';
    }).join('');

    prev.disabled = draft.index === 0;
    next.disabled = typeof selected !== 'number';
    next.textContent = draft.index === total - 1 ? '生成报告 →' : '下一题 →';
  }

  options.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-opt]');
    if (!btn) return;
    var q = current();
    draft.answers[q.id] = Number(btn.getAttribute('data-opt'));
    A.saveDraft(draft);
    render();
    next.focus({ preventScroll: true });
  });

  next.addEventListener('click', function () {
    var q = current();
    if (typeof draft.answers[q.id] !== 'number') return;
    if (draft.index >= total - 1) {
      A.finish(draft.answers);
      location.href = 'report.html';
      return;
    }
    draft.index += 1;
    A.saveDraft(draft);
    render();
  });

  prev.addEventListener('click', function () {
    if (draft.index <= 0) return;
    draft.index -= 1;
    A.saveDraft(draft);
    render();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prev.click(); return; }
    if (e.key === 'ArrowRight') { if (!next.disabled) next.click(); return; }
    var q = current();
    var num = parseInt(e.key, 10);
    if (num >= 1 && num <= q.options.length) {
      var btn = options.querySelector('[data-opt="' + (num - 1) + '"]');
      if (btn) btn.click();
    }
  });

  render();
})();