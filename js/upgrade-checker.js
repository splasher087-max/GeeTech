"use strict";
/* GeeTech PC Upgrade Checker — local-only, curated starter catalogue.
   Years are approximate launch years, NOT manufacture dates or performance scores. */
/* Curated, documented subset. Add models only after checking original manufacturer pages.
   Data fields: CPU id,name,launch year,socket,RAM,verified traits,legacy level.
   GPU id,name,launch year,VRAM,verified traits,legacy level.
   Level is an internal suggestion heuristic, never an objective performance score. */
const CPU=[
 ["ryzen5600x","AMD Ryzen 5 5600X",2020,"AM4","DDR4","6 kerner / 12 tråde, Zen 3, 65 W TDP. Understøtter DDR4. Velegnet til almindelige programmer; spiloplevelsen afhænger også af GPU og resten af PC'en.",3],
 ["intel12400","Intel Core i5-12400",2022,"LGA1700","DDR4/DDR5","6 kerner / 12 tråde, op til 4,4 GHz. Understøtter DDR4 eller DDR5 afhængigt af bundkort. Intel UHD Graphics 730 indbygget.",3],
 ["other","Anden model / ikke på listen",null,null,null,"Ikke verificeret i vores produktdatabase. Oplysninger om modellen kan ikke automatisk bekræftes.",null]
];
const GPU=[
 ["rtx3070","NVIDIA GeForce RTX 3070 8 GB",2020,8,"Ampere-GPU med 8 GB GDDR6, raytracing og NVIDIA DLSS. Faktisk FPS afhænger af spil, indstillinger, CPU og skærmopløsning.",3],
 ["rx6700xt","AMD Radeon RX 6700 XT 12 GB",2021,12,"RDNA 2-grafikkort med 12 GB GDDR6 og oplyst typisk kortforbrug på 230 W. AMD anbefaler mindst 650 W strømforsyning til referencekortet.",4],
 ["other","Anden model / ikke på listen",null,null,"Ikke verificeret i vores produktdatabase. Oplysninger om modellen kan ikke automatisk bekræftes.",null]
];
const VERIFIED_SOURCES={
 ryzen5600x:[["AMD – officielle Ryzen 5 5600X specifikationer","https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html"]],
 intel12400:[["Intel – officielle Core i5-12400 specifikationer","https://www.intel.com/content/www/us/en/products/sku/134586/intel-core-i512400-processor-18m-cache-up-to-4-40-ghz/specifications.html"]],
 rtx3070:[["NVIDIA – RTX 3070 specifikationer","https://www.nvidia.com/da-dk/geforce/graphics-cards/30-series/rtx-3070-3070ti/"],["NVIDIA – lanceringsdato","https://www.nvidia.com/en-us/geforce/news/geforce-rtx-3070-out-now/"]],
 rx6700xt:[["AMD – officielle RX 6700 XT specifikationer","https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6700-xt.html"],["AMD – tilgængelighed/lancering","https://www.amd.com/en/newsroom/press-releases/2021-3-3-amd-unveils-amd-radeon-rx-6700-xt-graphics-card-d.html"]]
};
const $=id=>document.getElementById(id);
const form=$("pc-checker-form"),output=$("checker-output"),placeholder=$("checker-placeholder");
const fmtAge=y=>Number.isInteger(y)?Math.max(0,new Date().getFullYear()-y)+" år siden lancering":"Ukendt lanceringsår";
const lookup=(list,id)=>list.find(item=>item[0]===id)||null;
const addText=(parent,tag,text,klass)=>{const x=document.createElement(tag);x.textContent=text;if(klass)x.className=klass;parent.append(x);return x};
function populate(id,list){const el=$(id);for(const item of list){const opt=document.createElement("option");opt.value=item[0];opt.textContent=item[1];el.append(opt)}}
populate("cpu",CPU);populate("gpu",GPU);
const reportLines=[];
function part(container,title,name,year,details,sources=[]){
 const el=document.createElement("article");el.className="checker-part";
 addText(el,"span",title,"checker-part-label");addText(el,"h4",name);
 addText(el,"small",year===null?"Alder: Kan ikke bestemmes":"Lanceret: "+year+" · "+fmtAge(year));
 addText(el,"p",details);
 if(sources.length){
  const sourceBox=document.createElement("div");sourceBox.className="checker-sources";
  addText(sourceBox,"strong","Dokumenterede kilder:");
  for(const [label,url] of sources){
   const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label+" ↗";sourceBox.append(a);
  }
  el.append(sourceBox);
 }
 container.append(el);
 reportLines.push(title+": "+name+" | "+(year===null?"Ukendt år":year+" ("+fmtAge(year)+")")+" | "+details);if(sources.length)for(const [label,url] of sources)reportLines.push("Kilde: "+label+" — "+url);
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
 part(cards,"PROCESSOR",cName,cpu?.[2]??null,cpu?.[5]||"Indtast CPU-modellen for at få mere konkret information.",VERIFIED_SOURCES[cpu?.[0]]||[]);
 part(cards,"GRAFIKKORT",gName,gpu?.[2]??null,gpu?.[4]||"Grafikkortets egenskaber kan ikke vurderes uden præcis model.",VERIFIED_SOURCES[gpu?.[0]]||[]);
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
 if(gpu?.[0]==="rx6700xt"&&d.psu&&Number(d.psu)<650)add("important","AMD anbefaler mindst 650 W til RX 6700 XT","AMD's dokumentation anbefaler 650 W til referencegrafikkortet. Den konkrete strømforsyning, kabelforbindelser og resten af systemet skal vurderes særskilt.");
 if(d.psu&&Number(d.psu)<=450&&(use==="gaming"||use==="stream"))add("note","Undersøg strømforsyningen før en GPU-opgradering","En angivet strømforsyning på "+d.psu+" W kan sætte grænser for nogle nye grafikkort. Den konkrete model, alder og strømforbrug skal verificeres.");
 if(d.issue==="slow")add("note","Langsom opstart og programmer","Kontrollér diskens type og sundhed, opstartsprogrammer, RAM-forbrug og systemtilstand, før du vælger en opgradering.");
 if(d.issue==="fps")add("note","Lav FPS eller hakkende spil","Mål CPU- og GPU-belastning, temperaturer og RAM-forbrug i dine faktiske spil. Det viser bedre, hvad der begrænser din PC.");
 if(d.issue==="hot")add("note","Høj varme eller støj","Undersøg støv, køler, luftgennemstrømning, blæserkurver og temperaturer. Flere eller dyrere dele løser ikke nødvendigvis problemet.");
 if(d.issue==="space")add("note","Mangler lagerplads","Se efter plads til en ekstra SSD eller udskiftning. Tag backup før flytning af system eller filer.");
 if(d.issue==="crash")add("important","Ustabil PC skal fejlsøges først","Nedbrud kan have mange årsager: RAM, drivere, temperaturer, lager, strømforsyning eller software. Køb ikke dele ud fra gæt.");
 if(d.storage==="hdd")add("important","SSD er oplagt at undersøge","Hvis Windows ligger på en HDD, er flytning til en kompatibel SSD ofte en af de mest mærkbare forbedringer.");
 if(cpu&&cpu[6]!==null&&cpu[6]<=2&&(use==="gaming"||use==="stream"||use==="creative"))
  add("note","Tjek CPU-ydelsen til dine programmer","Din valgte CPU kan være begrænsende i enkelte krævende programmer. Undersøg CPU-belastning og faktiske problemer før et køb.");
 if(gpu&&gpu[5]!==null&&(use==="gaming"||use==="stream")){
  if(gpu[5]<=2)add("note","Grafikkortet kan være næste flaskehals","Til visse krævende spil kan grafikkortet være en begrænsning. Skærmopløsning og dine konkrete spil afgør behovet.");
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
 reportLines.push("Kildegrundlag: Kun modeller med producentlink er verificeret. Øvrige råd er betingede vurderinger, ikke målte tests.");reportLines.push("Dette er ikke en komplet kompatibilitetskontrol, FPS-måling eller købsanbefaling.");
 output.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
}
form.addEventListener("submit",evaluate);
form.addEventListener("reset",()=>{output.hidden=true;placeholder.hidden=false;reportLines.length=0;$("checker-copy-feedback").textContent=""});
$("checker-copy").addEventListener("click",async()=>{const t=reportLines.join("\n");try{await navigator.clipboard.writeText(t);$("checker-copy-feedback").textContent="Rapport kopieret";}catch{$("checker-copy-feedback").textContent="Markér og kopiér rapporten manuelt, eller brug Print."; }});
$("checker-print").addEventListener("click",()=>window.print());
