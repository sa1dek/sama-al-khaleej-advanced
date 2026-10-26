(() => {
  const grid = document.querySelector("[data-gallery-grid]");
  if (!grid || !window.SAMA_GALLERY) return;
  const items = [
    ...window.SAMA_GALLERY.images.map((item) => ({ ...item, type: "image" })),
    ...window.SAMA_GALLERY.videos.map((item) => ({ ...item, type: "video" })),
  ];
  const dialog = document.querySelector("[data-lightbox]");
  const title = document.querySelector("[data-lightbox-title]");
  const mediaHost = document.querySelector("[data-lightbox-art]");
  let current = 0;
  let returnFocus = null;

  items.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card gallery-item";
    card.dataset.type = item.type;
    card.setAttribute(
      "aria-label",
      `${item.title} — ${item.type === "image" ? "صورة" : "فيديو"}`,
    );
    const media = document.createElement(
      item.type === "image" ? "img" : "video",
    );
    media.className = "gallery-media";
    media.src = item.src;
    media.alt = item.type === "image" ? item.title : "";
    if (item.type === "video") {
      media.muted = true;
      media.playsInline = true;
      media.preload = "metadata";
    }
    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = item.title;
    card.append(media, caption);
    card.addEventListener("click", () => open(index));
    grid.append(card);
  });

  function renderModal() {
    const item = items[current];
    title.textContent = item.title;
    const media = document.createElement(
      item.type === "image" ? "img" : "video",
    );
    media.className = "gallery-media lightbox-media";
    media.src = item.src;
    media.alt = item.type === "image" ? item.title : "";
    if (item.type === "video") {
      media.controls = true;
      media.autoplay = true;
      media.playsInline = true;
    }
    mediaHost.replaceChildren(media);
  }
  function open(index) {
    current = index;
    returnFocus = document.activeElement;
    renderModal();
    dialog.showModal();
    dialog.querySelector("[data-gallery-close]").focus();
  }
  function close() {
    dialog.close();
    mediaHost.replaceChildren();
    if (returnFocus) returnFocus.focus();
  }
  function move(step) {
    current = (current + step + items.length) % items.length;
    renderModal();
  }
  document.querySelectorAll("[data-gallery-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-gallery-filter]")
        .forEach((filter) =>
          filter.setAttribute("aria-pressed", String(filter === button)),
        );
      grid.querySelectorAll(".gallery-item").forEach((card) => {
        card.hidden =
          button.dataset.galleryFilter !== "all" &&
          card.dataset.type !== button.dataset.galleryFilter;
      });
    }),
  );
  dialog.querySelector("[data-gallery-close]").addEventListener("click", close);
  dialog
    .querySelector("[data-gallery-prev]")
    .addEventListener("click", () => move(-1));
  dialog
    .querySelector("[data-gallery-next]")
    .addEventListener("click", () => move(1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(1);
    if (event.key === "ArrowRight") move(-1);
  });
})();
