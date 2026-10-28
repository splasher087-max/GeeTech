# GeeTech

GeeTech ist eine responsive Website für PC-Service und eine geplante Gaming-Hardware-Webshop-Demo.

## Lokale Vorschau unter Windows
1. Repository über **Code → Download ZIP** herunterladen und entpacken.
2. `start-local.bat` im Hauptordner starten (Python 3 erforderlich).
3. Im Browser **http://localhost:8000/** öffnen.
4. Server mit Strg+C stoppen.

Alternativ: `python -m http.server 8000 --bind 127.0.0.1` im Projektordner ausführen.

## Online-Vorschau
In den GitHub-Einstellungen **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)** wählen. Nach der Veröffentlichung ist die Vorschau voraussichtlich unter **https://splasher087-max.github.io/GeeTech/** verfügbar. Die Veröffentlichung wurde noch nicht live bestätigt.

## Struktur
- `index.html`: Neue GeeTech-Startseite
- `service.html`: PC-Service
- `shop.html`, `sell.html`, `cart.html`, `checkout.html`, `account.html`: Shop-Prototyp (mit bestehendem NEXORA-Branding)
- `kontakt.html` und juristische Informationsseiten
- `css/landing.css`: Startseite und Service
- `css/site.css`: Shop-Seiten
- `js/site.js`: Interaktionen der Shop-Demo
- `docs/STRUKTUR.md`: Technische Übersicht

## Status und Sicherheit
Die Website ist eine **Demo, keine betriebsfertige Webshop-Plattform**. Es werden keine echten Zahlungen oder Bestellungen abgewickelt. Für einen produktiven Start fehlen insbesondere sicheres Backend, Zahlungsanbieter, rechtliche Angaben und vollständige Browser-/Funktionstests.

Keine Zugangsschlüssel, privaten Daten oder `.env`-Dateien ins öffentliche Repository hochladen.
