(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero entrance
  var heroInner = document.querySelector(".hero-inner");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroInner.classList.add("loaded");
    });
  });

  var words = [
    { text: "RESISTANCE", color: "#2b5d1c" },
    { text: "DRAMA", color: "#0e93a4" },
    { text: "EGO", color: "#5b23e8" },
    { text: "SOLIDARITY", color: "#8a1414" }
  ];
  var idx = 0;
  var rotator = document.getElementById("rotator");
  var heroBg = document.getElementById("heroBg");
  var dotsWrap = document.getElementById("heroDots");
  var dots = [];
  var timer;

  words.forEach(function (w, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Show " + w.text);
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () {
      setWord(i);
      restartTimer();
    });
    dotsWrap.appendChild(b);
    dots.push(b);
  });

  function setWord(i) {
    idx = i;
    rotator.classList.add("swap");
    setTimeout(function () {
      rotator.textContent = words[idx].text;
      heroBg.style.backgroundColor = words[idx].color;
      rotator.classList.remove("swap");
    }, 220);
    dots.forEach(function (d, di) { d.classList.toggle("active", di === idx); });
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
      setWord((idx + 1) % words.length);
    }, 3200);
  }

  restartTimer();

  // Sticky header state
  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("progressBar");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("scrolled", y > 12);
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  navToggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.getElementById("mainNav").addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Signup form
  var form = document.getElementById("signupForm");
  var msg = document.getElementById("formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector("input");
    if (input.checkValidity()) {
      msg.textContent = "You're on the list — first look at the next drop is yours.";
      form.reset();
    } else {
      msg.textContent = "Enter a valid email to join the list.";
    }
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Collection card photo galleries (Resistance / Solidarity real product shots)
  document.querySelectorAll(".card-gallery").forEach(function (gallery) {
    var slides = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-slide"));
    var dotsWrap = gallery.querySelector(".gallery-dots");
    if (slides.length < 2 || !dotsWrap) return;

    var dots = slides.map(function (slide, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + slides.length);
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
        restart();
      });
      dotsWrap.appendChild(b);
      return b;
    });

    var current = 0;
    var galleryTimer;

    function show(i) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = i;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    function restart() {
      clearInterval(galleryTimer);
      galleryTimer = setInterval(function () {
        show((current + 1) % slides.length);
      }, 3800);
    }

    restart();
  });

  // Scroll-triggered reveals
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });

    // Manifesto chant cascade
    var chant = document.querySelector(".manifesto-chant");
    if (chant) {
      var chantObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            chantObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      chantObserver.observe(chant);
    }

    // Manifesto stat count-up
    var statEls = document.querySelectorAll("[data-count-to]");
    if (statEls.length) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count-to"), 10);
          var suffix = el.getAttribute("data-suffix") || "";
          if (reduceMotion) {
            el.textContent = target + suffix;
            return;
          }
          var start = null;
          var duration = 1100;
          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      statEls.forEach(function (el) { statObserver.observe(el); });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in-view"); });
    var chantFallback = document.querySelector(".manifesto-chant");
    if (chantFallback) chantFallback.classList.add("in-view");
    document.querySelectorAll("[data-count-to]").forEach(function (el) {
      el.textContent = el.getAttribute("data-count-to") + (el.getAttribute("data-suffix") || "");
    });
  }
})();
