// Uygulama sayfasındaki ekran görüntüsü galerisi: kaydırma çubuğu yerine sağ/sol okları.
// Ok, o yönde gösterilecek görsel kalmayınca kaybolur; parmakla kaydırma da çalışmaya devam eder.
(() => {
  const tr = document.documentElement.lang === 'tr';
  const t = tr ? { onceki: 'Önceki görseller', sonraki: 'Sonraki görseller' }
               : { onceki: 'Previous screenshots', sonraki: 'Next screenshots' };

  document.querySelectorAll('.galeri').forEach(g => {
    const kap = document.createElement('div');
    kap.className = 'galeri-kap';
    g.before(kap);
    kap.append(g);

    const ok = (yon, ad) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'galeri-ok ' + (yon < 0 ? 'sol' : 'sag');
      b.setAttribute('aria-label', ad);
      b.addEventListener('click', () => {
        // görünen alanın bir ekranı kadar kaydır; yaslanma (snap) görseli hizalar
        const adim = Math.max(g.clientWidth - 120, 200);
        g.scrollBy({ left: yon * adim, behavior: 'smooth' });
      });
      kap.append(b);
      return b;
    };
    const sol = ok(-1, t.onceki), sag = ok(1, t.sonraki);

    const guncelle = () => {
      const son = g.scrollWidth - g.clientWidth;
      sol.hidden = g.scrollLeft <= 4;
      sag.hidden = g.scrollLeft >= son - 4;
    };
    g.addEventListener('scroll', guncelle, { passive: true });
    addEventListener('resize', guncelle);
    g.querySelectorAll('img').forEach(i => i.addEventListener('load', guncelle));
    g.scrollLeft = 0;
    guncelle();
  });
})();
