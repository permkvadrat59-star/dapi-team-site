// DAPI — топбар-меню (заглушка), переключение хиро по нижним плашкам
// и туманный reveal хиро при загрузке страницы

(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return; // база уже видна и статична — анимацию не запускаем

  // двойной rAF: даём браузеру отрисовать «дождевую» стартовую позицию
  // (заданную CSS через .js-anim-ready) перед тем, как включить переход
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add("is-revealing");
    });
  });

  // самый долгий переход — у плашки 04 (0.92s задержка + 0.6s анимация)
  setTimeout(() => {
    root.classList.remove("is-revealing");
    root.classList.add("is-revealed");
  }, 1600);
})();

(function () {
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerClose = document.getElementById("drawerClose");

  function openDrawer() {
    drawerBackdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      drawerBackdrop.classList.add("is-open");
    });
    menuBtn.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawerBackdrop.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    setTimeout(() => { drawerBackdrop.hidden = true; }, 250);
  }

  menuBtn.addEventListener("click", () => {
    drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  const heroImgDefault = document.getElementById("heroImgDefault");
  const heroImgAlt = document.getElementById("heroImgAlt");
  const heroScrim = document.getElementById("heroScrim");
  const heroBadge = document.getElementById("heroBadge");
  const tiles = document.querySelectorAll(".tile");

  function resetHero() {
    tiles.forEach((t) => t.classList.remove("is-active"));
    heroScrim.className = "hero-scrim";
    heroImgAlt.classList.remove("is-active");
    heroImgDefault.classList.add("is-active");
    heroBadge.hidden = true;
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const wasActive = tile.classList.contains("is-active");
      resetHero();
      if (wasActive) return;

      tile.classList.add("is-active");
      if (tile.dataset.image) {
        heroImgAlt.src = tile.dataset.image;
        heroImgAlt.alt = tile.dataset.alt || "";
        heroImgAlt.classList.add("is-active");
        heroImgDefault.classList.remove("is-active");
      } else if (tile.dataset.tint) {
        heroScrim.classList.add("tint-" + tile.dataset.tint);
        heroBadge.hidden = false;
      }
    });
  });
})();
