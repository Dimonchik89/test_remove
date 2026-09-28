function setTheme() {
  document.documentElement.classList.toggle(
    'dark',
    localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  );
}

function getTheme(): string {
  return localStorage.getItem('theme') as string;
}

function themeToggle() {
  if (localStorage.getItem('theme') == 'dark') {
    console.log('light');

    localStorage.setItem('theme', 'light');
  } else {
    console.log('dark');

    localStorage.setItem('theme', 'dark');
  }

  setTheme();
}

export { setTheme, themeToggle, getTheme };
