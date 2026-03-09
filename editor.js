// ── CONFIG ────────────────────────────────────────────────────────────────────
const R      = 3;
const SQ3    = Math.sqrt(3);
const PAL_W_MIN = 72;  // minimum palette width
const PAL_G  = 8;
const PAL_C  = 3;
const CR     = 0.79;
const H_MAX  = 60;
const T_RNG  = [3, 24];

const HL = new Set([0,3,4,8,9,14,15,21,22,27,28,32,33,36]);
const SP = new Set([15,21]);

const C = {
  bg:        '#0f0f20',
  board:     '#181830',
  cellEdge:  'rgba(80,80,200,0.35)',
  palBg:     '#1a1a30',
  palDiv:    '#2a2a50',
  palCell:   '#1a1a3a',
  palCellBd: '#2e2e68',
  palHdr:    '#7070c0',
  lLtr:      'rgba(60,60,120,0.85)',
};

const PAL_HEADER_H = 36;

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

// ── BOARD IMAGE ───────────────────────────────────────────────────────────────
const BOARD_IMG = new Image();
BOARD_IMG.src = 'board.png';
BOARD_IMG.onload = render;

// ── IMAGES ────────────────────────────────────────────────────────────────────
const IMGS = new Map();
const ALL_NAMES = Array.from({length:T_RNG[1]-T_RNG[0]+1},(_,i)=>String(i+T_RNG[0]));

function getImg(name,c) {
  const k=c+'/'+name;
  if (!IMGS.has(k)) { const i=new Image(); i.src=`jetons_${c}/${name}.png`; i.onload=render; IMGS.set(k,i); }
  return IMGS.get(k);
}
function preload() {
  for (const n of [...ALL_NAMES,'1','2']) for (const c of ['blanc','noir']) getImg(n,c);
}

// ── ÉTAT ──────────────────────────────────────────────────────────────────────
const mkState = () => ({
  tokens: [{id:0,cell:21,name:'1',c:'w'},{id:1,cell:15,name:'2',c:'b'}],
  palette: ALL_NAMES.slice(),
  nid: 2,
  arrows: [],   // [{id, from_cell, to_cell, mx, my, color}]
  arrowNid: 0,
});
let S = mkState();

// ── HISTORIQUE ────────────────────────────────────────────────────────────────
let hist=[], hidx=-1;
const saveH = () => {
  hist=hist.slice(0,hidx+1); hist.push(JSON.stringify(S));
  if(++hidx, hist.length>H_MAX){hist.shift();hidx--;}
};
const restH = e => { S=JSON.parse(e); Arrows.clearSelected(); render(); };
const undo  = () => hidx>0             && restH(hist[--hidx]);
const redo  = () => hidx<hist.length-1 && restH(hist[++hidx]);

// ── LAYOUT ────────────────────────────────────────────────────────────────────

let LO = {};
function relayout() {
  const cv  = document.getElementById('board-canvas');
  const dpr = devicePixelRatio || 1;
  const W   = cv.parentElement.clientWidth  || 800;
  const H   = cv.parentElement.clientHeight || 560;
  cv.width  = W * dpr; cv.height  = H * dpr;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';

  // Estimate token radius for palette width calculation
  const spEst = Math.min(W / ((2*R+1)*1.5+0.5), H / ((2*R+1.5)*SQ3)) * 0.90;
  const rEst  = spEst * CR;

  // Palette geometry (accounts for collapsed state)
  const { palX, palY, palW, palH } = Palette.layout(W, H, rEst);

  // Board — centered on the full canvas
  const sp = Math.min(W / ((2*R+1)*1.5+0.5), H / ((2*R+1.5)*SQ3)) * 0.90;
  const r  = sp * CR, cx = W / 2, cy = H / 2;
  const cells = CELLS.map(c => ({
    ...c,
    x: cx + sp * 1.5 * c.q,
    y: cy + sp * (SQ3/2 * c.q + SQ3 * c.r)
  }));
  const byId = new Map(cells.map(c => [c.id, c]));
  const hs   = Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + r * 1.6;
  const psz  = r * 2;

  // bW: left boundary of palette area (used for arrow / board hit exclusion)
  const bW = palX - 8;

  LO = { W, H, bW, dpr, r, cx, cy, cells, byId, hs,
         psz, pgap: PAL_G, palW, palH, palX, palY,
         scrollBarW: 6, scrollMargin: 6 };
}

// ── LABELS TOGGLE ─────────────────────────────────────────────────────────────
let showLabels  = true;
let showOutline = false;

