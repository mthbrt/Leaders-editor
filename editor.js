// ── I18N ──────────────────────────────────────────────────────────────────────
const LANGS = {
  fr: {
    placeholder:    'Coller une configuration…',
    btnCopy:        'Copier la configuration',
    btnUndo:        'Annuler',
    btnRedo:        'Rétablir',
    btnClearArrows: 'Effacer toutes les flèches',
    btnSettings:    'Paramètres',
    copied:         'Copié !',
    settingsTitle:  'Paramètres',
    rowLabels:      'Indices plateau',
    descLabels:     'Marque les coordonnées sur chaque case du plateau',
    rowOutline:     'Bordures',
    descOutline:    'Ajoute une bordure blanche ou noire sur chaque personnage',
    rowShadow:      'Ombres',
    descShadow:     'Ajoute une ombre sous chaque personnage',
    rowLang:        'Langue',
    palTitle:       'PERSONNAGES',
    palReset:       'Réinitialiser',
    secVermillon:   'Extension Vermillon',
    secArchetypes:  'Archétypes',
    btnHelp:          'Aide',
    helpTitle:        'Commandes',
    helpSecTokens:    'Personnages',
    helpDragBoard:    'Clic gauche',
    helpDragBoardDesc:'Déplacer les personnages par glisser-déposer',
    helpMiddleTok:    'Clic molette',
    helpMiddleTokDesc:'Plateau : changer équipe<br>Liste des personnages : bannir / débannir',
    helpRightTok:     'Clic droit',
    helpRightTokDesc: 'Plateau : menu (équipe / supprimer)<br>Liste des personnages : placer sur le plateau',
    helpSecArrows:    'Flèches',
    helpClickArrow:   'Clic gauche',
    helpClickArrowDesc:'Sélectionner la flèche (couleur / supprimer)',
    helpRightDrag:    'Clic droit',
    helpRightDragDesc:'Maintenir appuyé et glisser vers une autre case pour tracer une flèche',
    helpDelArrow:     'Suppr / Backspace',
    helpDelArrowDesc: 'Supprimer la flèche sélectionnée',
    helpSecGeneral:   'Général',
    helpArrowKeys:    'Annuler / Rétablir',
    helpEsc:          'Annuler action en cours',
  },
  en: {
    placeholder:    'Paste a configuration…',
    btnCopy:        'Copy configuration',
    btnUndo:        'Undo',
    btnRedo:        'Redo',
    btnClearArrows: 'Clear all arrows',
    btnSettings:    'Settings',
    copied:         'Copied!',
    settingsTitle:  'Settings',
    rowLabels:      'Board labels',
    descLabels:     'Shows coordinates on each board cell',
    rowOutline:     'Outlines',
    descOutline:    'Adds a white or black outline on each character',
    rowShadow:      'Shadows',
    descShadow:     'Adds a shadow under each character',
    rowLang:        'Language',
    palTitle:       'CHARACTERS',
    palReset:       'Reset',
    secVermillon:   'Vermillon Expansion',
    secArchetypes:  'Archetypes',
    btnHelp:          'Help',
    helpTitle:        'Controls',
    helpSecTokens:    'Characters',
    helpDragBoard:    'Left-click',
    helpDragBoardDesc:'Move the characters by drag and drop',
    helpMiddleTok:    'Middle-click',
    helpMiddleTokDesc:'Board: toggle team<br>Character list: ban / unban',
    helpRightTok:     'Right-click',
    helpRightTokDesc: 'Board: menu (team / delete)<br>Character list: place on board',
    helpSecArrows:    'Arrows',
    helpClickArrow:   'Left-click',
    helpClickArrowDesc:'Select the arrow (color / delete)',
    helpRightDrag:    'Right-click',
    helpRightDragDesc:'Hold and drag to another cell to draw an arrow',
    helpDelArrow:     'Del / Backspace',
    helpDelArrowDesc: 'Delete selected arrow',
    helpSecGeneral:   'General',
    helpArrowKeys:    'Undo / Redo',
    helpEsc:          'Cancel current action',
  }
};

const _browserLang = navigator.language?.slice(0, 2).toLowerCase() === 'fr' ? 'fr' : 'en';
let currentLang = localStorage.getItem('leaders-lang') || _browserLang;
const t = key => (LANGS[currentLang] || LANGS.fr)[key] || key;

