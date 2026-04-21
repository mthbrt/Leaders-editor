// ── I18N ──────────────────────────────────────────────────────────────────────
const LANGS = {
  fr: {
    btnUndo:          'Annuler',
    btnRedo:          'Rétablir',
    btnFlipColors:    'Inverser les couleurs',
    btnFlipPos:       'Inverser horizontalement le plateau',
    btnFlipPosV:      'Inverser verticalement le plateau',
    btnSettings:      'Paramètres',
    btnTogglePalette: 'Afficher/masquer les personnages',
    copied:           'Copié !',
    settingsTitle:    'Paramètres',
    rowLabels:        'Indices plateau',
    descLabels:       'Marque les coordonnées sur chaque case du plateau',
    rowShadow:        'Ombres',
    descShadow:       'Ajoute une ombre sous chaque personnage',
    rowLang:          'Langue',
    palTitle:         'PERSONNAGES',
    palReset:         'Réinitialiser',
    secVermillon:     'Extension Vermillon',
    secArchetypes:    'Archétypes',
    secLeaders:       'Leaders',
    pal2Title:          'SAUVEGARDES',
    pal2BtnClear:       'Tout effacer',
    pal2AddSection:     'Nouvelle section',
    pal2DefaultSection: 'Section',
    pal2DefaultConfig:  'Position',
    pal2LegacySection:  'Général',
    pal2TitleNewSave:   'Nouvelle sauvegarde',
    pal2TitleRename:    'Renommer',
    pal2TitleDelete:    'Supprimer',
    pal2TitleOverwrite: 'Écraser',
    pal2TitleUpdate:    'Mettre à jour la sauvegarde',
    btnHelp:            'Aide',
    helpTitle:          'Commandes',
    helpSecTokens:      'Personnages',
    helpDragBoard:      'Clic gauche',
    helpDragBoardDesc:  'Déplacer les personnages par glisser-déposer',
    helpMiddleTok:      'Clic molette',
    helpMiddleTokDesc:  'Plateau : changer équipe',
    helpRightTok:       'Clic droit',
    helpRightTokDesc:   'Plateau : menu (équipe / supprimer)<br>Liste des personnages : bannir / débannir',
    helpSecGeneral:     'Général',
    helpArrowKeys:      'Annuler / Rétablir',
    helpEsc:            'Fermer le menu',
  },
  en: {
    btnUndo:          'Undo',
    btnRedo:          'Redo',
    btnFlipColors:    'Invert colors',
    btnFlipPos:       'Mirror board horizontally',
    btnFlipPosV:      'Mirror board vertically',
    btnSettings:      'Settings',
    btnTogglePalette: 'Show/hide characters',
    copied:           'Copied!',
    settingsTitle:    'Settings',
    rowLabels:        'Board labels',
    descLabels:       'Shows coordinates on each board cell',
    rowShadow:        'Shadows',
    descShadow:       'Adds a shadow under each character',
    rowLang:          'Language',
    palTitle:         'CHARACTERS',
    palReset:         'Reset',
    secVermillon:     'Vermillon Expansion',
    secArchetypes:    'Archetypes',
    secLeaders:       'Leaders',
    pal2Title:          'SAVES',
    pal2BtnClear:       'Clear all',
    pal2AddSection:     'New section',
    pal2DefaultSection: 'Section',
    pal2DefaultConfig:  'Position',
    pal2LegacySection:  'General',
    pal2TitleNewSave:   'New save',
    pal2TitleRename:    'Rename',
    pal2TitleDelete:    'Delete',
    pal2TitleOverwrite: 'Overwrite',
    pal2TitleUpdate:    'Update save',
    btnHelp:            'Help',
    helpTitle:          'Controls',
    helpSecTokens:      'Characters',
    helpDragBoard:      'Left-click',
    helpDragBoardDesc:  'Move the characters by drag and drop',
    helpMiddleTok:      'Middle-click',
    helpMiddleTokDesc:  'Board: toggle team',
    helpRightTok:       'Right-click',
    helpRightTokDesc:   'Board: menu (team / delete)<br>Character list: ban / unban',
    helpSecGeneral:     'General',
    helpArrowKeys:      'Undo / Redo',
    helpEsc:            'Close menu',
  }
};

const _browserLang = navigator.language?.slice(0, 2).toLowerCase() === 'fr' ? 'fr' : 'en';
let currentLang = localStorage.getItem('leaders-lang') || _browserLang;
const t = key => (LANGS[currentLang] || LANGS.fr)[key] || key;

