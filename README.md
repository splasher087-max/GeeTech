# GeeTech

Responsive Webprojekt mit zwei eigenständigen Designwelten:

- **GeeTech Service** (`service.html`): Blau, Violett, Hellblau; moderne Hero-Animation, Serviceangebote, Ablauf, FAQ.
- **GeeTech Shop** (`shop.html`): Schwarz und Neongrün; Produktfilter, Warenkorb und Checkout als Demo.
- **GeeTech Start** (`index.html`): zentraler Einstieg zu Service und Shop.

## Lokal starten

1. GitHub → Code → Download ZIP.
2. ZIP entpacken.
3. `start-local.bat` doppelklicken (Python 3 erforderlich).
4. **http://localhost:8000/** öffnen.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

Voraussichtliche URL: https://splasher087-max.github.io/GeeTech/

## Dateistruktur

- `index.html`, `service.html`, `shop.html` und weitere Seiten im Stammverzeichnis.
- `css/landing.css` für den Einstieg.
- `css/service.css` für Service (Blau/Violett/Hellblau).
- `css/site.css` für Shop und Hilfsseiten (Schwarz/Grün).
- `js/service.js` für Scroll-Animationen.
- `js/site.js` für Frontend-Shop-Demofunktionen.
- `docs/` für Notizen und Entwicklungsplanung.

## Wichtiger Betriebsstatus

**Nicht als fertigen E-Commerce-Shop veröffentlichen.** Das Repository enthält statische Seiten und clientseitige Demo-Funktionen. Eine echte Bestellabwicklung, sichere Nutzerkonten, Datenbank/Lagerverwaltung, Zahlungssystem und verbindliche Kontaktnachrichten erfordern passende Backend- und Dienstanbindungen sowie Sicherheitstests. Kontaktdaten und rechtliche Seiten enthalten teils Platzhalter. Keine echten Kundendaten in Demo-Formulare eintragen.

Die Optik und Pfadstruktur wurden überarbeitet. Ein vollständiger End-to-End-Browsertest und Produktionsfreigabe wurden nicht durchgeführt.
