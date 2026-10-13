// Apply before the stylesheet loads to avoid flashing the wrong theme.
(() => {
  let theme;
  try {theme=localStorage.getItem('algoscope-theme');} catch {}
  if(theme!=='dark'&&theme!=='light')theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.dataset.theme=theme;
})();