function _applyLang() {
  const TOOLTIP_IDS = [
    ['btn-undo',           'btnUndo'],
    ['btn-redo',           'btnRedo'],
    ['btn-flip-colors',    'btnFlipColors'],
    ['btn-flip-pos',       'btnFlipPos'],
    ['btn-flip-pos-v',     'btnFlipPosV'],
    ['btn-settings',       'btnSettings'],
    ['btn-toggle-palette', 'btnTogglePalette'],
    ['btn-help',           'btnHelp'],
  ];
  for (const [id, key] of TOOLTIP_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.dataset.tooltip = t(key);
    el.removeAttribute('title');
  }

  document.getElementById('settings-title').textContent = t('settingsTitle');
  document.getElementById('help-title').textContent     = t('helpTitle');
  document.querySelector('#row-labels .setting-name').textContent = t('rowLabels');
  document.querySelector('#row-labels .setting-desc').textContent = t('descLabels');
  document.querySelector('#row-shadow .setting-name').textContent = t('rowShadow');
  document.querySelector('#row-shadow .setting-desc').textContent = t('descShadow');
  document.querySelector('#row-lang   .setting-name').textContent = t('rowLang');
  document.querySelectorAll('#help-popup [data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });

  Palette.applyLang();
  if (typeof Palette2 !== 'undefined') Palette2.applyLang();
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const R     = 3;
const SQ3   = Math.sqrt(3);
const CR    = 0.79;
const H_MAX = 60;
const ALL_NAMES_LIST = Array.from({ length: 26 }, (_, i) => String(i + 1));

// ── PLATEAU ───────────────────────────────────────────────────────────────────
const CELLS = (() => {
  const a = []; let id = 0;
  for (let q = -R; q <= R; q++)
    for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++)
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
  const parts   = [];
  const fmt     = t => `${(LABELS[t.cell] ?? t.cell).toLowerCase()}:${t.name}`;
  if (whites.length) parts.push('white=' + whites.map(fmt).join(','));
  if (blacks.length) parts.push('black=' + blacks.map(fmt).join(','));
  if (banned?.length) parts.push('ban=' + banned.join(','));
  return parts.join('&');
}

function dec(raw) {
  if (raw.startsWith('état|')) raw = raw.slice(5);

  if (raw.includes('=')) {
    const params = {};
    for (const part of raw.split('&')) {
      const eq = part.indexOf('=');
      if (eq !== -1) params[part.slice(0, eq)] = part.slice(eq + 1);
    }
    const tokens = [];
    const parseGroup = (str, c) => {
      if (!str) return;
      for (const entry of str.split(',')) {
        const col  = entry.indexOf(':');
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

  // Legacy fallback
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
    lancement: Array.from({ length: 17 }, (_, i) => String(i + 3)),
    vermillon: Array.from({ length: 5  }, (_, i) => String(i + 20)),
    leaders: ['1', '2', '25'],
    other: [],
  },
  nid: 2,
  banned: [],
});
let S = mkState();

// ── PALETTE HELPERS ───────────────────────────────────────────────────────────
const ALL_NAMES = ALL_NAMES_LIST;

function _palGroupOf(name) {
  const n = +name;
  if (n === 1 || n === 2 || n === 25) return 'leaders';
  if (n >= 3  && n <= 19) return 'lancement';
  if (n >= 20 && n <= 24) return 'vermillon';
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
function isBanned(name)  { return (S.banned || []).includes(name); }
function doBan(name)     { if (isBanned(name)) return; S.banned = [...(S.banned || []), name]; saveH(); render(); }
function doUnban(name)   { S.banned = (S.banned || []).filter(n => n !== name); saveH(); render(); }

// ── HISTORY ───────────────────────────────────────────────────────────────────
let hist = [], hidx = -1;

const saveH = () => {
  const snap = JSON.stringify(S);
  if (hidx >= 0 && hist[hidx] === snap) return;
  hist = hist.slice(0, hidx + 1);
  hist.push(snap);
  if (++hidx, hist.length > H_MAX) { hist.shift(); hidx--; }
};
const restH = entry => {
  S = JSON.parse(entry);
  if (!S.banned) S.banned = [];
  _hideTokToolbar();
  render();
};
const undo = () => hidx > 0             && restH(hist[--hidx]);
const redo = () => hidx < hist.length-1 && restH(hist[++hidx]);

// ── SETTINGS ─────────────────────────────────────────────────────────────────
const _loadSetting = (key, def) => { const v = localStorage.getItem(key); return v === null ? def : v === 'true'; };
let showLabels = _loadSetting('leaders-labels', true);
let showShadow = _loadSetting('leaders-shadow', true);

// ── VIEW FLIP STATE (cosmétique, non sauvegardé dans l'URL) ──────────────────
let viewFlipH = false;
let viewFlipV = false;

// ── LAYOUT ────────────────────────────────────────────────────────────────────
let LO = {};

function relayout() {
  _hideTokToolbar();
  const main = document.getElementById('main');
  const W = main.clientWidth  || 800;
  const H = main.clientHeight || 560;

  const BOARD_COLS = (2 * R + 1) * 1.5 + 0.5;
  const BOARD_ROWS = (2 * R + 1.5) * SQ3;

  const rEst       = Math.min(W / BOARD_COLS, H / BOARD_ROWS) * 0.90 * CR;
  const pal2Layout = (typeof Palette2 !== 'undefined') ? Palette2.layout(W, H, rEst) : { palW: 0 };
  const palLayout  = Palette.layout(W, H, rEst);
  const { palX, palY, palW, palH } = palLayout;
  const palBottomSheet = !!palLayout._bottomSheet;

  const HANDLE_H = 48;
  const availH   = palBottomSheet ? H - HANDLE_H : H;
  const sp       = Math.min(W / BOARD_COLS, availH / BOARD_ROWS) * 0.90;
  const r        = sp * CR;

  const pal2Collapsed = (typeof Palette2 !== 'undefined') && Palette2.isCollapsed();
  const pal2Right = palBottomSheet ? 0 : (pal2Collapsed ? 0 : (pal2Layout.palW || 0));
  const pal1Left  = palBottomSheet ? W : (Palette.isCollapsed() ? W : palX);
  const cx = (pal2Right + pal1Left) / 2;
  const cy = palBottomSheet ? availH / 2 : H / 2;

  const btnPal2 = document.getElementById('btn-toggle-pal2');
  if (btnPal2) btnPal2.style.display = palBottomSheet ? 'none' : '';

  const cells = CELLS.map(c => {
    let x = cx + sp * 1.5 * c.q;
    let y = cy + sp * (SQ3 / 2 * c.q + SQ3 * c.r);
    if (viewFlipH) x = 2 * cx - x;
    if (viewFlipV) y = 2 * cy - y;
    return { ...c, x, y };
  });
  const byId = new Map(cells.map(c => [c.id, c]));
  const hs   = Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + r * 1.6;

  LO = { W, H, bW: W, r, cx, cy, cells, byId, hs, psz: r * 2,
         palX, palY, palW, palH, _palBottomSheet: palBottomSheet,
         palItemSz: palBottomSheet ? r : Math.round(rEst * 2 * 0.90) / 2 };

  const boardLayer = document.getElementById('board-layer');
  if (boardLayer) {
    const bw = hs * Math.sqrt(3), bh = hs * 2;
    boardLayer.style.left   = (cx - bw / 2) + 'px';
    boardLayer.style.top    = (cy - bh / 2) + 'px';
    boardLayer.style.width  = bw + 'px';
    boardLayer.style.height = bh + 'px';

    _updateBoardClip(boardLayer, bw, bh, hs);
  }
}

function _updateBoardClip(el, bw, bh, hs) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 3 * i + Math.PI / 6;
    return `${(50 + hs * Math.cos(a) / bw * 100).toFixed(3)}% ${(50 + hs * Math.sin(a) / bh * 100).toFixed(3)}%`;
  });
  el.style.clipPath = `polygon(${pts.join(', ')})`;
}

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
    const tk = S.tokens[i], c = LO.byId.get(tk.cell);
    if (c && Math.hypot(x - c.x, y - c.y) < LO.r * 0.9) return tk;
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

// ── MOVE SELECTED TOKEN — helper partagé souris + tactile ─────────────────────
// Déplace le jeton sélectionné (_selected.id) vers destCellId.
// Échange si la case est déjà occupée. Retourne true si un mouvement a eu lieu.
function _moveSelectedToCell(destCellId) {
  const srcTok = S.tokens.find(t => t.id === _selected.id);
  if (!srcTok) return false;
  const destTok = S.tokens.find(t => t.cell === destCellId && t.id !== _selected.id);
  if (destTok) {
    const from = srcTok.cell;
    S.tokens = S.tokens.map(t =>
      t.id === _selected.id ? { ...t, cell: destCellId } :
      t.id === destTok.id   ? { ...t, cell: from }       : t
    );
  } else {
    S.tokens = S.tokens.map(t => t.id === _selected.id ? { ...t, cell: destCellId } : t);
  }
  saveH();
  return true;
}

// ── INTERACTION STATE ─────────────────────────────────────────────────────────
let drag = null, dpos = null, justDropped = false;
let mousePos = { x: 0, y: 0 };

// ── SELECTION STATE ───────────────────────────────────────────────────────────
let _selected = null; // { type: 'brd'|'pal', id?, name? }

function _syncTouchSelectionHighlight() {
  document.querySelectorAll('.touch-selected').forEach(el => el.classList.remove('touch-selected'));
  if (!_selected) return;
  if (_selected.type === 'brd') {
    document.querySelector(`#tokens-layer .html-token[data-tid="${_selected.id}"]`)?.classList.add('touch-selected');
  } else if (_selected.type === 'pal') {
    document.querySelector(`#pal-panel .pal-item[data-name="${_selected.name}"]`)?.classList.add('touch-selected');
  }
}

function _cancelTouchSelection() {
  _selected = null;
  _syncTouchSelectionHighlight();
}

// ── LONG-PRESS STATE ──────────────────────────────────────────────────────────
let _longPressTimer = null;
let _longPressFired = false;
let _longPressEndTime = 0;
const LONG_PRESS_MS = 500;
const GHOST_TAP_MS  = 600;

function _isTouchDevice() { return window.matchMedia('(pointer: coarse)').matches; }

function _cancelLongPress() {
  if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null; }
}

