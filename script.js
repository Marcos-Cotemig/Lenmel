/* ==================================================================
   LENMEL — Edição "Console" — script.js
   ================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Header */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* Progress bar */
  const scrollProgress = document.getElementById('scroll-progress');
  const onScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  };
  onScrollProgress();
  window.addEventListener('scroll', onScrollProgress, { passive: true });

  /* Mobile menu */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const openMenu = () => { mobileNav.classList.add('is-open'); mobileBackdrop.classList.add('is-open'); menuToggle.classList.add('is-open'); menuToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobileNav.classList.remove('is-open'); mobileBackdrop.classList.remove('is-open'); menuToggle.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  menuToggle.addEventListener('click', () => mobileNav.classList.contains('is-open') ? closeMenu() : openMenu());
  mobileBackdrop.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  /* Reveal on scroll */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(t => revealObserver.observe(t));

  /* Contadores animados (hero stats) */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* Side dots — destaca seção ativa */
  const sideDots = document.querySelectorAll('.side-dots a');
  if (sideDots.length) {
    const sectionIds = Array.from(sideDots).map(a => a.getAttribute('href').slice(1));
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const dot = document.querySelector(`.side-dots a[href="#${id}"]`);
        if (!dot) return;
        if (entry.isIntersecting) {
          sideDots.forEach(d => d.classList.remove('is-active'));
          dot.classList.add('is-active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => sectionObserver.observe(s));
  }

  /* Botões magnéticos */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--mx', (relX * 0.16) + 'px');
        btn.style.setProperty('--my', (relY * 0.3) + 'px');
      });
      btn.addEventListener('mouseleave', () => { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });
  }

  /* Back to top */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 560), { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Footer year */
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  /* Formulário -> WhatsApp */
  const WHATSAPP_NUMBER = '5531984670445';
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const nome = document.getElementById('field-nome').value.trim();
    const empresa = document.getElementById('field-empresa').value.trim();
    const email = document.getElementById('field-email').value.trim();
    const whatsapp = document.getElementById('field-whatsapp').value.trim();
    const desafio = document.getElementById('field-desafio').value.trim();
    const area = document.getElementById('field-area').value;
    const linhas = [
      `Olá! Meu nome é ${nome}.`,
      '',
      empresa ? `Empresa: ${empresa}` : null,
      '',
      `E-mail: ${email}`,
      '',
      whatsapp ? `WhatsApp: ${whatsapp}` : null,
      '', 
      area ? `Área de interesse: ${area}` : null,
      '',
      `Principal desafio: ${desafio}`
    ].filter(line => line !== null);
    const mensagem = encodeURIComponent(linhas.join('\n'));
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.classList.add('is-sent');
    submitBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Abrindo o WhatsApp...</span>';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, '_blank');
    setTimeout(() => { submitBtn.classList.remove('is-sent'); submitBtn.innerHTML = originalHTML; }, 2600);
  });


  /* ----------------------------------------------------------------
     13. MODAL "FALE COM UM ESPECIALISTA" — escolha do tema
     Abre ao clicar em qualquer botão .js-open-specialist; cada card
     leva direto ao WhatsApp da Lenmel com mensagem pronta.
     ---------------------------------------------------------------- */
  const specialistModal = document.getElementById('specialist-modal');
  const specialistBackdrop = document.getElementById('specialist-modal-backdrop');
  const specialistClose = document.getElementById('specialist-modal-close');
  const specialistTriggers = document.querySelectorAll('.js-open-specialist');

  let lastFocusedEl = null;

  const openSpecialistModal = (event) => {
    if (event) event.preventDefault();
    lastFocusedEl = document.activeElement;
    specialistModal.classList.add('is-open');
    specialistModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    specialistClose.focus();
    closeMenu();
  };

  const closeSpecialistModal = () => {
    specialistModal.classList.remove('is-open');
    specialistModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedEl) lastFocusedEl.focus();
  };

  specialistTriggers.forEach((trigger) => trigger.addEventListener('click', openSpecialistModal));
  specialistBackdrop.addEventListener('click', closeSpecialistModal);
  specialistClose.addEventListener('click', closeSpecialistModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && specialistModal.classList.contains('is-open')) closeSpecialistModal();
  });

});
