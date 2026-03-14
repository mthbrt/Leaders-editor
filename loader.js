(function () {
  const fill   = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');
  let pct = 0, done = false;

  function tick() {
    if (done) return;
    pct += (100 - pct) * 0.045 + 0.3;
    if (pct >= 100) {
      pct = 100; done = true;
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('loader-out');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      }, 380);
      return;
    }
    fill.style.width = pct + '%';
    requestAnimationFrame(tick);
  }

  setTimeout(() => requestAnimationFrame(tick), 300);
})();