// ── TOOLBAR HELPERS — fermeture groupée ──────────────────────────────────────
function _closeAllToolbars(target) {
  if (tokTbId !== null) {
    const tb = document.getElementById('tok-tb');
    if (!tb || !tb.contains(target)) _hideTokToolbar();
  }
  if (Palette.isPalTbOpen?.()) {
    const palTb = document.getElementById('pal-tok-tb');
    if (!palTb || !palTb.contains(target)) Palette.hidePalToolbar();
  }
}

// ── RIGHT-CLICK / LONG-PRESS → menu contextuel ───────────────────────────────
function _simulateRightClick(x, y) {
  if (Palette.inPalette(x, y)) {
    const name = Palette.palAt(x, y);
    if (name) {
      const item = document.querySelector(`#pal-panel .pal-item[data-name="${name}"]`);
      if (item) { Tooltip.hide(); Palette.openPalToolbar(name, item); }
    }
    return;
  }
  const tok = tokAt(x, y);
  if (tok) { tokTbId = tok.id; Tooltip.hide(); _placeTokToolbar(); render(); }
}

// ── TOUCH EVENTS ──────────────────────────────────────────────────────────────
function _touchXY(touch) {
  const b = document.getElementById('main').getBoundingClientRect();
  return { x: touch.clientX - b.left, y: touch.clientY - b.top };
}

