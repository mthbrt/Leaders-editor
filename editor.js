// ── I18N ──────────────────────────────────────────────────────────────────────
const LANGS = {
  fr: {
    // Toolbar
    placeholder:    'Coller une configuration…',
    btnCopy:        'Copier la configuration',
    btnUndo:        'Annuler',
    btnRedo:        'Rétablir',
    btnClearArrows: 'Effacer toutes les flèches',
    btnSettings:    'Paramètres',
    copied:         'Copié !',
    // Settings
    settingsTitle:  'Paramètres',
    rowLabels:      'Indices plateau',
    descLabels:     'Marque les coordonnées sur chaque case du plateau',
    rowOutline:     'Bordures',
    descOutline:    'Ajoute une bordure blanche ou noire sur chaque personnage',
    rowShadow:      'Ombres',
    descShadow:     'Ajoute une ombre sous chaque personnage',
    rowLang:        'Langue',
    // Palette
    palTitle:       'PERSONNAGES',
    palReset:       'Réinitialiser',
    secLancement:   'Lancement',
    secVermillon:   'Extension Vermillon',
    // Help
    btnHelp:          'Aide',
    helpTitle:        'Commandes',
    helpSecTokens:    'Jetons',
    helpDragBoard:    'Clic gauche',
    helpDragBoardDesc:'Déplacer le jeton par glisser-déposer',
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
    // Toolbar
    placeholder:    'Paste a configuration…',
    btnCopy:        'Copy configuration',
    btnUndo:        'Undo',
    btnRedo:        'Redo',
    btnClearArrows: 'Clear all arrows',
    btnSettings:    'Settings',
    copied:         'Copied!',
    // Settings
    settingsTitle:  'Settings',
    rowLabels:      'Board labels',
    descLabels:     'Shows coordinates on each board cell',
    rowOutline:     'Outlines',
    descOutline:    'Adds a white or black outline on each character',
    rowShadow:      'Shadows',
    descShadow:     'Adds a shadow under each character',
    rowLang:        'Language',
    // Palette
    palTitle:       'CHARACTERS',
    palReset:       'Reset',
    secLancement:   'Launch',
    secVermillon:   'Vermillon Expansion',
    // Help
    btnHelp:          'Help',
    helpTitle:        'Controls',
    helpSecTokens:    'Tokens',
    helpDragBoard:    'Left-click',
    helpDragBoardDesc:'Move the token by drag and drop',
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
  // Toolbar
  const inp = document.getElementById('input-state');
  if (inp) inp.placeholder = t('placeholder');
  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) btnCopy.title = t('btnCopy');
  const btnUndo = document.getElementById('btn-undo');
  if (btnUndo) btnUndo.title = t('btnUndo');
  const btnRedo = document.getElementById('btn-redo');
  if (btnRedo) btnRedo.title = t('btnRedo');
  const btnCA = document.getElementById('btn-clear-arrows');
  if (btnCA) btnCA.title = t('btnClearArrows');
  const btnSet = document.getElementById('btn-settings');
  if (btnSet) btnSet.title = t('btnSettings');
  // Settings popup
  const stitle = document.getElementById('settings-title');
  if (stitle) stitle.textContent = t('settingsTitle');
  const rn = document.querySelector('#row-labels .setting-name');
  if (rn) rn.textContent = t('rowLabels');
  const rd = document.querySelector('#row-labels .setting-desc');
  if (rd) rd.textContent = t('descLabels');
  const rn2 = document.querySelector('#row-outline .setting-name');
  if (rn2) rn2.textContent = t('rowOutline');
  const rd2 = document.querySelector('#row-outline .setting-desc');
  if (rd2) rd2.textContent = t('descOutline');
  const rn3 = document.querySelector('#row-shadow .setting-name');
  if (rn3) rn3.textContent = t('rowShadow');
  const rd3 = document.querySelector('#row-shadow .setting-desc');
  if (rd3) rd3.textContent = t('descShadow');
  const rl = document.querySelector('#row-lang .setting-name');
  if (rl) rl.textContent = t('rowLang');
  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active-lang', btn.dataset.lang === currentLang);
  });
  // Palette
  if (typeof Palette !== 'undefined' && Palette.applyLang) Palette.applyLang();
  // Help
  const btnHelp = document.getElementById('btn-help');
  if (btnHelp) btnHelp.title = t('btnHelp');
  const htitle = document.getElementById('help-title');
  if (htitle) htitle.textContent = t('helpTitle');
  document.querySelectorAll('#help-popup [data-i18n]').forEach(el => {
    el.innerHTML = t(el.dataset.i18n);
  });
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const R      = 3;
const SQ3    = Math.sqrt(3);
const PAL_G  = 8;
const CR     = 0.79;
const H_MAX  = 60;
const T_RNG  = [1, 24];

