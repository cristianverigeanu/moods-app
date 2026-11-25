# MOODS by Roxy Salon — aplicația

Aplicație web instalabilă pe telefon (PWA) pentru salonul MOODS by Roxy: servicii (Hair Care & Styling, Nail Art, Skin Longevity), oferte, evenimente, contact și rezervare pe WhatsApp. Fără backend și fără bază de date. Notificările sunt deocamdată simulate.

Live: https://cristianverigeanu.github.io/moods-app/

## Structură
```
index.html            pagina aplicației (bara de sus, ecranul, bara de jos)
offline.html          pagina afișată fără internet, dacă aplicația nu e încă în cache
app.js                logica + ecranele (Home, Services, serviciu, ofertă, Offers, Contact)
data.js               toate textele și datele (doar text)
app.css, fonts.css    stiluri, fonturi locale (Cormorant Garamond, Jost)
sw.js                 service worker: cache offline, versiune CACHE_VERSION
manifest.webmanifest  nume, culori, iconițe pentru instalare
img/ fonts/ logo/     resurse
tools/check.py        verificare automată + lista fișierelor publice
.github/workflows/    verificare la fiecare push, publicare pe GitHub Pages din main
```

## Rulare locală
```
python -m http.server 8092
```
Apoi http://localhost:8092 (în Claude Code: configurația „moods-app”). Verificare: `python tools/check.py`.

## Actualizare conținut
Ofertă/eveniment nou → `data.js` (`offers` / `events`, cu data `until`). Apoi crește `CACHE_VERSION` în `sw.js`, rulează `python tools/check.py`, commit și push.

## Publicare
Push pe `main` → GitHub Actions rulează verificarea și publică DOAR fișierele publice pe GitHub Pages (sursa Pages: „GitHub Actions”).

## Test PWA
- Android (Chrome): „Install app” din meniu sau bannerul din aplicație; deschis din iconiță → fără bara browserului.
- iPhone (Safari): Share → „Add to Home Screen”.
- Offline: deschide aplicația o dată, apoi mod avion → trebuie să se deschidă și să arate tot.
- După un deploy: un refresh aduce versiunea nouă.

## Riscuri și limitări
- Notificările sunt simulate; cele reale cer OneSignal (cont + SDK extern, de trecut în CSP).
- Pe iPhone, notificările reale merg doar cu aplicația adăugată pe ecran și iOS 16.4+.
- Data de final Black Friday (30 nov) nu e confirmată; prețurile, orașul și Instagramul lipsesc.
- `frame-ancestors` nu se poate seta din `<meta>` și GitHub Pages nu permite headere proprii.
- Repo public: conține doar ce e deja pe site.