function onTouchStart(e) {
  if (e.touches.length !== 1) { _cancelLongPress(); return; }
  if (Date.now() - _longPressEndTime < GHOST_TAP_MS) { e.preventDefault(); return; }

  const touch = e.touches[0];
  const { x, y } = _touchXY(touch);

  _closeAllToolbars(e.target);
  _cancelLongPress();

  onTouchStart._startX = touch.clientX;
  onTouchStart._startY = touch.clientY;

  _longPressTimer = setTimeout(() => {
    _longPressTimer   = null;
    _longPressFired   = true;
    _longPressEndTime = Date.now();
    if (navigator.vibrate) navigator.vibrate(40);
    _cancelTouchSelection();
    _simulateRightClick(x, y);
  }, LONG_PRESS_MS);
}

function onTouchMove(e) {
  if (!e.touches.length) return;
  const touch = e.touches[0];
  const dx = touch.clientX - (onTouchStart._startX || touch.clientX);
  const dy = touch.clientY - (onTouchStart._startY || touch.clientY);
  if (Math.hypot(dx, dy) > 8) _cancelLongPress();
}

function onTouchEnd(e) {
  _cancelLongPress();
  if (e.changedTouches.length !== 1) return;
  if (Date.now() - _longPressEndTime < GHOST_TAP_MS) { e.preventDefault(); return; }
  if (_longPressFired) { _longPressFired = false; e.preventDefault(); return; }

  const touch = e.changedTouches[0];
  const { x, y } = _touchXY(touch);

  const dx = touch.clientX - (onTouchStart._startX || touch.clientX);
  const dy = touch.clientY - (onTouchStart._startY || touch.clientY);
  if (Math.hypot(dx, dy) > 10) return;

  if (e.target.closest('#tok-tb, #pal-tok-tb, #toolbar, #settings-overlay, #help-overlay')) return;

  const inP = Palette.inPalette(x, y);

  if (_selected?.type === 'brd') {
    const destCell = nearCell(x, y);
    if (destCell) {
      _moveSelectedToCell(destCell.id);
    } else if (inP) {
      const palName = Palette.palAt(x, y);
      if (palName) {
        const tok = S.tokens.find(t => t.id === _selected.id);
        if (tok) { _palAdd(tok.name); S.tokens = S.tokens.map(t => t.id === _selected.id ? { ...t, name: palName } : t); _palRemove(palName); saveH(); }
      }
    } else {
      // Clic hors plateau → déselectionner seulement (pas de suppression)
    }
    _cancelTouchSelection(); render(); e.preventDefault(); return;
  }

  if (inP) {
    const name = Palette.palAt(x, y);
    if (name) {
      e.preventDefault();
      _palRecruitOne(name);
    }
    return;
  }

  const tok = tokAt(x, y);
  if (tok) {
    e.preventDefault();
    _selected = { type: 'brd', id: tok.id };
    _syncTouchSelectionHighlight(); render();
    return;
  }

  _cancelTouchSelection(); render();
}

function _initTouchEvents() {
  const main = document.getElementById('main');
  main.addEventListener('touchstart',  onTouchStart,  { passive: false });
  main.addEventListener('touchmove',   onTouchMove,   { passive: true });
  main.addEventListener('touchend',    onTouchEnd,    { passive: false });
  main.addEventListener('touchcancel', () => { _cancelLongPress(); _cancelTouchSelection(); render(); });
}

// ── TOKEN TOOLBAR ─────────────────────────────────────────────────────────────
let tokTb   = null;
let tokTbId = null;

function _mkTokToolbar() {
  if (tokTb) return tokTb;
  const el = document.createElement('div');
  el.id = 'tok-tb';
  el.innerHTML = `
    <button id="tok-color" class="tok-tb-btn"><span id="tok-color-label"></span></button>
    <div class="tok-tb-sep"></div>
    <button id="tok-del" class="tok-tb-btn"><span id="tok-del-label"></span></button>`;

  document.getElementById('main').appendChild(el);
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  el.addEventListener('touchend',   e => e.stopPropagation(), { passive: true });

  el.querySelector('#tok-color').addEventListener('click', e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    S.tokens = S.tokens.map(t => t.id === tokTbId ? { ...t, c: t.c === 'w' ? 'b' : 'w' } : t);
    _hideTokToolbar(); saveH(); render();
  });

  el.querySelector('#tok-del').addEventListener('click', e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    const tok = S.tokens.find(t => t.id === tokTbId);
    if (tok) _palAdd(tok.name);
    S.tokens = S.tokens.filter(t => t.id !== tokTbId);
    _hideTokToolbar(); saveH(); render();
  });

  tokTb = el;
  return el;
}

function _updateTokToolbarLabels() {
  const fr = currentLang === 'fr';
  const label = document.getElementById('tok-color-label');
  const del   = document.getElementById('tok-del-label');
  if (label) label.textContent = fr ? 'Changer de couleur' : 'Toggle color';
  if (del)   del.textContent   = fr ? 'Supprimer' : 'Delete';
}

