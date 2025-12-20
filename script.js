(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('nav-open', open);
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Close on link click (mobile)
  menu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && target.classList.contains('nav-link')) {
      setOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  // Active link highlighting
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sectionIds = links
    .map((link) => link.getAttribute('href'))
    .filter((href) => href && href.startsWith('#'))
    .map((href) => href.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => el instanceof HTMLElement);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible?.target?.id) return;

        const activeId = visible.target.id;
        for (const link of links) {
          const isActive = link.getAttribute('href') === `#${activeId}`;
          link.classList.toggle('is-active', isActive);
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0.1, 0.2, 0.35],
      }
    );

    for (const section of sections) observer.observe(section);
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
