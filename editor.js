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
    rowTooltips:      'Infobulles',
    descTooltips:     'Affiche les capacités des personnages au survol',
    rowAlertIcons:    'Icônes d\'alerte',
    descAlertIcons:   'Signale les barrages, les encerclements et les captures',
    rowBarrage:       'Afficher le barrage',
    descBarrage:      'Affiche la ligne séparant le plateau',
    rowLang:          'Langue',
    palTitle:         'PERSONNAGES',
    palReset:         'Réinitialiser',
    secVermillon:     'Extension Vermillon',
    secArchetypes:    'Archétypes',
    secLeaders:       'Leaders',
    palFilterTitle:   'Filtrer',
    palFilterActive:  'Capacité active',
    palFilterPassive: 'Capacité passive',
    palFilterSpecial: 'Capacité spéciale',
    palFilterOnBoard: 'Masquer sur le plateau',
    pal2Title:          'SAUVEGARDES',
    pal2AddSection:     'Ajouter une section',
    pal2NewSection:     'Nouvelle section',
    pal2DefaultSection: 'Section',
    pal2DefaultConfig:  'Position',
    pal2LegacySection:  'Général',
    pal2TitleNewSave:   'Nouvelle sauvegarde',
    pal2TitleRename:    'Renommer',
    pal2TitleDelete:    'Supprimer',
    pal2TitleOverwrite: 'Écraser',
    pal2TitleUpdate:    'Mettre à jour la sauvegarde',
    pal2TitleDuplicate: 'Dupliquer',
    pal2TitleMore:      'Plus d\'options',
    btnHelp:            'Aide',
    helpTitle:          'Commandes',
    // Général
    helpSecGeneral:      'Général',
    helpUndo:            'Annuler',
    helpRedo:            'Rétablir',
    helpEsc:             'Fermer le menu',
    helpKeyRightClick:   'Clic droit',
    helpContextMenuDesc: 'Ouvrir le menu contextuel',
    // Plateau
    helpSecBoard:        'Plateau',
    helpKeyDrag:         'Glisser',
    helpBoardDragDesc:   'Déplacer un personnage',
    helpKeyClick:        'Clic gauche',
    helpBoardClickDesc:  'Sélectionner un personnage puis une case pour le déplacer',
    helpKeyMiddle:       'Clic molette',
    helpKeyC:            'C',
    helpBoardTeamDesc:   'Changer d’équipe',
    helpKeyDelete:       'Suppr',
    helpBoardDeleteDesc: 'Retirer du plateau',
    // Personnages
    helpSecTokens:       'Personnages',
    helpTokensDragDesc:  'Placer sur le plateau',
    helpTokensClickDesc: 'Ajouter au plateau',
    helpKeyB:            'B',
    helpTokensBanDesc:   'Bannir / débannir',
    // Sauvegardes
    helpSecSaves:        'Sauvegardes',
    helpSavesClickDesc:  'Restaurer une position enregistrée',
    helpSavesDragDesc:   'Réorganiser sections et sauvegardes',
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
    rowTooltips:      'Tooltips',
    descTooltips:     'Show character abilities on hover',
    rowAlertIcons:    'Alert icons',
    descAlertIcons:   'Notify barrier, encirclement, and capture events',
    rowBarrage:       'Show barrage',
    descBarrage:      'Draws the line separating the board',
    rowLang:          'Language',
    palTitle:         'CHARACTERS',
    palReset:         'Reset',
    secVermillon:     'Vermilion Expansion',
    secArchetypes:    'Archetypes',
    secLeaders:       'Leaders',
    palFilterTitle:   'Filter',
    palFilterActive:  'Active ability',
    palFilterPassive: 'Passive ability',
    palFilterSpecial: 'Special ability',
    palFilterOnBoard: 'Hide on board',
    pal2Title:          'SAVES',
    pal2AddSection:     'Add section',
    pal2NewSection:     'New section',
    pal2DefaultSection: 'Section',
    pal2DefaultConfig:  'Position',
    pal2LegacySection:  'General',
    pal2TitleNewSave:   'New save',
    pal2TitleRename:    'Rename',
    pal2TitleDelete:    'Delete',
    pal2TitleOverwrite: 'Overwrite',
    pal2TitleUpdate:    'Update save',
    pal2TitleDuplicate: 'Duplicate',
    pal2TitleMore:      'More options',
    btnHelp:            'Help',
    helpTitle:          'Controls',
    // General
    helpSecGeneral:      'General',
    helpUndo:            'Undo',
    helpRedo:            'Redo',
    helpEsc:             'Close menu',
    helpKeyRightClick:   'Right-click',
    helpContextMenuDesc: 'Open context menu',
    // Board
    helpSecBoard:        'Board',
    helpKeyDrag:         'Drag',
    helpBoardDragDesc:   'Move a character',
    helpKeyClick:        'Left-click',
    helpBoardClickDesc:  'Select a character, then click a cell to move it',
    helpKeyMiddle:       'Middle-click',
    helpKeyC:            'C',
    helpBoardTeamDesc:   'Toggle team',
    helpKeyDelete:       'Delete',
    helpBoardDeleteDesc: 'Remove from board',
    // Characters
    helpSecTokens:       'Characters',
    helpTokensDragDesc:  'Place on the board',
    helpTokensClickDesc: 'Add to board',
    helpKeyB:            'B',
    helpTokensBanDesc:   'Ban / unban',
    // Saves
    helpSecSaves:        'Saves',
    helpSavesClickDesc:  'Restore a saved position',
    helpSavesDragDesc:   'Reorder sections and saves',
  }
};

const _browserLang = navigator.language?.slice(0, 2).toLowerCase() === 'fr' ? 'fr' : 'en';
let currentLang = localStorage.getItem('leaders-lang') || _browserLang;
const t = key => (LANGS[currentLang] || LANGS.fr)[key] || key;