function _applyLang() {
  document.getElementById('input-state').placeholder            = t('placeholder');
  document.getElementById('btn-copy').title                     = t('btnCopy');
  document.getElementById('btn-undo').title                     = t('btnUndo');
  document.getElementById('btn-redo').title                     = t('btnRedo');
  document.getElementById('btn-clear-arrows').title             = t('btnClearArrows');
  document.getElementById('btn-settings').title                 = t('btnSettings');
  document.getElementById('btn-help').title                     = t('btnHelp');
  document.getElementById('settings-title').textContent         = t('settingsTitle');
  document.getElementById('help-title').textContent             = t('helpTitle');
  document.querySelector('#row-labels  .setting-name').textContent = t('rowLabels');
  document.querySelector('#row-labels  .setting-desc').textContent = t('descLabels');
  document.querySelector('#row-outline .setting-name').textContent = t('rowOutline');
  document.querySelector('#row-outline .setting-desc').textContent = t('descOutline');
  document.querySelector('#row-shadow  .setting-name').textContent = t('rowShadow');
  document.querySelector('#row-shadow  .setting-desc').textContent = t('descShadow');
  document.querySelector('#row-lang    .setting-name').textContent = t('rowLang');
  document.querySelectorAll('#help-popup [data-i18n]').forEach(el =>
    el.innerHTML = t(el.dataset.i18n)
  );
  Palette.applyLang();
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const R     = 3;
const SQ3   = Math.sqrt(3);
const CR    = 0.79;
const H_MAX = 60;
const T_RNG = [1, 28];

// ── PLATEAU ───────────────────────────────────────────────────────────────────
const CELLS = (() => {
  const a = []; let id = 0;
  for (let q = -R; q <= R; q++)
    for (let r = Math.max(-R, -q-R); r <= Math.min(R, -q+R); r++)
      a.push({ q, r, id: id++ });
  return a;
})();

const LABELS = (() => {
  const m = {}, cols = Array.from({ length: 7 }, () => []);
  for (const c of CELLS) cols[c.q + R].push(c);
  for (let qi = 0; qi < 7; qi++) {
    cols[qi].sort((a, b) => b.r - a.r);
    cols[qi].forEach((c, i) => { m[c.id] = 'ABCDEFG'[qi] + (i + 1); });
  }
  return m;
})();
const L2ID = Object.fromEntries(Object.entries(LABELS).map(([id, l]) => [l, +id]));

// ── ENCODE / DECODE ───────────────────────────────────────────────────────────
function enc({ tokens, banned }) {
  const whites = tokens.filter(t => t.c === 'w');
  const blacks  = tokens.filter(t => t.c === 'b');
  const parts = [];
  if (whites.length)
    parts.push('white=' + whites.map(t => `${(LABELS[t.cell] ?? t.cell).toLowerCase()}:${t.name}`).join(','));
  if (blacks.length)
    parts.push('black=' + blacks.map(t => `${(LABELS[t.cell] ?? t.cell).toLowerCase()}:${t.name}`).join(','));
  if (banned && banned.length)
    parts.push('ban=' + banned.join(','));
  return parts.join('&');
}

function dec(raw) {
  // Legacy format support: "état|..." or "A1:name:c,..."
  if (raw.startsWith('état|')) raw = raw.slice(5);

  // New format: white=a1:2,b3:4&black=c5:6&ban=1,2
  if (raw.includes('=')) {
    const params = {};
    for (const part of raw.split('&')) {
      const eq = part.indexOf('=');
      if (eq === -1) continue;
      params[part.slice(0, eq)] = part.slice(eq + 1);
    }
    const tokens = [];
    const parseGroup = (str, c) => {
      if (!str) return;
      for (const entry of str.split(',')) {
        const col = entry.indexOf(':');
        if (col === -1) continue;
        const ref  = entry.slice(0, col).toUpperCase();
        const name = entry.slice(col + 1).trim();
        const cell = L2ID[ref] ?? +ref;
        if (name && !isNaN(cell)) tokens.push({ cell, name, c });
      }
    };
    parseGroup(params['white'], 'w');
    parseGroup(params['black'], 'b');
    const banned = params['ban'] ? params['ban'].split(',').map(s => s.trim()).filter(Boolean) : [];
    return { tokens, banned };
  }

  // Legacy fallback: "A1:name:c,..."
  const [ts] = raw.split('|');
  const tokens = (ts ? ts.split(',') : []).flatMap(p => {
    const [ref, name, c] = p.split(':');
    const cell = L2ID[ref] ?? +ref;
    return (!ref || !name || !c || isNaN(cell)) ? [] : [{ cell, name, c }];
  });
  return { tokens, banned: [] };
}

// ── STATE ─────────────────────────────────────────────────────────────────────
const mkState = () => ({
  tokens: [{ id: 0, cell: 21, name: '1', c: 'b' }, { id: 1, cell: 15, name: '2', c: 'w' }],
  palette: {
    lancement: Array.from({ length: 19 }, (_, i) => String(i + 1)),
    vermillon: Array.from({ length: 5  }, (_, i) => String(i + 20)),
    archetypes: Array.from({ length: 4  }, (_, i) => String(i + 25)),
    other: [],
  },
  nid: 2,
  arrows: [],
  arrowNid: 0,
  banned: [],
  markers: {},
});
let S = mkState();

// ── PALETTE HELPERS ───────────────────────────────────────────────────────────
const ALL_NAMES = Array.from({ length: T_RNG[1] - T_RNG[0] + 1 }, (_, i) => String(i + T_RNG[0]));

function _palGroupOf(name) {
  const n = +name;
  if (n >= 1  && n <= 19) return 'lancement';
  if (n >= 20 && n <= 24) return 'vermillon';
  if (n >= 25 && n <= 28) return 'archetypes';
  return 'other';
}
function _palAdd(name) {
  const key = _palGroupOf(name);
  const arr = [...(S.palette[key] || []), name];
  arr.sort((a, b) => +a - +b);
  S.palette = { ...S.palette, [key]: arr };
}
function _palRemove(name) {
  const key = _palGroupOf(name);
  S.palette = { ...S.palette, [key]: (S.palette[key] || []).filter(n => n !== name) };
}

// ── BAN HELPERS ───────────────────────────────────────────────────────────────
function isBanned(name) { return (S.banned || []).includes(name); }
function doBan(name) {
  if (isBanned(name)) return;
  S.banned = [...(S.banned || []), name];
  saveH(); render();
}
function doUnban(name) {
  S.banned = (S.banned || []).filter(n => n !== name);
  saveH(); render();
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
let hist = [], hidx = -1;
const _snapS = () => { const { arrows, arrowNid, ...rest } = S; return JSON.stringify(rest); };
const saveH = () => {
  const snap = _snapS();
  if (hidx >= 0 && hist[hidx] === snap) return;
  hist = hist.slice(0, hidx + 1);
  hist.push(snap);
  if (++hidx, hist.length > H_MAX) { hist.shift(); hidx--; }
};
const restH = entry => {
  const { arrows, arrowNid } = S;
  const restored = JSON.parse(entry);
  if (!restored.banned)   restored.banned = [];
  if (!restored.markers)  restored.markers = {};
  S = { ...restored, arrows, arrowNid };
  Arrows.clearSelected(); render();
};
const undo = () => hidx > 0             && restH(hist[--hidx]);
const redo = () => hidx < hist.length-1 && restH(hist[++hidx]);

// ── LAYOUT ────────────────────────────────────────────────────────────────────
let LO = {};

// Shared margin formula — must stay in sync with palette.js
const _palMargin = W => Math.max(10, Math.min(30, W * 0.04));

function relayout() {
  const main = document.getElementById('main');
  const W = main.clientWidth  || 800;
  const H = main.clientHeight || 560;

  const BOARD_COLS = (2*R + 1) * 1.5 + 0.5;
  const BOARD_ROWS = (2*R + 1.5) * SQ3;

  const palCollapsed   = Palette.isCollapsed();
  const rEst           = Math.min(W / BOARD_COLS, H / BOARD_ROWS) * 0.90 * CR;
  const palLayout      = Palette.layout(W, H, rEst);
  const { palX, palY, palW, palH } = palLayout;
  const palBottomSheet = !!palLayout._bottomSheet;

  // In portrait (bottom sheet), the sheet slides over the board —
  // fit the board above the collapsed handle tab only.
  const HANDLE_H = 48;
  const availH   = palBottomSheet ? H - HANDLE_H : H;

  // Board scale — always full size, never shrunk for the palette
  const sp = Math.min(W / BOARD_COLS, availH / BOARD_ROWS) * 0.90;
  const r  = sp * CR;

  // Horizontal centre
  // Gap between board right edge and palette left edge matches PAL_MARGIN
  // so both sides of the screen have the same breathing room.
  const MARGIN = _palMargin(W);
  let cx;

  if (palBottomSheet || palCollapsed) {
    // Portrait, or landscape with palette hidden → centre on full width
    cx = W / 2;
  } else {
    // Landscape + palette visible: shift board left to clear palette if possible.
    // Never shrink — if it can't shift without violating the left margin, overlap.
    const bHalf      = sp * (BOARD_COLS / 2);
    const cxForClear = palX - MARGIN - bHalf; // cx so right edge = palX - MARGIN
    const leftEdge   = cxForClear - bHalf;

    cx = leftEdge >= MARGIN
      ? Math.min(W / 2, cxForClear) // shift (never past centre)
      : W / 2;                       // can't shift cleanly → centre, palette overlaps
  }

  const cy = palBottomSheet ? availH / 2 : H / 2;

  const cells = CELLS.map(c => ({
    ...c,
    x: cx + sp * 1.5 * c.q,
    y: cy + sp * (SQ3/2 * c.q + SQ3 * c.r),
  }));
  const byId = new Map(cells.map(c => [c.id, c]));
  const hs   = Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + r * 1.6;

  LO = { W, H, bW: W, r, cx, cy, cells, byId, hs, psz: r * 2,
         palX, palY, palW, palH, _palBottomSheet: palBottomSheet };

  const boardLayer = document.getElementById('board-layer');
  if (boardLayer) {
    const bw = hs * Math.sqrt(3), bh = hs * 2;
    boardLayer.style.left   = (cx - bw/2) + 'px';
    boardLayer.style.top    = (cy - bh/2) + 'px';
    boardLayer.style.width  = bw + 'px';
    boardLayer.style.height = bh + 'px';
    _updateBoardClip(boardLayer, bw, bh, hs);
  }

  for (const id of ['arrows-svg', 'outlines-svg']) {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('width', W); el.setAttribute('height', H);
      el.style.width = W + 'px';  el.style.height = H + 'px';
    }
  }
  Outlines.syncSize(W, H);
}

function _updateBoardClip(el, bw, bh, hs) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI/3 * i + Math.PI/6;
    return `${(50 + hs * Math.cos(a) / bw * 100).toFixed(3)}% ${(50 + hs * Math.sin(a) / bh * 100).toFixed(3)}%`;
  });
  el.style.clipPath = `polygon(${pts.join(', ')})`;
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────
const _loadSetting = (key, def) => { const v = localStorage.getItem(key); return v === null ? def : v === 'true'; };
let showLabels  = _loadSetting('leaders-labels',  true);
let showOutline = _loadSetting('leaders-outline', false);
let showShadow  = _loadSetting('leaders-shadow',  true);

