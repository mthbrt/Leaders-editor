// ── TOOLTIP ICONS ─────────────────────────────────────────────────────────────
// 3 types d'icônes SVG affichées dans le coin haut droit du tooltip.
// Personnalise le contenu SVG de chaque type ici.
const TOKEN_ICONS = {
  // Type A — actif
  'a': `<svg width="20" height="20" viewBox="0 0 320 320"><path d="M134.76,132.28v-67.16c0-1.91-2.44-2.71-3.57-1.17l-49.98,68.33v57.09s103.93,0,103.93,0v67.16c0,1.91,2.44,2.71,3.57,1.17l49.98-68.33v-57.09h-103.93Z" fill="#ef4e4b"/><path d="M160,16c38.46,0,74.63,14.98,101.82,42.18,27.2,27.2,42.18,63.36,42.18,101.82s-14.98,74.63-42.18,101.82c-27.2,27.2-63.36,42.18-101.82,42.18s-74.63-14.98-101.82-42.18c-27.2-27.2-42.18-63.36-42.18-101.82s14.98-74.63,42.18-101.82c27.2-27.2,63.36-42.18,101.82-42.18M160,0C71.63,0,0,71.63,0,160s71.63,160,160,160,160-71.63,160-160S248.37,0,160,0h0Z" fill="#ef4e4b"/></svg>`,

  // Type B — passif
  'b': `<svg width="20" height="20" viewBox="0 0 320 320"><path d="M100.65,88.87c4.62-.27,10.33-.26,14.97-.06,8.7.37,20.7,4.34,28.18,8.8,19.28,11.41,30.77,31.97,40.32,51.47,4.5,8.5,13.42,27.99,24.23,28.9,9.99.84,18.23-5.02,20.13-14.97,1.68-8.8-4.87-18.84-13.8-20.27-3.34-.53-4.92.34-7.36-2.59-6.65-12.21-12.86-24.67-21.14-35.93-2.02-2.84-8.02-7.44-2.9-10.06,4.81-2.65,15.43-5.11,20.93-5.35,28.78-2.86,57.76,13,70.72,38.92,3.79,7.57,5.77,15.15,6.89,23.52.42,3.14,1.2,7.42.96,10.48-.27,3.47-1.12,7.43-1.66,10.91-5.05,34.13-37.63,60.11-71.83,59.21-45.35-1.93-61.77-36.28-79.83-71.65-5.94-10.73-12.07-20.97-26.31-17.24-10.4,2.72-14.97,15.01-11.03,24.55,1.63,3.94,7.05,8.38,10.98,9.86s7.45-.79,10.07,4.2c5.81,11.07,11.36,22.16,18.74,32.32,1.4,1.93,5.97,6.79,6.3,8.71.29,1.67-.43,2.71-1.85,3.5-3.94,2.19-10.71,3.56-15.18,4.53-9.67,2.09-17.89,1.19-27.37-.79-31.09-5.71-55.15-33.83-56.7-65.31-.53-4.53.29-7.16.72-11.43.32-3.13.04-6.24.81-9.33.36-1.43,1.07-2.74,1.5-4.14.58-1.88.8-3.97,1.55-5.77,9.7-24.07,32.95-42.55,58.99-45Z" fill="#21bbc5"/><path d="M160,16c38.46,0,74.63,14.98,101.82,42.18,27.2,27.2,42.18,63.36,42.18,101.82s-14.98,74.63-42.18,101.82c-27.2,27.2-63.36,42.18-101.82,42.18s-74.63-14.98-101.82-42.18c-27.2-27.2-42.18-63.36-42.18-101.82s14.98-74.63,42.18-101.82c27.2-27.2,63.36-42.18,101.82-42.18M160,0C71.63,0,0,71.63,0,160s71.63,160,160,160,160-71.63,160-160S248.37,0,160,0h0Z" fill="#21bbc5"/></svg>`,

  // Type C — special
  'c': `<svg id="c" width="20" height="20" viewBox="0 0 320 320"><path d="M158.72,42.36c3.11-.58,4.86.55,6.84,2.67,5.87,6.25,11.5,14.51,16.94,21.29,4.29,5.35,8.9,10.48,13.03,15.96,1.39,1.84,2.46,2.92,2.18,5.43-.22,2.02-3.59,6.95-4.69,9.08-1.96,3.8-3.94,7.76-5.77,11.63-.93,1.97-2.66,4.92-.87,6.75,1.27,1.3,5.93,4.45,7.65,5.58,1.23.81,2.17,1.33,3.68.85s5.76-4.87,7.16-6.25c3.73-3.68,7.71-8.57,11.69-11.87,3.73-3.09,7.16-.46,10.84.94,11.59,4.4,23.2,8.8,34.77,13.24,4.61,1.77,11.83,2.84,11.08,9.35-.37,3.25-7.75,12.86-9.91,16.18-3.79,5.82-7.53,11.65-11.34,17.46-2.1,3.19-4.01,6.77-6.3,9.83-1.74,2.33-2.92,3.64-6.04,3.38-8.04-.68-16.57-3.05-24.64-3.99-3.72-.5-3.74,2.84-4.62,5.36-1.18,3.39-4.01,7.71-.13,10.27,6.99,4.21,15.87,7.26,22.69,11.92,3.7,2.66,1.6,8.81,1.35,12.59-.18,2.77.2,5.76,0,8.52-.12,1.68-.63,3.37-.73,5.07-.16,2.67.16,5.5.02,8.17-.08,1.4-.48,2.94-.56,4.33-.32,5.59-.14,10.98-.74,16.65-.18,1.71-.9,2.88-2.27,3.89-3.26,2.39-4.97.96-8.28.19-13.47-3.11-26.97-7.08-40.3-10.8-3.86-1.07-8.19-.99-9.41-5.81-1.89-7.91-1.92-17.4-4.09-25.27-1.38-3.61-5.42-1.77-8.2-1.75s-6.86-1.56-7.83,2.3c-1.9,7.82-2.32,17.15-3.94,24.86-1.33,5-5.23,4.61-9.33,5.7-13.38,3.56-26.66,7.84-40.19,10.91-3.46.78-5.95,2.02-8.92-1.11-2.68-2.83-1.77-11.61-1.98-15.42-.08-1.4-.48-2.94-.56-4.33-.15-2.67.13-5.49.02-8.17-.11-2.47-.62-4.95-.74-7.41s.18-5.26,0-7.8c-.28-4.06-1.35-8.52-.5-12.64.72-3.46,5.51-4.84,8.3-6.38,4.16-2.29,8.3-4.52,12.52-6.69,2.29-1.18,5.99-2.13,5.58-5.44-.18-1.51-1.82-6.04-2.39-7.75-1.36-4.08-2.29-4.27-6.51-3.71-7.7,1.01-15.35,2.77-23.07,3.75-3.13.12-4.62-2.22-6.21-4.47-2.37-3.34-4.34-7.02-6.59-10.44-5.68-8.66-11.92-17.38-17.29-26.19-2.4-3.94-5.38-8.42-.13-11.77,3.54-2.26,9.94-3.93,14.06-5.51,10.43-4.01,20.82-8.34,31.34-12.15,3.8-1.38,5.74-2.26,9.11.6,5.93,5.03,10.39,12.04,16.4,16.94,1.53,1.25,2.45,1.59,4.29.66,2.55-1.29,5.37-4.19,8.02-5.57.92-.78,1.54-1.4,1.47-2.7-.06-1.11-1.64-4.23-2.2-5.42-3.06-6.45-6.58-12.7-9.66-19.14-.94-2.56.11-3.77,1.54-5.7,9.66-12.95,20.87-25.13,30.62-38.05.89-1.02,2.38-2.34,3.75-2.59ZM156.92,135.32c-3.93.37-9.64,3.12-12.73,5.57-8.4,6.63-11.83,18.97-7.79,28.98,7.62,18.91,32.89,22.2,44.73,5.42,12.95-18.35-2.27-42.02-24.21-39.97Z" fill="#70bf56"/><path d="M160,16c38.46,0,74.63,14.98,101.82,42.18,27.2,27.2,42.18,63.36,42.18,101.82s-14.98,74.63-42.18,101.82c-27.2,27.2-63.36,42.18-101.82,42.18s-74.63-14.98-101.82-42.18c-27.2-27.2-42.18-63.36-42.18-101.82s14.98-74.63,42.18-101.82c27.2-27.2,63.36-42.18,101.82-42.18M160,0C71.63,0,0,71.63,0,160s71.63,160,160,160,160-71.63,160-160S248.37,0,160,0h0Z" fill="#70bf56"/></svg>`,

  // Type A — leader
  'd': `<svg width="20" height="20" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><circle cx="160" cy="160" r="140" fill="none" stroke="#f5a623" stroke-width="20"/><path fill="#f5a623" d="M80 220v-80h40v40h20v-80h40v80h20v-40h40v80Z"/></svg>`
};

