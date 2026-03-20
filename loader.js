(function () {
  const fill   = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');

  // Build the full list of token images to preload (1–24, noir + blanc)
  const names = Array.from({ length: 24 }, (_, i) => String(i + 1));
  const srcs  = [];
  for (const n of names) {
    srcs.push(`jetons_noir/${n}.png`);
    srcs.push(`jetons_blanc/${n}.png`);
  }

  let loaded = 0;
  const total = srcs.length;

  function onProgress() {
    loaded++;
    fill.style.width = (loaded / total * 100) + '%';
    if (loaded >= total) finish();
  }

  function finish() {
    fill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('loader-out');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 380);
  }

  // Start preloading after a brief initial pause
  setTimeout(() => {
    for (const src of srcs) {
      const img = new Image();
      img.onload  = onProgress;
      img.onerror = onProgress; // don't block on missing files
      img.src     = src;
    }
  }, 150);
})();