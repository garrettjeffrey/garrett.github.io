const toggleBtn = document.getElementById('theme-toggle');
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☾' : '☼';
}
(function initTheme() {
  const stored = localStorage.getItem('theme');
  setTheme(stored || 'dark');
})();
toggleBtn.addEventListener('click', () => {
  setTheme(document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
document.getElementById('year').textContent = new Date().getFullYear();