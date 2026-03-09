// ── PALETTE ───────────────────────────────────────────────────────────────────
// API: Palette.{ layout, draw, onDown, onWheel, inPalette, palAt, isDragging,
//               getCollapsedWidth, init }
//
// Depends on globals: S, LO, C, PAL_C, PAL_G, render, drawToken, saveH

const Palette = (() => {

  // ── Constants ────────────────────────────────────────────────────────────────
  const MARGIN   = 24;   // gap between canvas edge and panel
  const INNER    = 14;   // padding inside panel on all 4 sides
  const RADIUS   = 16;   // panel border radius
  const HEADER_H = 36;   // height of the title/count header
  const HEADER_GAP = 6;  // small gap between header and first token row
  const SCROLL_W = 6;    // scrollbar width
  const COL_W    = 28;   // collapsed panel width (just the toggle button)

  // ── State ─────────────────────────────────────────────────────────────────
  let scrollY    = 0;
  let contentH   = 0;   // computed each draw, used by scroll & scrollbar
  let collapsed  = false;

  // ── Layout computation ────────────────────────────────────────────────────
  // Returns { palX, palY, palW, palH } for the current canvas size.
  // Called by editor's relayout() to feed LO.
  function layout(W, H, rEst) {
    const pgap = PAL_G;
    const palW = Math.max(72, rEst * 2 * PAL_C + INNER * 2 + pgap * (PAL_C - 1));
    const palH = collapsed ? HEADER_H : H - MARGIN * 2;
    const palX = W - palW - MARGIN;
    const palY = MARGIN;
    return { palX, palY, palW, palH };
  }

  // ── Hit testing ───────────────────────────────────────────────────────────
  function inPalette(x, y) {
    const { palX, palY, palW, palH } = LO;
    return x >= palX && x <= palX + palW && y >= palY && y <= palY + palH;
  }

  // Returns the token name under (x,y), or null.
  function palAt(x, y) {
    if (collapsed) return null;
    const { palX, palY, psz, pgap } = LO;
    const step = psz + pgap;
    const col  = Math.floor((x - palX - INNER) / step);
    const clipY = palY + HEADER_H + HEADER_GAP;
    const row  = Math.floor((y - clipY + scrollY) / step);
    if (col < 0 || col >= PAL_C) return null;
    const i = row * PAL_C + col;
    if (i < 0 || i >= S.palette.length) return null;
    const px = palX + INNER + col * step;
    const py = clipY + row * step - scrollY;
    return (x >= px && x <= px + psz && y >= py && y <= py + psz) ? S.palette[i] : null;
  }

  // ── Toggle button hit ─────────────────────────────────────────────────────
  function _inToggle(x, y) {
    const { palX, palY, palW } = LO;
    return x >= palX && x <= palX + palW && y >= palY && y <= palY + HEADER_H;
  }

  // ── Events ────────────────────────────────────────────────────────────────
  function onDown(x, y) {
    if (!inPalette(x, y)) return false;
    if (_inToggle(x, y)) {
      collapsed = !collapsed;
      scrollY = 0;
      relayout();
      render();
      return true;
    }
    return false;
  }

  function onWheel(x, y, deltaY) {
    if (!inPalette(x, y) || collapsed) return false;
    const { palH } = LO;
    const clipH    = palH - HEADER_H - HEADER_GAP - INNER;
    const maxScroll = Math.max(0, contentH - clipH);
    scrollY = Math.max(0, Math.min(maxScroll, scrollY + deltaY * 0.6));
    render();
    return true;
  }

  // ── Drawing ───────────────────────────────────────────────────────────────
  function draw(ctx) {
    const { palX, palY, palW, palH, psz, pgap, scrollBarW } = LO;

    // ── Shadow ──
    ctx.save();
    ctx.shadowColor   = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur    = 22;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = C.palBg;
    ctx.beginPath(); ctx.roundRect(palX, palY, palW, palH, RADIUS); ctx.fill();
    ctx.restore();

    // ── Panel background + border ──
    ctx.save();
    ctx.fillStyle = C.palBg;
    ctx.beginPath(); ctx.roundRect(palX, palY, palW, palH, RADIUS); ctx.fill();
    ctx.strokeStyle = 'rgba(70,70,160,0.55)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();

    // ── Toggle button (always visible) ──
    _drawToggle(ctx, palX, palY, palW);

    // ── Header text (always visible) ──
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = C.palHdr;
    ctx.font         = "bold 11px 'Segoe UI',sans-serif";
    ctx.fillText('CHARACTERS', palX + palW / 2, palY + 14);
    ctx.fillStyle = '#30306a';
    ctx.font      = "10px 'Segoe UI',sans-serif";
    ctx.fillText(`${S.palette.length} available`, palX + palW / 2, palY + 26);

    if (collapsed) return;

    // ── Token grid (clipped) ──
    const clipY = palY + HEADER_H + HEADER_GAP;
    const clipH = palH - HEADER_H - HEADER_GAP - INNER;
    const step  = psz + pgap;
    contentH    = Math.ceil(S.palette.length / PAL_C) * step - pgap;

    ctx.save();
    ctx.beginPath();
    ctx.rect(palX, clipY, palW, clipH);
    ctx.clip();

    for (let i = 0; i < S.palette.length; i++) {
      const col = i % PAL_C;
      const row = Math.floor(i / PAL_C);
      const px  = palX + INNER + col * step;
      const py  = clipY + row * step - scrollY;
      if (py + psz < clipY - 2 || py > clipY + clipH + 2) continue;
      drawToken(ctx, px + psz / 2, py + psz / 2, psz / 2 * 0.90, S.palette[i], 'w');
    }
    ctx.restore();

  
  }

  function _drawToggle(ctx, palX, palY, palW) {
    // ∨ = expanded (click to collapse upward)
    // ∧ = collapsed (click to expand downward)
    const cx  = palX + palW - 14;
    const cy  = palY + HEADER_H / 2;
    const arr = collapsed ? '∨' : '∧';
    ctx.save();
    ctx.fillStyle    = 'rgba(130,130,210,0.85)';
    ctx.font         = "bold 13px 'Segoe UI',sans-serif";
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(arr, cx, cy);
    ctx.restore();
  }

  // ── Exposed helpers ───────────────────────────────────────────────────────
  function getScrollY()        { return scrollY; }
  function isCollapsed()       { return collapsed; }

  return { layout, draw, onDown, onWheel, inPalette, palAt,
           getScrollY, isCollapsed };

})();