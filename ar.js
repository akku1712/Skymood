document.getElementById('overlay-toggle').addEventListener('change', (e) => {
  if (e.target.checked) {
    enableOverlay();
  } else {
    disableOverlay();
  }
});

function enableOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'env-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'url("sunrise.gif") center/cover no-repeat';
  overlay.style.opacity = 0.4;
  overlay.style.zIndex = 9999;
  document.body.appendChild(overlay);
}

function disableOverlay() {
  const overlay = document.getElementById('env-overlay');
  if (overlay) overlay.remove();
}