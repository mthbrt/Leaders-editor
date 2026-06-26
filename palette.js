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

  // ── Palette token toolbar (ban / unban) ───────────────────────────────────
  let palTb     = null;
  let palTbName = null;

  function _mkPalToolbar() {
    if (palTb) return palTb;
    const el = document.createElement('div');
    el.id = 'pal-tok-tb';
    el.innerHTML = `<button class="tok-tb-btn" id="pal-tok-ban"><span id="pal-tok-ban-label"></span></button>`;
    document.body.appendChild(el);
    el.addEventListener('mousedown', e => e.stopPropagation());
    el.querySelector('#pal-tok-ban').addEventListener('click', e => {
      e.stopPropagation();
      if (!palTbName) return;
      isBanned(palTbName) ? doUnban(palTbName) : doBan(palTbName);
      _hidePalToolbar();
    });
    palTb = el;
    return el;
  }

  function _updatePalToolbarLabel() {
    const label = palTb?.querySelector('#pal-tok-ban-label');
    if (!label) return;
    const banned = isBanned(palTbName);
    const fr     = typeof currentLang !== 'undefined' && currentLang === 'fr';
    label.textContent = banned ? (fr ? 'Débannir' : 'Unban') : (fr ? 'Bannir' : 'Ban');
    const btn = palTb.querySelector('#pal-tok-ban');
    if (btn) {
      btn.style.color = banned ? 'var(--text)' : '#e05555';
      btn.onmouseenter = () => { btn.style.background = 'var(--btn-bg-h)'; btn.style.color = banned ? '#ffffff' : '#f47474'; };
      btn.onmouseleave = () => { btn.style.background = ''; btn.style.color = banned ? 'var(--text)' : '#e05555'; };
    }
  }

  function _placePalToolbar(name, itemEl) {
    palTbName = name;
    const el = _mkPalToolbar();
    _updatePalToolbarLabel();

    el.classList.remove('open', 'pal-tb-arrow-right', 'pal-tb-arrow-left');
    el.style.display    = 'flex';
    el.style.visibility = 'hidden';
    el.style.transition = 'none';
    void el.offsetWidth;

    const elW = el.offsetWidth, elH = el.offsetHeight;
    const GAP      = 10;
    const itemRect = itemEl.getBoundingClientRect();
    const itemCY   = itemRect.top + itemRect.height / 2;
    const vh       = window.innerHeight;

    let x = itemRect.left - elW - GAP;
    let arrowSide = 'right';
    if (x < 8) { x = itemRect.right + GAP; arrowSide = 'left'; }

    let y = itemCY - elH / 2;
    y = Math.max(8, Math.min(y, vh - elH - 8));

    const arrowY = Math.max(14, Math.min(itemCY - y, elH - 14));
    el.style.setProperty('--arrow-y', arrowY + 'px');
    el.classList.add(arrowSide === 'right' ? 'pal-tb-arrow-right' : 'pal-tb-arrow-left');
    el.style.position = 'fixed';
    el.style.left     = x + 'px';
    el.style.top      = y + 'px';

    requestAnimationFrame(() => { el.style.transition = ''; el.style.visibility = ''; el.classList.add('open'); });

    const _onOutside = ev => {
      if (el.contains(ev.target)) return;
      _hidePalToolbar();
      document.removeEventListener('mousedown', _onOutside, true);
    };
    document.addEventListener('mousedown', _onOutside, true);
  }

  function _hidePalToolbar() {
    if (!palTb) return;
    palTb.classList.remove('open');
    palTb.style.display    = 'none';
    palTb.style.visibility = '';
    palTb.style.transition = '';
    palTbName = null;
    Tooltip?.hide();
  }

  function isPalTbOpen() { return palTbName !== null; }

  // ── Layout ─────────────────────────────────────────────────────────────────
  // Item diameter matches board tokens exactly (LO.r * 2) — no separate scale factor.
  const _itemSzFromR  = r => Math.round(r * 2);
  // Width for `cols` items at `itemSz` px, matching .pal-grid's own padding/gap (INNER on each
  // side, PAL_G between items) — #pal-panel has no border consuming this budget (see style.css,
  // it uses a non-layout box-shadow instead). +4px is deliberate slack against fractional-pixel
  // rounding under non-100% OS display scaling, not a correction for wrong math.
  const _widthForCols = (cols, itemSz) => INNER * 2 + cols * itemSz + PAL_G * (cols - 1) + 4;

  // Desktop only — mobile sizes this panel entirely via CSS (see body.layout-mobile rules).
  function layout(W, H, rEst) {
    const palW = _widthForCols(MIN_COLS, _itemSzFromR(rEst));
    return { palX: W - palW, palY: 0, palW, palH: H };
  }

  // Decides the final column count (3..5) once the board's true radius `r` is locked in.
  // Growing only ever consumes width the board didn't need — it never shrinks the board:
  // a column is only added if the resulting center gap would stay at least as wide as the
  // gap at which the board's own size is height-bound (i.e. width isn't yet the constraint).
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
  // x,y arrive relative to #board-area (see editor.js's _mainXY/_touchXY) — match that origin.
  function _mainRect() { return document.getElementById('board-area').getBoundingClientRect(); }

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
        const r     = itemEl.getBoundingClientRect();
        const itemR = r.width / 2;
        Tooltip.schedulePal(name, r.left + itemR, r.top + itemR, 'pal:' + name, itemR);
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
      <div id="pal-header"><span id="pal-title"></span></div>
      <div id="pal-body"><div id="pal-sections"></div></div>
      <div id="pal-footer"><button id="pal-reset"></button></div>`;
    main.appendChild(panel);

    _buildSections();

    panel.querySelector('#pal-reset').addEventListener('click', e => { e.stopPropagation(); doReset(); });
    panel.querySelector('#pal-reset').addEventListener('mousedown', e => e.stopPropagation());
    panel.querySelector('#pal-header').addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('mousedown', e => { if (e.target.closest('.pal-sec-hdr')) e.stopPropagation(); });

    // Clic molette → ban/unban
    panel.addEventListener('mousedown', e => {
      if (e.button !== 1) return;
      e.preventDefault(); e.stopPropagation();
      const name = e.target.closest('.pal-item')?.dataset.name;
      if (name) isBanned(name) ? doUnban(name) : doBan(name);
    });

    // Clic droit → toolbar ban
    panel.addEventListener('contextmenu', e => {
      e.preventDefault(); e.stopPropagation();
      if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
      const item = e.target.closest('.pal-item');
      if (!item?.dataset.name) return;
      Tooltip.hide();
      _placePalToolbar(item.dataset.name, item);
    });

    _syncCollapsed();
  }

  function _buildSections() {
    const container = panel.querySelector('#pal-sections');
    container.innerHTML = '';

    for (let gi = 0; gi < GROUPS.length; gi++) {
      const g   = GROUPS[gi];
      const sec = document.createElement('div');
      sec.className = 'pal-section';

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

      for (const name of g.names) grid.appendChild(_mkItem(name));
      sec.appendChild(grid);
      container.appendChild(sec);
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

    if (count >= 2) {
      const badge = document.createElement('span');
      badge.className   = 'pal-badge';
      badge.textContent = count;
      item.appendChild(badge);
    }

    if (banned) {
      const banOverlay = document.createElement('div');
      banOverlay.className = 'pal-item-ban-overlay';
      const banImg = document.createElement('img');
      banImg.src       = 'ui/ban.png';
      banImg.draggable = false;
      banOverlay.appendChild(banImg);
      item.appendChild(banOverlay);
    }

    return item;
  }

  // Collapse/expand is a desktop-only concept — on mobile, visibility is tab-driven instead.
  function _toggleCollapse()  { if (isMobileLayout()) return; collapsed = !collapsed; _syncCollapsed(); }

  function _syncCollapsed() {
    panel.classList.toggle('collapsed', collapsed);
    onCollapseChange?.();
  }

  // ── syncLayout — geometry only; called by relayout() on actual layout changes.
  // Mobile sizes/shows this panel entirely via CSS (body.layout-mobile + .tab-active) — only
  // the desktop grid needs any geometry help here, and only the .collapsed slide needs JS at all.
  // Item sizing/outline are pure CSS, reactive to --tok-sz (see style.css) — nothing to do here.
  function syncLayout() {
    if (!panel) return;
    panel.style.left = panel.style.top = panel.style.width = panel.style.height = '';

    if (collapsed !== lastCollapsed) {
      lastCollapsed = collapsed;
      panel.classList.toggle('collapsed', collapsed);
    }
  }

  // ── syncContent — token-state-dependent DOM patches; called by render() on every mutation ──
  function syncContent() {
    if (!panel) return;
    _syncItems();
  }

  function _syncItems() {
    for (const item of panel.querySelectorAll('.pal-item[data-name]')) {
      const name   = item.dataset.name;
      const banned = (S.banned || []).includes(name);
      const count  = S.tokens.filter(t => t.name === name).length;
      const img    = item.querySelector('img');

      item.classList.toggle('pal-item-banned',    banned);
      item.classList.toggle('pal-item-on-board',  count > 0);

      const expectedSrc = `jetons_noir/${name}.png`;
      if (!img.src.endsWith(expectedSrc)) img.src = expectedSrc;

      let badge = item.querySelector('.pal-badge');
      if (count >= 2) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'pal-badge'; item.appendChild(badge); }
        badge.textContent = count;
      } else {
        badge?.remove();
      }

      let banOverlay = item.querySelector('.pal-item-ban-overlay');
      if (banned && !banOverlay) {
        banOverlay = document.createElement('div');
        banOverlay.className = 'pal-item-ban-overlay';
        const banImg = document.createElement('img'); banImg.src = 'ui/ban.png'; banImg.draggable = false;
        banOverlay.appendChild(banImg); item.appendChild(banOverlay);
      } else if (!banned && banOverlay) {
        banOverlay.remove();
      }
    }
  }

  function applyLang() {
    if (!panel) return;
    const titleEl = panel.querySelector('#pal-title');
    if (titleEl) titleEl.textContent = t('palTitle');
    const resetEl = panel.querySelector('#pal-reset');
    if (resetEl) resetEl.textContent = t('palReset');

    // Les headers sont présents pour les groupes 1+ (gi > 0)
    panel.querySelectorAll('.pal-sec-hdr[data-group-index]').forEach(hdr => {
      const gi    = +hdr.dataset.groupIndex;
      const group = GROUPS[gi];
      if (group?.labelKey) {
        const label = hdr.querySelector('.pal-sec-label');
        if (label) label.textContent = t(group.labelKey);
      }
    });
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