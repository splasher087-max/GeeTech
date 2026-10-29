"use strict";
/* GeeTech PC Upgrade Checker — local-only, curated starter catalogue.
   Years are approximate launch years, NOT manufacture dates or performance scores. */
const CPU=[
 ["ryzen1600","AMD Ryzen 5 1600",2017,"AM4","DDR4","6 kerner / 12 tråde. Ældre Zen-platform; grundlæggende gaming og hverdagsbrug.",1],
 ["ryzen3600","AMD Ryzen 5 3600",2019,"AM4","DDR4","6 kerner / 12 tråde. Alsidig processor, stadig anvendelig til mange opgaver.",2],
 ["ryzen5600x","AMD Ryzen 5 5600X",2020,"AM4","DDR4","6 kerner / 12 tråde, Zen 3. God mellemklasse til gaming og daglig brug.",3],
 ["ryzen5800x3d","AMD Ryzen 7 5800X3D",2022,"AM4","DDR4","8 kerner / 16 tråde og stor cache; især stærk til mange spil.",4],
 ["ryzen7600","AMD Ryzen 5 7600",2023,"AM5","DDR5","6 kerner / 12 tråde, Zen 4. Moderne gaming- og allroundprocessor.",4],
 ["ryzen7800x3d","AMD Ryzen 7 7800X3D",2023,"AM5","DDR5","8 kerner / 16 tråde med 3D V-Cache; målrettet høj gamingydelse.",5],
 ["intel8700k","Intel Core i7-8700K",2017,"LGA1151","DDR4","6 kerner / 12 tråde. Tidligere high-end; kan være begrænset i krævende nye spil.",2],
 ["intel10400","Intel Core i5-10400",2020,"LGA1200","DDR4","6 kerner / 12 tråde. Fornuftig til hverdagsbrug og lettere gaming.",2],
 ["intel12400","Intel Core i5-12400",2022,"LGA1700","DDR4/DDR5","6 kerner / 12 tråde. God allround-CPU; RAM-type afhænger af bundkortet.",3],
 ["intel13600k","Intel Core i5-13600K",2022,"LGA1700","DDR4/DDR5","14 kerner (6P+8E) / 20 tråde. Velegnet til gaming og multitasking.",4],
 ["intel14700k","Intel Core i7-14700K",2023,"LGA1700","DDR4/DDR5","20 kerner (8P+12E) / 28 tråde. Stærk til krævende arbejde og gaming.",5],
 ["other","Anden model / ikke på listen",null,null,null,"Skriv modellen i feltet herunder. Specifikationer og årstal kan ikke bekræftes automatisk.",null]
];
const GPU=[
 ["gtx1060","NVIDIA GeForce GTX 1060 6 GB",2016,6,"Ældre 1080p-kort. Ingen hardwarebaseret RTX-raytracing eller DLSS.",1],
 ["gtx1660s","NVIDIA GeForce GTX 1660 SUPER 6 GB",2019,6,"Stadig anvendeligt til lettere 1080p-gaming; begrænset ved nye tunge spil.",2],
 ["rtx2060","NVIDIA GeForce RTX 2060 6 GB",2019,6,"Turing-kort med raytracing og DLSS; 6 GB VRAM kan begrænse nye spil.",2],
 ["rtx3060","NVIDIA GeForce RTX 3060 12 GB",2021,12,"Ampere-grafikkort. Godt udgangspunkt til mange 1080p-spil.",3],
 ["rtx3070","NVIDIA GeForce RTX 3070 8 GB",2020,8,"Stærkt kort til 1080p og meget 1440p; 8 GB VRAM kan blive en begrænsning.",3],
 ["rtx4060","NVIDIA GeForce RTX 4060 8 GB",2023,8,"Energieffektivt kort med DLSS 3 Frame Generation; især rettet mod 1080p.",3],
 ["rtx4070","NVIDIA GeForce RTX 4070 12 GB",2023,12,"Godt valg til mange 1440p-spil, afhængigt af spil og indstillinger.",4],
 ["rx580","AMD Radeon RX 580 8 GB",2017,8,"Ældre grafikkort, egnet til lettere 1080p-opgaver.",1],
 ["rx6600","AMD Radeon RX 6600 8 GB",2021,8,"Godt udgangspunkt for prisbevidst 1080p-gaming.",3],
 ["rx6700xt","AMD Radeon RX 6700 XT 12 GB",2021,12,"Velegnet til mange 1440p-spil med 12 GB VRAM.",4],
 ["rx7800xt","AMD Radeon RX 7800 XT 16 GB",2023,16,"Stærkt 1440p-kort med god videohukommelseskapacitet.",4],
 ["other","Anden model / ikke på listen",null,null,"Skriv modellen i feltet herunder. Specifikationer og årstal kan ikke bekræftes automatisk.",null]
];
const $=id=>document.getElementById(id);
const form=$("pc-checker-form"),output=$("checker-output"),placeholder=$("checker-placeholder");
const fmtAge=y=>Number.isInteger(y)?Math.max(0,new Date().getFullYear()-y)+" år siden lancering":"Ukendt lanceringsår";
const lookup=(list,id)=>list.find(item=>item[0]===id)||null;
const addText=(parent,tag,text,klass)=>{const x=document.createElement(tag);x.textContent=text;if(klass)x.className=klass;parent.append(x);return x};
function populate(id,list){const el=$(id);for(const item of list){const opt=document.createElement("option");opt.value=item[0];opt.textContent=item[1];el.append(opt)}}
populate("cpu",CPU);populate("gpu",GPU);
const reportLines=[];
function part(container,title,name,year,details){
 const el=document.createElement("article");el.className="checker-part";
 addText(el,"span",title,"checker-part-label");addText(el,"h4",name);
 addText(el,"small",year===null?"Alder: Kan ikke bestemmes":"Lanceret: "+year+" · "+fmtAge(year));
 addText(el,"p",details);
 container.append(el);
 reportLines.push(title+": "+name+" | "+(year===null?"Ukendt år":year+" ("+fmtAge(year)+")")+" | "+details);
}
function recommendation(container,level,title,description){
 const el=document.createElement("article");el.className="checker-tip checker-tip-"+level;
 addText(el,"span",level==="note"?"UNDERSØG":level==="important"?"VÆRD AT TJEKKE":"INFO","checker-tip-label");
 addText(el,"h4",title);addText(el,"p",description);container.append(el);
 reportLines.push((level==="important"?"Vigtigt: ":"")+title+" — "+description);
}
function evaluate(event){
 event.preventDefault();reportLines.length=0;
 const d=Object.fromEntries(new FormData(form).entries());
 const cpu=lookup(CPU,d.cpu),gpu=lookup(GPU,d.gpu);
 const customCpu=$("cpu-custom").value.trim(),customGpu=$("gpu-custom").value.trim();
 const ram=Number(d.ram)||null,res=d.resolution||"",use=d.use||"general";
 const cards=$("checker-part-cards"),advice=$("checker-advice");
 cards.replaceChildren();advice.replaceChildren();
 const cName=cpu?.[0]==="other"?(customCpu||"Anden CPU (model ikke angivet)"):(cpu?.[1]||"Ukendt CPU");
 const gName=gpu?.[0]==="other"?(customGpu||"Anden GPU (model ikke angivet)"):(gpu?.[1]||"Ukendt GPU");
 part(cards,"PROCESSOR",cName,cpu?.[2]??null,cpu?.[5]||"Indtast CPU-modellen for at få mere konkret information.");
 part(cards,"GRAFIKKORT",gName,gpu?.[2]??null,gpu?.[4]||"Grafikkortets egenskaber kan ikke vurderes uden præcis model.");
 part(cards,"RAM",ram?ram+" GB":"Ukendt mængde",null,ram?"Oplyst type: "+(d.ramtype||"ukendt")+". Mængden alene siger ikke alt om hastighed eller kompatibilitet.":"Angiv gerne RAM-mængden for at få en vurdering.");
 part(cards,"BUNDKORT",d.motherboard?.trim()||"Ukendt bundkortmodel",null,"Oplyst CPU-sokkel: "+(d.socket||"ukendt")+". For kompatibilitet skal bundkortmodel, chipset og BIOS-version kontrolleres.");
 part(cards,"STRØMFORSYNING",d.psu?d.psu+" W (angivet)":"Ukendt effekt",null,"Watt alene er ikke nok: kvalitet, alder, stik og faktisk strømforbrug skal også kontrolleres.");
 part(cards,"SYSTEMDISK",d.storage==="hdd"?"Harddisk (HDD)":d.storage==="sata"?"SATA SSD":d.storage==="nvme"?"NVMe SSD":"Ukendt disk",null,d.storage==="hdd"?"En SSD kan ofte gøre opstart og indlæsning væsentligt hurtigere.":d.storage==="sata"?"En SATA SSD er stadig fin til daglig brug.":d.storage==="nvme"?"En NVMe SSD er en hurtig lagertype; mærkbar forskel afhænger af opgaven.":"Disktypen er ukendt.");
 part(cards,"LAGERKAPACITET",d.capacity?d.capacity+" GB (angivet)":"Ukendt kapacitet",null,"Pladsbehov afhænger af programmer, spil og hvor meget ledig plads du har.");
 let important=0;
 const add=(level,title,desc)=>{if(level==="important")important++;recommendation(advice,level,title,desc)};
 if(cpu?.[3]&&d.socket&&d.socket!=="other"&&cpu[3]!==d.socket)
  add("important","CPU og sokkel passer ikke sammen","Den valgte CPU bruger "+cpu[3]+", men du har angivet "+d.socket+". Kontrollér CPU- og bundkortmodellen; oplysningerne kan være indtastet forkert.");
 if(cpu?.[4]&&d.ramtype&& !cpu[4].split("/").includes(d.ramtype))
  add("important","Kontrollér RAM-typen","Den valgte CPU-platform er normalt knyttet til "+cpu[4]+", men du har angivet "+d.ramtype+". Find bundkortets præcise model.");
 if(ram&&ram<8)add("important","RAM er sandsynligvis første skridt","Under 8 GB kan hurtigt blive en begrænsning til moderne systemer og mange samtidige programmer.");
 else if(ram===8)add("note","16 GB RAM kan være værd at overveje","8 GB kan fungere til let brug, men 16 GB giver ofte bedre plads til spil og multitasking.");
 else if(ram===16&&(use==="creative"||use==="stream"))add("note","32 GB kan give mere arbejdsrum","Ved videoredigering, mange programmer og streaming kan større RAM-mængde hjælpe.");
 else if(ram>=32)add("info","RAM-mængden ser fornuftig ud","Din oplyste mængde er god til mange almindelige og krævende opgaver. Hastighed og behov varierer.");
 if(d.capacity&&Number(d.capacity)<=256)add("note","Overvej mere lagerplads","Hvis disken er næsten fuld, kan en større SSD give plads til system, spil og programmer. Kontroller tilslutning og dataflytning.");
 if(d.psu&&Number(d.psu)<=450&&(use==="gaming"||use==="stream"))add("note","Undersøg strømforsyningen før en GPU-opgradering","En angivet strømforsyning på "+d.psu+" W kan sætte grænser for nogle nye grafikkort. Den konkrete model, alder og strømforbrug skal verificeres.");
 if(d.issue==="slow")add("note","Langsom opstart og programmer","Kontrollér diskens type og sundhed, opstartsprogrammer, RAM-forbrug og systemtilstand, før du vælger en opgradering.");
 if(d.issue==="fps")add("note","Lav FPS eller hakkende spil","Mål CPU- og GPU-belastning, temperaturer og RAM-forbrug i dine faktiske spil. Det viser bedre, hvad der begrænser din PC.");
 if(d.issue==="hot")add("note","Høj varme eller støj","Undersøg støv, køler, luftgennemstrømning, blæserkurver og temperaturer. Flere eller dyrere dele løser ikke nødvendigvis problemet.");
 if(d.issue==="space")add("note","Mangler lagerplads","Se efter plads til en ekstra SSD eller udskiftning. Tag backup før flytning af system eller filer.");
 if(d.issue==="crash")add("important","Ustabil PC skal fejlsøges først","Nedbrud kan have mange årsager: RAM, drivere, temperaturer, lager, strømforsyning eller software. Køb ikke dele ud fra gæt.");
 if(d.storage==="hdd")add("important","SSD er oplagt at undersøge","Hvis Windows ligger på en HDD, er flytning til en kompatibel SSD ofte en af de mest mærkbare forbedringer.");
 if(cpu&&cpu[6]!==null&&cpu[6]<=2&&(use==="gaming"||use==="stream"||use==="creative"))
  add("note","Tjek CPU-ydelsen til dine programmer","Din CPU er fra en ældre generation. Undersøg CPU-belastning og faktiske problemer før et køb.");
 if(gpu&&gpu[5]!==null&&(use==="gaming"||use==="stream")){
  if(gpu[5]<=2)add("note","Grafikkortet kan være næste flaskehals","Til nyere krævende spil kan kortet være begrænsende. Skærmopløsning og dine konkrete spil afgør behovet.");
  else if(res==="2160"&&gpu[5]<=3)add("note","4K kan stille høje krav","Ved 4K-gaming kan det være nødvendigt at sænke indstillinger eller undersøge en stærkere GPU.");
  if(gpu[3]&&gpu[3]<=8&&res!=="1080")add("note","Hold øje med VRAM i nyere spil","Videohukommelse på "+gpu[3]+" GB kan begrænse høje teksturindstillinger i nogle nyere spil, især ved høj opløsning.");
 }
 if(!cpu||cpu[0]==="other"||!gpu||gpu[0]==="other")add("info","Flere detaljer giver en bedre vurdering","Ukendte komponenter får ikke opdigtede specifikationer. Du kan stadig bruge rapporten som udgangspunkt.");
 if(!important&&advice.childElementCount===0)add("info","Ingen oplagte problemer i de oplyste data","Det betyder ikke, at alle dele passer sammen eller at PC'en har den ønskede ydelse. En konkret test er nødvendig.");
 add("note","Kontrollér altid hele PC'en før køb","Sokkel, BIOS, chipset, RAM-understøttelse, strømforsyning, køler og plads i kabinettet skal kontrolleres før en opgradering. Værktøjet er ikke en kompatibilitetsgaranti.");
 const status=$("checker-status");status.replaceChildren();
 addText(status,"strong",important?"Der er "+important+" ting, som bør undersøges":"Første vurdering er klar");
 addText(status,"span",important?"Se markeringerne nedenfor. Det er ikke en fejl-diagnose.":"Gennemgå forslagene nedenfor – de er vejledende.");
 placeholder.hidden=true;output.hidden=false;
 reportLines.unshift("GeeTech SPEC TJEK – vejledende rapport", "Brug: "+({general:"Hverdag",gaming:"Gaming",creative:"Kreativt arbejde",stream:"Gaming/streaming"}[use]||use), "Opløsning: "+(res?res==="2160"?"4K":res+"p":"Ikke angivet"));
 reportLines.push("Oplyst symptom: "+({none:"Ingen konkret fejl",slow:"Langsom opstart",fps:"Lav FPS",hot:"Høj varme/støj",space:"Mangler plads",crash:"Nedbrud"}[d.issue]||"Ikke angivet"));
 reportLines.push("Dette er ikke en komplet kompatibilitetskontrol, FPS-måling eller købsanbefaling.");
 output.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
}
form.addEventListener("submit",evaluate);
form.addEventListener("reset",()=>{output.hidden=true;placeholder.hidden=false;reportLines.length=0;$("checker-copy-feedback").textContent=""});
$("checker-copy").addEventListener("click",async()=>{const t=reportLines.join("\n");try{await navigator.clipboard.writeText(t);$("checker-copy-feedback").textContent="Rapport kopieret";}catch{$("checker-copy-feedback").textContent="Markér og kopiér rapporten manuelt, eller brug Print."; }});
$("checker-print").addEventListener("click",()=>window.print());
