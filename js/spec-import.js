"use strict";
(() => {
 const fileInput=document.getElementById("checker-import-file"),message=document.getElementById("checker-import-status");
 const db=window.GEETECH_DB;
 if(!fileInput||!message||!db)return;
 const get=id=>document.getElementById(id);
 const norm=value=>String(value||"").toLowerCase().replace(/\(r\)|\(tm\)|\bprocessor\b|\bcpu\b|\bgraphics\b/g,"").replace(/[^a-z0-9]/g,"");
 const match=(items,name)=>{
  const key=norm(name);
  if(key.length<5)return null;
  const exact=items.find(x=>norm(x.name)===key);
  if(exact)return exact;
  let found=items.filter(x=>key.startsWith(norm(x.name))&&norm(x.name).length>=7);
  if(found.length){
   found.sort((a,b)=>norm(b.name).length-norm(a.name).length);
   if(found.length===1||norm(found[0].name).length>norm(found[1].name).length)return found[0];
  }
  // Win32_BaseBoard often reports only the product name, e.g.
  // "MAG B550 TOMAHAWK (MS-7C91)" without the MSI brand.
  if(items===db.boards){
   found=items.filter(x=>{
    const short=norm(x.name).replace(/^(msi|asus|gigabyte|asrock)/,"");
    return short.length>=9&&(key===short||key.startsWith(short));
   });
  }
  return found.length===1?found[0]:null;
 };
 const choose=(id,value)=>{
  const select=get(id);
  const option=Array.from(select.options).find(x=>x.value===String(value)&&!x.disabled);
  if(!option)return false;
  select.value=String(value);
  select.dispatchEvent(new Event("change",{bubbles:true}));
  return true;
 };
 const named=(id,custom,entries,catalog,notes)=>{
  if(!Array.isArray(entries))return;
  const names=entries.filter(x=>typeof x==="string").slice(0,8);
  const found=names.map(x=>match(catalog,x)).find(Boolean);
  if(found&&choose(id,found.id)){notes.push(id.toUpperCase()+" valgt: "+found.name);return;}
  if(names.length){get(custom).value=names[0].slice(0,100);notes.push(id.toUpperCase()+" indsat som ukendt model – kræver kontrol");}
 };
 fileInput.addEventListener("change",async()=>{
  const file=fileInput.files?.[0];
  if(!file)return;
  if(file.size>65536||!/\.json$/i.test(file.name)){message.textContent="Vælg en GeeTech .json-rapport på højst 64 KB.";return;}
  try{
   const data=JSON.parse((await file.text()).replace(/^\uFEFF/,""));
   if(data?.format!=="geetech-spec-tjek"||data?.version!==1||data?.platform!=="windows"||
      !Array.isArray(data.cpu)||!Array.isArray(data.gpu)||!data.memory||typeof data.memory!=="object"){
     throw new Error("Filen er ikke en understøttet GeeTech Windows-rapport.");
   }
   get("pc-checker-form").reset();
   const notes=[];
   const board=data.motherboard&&typeof data.motherboard==="object"?data.motherboard:{};
   const boardName=[board.manufacturer,board.model].filter(x=>typeof x==="string").join(" ").trim();
   const matched=match(db.boards,boardName)||match(db.boards,board.model);
   if(matched&&choose("board",matched.id))notes.push("Bundkort valgt: "+matched.name);
   else if(boardName){get("board-custom").value=boardName.slice(0,100);notes.push("Bundkortnavn indsat; modellen er ikke i kataloget");}
   named("cpu","cpu-custom",data.cpu,db.cpus,notes);
   named("gpu","gpu-custom",data.gpu,db.gpus,notes);
   const ramGB=Number(data.memory.totalGB);
   if(Number.isFinite(ramGB)&&ramGB>0&&ramGB<=512){
    const size=Array.from(get("ram").options).find(o=>o.value&&Math.abs(Number(o.value)-ramGB)<0.6);
    if(size)choose("ram",size.value);
    else notes.push("RAM-mængde "+ramGB+" GB kræver manuel indtastning");
   }
   if(["DDR3","DDR4","DDR5"].includes(data.memory.type)&&!choose("ramtype",data.memory.type))
      notes.push("RAM-type "+data.memory.type+" kunne ikke vælges pga. kompatibilitetsfilter");
   const disks=Array.isArray(data.disks)?data.disks.slice(0,12):[];
   if(disks.length)notes.push(disks.length+" diske registreret – systemdisk vælges manuelt");
   notes.push("Strømforsyning og kabinet udfyldes manuelt");
   get("cpu").dispatchEvent(new Event("change",{bubbles:true}));
   message.textContent="Rapport læst lokalt. "+notes.join(". ")+". Tryk nu på Tjek hele mit build.";
  }catch(error){
   message.textContent="Kunne ikke indlæse rapporten: "+(error?.message||"ukendt fejl");
  }
 });
})();
