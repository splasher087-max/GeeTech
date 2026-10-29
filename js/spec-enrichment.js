"use strict";
/* SPEC TJEK per-item metadata enrichment.
 * Every selectable catalogue entry gets descriptive characteristics and explicit
 * evidence level. Existing numbers originate in a curated, maintained catalogue,
 * not a live API. Do not label unverified model values as independently verified.
 */
(() => {
 const db=window.GEETECH_DB;if(!db)return;
 const sourcePages={
  amdSpec:"https://www.amd.com/en/products/specifications/processors.html",
  intelSpec:"https://www.intel.com/content/www/us/en/products/overview.html",
  amdRadeon:"https://www.amd.com/en/products/graphics/desktops/radeon.html",
  nvCompare:"https://www.nvidia.com/en-us/geforce/graphics-cards/compare/",
  intelArc:"https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html"
 };
 const amdArchitecture=(name)=>{
  if(/\b(1[0-9]{3}|2[0-9]{3})\b/.test(name))return "Zen / Zen+ (generation afhænger af modellen)";
  if(/\b3[0-9]{3}\b/.test(name))return "Zen 2";
  if(/\b5[0-9]{3}\b/.test(name))return "Zen 3";
  if(/\b7[0-9]{3}\b/.test(name))return "Zen 4";
  if(/\b9[0-9]{3}\b/.test(name))return "Zen 5";
  return "Arkitektur skal efterkontrolleres";
 };
 const intelArchitecture=(name)=>{
  if(/Core Ultra/.test(name))return "Core Ultra 200S (Arrow Lake)";
  const m=name.match(/Core i\d-(\d{4,5})/);
  if(!m)return "Intel Core – generation kræver kontrol";
  const generation=m[1].length===5?+m[1].slice(0,2):+m[1][0];
  const names={7:"Kaby Lake",8:"Coffee Lake",9:"Coffee Lake Refresh",10:"Comet Lake",11:"Rocket Lake",12:"Alder Lake",13:"Raptor Lake",14:"Raptor Lake Refresh"};
  return (names[generation]||"Ukendt arkitektur")+" (generation "+generation+")";
 };
 const gpuArchitecture=name=>{
  if(name.startsWith("NVIDIA")){
   if(/GTX (10\d\d)/.test(name))return "Pascal";
   if(/GTX 16|RTX 20/.test(name))return "Turing";
   if(/RTX 30/.test(name))return "Ampere";
   if(/RTX 40/.test(name))return "Ada Lovelace";
   if(/RTX 50/.test(name))return "Blackwell";
  }
  if(name.startsWith("AMD")){
   if(/RX (570|580)(?![0-9])/.test(name))return "GCN / Polaris (kontrollér præcis model)";
   if(/RX 5[0-9]{3}/.test(name))return "RDNA";
   if(/RX 6[0-9]{3}/.test(name))return "RDNA 2";
   if(/RX 7[0-9]{3}/.test(name))return "RDNA 3";
   if(/RX 9[0-9]{3}/.test(name))return "RDNA 4";
  }
  if(name.startsWith("Intel Arc"))return /Arc B/.test(name)?"Xe2 (Battlemage)":"Xe HPG (Alchemist)";
  return "Arkitektur ikke registreret";
 };
 const boardChipset=name=>{
  const matches=name.match(/(?:\b|^)(A620|B450|B550|X570|B650|X670E|X670|X870|Z390|B560|B660|B760|Z790|Z890)(?:\b|(?=[A-Z-]))/i);
  return matches?matches[1].toUpperCase():"Chipset ikke identificeret";
 };
 const evidenceLabel=level=>level==="model"?"Producentens modelside":"Producentens serie-/katalogreference – nøjagtige tal skal efterkontrolleres";
 for(const cpu of db.cpus){
  cpu.category="Processor";
  cpu.architecture=cpu.name.startsWith("AMD")?amdArchitecture(cpu.name):intelArchitecture(cpu.name);
  const [cores,threads]=String(cpu.cores).split("/");
  cpu.coresCount=Number(cores);cpu.threadsCount=Number(threads);
  cpu.summary="Desktop-processor med "+cores+" kerner og "+threads+" tråde. "+cpu.architecture+
   ". "+cpu.socket+"-platform; "+cpu.memory.join(" / ")+".";
  cpu.specs=[
   ["Kerner",cores],["Tråde",threads],["Arkitektur / generation",cpu.architecture],
   ["Sokkel",cpu.socket],["RAM-generation",cpu.memory.join(" / ")],
   ["Oplyst TDP / processor base power",cpu.power+" W (ikke målt maks.-forbrug)"],
   ["Lancering",String(cpu.year)]
  ];
  if(cpu.provenance!=="model"){
   cpu.source=cpu.name.startsWith("AMD")?sourcePages.amdSpec:sourcePages.intelSpec;
   cpu.sourceLabel=evidenceLabel("catalogue");
  }
  if(cpu.name==="Intel Core i5-12500"){
   cpu.specs.push(["Maksimal turbo-frekvens","4,60 GHz"]);
   cpu.specs.push(["L3-cache","18 MB Intel Smart Cache"]);
   cpu.specs.push(["Maksimal turboeffekt","117 W"]);
   cpu.specs.push(["Integreret grafik","Intel UHD Graphics 770"]);
   cpu.specs.push(["Hukommelseshastigheder","DDR4-3200 / DDR5-4800 MT/s (officielt)"]);
   cpu.summary+=" Intel ARK oplyser 4,60 GHz max turbo, 18 MB cache og UHD Graphics 770.";
  }
  cpu.evidenceLabel=evidenceLabel(cpu.provenance);
  cpu.use="En CPU udfører programkode og styrer spillets logik, beregninger og baggrundsprocesser. Opgraderingsværdien afhænger af konkret belastning, ikke kun antal kerner.";
 }
 for(const gpu of db.gpus){
  gpu.category="Grafikkort";gpu.architecture=gpuArchitecture(gpu.name);
  gpu.summary="Grafikkort med "+gpu.vram+" GB videohukommelse og "+gpu.architecture+
   "-arkitektur. Det håndterer grafikken i spil, 3D og understøttede kreative programmer.";
  gpu.specs=[
   ["Grafikarkitektur",gpu.architecture],
   ["Videohukommelse (VRAM)",gpu.vram+" GB"],
   ["Oplyst typisk kortforbrug",gpu.power+" W (referenceværdi, kan variere)"],
   ["Lancering",String(gpu.year)]
  ];
  if(gpu.provenance!=="model"){
   gpu.source=gpu.name.startsWith("NVIDIA")?sourcePages.nvCompare:gpu.name.startsWith("AMD")?sourcePages.amdRadeon:sourcePages.intelArc;
   gpu.sourceLabel=evidenceLabel("catalogue");
  }
  gpu.evidenceLabel=evidenceLabel(gpu.provenance);
  gpu.use="Grafikkortet styrer billedrendering, 3D og hardwareaccelereret grafik. Spillets FPS afhænger af GPU, CPU, opløsning, temperaturer, drivere og indstillinger.";
 }
 for(const board of db.boards){
  board.category="Bundkort";board.chipset=boardChipset(board.name);
  board.provenance="catalogue";board.evidenceLabel=evidenceLabel("catalogue");
  board.summary="Bundkort i "+board.form+"-format med "+board.socket+
   "-sokkel, "+board.memory+"-slots og "+board.chipset+"-chipset.";
  board.specs=[
   ["Chipset",board.chipset],["CPU-sokkel",board.socket],
   ["RAM-generation",board.memory],["Formfaktor",board.form]
  ];
  board.use="Bundkortet forbinder processor, RAM, grafikkort og lager. BIOS, CPU-support, PCIe-porte og præcise slots skal kontrolleres i den konkrete models manual.";
 }
 for(const psu of db.psus){
  psu.category="Strømforsyningsklasse";psu.provenance="user";
  psu.summary="Oplyst PSU-mærkeeffekt på "+psu.watt+" W. Det er ikke en konkret produktmodel.";
  psu.specs=[["Mærkeeffekt",psu.watt+" W"],["Producent / model","Ikke angivet"],["Effektivitet / stik / 12 V","Ikke kontrolleret"]];
  psu.use="En strømforsyning leverer strøm til PC'en. Belastning, korrekte stik, kvalitet, reservekapacitet og alder skal vurderes særskilt.";
  psu.evidenceLabel="Brugeroplyst effektklasse – ingen modeldokumentation";
 }
 for(const c of db.cases){
  c.category="Kabinetklasse";c.provenance="user";
  c.summary=c.forms?"Generisk kabinetklasse der normalt kan rumme "+c.forms.join(", ")+".":"Fysiske mål og understøttede formater er ukendte.";
  c.specs=[["Kabinetklasse",c.name],["Typiske bundkortformater",c.forms?c.forms.join(", "):"Ukendt"],["GPU-længde og kølerhøjde","Kræver kabinetmodel"]];
  c.use="Kabinetter har forskellige pladsforhold, luftgennemstrømning og kølingsmuligheder. Kabinetklassen garanterer ikke fysisk plads til dele.";
  c.evidenceLabel="Generisk formfaktor – ikke en producentmodel";
 }
 // Intel explicitly documents that LGA1151 6th/7th generation CPUs cannot
 // run on 300-series chipsets (8th/9th generation), despite the same socket.
 const exactCompatibility=(cpu,board)=>{
  if(!cpu||!board)return {kind:"unknown"};
  if(cpu.socket!==board.socket)return {kind:"blocked",reason:"CPU og bundkort har forskellige sokler."};
  // AMD's official AM4 chipset matrix excludes desktop Ryzen 1000/2000 from B550.
  // X570 excludes Ryzen 1000, but includes many Ryzen 2000 models.
  if(cpu.socket==="AM4" && cpu.name.startsWith("AMD Ryzen")){
   const model=cpu.name.match(/Ryzen \d (\d{4})/);
   const series=model?Number(model[1][0]):0;
   if(board.chipset==="B550" && (series===1||series===2))
    return {kind:"blocked",reason:"AMD B550 understøtter ikke Ryzen 1000/2000 desktop-serierne ifølge AMD's chipsetoversigt.",
      source:"https://www.amd.com/en/products/processors/chipsets/am4.html"};
   if(board.chipset==="X570" && series===1)
    return {kind:"blocked",reason:"AMD X570 understøtter ikke Ryzen 1000 desktop-serien ifølge AMD's chipsetoversigt.",
      source:"https://www.amd.com/en/products/processors/chipsets/am4.html"};
  }
  if(cpu.socket==="LGA1151"&&board.chipset==="Z390"&&/Intel Core i[3579]-7\d{3}/.test(cpu.name))
   return {kind:"blocked",reason:"Intel 7. generation fungerer ikke med Intel 300-serie chipset, selvom soklen hedder LGA1151.",
     source:"https://www.intel.com/content/www/us/en/support/articles/000025694.html"};
  return {kind:"socket",reason:"Soklen matcher, men BIOS-version og præcis CPU-support er ikke verificeret."};
 };
 window.GEETECH_SPEC_META={sourcePages,exactCompatibility};
})();
