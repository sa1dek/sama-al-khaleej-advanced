(() => {
  const grids = [...document.querySelectorAll("[data-gallery-grid]")];
  const galleryData = window.SAMA_GALLERY;
  if (!grids.length || !galleryData) return;

  const allItems = [
    ...galleryData.images.map((item) => ({ ...item, type: "image" })),
    ...galleryData.videos.map((item) => ({ ...item, type: "video" })),
  ];
  const dialog = document.querySelector("[data-lightbox]");
  if (!dialog) return;

  const mediaHost = dialog.querySelector("[data-lightbox-art]");
  const shareStatus = dialog.querySelector("[data-gallery-share-status]");
  const shareButton = dialog.querySelector("[data-gallery-share]");
  const closeButton = dialog.querySelector("[data-gallery-close]");
  let currentItems = allItems;
  let currentIndex = 0;
  let returnFocus = null;
  const previewObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach(({ target, isIntersecting }) => {
              if (isIntersecting) target.play().catch(() => {});
              else target.pause();
            });
          },
          { rootMargin: "120px 0px" },
        )
      : null;

  function itemButton(item, index, collection) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `gallery-item ${collection === allItems ? "" : "home-gallery-item"}`;
    card.dataset.type = item.type;
    card.setAttribute(
      "aria-label",
      `${item.type === "image" ? "فتح صورة" : "فتح فيديو"}`,
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
      media.loop = true;
      media.autoplay = true;
      media.preload = "none";
      if (previewObserver) previewObserver.observe(media);
      else {
        media.preload = "metadata";
        media.play().catch(() => {});
      }
    }

    card.append(media);
    card.addEventListener("click", () => open(index, collection));
    return card;
  }

  grids.forEach((grid) => {
    const isPreview = grid.hasAttribute("data-gallery-preview");
    const selectedItems = isPreview
      ? [
          ...allItems.filter((item) => item.type === "image").slice(0, 2),
          ...allItems.filter((item) => item.type === "video").slice(0, 4),
        ]
      : allItems;

    if (isPreview && grid.children.length) {
      [...grid.children].forEach((card, index) => {
        card.querySelector(".gallery-caption")?.remove();
        card.addEventListener("click", () => open(index, selectedItems));
      });
    } else {
      grid.append(
        ...selectedItems.map((item, index) =>
          itemButton(item, index, isPreview ? selectedItems : allItems),
        ),
      );
    }
  });

  function renderModal() {
    const item = currentItems[currentIndex];
    if (!item) return;
    shareStatus.textContent = "";
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
      media.preload = "auto";
    }
    mediaHost.replaceChildren(media);
  }

  function open(index, items) {
    if (!items[index] || dialog.open) return;
    currentItems = items;
    currentIndex = index;
    returnFocus = document.activeElement;
    pausePreviews();
    renderModal();
    dialog.showModal();
    closeButton.focus();
  }

  function close() {
    dialog.close();
    mediaHost.replaceChildren();
    resumePreviews();
    if (returnFocus?.focus) returnFocus.focus();
  }

  function pausePreviews() {
    grids.forEach((grid) => {
      grid
        .querySelectorAll("video.gallery-media")
        .forEach((video) => video.pause());
    });
  }

  function resumePreviews() {
    grids.forEach((grid) => {
      grid.querySelectorAll("video.gallery-media").forEach((video) => {
        if (previewObserver) {
          previewObserver.unobserve(video);
          previewObserver.observe(video);
        } else video.play().catch(() => {});
      });
    });
  }

  function move(step) {
    currentIndex =
      (currentIndex + step + currentItems.length) % currentItems.length;
    renderModal();
  }

  async function copyLink(url) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return;
      } catch (_) {
        // Try the legacy clipboard path if browser permissions reject the API.
      }
    }
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Clipboard unavailable");
  }

  async function shareCurrent() {
    const item = currentItems[currentIndex];
    const publicUrl = item.src;
    try {
      if (navigator.share) {
        if (item.type === "image" && navigator.canShare) {
          try {
            const response = await fetch(publicUrl);
            if (response.ok) {
              const file = new File(
                [await response.blob()],
                "sama-cleaning-work.jpg",
                {
                  type: response.headers.get("content-type") || "image/jpeg",
                },
              );
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({ title: item.title, files: [file] });
                return;
              }
            }
          } catch (error) {
            if (error?.name === "AbortError") return;
          }
        }
        try {
          await navigator.share({
            title: item.title,
            text: item.title,
            url: publicUrl,
          });
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }
      await copyLink(publicUrl);
      shareStatus.textContent = "تم نسخ رابط الوسائط لمشاركته.";
    } catch (error) {
      if (error?.name === "AbortError") return;
      shareStatus.textContent = "تعذرت المشاركة من هذا المتصفح.";
    }
  }

  document.querySelectorAll("[data-gallery-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-gallery-filter]")
        .forEach((filter) =>
          filter.setAttribute("aria-pressed", String(filter === button)),
        );
      grids
        .filter((grid) => !grid.hasAttribute("data-gallery-preview"))
        .forEach((grid) => {
          grid.querySelectorAll(".gallery-item").forEach((card) => {
            card.hidden =
              button.dataset.galleryFilter !== "all" &&
              card.dataset.type !== button.dataset.galleryFilter;
          });
        });
    });
  });

  closeButton.addEventListener("click", close);
  shareButton.addEventListener("click", shareCurrent);
  let swipeStart = null;
  mediaHost.addEventListener("pointerdown", (event) => {
    swipeStart = event.clientX;
  });
  mediaHost.addEventListener("pointerup", (event) => {
    if (swipeStart === null) return;
    const distance = event.clientX - swipeStart;
    swipeStart = null;
    if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
  });
  mediaHost.addEventListener("pointercancel", () => {
    swipeStart = null;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
})();
