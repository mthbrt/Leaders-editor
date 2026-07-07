(function () {
  const fill   = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');

  // Noir first — the palette always shows jetons_noir, so those are the most critical.
  const srcs = [];
  for (let i = 1; i <= 26; i++) srcs.push(`jetons_noir/${i}.png`);
  for (let i = 1; i <= 26; i++) srcs.push(`jetons_blanc/${i}.png`);
  srcs.push('ui/ban.png');

  let loaded   = 0;
  let finished = false;
  const total   = srcs.length;
  const startMs = performance.now();

  function finish() {
    if (finished) return;
    finished = true;
    fill.style.width = '100%';
    // Minimum 300ms so the title animation has time to play.
    const delay = Math.max(0, 300 - (performance.now() - startMs));
    setTimeout(() => {
      loader.classList.add('loader-out');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      setTimeout(() => loader.remove(), 900);
    }, delay);
  }

  function onProgress() {
    if (finished) return;
    fill.style.width = (++loaded / total * 100) + '%';
    if (loaded >= total) finish();
  }

  for (const src of srcs) {
    const img   = new Image();
    img.onload  = onProgress;
    img.onerror = onProgress; // don't block on missing files
    img.src     = src;
  }
})();
