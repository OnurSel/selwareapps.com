// E-posta bağlantıları: masaüstünde tanımlı bir posta programı yoksa mailto: boş bir sayfa açıyor.
// Fareyle kullanılan cihazlarda tıklayınca adres kopyalanır ve Gmail / Outlook / posta uygulaması
// seçenekleri çıkar. Telefonda (dokunmatik) mailto: zaten posta uygulamasını açtığı için dokunulmaz.
(() => {
  if (!matchMedia('(pointer: fine)').matches) return;

  const tr = document.documentElement.lang === 'tr';
  const t = tr
    ? { kopya: 'Adres kopyalandı', gmail: 'Gmail’de yaz', outlook: 'Outlook’ta yaz', uyg: 'Posta uygulamasında aç' }
    : { kopya: 'Address copied', gmail: 'Write in Gmail', outlook: 'Write in Outlook', uyg: 'Open mail app' };

  let kutu = null;
  const kapat = () => { if (kutu) { kutu.remove(); kutu = null; } };

  const secenek = (metin, href, yeniSekme) => {
    const a = document.createElement('a');
    a.textContent = metin;
    a.href = href;
    if (yeniSekme) { a.target = '_blank'; a.rel = 'noopener'; }
    else a.dataset.dogrudan = '';
    a.addEventListener('click', () => setTimeout(kapat, 0));
    return a;
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a || a.hasAttribute('data-dogrudan')) {
      if (kutu && !e.target.closest('.posta-kutu')) kapat();
      return;
    }
    e.preventDefault();
    kapat();

    const adres = decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);
    const enc = encodeURIComponent(adres);
    if (navigator.clipboard) navigator.clipboard.writeText(adres).catch(() => {});

    kutu = document.createElement('div');
    kutu.className = 'posta-kutu';
    kutu.setAttribute('role', 'dialog');
    const ust = document.createElement('p');
    ust.textContent = '✓ ' + t.kopya;
    const b = document.createElement('b');
    b.textContent = adres;
    ust.append(document.createElement('br'), b);
    kutu.append(
      ust,
      secenek(t.gmail, `https://mail.google.com/mail/?view=cm&fs=1&to=${enc}`, true),
      secenek(t.outlook, `https://outlook.live.com/mail/0/deeplink/compose?to=${enc}`, true),
      secenek(t.uyg, `mailto:${adres}`, false)
    );
    document.body.appendChild(kutu);

    const r = a.getBoundingClientRect();
    const w = kutu.offsetWidth, h = kutu.offsetHeight;
    const sol = Math.max(12, Math.min(r.left, innerWidth - w - 12));
    const ust_ = r.bottom + 10 + h < innerHeight ? r.bottom + 10 : Math.max(12, r.top - h - 10);
    kutu.style.left = sol + 'px';
    kutu.style.top = ust_ + 'px';
    kutu.querySelector('a').focus({ preventScroll: true });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') kapat(); });
  addEventListener('scroll', kapat, { passive: true });
  addEventListener('resize', kapat);
})();
