"use strict";
/* Published system requirements from publishers/official storefront listings.
   tiers are NON-OFFICIAL broad heuristic bands used only for qualitative
   hints; the RAM/SSD/VRAM numbers and source links can be independently checked. */
window.GEETECH_GAMES=[
 {name:"Counter-Strike 2",min:{ram:8,vram:1,cpu:1,gpu:1,gb:85},rec:null,source:"https://store.steampowered.com/app/730/CounterStrike_2/",label:"Steam / Valve: systemkrav",notes:"Valve angiver kun minimumskrav, ikke en anbefalet FPS-profil."},
 {name:"Dota 2",min:{ram:4,vram:1,cpu:1,gpu:1,gb:60},rec:null,source:"https://store.steampowered.com/app/570/Dota_2/",label:"Steam / Valve: systemkrav",notes:"Minimumskrav angivet; ingen officiel FPS-garanti."},
 {name:"PUBG: BATTLEGROUNDS",min:{ram:8,vram:2,cpu:1,gpu:1,gb:40},rec:{ram:16,vram:3,cpu:2,gpu:2,gb:50},source:"https://support.pubg.com/hc/en-us/articles/115002108373-What-are-the-minimum-and-recommended-requirements-to-play-PUBG",label:"PUBG Support: minimum og anbefalede krav",notes:"Krav kan blive ændret med opdateringer."},
 {name:"Fortnite",min:{ram:8,vram:1,cpu:1,gpu:1,gb:40},rec:{ram:16,vram:2,cpu:2,gpu:2,gb:40,ssd:true},source:"https://www.epicgames.com/help/c-34254770/c-38015632/a16548002?lang=da",label:"Epic Games: officielle PC-krav",notes:"Epic anbefaler NVMe SSD til den anbefalede profil; Epic-kvalitet er en særskilt højere profil."},
 {name:"Marvel Rivals",min:{ram:16,vram:3,cpu:2,gpu:2,gb:70},rec:{ram:16,vram:6,cpu:3,gpu:3,gb:70,ssd:true},source:"https://www.marvelrivals.com/news/20241205/40185_1198415.html",label:"Marvel Rivals: officielle systemkrav",notes:"SSD anbefales af udgiveren."},
 {name:"Cyberpunk 2077",min:{ram:12,vram:6,cpu:2,gpu:2,gb:70,ssd:true},rec:{ram:16,vram:8,cpu:5,gpu:3,gb:70,ssd:true},source:"https://store.steampowered.com/app/1091500/Cyberpunk_2077/",label:"Steam / CD PROJEKT RED: systemkrav",notes:"Minimum og anbefalet kræver SSD. Raytracing kræver andre, højere specifikationer."},
 {name:"Call of Duty: Black Ops 7",min:{ram:8,vram:3,cpu:2,gpu:2,gb:116,ssd:true},rec:{ram:12,vram:8,cpu:2,gpu:3,gb:116,ssd:true},source:"https://support.activision.com/black-ops-7/articles/pc-system-requirements-for-black-ops-7",label:"Activision: officielle PC-krav",notes:"TPM 2.0 og Secure Boot påkrævet; disse kan ikke verificeres ud fra komponentlisten."}
];
