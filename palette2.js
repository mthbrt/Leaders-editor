// ── PALETTE 2 — panneau gauche (sauvegardes) ─────────────────────────────────
const Palette2 = (() => {

  const INNER   = 20;
  const PAL_G   = 8;

  let _palW     = 220;
  let panel     = null;
  let collapsed = false;

  // sections = [{ id, name, open, configs: [{ id, name, state, timestamp }] }]
  let sections = [];

  const STORAGE_KEY = 'leaders-pal2-sections';

  // ── Utilitaires ───────────────────────────────────────────────────────────
  const _uid = () => Date.now() + '_' + Math.floor(Math.random() * 1e6);
  const _esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const _t   = key => (typeof t === 'function' ? t(key) : key);

  // Retourne le prochain numéro disponible pour éviter les doublons de noms
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
        // Migration ancien format plat → une section par défaut
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
    sections.push({ id: _uid(), name: prefix + _nextNum(sections, prefix), open: true, configs: [] });
    _save(); _renderList();
  }

  function _deleteSection(id) {
    sections = sections.filter(s => s.id !== id);
    _save(); _renderList();
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

  function _deleteConfig(sectionId, configId) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    sec.configs = sec.configs.filter(c => c.id !== configId);
    _save(); _renderList();
  }

  function _renameConfig(sectionId, configId, raw) {
    const sec = sections.find(s => s.id === sectionId); if (!sec) return;
    const cfg = sec.configs.find(c => c.id === configId);
    if (cfg && raw.trim()) cfg.name = raw.trim();
    _save(); _renderList();
  }

  function _clearAll() {
    sections = [];
    _save(); _renderList();
  }

  // ── Section toggle (sans re-render complet) ───────────────────────────────
  function _renderSectionToggle(id) {
    if (!panel) return;
    const sec   = sections.find(s => s.id === id); if (!sec) return;
    const secEl = panel.querySelector(`.pal2-section[data-sid="${id}"]`); if (!secEl) return;
    secEl.querySelector('.pal2-section-body')?.classList.toggle('open', sec.open);
    secEl.querySelector('.pal2-sec-arrow')?.classList.toggle('open', sec.open);
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
  // Tout l'état DnD est dans _dnd pour éviter des variables globales éparses
  let _dnd = null;
  // _dnd = { type, id, srcSid?, el, startX, startY, moved }

  function _getOrCreateIndicator() {
    let ind = panel.querySelector('.pal2-dnd-indicator');
    if (!ind) {
      ind = document.createElement('div');
      ind.className  = 'pal2-dnd-indicator';
      ind.style.cssText = 'height:1px;margin:0 8px;border-radius:1px;background:currentColor;pointer-events:none;';
    }
    return ind;
  }

  // Calcule la cible de drop pour les sections ou les configs
  // commit=false → peut utiliser des éléments DOM transients (indicateur)
  // commit=true  → utilise les éléments réels pour le drop final
  function _getSectionDrop(clientY) {
    const secEls = Array.from(panel.querySelectorAll('#pal2-list .pal2-section'));
    for (const el of secEls) {
      if (el === _dnd.el) continue;
      const { top, height } = el.getBoundingClientRect();
      if (clientY < top + height / 2) return { before: el };
    }
    return { before: null };
  }

  function _getConfigDrop(clientY, forCommit = false) {
    const secEls = Array.from(panel.querySelectorAll('#pal2-list .pal2-section'));
    for (const secEl of secEls) {
      const body     = secEl.querySelector('.pal2-section-body');
      const bodyOpen = body?.classList.contains('open');
      const secRect  = secEl.getBoundingClientRect();

      if (!bodyOpen) {
        const hdrRect = secEl.querySelector('.pal2-section-hdr').getBoundingClientRect();
        if (clientY >= hdrRect.top && clientY <= hdrRect.bottom)
          return { intoSection: secEl.dataset.sid };
        continue;
      }

      if (clientY >= secRect.top && clientY <= secRect.bottom) {
        const dstSid     = secEl.dataset.sid;
        const configList = secEl.querySelector('.pal2-config-list');
        const rows       = Array.from(configList.querySelectorAll('.pal2-row'));
        for (const el of rows) {
          if (el === _dnd.el || (forCommit && el.dataset.id === _dnd.id)) continue;
          const { top, height } = el.getBoundingClientRect();
          if (clientY < top + height / 2) {
            let insertIdx = rows.indexOf(el);
            if (forCommit && dstSid === _dnd.srcSid) {
              const srcSec = sections.find(s => s.id === _dnd.srcSid);
              const srcIdx = srcSec?.configs.findIndex(c => c.id === _dnd.id) ?? -1;
              if (srcIdx !== -1 && srcIdx < insertIdx) insertIdx--;
            }
            return { dstSid, insertIdx };
          }
        }
        const dstSec = sections.find(s => s.id === dstSid);
        return { dstSid, insertIdx: dstSec?.configs.length ?? 0 };
      }
    }
    // Fallback : append à la dernière section ouverte
    const openSecs = sections.filter(s => s.open);
    if (openSecs.length) {
      const last = openSecs[openSecs.length - 1];
      return { dstSid: last.id, insertIdx: last.configs.length };
    }
    return {};
  }

  function _dndOnMouseMove(e) {
    if (!_dnd) return;
    const dx = e.clientX - _dnd.startX, dy = e.clientY - _dnd.startY;
    if (!_dnd.moved && Math.hypot(dx, dy) < 5) return;
    if (!_dnd.moved) { _dnd.moved = true; _dnd.el.style.opacity = '0.4'; _dnd.el.style.pointerEvents = 'none'; }

    const ind = _getOrCreateIndicator();
    if (_dnd.type === 'section') {
      const { before } = _getSectionDrop(e.clientY);
      const list = panel.querySelector('#pal2-list');
      before ? list.insertBefore(ind, before) : list.insertBefore(ind, list.querySelector('.pal2-add-section-row'));
    } else {
      const target = _getConfigDrop(e.clientY, false);
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

  function _dndOnMouseUp(e) {
    document.removeEventListener('mousemove', _dndOnMouseMove);
    document.removeEventListener('mouseup',   _dndOnMouseUp);
    panel?.querySelector('.pal2-dnd-indicator')?.remove();

    if (!_dnd) return;
    const dnd = _dnd; _dnd = null;
    dnd.el.style.opacity = '';
    dnd.el.style.pointerEvents = '';
    if (!dnd.moved) return;

    if (dnd.type === 'section') {
      const { before } = _getSectionDrop(e.clientY);
      const srcIdx = sections.findIndex(s => s.id === dnd.id);
      if (srcIdx === -1) return;
      const [moved] = sections.splice(srcIdx, 1);
      let insertIdx = before ? sections.findIndex(s => s.id === before.dataset.sid) : sections.length;
      if (insertIdx < 0) insertIdx = sections.length;
      sections.splice(insertIdx, 0, moved);
    } else {
      const srcSec = sections.find(s => s.id === dnd.srcSid); if (!srcSec) return;
      const cfgIdx = srcSec.configs.findIndex(c => c.id === dnd.id); if (cfgIdx === -1) return;
      const target = _getConfigDrop(e.clientY, true);
      const [movedCfg] = srcSec.configs.splice(cfgIdx, 1);
      if (target.intoSection) {
        const dstSec = sections.find(s => s.id === target.intoSection);
        (dstSec || srcSec).configs.push(movedCfg);
      } else if (target.dstSid !== undefined) {
        const dstSec = sections.find(s => s.id === target.dstSid) || srcSec;
        dstSec.configs.splice(Math.min(target.insertIdx, dstSec.configs.length), 0, movedCfg);
      } else {
        srcSec.configs.splice(cfgIdx, 0, movedCfg);
      }
    }
    _save(); _renderList();
  }

  function _attachDrag(el, type, id, srcSid) {
    el.style.cursor = 'grab';
    el.addEventListener('mousedown', e => {
      if (e.target.closest('.pal2-sec-actions, .pal2-row-actions, input')) return;
      e.stopPropagation();
      _dnd = { type, id, srcSid, el: type === 'section' ? el.closest('.pal2-section') : el, startX: e.clientX, startY: e.clientY, moved: false };
      document.addEventListener('mousemove', _dndOnMouseMove);
      document.addEventListener('mouseup',   _dndOnMouseUp);
    });
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

      btn.addEventListener('mouseenter', () => { timer = setTimeout(_show, 0); });
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

      // Header de section
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
          <button class="pal2-action-btn pal2-btn-sec-add"    title="${_esc(_t('pal2TitleNewSave'))}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
          </button>
          <button class="pal2-action-btn pal2-btn-sec-rename" title="${_esc(_t('pal2TitleRename'))}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          </button>
          <button class="pal2-action-btn pal2-btn-sec-del"    title="${_esc(_t('pal2TitleDelete'))}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0-1 14H6L5 6m5 4v6m4-6v6M9 6V4h6v2"/></svg>
          </button>
        </div>`;

      hdr.querySelector('.pal2-sec-left').addEventListener('click', e => {
        if (e.target.closest('input')) return;
        e.stopPropagation(); _toggleSection(sec.id);
      });
      hdr.querySelector('.pal2-sec-name').addEventListener('dblclick', e => {
        e.stopPropagation();
        const nameEl = hdr.querySelector('.pal2-sec-name');
        if (!nameEl || nameEl.querySelector('input')) return;
        const original = sec.name;
        nameEl.innerHTML = '';
        nameEl.appendChild(_mkInlineInput(original, original,
          val => _renameSection(sec.id, val || original),
          ()  => _renderList()
        ));
        nameEl.classList.add('editing');
      });
      hdr.querySelector('.pal2-btn-sec-add').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        _addConfig(sec.id);
        if (!sec.open) { sec.open = true; _save(); _renderSectionToggle(sec.id); }
      });
      hdr.querySelector('.pal2-btn-sec-rename').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const nameEl = hdr.querySelector('.pal2-sec-name');
        if (!nameEl || nameEl.querySelector('input')) return;
        const original = sec.name;
        nameEl.innerHTML = '';
        nameEl.appendChild(_mkInlineInput(original, original,
          val => _renameSection(sec.id, val || original),
          ()  => _renderList()
        ));
        nameEl.classList.add('editing');
      });
      hdr.querySelector('.pal2-btn-sec-del').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation(); _deleteSection(sec.id);
      });

      _attachDrag(hdr, 'section', sec.id, null);
      secEl.appendChild(hdr);

      if (sec.configs.length === 0) { list.appendChild(secEl); continue; }

      const body       = document.createElement('div');
      body.className   = 'pal2-section-body' + (sec.open ? ' open' : '');
      const configList = document.createElement('div');
      configList.className = 'pal2-config-list';

      for (const cfg of sec.configs) {
        const row = document.createElement('div');
        row.className  = 'pal2-row';
        row.dataset.id = cfg.id;
        row.innerHTML  = `
          <div class="pal2-row-main">
            <div class="pal2-row-icon">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor"><circle cx="4.5" cy="4.5" r="2.5"/></svg>
            </div>
            <span class="pal2-row-name">${_esc(cfg.name)}</span>
            <div class="pal2-row-actions">
              <button class="pal2-action-btn pal2-btn-update" title="${_esc(_t('pal2TitleUpdate'))}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button class="pal2-action-btn pal2-btn-rename" title="${_esc(_t('pal2TitleRename'))}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </button>
              <button class="pal2-action-btn pal2-btn-del" title="${_esc(_t('pal2TitleDelete'))}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M5 6l1 14h12l1-14M9 6V4h6v2m-5 4v6m4-6v6"/></svg>
              </button>
            </div>
          </div>`;

        row.querySelector('.pal2-row-main').addEventListener('click', e => {
          if (e.target.closest('.pal2-row-actions, input')) return;
          _restore(cfg);
        });
        row.querySelector('.pal2-row-name').addEventListener('dblclick', e => {
          e.stopPropagation();
          const nameEl = row.querySelector('.pal2-row-name');
          if (!nameEl || nameEl.querySelector('input')) return;
          const original = cfg.name;
          nameEl.innerHTML = '';
          nameEl.appendChild(_mkInlineInput(original, original,
            val => _renameConfig(sec.id, cfg.id, val || original),
            ()  => { nameEl.textContent = original; nameEl.classList.remove('editing'); }
          ));
          nameEl.classList.add('editing');
        });
        row.querySelector('.pal2-btn-update').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation(); _updateConfig(sec.id, cfg.id);
        });
        row.querySelector('.pal2-btn-rename').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          const nameEl = row.querySelector('.pal2-row-name');
          if (!nameEl || nameEl.querySelector('input')) return;
          const original = cfg.name;
          nameEl.innerHTML = '';
          nameEl.appendChild(_mkInlineInput(original, original,
            val => _renameConfig(sec.id, cfg.id, val || original),
            ()  => { nameEl.textContent = original; nameEl.classList.remove('editing'); }
          ));
          nameEl.classList.add('editing');
        });
        row.querySelector('.pal2-btn-del').addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation(); _deleteConfig(sec.id, cfg.id);
        });

        _attachDrag(row, 'config', cfg.id, sec.id);
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
      <div id="pal2-header"><span id="pal2-title">${_t('pal2Title')}</span></div>
      <div id="pal2-body"><div id="pal2-list"></div></div>
      <div id="pal2-footer"><button id="pal2-btn-add-section">${_t('pal2AddSection')}</button></div>`;
    main.appendChild(panel);

    panel.addEventListener('mousedown',   e => e.stopPropagation());
    panel.addEventListener('contextmenu', e => e.preventDefault());
    panel.querySelector('#pal2-btn-add-section').addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation(); _addSection();
    });

    _load(); _renderList(); _syncCollapsed();
  }

  // ── Layout / collapse ─────────────────────────────────────────────────────
  let _bottomSheetMode = false;

  function layout(W, H, rEst) {
    _bottomSheetMode = H > W;
    const itemSz = Math.round(rEst * 2 * 0.90);
    _palW = INNER * 2 + 3 * itemSz + PAL_G * 2 + 2;
    return { palX: 0, palY: 0, palW: _palW, palH: H, _left: true };
  }

  function _syncCollapsed() {
    if (!panel) return;
    panel.classList.toggle('collapsed', _bottomSheetMode || collapsed);
    onCollapseChange?.();
  }

  function toggleCollapse() { if (_bottomSheetMode) return; collapsed = !collapsed; _syncCollapsed(); }
  function isCollapsed()    { return _bottomSheetMode || collapsed; }

  function syncDOM() {
    if (!panel) return;
    const H = document.getElementById('main').clientHeight || 560;
    panel.style.top    = '0';
    panel.style.left   = '0';
    panel.style.height = H + 'px';
    panel.style.width  = _palW + 'px';
    panel.classList.toggle('collapsed', _bottomSheetMode || collapsed);
  }

  function applyLang() {
    if (!panel) return;
    const titleEl = panel.querySelector('#pal2-title');
    if (titleEl) titleEl.textContent = _t('pal2Title');
    const addBtn  = panel.querySelector('#pal2-btn-add-section');
    if (addBtn) addBtn.textContent = _t('pal2AddSection');
    _renderList();
  }

  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }
  function init() { _build(); }

  return { layout, syncDOM, isCollapsed, toggleCollapse, applyLang, init, setOnCollapseChange };
})();