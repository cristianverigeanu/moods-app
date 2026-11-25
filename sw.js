/* Service worker minim: face aplicația instalabilă. Nu salvează nimic în cache
   (preview), deci orice modificare se vede imediat. Aici se va lega mai târziu OneSignal. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function () {});
