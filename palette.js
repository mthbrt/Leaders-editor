// ── PALETTE (HTML/CSS pure — zéro canvas) ─────────────────────────────────────
const Palette = (() => {

  const INNER    = 20;
  const PAL_G    = 8;
  const MIN_COLS = 3;
  const MAX_COLS = 5;

  const GROUPS = [
    { key: 'lancement', labelKey: null,          names: Array.from({ length: 17 }, (_, i) => String(i + 3)) },
    { key: 'vermillon', labelKey: 'secVermillon', names: Array.from({ length: 5  }, (_, i) => String(i + 20)) },
    { key: 'leaders',   labelKey: 'secLeaders',   names: ['1', '2', '25'] },
  ];

  let collapsed     = false;
  let panel         = null;
  let lastCollapsed = false;
  let _itemEls      = []; // [{ el, name }] — cached once in _buildSections, reused by _syncItems
  let _sectionEls   = []; // [{ el, items: [{ el, name }] }] — reused by _applyFilters

  // ── Header filter icons — single-select across a/b/c types (tooltip.js), re-click to clear.
  // Plus an independent "hide on board" toggle. Leaders and id 26 have no type, so only that one.
  const _loadFilterBool = (key, def) => { const v = localStorage.getItem(key); return v === null ? def : v === 'true'; };
  let selectedType = localStorage.getItem('leaders-pal-filter-type') || null;
  let hideOnBoard = _loadFilterBool('leaders-pal-filter-hide-on-board', false);

  // ── Palette token context menu (ban / unban) ──────────────────────────────
  let palTbName = null;

  function _placePalToolbar(name, x, y) {
    palTbName = name;
    const fr     = typeof currentLang !== 'undefined' && currentLang === 'fr';
    const banned = isBanned(name);
    const items = [{
      label: banned ? (fr ? 'Débannir' : 'Unban') : (fr ? 'Bannir' : 'Ban'),
      danger: !banned,
      onClick: () => {
        banned ? doUnban(name) : doBan(name);
        palTbName = null;
      },
    }];
    _openCtxMenu('pal-tok-tb', x, y, items);
  }

  function _hidePalToolbar() {
    _closeCtxMenu('pal-tok-tb');
    palTbName = null;
    Tooltip?.hide();
  }

  function isPalTbOpen() { return palTbName !== null; }

  // ── Layout ─────────────────────────────────────────────────────────────────
  // Item diameter matches board tokens (LO.r * 2).
  const _itemSzFromR  = r => Math.round(r * 2);
  // +4px is deliberate slack against fractional-pixel rounding under non-100% display scaling.
  const _widthForCols = (cols, itemSz) => INNER * 2 + cols * itemSz + PAL_G * (cols - 1) + 4;

  // Desktop only — mobile sizes this panel entirely via CSS (see body.layout-mobile rules).
  function layout(W, H, rEst) {
    const palW = _widthForCols(MIN_COLS, _itemSzFromR(rEst));
    return { palX: W - palW, palY: 0, palW, palH: H };
  }

  // Growing only ever consumes width the board didn't need, never shrinking it: a column is added
  // only if the resulting gap stays at least as wide as the board's own height-bound gap.
  function growColumns(mainW, mainH, pal2W, r) {
    const itemSz = _itemSzFromR(r);
    const heightBoundW = BOARD_COLS * (mainH / BOARD_ROWS);
    let cols = MIN_COLS, palW = _widthForCols(cols, itemSz);
    for (let next = cols + 1; next <= MAX_COLS; next++) {
      const candidateW = _widthForCols(next, itemSz);
      if (mainW - pal2W - candidateW < heightBoundW) break; // would shrink the board — stop
      cols = next; palW = candidateW;
    }
    return { cols, palW };
  }

  // ── Hit testing ────────────────────────────────────────────────────────────
  // x,y are relative to #board-area (see editor.js's _mainXY/_touchXY) — match that origin.
  function _mainRect() { return LO.boardRect; }

  function inPalette(x, y) {
    const r  = _mainRect();
    const el = document.elementFromPoint(x + r.left, y + r.top);
    return !!(el?.closest('#pal-panel, #pal-ruban, #pal-bubble'));
  }

  function palAt(x, y) {
    const r  = _mainRect();
    const el = document.elementFromPoint(x + r.left, y + r.top);
    return el?.closest('.pal-item')?.dataset.name ?? null;
  }

  function onMove(x, y) {
    if (palTbName !== null) return;
    if (typeof showTooltips !== 'undefined' && !showTooltips) { Tooltip.hide(); return; }
    const name = palAt(x, y);
    if (name) {
      const itemEl = panel?.querySelector(`.pal-item[data-name="${name}"]`);
      if (itemEl) {
        // Rect is measured before the `:hover` translateY(-4px) (style.css) transitions in, but
        // the tooltip appears after it has — offset compensates so it lines up with the risen token.
        const HOVER_LIFT = 4;
        const r     = itemEl.getBoundingClientRect();
        const itemR = r.width / 2;
        Tooltip.schedulePal(name, r.left + itemR, r.top + itemR - HOVER_LIFT, 'pal:' + name, itemR);
      }
    } else {
      Tooltip.hide();
    }
  }

  // ── DOM construction ───────────────────────────────────────────────────────
  function _build() {
    const main = document.getElementById('main');
    panel = document.createElement('div');
    panel.id = 'pal-panel';
    panel.innerHTML = `
      <div id="pal-header">
        <span id="pal-title"></span>
        <div class="pal-header-actions">
          <button id="pal-filter-btn" class="pal-filter-btn" data-tooltip="${t('palFilterTitle')}" aria-label="${t('palFilterTitle')}">
            <svg class="pal-filter-icon-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <svg class="pal-filter-icon-on" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </button>
          <!-- Mobile popup only (see style.css) — closing the panel on desktop is the toolbar's own toggle button. -->
          <button id="pal-popup-close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="pal-body"><div id="pal-sections"></div></div>`;
    main.appendChild(panel);

    _buildSections();
    _syncFilterButtons();
    _applyFilters();

    panel.querySelector('#pal-header').addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('mousedown', e => { if (e.target.closest('.pal-sec-hdr')) e.stopPropagation(); });

    panel.querySelector('#pal-filter-btn').addEventListener('click', e => {
      _filterMenuEl ? _closeFilterMenu() : _openFilterMenu(e.currentTarget);
    });
    panel.querySelector('#pal-popup-close').addEventListener('click', () => _closeMobilePalettePopup());

    // Clic molette → ban/unban
    panel.addEventListener('mousedown', e => {
      if (e.button !== 1) return;
      e.preventDefault(); e.stopPropagation();
      const name = e.target.closest('.pal-item')?.dataset.name;
      if (name) isBanned(name) ? doUnban(name) : doBan(name);
    });

    // Clic droit → toolbar ban. GHOST_TAP_MS guard: see editor.js's GHOST_TAP_MS comment — skips
    // this same long-press's own trailing native contextmenu.
    panel.addEventListener('contextmenu', e => {
      e.preventDefault(); e.stopPropagation();
      if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
      const item = e.target.closest('.pal-item');
      if (!item?.dataset.name) return;
      Tooltip.hide();
      _placePalToolbar(item.dataset.name, e.clientX, e.clientY);
    });

    _syncCollapsed();
  }

  // Header icon just reflects whether *any* filter is active — per-option state is in the dropdown.
  function _syncFilterButtons() {
    if (!panel) return;
    const anyActive = selectedType !== null || hideOnBoard;
    panel.querySelector('#pal-filter-btn')?.classList.toggle('active', anyActive);
  }

  function _selectType(type) {
    selectedType = selectedType === type ? null : type;
    if (selectedType) localStorage.setItem('leaders-pal-filter-type', selectedType);
    else localStorage.removeItem('leaders-pal-filter-type');
    _syncFilterButtons(); _applyFilters();
  }

  // ── Filter dropdown — its own menu, not the shared _openCtxMenu: stays open across multiple
  // toggles, only closes on an outside click.
  let _filterMenuEl = null;
  let _filterMenuClose = null;

  function _filterMenuItemDefs() {
    const checkSvg = '<svg class="pal-filter-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5 7.5 5.5 10.5 11.5 3.5"/></svg>';
    const eyeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
    // Check slot is always rendered (empty when unchecked) so toggling never changes the row's width.
    const row = (icon, label, checked) =>
      `${icon}<span style="flex:1">${label}</span><span class="pal-filter-check-slot">${checked ? checkSvg : ''}</span>`;

    return [
      { html: row(eyeSvg, t('palFilterOnBoard'), hideOnBoard), onClick: () => {
        hideOnBoard = !hideOnBoard;
        localStorage.setItem('leaders-pal-filter-hide-on-board', hideOnBoard);
        _syncFilterButtons(); _applyFilters(); _renderFilterMenuBody();
      } },
      { sep: true },
      { html: row(TOKEN_ICONS.a, t('palFilterActive'),  selectedType === 'a'), onClick: () => { _selectType('a'); _renderFilterMenuBody(); } },
      { html: row(TOKEN_ICONS.b, t('palFilterPassive'), selectedType === 'b'), onClick: () => { _selectType('b'); _renderFilterMenuBody(); } },
      { html: row(TOKEN_ICONS.c, t('palFilterSpecial'), selectedType === 'c'), onClick: () => { _selectType('c'); _renderFilterMenuBody(); } },
    ];
  }

  function _renderFilterMenuBody() {
    if (!_filterMenuEl) return;
    const items = _filterMenuItemDefs();
    _filterMenuEl._items = items;
    _filterMenuEl.innerHTML = items.map((it, i) => it.sep
      ? `<div class="tok-tb-sep"></div>`
      : `<button class="tok-tb-btn" data-idx="${i}">${it.html}</button>`
    ).join('');
  }

  function _openFilterMenu(anchorBtn) {
    const el = document.createElement('div');
    el.id = 'pal-filter-menu';
    document.body.appendChild(el);
    _filterMenuEl = el;
    // Synchronous, not deferred to the rAF below (that's only for the visual reveal) — see
    // editor.js's _openCtxMenu comment: a stale deferred _menuOpened() landing after a rapid
    // reopen's own _menuClosed() would permanently inflate the shared counter.
    _menuOpened();
    _renderFilterMenuBody();

    el.style.display    = 'flex';
    el.style.visibility = 'hidden';
    el.style.transition = 'none';
    void el.offsetWidth;

    // Top-right corner of the menu aligned to the button's right edge, clamped to stay on-screen.
    const r   = anchorBtn.getBoundingClientRect();
    const ew  = el.offsetWidth, eh = el.offsetHeight;
    const vw  = window.innerWidth, vh = window.innerHeight;
    const GAP = 4;
    let left = Math.max(GAP, Math.min(r.right - ew, vw - ew - GAP));
    let top  = r.bottom + GAP;
    if (top + eh > vh - GAP) top = Math.max(GAP, r.top - eh - GAP);
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
      el._items[+btn.dataset.idx]?.onClick?.();
    };
    el.addEventListener('mousedown', onAction);

    const onOutside = e => { if (!el.contains(e.target) && !anchorBtn.contains(e.target)) _closeFilterMenu(); };
    document.addEventListener('mousedown', onOutside, true);
    // Same reasoning as editor.js's _openCtxMenu: always preventDefault, but ignore it as a
    // dismiss signal within GHOST_TAP_MS (a touch long-press's own trailing native event).
    const onContext = e => {
      e.preventDefault();
      if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
      if (!el.contains(e.target)) _closeFilterMenu();
    };
    document.addEventListener('contextmenu', onContext, true);

    _filterMenuClose = () => {
      el.classList.remove('open');
      el.removeEventListener('mousedown', onAction);
      document.removeEventListener('mousedown', onOutside, true);
      document.removeEventListener('contextmenu', onContext, true);
      el.remove();
      _menuClosed();
    };
  }

  function _closeFilterMenu() {
    _filterMenuClose?.();
    _filterMenuClose = null;
    _filterMenuEl    = null;
  }

  // Hides items that don't match selectedType, or (hideOnBoard) already have a copy on the board.
  // Also hides a section entirely once every item in it is filtered out, tracking the last visible
  // one so its divider (::after, style.css) doesn't trail a run of hidden sections.
  function _applyFilters() {
    if (!panel) return;
    const onBoardSet = new Set(S.tokens.map(tok => tok.name));

    for (const { el: item, name } of _itemEls) {
      const type   = TOKEN_DATA_EN[name]?.type;
      const hidden = (selectedType !== null && type !== selectedType)
        || (hideOnBoard && onBoardSet.has(name));
      item.classList.toggle('pal-item-filtered-out', hidden);
    }

    let lastVisibleSection = null;
    for (const { el: sec, items } of _sectionEls) {
      const empty = items.every(it => it.el.classList.contains('pal-item-filtered-out'));
      sec.classList.toggle('pal-section-empty', empty);
      sec.classList.remove('pal-section-last-visible');
      if (!empty) lastVisibleSection = sec;
    }
    lastVisibleSection?.classList.add('pal-section-last-visible');
  }

  function _buildSections() {
    const container = panel.querySelector('#pal-sections');
    container.innerHTML = '';
    _itemEls = [];
    _sectionEls = [];

    for (let gi = 0; gi < GROUPS.length; gi++) {
      const g   = GROUPS[gi];
      const sec = document.createElement('div');
      sec.className = 'pal-section';
      const secItems = [];

      const grid = document.createElement('div');
      grid.className = 'pal-grid open';

      if (gi === 0) {
        grid.classList.add('pal-grid-first');
      } else {
        const hdr = document.createElement('div');
        hdr.className = 'pal-sec-hdr';
        hdr.dataset.groupIndex = gi;
        hdr.innerHTML = `<span class="pal-sec-label">${typeof t === 'function' ? t(g.labelKey) : g.labelKey}</span>`;
        sec.appendChild(hdr);
      }

      for (const name of g.names) {
        const item  = _mkItem(name);
        const entry = { el: item, name };
        _itemEls.push(entry);
        secItems.push(entry);
        grid.appendChild(item);
      }
      sec.appendChild(grid);
      container.appendChild(sec);
      _sectionEls.push({ el: sec, items: secItems });
    }
  }

  function _mkItem(name) {
    const banned = (S.banned || []).includes(name);
    const count  = S.tokens.filter(t => t.name === name).length;

    const item = document.createElement('div');
    item.className    = 'pal-item' + (banned ? ' pal-item-banned' : '') + (count > 0 ? ' pal-item-on-board' : '');
    item.dataset.name = name;

    const img = document.createElement('img');
    img.src       = `jetons_noir/${name}.png`;
    img.alt       = name;
    img.draggable = false;
    item.appendChild(img);

    item._badge = null;
    if (count >= 2) {
      const badge = document.createElement('span');
      badge.className   = 'pal-badge';
      badge.textContent = count;
      item.appendChild(badge);
      item._badge = badge;
    }

    item._banOverlay = null;
    if (banned) {
      const banOverlay = document.createElement('div');
      banOverlay.className = 'pal-item-ban-overlay';
      const banImg = document.createElement('img');
      banImg.src       = 'ui/ban.png';
      banImg.draggable = false;
      banOverlay.appendChild(banImg);
      item.appendChild(banOverlay);
      item._banOverlay = banOverlay;
    }

    return item;
  }

  // Collapse/expand is a desktop-only concept — on mobile, visibility is tab-driven instead.
  function _toggleCollapse()  { if (isMobileLayout()) return; collapsed = !collapsed; _syncCollapsed(); }

  function _syncCollapsed() {
    panel.classList.toggle('collapsed', collapsed);
    onCollapseChange?.();
  }

  // Geometry only; called by relayout(). Mobile sizes/shows this panel entirely via CSS.
  function syncLayout() {
    if (!panel) return;
    panel.style.left = panel.style.top = panel.style.width = panel.style.height = '';

    if (collapsed !== lastCollapsed) {
      lastCollapsed = collapsed;
      panel.classList.toggle('collapsed', collapsed);
    }

    // Mobile popup: items are maximized to fill exactly 5 columns instead of matching the board's
    // token size. Computed here (a real px value set on #pal-panel, inherited down) rather than as
    // a CSS-only percentage in --tok-sz's formula — a percentage baked into a custom property
    // re-resolves against whichever element/property actually consumes it, not against the element
    // where the variable was declared, so it silently went wrong for anything below .pal-item that
    // also reads --tok-sz (the recruit-count badge's position, the on-board ring's width) instead
    // of just .pal-item's own width/height. A plain px value has no such ambiguity.
    if (isMobileLayout()) {
      const grid = panel.querySelector('.pal-grid');
      if (grid) {
        const cs   = getComputedStyle(grid);
        const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const GAP = 6, COLS = 5;
        const itemSz = Math.max(0, (grid.clientWidth - padX - GAP * (COLS - 1)) / COLS);
        panel.style.setProperty('--tok-sz', itemSz + 'px');
      }
    } else {
      panel.style.removeProperty('--tok-sz');
    }
  }

  // No-ops during a drag — board state never changes mid-drag, only the ghost moves.
  function syncContent() {
    if (!panel || drag) return;
    _syncItems();
    if (hideOnBoard) _applyFilters();
  }

  function _syncItems() {
    const bannedSet = new Set(S.banned || []);
    const counts    = new Map();
    for (const tok of S.tokens) counts.set(tok.name, (counts.get(tok.name) || 0) + 1);

    for (const { el: item, name } of _itemEls) {
      const banned = bannedSet.has(name);
      const count  = counts.get(name) || 0;

      item.classList.toggle('pal-item-banned',   banned);
      item.classList.toggle('pal-item-on-board', count > 0);

      if (count >= 2) {
        if (!item._badge) {
          item._badge = document.createElement('span');
          item._badge.className = 'pal-badge';
          item.appendChild(item._badge);
        }
        item._badge.textContent = count;
      } else if (item._badge) {
        item._badge.remove();
        item._badge = null;
      }

      if (banned && !item._banOverlay) {
        item._banOverlay = document.createElement('div');
        item._banOverlay.className = 'pal-item-ban-overlay';
        const banImg = document.createElement('img'); banImg.src = 'ui/ban.png'; banImg.draggable = false;
        item._banOverlay.appendChild(banImg); item.appendChild(item._banOverlay);
      } else if (!banned && item._banOverlay) {
        item._banOverlay.remove();
        item._banOverlay = null;
      }
    }
  }

  function applyLang() {
    if (!panel) return;
    const titleEl = panel.querySelector('#pal-title');
    if (titleEl) titleEl.textContent = t('palTitle');

    panel.querySelectorAll('.pal-sec-hdr[data-group-index]').forEach(hdr => {
      const gi    = +hdr.dataset.groupIndex;
      const group = GROUPS[gi];
      if (group?.labelKey) {
        const label = hdr.querySelector('.pal-sec-label');
        if (label) label.textContent = t(group.labelKey);
      }
    });

    const filterBtn = panel.querySelector('#pal-filter-btn');
    if (filterBtn) {
      const label = t('palFilterTitle');
      filterBtn.dataset.tooltip = label; filterBtn.setAttribute('aria-label', label);
    }
  }

  function isCollapsed()  { return collapsed; }
  function toggleCollapse() { _toggleCollapse(); }
  function init() { _build(); }
  function getPanelEl() { return panel; }

  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }

  return {
    layout, growColumns, onMove, inPalette, palAt,
    syncLayout, syncContent, isCollapsed, toggleCollapse, applyLang, init, setOnCollapseChange,
    isPalTbOpen, hidePalToolbar: _hidePalToolbar, openPalToolbar: _placePalToolbar, getPanelEl,
  };
})();