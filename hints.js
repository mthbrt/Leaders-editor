// ── HINTS: barrage, encirclement, capture detection + board status icons ─────
// Depends on globals from editor.js: S, LO, ID2QR, QR2ID, HEX_DIRS, ALL_CELL_IDS, CELL_ADJ,
// _neighborCellIds. Must be loaded after editor.js.

// Cell IDs reachable from cellId in [minDist..maxDist] steps along the 6 hex directions.
function _cellsAtLineDistance(cellId, minDist, maxDist) {
  const c = ID2QR.get(cellId);
  if (!c) return new Set();
  const result = new Set();
  for (const [dq, dr] of HEX_DIRS) {
    for (let d = minDist; d <= maxDist; d++) {
      const id = QR2ID.get(`${c.q + dq * d},${c.r + dr * d}`);
      if (id !== undefined) result.add(id);
      else break; // off the board in this direction, no point going further
    }
  }
  return result;
}

// Pieces that never count toward capturing the leader (18=Cub, 20=Wisp, 22=Frog).
const CAPTURE_EXCLUDED = new Set(['18', '20', '22']);

// Driven off tooltip.js's type 'd' (King/Queen/Emperor) instead of a hardcoded id list.
const _isLeaderName = name => TOKEN_DATA_EN[name]?.type === 'd';

// Per-leader (not per-color) so a board with more than one leader per color flags exactly which
// one is in danger.
function _isSniperCaptured(leader) {
  const sniperRange = _cellsAtLineDistance(leader.cell, 3, 6);
  return S.tokens.some(t => t.c !== leader.c && t.name === '23' && sniperRange.has(t.cell));
}

// Standard capture: Assassin (5) adjacent alone, OR ≥ 2 opposing pieces threaten the leader.
//   • Regular pieces: adjacent, excluding 18/20/22
//   • Archer (4): exactly distance 2 in a straight line, never when adjacent
function _isStandardCaptured(leader) {
  const neighborIds = new Set(_neighborCellIds(leader.cell));
  if (S.tokens.some(t => t.c !== leader.c && t.name === '5' && neighborIds.has(t.cell))) return true;
  let threats = S.tokens.filter(t =>
    t.c !== leader.c && !CAPTURE_EXCLUDED.has(t.name) && !t.frog && t.name !== '4' && neighborIds.has(t.cell)
  ).length;
  const archerRange = _cellsAtLineDistance(leader.cell, 2, 2);
  threats += S.tokens.filter(t => t.c !== leader.c && t.name === '4' && archerRange.has(t.cell)).length;
  return threats >= 2;
}

// Encircled once every neighbor cell is occupied (edge/corner cells just have fewer neighbors).
function _isEncircled(leader, occupied) {
  const neighborIds = _neighborCellIds(leader.cell);
  return neighborIds.length > 0 && neighborIds.every(id => occupied.has(id));
}

// color optional throughout this file: 'w'/'b' restricts to that team's leader(s), omitted tests both.
function _checkSniperCaptureCondition(color) {
  return S.tokens.some(leader =>
    (!color || leader.c === color) && _isLeaderName(leader.name) && _isSniperCaptured(leader));
}

function _checkStandardCaptureCondition(color) {
  return S.tokens.some(leader =>
    (!color || leader.c === color) && _isLeaderName(leader.name) && _isStandardCaptured(leader));
}

function _checkEncirclementCondition(color) {
  const occupied = new Set(S.tokens.map(t => t.cell));
  return S.tokens.some(leader =>
    (!color || leader.c === color) && _isLeaderName(leader.name) && _isEncircled(leader, occupied));
}

// Pre-computed set of the 18 border cells (outer ring, where max(|q|,|r|,|q+r|) = R = 3).
const BORDER_CELLS = (() => {
  const s = new Set();
  for (const [id, c] of ID2QR) {
    if (Math.max(Math.abs(c.q), Math.abs(c.r), Math.abs(c.q + c.r)) === 3) s.add(id);
  }
  return s;
})();

