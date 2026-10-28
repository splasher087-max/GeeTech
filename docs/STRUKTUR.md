# GeeTech – Projektstruktur (28.10.2026)

## Aktueller Aufbau
```
GeeTech/
├── index.html             # GeeTech-Startseite
├── service.html           # PC-Service
├── shop.html              # Shop-Demo (intern noch NEXORA)
├── sell.html
├── account.html
├── cart.html
├── checkout.html
├── kontakt.html
├── retur.html
├── handelsbetingelser.html
├── privatliv.html
├── css/
│   ├── landing.css       # Startseite und Service-Layout
│   └── site.css          # Shop und weitere Seiten
├── js/
│   └── site.js           # Bestehende interaktive Shop-Demo
├── docs/
│   └── STRUKTUR.md
├── start-local.bat
├── .gitignore
└── README.md
```

## Durchgeführte Arbeiten
- Kaputte Startseite ersetzt: fehlende Hintergrundgrafik ist nicht mehr notwendig.
- Responsive GeeTech-Startseite mit animiertem Chip, Service-/Shop-Navigation und Kontaktbereich.
- Stylesheets nach `css/` und Skript nach `js/` verschoben.
- HTML-Referenzen angepasst; veraltete Root-Stylesheets und Root-Skript gelöscht.
- 11 HTML-Seiten und 14 aktuelle HTML/CSS/JS-Ziele auf Repository-Verfügbarkeit geprüft.

## Offen vor einem echten öffentlichen Shop-Start
- Browser- und End-to-End-Tests (Desktop/Mobil).
- Bestehendes NEXORA-Branding im Shop mit GeeTech abstimmen.
- Echte Account-Verwaltung, serverseitige Bestandsdaten, Bestell- und Zahlungsabwicklung.
- Datenschutzerklärung, Widerruf, AGB und gesetzliche Unternehmensangaben fachlich prüfen.
- Deployment über GitHub Pages aktivieren und veröffentlichte Vorschau testen.

Die Seite ist weiterhin eine **Demo** und darf nicht als betriebsbereiter E-Commerce-Shop beworben werden.
