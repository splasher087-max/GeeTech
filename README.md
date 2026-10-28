# GeeTech

GeeTech ist eine Website für PC-Service und einen geplanten Hardware-/Gaming-PC-Shop.

> **Entwicklungsstand:** Demo / in Entwicklung. Keine echten Bestellungen oder Zahlungen anbieten, bevor Backend, Sicherheit und rechtliche Angaben geprüft sind.

## Lokal ansehen (Windows)

1. Repository als ZIP herunterladen und entpacken (GitHub → Code → Download ZIP).
2. Im Projektordner auf `start-local.bat` doppelklicken.
3. Browser öffnen: **http://localhost:8000/**.
4. Zum Beenden das Konsolenfenster schließen oder `Strg+C` drücken.

Voraussetzung: Python 3 ist installiert und über `py` oder `python` erreichbar. Alternativ im Projektordner:

```powershell
python -m http.server 8000
```

**Achtung:** Die Website wird nur lokal bereitgestellt. Andere Geräte können sie damit nicht automatisch erreichen.

## Online-Vorschau mit GitHub Pages

Unter **Settings → Pages** bei **Build and deployment** `Deploy from a branch` wählen, anschließend `main` und `/(root)` auswählen und speichern. Sobald GitHub die Veröffentlichung abgeschlossen hat, ist die Demo normalerweise unter:

**https://splasher087-max.github.io/GeeTech/**

Die Online-Vorschau ist öffentlich. Statische HTML/CSS/JS-Seiten funktionieren; echte Shop-Funktionen wie Zahlungen, Server-Login oder Datenbank-Speicherung erfordern eine separate sichere Backend-Lösung.

## Projektdateien

- `index.html`: Landingpage mit Auswahl zwischen Service und Shop
- `service.html`: PC-Service
- `shop.html`: Shop-Ansicht
- `sell.html`: Verkaufen
- `account.html`: Account-Ansicht
- `cart.html`, `checkout.html`: Warenkorb und Checkout-Ansicht
- `kontakt.html`: Kontaktseite
- `retur.html`, `handelsbetingelser.html`, `privatliv.html`: Informations-/Rechtstexte
- `landing.css`: Landing- und Service-Styles
- `style.css`: Styles der übrigen Seiten
- `script.js`: Frontend-Interaktionen
- `assets/`: Bild- und Medien-Dateien
- `docs/`: Entwicklungsnotizen

Die Seiten liegen absichtlich noch im Projektstamm, damit ihre bisherigen relativen Verweise erhalten bleiben. Eine spätere Neuordnung erfordert abgestimmte Anpassungen aller Links und Asset-Pfade.

## Sicherheit

Niemals Passwörter, API-Keys, Tokens, echte Kundendaten oder `.env`-Dateien in das öffentliche Repository hochladen.
