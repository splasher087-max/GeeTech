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


## Detaljer og guidede valg (29.10.2026)
- `js/spec-enrichment.js` udstyrer samtlige **151 basisindgange** med et teknisk specifikationsskema, en forståelig forklaring og en tydelig kildestatus. Heraf er **135 CPU-/GPU-/bundkortmodeller**; resten er generiske PSU-/kabinetklasser, **ikke** konkrete produktmodeller.
- En CPU har felter for kerner, tråde, generation/arkitektur, sokkel, RAM-type, lanceringsår og oplyst TDP eller processor base power. GPU'er viser arkitektur, VRAM, typisk effekt og lanceringsår. Bundkort viser chipset, CPU-sokkel, RAM-type og formfaktor.
- RAM og lagring, som endnu ikke har valgbare mærke-/SKU-kataloger, beskrives på kategori- og brugeroplyst niveau, uden opdigtede modulspecifikationer.
- Komponentkort vises **med det samme**, når en del vælges, og igen i samlet rapport. Producentlinks skal undersøges på præcis SKU, når de er angivet som serie- eller katalogkilder.
- `js/spec-interactive.js` deaktiverer kendt inkompatible CPU-/bundkortkombinationer, DDR-generationer og kabinetformater. CPU/bundkort vælger automatisk sokkel; entydig RAM-generation bliver automatisk valgt. Ved fravalg slettes de auto-afledte værdier.
- Udover sokkel kontrolleres dokumenterede chipset-undtagelser: Intel 7. generations Core med Z390 er blokeret ([Intel](https://www.intel.com/content/www/us/en/support/articles/000025694.html)), og Ryzen 1000/2000 på B550 samt Ryzen 1000 på X570 er blokeret ([AMD](https://www.amd.com/en/products/processors/chipsets/am4.html)).
- Automatiske tests i `tests/spec-metadata.test.cjs` og `tests/spec-interactive.test.cjs` køres via GitHub Actions for at kontrollere datadækning, disse blokeringer og automatiske valg.

**Datakvalitet:** Alle katalogindgange har informationsfelter, men det er **ikke det samme som 151 individuelt verificerede SKU'er**. Lanceringsdatoer, GPU-referenceeffekt, chipsetvarianter og CPU-TDP skal stadig kvalitetssikres per præcis variant. Et generelt producentkatalog er ikke en modelcertificering. Der gives ikke garanti for komplet kompatibilitet, fps eller et bestemt opgraderingsresultat.

### Yderligere dokumenterede modelvalg
`js/spec-extras.js` tilføjer **10 konkrete produktmodeller/varianter** med individuelle specifikationer og producenthenvisninger:
- 4 Kingston FURY DDR4-/DDR5-RAM-kit med nøjagtigt SKU, kapacitet, profiler, hastighed og timing ([Kingston DDR5](https://www.kingston.com/datasheets/KF560C36BBE2K2-32.pdf), [Kingston DDR4](https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F32)).
- 3 NVMe-SSD'er: Samsung 990 PRO 2TB og Crucial P3 Plus 1TB/2TB (producentens oplyste, *maksimale* sekventielle hastigheder – ikke målt kundeydelse).
- 1 Corsair RM750e PSU-variant med præcist EU-SKU, 750 W, ATX 3.1 og kabeltype.
- 2 kabinetmodeller (Corsair 4000D AIRFLOW og original Fractal North) med dokumenterede formater og maksimal GPU-længde.

Det giver nu **161 valg**: 145 navngivne CPU-/GPU-/bundkort- og andre produktmodeller plus 16 generiske PSU-/kabinetklasser. Brugeren kan stadig angive RAM/disk/PSU/kabinet efter kategori, når den præcise model ikke er i databasen. Når en præcis RAM-model vælges, sættes kapacitet, DDR-type og inkompatible valgmuligheder automatisk; konkrete SSD-/PSU-/kabinetvalg udfylder de tilhørende generiske felter.

Der er kun dokumenterede konkrete modeloplysninger på de nye 10 poster; den oprindelige 135-modeldatabase er stadig delvist katalogverificeret frem for fuldt efterkontrolleret per SKU. Der er **ingen garanti for komplet kompatibilitet**, og fabrikantens produktside skal efterkontrolleres før køb.

## Persondata og udvikling
Formularen kører lokalt i browseren uden at sende PC-oplysninger til en server. Rapport kan kopieres/printes. Ingen betalt service eller automatisk produktkøb aktiveres. Databasen skal revideres før en egentlig kommerciel lancering.

## Kvalitetssikring
- GitHub Actions: kontrol af lokale filreferencer, navigationsrækkefølge, JS-syntaks og tilstedeværelse af producentkilder.
- Manuelle kodebaserede gennemløb: Ryzen 5600X + MSI B550 + DDR4 + RTX 3070 (ingen sikker konflikt) og Ryzen 7600 + B550 (sokkelkonflikt).
- Browserbaseret end-to-end-test, tilgængelighed, responsivitet og faktatjek af **alle** enkelte SKU'er er endnu ikke gennemført.
