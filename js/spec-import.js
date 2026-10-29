"use strict";
(() => {
 const fileInput=document.getElementById("checker-import-file"),message=document.getElementById("checker-import-status");
 const db=window.GEETECH_DB;
 if(!fileInput||!message||!db)return;
 const get=id=>document.getElementById(id);
 const norm=value=>String(value||"").toLowerCase().replace(/\(r\)|\(tm\)|\bprocessor\b|\bcpu\b|\bgraphics\b|\bdisplay adapter\b/g,"").replace(/[^a-z0-9]/g,"");
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
  if(found.length===1)return found[0];
  // A Windows CPU string may include clock speed and core count, while GPUs may
  // be named with vendor suffixes. Avoid guessing when models are ambiguous.
  const tokenKey=key.replace(/(\d+core|\d+thread|\d+ghz).*$/,"");
  found=items.filter(x=>tokenKey.startsWith(norm(x.name))&&norm(x.name).length>=7);
  found.sort((a,b)=>norm(b.name).length-norm(a.name).length);
  return found.length&&(!found[1]||norm(found[0].name).length>norm(found[1].name).length)?found[0]:null;
 };
 const choose=(id,value)=>{
  const select=get(id);
  const option=Array.from(select.options).find(x=>x.value===String(value)&&!x.disabled);
  if(!option)return false;
  select.value=String(value);
  select.dispatchEvent(new Event("change",{bubbles:true}));
  return true;
 };
 const detected=document.getElementById("checker-detected");
 const showDetected=(data)=>{
  if(!detected)return;
  detected.replaceChildren();
  const heading=document.createElement("h4");heading.textContent="Registreret på din PC";detected.append(heading);
  const list=document.createElement("dl");list.className="checker-detected-list";
  const line=(label,value)=>{
   const row=document.createElement("div");
   const dt=document.createElement("dt");dt.textContent=label;
   const dd=document.createElement("dd");dd.textContent=value||"Ikke fundet";
   row.append(dt,dd);list.append(row);
  };
  line("Processor",Array.isArray(data.cpu)?data.cpu.join(", "):"");
  line("Grafikkort",Array.isArray(data.gpu)?data.gpu.join(", "):"");
  const b=data.motherboard||{};
  line("Bundkort",[b.manufacturer,b.model].filter(x=>typeof x==="string"&&x.trim()).join(" "));
  line("RAM",data.memory?.totalGB?data.memory.totalGB+" GB"+(data.memory.type&&data.memory.type!=="unknown"?" "+data.memory.type:""):"");
  if(Array.isArray(data.disks)&&data.disks.length){
   line("Diske",data.disks.slice(0,8).map(x=>[x.model,x.sizeGB?x.sizeGB+" GB":""].filter(Boolean).join(" · ")).join(", "));
  }
  detected.append(list);
  const note=document.createElement("p");note.textContent="Alle registrerede navne vises her, også hvis modellen ikke findes i GeeTech-databasen. Ukendte modeller kan ikke få en præcis automatisk ydelsesvurdering.";detected.append(note);
  detected.hidden=false;
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
   showDetected(data);
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
   notes.push("Strømforsyning og kabinet er valgfrie avancerede felter");
   get("cpu").dispatchEvent(new Event("change",{bubbles:true}));
   message.textContent="Rapport læst lokalt. "+notes.join(". ")+". Tryk nu på Tjek hele mit build.";
  }catch(error){
   message.textContent="Kunne ikke indlæse rapporten: "+(error?.message||"ukendt fejl");
  }
 });
})();