function _applyLang() {
  const TOOLTIP_IDS = [
    ['btn-reset-board',    'palReset'],
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
  document.querySelector('#row-tooltips .setting-name').textContent = t('rowTooltips');
  document.querySelector('#row-tooltips .setting-desc').textContent = t('descTooltips');
  document.querySelector('#row-alert-icons .setting-name').textContent = t('rowAlertIcons');
  document.querySelector('#row-alert-icons .setting-desc').textContent = t('descAlertIcons');
  document.querySelector('#row-barrage .setting-name').textContent = t('rowBarrage');
  document.querySelector('#row-barrage .setting-desc').textContent = t('descBarrage');
  document.querySelector('#row-lang   .setting-name').textContent = t('rowLang');
  document.querySelectorAll('#help-popup [data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });

  Palette.applyLang();
  if (typeof Palette2 !== 'undefined') Palette2.applyLang();
  _updateMobileTabLabels();
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const R     = 3;
const SQ3   = Math.sqrt(3);
const CR    = 0.79;
const H_MAX = 60;
const BOARD_COLS = (2 * R + 1) * 1.5 + 0.5;
const BOARD_ROWS = (2 * R + 1.5) * SQ3;
const ALL_NAMES = Array.from({ length: 26 }, (_, i) => String(i + 1));

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

// ── ADJACENCY (for board state validation) ────────────────────────────────────
const ID2QR = new Map(CELLS.map(c => [c.id, c]));
const QR2ID = new Map(CELLS.map(c => [`${c.q},${c.r}`, c.id]));
const HEX_DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
function _neighborCellIds(cellId) {
  const c = ID2QR.get(cellId);
  if (!c) return [];
  return HEX_DIRS
    .map(([dq, dr]) => QR2ID.get(`${c.q + dq},${c.r + dr}`))
    .filter(id => id !== undefined);
}

// Used by the barrage DFS/BFS in hints.js.
const ALL_CELL_IDS = CELLS.map(c => c.id);
const CELL_ADJ = new Map(CELLS.map(c => [
  c.id,
  HEX_DIRS.map(([dq, dr]) => QR2ID.get(`${c.q + dq},${c.r + dr}`)).filter(id => id !== undefined)
]));

// Barrage, encirclement, capture logic + board status icons → see hints.js

// ── ENCODE / DECODE ───────────────────────────────────────────────────────────
function enc({ tokens, banned }) {
  const whites = tokens.filter(t => t.c === 'w');
  const blacks  = tokens.filter(t => t.c === 'b');
  const parts   = [];
  const fmt     = t => `${(LABELS[t.cell] ?? t.cell).toLowerCase()}:${t.name}${t.frog ? 'f' : ''}`;
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
        let   name = entry.slice(col + 1).trim();
        // Character ids are always plain digits, so a trailing 'f' unambiguously marks the token
        // as transformed into a Frog rather than being part of the id itself.
        let frog = false;
        if (name.endsWith('f')) { frog = true; name = name.slice(0, -1); }
        const cell = L2ID[ref] ?? +ref;
        if (name && !isNaN(cell)) tokens.push(frog ? { cell, name, c, frog } : { cell, name, c });
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

// Returns a token being removed from the board (deleted, or having its identity replaced) back to
// the palette — including the Frog (id 22) if it was riding this token, which would otherwise be
// lost from the game entirely (neither on the board nor available in the palette).
function _palReturnToken(tok) {
  _palAdd(tok.name);
  if (tok.frog) _palAdd('22');
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
let showLabels     = _loadSetting('leaders-labels',      true);
let showShadow     = _loadSetting('leaders-shadow',      true);
let showTooltips   = _loadSetting('leaders-tooltips',    true);
let showAlertIcons = _loadSetting('leaders-alert-icons', true);
let showBarrageLine = _loadSetting('leaders-board-aids', true);

// ── VIEW FLIP STATE (cosmétique, non sauvegardé dans l'URL) ──────────────────
let viewFlipH = false;
let viewFlipV = false;

// ── RESPONSIVE BREAKPOINT — single source of truth for desktop vs mobile layout ──
const MOBILE_BREAKPOINT_PX = 768;
const _mobileMQ = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
const isMobileLayout = () => _mobileMQ.matches;

// ── PANEL OPEN/CLOSE ANIMATION ────────────────────────────────────────────────
// A plain CSS transition on grid-template-columns doesn't work: the board's cell positions come
// from a synchronous boardArea.clientWidth read (_relayoutDesktop), which at t=0 of a CSS
// transition still reports the pre-change size — the board snaps to a stale layout while the
// container visually resizes underneath it. Instead, _relayoutDesktop takes a forced width per
// panel (_panelWidthOverride) and drives it through a sequence of values via requestAnimationFrame,
// calling the real relayout()/render() every frame so each one is a fully self-consistent layout.
const PANEL_ANIM_MS = 280; // matches #pal-panel/#pal2-panel's own transition duration
const _panelWidthOverride = { pal: null, pal2: null };
const _panelAnimRaf       = { pal: null, pal2: null };

// The panel's own box stays a constant size (content never reshuffles), translating off-screen
// via CSS transform when collapsed — only the board's reserved space animates. The right panel's
// natural width depends on live board measurements only meaningful while open, so this caches the
// last value computed in that state instead of recomputing while closed.
let _palPanelW = null;

// Evaluates the same cubic-bezier(0.4,0,0.2,1) curve used by the panels' own CSS transition, via
// Newton's method — so the JS-driven board animation and the CSS-driven panel slide move at
// visually matching speeds throughout, not just at the same overall duration.
function _cubicBezier(x1, y1, x2, y2) {
  const coord = (t, a, b) => { const mt = 1 - t; return 3*mt*mt*t*a + 3*mt*t*t*b + t*t*t; };
  return x => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx  = coord(t, x1, x2) - x;
      const mt  = 1 - t;
      const deriv = 3*mt*mt*x1 + 6*mt*t*(x2 - x1) + 3*t*t*(1 - x2);
      if (Math.abs(deriv) < 1e-6) break;
      t -= dx / deriv;
    }
    return coord(t, y1, y2);
  };
}
const _panelEase = _cubicBezier(0.4, 0, 0.2, 1);

// Animates one panel's grid column from fromW to toW, re-running the real layout on every frame.
function _animatePanelWidth(which, fromW, toW) {
  if (_panelAnimRaf[which]) cancelAnimationFrame(_panelAnimRaf[which]);
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / PANEL_ANIM_MS);
    _panelWidthOverride[which] = fromW + (toW - fromW) * _panelEase(t);
    relayout(); render();
    if (t < 1) {
      _panelAnimRaf[which] = requestAnimationFrame(step);
    } else {
      _panelAnimRaf[which] = null;
      _panelWidthOverride[which] = null; // hand back to natural (re-converging) computation
      relayout(); render();
    }
  }
  _panelAnimRaf[which] = requestAnimationFrame(step);
}

// Reads the panel's current column width, computes the natural target for the other side of the
// toggle, and kicks off the animation between them.
function _animatePanelToggle(which) {
  const main = document.getElementById('main');
  const varName = which === 'pal' ? '--pal-col-w' : '--pal2-col-w';
  const fromW = parseFloat(getComputedStyle(main).getPropertyValue(varName)) || 0;

  // Relayout once to read the natural target, then reset back to fromW before returning — no
  // paint happens in between, so this is invisible until the rAF loop below starts advancing it.
  _panelWidthOverride[which] = null;
  relayout();
  const toW = parseFloat(getComputedStyle(main).getPropertyValue(varName)) || 0;

  _panelWidthOverride[which] = fromW;
  relayout(); render();

  _animatePanelWidth(which, fromW, toW);
}

let _layoutMode = null; // null | 'desktop' | 'mobile' — tracks the last applied mode
function _syncLayoutModeClass() {
  const mode = isMobileLayout() ? 'mobile' : 'desktop';
  if (mode === _layoutMode) return;
  _layoutMode = mode;
  document.body.classList.toggle('layout-mobile', mode === 'mobile');
  document.body.classList.toggle('layout-desktop', mode === 'desktop');
  mode === 'mobile' ? _enterMobileTabs() : _exitMobileTabs();
}

// ── MOBILE TABS — merges the Saves and Tokens panels into one tabbed bottom section.
// Reuses Palette/Palette2's existing panel DOM (reparented, never rebuilt) so none of their
// rendering logic is duplicated — only which container holds them, and which one is visible.
let _mobileTabsEl       = null;
let _mobileTabContent   = null;
let _mobileTabsCollapsed = false;

function _buildMobileTabs() {
  if (_mobileTabsEl) return;
  const el = document.createElement('div');
  el.id = 'mobile-tabs';
  el.innerHTML = `
    <div id="mobile-tab-bar">
      <button class="mobile-tab-btn active" data-tab="tokens"></button>
      <button id="mobile-tabs-collapse-btn">
        <svg width="14" height="14" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="2 3 5 7 8 3"/>
        </svg>
      </button>
    </div>
    <div id="mobile-tab-content"></div>`;
  document.getElementById('main').appendChild(el);
  el.querySelector('#mobile-tabs-collapse-btn').addEventListener('click', _toggleMobileTabsCollapsed);
  _mobileTabsEl     = el;
  _mobileTabContent = el.querySelector('#mobile-tab-content');
  _initMobileTabsSwipe(el.querySelector('#mobile-tab-bar'));
  _updateMobileTabLabels();
}

// Swipe-down-to-close / swipe-up-to-open on the tab bar — the content area has its own scrollable
// lists, so a swipe there would fight normal scrolling. A tap that doesn't cross the threshold
// below still reaches the tab/collapse buttons normally.
function _initMobileTabsSwipe(bar) {
  const SWIPE_PX = 24;
  let startX = 0, startY = 0, tracking = false;

  bar.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  bar.addEventListener('touchend', e => {
    if (!tracking) return;
    tracking = false;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dy) < SWIPE_PX || Math.abs(dy) < Math.abs(dx)) return; // not a deliberate vertical swipe

    if (dy > 0 && !_mobileTabsCollapsed) { e.preventDefault(); _toggleMobileTabsCollapsed(); }
    else if (dy < 0 && _mobileTabsCollapsed) { e.preventDefault(); _toggleMobileTabsCollapsed(); }
  });

  bar.addEventListener('touchcancel', () => { tracking = false; });
}

