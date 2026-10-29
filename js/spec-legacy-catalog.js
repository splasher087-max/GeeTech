"use strict";
/* Extended historical desktop catalogue – approximately 2018–2025.
 * Values are reference-class, not verified for each OEM/prebuilt variant.
 * Source points to vendor's product search/catalogue, not individual SKU.
 * Older generations and APU suffixes matter for identifying real client PCs.
 */
(() => {
 const db=window.GEETECH_DB;if(!db)return;
 const intel="https://www.intel.com/content/www/us/en/products/overview.html";
 const amd="https://www.amd.com/en/products/specifications/processors.html";
 const ng="https://www.nvidia.com/en-us/geforce/graphics-cards/compare/";
 const ag="https://www.amd.com/en/products/specifications/graphics.html";
 const ig="https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html";
 const boardSources={ASUS:"https://www.asus.com/motherboards-components/motherboards/all-series/",MSI:"https://www.msi.com/Motherboards",Gigabyte:"https://www.gigabyte.com/Motherboard",ASRock:"https://www.asrock.com/mb/index.asp"};
 const cpus=[
 // AMD: entry-level APUs, popular gaming CPUs, high core-count models.
 "AMD Ryzen 3 2200G|2018|AM4|DDR4|4/4|1|65",
 "AMD Ryzen 5 2400G|2018|AM4|DDR4|4/8|2|65",
 "AMD Ryzen 3 3200G|2019|AM4|DDR4|4/4|2|65",
 "AMD Ryzen 5 3400G|2019|AM4|DDR4|4/8|2|65",
 "AMD Ryzen 3 3100|2020|AM4|DDR4|4/8|2|65",
 "AMD Ryzen 3 3300X|2020|AM4|DDR4|4/8|3|65",
 "AMD Ryzen 5 2600X|2018|AM4|DDR4|6/12|2|95",
 "AMD Ryzen 5 3600X|2019|AM4|DDR4|6/12|3|95",
 "AMD Ryzen 5 4500|2022|AM4|DDR4|6/12|2|65",
 "AMD Ryzen 5 4600G|2020|AM4|DDR4|6/12|3|65",
 "AMD Ryzen 5 5500|2022|AM4|DDR4|6/12|3|65",
 "AMD Ryzen 5 5600G|2021|AM4|DDR4|6/12|3|65",
 "AMD Ryzen 5 5600GT|2024|AM4|DDR4|6/12|3|65",
 "AMD Ryzen 5 5600X3D|2023|AM4|DDR4|6/12|4|105",
 "AMD Ryzen 7 2700|2018|AM4|DDR4|8/16|2|65",
 "AMD Ryzen 7 3800X|2019|AM4|DDR4|8/16|3|105",
 "AMD Ryzen 7 4700G|2020|AM4|DDR4|8/16|3|65",
 "AMD Ryzen 7 5700G|2021|AM4|DDR4|8/16|4|65",
 "AMD Ryzen 7 5700X3D|2024|AM4|DDR4|8/16|5|105",
 "AMD Ryzen 9 3950X|2019|AM4|DDR4|16/32|4|105",
 "AMD Ryzen 9 5950X|2020|AM4|DDR4|16/32|5|105",
 "AMD Ryzen 5 8500G|2024|AM5|DDR5|6/12|4|65",
 "AMD Ryzen 5 8600G|2024|AM5|DDR5|6/12|4|65",
 "AMD Ryzen 7 8700G|2024|AM5|DDR5|8/16|5|65",
 "AMD Ryzen 7 7700F|2023|AM5|DDR5|8/16|5|65",
 "AMD Ryzen 7 9700F|2025|AM5|DDR5|8/16|5|65",
 "AMD Ryzen 9 7900X|2022|AM5|DDR5|12/24|5|170",
 "AMD Ryzen 9 7950X3D|2023|AM5|DDR5|16/32|6|120",
 "AMD Ryzen 9 9900X3D|2025|AM5|DDR5|12/24|6|120",
 "AMD Ryzen 9 9950X3D|2025|AM5|DDR5|16/32|7|170",
 // Intel desktop mainstream and common prebuilt variants.
 "Intel Core i3-8100|2017|LGA1151|DDR4|4/4|1|65",
 "Intel Core i3-9100F|2019|LGA1151|DDR4|4/4|1|65",
 "Intel Core i5-8500|2018|LGA1151|DDR4|6/6|2|65",
 "Intel Core i5-8600K|2017|LGA1151|DDR4|6/6|2|95",
 "Intel Core i5-9500|2019|LGA1151|DDR4|6/6|2|65",
 "Intel Core i5-9600K|2018|LGA1151|DDR4|6/6|3|95",
 "Intel Core i3-10100F|2020|LGA1200|DDR4|4/8|2|65",
 "Intel Core i3-10105F|2021|LGA1200|DDR4|4/8|2|65",
 "Intel Core i5-10400|2020|LGA1200|DDR4|6/12|3|65",
 "Intel Core i5-10600K|2020|LGA1200|DDR4|6/12|3|125",
 "Intel Core i7-10700|2020|LGA1200|DDR4|8/16|4|65",
 "Intel Core i9-10900K|2020|LGA1200|DDR4|10/20|4|125",
 "Intel Core i3-11100|2021|LGA1200|DDR4|4/8|2|65",
 "Intel Core i5-11400|2021|LGA1200|DDR4|6/12|3|65",
 "Intel Core i5-11600K|2021|LGA1200|DDR4|6/12|4|125",
 "Intel Core i7-11700|2021|LGA1200|DDR4|8/16|4|65",
 "Intel Core i9-11900K|2021|LGA1200|DDR4|8/16|4|125",
 "Intel Core i3-12100|2022|LGA1700|DDR4/DDR5|4/8|3|60",
 "Intel Core i5-12400F|2022|LGA1700|DDR4/DDR5|6/12|4|65",
 "Intel Core i5-12600|2022|LGA1700|DDR4/DDR5|6/12|4|65",
 "Intel Core i5-12600KF|2021|LGA1700|DDR4/DDR5|10/16|5|125",
 "Intel Core i7-12700|2022|LGA1700|DDR4/DDR5|12/20|5|65",
 "Intel Core i7-12700F|2022|LGA1700|DDR4/DDR5|12/20|5|65",
 "Intel Core i7-12700KF|2021|LGA1700|DDR4/DDR5|12/20|5|125",
 "Intel Core i9-12900|2022|LGA1700|DDR4/DDR5|16/24|5|65",
 "Intel Core i3-13100F|2023|LGA1700|DDR4/DDR5|4/8|3|58",
 "Intel Core i5-13400|2023|LGA1700|DDR4/DDR5|10/16|4|65",
 "Intel Core i5-13500|2023|LGA1700|DDR4/DDR5|14/20|5|65",
 "Intel Core i5-13600KF|2022|LGA1700|DDR4/DDR5|14/20|5|125",
 "Intel Core i7-13700|2023|LGA1700|DDR4/DDR5|16/24|5|65",
 "Intel Core i7-13700F|2023|LGA1700|DDR4/DDR5|16/24|5|65",
 "Intel Core i7-13700KF|2022|LGA1700|DDR4/DDR5|16/24|6|125",
 "Intel Core i9-13900KF|2022|LGA1700|DDR4/DDR5|24/32|6|125",
 "Intel Core i3-14100|2024|LGA1700|DDR4/DDR5|4/8|3|60",
 "Intel Core i3-14100F|2024|LGA1700|DDR4/DDR5|4/8|3|58",
 "Intel Core i5-14400|2024|LGA1700|DDR4/DDR5|10/16|4|65",
 "Intel Core i5-14500|2024|LGA1700|DDR4/DDR5|14/20|5|65",
 "Intel Core i5-14600KF|2023|LGA1700|DDR4/DDR5|14/20|5|125",
 "Intel Core i7-14700|2024|LGA1700|DDR4/DDR5|20/28|6|65",
 "Intel Core i7-14700F|2024|LGA1700|DDR4/DDR5|20/28|6|65",
 "Intel Core i7-14700KF|2023|LGA1700|DDR4/DDR5|20/28|6|125",
 "Intel Core i9-14900KF|2023|LGA1700|DDR4/DDR5|24/32|6|125",
 "Intel Core Ultra 5 225F|2025|LGA1851|DDR5|10/10|4|65",
 "Intel Core Ultra 5 235|2025|LGA1851|DDR5|14/14|5|65",
 "Intel Core Ultra 5 245KF|2024|LGA1851|DDR5|14/14|5|125",
 "Intel Core Ultra 7 265|2025|LGA1851|DDR5|20/20|5|65",
 "Intel Core Ultra 7 265KF|2024|LGA1851|DDR5|20/20|6|125"
 ];
 const gpus=[
 "NVIDIA GeForce GTX 1050 2GB|2016|2|1|75",
 "NVIDIA GeForce GTX 1060 3GB|2016|3|1|120",
 "NVIDIA GeForce GTX 1070 Ti|2017|8|3|180",
 "NVIDIA GeForce GTX 1080|2016|8|3|180",
 "NVIDIA GeForce GTX 1650 SUPER|2019|4|2|100",
 "NVIDIA GeForce GTX 1660|2019|6|2|120",
 "NVIDIA GeForce GTX 1660 Ti|2019|6|2|120",
 "NVIDIA GeForce RTX 2070|2018|8|3|175",
 "NVIDIA GeForce RTX 2080|2018|8|4|215",
 "NVIDIA GeForce RTX 2080 SUPER|2019|8|4|250",
 "NVIDIA GeForce RTX 3050 6GB|2024|6|2|70",
 "NVIDIA GeForce RTX 3080 12GB|2022|12|5|350",
 "NVIDIA GeForce RTX 3080 Ti|2021|12|5|350",
 "NVIDIA GeForce RTX 3090 Ti|2022|24|6|450",
 "NVIDIA GeForce RTX 4060 Ti 16GB|2023|16|4|165",
 "NVIDIA GeForce RTX 4070 Ti|2023|12|5|285",
 "NVIDIA GeForce RTX 4080|2022|16|6|320",
 "NVIDIA GeForce RTX 5050|2025|8|3|130",
 "AMD Radeon RX 560 4GB|2017|4|1|80",
 "AMD Radeon RX 590|2018|8|2|225",
 "AMD Radeon RX 5500 XT 4GB|2019|4|2|130",
 "AMD Radeon RX 5700|2019|8|3|180",
 "AMD Radeon RX 6400|2022|4|1|53",
 "AMD Radeon RX 6700 10GB|2022|10|4|175",
 "AMD Radeon RX 7600 XT|2024|16|4|190",
 "AMD Radeon RX 9060 XT 8GB|2025|8|5|150",
 "Intel Arc A310|2022|4|1|75"
 ];
 const boardRows=[
 "ASUS PRIME B450-PLUS|AM4|DDR4|ATX|ASUS",
 "ASUS TUF B450-PLUS GAMING|AM4|DDR4|ATX|ASUS",
 "MSI B450M PRO-VDH MAX|AM4|DDR4|mATX|MSI",
 "MSI B550M PRO-VDH WIFI|AM4|DDR4|mATX|MSI",
 "ASUS PRIME B550-PLUS|AM4|DDR4|ATX|ASUS",
 "ASRock B550M Pro4|AM4|DDR4|mATX|ASRock",
 "Gigabyte B550 AORUS ELITE V2|AM4|DDR4|ATX|Gigabyte",
 "ASUS TUF GAMING X570-PLUS WIFI|AM4|DDR4|ATX|ASUS",
 "Gigabyte B650M DS3H|AM5|DDR5|mATX|Gigabyte",
 "ASUS PRIME B650-PLUS|AM5|DDR5|ATX|ASUS",
 "MSI PRO B650-S WIFI|AM5|DDR5|ATX|MSI",
 "ASRock B650M Pro RS|AM5|DDR5|mATX|ASRock",
 "MSI B850 GAMING PLUS WIFI|AM5|DDR5|ATX|MSI",
 "ASUS TUF GAMING B850-PLUS WIFI|AM5|DDR5|ATX|ASUS",
 "ASUS PRIME B360M-A|LGA1151|DDR4|mATX|ASUS",
 "MSI B360M PRO-VDH|LGA1151|DDR4|mATX|MSI",
 "MSI Z390-A PRO|LGA1151|DDR4|ATX|MSI",
 "ASUS PRIME H410M-K|LGA1200|DDR4|mATX|ASUS",
 "MSI B460M PRO-VDH WIFI|LGA1200|DDR4|mATX|MSI",
 "Gigabyte B560M DS3H|LGA1200|DDR4|mATX|Gigabyte",
 "MSI PRO H610M-G DDR4|LGA1700|DDR4|mATX|MSI",
 "ASUS PRIME B660M-A D4|LGA1700|DDR4|mATX|ASUS",
 "Gigabyte B760M DS3H DDR4|LGA1700|DDR4|mATX|Gigabyte",
 "MSI PRO B760M-A WIFI DDR4|LGA1700|DDR4|mATX|MSI",
 "MSI PRO B760M-A WIFI DDR5|LGA1700|DDR5|mATX|MSI",
 "ASUS TUF GAMING B760-PLUS WIFI D4|LGA1700|DDR4|ATX|ASUS",
 "ASUS PRIME Z690-P D4|LGA1700|DDR4|ATX|ASUS",
 "Gigabyte Z690 AORUS ELITE AX DDR4|LGA1700|DDR4|ATX|Gigabyte",
 "ASUS PRIME Z790-P WIFI|LGA1700|DDR5|ATX|ASUS",
 "MSI Z790 GAMING PLUS WIFI|LGA1700|DDR5|ATX|MSI",
 "Gigabyte Z790 AORUS ELITE AX|LGA1700|DDR5|ATX|Gigabyte",
 "ASRock Z790 Pro RS|LGA1700|DDR5|ATX|ASRock",
 "ASUS ROG STRIX Z890-F GAMING WIFI|LGA1851|DDR5|ATX|ASUS",
 "MSI PRO Z890-A WIFI|LGA1851|DDR5|ATX|MSI"
 ];
 const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,"-");
 for(const row of cpus){
  const [name,yr,socket,mem,core,tier,power]=row.split("|");
  if(db.cpus.some(x=>x.name===name))continue;
  db.cpus.push({id:"cpu-"+slug(name),name,year:+yr,socket,memory:mem.split("/"),cores:core,tier:+tier,power:+power,source:name.startsWith("AMD")?amd:intel,sourceLabel:"Producentens CPU-specifikationskatalog; dobbelttjek model",provenance:"catalogue"});
 }
 for(const row of gpus){
  const [name,yr,vram,tier,power]=row.split("|");
  if(db.gpus.some(x=>x.name===name))continue;
  db.gpus.push({id:"gpu-"+slug(name),name,year:+yr,vram:+vram,tier:+tier,power:+power,source:name.startsWith("NVIDIA")?ng:name.startsWith("AMD")?ag:ig,sourceLabel:"Producentens GPU-specifikationskatalog; dobbelttjek model",provenance:"catalogue"});
 }
 for(const row of boardRows){
  const [name,socket,memory,form,brand]=row.split("|");
  if(db.boards.some(x=>x.name===name))continue;
  db.boards.push({id:"board-"+slug(name),name,socket,memory,form,source:boardSources[brand],sourceLabel:"Producentens bundkortkatalog; kontrollér nøjagtig model og BIOS",provenance:"catalogue"});
 }
 window.GEETECH_EXTENDED_CATALOG={note:"2018–2025 plus udvalgte ældre modeller. Ikke en komplet liste over alle verdens SKU'er."};
})();
