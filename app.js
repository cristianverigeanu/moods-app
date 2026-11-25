/* MOODS by Roxy — app preview.
   Conținutul e luat din paginile site-ului (site/*.html). Nu există bază de date:
   totul stă în obiectele de mai jos, iar notificările sunt doar simulate. */
(function () {
  "use strict";

  var WA = "40721781200";
  var PHONE = "0721 781 200";
  var BF_DEADLINE = "2026-11-30T23:59:00"; // ca în black-friday.html (încă de confirmat)

  function wa(text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }

  var SERVICES = {
    hair: {
      title: "Hair Care & Styling", lead: "Healthy hair, styled to feel like you.",
      img: "img/hair-1.webp", alt: "Woman with long, glossy dark curls",
      text: "From a precise cut to a deep-repair ritual, every appointment starts with a conversation about your hair, your routine and the way you want to feel when you walk out.",
      menu: [
        ["Cut & Blow-dry", "Consultation, wash, precision cut and a finish styled to your face and lifestyle."],
        ["Colour & Balayage", "Single-process colour, soft balayage or highlights, planned around your natural tone."],
        ["Repair Treatment", "A restorative ritual for dry, coloured or heat-stressed hair, with scalp massage."],
        ["Event Styling", "Waves, sleek looks or updos for weddings, evenings and photo shoots."]
      ]
    },
    nails: {
      title: "Nail Art", lead: "Small details, done beautifully.",
      img: "img/nails-1.webp", alt: "Hand with long almond nails in a soft pink ombré",
      text: "Clean, long-lasting manicures and pedicures, from barely-there nudes to hand-painted designs. We take our time with cuticle care and shaping, so the result looks good for weeks.",
      menu: [
        ["Classic Manicure", "Shaping, cuticle care, hand massage and classic polish."],
        ["Gel Manicure", "Long-wear gel colour with a glossy, chip-resistant finish."],
        ["Extensions & Baby Boomer", "Gel extensions or soft ombré, shaped to your preferred length."],
        ["Nail Art Design", "Hand-painted details, chrome, French twists or a custom idea you bring in."],
        ["Pedicure", "Foot soak, care and polish or gel, in a relaxed, unhurried setting."]
      ]
    },
    skin: {
      title: "Skin Longevity", lead: "Good skin is a long game.",
      img: "img/skin-1.webp", alt: "Portrait of a woman with radiant, glowing skin",
      text: "Facial treatments designed for the long term: a skin analysis first, then a plan that supports hydration, firmness and glow, at your own pace.",
      menu: [
        ["Skin Consultation", "An in-depth look at your skin and routine, with a personalised treatment plan."],
        ["Signature Facial", "Deep cleanse, exfoliation, mask and massage, adapted to what your skin needs that day."],
        ["Lifting & Firming", "A treatment focused on tone, contour and elasticity."],
        ["Hydration Ritual", "Intensive moisture for dull, tired or dehydrated skin."]
      ]
    }
  };

  var BF_PACKAGES = [
    { name: "Față", old: 2800, now: 2380, per: 298, save: 420 },
    { name: "Față + Gât", old: 3600, now: 3060, per: 383, save: 540, best: true },
    { name: "Signature", sub: "Față + Gât + Decolteu", old: 4720, now: 4012, per: 502, save: 708 }
  ];

  /* Ce ar primi clientele ca notificări — exemple pentru preview */
  var DEMO_PUSHES = [
    "Black Friday: Ritualul complet, 8 ședințe cu 15% mai puțin. Ultimele locuri!",
    "New this week: chrome & French twist nail designs. Book your slot.",
    "MOODS Evening: skin talk & prosecco, Thursday at 19:00. Save your seat."
  ];

  var view = document.getElementById("view");
  var notifyOn = localStorage.getItem("moods-notify") === "1";
  var timer = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Ecrane ---------- */
  function offerCard() {
    return '<a class="offer" href="#bf">' +
      '<img src="img/skin-1.webp" alt="">' +
      '<div class="in"><span class="tag">Black Friday</span>' +
      '<h3>Black Friday. Dar pentru pielea ta.</h3>' +
      '<p>The Refining Ritual: 8 ședințe de radiofrecvență și ultrasunete, cu 15% mai puțin.</p>' +
      '<div class="countdown" data-countdown>' +
      '<div><b data-d>--</b><small>zile</small></div><div><b data-h>--</b><small>ore</small></div>' +
      '<div><b data-m>--</b><small>min</small></div></div>' +
      '<span class="btn btn-light btn-sm">Vezi oferta →</span></div></a>';
  }

  function notifyCard() {
    return '<div class="notify-card' + (notifyOn ? " on" : "") + '">' +
      '<div class="ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg></div>' +
      '<div style="flex:1"><b>' + (notifyOn ? "Notifications are on" : "Never miss an offer") + '</b>' +
      '<small>' + (notifyOn ? "You'll hear first about offers, events and free slots." : "Get offers, events and last-minute slots straight to your phone.") + '</small></div>' +
      '<button class="btn btn-sm ' + (notifyOn ? "" : "btn-dark") + '" data-notify>' + (notifyOn ? "Test" : "Turn on") + '</button></div>';
  }

  function svcCard(key, extraCls) {
    var s = SERVICES[key];
    return '<a class="svc ' + (extraCls || "") + '" href="#svc/' + key + '">' +
      '<div class="ph"><img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="lazy"></div>' +
      '<div class="t"><h3>' + esc(s.title) + '</h3><small>' + esc(s.lead) + '</small></div></a>';
  }

  function bfWide() {
    return '<a class="svc wide dark" href="#bf"><div class="ph"><img src="img/skin-2.webp" alt="" loading="lazy"></div>' +
      '<div class="t"><h3>Black Friday offer</h3><small>The Refining Ritual · −15% la pachetul de 8 ședințe</small></div></a>';
  }

  function home() {
    return '<section class="hero"><img src="img/hero-home.webp" alt="Woman in a black blazer and pearl necklace, posing against a warm beige wall">' +
      '<div class="txt"><span>Be all of her.</span><h1>A place to feel good, connect and simply be.</h1></div></section>' +
      notifyCard() +
      '<div class="pad" style="padding-top:6px">' +
      '<div class="section-h"><h2>This week</h2><a href="#offers">All offers</a></div>' +
      offerCard() +
      '<div class="section-h"><h2>Services</h2><a href="#services">See all</a></div>' +
      '<div class="svc-grid">' + svcCard("hair") + svcCard("nails") + svcCard("skin", "wide") + bfWide() + '</div>' +
      '<div class="section-h"><h2>Book in a minute</h2></div>' +
      '<a class="btn btn-dark btn-block" href="' + wa("Hello MOODS! I'd like to book an appointment.") + '" target="_blank" rel="noopener">Book on WhatsApp</a>' +
      '</div>';
  }

  function services() {
    return '<div class="pad"><span class="eyebrow">MOODS · Services</span><h1 style="font-size:34px">Our Service Menu</h1>' +
      '<p class="muted" style="margin-top:8px">Three rituals, one philosophy: take your time, feel looked after, leave a little more yourself.</p>' +
      '<div class="svc-grid" style="margin-top:16px">' + svcCard("hair") + svcCard("nails") + svcCard("skin", "wide") + bfWide() + '</div></div>';
  }

  function serviceDetail(key) {
    var s = SERVICES[key];
    if (!s) return home();
    var items = s.menu.map(function (m) {
      return '<li><b>' + esc(m[0]) + '</b><span class="price">from <span class="tbd">—</span> RON</span>' +
        '<p>' + esc(m[1]) + '</p>' +
        '<a class="btn btn-sm" href="' + wa("Hello MOODS! I'd like to book: " + m[0] + " (" + s.title + ").") + '" target="_blank" rel="noopener">Book</a></li>';
    }).join("");
    return '<button class="back" data-back>← Back</button>' +
      '<div class="detail-hero"><img src="' + s.img + '" alt="' + esc(s.alt) + '"></div>' +
      '<div class="detail-head"><span class="eyebrow">MOODS · Services</span><h1>' + esc(s.title) + '</h1>' +
      '<p class="lead">' + esc(s.lead) + '</p><p class="muted">' + esc(s.text) + '</p></div>' +
      '<div class="pad" style="padding-bottom:0"><div class="section-h" style="margin-top:6px"><h2>The Menu</h2></div>' +
      '<p class="note">Every service begins with a short consultation. Prices are confirmed in the salon.</p></div>' +
      '<ul class="menu-list">' + items + '</ul>' +
      '<div class="pad"><a class="btn btn-dark btn-block" href="' + wa("Hello MOODS! I'd like to book " + s.title + ".") + '" target="_blank" rel="noopener">Book ' + esc(s.title) + '</a></div>';
  }

  function bf() {
    var pk = BF_PACKAGES.map(function (p) {
      return '<div class="pkg' + (p.best ? " best" : "") + '">' +
        (p.best ? '<span class="badge">Cel mai ales</span>' : "") +
        '<div class="row"><h3>' + p.name + '</h3><div style="text-align:right"><s>' + p.old + ' RON</s><div class="now">' + p.now + ' RON</div></div></div>' +
        (p.sub ? '<small>' + p.sub + '</small><br>' : "") +
        '<small>doar ' + p.per + ' RON / ședință · economisești ' + p.save + ' RON</small>' +
        '<a class="btn btn-sm btn-dark" style="margin-top:12px" href="' + wa("Bună! Vreau pachetul Black Friday: " + p.name + " (8 ședințe).") + '" target="_blank" rel="noopener">Vreau acest pachet</a></div>';
    }).join("");
    return '<button class="back" data-back>← Back</button>' +
      '<div class="pad" style="padding-top:12px">' + offerCard().replace('href="#bf"', 'href="#bf" aria-disabled="true"').replace('<span class="btn btn-light btn-sm">Vezi oferta →</span>', "") +
      '<div class="section-h"><h2>Cum decurge</h2></div>' +
      '<ol class="steps"><li><b>Pregătire</b><span class="muted">Curățare și aplicarea cremei speciale.</span></li>' +
      '<li><b>Sculptare</b><span class="muted">Ultrasunete și radiofrecvență, personalizate pentru pielea ta.</span></li>' +
      '<li><b>Finisare</b><span class="muted">Masaj facial relaxant, cu produse profesionale Mary Cohr Paris.</span></li></ol>' +
      '<div class="section-h"><h2>Pachete · 8 ședințe</h2></div>' + pk +
      '<p class="note">Nu ești sigură? Începe cu o ședință: Față 350 RON · Față + Gât 450 RON · Signature 590 RON.</p>' +
      '<p class="note">Ofertă valabilă până la <span class="tbd">[data final]</span> sau până la epuizarea locurilor.</p>' +
      '<a class="btn btn-clay btn-block" style="margin-top:8px" href="' + wa("Bună! Vreau să rezerv oferta de Black Friday.") + '" target="_blank" rel="noopener">Rezervă pe WhatsApp</a></div>';
  }

  function offers() {
    return '<div class="pad"><span class="eyebrow">Offers & Events</span><h1 style="font-size:34px">What\'s on at MOODS</h1>' +
      '<p class="muted" style="margin-top:8px">Everything new lands here first, and on your phone if notifications are on.</p>' +
      '<div class="feed" style="margin-top:16px">' +
      '<a class="feed-item" href="#bf"><div class="ph"><img src="img/skin-1.webp" alt=""></div><div><span class="when">Offer · until 30 Nov</span><b>Black Friday: The Refining Ritual</b><small>8 ședințe cu 15% mai puțin</small></div></a>' +
      '<div class="feed-item soon"><div class="ph">ev</div><div><span class="when">Event · example</span><b>MOODS Evening</b><small>Workshops, launches and evenings together</small></div></div>' +
      '<div class="feed-item soon"><div class="ph">%</div><div><span class="when">Offer · example</span><b>Offer of the month</b><small>Replaces Black Friday once it ends</small></div></div>' +
      '</div>' + notifyCard().replace('class="notify-card', 'style="margin:18px 0 0" class="notify-card') + '</div>';
  }

  function contact() {
    return '<div class="pad"><span class="eyebrow">Visit</span><h1 style="font-size:34px">Come say hello</h1>' +
      '<ul class="contact-list" style="margin-top:16px">' +
      '<li><a href="tel:+40721781200">Call<span>' + PHONE + '</span></a></li>' +
      '<li><a href="' + wa("Hello MOODS!") + '" target="_blank" rel="noopener">WhatsApp<span>Message us</span></a></li>' +
      '<li><div>Address<span>Str. Regina Maria, nr. 16, <span class="tbd">[city]</span></span></div></li>' +
      '<li><div>Instagram<span class="tbd">[Instagram]</span></div></li></ul>' +
      '<div class="section-h"><h2>Opening hours</h2></div>' +
      '<div class="hours"><span>Monday – Friday</span><span>10:00 – 20:00</span><span>Saturday</span><span>10:00 – 16:00</span><span>Sunday</span><span class="muted">Closed</span></div>' +
      '<div class="install"><b>Add MOODS to your home screen</b>' +
      'Android: tap “Install app” in the browser menu. iPhone: tap Share → “Add to Home Screen”, then open MOODS from the icon to turn on notifications.</div>' +
      '</div>';
  }

  /* ---------- Router ---------- */
  function render() {
    var h = (location.hash || "#home").slice(1);
    var tab = "home", html;
    if (h.indexOf("svc/") === 0) { html = serviceDetail(h.slice(4)); tab = "services"; }
    else if (h === "bf") { html = bf(); tab = "offers"; }
    else if (h === "services") { html = services(); tab = "services"; }
    else if (h === "offers") { html = offers(); tab = "offers"; }
    else if (h === "contact") { html = contact(); tab = "contact"; }
    else html = home();
    view.innerHTML = html;
    document.querySelectorAll(".tabbar a").forEach(function (a) { a.classList.toggle("on", a.dataset.tab === tab); });
    window.scrollTo(0, 0);
    tick();
  }

  /* ---------- Countdown ---------- */
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var t = Math.max(0, new Date(BF_DEADLINE).getTime() - Date.now());
    var d = Math.floor(t / 864e5), hr = Math.floor(t / 36e5) % 24, mi = Math.floor(t / 6e4) % 60;
    document.querySelectorAll("[data-countdown]").forEach(function (c) {
      c.querySelector("[data-d]").textContent = pad2(d);
      c.querySelector("[data-h]").textContent = pad2(hr);
      c.querySelector("[data-m]").textContent = pad2(mi);
    });
  }
  setInterval(tick, 30000);

  /* ---------- Notificare simulată ---------- */
  var pushEl = document.getElementById("push"), pushText = document.getElementById("push-text"), demoIdx = 0;
  function showPush() {
    pushText.textContent = DEMO_PUSHES[demoIdx++ % DEMO_PUSHES.length];
    pushEl.hidden = false;
    requestAnimationFrame(function () { pushEl.classList.add("show"); });
    clearTimeout(timer);
    timer = setTimeout(function () { pushEl.classList.remove("show"); }, 4200);
  }
  pushEl.addEventListener("click", function () { pushEl.classList.remove("show"); location.hash = "#bf"; });

  document.addEventListener("click", function (e) {
    var n = e.target.closest("[data-notify]");
    if (n) {
      e.preventDefault();
      if (!notifyOn) { notifyOn = true; localStorage.setItem("moods-notify", "1"); render(); }
      setTimeout(showPush, 500);
      return;
    }
    if (e.target.closest("[data-back]")) { history.length > 1 ? history.back() : (location.hash = "#home"); }
  });
  document.getElementById("bell").addEventListener("click", function () {
    document.getElementById("bell-dot").hidden = true;
    location.hash = "#offers";
  });

  window.addEventListener("hashchange", render);
  render();

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
