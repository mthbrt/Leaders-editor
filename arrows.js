// ── ARROWS ────────────────────────────────────────────────────────────────────
// SVG-based arrows — zéro canvas. API identique à l'ancienne version.
// API: Arrows.{ onDown, onMove, onUp, onKey, resetState, clearSelected,
//               render, updateCursor, getArrowSrc, isDragging, init }

const Arrows = (() => {

  const COLORS = ['#ff4444','#44aaff','#44ee88','#ffcc00','#ff88ff','#ff8822','#aaaaff'];
  const nextColor = c => COLORS[(COLORS.indexOf(c) + 1) % COLORS.length];

  let sel      = null;
  let drawFrom = null;
  let bendDrag = null;
  let mouse    = { x: 0, y: 0 };
  let toolbar  = null;
  let svg      = null;  // l'élément <svg> dans #main (flèches)

  // ── Géométrie partagée ────────────────────────────────────────────────────
  function _geom(a) {
    const s = LO.byId.get(a.from_cell), d = LO.byId.get(a.to_cell);
    if (!s || !d) return null;
    const cp = {
      x: (s.x + d.x) / 2 + (a.mx || 0),
      y: (s.y + d.y) / 2 + (a.my || 0)
    };
    const shrinkSrc = LO.r * 1.0;
    const shrinkDst = LO.r * 0.30;
    const headLen   = Math.max(13, LO.r * 0.56);

    const spt = (ax, ay, bx, by, dist) => {
      const l = Math.hypot(bx - ax, by - ay);
      if (l < 1) return { x: ax, y: ay };
      return { x: ax + (bx - ax) / l * dist, y: ay + (by - ay) / l * dist };
    };

    const p1  = spt(s.x, s.y, cp.x, cp.y, shrinkSrc);
    const p2  = spt(d.x, d.y, cp.x, cp.y, shrinkDst);

    // Tangente en bout de Bézier (t=1) : 2*(p2 - cp)
    // Si cp est dégénéré (trop proche de p2), on replie sur la direction src→dst
    let dx = p2.x - cp.x, dy = p2.y - cp.y;
    if (Math.hypot(dx, dy) < 0.5) { dx = d.x - s.x; dy = d.y - s.y; }
    const ang = Math.atan2(dy, dx);

    const pe  = {
      x: p2.x - headLen * 0.72 * Math.cos(ang),
      y: p2.y - headLen * 0.72 * Math.sin(ang)
    };
    const mid = {
      x: 0.25 * p1.x + 0.5 * cp.x + 0.25 * pe.x,
      y: 0.25 * p1.y + 0.5 * cp.y + 0.25 * pe.y
    };
    return { cp, p1, p2, pe, ang, headLen, mid };
  }

  // ── Hit-testing ───────────────────────────────────────────────────────────
  function _hitArrow(x, y) {
    const thr = Math.max(7, LO.r * 0.22);
    for (let i = S.arrows.length - 1; i >= 0; i--) {
      const a = S.arrows[i];
      const g = _geom(a); if (!g) continue;
      let best = Infinity;
      for (let k = 0; k <= 40; k++) {
        const t = k / 40, v = 1 - t;
        best = Math.min(best, Math.hypot(
          x - (v*v*g.p1.x + 2*v*t*g.cp.x + t*t*g.pe.x),
          y - (v*v*g.p1.y + 2*v*t*g.cp.y + t*t*g.pe.y)
        ));
      }
      if (best < thr) return a;
    }
    return null;
  }

  function _hitBend(x, y) {
    if (sel === null) return false;
    const a = S.arrows.find(a => a.id === sel); if (!a) return false;
    const g = _geom(a); if (!g) return false;
    return Math.hypot(x - g.mid.x, y - g.mid.y) < Math.max(10, LO.r * 0.30);
  }

  function _nearCell(x, y) {
    let best = null, bd = Infinity;
    for (const c of LO.cells) {
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < LO.r * 1.3 && d < bd) { bd = d; best = c; }
    }
    return best;
  }

  // ── Toolbar (inchangé — déjà en HTML) ─────────────────────────────────────
  function _mkToolbar() {
    if (toolbar) return toolbar;
    const el = document.createElement('div');
    el.id = 'arr-tb';
    el.innerHTML = `
      <button id="arr-color" title="Couleur"><span id="arr-dot"></span></button>
      <div class="arr-sep"></div>
      <button id="arr-bend" title="Courbure">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M1 9 Q7 1 13 9"/>
        </svg>
      </button>
      <div class="arr-sep"></div>
      <button id="arr-del" class="arr-del" title="Supprimer">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
        </svg>
      </button>`;
    document.getElementById('main').appendChild(el);
    el.addEventListener('mousedown', e => e.stopPropagation());

    el.querySelector('#arr-color').addEventListener('click', e => {
      e.stopPropagation();
      const a = S.arrows.find(a => a.id === sel); if (!a) return;
      a.color = nextColor(a.color);
      saveH(); render(); _placeToolbar();
    });
    el.querySelector('#arr-bend').addEventListener('click', e => {
      e.stopPropagation();
      const a = S.arrows.find(a => a.id === sel); if (!a) return;
      const presets = [[0,0],[-40,0]];
      const cur = presets.findIndex(([mx,my]) => Math.abs(a.mx-mx)<5 && Math.abs(a.my-my)<5);
      [a.mx, a.my] = presets[(cur + 1) % presets.length];
      saveH(); render(); _placeToolbar();
    });
    el.querySelector('#arr-del').addEventListener('click', e => {
      e.stopPropagation();
      if (sel === null) return;
      S.arrows = S.arrows.filter(a => a.id !== sel);
      sel = null; _hideToolbar(); saveH(); render();
    });

    toolbar = el;
    return el;
  }

  function _placeToolbar() {
    if (sel === null) { _hideToolbar(); return; }
    const a = S.arrows.find(a => a.id === sel); if (!a) { _hideToolbar(); return; }
    const g = _geom(a); if (!g) { _hideToolbar(); return; }

    const el = _mkToolbar();
    el.querySelector('#arr-dot').style.background = a.color;
    el.style.display = 'flex';

    requestAnimationFrame(() => {
      const pw = el.offsetWidth, ph = el.offsetHeight;
      const s = LO.byId.get(a.from_cell), d = LO.byId.get(a.to_cell);
      if (!s || !d) { _hideToolbar(); return; }
      const dx = d.x - s.x, dy = d.y - s.y, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const off = Math.max(52, LO.r * 1.5);
      let px = g.mid.x + nx * off - pw / 2;
      let py = g.mid.y + ny * off - ph / 2;
      px = Math.max(4, Math.min(LO.bW - pw - 4, px));
      py = Math.max(4, Math.min(LO.H  - ph - 4, py));
      el.style.left = px + 'px';
      el.style.top  = py + 'px';
    });
  }

  function _hideToolbar() { if (toolbar) toolbar.style.display = 'none'; }

  // ── Events ─────────────────────────────────────────────────────────────────
  function onDown(e, x, y) {
    if (e.button === 2) {
      const hit = _hitArrow(x, y);
      if (hit) {
        sel = hit.id;
        if (typeof tokTbId !== 'undefined') { tokTbId = null; if (typeof _hideTokToolbar === 'function') _hideTokToolbar(); }
        _placeToolbar(); render(); return true;
      }
      const cell = _nearCell(x, y);
      if (cell) { sel = null; _hideToolbar(); drawFrom = cell.id; render(); return true; }
      return false;
    }
    if (e.button !== 0) return false;

    if (_hitBend(x, y)) {
      const a = S.arrows.find(a => a.id === sel);
      bendDrag = { id: a.id };
      if (toolbar) toolbar.style.pointerEvents = 'none';
      return true;
    }

    const hit = _hitArrow(x, y);
    if (hit) {
      sel = hit.id;
      if (typeof tokTbId !== 'undefined') { tokTbId = null; if (typeof _hideTokToolbar === 'function') _hideTokToolbar(); }
      _placeToolbar(); render(); return true;
    }

    sel = null; _hideToolbar(); render(); return false;
  }

  function onMove(x, y) {
    mouse = { x, y };
    if (bendDrag) {
      const a = S.arrows.find(a => a.id === bendDrag.id);
      if (a) {
        const s = LO.byId.get(a.from_cell), d = LO.byId.get(a.to_cell);
        if (s && d) {
          const _g = _geom(a);
          if (_g) {
            const newCpx = 2 * x - 0.5 * (_g.p1.x + _g.pe.x);
            const newCpy = 2 * y - 0.5 * (_g.p1.y + _g.pe.y);
            a.mx = newCpx - (s.x + d.x) / 2;
            a.my = newCpy - (s.y + d.y) / 2;
          }
        }
      }
      _placeToolbar(); render(); return true;
    }
    if (drawFrom !== null) { render(); return true; }
    return false;
  }

  function onUp(e, x, y) {
    if (e.button === 2 && drawFrom !== null) {
      const dst = _nearCell(x, y);
      if (dst && dst.id !== drawFrom) {
        S.arrows = S.arrows.filter(a =>
          !(a.from_cell === drawFrom && a.to_cell === dst.id)
        );
        const id = S.arrowNid++;
        S.arrows.push({ id, from_cell: drawFrom, to_cell: dst.id, mx: 0, my: 0, color: COLORS[0] });
        sel = id; saveH(); _placeToolbar();
      }
      drawFrom = null; render(); return true;
    }
    if (bendDrag && e.button === 0) {
      bendDrag = null;
      if (toolbar) toolbar.style.pointerEvents = 'all';
      saveH(); _placeToolbar(); render(); return true;
    }
    return false;
  }

  function onKey(e) {
    if (e.key === 'Escape') { drawFrom = null; sel = null; _hideToolbar(); render(); return true; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && sel !== null) {
      S.arrows = S.arrows.filter(a => a.id !== sel);
      sel = null; _hideToolbar(); saveH(); render(); return true;
    }
    return false;
  }

  function resetState()    { sel = null; drawFrom = null; bendDrag = null; if (toolbar) toolbar.style.pointerEvents = 'all'; _hideToolbar(); }
  function clearSelected() { sel = null; _hideToolbar(); }

  // ── SVG helpers ───────────────────────────────────────────────────────────
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function _el(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  // Construit le d= d'une flèche (tige quadratique + tête)
  function _arrowPath(g) {
    const { p1, cp, pe, p2, ang, headLen } = g;
    const ha = 0.40;
    const shaft = `M${p1.x},${p1.y} Q${cp.x},${cp.y} ${pe.x},${pe.y}`;
    const hx1 = p2.x - headLen * Math.cos(ang - ha);
    const hy1 = p2.y - headLen * Math.sin(ang - ha);
    const hx2 = p2.x - headLen * Math.cos(ang + ha);
    const hy2 = p2.y - headLen * Math.sin(ang + ha);
    const head = `M${p2.x},${p2.y} L${hx1},${hy1} L${hx2},${hy2} Z`;
    return { shaft, head };
  }

  // ── Rendu SVG ─────────────────────────────────────────────────────────────
  function render() {
    if (!svg) return;
    const lw = Math.max(2.8, LO.r * 0.15);

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Filtre ombre unifié — appliqué sur un <g> qui contient tige + tête
    // => l'ombre est calculée sur la forme complète, pas élément par élément
    const defs = _el('defs', {});
    const filt = _el('filter', { id: 'arr-shadow', x: '-30%', y: '-30%', width: '160%', height: '160%', 'color-interpolation-filters': 'sRGB' });
    const fe   = _el('feDropShadow', { dx: '0', dy: '0', stdDeviation: '2.5', 'flood-color': '#000', 'flood-opacity': '0.55' });
    filt.appendChild(fe); defs.appendChild(filt); svg.appendChild(defs);

    // Toutes les flèches persistantes
    for (const a of S.arrows) {
      const g = _geom(a); if (!g) continue;
      const isSel = sel === a.id;
      const { shaft, head } = _arrowPath(g);

      // Glow de sélection (sans ombre)
      if (isSel) {
        svg.appendChild(_el('path', {
          d: shaft,
          stroke: a.color,
          'stroke-width': lw + 8,
          fill: 'none',
          'stroke-linecap': 'round',
          opacity: '0.15'
        }));
      }

      // Groupe tige + tête avec UNE SEULE ombre sur l'ensemble
      const shadow = _el('g', { filter: 'url(#arr-shadow)' });
      shadow.appendChild(_el('path', {
        d: shaft,
        stroke: a.color,
        'stroke-width': lw,
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }));
      shadow.appendChild(_el('path', {
        d: head,
        fill: a.color,
        stroke: a.color,
        'stroke-width': '0.5',
        'stroke-linejoin': 'round'
      }));
      svg.appendChild(shadow);

      // Diamant de courbure (handle) si sélectionné — pas d'ombre
      if (isSel) {
        const hs = Math.max(6, LO.r * 0.18);
        const { x: hx, y: hy } = g.mid;
        svg.appendChild(_el('polygon', {
          points: `${hx},${hy - hs} ${hx + hs},${hy} ${hx},${hy + hs} ${hx - hs},${hy}`,
          fill: '#ffffff',
          stroke: a.color,
          'stroke-width': '2'
        }));
      }
    }

    // Preview flèche en cours de tracé
    if (drawFrom !== null) {
      const src = LO.byId.get(drawFrom); if (!src) return;
      const snap = _nearCell(mouse.x, mouse.y);
      if (!snap || snap.id === drawFrom) return;

      const shrinkSrc = LO.r * 1.0;
      const shrinkDst = LO.r * 0.40;
      const headLen   = Math.max(13, LO.r * 0.56);
      const ha        = 0.40;
      const cpx = (src.x + snap.x) / 2;
      const cpy = (src.y + snap.y) / 2;

      const spt = (ax, ay, bx, by, dist) => {
        const l = Math.hypot(bx - ax, by - ay); if (l < 1) return [ax, ay];
        return [ax + (bx - ax) / l * dist, ay + (by - ay) / l * dist];
      };
      const [x1, y1] = spt(src.x, src.y, cpx, cpy, shrinkSrc);
      const [x2, y2] = spt(snap.x, snap.y, cpx, cpy, shrinkDst);
      const ang = Math.atan2(y2 - cpy, x2 - cpx);
      const lx2 = x2 - headLen * 0.72 * Math.cos(ang);
      const ly2 = y2 - headLen * 0.72 * Math.sin(ang);
      const hx1 = x2 - headLen * Math.cos(ang - ha);
      const hy1 = y2 - headLen * Math.sin(ang - ha);
      const hx2b = x2 - headLen * Math.cos(ang + ha);
      const hy2b = y2 - headLen * Math.sin(ang + ha);

      const grp = _el('g', { opacity: '0.45' });
      grp.appendChild(_el('path', {
        d: `M${x1},${y1} Q${cpx},${cpy} ${lx2},${ly2}`,
        stroke: COLORS[0], 'stroke-width': lw,
        fill: 'none', 'stroke-linecap': 'round'
      }));
      grp.appendChild(_el('path', {
        d: `M${x2},${y2} L${hx1},${hy1} L${hx2b},${hy2b} Z`,
        fill: COLORS[0], stroke: 'none'
      }));
      svg.appendChild(grp);
    }
  }

  // ── Curseur ───────────────────────────────────────────────────────────────
  function updateCursor(el, x, y) {
    if (bendDrag)          { el.style.cursor = 'grabbing';  return true; }
    if (drawFrom !== null) { el.style.cursor = 'crosshair'; return true; }
    if (_hitBend(x, y))    { el.style.cursor = 'grab';      return true; }
    if (_hitArrow(x, y))   { el.style.cursor = 'pointer';   return true; }
    return false;
  }

  function getArrowSrc() { return null; }
  function isDragging()  { return bendDrag !== null || drawFrom !== null; }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    svg = document.getElementById('arrows-svg');
    _mkToolbar();
  }

  // Rendre draw() et drawPreview() no-ops (remplacés par render())
  function draw() {}
  function drawPreview() {}

  return { onDown, onMove, onUp, onKey, resetState, clearSelected,
           draw, drawPreview, render, updateCursor, getArrowSrc, isDragging, init };
})();