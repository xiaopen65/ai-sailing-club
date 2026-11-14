(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var KEY = 'exchange-cards-v1';

  var baseMembers = Array.isArray(window.MEMBERS) ? window.MEMBERS.slice() : [];
  var localCards = [];
  var filter = 'all';
  var query = '';
  var selected = null;
  var lastFocus = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function loadLocal() {
    try {
      var arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(arr)) localCards = arr;
    } catch (e) { localCards = []; }
  }

  function saveLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(localCards)); } catch (e) {}
  }

  function allMembers() {
    return localCards.concat(baseMembers);
  }

  function tagsOf(m) {
    return (m.tags || []).filter(Boolean);
  }

  function updateStats() {
    var all = allMembers();
    var cities = {};
    var tags = {};
    all.forEach(function (m) {
      if (m.city) cities[m.city] = 1;
      tagsOf(m).forEach(function (t) { tags[t] = 1; });
    });
    var sm = $('#statMembers');
    var sc = $('#statCities');
    var st = $('#statTopics');
    if (sm) sm.textContent = String(all.length);
    if (sc) sc.textContent = String(Object.keys(cities).length);
    if (st) st.textContent = String(Object.keys(tags).length);
  }

  function renderFilters() {
    var all = allMembers();
    var counts = {};
    all.forEach(function (m) {
      tagsOf(m).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    var preferred = ['产品', '内容', '技术', '增长', '教育', '视觉', '运营', '一人公司', '社群'];
    var keys = Object.keys(counts).sort(function (a, b) {
      var ai = preferred.indexOf(a);
      var bi = preferred.indexOf(b);
      if (ai === -1) ai = 99;
      if (bi === -1) bi = 99;
      return ai - bi || counts[b] - counts[a];
    });

    var html = '<button class="chip' + (filter === 'all' ? ' active' : '') + '" type="button" data-tag="all">全部 ' + all.length + '</button>';
    html += keys.map(function (t) {
      return '<button class="chip' + (filter === t ? ' active' : '') + '" type="button" data-tag="' + esc(t) + '">' + esc(t) + ' ' + counts[t] + '</button>';
    }).join('');
    $('#memberFilters').innerHTML = html;

    $$('#memberFilters .chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-tag');
        renderFilters();
        renderMembers();
      });
    });
  }

  function filtered() {
    var q = query.trim().toLowerCase();
    return allMembers().filter(function (m) {
      if (filter !== 'all' && tagsOf(m).indexOf(filter) === -1) return false;
      if (!q) return true;
      var hay = [m.name, m.city, m.role, m.doing, m.story, m.offer, m.want, m.know].concat(tagsOf(m)).join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function cardHtml(m) {
    var pending = !!m.pending;
    var tags = tagsOf(m).map(function (t) { return '<span>#' + esc(t) + '</span>'; }).join('');
    return '<article class="member-card' + (pending ? ' pending' : '') + '">' +
      '<div class="member-top">' +
        '<span class="member-avatar" style="--c:' + esc(m.color || '#C9F14F') + '">' + esc((m.name || '成').slice(0, 1)) + '</span>' +
        '<div class="member-name"><b>' + esc(m.name || '未命名') + '</b><span>' + esc(m.city || '城市待填') + ' · ' + esc(m.role || '成员') + '</span></div>' +
        '<span class="member-badge">' + (pending ? '待审核' : '可交换') + '</span>' +
      '</div>' +
      '<p class="member-story">“' + esc(m.story || '') + '”</p>' +
      '<div class="member-exchange">' +
        '<div><span>可以交换</span><p>' + esc(m.offer || '') + '</p></div>' +
        '<div><span>想认识</span><p>' + esc(m.want || '') + '</p></div>' +
      '</div>' +
      '<div class="member-tags">' + tags + '</div>' +
      (pending
        ? '<button class="member-btn" type="button" disabled>待审核</button>'
        : '<button class="member-btn" type="button" data-apply="' + esc(m.id) + '">申请交换' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></button>') +
    '</article>';
  }

  function renderMembers() {
    var list = filtered();
    var grid = $('#memberGrid');
    if (!list.length) {
      grid.innerHTML = '<p class="member-note" style="grid-column:1/-1;padding:30px 0">没有找到匹配的成员，换个关键词或标签试试。</p>';
      return;
    }
    grid.innerHTML = list.map(cardHtml).join('');
    $$('[data-apply]', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = allMembers().filter(function (x) { return x.id === btn.getAttribute('data-apply'); })[0];
        if (m) openApply(m);
      });
    });
  }

  function renderAll() {
    updateStats();
    renderFilters();
    renderMembers();
  }

  /* ---------- apply modal ---------- */
  function setStatus(type, title, text) {
    var chip = $('#xStatusChip');
    chip.className = 'status-chip' + (type === 'confirmed' ? ' confirmed' : type === 'frozen' ? ' frozen' : '');
    chip.textContent = type === 'confirmed' ? '已确认' : type === 'frozen' ? '已冻结' : '待确认';
    $('#xStatusTitle').textContent = title;
    $('#xStatusText').textContent = text;
    $('#xConfirm').hidden = type !== 'pending';
    $('#xTimeout').hidden = type !== 'pending';
  }

  function openModal() {
    lastFocus = document.activeElement;
    var modal = $('#exchangeModal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = $('#xWant');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  function closeModal() {
    var modal = $('#exchangeModal');
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function openApply(member) {
    selected = member;
    $('#xFormWrap').hidden = false;
    $('#xStatus').hidden = true;
    $('#xTitle').textContent = '申请交换';
    $('#xWith').textContent = '与 ' + member.name + ' · ' + member.city + ' · ' + member.role;
    $('#exchangeForm').reset();
    $('#xWant').value = '';
    openModal();
  }

  function bindModal() {
    $$('[data-xclose]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#exchangeModal').hidden) closeModal();
    });

    $('#exchangeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!selected) return;
      var want = ($('#xWant').value || '').trim();
      var phone = ($('#xPhone').value || '').trim();
      if (want.length < 4) { $('#xWant').focus(); return; }
      if (phone.length < 6) { $('#xPhone').focus(); return; }
      $('#xFormWrap').hidden = true;
      $('#xStatus').hidden = false;
      setStatus('pending', '申请已发出',
        '已向 ' + selected.name + ' 和你发送短信确认（演示）。双方在 24 小时内完成确认，交换才会解锁；超时未确认将自动冻结。');
      toast('交换申请已发出，等待短信确认');
    });

    $('#xConfirm').addEventListener('click', function () {
      setStatus('confirmed', '交换已解锁',
        '你和 ' + (selected ? selected.name : '对方') + ' 的交换已确认，可以开始约时间。建议第一句就写清楚：我想交换什么、我能提供什么。');
    });

    $('#xTimeout').addEventListener('click', function () {
      setStatus('frozen', '本次交换已冻结',
        '24 小时内没有完成短信确认，这次申请已经关闭。冻结不会影响信用，你可以重新发起，或换一个人交换。');
    });
  }

  /* ---------- publish ---------- */
  function parseTags(s) {
    return String(s || '').split(/[,，、\s]+/).map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 4);
  }

  function bindJoin() {
    var form = $('#joinForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#joinName').value.trim();
      var city = $('#joinCity').value.trim();
      var role = $('#joinRole').value.trim();
      var doing = $('#joinDoing').value.trim();
      var story = $('#joinStory').value.trim();
      var offer = $('#joinOffer').value.trim();
      var want = $('#joinWant').value.trim();
      var know = $('#joinKnow').value.trim();
      var tags = parseTags($('#joinTags').value);
      var phone = $('#joinPhone').value.trim();
      var agree = $('#joinAgree').checked;

      if (!name || !city || !doing || !story || !offer || !want) {
        $('#joinStatus').textContent = '带 * 的字段请先填完。';
        return;
      }
      if (phone.length < 6) {
        $('#joinStatus').textContent = '请填一个能接收短信的手机号。';
        $('#joinPhone').focus();
        return;
      }
      if (!agree) {
        $('#joinStatus').textContent = '需要先同意展示与交换规则。';
        return;
      }

      var card = {
        id: 'local-' + Date.now(),
        name: name,
        city: city,
        role: role || '成员',
        doing: doing,
        story: story,
        offer: offer,
        want: want,
        know: know,
        tags: tags.length ? tags : ['新成员'],
        color: '#C9F14F',
        pending: true,
        phone: phone
      };
      localCards.unshift(card);
      saveLocal();
      filter = 'all';
      query = '';
      $('#memberSearch').value = '';
      renderAll();
      form.reset();
      $('#joinStatus').textContent = '已提交，等待审核（演示：只保存在本机）。';
      toast('交换卡已提交，等待审核');
      $('#members').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function bindSearch() {
    var input = $('#memberSearch');
    if (!input) return;
    input.addEventListener('input', function () {
      query = input.value;
      renderMembers();
    });
  }

  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function init() {
    loadLocal();
    renderAll();
    bindModal();
    bindJoin();
    bindSearch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