// ── HIT TESTING ───────────────────────────────────────────────────────────────
function _mainXY(e) {
  const b = document.getElementById('main').getBoundingClientRect();
  return { x: e.clientX - b.left, y: e.clientY - b.top };
}

function nearCell(x, y) {
  let best = null, bd = Infinity;
  for (const c of LO.cells) {
    const d = Math.hypot(c.x - x, c.y - y);
    if (d < LO.r * 1.3 && d < bd) { bd = d; best = c; }
  }
  return best;
}

function tokAt(x, y) {
  for (let i = S.tokens.length - 1; i >= 0; i--) {
    const t = S.tokens[i], c = LO.byId.get(t.cell);
    if (c && Math.hypot(x - c.x, y - c.y) < LO.r * 0.9) return t;
  }
  return null;
}

// ── PALETTE CLICK HELPERS ─────────────────────────────────────────────────────
function _nearestFreeCell() {
  const occupied = new Set(S.tokens.map(t => t.cell));
  let best = null, bd = Infinity;
  for (const c of LO.cells) {
    if (occupied.has(c.id)) continue;
    const d = Math.hypot(c.x - LO.cx, c.y - LO.cy);
    if (d < bd) { bd = d; best = c; }
  }
  return best;
}

function _palRecruitOne(name) {
  const cell = _nearestFreeCell();
  if (!cell) return;
  S.tokens = [...S.tokens, { id: S.nid++, cell: cell.id, name, c: 'b' }];
  _palRemove(name);
  saveH(); render();
}

