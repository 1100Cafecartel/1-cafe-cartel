// Fills the page from content.js. You normally don't need to edit this file.
(function () {
  var s = window.STORE || {};

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

  var grid = document.getElementById("product-grid");
  (s.products || []).forEach(function (p) {
    var card = el("article", { class: "card" });
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

  var hours = document.getElementById("hours");
  (s.hours || []).forEach(function (h) {
    var tr = el("tr");
    tr.appendChild(el("th", {}, h[0]));
    tr.appendChild(el("td", {}, h[1]));
    hours.appendChild(tr);
  });

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
})();