const HL = new Set([0,3,4,8,9,14,15,21,22,27,28,32,33,36]);
const SP = new Set([15,21]);

// ── PLATEAU ───────────────────────────────────────────────────────────────────
const CELLS = (() => {
  const a=[]; let id=0;
  for (let q=-R; q<=R; q++)
    for (let r=Math.max(-R,-q-R); r<=Math.min(R,-q+R); r++)
      a.push({q,r,id:id++});
  return a;
})();

const LABELS = (() => {
  const m={}, cols=Array.from({length:7},()=>[]);
  for (const c of CELLS) cols[c.q+R].push(c);
  for (let qi=0; qi<7; qi++) {
    cols[qi].sort((a,b)=>b.r-a.r);
    cols[qi].forEach((c,i)=>{ m[c.id]='ABCDEFG'[qi]+(i+1); });
  }
  return m;
})();
const L2ID = Object.fromEntries(Object.entries(LABELS).map(([id,l])=>[l,+id]));

// ── ENCODE/DECODE ─────────────────────────────────────────────────────────────
const enc = ({tokens}) =>
  tokens.map(t=>`${LABELS[t.cell]??t.cell}:${t.name}:${t.c}`).join(',');

function dec(raw) {
  if (raw.startsWith('état|')) raw=raw.slice(5);
  const [ts]=raw.split('|');
  const tokens=(ts?ts.split(','):[]).flatMap(p=>{
    const [ref,name,c]=p.split(':');
    const cell=L2ID[ref]??+ref;
    return (!ref||!name||!c||isNaN(cell))?[]:[{cell,name,c}];
  });
  return {tokens};
}

// ── ÉTAT ──────────────────────────────────────────────────────────────────────
const mkState = () => ({
  tokens: [{id:0,cell:21,name:'1',c:'b'},{id:1,cell:15,name:'2',c:'w'}],
  palette: {
    lancement: Array.from({length:19}, (_,i) => String(i+1)),
    vermillon: Array.from({length:5},  (_,i) => String(i+20)),
    other:     [],
  },
  nid: 2,
  arrows: [],
  arrowNid: 0,
  banned: [],
});
let S = mkState();

// ── PALETTE HELPERS ───────────────────────────────────────────────────────────
const ALL_NAMES = Array.from({length:T_RNG[1]-T_RNG[0]+1},(_,i)=>String(i+T_RNG[0]));