// ── INTERACTION STATE ─────────────────────────────────────────────────────────
let drag = null, dpos = null, justDropped = false;
let mousePos = { x: 0, y: 0 };

// ── RADIAL MENU HELPERS ───────────────────────────────────────────────────────
// Buttons start at angle START_DEG (top = -90°) and step by STEP_DEG each.
const RADIAL_START_DEG = -90;
const RADIAL_STEP_DEG  = 45;
const RADIAL_RADIUS    = 70; // px from center to button center

function _radialPos(index) {
  const deg = RADIAL_START_DEG + index * RADIAL_STEP_DEG;
  const rad = deg * Math.PI / 180;
  return {
    x: Math.round(RADIAL_RADIUS * Math.cos(rad)),
    y: Math.round(RADIAL_RADIUS * Math.sin(rad)),
  };
}

function _positionRadialMenu(el, cx, cy) {
  el.style.left = cx + 'px';
  el.style.top  = cy + 'px';
}

// ── TOKEN TOOLBAR ─────────────────────────────────────────────────────────────
let tokTb = null;
let tokTbId = null;

function _mkTokToolbar() {
  if (tokTb) return tokTb;
  const el = document.createElement('div');
  el.id = 'tok-tb';
  el.className = 'radial-menu';

  // Buttons: [color, marker, delete]
  el.innerHTML = `
    <button id="tok-color" class="radial-btn radial-btn-color" title="Toggle team">
      <span id="tok-dot" class="radial-dot"></span>
    </button>
    <button id="tok-marker" class="radial-btn" title="Marker">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    </button>
    <button id="tok-del" class="radial-btn radial-btn-del" title="Delete">
      <svg width="16" height="16" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/>
      </svg>
    </button>`;

  document.getElementById('main').appendChild(el);
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });

  // Position buttons radially
  el.querySelectorAll('.radial-btn').forEach((btn, i) => {
    const { x, y } = _radialPos(i);
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
  });

  const onColor = e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    S.tokens = S.tokens.map(t => t.id === tokTbId ? { ...t, c: t.c === 'w' ? 'b' : 'w' } : t);
    tokTbId = null; _hideTokToolbar(); saveH(); render();
  };
  const onMarker = e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    const tok = S.tokens.find(t => t.id === tokTbId);
    if (!tok) return;
    const cellId = tok.cell;
    const cell = LO.byId.get(cellId);
    tokTbId = null; _hideTokToolbar();
    if (cell) _placeMarkerToolbar(cellId, null);
    render();
  };
  const onDel = e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    const tok = S.tokens.find(t => t.id === tokTbId);
    if (tok) _palAdd(tok.name);
    S.tokens = S.tokens.filter(t => t.id !== tokTbId);
    tokTbId = null; _hideTokToolbar(); saveH(); render();
  };
  el.querySelector('#tok-color' ).addEventListener('click',      onColor);
  el.querySelector('#tok-color' ).addEventListener('touchstart', onColor,  { passive: false });
  el.querySelector('#tok-marker').addEventListener('click',      onMarker);
  el.querySelector('#tok-marker').addEventListener('touchstart', onMarker, { passive: false });
  el.querySelector('#tok-del'   ).addEventListener('click',      onDel);
  el.querySelector('#tok-del'   ).addEventListener('touchstart', onDel,    { passive: false });

  tokTb = el;
  return el;
}

function _placeTokToolbar() {
  if (tokTbId === null) { _hideTokToolbar(); return; }
  const tok = S.tokens.find(t => t.id === tokTbId);
  if (!tok) { _hideTokToolbar(); return; }
  const cell = LO.byId.get(tok.cell);
  if (!cell) { _hideTokToolbar(); return; }

  const el = _mkTokToolbar();
  const dot = el.querySelector('#tok-dot');
  dot.style.background  = tok.c === 'w' ? '#ffffff' : '#111111';
  dot.style.borderColor = tok.c === 'w' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';

  _hideMarkerToolbar();
  Arrows.clearSelected();

  _positionRadialMenu(el, cell.x, cell.y);
  el.classList.remove('open');
  el.style.display = 'block';
  void el.offsetWidth;
  requestAnimationFrame(() => el.classList.add('open'));
}

function _hideTokToolbar() {
  if (!tokTb) return;
  tokTb.classList.remove('open');
  tokTb.style.display = 'none';
}

// ── MARKER TOOLBAR ────────────────────────────────────────────────────────────
const MARKER_TYPES = ['cap', 'dest', 'ghost', 'invo'];
let markerTb     = null;
let markerTbCell = null;

function _mkMarkerToolbar() {
  if (markerTb) return markerTb;
  const el = document.createElement('div');
  el.id = 'marker-tb';
  el.className = 'radial-menu';

  el.innerHTML = MARKER_TYPES.map(type => `
    <button class="radial-btn marker-tb-btn" data-mtype="${type}" title="${type}">
      <img src="ui/${type}.png" draggable="false" />
    </button>`).join('');

  document.getElementById('main').appendChild(el);
  el.addEventListener('mousedown', e => e.stopPropagation());

  // Position buttons radially
  el.querySelectorAll('.radial-btn').forEach((btn, i) => {
    const { x, y } = _radialPos(i);
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
  });

  el.querySelectorAll('.marker-tb-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (markerTbCell === null) return;
      const type = btn.dataset.mtype;
      if (!S.markers) S.markers = {};
      if (S.markers[markerTbCell] === type) {
        delete S.markers[markerTbCell];
      } else {
        S.markers[markerTbCell] = type;
      }
      _hideMarkerToolbar();
      saveH(); render();
    });
  });

  markerTb = el;
  return el;
}