function _updateMobileTabLabels() {
  if (!_mobileTabsEl) return;
  _mobileTabsEl.querySelector('[data-tab="tokens"]').textContent = t('palTitle');
}

// #mobile-tabs' height animates via plain CSS transition, so a single relayout() right after
// toggling the class would only see its t=0 start value. Polling relayout()/render() every frame
// instead samples the panel's real, already-progressed height each time, resizing the board
// (#board-area, a flex child) smoothly in step with it — no separate JS easing needed.
let _mobileTabsResizeRaf = null;

function _toggleMobileTabsCollapsed() {
  _mobileTabsCollapsed = !_mobileTabsCollapsed;
  _mobileTabsEl?.classList.toggle('collapsed', _mobileTabsCollapsed);

  if (_mobileTabsResizeRaf) cancelAnimationFrame(_mobileTabsResizeRaf);
  const start = performance.now();
  function step(now) {
    relayout(); render();
    if (now - start < PANEL_ANIM_MS) {
      _mobileTabsResizeRaf = requestAnimationFrame(step);
    } else {
      _mobileTabsResizeRaf = null;
      relayout(); render(); // settle on the final, fully-transitioned state
    }
  }
  _mobileTabsResizeRaf = requestAnimationFrame(step);
}

// Saves (Palette2) is desktop-only now — its panel is never reparented here, so it just stays
// wherever _build() created it, hidden by the same body.layout-mobile rule that hides any panel
// without .tab-active.
function _enterMobileTabs() {
  _buildMobileTabs();
  const palPanel = Palette.getPanelEl();
  if (palPanel) { _mobileTabContent.appendChild(palPanel); palPanel.classList.add('tab-active'); }
}

function _exitMobileTabs() {
  if (!_mobileTabsEl) return;
  const palPanel = Palette.getPanelEl();
  if (palPanel) document.getElementById('main').appendChild(palPanel);
  palPanel?.classList.remove('tab-active');
}

// ── LAYOUT ────────────────────────────────────────────────────────────────────
let LO = {};

// Hex-grid spacing/radius that fits BOARD_COLS x BOARD_ROWS hex units inside a W x H box.
// `slack` is the fraction of the fitted size actually used (the rest is the margin around the
// board) — defaults to the desktop value; _relayoutMobile passes a larger one for tighter
// margins on mobile, where screen space is scarcer.
function _boardSpacing(W, H, slack = 0.90) {
  const sp = Math.min(W / BOARD_COLS, H / BOARD_ROWS) * slack;
  return { sp, r: sp * CR };
}

// Hex-cell pixel coordinates around a center (cx,cy) at spacing sp, with view-flip applied.
function _computeCells(cx, cy, sp) {
  const cells = CELLS.map(c => {
    let x = cx + sp * 1.5 * c.q;
    let y = cy + sp * (SQ3 / 2 * c.q + SQ3 * c.r);
    if (viewFlipH) x = 2 * cx - x;
    if (viewFlipV) y = 2 * cy - y;
    return { ...c, x, y };
  });
  return { cells, byId: new Map(cells.map(c => [c.id, c])) };
}

