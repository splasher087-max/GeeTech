# GeeTech – Entwicklungs- und Launchplan

## Aktueller Modus: DEMO
- Keine echten Bestellungen, Zahlungen, Registrierung oder verbindliche Lagerreservierung.
- Kein Versand von Kontaktformularen.
- Keine Echtdaten in Demoformularen oder dem lokalen Inventar verwenden.
- `inventory.html` ist eine **unbeschützte lokale Demooberfläche**: keine echten Geschäfts-/Einkaufsdaten in einem öffentlich zugänglichen Browser eingeben.
- Lagerdaten werden unter `geetech_inventory_v1` in localStorage gespeichert (ein Gerät/Browser).
- Inventar als JSON sichern, bevor Browserdaten gelöscht werden. CSV für Tabellenkalkulationen.
- Die Shop-Beispielprodukte in `js/site.js` sind **nicht** mit dem Inventar synchronisiert.
- Der Margen-/Moms-Rechner ist eine Schätzung, keine verbindliche Steuer- oder Buchhaltungsberechnung.

## Sofortige Qualitätssicherung
1. Jede HTML-Seite im Browser über lokalen Server öffnen, Links, Bilder und Konsole prüfen.
2. Desktop, Tablet, Smartphone mit Maus, Touch und Tastatur prüfen.
3. Lager: hinzufügen, ändern, löschen, Suche, Filter, Rechenwerte, JSON Export/Import, CSV Export und Browserneustart testen.
4. Warenkorb: Mengen, Bestandsgrenzen, Checkout-Demo und Fehlerzustände testen.
5. Formulare: Validierung sowie deutlich sichtbare Nicht-Versand-Hinweise kontrollieren.
6. Keine realen personen- oder unternehmensbezogenen Daten zu Testzwecken eingeben.

## Später aktivierbare Funktionen
- Geschützter Admin-Login mit serverseitigen Rollen und Sessions.
- Datenbanktabellen: Produkte, Einzelartikel/Seriennummern, Lagerbewegungen, Bestellungen, Bestellpositionen, Kunden, Lieferungen und Buchungs-/Kostenbelege.
- API: einheitliche Produktquelle für Inventar und Shop; reservierte Mengen atomar führen und bei Bestellabschluss korrekt reduzieren.
- Preis-/Deckungsbeitragsmodul mit separat konfigurierbaren Gebühren, Versand, Reparaturkosten und fachlich validierten Steuermodellen.
- E-Mail-Kontakt über serverseitigen Anbieter, Spam- und Missbrauchsschutz.
- Zahlungsanbieter-Integration erst nach Firmengründung und Prüfung der rechtlichen Voraussetzungen.
- Rechtliche Angaben, Datenschutz, AGB, Widerruf, echte Geschäfts-/Kontaktdaten vor Livegang prüfen.
- Import der lokalen JSON-Exportdaten in die spätere Datenbank mit Validierungs- und Migrationsskript.
- Automatisierte Tests für Lagerbewegungen, Bestellgleichzeitigkeit, Preise, Formulare, API-Rechte und Backups.

## Prinzip
Die Demo darf **nie** als echter Shop oder als geschützte Admin-Oberfläche dargestellt werden. Vor realer Nutzung erfolgt ein Sicherheits- und End-to-End-Test.