function _placeMarkerToolbar(cellId, _fixedPos) {
  markerTbCell = cellId;
  const cell = LO.byId.get(cellId); if (!cell) return;
  const el = _mkMarkerToolbar();

  // Highlight active marker
  el.querySelectorAll('.marker-tb-btn').forEach(btn => {
    const active = S.markers && S.markers[cellId] === btn.dataset.mtype;
    btn.classList.toggle('active', active);
  });

  tokTbId = null; _hideTokToolbar();
  Arrows.clearSelected();

  _positionRadialMenu(el, cell.x, cell.y);
  // Force animation restart: remove open, display block, reflow, re-add open
  el.classList.remove('open');
  el.style.display = 'block';
  void el.offsetWidth; // force reflow so transition fires fresh
  requestAnimationFrame(() => el.classList.add('open'));
}

function _hideMarkerToolbar() {
  if (!markerTb) return;
  markerTb.classList.remove('open');
  markerTb.style.display = 'none';
  markerTbCell = null;
}

function _hideAllToolbars() {
  tokTbId = null; _hideTokToolbar();
  _hideMarkerToolbar();
  Arrows.clearSelected();
}


// Distinguishes "right-click on token → toolbar" from "right-drag → arrow"
let _rcPending = null;

function _rcCommitArrow(x, y) {
  if (!_rcPending) return;
  tokTbId = null; _hideTokToolbar();
  Arrows.onDown({ button: 2, preventDefault: () => {} }, _rcPending.x, _rcPending.y);
  _rcPending = null;
}

// ── EVENT HANDLERS ────────────────────────────────────────────────────────────
function onDown(e) {
  const { x, y } = _mainXY(e);
  const inP = Palette.inPalette(x, y);

  if (e.button === 2) {
    e.preventDefault();
    if (inP) {
      const n = Palette.palAt(x, y);
      if (n) _palRecruitOne(n);
      return;
    }
    const tok = tokAt(x, y);
    if (tok) {
      _hideMarkerToolbar();
      Arrows.clearSelected();
      _rcPending = { x, y, tokId: tok.id };
      return;
    }
    tokTbId = null; _hideTokToolbar();
    _hideMarkerToolbar();
    // Right-click on empty cell: wait for mouseup to distinguish click vs drag
    const emptyCell = nearCell(x, y);
    if (emptyCell) {
      _rcPending = { x, y, cellId: emptyCell.id };
      return;
    }
    Arrows.onDown(e, x, y);
    return;
  }

  if (e.button === 1) {
    e.preventDefault();
    if (!inP) {
      const tok = tokAt(x, y);
      if (tok) toggleC(tok.id);
    } else {
      const n = Palette.palAt(x, y);
      if (n) isBanned(n) ? doUnban(n) : doBan(n);
    }
    return;
  }

  if (e.button !== 0) return;

  if (!inP) {
    const tok = tokAt(x, y);
    if (!tok || tok.id !== tokTbId) { tokTbId = null; _hideTokToolbar(); }
  }

  // Dismiss all toolbars on left click (they re-open if needed below)
  _hideMarkerToolbar();

  if (inP) {
    const n = Palette.palAt(x, y);
    if (n) { drag = { type: 'pal', name: n, c: 'b', _startX: x, _startY: y }; dpos = { x, y }; render(); }
    return;
  }

  if (Arrows.onDown(e, x, y)) return;

  const tok = tokAt(x, y);
  if (tok) {
    tokTbId = null; _hideTokToolbar();
    drag = { type: 'brd', id: tok.id, _startX: x, _startY: y }; dpos = { x, y }; render();
  }
}

function onMove(e) {
  const { x, y } = _mainXY(e);
  mousePos = { x, y };

  if (_rcPending && Math.hypot(x - _rcPending.x, y - _rcPending.y) > 6) {
    if (_rcPending.tokId !== undefined) {
      _rcCommitArrow(x, y);
    } else if (_rcPending.cellId !== undefined) {
      // Drag from empty cell → start arrow
      Arrows.onDown({ button: 2, preventDefault: () => {} }, _rcPending.x, _rcPending.y);
      _rcPending = null;
    }
  }

  if (Arrows.onMove(x, y)) return;
  if (drag) { dpos = { x, y }; render(); }
  _updateCursor(x, y);
}

