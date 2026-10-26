(() => {
  const bar = document.createElement('aside');
  bar.className = 'action-bar'; bar.setAttribute('aria-label', 'التواصل السريع');
  bar.innerHTML = '<a class="btn btn-whatsapp" href="https://wa.me/966562752902" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> تواصل عبر واتساب</a><a class="btn btn-call" href="tel:+966562752902"><i class="fa-solid fa-phone" aria-hidden="true"></i> اتصل الآن</a>';
  document.body.append(bar);
})();