// Positions the board background layer to fully contain the hex cells; returns the hull radius.
function _layoutBoardLayer(cx, cy, cells, r) {
  const hs = Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + r * 1.6;
  const boardLayer = document.getElementById('board-layer');
  if (boardLayer) {
    const bw = hs * Math.sqrt(3), bh = hs * 2;
    boardLayer.style.left   = (cx - bw / 2) + 'px';
    boardLayer.style.top    = (cy - bh / 2) + 'px';
    boardLayer.style.width  = bw + 'px';
    boardLayer.style.height = bh + 'px';
    _updateBoardClip(boardLayer, bw, bh, hs);
  }
  return hs;
}

function relayout() {
  _hideTokToolbar();
  _syncLayoutModeClass();
  isMobileLayout() ? _relayoutMobile() : _relayoutDesktop();
  // Single shared size reference for every token-shaped element (board tokens, the drag ghost,
  // drop targets, palette items — they're all the same diameter). CSS derives width/height and
  // the responsive, centered outline/ring from this one variable; JS never sizes them directly.
  document.body.style.setProperty('--tok-sz', Math.round(LO.r * 2) + 'px');
  // Rounded to a whole pixel for the same reason as --tok-sz above — a fractional-pixel box for
  // the frog badge's background-image forces the browser to anti-alias the whole image, not just
  // its edges, which reads as blurry rather than just a soft edge (see _applyFrogBadge).
  document.body.style.setProperty('--frog-badge-sz', Math.round(LO.r * 2 * 0.4) + 'px');
}

// Desktop: #main is a CSS grid (fixed-280px saves | board | tokens). The board's size is read
// from #board-area's real resolved box — the true gap between the two side panels — instead of
// estimating against #main's full width, so it always reflects what's actually left over.
function _relayoutDesktop() {
  const main      = document.getElementById('main');
  const boardArea = document.getElementById('board-area');
  const mainW = main.clientWidth  || 800;
  const mainH = main.clientHeight || 560;

  const pal2Collapsed = (typeof Palette2 !== 'undefined') && Palette2.isCollapsed();
  const palCollapsed   = Palette.isCollapsed();

  // Pal2 (saves) is a flat constant width regardless of state — its own box can just always be
  // that width; nothing to cache.
  const pal2NaturalW = (typeof Palette2 !== 'undefined') ? (Palette2.layout(mainW, mainH).palW || 0) : 0;
  main.style.setProperty('--pal2-panel-w', pal2NaturalW + 'px');

  // Separate from --pal2-panel-w above (the panel's own constant box size): this is how much of
  // it the board currently treats as reserved, driven frame-by-frame during an open/close animation.
  const pal2W = _panelWidthOverride.pal2 != null ? _panelWidthOverride.pal2 : (pal2Collapsed ? 0 : pal2NaturalW);
  main.style.setProperty('--pal2-col-w', pal2W + 'px');

  const btnPal2 = document.getElementById('btn-toggle-pal2');
  if (btnPal2) btnPal2.style.display = '';

  let palW, W, H, sp, r;
  if (_panelWidthOverride.pal != null) {
    palW = _panelWidthOverride.pal;
    main.style.setProperty('--pal-col-w', palW + 'px');
    W = boardArea.clientWidth  || 800;
    H = boardArea.clientHeight || 560;
    ({ sp, r } = _boardSpacing(W, H));
  } else if (palCollapsed) {
    // Closed: board gets the full space; panel keeps whatever width it last had while open
    // (_palPanelW) rather than recomputing against the now-wider board.
    palW = 0;
    main.style.setProperty('--pal-col-w', '0px');
    W = boardArea.clientWidth  || 800;
    H = boardArea.clientHeight || 560;
    ({ sp, r } = _boardSpacing(W, H));
  } else {
    // Open: reserving width for the panel changes the board's radius, which changes how wide the
    // panel needs to be — so converge the two together (each step only narrows the gap) instead
    // of trusting one estimate-based pass. Iteration cap below is a safety net, not a necessity.
    palW = Palette.layout(mainW, mainH, _boardSpacing(mainW, mainH).r).palW;
    for (let i = 0; i < 8; i++) {
      main.style.setProperty('--pal-col-w', palW + 'px');
      W = boardArea.clientWidth  || 800;
      H = boardArea.clientHeight || 560;
      ({ sp, r } = _boardSpacing(W, H));
      const grown = Palette.growColumns(mainW, mainH, pal2W, r);
      if (grown.palW === palW) break;
      palW = grown.palW;
    }
    _palPanelW = palW;
  }
  // Fallback for the very first layout pass, if it happens to start collapsed (so the panel
  // isn't 0-width the first time it's opened, before any "open and settled" pass has ever run).
  if (_palPanelW == null) _palPanelW = Palette.layout(mainW, mainH, _boardSpacing(mainW, mainH).r).palW;
  main.style.setProperty('--pal-panel-w', _palPanelW + 'px');

  const cx = W / 2, cy = H / 2;
  const { cells, byId } = _computeCells(cx, cy, sp);
  const hs = _layoutBoardLayer(cx, cy, cells, r);
  // Free read (layout already flushed above) — cached so mousemove/touchmove handlers don't
  // each call getBoundingClientRect() themselves (_mainXY/_touchXY/_syncGhost/Palette._mainRect).
  const boardRect = boardArea.getBoundingClientRect();

  LO = { W, H, r, cx, cy, cells, byId, hs, boardRect };

  Palette.syncLayout();
  if (typeof Palette2 !== 'undefined') Palette2.syncLayout();
}

// Mobile: #board-area is a flex child that takes whatever height #mobile-tabs doesn't (style.css),
// so its clientWidth/clientHeight already is the available space, and centering is just W/2,H/2.
function _relayoutMobile() {
  const boardArea = document.getElementById('board-area');
  const W = boardArea.clientWidth  || 800;
  const H = boardArea.clientHeight || 560;
  const { sp, r } = _boardSpacing(W, H, 0.95); // tighter margins than desktop's default 0.90
  const cx = W / 2, cy = H / 2;

  const { cells, byId } = _computeCells(cx, cy, sp);
  const hs = _layoutBoardLayer(cx, cy, cells, r);
  const boardRect = boardArea.getBoundingClientRect();

  LO = { W, H, r, cx, cy, cells, byId, hs, boardRect };

  Palette.syncLayout();
  if (typeof Palette2 !== 'undefined') Palette2.syncLayout();
}

function _updateBoardClip(el, bw, bh, hs) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 3 * i + Math.PI / 6;
    return `${(50 + hs * Math.cos(a) / bw * 100).toFixed(3)}% ${(50 + hs * Math.sin(a) / bh * 100).toFixed(3)}%`;
  });
  el.style.clipPath = `polygon(${pts.join(', ')})`;
}