// ── TOOLTIP DATA ──────────────────────────────────────────────────────────────
// Remplis les champs "name", "type" et "ability" pour chaque jeton.
// "name" sera affiché en titre, "type" détermine l'icône (a/b/c ou absent),
// "ability" comme description.
const TOKEN_DATA_EN = {
  '1':  { name: 'Leader King', type: 'd', ability: '' },
  '2':  { name: 'Leader Queen', type: 'd', ability: '' },
  '3':  { name: 'Acrobat',   type: 'a', ability: 'Jumps in a straight line over an adjacent character. MAY jump twice consecutively.' },
  '4':  { name: 'Archer',    type: 'b', ability: "Helps Capture the opponent's Leader from two spaces away in a straight line, even if they're not visible. Cannot help capture if adjacent." },
  '5':  { name: 'Assassin',  type: 'b', ability: "Captures the opponent's Leader, even without help from an ally." },
  '6':  { name: 'Rider',     type: 'a', ability: 'Moves two spaces in a straight line.' },
  '7':  { name: 'Bruiser',   type: 'a', ability: "Moves to an adjacent enemy's space, pushing them to one of the opposite three spaces of your choice." },
  '8':  { name: 'Royal Guard', type: 'a', ability: 'Moves to a space adjacent to your Leader. May then move one additional space.' },
  '9':  { name: 'Jailer',    type: 'b', ability: 'Adjacent enemies cannot use their active abilities.' },
  '10': { name: 'Illusionist', type: 'a', ability: 'Switches places with a non-adjacent, visible character in a straight line.' },
  '11': { name: 'Claw',      type: 'a', ability: 'Moves in a straight line all the way to a visible character, OR drags them until they are adjacent.' },
  '12': { name: 'Manipulator', type: 'a', ability: 'Moves a non-adjacent enemy, visible and in a straight line, by one space.' },
  '13': { name: 'Nemesis',   type: 'c', ability: "Cannot move during their action phase. If the opponent's Leader moves, the Nemesis MUST move two spaces and end on a new space." },
  '14': { name: 'Protector', type: 'b', ability: 'Enemy abilities may not move the Protector or any adjacent allies.' },
  '15': { name: 'Wanderer',  type: 'a', ability: 'Moves to any space non-adjacent to an enemy.' },
  '16': { name: 'Brewmaster', type: 'a', ability: 'Moves an adjacent ally one space.' },
  '17': { name: 'Hermit',    type: 'c', ability: "Recruit both the Hermit and Cub. You can move either, or both consecutively. The Cub cannot help capture the opponent's Leader." },
  '18': { name: 'Cub',       type: 'c', ability: "Recruit both the Hermit and Cub. You can move either, or both consecutively. The Cub cannot help capture the opponent's Leader." },
  '19': { name: 'Vizier',    type: 'b', ability: 'Your Leader MAY move one additional space during their action.' },
  '20': { name: 'Wisp',      type: 'c', ability: 'Moves to any empty space on the board. Does not participate in capturing the opposing Leader.' },
  '21': { name: 'Shaman',    type: 'a', ability: 'Transforms a visible non-Leader Character in a straight line into a Frog until the end of the opposing turn.' },
  '22': { name: 'Frog',      type: 'c', ability: 'Moves up to two spaces. Can pass through a space occupied by a Character. Does not participate in capturing the opposing Leader.' },
  '23': { name: 'Sniper',    type: 'b', ability: 'At the start of your turn, captures the opposing Leader, even without any other allied participant, if they are at a distance of three spaces or more in a straight line, even if not visible.' },
  '24': { name: 'Tactician', type: 'a', ability: 'If an ally is adjacent to the opposing Leader: move one non-Leader ally by one space, that ally can no longer use its active ability this turn.' },
  '25': { name: 'Leader Vermilion', type: 'd', ability: '' },
};