// ── HIT TESTING ───────────────────────────────────────────────────────────────
const cvXY = e => {
  const b=document.getElementById('board-canvas').getBoundingClientRect();
  return {x:e.clientX-b.left, y:e.clientY-b.top};
};
function nearCell(x,y){
  let best=null,bd=Infinity;
  for(const c of LO.cells){const d=Math.hypot(c.x-x,c.y-y);if(d<LO.r*1.3&&d<bd){bd=d;best=c;}}
  return best;
}
function tokAt(x,y){
  for(let i=S.tokens.length-1;i>=0;i--){
    const t=S.tokens[i],c=LO.byId.get(t.cell);
    if(c&&Math.hypot(x-c.x,y-c.y)<LO.r*0.9) return t;
  }
  return null;
}
// Delegated to Palette module
const palAt      = (x, y) => Palette.palAt(x, y);
const inPalette  = (x, y) => Palette.inPalette(x, y);
// ── EVENTS ────────────────────────────────────────────────────────────────────
let drag=null, dpos=null, justDropped=false;
let mousePos={x:0,y:0};

function onDown(e){
  const{x,y}=cvXY(e); const inP=inPalette(x,y);

  // Right-click → delegated to Arrows (never on palette)
  if(e.button===2){ e.preventDefault(); if(!inP) Arrows.onDown(e,x,y); return; }

  // Middle click → toggle token color
  if(e.button===1){
    e.preventDefault();
    if(!inP){const t=tokAt(x,y);if(t)toggleC(t.id);}
    return;
  }

  if(e.button!==0) return;

  // Palette toggle / scroll-area click
  if(inP){
    if(Palette.onDown(x,y)) return;  // consumed by toggle button
    const n=palAt(x,y);
    if(n){drag={type:'pal',name:n,c:'w'};dpos={x,y};render();}
    return;
  }

  // Board: arrows first, then token drag
  const consumed=Arrows.onDown(e,x,y);
  if(consumed) return;
  const t=tokAt(x,y); if(t){drag={type:'brd',id:t.id};dpos={x,y};render();}
}

function onMove(e){
  const{x,y}=cvXY(e);
  mousePos={x,y};

  // Let Arrows handle mid-drag first
  const arrowConsumed=Arrows.onMove(x,y);
  if(arrowConsumed) return;

  if(drag){ dpos={x,y}; render(); }
}

function onUp(e){
  const{x:ux,y:uy}=cvXY(e);
  if(Arrows.onUp(e,ux,uy)) return;
  if(!drag||e.button!==0) return;
  const{x,y}=cvXY(e);
  const cell=nearCell(x,y), inP=inPalette(x,y);
  if(drag.type==='brd'){
    const tok=S.tokens.find(t=>t.id===drag.id);
    if(tok){
      if(inP){S.tokens=S.tokens.filter(t=>t.id!==drag.id);S.palette=[...S.palette,tok.name].sort((a,b)=>+a-+b);saveH();}
      else if(cell){
        const other=S.tokens.find(t=>t.cell===cell.id&&t.id!==drag.id);
        if(other){
          // swap: dragged token goes to target cell, other goes to dragged token's original cell
          const fromCell=tok.cell;
          S.tokens=S.tokens.map(t=>t.id===drag.id?{...t,cell:cell.id}:t.id===other.id?{...t,cell:fromCell}:t);
        } else {
          S.tokens=S.tokens.map(t=>t.id===drag.id?{...t,cell:cell.id}:t);
        }
        saveH();
      }
    }
  } else if(drag.type==='pal'){
    if(!inP&&cell&&!S.tokens.find(t=>t.cell===cell.id)){
      S.tokens=[...S.tokens,{id:S.nid++,cell:cell.id,name:drag.name,c:drag.c}];
      S.palette=S.palette.filter(n=>n!==drag.name); saveH();
    }
  }
  drag=null; dpos=null; justDropped=true; render();
}