function _placeTokToolbar() {
  if (tokTbId === null) { _hideTokToolbar(); return; }
  const tok  = S.tokens.find(t => t.id === tokTbId);
  if (!tok)  { _hideTokToolbar(); return; }
  const cell = LO.byId.get(tok.cell);
  if (!cell) { _hideTokToolbar(); return; }

  const el = _mkTokToolbar();
  _updateTokToolbarLabels();

  el.classList.remove('open', 'arrow-left', 'arrow-right');
  el.style.display    = 'flex';
  el.style.visibility = 'hidden';
  el.style.transition = 'none';
  void el.offsetWidth;

  const elW = el.offsetWidth, elH = el.offsetHeight;
  const GAP = 12, r = LO.r;

  let x = cell.x + r + GAP;
  let y = cell.y - elH / 2;
  const goLeft = x + elW + 4 > LO.W;
  if (goLeft) x = cell.x - r - GAP - elW;
  y = Math.max(4, Math.min(y, LO.H - elH - 4));

  const arrowY = Math.max(14, Math.min(cell.y - y, elH - 14));
  el.style.setProperty('--arrow-y', arrowY + 'px');
  el.classList.add(goLeft ? 'arrow-right' : 'arrow-left');
  el.style.left = x + 'px';
  el.style.top  = y + 'px';

  requestAnimationFrame(() => {
    el.style.transition = '';
    el.style.visibility = '';
    el.classList.add('open');
  });
}

function _hideTokToolbar() {
  if (!tokTb) return;
  tokTb.classList.remove('open');
  tokTb.style.display    = 'none';
  tokTb.style.visibility = '';
  tokTb.style.transition = '';
  tokTbId = null;
}

// ── EVENT HANDLERS ────────────────────────────────────────────────────────────
function onDown(e) {
  const { x, y } = _mainXY(e);
  const inP = Palette.inPalette(x, y);

  _closeAllToolbars(e.target);

  if (e.button === 2) {
    e.preventDefault();
    if (inP) return;
    const tok = tokAt(x, y);
    if (tok) { tokTbId = tok.id; Tooltip.hide(); _placeTokToolbar(); render(); }
    return;
  }

  if (e.button === 1) {
    e.preventDefault();
    if (inP) return;
    const tok = tokAt(x, y);
    if (tok) toggleC(tok.id);
    return;
  }

  if (e.button !== 0) return;

  if (inP) {
    const n = Palette.palAt(x, y);
    if (n && _selected?.type === 'brd') {
      const tok = S.tokens.find(t => t.id === _selected.id);
      if (tok) { _palAdd(tok.name); S.tokens = S.tokens.map(t => t.id === _selected.id ? { ...t, name: n } : t); _palRemove(n); saveH(); }
      _cancelTouchSelection(); render(); return;
    }
    if (n) { drag = { type: 'pal', name: n, c: 'b', _startX: x, _startY: y }; dpos = { x, y }; render(); }
    return;
  }

  const tok = tokAt(x, y);
  if (tok) {
    drag = { type: 'brd', id: tok.id, _startX: x, _startY: y, _pending: true };
    dpos = { x, y };
    render();
    return;
  }

  if (_selected?.type === 'brd') {
    const destCell = nearCell(x, y);
    if (destCell) {
      _moveSelectedToCell(destCell.id);
    }
    // Sinon (clic hors plateau) → déselectionner seulement, pas de suppression
    _cancelTouchSelection(); render();
    return;
  }

  if (_selected) { _cancelTouchSelection(); render(); }
}

function onMove(e) {
  const { x, y } = _mainXY(e);
  mousePos = { x, y };

  if (drag?._pending && Math.hypot(x - drag._startX, y - drag._startY) >= 6) {
    drag._pending = false;
    _cancelTouchSelection();
  }

  if (tokTbId === null && !Palette.isPalTbOpen?.()) {
    if (Palette.inPalette(x, y)) {
      Palette.onMove(x, y);
    } else {
      const hoveredTok = tokAt(x, y);
      if (hoveredTok && !drag) {
        const cell = LO.byId.get(hoveredTok.cell);
        if (cell) {
          const mainRect = document.getElementById('main').getBoundingClientRect();
          Tooltip.scheduleBoard(hoveredTok.name, mainRect.left + cell.x, mainRect.top + cell.y, 'board:' + hoveredTok.id, LO.r);
        }
      } else {
        Tooltip.hide();
      }
    }
  }

  if (drag) { dpos = { x, y }; render(); }
  document.getElementById('main').style.cursor = 'default';
}

