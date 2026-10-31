(() => {
  const bar = document.createElement("aside");
  const selectedService = new URLSearchParams(window.location.search)
    .get("service")
    ?.trim();
  const message = [
    "السلام عليكم",
    selectedService
      ? `أريد حجز موعد لخدمة ${selectedService}`
      : "أريد حجز موعد",
  ].join("\n");
  const whatsappUrl = `https://wa.me/966562752902?text=${encodeURIComponent(message)}`;

  bar.className = "action-bar";
  bar.setAttribute("aria-label", "التواصل السريع");
  bar.innerHTML = `<a class="btn btn-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> تواصل عبر واتساب</a><a class="btn btn-call" href="tel:+966562752902"><i class="fa-solid fa-phone" aria-hidden="true"></i> اتصل الآن</a>`;
  document.body.append(bar);
})();
