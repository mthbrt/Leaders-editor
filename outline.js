// ── OUTLINES ──────────────────────────────────────────────────────────────────
// Gère les cercles SVG de bordure des jetons (statiques + draggé).
// Deux SVG distincts :
//   #outlines-svg      — jetons statiques (z-index 5, au-dessus du plateau)
//   #outlines-drag-svg — jeton draggé     (z-index 65, au-dessus des flèches)
// API : Outlines.{ init, render, syncSize }

const Outlines = (() => {

  const SVG_NS = 'http://www.w3.org/2000/svg';

  let svgStatic = null;   // #outlines-svg
  let svgDrag   = null;   // #outlines-drag-svg

  function _el(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  function _clear(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  function render() {
    if (!svgStatic || !svgDrag) return;
    _clear(svgStatic);
    _clear(svgDrag);

    if (typeof showOutline === 'undefined' || !showOutline) return;

    const bw = Math.max(2, LO.r * 0.09);
    const d  = LO.r * 2;
    const cr = d / 2;
    const _snap = (cx) => Math.round(cx - d / 2) + d / 2;

    // ── Outlines statiques ─────────────────────────────────────────────────
    const dragMoved = typeof _dragMoved === 'function' && _dragMoved();
    for (const t of S.tokens) {
      const isDragged = typeof drag !== 'undefined' && drag?.type === 'brd' && drag?.id === t.id;
      // Hide static outline only once the drag threshold is reached
      if (isDragged && dragMoved) continue;
      const cell = LO.byId.get(t.cell); if (!cell) continue;
      const color = t.c === 'w' ? '#ffffff' : '#000000';
      svgStatic.appendChild(_el('circle', {
        cx: _snap(cell.x), cy: _snap(cell.y), r: cr,
        fill: 'none', stroke: color,
        'stroke-width': bw, 'pointer-events': 'none'
      }));
    }

    // ── Outline du jeton draggé ────────────────────────────────────────────
    if (typeof drag !== 'undefined' && drag !== null &&
        typeof dpos !== 'undefined' && dpos && dragMoved) {
      let color = null;
      if (drag.type === 'brd') {
        const t = S.tokens.find(t => t.id === drag.id);
        if (t) color = t.c === 'w' ? '#ffffff' : '#000000';
      }
      if (color) {
        svgDrag.appendChild(_el('circle', {
          cx: _snap(dpos.x), cy: _snap(dpos.y), r: cr,
          fill: 'none', stroke: color,
          'stroke-width': bw, 'pointer-events': 'none'
        }));
      }
    }
  }

  // ── Synchronisation de la taille des SVG avec #main ───────────────────────
  function syncSize(W, H) {
    for (const svg of [svgStatic, svgDrag]) {
      if (!svg) continue;
      svg.setAttribute('width',  W);
      svg.setAttribute('height', H);
      svg.style.width  = W + 'px';
      svg.style.height = H + 'px';
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    svgStatic = document.getElementById('outlines-svg');
    svgDrag   = document.getElementById('outlines-drag-svg');
  }

  return { init, render, syncSize };

})();