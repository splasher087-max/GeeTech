"use strict";
(() => {
 const db=window.GEETECH_DB, games=window.GEETECH_GAMES;
 const extra=window.GEETECH_EXTRAS||{ramKits:[],drives:[],psuModels:[],caseModels:[]};
 if(!db||!games)return;
 const el=id=>document.getElementById(id);
 const form=el("pc-checker-form"),results=el("checker-output"),empty=el("checker-placeholder");
 const text=(parent,tag,value,className)=>{const node=document.createElement(tag);node.textContent=String(value);if(className)node.className=className;parent.append(node);return node;};
 const link=(parent,label,url)=>{const a=document.createElement("a");a.textContent=label+" ↗";a.href=url;a.target="_blank";a.rel="noopener noreferrer";parent.append(a);return a;};
 const options=(id,arr)=>{const select=el(id);arr.forEach(item=>{const option=document.createElement("option");option.value=item.id;option.textContent=item.name;select.append(option);});};
 options("cpu",db.cpus);options("gpu",db.gpus);options("board",db.boards);options("psu",db.psus);options("case",db.cases);
 games.forEach((game,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=game.name;el("game").append(o);});
 const find=(items,key)=>items.find(x=>x.id===key)||null;
 const lines=[];
 function panel(parent,label,title,description,status="note",source=null,sourceLabel="Se kilden"){
  const box=document.createElement("article");box.className="checker-tip checker-tip-"+status;
  text(box,"span",label,"checker-tip-label");text(box,"h4",title);text(box,"p",description);
  if(source){const sources=document.createElement("div");sources.className="checker-sources";link(sources,sourceLabel,source);box.append(sources);}
  parent.append(box);lines.push(label+" | "+title+": "+description+(source?" | Kilde: "+source:""));return box;
 }

 function renderSpecs(parent,item){
  if(!item)return;
  if(item.specs?.length){
   const dl=document.createElement("dl");dl.className="checker-spec-dl";
   for(const [label,value] of item.specs){
    const row=document.createElement("div");row.className="checker-spec-row";
    text(row,"dt",label);text(row,"dd",value);dl.append(row);
   }
   parent.append(dl);
  }
  if(item.use)text(parent,"p",item.use,"checker-component-use");
  if(item.evidenceLabel)text(parent,"small","Kildestatus: "+item.evidenceLabel,"checker-evidence");
 }
 function component(parent,kind,name,info,source,sourceLabel){
  const box=document.createElement("article");box.className="checker-part";
  text(box,"span",kind,"checker-part-label");text(box,"h4",name);text(box,"p",info);
  const entry=[...db.cpus,...db.gpus,...db.boards,...db.psus,...db.cases,...extra.ramKits,...extra.drives,...extra.psuModels,...extra.caseModels].find(x=>x.name===name);
  renderSpecs(box,entry);
  if(source){const wrap=document.createElement("div");wrap.className="checker-sources";text(wrap,"small",entry?.evidenceLabel||"Katalogreference (tjek den præcise model):");link(wrap,sourceLabel||"Producentens katalog",source);box.append(wrap);}
  parent.append(box);lines.push(kind+": "+name+" — "+info+(source?" | Katalog: "+source:""));
 }
 const unknown="Ikke oplyst. Kan ikke kontrolleres ud fra de tilgængelige data.";
 function analyze(event){
  event.preventDefault();lines.length=0;
  const d=Object.fromEntries(new FormData(form));
  const cpu=find(db.cpus,d.cpu),gpu=find(db.gpus,d.gpu),board=find(db.boards,d.board),psu=find(db.psus,d.psu),caseData=find(db.cases,d.case);
  const ram=d.ram?Number(d.ram):null,capacity=d.capacity?Number(d.capacity):null;
  const ramKit=find(extra.ramKits,d.ramkit),drive=find(extra.drives,d.drive),psuModel=find(extra.psuModels,d.psumodel),caseModel=find(extra.caseModels,d.casemodel);
  const items=el("checker-part-cards"),compat=el("checker-compat"),advice=el("checker-advice"),gamePanel=el("checker-games");
  items.replaceChildren();compat.replaceChildren();advice.replaceChildren();gamePanel.replaceChildren();
  let fail=0,attention=0,confirmed=0,unknownCount=0;
  const finding=(state,title,body)=>{panel(compat,state==="fail"?"KONFLIKT":state==="ok"?"KONTROLLERET":state==="warn"?"SKAL UNDERSØGES":"UKENDT",title,body,state==="fail"?"important":state==="warn"?"important":"note");if(state==="fail")fail++;else if(state==="warn")attention++;else if(state==="ok")confirmed++;else unknownCount++;};
  const model=(known,custom)=>known?.name||((custom||"").trim()||"Ikke oplyst");
  const cpuName=model(cpu,el("cpu-custom").value),gpuName=model(gpu,el("gpu-custom").value),boardName=model(board,el("board-custom").value);
  // Definitive socket / memory conflicts only when both sides are known.
  if(cpu&&board){const cpuBoardCheck=window.GEETECH_SPEC_META?.exactCompatibility?.(cpu,board);
    if(cpuBoardCheck?.kind==="blocked"&&cpu.socket===board.socket)finding("fail","Chipset understøtter ikke CPU-generationen",cpuBoardCheck.reason+" Kilde: "+(cpuBoardCheck.source||"producentens CPU-supportliste"));
    if(cpu.socket!==board.socket)finding("fail","CPU-sokkel passer ikke",cpu.name+" bruger "+cpu.socket+", men "+board.name+" bruger "+board.socket+". Delene passer ikke fysisk sammen.");
    else if(cpuBoardCheck?.kind!=="blocked")finding("ok","CPU og bundkort har samme sokkel",cpu.socket+" matcher. BIOS-version, chipset, køling og CPU-understøttelsesliste skal stadig kontrolleres.");}
  else if(cpu&&d.socket){if(cpu.socket!==d.socket)finding("fail","Den angivne sokkel matcher ikke CPU'en",cpu.name+" bruger "+cpu.socket+"; du har angivet "+d.socket+".");
    else finding("ok","CPU-sokkel matcher din oplysning",cpu.socket+" er samme sokkel. Uden model på bundkortet kan BIOS-understøttelsen ikke bekræftes.");}
  else finding("unknown","CPU/bundkort-kompatibilitet ukendt","Vælg både CPU og præcist bundkort for at kontrollere soklen.");
  if(board&&d.socket&&board.socket!==d.socket)finding("warn","Dine sokkeloplysninger er modstridende","Bundkortmodellen bruger "+board.socket+", men du har valgt "+d.socket+". Kontrollér det korrekte bundkort.");
  const actualRam=board?.memory||null;
  if(d.ramtype&&actualRam){
    if(actualRam!==d.ramtype)finding("fail","RAM-typen er forkert","Bundkortet bruger "+actualRam+", men du har valgt "+d.ramtype+". DDR-generationerne passer ikke i samme RAM-slots.");
    else finding("ok","RAM-generation matcher",board.name+" og den oplyste "+d.ramtype+" passer på generationsniveau. Kapacitet, hastighed og antal moduler er ikke testet.");
  } else if(cpu&&d.ramtype){
    if(!cpu.memory.includes(d.ramtype))finding("fail","CPU-platform og RAM-generation passer ikke","CPU'en er knyttet til "+cpu.memory.join(" eller ")+", men du har valgt "+d.ramtype+".");
    else finding("warn","RAM-platform passer på generationsniveau","CPU'en kan arbejde med "+d.ramtype+", men bundkort og BIOS er ikke verificeret.");
  }else finding("unknown","RAM-kompatibilitet kan ikke bekræftes","Indtast bundkort og RAM-type for en sikker generationskontrol.");
  if(board&&caseData&&caseData.forms){
    if(!caseData.forms.includes(board.form))finding("fail","Bundkortet passer ikke til kabinetformatet",board.form+"-bundkort kan ikke antages at passe i "+caseData.name+". Kontrollér præcise kabinetmål.");
    else finding("ok","Bundkortets format passer i den angivne kabinetklasse",board.form+" er normalt understøttet af "+caseData.name+". Specifikke afstandsstykker, radiatorer og GPU-plads skal stadig kontrolleres.");
  }else finding("unknown","Kabinet og fysiske mål","Kabinetformfaktor og bundkort er ikke begge kendte. GPU-længde og kølerhøjde skal desuden måles.");
  if(gpu&&psu){
    // Deliberately cautious: no certification from watt alone.
    const estimate=(cpu?.power||125)+gpu.power+100;
    if(psu.watt<estimate)finding("warn","PSU'ens angivne watt er muligvis for lave","Groft belastningsbudget omkring "+estimate+" W (ikke en måling) mod angivne "+psu.watt+" W. Kontrollér producentens PSU-anbefaling og PSU'ens model.");
    else finding("warn","Strømforsyningen kræver stadig kontrol","Et groft belastningsbudget er omkring "+estimate+" W mod angivne "+psu.watt+" W. Stik, 12 V-kapacitet, transienter, alder og kvalitet er ukendte; derfor kan PSU'en ikke godkendes her.");
  }else finding("unknown","Strømforsyning og grafikkort","Det kræver præcis PSU-model, GPU-model og strømstik. Watt alene kan ikke dokumentere kompatibilitet.");
  if(d.storage==="nvme"&&!board)finding("warn","NVMe kræver passende tilslutning","Kontrollér om bundkortet har M.2 NVMe-slot, eller om en særlig løsning er nødvendig. Slots kan dele PCIe-linjer.");
  finding("unknown","BIOS, strømstik, køling og mål","Disse detaljer kan ikke verificeres automatisk med denne formular. Et grønt resultat på sokkel og RAM er ikke en fuld kompatibilitetsgaranti.");
  const age=x=>x?.year?"Lanceret "+x.year+" ("+Math.max(0,new Date().getFullYear()-x.year)+" år siden lancering). ":"År ukendt. ";
  // Exact SKU data complements generic components, without guessing extra slots,
  // clocks, cable support or physical clearance.
  if(ramKit)component(items,"PRÆCIST RAM-KIT",ramKit.name,ramKit.summary,ramKit.source,"Kingston-specifikationer");
  if(drive)component(items,"PRÆCIS SSD",drive.name,drive.summary,drive.source,"Producentens SKU-specifikationer");
  if(psuModel)component(items,"PRÆCIS STRØMFORSYNING",psuModel.name,psuModel.summary,psuModel.source,"Producentens SKU-specifikationer");
  if(caseModel)component(items,"PRÆCIST KABINET",caseModel.name,caseModel.summary,caseModel.source,"Producentens kabinetdata");
  if(ramKit&&board&&ramKit.type!==board.memory)finding("fail","RAM-kit og bundkort er inkompatible",ramKit.type+" kan ikke anvendes i bundkort med "+board.memory+".");
  if(caseModel&&board&&!caseModel.forms.includes(board.form))finding("fail","Kabinet og bundkortformat passer ikke",board.form+" kan ikke antages at passe i det valgte kabinet.");
  if(psuModel&&psu&&psuModel.watt!==psu.watt)finding("warn","PSU-model og angivet watt stemmer ikke overens","Kontrollér hvilket PSU der faktisk er installeret.");
  if(drive&&d.storage&&drive.type!==d.storage)finding("warn","Diskmodellen og den oplyste disktype er forskellige","Kontrollér diskmodel og tilslutning før anbefaling.");
  component(items,"PROCESSOR",cpuName,cpu?age(cpu)+"Oplyst CPU-sokkel: "+cpu.socket+"; "+cpu.cores+" kerner/tråde; RAM-familie: "+cpu.memory.join(" eller ")+".":"Ingen modeldata verificeret.",cpu?.source,cpu?.sourceLabel);
  component(items,"GRAFIKKORT",gpuName,gpu?age(gpu)+"VRAM: "+gpu.vram+" GB. Offentliggjort typisk effekt varierer mellem kortdesign.":"Ingen modeldata verificeret.",gpu?.source,gpu?.sourceLabel);
  component(items,"BUNDKORT",boardName,board?"CPU-sokkel: "+board.socket+"; RAM: "+board.memory+"; format: "+board.form+". BIOS-understøttelse og M.2-specifikationer kræver producentens modelside.":"Ukendt. Kontrollér præcis model og revision.",board?.source,board?.sourceLabel);
  component(items,"RAM",ram?ram+" GB":"Ukendt mængde","RAM-type: "+(d.ramtype||"ukendt")+". Antal moduler, hastighed og timings er ikke angivet.");
  component(items,"SYSTEMDISK",({hdd:"HDD",sata:"SATA SSD",nvme:"NVMe SSD"})[d.storage]||"Ukendt",capacity?capacity+" GB samlet oplyst kapacitet. Ledig plads og antal diske ukendt.":"Kapacitet og ledig plads er ikke kendt.");
  component(items,"PSU",el("psu-custom").value.trim()||(psu?.name||"Ukendt"),psu?"Angivet effekt: "+psu.watt+" W. Det bekræfter ikke PSU'ens kvalitet eller tilslutninger.":"Ingen dokumenterbar strømdata.");
  const tip=(title,msg,level="note")=>panel(advice,level==="important"?"PRIORITERET":"MULIG FORBEDRING",title,msg,level);
  if(!cpu||!gpu||!board)tip("Mangler modeloplysninger","Uden præcis CPU-, GPU- og bundkortmodel kan en fuld kompatibilitets- eller ydelsesvurdering ikke leveres.");
  if(d.issue==="crash")tip("Fejlsøg før køb","Nedbrud kan skyldes drivere, varme, RAM, lagring, PSU eller software. Diagnostik bør komme før komponentudskiftning.","important");
  if(d.issue==="hot")tip("Temperatur og støj","Undersøg temperaturer, støv, køler, luftgennemstrømning og blæserstyring. Nye komponenter er ikke altid løsningen.");
  if(d.issue==="fps")tip("Lav FPS","Undersøg CPU-/GPU-belastning og frame times i de spil, du rent faktisk spiller, før du køber ny hardware.");
  if(d.issue==="slow"||d.storage==="hdd")tip("Hastighed i daglig brug","Hvis operativsystemet ligger på HDD, kan en SSD ofte gøre opstart og indlæsning hurtigere.");
  if(d.issue==="space"||(capacity&&capacity<=256))tip("Lagerplads","Overvej mere plads, hvis disken er næsten fuld. Tjek slot, formfaktor og backup først.");
  if(ram&&ram<16)tip("Mere RAM kan hjælpe","Mange nyere spil og multitasking fungerer bedst med mindst 16 GB; kontrollér bundkortets RAM-type og grænser.");
  else if(ram===16&&(d.use==="creative"||d.use==="stream"))tip("RAM til krævende arbejde","32 GB kan være nyttigt i større projekter eller ved samtidig streaming.");
  if(gpu?.vram<=6&&(d.use==="gaming"||d.use==="stream"))tip("VRAM ved nyere spil","Den angivne videohukommelse kan være en begrænsning i nyere spil eller med høje teksturer.");
  if(d.resolution==="2160"&&gpu&&gpu.tier<6)tip("4K kræver ekstra omtanke","Ved 4K kan lavere grafikindstillinger eller opskalering være nødvendig. Ingen præcis FPS kan beregnes uden benchmarks.");
  // Only show independently measured averages from the source test suite.
  // Never present an aggregate as game-specific FPS or convert its result to
  // a fake prediction using arbitrary 90/10 CPU/GPU weighting.
  const fpsHost=el("checker-fps");
  if(fpsHost){
   fpsHost.replaceChildren();
   const benchmarks=window.GEETECH_FPS;
   const norm=x=>String(x||"").toLowerCase().replace(/[^a-z0-9]/g,"");
   const record=gpu?Object.entries(benchmarks?.entries||{}).find(([name])=>norm(name)===norm(gpu.name)):null;
   if(record){
    const resolution=d.resolution||"1080";
    const fps=record[1][resolution];
    const section=document.createElement("section");
    section.className="checker-fps-result";
    text(section,"span","MÅLT GPU-BENCHMARK · IKKE SPILSPECIFIKT","checker-tip-label");
    text(section,"h4",gpu.name);
    if(Number.isFinite(fps)){
     text(section,"strong",Math.round(fps)+" FPS","checker-fps-number");
     text(section,"p","Målt geometrisk gennemsnit fra 11 spil ved "+(resolution==="2160"?"4K":resolution+"p")+
      ", med både High- og Ultra-indstillinger afhængigt af spillet, native opløsning og uden opskalering (rasterisering). Test-PC: Ryzen 7 9800X3D. Din CPU og det enkelte spil kan ændre FPS betydeligt.");
     lines.push("Målt GPU-testsuite: "+gpu.name+", "+resolution+"p Ultra: "+fps+" FPS, ikke et FPS-resultat for individuelle spil. Kilde: "+benchmarks.source);
    }else text(section,"p","Der er ikke et publiceret tal for den valgte opløsning i denne tabel.");
    const refs=document.createElement("div");refs.className="checker-sources";
    link(refs,benchmarks.sourceLabel,benchmarks.source);section.append(refs);fpsHost.append(section);
   }else{
    const section=document.createElement("div");section.className="checker-fps-result";
    text(section,"h4","FPS-benchmark ikke tilgængeligt");
    text(section,"p",gpu?"Vi har endnu ikke et verificeret målt FPS-tal for netop dette grafikkort i den anvendte testsuite. Vi viser ikke et gæt som et resultat.":"Vælg et grafikkort for at se, om der findes målte benchmarktal.");
    fpsHost.append(section);
   }
  }
  // CPU gaming scores are independent tests with a different GPU and suite.
  // Never multiply CPU index by GPU test averages to manufacture system FPS.
  if(el("checker-fps")&&cpu){
   const ranking=window.GEETECH_CPU_BENCHMARK;
   const cpuScore=ranking?.scores?.[cpu.name];
   const box=document.createElement("div");box.className="checker-fps-result checker-cpu-result";
   if(Number.isFinite(cpuScore)){
    text(box,"span","DOKUMENTERET CPU-GAMINGINDEKS · IKKE FPS","checker-tip-label");
    text(box,"h4",cpu.name);
    text(box,"strong",cpuScore.toLocaleString("da-DK")+" %","checker-fps-number");
    text(box,"p","Relativt CPU-gamingindeks, hvor testens hurtigste CPU svarer til 100 %. "+ranking.testbed+". Testen er IKKE den samme som GPU-benchmarktesten og kan ikke kombineres direkte til FPS.");
    const refs=document.createElement("div");refs.className="checker-sources";link(refs,ranking.sourceLabel,ranking.source);box.append(refs);
    lines.push("Dokumenteret CPU-gamingindeks: "+cpu.name+" = "+cpuScore+" % | Kilde: "+ranking.source);
   }else{
    text(box,"span","INGEN VERIFICERET CPU-GAMINGMÅLING","checker-tip-label");
    text(box,"h4",cpu.name);
    text(box,"p","Denne CPU er endnu ikke dokumenteret i vores sammenlignelige CPU-gamingdatasæt. SPEC TJEK opfinder ikke et benchmarkresultat.");
   }
   el("checker-fps").append(box);
  }
  const chosen=d.game==="all"?games:[games[Number(d.game)]].filter(Boolean);
  el("checker-games-section").hidden=!(d.use==="gaming"||d.use==="stream");
  if(!el("checker-games-section").hidden)for(const game of chosen){
    const box=document.createElement("article");box.className="checker-tip";
    const min=game.min,rec=game.rec;
    // CPU+GPU are sufficient for a useful preliminary assessment. Missing RAM
    // or storage must never be treated as zero, as adequate, or as verified.
    const pairKnown=!!cpu&&!!gpu;
    const cpuGpuBelowMin=pairKnown&&(cpu.tier<min.cpu||gpu.tier<min.gpu||gpu.vram<min.vram);
    const ramBelowMin=ram!==null&&ram<min.ram;
    const diskBelowMin=!!min.ssd&&d.storage==="hdd";
    const belowMin=cpuGpuBelowMin||ramBelowMin||diskBelowMin;
    const cpuGpuAtRec=pairKnown&&!!rec&&cpu.tier>=rec.cpu&&gpu.tier>=rec.gpu&&gpu.vram>=rec.vram;
    const ramAtRec=ram!==null&&!!rec&&ram>=rec.ram;
    const diskAtRec=!!rec&&(!rec.ssd||["sata","nvme"].includes(d.storage));
    const missing=[];
    if(!cpu)missing.push("CPU");if(!gpu)missing.push("grafikkort");
    if(ram===null)missing.push("RAM-mængde");
    if(min.ssd&&!d.storage)missing.push("disktype");
    let verdict,detail;
    if(belowMin){
     verdict="Et eller flere kendte minimumskrav er sandsynligvis ikke opfyldt";
     detail="Det betyder ikke nødvendigvis, at spillet aldrig kan starte, men ydelsen kan være utilstrækkelig.";
    }else if(!pairKnown){
     verdict="Vælg CPU og grafikkort for en foreløbig vurdering";
     detail="De to komponenter er de vigtigste oplysninger til dette første tjek.";
    }else if(cpuGpuAtRec){
     verdict="CPU og grafikkort ligger omtrent på anbefalet niveau";
     detail=ramAtRec&&diskAtRec?"De oplyste RAM- og diskkrav ser også fornuftige ud.":"Den samlede PC kan først vurderes mere sikkert, når RAM og relevante diskkrav er kendt.";
    }else{
     verdict="CPU og grafikkort ser ud til at opfylde de vejledende minimumsniveauer";
     detail=rec?"Det anbefalede niveau er ikke bekræftet; lavere grafikindstillinger kan blive nødvendige.":"Spillet har ikke en offentlig anbefalet profil i dette datagrundlag.";
    }
    text(box,"span","FORELØBIG SPILVURDERING · CPU + GPU","checker-tip-label");
    text(box,"h4",game.name);text(box,"p",verdict+".");
    text(box,"p",detail);
    if(missing.length)text(box,"p","Ikke kontrolleret: "+missing.join(", ")+". Vurderingen er derfor ikke en garanti for, at spillet kan køre.");
    text(box,"p","Udgiverens systemkrav: minimum "+min.ram+" GB RAM"+(rec?" · anbefalet "+rec.ram+" GB RAM":" · ingen officiel anbefalet profil")+". "+game.notes);
    const w=document.createElement("div");w.className="checker-sources";link(w,game.label,game.source);box.append(w);gamePanel.append(box);
    lines.push(game.name+": "+verdict+" | Mangler: "+(missing.join(", ")||"ingen oplyste nøglefelter")+" | Udgiverkrav: "+game.source);
  }
  if(d.use==="creative")tip("Kreativ ydelse","Det afhænger af din konkrete software, codecs, GPU-acceleration, RAM, lagring og projektstørrelse. En enkel hardwareliste giver ikke et pålideligt benchmark.");
  if(d.use==="general")tip("Kontor og skole","SSD og passende RAM vil ofte mærkes mere end et dyrt grafikkort. Se først på oplevede problemer.");
  if(!advice.children.length)tip("Intet oplagt køb nødvendigt","De oplyste dele viser ingen åbenlys hurtig forbedring. En faktisk test af din brug er bedre end at gætte.");
  const state=el("checker-status");state.replaceChildren();
  text(state,"strong",fail?fail+" sikre komponentkonflikter fundet":attention?attention+" forhold kræver ekstra kontrol":"Ingen sikre konflikter ud fra de udfyldte data");
  text(state,"span","Kontrolleret: "+confirmed+" · konflikter: "+fail+" · kræver undersøgelse: "+attention+" · ukendte: "+unknownCount+". Kun afgrænsede regler er testet – det er ikke en fuld kompatibilitetsgodkendelse.");
  lines.unshift("GeeTech SPEC TJEK – teknisk vurdering (ikke certificering)","Brug: "+d.use+" | Opløsning: "+(d.resolution||"ukendt")+"p");
  lines.push("Vigtigt: Kataloglinks kan pege på en produktfamilie, ikke den præcise SKU. Verificér altid fabrikantens modelside, BIOS og komponentmål.");
  empty.hidden=true;results.hidden=false;
  results.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
 }
 form.addEventListener("submit",analyze);
 form.addEventListener("reset",()=>{results.hidden=true;empty.hidden=false;lines.length=0;el("checker-copy-feedback").textContent="";});
 el("checker-copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(lines.join("\n"));el("checker-copy-feedback").textContent="Kopieret";}catch{el("checker-copy-feedback").textContent="Kunne ikke kopiere automatisk – brug Print."; }});
 el("checker-print").addEventListener("click",()=>window.print());
})();
