// ── PALETTE 2 — panneau gauche (sauvegardes) ─────────────────────────────────
const Palette2 = (() => {

  const INNER   = 20;
  const PAL_G   = 8;

  let _palW     = 220;
  let panel     = null;
  let collapsed = false;

  // Structure: sections = [{ id, name, open, configs: [{ id, name, state, timestamp }] }]
  let sections  = [];
  let editingConfigId  = null;  // { sectionId, configId }
  let editingSectionId = null;

  const STORAGE_KEY = 'leaders-pal2-sections';

  // ── Persistance ───────────────────────────────────────────────────────────
  function _load() {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Migration: old format was flat array of configs
      if (arr.length && arr[0] && !arr[0].configs) {
        // old flat format → wrap in one default section
        sections = [{ id: _uid(), name: (typeof t === 'function' ? t('pal2LegacySection') : 'Général'), open: true, configs: arr.map(c => ({ ...c, id: String(c.id) })) }];
      } else {
        sections = arr.map(s => ({
          ...s,
          id: String(s.id),
          open: s.open !== false,
          configs: (s.configs || []).map(c => ({ ...c, id: String(c.id) }))
        }));
      }
    } catch { sections = []; }
    // Si aucune donnée, créer une section par défaut avec une sauvegarde "reset"
    if (sections.length === 0) {
      const secId = _uid();
      const cfgId = _uid();
      const defSec = typeof t === 'function' ? t('pal2DefaultSection') : 'Section';
      const defCfg = typeof t === 'function' ? t('pal2DefaultConfig') : 'Position';
      sections = [{
        id: secId,
        name: defSec + ' 1',
        open: true,
        configs: [{
          id: cfgId,
          name: defCfg + ' 1',
          state: {
            tokens: [{ id: 0, cell: 21, name: '1', c: 'b' }, { id: 1, cell: 15, name: '2', c: 'w' }],
            markers: {}, arrows: [], arrowNid: 0, banned: [],
          },
          timestamp: Date.now(),
        }]
      }];
      _save();
    }
  }

  function _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sections)); } catch {}
  }

  function _uid() { return Date.now() + '_' + Math.floor(Math.random() * 1e6); }

  // ── Snapshot / restore ────────────────────────────────────────────────────
  function _snapshot() {
    return JSON.parse(JSON.stringify({
      tokens: S.tokens, markers: S.markers || {},
      arrows: S.arrows || [], arrowNid: S.arrowNid || 0, banned: S.banned || [],
    }));
  }

  function _restore(cfg) {
    const snap = cfg.state;
    S.tokens   = JSON.parse(JSON.stringify(snap.tokens  || []));
    S.markers  = JSON.parse(JSON.stringify(snap.markers || {}));
    S.arrows   = JSON.parse(JSON.stringify(snap.arrows  || []));
    S.arrowNid = snap.arrowNid || 0;
    S.banned   = JSON.parse(JSON.stringify(snap.banned  || []));
    S.nid      = S.tokens.length ? Math.max(...S.tokens.map(t => t.id)) + 1 : 0;
    const used = new Set(S.tokens.map(t => t.name));
    S.palette  = { lancement: [], vermillon: [], archetypes: [], leaders: [], other: [] };
    for (const n of (typeof ALL_NAMES !== 'undefined' ? ALL_NAMES : [])) {
      if (!used.has(n)) {
        const key = typeof _palGroupOf === 'function' ? _palGroupOf(n) : 'other';
        (S.palette[key] || S.palette.other).push(n);
      }
    }
    if (typeof saveH  === 'function') saveH();
    if (typeof Arrows !== 'undefined') Arrows.resetState();
    if (typeof render === 'function') render();
  }

  // ── Numéros auto sans collision ───────────────────────────────────────────
  function _nextSectionNum() {
    const prefix = (typeof t === 'function' ? t('pal2DefaultSection') : 'Section') + ' ';
    const used = new Set(sections.map(s => s.name));
    let n = 1;
    while (used.has(prefix + n)) n++;
    return n;
  }

  function _nextConfigNum(sec) {
    const prefix = (typeof t === 'function' ? t('pal2DefaultConfig') : 'Config') + ' ';
    const used = new Set(sec.configs.map(c => c.name));
    let n = 1;
    while (used.has(prefix + n)) n++;
    return n;
  }

  // ── CRUD Sections ─────────────────────────────────────────────────────────
  function _addSection(name) {
    const defName = (typeof t === 'function' ? t('pal2DefaultSection') : 'Section') + ' ' + _nextSectionNum();
    sections.push({ id: _uid(), name: (name || '').trim() || defName, open: true, configs: [] });
    _save(); _renderList();
  }

  function _deleteSection(id) {
    sections = sections.filter(s => s.id !== id);
    _save(); _renderList();
  }

  function _renameSection(id, raw) {
    const s = sections.find(s => s.id === id);
    if (s && raw.trim()) s.name = raw.trim();
    editingSectionId = null;
    _save(); _renderList();
  }

  function _toggleSection(id) {
    const s = sections.find(s => s.id === id);
    if (s) s.open = !s.open;
    _save(); _renderSectionToggle(id);
  }

  // ── CRUD Configs ──────────────────────────────────────────────────────────
  function _addConfig(sectionId, name) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const defName = (typeof t === 'function' ? t('pal2DefaultConfig') : 'Config') + ' ' + _nextConfigNum(sec);
    sec.configs.push({ id: _uid(), name: (name || '').trim() || defName, state: _snapshot(), timestamp: Date.now() });
    _save(); _renderList();
  }

  function _updateConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const c = sec.configs.find(c => c.id === configId); if (!c) return;
    c.state = _snapshot(); c.timestamp = Date.now();
    _save(); _renderList();
  }

  function _deleteConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    sec.configs = sec.configs.filter(c => c.id !== configId);
    _save(); _renderList();
  }

  function _renameConfig(sectionId, configId, raw) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const c = sec.configs.find(c => c.id === configId);
    if (c && raw.trim()) c.name = raw.trim();
    editingConfigId = null;
    _save(); _renderList();
  }

  function _clearAll() {
    sections = []; editingConfigId = null; editingSectionId = null;
    _save(); _renderList();
  }

  function _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Section toggle (animate without full re-render) ───────────────────────
  function _renderSectionToggle(id) {
    if (!panel) return;
    const sec = sections.find(s => s.id === id); if (!sec) return;
    const secEl = panel.querySelector(`.pal2-section[data-sid="${id}"]`); if (!secEl) return;
    const body  = secEl.querySelector('.pal2-section-body');
    const arrow = secEl.querySelector('.pal2-sec-arrow');
    if (body)  body.classList.toggle('open', sec.open);
    if (arrow) arrow.classList.toggle('open', sec.open);
  }

  // ── Inline name input (shared helper) ────────────────────────────────────
  function _mkInlineInput(currentValue, placeholder, onCommit, onCancel) {
    const wrap = document.createElement('div');
    wrap.className = 'pal2-inline-edit';
    wrap.innerHTML = `<input class="pal2-inline-input" value="${_esc(currentValue)}" placeholder="${_esc(placeholder)}" maxlength="40"/>`;
    const inp = wrap.querySelector('input');

    let _done = false;
    function _commit() {
      if (_done) return; _done = true;
      document.removeEventListener('mousedown', _onOutside, true);
      onCommit(inp.value);
    }
    function _cancel() {
      if (_done) return; _done = true;
      document.removeEventListener('mousedown', _onOutside, true);
      onCancel();
    }

    // Clic extérieur → commit (sans stopper l'event : l'action externe garde son effet)
    function _onOutside(e) {
      if (wrap.contains(e.target)) return;
      _commit();
    }

    // Bloquer toute remontée depuis l'input pour ne pas déclencher toggle/drag/restore
    inp.addEventListener('mousedown', e => { e.stopPropagation(); });
    inp.addEventListener('mouseup',   e => { e.stopPropagation(); });
    inp.addEventListener('click',     e => { e.stopPropagation(); });

    inp.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Enter')  { e.preventDefault(); _commit(); }
      if (e.key === 'Escape') { _cancel(); }
    });

    document.addEventListener('mousedown', _onOutside, true);
    setTimeout(() => { try { inp.focus(); inp.select(); } catch {} }, 0);
    return wrap;
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  // State
  let _dnd = null;
  // _dnd = {
  //   type: 'section' | 'config',
  //   srcSid: string,          // for config: source section id
  //   id: string,              // section id or config id
  //   el: HTMLElement,         // the dragged DOM element
  //   startY: number,
  //   startX: number,
  //   moved: boolean,          // true once we've moved >4px
  //   indicator: HTMLElement,  // drop indicator line
  // }

  // Insert a horizontal line indicator into the list at position
  function _getOrCreateIndicator() {
    let ind = panel.querySelector('.pal2-dnd-indicator');
    if (!ind) {
      ind = document.createElement('div');
      ind.className = 'pal2-dnd-indicator';
      ind.style.cssText = 'height:1px;margin:0px 8px;border-radius:1px;background:currentColor;pointer-events:none;';
    }
    return ind;
  }

  // Returns element and insertion info for sections drag
  function _getSectionDropTarget(clientY) {
    const list = panel.querySelector('#pal2-list');
    const secEls = Array.from(list.querySelectorAll('.pal2-section'));
    for (let i = 0; i < secEls.length; i++) {
      const el = secEls[i];
      if (el === _dnd.el) continue;
      const rect = el.getBoundingClientRect();
      const mid  = rect.top + rect.height / 2;
      if (clientY < mid) {
        return { before: el, index: i };
      }
    }
    // after last
    return { before: null, index: secEls.length };
  }

  // Returns drop target for configs (across sections)
  function _getConfigDropTarget(clientY) {
    const list = panel.querySelector('#pal2-list');
    const secEls = Array.from(list.querySelectorAll('.pal2-section'));

    for (const secEl of secEls) {
      const body = secEl.querySelector('.pal2-section-body');
      const bodyOpen = body && body.classList.contains('open');
      const secRect = secEl.getBoundingClientRect();

      // Check section headers for collapsed/empty sections
      if (!bodyOpen) {
        const hdrRect = secEl.querySelector('.pal2-section-hdr').getBoundingClientRect();
        if (clientY >= hdrRect.top && clientY <= hdrRect.bottom) {
          return { intoSection: secEl.dataset.sid };
        }
        continue;
      }

      // Cursor is within this open section's vertical bounds
      if (clientY >= secRect.top && clientY <= secRect.bottom) {
        const rows = Array.from(secEl.querySelectorAll('.pal2-row'));
        for (const el of rows) {
          if (el === _dnd.el) continue;
          const rect = el.getBoundingClientRect();
          const mid  = rect.top + rect.height / 2;
          if (clientY < mid) {
            return { before: el };
          }
        }
        // Cursor is in this section but below all rows → append to this section
        const configList = secEl.querySelector('.pal2-config-list');
        return { appendToList: configList };
      }
    }

    return { before: null }; // append to last open section
  }

  function _dndOnMouseMove(e) {
    if (!_dnd) return;
    const dx = e.clientX - _dnd.startX;
    const dy = e.clientY - _dnd.startY;
    if (!_dnd.moved && Math.sqrt(dx*dx + dy*dy) < 5) return;
    if (!_dnd.moved) {
      _dnd.moved = true;
      _dnd.el.style.opacity = '0.4';
      _dnd.el.style.pointerEvents = 'none';
    }

    const ind = _getOrCreateIndicator();

    if (_dnd.type === 'section') {
      const { before } = _getSectionDropTarget(e.clientY);
      const list = panel.querySelector('#pal2-list');
      if (before) {
        list.insertBefore(ind, before);
      } else {
        // before the add-section row
        const addRow = list.querySelector('.pal2-add-section-row');
        list.insertBefore(ind, addRow);
      }
    } else {
      // config
      const target = _getConfigDropTarget(e.clientY);
      if (target.intoSection) {
        // drop into collapsed section header — append indicator after that section header
        const secEl = panel.querySelector(`.pal2-section[data-sid="${target.intoSection}"]`);
        if (secEl) secEl.after(ind);
      } else if (target.before) {
        target.before.parentElement.insertBefore(ind, target.before);
      } else if (target.appendToList) {
        target.appendToList.appendChild(ind);
      } else {
        // append to last open configList
        const lists = Array.from(panel.querySelectorAll('.pal2-section-body.open .pal2-config-list'));
        if (lists.length) lists[lists.length - 1].appendChild(ind);
      }
    }
  }

  function _dndOnMouseUp(e) {
    document.removeEventListener('mousemove', _dndOnMouseMove);
    document.removeEventListener('mouseup',   _dndOnMouseUp);

    const ind = panel && panel.querySelector('.pal2-dnd-indicator');
    if (ind) ind.remove();

    if (!_dnd) return;
    const dnd = _dnd; _dnd = null;

    // Restore element appearance
    dnd.el.style.opacity = '';
    dnd.el.style.pointerEvents = '';

    if (!dnd.moved) return; // it was a click, not a drag — ignore

    if (dnd.type === 'section') {
      _commitSectionDrop(e.clientY);
    } else {
      _commitConfigDrop(e.clientY);
    }
  }

  function _commitSectionDrop(clientY) {
    const list = panel.querySelector('#pal2-list');
    const secEls = Array.from(list.querySelectorAll('.pal2-section'));
    const srcIdx = sections.findIndex(s => s.id === _dnd_lastSid);
    if (srcIdx === -1) return;

    // Rebuild index mapping from DOM order (excluding dragged)
    const domOrder = secEls.map(el => el.dataset.sid).filter(id => id !== _dnd_lastSid);

    // Find insertion index
    let insertIdx = domOrder.length; // default: end
    for (let i = 0; i < secEls.length; i++) {
      const el = secEls[i];
      if (el.dataset.sid === _dnd_lastSid) continue;
      const rect = el.getBoundingClientRect();
      const mid  = rect.top + rect.height / 2;
      if (clientY < mid) {
        insertIdx = domOrder.indexOf(el.dataset.sid);
        break;
      }
    }

    // Reorder sections array
    const [moved] = sections.splice(srcIdx, 1);
    const newIdx = Math.min(insertIdx, sections.length);
    sections.splice(newIdx, 0, moved);
    _save(); _renderList();
  }

  // We need to store drag source ids across the async gap
  let _dnd_lastSid = null;
  let _dnd_lastCid = null;
  let _dnd_lastSrcSid = null;

  function _commitConfigDrop(clientY) {
    const srcSec = sections.find(s => s.id === _dnd_lastSrcSid);
    if (!srcSec) return;
    const cfgIdx = srcSec.configs.findIndex(c => c.id === _dnd_lastCid);
    if (cfgIdx === -1) return;

    const target = _getConfigDropTarget_forCommit(clientY);

    const [movedCfg] = srcSec.configs.splice(cfgIdx, 1);

    if (target.intoSection) {
      const dstSec = sections.find(s => s.id === target.intoSection);
      if (dstSec) dstSec.configs.push(movedCfg);
      else srcSec.configs.splice(cfgIdx, 0, movedCfg); // rollback
    } else if (target.dstSid !== undefined) {
      const dstSec = sections.find(s => s.id === target.dstSid);
      if (dstSec) {
        const insertAt = Math.min(target.insertIdx, dstSec.configs.length);
        dstSec.configs.splice(insertAt, 0, movedCfg);
      } else {
        srcSec.configs.splice(cfgIdx, 0, movedCfg);
      }
    } else {
      // fallback: put back
      srcSec.configs.splice(cfgIdx, 0, movedCfg);
    }
    _save(); _renderList();
  }

  // Version without DOM indicator (called at drop time using actual rows)
  function _getConfigDropTarget_forCommit(clientY) {
    const list = panel.querySelector('#pal2-list');
    const secEls = Array.from(list.querySelectorAll('.pal2-section'));

    for (const secEl of secEls) {
      const body = secEl.querySelector('.pal2-section-body');
      const bodyOpen = body && body.classList.contains('open');
      const secRect = secEl.getBoundingClientRect();

      // Collapsed section header hit?
      if (!bodyOpen) {
        const hdrRect = secEl.querySelector('.pal2-section-hdr').getBoundingClientRect();
        if (clientY >= hdrRect.top && clientY <= hdrRect.bottom) {
          return { intoSection: secEl.dataset.sid };
        }
        continue;
      }

      // Cursor within this open section's vertical bounds
      if (clientY >= secRect.top && clientY <= secRect.bottom) {
        const dstSid = secEl.dataset.sid;
        const dstSec = sections.find(s => s.id === dstSid);
        if (!dstSec) continue;

        const configList = secEl.querySelector('.pal2-config-list');
        const rowsInDst  = Array.from(configList.querySelectorAll('.pal2-row'));

        for (const el of rowsInDst) {
          if (el.dataset.id === _dnd_lastCid) continue;
          const rect = el.getBoundingClientRect();
          const mid  = rect.top + rect.height / 2;
          if (clientY < mid) {
            let insertIdx = rowsInDst.indexOf(el);
            if (dstSid === _dnd_lastSrcSid) {
              const srcSec = sections.find(s => s.id === _dnd_lastSrcSid);
              const srcIdx = srcSec ? srcSec.configs.findIndex(c => c.id === _dnd_lastCid) : -1;
              if (srcIdx !== -1 && srcIdx < insertIdx) insertIdx = insertIdx - 1;
            }
            return { dstSid, insertIdx };
          }
        }

        // Below all rows in this section → append to end of this section
        return { dstSid, insertIdx: dstSec.configs.length };
      }
    }

    // Append to last open section as final fallback
    const openSecs = sections.filter(s => s.open);
    if (openSecs.length) {
      const lastOpen = openSecs[openSecs.length - 1];
      if (lastOpen.id !== _dnd_lastSrcSid) {
        return { dstSid: lastOpen.id, insertIdx: lastOpen.configs.length };
      }
      return { dstSid: lastOpen.id, insertIdx: Math.max(0, lastOpen.configs.length - 1) };
    }
    return {}; // nowhere to drop
  }

  function _attachSectionDrag(hdr, sec) {
    hdr.style.cursor = 'grab';
    hdr.addEventListener('mousedown', e => {
      // Don't hijack clicks on action buttons or inline inputs
      if (e.target.closest('.pal2-sec-actions') || e.target.closest('input')) return;
      e.stopPropagation();
      const secEl = hdr.closest('.pal2-section');
      _dnd_lastSid = sec.id;
      _dnd = { type: 'section', id: sec.id, el: secEl, startX: e.clientX, startY: e.clientY, moved: false };
      document.addEventListener('mousemove', _dndOnMouseMove);
      document.addEventListener('mouseup',   _dndOnMouseUp);
    });
  }

  function _attachConfigDrag(row, sec, cfg) {
    row.style.cursor = 'grab';
    row.addEventListener('mousedown', e => {
      if (e.target.closest('.pal2-row-actions') || e.target.closest('input')) return;
      e.stopPropagation();
      _dnd_lastCid    = cfg.id;
      _dnd_lastSrcSid = sec.id;
      _dnd = { type: 'config', srcSid: sec.id, id: cfg.id, el: row, startX: e.clientX, startY: e.clientY, moved: false };
      document.addEventListener('mousemove', _dndOnMouseMove);
      document.addEventListener('mouseup',   _dndOnMouseUp);
    });
  }

  // ── Tooltips Discord sur les boutons d'action ─────────────────────────────
  function _initActionTooltips() {
    if (!panel) return;
    panel.querySelectorAll('.pal2-action-btn[title]').forEach(btn => {
      const label = btn.getAttribute('title');
      btn.removeAttribute('title');
      if (!label) return;

      let tt = null, timer = null;

      function _show() {
        tt = document.createElement('div');
        tt.className = 'dc-tooltip-el tt-simple tt-below';
        tt.innerHTML = `<span class="dc-tt-label"></span>`;
        tt.querySelector('.dc-tt-label').textContent = label;
        document.body.appendChild(tt);
        tt.style.display    = 'block';
        tt.style.visibility = 'hidden';

        requestAnimationFrame(() => {
          if (!tt) return;
          const br  = btn.getBoundingClientRect();
          const tw  = tt.offsetWidth;
          const th  = tt.offsetHeight;
          const vw  = window.innerWidth;
          const vh  = window.innerHeight;
          const GAP = 8;

          let y = br.bottom + GAP;
          let above = false;
          if (y + th > vh - 8) { y = br.top - th - GAP; above = true; }

          let x = br.left + br.width / 2 - tw / 2;
          x = Math.max(8, Math.min(x, vw - tw - 8));

          const arrowX = (br.left + br.width / 2) - x;
          tt.style.setProperty('--arrow-x', arrowX + 'px');
          if (above) tt.classList.replace('tt-below', 'tt-above');

          tt.style.left       = x + 'px';
          tt.style.top        = y + 'px';
          tt.style.visibility = '';
          tt.classList.add('visible');
        });
      }

      function _hide() {
        clearTimeout(timer);
        if (tt) {
          tt.classList.remove('visible');
          const _tt = tt; tt = null;
          setTimeout(() => _tt.remove(), 120);
        }
      }

      btn.addEventListener('mouseenter', () => { timer = setTimeout(_show, 0); });
      btn.addEventListener('mouseleave', _hide);
      btn.addEventListener('mousedown',  _hide);
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function _renderList() {
    const list = panel && panel.querySelector('#pal2-list');
    if (!list) return;
    list.innerHTML = '';

    for (const sec of sections) {
      const secEl = document.createElement('div');
      secEl.className = 'pal2-section';
      secEl.dataset.sid = sec.id;

      // ── Section header ──
      const hdr = document.createElement('div');
      hdr.className = 'pal2-section-hdr';

      hdr.innerHTML = `
        <div class="pal2-sec-left">
          <svg class="pal2-sec-arrow ${sec.open ? 'open' : ''}" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2 3 5 7 8 3"/>
          </svg>
          <span class="pal2-sec-name">${_esc(sec.name)}</span>
          <span class="pal2-sec-count">${sec.configs.length}</span>
        </div>
        <div class="pal2-sec-actions">
          <button class="pal2-action-btn pal2-btn-sec-add" title="${_esc(typeof t === 'function' ? t('pal2TitleNewSave') : 'Nouvelle sauvegarde')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="4" x2="12" y2="20"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
            </svg>
          </button>
          <button class="pal2-action-btn pal2-btn-sec-rename" title="${_esc(typeof t === 'function' ? t('pal2TitleRename') : 'Renommer')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"><path d="M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          </button>
          <button class="pal2-action-btn pal2-btn-sec-del" title="${_esc(typeof t === 'function' ? t('pal2TitleDelete') : 'Supprimer')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0-1 14H6L5 6m5 4v6m4-6v6M9 6V4h6v2"/></svg>
          </button>
        </div>`;

      const secLeft = hdr.querySelector('.pal2-sec-left');
      secLeft.addEventListener('click', e => {
        if (e.target.closest('input')) return; // input actif → ignorer
        e.stopPropagation();
        _toggleSection(sec.id);
      });

      hdr.querySelector('.pal2-btn-sec-add').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        _addConfig(sec.id);
        // open section if collapsed
        if (!sec.open) { sec.open = true; _save(); _renderSectionToggle(sec.id); }
      });

      hdr.querySelector('.pal2-btn-sec-rename').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const nameEl = hdr.querySelector('.pal2-sec-name');
        if (!nameEl || nameEl.querySelector('input')) return;
        const original = sec.name;
        const inlineWrap = _mkInlineInput(
          original, original,
          val => { _renameSection(sec.id, val || original); },
          ()  => { _renderList(); }
        );
        // Replace the text span with the inline input
        nameEl.innerHTML = '';
        nameEl.appendChild(inlineWrap);
        nameEl.classList.add('editing');
      });

      hdr.querySelector('.pal2-btn-sec-del').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        _deleteSection(sec.id);
      });

      // Attach drag on the header
      _attachSectionDrag(hdr, sec);

      secEl.appendChild(hdr);

      // ── Section body — only rendered when configs exist ──
      if (sec.configs.length === 0) { list.appendChild(secEl); continue; }

      const body = document.createElement('div');
      body.className = 'pal2-section-body' + (sec.open ? ' open' : '');

      const configList = document.createElement('div');
      configList.className = 'pal2-config-list';

      for (const cfg of sec.configs) {
        const row = document.createElement('div');
        row.className = 'pal2-row';
        row.dataset.id = cfg.id;

        row.innerHTML = `
          <div class="pal2-row-main">
            <div class="pal2-row-icon">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                <circle cx="4.5" cy="4.5" r="2.5"/>
              </svg>
            </div>
            <span class="pal2-row-name">${_esc(cfg.name)}</span>
            <div class="pal2-row-actions">
              <button class="pal2-action-btn pal2-btn-update" title="${_esc(typeof t === 'function' ? t('pal2TitleUpdate') : 'Mettre à jour la sauvegarde')}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
              <button class="pal2-action-btn pal2-btn-rename" title="${_esc(typeof t === 'function' ? t('pal2TitleRename') : 'Renommer')}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"><path d="M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </button>
              <button class="pal2-action-btn pal2-btn-del" title="${_esc(typeof t === 'function' ? t('pal2TitleDelete') : 'Supprimer')}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"><path d="M3 6h18M5 6l1 14h12l1-14M9 6V4h6v2m-5 4v6m4-6v6"/></svg>
              </button>
            </div>
          </div>`;

        row.querySelector('.pal2-row-main').addEventListener('click', e => {
          if (e.target.closest('.pal2-row-actions')) return;
          if (e.target.closest('input')) return; // input actif → ignorer
          _restore(cfg);
        });
        row.querySelector('.pal2-btn-update').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          _updateConfig(sec.id, cfg.id);
        });
        row.querySelector('.pal2-btn-rename').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          const nameEl = row.querySelector('.pal2-row-name');
          if (!nameEl || nameEl.querySelector('input')) return;
          const original = cfg.name;
          const inlineWrap = _mkInlineInput(
            original, original,
            val => { _renameConfig(sec.id, cfg.id, val || original); },
            ()  => { nameEl.textContent = original; nameEl.classList.remove('editing'); }
          );
          nameEl.innerHTML = '';
          nameEl.appendChild(inlineWrap);
          nameEl.classList.add('editing');
        });
        row.querySelector('.pal2-btn-del').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          _deleteConfig(sec.id, cfg.id);
        });

        // Attach drag on the row
        _attachConfigDrag(row, sec, cfg);

        configList.appendChild(row);
      }

      body.appendChild(configList);
      secEl.appendChild(body);
      list.appendChild(secEl);
    }

    _initActionTooltips();
  }

  // ── Build DOM ─────────────────────────────────────────────────────────────
  function _build() {
    const main = document.getElementById('main');
    panel = document.createElement('div');
    panel.id = 'pal2-panel';
    panel.innerHTML = `
      <div id="pal2-header"><span id="pal2-title">${typeof t === 'function' ? t('pal2Title') : 'SAUVEGARDES'}</span></div>
      <div id="pal2-body"><div id="pal2-list"></div></div>
      <div id="pal2-footer"><button id="pal2-btn-add-section">${typeof t === 'function' ? t('pal2AddSection') : 'Nouvelle section'}</button></div>`;
    main.appendChild(panel);

    panel.addEventListener('mousedown',   e => e.stopPropagation());
    panel.addEventListener('contextmenu', e => e.preventDefault());
    panel.querySelector('#pal2-btn-add-section').addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation(); _addSection();
    });

    _load(); _renderList(); _syncCollapsed();
  }

  let _bottomSheetMode = false;

  // ── Layout / collapse ─────────────────────────────────────────────────────
  function layout(W, H, rEst) {
    _bottomSheetMode = H > W;
    const cols   = 3;
    const psz    = rEst * 2;
    const itemSz = Math.round(psz * 0.90);
    const palW   = INNER * 2 + cols * itemSz + PAL_G * (cols - 1) + 2;
    _palW = palW;
    return { palX: 0, palY: 0, palW, palH: H, _left: true };
  }

  function _isNarrow() { return _bottomSheetMode; }

  function _syncCollapsed() {
    if (!panel) return;
    const force = _isNarrow();
    panel.classList.toggle('collapsed', force || collapsed);
    if (typeof onCollapseChange === 'function') onCollapseChange();
  }

  function toggleCollapse() { if (_isNarrow()) return; collapsed = !collapsed; _syncCollapsed(); }
  function isCollapsed()    { return _isNarrow() || collapsed; }

  function syncDOM() {
    if (!panel) return;
    const H = document.getElementById('main').clientHeight || 560;
    panel.style.top    = '0';
    panel.style.left   = '0';
    panel.style.height = H + 'px';
    panel.style.width  = _palW + 'px';
    panel.classList.toggle('collapsed', _isNarrow() || collapsed);
  }

  function getWidth() { return collapsed ? 0 : _palW; }

  function applyLang() {
    if (!panel) return;
    const title = panel.querySelector('#pal2-title');
    if (title) title.textContent = typeof t === 'function' ? t('pal2Title') : 'SAUVEGARDES';
    const addSecBtn = panel.querySelector('#pal2-btn-add-section');
    if (addSecBtn) addSecBtn.textContent = typeof t === 'function' ? t('pal2AddSection') : 'Nouvelle section';
    _renderList();
  }

  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }
  function init() { _build(); }

  return { layout, syncDOM, getWidth, isCollapsed, toggleCollapse, applyLang, init, setOnCollapseChange };
})();