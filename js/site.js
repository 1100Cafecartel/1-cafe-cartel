// Fills the page from content.js. You normally don't need to edit this file.
(function () {
  var s = window.STORE || {};

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function money(n) { return n.toFixed(2); }

  document.querySelectorAll("[data-field]").forEach(function (node) {
    var v = s[node.getAttribute("data-field")];
    if (v) node.textContent = v;
    else if (node.classList.contains("order-note")) node.hidden = true;
  });

  var orderUrl = s.orderUrl || "#";
  document.querySelectorAll(".order-link").forEach(function (a) { a.href = orderUrl; });

  // House favorites: photo cards that open the item on the order site
  var favs = document.getElementById("favorites-list");
  (s.favorites || []).forEach(function (f, i) {
    var a = el("a", { class: "fav reveal", href: orderUrl + (f.id ? "#i/" + f.id : ""), style: "--i:" + i });
    var fig = el("div", { class: "fav-img" });
    fig.appendChild(el("img", { src: f.img, alt: f.name, loading: "lazy", width: "500", height: "500" }));
    a.appendChild(fig);
    var body = el("div", { class: "fav-body" });
    var top = el("div", { class: "fav-top" });
    top.appendChild(el("span", { class: "fav-name" }, f.name));
    if (f.price) top.appendChild(el("span", { class: "fav-price" }, "$" + f.price));
    body.appendChild(top);
    if (f.desc) body.appendChild(el("span", { class: "fav-desc" }, f.desc));
    a.appendChild(body);
    favs.appendChild(a);
  });

  // Menu sections: photo cards that open the section on the order site
  var secs = document.getElementById("sections-list");
  (s.sections || []).forEach(function (c, i) {
    var a = el("a", { class: "sec reveal", href: orderUrl + "#c/" + encodeURIComponent(c.name), style: "--i:" + i });
    a.appendChild(el("img", { src: c.img, alt: "", loading: "lazy", width: "500", height: "500" }));
    var cap = el("div", { class: "sec-cap" });
    cap.appendChild(el("span", { class: "sec-name" }, c.name));
    if (c.note) cap.appendChild(el("span", { class: "sec-note" }, c.note));
    a.appendChild(cap);
    secs.appendChild(a);
  });

  // Pickup card + delivery cards
  var options = document.getElementById("order-options");
  (s.delivery || []).forEach(function (d) {
    var box = el("div", { class: "option" });
    box.appendChild(el("h3", {}, "Delivery · " + d.area));
    box.appendChild(el("p", { class: "big" }, d.fee));
    box.appendChild(el("p", {}, d.minimum ? d.minimum + " minimum order." : "Delivery fee, added at checkout."));
    options.appendChild(box);
  });

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
      "https://www.google.com/maps?output=embed&q=" + encodeURIComponent(s.name + ", " + s.address);
  }

  function contactLinks(box, labelEmail) {
    if (s.phone) box.appendChild(el("a", { class: "btn", href: "tel:" + s.phone.replace(/[^\d+]/g, "") }, "Call " + s.phone));
    if (s.whatsapp) box.appendChild(el("a", { class: "btn", href: "https://wa.me/" + s.whatsapp, target: "_blank", rel: "noopener" }, "WhatsApp"));
    if (s.email) box.appendChild(el("a", { class: "btn btn-outline", href: "mailto:" + s.email + (labelEmail ? "?subject=" + encodeURIComponent("Catering inquiry") : "") }, s.email));
  }
  contactLinks(document.getElementById("contact-links"));
  contactLinks(document.getElementById("catering-links"), true);

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
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
    document.body.classList.toggle("past-hero", window.scrollY > 520);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!("IntersectionObserver" in window)) return;

  // Fade sections in as they scroll into view
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(function (node) { revealer.observe(node); });
  document.documentElement.classList.add("js-reveal");

  // Highlight the nav link and menu tab for what's on screen
  function spy(links, targets, margin) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        link.classList.toggle("active", entry.isIntersecting);
      });
    }, { rootMargin: margin });
    targets.forEach(function (t) { io.observe(t); });
  }
  spy(nav.querySelectorAll('a[href^="#"]:not(.btn)'), document.querySelectorAll("main > section[id]"), "-45% 0px -50% 0px");
})();