function onWheel(e){
  const{x,y}=cvXY(e);
  if(Palette.onWheel(x, y, e.deltaY)){ e.preventDefault(); }
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function toggleC(id){S.tokens=S.tokens.map(t=>t.id===id?{...t,c:t.c==='w'?'b':'w'}:t);saveH();render();}
function doReset(){
  S=mkState();
  Arrows.resetState(); saveH(); render();
}
function doLoad(){
  const raw=document.getElementById('input-state').value.trim(); if(!raw)return;
  const{tokens}=dec(raw); const used=new Set(tokens.map(t=>t.name));
  S={tokens:tokens.map((t,i)=>({...t,id:i})),palette:ALL_NAMES.filter(n=>!used.has(n)),nid:tokens.length,arrows:[],arrowNid:0};
  palScrollY=0; Arrows.clearSelected();
  saveH(); render();
}
function doCopy(){
  navigator.clipboard.writeText(enc(S)).then(()=>{
    const b=document.getElementById('btn-copy'),o=b.textContent;
    b.textContent='Copied !'; setTimeout(()=>b.textContent=o,1500);
  });
}

// ── RENDER HELPERS ────────────────────────────────────────────────────────────
const PI2=Math.PI*2;
const imgOk=i=>i.complete&&i.naturalWidth>0;

function hexPath(ctx,cx,cy,sz,cr){
  const pts=Array.from({length:6},(_,i)=>{const a=Math.PI/3*i+Math.PI/6;return[cx+sz*Math.cos(a),cy+sz*Math.sin(a)];});
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const p=pts[(i+5)%6],cv2=pts[i],n=pts[(i+1)%6];
    const li=Math.hypot(cv2[0]-p[0],cv2[1]-p[1]),lo=Math.hypot(n[0]-cv2[0],n[1]-cv2[1]);
    const rv=Math.min(cr,li/2,lo/2);
    const ix=cv2[0]-(cv2[0]-p[0])/li*rv, iy=cv2[1]-(cv2[1]-p[1])/li*rv;
    const ox=cv2[0]+(n[0]-cv2[0])/lo*rv, oy=cv2[1]+(n[1]-cv2[1])/lo*rv;
    i===0?ctx.moveTo(ix,iy):ctx.lineTo(ix,iy);
    ctx.quadraticCurveTo(cv2[0],cv2[1],ox,oy);
  }
  ctx.closePath();
}

function drawBoard(ctx,cx,cy,hs){
  // Draw board image clipped to hex shape
  hexPath(ctx,cx,cy,hs,hs*0.02);
  ctx.save();
  ctx.clip();
  if(BOARD_IMG.complete && BOARD_IMG.naturalWidth > 0){
    const iw = hs * Math.sqrt(3);
    const ih = hs * 2;
    ctx.drawImage(BOARD_IMG, cx - iw/2, cy - ih/2, iw, ih);
  } else {
    ctx.fillStyle=C.board; ctx.fill();
  }
  ctx.restore();
}

function drawCell(ctx,x,y,r,hl,sp,tgt){
  // Drop-target highlight: semi-transparent fill
  if(tgt){
    ctx.beginPath(); ctx.arc(x,y,r,0,PI2);
    ctx.fillStyle='rgba(100,100,100,0.25)'; ctx.fill();
  }
}

function drawLabel(ctx,c,fs){
  const lbl=LABELS[c.id]??'', letter=lbl[0]??'', num=lbl.slice(1);
  ctx.save(); ctx.font=`bold ${fs}px 'Segoe UI',sans-serif`;
  ctx.textAlign='left'; ctx.textBaseline='middle';
  const lw=ctx.measureText(letter).width, nw=ctx.measureText(num).width;
  const sx=c.x-(lw+nw)/2;
  // Dark colors for readability on light board image
  ctx.fillStyle='rgb(168, 164, 148)'; ctx.fillText(letter,sx,c.y);
  const numColors=['#ff3f3f','#31be60','#4c99ff','#ff73c2','rgb(215, 160, 65)','#12aaaa','#a938ff'];
  ctx.fillStyle=numColors[(+num-1)%numColors.length]??'rgba(60,60,120,0.85)'; ctx.fillText(num,sx+lw,c.y);
  ctx.restore();
}

