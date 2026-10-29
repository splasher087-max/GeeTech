# GeeTech SPEC TJEK – datakvalitet og tekniske begrænsninger

Status: vejledende frontend-demo, 29. oktober 2026.

## Databasen
- `js/spec-database.js` rummer **52 desktop-CPU'er, 59 desktop-GPU'er, 24 bundkortmodeller, 12 PSU-effektklasser og 4 kabinetklasser**.
- Katalogets årstal er modellerne/generationernes omtrentlige lanceringstidspunkter, **ikke** det konkrete brugte eksemplars alder.
- Komponenternes interne `tier` er en heuristik til grove vurderinger, **ikke** en benchmark eller et dokumenteret FPS-tal.
- Producenternes katalog-/familielinks er alene en vej til kontrol; de dokumenterer ikke automatisk hver SKU's specifikationer.
- Enkelte modeller har links direkte til producentens model-/produktside. Disse markeres særskilt.
- Udvid først databasen, når nøjagtig model, VRAM, sokkel, RAM-type, effekter og kilde er dobbelttjekket. Specielt CPU TDP/base power er **ikke** en pålidelig maksimumværdi til PSU-dimensionering.

## Kompatibilitet
Værktøjet finder tydelige konflikter:
- CPU-sokkel vs. bundkortets sokkel.
- DDR-generation (bundkort/CPU vs. indtastede RAM).
- Bundkortets formfaktor vs. en generel kabinetklasse.
- Indikationer om PSU-effekt (aldrig godkendelse).

Det kan **ikke** garantere:
- CPU-support med konkret chipset, BIOS-version, motherboard-revision, RAM-QVL og XMP/EXPO.
- PSU's kvalitet, 12 V-ydelse, transienter eller grafikkortets strømstik.
- Grafikkortets længde/tykkelse, kølerens højde, kabinettes beslag og airflow.
- M.2 NVMe-slots, delte PCIe-linjer, diskgrænseflader eller kølekapacitet.
- Fejlfrie drivere, stabilitet, termik eller kompatibilitet for bærbare/OEM/ombyggede PC'er.

En manglende advarsel betyder **ikke** verificeret fuld kompatibilitet. Køb kræver præcise produktoplysninger og en separat gennemgang.

## Spil og ydeevne
`js/spec-games.js` indeholder spil, som er populære på PC, bl.a. CS2, Dota 2, PUBG, Fortnite, Marvel Rivals, Cyberpunk 2077 og Call of Duty: Black Ops 7. Første udvælgelse blev holdt op mod [SteamDB](https://steamdb.info/charts/).

Kilder til spilkrav:
- [Valve – Counter-Strike 2](https://store.steampowered.com/app/730/CounterStrike_2/)
- [Valve – Dota 2](https://store.steampowered.com/app/570/Dota_2/)
- [PUBG Support](https://support.pubg.com/hc/en-us/articles/115002108373-What-are-the-minimum-and-recommended-requirements-to-play-PUBG)
- [Epic Games – Fortnite](https://www.epicgames.com/help/c-34254770/c-38015632/a16548002?lang=da)
- [Marvel Rivals – FAQ](https://www.marvelrivals.com/news/20241205/40185_1198415.html)
- [Cyberpunk 2077 – Steam](https://store.steampowered.com/app/1091500/Cyberpunk_2077/)
- [Activision – Black Ops 7](https://support.activision.com/black-ops-7/articles/pc-system-requirements-for-black-ops-7)

Krav opdateres af udgiverne og skal efterkontrolleres løbende. Kataloget anvender konservative tiers og RAM/VRAM/SSD-krav; disse er **ikke** målte benchmarks. Mangler der CPU/GPU/RAM, må spilvurderingen ikke kaldes sikker. Kun systemkrav kan sammenholdes; præcise 1% lows, FPS og grafikindstillinger kræver **reelle tests af samme hardware**, med kilde, spilversion, opløsning, indstillinger, driver og målemetode.

## Persondata og udvikling
Formularen kører lokalt i browseren uden at sende PC-oplysninger til en server. Rapport kan kopieres/printes. Ingen betalt service eller automatisk produktkøb aktiveres. Databasen skal revideres før en egentlig kommerciel lancering.

## Kvalitetssikring
- GitHub Actions: kontrol af lokale filreferencer, navigationsrækkefølge, JS-syntaks og tilstedeværelse af producentkilder.
- Manuelle kodebaserede gennemløb: Ryzen 5600X + MSI B550 + DDR4 + RTX 3070 (ingen sikker konflikt) og Ryzen 7600 + B550 (sokkelkonflikt).
- Browserbaseret end-to-end-test, tilgængelighed, responsivitet og faktatjek af **alle** enkelte SKU'er er endnu ikke gennemført.
