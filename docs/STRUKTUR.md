# GeeTech – aktuelle Projektstruktur (29.10.2026)

## Aktuelle Website
- `index.html`: Startseite mit Service-/Shop-Auswahl und den beiden Vorschaubildern
- `service.html`: PC-Service in Blau/Violett
- `shop.html`, `product.html`, `cart.html`, `checkout.html`: Shop-Demo
- `sell.html`: Demo des Warenankaufs
- `account.html`: lokale Demo des Kundenkontos
- `kontakt.html`: Kontaktformular-Demo (sendet **keine** Nachrichten)
- `retur.html`, `handelsbetingelser.html`, `privatliv.html`: rechtliche Entwürfe
- `inventory.html`: lokale Lager-Demo mit Export/Import (nicht zugangsgeschützt)

## Styles und Skripte
- `css/landing.css`: Startseite
- `css/service.css`: Service
- `css/site.css`: Shop, Hilfsseiten und Lager
- `js/service.js`: Animationen auf der Serviceseite
- `js/site.js`: Demo-Shop, Warenkorb, Formulare und Inventar
- `assets/service-preview.webp` und `assets/shop-preview.webp`: Startseitenbilder
- `landing-concept.png`: aufbewahrte Designreferenz, nicht zwingend auf der Startseite verwendet

## Entwicklung und Betrieb
- `start-local.bat`: lokaler Server für Windows
- `.github/workflows/verify-static.yml`: Prüfungen der lokalen HTML-/CSS-Dateiverweise
- `docs/LAUNCH_PLAN.md`: Umstellung von Demo auf späteren Echtbetrieb
- `README.md`: Einstieg und Betriebsstatus

## Bereinigung
Am 29.10.2026 wurden ausschließlich lokale IDE-/Indexartefakte (`.wsuo`, `.vsidx`, `DocumentLayout.json`, `VSWorkspaceState.json`, `slnx.sqlite`) sowie das überflüssige `assets/.gitkeep` entfernt. Die `.gitignore` wurde erweitert. Andere möglicherweise relevante Referenzen und Entwürfe bleiben erhalten.

## Noch offen
- vollständiger Browsertest (Desktop, Mobil, Touch und Tastatur)
- echte E-Mail-Anbindung und Backend erst bei passendem Betriebsmodell
- geschütztes Admin-Login, synchroner Warenbestand und verbindliche Zahlungen erst mit Backend
- Steuer- und Rechtsprüfung vor kommerziellem Start

**Wichtig:** Ein statischer Dateiverweis-Check ist kein vollständiger Browser-, Sicherheits- oder End-to-End-Test.
