// Экран загрузки: скрываем после полной загрузки страницы.
(function () {
  var screen = document.getElementById("loadingScreen");
  if (!screen) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hide() {
    screen.classList.add("is-hidden");
  }

  if (reduceMotion) {
    hide();
    return;
  }

  window.addEventListener("load", function () {
    setTimeout(hide, 500);
  });
})();

// Мобильное меню.
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
})();

// Год в подвале.
(function () {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

// Кастомный курсор — только на устройствах с настоящей мышью, не на тачах.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !hasFineHover) return;

  var dot = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  var hoverTargets = document.querySelectorAll("a, button");
  hoverTargets.forEach(function (el) {
    el.addEventListener("mouseenter", function () { ring.classList.add("is-active"); });
    el.addEventListener("mouseleave", function () { ring.classList.remove("is-active"); });
  });
})();

// Scroll-reveal: элементы с классом .reveal плавно появляются при входе во вьюпорт.
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
})();

// Кейсы: превью-плашка следует за курсором при наведении на карточку.
(function () {
  var grid = document.getElementById("casesGrid");
  var preview = document.getElementById("casePreview");
  if (!grid || !preview) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var cards = grid.querySelectorAll(".case-card");
  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      preview.textContent = card.getAttribute("data-preview") || "";
      preview.style.background = card.getAttribute("data-color") || "#3B5745";
      preview.classList.add("is-visible");
    });
    card.addEventListener("mouseleave", function () {
      preview.classList.remove("is-visible");
    });
    card.addEventListener("mousemove", function (e) {
      preview.style.left = e.clientX + "px";
      preview.style.top = e.clientY + "px";
    });
  });
})();
