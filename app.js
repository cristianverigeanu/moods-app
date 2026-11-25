/* MOODS by Roxy — logica aplicației. Datele stau în data.js (doar text).
   Tot textul se pune în pagină ca text (textContent), niciodată ca HTML. */
(function () {
  "use strict";

  var D = window.MOODS_DATA;
  var S = D.salon;
  var view = document.getElementById("view");
  var LS_NOTIFY = "moods-notify", LS_INSTALL = "moods-install-dismissed";
  var notifyOn = localStorage.getItem(LS_NOTIFY) === "1";

  /* ---------- Utilitare ---------- */
  // h("a", {class: "x", href: "#"}, "text", copil, [copii]) → element. Șirurile devin noduri text.
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") el.className = v;
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  function tbd(label) { return h("span", { class: "tbd" }, label); }
  function wa(text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); }
  function ext(href, cls, label) { return h("a", { class: cls, href: href, target: "_blank", rel: "noopener" }, label); }
  function img(src, alt, cls) { return h("img", { src: src, alt: alt || "", class: cls, loading: "lazy", decoding: "async" }); }
  function now() { return Date.now(); }
  function active(list) { return list.filter(function (x) { return new Date(x.until).getTime() > now(); }); }
  function service(id) { return D.services.filter(function (s) { return s.id === id; })[0]; }
  function offer(id) { return D.offers.filter(function (o) { return o.id === id; })[0]; }
  function bellIcon(size) {
    var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", size); svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "ico");
    ["M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.9 1.9 0 0 0 3.4 0"].forEach(function (d) {
      var p = document.createElementNS(ns, "path"); p.setAttribute("d", d); svg.appendChild(p);
    });
    return svg;
  }
  function sectionHead(title, link, linkText) {
    return h("div", { class: "section-h" }, h("h2", null, title), link ? h("a", { href: link }, linkText) : null);
  }

  /* ---------- Componente ---------- */
  function countdown(o) {
    return h("div", { class: "countdown", "data-until": o.until },
      h("div", null, h("b", { "data-d": "" }, "--"), h("small", null, "zile")),
      h("div", null, h("b", { "data-h": "" }, "--"), h("small", null, "ore")),
      h("div", null, h("b", { "data-m": "" }, "--"), h("small", null, "min")));
  }

  function offerCard(o, asLink) {
    var inner = h("div", { class: "in" },
      h("span", { class: "tag" }, o.label),
      h("h3", null, o.title),
      h("p", null, o.summary),
      countdown(o),
      asLink ? h("span", { class: "btn btn-light btn-sm" }, "Vezi oferta →") : null);
    return asLink
      ? h("a", { class: "offer", href: "#offer/" + o.id }, img(o.image, "", "bg"), inner)
      : h("div", { class: "offer" }, img(o.image, "", "bg"), inner);
  }

  function notifyCard(extraCls) {
    return h("div", { class: "notify-card" + (notifyOn ? " on" : "") + (extraCls ? " " + extraCls : "") },
      h("div", { class: "ic" }, bellIcon(20)),
      h("div", { class: "grow" },
        h("b", null, notifyOn ? "Notifications are on" : "Never miss an offer"),
        h("small", null, notifyOn ? "You'll hear first about offers, events and free slots."
                                  : "Get offers, events and last-minute slots straight to your phone.")),
      h("button", { class: "btn btn-sm" + (notifyOn ? "" : " btn-dark"), type: "button", onclick: onNotify },
        notifyOn ? "Test" : "Turn on"));
  }

  function svcCard(s, wide) {
    return h("a", { class: "svc" + (wide ? " wide" : ""), href: "#svc/" + s.id },
      h("div", { class: "ph" }, img(s.image, s.alt)),
      h("div", { class: "t" }, h("h3", null, s.title), h("small", null, s.lead)));
  }

  function offerTile(o) {
    return h("a", { class: "svc wide dark", href: "#offer/" + o.id },
      h("div", { class: "ph" }, img(o.thumb, "")),
      h("div", { class: "t" }, h("h3", null, o.label + " offer"), h("small", null, o.short)));
  }

  function serviceGrid() {
    var s = D.services;
    return h("div", { class: "svc-grid" },
      svcCard(s[0]), svcCard(s[1]), svcCard(s[2], true), active(D.offers).map(offerTile));
  }

  function backBtn() { return h("button", { class: "back", type: "button", onclick: goBack }, "← Back"); }

  /* Banner de instalare: discret, doar în browser (nu în aplicația instalată), se poate închide. */
  var installEvt = null;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function installBanner() {
    if (isStandalone() || localStorage.getItem(LS_INSTALL) === "1") return null;
    if (!installEvt && !isIOS) return null;
    var close = h("button", { class: "x", type: "button", "aria-label": "Close", onclick: function () {
      localStorage.setItem(LS_INSTALL, "1"); banner.remove();
    } }, "×");
    var banner = h("div", { class: "install-banner" },
      h("img", { src: "icon-192.png", alt: "", width: "40", height: "40" }),
      h("div", { class: "grow" },
        h("b", null, "Add MOODS to your home screen"),
        installEvt ? h("small", null, "One tap, no app store.")
                   : h("small", null, "Tap Share, then “Add to Home Screen”.")),
      installEvt ? h("button", { class: "btn btn-sm btn-dark", type: "button", onclick: function () {
        installEvt.prompt();
        installEvt.userChoice.then(function () { installEvt = null; banner.remove(); });
      } }, "Install") : null,
      close);
    return banner;
  }

  /* ---------- Ecrane ---------- */
  function home() {
    var offers = active(D.offers);
    return [
      h("section", { class: "hero" },
        h("img", { src: D.home.heroImage, alt: D.home.heroAlt, fetchpriority: "high" }),
        h("div", { class: "txt" }, h("span", null, S.tagline), h("h1", null, D.home.heroTitle))),
      installBanner(),
      notifyCard("mx"),
      h("div", { class: "pad pt-0" },
        offers.length ? [sectionHead("This week", "#offers", "All offers"), offerCard(offers[0], true)] : null,
        sectionHead("Services", "#services", "See all"),
        serviceGrid(),
        sectionHead("Book in a minute"),
        ext(wa("Hello MOODS! I'd like to book an appointment."), "btn btn-dark btn-block", "Book on WhatsApp"))
    ];
  }

  function services() {
    return h("div", { class: "pad" },
      h("span", { class: "eyebrow" }, "MOODS · Services"),
      h("h1", { class: "page-title" }, "Our Service Menu"),
      h("p", { class: "muted mt-8" }, D.home.servicesLead),
      h("div", { class: "mt-16" }, serviceGrid()));
  }

  function serviceDetail(s) {
    return [
      backBtn(),
      h("div", { class: "detail-hero" }, h("img", { src: s.image, alt: s.alt })),
      h("div", { class: "detail-head" },
        h("span", { class: "eyebrow" }, "MOODS · Services"),
        h("h1", null, s.title),
        h("p", { class: "lead" }, s.lead),
        h("p", { class: "muted" }, s.text)),
      h("div", { class: "pad pb-0" },
        h("div", { class: "section-h mt-6" }, h("h2", null, "The Menu")),
        h("p", { class: "note" }, "Every service begins with a short consultation. Prices are confirmed in the salon.")),
      h("ul", { class: "menu-list" }, s.menu.map(function (m) {
        return h("li", null,
          h("b", null, m.name),
          h("span", { class: "price" }, "from ", m.price ? String(m.price) : tbd("—"), " RON"),
          h("p", null, m.text),
          ext(wa("Hello MOODS! I'd like to book: " + m.name + " (" + s.title + ")."), "btn btn-sm", "Book"));
      })),
      h("div", { class: "pad" }, ext(wa("Hello MOODS! I'd like to book " + s.title + "."), "btn btn-dark btn-block", "Book " + s.title))
    ];
  }

  function offerDetail(o) {
    if (!active([o]).length) return [backBtn(), h("div", { class: "pad" },
      h("h1", { class: "page-title" }, "This offer has ended"),
      h("p", { class: "muted mt-8" }, "Turn on notifications to hear about the next one first."),
      notifyCard("mt-16"))];
    return [
      backBtn(),
      h("div", { class: "pad pt-12" },
        offerCard(o, false),
        sectionHead("Cum decurge"),
        h("ol", { class: "steps" }, o.steps.map(function (st) {
          return h("li", null, h("b", null, st[0]), h("span", { class: "muted" }, st[1]));
        })),
        sectionHead(o.packagesTitle),
        o.packages.map(function (p) {
          return h("div", { class: "pkg" + (p.best ? " best" : "") },
            p.best ? h("span", { class: "badge" }, "Cel mai ales") : null,
            h("div", { class: "row" },
              h("h3", null, p.name),
              h("div", { class: "right" }, h("s", null, p.old + " RON"), h("div", { class: "now" }, p.now + " RON"))),
            p.sub ? h("small", { class: "block" }, p.sub) : null,
            h("small", { class: "block" }, "doar " + p.per + " RON / ședință · economisești " + p.save + " RON"),
            ext(wa(o.packageText.replace("{name}", p.name)), "btn btn-sm btn-dark mt-12", "Vreau acest pachet"));
        }),
        o.notes.map(function (n) { return h("p", { class: "note" }, n); }),
        h("p", { class: "note" }, o.validity[0], o.untilConfirmed ? o.validity[1] : tbd(o.validity[1]), o.validity[2]),
        ext(wa(o.bookText), "btn btn-clay btn-block mt-8", "Rezervă pe WhatsApp"))
    ];
  }

  function offers() {
    var list = active(D.offers), ev = active(D.events);
    var items = list.map(function (o) {
      return h("a", { class: "feed-item", href: "#offer/" + o.id },
        h("div", { class: "ph" }, img(o.image, "")),
        h("div", null, h("span", { class: "when" }, "Offer · " + o.untilLabel), h("b", null, o.label + ": " + o.title.split(".")[0]), h("small", null, o.short)));
    }).concat(ev.map(function (e) {
      return h("div", { class: "feed-item" + (e.example ? " soon" : "") },
        h("div", { class: "ph" }, "ev"),
        h("div", null, h("span", { class: "when" }, e.when), h("b", null, e.title), h("small", null, e.text)));
    }));
    return h("div", { class: "pad" },
      h("span", { class: "eyebrow" }, "Offers & Events"),
      h("h1", { class: "page-title" }, "What's on at MOODS"),
      h("p", { class: "muted mt-8" }, "Everything new lands here first, and on your phone if notifications are on."),
      items.length ? h("div", { class: "feed mt-16" }, items)
                   : h("p", { class: "empty mt-16" }, "No offers right now. New ones are on the way."),
      notifyCard("mt-18"));
  }

  function contact() {
    var addr = [S.street + ", ", S.city ? S.city : tbd("[city]")];
    return h("div", { class: "pad" },
      h("span", { class: "eyebrow" }, "Visit"),
      h("h1", { class: "page-title" }, "Come say hello"),
      h("ul", { class: "contact-list mt-16" },
        h("li", null, h("a", { href: "tel:" + S.phoneIntl }, "Call", h("span", null, S.phone))),
        h("li", null, h("a", { href: wa("Hello MOODS!"), target: "_blank", rel: "noopener" }, "WhatsApp", h("span", null, "Message us"))),
        h("li", null, h("div", null, "Address", h("span", null, addr))),
        h("li", null, S.instagram
          ? h("a", { href: S.instagram, target: "_blank", rel: "noopener" }, "Instagram", h("span", null, "Follow us"))
          : h("div", null, "Instagram", h("span", null, tbd("[Instagram]"))))),
      sectionHead("Opening hours"),
      h("div", { class: "hours" }, S.hours.map(function (r) {
        return [h("span", null, r[0]), h("span", { class: r[1] === "Closed" ? "muted" : null }, r[1])];
      })),
      h("div", { class: "install" },
        h("b", null, "Add MOODS to your home screen"),
        "Android: tap “Install app” in the browser menu. iPhone: tap Share → “Add to Home Screen”, then open MOODS from the icon to turn on notifications."));
  }

  /* ---------- Navigare ---------- */
  // Fiecare intrare din istoric primește o „adâncime”. Back revine în aplicație doar dacă
  // există o intrare anterioară a aplicației; altfel merge la ecranul-părinte.
  var depth = 0, replacing = false;
  function parentOf(hash) {
    if (hash.indexOf("svc/") === 0) return "#services";
    if (hash.indexOf("offer/") === 0) return "#offers";
    return "#home";
  }
  function goBack() {
    if (history.state && history.state.depth > 0) history.back();
    else { replacing = true; location.replace(parentOf(location.hash.slice(1))); }
  }

  function render() {
    var hash = (location.hash || "#home").slice(1), tab = "home", content, s, o;
    if (hash.indexOf("svc/") === 0 && (s = service(hash.slice(4)))) { content = serviceDetail(s); tab = "services"; }
    else if (hash.indexOf("offer/") === 0 && (o = offer(hash.slice(6)))) { content = offerDetail(o); tab = "offers"; }
    else if (hash === "bf") { replacing = true; location.replace("#offer/black-friday"); return; }
    else if (hash === "services") { content = services(); tab = "services"; }
    else if (hash === "offers") { content = offers(); tab = "offers"; }
    else if (hash === "contact") { content = contact(); tab = "contact"; }
    else content = home();
    view.replaceChildren();
    add(view, content);
    document.querySelectorAll(".tabbar a").forEach(function (a) {
      var on = a.getAttribute("data-tab") === tab;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    tick();
  }

  window.addEventListener("hashchange", function () {
    if (replacing) { replacing = false; history.replaceState({ depth: depth }, ""); }
    else if (!history.state || typeof history.state.depth !== "number") history.replaceState({ depth: ++depth }, "");
    else depth = history.state.depth;
    render();
  });

  /* ---------- Numărătoare inversă + expirare oferte ---------- */
  var activeKey = active(D.offers).map(function (o) { return o.id; }).join();
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var key = active(D.offers).map(function (o) { return o.id; }).join();
    if (key !== activeKey) { activeKey = key; render(); return; }  // o ofertă tocmai a expirat
    document.querySelectorAll("[data-until]").forEach(function (c) {
      var t = Math.max(0, new Date(c.getAttribute("data-until")).getTime() - now());
      c.querySelector("[data-d]").textContent = pad2(Math.floor(t / 864e5));
      c.querySelector("[data-h]").textContent = pad2(Math.floor(t / 36e5) % 24);
      c.querySelector("[data-m]").textContent = pad2(Math.floor(t / 6e4) % 60);
    });
  }
  setInterval(tick, 30000);

  /* ---------- Notificare simulată (până la OneSignal) ---------- */
  var pushEl = document.getElementById("push"), pushText = document.getElementById("push-text");
  var demoIdx = 0, pushTimer = null;
  function showPush() {
    pushText.textContent = D.demoPushes[demoIdx++ % D.demoPushes.length];
    pushEl.hidden = false;
    requestAnimationFrame(function () { pushEl.classList.add("show"); });
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushEl.classList.remove("show"); }, 4200);
  }
  function onNotify() {
    if (!notifyOn) { notifyOn = true; localStorage.setItem(LS_NOTIFY, "1"); render(); }
    setTimeout(showPush, 500);
  }
  pushEl.addEventListener("click", function () {
    pushEl.classList.remove("show");
    var o = active(D.offers)[0];
    location.hash = o ? "#offer/" + o.id : "#offers";
  });

  document.getElementById("bell").addEventListener("click", function () {
    document.getElementById("bell-dot").hidden = true;
    location.hash = "#offers";
  });

  /* ---------- Instalare ---------- */
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvt = e;
    if ((location.hash || "#home") === "#home") render();
  });
  window.addEventListener("appinstalled", function () { installEvt = null; localStorage.setItem(LS_INSTALL, "1"); });

  /* ---------- Pornire ---------- */
  history.replaceState({ depth: 0 }, "");
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
