"use strict";
/* Verified additional concrete parts. Only exact documented SKU/series variants
   are shown; missing constraints (BIOS/QVL, GPU partner-card length, cable layout)
   remain unknown. Each part includes its primary manufacturer reference. */
window.GEETECH_EXTRAS=(()=>{
 const ramKits=[
  {id:"ram-kf432beast32",name:"Kingston FURY Beast 32GB DDR4-3200 CL16 (KF432C16BBK2/32)",type:"DDR4",gb:32,speed:3200,latency:"CL16-20-20",sticks:2,voltage:"1,35 V",source:"https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F32"},
  {id:"ram-kf432renegade32",name:"Kingston FURY Renegade 32GB DDR4-3200 CL16 (KF432C16RB12K2/32)",type:"DDR4",gb:32,speed:3200,latency:"CL16-18-18",sticks:2,voltage:"1,35 V",source:"https://www.kingston.com/en/memory/search?partid=KF432C16RB12K2%2F32"},
  {id:"ram-kf560beast32",name:"Kingston FURY Beast 32GB DDR5-6000 CL36 (KF560C36BBE2K2-32)",type:"DDR5",gb:32,speed:6000,latency:"CL36-44-44",sticks:2,voltage:"1,35 V",source:"https://www.kingston.com/datasheets/KF560C36BBE2K2-32.pdf"},
  {id:"ram-kf560beast-old",name:"Kingston FURY Beast 32GB DDR5-6000 CL36 (KF560C36BBEK2-32, ældre variant)",type:"DDR5",gb:32,speed:6000,latency:"CL36-38-38",sticks:2,voltage:"1,35 V",source:"https://www.kingston.com/datasheets/KF560C36BBEK2-32.pdf"}
 ];
 for(const p of ramKits){
  p.summary=p.gb+" GB fordelt på "+p.sticks+" moduler, "+p.type+"-"+p.speed+" og "+p.latency+". Kræver bundkort med tilsvarende DIMM-generation; den oplyste hastighed kræver passende profil/understøttelse.";
  p.specs=[["SKU",p.name.match(/\(([^()]+)\)/)?.[1]||"Se model"],["RAM-generation",p.type],["Kapacitet",p.gb+" GB"],["Moduler",p.sticks+" stk."],["Profilhastighed",p.speed+" MT/s"],["Profil-latens",p.latency],["Profilspænding",p.voltage]];
  p.evidenceLabel="Præcis Kingston-producentmodel";p.use="Hurtig RAM er ikke garanteret ved XMP/EXPO på alle CPU-/bundkortkombinationer. Find QVL og kontroller antal DIMM-slots.";
 }
 const drives=[
  {id:"ssd-samsung-990pro-2tb",name:"Samsung 990 PRO 2TB MZ-V9P2T0BW",type:"nvme",gb:2000,form:"M.2 2280",interface:"PCIe 4.0 x4 / NVMe",read:7450,write:6900,source:"https://www.samsung.com/dk/memory-storage/nvme-ssd/990-pro-2tb-nvme-pcie-gen-4-mz-v9p2t0bw/"},
  {id:"ssd-crucial-p3plus-2tb",name:"Crucial P3 Plus 2TB CT2000P3PSSD8",type:"nvme",gb:2000,form:"M.2 2280",interface:"PCIe 4.0 x4 / NVMe",read:5000,write:4200,source:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf"},
  {id:"ssd-crucial-p3plus-1tb",name:"Crucial P3 Plus 1TB CT1000P3PSSD8",type:"nvme",gb:1000,form:"M.2 2280",interface:"PCIe 4.0 x4 / NVMe",read:5000,write:3600,source:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf"}
 ];
 for(const p of drives){
  p.summary=p.gb/1000+" TB NVMe SSD i "+p.form+"-format. Producentens oplyste maksimale sekventielle hastigheder: "+p.read+"/"+p.write+" MB/s (læs/skriv).";
  p.specs=[["Kapacitet",p.gb+" GB"],["Interface",p.interface],["Formfaktor",p.form],["Maks. sekventiel læsning",p.read+" MB/s"],["Maks. sekventiel skrivning",p.write+" MB/s"]];
  p.evidenceLabel="Præcist producent-SKU";p.use="Maksimale sekventielle hastigheder er laboratorietal, ikke garanteret hastighed i ethvert system. Bundkortets M.2-slot og PCIe-version skal kontrolleres.";
 }
 const psuModels=[
  {id:"psu-corsair-rm750e-eu",name:"Corsair RM750e ATX 3.1 750W (CP-9020262-EU)",watt:750,form:"ATX",modular:"Fuldt modulær",standard:"ATX 3.1 / PCIe 5.1",source:"https://www.corsair.com/ww/en/p/psu/cp-9020262-eu/rme-series-rm750e-fully-modular-low-noise-atx-power-supply-cp-9020262-eu"}
 ];
 for(const p of psuModels){
  p.summary=p.watt+" W strømforsyning i "+p.form+"-format, "+p.modular+", "+p.standard+".";
  p.specs=[["Effekt",p.watt+" W"],["Formfaktor",p.form],["Kabelsystem",p.modular],["Standard",p.standard],["Certificering","80 PLUS Gold"],["12V-2x6-kabel","Inkluderet (se fabrikantens SKU-side)"]];
  p.evidenceLabel="Præcis producentmodel";p.use="Kabelantal, stik, længde og elektriske forhold skal sammenholdes med grafikkort og øvrige dele. Bland ikke modulære kabler mellem PSU-modeller.";
 }
 const caseModels=[
  {id:"case-corsair-4000d",name:"Corsair 4000D AIRFLOW (CC-9011200-WW)",form:"ATX",forms:["ATX","mATX","ITX"],gpuMm:360,coolerMm:170,psuMm:220,source:"https://www.corsair.com/eu/en/p/pc-cases/cc-9011200-ww/4000d-airflow-tempered-glass-mid-tower-atx-case-black-cc-9011200-ww"},
  {id:"case-fractal-north",name:"Fractal Design North (original ATX-model)",form:"ATX",forms:["ATX","mATX","ITX"],gpuMm:355,coolerMm:170,psuMm:null,source:"https://www.fractal-design.com/news/introducing-north/"}
 ];
 for(const p of caseModels){
  p.summary=p.name+": understøtter typisk "+p.forms.join(", ")+"-bundkort. Oplyst maksimal GPU-længde "+p.gpuMm+" mm; frontmonteret radiator kan reducere fri plads.";
  p.specs=[["Bundkortformater",p.forms.join(", ")],["Maks. GPU-længde",p.gpuMm+" mm"],["Maks. CPU-kølerhøjde",p.coolerMm+" mm"],["PSU-længde",p.psuMm?p.psuMm+" mm":"Se kabinetmanual"],["Radiator / indretning","Kontrollér den præcise konfiguration"]];
  p.evidenceLabel="Producentens model-/serieinformation";p.use="Fysiske komponentmål, kabelføring og radiator-/blæserplacering kan påvirke, hvad der faktisk passer.";
 }
 return {ramKits,drives,psuModels,caseModels};
})();