function onUp(e) {
  const { x, y } = _mainXY(e);
  if (!drag || e.button !== 0) return;

  const cell = nearCell(x, y);
  const inP  = Palette.inPalette(x, y);

  if (drag.type === 'brd') {
    const tok = S.tokens.find(t => t.id === drag.id);
    if (tok) {
      if (drag._pending) {
        // Clic simple → logique de sélection
        const wasSelf = _selected?.type === 'brd' && _selected.id === tok.id;
        if (wasSelf) {
          _cancelTouchSelection();
        } else if (_selected?.type === 'brd') {
          _moveSelectedToCell(tok.cell);
          _cancelTouchSelection();
        } else {
          _selected = { type: 'brd', id: tok.id };
          _syncTouchSelectionHighlight();
        }
      } else {
        // Drag réel → déposer
        if (inP || !cell) {
          S.tokens = S.tokens.filter(t => t.id !== drag.id);
          _palAdd(tok.name);
        } else {
          const other = S.tokens.find(t => t.cell === cell.id && t.id !== drag.id);
          if (other) {
            const from = tok.cell;
            S.tokens = S.tokens.map(t =>
              t.id === drag.id  ? { ...t, cell: cell.id } :
              t.id === other.id ? { ...t, cell: from }    : t
            );
          } else {
            S.tokens = S.tokens.map(t => t.id === drag.id ? { ...t, cell: cell.id } : t);
          }
        }
        saveH();
      }
    }
  } else if (drag.type === 'pal') {
    const moved = Math.hypot(x - drag._startX, y - drag._startY);
    if (moved < 6) {
      _palRecruitOne(drag.name);
    } else if (!inP && cell) {
      const other = S.tokens.find(t => t.cell === cell.id);
      if (other) {
        _palAdd(other.name);
        S.tokens = S.tokens.map(t => t.id === other.id ? { ...t, name: drag.name, c: drag.c } : t);
      } else {
        S.tokens = [...S.tokens, { id: S.nid++, cell: cell.id, name: drag.name, c: drag.c }];
      }
      _palRemove(drag.name);
      saveH();
    }
  }

  drag = null; dpos = null; justDropped = true; render();
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function toggleC(id) {
  S.tokens = S.tokens.map(t => t.id === id ? { ...t, c: t.c === 'w' ? 'b' : 'w' } : t);
  saveH(); render();
}

function doFlipColors() {
  _hideTokToolbar(); _cancelTouchSelection();
  S.tokens = S.tokens.map(t => ({ ...t, c: t.c === 'w' ? 'b' : 'w' }));
  saveH(); render();
}


function doFlipPositions()  { _hideTokToolbar(); _cancelTouchSelection(); viewFlipH = !viewFlipH; relayout(); render(); }
function doFlipPositionsV() { _hideTokToolbar(); _cancelTouchSelection(); viewFlipV = !viewFlipV; relayout(); render(); }

function doReset() {
  _hideTokToolbar(); _cancelTouchSelection();
  S = mkState();
  hist = []; hidx = -1; saveH(); render();
}

function _loadState({ tokens, banned }) {
  const used = new Set(tokens.map(t => t.name));
  const palette = { lancement: [], vermillon: [], leaders: [], other: [] };
  for (const n of ALL_NAMES) { if (!used.has(n)) palette[_palGroupOf(n)].push(n); }
  S = { tokens: tokens.map((t, i) => ({ ...t, id: i })), palette, nid: tokens.length, banned: banned || [] };
}

function doLoad() {
  const raw = document.getElementById('_hidden-input-state').value.trim();
  if (!raw) return;
  _loadState(dec(raw));
  _hideTokToolbar(); saveH(); render();
}

function loadStateFromURL() {
  const raw = window.location.hash.slice(1);
  if (raw) _loadState(dec(raw));
}

function doCopy() {
  navigator.clipboard.writeText(enc(S)).then(() => {
    const b = document.getElementById('pal-btn-copy');
    if (!b) return;
    if (b._copyTimer) clearTimeout(b._copyTimer);
    const originalHTML = b.innerHTML;
    b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    b._copyTimer = setTimeout(() => { b.innerHTML = originalHTML; b._copyTimer = null; }, 1000);
  });
}

// ── HTML LAYERS ───────────────────────────────────────────────────────────────
function _dragMoved() {
  if (!drag || !dpos || drag._pending) return false;
  return Math.hypot(dpos.x - (drag._startX ?? dpos.x), dpos.y - (drag._startY ?? dpos.y)) >= 6;
}

function _syncTokenLayer() {
  const layer = document.getElementById('tokens-layer');
  if (!layer) return;
  const { r, byId } = LO;
  const d = r * 2;

  const existing = new Map();
  for (const el of layer.children) existing.set(+el.dataset.tid, el);

  const seen = new Set();
  for (const tok of S.tokens) {
    if (drag?.type === 'brd' && drag.id === tok.id && _dragMoved()) continue;
    const cell = byId.get(tok.cell);
    if (!cell) continue;
    seen.add(tok.id);

    let el = existing.get(tok.id);
    if (!el) {
      el = document.createElement('div');
      el.className   = 'html-token';
      el.dataset.tid = tok.id;
      const img = document.createElement('img');
      img.draggable  = false;
      el.appendChild(img);
      layer.appendChild(el);
    }

    const color = tok.c === 'w' ? 'blanc' : 'noir';
    const img   = el.querySelector('img');
    const src   = `jetons_${color}/${tok.name}.png`;
    if (!img.src.endsWith(src)) img.src = src;
    el.dataset.imgKey = '';
    el.querySelector('.board-token-label')?.remove();

    const ringInset = Math.round(d * 0.05 / 2) * 2;
    el.style.cssText = `left:${cell.x - d/2}px;top:${cell.y - d/2}px;width:${d}px;height:${d}px;position:absolute;overflow:visible;box-shadow:${showShadow ? `${r*0.05}px ${r*0.06}px ${r*0.12}px rgba(0,0,0,0.6)` : 'none'};`;
    el.style.setProperty('--ring-inset', `${ringInset}px`);
    img.style.boxShadow = 'none';
    img.style.filter    = tok.used ? 'grayscale(1) opacity(0.5)' : '';
  }
  for (const [tid, el] of existing) { if (!seen.has(tid)) el.remove(); }
}

function _syncLabelLayer() {
  const layer = document.getElementById('labels-layer');
  if (!layer) return;
  if (!showLabels) { layer.innerHTML = ''; return; }

  const { r, cells } = LO;
  const occ   = new Set(S.tokens.map(t => t.cell));
  const dcell = drag?.type === 'brd' ? S.tokens.find(t => t.id === drag.id)?.cell : -1;
  const fs    = Math.max(7, Math.round(r * 0.36));
  const numColors = ['#ff4c4c', '#31cf65', '#50aff8', '#ff83bd', 'rgb(215,160,65)', '#27b4b4', '#ff4c4c'];

  const existing = new Map();
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
      el.className   = 'html-label';
      el.dataset.cid = c.id;
      el.innerHTML   = `<span style="color:rgb(168,164,148)">${letter}</span><span style="color:${numCol}">${num}</span>`;
      layer.appendChild(el);
    }
    el.style.left     = c.x + 'px';
    el.style.top      = c.y + 'px';
    el.style.fontSize = fs + 'px';
    el.style.opacity  = '1';
  }
  for (const [cid, el] of existing) { if (!seen.has(cid)) el.remove(); }
}

