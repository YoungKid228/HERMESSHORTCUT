// Табы + якорная навигация + синхронизация топбара.
(function () {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function scrollTabIntoView(btn) {
    if (!btn) return;
    const strip = btn.parentElement;
    if (strip.scrollWidth <= strip.clientWidth) return;
    const left = btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }

  function activate(name, scroll) {
    let active = null;
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) active = t;
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === name));
    scrollTabIntoView(active);
    if (scroll) {
      const target = document.getElementById(name);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    history.replaceState(null, '', '#' + name);
  }

  tabs.forEach((t) => {
    t.addEventListener('click', () => activate(t.dataset.tab, false));
  });

  // Ссылки из топбара ведут на секции — открываем нужную вкладку.
  document.querySelectorAll('.topnav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (id === 'top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (!document.getElementById(id)) return;
      e.preventDefault();
      activate(id, true);
    });
  });

  // Если пришли по якорю — активируем нужную вкладку.
  const hash = location.hash.slice(1);
  if (hash && hash !== 'top' && document.getElementById(hash)) {
    activate(hash, false);
  }

  // Индикатор «лента табов прокручивается» на мобильных.
  const strip = document.querySelector('.tabs');
  const wrap = document.querySelector('.tabs-wrap');
  if (strip && wrap) {
    const update = () => {
      const more = strip.scrollWidth - strip.clientWidth - strip.scrollLeft > 4;
      wrap.classList.toggle('can-scroll', more);
    };
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
