(() => {
  const stats = document.querySelector("[data-stats]");
  if (stats) {
    const counters = stats.querySelectorAll("[data-count]");
    const animateCounters = () =>
      counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";
        const duration = 1500;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          counter.textContent = `${Math.round(target * eased).toLocaleString("ar-SA")}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      counters.forEach(
        (counter) =>
          (counter.textContent = `${Number(counter.dataset.count).toLocaleString("ar-SA")}${counter.dataset.suffix || ""}`),
      );
    else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            animateCounters();
            observer.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(stats);
    }
  }
  const elements = document.querySelectorAll(".reveal");
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  elements.forEach((el) => observer.observe(el));
})();
