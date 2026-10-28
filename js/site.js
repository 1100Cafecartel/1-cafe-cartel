// Fills the page from content.js. You normally don't need to edit this file.
(function () {
  var s = window.STORE || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  document.title = s.name || document.title;
  document.querySelectorAll("[data-field]").forEach(function (node) {
    var v = s[node.getAttribute("data-field")];
    if (v) node.textContent = v;
  });

  // Menu cards, with category tabs when items have a "category"
  var grid = document.getElementById("product-grid");
  var products = s.products || [];
  products.forEach(function (p) {
    var card = el("article", { class: "card reveal", "data-category": p.category || "" });
    card.appendChild(el("img", { src: p.image || "images/placeholder.svg", alt: p.name, loading: "lazy" }));
    var body = el("div", { class: "card-body" });
    var head = el("div", { class: "card-head" });
    head.appendChild(el("h3", {}, p.name));
    if (p.price) head.appendChild(el("span", { class: "price" }, p.price));
    body.appendChild(head);
    if (p.description) body.appendChild(el("p", {}, p.description));
    card.appendChild(body);
    grid.appendChild(card);
  });

  var tabs = document.getElementById("menu-tabs");
  var categories = [];
  products.forEach(function (p) {
    if (p.category && categories.indexOf(p.category) < 0) categories.push(p.category);
  });
  if (categories.length > 1) {
    ["All"].concat(categories).forEach(function (c, i) {
      var b = el("button", { class: "tab", type: "button", role: "tab", "aria-selected": i === 0 ? "true" : "false" }, c);
      b.addEventListener("click", function () {
        tabs.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-selected", t === b ? "true" : "false"); });
        grid.querySelectorAll(".card").forEach(function (card) {
          var show = c === "All" || card.getAttribute("data-category") === c;
          card.hidden = !show;
          if (show && !reduceMotion) {
            card.classList.remove("pop");
            void card.offsetWidth;
            card.classList.add("pop");
          }
        });
      });
      tabs.appendChild(b);
    });
  } else {
    tabs.remove();
  }

  // Delivery zone cards next to the Pickup card
  var options = document.getElementById("order-options");
  (s.delivery || []).forEach(function (d) {
    var box = el("div", { class: "option" });
    box.appendChild(el("h3", {}, "Delivery · " + d.area));
    box.appendChild(el("p", { class: "big" }, d.fee + " fee"));
    box.appendChild(el("p", {}, d.minimum + " minimum order, plus the delivery fee."));
    options.appendChild(box);
  });

  // With a Toast link, Order buttons go to Toast; otherwise js/order.js runs the site's own cart
  if (s.orderUrl) {
    document.querySelectorAll(".order-link").forEach(function (link) {
      link.href = s.orderUrl;
      link.target = "_blank";
      link.rel = "noopener";
    });
    grid.querySelectorAll(".card-body").forEach(function (body) {
      body.appendChild(el("a", { class: "card-order", href: s.orderUrl, target: "_blank", rel: "noopener" }, "Order →"));
    });
  }
  if (!s.orderNote) document.querySelector(".order-note").hidden = true;

  var hours = document.getElementById("hours");
  (s.hours || []).forEach(function (h) {
    var tr = el("tr");
    tr.appendChild(el("th", {}, h[0]));
    tr.appendChild(el("td", {}, h[1]));
    hours.appendChild(tr);
  });

  // "Open now" badge, worked out from the hours list in content.js
  var DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  function dayIndex(name) {
    name = name.trim().toLowerCase();
    for (var i = 0; i < 7; i++) if (DAYS[i].indexOf(name.slice(0, 3)) === 0) return i;
    return -1;
  }
  function minutes(t) {
    var m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
    if (!m) return -1;
    var h = (+m[1] % 12) + (m[3].toLowerCase() === "pm" ? 12 : 0);
    return h * 60 + (+m[2] || 0);
  }
  function todaysHours(now) {
    var today = now.getDay();
    var rows = s.hours || [];
    for (var r = 0; r < rows.length; r++) {
      var parts = rows[r][0].split(/\s*[–-]\s*/);
      var a = dayIndex(parts[0]), b = parts[1] ? dayIndex(parts[1]) : a;
      if (a < 0 || b < 0) continue;
      var inRange = a <= b ? today >= a && today <= b : today >= a || today <= b;
      if (!inRange) continue;
      if (/closed/i.test(rows[r][1])) return null;
      var t = rows[r][1].split(/\s*[–-]\s*/);
      var open = minutes(t[0] || ""), close = minutes(t[1] || "");
      return open >= 0 && close >= 0 ? { open: open, close: close, label: t[1].trim() } : undefined;
    }
    return null;
  }
  window.CafeHours = { today: todaysHours };
  var status = document.getElementById("status");
  var now = new Date();
  var today = todaysHours(now);
  if (today !== undefined) {
    var mins = now.getHours() * 60 + now.getMinutes();
    var isOpen = today && mins >= today.open && mins < today.close;
    status.textContent = isOpen ? "Open now · until " + today.label : "Closed now";
    status.classList.add(isOpen ? "is-open" : "is-closed");
    status.hidden = false;
  }

  if (s.address) {
    document.getElementById("map").src =
      "https://www.google.com/maps?output=embed&q=" + encodeURIComponent(s.address);
  }

  var links = document.getElementById("contact-links");
  if (s.phone) links.appendChild(el("a", { class: "btn", href: "tel:" + s.phone.replace(/[^\d+]/g, "") }, "Call " + s.phone));
  if (s.whatsapp) links.appendChild(el("a", { class: "btn", href: "https://wa.me/" + s.whatsapp, target: "_blank", rel: "noopener" }, "WhatsApp"));
  if (s.email) links.appendChild(el("a", { class: "btn btn-outline", href: "mailto:" + s.email }, s.email));

  var social = document.getElementById("social");
  var names = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" };
  for (var key in s.social || {}) {
    if (s.social[key]) social.appendChild(el("a", { href: s.social[key], target: "_blank", rel: "noopener" }, names[key] || key));
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });

  // Header shadow once the page is scrolled
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!("IntersectionObserver" in window)) return;

  // Fade sections and cards in as they scroll into view
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (node, i) {
    node.style.transitionDelay = node.classList.contains("card") ? (i % 4) * 80 + "ms" : "0ms";
    revealer.observe(node);
  });
  document.documentElement.classList.add("js-reveal");

  // Highlight the menu link for the section on screen
  var navLinks = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { navLinks[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = navLinks[entry.target.id];
      if (link) link.classList.toggle("active", entry.isIntersecting);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (sec) { spy.observe(sec); });
})();