const TOKEN_DATA_FR = {
  '1':  { name: 'Leader Roi',       type: 'd', ability: '' },
  '2':  { name: 'Leader Reine',     type: 'd', ability: '' },
  '3':  { name: 'Acrobate',         type: 'a', ability: 'Saute en ligne droite par-dessus un Personnage adjacent. PEUT effectuer jusqu’à deux sauts consécutifs.' },
  '4':  { name: 'Archère',          type: 'b', ability: 'Participe à la Capture du Leader adverse uniquement à une distance de deux cases en ligne droite, même s’il n’est pas visible.' },
  '5':  { name: 'Assassin',         type: 'b', ability: 'Capture le Leader adverse, même sans autre allié participant.' },
  '6':  { name: 'Cavalier',         type: 'a', ability: 'Se déplace de deux cases en ligne droite.' },
  '7':  { name: 'Cogneur',          type: 'a', ability: 'Se déplace sur la case d’un ennemi adjacent et le pousse sur l’une des trois cases opposées de votre choix.' },
  '8':  { name: 'Garde Royal',      type: 'a', ability: 'Se déplace sur une case adjacente à votre Leader, puis PEUT se déplacer d’une case.' },
  '9':  { name: 'Geôlier',          type: 'b', ability: 'Les ennemis adjacents ne peuvent pas utiliser leur compétence active.' },
  '10': { name: 'Illusionniste',    type: 'a', ability: 'Échange de position avec un Personnage visible en ligne droite et non-adjacent.' },
  '11': { name: 'Lance-Grappin',    type: 'a', ability: 'Se déplace jusqu’à un Personnage visible en ligne droite OU l’attire jusqu’à lui.' },
  '12': { name: 'Manipulatrice',    type: 'a', ability: 'Déplace d’une case un ennemi visible en ligne droite et non-adjacent.' },
  '13': { name: 'Némésis',          type: 'c', ability: 'Ne peut pas faire d’actions. Dès que le Leader adverse est déplacé, la Némésis DOIT se déplacer de deux cases. La case d’arrivée doit être différente de la case de départ.' },
  '14': { name: 'Protecteur',       type: 'b', ability: 'Les compétences des ennemis ne peuvent déplacer ni le Protecteur, ni ses alliés adjacents.' },
  '15': { name: 'Rôdeuse',          type: 'a', ability: 'Se déplace sur n’importe quelle case non-adjacente à un ennemi.' },
  '16': { name: 'Tavernier',        type: 'a', ability: 'Déplace d’une case un allié adjacent.' },
  '17': { name: 'Vieil ours',       type: 'c', ability: 'Recrutez le Vieil Ours et l’Ourson. Vous pouvez en déplacer un seul ou les deux à la suite. L’Ourson ne participe pas à la Capture du Leader adverse.' },
  '18': { name: 'Ourson',           type: 'c', ability: 'Recrutez le Vieil Ours et l’Ourson. Vous pouvez en déplacer un seul ou les deux à la suite. L’Ourson ne participe pas à la Capture du Leader adverse.' },
  '19': { name: 'Vizir',            type: 'b', ability: 'Votre Leader PEUT se déplacer d’une case supplémentaire lors de son action.' },
  '20': { name: 'Feu follet',       type: 'c', ability: 'Se déplace sur n’importe quelle case vide du plateau. Ne participe pas à la Capture du Leader adverse.' },
  '21': { name: 'Chaman',           type: 'a', ability: 'Transforme en Grenouille un Personnage non-Leader visible en ligne droite jusqu’à la fin du tour adverse.' },
  '22': { name: 'Grenouille',       type: 'c', ability: 'Se déplace jusqu’à deux cases. Peut traverser une case occupée par un Personnage. Ne participe pas à la Capture du Leader adverse.' },
  '23': { name: 'Sniper',           type: 'b', ability: 'Au début de votre tour, Capture le Leader adverse, même sans autre allié participant, s’il est à une distance de trois cases ou plus en ligne droite, même s’il n’est pas visible.' },
  '24': { name: 'Tacticienne',      type: 'a', ability: 'Si un allié est adjacent au Leader adverse: déplace d’une case un allié non-Leader, qui ne peut plus utiliser sa capacité active ce tour-ci.' },
  '25': { name: 'Leader Vermillon', type: 'd', ability: '' },
};

