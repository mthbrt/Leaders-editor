// ── PALETTE (HTML/CSS pure — zéro canvas) ─────────────────────────────────────
const Palette = (() => {

  const MARGIN  = 30;
  const INNER   = 20;
  const RADIUS  = 20;
  const PAL_G   = 8;
  const RUB_W   = 60;
  const RUB_H   = 40;
  const CIRC_R  = 24;

  const GROUPS = [
    { key: 'lancement', labelKey: 'secLancement', names: Array.from({length:19}, (_,i) => String(i+1))  },
    { key: 'vermillon', labelKey: 'secVermillon', names: Array.from({length:5},  (_,i) => String(i+20)) },
  ];

  let collapsed  = false;
  let panel      = null;
  let ruban      = null;
  let bubble     = null;
  let lastPsz    = 0;   // pour ne recalculer la taille des items qu'en cas de changement
  let isBottomSheet = false; // true on narrow screens

  // ── Layout ─────────────────────────────────────────────────────────────────
  // Portrait mode = bottom sheet; landscape = right side panel
  function isPortrait(W, H) { return H > W; }

  function layout(W, H, rEst) {
    if (isPortrait(W, H)) {
      // Bottom sheet: full width, max height = H/2
      const palH = Math.round(H / 2);
      return { palX: 0, palY: H - palH, palW: W, palH, palCols: 6, _bottomSheet: true };
    }

    // Landscape: right-side panel
    const margin = Math.max(10, Math.min(MARGIN, W * 0.04));
    const cols   = 3;
    const psz    = rEst * 2;
    const itemSz = Math.round(psz * 0.90);
    const palW   = INNER * 2 + cols * itemSz + PAL_G * (cols - 1) + 2;
    const palH   = H - margin * 2;
    const palX   = W - palW - margin;
    const palY   = margin;
    return { palX, palY, palW, palH, palCols: cols, _bottomSheet: false };
  }

  // ── Hit testing ────────────────────────────────────────────────────────────
  function _mainRect() {
    return document.getElementById('main').getBoundingClientRect();
  }

  function inPalette(x, y) {
    const r = _mainRect();
    const el = document.elementFromPoint(x + r.left, y + r.top);
    if (!el) return false;
    return !!(el.closest('#pal-panel') || el.closest('#pal-ruban') || el.closest('#pal-bubble'));
  }

  function palAt(x, y) {
    const r = _mainRect();
    const el = document.elementFromPoint(x + r.left, y + r.top);
    if (!el) return null;
    const item = el.closest('.pal-item');
    return item ? item.dataset.name : null;
  }

  // ── No-ops pour compatibilité avec editor.js ───────────────────────────────
  function onDown(x, y)        { return false; }
  function onMove(x, y)        {}
  function onWheel(x, y, dy)   { return false; }
  function draw(ctx)           {}

  // ── Construction du DOM ───────────────────────────────────────────────────
  function _build() {
    const main = document.getElementById('main');

    // Panel — structure : header fixe / body scrollable / footer FIXE (hors body)
    panel = document.createElement('div');
    panel.id = 'pal-panel';
    panel.innerHTML = `
      <div id="pal-header"><span id="pal-title">PERSONNAGES</span></div>
      <div id="pal-body"><div id="pal-sections"></div></div>
      <div id="pal-footer"><button id="pal-reset">Réinitialiser</button></div>`;
    main.appendChild(panel);

    // Ruban (toggle collapse), positionné en absolu dans #main
    ruban = document.createElement('div');
    ruban.id = 'pal-ruban';
    ruban.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="84" height="40" viewBox="0 0 84 40">
      <polygon points="84,0 84,40 0,40 14,20 0,0" fill="#1a1a2e" stroke="rgba(70,70,160,0.5)" stroke-width="1.5" stroke-linejoin="round"/>
      <polyline id="ruban-chevron" points="26,14 34,20 26,26" fill="none" stroke="rgba(140,140,220,0.8)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    main.appendChild(ruban);

    // Bubble (état collapsed)
    bubble = document.createElement('div');
    bubble.id = 'pal-bubble';
    bubble.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <!-- Jeton / personnage : silhouette tête + corps -->
      <circle cx="18" cy="12" r="6" fill="rgba(140,140,220,0.85)"/>
      <path d="M6 32 C6 22 30 22 30 32" fill="rgba(140,140,220,0.85)"/>
      <!-- Petit + en bas à droite -->
      <circle cx="27" cy="27" r="7" fill="#1a1a2e" stroke="rgba(70,70,160,0.8)" stroke-width="1.2"/>
      <line x1="27" y1="23" x2="27" y2="31" stroke="rgba(140,140,220,0.9)" stroke-width="2" stroke-linecap="round"/>
      <line x1="23" y1="27" x2="31" y2="27" stroke="rgba(140,140,220,0.9)" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    main.appendChild(bubble);

    _buildSections();

    // Events collapse
    ruban.addEventListener('click', _toggleCollapse);
    bubble.addEventListener('click', _toggleCollapse);
    // In bottom-sheet mode, the header itself acts as the toggle
    panel.querySelector('#pal-header').addEventListener('click', e => {
      if (isBottomSheet) { e.stopPropagation(); _toggleCollapse(); }
    });

    panel.querySelector('#pal-reset').addEventListener('click', e => {
      e.stopPropagation(); doReset();
    });

    // IMPORTANT : on laisse mousedown remonter vers #main pour le drag&drop,
    // SAUF pour les éléments de contrôle (reset, headers de section, ruban).
    // On bloque seulement sur ces éléments précis.
    panel.querySelector('#pal-reset').addEventListener('mousedown', e => e.stopPropagation());
    panel.querySelector('#pal-header').addEventListener('mousedown', e => e.stopPropagation());
    ruban.addEventListener('mousedown', e => e.stopPropagation());
    bubble.addEventListener('mousedown', e => e.stopPropagation());
    // Les headers de section sont reconstruits, on délègue via le panel
    panel.addEventListener('mousedown', e => {
      const hdr = e.target.closest('.pal-sec-hdr');
      if (hdr) e.stopPropagation(); // ne pas déclencher de drag sur les headers
    });

    _syncCollapsed();
  }

  function _buildSections() {
    const container = panel.querySelector('#pal-sections');
    container.innerHTML = '';

    for (let gi = 0; gi < GROUPS.length; gi++) {
      const g = GROUPS[gi];
      const sec = document.createElement('div');
      sec.className = 'pal-section';

      const hdr = document.createElement('div');
      hdr.className = 'pal-sec-hdr';
      hdr.innerHTML = `<span class="pal-sec-label">${typeof t === 'function' ? t(g.labelKey) : g.labelKey}</span>`;

      const grid = document.createElement('div');
      grid.className = 'pal-grid open';

      for (const name of g.names) {
        const item = document.createElement('div');
        const banned = (S.banned || []).includes(name);
        item.className = 'pal-item' + (banned ? ' pal-item-banned' : '');
        item.dataset.name = name;
        const count = S.tokens.filter(t => t.name === name).length;
        const img = document.createElement('img');
        img.src = `jetons_noir/${name}.png`;
        img.alt = name;
        img.draggable = false;
        item.appendChild(img);
        if (count > 0) {
          const badge = document.createElement('span');
          badge.className = 'pal-badge';
          badge.textContent = count;
          item.appendChild(badge);
        }
        if (banned) {
          const banOverlay = document.createElement('div');
          banOverlay.className = 'pal-item-ban-overlay';
          const banImg = document.createElement('img');
          banImg.src = 'ui/ban.png';
          banImg.draggable = false;
          banOverlay.appendChild(banImg);
          item.appendChild(banOverlay);
        }
        grid.appendChild(item);
      }

      sec.appendChild(hdr);
      sec.appendChild(grid);
      container.appendChild(sec);
    }
  }

  function _applyItemSizes() {
    if (!panel) return;
    if (isBottomSheet) {
      const sz = Math.round(LO.r * 2) + 'px';
      for (const item of panel.querySelectorAll('.pal-item')) {
        item.style.width  = sz;
        item.style.height = sz;
      }
      return;
    }
    const { psz } = LO;
    if (!psz) return;
    const sz = Math.round(psz * 0.90) + 'px';
    for (const item of panel.querySelectorAll('.pal-item')) {
      item.style.width  = sz;
      item.style.height = sz;
    }
  }

  function _toggleCollapse() {
    collapsed = !collapsed;
    _syncCollapsed();
  }

  function _syncCollapsed() {
    panel.classList.toggle('collapsed', collapsed);
    if (isBottomSheet) {
      if (ruban)  ruban.style.display = 'none';
      if (bubble) bubble.style.display = 'none';
      // Notify editor to recenter board
      if (typeof onCollapseChange === 'function') onCollapseChange();
      return;
    }
    if (ruban) ruban.style.display = '';
    ruban.classList.toggle('collapsed', collapsed);
    bubble.classList.toggle('visible', collapsed);
    const chevron = ruban.querySelector('#ruban-chevron');
    if (chevron) chevron.setAttribute('points', collapsed ? '34,14 26,20 34,26' : '26,14 34,20 26,26');
    // Notify editor to recalculate board position
    if (typeof onCollapseChange === 'function') onCollapseChange();
    else syncDOM();
  }

  // ── Mise à jour du DOM après chaque render() ──────────────────────────────
  function syncDOM() {
    if (!panel) return;
    const { palX, palY, palW, palH, psz } = LO;
    const _bottomSheet = LO._palBottomSheet || LO._bottomSheet || false;

    // Detect mode switch and update class + state
    const newBottomSheet = !!_bottomSheet;
    if (newBottomSheet !== isBottomSheet) {
      isBottomSheet = newBottomSheet;
      panel.classList.toggle('bottom-sheet', isBottomSheet);
      if (isBottomSheet) {
        // Start collapsed (just the handle tab shows) when entering portrait mode
        collapsed = true;
        panel.classList.add('collapsed');
      } else {
        // Entering landscape: always start expanded
        collapsed = false;
        panel.classList.remove('collapsed');
      }
      lastPsz = 0; // force item resize
    }
    // Keep collapsed class in sync
    panel.classList.toggle('collapsed', collapsed);

    // Position + size of panel
    panel.style.left   = palX + 'px';
    panel.style.top    = palY + 'px';
    panel.style.width  = palW + 'px';
    panel.style.height = palH + 'px';

    if (isBottomSheet) {
      // Hide sidebar controls
      if (ruban)  ruban.style.display  = 'none';
      if (bubble) bubble.style.display = 'none';
    } else {
      if (ruban)  ruban.style.display  = '';
      if (bubble) bubble.style.display = '';
      // Bubble position
      bubble.style.left = (palX + palW - CIRC_R * 2) + 'px';
      bubble.style.top  = (palY + RADIUS + RUB_H / 2 - CIRC_R) + 'px';
      // Ruban position
      const bubbleCX = palX + palW - CIRC_R;
      ruban.style.left = (collapsed ? bubbleCX - CIRC_R - RUB_W : palX - RUB_W) + 'px';
      ruban.style.top  = (palY + RADIUS) + 'px';
    }

    // Recalculate item sizes when psz or mode changes
    const effectivePsz = isBottomSheet ? (LO.r || 0) : (psz || 0);
    if (Math.abs(effectivePsz - lastPsz) > 0.5) {
      lastPsz = effectivePsz;
      _applyItemSizes();
    }

    _syncItems();
  }

  function _syncItems() {
    for (const item of panel.querySelectorAll('.pal-item')) {
      const name  = item.dataset.name;
      const banned = (S.banned || []).includes(name);
      item.classList.toggle('pal-item-banned', banned);
      const count = S.tokens.filter(t => t.name === name).length;
      const img   = item.querySelector('img');
      const expectedSrc = `jetons_noir/${name}.png`;
      if (!img.src.endsWith(expectedSrc)) img.src = expectedSrc;
      let badge = item.querySelector('.pal-badge');
      if (count > 0) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'pal-badge'; item.appendChild(badge); }
        badge.textContent = count;
      } else {
        if (badge) badge.remove();
      }
      // Sync ban overlay
      let banOverlay = item.querySelector('.pal-item-ban-overlay');
      if (banned) {
        if (!banOverlay) {
          banOverlay = document.createElement('div');
          banOverlay.className = 'pal-item-ban-overlay';
          const banImg = document.createElement('img');
          banImg.src = 'ui/ban.png';
          banImg.draggable = false;
          banOverlay.appendChild(banImg);
          item.appendChild(banOverlay);
        }
      } else {
        if (banOverlay) banOverlay.remove();
      }
    }
  }

  function applyLang() {
    const title = panel && panel.querySelector('#pal-title');
    if (title && typeof t === 'function') title.textContent = t('palTitle');
    const reset = panel && panel.querySelector('#pal-reset');
    if (reset && typeof t === 'function') reset.textContent = t('palReset');
    // Update section headers
    panel && panel.querySelectorAll('.pal-sec-hdr').forEach((hdr, gi) => {
      const label = hdr.querySelector('.pal-sec-label');
      if (label && GROUPS[gi] && typeof t === 'function') label.textContent = t(GROUPS[gi].labelKey);
    });
  }

  function getScrollY()  { return 0; }
  function isCollapsed() { return collapsed; }
  function init()        { _build(); }

  // Callback set by editor so palette toggle triggers a full relayout
  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }

  return { layout, draw, onDown, onMove, onWheel, inPalette, palAt,
           syncDOM, getScrollY, isCollapsed, applyLang, init, setOnCollapseChange };
})();