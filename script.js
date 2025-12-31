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

function setInitialActiveLink() {
  const hashId = window.location.hash.replace('#', '');
  if (hashId && sections.some((section) => section.id === hashId)) {
    setActiveLink(hashId);
    return;
  }

  const visibleSections = sections
    .map((section) => ({ id: section.id, rect: section.getBoundingClientRect() }))
    .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
    .sort((a, b) => Math.abs(a.rect.top) - Math.abs(b.rect.top));

  if (visibleSections.length) {
    setActiveLink(visibleSections[0].id);
    return;
  }

  if (sections[0]) {
    setActiveLink(sections[0].id);
  }
}

if (sections.length) {
  setInitialActiveLink();

  const sectionVisibility = new Map(
    sections.map((section) => [section.id, { ratio: 0, top: Number.POSITIVE_INFINITY }])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.set(entry.target.id, {
          ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
          top: entry.boundingClientRect.top,
        });
      });

      const visibleSections = Array.from(sectionVisibility.entries()).filter(([, data]) => data.ratio > 0);
      if (!visibleSections.length) return;

      visibleSections.sort((a, b) => {
        const distanceA = Math.abs(a[1].top);
        const distanceB = Math.abs(b[1].top);

        if (distanceA === distanceB) {
          return b[1].ratio - a[1].ratio;
        }

        return distanceA - distanceB;
      });
      setActiveLink(visibleSections[0][0]);
    },
    {
      threshold: [0.25, 0.5, 0.75, 1],
      rootMargin: '-10% 0px -25% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}
