// Online ordering: item options, cart, checkout and sending the order to the café.
// Settings live in content.js (menu, extras, delivery, orderEmail, orderTextNumber).
// You normally don't need to edit this file.
(function () {
  var s = window.STORE || {};
  if (s.orderUrl) return; // Toast Online Ordering handles orders instead

  var menu = s.menu || [];
  var allExtras = s.extras || [];
  var zones = s.delivery || [];
  var STORAGE_KEY = "cafe-cart-v2";
  var lines = []; // { s, i, size, choice, extras: [{ n, c }], qty }

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function money(n) { return "$" + n.toFixed(2); }
  function amount(str) { return parseFloat(String(str || "0").replace(/[^\d.]/g, "")) || 0; }
  function itemOf(line) { return menu[line.s] && menu[line.s].items[line.i]; }
  function extraOf(name) { for (var i = 0; i < allExtras.length; i++) if (allExtras[i].name === name) return allExtras[i]; }
  function basePrice(item, size) { return item.sizes ? item.sizes[size] : item.price || 0; }
  function unitPrice(line) {
    var item = itemOf(line);
    return basePrice(item, line.size) + line.extras.reduce(function (a, x) { return a + ((extraOf(x.n) || {}).price || 0); }, 0);
  }
  function describe(line) {
    var bits = [];
    if (line.size) bits.push(line.size);
    if (line.choice) bits.push(line.choice);
    line.extras.forEach(function (x) { bits.push(x.c ? x.c : x.n); });
    return bits.join(" · ");
  }
  function sameLine(a, b) {
    return a.s === b.s && a.i === b.i && a.size === b.size && a.choice === b.choice &&
      JSON.stringify(a.extras) === JSON.stringify(b.extras);
  }

  try {
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").forEach(function (l) {
      var item = menu[l.s] && menu[l.s].items[l.i];
      if (!item || !(l.qty > 0)) return;
      if (item.sizes && !(l.size in item.sizes)) return;
      if (!Array.isArray(l.extras) || l.extras.some(function (x) { return !extraOf(x.n); })) return;
      lines.push(l);
    });
  } catch (e) {}
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch (e) {}
  }

  function addLine(line, qty, btn) {
    line.qty = qty;
    for (var k = 0; k < lines.length; k++) {
      if (sameLine(lines[k], line)) { lines[k].qty += qty; line = null; break; }
    }
    if (line) lines.push(line);
    save();
    render();
    fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump");
    if (btn) {
      btn.classList.add("added");
      btn.textContent = "✓";
      setTimeout(function () { btn.classList.remove("added"); btn.textContent = "+"; }, 900);
    }
  }

  // ---------- Item options sheet (sizes, choices, add-ons) ----------
  var sheetOverlay = el("div", { class: "drawer-overlay", hidden: "" });
  var sheet = el("div", { class: "sheet", role: "dialog", "aria-modal": "true", hidden: "" });
  document.body.appendChild(sheetOverlay);
  document.body.appendChild(sheet);
  var sheetBtn = null;

  function openSheet(si, ii, btn) {
    var sec = menu[si], item = sec.items[ii];
    var hasExtras = sec.extras && allExtras.length;
    if (!item.sizes && !item.choices && !hasExtras) {
      addLine({ s: si, i: ii, size: "", choice: "", extras: [] }, 1, btn);
      return;
    }
    sheetBtn = btn;
    sheet.innerHTML = "";
    sheet.setAttribute("aria-label", item.name);
    var head = el("div", { class: "drawer-head" });
    head.appendChild(el("h2", {}, item.name));
    var x = el("button", { type: "button", class: "drawer-close", "aria-label": "Close" }, "×");
    x.addEventListener("click", closeSheet);
    head.appendChild(x);
    sheet.appendChild(head);

    var body = el("form", { class: "sheet-body" });
    if (item.desc) body.appendChild(el("p", { class: "small" }, item.desc));

    function group(title, name, opts, type) {
      var fs = el("fieldset", { class: "opt-group" });
      fs.appendChild(el("legend", {}, title));
      opts.forEach(function (o, k) {
        var lab = el("label", { class: "opt" });
        var input = el("input", { type: type, name: name, value: o.value });
        if (type === "radio" && k === 0) input.checked = true;
        lab.appendChild(input);
        lab.appendChild(el("span", {}, o.label));
        if (o.price) lab.appendChild(el("small", {}, o.price));
        fs.appendChild(lab);
      });
      body.appendChild(fs);
      return fs;
    }
    if (item.sizes) {
      group("Size", "size", Object.keys(item.sizes).map(function (n) { return { value: n, label: n, price: money(item.sizes[n]) }; }), "radio");
    }
    if (item.choices) {
      group("Choose one", "choice", item.choices.map(function (c) { return { value: c, label: c }; }), "radio");
    }
    if (hasExtras) {
      var fs = group("Make it yours", "extra", allExtras.map(function (e) { return { value: e.name, label: e.name, price: "+" + money(e.price) }; }), "checkbox");
      fs.querySelectorAll(".opt").forEach(function (lab, k) {
        var ex = allExtras[k];
        if (!ex.choices) return;
        var sel = el("select", { name: "extra-choice-" + k, "aria-label": ex.name, hidden: "" });
        ex.choices.forEach(function (c) { sel.appendChild(el("option", { value: c }, c)); });
        lab.parentNode.insertBefore(sel, lab.nextSibling);
        lab.querySelector("input").addEventListener("change", function (e) { sel.hidden = !e.target.checked; });
      });
    }
    sheet.appendChild(body);

    var foot = el("div", { class: "drawer-foot" });
    var actions = el("div", { class: "actions" });
    var qty = 1;
    var qtyBox = el("div", { class: "qty" });
    var minus = el("button", { type: "button", "aria-label": "One less" }, "−");
    var qtyNum = el("span", {}, "1");
    var plus = el("button", { type: "button", "aria-label": "One more" }, "+");
    qtyBox.appendChild(minus); qtyBox.appendChild(qtyNum); qtyBox.appendChild(plus);
    var add = el("button", { type: "button", class: "btn" });
    actions.appendChild(qtyBox);
    actions.appendChild(add);
    foot.appendChild(actions);
    sheet.appendChild(foot);

    function current() {
      var f = body.elements;
      var extras = [];
      var boxes = body.querySelectorAll('input[name="extra"]');
      allExtras.forEach(function (ex, k) {
        if (boxes[k] && boxes[k].checked) {
          var sel = body.querySelector('select[name="extra-choice-' + k + '"]');
          extras.push(sel ? { n: ex.name, c: sel.value } : { n: ex.name });
        }
      });
      return {
        s: si, i: ii,
        size: item.sizes ? f.size.value : "",
        choice: item.choices ? f.choice.value : "",
        extras: extras,
      };
    }
    function update() {
      qtyNum.textContent = qty;
      add.textContent = "Add " + qty + " · " + money(unitPrice(current()) * qty);
    }
    minus.addEventListener("click", function () { if (qty > 1) { qty--; update(); } });
    plus.addEventListener("click", function () { qty++; update(); });
    body.addEventListener("change", update);
    body.addEventListener("submit", function (e) { e.preventDefault(); });
    add.addEventListener("click", function () {
      addLine(current(), qty, sheetBtn);
      closeSheet();
    });
    update();

    sheetOverlay.hidden = false;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheetOverlay.classList.add("open"); sheet.classList.add("open"); });
    document.body.classList.add("drawer-lock");
    x.focus();
  }
  function closeSheet() {
    sheetOverlay.classList.remove("open");
    sheet.classList.remove("open");
    document.body.classList.remove("drawer-lock");
    setTimeout(function () { sheetOverlay.hidden = true; sheet.hidden = true; }, 250);
    if (sheetBtn) sheetBtn.focus();
  }
  sheetOverlay.addEventListener("click", closeSheet);

  document.querySelectorAll(".add-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { openSheet(+btn.dataset.section, +btn.dataset.item, btn); });
  });

  // ---------- Floating cart button ----------
  var fab = el("button", { class: "cart-fab", type: "button", "aria-label": "View your order" });
  fab.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 8h14l-1.5 11a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7zM9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="cart-count">0</span>';
  document.body.appendChild(fab);

  // ---------- Cart drawer ----------
  var overlay = el("div", { class: "drawer-overlay", hidden: "" });
  var drawer = el("aside", { class: "drawer", role: "dialog", "aria-modal": "true", "aria-label": "Your order", hidden: "" });
  drawer.innerHTML =
    '<div class="drawer-head"><h2>Your order</h2><button type="button" class="drawer-close" aria-label="Close">&times;</button></div>' +
    '<div class="drawer-body">' +
    '  <section class="step step-cart"><ul class="cart-items"></ul><p class="cart-empty">Your order is empty. Tap <strong>+</strong> on any menu item.</p></section>' +
    '  <form class="step step-checkout" hidden novalidate>' +
    '    <fieldset class="types"><legend>How would you like it?</legend></fieldset>' +
    '    <label>Name<input name="name" autocomplete="name" required></label>' +
    '    <label>Phone<input name="phone" type="tel" autocomplete="tel" required></label>' +
    '    <label class="addr">Delivery address<input name="address" autocomplete="street-address"></label>' +
    '    <label>When<select name="time"></select></label>' +
    '    <label>Notes (optional)<textarea name="notes" rows="2" placeholder="Extra hot, allergies, gate code..."></textarea></label>' +
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
    var sel = form.elements.time;
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

  function subtotal() { return lines.reduce(function (a, l) { return a + unitPrice(l) * l.qty; }, 0); }
  function count() { return lines.reduce(function (a, l) { return a + l.qty; }, 0); }

  function render() {
    var n = count();
    fab.querySelector(".cart-count").textContent = n;
    fab.classList.toggle("has-items", n > 0);

    var ul = q(".cart-items");
    ul.innerHTML = "";
    lines.forEach(function (l, k) {
      var li = el("li", { class: "cart-item" });
      var info = el("div");
      info.appendChild(el("strong", {}, itemOf(l).name));
      var d = describe(l);
      info.appendChild(el("small", {}, (d ? d + " · " : "") + money(unitPrice(l)) + " each"));
      li.appendChild(info);
      var qty = el("div", { class: "qty" });
      var minus = el("button", { type: "button", "aria-label": "Remove one " + itemOf(l).name }, "−");
      var plus = el("button", { type: "button", "aria-label": "Add one " + itemOf(l).name }, "+");
      minus.addEventListener("click", function () { l.qty--; if (l.qty <= 0) lines.splice(k, 1); save(); render(); });
      plus.addEventListener("click", function () { l.qty++; save(); render(); });
      qty.appendChild(minus);
      qty.appendChild(el("span", {}, l.qty));
      qty.appendChild(plus);
      li.appendChild(qty);
      li.appendChild(el("span", { class: "line-total" }, money(unitPrice(l) * l.qty)));
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
      go.addEventListener("click", function () { step = "checkout"; fillTimes(); render(); form.elements.name.focus(); });
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
    var out = [
      "NEW ORDER " + id + " · " + (s.name || "Cafe"),
      (isDelivery ? "DELIVERY (" + type.area + ")" : "PICKUP") + " · " + f.time,
      "",
      "Name: " + f.name,
      "Phone: " + f.phone,
    ];
    if (isDelivery) out.push("Address: " + f.address);
    out.push("");
    lines.forEach(function (l) {
      var d = describe(l);
      out.push(l.qty + " x " + itemOf(l).name + (d ? " (" + d + ")" : "") + "  " + money(unitPrice(l) * l.qty));
    });
    out.push("");
    out.push("Subtotal: " + money(sub));
    if (isDelivery) out.push("Delivery fee: " + money(type.fee));
    out.push("TOTAL: " + money(sub + (isDelivery ? type.fee : 0)) + " (pay " + (isDelivery ? "on delivery" : "at pickup") + ")");
    if (f.notes) { out.push(""); out.push("Notes: " + f.notes); }
    return { id: id, subject: "Order " + id + " · " + (isDelivery ? "Delivery" : "Pickup") + " · " + f.name, body: out.join("\n") };
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
    lines = [];
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
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!sheet.hidden) closeSheet();
    else if (!drawer.hidden) closeDrawer();
  });

  // "Order" buttons elsewhere: open the cart if it has items, otherwise go to the menu
  document.querySelectorAll(".order-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (count() > 0) { e.preventDefault(); openDrawer(); }
    });
  });

  render();
})();
