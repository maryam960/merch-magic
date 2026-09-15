/* Merch Magic — shared cart engine. Include on any page with:
   <script src="cart.js" defer></script>
   Single-product landing pages should also set, before this script:
   <script>window.__PRODUCT__ = { id: "slug", name: "Product Name", image: "image.png" };</script>
*/
(function () {
  "use strict";

  var STORAGE_KEY = "mm_cart";
  var WHATSAPP_NUMBER = "447892734800";
  var PURPLE = "#5b21b6";
  var PURPLE_DARK = "#1e0f3a";
  var GREEN = "#25D366";

  /* ── Cart data layer ── */
  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderBadge();
    renderDrawer();
    if (document.getElementById("cart-page-root")) renderCartPage();
  }

  function addToCart(item, qty) {
    qty = Math.max(1, qty || 1);
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === item.id; });
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: item.id, name: item.name, image: item.image, qty: qty, notes: "" });
    }
    saveCart(cart);
    return cart;
  }

  function updateQty(id, qty) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    if (qty <= 0) {
      cart = cart.filter(function (i) { return i.id !== id; });
    } else {
      item.qty = qty;
    }
    saveCart(cart);
  }

  function updateNotes(id, notes) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.notes = notes;
    saveCart(cart);
  }

  function removeItem(id) {
    saveCart(getCart().filter(function (i) { return i.id !== id; }));
  }

  function cartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function checkoutText() {
    var cart = getCart();
    if (!cart.length) return "";
    var lines = ["Hi! I'd like to order the following:", ""];
    cart.forEach(function (item, idx) {
      lines.push((idx + 1) + ". " + item.name + " — Qty: " + item.qty);
      if (item.notes && item.notes.trim()) {
        lines.push("   Note: " + item.notes.trim());
      }
    });
    lines.push("");
    lines.push("Please can you send me a quote + mockup for this order? I'll attach any artwork or reference files here in the chat.");
    return lines.join("\n");
  }

  function checkoutUrl() {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(checkoutText());
  }

  /* ── Shared styles ── */
  function injectStyles() {
    if (document.getElementById("mm-cart-styles")) return;
    var style = document.createElement("style");
    style.id = "mm-cart-styles";
    style.textContent = [
      ".mm-cart-fab{position:fixed;bottom:24px;right:96px;z-index:998;width:56px;height:56px;border-radius:50%;background:" + PURPLE_DARK + ";display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.28),0 2px 6px rgba(0,0,0,0.15);cursor:pointer;border:none;transition:transform .2s ease;}",
      ".mm-cart-fab:hover{transform:scale(1.08);}",
      ".mm-cart-fab svg{width:26px;height:26px;fill:#fff;}",
      ".mm-cart-badge{position:absolute;top:-4px;right:-4px;background:" + PURPLE + ";color:#fff;font-family:'Space Grotesk',sans-serif;font-size:.72rem;font-weight:800;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px;border:2px solid #fff;}",
      "@media(max-width:600px){.mm-cart-fab{width:48px;height:48px;bottom:16px;right:80px;}.mm-cart-fab svg{width:22px;height:22px;}}",
      ".mm-cart-overlay{position:fixed;inset:0;background:rgba(30,15,58,0.45);z-index:999;opacity:0;pointer-events:none;transition:opacity .25s ease;}",
      ".mm-cart-overlay.open{opacity:1;pointer-events:auto;}",
      ".mm-cart-drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,92vw);background:#f8f8f6;z-index:1000;box-shadow:-8px 0 32px rgba(0,0,0,0.18);transform:translateX(100%);transition:transform .3s ease;display:flex;flex-direction:column;font-family:'Inter',sans-serif;color:" + PURPLE_DARK + ";}",
      ".mm-cart-drawer.open{transform:translateX(0);}",
      ".mm-cart-head{padding:20px 20px 16px;border-bottom:1px solid rgba(30,15,58,0.1);display:flex;align-items:center;justify-content:space-between;}",
      ".mm-cart-head h3{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:800;margin:0;}",
      ".mm-cart-close{background:none;border:none;font-size:1.4rem;cursor:pointer;color:" + PURPLE_DARK + ";line-height:1;padding:4px;}",
      ".mm-cart-items{flex:1;overflow-y:auto;padding:16px 20px;}",
      ".mm-cart-empty{text-align:center;color:rgba(30,15,58,0.45);font-size:.9rem;padding:60px 20px;}",
      ".mm-cart-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid rgba(30,15,58,0.08);}",
      ".mm-cart-item img{width:56px;height:56px;border-radius:10px;object-fit:cover;background:#ede9fe;flex-shrink:0;}",
      ".mm-cart-item-body{flex:1;min-width:0;}",
      ".mm-cart-item-name{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.88rem;margin-bottom:6px;}",
      ".mm-cart-qty-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}",
      ".mm-qty-btn{width:24px;height:24px;border-radius:6px;border:1px solid rgba(30,15,58,0.15);background:#fff;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;color:" + PURPLE_DARK + ";}",
      ".mm-qty-val{font-size:.85rem;font-weight:700;min-width:20px;text-align:center;}",
      ".mm-cart-remove{margin-left:auto;background:none;border:none;color:rgba(30,15,58,0.4);cursor:pointer;font-size:.78rem;text-decoration:underline;}",
      ".mm-cart-notes{width:100%;font-size:.78rem;font-family:'Inter',sans-serif;border:1px solid rgba(30,15,58,0.12);border-radius:8px;padding:6px 8px;resize:vertical;min-height:32px;box-sizing:border-box;}",
      ".mm-cart-foot{padding:16px 20px 20px;border-top:1px solid rgba(30,15,58,0.1);background:#fff;}",
      ".mm-cart-foot-note{font-size:.72rem;color:rgba(30,15,58,0.5);margin-bottom:12px;line-height:1.5;}",
      ".mm-btn-checkout{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;background:" + GREEN + ";color:#fff;border:none;border-radius:100px;font-weight:700;font-size:.95rem;cursor:pointer;text-decoration:none;box-shadow:0 4px 14px rgba(37,211,102,0.35);}",
      ".mm-btn-viewcart{display:block;text-align:center;width:100%;padding:10px;margin-top:8px;background:none;border:none;color:" + PURPLE + ";font-weight:600;font-size:.82rem;cursor:pointer;text-decoration:underline;}",
      ".mm-atc-widget{display:flex;align-items:center;gap:12px;margin:16px 0;flex-wrap:wrap;}",
      ".mm-cfg{margin:18px 0 6px;max-width:480px;}",
      ".mm-cfg-row{display:flex;gap:16px;padding:14px 0;border-top:1px solid rgba(30,15,58,0.10);}",
      ".mm-cfg-row:last-of-type{border-bottom:1px solid rgba(30,15,58,0.10);}",
      ".mm-cfg-lbl{flex:0 0 96px;font-size:.8rem;font-weight:700;color:" + PURPLE_DARK + ";}",
      ".mm-cfg-lbl small{display:block;font-weight:500;opacity:.55;margin-top:2px;}",
      ".mm-cfg-opts{display:flex;flex-wrap:wrap;gap:8px;flex:1;}",
      ".mm-tier{min-width:46px;padding:9px 12px;border:1px solid rgba(30,15,58,0.15);border-radius:10px;background:#fff;cursor:pointer;font-family:'Inter',sans-serif;font-size:.85rem;font-weight:700;color:" + PURPLE_DARK + ";}",
      ".mm-tier:hover{border-color:" + PURPLE + ";}",
      ".mm-tier.on{border-color:" + PURPLE_DARK + ";box-shadow:inset 0 0 0 1px " + PURPLE_DARK + ";}",
      ".mm-cfg-note{font-size:.78rem;color:rgba(30,15,58,0.5);padding:12px 0 0;}",
      ".mm-price{padding:16px 0 4px;}",
      ".mm-price-total{font-family:'Space Grotesk',sans-serif;font-size:1.9rem;font-weight:800;letter-spacing:-.02em;color:" + PURPLE_DARK + ";line-height:1;}",
      ".mm-price-unit{font-size:.8rem;color:rgba(30,15,58,0.5);margin-top:6px;}",
      ".mm-price-vat{font-size:.72rem;color:rgba(30,15,58,0.38);margin-top:2px;}",
      ".mm-atc-qty{display:flex;align-items:center;gap:0;border:1px solid rgba(30,15,58,0.15);border-radius:100px;overflow:hidden;background:#fff;}",
      ".mm-atc-qty button{width:36px;height:40px;border:none;background:#fff;cursor:pointer;font-size:1.1rem;color:" + PURPLE_DARK + ";}",
      ".mm-atc-qty button:hover{background:#f0f0ee;}",
      ".mm-atc-qty span{min-width:32px;text-align:center;font-weight:700;font-size:.9rem;}",
      ".mm-qty-input{width:44px;min-width:44px;text-align:center;font-weight:700;font-size:.9rem;font-family:'Inter',sans-serif;border:none;background:transparent;color:" + PURPLE_DARK + ";-moz-appearance:textfield;}",
      ".mm-qty-input::-webkit-outer-spin-button,.mm-qty-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}",
      ".mm-qty-input:focus{outline:none;background:#f0f0ee;border-radius:4px;}",
      ".mm-btn-atc{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:100px;background:" + PURPLE + ";color:#fff;border:none;font-weight:700;font-size:.9rem;cursor:pointer;white-space:nowrap;transition:opacity .2s,transform .2s;}",
      ".mm-btn-atc:hover{opacity:.9;transform:translateY(-1px);}",
      ".mm-btn-atc.added{background:" + GREEN + ";}",
      "#cart-page-root .mm-cart-item{padding:20px 0;}",
      "#cart-page-root .mm-cart-item img{width:80px;height:80px;}",
      "#cart-page-root .mm-cart-notes{min-height:44px;}"
    ].join("\n");
    document.head.appendChild(style);
  }

  /* ── Floating cart button ── */
  var fabBadgeEl;
  function injectFab() {
    if (document.querySelector(".mm-cart-fab")) return;
    var btn = document.createElement("button");
    btn.className = "mm-cart-fab";
    btn.setAttribute("aria-label", "View cart");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg><span class="mm-cart-badge" style="display:none;">0</span>';
    btn.addEventListener("click", toggleDrawer);
    document.body.appendChild(btn);
    fabBadgeEl = btn.querySelector(".mm-cart-badge");
  }

  function renderBadge() {
    if (!fabBadgeEl) return;
    var n = cartCount();
    fabBadgeEl.textContent = n;
    fabBadgeEl.style.display = n > 0 ? "flex" : "none";
  }

  /* ── Drawer ── */
  var drawerEl, overlayEl, drawerItemsEl;
  function injectDrawer() {
    if (document.querySelector(".mm-cart-drawer")) return;
    overlayEl = document.createElement("div");
    overlayEl.className = "mm-cart-overlay";
    overlayEl.addEventListener("click", closeDrawer);

    drawerEl = document.createElement("div");
    drawerEl.className = "mm-cart-drawer";
    drawerEl.innerHTML =
      '<div class="mm-cart-head"><h3>Your Cart</h3><button class="mm-cart-close" aria-label="Close cart">×</button></div>' +
      '<div class="mm-cart-items"></div>' +
      '<div class="mm-cart-foot">' +
      '<p class="mm-cart-foot-note">Have artwork or reference files? Attach them directly in the WhatsApp chat once your order opens there.</p>' +
      '<a class="mm-btn-checkout" href="#">💬 Checkout on WhatsApp</a>' +
      '<button class="mm-btn-viewcart">View Full Cart Page →</button>' +
      "</div>";

    drawerEl.querySelector(".mm-cart-close").addEventListener("click", closeDrawer);
    drawerEl.querySelector(".mm-btn-viewcart").addEventListener("click", function () {
      window.location.href = "/cart";
    });

    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
    drawerItemsEl = drawerEl.querySelector(".mm-cart-items");
  }

  function openDrawer() {
    drawerEl.classList.add("open");
    overlayEl.classList.add("open");
  }
  function closeDrawer() {
    drawerEl.classList.remove("open");
    overlayEl.classList.remove("open");
  }
  function toggleDrawer() {
    if (drawerEl.classList.contains("open")) closeDrawer();
    else openDrawer();
  }

  function itemRowHTML(item) {
    var safeName = escapeHtml(item.name);
    return (
      '<div class="mm-cart-item" data-id="' + item.id + '">' +
      '<img src="' + item.image + '" alt="' + safeName + '">' +
      '<div class="mm-cart-item-body">' +
      '<div class="mm-cart-item-name">' + safeName + "</div>" +
      '<div class="mm-cart-qty-row">' +
      '<div class="mm-atc-qty">' +
      '<button type="button" data-action="dec">−</button>' +
      '<input type="number" class="mm-qty-input" min="1" value="' + item.qty + '">' +
      '<button type="button" data-action="inc">+</button>' +
      "</div>" +
      '<button type="button" class="mm-cart-remove">Remove</button>' +
      "</div>" +
      '<textarea class="mm-cart-notes" placeholder="Optional instructions (e.g. colour, logo placement)">' + escapeHtml(item.notes || "") + "</textarea>" +
      "</div>" +
      "</div>"
    );
  }

  function wireItemRow(rowEl, id) {
    rowEl.querySelector('[data-action="inc"]').addEventListener("click", function () {
      var item = getCart().find(function (i) { return i.id === id; });
      updateQty(id, (item ? item.qty : 0) + 1);
    });
    rowEl.querySelector('[data-action="dec"]').addEventListener("click", function () {
      var item = getCart().find(function (i) { return i.id === id; });
      updateQty(id, (item ? item.qty : 1) - 1);
    });
    var qtyInput = rowEl.querySelector(".mm-qty-input");
    qtyInput.addEventListener("change", function () {
      var val = parseInt(qtyInput.value, 10);
      if (isNaN(val)) val = 1;
      updateQty(id, val);
    });
    qtyInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") qtyInput.blur();
    });
    rowEl.querySelector(".mm-cart-remove").addEventListener("click", function () {
      removeItem(id);
    });
    var notesEl = rowEl.querySelector(".mm-cart-notes");
    var t;
    notesEl.addEventListener("input", function () {
      clearTimeout(t);
      var val = notesEl.value;
      t = setTimeout(function () { updateNotes(id, val); }, 300);
    });
  }

  function renderDrawer() {
    if (!drawerItemsEl) return;
    var cart = getCart();
    var checkoutBtn = drawerEl.querySelector(".mm-btn-checkout");
    if (!cart.length) {
      drawerItemsEl.innerHTML = '<div class="mm-cart-empty">Your cart is empty.<br>Add a product to get started.</div>';
      checkoutBtn.style.pointerEvents = "none";
      checkoutBtn.style.opacity = ".5";
      return;
    }
    checkoutBtn.style.pointerEvents = "auto";
    checkoutBtn.style.opacity = "1";
    checkoutBtn.href = checkoutUrl();
    checkoutBtn.setAttribute("target", "_blank");

    var activeId = document.activeElement && document.activeElement.closest ? (document.activeElement.closest(".mm-cart-item") || {}).dataset : null;
    drawerItemsEl.innerHTML = cart.map(itemRowHTML).join("");
    cart.forEach(function (item) {
      wireItemRow(drawerItemsEl.querySelector('.mm-cart-item[data-id="' + cssEscape(item.id) + '"]'), item.id);
    });
  }

  /* ── Dedicated cart page ── */
  function renderCartPage() {
    var root = document.getElementById("cart-page-root");
    if (!root) return;
    var cart = getCart();
    if (!cart.length) {
      root.innerHTML =
        '<div class="mm-cart-empty" style="padding:100px 20px;">Your cart is empty.<br><br><a href="/products" style="color:' + PURPLE + ';font-weight:700;">Browse Products →</a></div>';
      return;
    }
    var itemsHtml = cart.map(itemRowHTML).join("");
    root.innerHTML =
      '<div class="mm-cart-items" style="max-width:640px;margin:0 auto;padding:0;">' + itemsHtml + "</div>" +
      '<div style="max-width:640px;margin:32px auto 0;">' +
      '<p class="mm-cart-foot-note" style="text-align:center;">Have artwork or reference files? Attach them directly in the WhatsApp chat once your order opens there.</p>' +
      '<a class="mm-btn-checkout" id="cart-page-checkout" href="' + checkoutUrl() + '" target="_blank">💬 Checkout on WhatsApp</a>' +
      "</div>";
    cart.forEach(function (item) {
      wireItemRow(root.querySelector('.mm-cart-item[data-id="' + cssEscape(item.id) + '"]'), item.id);
    });
  }

  /* ── Quantity + live price configurator (only when pricing data exists) ── */
  function pricingFor(id) {
    var all = window.MM_PRICING;
    if (!all || !all[id]) return null;
    var cfg = all[id];
    if (!cfg.tiers || !cfg.tiers.length) return null;
    var tiers = cfg.tiers.slice().sort(function (a, b) { return a.qty - b.qty; });
    return {
      tiers: tiers,
      minQty: cfg.minQty || 1,
      leadDays: cfg.leadDays || [5, 7]
    };
  }

  function unitAt(pricing, qty) {
    var unit = pricing.tiers[0].unit;
    for (var i = 0; i < pricing.tiers.length; i++) {
      if (qty >= pricing.tiers[i].qty) unit = pricing.tiers[i].unit;
    }
    return unit;
  }

  function money(n) {
    return "£" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /** Working-day delivery window, skipping weekends. */
  function deliveryWindow(leadDays) {
    function addWorkdays(days) {
      var d = new Date();
      while (days > 0) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) days--;
      }
      return d;
    }
    var opts = { day: "numeric", month: "short" };
    var a = addWorkdays(leadDays[0]).toLocaleDateString("en-GB", opts);
    var b = addWorkdays(leadDays[1]).toLocaleDateString("en-GB", opts);
    return a + " – " + b;
  }

  function buildConfigurator(pricing, onQtyChange) {
    var presets = pricing.tiers.map(function (t) { return t.qty; });
    var qty = presets[0];

    var wrap = document.createElement("div");
    wrap.className = "mm-cfg";
    wrap.innerHTML =
      '<div class="mm-cfg-row">' +
        '<div class="mm-cfg-lbl">Quantity<small class="mm-cfg-qty"></small></div>' +
        '<div class="mm-cfg-opts"></div>' +
      "</div>" +
      '<div class="mm-cfg-row">' +
        '<div class="mm-cfg-lbl">Delivery<small>' + (pricing.minQty > 1 ? pricing.minQty + " min" : "No minimum") + "</small></div>" +
        '<div class="mm-cfg-opts"><span class="mm-cfg-note" style="padding:0;">Arrives ' +
          deliveryWindow(pricing.leadDays) + " · " + pricing.leadDays[0] + "–" + pricing.leadDays[1] +
        " working days</span></div>" +
      "</div>" +
      '<div class="mm-price">' +
        '<div class="mm-price-total"></div>' +
        '<div class="mm-price-unit"></div>' +
        '<div class="mm-price-vat">Excludes VAT · free digital mockup before production</div>' +
      "</div>";

    var opts = wrap.querySelector(".mm-cfg-opts");
    var qtyLbl = wrap.querySelector(".mm-cfg-qty");
    var totalEl = wrap.querySelector(".mm-price-total");
    var unitEl = wrap.querySelector(".mm-price-unit");

    function paint() {
      var unit = unitAt(pricing, qty);
      totalEl.textContent = money(unit * qty);
      unitEl.textContent = money(unit) + "/pc · " + qty + " pcs";
      qtyLbl.textContent = qty + " pcs";
      Array.prototype.forEach.call(opts.querySelectorAll(".mm-tier"), function (b) {
        b.classList.toggle("on", parseInt(b.dataset.qty, 10) === qty);
      });
      if (onQtyChange) onQtyChange(qty);
    }

    presets.forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mm-tier";
      b.dataset.qty = n;
      b.textContent = n;
      b.addEventListener("click", function () { qty = n; paint(); });
      opts.appendChild(b);
    });

    var custom = document.createElement("button");
    custom.type = "button";
    custom.className = "mm-tier";
    custom.textContent = "＋";
    custom.title = "Another quantity";
    custom.addEventListener("click", function () {
      var v = prompt("How many would you like?", String(qty));
      if (v === null) return;
      var n = parseInt(v, 10);
      if (!isNaN(n) && n >= pricing.minQty) { qty = n; paint(); }
    });
    opts.appendChild(custom);

    paint();
    return { el: wrap, getQty: function () { return qty; } };
  }

  /* ── Add-to-cart widget: single product landing pages ── */
  function injectSingleProductWidget() {
    var product = window.__PRODUCT__;
    if (!product || !product.id) return;
    var mount = document.querySelector(".hero-chips");
    if (!mount) return;

    // When this product has pricing, show the tier + live price configurator
    // above the add-to-cart row. Otherwise the page is unchanged.
    var pricing = pricingFor(product.id);
    var cfg = null;
    if (pricing) {
      cfg = buildConfigurator(pricing);
      mount.parentNode.insertBefore(cfg.el, mount.nextSibling);
      mount = cfg.el;
    }

    var widget = document.createElement("div");
    widget.className = "mm-atc-widget";
    widget.innerHTML =
      '<div class="mm-atc-qty">' +
      '<button type="button" data-action="dec">−</button>' +
      '<input type="number" class="mm-qty-input" min="1" value="1">' +
      '<button type="button" data-action="inc">+</button>' +
      "</div>" +
      '<button type="button" class="mm-btn-atc">🛒 Add to Cart</button>';
    if (cfg) widget.querySelector(".mm-atc-qty").style.display = "none";
    mount.parentNode.insertBefore(widget, mount.nextSibling);

    var qtyInput = widget.querySelector(".mm-qty-input");
    function currentQty() {
      if (cfg) return cfg.getQty();
      var val = parseInt(qtyInput.value, 10);
      return isNaN(val) || val < 1 ? 1 : val;
    }
    widget.querySelector('[data-action="inc"]').addEventListener("click", function () {
      qtyInput.value = currentQty() + 1;
    });
    widget.querySelector('[data-action="dec"]').addEventListener("click", function () {
      qtyInput.value = Math.max(1, currentQty() - 1);
    });
    qtyInput.addEventListener("change", function () {
      qtyInput.value = currentQty();
    });
    qtyInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") qtyInput.blur();
    });
    var atcBtn = widget.querySelector(".mm-btn-atc");
    atcBtn.addEventListener("click", function () {
      addToCart(product, currentQty());
      atcBtn.textContent = "✓ Added";
      atcBtn.classList.add("added");
      openDrawer();
      setTimeout(function () {
        atcBtn.textContent = "🛒 Add to Cart";
        atcBtn.classList.remove("added");
      }, 1800);
    });
  }

  /* ── Utils ── */
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }
  function cssEscape(id) {
    return String(id).replace(/"/g, '\\"');
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    injectFab();
    injectDrawer();
    renderBadge();
    renderDrawer();
    injectSingleProductWidget();
    renderCartPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.MMCart = {
    add: addToCart,
    get: getCart,
    updateQty: updateQty,
    remove: removeItem,
    openDrawer: openDrawer
  };
})();
