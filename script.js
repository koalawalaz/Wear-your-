(function () {
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

  // Hero eyebrow chant rotator
  var chantLines = [
    "Wear your history.",
    "Wear your integrity.",
    "Wear your voice.",
    "Wear it. Mean it."
  ];
  var chantIdx = 0;
  var chantEl = document.getElementById("heroChant");
  if (chantEl) {
    setInterval(function () {
      chantIdx = (chantIdx + 1) % chantLines.length;
      chantEl.classList.add("swap");
      setTimeout(function () {
        chantEl.textContent = chantLines[chantIdx];
        chantEl.classList.remove("swap");
      }, 220);
    }, 2600);
  }

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

  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in-view"); });
    var chantFallback = document.querySelector(".manifesto-chant");
    if (chantFallback) chantFallback.classList.add("in-view");
  }
})();

/* Cart, checkout & order confirmation */
(function () {
  var cartToggle = document.getElementById("cartToggle");
  var cartDrawer = document.getElementById("cartDrawer");
  if (!cartToggle || !cartDrawer) return;

  var PRODUCTS = {
    resistance: { name: "Wear Your Resistance", price: 25, image: "assets/resistance-v2.png" },
    solidarity: { name: "Wear Your Solidarity", price: 25, image: "assets/solidarity.png" },
    kite: { name: "Fly Your Kite", price: 20, image: "assets/fly-your-kite.png" }
  };
  var DELIVERY_FEE = 2;
  var FREE_DELIVERY_THRESHOLD = 50;
  var STORAGE_KEY = "wearyour_cart";

  var cart = loadCart();

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function money(n) {
    return "JD " + n.toFixed(2);
  }

  function findLine(id, size) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) return cart[i];
    }
    return null;
  }

  function addToCart(id, size) {
    var line = findLine(id, size);
    if (line) {
      line.qty += 1;
    } else {
      cart.push({ id: id, size: size, qty: 1 });
    }
    saveCart();
    renderCart();
  }

  function setQty(id, size, qty) {
    if (qty <= 0) {
      removeLine(id, size);
      return;
    }
    var line = findLine(id, size);
    if (!line) return;
    line.qty = qty;
    saveCart();
    renderCart();
  }

  function removeLine(id, size) {
    cart = cart.filter(function (l) { return !(l.id === id && l.size === size); });
    saveCart();
    renderCart();
  }

  function cartCount() {
    return cart.reduce(function (sum, l) { return sum + l.qty; }, 0);
  }

  function subtotal() {
    return cart.reduce(function (sum, l) {
      var p = PRODUCTS[l.id];
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
  }

  function deliveryFee() {
    var sub = subtotal();
    return (sub === 0 || sub >= FREE_DELIVERY_THRESHOLD) ? 0 : DELIVERY_FEE;
  }

  // DOM refs
  var cartOverlay = document.getElementById("cartOverlay");
  var cartClose = document.getElementById("cartClose");
  var cartCountEl = document.getElementById("cartCount");
  var cartItemsEl = document.getElementById("cartItems");
  var cartEmptyEl = document.getElementById("cartEmpty");
  var cartSummaryEl = document.getElementById("cartSummary");
  var cartSubtotalEl = document.getElementById("cartSubtotal");
  var cartDeliveryEl = document.getElementById("cartDelivery");
  var cartFreeNoteEl = document.getElementById("cartFreeNote");
  var cartTotalEl = document.getElementById("cartTotal");
  var cartCheckoutBtn = document.getElementById("cartCheckoutBtn");

  var cartView = document.getElementById("cartView");
  var checkoutView = document.getElementById("checkoutView");
  var confirmView = document.getElementById("confirmView");
  var checkoutBack = document.getElementById("checkoutBack");
  var checkoutClose = document.getElementById("checkoutClose");
  var checkoutForm = document.getElementById("checkoutForm");
  var checkoutSubtotalEl = document.getElementById("checkoutSubtotal");
  var checkoutDeliveryEl = document.getElementById("checkoutDelivery");
  var checkoutTotalEl = document.getElementById("checkoutTotal");

  var confirmClose = document.getElementById("confirmClose");
  var confirmDone = document.getElementById("confirmDone");
  var orderIdEl = document.getElementById("orderId");
  var orderSummaryEl = document.getElementById("orderSummary");

  function showView(view) {
    [cartView, checkoutView, confirmView].forEach(function (v) { v.hidden = (v !== view); });
  }

  function openDrawer() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  cartToggle.addEventListener("click", function () {
    showView(cartView);
    openDrawer();
  });
  cartClose.addEventListener("click", closeDrawer);
  cartOverlay.addEventListener("click", closeDrawer);
  checkoutClose.addEventListener("click", closeDrawer);
  confirmClose.addEventListener("click", closeDrawer);
  confirmDone.addEventListener("click", closeDrawer);
  checkoutBack.addEventListener("click", function () { showView(cartView); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cartDrawer.classList.contains("open")) closeDrawer();
  });

  function buildCartItemRow(line) {
    var p = PRODUCTS[line.id];
    if (!p) return null;

    var row = document.createElement("div");
    row.className = "cart-item";

    var img = document.createElement("img");
    img.src = p.image;
    img.alt = "";
    row.appendChild(img);

    var mid = document.createElement("div");
    var name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = p.name;
    var meta = document.createElement("p");
    meta.className = "cart-item-meta";
    meta.textContent = "Size " + line.size;
    var qtyWrap = document.createElement("div");
    qtyWrap.className = "cart-item-qty";
    var dec = document.createElement("button");
    dec.type = "button";
    dec.className = "cart-qty-btn";
    dec.textContent = "−";
    dec.addEventListener("click", function () { setQty(line.id, line.size, line.qty - 1); });
    var qtySpan = document.createElement("span");
    qtySpan.textContent = line.qty;
    var inc = document.createElement("button");
    inc.type = "button";
    inc.className = "cart-qty-btn";
    inc.textContent = "+";
    inc.addEventListener("click", function () { setQty(line.id, line.size, line.qty + 1); });
    qtyWrap.appendChild(dec);
    qtyWrap.appendChild(qtySpan);
    qtyWrap.appendChild(inc);
    mid.appendChild(name);
    mid.appendChild(meta);
    mid.appendChild(qtyWrap);
    row.appendChild(mid);

    var right = document.createElement("div");
    right.className = "cart-item-right";
    var price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = money(p.price * line.qty);
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-item-remove";
    remove.textContent = "Remove";
    remove.addEventListener("click", function () { removeLine(line.id, line.size); });
    right.appendChild(price);
    right.appendChild(remove);
    row.appendChild(right);

    return row;
  }

  function renderCart() {
    var count = cartCount();
    cartCountEl.textContent = count;
    cartCountEl.hidden = count === 0;

    cartItemsEl.innerHTML = "";
    if (cart.length === 0) {
      cartEmptyEl.hidden = false;
      cartSummaryEl.hidden = true;
      return;
    }
    cartEmptyEl.hidden = true;
    cartSummaryEl.hidden = false;

    cart.forEach(function (line) {
      var row = buildCartItemRow(line);
      if (row) cartItemsEl.appendChild(row);
    });

    var sub = subtotal();
    var fee = deliveryFee();
    cartSubtotalEl.textContent = money(sub);
    cartDeliveryEl.textContent = fee === 0 ? "Free" : money(fee);
    cartTotalEl.textContent = money(sub + fee);
    checkoutSubtotalEl.textContent = money(sub);
    checkoutDeliveryEl.textContent = fee === 0 ? "Free" : money(fee);
    checkoutTotalEl.textContent = money(sub + fee);

    if (fee > 0) {
      cartFreeNoteEl.hidden = false;
      cartFreeNoteEl.textContent = "Add " + money(FREE_DELIVERY_THRESHOLD - sub) + " more for free delivery.";
    } else {
      cartFreeNoteEl.hidden = true;
    }
  }

  // Size pickers (one active size per product card)
  document.querySelectorAll(".collection-card").forEach(function (card) {
    var picker = card.querySelector(".size-picker");
    if (!picker) return;
    var opts = picker.querySelectorAll(".size-opt");
    opts.forEach(function (opt) {
      opt.addEventListener("click", function () {
        opts.forEach(function (o) { o.classList.remove("active"); });
        opt.classList.add("active");
      });
    });
  });

  // Add to cart
  document.querySelectorAll(".add-cart-btn").forEach(function (btn) {
    var originalText = btn.textContent;
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-product");
      var card = btn.closest(".collection-card");
      var activeOpt = card ? card.querySelector(".size-opt.active") : null;
      var size = activeOpt ? activeOpt.getAttribute("data-size") : "M";
      addToCart(id, size);

      btn.classList.add("added");
      btn.textContent = "Added ✓";
      setTimeout(function () {
        btn.classList.remove("added");
        btn.textContent = originalText;
      }, 1200);

      showView(cartView);
      openDrawer();
    });
  });

  cartCheckoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;
    showView(checkoutView);
  });

  function addSummaryRow(container, label, value, isTotal) {
    var row = document.createElement("div");
    row.className = isTotal ? "cart-row cart-total" : "cart-row";
    var l = document.createElement("span");
    l.textContent = label;
    var v = document.createElement("span");
    v.textContent = value;
    row.appendChild(l);
    row.appendChild(v);
    container.appendChild(row);
  }

  var checkoutErrorEl = document.getElementById("checkoutError");
  var placeOrderBtn = document.getElementById("placeOrderBtn");

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (cart.length === 0) return;

    var formData = new FormData(checkoutForm);
    var name = String(formData.get("name") || "").trim();
    var phone = String(formData.get("phone") || "").trim();
    var address = String(formData.get("address") || "").trim();
    var payment = String(formData.get("payment") || "Cash on Delivery");

    var orderId = "WY-" + Math.floor(100000 + Math.random() * 900000);
    var sub = subtotal();
    var fee = deliveryFee();
    var itemsText = cart.map(function (line) {
      var p = PRODUCTS[line.id];
      return p ? (p.name + " (" + line.size + ") ×" + line.qty + " — " + money(p.price * line.qty)) : "";
    }).filter(Boolean).join("\n");

    formData.set("_subject", "New Wear Your order — " + orderId);
    formData.append("orderId", orderId);
    formData.append("items", itemsText);
    formData.append("subtotal", money(sub));
    formData.append("delivery", fee === 0 ? "Free" : money(fee));
    formData.append("total", money(sub + fee));

    checkoutErrorEl.hidden = true;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order…";

    fetch(checkoutForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    }).then(function (res) {
      if (!res.ok) throw new Error("Request failed");

      orderIdEl.textContent = "Order #" + orderId;
      orderSummaryEl.innerHTML = "";
      addSummaryRow(orderSummaryEl, name, phone);
      addSummaryRow(orderSummaryEl, "Address", address);
      addSummaryRow(orderSummaryEl, "Payment", payment);
      cart.forEach(function (line) {
        var p = PRODUCTS[line.id];
        if (!p) return;
        addSummaryRow(orderSummaryEl, p.name + " (" + line.size + ") ×" + line.qty, money(p.price * line.qty));
      });
      addSummaryRow(orderSummaryEl, "Subtotal", money(sub));
      addSummaryRow(orderSummaryEl, "Delivery", fee === 0 ? "Free" : money(fee));
      addSummaryRow(orderSummaryEl, "Total", money(sub + fee), true);

      cart = [];
      saveCart();
      renderCart();
      checkoutForm.reset();
      showView(confirmView);
    }).catch(function () {
      checkoutErrorEl.textContent = "Couldn't send your order — check your connection and try again.";
      checkoutErrorEl.hidden = false;
    }).finally(function () {
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order";
    });
  });

  renderCart();
})();
