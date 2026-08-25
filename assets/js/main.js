// Хиро: заголовок разбирается на буквы и собирается заново через GSAP —
// вдохновлено тем, как hobro.digital анимирует буквы своего логотипа (там
// это отдельные SVG + платный SplitText, у нас — свой сплит + бесплатный
// GSAP core, без клубных плагинов).
function playHeroReveal() {
  var title = document.getElementById("heroTitle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fadeEls = [
    document.getElementById("heroEyebrow"),
    document.getElementById("heroText"),
    document.getElementById("heroCta"),
    document.getElementById("heroStats"),
  ].filter(Boolean);

  if (reduceMotion || typeof gsap === "undefined") {
    fadeEls.forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  var chars = [];
  if (title) {
    Array.prototype.slice.call(title.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var frag = document.createDocumentFragment();
        node.textContent.split("").forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          frag.appendChild(span);
          chars.push(span);
        });
        title.replaceChild(frag, node);
      }
    });
  }

  gsap.set(fadeEls, { y: 16 });

  var tl = gsap.timeline();
  if (chars.length) {
    tl.from(chars, {
      opacity: 0,
      y: 46,
      rotate: 6,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.026,
    });
  }
  tl.to(
    fadeEls,
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
    chars.length ? "-=0.35" : 0
  );
}

// Экран загрузки: скрываем после полной загрузки страницы, следом запускаем
// анимацию хиро, чтобы буквы появлялись сразу за исчезновением экрана.
(function () {
  var screen = document.getElementById("loadingScreen");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hide() {
    if (screen) screen.classList.add("is-hidden");
    playHeroReveal();
  }

  if (!screen) {
    playHeroReveal();
    return;
  }

  if (reduceMotion) {
    hide();
    return;
  }

  window.addEventListener("load", function () {
    setTimeout(hide, 400);
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
