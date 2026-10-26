(() => {
  const root = document.documentElement;
  const key = 'sama-theme';
  const toggle = document.querySelector('[data-theme-toggle]');
  let saved = null;
  try { saved = localStorage.getItem(key); } catch (_) {}
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : (systemDark ? 'dark' : 'light');
  const update = () => {
    if (!toggle) return;
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', dark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
    toggle.setAttribute('title', dark ? 'الوضع الفاتح' : 'الوضع الداكن');
    toggle.querySelector('.theme-dark')?.classList.toggle('sr-only', dark);
    toggle.querySelector('.theme-light')?.classList.toggle('sr-only', !dark);
  };
  update();
  toggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(key, root.dataset.theme); } catch (_) {}
    update();
  });
})();
