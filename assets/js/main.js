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
