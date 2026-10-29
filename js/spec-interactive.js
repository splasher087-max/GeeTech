"use strict";
/* Live build guard. Blocks known-incompatible combinations; unknown BIOS and physical
   dimensions still require a separate review and are NEVER asserted compatible. */
(() => {
 const db=window.GEETECH_DB;
 const extra=window.GEETECH_EXTRAS||{ramKits:[],drives:[],psuModels:[],caseModels:[]};
 if(!db)return;
 const $=id=>document.getElementById(id);
 const by=(arr,id)=>arr.find(x=>x.id===id)||null;
 const compatible=(cpu,board)=>window.GEETECH_SPEC_META?.exactCompatibility?.(cpu,board)?.kind!=="blocked";
 const ids=["cpu","board","ram","ramtype","socket","case","gpu","psu","storage","capacity","ramkit","drive","psumodel","casemodel"];
 for(const [field,items] of [["ramkit",extra.ramKits],["drive",extra.drives],["psumodel",extra.psuModels],["casemodel",extra.caseModels]]){
  const dropdown=$(field);
  for(const item of items){
   const option=document.createElement("option");option.value=item.id;option.textContent=item.name;dropdown.append(option);
  }
 }
 const notice=document.createElement("p");notice.id="checker-live-feedback";notice.className="checker-filter-feedback";notice.setAttribute("role","status");
 const fields=$("pc-checker-form").querySelector(".checker-fields");fields.after(notice);
 const specs=$("checker-live-parts");
 let autoSocket="",autoRamType="";
 function card(item){
  const box=document.createElement("article");box.className="checker-live-card";
  const h=document.createElement("h4");h.textContent=item.name;box.append(h);
  const p=document.createElement("p");p.textContent=item.summary||"Modeloplysningerne er ufuldstændige.";box.append(p);
  const dl=document.createElement("dl");dl.className="checker-spec-dl";
  for(const [k,v] of item.specs||[]){
   const row=document.createElement("div");row.className="checker-spec-row";
   const key=document.createElement("dt");key.textContent=k;
   const val=document.createElement("dd");val.textContent=String(v);
   row.append(key,val);dl.append(row);
  }
  box.append(dl);
  if(item.use){const help=document.createElement("p");help.textContent=item.use;box.append(help);}
  const evid=document.createElement("small");evid.className="checker-evidence";evid.textContent="Kildestatus: "+(item.evidenceLabel||"Afventer modelverificering");box.append(evid);
  if(item.source){
   const a=document.createElement("a");a.href=item.source;a.textContent="Se fabrikantens reference ↗";a.rel="noopener noreferrer";a.target="_blank";box.append(a);
  }
  return box;
 }
 function refresh(){
  const messages=[];
  const selected=id=>$(id).value;
  const cpu0=by(db.cpus,selected("cpu")),board0=by(db.boards,selected("board"));
  const psu=by(extra.psuModels,selected("psumodel"));
  const drive=by(extra.drives,selected("drive"));
  const kit0=by(extra.ramKits,selected("ramkit"));
  const case0=by(extra.caseModels,selected("casemodel"));
  // Specific model selections are authoritative for their generic attributes.
  if(psu)$("psu").value=String(psu.watt);
  if(drive){$("storage").value=drive.type;$("capacity").value=String(drive.gb);}
  if(kit0){$("ram").value=String(kit0.gb);$("ramtype").value=kit0.type;}
  if(case0)$("case").value=case0.form.toLowerCase();
  // Primary selectors define the platform; an incompatible selection is removed.
  const board=by(db.boards,selected("board")),cpu=by(db.cpus,selected("cpu"));
  if(cpu&&board&&!compatible(cpu,board)){
   // Preserve the already selected motherboard and remove CPU to avoid impossible builds.
   $("cpu").value="";messages.push("CPU'en blev fjernet: den understøttes ikke af det valgte bundkort.");
  }
  const activeCpu=by(db.cpus,selected("cpu"));
  const activeBoard=by(db.boards,selected("board"));
  const socket=activeBoard?.socket||activeCpu?.socket||"";
  if(socket){$("socket").value=socket;autoSocket=socket;}
  else if(autoSocket&&selected("socket")===autoSocket){$("socket").value="";autoSocket="";}
  // A board has exactly one DDR generation. CPU-only supports one or both.
  const allowedRam=activeBoard?[activeBoard.memory]:(activeCpu?.memory||[]);
  if(allowedRam.length===1){$("ramtype").value=allowedRam[0];autoRamType=allowedRam[0];}
  else if(allowedRam.length>0&&!allowedRam.includes(selected("ramtype"))){$("ramtype").value="";autoRamType="";}
  else if(!allowedRam.length&&autoRamType&&selected("ramtype")===autoRamType){$("ramtype").value="";autoRamType="";}
  const kit=by(extra.ramKits,selected("ramkit"));
  if(kit&&allowedRam.length&&!allowedRam.includes(kit.type)){
    $("ramkit").value="";messages.push("RAM-kittet blev fjernet: det bruger forkert DDR-generation.");
  }
  if(kit&&selected("ramkit")){
    $("ram").value=String(kit.gb);$("ramtype").value=kit.type;
  }
  const actualCase=by(db.cases,selected("case"));
  const actualCaseModel=by(extra.caseModels,selected("casemodel"));
  if(activeBoard&&actualCase?.forms&&!actualCase.forms.includes(activeBoard.form)){
    $("case").value="";messages.push("Kabinetklassen blev fjernet: bundkortformatet passer ikke.");
  }
  if(activeBoard&&actualCaseModel&&!actualCaseModel.forms.includes(activeBoard.form)){
    $("casemodel").value="";messages.push("Kabinetmodellen blev fjernet: bundkortformatet passer ikke.");
  }
  const constrainedSocket=activeBoard?.socket||activeCpu?.socket||"";
  const constrainedRam=activeBoard?[activeBoard.memory]:(activeCpu?.memory||[]);
  for(const opt of $("cpu").options){
   const item=by(db.cpus,opt.value);
   opt.disabled=!!(item&&(
     (activeBoard&&!compatible(item,activeBoard))||
     (!activeBoard&&selected("socket")&&item.socket!==selected("socket"))||
     (!activeBoard&&!selected("socket")&&selected("ramtype")&&!item.memory.includes(selected("ramtype")))
   ));
  }
  for(const opt of $("board").options){
   const item=by(db.boards,opt.value);
   const size=by(db.cases,selected("case")),specific=by(extra.caseModels,selected("casemodel"));
   opt.disabled=!!(item&&(
    (activeCpu&&!compatible(activeCpu,item))||
    (!activeCpu&&selected("socket")&&item.socket!==selected("socket"))||
    (selected("ramtype")&&item.memory!==selected("ramtype"))||
    (size?.forms&&!size.forms.includes(item.form))||
    (specific&&!specific.forms.includes(item.form))
   ));
  }
  for(const opt of $("ramtype").options){if(opt.value)opt.disabled=!!(constrainedRam.length&&!constrainedRam.includes(opt.value));}
  for(const opt of $("socket").options){if(opt.value)opt.disabled=!!(constrainedSocket&&opt.value!==constrainedSocket);}
  for(const opt of $("ramkit").options){
    const item=by(extra.ramKits,opt.value);
    opt.disabled=!!(item&&constrainedRam.length&&!constrainedRam.includes(item.type));
  }
  for(const opt of $("case").options){
    const item=by(db.cases,opt.value);
    opt.disabled=!!(item&&activeBoard&&item.forms&&!item.forms.includes(activeBoard.form));
  }
  for(const opt of $("casemodel").options){
    const item=by(extra.caseModels,opt.value);
    opt.disabled=!!(item&&activeBoard&&!item.forms.includes(activeBoard.form));
  }
  // Reset selects that have become impossible, even after a manual or scripted edit.
  for(const id of ["cpu","board","ramtype","socket","ramkit","case","casemodel"]){
   const drop=$(id),chosen=drop.selectedOptions?.[0];
   if(chosen?.disabled){
    messages.push("Inkompatibelt valg nulstillet: "+chosen.textContent);
    drop.value="";
   }
  }
  const effectiveBoard=by(db.boards,selected("board"));
  const effectiveCpu=by(db.cpus,selected("cpu"));
  const effectiveSocket=effectiveBoard?.socket||effectiveCpu?.socket||"";
  if(effectiveSocket){$("socket").value=effectiveSocket;autoSocket=effectiveSocket;}
  const finalRam=effectiveBoard?[effectiveBoard.memory]:(effectiveCpu?.memory||[]);
  if(finalRam.length===1){$("ramtype").value=finalRam[0];autoRamType=finalRam[0];}
  notice.textContent=messages.length?messages.join(" "):
   effectiveSocket?"Sokkel: "+effectiveSocket+". "+
   (finalRam.length?"Mulig RAM: "+finalRam.join(" / ")+". ":"")+
   "Inkompatible valgmuligheder er deaktiveret. BIOS, strømstik og plads i kabinettet skal stadig kontrolleres.":
   "Vælg CPU eller bundkort: SPEC TJEK begrænser automatisk sokkel og DDR-generation.";
  // Keep live model specs visible for every chosen part.
  specs.replaceChildren();
  const selectedParts=[
    by(db.cpus,selected("cpu")),by(db.boards,selected("board")),
    by(db.gpus,selected("gpu")),by(db.psus,selected("psu")),by(db.cases,selected("case")),
    by(extra.ramKits,selected("ramkit")),by(extra.drives,selected("drive")),
    by(extra.psuModels,selected("psumodel")),by(extra.caseModels,selected("casemodel"))
  ].filter(Boolean);
  if(selected("ram")||selected("ramtype")){
   const qty=selected("ram")||"ukendt",type=selected("ramtype")||"ukendt";
   selectedParts.push({name:"RAM: "+qty+" GB / "+type,
     summary:"RAM bruges af aktive programmer. Mængde og hastighed påvirker multitasking.",
     specs:[["Mængde",qty+" GB"],["RAM-generation",type],["Moduler og hastighed","Vælg konkret RAM-kit for flere oplysninger"]],
     evidenceLabel:"Generisk RAM-type – ikke en produktmodel"});
  }
  if(selected("storage")||selected("capacity")){
   selectedParts.push({name:"Systemdisk: "+({hdd:"HDD",sata:"SATA SSD",nvme:"NVMe SSD"}[selected("storage")]||"ukendt"),
     summary:"Lageret bruges til operativsystemet, programmer og filer.",
     specs:[["Type",selected("storage")||"ukendt"],["Kapacitet",selected("capacity")||"ukendt"]],evidenceLabel:"Generisk lagertype – ikke en produktmodel"});
  }
  if(!selectedParts.length){const p=document.createElement("p");p.textContent="Vælg en komponent ovenfor for at se dens specifikationer.";specs.append(p);}
  else selectedParts.forEach(item=>specs.append(card(item)));
 }

 for(const id of ids)$(id).addEventListener("change",refresh);
 $("pc-checker-form").addEventListener("reset",()=>queueMicrotask(refresh));
 refresh();
})();