// BFS the non-wall cells; ≥2 connected regions with an empty cell means the wall is a barrage.
function _barrageRegions(wallSet, occupied, allCellIds) {
  const seen = new Set();
  const regions = [];
  for (let i = 0; i < allCellIds.length; i++) {
    const start = allCellIds[i];
    if (wallSet.has(start) || seen.has(start)) continue;
    const region = [], q = [start];
    seen.add(start);
    let hasEmpty = false;
    for (let qi = 0; qi < q.length; qi++) {
      const cur = q[qi];
      region.push(cur);
      if (!occupied.has(cur)) hasEmpty = true;
      for (const n of _neighborCellIds(cur)) {
        if (!wallSet.has(n) && !seen.has(n)) { seen.add(n); q.push(n); }
      }
    }
    if (hasEmpty) regions.push(region);
  }
  return regions;
}

// wallSet members touching pocketSet — this *is* the chain, by construction, no path search needed.
function _frontierOf(wallSet, pocketSet) {
  return [...wallSet].filter(id => _neighborCellIds(id).some(n => pocketSet.has(n)));
}

// Orders mutually-adjacent cell ids into a chain, starting from an end when one exists.
function _orderChain(ids) {
  const set = new Set(ids);
  const within = id => _neighborCellIds(id).filter(n => set.has(n));
  const path = [ids.find(id => within(id).length <= 1) ?? ids[0]];
  const seen = new Set(path);
  while (path.length < ids.length) {
    const next = within(path[path.length - 1]).find(n => !seen.has(n));
    if (next === undefined) break;
    path.push(next); seen.add(next);
  }
  return path;
}

// Grows the chain at either end to 4 cells. If toBorder, prefers border cells and grows whichever
// end isn't already anchored there first; if growth is forced past an anchor (both ends already
// at a border), the new cell and the buried anchor are swapped back — valid only if the new cell
// is still adjacent to what follows the anchor, checked before swapping.
function _extendChainTo4(path, wallSet, toBorder) {
  const seen = new Set(path);
  const growAt = tail => {
    const end = tail ? path[path.length - 1] : path[0];
    const cands = _neighborCellIds(end).filter(n => wallSet.has(n) && !seen.has(n));
    if (!cands.length) return false;
    const next = (toBorder && cands.find(n => BORDER_CELLS.has(n))) || cands[0];
    seen.add(next);
    tail ? path.push(next) : path.unshift(next);

    if (toBorder && !BORDER_CELLS.has(next)) {
      const anchorIdx = tail ? path.length - 2 : 1;
      const beyond     = tail ? path[path.length - 3] : path[2];
      if (BORDER_CELLS.has(path[anchorIdx]) && (beyond === undefined || _neighborCellIds(next).includes(beyond))) {
        const endIdx = tail ? path.length - 1 : 0;
        [path[anchorIdx], path[endIdx]] = [path[endIdx], path[anchorIdx]];
      }
    }
    return true;
  };
  while (path.length < 4) {
    const tailAnchored = toBorder && BORDER_CELLS.has(path[path.length - 1]);
    if (!(tailAnchored ? (growAt(false) || growAt(true)) : (growAt(true) || growAt(false)))) break;
  }
  return path;
}