function onUp(e) {
  const { x, y } = _mainXY(e);

  if (e.button === 2 && _rcPending) {
    if (Math.hypot(x - _rcPending.x, y - _rcPending.y) <= 6) {
      if (_rcPending.tokId !== undefined) {
        tokTbId = _rcPending.tokId;
        _rcPending = null;
        _placeTokToolbar(); render();
        return;
      } else if (_rcPending.cellId !== undefined) {
        const cid = _rcPending.cellId;
        _rcPending = null;
        _placeMarkerToolbar(cid); render();
        return;
      }
    }
    _rcPending = null;
  }

  if (Arrows.onUp(e, x, y)) return;
  if (!drag || e.button !== 0) return;

  const cell = nearCell(x, y);
  const inP  = Palette.inPalette(x, y);

  if (drag.type === 'brd') {
    const tok = S.tokens.find(t => t.id === drag.id);
    if (tok) {
      if (inP || !cell) {
        // Drop in palette OR outside the board entirely → remove token, return to palette
        S.tokens = S.tokens.filter(t => t.id !== drag.id);
        _palAdd(tok.name); saveH();
      } else {
        const other = S.tokens.find(t => t.cell === cell.id && t.id !== drag.id);
        if (other) {
          const from = tok.cell;
          S.tokens = S.tokens.map(t =>
            t.id === drag.id ? { ...t, cell: cell.id } :
            t.id === other.id ? { ...t, cell: from } : t
          );
        } else {
          S.tokens = S.tokens.map(t => t.id === drag.id ? { ...t, cell: cell.id } : t);
        }
        saveH();
      }
    }
  } else if (drag.type === 'pal') {
    const moved = Math.hypot(x - drag._startX, y - drag._startY);
    if (moved >= 6 && !inP && cell) {
      const other = S.tokens.find(t => t.cell === cell.id);
      if (other) {
        // Cell occupied → swap: return existing token to palette, place dragged one
        _palAdd(other.name);
        S.tokens = S.tokens.map(t =>
          t.id === other.id ? { ...t, name: drag.name, c: drag.c } : t
        );
      } else {
        S.tokens = [...S.tokens, { id: S.nid++, cell: cell.id, name: drag.name, c: drag.c }];
      }
      _palRemove(drag.name); saveH();
    }
  }

  drag = null; dpos = null; justDropped = true; render();
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function toggleC(id) {
  S.tokens = S.tokens.map(t => t.id === id ? { ...t, c: t.c === 'w' ? 'b' : 'w' } : t);
  saveH(); render();
}
function doClearArrows() { S.arrows = []; S.arrowNid = 0; Arrows.resetState(); saveH(); render(); }
function doReset() { S = mkState(); hist = []; hidx = -1; Arrows.resetState(); saveH(); render(); }
function doLoad() {
  const raw = document.getElementById('input-state').value.trim();
  if (!raw) return;
  const { tokens, banned } = dec(raw);
  const used = new Set(tokens.map(t => t.name));
  const palette = { lancement: [], vermillon: [], archetypes: [], other: [] };
  for (const n of ALL_NAMES) { if (!used.has(n)) palette[_palGroupOf(n)].push(n); }
  S = { tokens: tokens.map((t, i) => ({ ...t, id: i })), palette, nid: tokens.length, arrows: [], arrowNid: 0, banned: banned || [], markers: {} };
  Arrows.clearSelected(); saveH(); render();
}
function doCopy() {
  navigator.clipboard.writeText(enc(S)).then(() => {
    const b = document.getElementById('btn-copy');
    if (b._copyTimer) clearTimeout(b._copyTimer);
    const originalHTML = b.innerHTML;
    b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    b._copyTimer = setTimeout(() => { b.innerHTML = originalHTML; b._copyTimer = null; }, 1000);
  });
}

// ── HTML LAYERS ───────────────────────────────────────────────────────────────
function _syncTokenLayer() {
  const layer = document.getElementById('tokens-layer');
  if (!layer) return;
  const { r, byId } = LO;
  const d = r * 2;

  const existing = new Map();
  for (const el of layer.children) existing.set(+el.dataset.tid, el);

  const seen = new Set();
  for (const t of S.tokens) {
    if (drag?.type === 'brd' && drag.id === t.id && _dragMoved()) continue;
    const cell = byId.get(t.cell);
    if (!cell) continue;
    seen.add(t.id);

    let el = existing.get(t.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'html-token';
      el.dataset.tid = t.id;
      const img = document.createElement('img');
      img.draggable = false;
      el.appendChild(img);
      layer.appendChild(el);
    }

    const color = t.c === 'w' ? 'blanc' : 'noir';
    const img = el.querySelector('img');
    const src = `jetons_${color}/${t.name}.png`;
    if (!img.src.endsWith(src)) img.src = src;

    el.style.left      = (cell.x - d/2) + 'px';
    el.style.top       = (cell.y - d/2) + 'px';
    el.style.width     = d + 'px';
    el.style.height    = d + 'px';
    el.style.overflow  = 'visible';
    el.style.boxShadow = showShadow ? `${r*0.05}px ${r*0.07}px ${r*0.15}px rgba(0,0,0,0.6)` : 'none';
    el.style.outline   = 'none';
    el.querySelector('img').style.boxShadow = 'none';
  }
  for (const [tid, el] of existing) { if (!seen.has(tid)) el.remove(); }
}

function _syncLabelLayer() {
  const layer = document.getElementById('labels-layer');
  if (!layer) return;
  const { r, cells } = LO;
  const occ    = new Set(S.tokens.map(t => t.cell));
  const dcell  = drag?.type === 'brd' ? S.tokens.find(t => t.id === drag.id)?.cell : -1;
  const fs     = Math.max(7, Math.round(r * 0.36));

  if (!showLabels) { layer.innerHTML = ''; return; }

  const numColors = ['#ff4c4c', '#31cf65', '#50aff8', '#ff83bd', 'rgb(215,160,65)', '#27b4b4', '#ff4c4c'];
  const existing  = new Map();
  for (const el of layer.children) existing.set(+el.dataset.cid, el);

  const seen = new Set();
  for (const c of cells) {
    if (occ.has(c.id) && c.id !== dcell) {
      const el = existing.get(c.id);
      if (el) el.style.opacity = '0';
      continue;
    }
    const lbl = LABELS[c.id] ?? '';
    if (!lbl) continue;
    seen.add(c.id);

    const letter = lbl[0] ?? '';
    const num    = lbl.slice(1);
    const numCol = numColors[(+num - 1) % numColors.length] ?? 'rgba(60,60,120,0.85)';

    let el = existing.get(c.id);
    if (!el) {
      el = document.createElement('div');
      el.className  = 'html-label';
      el.dataset.cid = c.id;
      el.innerHTML  = `<span style="color:rgb(168,164,148)">${letter}</span><span style="color:${numCol}">${num}</span>`;
      layer.appendChild(el);
    }
    el.style.left     = c.x + 'px';
    el.style.top      = c.y + 'px';
    el.style.fontSize = fs + 'px';
    el.style.opacity  = '1';
  }
  for (const [cid, el] of existing) { if (!seen.has(cid)) el.remove(); }
}

function _dragMoved() {
  if (!drag || !dpos) return false;
  return Math.hypot(dpos.x - (drag._startX ?? dpos.x), dpos.y - (drag._startY ?? dpos.y)) >= 6;
}

function _syncDropTarget() {
  const layer = document.getElementById('droptarget-layer');
  if (!layer) return;
  layer.innerHTML = '';
  if (!drag || !dpos || !_dragMoved()) return;
  const dtgt = nearCell(dpos.x, dpos.y);
  if (!dtgt) return;
  const { r } = LO;
  const div = document.createElement('div');
  div.className = 'html-droptarget';
  div.style.cssText = `left:${dtgt.x-r}px;top:${dtgt.y-r}px;width:${r*2}px;height:${r*2}px;`;
  layer.appendChild(div);
}

function _syncGhost() {
  let ghost = document.getElementById('drag-ghost');
  if (!drag || !dpos || !_dragMoved()) {
    if (ghost) ghost.style.display = 'none';
    return;
  }
  const t = drag.type === 'brd' ? S.tokens.find(t => t.id === drag.id) : { name: drag.name, c: drag.c };
  if (!t) { if (ghost) ghost.style.display = 'none'; return; }

  if (!ghost) {
    ghost = document.createElement('div');
    ghost.id = 'drag-ghost';
    ghost.className = 'html-token';
    const img = document.createElement('img'); img.draggable = false;
    ghost.appendChild(img);
    document.getElementById('main').appendChild(ghost);
  }

  const r   = drag.type === 'brd' ? LO.r : (LO._palBottomSheet ? LO.r : LO.psz / 2 * 0.90);
  const src = `jetons_${t.c === 'w' ? 'blanc' : 'noir'}/${t.name}.png`;
  const img = ghost.querySelector('img');
  if (!img.src.endsWith(src)) img.src = src;

  ghost.style.display   = 'block';
  ghost.style.left      = (dpos.x - r) + 'px';
  ghost.style.top       = (dpos.y - r) + 'px';
  ghost.style.width     = (r * 2) + 'px';
  ghost.style.height    = (r * 2) + 'px';
  ghost.style.opacity   = '1';
  ghost.style.boxShadow = showShadow ? '2px 3px 8px rgba(0,0,0,0.5)' : 'none';

  // Trash icon feedback: show when dropping a board token over palette or outside board
  let trashOverlay = ghost.querySelector('.ghost-trash');
  const willDelete = drag.type === 'brd' && (Palette.inPalette(dpos.x, dpos.y) || !nearCell(dpos.x, dpos.y));
  if (willDelete) {
    const wasHidden = !trashOverlay || trashOverlay.style.display === 'none';
    if (!trashOverlay) {
      trashOverlay = document.createElement('div');
      trashOverlay.className = 'ghost-trash';
      trashOverlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
      ghost.appendChild(trashOverlay);
    }
    if (wasHidden) {
      // Force animation restart
      trashOverlay.style.animation = 'none';
      trashOverlay.querySelector('svg').style.animation = 'none';
      void trashOverlay.offsetWidth; // reflow
      trashOverlay.style.animation = '';
      trashOverlay.querySelector('svg').style.animation = 'trash-icon-bounce 0.30s cubic-bezier(0.22,1,0.36,1) both, trash-icon-pulse 1.1s 0.30s ease-in-out infinite';
    }
    trashOverlay.style.display = 'flex';
  } else {
    if (trashOverlay) trashOverlay.style.display = 'none';
  }
}

// ── MARKER LAYER ──────────────────────────────────────────────────────────────
function _syncMarkerLayer() {
  let layer = document.getElementById('markers-layer');
  if (!layer) return;
  const { r, byId } = LO;
  const markers = S.markers || {};
  const existing = new Map();
  for (const el of layer.children) existing.set(+el.dataset.mcell, el);

  const seen = new Set();
  for (const [cellIdStr, type] of Object.entries(markers)) {
    const cellId = +cellIdStr;
    const cell = byId.get(cellId); if (!cell) continue;
    seen.add(cellId);
    let el = existing.get(cellId);
    if (!el) {
      el = document.createElement('div');
      el.className = 'html-marker';
      el.dataset.mcell = cellId;
      const img = document.createElement('img'); img.draggable = false;
      el.appendChild(img);
      layer.appendChild(el);
    }
    const d = r * 2 * 0.7;
    el.style.left   = (cell.x - d / 2) + 'px';
    el.style.top    = (cell.y - d / 2) + 'px';
    el.style.width  = d + 'px';
    el.style.height = d + 'px';
    const img = el.querySelector('img');
    const src = `ui/${type}.png`;
    if (!img.src.endsWith(src)) img.src = src;
  }
  for (const [cid, el] of existing) { if (!seen.has(cid)) el.remove(); }
}


function _updateCursor(x, y) {
  const main = document.getElementById('main');
  if (!Arrows.updateCursor(main, x, y)) main.style.cursor = 'default';
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function render() {
  history.replaceState(null, '', '#' + enc(S));
  _syncTokenLayer();
  _syncLabelLayer();
  _syncDropTarget();
  _syncGhost();
  _syncMarkerLayer();
  Outlines.render();
  Arrows.render();
  Palette.syncDOM();
  if (tokTbId !== null) _placeTokToolbar();
}

// ── URL STATE ─────────────────────────────────────────────────────────────────
function loadStateFromURL() {
  const raw = window.location.hash.slice(1);
  if (!raw) return;
  const { tokens, banned } = dec(raw);
  const used = new Set(tokens.map(t => t.name));
  const palette = { lancement: [], vermillon: [], archetypes: [], other: [] };
  for (const n of ALL_NAMES) { if (!used.has(n)) palette[_palGroupOf(n)].push(n); }
  S = { tokens: tokens.map((t, i) => ({ ...t, id: i })), palette, nid: tokens.length, arrows: [], arrowNid: 0, banned: banned || [], markers: {} };
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  loadStateFromURL();

  const main = document.getElementById('main');
  main.addEventListener('mousedown',   onDown);
  main.addEventListener('mousemove',   e => { mousePos = _mainXY(e); onMove(e); });
  main.addEventListener('mouseup',     onUp);
  main.addEventListener('click',       () => { if (justDropped) justDropped = false; });
  main.addEventListener('contextmenu', e => e.preventDefault());
  main.addEventListener('mouseleave',  () => { drag = null; dpos = null; render(); });

  window.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
    if (e.key === 'ArrowLeft')  undo();
    if (e.key === 'ArrowRight') redo();
    if (e.key === 'Escape') { _hideAllToolbars(); }
    Arrows.onKey(e);
  });

  document.getElementById('input-state'    ).addEventListener('keydown', e => { if (e.key === 'Enter') doLoad(); });
  document.getElementById('btn-copy'       ).addEventListener('click', doCopy);
  document.getElementById('btn-undo'       ).addEventListener('click', undo);
  document.getElementById('btn-redo'       ).addEventListener('click', redo);
  document.getElementById('btn-clear-arrows').addEventListener('click', doClearArrows);

  // Settings
  const _syncToggle = (id, val) => {
    const el = document.getElementById(id);
    el.classList.toggle('active', val);
    el.setAttribute('aria-checked', val);
  };
  const _openSettings = () => {
    _syncToggle('tog-labels',  showLabels);
    _syncToggle('tog-outline', showOutline);
    _syncToggle('tog-shadow',  showShadow);
    document.getElementById('settings-overlay').classList.remove('hidden');
  };
  const _closeSettings = () => document.getElementById('settings-overlay').classList.add('hidden');

  document.getElementById('btn-settings'    ).addEventListener('click', _openSettings);
  document.getElementById('settings-close'  ).addEventListener('click', _closeSettings);
  document.getElementById('settings-overlay').addEventListener('mousedown', e => {
    if (e.target === document.getElementById('settings-overlay')) _closeSettings();
  });
  document.getElementById('row-labels' ).addEventListener('click', () => {
    showLabels  = !showLabels;  localStorage.setItem('leaders-labels',  showLabels);  _syncToggle('tog-labels',  showLabels);  render();
  });
  document.getElementById('row-outline').addEventListener('click', () => {
    showOutline = !showOutline; localStorage.setItem('leaders-outline', showOutline); _syncToggle('tog-outline', showOutline); render();
  });
  document.getElementById('row-shadow' ).addEventListener('click', () => {
    showShadow  = !showShadow;  localStorage.setItem('leaders-shadow',  showShadow);  _syncToggle('tog-shadow',  showShadow);  render();
  });

  // Help
  const _openHelp  = () => document.getElementById('help-overlay').classList.remove('hidden');
  const _closeHelp = () => document.getElementById('help-overlay').classList.add('hidden');
  document.getElementById('btn-help'     ).addEventListener('click', _openHelp);
  document.getElementById('help-close'   ).addEventListener('click', _closeHelp);
  document.getElementById('help-overlay' ).addEventListener('mousedown', e => {
    if (e.target === document.getElementById('help-overlay')) _closeHelp();
  });

  // Language submenu
  const langSubmenu  = document.getElementById('lang-submenu');
  const langTrigger  = document.getElementById('lang-trigger');
  const langLabel    = document.getElementById('lang-current-label');

  const LANG_LABELS = { fr: 'Français', en: 'English' };

  const _syncLangUI = () => {
    langLabel.textContent = LANG_LABELS[currentLang] || currentLang;
    langSubmenu.querySelectorAll('.lang-option').forEach(opt =>
      opt.classList.toggle('active', opt.dataset.lang === currentLang)
    );
  };

  const _closeLangMenu = () => langSubmenu.classList.remove('open');

  const _openLangMenu = () => {
    _syncLangUI();
    const rowRect  = document.getElementById('row-lang').getBoundingClientRect();
    const popup    = document.getElementById('settings-popup');
    const popupRect = popup.getBoundingClientRect();
    langSubmenu.style.top  = rowRect.top + 'px';
    langSubmenu.style.left = (popupRect.right + 8) + 'px';
    langSubmenu.classList.add('open');
  };

  document.getElementById('row-lang').addEventListener('click', e => {
    e.stopPropagation();
    langSubmenu.classList.contains('open') ? _closeLangMenu() : _openLangMenu();
  });

  langSubmenu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('mousedown', e => {
      e.stopPropagation();
      currentLang = opt.dataset.lang;
      localStorage.setItem('leaders-lang', currentLang);
      _syncLangUI();
      _closeLangMenu();
      _applyLang();
    });
  });

  // Close submenu when clicking outside or closing settings
  document.addEventListener('mousedown', e => {
    if (!langSubmenu.contains(e.target) && e.target !== langTrigger)
      _closeLangMenu();
  });
  document.getElementById('settings-close').addEventListener('click', _closeLangMenu);
  document.getElementById('settings-overlay').addEventListener('mousedown', _closeLangMenu);

  _syncLangUI();

  Arrows.init();
  Outlines.init();
  Palette.init();
  Palette.setOnCollapseChange(() => {
    relayout(); render();
  });
  _mkTokToolbar();
  _mkMarkerToolbar();

  new ResizeObserver(() => { relayout(); render(); }).observe(main);
  relayout(); saveH(); render(); _applyLang();
}

document.addEventListener('DOMContentLoaded', init);