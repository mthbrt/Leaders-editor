// ── ARROWS ────────────────────────────────────────────────────────────────────
// API: Arrows.{ onDown, onMove, onUp, onKey, resetState, clearSelected,
//               draw, drawPreview, updateCursor, getArrowSrc, isDragging, init }

const Arrows = (() => {

  const COLORS = ['#ff4444','#44aaff','#44ee88','#ffcc00','#ff88ff','#ff8822','#aaaaff'];
  const nextColor = c => COLORS[(COLORS.indexOf(c) + 1) % COLORS.length];

  let sel      = null;
  let drawFrom = null;   // cell id while right-dragging
  let bendDrag = null;   // { id, ox, oy }
  let mouse    = { x: 0, y: 0 };
  let toolbar  = null;

  // ── Shared geometry — single source of truth ──────────────────────────────
  // Returns the exact points used both for drawing AND for hit-testing.
  function _geom(a) {
    const s = LO.byId.get(a.from_cell), d = LO.byId.get(a.to_cell);
    if (!s || !d) return null;
    const cp = {                          // quadratic control point
      x: (s.x + d.x) / 2 + (a.mx || 0),
      y: (s.y + d.y) / 2 + (a.my || 0)
    };
    const shrinkSrc = LO.r * 1.0;    // shaft starts at cell edge
    const shrinkDst = LO.r * 0.30;   // arrowhead tip goes well into destination cell
    const headLen = Math.max(13, LO.r * 0.56);

    const spt = (ax, ay, bx, by, dist) => {
      const l = Math.hypot(bx - ax, by - ay);
      if (l < 1) return { x: ax, y: ay };
      return { x: ax + (bx - ax) / l * dist, y: ay + (by - ay) / l * dist };
    };

    const p1 = spt(s.x, s.y, cp.x, cp.y, shrinkSrc);   // shaft start
    const p2 = spt(d.x, d.y, cp.x, cp.y, shrinkDst);   // arrowhead tip

    // direction at tip: tangent of the quadratic at t=1 = 2*(p2-cp)
    const ang = Math.atan2(p2.y - cp.y, p2.x - cp.x);
    const pe  = {                                      // shaft end (before head)
      x: p2.x - headLen * 0.72 * Math.cos(ang),
      y: p2.y - headLen * 0.72 * Math.sin(ang)
    };

    // on-curve midpoint at t=0.5 (exact Bézier, using shaft endpoints + cp)
    const mid = {
      x: 0.25 * p1.x + 0.5 * cp.x + 0.25 * pe.x,
      y: 0.25 * p1.y + 0.5 * cp.y + 0.25 * pe.y
    };

    return { cp, p1, p2, pe, ang, headLen, mid };
  }

  // ── Hit-testing (uses _geom — always matches drawn curve) ─────────────────
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

  // ── Toolbar ───────────────────────────────────────────────────────────────
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
      // toggle: straight ↔ slight curve
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
      // perpendicular to the src→dst direction, offset from the on-curve midpoint
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
      const cell = _nearCell(x, y);
      if (cell) { drawFrom = cell.id; render(); return true; }
      return false;
    }
    if (e.button !== 0) return false;

    if (_hitBend(x, y)) {
      const a = S.arrows.find(a => a.id === sel);
      const g = _geom(a);
      // drag offset relative to the control point (not the on-curve mid)
      bendDrag = { id: a.id };
      if (toolbar) toolbar.style.pointerEvents = 'none';
      return true;
    }

    const hit = _hitArrow(x, y);
    if (hit) { sel = hit.id; _placeToolbar(); render(); return true; }

    sel = null; _hideToolbar(); render(); return false;
  }

  function onMove(x, y) {
    mouse = { x, y };
    if (bendDrag) {
      const a = S.arrows.find(a => a.id === bendDrag.id);
      if (a) {
        const s = LO.byId.get(a.from_cell), d = LO.byId.get(a.to_cell);
        if (s && d) {
          // mouse is on the curve at t=0.5 (mid).
          // mid = 0.25*p1 + 0.5*cp + 0.25*pe  =>  cp = 2*mid - 0.5*(p1+pe)
          // p1 and pe depend on cp, but their shrink direction (toward cp) is
          // stable enough for one linearised step. We compute p1/pe from the
          // CURRENT cp, then solve for the new cp that places mid under mouse.
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
      bendDrag = null; if (toolbar) toolbar.style.pointerEvents = 'all'; saveH(); _placeToolbar(); render(); return true;
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

  // ── Drawing ────────────────────────────────────────────────────────────────
  function draw(ctx) {
    const lw = Math.max(2.8, LO.r * 0.15);
    ctx.save();
    for (const a of S.arrows) {
      const g = _geom(a); if (!g) continue;
      const isSel = sel === a.id;

      ctx.strokeStyle = a.color;
      ctx.fillStyle   = a.color;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      const ha = 0.40;

      // selection glow
      if (isSel) {
        ctx.save();
        ctx.strokeStyle = a.color;
        ctx.lineWidth   = lw + 8;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.moveTo(g.p1.x, g.p1.y);
        ctx.quadraticCurveTo(g.cp.x, g.cp.y, g.pe.x, g.pe.y);
        ctx.stroke();
        ctx.restore();
      }

      // ── shadow pass: shaft + head together so shadow is unified ──
      ctx.save();
      ctx.shadowColor   = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur    = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = a.color;
      ctx.fillStyle   = a.color;
      ctx.lineWidth   = lw;
      ctx.beginPath();
      ctx.moveTo(g.p1.x, g.p1.y);
      ctx.quadraticCurveTo(g.cp.x, g.cp.y, g.pe.x, g.pe.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g.p2.x, g.p2.y);
      ctx.lineTo(g.p2.x - g.headLen * Math.cos(g.ang - ha), g.p2.y - g.headLen * Math.sin(g.ang - ha));
      ctx.lineTo(g.p2.x - g.headLen * Math.cos(g.ang + ha), g.p2.y - g.headLen * Math.sin(g.ang + ha));
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ── colour pass: redraw on top without shadow so head doesn't cast shadow on shaft ──
      ctx.save();
      ctx.strokeStyle = a.color;
      ctx.fillStyle   = a.color;
      ctx.lineWidth   = lw;
      ctx.beginPath();
      ctx.moveTo(g.p1.x, g.p1.y);
      ctx.quadraticCurveTo(g.cp.x, g.cp.y, g.pe.x, g.pe.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g.p2.x, g.p2.y);
      ctx.lineTo(g.p2.x - g.headLen * Math.cos(g.ang - ha), g.p2.y - g.headLen * Math.sin(g.ang - ha));
      ctx.lineTo(g.p2.x - g.headLen * Math.cos(g.ang + ha), g.p2.y - g.headLen * Math.sin(g.ang + ha));
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // diamond handle — on the visible curve (mid at t=0.5)
      if (isSel) {
        const hs = Math.max(6, LO.r * 0.18);
        const { x: hx, y: hy } = g.mid;
        ctx.save();
        ctx.fillStyle   = '#ffffff';
        ctx.strokeStyle = a.color;
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(hx,      hy - hs);
        ctx.lineTo(hx + hs, hy);
        ctx.lineTo(hx,      hy + hs);
        ctx.lineTo(hx - hs, hy);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawPreview(ctx) {
    if (drawFrom === null) return;
    const src = LO.byId.get(drawFrom); if (!src) return;
    const snap = _nearCell(mouse.x, mouse.y);
    const tx = snap && snap.id !== drawFrom ? snap.x : mouse.x;
    const ty = snap && snap.id !== drawFrom ? snap.y : mouse.y;

    // Build a temporary arrow and draw it semi-transparent
    const fake = { id: -1, from_cell: drawFrom, to_cell: -1, mx: 0, my: 0, color: COLORS[0] };
    // Override _geom for preview by computing geometry inline
    const lw      = Math.max(2.8, LO.r * 0.15);
    const shrinkSrc = LO.r * 1.0;
    const shrinkDst = LO.r * 0.40;
    const headLen = Math.max(13, LO.r * 0.56);
    const ha      = 0.40;

    const spt = (ax, ay, bx, by, dist) => {
      const l = Math.hypot(bx - ax, by - ay); if (l < 1) return [ax, ay];
      return [ax + (bx - ax) / l * dist, ay + (by - ay) / l * dist];
    };

    // Don't draw anything if hovering the source cell or out of range
    if (!snap || snap.id === drawFrom) return;

    const cpx = (src.x + tx) / 2;
    const cpy = (src.y + ty) / 2;

    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle   = COLORS[0];
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    {
      const [x1, y1] = spt(src.x, src.y, cpx, cpy, shrinkSrc);
      const [x2, y2] = spt(tx, ty, cpx, cpy, shrinkDst);
      const ang = Math.atan2(y2 - cpy, x2 - cpx);
      const lx2 = x2 - headLen * 0.72 * Math.cos(ang);
      const ly2 = y2 - headLen * 0.72 * Math.sin(ang);

      // shaft
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpx, cpy, lx2, ly2);
      ctx.stroke();

      // head
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(ang - ha), y2 - headLen * Math.sin(ang - ha));
      ctx.lineTo(x2 - headLen * Math.cos(ang + ha), y2 - headLen * Math.sin(ang + ha));
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function updateCursor(cv, x, y) {
    if (bendDrag)          { cv.style.cursor = 'grabbing';  return true; }
    if (drawFrom !== null) { cv.style.cursor = 'crosshair'; return true; }
    if (_hitBend(x, y))    { cv.style.cursor = 'grab';      return true; }
    if (_hitArrow(x, y))   { cv.style.cursor = 'pointer';   return true; }
    return false;
  }

  function getArrowSrc() { return null; } // no source highlight wanted
  function isDragging()  { return bendDrag !== null || drawFrom !== null; }
  function init()        { _mkToolbar(); }

  return { onDown, onMove, onUp, onKey, resetState, clearSelected,
           draw, drawPreview, updateCursor, getArrowSrc, isDragging, init };
})();