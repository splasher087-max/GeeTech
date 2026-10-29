"use strict";
/* SPEC TJEK curated catalogue. Model metadata is indicative: a manufacturer's
   family/product resource is NOT proof of board BIOS support, measured FPS or PSU compatibility.
   Always check the precise SKU's specifications before purchasing.
   Internal tier is a *coarse heuristic* for comparing official game requirements,
   not a benchmark. */
window.GEETECH_DB = (() => {
 const sources={
  amdCPU:"https://www.amd.com/en/products/processors/desktops/ryzen.html",
  intelCPU:"https://www.intel.com/content/www/us/en/products/overview.html",
  nvidiaGPU:"https://www.nvidia.com/en-us/geforce/graphics-cards/",
  amdGPU:"https://www.amd.com/en/products/graphics/desktops.html",
  intelGPU:"https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html",
  msi:"https://www.msi.com/Motherboards",
  asus:"https://www.asus.com/motherboards-components/motherboards/all-series/",
  gigabyte:"https://www.gigabyte.com/Motherboard",
  asrock:"https://www.asrock.com/mb/index.asp"
 };
 // name|year|socket|memory|cores/threads|tier|powerW (CPU power may vary)
 const cpuGroups=[
  ["AMD Ryzen 5 1600|2017|AM4|DDR4|6/12|1|65","AMD Ryzen 5 2600|2018|AM4|DDR4|6/12|2|65","AMD Ryzen 5 3600|2019|AM4|DDR4|6/12|3|65",
   "AMD Ryzen 5 5600|2022|AM4|DDR4|6/12|4|65","AMD Ryzen 5 5600X|2020|AM4|DDR4|6/12|4|65","AMD Ryzen 7 1700|2017|AM4|DDR4|8/16|2|65",
   "AMD Ryzen 7 2700X|2018|AM4|DDR4|8/16|2|105","AMD Ryzen 7 3700X|2019|AM4|DDR4|8/16|3|65","AMD Ryzen 7 5700X|2022|AM4|DDR4|8/16|4|65",
   "AMD Ryzen 7 5800X|2020|AM4|DDR4|8/16|4|105","AMD Ryzen 7 5800X3D|2022|AM4|DDR4|8/16|5|105",
   "AMD Ryzen 9 3900X|2019|AM4|DDR4|12/24|4|105","AMD Ryzen 9 5900X|2020|AM4|DDR4|12/24|5|105",
   "AMD Ryzen 5 7500F|2023|AM5|DDR5|6/12|4|65","AMD Ryzen 5 7600|2023|AM5|DDR5|6/12|5|65","AMD Ryzen 5 7600X|2022|AM5|DDR5|6/12|5|105",
   "AMD Ryzen 7 7700|2023|AM5|DDR5|8/16|5|65","AMD Ryzen 7 7700X|2022|AM5|DDR5|8/16|5|105","AMD Ryzen 7 7800X3D|2023|AM5|DDR5|8/16|6|120",
   "AMD Ryzen 9 7900|2023|AM5|DDR5|12/24|5|65","AMD Ryzen 9 7950X|2022|AM5|DDR5|16/32|6|170",
   "AMD Ryzen 5 9600X|2024|AM5|DDR5|6/12|5|65","AMD Ryzen 7 9700X|2024|AM5|DDR5|8/16|6|65",
   "AMD Ryzen 7 9800X3D|2024|AM5|DDR5|8/16|7|120","AMD Ryzen 9 9900X|2024|AM5|DDR5|12/24|6|120",
   "AMD Ryzen 9 9950X|2024|AM5|DDR5|16/32|7|170"],
  ["Intel Core i7-7700K|2017|LGA1151|DDR4|4/8|2|91","Intel Core i5-8400|2017|LGA1151|DDR4|6/6|2|65",
   "Intel Core i7-8700K|2017|LGA1151|DDR4|6/12|3|95","Intel Core i5-9400F|2019|LGA1151|DDR4|6/6|2|65",
   "Intel Core i7-9700K|2018|LGA1151|DDR4|8/8|3|95","Intel Core i9-9900K|2018|LGA1151|DDR4|8/16|4|95",
   "Intel Core i5-10400F|2020|LGA1200|DDR4|6/12|3|65","Intel Core i7-10700K|2020|LGA1200|DDR4|8/16|4|125",
   "Intel Core i5-11400F|2021|LGA1200|DDR4|6/12|3|65","Intel Core i7-11700K|2021|LGA1200|DDR4|8/16|4|125",
   "Intel Core i3-12100F|2022|LGA1700|DDR4/DDR5|4/8|3|58",
   "Intel Core i5-12400|2022|LGA1700|DDR4/DDR5|6/12|4|65",
   "Intel Core i5-12500|2022|LGA1700|DDR4/DDR5|6/12|4|65",
   "Intel Core i5-12600K|2021|LGA1700|DDR4/DDR5|10/16|5|125",
   "Intel Core i7-12700K|2021|LGA1700|DDR4/DDR5|12/20|5|125",
   "Intel Core i9-12900K|2021|LGA1700|DDR4/DDR5|16/24|5|125",
   "Intel Core i5-13400F|2023|LGA1700|DDR4/DDR5|10/16|4|65",
   "Intel Core i5-13600K|2022|LGA1700|DDR4/DDR5|14/20|5|125",
   "Intel Core i7-13700K|2022|LGA1700|DDR4/DDR5|16/24|6|125",
   "Intel Core i9-13900K|2022|LGA1700|DDR4/DDR5|24/32|6|125",
   "Intel Core i5-14400F|2024|LGA1700|DDR4/DDR5|10/16|4|65",
   "Intel Core i5-14600K|2023|LGA1700|DDR4/DDR5|14/20|5|125",
   "Intel Core i7-14700K|2023|LGA1700|DDR4/DDR5|20/28|6|125",
   "Intel Core i9-14900K|2023|LGA1700|DDR4/DDR5|24/32|6|125",
   "Intel Core Ultra 5 245K|2024|LGA1851|DDR5|14/14|5|125",
   "Intel Core Ultra 7 265K|2024|LGA1851|DDR5|20/20|6|125",
   "Intel Core Ultra 9 285K|2024|LGA1851|DDR5|24/24|6|125"]
 ];
 const cpus=cpuGroups.flatMap((g,idx)=>g.map(str=>{const p=str.split("|");return {id:"cpu-"+p[0].toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:p[0],year:+p[1],socket:p[2],memory:p[3].split("/"),cores:p[4],tier:+p[5],power:+p[6],source:idx===0?sources.amdCPU:sources.intelCPU,sourceLabel:"Producentens CPU-katalog – kontrollér præcis model",provenance:"catalogue"};}));
 // name|year|VRAM GB|approx required graphics tier|nominal board power W (varies by model)
 const gpuGroups=[
  ["NVIDIA GeForce GTX 1050 Ti|2016|4|1|75","NVIDIA GeForce GTX 1060 6GB|2016|6|2|120",
   "NVIDIA GeForce GTX 1070|2016|8|2|150","NVIDIA GeForce GTX 1080 Ti|2017|11|3|250",
   "NVIDIA GeForce GTX 1650|2019|4|1|75","NVIDIA GeForce GTX 1660 SUPER|2019|6|2|125",
   "NVIDIA GeForce RTX 2060|2019|6|3|160","NVIDIA GeForce RTX 2060 SUPER|2019|8|3|175",
   "NVIDIA GeForce RTX 2070 SUPER|2019|8|4|215","NVIDIA GeForce RTX 2080 Ti|2018|11|4|250",
   "NVIDIA GeForce RTX 3050 8GB|2022|8|2|130","NVIDIA GeForce RTX 3060 12GB|2021|12|3|170",
   "NVIDIA GeForce RTX 3060 Ti|2020|8|4|200","NVIDIA GeForce RTX 3070|2020|8|4|220",
   "NVIDIA GeForce RTX 3070 Ti|2021|8|4|290","NVIDIA GeForce RTX 3080 10GB|2020|10|5|320",
   "NVIDIA GeForce RTX 3090|2020|24|5|350",
   "NVIDIA GeForce RTX 4060|2023|8|3|115","NVIDIA GeForce RTX 4060 Ti 8GB|2023|8|4|160",
   "NVIDIA GeForce RTX 4070|2023|12|5|200","NVIDIA GeForce RTX 4070 SUPER|2024|12|5|220",
   "NVIDIA GeForce RTX 4070 Ti SUPER|2024|16|6|285","NVIDIA GeForce RTX 4080 SUPER|2024|16|6|320",
   "NVIDIA GeForce RTX 4090|2022|24|7|450",
   "NVIDIA GeForce RTX 5060|2025|8|4|145","NVIDIA GeForce RTX 5060 Ti 16GB|2025|16|5|180",
   "NVIDIA GeForce RTX 5070|2025|12|5|250","NVIDIA GeForce RTX 5070 Ti|2025|16|6|300",
   "NVIDIA GeForce RTX 5080|2025|16|7|360","NVIDIA GeForce RTX 5090|2025|32|8|575"],
  ["AMD Radeon RX 570 4GB|2017|4|1|150","AMD Radeon RX 580 8GB|2017|8|2|185",
   "AMD Radeon RX 5500 XT 8GB|2019|8|2|130","AMD Radeon RX 5600 XT|2020|6|3|150",
   "AMD Radeon RX 5700 XT|2019|8|4|225","AMD Radeon RX 6500 XT|2022|4|2|107",
   "AMD Radeon RX 6600|2021|8|3|132","AMD Radeon RX 6600 XT|2021|8|4|160",
   "AMD Radeon RX 6650 XT|2022|8|4|180","AMD Radeon RX 6700 XT|2021|12|4|230",
   "AMD Radeon RX 6750 XT|2022|12|4|250","AMD Radeon RX 6800|2020|16|5|250",
   "AMD Radeon RX 6800 XT|2020|16|5|300","AMD Radeon RX 6900 XT|2020|16|5|300",
   "AMD Radeon RX 7600|2023|8|3|165","AMD Radeon RX 7700 XT|2023|12|5|245",
   "AMD Radeon RX 7800 XT|2023|16|5|263","AMD Radeon RX 7900 GRE|2024|16|5|260",
   "AMD Radeon RX 7900 XT|2022|20|6|315","AMD Radeon RX 7900 XTX|2022|24|7|355",
   "AMD Radeon RX 9060 XT 16GB|2025|16|5|160","AMD Radeon RX 9070|2025|16|6|220",
   "AMD Radeon RX 9070 XT|2025|16|7|304"],
  ["Intel Arc A380|2022|6|2|75","Intel Arc A580|2023|8|3|185",
   "Intel Arc A750|2022|8|3|225","Intel Arc A770 16GB|2022|16|4|225",
   "Intel Arc B570|2025|10|3|150","Intel Arc B580|2024|12|4|190"]
 ];
 const gpus=gpuGroups.flatMap((g,i)=>g.map(str=>{const p=str.split("|");return{id:"gpu-"+p[0].toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:p[0],year:+p[1],vram:+p[2],tier:+p[3],power:+p[4],source:[sources.nvidiaGPU,sources.amdGPU,sources.intelGPU][i],sourceLabel:"Producentens grafikkort-katalog – kontrollér præcis model",provenance:"catalogue"};}));
 // board list is an illustrative set of known retail products; compatibility is
 // only checked on socket + RAM type + approximate form factor, NOT BIOS/VRM/M.2.
 const boardRows=[
  "ASUS PRIME B450M-A II|AM4|DDR4|mATX|asus","MSI B450 TOMAHAWK MAX|AM4|DDR4|ATX|msi",
  "MSI MAG B550 TOMAHAWK|AM4|DDR4|ATX|msi","ASUS ROG STRIX B550-F GAMING|AM4|DDR4|ATX|asus",
  "Gigabyte B550M DS3H|AM4|DDR4|mATX|gigabyte","MSI MPG X570 GAMING PLUS|AM4|DDR4|ATX|msi",
  "MSI PRO B650M-A WIFI|AM5|DDR5|mATX|msi","MSI MAG B650 TOMAHAWK WIFI|AM5|DDR5|ATX|msi",
  "ASUS TUF GAMING B650-PLUS WIFI|AM5|DDR5|ATX|asus",
  "Gigabyte B650 AORUS ELITE AX|AM5|DDR5|ATX|gigabyte",
  "ASUS ROG STRIX X670E-E GAMING WIFI|AM5|DDR5|ATX|asus",
  "MSI MAG X870 TOMAHAWK WIFI|AM5|DDR5|ATX|msi",
  "ASUS PRIME Z390-A|LGA1151|DDR4|ATX|asus",
  "Gigabyte Z390 AORUS PRO|LGA1151|DDR4|ATX|gigabyte",
  "MSI MAG B560 TOMAHAWK WIFI|LGA1200|DDR4|ATX|msi",
  "ASUS TUF GAMING B560M-PLUS|LGA1200|DDR4|mATX|asus",
  "MSI PRO B660M-A DDR4|LGA1700|DDR4|mATX|msi",
  "ASUS PRIME B660-PLUS D4|LGA1700|DDR4|ATX|asus",
  "MSI MAG B760 TOMAHAWK WIFI DDR4|LGA1700|DDR4|ATX|msi",
  "Gigabyte B760 GAMING X AX DDR5|LGA1700|DDR5|ATX|gigabyte",
  "MSI PRO Z790-A WIFI|LGA1700|DDR5|ATX|msi",
  "ASUS ROG STRIX Z790-A GAMING WIFI D4|LGA1700|DDR4|ATX|asus",
  "MSI MAG Z890 TOMAHAWK WIFI|LGA1851|DDR5|ATX|msi",
  "ASUS PRIME Z890-P WIFI|LGA1851|DDR5|ATX|asus"];
 const boards=boardRows.map(str=>{const p=str.split("|");return{id:"board-"+p[0].toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:p[0],socket:p[1],memory:p[2],form:p[3],source:sources[p[4]],sourceLabel:"Producentens bundkortkatalog – kontrollér model og BIOS"};});

 // Explicit model-specific references override generic family catalogue links.
 // Every other SKU remains labelled catalogue-level / indicative.
 const exact={
  "AMD Ryzen 5 5600X":"https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html",
  "Intel Core i5-12400":"https://www.intel.com/content/www/us/en/products/sku/134586/intel-core-i512400-processor-18m-cache-up-to-4-40-ghz/specifications.html",
  "Intel Core i5-12500":"https://www.intel.com/content/www/us/en/products/sku/96144/intel-core-i512500-processor-18m-cache-up-to-4-60-ghz/specifications.html",
  "NVIDIA GeForce RTX 3070":"https://www.nvidia.com/da-dk/geforce/graphics-cards/30-series/rtx-3070-3070ti/",
  "AMD Radeon RX 6700 XT":"https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6700-xt.html"
 };
 for(const model of [...cpus,...gpus]){
  if(exact[model.name]){model.source=exact[model.name];model.sourceLabel="Producentens model-/produktside";model.provenance="model";}
 }
 const cases=[
  {id:"atx",name:"ATX-kabinet (formfaktor oplyst)",forms:["ATX","mATX","ITX"]},
  {id:"matx",name:"micro-ATX-kabinet",forms:["mATX","ITX"]},
  {id:"itx",name:"Mini-ITX-kabinet",forms:["ITX"]},
  {id:"other",name:"Specialkabinet / ukendt",forms:null}
 ];
 const psus=[350,450,500,550,600,650,700,750,800,850,1000,1200].map(w=>({id:String(w),name:w+" W – oplyst mærkeeffekt",watt:w}));
 return Object.freeze({cpus,gpus,boards,cases,psus,sources,revision:"2026-10-29"});
})();
