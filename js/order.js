// Online ordering: cart, checkout and sending the order to the café.
// Settings live in content.js (orderEmail, orderTextNumber, delivery). You normally don't need to edit this file.
(function () {
  var s = window.STORE || {};
  if (s.orderUrl) return; // Toast Online Ordering handles orders instead

  var products = s.products || [];
  var zones = s.delivery || [];
  var cart = {}; // product index -> quantity
  var STORAGE_KEY = "cafe-cart";

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function money(n) { return "$" + n.toFixed(2); }
  function price(p) { return parseFloat(String(p.price || "0").replace(/[^\d.]/g, "")) || 0; }
  function amount(str) { return parseFloat(String(str || "0").replace(/[^\d.]/g, "")) || 0; }

  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    for (var k in saved) if (products[k] && saved[k] > 0) cart[k] = saved[k];
  } catch (e) {}
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  // "+ Add" button on every menu card
  var cards = document.querySelectorAll("#product-grid .card");
  cards.forEach(function (card, i) {
    var btn = el("button", { class: "add-btn", type: "button", "aria-label": "Add " + products[i].name + " to order" }, "+ Add");
    btn.addEventListener("click", function () {
      cart[i] = (cart[i] || 0) + 1;
      save();
      render();
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(function () { btn.textContent = "+ Add"; btn.classList.remove("added"); }, 1000);
      fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump");
    });
    card.querySelector(".card-body").appendChild(btn);
  });

  // Floating cart button
  var fab = el("button", { class: "cart-fab", type: "button", "aria-label": "View your order" });
  fab.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 8h14l-1.5 11a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7zM9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="cart-count">0</span>';
  document.body.appendChild(fab);

  // Slide-out drawer
  var overlay = el("div", { class: "drawer-overlay", hidden: "" });
  var drawer = el("aside", { class: "drawer", role: "dialog", "aria-modal": "true", "aria-label": "Your order", hidden: "" });
  drawer.innerHTML =
    '<div class="drawer-head"><h2>Your order</h2><button type="button" class="drawer-close" aria-label="Close">&times;</button></div>' +
    '<div class="drawer-body">' +
    '  <section class="step step-cart"><ul class="cart-items"></ul><p class="cart-empty">Your order is empty. Tap <strong>+ Add</strong> on any menu item.</p></section>' +
    '  <form class="step step-checkout" hidden novalidate>' +
    '    <fieldset class="types"><legend>How would you like it?</legend></fieldset>' +
    '    <label>Name<input name="name" autocomplete="name" required></label>' +
    '    <label>Phone<input name="phone" type="tel" autocomplete="tel" required></label>' +
    '    <label class="addr">Delivery address<input name="address" autocomplete="street-address"></label>' +
    '    <label>When<select name="time"></select></label>' +
    '    <label>Notes (optional)<textarea name="notes" rows="2" placeholder="Oat milk, extra hot, gate code..."></textarea></label>' +
    '  </form>' +
    '  <section class="step step-done" hidden>' +
    '    <div class="done-icon">✓</div><h3>Almost done!</h3>' +
    '    <p>Your order <strong class="order-id"></strong> has opened in your <span class="via">messages</span> app. <strong>Press Send</strong> to place it.</p>' +
    '    <p>We\'ll reply to confirm. Pay when you pick up or when your order is delivered.</p>' +
    '    <p class="small">Didn\'t open? <a class="resend-email" href="#">Send by email instead</a></p>' +
    '  </section>' +
    '</div>' +
    '<div class="drawer-foot">' +
    '  <div class="totals"></div>' +
    '  <p class="warn" hidden></p>' +
    '  <div class="actions"></div>' +
    '</div>';
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  var q = function (sel) { return drawer.querySelector(sel); };
  var form = q(".step-checkout");
  var step = "cart";

  // Pickup / delivery choices
  var types = [{ id: "pickup", label: "Pickup", sub: "Free · no minimum", fee: 0, min: 0 }];
  zones.forEach(function (z, i) {
    types.push({ id: "delivery-" + i, label: "Delivery · " + z.area, sub: z.fee + " fee · " + z.minimum + " minimum", fee: amount(z.fee), min: amount(z.minimum), area: z.area });
  });
  types.forEach(function (t, i) {
    var lab = el("label", { class: "type" });
    var input = el("input", { type: "radio", name: "type", value: t.id });
    if (i === 0) input.checked = true;
    lab.appendChild(input);
    var txt = el("span");
    txt.appendChild(el("strong", {}, t.label));
    txt.appendChild(el("small", {}, t.sub));
    lab.appendChild(txt);
    q(".types").appendChild(lab);
  });
  function currentType() {
    var v = (form.querySelector('input[name="type"]:checked') || {}).value;
    for (var i = 0; i < types.length; i++) if (types[i].id === v) return types[i];
    return types[0];
  }

  // Time choices: ASAP plus 15-minute slots for the rest of today's opening hours
  function fillTimes() {
    var sel = form.querySelector('select[name="time"]');
    var prev = sel.value;
    sel.innerHTML = "";
    var now = new Date();
    var today = window.CafeHours ? window.CafeHours.today(now) : undefined;
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = today && mins >= today.open && mins < today.close;
    if (today === undefined || open) sel.appendChild(el("option", { value: "As soon as possible" }, "As soon as possible (about 15–20 min)"));
    if (today) {
      var start = Math.max(today.open, Math.ceil((mins + 30) / 15) * 15);
      for (var t = start; t <= today.close - 15; t += 15) {
        var h = Math.floor(t / 60), m = t % 60;
        var label = ((h + 11) % 12 + 1) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " AM" : " PM");
        sel.appendChild(el("option", { value: "Today " + label }, "Today at " + label));
      }
    }
    if (!sel.options.length) sel.appendChild(el("option", { value: "Next opening" }, "We're closed now · first thing when we open"));
    if (prev) sel.value = prev;
    if (!sel.value) sel.selectedIndex = 0;
  }

  function items() {
    var list = [];
    for (var i in cart) list.push({ i: +i, p: products[i], qty: cart[i], total: price(products[i]) * cart[i] });
    return list;
  }
  function subtotal() { return items().reduce(function (a, x) { return a + x.total; }, 0); }
  function count() { return items().reduce(function (a, x) { return a + x.qty; }, 0); }

  function render() {
    var n = count();
    fab.querySelector(".cart-count").textContent = n;
    fab.classList.toggle("has-items", n > 0);

    var ul = q(".cart-items");
    ul.innerHTML = "";
    items().forEach(function (x) {
      var li = el("li", { class: "cart-item" });
      var info = el("div");
      info.appendChild(el("strong", {}, x.p.name));
      info.appendChild(el("small", {}, money(price(x.p)) + " each"));
      li.appendChild(info);
      var qty = el("div", { class: "qty" });
      var minus = el("button", { type: "button", "aria-label": "Remove one " + x.p.name }, "−");
      var plus = el("button", { type: "button", "aria-label": "Add one " + x.p.name }, "+");
      minus.addEventListener("click", function () { cart[x.i]--; if (cart[x.i] <= 0) delete cart[x.i]; save(); render(); });
      plus.addEventListener("click", function () { cart[x.i]++; save(); render(); });
      qty.appendChild(minus);
      qty.appendChild(el("span", {}, x.qty));
      qty.appendChild(plus);
      li.appendChild(qty);
      li.appendChild(el("span", { class: "line-total" }, money(x.total)));
      ul.appendChild(li);
    });
    q(".cart-empty").hidden = n > 0;

    q(".step-cart").hidden = step !== "cart";
    form.hidden = step !== "checkout";
    q(".step-done").hidden = step !== "done";

    var type = currentType();
    var sub = subtotal();
    var isDelivery = type.id !== "pickup";
    form.querySelector(".addr").hidden = !isDelivery;

    var totals = q(".totals");
    totals.innerHTML = "";
    function row(label, val, cls) {
      var r = el("div", { class: "row " + (cls || "") });
      r.appendChild(el("span", {}, label));
      r.appendChild(el("span", {}, val));
      totals.appendChild(r);
    }
    if (step !== "done" && n > 0) {
      row("Subtotal", money(sub));
      if (step === "checkout" && isDelivery) row("Delivery fee", money(type.fee));
      if (step === "checkout") row("Total", money(sub + (isDelivery ? type.fee : 0)), "grand");
    }

    var warn = q(".warn");
    var short = step === "checkout" && isDelivery && sub < type.min;
    warn.hidden = !short;
    if (short) warn.textContent = type.label + " has a " + money(type.min) + " minimum. Add " + money(type.min - sub) + " more, or choose Pickup.";

    var actions = q(".actions");
    actions.innerHTML = "";
    if (step === "cart") {
      var go = el("button", { type: "button", class: "btn block" }, "Checkout");
      go.disabled = n === 0;
      go.addEventListener("click", function () { step = "checkout"; fillTimes(); render(); form.querySelector('input[name="name"]').focus(); });
      actions.appendChild(go);
    } else if (step === "checkout") {
      var back = el("button", { type: "button", class: "btn btn-outline" }, "Back");
      back.addEventListener("click", function () { step = "cart"; render(); });
      actions.appendChild(back);
      if (s.orderTextNumber) {
        var sms = el("button", { type: "button", class: "btn" }, "Send order by text");
        sms.disabled = short;
        sms.addEventListener("click", function () { submit("sms"); });
        actions.appendChild(sms);
      }
      if (s.orderEmail) {
        var mail = el("button", { type: "button", class: s.orderTextNumber ? "btn btn-outline" : "btn" }, "Send order by email");
        mail.disabled = short;
        mail.addEventListener("click", function () { submit("email"); });
        actions.appendChild(mail);
      }
    } else {
      var close = el("button", { type: "button", class: "btn block" }, "Done");
      close.addEventListener("click", closeDrawer);
      actions.appendChild(close);
    }
  }

  var lastMessage = null;

  function buildMessage(f) {
    var type = currentType();
    var isDelivery = type.id !== "pickup";
    var sub = subtotal();
    var id = "CC-" + Math.floor(1000 + Math.random() * 9000);
    var lines = [
      "NEW ORDER " + id + " · " + (s.name || "Cafe"),
      (isDelivery ? "DELIVERY (" + type.area + ")" : "PICKUP") + " · " + f.time,
      "",
      "Name: " + f.name,
      "Phone: " + f.phone,
    ];
    if (isDelivery) lines.push("Address: " + f.address);
    lines.push("");
    items().forEach(function (x) { lines.push(x.qty + " x " + x.p.name + "  " + money(x.total)); });
    lines.push("");
    lines.push("Subtotal: " + money(sub));
    if (isDelivery) lines.push("Delivery fee: " + money(type.fee));
    lines.push("TOTAL: " + money(sub + (isDelivery ? type.fee : 0)) + " (pay " + (isDelivery ? "on delivery" : "at pickup") + ")");
    if (f.notes) { lines.push(""); lines.push("Notes: " + f.notes); }
    return { id: id, subject: "Order " + id + " · " + (isDelivery ? "Delivery" : "Pickup") + " · " + f.name, body: lines.join("\n") };
  }

  function send(via, msg) {
    var url = via === "sms"
      ? "sms:" + s.orderTextNumber + "?&body=" + encodeURIComponent(msg.body)
      : "mailto:" + s.orderEmail + "?subject=" + encodeURIComponent(msg.subject) + "&body=" + encodeURIComponent(msg.body);
    window.lastOrderMessage = msg;
    window.location.href = url;
  }

  function submit(via) {
    var fields = form.elements;
    var f = {
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      address: fields.address.value.trim(),
      time: fields.time.value,
      notes: fields.notes.value.trim(),
    };
    var isDelivery = currentType().id !== "pickup";
    var missing = !f.name ? fields.name : !f.phone ? fields.phone : isDelivery && !f.address ? fields.address : null;
    form.querySelectorAll(".invalid").forEach(function (n) { n.classList.remove("invalid"); });
    if (missing) {
      missing.classList.add("invalid");
      missing.focus();
      return;
    }
    lastMessage = buildMessage(f);
    send(via, lastMessage);
    q(".order-id").textContent = lastMessage.id;
    q(".via").textContent = via === "sms" ? "messages" : "email";
    q(".resend-email").parentNode.hidden = via === "email" || !s.orderEmail;
    cart = {};
    save();
    step = "done";
    render();
  }

  q(".resend-email").addEventListener("click", function (e) {
    e.preventDefault();
    if (lastMessage) send("email", lastMessage);
  });

  form.addEventListener("change", function (e) { if (e.target.name === "type") render(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  form.addEventListener("input", function (e) { e.target.classList.remove("invalid"); });

  var lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    if (step === "done") step = "cart";
    render();
    overlay.hidden = false;
    drawer.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add("open"); drawer.classList.add("open"); });
    document.body.classList.add("drawer-lock");
    q(".drawer-close").focus();
  }
  function closeDrawer() {
    overlay.classList.remove("open");
    drawer.classList.remove("open");
    document.body.classList.remove("drawer-lock");
    setTimeout(function () { overlay.hidden = true; drawer.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }
  fab.addEventListener("click", openDrawer);
  overlay.addEventListener("click", closeDrawer);
  q(".drawer-close").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });

  // "Order" buttons elsewhere: open the cart if it has items, otherwise go to the menu
  document.querySelectorAll(".order-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (count() > 0) { e.preventDefault(); openDrawer(); }
    });
  });

  render();
})();