function _palGroupOf(name) {
  const n = +name;
  if (n >= 1  && n <= 19) return 'lancement';
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


let hist=[], hidx=-1;
const _snapS = () => { const {arrows,arrowNid,...rest}=S; return JSON.stringify(rest); };
const saveH = () => {
  const snap = _snapS();
  if (hidx >= 0 && hist[hidx] === snap) return;
  hist=hist.slice(0,hidx+1); hist.push(snap);
  if(++hidx, hist.length>H_MAX){hist.shift();hidx--;}
};
const restH = e => {
  const {arrows,arrowNid}=S;
  const restored = JSON.parse(e);
  if (!restored.banned) restored.banned = [];
  S={...restored,arrows,arrowNid};
  Arrows.clearSelected(); render();
};
const undo  = () => hidx>0             && restH(hist[--hidx]);
const redo  = () => hidx<hist.length-1 && restH(hist[++hidx]);

// ── LAYOUT ────────────────────────────────────────────────────────────────────
let LO = {};

function relayout() {
  const main = document.getElementById('main');
  const W = main.clientWidth  || 800;
  const H = main.clientHeight || 560;

  const BOARD_COLS = (2*R+1)*1.5+0.5;
  const BOARD_ROWS = (2*R+1.5)*SQ3;

  const sp = Math.min(W / BOARD_COLS, H / BOARD_ROWS) * 0.90;
  const r  = sp * CR;

  const { palX, palY, palW, palH, palCols } = Palette.layout(W, H, r);

  // Board is always centered on the full screen width
  const cx = W / 2;
  const cy = H / 2;

  const cells = CELLS.map(c => ({
    ...c,
    x: cx + sp * 1.5 * c.q,
    y: cy + sp * (SQ3/2 * c.q + SQ3 * c.r)
  }));
  const byId = new Map(cells.map(c => [c.id, c]));
  const hs   = Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + r * 1.6;
  const psz  = r * 2;
  const bW   = W;

  LO = { W, H, bW, r, cx, cy, cells, byId, hs,
         psz, pgap: PAL_G, palW, palH, palX, palY, palCols };

  // Board layer
  const boardLayer = document.getElementById('board-layer');
  if (boardLayer) {
    const bw = hs * Math.sqrt(3);
    const bh = hs * 2;
    boardLayer.style.left   = (cx - bw/2) + 'px';
    boardLayer.style.top    = (cy - bh/2) + 'px';
    boardLayer.style.width  = bw + 'px';
    boardLayer.style.height = bh + 'px';
    _updateBoardClip(boardLayer, bw, bh, hs);
  }

  // SVG flèches
  const arrowsSvg = document.getElementById('arrows-svg');
  if (arrowsSvg) {
    arrowsSvg.setAttribute('width',  W);
    arrowsSvg.setAttribute('height', H);
    arrowsSvg.style.width  = W + 'px';
    arrowsSvg.style.height = H + 'px';
  }
  // SVG outlines
  const outlinesSvg = document.getElementById('outlines-svg');
  if (outlinesSvg) {
    outlinesSvg.setAttribute('width',  W);
    outlinesSvg.setAttribute('height', H);
    outlinesSvg.style.width  = W + 'px';
    outlinesSvg.style.height = H + 'px';
  }
  if (typeof Outlines !== 'undefined') Outlines.syncSize(W, H);
}

function _updateBoardClip(el, bw, bh, hs) {
  const pts = Array.from({length:6}, (_,i) => {
    const a = Math.PI/3*i + Math.PI/6;
    const px = 50 + (hs * Math.cos(a)) / bw * 100;
    const py = 50 + (hs * Math.sin(a)) / bh * 100;
    return `${px.toFixed(3)}% ${py.toFixed(3)}%`;
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

function nearCell(x,y) {
  let best=null, bd=Infinity;
  for (const c of LO.cells) {
    const d=Math.hypot(c.x-x,c.y-y);
    if (d<LO.r*1.3 && d<bd) { bd=d; best=c; }
  }
  return best;
}

function tokAt(x,y) {
  for (let i=S.tokens.length-1; i>=0; i--) {
    const t=S.tokens[i], c=LO.byId.get(t.cell);
    if (c && Math.hypot(x-c.x,y-c.y)<LO.r*0.9) return t;
  }
  return null;
}

const inPalette = (x, y) => Palette.inPalette(x, y);
const palAt     = (x, y) => Palette.palAt(x, y);

// ── PALETTE CLICK HELPERS ─────────────────────────────────────────────────────
function _nearestFreeCell() {
  // Find free cell closest to board center
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
  // Place token on nearest free cell, default black
  const cell = _nearestFreeCell();
  if (!cell) return;
  S.tokens = [...S.tokens, {id: S.nid++, cell: cell.id, name, c: 'b'}];
  _palRemove(name);
  saveH(); render();
}

function _palRemoveOne(name) {
  // Remove the last token of this name placed on board
  const tokens = S.tokens.filter(t => t.name === name);
  if (tokens.length === 0) return;
  const last = tokens[tokens.length - 1];
  S.tokens = S.tokens.filter(t => t.id !== last.id);
  _palAdd(name);
  saveH(); render();
}


let drag=null, dpos=null, justDropped=false;
let palClickName=null; // tracks palette item for left-click recruit
let mousePos={x:0,y:0};

// ── Token toolbar ─────────────────────────────────────────────────────────────
let tokTb = null;
let tokTbId = null; // token id currently shown

function _mkTokToolbar() {
  if (tokTb) return tokTb;
  const el = document.createElement('div');
  el.id = 'tok-tb';
  el.innerHTML = `
    <button id="tok-color" title="Changer d'équipe"><span id="tok-dot"></span></button>
    <div class="arr-sep"></div>
    <button id="tok-del" class="arr-del" title="Supprimer">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
      </svg>
    </button>`;
  document.getElementById('main').appendChild(el);
  el.addEventListener('mousedown', e => e.stopPropagation());

  el.querySelector('#tok-color').addEventListener('click', e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    S.tokens = S.tokens.map(t => t.id === tokTbId ? {...t, c: t.c === 'w' ? 'b' : 'w'} : t);
    saveH(); render();
  });
  el.querySelector('#tok-del').addEventListener('click', e => {
    e.stopPropagation();
    if (tokTbId === null) return;
    const tok = S.tokens.find(t => t.id === tokTbId);
    if (tok) _palAdd(tok.name);
    S.tokens = S.tokens.filter(t => t.id !== tokTbId);
    tokTbId = null; _hideTokToolbar(); saveH(); render();
  });

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
  // Update dot color to show current team
  const dot = el.querySelector('#tok-dot');
  if (tok.c === 'w') {
    dot.style.background = '#ffffff';
    dot.style.borderColor = 'rgba(255,255,255,0.4)';
  } else {
    dot.style.background = '#111111';
    dot.style.borderColor = 'rgba(255,255,255,0.15)';
  }
  el.style.display = 'flex';

  requestAnimationFrame(() => {
    const pw = el.offsetWidth, ph = el.offsetHeight;
    let px = cell.x + LO.r + 10;
    let py = cell.y - ph / 2;
    px = Math.max(4, Math.min(LO.bW - pw - 4, px));
    py = Math.max(4, Math.min(LO.H  - ph - 4, py));
    el.style.left = px + 'px';
    el.style.top  = py + 'px';
  });
}

function _hideTokToolbar() { if (tokTb) tokTb.style.display = 'none'; }

// ── Right-click intent detection ──────────────────────────────────────────────
let _rcPending = null; // { x, y, tok } — right-click down on a token, waiting to decide

function _rcCancel() { _rcPending = null; }

function _rcCommitArrow(x, y) {
  if (!_rcPending) return;
  tokTbId = null; _hideTokToolbar();
  const fakeE = { button: 2, preventDefault: () => {} };
  Arrows.onDown(fakeE, _rcPending.x, _rcPending.y);
  _rcPending = null;
}

function onDown(e) {
  const {x,y} = _mainXY(e);
  const inP = inPalette(x,y);

  if (e.button===2) {
    e.preventDefault();
    if (inP) {
      const n = palAt(x, y);
      if (n) _palRecruitOne(n);
      return;
    }
    // On a token? → defer decision until mouseup or move
    const tok = tokAt(x, y);
    if (tok) {
      Arrows.clearSelected();
      _rcPending = { x, y, tokId: tok.id };
      return;
    }
    // On empty board → close token toolbar + immediate arrow
    tokTbId = null; _hideTokToolbar();
    Arrows.onDown(e, x, y);
    return;
  }

  if (e.button===1) {
    e.preventDefault();
    if (!inP) {
      const t=tokAt(x,y);
      if (t) toggleC(t.id);
    } else {
      const n=palAt(x,y);
      if (n) {
        if (isBanned(n)) doUnban(n);
        else doBan(n);
      }
    }
    return;
  }

  if (e.button!==0) return;

  // Left click: hide token toolbar if clicking elsewhere
  if (!inP) {
    const tok = tokAt(x, y);
    if (!tok || tok.id !== tokTbId) { tokTbId = null; _hideTokToolbar(); }
  }

  if (inP) {
    const n=palAt(x,y);
    if (n) { palClickName=n; drag={type:'pal',name:n,c:'b',_startX:x,_startY:y}; dpos={x,y}; render(); }
    return;
  }

  const consumed=Arrows.onDown(e,x,y);
  if (consumed) return;
  const t=tokAt(x,y);
  if (t) {
    tokTbId = null; _hideTokToolbar();
    drag={type:'brd',id:t.id,_startX:x,_startY:y}; dpos={x,y}; render();
  }
}

function onMove(e) {
  const {x,y}=_mainXY(e);
  mousePos={x,y};

  // If right-click pending on a token and mouse moved enough → start arrow
  if (_rcPending) {
    const moved = Math.hypot(x - _rcPending.x, y - _rcPending.y);
    if (moved > 6) {
      _rcCommitArrow(x, y);
    }
  }

  const arrowConsumed=Arrows.onMove(x,y);
  if (arrowConsumed) return;

  if (drag) { dpos={x,y}; render(); }
  _updateCursor(x,y);
}

function onUp(e) {
  const {x,y}=_mainXY(e);

  // Right-click up: if pending (no significant move) → show token toolbar
  if (e.button === 2 && _rcPending) {
    const moved = Math.hypot(x - _rcPending.x, y - _rcPending.y);
    if (moved <= 6) {
      tokTbId = _rcPending.tokId;
      _rcPending = null;
      _placeTokToolbar();
      render();
      return;
    }
    _rcPending = null;
  }

  if (Arrows.onUp(e,x,y)) return;
  if (!drag || e.button!==0) return;

  const cell=nearCell(x,y), inP=inPalette(x,y);

  if (drag.type==='brd') {
    const tok=S.tokens.find(t=>t.id===drag.id);
    if (tok) {
      if (inP) {
        S.tokens=S.tokens.filter(t=>t.id!==drag.id);
        _palAdd(tok.name); saveH();
      } else if (cell) {
        const other=S.tokens.find(t=>t.cell===cell.id&&t.id!==drag.id);
        if (other) {
          const fromCell=tok.cell;
          S.tokens=S.tokens.map(t=>t.id===drag.id?{...t,cell:cell.id}:t.id===other.id?{...t,cell:fromCell}:t);
        } else {
          S.tokens=S.tokens.map(t=>t.id===drag.id?{...t,cell:cell.id}:t);
        }
        saveH();
      }
    }
  } else if (drag.type==='pal') {
    const startX = drag._startX ?? x, startY = drag._startY ?? y;
    const moved = Math.hypot(x - startX, y - startY);
    if (moved >= 6 && !inP && cell && !S.tokens.find(t=>t.cell===cell.id)) {
      S.tokens=[...S.tokens,{id:S.nid++,cell:cell.id,name:drag.name,c:drag.c}];
      _palRemove(drag.name); saveH();
    }
    // Simple click (no significant move) → do nothing
  }

  palClickName=null; drag=null; dpos=null; justDropped=true; render();
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function toggleC(id) { S.tokens=S.tokens.map(t=>t.id===id?{...t,c:t.c==='w'?'b':'w'}:t); saveH(); render(); }
function doClearArrows() { S.arrows=[]; S.arrowNid=0; Arrows.resetState(); saveH(); render(); }
function doReset() {
  S=mkState(); hist=[]; hidx=-1;
  Arrows.resetState(); saveH(); render();
}
function doLoad() {
  const raw=document.getElementById('input-state').value.trim(); if(!raw) return;
  const{tokens}=dec(raw); const used=new Set(tokens.map(t=>t.name));
  const palette={lancement:[],vermillon:[],other:[]};
  for (const n of ALL_NAMES) { if(!used.has(n)) palette[_palGroupOf(n)].push(n); }
  S={tokens:tokens.map((t,i)=>({...t,id:i})),palette,nid:tokens.length,arrows:[],arrowNid:0};
  Arrows.clearSelected(); saveH(); render();
}
function doCopy() {
  navigator.clipboard.writeText(enc(S)).then(()=>{
    const b = document.getElementById('btn-copy');
    if (b._copyTimer) clearTimeout(b._copyTimer);
    const originalHTML = b.innerHTML;
    b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    b._copyTimer = setTimeout(() => {
      b.innerHTML = originalHTML;
      b.style.color = '';
      b.style.borderColor = '';
      b._copyTimer = null;
    }, 1000);
  });
}

// ── HTML LAYERS ───────────────────────────────────────────────────────────────

function _syncTokenLayer() {
  const layer=document.getElementById('tokens-layer');
  if (!layer) return;
  const {r,byId}=LO;
  const d=r*2;

  const existing=new Map();
  for (const el of layer.children) existing.set(+el.dataset.tid, el);

  const seen=new Set();
  for (const t of S.tokens) {
    if (drag?.type==='brd' && drag.id===t.id && _dragMoved()) continue;
    const cell=byId.get(t.cell); if (!cell) continue;
    seen.add(t.id);

    let el=existing.get(t.id);
    if (!el) {
      el=document.createElement('div');
      el.className='html-token';
      el.dataset.tid=t.id;
      const img=document.createElement('img');
      img.draggable=false;
      el.appendChild(img);
      layer.appendChild(el);
    }

    const color=t.c==='w'?'blanc':'noir';
    const img=el.querySelector('img');
    const expectedSrc=`jetons_${color}/${t.name}.png`;
    if (!img.src.endsWith(expectedSrc)) img.src=expectedSrc;

    el.style.left  =(cell.x-d/2)+'px';
    el.style.top   =(cell.y-d/2)+'px';
    el.style.width =d+'px';
    el.style.height=d+'px';
    el.style.overflow = 'visible';
    el.style.boxShadow = showShadow
      ? `${r*0.05}px ${r*0.07}px ${r*0.15}px rgba(0,0,0,0.6)` : 'none';
    el.style.outline = 'none';
    el.querySelector('img').style.boxShadow = 'none';

    // Remove any stale ban overlay (ban is palette-only now)
    const banOverlay = el.querySelector('.html-token-ban');
    if (banOverlay) banOverlay.remove();
  }
  for (const [tid,el] of existing) { if (!seen.has(tid)) el.remove(); }
}

function _syncLabelLayer() {
  const layer=document.getElementById('labels-layer');
  if (!layer) return;
  const {r,cells}=LO;
  const occ=new Set(S.tokens.map(t=>t.cell));
  const dcell=drag?.type==='brd'?S.tokens.find(t=>t.id===drag.id)?.cell:-1;
  const fs=Math.max(7,Math.round(r*0.36));

  layer.innerHTML='';
  if (!showLabels) return;

  const numColors=['#ff3f3f','#31be60','#4c99ff','#ff73c2','rgb(215,160,65)','#12aaaa','#a938ff'];
  for (const c of cells) {
    if (occ.has(c.id) && c.id!==dcell) continue;
    const lbl=LABELS[c.id]??''; if (!lbl) continue;
    const letter=lbl[0]??'', num=lbl.slice(1);
    const numCol=numColors[(+num-1)%numColors.length]??'rgba(60,60,120,0.85)';
    const div=document.createElement('div');
    div.className='html-label';
    div.style.cssText=`left:${c.x}px;top:${c.y}px;font-size:${fs}px;`;
    div.innerHTML=`<span style="color:rgb(168,164,148)">${letter}</span><span style="color:${numCol}">${num}</span>`;
    layer.appendChild(div);
  }
}

function _dragMoved() {
  if (!drag || !dpos) return false;
  const startX = drag._startX ?? dpos.x;
  const startY = drag._startY ?? dpos.y;
  return Math.hypot(dpos.x - startX, dpos.y - startY) >= 6;
}

function _syncDropTarget() {
  const layer=document.getElementById('droptarget-layer');
  if (!layer) return;
  layer.innerHTML='';
  if (!drag||!dpos||!_dragMoved()) return;
  const dtgt=nearCell(dpos.x,dpos.y); if (!dtgt) return;
  const {r}=LO;
  const div=document.createElement('div');
  div.className='html-droptarget';
  div.style.cssText=`left:${dtgt.x-r}px;top:${dtgt.y-r}px;width:${r*2}px;height:${r*2}px;`;
  layer.appendChild(div);
}

function _syncGhost() {
  let ghost=document.getElementById('drag-ghost');
  if (!drag||!dpos||!_dragMoved()) {
    if (ghost) ghost.style.display='none';
    return;
  }
  const t=drag.type==='brd'?S.tokens.find(t=>t.id===drag.id):{name:drag.name,c:drag.c};
  if (!t) { if(ghost) ghost.style.display='none'; return; }

  if (!ghost) {
    ghost=document.createElement('div');
    ghost.id='drag-ghost';
    ghost.className='html-token';
    const img=document.createElement('img'); img.draggable=false;
    ghost.appendChild(img);
    document.getElementById('main').appendChild(ghost);
  }

  const r=drag.type==='brd'?LO.r:LO.psz/2*0.90;
  const d=r*2;
  const color=t.c==='w'?'blanc':'noir';
  const img=ghost.querySelector('img');
  const expectedSrc=`jetons_${color}/${t.name}.png`;
  if (!img.src.endsWith(expectedSrc)) img.src=expectedSrc;

  ghost.style.display ='block';
  ghost.style.left    =(dpos.x-r)+'px';
  ghost.style.top     =(dpos.y-r)+'px';
  ghost.style.width   =d+'px';
  ghost.style.height  =d+'px';
  ghost.style.opacity ='1';
  ghost.style.boxShadow=showShadow?`2px 3px 8px rgba(0,0,0,0.5)`:'none';
}

// ── CURSEUR ───────────────────────────────────────────────────────────────────
function _updateCursor(x, y) {
  const main=document.getElementById('main');
  if (drag) { main.style.cursor='default'; return; }
  if (inPalette(x,y)) { main.style.cursor='default'; return; }
  if (Arrows.updateCursor(main, x, y)) return;
  if (tokAt(x,y)) { main.style.cursor='default'; return; }
  main.style.cursor='default';
}

// ── RENDU PRINCIPAL ───────────────────────────────────────────────────────────
function render() {
  history.replaceState(null, '', '#'+enc(S));
  _syncTokenLayer();
  _syncLabelLayer();
  _syncDropTarget();
  _syncGhost();
  Outlines.render();
  Arrows.render();
  Palette.syncDOM();
  if (tokTbId !== null) _placeTokToolbar();
}

// ── URL ───────────────────────────────────────────────────────────────────────
function loadStateFromURL() {
  const raw=window.location.hash.slice(1); if (!raw) return;
  const {tokens}=dec(raw);
  const used=new Set(tokens.map(t=>t.name));
  const palette={lancement:[],vermillon:[],other:[]};
  for (const n of ALL_NAMES) { if(!used.has(n)) palette[_palGroupOf(n)].push(n); }
  S={tokens:tokens.map((t,i)=>({...t,id:i})),palette,nid:tokens.length,arrows:[],arrowNid:0};
}

// ── TOUCH SUPPORT ─────────────────────────────────────────────────────────────
(function _initTouch() {
  const LONG_MS   = 400;   // durée pour simuler clic droit
  const MOVE_THR  = 8;     // pixels avant d'annuler le long-press

  let _touchId    = null;  // identifier du doigt actif
  let _longTimer  = null;
  let _longFired  = false; // long-press déjà déclenché ?
  let _startX     = 0;
  let _startY     = 0;
  let _isLong     = false;

  function _cancel() {
    clearTimeout(_longTimer);
    _longTimer = null;
  }

  function _fakeEvent(type, x, y, button) {
    // Construit un objet mouse-like à partir des coordonnées touch
    return {
      button,
      clientX: x,
      clientY: y,
      preventDefault: () => {},
      stopPropagation: () => {},
      _isFake: true,
    };
  }

  document.getElementById('main').addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { _cancel(); return; }
    e.preventDefault();
    const t  = e.touches[0];
    _touchId  = t.identifier;
    _startX   = t.clientX;
    _startY   = t.clientY;
    _isLong   = false;
    _longFired= false;

    const inP = inPalette(_startX - document.getElementById('main').getBoundingClientRect().left,
                          _startY - document.getElementById('main').getBoundingClientRect().top);

    // Sur la palette : pas de long-press, comportement direct au touchend
    if (inP) { _cancel(); return; }

    // Lance le timer long-press (= clic droit)
    _longTimer = setTimeout(() => {
      _isLong    = true;
      _longFired = true;
      // Vibration haptic si dispo
      if (navigator.vibrate) navigator.vibrate(40);
      onDown(_fakeEvent('mousedown', _startX, _startY, 2));
    }, LONG_MS);

  }, { passive: false });

  document.getElementById('main').addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    const t = Array.from(e.touches).find(t => t.identifier === _touchId);
    if (!t) return;
    e.preventDefault();

    const dx = t.clientX - _startX;
    const dy = t.clientY - _startY;
    const dist = Math.hypot(dx, dy);

    // Si on bouge avant le long-press → annuler le timer (c'est un drag, pas un menu)
    if (!_isLong && dist > MOVE_THR) _cancel();

    onMove(_fakeEvent('mousemove', t.clientX, t.clientY, 0));
  }, { passive: false });

  document.getElementById('main').addEventListener('touchend', e => {
    e.preventDefault();
    const b  = document.getElementById('main').getBoundingClientRect();
    const lx = _startX, ly = _startY; // dernière position connue

    _cancel();

    if (_longFired) {
      // Long-press : simuler mouseup droit pour finaliser (flèche, etc.)
      onUp(_fakeEvent('mouseup', lx, ly, 2));
      _longFired = false;
      return;
    }

    if (_isLong) return;

    // Tap court = clic gauche
    const inP = inPalette(lx - b.left, ly - b.top);
    onDown(_fakeEvent('mousedown', lx, ly, 0));
    onUp  (_fakeEvent('mouseup',   lx, ly, 0));

  }, { passive: false });

  document.getElementById('main').addEventListener('touchcancel', e => {
    _cancel();
    _isLong = false;
  }, { passive: false });
})();

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  loadStateFromURL();

  const main=document.getElementById('main');

  main.addEventListener('mousedown',  onDown);
  main.addEventListener('mousemove',  e=>{ mousePos=_mainXY(e); onMove(e); });
  main.addEventListener('mouseup',    onUp);
  main.addEventListener('click',      ()=>{ if(justDropped) justDropped=false; });
  main.addEventListener('contextmenu',e=>e.preventDefault());
  main.addEventListener('mouseleave', ()=>{ drag=null; dpos=null; render(); });

  window.addEventListener('keydown', e=>{
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if ((e.ctrlKey||e.metaKey)&&e.key==='z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey||e.metaKey)&&e.key==='y') { e.preventDefault(); redo(); }
    if (e.key==='ArrowLeft')  undo();
    if (e.key==='ArrowRight') redo();
    if (e.key==='Escape') { tokTbId=null; _hideTokToolbar(); }
    Arrows.onKey(e);
  });

  document.getElementById('input-state').addEventListener('keydown', e=>{ if(e.key==='Enter') doLoad(); });
  document.getElementById('btn-copy'        ).addEventListener('click', doCopy);
  document.getElementById('btn-undo'        ).addEventListener('click', undo);
  document.getElementById('btn-redo'        ).addEventListener('click', redo);
  document.getElementById('btn-clear-arrows').addEventListener('click', doClearArrows);

  function _syncToggle(id, val) {
    const el=document.getElementById(id);
    el.classList.toggle('active',val);
    el.setAttribute('aria-checked',val);
  }
  function _openSettings() {
    _syncToggle('tog-labels',  showLabels);
    _syncToggle('tog-outline', showOutline);
    _syncToggle('tog-shadow',  showShadow);
    document.getElementById('settings-overlay').classList.remove('hidden');
  }
  function _closeSettings() {
    document.getElementById('settings-overlay').classList.add('hidden');
  }
  document.getElementById('btn-settings').addEventListener('click', _openSettings);
  document.getElementById('settings-close').addEventListener('click', _closeSettings);
  document.getElementById('settings-overlay').addEventListener('mousedown', e=>{
    if (e.target===document.getElementById('settings-overlay')) _closeSettings();
  });
  document.getElementById('row-labels').addEventListener('click', ()=>{
    showLabels=!showLabels; localStorage.setItem('leaders-labels', showLabels); _syncToggle('tog-labels',showLabels); render();
  });
  document.getElementById('row-outline').addEventListener('click', ()=>{
    showOutline=!showOutline; localStorage.setItem('leaders-outline', showOutline); _syncToggle('tog-outline',showOutline); render();
  });
  document.getElementById('row-shadow').addEventListener('click', ()=>{
    showShadow=!showShadow; localStorage.setItem('leaders-shadow', showShadow); _syncToggle('tog-shadow',showShadow); render();
  });

  //Help
  function _openHelp() { document.getElementById('help-overlay').classList.remove('hidden'); }
  function _closeHelp() { document.getElementById('help-overlay').classList.add('hidden'); }
  document.getElementById('btn-help').addEventListener('click', _openHelp);
  document.getElementById('help-close').addEventListener('click', _closeHelp);
  document.getElementById('help-overlay').addEventListener('mousedown', e => {
    if (e.target === document.getElementById('help-overlay')) _closeHelp();
  });

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('leaders-lang', currentLang);
      _applyLang();
      if (typeof Palette !== 'undefined' && Palette.applyLang) Palette.applyLang();
    });
  });

  Arrows.init();
  Outlines.init();
  Palette.init();
  _mkTokToolbar();

  new ResizeObserver(()=>{ relayout(); render(); }).observe(main);
  relayout(); saveH(); render(); _applyLang();
}

document.addEventListener('DOMContentLoaded', init);