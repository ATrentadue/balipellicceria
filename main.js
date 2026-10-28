// Bali – Pelle & Pellicce: menu, header e animazioni allo scorrimento.
(function () {
  'use strict';

  var html = document.documentElement;

  // ingresso dell'hero, dopo il primo disegno della pagina
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { html.classList.add('is-pronto'); });
  });

  var anno = document.getElementById('anno');
  if (anno) anno.textContent = new Date().getFullYear();

  // ---------- header e bottone WhatsApp ----------
  var header = document.getElementById('header');
  var whatsapp = document.querySelector('.whatsapp');
  function aggiornaHeader() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    whatsapp.classList.toggle('is-visibile', y > window.innerHeight * 0.6);
  }

  var inAttesa = false;
  function alloScroll() {
    if (inAttesa) return;
    inAttesa = true;
    requestAnimationFrame(function () {
      aggiornaHeader();
      inAttesa = false;
    });
  }
  window.addEventListener('scroll', alloScroll, { passive: true });
  window.addEventListener('resize', alloScroll);
  alloScroll();

  // ---------- menu mobile ----------
  var burger = document.getElementById('burger');
  function menu(aperto) {
    html.classList.toggle('menu-aperto', aperto);
    burger.setAttribute('aria-expanded', aperto);
    burger.setAttribute('aria-label', aperto ? 'Chiudi il menu' : 'Apri il menu');
  }
  burger.addEventListener('click', function () { menu(!html.classList.contains('menu-aperto')); });
  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { menu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && html.classList.contains('menu-aperto')) menu(false);
  });

  // ---------- comparsa allo scorrimento ----------
  var reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var osservatore = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        // piccolo ritardo a cascata tra elementi fratelli che compaiono insieme
        var fratelli = [].slice.call(v.target.parentNode.children).filter(function (el) { return el.classList.contains('reveal'); });
        v.target.style.transitionDelay = Math.min(fratelli.indexOf(v.target), 5) * 0.08 + 's';
        v.target.classList.add('is-visibile');
        osservatore.unobserve(v.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach(function (el) { osservatore.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-visibile'); });
  }
})();
