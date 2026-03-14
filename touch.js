// ── TOUCH SUPPORT ─────────────────────────────────────────────────────────────
// Adds touch & long-press support to the LEADERS editor.
//
// Gesture mapping:
//   • Tap                  → left-click (select / arrow select / palette item)
//   • Long press (≥420ms)  → right-click (draw arrow start OR token context menu)
//   • Drag after long press→ arrow-draw drag
//   • Touch drag (≥8px)    → token drag / arrow bend drag
//   • Double tap on token  → toggle team colour (replaces middle-click)
//   • Two-finger           → ignored (native pinch/scroll)
//
// This file must be loaded AFTER editor.js.

(function () {
  'use strict';

  const LONG_MS  = 420;
  const MOVE_THR = 8;
  const DTAP_MS  = 300;

  function mainXY(touch) {
    const b = document.getElementById('main').getBoundingClientRect();
    return { x: touch.clientX - b.left, y: touch.clientY - b.top };
  }

  function fakeEvt(button) {
    return { button, preventDefault: () => {}, stopPropagation: () => {}, _synthetic: true };
  }

  function showRipple(clientX, clientY) {
    const el = document.createElement('div');
    el.className = 'longpress-ripple';
    el.style.left = clientX + 'px';
    el.style.top  = clientY + 'px';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  let _t0         = null;
  let _longTimer  = null;
  let _longFired  = false;
  let _arrowMode  = false;
  let _moved      = false;
  let _leftDragStarted = false;

  let _lastTapTime = 0;
  let _lastTapPos  = null;

  function _cancelLong() { clearTimeout(_longTimer); _longTimer = null; }

  function _reset() {
    _t0 = null; _longFired = false; _arrowMode = false;
    _moved = false; _leftDragStarted = false;
  }

  function onTouchStart(e) {
    if (e.touches.length > 1) {
      _cancelLong();
      if (typeof drag !== 'undefined' && drag !== null) {
        onUp(Object.assign(fakeEvt(0), { clientX: 0, clientY: 0 }));
      }
      _reset(); return;
    }
    const t = e.touches[0];
    const pos = mainXY(t);
    _t0 = { x: pos.x, y: pos.y, clientX: t.clientX, clientY: t.clientY };
    _moved = _longFired = _arrowMode = _leftDragStarted = false;

    _longTimer = setTimeout(() => {
      if (_moved) return;
      _longFired = true; _arrowMode = true;
      showRipple(_t0.clientX, _t0.clientY);
      onDown(Object.assign(fakeEvt(2), { clientX: _t0.clientX, clientY: _t0.clientY }));
    }, LONG_MS);
  }

  function onTouchMove(e) {
    if (e.touches.length > 1) return;
    if (!_t0) return;
    const t = e.touches[0];
    const pos = mainXY(t);

    if (!_moved && Math.hypot(pos.x - _t0.x, pos.y - _t0.y) > MOVE_THR) {
      _moved = true;
      if (!_longFired) {
        _cancelLong();
        // Start a left-drag from the original touch position
        _leftDragStarted = true;
        onDown(Object.assign(fakeEvt(0), { clientX: _t0.clientX, clientY: _t0.clientY }));
      }
    }

    if (typeof mousePos !== 'undefined') { mousePos.x = pos.x; mousePos.y = pos.y; }
    onMove(Object.assign(fakeEvt(0), { clientX: t.clientX, clientY: t.clientY }));

    if (_longFired || _leftDragStarted || (typeof drag !== 'undefined' && drag !== null)) {
      e.preventDefault();
    }
  }

  function onTouchEnd(e) {
    _cancelLong();
    const t = e.changedTouches[0];
    const pos = mainXY(t);

    if (_arrowMode && _longFired) {
      onUp(Object.assign(fakeEvt(2), { clientX: t.clientX, clientY: t.clientY }));
    } else if (_moved || _leftDragStarted) {
      onUp(Object.assign(fakeEvt(0), { clientX: t.clientX, clientY: t.clientY }));
    } else {
      // Short tap
      const now = Date.now();
      if (_lastTapPos && now - _lastTapTime < DTAP_MS &&
          Math.hypot(pos.x - _lastTapPos.x, pos.y - _lastTapPos.y) < 30) {
        _lastTapTime = 0; _lastTapPos = null;
        const tok = tokAt(pos.x, pos.y);
        if (tok) { toggleC(tok.id); _reset(); return; }
      } else {
        _lastTapTime = now; _lastTapPos = pos;
      }
      onDown(Object.assign(fakeEvt(0), { clientX: t.clientX, clientY: t.clientY }));
      onUp  (Object.assign(fakeEvt(0), { clientX: t.clientX, clientY: t.clientY }));
    }
    _reset();
  }

  function onTouchCancel(e) {
    _cancelLong();
    if (typeof drag !== 'undefined' && drag !== null) {
      onUp(Object.assign(fakeEvt(0), { clientX: 0, clientY: 0 }));
    }
    _reset();
  }

  function attach() {
    const main = document.getElementById('main');
    if (!main) return;
    main.addEventListener('touchstart',  onTouchStart,  { passive: true  });
    main.addEventListener('touchmove',   onTouchMove,   { passive: false });
    main.addEventListener('touchend',    onTouchEnd,    { passive: true  });
    main.addEventListener('touchcancel', onTouchCancel, { passive: true  });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();