// ── HIT TESTING ───────────────────────────────────────────────────────────────
// Coordinates are relative to #board-area (where LO's cell positions live), not #main — on
// desktop the two differ by the left panel's width.
function _mainXY(e) {
  const b = LO.boardRect;
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

// ── MOVE SELECTED TOKEN — shared by mouse + touch ─────────────────────────────
// Moves _selected.id to destCellId, swapping if occupied. Returns true if it moved.
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
// GHOST_TAP_MS is the window after a long-press-opened menu during which trailing events from
// that same physical gesture are still arriving and must be ignored rather than treated as a new,
// separate one — used in onTouchStart/onTouchEnd below, and in each context menu's own
// document-level 'contextmenu' listener (_openCtxMenu here, plus palette.js/palette2.js).
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

// ── RIGHT-CLICK / LONG-PRESS → context menu ───────────────────────────────────
// x,y are board-local (hit-testing); clientX,clientY are viewport coords (where the menu opens).
// Returns whether a menu actually opened, so callers can tell a real long-press from one that
// landed on empty space and did nothing.
function _simulateRightClick(x, y, clientX, clientY) {
  if (Palette.inPalette(x, y)) {
    const name = Palette.palAt(x, y);
    if (!name) return false;
    Tooltip.hide(); Palette.openPalToolbar(name, clientX, clientY);
    return true;
  }
  const tok = tokAt(x, y);
  if (!tok) return false;
  tokTbId = tok.id; Tooltip.hide(); _placeTokToolbar(clientX, clientY);
  return true;
}

// ── TOUCH EVENTS ──────────────────────────────────────────────────────────────
// Tap-to-select handles everything by default. Real drag-and-drop is layered on top, only armed
// when a touch starts on an actual board token (onTouchStart), so it never intercepts touches
// elsewhere (panel taps/scroll/swipe keep working normally).
function _touchXY(touch) {
  const b = LO.boardRect;
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
    _longPressTimer = null;
    drag = null; dpos = null; // a long-press always means "context menu," not "drag"
    _cancelTouchSelection();
    // Only arm the ghost-tap suppression window (below, and in onTouchEnd) when a menu actually
    // opened — a long-press on empty space does nothing, and shouldn't then eat the next touch.
    if (_simulateRightClick(x, y, onTouchStart._startX, onTouchStart._startY)) {
      _longPressFired   = true;
      _longPressEndTime = Date.now();
      if (navigator.vibrate) navigator.vibrate(40);
    }
    render();
  }, LONG_PRESS_MS);

  // Board-only drag arming: a board token under the finger gets a pending drag (becomes real on
  // movement, exactly like the mouse's onDown) — anything else (palette items, empty cells, and
  // everywhere off the board) keeps the plain tap behavior in onTouchEnd below, untouched.
  const tok = !Palette.inPalette(x, y) && tokAt(x, y);
  if (tok) {
    drag = { type: 'brd', id: tok.id, _startX: x, _startY: y, _pending: true };
    dpos = { x, y };
    render();
  }
}

function onTouchMove(e) {
  if (!e.touches.length) return;
  const touch = e.touches[0];
  const dx = touch.clientX - (onTouchStart._startX || touch.clientX);
  const dy = touch.clientY - (onTouchStart._startY || touch.clientY);
  if (Math.hypot(dx, dy) > 8) _cancelLongPress();

  if (!drag) return;
  const { x, y } = _touchXY(touch);
  if (drag._pending && Math.hypot(x - drag._startX, y - drag._startY) >= 6) {
    drag._pending = false;
    _cancelTouchSelection();
  }
  dpos = { x, y };
  render();
}

