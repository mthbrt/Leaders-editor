// ── PALETTE (HTML/CSS pure — zéro canvas) ─────────────────────────────────────
const Palette = (() => {

  const INNER   = 20;
  const PAL_G   = 8;

  const GROUPS = [
    { key: 'lancement',  labelKey: 'secLancement',  names: Array.from({length:17}, (_,i) => String(i+3))  },
    { key: 'vermillon',  labelKey: 'secVermillon',  names: Array.from({length:5},  (_,i) => String(i+20)) },
    { key: 'leaders',    labelKey: 'secLeaders',    names: ['1', '2', '25'] },
  ];

  let collapsed  = false;
  let panel      = null;
  let lastPsz    = 0;
  let isBottomSheet = false;

  // ── Pal token toolbar (même design que #tok-tb) ───────────────────────────
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
      if (typeof isBanned === 'function' && typeof doBan === 'function' && typeof doUnban === 'function') {
        isBanned(palTbName) ? doUnban(palTbName) : doBan(palTbName);
      }
      _hidePalToolbar();
    });
    palTb = el;
    return el;
  }

  function _updatePalToolbarLabel() {
    const label = palTb && palTb.querySelector('#pal-tok-ban-label');
    if (!label) return;
    const banned = typeof isBanned === 'function' ? isBanned(palTbName) : false;
    const lang   = typeof currentLang !== 'undefined' ? currentLang : 'en';
    label.textContent = banned
      ? (lang === 'fr' ? 'Débannir' : 'Unban')
      : (lang === 'fr' ? 'Bannir'    : 'Ban');
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

    const elW = el.offsetWidth;
    const elH = el.offsetHeight;
    const GAP = 10;
    const itemRect = itemEl.getBoundingClientRect();
    const itemCY   = itemRect.top + itemRect.height / 2;
    const vh = window.innerHeight;

    // Palette à droite → menu à gauche par défaut
    let x = itemRect.left - elW - GAP;
    let arrowSide = 'right';
    if (x < 8) { x = itemRect.right + GAP; arrowSide = 'left'; }

    let y = itemCY - elH / 2;
    y = Math.max(8, Math.min(y, vh - elH - 8));

    const arrowY = Math.max(14, Math.min(itemCY - y, elH - 14));
    el.style.setProperty('--arrow-y', arrowY + 'px');
    el.classList.add(arrowSide === 'right' ? 'pal-tb-arrow-right' : 'pal-tb-arrow-left');
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';

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
    if (typeof Tooltip !== 'undefined') Tooltip.hide();
  }

  function isPalTbOpen() { return palTbName !== null; }

  // ── Layout ─────────────────────────────────────────────────────────────────
  function isPortrait(W, H) { return H > W; }

  function layout(W, H, rEst) {
    if (isPortrait(W, H)) {
      const palH = Math.round(H / 2);
      return { palX: 0, palY: H - palH, palW: W, palH, palCols: 6, _bottomSheet: true };
    }
    const cols   = 3;
    const psz    = rEst * 2;
    const itemSz = Math.round(psz * 0.90);
    const palW   = INNER * 2 + cols * itemSz + PAL_G * (cols - 1) + 2;
    const palH   = H;
    const palX   = W - palW;
    const palY   = 0;
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

  function onMove(x, y) {
    // Figer les tooltips si le menu bannir est ouvert (comme tokTbId pour le plateau)
    if (palTbName !== null) return;
    const name = palAt(x, y);
    if (name) {
      const itemEl = panel && panel.querySelector(`.pal-item[data-name="${name}"]`);
      if (itemEl) {
        const r = itemEl.getBoundingClientRect();
        const itemR = r.width / 2;
        Tooltip.schedulePal(name, r.left + itemR, r.top + itemR, 'pal:' + name, itemR);
      }
    } else {
      Tooltip.hide();
    }
  }

  // ── Construction du DOM ───────────────────────────────────────────────────
  function _build() {
    const main = document.getElementById('main');

    panel = document.createElement('div');
    panel.id = 'pal-panel';
    panel.innerHTML = `
      <div id="pal-header">
        <span id="pal-title">PERSONNAGES</span>
      </div>
      <div id="pal-body"><div id="pal-sections"></div></div>
      <div id="pal-footer"><button id="pal-reset">Réinitialiser</button></div>`;
    main.appendChild(panel);

    _buildSections();

    panel.querySelector('#pal-header').addEventListener('click', e => {
      if (isBottomSheet) { e.stopPropagation(); _toggleCollapse(); }
    });
    panel.querySelector('#pal-reset').addEventListener('click', e => { e.stopPropagation(); doReset(); });
    panel.querySelector('#pal-reset').addEventListener('mousedown', e => e.stopPropagation());
    panel.querySelector('#pal-header').addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('mousedown', e => {
      const hdr = e.target.closest('.pal-sec-hdr');
      if (hdr) e.stopPropagation();
    });

    // Clic molette sur la palette → bannir/débannir
    panel.addEventListener('mousedown', e => {
      if (e.button !== 1) return;
      e.preventDefault(); e.stopPropagation();
      const item = e.target.closest('.pal-item');
      if (!item) return;
      const name = item.dataset.name;
      if (!name) return;
      if (typeof isBanned === 'function' && typeof doBan === 'function' && typeof doUnban === 'function') {
        isBanned(name) ? doUnban(name) : doBan(name);
      }
    });

    // Clic droit sur la palette → toolbar bannir.
    // Guard _longPressEndTime : Chrome Android émet un contextmenu natif juste
    // après le long-press JS, qui rouvrirait le menu déjà ouvert par openPalToolbar.
    panel.addEventListener('contextmenu', e => {
      e.preventDefault(); e.stopPropagation();
      if (Date.now() - _longPressEndTime < GHOST_TAP_MS) return;
      const item = e.target.closest('.pal-item');
      if (!item) return;
      const name = item.dataset.name;
      if (!name) return;
      Tooltip.hide();
      _placePalToolbar(name, item);
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
      const grid = document.createElement('div');
      grid.className = 'pal-grid open';

      if (gi === 0) {
        grid.style.paddingTop = INNER + 'px';
      } else {
        const hdr = document.createElement('div');
        hdr.className = 'pal-sec-hdr';
        hdr.innerHTML = '<span class="pal-sec-label">' + (typeof t === 'function' ? t(g.labelKey) : g.labelKey) + '</span>';
        sec.appendChild(hdr);
      }
      for (const name of g.names) grid.appendChild(_mkStandardItem(name));
      sec.appendChild(grid);
      container.appendChild(sec);
    }
  }

  function _mkStandardItem(name) {
    const item = document.createElement('div');
    const banned = (S.banned || []).includes(name);
    item.className = 'pal-item' + (banned ? ' pal-item-banned' : '');
    item.dataset.name = name;
    const count = S.tokens.filter(t => t.name === name).length;
    if (count > 0) item.classList.add('pal-item-on-board');
    const img = document.createElement('img');
    img.src = 'jetons_noir/' + name + '.png';
    img.alt = name;
    img.draggable = false;
    item.appendChild(img);
    if (count >= 2) {
      const badge = document.createElement('span');
      badge.className = 'pal-badge';
      badge.textContent = count;
      item.appendChild(badge);
    }
    if (banned) {
      const banOverlay = document.createElement('div');
      banOverlay.className = 'pal-item-ban-overlay';
      const banImg = document.createElement('img');
      banImg.src = 'ui/ban.png'; banImg.draggable = false;
      banOverlay.appendChild(banImg);
      item.appendChild(banOverlay);
    }
    return item;
  }

  function _applyItemSizes() {
    if (!panel) return;
    let sz;
    if (isBottomSheet) {
      sz = Math.round(LO.r * 2);
    } else {
      const { psz } = LO;
      if (!psz) return;
      sz = Math.round(psz * 0.90);
    }
    const szPx = sz + 'px';
    for (const item of panel.querySelectorAll('.pal-item')) {
      item.style.width     = szPx;
      item.style.height    = szPx;
      item.style.minWidth  = szPx;
      item.style.minHeight = szPx;
    }
  }

  function _toggleCollapse() { collapsed = !collapsed; _syncCollapsed(); }

  function _syncCollapsed() {
    panel.classList.toggle('collapsed', collapsed);
    if (typeof onCollapseChange === 'function') onCollapseChange();
    else syncDOM();
  }

  // ── Mise à jour du DOM après chaque render() ──────────────────────────────
  function syncDOM() {
    if (!panel) return;
    const { palX, palY, palW, palH, psz } = LO;
    const _bottomSheet = LO._palBottomSheet || LO._bottomSheet || false;

    const newBottomSheet = !!_bottomSheet;
    if (newBottomSheet !== isBottomSheet) {
      isBottomSheet = newBottomSheet;
      panel.classList.toggle('bottom-sheet', isBottomSheet);
      if (isBottomSheet) { collapsed = true; panel.classList.add('collapsed'); }
      else               { collapsed = false; panel.classList.remove('collapsed'); }
      lastPsz = 0;
    }
    panel.classList.toggle('collapsed', collapsed);
    panel.style.left   = palX + 'px';
    panel.style.top    = palY + 'px';
    panel.style.width  = palW + 'px';
    panel.style.height = palH + 'px';

    const effectivePsz = isBottomSheet ? (LO.r || 0) : (psz || 0);
    if (Math.abs(effectivePsz - lastPsz) > 0.5) {
      lastPsz = effectivePsz;
      _applyItemSizes();
    }

    _syncItems();
  }

  function _syncItems() {
    for (const item of panel.querySelectorAll('.pal-item[data-name]')) {
      const name = item.dataset.name;
      const banned = (S.banned || []).includes(name);
      item.classList.toggle('pal-item-banned', banned);
      const count = S.tokens.filter(t => t.name === name).length;
      const img   = item.querySelector('img');
      const expectedSrc = 'jetons_noir/' + name + '.png';
      if (!img.src.endsWith(expectedSrc)) img.src = expectedSrc;
      item.classList.toggle('pal-item-on-board', count > 0);
      let badge = item.querySelector('.pal-badge');
      if (count >= 2) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'pal-badge'; item.appendChild(badge); }
        badge.textContent = count;
      } else { if (badge) badge.remove(); }
      let banOverlay = item.querySelector('.pal-item-ban-overlay');
      if (banned) {
        if (!banOverlay) {
          banOverlay = document.createElement('div');
          banOverlay.className = 'pal-item-ban-overlay';
          const banImg = document.createElement('img'); banImg.src = 'ui/ban.png'; banImg.draggable = false;
          banOverlay.appendChild(banImg); item.appendChild(banOverlay);
        }
      } else { if (banOverlay) banOverlay.remove(); }
    }
  }

  function applyLang() {
    const title = panel && panel.querySelector('#pal-title');
    if (title && typeof t === 'function') title.textContent = t('palTitle');
    const reset = panel && panel.querySelector('#pal-reset');
    if (reset && typeof t === 'function') reset.textContent = t('palReset');
    panel && panel.querySelectorAll('.pal-sec-hdr').forEach((hdr, gi) => {
      const label = hdr.querySelector('.pal-sec-label');
      if (label && GROUPS[gi + 1] && typeof t === 'function') label.textContent = t(GROUPS[gi + 1].labelKey);
    });
  }

  function getScrollY()  { return 0; }
  function isCollapsed() { return collapsed; }
  function toggleCollapse() { _toggleCollapse(); }
  function init() { _build(); }

  let onCollapseChange = null;
  function setOnCollapseChange(fn) { onCollapseChange = fn; }

  return { layout, onMove, inPalette, palAt,
           syncDOM, isCollapsed, toggleCollapse, applyLang, init, setOnCollapseChange,
           isPalTbOpen, hidePalToolbar: _hidePalToolbar, openPalToolbar: _placePalToolbar };
})();