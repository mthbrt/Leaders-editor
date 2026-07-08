// ── PALETTE 2 — panneau gauche (sauvegardes) ─────────────────────────────────
const Palette2 = (() => {

  const LEFT_PANEL_WIDTH = 260; // fixed desktop width — never shrinks (see style.css grid-template-columns)

  let _palW     = LEFT_PANEL_WIDTH;
  let panel     = null;
  let collapsed = false;
  let _lastCollapsed = false;

  // sections = [{ id, name, open, configs: [{ id, name, state, timestamp }] }]
  let sections = [];

  const STORAGE_KEY = 'leaders-pal2-sections';

  // ── Utilitaires ───────────────────────────────────────────────────────────
  const _uid = () => Date.now() + '_' + Math.floor(Math.random() * 1e6);
  const _esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const _t   = key => (typeof t === 'function' ? t(key) : key);

  function _nextNum(collection, prefix) {
    const used = new Set(collection.map(item => item.name));
    let n = 1;
    while (used.has(prefix + n)) n++;
    return n;
  }

  // ── Persistance ───────────────────────────────────────────────────────────
  function _load() {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (arr.length && arr[0] && !arr[0].configs) {
        // Old flat format → migrate into one default section
        sections = [{ id: _uid(), name: _t('pal2LegacySection'), open: true, configs: arr.map(c => ({ ...c, id: String(c.id) })) }];
      } else {
        sections = arr.map(s => ({
          ...s,
          id:      String(s.id),
          open:    s.open !== false,
          configs: (s.configs || []).map(c => ({ ...c, id: String(c.id) })),
        }));
      }
    } catch { sections = []; }

    if (sections.length === 0) {
      const secId = _uid(), cfgId = _uid();
      sections = [{
        id: secId, name: _t('pal2DefaultSection') + ' 1', open: true,
        configs: [{
          id: cfgId, name: _t('pal2DefaultConfig') + ' 1', timestamp: Date.now(),
          state: { tokens: [{ id:0,cell:21,name:'1',c:'b' },{ id:1,cell:15,name:'2',c:'w' }], markers:{}, arrows:[], arrowNid:0, banned:[] },
        }],
      }];
      _save();
    }
  }

  function _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sections)); } catch {}
  }

  // ── Snapshot / restore ────────────────────────────────────────────────────
  function _snapshot() {
    return JSON.parse(JSON.stringify({
      tokens: S.tokens, markers: S.markers || {},
      arrows: S.arrows || [], arrowNid: S.arrowNid || 0, banned: S.banned || [],
    }));
  }

  function _restore(cfg) {
    const snap  = cfg.state;
    S.tokens    = JSON.parse(JSON.stringify(snap.tokens  || []));
    S.markers   = JSON.parse(JSON.stringify(snap.markers || {}));
    S.arrows    = JSON.parse(JSON.stringify(snap.arrows  || []));
    S.arrowNid  = snap.arrowNid || 0;
    S.banned    = JSON.parse(JSON.stringify(snap.banned  || []));
    S.nid       = S.tokens.length ? Math.max(...S.tokens.map(t => t.id)) + 1 : 0;
    const used  = new Set(S.tokens.map(t => t.name));
    S.palette   = { lancement: [], vermillon: [], archetypes: [], leaders: [], other: [] };
    for (const n of (typeof ALL_NAMES !== 'undefined' ? ALL_NAMES : [])) {
      if (!used.has(n)) {
        const key = typeof _palGroupOf === 'function' ? _palGroupOf(n) : 'other';
        (S.palette[key] || S.palette.other).push(n);
      }
    }
    saveH?.();
    if (typeof Arrows !== 'undefined') Arrows.resetState?.();
    render?.();
  }

  // ── CRUD Sections ─────────────────────────────────────────────────────────
  function _addSection() {
    const prefix = _t('pal2DefaultSection') + ' ';
    // Starts with one default position, not empty — an empty section rendered no body at all
    // (see _renderList), making the open/closed arrow meaningless.
    sections.push({
      id: _uid(), name: prefix + _nextNum(sections, prefix), open: true,
      configs: [{ id: _uid(), name: _t('pal2DefaultConfig') + ' 1', state: _snapshot(), timestamp: Date.now() }],
    });
    _save(); _renderList();
  }

  function _deleteSection(id) {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    const [item] = sections.splice(index, 1);
    _renderList();
    _armPendingDelete('section', item, index, null);
  }

  function _renameSection(id, raw) {
    const s = sections.find(s => s.id === id);
    if (s && raw.trim()) s.name = raw.trim();
    _save(); _renderList();
  }

  function _toggleSection(id) {
    const s = sections.find(s => s.id === id);
    if (s) s.open = !s.open;
    _save(); _renderSectionToggle(id);
  }

  // ── CRUD Configs ──────────────────────────────────────────────────────────
  function _addConfig(sectionId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const prefix = _t('pal2DefaultConfig') + ' ';
    sec.configs.push({ id: _uid(), name: prefix + _nextNum(sec.configs, prefix), state: _snapshot(), timestamp: Date.now() });
    _save(); _renderList();
  }

  function _updateConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const cfg = sec.configs.find(c => c.id === configId); if (!cfg) return;
    cfg.state = _snapshot(); cfg.timestamp = Date.now();
    _save(); _renderList();
  }

  function _duplicateConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const idx = sec.configs.findIndex(c => c.id === configId); if (idx === -1) return;
    const src = sec.configs[idx];
    const copy = { id: _uid(), name: src.name + ' (2)', state: JSON.parse(JSON.stringify(src.state)), timestamp: Date.now() };
    sec.configs.splice(idx + 1, 0, copy);
    _save(); _renderList();
  }

  function _deleteConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const index = sec.configs.findIndex(c => c.id === configId);
    if (index === -1) return;
    const [item] = sec.configs.splice(index, 1);
    _renderList();
    _armPendingDelete('config', item, index, sectionId);
  }

  // ── Undo-delete toast ─────────────────────────────────────────────────────
  // Deleting a section or save row takes it out of the in-memory list (and the UI) right away,
  // but doesn't persist that removal to localStorage until UNDO_DELETE_MS passes with no undo — via
  // Ctrl+Z (routed in from editor.js's global keydown, which defers to us first) or clicking the
  // toast itself. Only one deletion can be "pending" at a time; a new one commits whichever was showing.
  const UNDO_DELETE_MS = 7000;
  // hidxAtArm: editor.js's board-history pointer (hidx) at the moment of deletion — any board or
  // recruitment-zone change advances it via saveH(), so comparing against the current value tells
  // Ctrl+Z whether this deletion is still the very last action (see undoPendingDeleteIfLastAction).
  let _pendingDelete = null; // { kind: 'section'|'config', item, index, sectionId, timer, toastEl, hidxAtArm }

  function _commitPendingDelete() {
    if (!_pendingDelete) return;
    clearTimeout(_pendingDelete.timer);
    const el = _pendingDelete.toastEl;
    _pendingDelete = null;
    _save();
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 200);
  }

  function _restorePendingDelete() {
    const pd = _pendingDelete;
    clearTimeout(pd.timer);
    _pendingDelete = null;
    pd.toastEl.classList.remove('visible');
    setTimeout(() => pd.toastEl.remove(), 200);

    if (pd.kind === 'section') {
      sections.splice(Math.min(pd.index, sections.length), 0, pd.item);
    } else {
      const sec = sections.find(s => s.id === pd.sectionId);
      if (sec) sec.configs.splice(Math.min(pd.index, sec.configs.length), 0, pd.item);
    }
    _save(); _renderList();
  }

  // Unconditional — used by the toast's own Undo button, which should always work while it's showing.
  function undoPendingDelete() {
    if (!_pendingDelete) return false;
    _restorePendingDelete();
    return true;
  }

  // Gated — used by the Ctrl+Z keyboard shortcut, which should only reach for this deletion as long
  // as nothing else (a board move, a recruit/ban, etc.) has happened since. Once it has, Ctrl+Z goes
  // back to meaning "undo that", and the toast just quietly finishes its countdown on its own.
  function undoPendingDeleteIfLastAction() {
    if (!_pendingDelete || _pendingDelete.hidxAtArm !== hidx) return false;
    _restorePendingDelete();
    return true;
  }

  // Section vs. save row both show the same "Annuler suppression" label — no separate wording
  // needed for what was deleted (kind only matters for the restore). No button — the whole toast
  // is the click target, with just the icon as a visual affordance rather than an actual control.
  function _armPendingDelete(kind, item, index, sectionId) {
    _commitPendingDelete(); // finalize whichever deletion was already pending, if any

    const el = document.createElement('div');
    el.className = 'pal2-toast';
    el.title = _t('pal2ToastUndo');
    el.innerHTML = `
      <span class="pal2-toast-label"></span>
      <svg class="pal2-toast-undo-icon" viewBox="0 0 18 18" fill="currentColor"><path d="M8.92,6.33h-3.13l2.38-2.38-1.03-1.03L3,7.06l4.14,4.14,1.03-1.03-2.38-2.38h3.13c2.55,0,4.63,2.08,4.63,4.63v2.66h1.45v-2.66c0-3.36-2.73-6.09-6.08-6.09Z"/></svg>`;
    el.querySelector('.pal2-toast-label').textContent = _t('pal2ToastUndo');
    el.addEventListener('mousedown', e => { e.preventDefault(); undoPendingDelete(); });
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));

    const timer = setTimeout(_commitPendingDelete, UNDO_DELETE_MS);
    _pendingDelete = { kind, item, index, sectionId, timer, toastEl: el, hidxAtArm: hidx };
  }

  function _renameConfig(sectionId, configId, raw) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const cfg = sec.configs.find(c => c.id === configId);
    if (cfg && raw.trim()) cfg.name = raw.trim();
    _save(); _renderList();
  }

  // ── Section toggle (sans re-render complet) ───────────────────────────────
  function _renderSectionToggle(id) {
    if (!panel) return;
    const sec   = sections.find(s => s.id === id); if (!sec) return;
    const secEl = panel.querySelector(`.pal2-section[data-sid="${id}"]`); if (!secEl) return;
    const body  = secEl.querySelector('.pal2-section-body');
    if (body) {
      // Bound once, never removed — reads sec.open at the moment it fires rather than closing
      // over the click that created it, so a late transitionend (a second click arrives before
      // the transition finishes) still applies the correct final state.
      if (!body._toggleEndBound) {
        body.addEventListener('transitionend', e => {
          if (e.propertyName !== 'max-height') return;
          if (sec.open) { body.style.maxHeight = ''; }
          else { body.classList.remove('open'); body.style.maxHeight = ''; }
        });
        body._toggleEndBound = true;
      }
      const h = body.scrollHeight;
      body.style.transition = 'none';
      if (sec.open) {
        body.classList.add('open');
        body.style.maxHeight = '0';
        body.offsetHeight; // force reflow so browser registers 0 as the start
        body.style.transition = '';
        body.style.maxHeight = h + 'px';
      } else {
        body.style.maxHeight = h + 'px';
        body.offsetHeight; // force reflow so browser registers h as the start
        body.style.transition = '';
        body.style.maxHeight = '0';
      }
    }
    secEl.querySelector('.pal2-sec-arrow')?.classList.toggle('open', sec.open);
    secEl.querySelector('.pal2-sec-left')?.setAttribute('aria-expanded', sec.open);
  }

  // ── Inline rename input ───────────────────────────────────────────────────
  function _mkInlineInput(current, placeholder, onCommit, onCancel) {
    const wrap = document.createElement('div');
    wrap.className = 'pal2-inline-edit';
    wrap.innerHTML = `<input class="pal2-inline-input" value="${_esc(current)}" placeholder="${_esc(placeholder)}" maxlength="40"/>`;
    const inp = wrap.querySelector('input');

    let _done = false;
    const _commit = () => { if (_done) return; _done = true; document.removeEventListener('mousedown', _onOutside, true); onCommit(inp.value); };
    const _cancel = () => { if (_done) return; _done = true; document.removeEventListener('mousedown', _onOutside, true); onCancel(); };
    function _onOutside(e) { if (!wrap.contains(e.target)) _commit(); }

    inp.addEventListener('mousedown', e => { e.stopPropagation(); });
    inp.addEventListener('mouseup',   e => { e.stopPropagation(); });
    inp.addEventListener('click',     e => { e.stopPropagation(); });
    inp.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Enter')  { e.preventDefault(); _commit(); }
      if (e.key === 'Escape') _cancel();
    });
    document.addEventListener('mousedown', _onOutside, true);
    setTimeout(() => { try { inp.focus(); inp.select(); } catch {} }, 0);
    return wrap;
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  let _dnd = null; // { type, id, srcSid?, el, startX, startY, moved }

  function _getOrCreateIndicator() {
    let ind = panel.querySelector('.pal2-dnd-indicator');
    if (!ind) {
      ind = document.createElement('div');
      ind.className  = 'pal2-dnd-indicator';
      ind.style.cssText = 'height:1px;margin:0 8px;border-radius:1px;background:currentColor;pointer-events:none;';
    }
    return ind;
  }

  function _getSectionDrop(clientY, draggedEl) {
    const secEls = Array.from(panel.querySelectorAll('#pal2-list .pal2-section'));
    for (const el of secEls) {
      if (el === draggedEl) continue;
      const { top, height } = el.getBoundingClientRect();
      if (clientY < top + height / 2) return { before: el };
    }
    return { before: null };
  }

  // `rows` always excludes draggedEl, so insertIdx is already correct for splicing into the
  // post-removal configs array. draggedEl is passed explicitly rather than read off _dnd so this
  // stays correct even after _dnd has been cleared.
  function _getConfigDrop(clientY, draggedEl) {
    const secEls = Array.from(panel.querySelectorAll('#pal2-list .pal2-section'));
    for (const secEl of secEls) {
      const sid = secEl.dataset.sid;
      const sec = sections.find(s => s.id === sid);
      if (!sec) continue;

      if (!sec.open) {
        const hdrRect = secEl.querySelector('.pal2-section-hdr').getBoundingClientRect();
        if (clientY >= hdrRect.top && clientY <= hdrRect.bottom) return { intoSection: sid };
        continue;
      }

      const secRect = secEl.getBoundingClientRect();
      if (clientY < secRect.top || clientY > secRect.bottom) continue;

      const rows = Array.from(secEl.querySelectorAll('.pal2-row')).filter(el => el !== draggedEl);
      for (let i = 0; i < rows.length; i++) {
        const { top, height } = rows[i].getBoundingClientRect();
        if (clientY < top + height / 2) return { dstSid: sid, insertIdx: i };
      }
      return { dstSid: sid, insertIdx: rows.length };
    }
    // Fallback: append to the last open section.
    const openSecs = sections.filter(s => s.open);
    if (openSecs.length) {
      const last = openSecs[openSecs.length - 1];
      return { dstSid: last.id, insertIdx: last.configs.length };
    }
    return {};
  }

  // Shared between mouse and touch — only the event wiring differs (see _attachDrag below).
  function _dndTrackMove(clientX, clientY) {
    if (!_dnd) return;
    const dx = clientX - _dnd.startX, dy = clientY - _dnd.startY;
    if (!_dnd.moved && Math.hypot(dx, dy) < 5) return;
    if (!_dnd.moved) { _dnd.moved = true; _dnd.el.style.opacity = '0.4'; _dnd.el.style.pointerEvents = 'none'; }

    const ind = _getOrCreateIndicator();
    if (_dnd.type === 'section') {
      const { before } = _getSectionDrop(clientY, _dnd.el);
      const list = panel.querySelector('#pal2-list');
      before ? list.insertBefore(ind, before) : list.appendChild(ind);
    } else {
      const target = _getConfigDrop(clientY, _dnd.el);
      if (target.intoSection) {
        panel.querySelector(`.pal2-section[data-sid="${target.intoSection}"]`)?.after(ind);
      } else if (target.dstSid) {
        const configList = panel.querySelector(`.pal2-section[data-sid="${target.dstSid}"] .pal2-config-list`);
        const rows       = configList ? Array.from(configList.querySelectorAll('.pal2-row')) : [];
        if (target.insertIdx < rows.length) configList.insertBefore(ind, rows[target.insertIdx]);
        else configList?.appendChild(ind);
      }
    }
  }

  // Commits the reorder at clientY — used by both mouseup and touchend.
  function _dndCommit(clientY) {
    panel?.querySelector('.pal2-dnd-indicator')?.remove();
    if (!_dnd) return;
    const dnd = _dnd; _dnd = null;
    dnd.el.style.opacity = '';
    dnd.el.style.pointerEvents = '';
    if (!dnd.moved) return;

    if (dnd.type === 'section') {
      const { before } = _getSectionDrop(clientY, dnd.el);
      const srcIdx = sections.findIndex(s => s.id === dnd.id);
      if (srcIdx === -1) return;
      const [moved] = sections.splice(srcIdx, 1);
      let insertIdx = before ? sections.findIndex(s => s.id === before.dataset.sid) : sections.length;
      if (insertIdx < 0) insertIdx = sections.length;
      sections.splice(insertIdx, 0, moved);
    } else {
      const srcSec = sections.find(s => s.id === dnd.srcSid); if (!srcSec) return;
      const cfgIdx = srcSec.configs.findIndex(c => c.id === dnd.id); if (cfgIdx === -1) return;
      const target = _getConfigDrop(clientY, dnd.el); // computed before the splice below — see _getConfigDrop
      const [movedCfg] = srcSec.configs.splice(cfgIdx, 1);
      if (target.intoSection) {
        const dstSec = sections.find(s => s.id === target.intoSection);
        (dstSec || srcSec).configs.push(movedCfg);
      } else if (target.dstSid !== undefined) {
        const dstSec = sections.find(s => s.id === target.dstSid) || srcSec;
        dstSec.configs.splice(target.insertIdx, 0, movedCfg);
      } else {
        srcSec.configs.splice(cfgIdx, 0, movedCfg);
      }
    }
    _save(); _renderList();
  }

  // Cleans up an in-progress drag without committing — interrupted (touchcancel, blur) not released.
  function _dndAbort() {
    panel?.querySelector('.pal2-dnd-indicator')?.remove();
    if (!_dnd) return;
    _dnd.el.style.opacity = '';
    _dnd.el.style.pointerEvents = '';
    _dnd = null;
  }

  function _dndOnMouseMove(e) { _dndTrackMove(e.clientX, e.clientY); }
  function _dndOnMouseUp(e) {
    document.removeEventListener('mousemove', _dndOnMouseMove);
    document.removeEventListener('mouseup',   _dndOnMouseUp);
    _dndCommit(e.clientY);
  }
  window.addEventListener('blur', _dndAbort); // mouse/pointer released outside the window entirely

  function _dndOnTouchMove(e) {
    if (!_dnd) return;
    e.preventDefault(); // committed to a drag — don't let the page also scroll underneath it
    _dndTrackMove(e.touches[0].clientX, e.touches[0].clientY);
  }
  function _dndOnTouchEnd(e) {
    document.removeEventListener('touchmove',   _dndOnTouchMove);
    document.removeEventListener('touchend',    _dndOnTouchEnd);
    document.removeEventListener('touchcancel', _dndOnTouchCancel);
    _dndCommit(e.changedTouches[0].clientY);
  }
  function _dndOnTouchCancel() {
    document.removeEventListener('touchmove',   _dndOnTouchMove);
    document.removeEventListener('touchend',    _dndOnTouchEnd);
    document.removeEventListener('touchcancel', _dndOnTouchCancel);
    _dndAbort();
  }

  function _attachDrag(el, type, id, srcSid) {
    if (type !== 'section') el.style.cursor = 'grab'; // sections keep their own cursor styling
    const startDrag = (startX, startY) => {
      _dnd = { type, id, srcSid, el: type === 'section' ? el.closest('.pal2-section') : el, startX, startY, moved: false };
    };

    el.addEventListener('mousedown', e => {
      if (e.button !== 0) return; // right-click opens the context menu instead
      if (e.target.closest('.pal2-sec-actions, .pal2-row-actions, input')) return;
      e.stopPropagation();
      startDrag(e.clientX, e.clientY);
      document.addEventListener('mousemove', _dndOnMouseMove);
      document.addEventListener('mouseup',   _dndOnMouseUp);
    });

    // Touch: gated behind a hold (LONG_PRESS_MS) so an ordinary swipe still scrolls the list.
    let pressTimer = null, pressX = 0, pressY = 0;
    const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };

    el.addEventListener('touchstart', e => {
      if (e.target.closest('.pal2-sec-actions, .pal2-row-actions, input')) return;
      if (e.touches.length !== 1) return;
      pressX = e.touches[0].clientX;
      pressY = e.touches[0].clientY;
      pressTimer = setTimeout(() => {
        pressTimer = null;
        if (navigator.vibrate) navigator.vibrate(40);
        startDrag(pressX, pressY);
        // Same physical gesture that also fires the browser's own native long-press-to-contextmenu
        // (on release) — mark it so the hdr/row 'contextmenu' listeners below know to ignore that
        // trailing event instead of popping their rename/delete menu mid-drag (see editor.js's
        // GHOST_TAP_MS for the same pattern applied to board tokens).
        _longPressEndTime = Date.now();
        document.addEventListener('touchmove',   _dndOnTouchMove, { passive: false });
        document.addEventListener('touchend',    _dndOnTouchEnd);
        document.addEventListener('touchcancel', _dndOnTouchCancel);
      }, LONG_PRESS_MS);
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      if (!pressTimer) return;
      const touch = e.touches[0];
      if (Math.hypot(touch.clientX - pressX, touch.clientY - pressY) > 8) cancelPress();
    }, { passive: true });

    el.addEventListener('touchend',    cancelPress);
    el.addEventListener('touchcancel', cancelPress);
  }

  // ── Right-click context menu — same design as #tok-tb/#pal-tok-tb (editor.js/palette.js) ──
  let _ctxMenuEl = null, _ctxMenuCloseFn = null;

  function _closeContextMenu() {
    if (_ctxMenuCloseFn) { _ctxMenuCloseFn(); _ctxMenuCloseFn = null; }
  }

  // items: [{ label, danger?, onClick }] — a { sep: true } entry renders a divider instead.
  function _openContextMenu(x, y, items) {
    _closeContextMenu();
    // Synchronous, not deferred to the rAF below (that's only for the visual reveal) — see
    // editor.js's _openCtxMenu comment: a stale deferred _menuOpened() landing after a rapid
    // reopen's own _menuClosed() would permanently inflate the shared counter.
    _menuOpened();

    const el = _ctxMenuEl || (_ctxMenuEl = document.createElement('div'));
    el.id = 'pal2-ctx-menu';
    el.className = '';
    el.innerHTML = items.map((it, i) => it.sep
      ? `<div class="tok-tb-sep"></div>`
      : `<button class="tok-tb-btn${it.danger ? ' tok-tb-btn-danger' : ''}" data-idx="${i}">${_esc(it.label)}</button>`
    ).join('');
    document.body.appendChild(el);
    el.style.display    = 'flex';
    el.style.visibility = 'hidden';
    el.style.transition = 'none';
    void el.offsetWidth;

    // Opens with its top-left at the cursor, like a native context menu — flipping to whichever
    // side keeps it on-screen instead of an anchored arrow (there's no button to point back at).
    const ew = el.offsetWidth, eh = el.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    const GAP = 4;
    let left = x, flipX = false, top = y, flipY = false;
    if (left + ew > vw - GAP) { left = Math.max(GAP, x - ew); flipX = true; }
    if (top + eh > vh - GAP)  { top  = Math.max(GAP, y - eh); flipY = true; }
    el.classList.toggle('ctx-flip-x', flipX);
    el.classList.toggle('ctx-flip-y', flipY);
    el.style.left = left + 'px';
    el.style.top  = top  + 'px';

    requestAnimationFrame(() => {
      el.style.transition = '';
      el.style.visibility = '';
      el.classList.add('open');
    });

    const onAction = e => {
      const btn = e.target.closest('[data-idx]');
      if (!btn) return;
      e.preventDefault(); e.stopPropagation();
      const item = items[+btn.dataset.idx];
      _closeContextMenu();
      item?.onClick?.();
    };
    el.addEventListener('mousedown', onAction);

    const onOutside = e => { if (!el.contains(e.target)) _closeContextMenu(); };
    document.addEventListener('mousedown', onOutside, true);
    // Same reasoning as editor.js's _openCtxMenu: always preventDefault, but ignore it as a
    // dismiss signal within GHOST_TAP_MS (a touch long-press's own trailing native event).
    const onContext = e => {
      e.preventDefault();
      if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
      if (!el.contains(e.target)) _closeContextMenu();
    };
    document.addEventListener('contextmenu', onContext, true);

    _ctxMenuCloseFn = () => {
      el.classList.remove('open');
      el.removeEventListener('mousedown', onAction);
      document.removeEventListener('mousedown', onOutside, true);
      document.removeEventListener('contextmenu', onContext, true);
      el.remove();
      if (_ctxMenuEl === el) _ctxMenuEl = null;
      _menuClosed();
    };
  }

  // ── Action button tooltips ─────────────────────────────────────────────────
  function _initActionTooltips() {
    if (!panel) return;
    panel.querySelectorAll('.pal2-action-btn[title]').forEach(btn => {
      const label = btn.getAttribute('title');
      btn.removeAttribute('title');
      if (!label) return;

      let tt = null, timer = null;

      const _show = () => {
        tt = document.createElement('div');
        tt.className = 'dc-tooltip-el tt-simple tt-below';
        tt.innerHTML = `<span class="dc-tt-label">${label}</span>`;
        document.body.appendChild(tt);
        tt.style.display    = 'block';
        tt.style.visibility = 'hidden';

        requestAnimationFrame(() => {
          if (!tt) return;
          const br  = btn.getBoundingClientRect();
          const tw  = tt.offsetWidth, th = tt.offsetHeight;
          const GAP = 8;
          let y = br.bottom + GAP, above = false;
          if (y + th > window.innerHeight - 8) { y = br.top - th - GAP; above = true; }
          let x = br.left + br.width / 2 - tw / 2;
          x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
          tt.style.setProperty('--arrow-x', ((br.left + br.width / 2) - x) + 'px');
          if (above) tt.classList.replace('tt-below', 'tt-above');
          tt.style.left       = x + 'px';
          tt.style.top        = y + 'px';
          tt.style.visibility = '';
          tt.classList.add('visible');
        });
      };

      const _hide = () => {
        clearTimeout(timer);
        if (tt) { tt.classList.remove('visible'); const _tt = tt; tt = null; setTimeout(() => _tt.remove(), 120); }
      };

      // Tooltips are a hover/mouse affordance only — see tooltip.js's initButtonTooltips for why
      // this guard is needed (mobile browsers synthesize mouseenter from a plain tap).
      btn.addEventListener('mouseenter', () => { if (_isTouchDevice()) return; timer = setTimeout(_show, 0); });
      btn.addEventListener('mouseleave', _hide);
      btn.addEventListener('mousedown',  _hide);
    });
  }

  // ── Render list ───────────────────────────────────────────────────────────
  function _renderList() {
    const list = panel?.querySelector('#pal2-list');
    if (!list) return;
    list.innerHTML = '';

    for (const sec of sections) {
      const secEl = document.createElement('div');
      secEl.className  = 'pal2-section';
      secEl.dataset.sid = sec.id;

      const hdr = document.createElement('div');
      hdr.className = 'pal2-section-hdr';
      hdr.innerHTML = `
        <div class="pal2-sec-left" tabindex="0" role="button" aria-expanded="${sec.open}">
          <svg class="pal2-sec-arrow ${sec.open ? 'open' : ''}" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 3 5 7 9 3"/>
          </svg>
          <span class="pal2-sec-name">${_esc(sec.name)}</span>
        </div>
        <div class="pal2-sec-right">
          <span class="pal2-sec-count">${sec.configs.length}</span>
          <div class="pal2-sec-actions">
            <button class="pal2-action-btn pal2-btn-sec-add"  title="${_esc(_t('pal2TitleNewSave'))}" aria-label="${_esc(_t('pal2TitleNewSave'))}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
            </button>
            <button class="pal2-action-btn pal2-btn-sec-menu" title="${_esc(_t('pal2TitleMore'))}" aria-label="${_esc(_t('pal2TitleMore'))}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
          </div>
        </div>`;

      const startRename = () => {
        const nameEl = hdr.querySelector('.pal2-sec-name');
        if (!nameEl || nameEl.querySelector('input')) return;
        const original = sec.name;
        nameEl.innerHTML = '';
        nameEl.appendChild(_mkInlineInput(original, original,
          val => _renameSection(sec.id, val || original),
          ()  => _renderList()
        ));
        nameEl.classList.add('editing');
      };

      hdr.addEventListener('click', e => {
        if (e.target.closest('.pal2-sec-actions, input')) return;
        e.stopPropagation(); _toggleSection(sec.id);
        // Blur so hover, not stale :focus-within, controls the "+" button's visibility afterwards.
        hdr.querySelector('.pal2-sec-left')?.blur();
      });
      // role="button" on a div has no native Enter/Space activation — wire it explicitly.
      hdr.querySelector('.pal2-sec-left').addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault(); e.stopPropagation(); _toggleSection(sec.id);
      });
      hdr.querySelector('.pal2-btn-sec-add').addEventListener('mousedown', e => {
        if (e.button !== 0) return; // right-click opens the context menu, not this button's action
        e.preventDefault(); e.stopPropagation();
        _addConfig(sec.id);
        if (!sec.open) { sec.open = true; _save(); _renderSectionToggle(sec.id); }
      });
      hdr.querySelector('.pal2-btn-sec-menu').addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        _openContextMenu(rect.left, rect.bottom, [
          { label: _t('pal2TitleRename'),               onClick: startRename },
          { label: _t('pal2AddSection'),                 onClick: _addSection },
          { sep: true },
          { label: _t('pal2TitleDelete'), danger: true,  onClick: () => _deleteSection(sec.id) },
        ]);
      });
      hdr.addEventListener('contextmenu', e => {
        e.preventDefault(); e.stopPropagation();
        if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return; // see _attachDrag's touchstart
        _openContextMenu(e.clientX, e.clientY, [
          { label: _t('pal2TitleRename'),                onClick: startRename },
          { label: _t('pal2AddSection'),                  onClick: _addSection },
          { sep: true },
          { label: _t('pal2TitleDelete'), danger: true,   onClick: () => _deleteSection(sec.id) },
        ]);
      });

      _attachDrag(hdr, 'section', sec.id, null);
      secEl.appendChild(hdr);

      const body       = document.createElement('div');
      body.className   = 'pal2-section-body' + (sec.open ? ' open' : '');
      const configList = document.createElement('div');
      configList.className = 'pal2-config-list';

      for (const cfg of sec.configs) {
        const row = document.createElement('div');
        row.className  = 'pal2-row';
        row.dataset.id = cfg.id;
        row.innerHTML  = `
          <div class="pal2-row-main" tabindex="0" role="button">
            <span class="pal2-row-name">${_esc(cfg.name)}</span>
            <div class="pal2-row-actions">
              <button class="pal2-action-btn pal2-btn-update" title="${_esc(_t('pal2TitleUpdate'))}" aria-label="${_esc(_t('pal2TitleUpdate'))}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h12l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v5h8V3"/><rect x="7" y="13" width="10" height="8"/></svg>
              </button>
              <button class="pal2-action-btn pal2-btn-row-menu" title="${_esc(_t('pal2TitleMore'))}" aria-label="${_esc(_t('pal2TitleMore'))}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
            </div>
          </div>`;

        const startRenameConfig = () => {
          const nameEl = row.querySelector('.pal2-row-name');
          if (!nameEl || nameEl.querySelector('input')) return;
          const original = cfg.name;
          nameEl.innerHTML = '';
          nameEl.appendChild(_mkInlineInput(original, original,
            val => _renameConfig(sec.id, cfg.id, val || original),
            ()  => { nameEl.textContent = original; nameEl.classList.remove('editing'); }
          ));
          nameEl.classList.add('editing');
        };

        row.querySelector('.pal2-row-main').addEventListener('click', e => {
          if (e.target.closest('.pal2-row-actions, input')) return;
          _restore(cfg);
          e.currentTarget.blur(); // hover, not stale :focus-within, controls "Update" visibility
        });
        row.querySelector('.pal2-row-main').addEventListener('keydown', e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          if (e.target.closest('.pal2-row-actions, input')) return;
          e.preventDefault(); _restore(cfg);
        });
        row.querySelector('.pal2-btn-update').addEventListener('mousedown', e => {
          if (e.button !== 0) return; // right-click opens the context menu, not this button's action
          e.preventDefault(); e.stopPropagation(); _updateConfig(sec.id, cfg.id);
        });
        row.querySelector('.pal2-btn-row-menu').addEventListener('mousedown', e => {
          if (e.button !== 0) return;
          e.preventDefault(); e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          _openContextMenu(rect.left, rect.bottom, [
            { label: _t('pal2TitleRename'),                 onClick: startRenameConfig },
            { label: _t('pal2TitleUpdate'),                 onClick: () => _updateConfig(sec.id, cfg.id) },
            { label: _t('pal2TitleDuplicate'),              onClick: () => _duplicateConfig(sec.id, cfg.id) },
            { sep: true },
            { label: _t('pal2TitleDelete'), danger: true,   onClick: () => _deleteConfig(sec.id, cfg.id) },
          ]);
        });
        row.addEventListener('contextmenu', e => {
          e.preventDefault(); e.stopPropagation();
          if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return; // see _attachDrag's touchstart
          _openContextMenu(e.clientX, e.clientY, [
            { label: _t('pal2TitleRename'),                 onClick: startRenameConfig },
            { label: _t('pal2TitleUpdate'),                 onClick: () => _updateConfig(sec.id, cfg.id) },
            { label: _t('pal2TitleDuplicate'),              onClick: () => _duplicateConfig(sec.id, cfg.id) },
            { sep: true },
            { label: _t('pal2TitleDelete'), danger: true,   onClick: () => _deleteConfig(sec.id, cfg.id) },
          ]);
        });

        _attachDrag(row, 'config', cfg.id, sec.id);
        configList.appendChild(row);
      }

      body.appendChild(configList);
      secEl.appendChild(body);
      list.appendChild(secEl);
    }

    const addBtn = document.createElement('div');
    addBtn.className = 'pal2-add-section-btn pal2-section';
    addBtn.innerHTML = `
      <div class="pal2-section-hdr">
        <div class="pal2-sec-left">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="5" y1="1" x2="5" y2="9"/><line x1="1" y1="5" x2="9" y2="5"/>
          </svg>
          <span class="pal2-sec-name">${_esc(_t('pal2NewSection'))}</span>
        </div>
      </div>`;
    addBtn.addEventListener('click', _addSection);
    list.appendChild(addBtn);

    _initActionTooltips();
  }

  // ── Build DOM ─────────────────────────────────────────────────────────────
  function _build() {
    const main = document.getElementById('main');
    panel = document.createElement('div');
    panel.id = 'pal2-panel';
    panel.innerHTML = `
      <div id="pal2-header"><span id="pal2-title">${_t('pal2Title')}</span></div>
      <div id="pal2-body"><div id="pal2-list"></div></div>`;
    main.appendChild(panel);

    panel.addEventListener('mousedown',   e => e.stopPropagation());
    panel.addEventListener('contextmenu', e => e.preventDefault());

    _load(); _renderList(); _syncCollapsed();
  }

  // ── Layout / collapse ─────────────────────────────────────────────────────
  // Desktop only — on mobile this panel is simply hidden via CSS (body.layout-mobile #pal2-panel),
  // unlike the Palette panel, which becomes a popup instead (see editor.js's
  // _openMobilePalettePopup/style.css's body.layout-mobile #pal-panel).
  function layout(W, H) {
    _palW = LEFT_PANEL_WIDTH;
    return { palX: 0, palY: 0, palW: _palW, palH: H };
  }

  function _syncCollapsed() {
    if (!panel) return;
    panel.classList.toggle('collapsed', collapsed);
    onCollapseChange?.();
  }

  // Collapse/expand is a desktop-only concept — on mobile the panel is hidden outright, not shown
  // via tabs, so there's nothing to toggle (and its toolbar button is hidden there too).
  function toggleCollapse() { if (isMobileLayout()) return; collapsed = !collapsed; _syncCollapsed(); }
  function isCollapsed()    { return collapsed; }

  // Geometry only; called by relayout(). No per-render content sync needed for this panel.
  function syncLayout() {
    if (!panel) return;
    panel.style.top = panel.style.left = panel.style.height = panel.style.width = '';
    if (collapsed !== _lastCollapsed) {
      _lastCollapsed = collapsed;
      panel.classList.toggle('collapsed', collapsed);
    }
  }

  function applyLang() {
    if (!panel) return;
    const titleEl = panel.querySelector('#pal2-title');
    if (titleEl) titleEl.textContent = _t('pal2Title');
    _renderList();
  }

  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }
  function init() { _build(); }
  function getPanelEl() { return panel; }

  return { layout, syncLayout, isCollapsed, toggleCollapse, applyLang, init, setOnCollapseChange, getPanelEl, undoPendingDelete, undoPendingDeleteIfLastAction };
})();