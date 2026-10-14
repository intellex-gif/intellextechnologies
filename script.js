(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


  // Persistent light/dark theme
  const root = document.documentElement;
  const themeButtons = $$('.theme-toggle');
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('intellex-theme') || 'dark'; } catch (_) {}
  root.dataset.theme = savedTheme;
  const syncThemeButtons = () => themeButtons.forEach(button => {
    const light = root.dataset.theme === 'light';
    button.textContent = light ? '☾' : '☼';
    button.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    button.title = light ? 'Switch to dark mode' : 'Switch to light mode';
  });
  syncThemeButtons();
  themeButtons.forEach(button => button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('intellex-theme', root.dataset.theme); } catch (_) {}
    syncThemeButtons();
  }));

  // Contact form prepares an email draft; it does not pretend to send messages.
  const contactForm = $('#contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Project enquiry — ${data.get('service')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\\nEmail: ${data.get('email')}\\nService: ${data.get('service')}\\n\\nProject details:\\n${data.get('message')}`
    );
    const feedback = $('.form-feedback', contactForm);
    if (feedback) feedback.textContent = 'Opening your email app with the enquiry details. Please review and send the email there.';
    window.location.href = `mailto:info@intellextechnologies.org?subject=${subject}&body=${body}`;
  });

  // Mobile navigation
  const toggle = $('.menu-toggle');
  const nav = $('.nav-links');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
  }));

  // Webflow-inspired motion system: reveal content, add depth, and track scroll progress.
  document.documentElement.classList.add('motion-ready');
  document.body.classList.add('page-ready');

  // Create a thin scroll-progress bar on every page.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const progressBar = $('span', progress);
  let scrollTicking = false;
  const updateScrollMotion = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    $('.site-header')?.classList.toggle('scrolled', window.scrollY > 12);
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollMotion);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollMotion();

  // Add staggered scroll reveals to important sections and cards across all pages.
  const motionTargets = $$('main section, main .service-card, main .project-card, main .about-grid > *, main .process-step, main .contact-detail, main .inner-cta');
  motionTargets.forEach((el, index) => {
    if (!el.classList.contains('reveal')) el.classList.add('auto-reveal');
    el.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
  });

  // Progressive reveal as content enters the viewport
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal, .auto-reveal').forEach(el => revealObserver.observe(el));

  // Project filtering
  const filterButtons = $$('.filter-button');
  const projectCards = $$('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle('active', b === button));
      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });
  $$('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
      const target = $(`[data-filter="${link.dataset.filterLink}"]`);
      target?.click();
    });
  });

  // Gentle 3D tilt on pointer devices only
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-tilt], .service-card, .project-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.transform = `perspective(850px) rotateX(${(0.5-y)*4}deg) rotateY(${(x-0.5)*5}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    const glow = $('.cursor-glow');
    window.addEventListener('pointermove', event => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (glow) glow.style.opacity = '0'; });
  }

  // Gentle scroll parallax on the hero artwork, disabled for reduced-motion users.
  const heroVisual = $('.hero-visual');
  if (heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(() => {
        const rect = heroVisual.getBoundingClientRect();
        const offset = Math.max(-22, Math.min(22, (window.innerHeight * .5 - (rect.top + rect.height * .5)) * .035));
        heroVisual.style.setProperty('--scroll-depth', `${offset}px`);
        heroVisual.style.translate = `0 ${offset}px`;
        parallaxTicking = false;
      });
    }, { passive: true });
  }

  // Current year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();