function _getTokenData(name) {

  const data = (typeof currentLang !== 'undefined' && currentLang === 'fr')
    ? TOKEN_DATA_FR
    : TOKEN_DATA_EN;
  return data[name];
}

// ── TOOLTIP ENGINE ────────────────────────────────────────────────────────────
const Tooltip = (() => {
  const DELAY  = 800;
  const MARGIN = 10;

  let el        = null;
  let timer     = null;
  let activeKey = null;

  function _build() {
    el = document.createElement('div');
    el.className = 'dc-tooltip-el tt-rich';
    el.innerHTML = `
      <div class="dc-tt-header">
        <div class="dc-tt-icon" id="tt-type-icon"></div>
        <div class="dc-tt-name" id="tt-name"></div>
      </div>
      <div class="dc-tt-ability" id="tt-ability"></div>`;
    document.body.appendChild(el);
  }

  function _show(name, cx, cy, r) {
    const data = _getTokenData(name);
    if (!data) return;

    el.querySelector('#tt-name').textContent    = data.name;
    el.querySelector('#tt-ability').textContent = data.ability;
    el.querySelector('.dc-tt-header').style.marginBottom = data.ability ? '' : '0';

    const iconEl = el.querySelector('#tt-type-icon');
    if (data.type && TOKEN_ICONS[data.type]) {
      iconEl.innerHTML = TOKEN_ICONS[data.type];
      iconEl.style.display = 'flex';
    } else {
      iconEl.innerHTML = '';
      iconEl.style.display = 'none';
    }

    el.style.visibility = 'hidden';
    el.style.display    = 'block';
    el.classList.remove('visible', 'tt-above', 'tt-below');

    requestAnimationFrame(() => {
      const tw  = el.offsetWidth;
      const th  = el.offsetHeight;
      const vw  = window.innerWidth;
      const GAP = 10;

      let x = cx - tw / 2;
      let y = cy - r - th - GAP;
      let above = true;

      if (y < 8) { y = cy + r + GAP; above = false; }
      x = Math.max(MARGIN, Math.min(x, vw - tw - MARGIN));

      // Position de la pointe du triangle : centre du jeton par rapport au tooltip
      const arrowX = cx - x;
      el.style.setProperty('--arrow-x', arrowX + 'px');
      el.classList.add(above ? 'tt-above' : 'tt-below');

      el.style.left       = x + 'px';
      el.style.top        = y + 'px';
      el.style.visibility = '';
      el.classList.add('visible');
    });
  }

  function hide() {
    clearTimeout(timer);
    timer     = null;
    activeKey = null;
    if (!el) return;
    el.classList.remove('visible');
    setTimeout(() => { if (el && !el.classList.contains('visible')) el.style.display = 'none'; }, 110);
  }

  function scheduleBoard(name, cx, cy, key, r) {
    if (!el) _build();
    if (activeKey === key) return;
    hide();
    activeKey = key;
    timer = setTimeout(() => _show(name, cx, cy, r || 0), DELAY);
  }

  function schedulePal(name, cx, cy, key, r) {
    if (!el) _build();
    if (activeKey === key) return;
    hide();
    activeKey = key;
    timer = setTimeout(() => _show(name, cx, cy, r || 0), DELAY);
  }

  function init() { _build(); }

  return { init, scheduleBoard, schedulePal, hide };
})();

