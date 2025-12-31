const toggleBtn = document.getElementById('theme-toggle');
const hero = document.querySelector('.hero');

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☾' : '☼';
}

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

(function initTheme() {
  setTheme(getPreferredTheme());

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (event) => {
    const stored = localStorage.getItem('theme');
    if (!stored) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });
})();

toggleBtn.addEventListener('click', () => {
  setTheme(document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let rafId = null;
const motionState = {
  x: 0,
  y: 0,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function applyMotion() {
  rafId = null;

  const motionX = clamp(motionState.x * 12, -8, 8);
  const motionY = clamp(motionState.y * 12, -8, 8);

  hero.style.setProperty('--hero-motion-x', `${motionX}px`);
  hero.style.setProperty('--hero-motion-y', `${motionY}px`);
}

function scheduleMotion(x, y) {
  motionState.x = clamp(x, -1, 1);
  motionState.y = clamp(y, -1, 1);

  if (rafId === null) {
    rafId = requestAnimationFrame(applyMotion);
  }
}

function handlePointerMove(event) {
  const rect = hero.getBoundingClientRect();
  const relX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5) * 2;
  const relY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5) * 2;

  scheduleMotion(relX, relY);
}

function handleDeviceOrientation(event) {
  const relX = clamp(event.gamma / 45, -1, 1);
  const relY = clamp(event.beta / 90, -1, 1);

  scheduleMotion(relX, relY);
}

function resetMotion() {
  hero.style.setProperty('--hero-motion-x', '0px');
  hero.style.setProperty('--hero-motion-y', '0px');
}

function toggleMotionListeners(enable) {
  if (!hero) return;

  if (enable) {
    hero.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  } else {
    hero.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    resetMotion();
  }
}

if (hero) {
  toggleMotionListeners(!prefersReducedMotion.matches);

  prefersReducedMotion.addEventListener('change', (event) => {
    toggleMotionListeners(!event.matches);
  });
}
