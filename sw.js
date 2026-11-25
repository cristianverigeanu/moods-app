/* MOODS — service worker.
   REGULĂ: crește CACHE_VERSION la fiecare commit care schimbă fișiere ale aplicației
   (altfel telefoanele pot rămâne cu versiunea veche). Lista FILES = tot ce trebuie offline. */
var CACHE_VERSION = "moods-v3";
var FILES = [
  "./", "index.html", "offline.html", "app.css", "app.js", "data.js", "fonts.css", "manifest.webmanifest",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png",
  "logo/moods-logo-brown-transparent.svg", "logo/moods-icon.svg",
  "img/hero-home.webp", "img/hair-1.webp", "img/nails-1.webp", "img/skin-1.webp", "img/skin-2.webp",
  "fonts/jost-normal-latin.woff2", "fonts/jost-normal-latin-ext.woff2",
  "fonts/cormorant-garamond-normal-latin.woff2", "fonts/cormorant-garamond-normal-latin-ext.woff2",
  "fonts/cormorant-garamond-italic-latin.woff2", "fonts/cormorant-garamond-italic-latin-ext.woff2"
];

// cache: "reload" = ia fișierele direct de pe server, nu din cache-ul browserului (GitHub Pages ține 10 min).
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE_VERSION).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: "reload" }); })); }).then(function () { return self.skipWaiting(); }));
});

// Șterge DOAR cache-urile MOODS vechi: pe cristianverigeanu.github.io stau și alte aplicații (ex. Osmo).
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("moods-") === 0 && k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;  // WhatsApp, tel: etc. nu trec pe aici

  if (req.mode === "navigate") {
    // Pagina: întâi rețeaua (ca să vină versiunea nouă), apoi cache-ul, apoi pagina offline.
    e.respondWith(fetch(req).catch(function () {
      return caches.match("index.html").then(function (r) { return r || caches.match("offline.html"); });
    }));
    return;
  }
  // Fișierele: din cache (versiunea curentă), altfel din rețea.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (r) { return r || fetch(req); }));
});
