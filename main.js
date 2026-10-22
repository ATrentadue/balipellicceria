// Bali – Pelle & Pellicce: menu, animazioni, filtri della collezione e scheda prodotto.
(function () {
  'use strict';

  var WHATSAPP = '390717591132';
  var muovi = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  // ---------- parallasse leggera ----------
  var parallasse = [].slice.call(document.querySelectorAll('[data-parallax]'));
  function aggiornaParallasse() {
    var h = window.innerHeight;
    parallasse.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > h + 200) return;
      var centro = r.top + r.height / 2 - h / 2;
      el.style.translate = '0 ' + (centro * parseFloat(el.dataset.parallax)).toFixed(1) + 'px';
    });
  }

  var inAttesa = false;
  function alloScroll() {
    if (inAttesa) return;
    inAttesa = true;
    requestAnimationFrame(function () {
      aggiornaHeader();
      if (muovi) aggiornaParallasse();
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

  // ---------- filtri della collezione ----------
  var griglia = document.getElementById('griglia');
  var prodotti = [].slice.call(griglia.querySelectorAll('.prodotto'));
  var filtri = [].slice.call(document.querySelectorAll('.filtro'));

  filtri.forEach(function (f) {
    var cat = f.dataset.filtro;
    var n = cat === 'tutti' ? prodotti.length : prodotti.filter(function (p) { return p.dataset.cat === cat; }).length;
    f.querySelector('span').textContent = n;
    f.addEventListener('click', function () { filtra(cat); });
  });

  function filtra(cat) {
    filtri.forEach(function (f) {
      var attivo = f.dataset.filtro === cat;
      f.classList.toggle('is-attivo', attivo);
      f.setAttribute('aria-pressed', attivo);
    });
    prodotti.forEach(function (p) {
      p.classList.toggle('is-nascosto', cat !== 'tutti' && p.dataset.cat !== cat);
    });
    griglia.classList.remove('is-filtrando');
    void griglia.offsetWidth; // riavvia l'animazione
    griglia.classList.add('is-filtrando');
  }

  // le categorie portano alla collezione già filtrata
  document.querySelectorAll('.categoria[data-filtro]').forEach(function (a) {
    a.addEventListener('click', function () { filtra(a.dataset.filtro); });
  });

  // ---------- scheda prodotto ----------
  var scheda = document.getElementById('scheda');
  var schedaImg = document.getElementById('scheda-img');
  var schedaNome = document.getElementById('scheda-nome');
  var schedaCat = document.getElementById('scheda-cat');
  var schedaWa = document.getElementById('scheda-wa');
  var schedaPos = document.getElementById('scheda-pos');
  var corrente = 0;

  function visibili() { return prodotti.filter(function (p) { return !p.classList.contains('is-nascosto'); }); }

  function mostra(p) {
    var lista = visibili();
    corrente = lista.indexOf(p);
    var img = p.querySelector('img');
    var nome = p.querySelector('.prodotto__nome').textContent;
    schedaImg.src = img.getAttribute('src');
    schedaImg.alt = img.alt;
    schedaNome.textContent = nome;
    schedaCat.textContent = p.querySelector('.prodotto__cat').textContent;
    schedaWa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Buongiorno, vorrei informazioni su: ' + nome + '.');
    schedaPos.textContent = (corrente + 1) + ' / ' + lista.length;
  }

  function sposta(passo) {
    var lista = visibili();
    mostra(lista[(corrente + passo + lista.length) % lista.length]);
  }

  prodotti.forEach(function (p) {
    p.querySelector('button').addEventListener('click', function () {
      mostra(p);
      if (typeof scheda.showModal === 'function') scheda.showModal();
      else scheda.setAttribute('open', '');
    });
  });

  document.getElementById('scheda-prec').addEventListener('click', function () { sposta(-1); });
  document.getElementById('scheda-succ').addEventListener('click', function () { sposta(1); });
  document.getElementById('scheda-chiudi').addEventListener('click', function () { scheda.close(); });
  // clic sullo sfondo scuro chiude la scheda
  scheda.addEventListener('click', function (e) { if (e.target === scheda) scheda.close(); });
  scheda.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') sposta(-1);
    if (e.key === 'ArrowRight') sposta(1);
  });
})();
