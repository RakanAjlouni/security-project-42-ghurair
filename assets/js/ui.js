"use strict";
// Pure presentation enhancements; security simulation logic lives in the lab scripts.
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll <= 0 ? 100 : Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    document.body.style.setProperty('--scroll-progress', `${pct}%`);
  };
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.lab-card, .how, .lab-content > .card');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px 40px 0px', threshold: .05 });
    items.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
  }

  const labSections = document.querySelectorAll('.lab-content section[id]');
  if (labSections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        document.querySelectorAll('.section-nav a').forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
      }
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    labSections.forEach(section => sectionObserver.observe(section));
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.append(toast);
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
  }
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.closest('.code-shell').querySelector('pre');
      const value = pre.textContent;
      let copied = false;
      try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(value); copied = true; } }
      catch (_) { /* local file fall back */ }
      if (!copied) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.cssText = 'position:fixed;left:-10000px;top:-10000px';
        document.body.append(textarea); textarea.select();
        try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
        textarea.remove();
      }
      showToast(copied ? 'Code copied to clipboard' : 'Could not copy — select the code manually');
    });
  });
})();