// ── BUTTON TOOLTIPS (toolbar) ─────────────────────────────────────────────────
function initButtonTooltips() {
  document.querySelectorAll('#toolbar .btn').forEach(btn => {
    // Supprimer le title natif définitivement
    btn.removeAttribute('title');

    let tt = null, timer = null;

    function _showBtnTt() {
      const label = btn.dataset.tooltip;
      if (!label) return;

      tt = document.createElement('div');
      tt.className = 'dc-tooltip-el tt-simple tt-below';
      tt.innerHTML = `<span class="dc-tt-label"></span>`;
      tt.querySelector('.dc-tt-label').textContent = label;
      document.body.appendChild(tt);
      tt.style.display    = 'block';
      tt.style.visibility = 'hidden';

      requestAnimationFrame(() => {
        const br  = btn.getBoundingClientRect();
        const tw  = tt.offsetWidth;
        const th  = tt.offsetHeight;
        const vw  = window.innerWidth;
        const vh  = window.innerHeight;
        const GAP = 10;

        // Essayer en dessous d'abord (toolbar en haut de page)
        let y = br.bottom + GAP;
        let above = false;
        if (y + th > vh - 8) { y = br.top - th - GAP; above = true; }

        let x = br.left + br.width / 2 - tw / 2;
        x = Math.max(8, Math.min(x, vw - tw - 8));

        // Repositionner la pointe du triangle sur le centre du bouton
        const arrowX = (br.left + br.width / 2) - x;
        tt.style.setProperty('--arrow-x', arrowX + 'px');

        if (above) {
          tt.classList.replace('tt-below', 'tt-above');
        }

        tt.style.left       = x + 'px';
        tt.style.top        = y + 'px';
        tt.style.visibility = '';
        tt.classList.add('visible');
      });
    }

    function _hideBtnTt() {
      clearTimeout(timer);
      if (tt) {
        tt.classList.remove('visible');
        const _tt = tt; tt = null;
        setTimeout(() => _tt.remove(), 120);
      }
    }

    btn.addEventListener('mouseenter', () => { timer = setTimeout(_showBtnTt, 0); });
    btn.addEventListener('mouseleave', _hideBtnTt);
    btn.addEventListener('mousedown',  _hideBtnTt);
  });
}