function _syncDropTarget() {
  const layer = document.getElementById('droptarget-layer');
  if (!layer) return;
  layer.innerHTML = '';

  const { r } = LO;
  const mkDiv = (c, extraClass = '') => {
    const div = document.createElement('div');
    div.className = 'html-droptarget' + (extraClass ? ' ' + extraClass : '');
    div.style.cssText = `left:${c.x - r}px;top:${c.y - r}px;width:${r * 2}px;height:${r * 2}px;`;
    return div;
  };

  if (drag && dpos && _dragMoved()) {
    const dtgt = nearCell(dpos.x, dpos.y);
    if (dtgt) layer.appendChild(mkDiv(dtgt));
    return;
  }

  if (_selected && (_isTouchDevice() || !drag)) {
    if (_selected.type === 'brd' || _selected.type === 'pal') {
      for (const c of LO.cells) layer.appendChild(mkDiv(c, 'touch-hint'));
    }
  }
}

function _syncGhost() {
  let ghost = document.getElementById('drag-ghost');
  if (!drag || !dpos || !_dragMoved()) { if (ghost) ghost.style.display = 'none'; return; }

  const tok = drag.type === 'brd' ? S.tokens.find(t => t.id === drag.id) : { name: drag.name, c: drag.c };
  if (!tok) { if (ghost) ghost.style.display = 'none'; return; }

  if (!ghost) {
    ghost = document.createElement('div');
    ghost.id = 'drag-ghost';
    ghost.className = 'html-token';
    const img = document.createElement('img'); img.draggable = false;
    ghost.appendChild(img);
    document.getElementById('main').appendChild(ghost);
  }

  const r     = drag.type === 'brd' ? LO.r : LO.palItemSz;
  const color = tok.c === 'w' ? 'blanc' : 'noir';
  const img   = ghost.querySelector('img');
  const src   = `jetons_${color}/${tok.name}.png`;
  if (!img.src.endsWith(src)) img.src = src;
  ghost.dataset.imgKey = '';
  ghost.querySelector('.board-token-label')?.remove();

  ghost.style.display   = 'block';
  ghost.style.position  = 'absolute';
  ghost.style.overflow  = 'visible';
  ghost.style.left      = (dpos.x - r) + 'px';
  ghost.style.top       = (dpos.y - r) + 'px';
  ghost.style.width     = (r * 2) + 'px';
  ghost.style.height    = (r * 2) + 'px';
  ghost.style.opacity   = '1';
  ghost.style.boxShadow = showShadow ? '2px 3px 8px rgba(0,0,0,0.5)' : 'none';

  let trashOverlay = ghost.querySelector('.ghost-trash');
  const willDelete = drag.type === 'brd' && (Palette.inPalette(dpos.x, dpos.y) || !nearCell(dpos.x, dpos.y));
  if (willDelete) {
    const wasHidden = !trashOverlay || trashOverlay.style.display === 'none';
    if (!trashOverlay) {
      trashOverlay = document.createElement('div');
      trashOverlay.className = 'ghost-trash';
      trashOverlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0-1 14H6L5 6m5 4v6m4-6v6M9 6V4h6v2"/></svg>`;
      ghost.appendChild(trashOverlay);
    }
    if (wasHidden) {
      trashOverlay.style.animation = 'none';
      trashOverlay.querySelector('svg').style.animation = 'none';
      void trashOverlay.offsetWidth;
      trashOverlay.style.animation = '';
      trashOverlay.querySelector('svg').style.animation = 'trash-icon-bounce 0.30s cubic-bezier(0.22,1,0.36,1) both, trash-icon-pulse 1.1s 0.30s ease-in-out infinite';
    }
    trashOverlay.style.display = 'flex';
  } else {
    if (trashOverlay) trashOverlay.style.display = 'none';
  }
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function render() {
  history.replaceState(null, '', '#' + enc(S));
  _syncTokenLayer();
  _syncLabelLayer();
  _syncDropTarget();
  _syncGhost();
  _syncTouchSelectionHighlight();
  Palette.syncDOM();
  if (typeof Palette2 !== 'undefined') Palette2.syncDOM();
  if (tokTbId !== null) _placeTokToolbar();
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
  document.addEventListener('mouseup', e => { if (drag && e.button === 0) { drag = null; dpos = null; render(); } });
  const _onGlobalDown = e => {
    if (!_selected) return;
    if (e.target.closest('#pal-panel .pal-item')) return;
    if (e.target.closest('#pal-panel, #pal2-panel, #toolbar')) { _cancelTouchSelection(); render(); }
  };
  document.addEventListener('mousedown',  _onGlobalDown, true);
  document.addEventListener('touchstart', e => { if (e.touches.length === 1) _onGlobalDown(e); }, { passive: true, capture: true });

  window.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
    if (e.key === 'ArrowLeft')  undo();
    if (e.key === 'ArrowRight') redo();
    if (e.key === 'Escape') {
      _hideTokToolbar(); _cancelTouchSelection();
      document.getElementById('settings-overlay').classList.add('hidden');
      document.getElementById('help-overlay').classList.add('hidden');
      document.getElementById('lang-submenu').classList.remove('open');
      Palette.hidePalToolbar?.();
    }
  });

  document.getElementById('btn-undo'          ).addEventListener('click', undo);
  document.getElementById('btn-redo'          ).addEventListener('click', redo);
  document.getElementById('btn-flip-colors'   ).addEventListener('click', doFlipColors);
  document.getElementById('btn-flip-pos'      ).addEventListener('click', doFlipPositions);
  document.getElementById('btn-flip-pos-v'    ).addEventListener('click', doFlipPositionsV);
  document.getElementById('btn-toggle-palette').addEventListener('click', () => Palette.toggleCollapse());
  document.getElementById('btn-toggle-pal2'   ).addEventListener('click', () => Palette2?.toggleCollapse());

  // ── Settings ──
  const _syncToggle = (id, val) => {
    const el = document.getElementById(id);
    el.classList.toggle('active', val);
    el.setAttribute('aria-checked', val);
  };
  const settingsOverlay = document.getElementById('settings-overlay');
  const _openSettings = () => {
    _syncToggle('tog-labels', showLabels);
    _syncToggle('tog-shadow', showShadow);
    settingsOverlay.classList.remove('hidden');
  };
  const _closeSettings = () => settingsOverlay.classList.add('hidden');

  document.getElementById('btn-settings'  ).addEventListener('click', _openSettings);
  document.getElementById('settings-close').addEventListener('click', _closeSettings);
  settingsOverlay.addEventListener('mousedown', e => { if (e.target === settingsOverlay) _closeSettings(); });

  document.getElementById('row-labels').addEventListener('click', () => {
    showLabels = !showLabels; localStorage.setItem('leaders-labels', showLabels);
    _syncToggle('tog-labels', showLabels); render();
  });
  document.getElementById('row-shadow').addEventListener('click', () => {
    showShadow = !showShadow; localStorage.setItem('leaders-shadow', showShadow);
    _syncToggle('tog-shadow', showShadow); render();
  });

  // ── Help ──
  const helpOverlay = document.getElementById('help-overlay');
  document.getElementById('btn-help'  ).addEventListener('click', () => helpOverlay.classList.remove('hidden'));
  document.getElementById('help-close').addEventListener('click', () => helpOverlay.classList.add('hidden'));
  helpOverlay.addEventListener('mousedown', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

  // ── Language submenu ──
  const langSubmenu = document.getElementById('lang-submenu');
  const langTrigger = document.getElementById('lang-trigger');
  const langLabel   = document.getElementById('lang-current-label');
  const LANG_LABELS = { fr: 'Français', en: 'English' };

  const _syncLangUI = () => {
    langLabel.textContent = LANG_LABELS[currentLang] || currentLang;
    langSubmenu.querySelectorAll('.lang-option').forEach(opt =>
      opt.classList.toggle('active', opt.dataset.lang === currentLang)
    );
  };
  const _closeLangMenu = () => langSubmenu.classList.remove('open');
  const _openLangMenu  = () => {
    _syncLangUI();
    langSubmenu.classList.add('open');
    const menuW       = langSubmenu.offsetWidth;
    const menuH       = langSubmenu.offsetHeight;
    const GAP         = 8;
    const vw          = window.innerWidth;
    const vh          = window.innerHeight;

    // Centre du bouton lang-trigger
    const triggerRect = document.getElementById('lang-trigger').getBoundingClientRect();
    const triggerCX = triggerRect.left + triggerRect.width / 2;

    // Horizontal : centré sur le bouton, clampé à l'écran
    let left = triggerCX - menuW / 2;
    left = Math.max(GAP, Math.min(left, vw - menuW - GAP));

    // Vertical : juste sous la row-lang
    const rowRect = document.getElementById('row-lang').getBoundingClientRect();
    let top = rowRect.bottom + 8;
    if (top + menuH > vh - GAP) top = rowRect.top - menuH - 8;

    // Pointe : position X relative au menu qui pointe vers le centre du bouton
    const arrowX = Math.max(14, Math.min(triggerCX - left, menuW - 14));
    langSubmenu.style.setProperty('--arrow-x', arrowX + 'px');
    langSubmenu.style.left = left + 'px';
    langSubmenu.style.top  = top  + 'px';
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
      _syncLangUI(); _closeLangMenu(); _applyLang();
    });
  });
  document.addEventListener('mousedown', e => {
    if (!langSubmenu.contains(e.target) && e.target !== langTrigger) _closeLangMenu();
  });
  document.getElementById('settings-close').addEventListener('click', _closeLangMenu);
  settingsOverlay.addEventListener('mousedown', _closeLangMenu);

  _syncLangUI();

  // ── Init modules ──
  Palette.init();
  Palette.setOnCollapseChange(() => { relayout(); render(); });
  if (typeof Palette2 !== 'undefined') {
    Palette2.init();
    Palette2.setOnCollapseChange(() => { relayout(); render(); });
  }
  _mkTokToolbar();
  if (typeof initButtonTooltips === 'function') initButtonTooltips();
  _initTouchEvents();

  new ResizeObserver(() => { relayout(); render(); }).observe(main);
  relayout(); saveH(); render(); _applyLang();
}

document.addEventListener('DOMContentLoaded', init);