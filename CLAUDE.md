# MOODS by Roxy — aplicația (PWA): reguli de proiect

Procedura care se aplică: `claude_code/Procedura-standard-lansare-app.docx` (5 etape). Planul se aprobă înainte de cod.

## Unde stă codul
- `data.js` — TOATE textele, serviciile, ofertele, evenimentele. Doar text: fără HTML, fără cod. `null` = dată lipsă (apare cu galben).
- `app.js` — logica și ecranele. Textul se pune în pagină doar ca text (`textContent` prin helperul `h()`), niciodată `innerHTML`.
- `app.css` — stilurile. Fără `style=` în HTML sau JS (le blochează CSP-ul).
- `sw.js` — service worker (offline). `FILES` = tot ce trebuie offline.
- `index.html`, `offline.html`, `manifest.webmanifest`, `icon-*.png`, `img/`, `fonts/`, `logo/` — publice.
- `tools/check.py` — verificarea automată; tot el decide ce fișiere ajung pe site (`PUBLIC`).
- `README.md`, `JURNAL.md`, `CLAUDE.md`, `tools/`, `.github/` — interne, NU se publică.

## Interzis
- Chei API, secrete, date personale în cod sau în localStorage.
- Script sau stil inline, `onclick=`, `innerHTML`.
- Framework-uri / librării externe fără nevoie reală (excepție planificată: SDK-ul OneSignal, cu acord).
- Documente sursă (.docx, .pdf) în repo — sunt în `.gitignore`.
- Adăugat/șters funcționalități, refactor mare sau redesign fără acordul utilizatorului.
- Commit / push fără acordul utilizatorului.

## Domeniu comun
- Aplicația stă pe `cristianverigeanu.github.io`, împărțit cu alte aplicații (ex. Osmo): cache-urile și cheile din localStorage încep mereu cu `moods-`, iar service worker-ul șterge doar cache-uri `moods-`.

## Când crește versiunea
- `CACHE_VERSION` din `sw.js` crește (moods-v2 → moods-v3 …) la FIECARE commit care schimbă un fișier public. `tools/check.py` pică dacă uiți.
- Fișier public nou → adăugat în `FILES` (sw.js) și, dacă e în rădăcină, în `PUBLIC` (tools/check.py).

## Decizii ale utilizatorului (2026-11-25)
- Limba rămâne engleză, ca site-ul; oferta Black Friday în română, ca pagina ei.
- După ce expiră o ofertă nu apare nimic în loc, până se adaugă alta în `data.js`.
- Datele lipsă (prețuri, oraș, Instagram) rămân marcate cu galben.
- Cam un eveniment pe lună → se adaugă în `data.js` → `events`.
- Butonul de notificări rămâne demonstrativ până la conectarea OneSignal.
