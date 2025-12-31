const toggleBtn = document.getElementById('theme-toggle');

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

const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveLink(activeId) {
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${activeId}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if (sections.length) {
  const sectionVisibility = new Map(sections.map((section) => [section.id, 0]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const visibleSections = Array.from(sectionVisibility.entries()).filter(([, ratio]) => ratio > 0);
      if (!visibleSections.length) return;

      visibleSections.sort((a, b) => b[1] - a[1]);
      setActiveLink(visibleSections[0][0]);
    },
    {
      threshold: [0.25, 0.5, 0.75, 1],
      rootMargin: '-10% 0px -25% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}
