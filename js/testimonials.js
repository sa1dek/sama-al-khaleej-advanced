(() => {
  const entries = window.SAMA_TESTIMONIALS || [];
  if (!entries.length) return;

  function createCard(review) {
    const card = document.createElement("article");
    card.className = "card testimonial-card";

    const stars = document.createElement("div");
    stars.className = "testimonial-stars";
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", `التقييم: ${review.rating} من 5 نجوم`);
    for (let index = 0; index < 5; index += 1) {
      const star = document.createElement("i");
      star.className = `fa-${index < review.rating ? "solid" : "regular"} fa-star`;
      star.setAttribute("aria-hidden", "true");
      stars.append(star);
    }

    const quote = document.createElement("blockquote");
    quote.textContent = `«${review.text}»`;

    const person = document.createElement("div");
    person.className = "testimonial-person";
    const avatar = document.createElement("span");
    avatar.className = "testimonial-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = review.initial;
    const name = document.createElement("span");
    name.textContent = review.name;
    person.append(avatar, name);
    card.append(stars, quote, person);

    if (review.response) {
      const response = document.createElement("div");
      response.className = "review-response";
      const title = document.createElement("strong");
      title.textContent = "رد المؤسسة";
      const body = document.createElement("p");
      body.textContent = review.response;
      response.append(title, body);
      card.append(response);
    }
    return card;
  }

  const pageGrid = document.querySelector("[data-testimonials-page]");
  if (pageGrid) pageGrid.append(...entries.map(createCard));

  const viewport = document.querySelector("[data-testimonial-viewport]");
  const track = document.querySelector("[data-testimonial-track]");
  if (!viewport || !track) return;

  track.append(...entries.map(createCard));
  const cards = [...track.children];
  let activeIndex = 0;
  let pointerStart = null;
  let dragStart = 0;
  let autoplay = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function goTo(index) {
    activeIndex = (index + cards.length) % cards.length;
    viewport.scrollTo({
      left: cards[activeIndex].offsetLeft,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }

  document.querySelector("[data-review-prev]")?.addEventListener("click", () => {
    goTo(activeIndex - 1);
  });
  document.querySelector("[data-review-next]")?.addEventListener("click", () => {
    goTo(activeIndex + 1);
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = event.clientX;
    dragStart = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
    stopAutoplay();
  });
  viewport.addEventListener("pointermove", (event) => {
    if (pointerStart === null) return;
    viewport.scrollLeft = dragStart - (event.clientX - pointerStart);
  });
  const endDrag = () => {
    pointerStart = null;
    viewport.classList.remove("is-dragging");
    startAutoplay();
  };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("scroll", () => {
    const viewportLeft = viewport.getBoundingClientRect().left;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - viewportLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    activeIndex = nearestIndex;
  }, { passive: true });

  function stopAutoplay() {
    if (autoplay) window.clearInterval(autoplay);
    autoplay = null;
  }
  function startAutoplay() {
    stopAutoplay();
    if (reduceMotion.matches || document.hidden) return;
    autoplay = window.setInterval(() => goTo(activeIndex + 1), 4800);
  }
  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);
  viewport.addEventListener("focusin", stopAutoplay);
  viewport.addEventListener("focusout", startAutoplay);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  reduceMotion.addEventListener("change", startAutoplay);
  startAutoplay();
})();
