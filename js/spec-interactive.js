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
  const cpu=by(db.cpus,$("cpu").value),board=by(db.boards,$("board").value),c=by(db.cases,$("case").value);
  const kit=by(extra.ramKits,$("ramkit").value),drive=by(extra.drives,$("drive").value);
  const specificPsu=by(extra.psuModels,$("psumodel").value),specificCase=by(extra.caseModels,$("casemodel").value);
  if(kit){$("ram").value=String(kit.gb);$("ramtype").value=kit.type;}
  if(drive){$("storage").value=drive.type;$("capacity").value=String(drive.gb);}
  if(specificPsu)$("psu").value=String(specificPsu.watt);
  if(specificCase)$("case").value=specificCase.form.toLowerCase();

  if(!cpu&&!board){
   if(autoSocket&&$("socket").value===autoSocket)$("socket").value="";
   if(autoRamType&&$("ramtype").value===autoRamType)$("ramtype").value="";
   autoSocket="";autoRamType="";
  }
  let socket=cpu?.socket||board?.socket||$("socket").value||"";
  // When CPU is selected, that CPU dictates socket. A board can restrict CPU too.
  for(const opt of $("cpu").options){
   const item=by(db.cpus,opt.value);
   opt.disabled=!!(item && ((board&&!compatible(item,board))||(!board&&$("socket").value&&item.socket!==$("socket").value)));
  }
  for(const opt of $("board").options){
   const item=by(db.boards,opt.value);
   opt.disabled=!!(item&&((cpu&&!compatible(cpu,item))||(!cpu&&$("socket").value&&item.socket!==$("socket").value)||
     ($("ramtype").value&&item.memory!==$("ramtype").value)||(c?.forms&&!c.forms.includes(item.form))||(specificCase&&!specificCase.forms.includes(item.form))));
  }
  for(const opt of $("ramtype").options){
   if(!opt.value)continue;
   opt.disabled=!!(board&&board.memory!==opt.value)||
     !!(cpu&&!cpu.memory.includes(opt.value))||!!(kit&&kit.type!==opt.value);
  }
  for(const opt of $("socket").options){
   if(!opt.value)continue;
   opt.disabled=!!socket&&opt.value!==socket;
  }
  for(const opt of $("case").options){
   const item=by(db.cases,opt.value);
   opt.disabled=!!(board&&item?.forms&&!item.forms.includes(board.form));
  }
  for(const opt of $("ramkit").options){
   const item=by(extra.ramKits,opt.value);
   opt.disabled=!!(item&&((board&&item.type!==board.memory)||(cpu&&!cpu.memory.includes(item.type))||
     (!board&&!cpu&&$("ramtype").value&&item.type!==$("ramtype").value)));
  }
  for(const opt of $("casemodel").options){
   const item=by(extra.caseModels,opt.value);
   opt.disabled=!!(item&&board&&!item.forms.includes(board.form));
  }
  const messages=[];
  // Clear stale selections rather than allowing known-incompatible builds.
  for(const id of ["cpu","board","ramtype","socket","case","ramkit","casemodel"]){
   const select=$(id),chosen=select.selectedOptions[0];
   if(chosen?.disabled){const old=chosen.textContent;select.value="";messages.push("Fjernet et inkompatibelt valg i "+id+": "+old);}
  }
  const actualCpu=by(db.cpus,$("cpu").value),actualBoard=by(db.boards,$("board").value);
  const actualKit=by(extra.ramKits,$("ramkit").value);
  const enforcedSocket=actualCpu?.socket||actualBoard?.socket||"";
  if(enforcedSocket){$("socket").value=enforcedSocket;autoSocket=enforcedSocket;$("socket").setAttribute("aria-description","Automatisk valgt ud fra CPU eller bundkort");}
  else $("socket").removeAttribute("aria-description");
  const ramChoices=actualBoard?[actualBoard.memory]:(actualCpu?.memory||[]);
  if(ramChoices.length===1){$("ramtype").value=ramChoices[0];autoRamType=ramChoices[0];}
  if(actualKit){$("ram").value=String(actualKit.gb);$("ramtype").value=actualKit.type;}
  notice.textContent=messages.length?messages.join(" "):enforcedSocket?
   "Sokkel: "+enforcedSocket+". "+(ramChoices.length?"Mulig RAM-type: "+ramChoices.join(" / ")+". ":"")+"Inkompatible valg er deaktiveret. BIOS, RAM-kapacitet, kabinettets mål og strømstik kræver stadig kontrol.":
   "Vælg CPU eller bundkort for automatisk at begrænse de kompatible sokler og RAM-typer.";
  specs.replaceChildren();
  const selected=[
   by(db.cpus,$("cpu").value),by(db.boards,$("board").value),
   by(db.gpus,$("gpu").value),by(db.psus,$("psu").value),by(db.cases,$("case").value)
  ].filter(Boolean);
  for(const item of [by(extra.ramKits,$("ramkit").value),by(extra.drives,$("drive").value),by(extra.psuModels,$("psumodel").value),by(extra.caseModels,$("casemodel").value)])if(item)selected.push(item);
  if($("ram").value||$("ramtype").value){
   const qty=$("ram").value||"ukendt";
   const type=$("ramtype").value||"ukendt";
   selected.push({
    name:"RAM: "+qty+" GB / "+type,summary:"Systemhukommelse lagrer aktive programdata. Mængde, antal moduler, hastighed og bundkortets RAM-understøttelse påvirker ydelsen.",
    specs:[["Mængde",qty+" GB"],["Generation",type],["Hastighed og moduler","Ukendt – vælg konkret RAM-kit for kontrol"]],
    use:"DDR4 og DDR5 bruger forskellige slots. Mere RAM hjælper mest, når den eksisterende mængde er tæt på fuld udnyttelse.",
    evidenceLabel:"Brugerens RAM-mængde/-kategori – ikke en registreret produktmodel"
   });
  }
  if($("storage").value||$("capacity").value){
   const type={hdd:"HDD",sata:"SATA SSD",nvme:"NVMe SSD"}[$("storage").value]||"Ukendt disk";
   const size=$("capacity").value?$("capacity").value+" GB":"ukendt";
   selected.push({
    name:"Systemdisk: "+type,
    summary:"Systemdisken opbevarer Windows, programmer, spil og filer. SSD'er giver typisk hurtigere adgangstider end mekaniske harddiske.",
    specs:[["Lagertype",type],["Angivet kapacitet",size],["Præcis model / interface / ledig plads","Ikke oplyst"]],
    use:"NVMe kræver en kompatibel tilslutning. Et generisk lagervalg dokumenterer ikke diskens faktiske hastighed eller sundhed.",
    evidenceLabel:"Brugeroplyst diskklasse – ingen producentmodel"
   });
  }
  if(!selected.length){const p=document.createElement("p");p.textContent="Vælg en komponent ovenfor for at se dens specifikationer.";specs.append(p);}
  else selected.forEach(x=>specs.append(card(x)));
 }
 for(const id of ids)$(id).addEventListener("change",refresh);
 $("pc-checker-form").addEventListener("reset",()=>queueMicrotask(refresh));
 refresh();
})();