function drawToken(ctx, x, y, r, name, c) {
  const im = getImg(name, c === 'w' ? 'blanc' : 'noir');
  if (imgOk(im)) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, PI2); ctx.clip();
    ctx.drawImage(im, x - r, y - r, r * 2, r * 2);
    // Outline drawn inside the clip so it never bleeds outside the token
    if (showOutline) {
      const lw = Math.max(0, r * 0.08);
      ctx.beginPath(); ctx.arc(x, y, r - lw / 2, 0, PI2);
      ctx.strokeStyle = c === 'w' ? '#ffffff' : '#000000';
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    ctx.restore();
  } else {
    ctx.beginPath(); ctx.arc(x, y, r, 0, PI2);
    ctx.fillStyle = c === 'w' ? '#d0d0e8' : '#202038';
    ctx.strokeStyle = c === 'w' ? '#7070b0' : '#4848a0';
    ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    ctx.fillStyle = c === 'w' ? '#1a1a44' : '#aaaacc';
    ctx.font = `bold ${Math.round(r * .8)}px 'Segoe UI',sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(name, x, y);
  }
}

// ── CURSOR ────────────────────────────────────────────────────────────────────
function updateCursor(){
  const cv=document.getElementById('board-canvas');
  const{x,y}=mousePos; const inP=inPalette(x,y);
  if(drag){ cv.style.cursor='grabbing'; return; }
  if(!inP){
    if(Arrows.updateCursor(cv,x,y)) return;
    if(tokAt(x,y)){ cv.style.cursor='grab'; return; }
  }
  cv.style.cursor='default';
}

// ── MAIN RENDER ───────────────────────────────────────────────────────────────
function render(){
  const cv=document.getElementById('board-canvas'), ctx=cv.getContext('2d');
  const{W,H,bW,dpr,r,cells,byId,hs,cx,cy}=LO;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.clearRect(0,0,W,H);

  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  drawBoard(ctx,cx,cy,hs);

  const dtgt=drag&&dpos?nearCell(dpos.x,dpos.y):null;
  const dcell=drag?.type==='brd'?S.tokens.find(t=>t.id===drag.id)?.cell:-1;
  const occ=new Set(S.tokens.map(t=>t.cell));
  const fs=Math.max(7,Math.round(r*0.36));
  const arrowSrcCell=Arrows.getArrowSrc();

  // Cells
  for(const c of cells){
    drawCell(ctx,c.x,c.y,r,HL.has(c.id),SP.has(c.id),dtgt?.id===c.id,arrowSrcCell===c.id);
    if(showLabels && (!occ.has(c.id)||c.id===dcell)) drawLabel(ctx,c,fs);
  }

  // Tokens
  for(const t of S.tokens){
    if(drag?.type==='brd'&&drag.id===t.id) continue;
    const c=byId.get(t.cell); if(!c) continue;
    drawToken(ctx,c.x,c.y,r,t.name,t.c);
  }

  // Arrows — always on top of tokens
  Arrows.draw(ctx);
  Arrows.drawPreview(ctx);

  // Palette panel — floating, drawn on top
  Palette.draw(ctx);

  // Dragged token ghost
  if(drag&&dpos){
    const t=drag.type==='brd'?S.tokens.find(t=>t.id===drag.id):{name:drag.name,c:drag.c};
    if(t){ctx.globalAlpha=0.75;drawToken(ctx,dpos.x,dpos.y,drag.type==='brd'?r:LO.psz/2*0.90,t.name,t.c);ctx.globalAlpha=1;}
  }

  document.getElementById('output-state').textContent=enc(S);
  updateCursor();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init(){
  const cv=document.getElementById('board-canvas');
  cv.addEventListener('mousedown',  onDown);
  cv.addEventListener('mousemove',  e=>{ mousePos=cvXY(e); onMove(e); });
  cv.addEventListener('mouseup',    onUp);
  cv.addEventListener('click',      e=>{if(justDropped){justDropped=false;}});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('mouseleave', ()=>{ drag=null; dpos=null; render(); });
  cv.addEventListener('wheel',      onWheel,{passive:false});

  window.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo();}
    if((e.ctrlKey||e.metaKey)&&e.key==='y'){e.preventDefault();redo();}
    if(e.key==='ArrowLeft')  undo();
    if(e.key==='ArrowRight') redo();
    Arrows.onKey(e);
  });

  document.getElementById('input-state').addEventListener('keydown',e=>{if(e.key==='Enter')doLoad();});
  document.getElementById('btn-copy'  ).addEventListener('click',doCopy);
  document.getElementById('btn-undo'  ).addEventListener('click',undo);
  document.getElementById('btn-redo'  ).addEventListener('click',redo);
  document.getElementById('btn-reset' ).addEventListener('click',doReset);
  document.getElementById('btn-labels').addEventListener('click', () => {
    showLabels = !showLabels;
    document.getElementById('btn-labels').classList.toggle('active', showLabels);
    render();
  });
  document.getElementById('btn-outline').addEventListener('click', () => {
    showOutline = !showOutline;
    document.getElementById('btn-outline').classList.toggle('active', showOutline);
    render();
  });

  Arrows.init();

  new ResizeObserver(()=>{relayout();render();}).observe(document.getElementById('main'));
  preload(); relayout(); saveH(); render();
}

document.addEventListener('DOMContentLoaded',init);