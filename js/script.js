// ============================================================
// HEAT AI — interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- nav scroll state ---------- */
  const nav = document.getElementById('siteNav');
  const progressBar = document.getElementById('progressBar');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* ---------- custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .btn, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('fr-FR');
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- hero blob parallax ---------- */
  const heroSection = document.querySelector('.hero');
  const blobA = document.querySelector('.blob-a');
  const blobB = document.querySelector('.blob-b');
  if (heroSection && canHover) {
    heroSection.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      blobA.style.transform = `translate(${x * 24}px, ${y * 24}px)`;
      blobB.style.transform = `translate(${x * -18}px, ${y * -18}px)`;
    });
  }

  /* ---------- 3D micro data center (supports multiple instances) ---------- */
  document.querySelectorAll('.scene').forEach((scene) => {
    const rig = scene.querySelector('.rig');
    const cube = scene.querySelector('.cube');
    if (!rig) return;

    if (canHover) {
      scene.addEventListener('mousemove', (e) => {
        const rect = scene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rig.style.transform = `translate(-50%,-50%) rotateX(${-y * 18}deg) rotateY(${x * 26}deg)`;
      });
      scene.addEventListener('mouseleave', () => {
        rig.style.transform = 'translate(-50%,-50%) rotateX(0deg) rotateY(0deg)';
      });
    }

    if (cube) {
      const cubeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          cube.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0.1 });
      cubeObserver.observe(scene);
    }
  });

  /* ---------- contact form (demo, no backend) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('span') && (btn.querySelector('span').textContent = '…');
      setTimeout(() => {
        note.textContent = 'Merci — votre demande a bien été enregistrée. On revient vers vous sous 48h.';
        note.style.color = 'var(--ember)';
        form.reset();
        btn.disabled = false;
        const span = btn.querySelector('span');
        if (span) span.textContent = '→';
      }, 700);
    });
  }

});