// Finds the same-color wall (≥4 connected tokens cutting the board into ≥2 regions) for `color`,
// returns the ordered chain of cell ids for _drawBarrageLine — closed (repeats the first id) when
// the pocket is fully enclosed, open with both ends on the border otherwise. null if no barrage.
function _findBarragePath(color) {
  const occupied   = new Set(S.tokens.map(t => t.cell));
  const colorCells = S.tokens.filter(t => t.c === color).map(t => t.cell);
  if (colorCells.length < 4) return null;

  const colorSet = new Set(colorCells);
  const compSeen = new Set();

  for (const start of colorCells) {
    if (compSeen.has(start)) continue;
    const comp = [], bfsQ = [start];
    compSeen.add(start);
    for (let qi = 0; qi < bfsQ.length; qi++) {
      const cur = bfsQ[qi]; comp.push(cur);
      for (const n of _neighborCellIds(cur)) {
        if (colorSet.has(n) && !compSeen.has(n)) { compSeen.add(n); bfsQ.push(n); }
      }
    }
    if (comp.length < 4) continue;

    const wallSet = new Set(comp);
    const regions = _barrageRegions(wallSet, occupied, ALL_CELL_IDS);
    if (regions.length < 2) continue;

    // Pocket = whichever region never reaches the board edge, if one exists (fully enclosed);
    // otherwise every region touches the edge, so fall back to the smallest one.
    const enclosed = regions.filter(r => !r.some(id => BORDER_CELLS.has(id)));
    const pocket = (enclosed.length ? enclosed : regions).reduce((a, b) => a.length <= b.length ? a : b);
    const pocketTouchesBorder = !enclosed.length;

    let chain = _orderChain(_frontierOf(wallSet, new Set(pocket)));
    chain = _extendChainTo4(chain, wallSet, pocketTouchesBorder);
    if (chain.length < 4) continue;

    return pocketTouchesBorder ? chain : [...chain, chain[0]];
  }
  return null;
}

// Draws (or clears) the barrage path for `color` on #arrows-svg. Closed → polygon, open → polyline.
function _drawBarrageLine(color, path) {
  const svg = document.getElementById('arrows-svg');
  if (!svg) return;
  const lineId = `barrage-line-${color}`;
  const old = document.getElementById(lineId);
  if (old) old.remove();
  if (!path || path.length < 2 || !LO) return;

  const isClosed = path[0] === path[path.length - 1];
  const pts = (isClosed ? path.slice(0, -1) : path)
    .map(id => { const cv = LO.byId.get(id); return `${cv.x},${cv.y}`; });

  const el = document.createElementNS('http://www.w3.org/2000/svg', isClosed ? 'polygon' : 'polyline');
  el.id = lineId;
  el.setAttribute('points', pts.join(' '));
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', '#ff4343');
  el.setAttribute('stroke-width', LO.r * 0.1);
  el.setAttribute('stroke-linecap', 'round');
  el.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(el);
}

// Corner warning icons, gated by showAlertIcons — the barrage line itself is _clearBoardAids.
function _clearAlertIcons() {
  for (const color of ['white', 'black']) {
    document.getElementById(`capture-icon-${color}`)?.classList.remove('visible');
    document.getElementById(`sniper-capture-icon-${color}`)?.classList.remove('visible');
    document.getElementById(`encirclement-icon-${color}`)?.classList.remove('visible');
    document.getElementById(`barrage-icon-${color}`)?.classList.remove('visible');
  }
}

function _clearBoardAids() {
  _drawBarrageLine('w', null);
  _drawBarrageLine('b', null);
}

function _updateBoardStatusIcons() {
  for (const color of ['white', 'black']) {
    const c = color === 'white' ? 'w' : 'b';
    const capTeamEl = document.getElementById(`capture-icon-${color}`);
    if (capTeamEl) capTeamEl.classList.toggle('visible', showAlertIcons && _checkStandardCaptureCondition(c));
    const sniperCapTeamEl = document.getElementById(`sniper-capture-icon-${color}`);
    if (sniperCapTeamEl) sniperCapTeamEl.classList.toggle('visible', showAlertIcons && _checkSniperCaptureCondition(c));
    const encTeamEl = document.getElementById(`encirclement-icon-${color}`);
    if (encTeamEl) encTeamEl.classList.toggle('visible', showAlertIcons && _checkEncirclementCondition(c));

    const barragePath = (showAlertIcons || showBarrageLine) ? _findBarragePath(c) : null;
    const barTeamEl    = document.getElementById(`barrage-icon-${color}`);
    if (barTeamEl) barTeamEl.classList.toggle('visible', showAlertIcons && !!barragePath);
    _drawBarrageLine(c, showBarrageLine ? barragePath : null);
  }
}