function onTouchEnd(e) {
  _cancelLongPress();
  if (e.changedTouches.length !== 1) { drag = null; dpos = null; return; }
  if (Date.now() - _longPressEndTime < GHOST_TAP_MS) { e.preventDefault(); drag = null; dpos = null; return; }
  if (_longPressFired) { _longPressFired = false; e.preventDefault(); drag = null; dpos = null; return; }

  const touch = e.changedTouches[0];
  const { x, y } = _touchXY(touch);

  // A real (moved) board drag → drop it, mirroring the mouse's onUp board-drag branch exactly.
  if (drag && !drag._pending) {
    e.preventDefault();
    const cell = nearCell(x, y);
    const inP  = Palette.inPalette(x, y);
    const tok  = S.tokens.find(t => t.id === drag.id);
    if (tok) {
      if (inP || !cell) {
        S.tokens = S.tokens.filter(t => t.id !== drag.id);
        _palReturnToken(tok);
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
    drag = null; dpos = null; render();
    return;
  }
  drag = null; dpos = null; // still pending (didn't move) — fall through to the tap logic below

  const dx = touch.clientX - (onTouchStart._startX || touch.clientX);
  const dy = touch.clientY - (onTouchStart._startY || touch.clientY);
  if (Math.hypot(dx, dy) > 10) { render(); return; }

  if (e.target.closest('#tok-tb, #pal-tok-tb, #toolbar, #settings-overlay, #help-overlay')) { render(); return; }

  const inP = Palette.inPalette(x, y);

  if (_selected?.type === 'brd') {
    const destCell = nearCell(x, y);
    if (destCell) {
      _moveSelectedToCell(destCell.id);
    } else if (inP) {
      const palName = Palette.palAt(x, y);
      if (palName) {
        const tok = S.tokens.find(t => t.id === _selected.id);
        if (tok) { _palReturnToken(tok); S.tokens = S.tokens.map(t => t.id === _selected.id ? { ...t, name: palName, frog: false } : t); _palRemove(palName); saveH(); }
      }
    } // else: tap outside the board just deselects, no deletion
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

  const tokTap = tokAt(x, y);
  if (tokTap) {
    e.preventDefault();
    _selected = { type: 'brd', id: tokTap.id };
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
  main.addEventListener('touchcancel', () => { _cancelLongPress(); drag = null; dpos = null; _cancelTouchSelection(); render(); });
}

// ── SHARED RIGHT-CLICK CONTEXT MENU ───────────────────────────────────────────
// Backs the board's token menu (#tok-tb) and the palette's ban menu (#pal-tok-tb) — same design
// as the Saves panel's own (#pal2-ctx-menu). elId lets each menu keep its own DOM element/close-fn.
const _ctxMenus = new Map(); // elId -> close function

let _menuOpenCount = 0;
let _lastClientX = 0, _lastClientY = 0;
// Track cursor position at window level — fires even while body has pointer-events:none,
// so coordinates stay current while menus are open.
window.addEventListener('mousemove', e => { _lastClientX = e.clientX; _lastClientY = e.clientY; }, true);
function _menuOpened() { if (++_menuOpenCount === 1) document.body.classList.add('menu-open'); }
function _menuClosed() {
  if (--_menuOpenCount <= 0) {
    _menuOpenCount = 0;
    document.body.classList.remove('menu-open');
    // pointer-events:none on body bypassed #main, so onDown/_closeAllToolbars never ran — clear
    // toolbar/tooltip state here so onMove's guards don't stay stuck after close.
    tokTbId = null;
    Palette?.hidePalToolbar?.();
    Tooltip.hide();
    // Touch has no hover to restore (onMove skips tooltips there entirely — see below), and
    // _lastClientX/Y never reflect a meaningful position on touch anyway.
    if (!_isTouchDevice()) {
      setTimeout(() => {
        document.getElementById('main')?.dispatchEvent(new MouseEvent('mousemove', {
          bubbles: true, cancelable: true, clientX: _lastClientX, clientY: _lastClientY,
        }));
      }, 0);
    }
  }
}

function _closeCtxMenu(elId) {
  const close = _ctxMenus.get(elId);
  if (close) { _ctxMenus.delete(elId); close(); }
}

// items: [{ label, danger?, onClick }] — a { sep: true } entry renders a divider instead.
function _openCtxMenu(elId, x, y, items) {
  _closeCtxMenu(elId);
  // Paired with _closeCtxMenu synchronously (not deferred to the rAF below, which is only there
  // for the visual reveal) — otherwise a rapid reopen of the same elId before that rAF fires would
  // let the stale _menuOpened() land after its own _menuClosed(), permanently inflating the count
  // and leaving body.menu-open (pointer-events:none) stuck forever.
  _menuOpened();

  let el = document.getElementById(elId);
  if (!el) { el = document.createElement('div'); el.id = elId; document.body.appendChild(el); }
  el.innerHTML = items.map((it, i) => it.sep
    ? `<div class="tok-tb-sep"></div>`
    : `<button class="tok-tb-btn${it.danger ? ' tok-tb-btn-danger' : ''}" data-idx="${i}">${it.label}</button>`
  ).join('');
  el.classList.remove('open', 'ctx-flip-x', 'ctx-flip-y');
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
    _closeCtxMenu(elId);
    item?.onClick?.();
  };
  el.addEventListener('mousedown', onAction);

  const onOutside = e => { if (!el.contains(e.target)) _closeCtxMenu(elId); };
  document.addEventListener('mousedown', onOutside, true);
  // Always preventDefault (a touch long-press's own native contextmenu, possibly hit-testing to
  // <html> past body.menu-open's pointer-events:none, must never show the browser's menu too) —
  // but not treated as a dismiss signal within GHOST_TAP_MS, since that's this same long-press's
  // own trailing native event (see GHOST_TAP_MS above), not a genuine click/tap elsewhere.
  const onContext = e => {
    e.preventDefault();
    if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
    if (!el.contains(e.target)) _closeCtxMenu(elId);
  };
  document.addEventListener('contextmenu', onContext, true);

  _ctxMenus.set(elId, () => {
    el.classList.remove('open');
    el.removeEventListener('mousedown', onAction);
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('contextmenu', onContext, true);
    el.style.display = 'none';
    _menuClosed();
  });
}

// ── TOKEN TOOLBAR ─────────────────────────────────────────────────────────────
let tokTbId = null;

function _placeTokToolbar(x, y) {
  if (tokTbId === null) { _hideTokToolbar(); return; }
  const tok = S.tokens.find(t => t.id === tokTbId);
  if (!tok) { _hideTokToolbar(); return; }

  const fr = currentLang === 'fr';
  const id = tokTbId;
  // Leaders (type 'd') and the Frog itself (id 22) can never become a Frog. There's only ever one
  // Frog character (like any other), so also require it to actually be sitting in the palette —
  // the same scarcity the drag-and-drop transform already enforces (dragging it from the palette
  // is only possible while it's there). Checking the palette itself (rather than "is some other
  // token's frog flag set") also correctly excludes it while it's a standalone board token.
  const frogAvailable = S.palette.vermillon.includes('22');
  const canFrog = tok.name !== '22' && _getTokenData(tok.name)?.type !== 'd' && frogAvailable;
  const items = [
    {
      label: fr ? 'Changer de couleur' : 'Toggle color',
      onClick: () => {
        S.tokens = S.tokens.map(t => t.id === id ? { ...t, c: t.c === 'w' ? 'b' : 'w' } : t);
        tokTbId = null; saveH(); render();
      },
    },
    ...(tok.frog || canFrog ? [{
      label: tok.frog
        ? (fr ? 'Détransformer' : 'Remove Transformation')
        : (fr ? 'Transformer en grenouille' : 'Transform into Frog'),
      onClick: () => {
        const turningOn = !tok.frog;
        S.tokens = S.tokens.map(t => t.id === id ? { ...t, frog: turningOn } : t);
        turningOn ? _palRemove('22') : _palAdd('22');
        tokTbId = null; saveH(); render();
      },
    }] : []),
    { sep: true },
    {
      label: fr ? 'Supprimer' : 'Delete',
      danger: true,
      onClick: () => {
        const tk = S.tokens.find(t => t.id === id);
        if (tk) _palReturnToken(tk);
        S.tokens = S.tokens.filter(t => t.id !== id);
        tokTbId = null; saveH(); render();
      },
    },
  ];
  _openCtxMenu('tok-tb', x, y, items);
}

function _hideTokToolbar() {
  _closeCtxMenu('tok-tb');
  tokTbId = null;
}

// ── EVENT HANDLERS ────────────────────────────────────────────────────────────
function onDown(e) {
  const { x, y } = _mainXY(e);
  const inP = Palette.inPalette(x, y);

  _closeAllToolbars(e.target);

  // Menu opens from 'contextmenu' below, not here — opening on mousedown(button 2) raced with
  // the native 'contextmenu' that follows, closing the menu right after it opened.
  if (e.button === 2) { e.preventDefault(); return; }

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
      if (tok) { _palReturnToken(tok); S.tokens = S.tokens.map(t => t.id === _selected.id ? { ...t, name: n, frog: false } : t); _palRemove(n); saveH(); }
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
    } // else: click outside the board just deselects, no deletion
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

  const inPal = Palette.inPalette(x, y);
  const hoveredBoardTok = (!inPal && !drag) ? tokAt(x, y) : null;

  // Touch has no hover concept — only tap and long-press — so tooltips never trigger there,
  // regardless of what fires this handler (real mousemove, or a synthetic one following a tap).
  if (tokTbId === null && !Palette.isPalTbOpen?.() && !_isTouchDevice()) {
    if (inPal) {
      Palette.onMove(x, y);
    } else {
      if (hoveredBoardTok && showTooltips) {
        const cell = LO.byId.get(hoveredBoardTok.cell);
        if (cell) {
          const boardRect = LO.boardRect;
          Tooltip.scheduleBoard(hoveredBoardTok.name, boardRect.left + cell.x, boardRect.top + cell.y, 'board:' + hoveredBoardTok.id, LO.r, hoveredBoardTok.frog ? '22' : null);
        }
      } else {
        Tooltip.hide();
      }
    }
  }

  if (drag) { dpos = { x, y }; render(); }
  document.getElementById('main').style.cursor = hoveredBoardTok ? 'pointer' : 'default';
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
        if (inP || !cell) {
          S.tokens = S.tokens.filter(t => t.id !== drag.id);
          _palReturnToken(tok);
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
      // A Frog target is excluded whether it's a raw Frog character (name '22') or a token
      // already transformed into one (frog: true) — either way it's already "a Frog" visually.
      const otherIsFrog = other && (other.name === '22' || other.frog);
      if (other && drag.name === '22' && !otherIsFrog && _getTokenData(other.name)?.type !== 'd') {
        // Dropping a Frog from the palette onto an existing token transforms it in place instead
        // of replacing its character (board-to-board Frog drags keep the normal swap behavior).
        S.tokens = S.tokens.map(t => t.id === other.id ? { ...t, frog: true } : t);
      } else if (other) {
        // Plain swap (also covers Frog-onto-Frog and Frog-onto-Leader) — the old character (and
        // its Frog, if it had one) goes back to the palette; the target cell's own frog flag is
        // cleared, exactly like a normal character exchange.
        _palReturnToken(other);
        S.tokens = S.tokens.map(t => t.id === other.id ? { ...t, name: drag.name, c: drag.c, frog: false } : t);
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
  saveH(); render();
}

function _loadState({ tokens, banned }) {
  const used = new Set(tokens.map(t => t.name));
  // A Frog riding another token is stored as that token's own `frog` flag, never as a token named
  // '22' — without this, loading a state with a transformed token would leave the Frog looking
  // available again in the palette even though it's actively in use.
  if (tokens.some(t => t.frog)) used.add('22');
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
// Toggles the small corner badge showing a transformed token's original character (pure CSS —
// .frog-badge-on::after in style.css). Shared by the resting token (_syncTokenLayer) and the
// drag ghost (_syncGhost). The "?badge" suffix keeps this small rendering a distinct cached
// resource from the same artwork's full-size uses elsewhere (palette, board), avoiding a shared
// resampled bitmap that would otherwise show this badge as a blurry downscale of the other one.
function _applyFrogBadge(el, tok, color) {
  el.classList.toggle('frog-badge-on', !!tok.frog);
  if (tok.frog) el.style.setProperty('--frog-badge-src', `url("jetons_${color}/${tok.name}.png?badge")`);
}

function _dragMoved() {
  if (!drag || !dpos || drag._pending) return false;
  return Math.hypot(dpos.x - (drag._startX ?? dpos.x), dpos.y - (drag._startY ?? dpos.y)) >= 6;
}

function _syncTokenLayer() {
  const layer = document.getElementById('tokens-layer');
  if (!layer) return;
  const { r, byId } = LO;

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
      el._img = img;
      layer.appendChild(el);
    }

    const color = tok.c === 'w' ? 'blanc' : 'noir';
    const img   = el._img;
    const src   = `jetons_${color}/${tok.frog ? '22' : tok.name}.png`;
    if (!img.src.endsWith(src)) img.src = src;

    _applyFrogBadge(el, tok, color);

    // Size, shadow and ring are all CSS (driven by --tok-sz, see style.css) — only position
    // and the per-token "used" state are dynamic enough to need setting from here.
    el.style.left = (cell.x - r) + 'px';
    el.style.top  = (cell.y - r) + 'px';
    img.classList.toggle('used-token', !!tok.used);
  }
  for (const [tid, el] of existing) { if (!seen.has(tid)) el.remove(); }
  document.body.classList.toggle('no-shadows', !showShadow);
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

// Tracks the current mode/cell so a drag (calling this on every mousemove) repositions one
// persistent div instead of rebuilding the layer every frame (was stealing frame budget from the
// ghost's trash-bin animation).
let _dropTargetMode = null; // null | 'drag' | 'hint'
let _dropTargetCellId = null;

function _syncDropTarget() {
  const layer = document.getElementById('droptarget-layer');
  if (!layer) return;
  const { r } = LO;

  if (drag && dpos && _dragMoved()) {
    const dtgt = nearCell(dpos.x, dpos.y);
    if (_dropTargetMode !== 'drag' || !dtgt) {
      layer.innerHTML = '';
      _dropTargetMode = 'drag';
      _dropTargetCellId = null;
    }
    if (dtgt && _dropTargetCellId !== dtgt.id) {
      _dropTargetCellId = dtgt.id;
      let div = layer.firstElementChild;
      if (!div) { div = document.createElement('div'); div.className = 'html-droptarget'; layer.appendChild(div); }
      div.style.left = (dtgt.x - r) + 'px';
      div.style.top  = (dtgt.y - r) + 'px';
    }
    return;
  }

  // Touch-hint mode is event-driven, not per-mousemove like the drag case above, so it's not
  // the performance concern — always rebuild fresh here, simplest and never stale after a resize.
  if (_selected && (_isTouchDevice() || !drag) && (_selected.type === 'brd' || _selected.type === 'pal')) {
    layer.innerHTML = '';
    for (const c of LO.cells) {
      const div = document.createElement('div');
      div.className = 'html-droptarget touch-hint';
      div.style.left = (c.x - r) + 'px';
      div.style.top  = (c.y - r) + 'px';
      layer.appendChild(div);
    }
    _dropTargetMode = 'hint';
    return;
  }

  if (_dropTargetMode !== null) { layer.innerHTML = ''; _dropTargetMode = null; _dropTargetCellId = null; }
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
    document.body.appendChild(ghost);
  }

  const r     = LO.r; // palette items now render at the same size as board tokens
  const color = tok.c === 'w' ? 'blanc' : 'noir';
  const img   = ghost.querySelector('img');
  const src   = `jetons_${color}/${tok.frog ? '22' : tok.name}.png`;
  if (!img.src.endsWith(src)) img.src = src;

  // Same corner badge as the resting token — kept visible through the drag instead of
  // disappearing while the token is being moved.
  _applyFrogBadge(ghost, tok, color);

  // Mounted on <body> (viewport coords) so it's never clipped by #board-area while dragged across
  // a panel boundary. Moved via transform, not left/top, so repositioning never forces layout.
  const boardRect = LO.boardRect;
  ghost.style.display   = 'block';
  ghost.style.transform = `translate(${boardRect.left + dpos.x - r}px, ${boardRect.top + dpos.y - r}px)`;
  ghost.style.opacity   = '1';

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
  } else if (trashOverlay) {
    trashOverlay.style.display = 'none';
  }
}

// ── RENDER ────────────────────────────────────────────────────────────────────
let _lastEncodedState = null;

function render() {
  // Skip the URL/history write when it'd be a no-op — S doesn't change mid-drag, and render()
  // runs on every mousemove during one.
  const encoded = enc(S);
  if (encoded !== _lastEncodedState) {
    _lastEncodedState = encoded;
    history.replaceState(null, '', '#' + encoded);
  }
  _syncTokenLayer();
  _syncLabelLayer();
  _syncDropTarget();
  _syncGhost();
  _syncTouchSelectionHighlight();
  Palette.syncContent();
  // Board state is frozen mid-drag, so skip re-running the barrage region search every mousemove.
  if (!drag) _updateBoardStatusIcons();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  loadStateFromURL();

  const main = document.getElementById('main');
  main.addEventListener('mousedown',   onDown);
  main.addEventListener('mousemove',   onMove);
  main.addEventListener('mouseup',     onUp);
  main.addEventListener('click',       () => { if (justDropped) justDropped = false; });
  main.addEventListener('contextmenu', e => {
    e.preventDefault();
    const { x, y } = _mainXY(e);
    if (Palette.inPalette(x, y)) return; // palette.js has its own contextmenu listener for this
    const tok = tokAt(x, y);
    if (tok) { tokTbId = tok.id; Tooltip.hide(); _placeTokToolbar(e.clientX, e.clientY); render(); }
  });
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
    if (!Palette.inPalette(mousePos.x, mousePos.y)) {
      const hoverTok = tokAt(mousePos.x, mousePos.y);
      if (hoverTok && (e.key === 'c' || e.key === 'C')) toggleC(hoverTok.id);
      if (hoverTok && (e.key === 'Delete' || e.key === 'Backspace')) {
        _palReturnToken(hoverTok);
        S.tokens = S.tokens.filter(t => t.id !== hoverTok.id);
        saveH(); render();
      }
    } else if (e.key === 'b' || e.key === 'B') {
      const hoverName = Palette.palAt(mousePos.x, mousePos.y);
      if (hoverName) isBanned(hoverName) ? doUnban(hoverName) : doBan(hoverName);
    }
    if (e.key === 'Escape') {
      _hideTokToolbar(); _cancelTouchSelection();
      document.getElementById('settings-overlay').classList.add('hidden');
      document.getElementById('help-overlay').classList.add('hidden');
      document.getElementById('lang-submenu').classList.remove('open');
      Palette.hidePalToolbar?.();
    }
  });

  document.getElementById('btn-reset-board'   ).addEventListener('click', doReset);
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
    _syncToggle('tog-labels',   showLabels);
    _syncToggle('tog-shadow',   showShadow);
    _syncToggle('tog-tooltips',    showTooltips);
    _syncToggle('tog-alert-icons', showAlertIcons);
    _syncToggle('tog-barrage',  showBarrageLine);
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

  document.getElementById('row-tooltips').addEventListener('click', () => {
    showTooltips = !showTooltips; localStorage.setItem('leaders-tooltips', showTooltips);
    _syncToggle('tog-tooltips', showTooltips);
    if (!showTooltips) Tooltip.hide();
  });
  document.getElementById('row-alert-icons').addEventListener('click', () => {
    showAlertIcons = !showAlertIcons; localStorage.setItem('leaders-alert-icons', showAlertIcons);
    _syncToggle('tog-alert-icons', showAlertIcons);
    if (!showAlertIcons) _clearAlertIcons(); else render();
  });
  document.getElementById('row-barrage').addEventListener('click', () => {
    showBarrageLine = !showBarrageLine; localStorage.setItem('leaders-board-aids', showBarrageLine);
    _syncToggle('tog-barrage', showBarrageLine);
    if (!showBarrageLine) _clearBoardAids(); else render();
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
  // Guarded on the actual open/close transition since _closeLangMenu is called unconditionally
  // from several places and would otherwise decrement the shared _menuOpenCount too many times.
  const _closeLangMenu = () => {
    if (!langSubmenu.classList.contains('open')) return;
    langSubmenu.classList.remove('open');
    _menuClosed();
  };
  const _openLangMenu  = () => {
    _syncLangUI();
    langSubmenu.classList.add('open');
    _menuOpened();
    const menuW       = langSubmenu.offsetWidth;
    const menuH       = langSubmenu.offsetHeight;
    const GAP         = 8;
    const vw          = window.innerWidth;
    const vh          = window.innerHeight;

    const triggerRect = document.getElementById('lang-trigger').getBoundingClientRect();
    const triggerCX = triggerRect.left + triggerRect.width / 2;

    let left = triggerCX - menuW / 2;
    left = Math.max(GAP, Math.min(left, vw - menuW - GAP));

    const rowRect = document.getElementById('row-lang').getBoundingClientRect();
    let top = rowRect.bottom + 8;
    if (top + menuH > vh - GAP) top = rowRect.top - menuH - 8;

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
  Palette.setOnCollapseChange(() => {
    isMobileLayout() ? (relayout(), render()) : _animatePanelToggle('pal');
  });
  if (typeof Palette2 !== 'undefined') {
    Palette2.init();
    Palette2.setOnCollapseChange(() => {
      isMobileLayout() ? (relayout(), render()) : _animatePanelToggle('pal2');
    });
  }
  if (typeof initButtonTooltips === 'function') initButtonTooltips();
  _initTouchEvents();

  // Coalesced to one relayout()+render() per animation frame — ResizeObserver can fire several
  // times before the browser paints, and relayout()'s column-convergence loop forces a
  // synchronous layout flush on every iteration.
  let _resizePending = false;
  new ResizeObserver(() => {
    if (_resizePending) return;
    _resizePending = true;
    requestAnimationFrame(() => { _resizePending = false; relayout(); render(); });
  }).observe(main);
  relayout(); saveH(); render(); _applyLang();
}

document.addEventListener('DOMContentLoaded', init);