"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const window={};
new Function("window",fs.readFileSync("js/spec-database.js","utf8"))(window);
new Function("window",fs.readFileSync("js/spec-enrichment.js","utf8"))(window);
class Element{
 constructor(tag="div"){this.tagName=tag;this.children=[];this.options=[];this.value="";this.attributes={};this.listeners={};this.textContent="";}
 append(...children){this.children.push(...children);if(this.tagName==="select")this.options.push(...children);}
 after(node){this.nextElement=node;}
 replaceChildren(...children){this.children=[...children];}
 setAttribute(key,value){this.attributes[key]=value;}
 removeAttribute(key){delete this.attributes[key];}
 addEventListener(name,fn){this.listeners[name]=fn;}
 querySelector(){return new Element();}
 get selectedOptions(){return this.options.filter(option=>option.value===this.value);}
}
const nodes=new Map();
const get=id=>{if(!nodes.has(id))nodes.set(id,new Element(id==="pc-checker-form"?"form":"select"));return nodes.get(id);};
const document={getElementById:get,createElement:tag=>new Element(tag)};
function fill(id,values){const select=get(id);const placeholder=new Element("option");placeholder.value="";placeholder.textContent="Ved ikke";select.append(placeholder);for(const item of values){const option=new Element("option");option.value=item.id||item;option.textContent=item.name||item;select.append(option);}}
const db=window.GEETECH_DB;
fill("cpu",db.cpus);fill("board",db.boards);fill("gpu",db.gpus);fill("psu",db.psus);fill("case",db.cases);
fill("ramtype",["DDR3","DDR4","DDR5"]);
fill("socket",["AM4","AM5","LGA1151","LGA1200","LGA1700","LGA1851"]);
for(const id of ["ram","storage","capacity"])fill(id,[]);
new Function("window","document","queueMicrotask",fs.readFileSync("js/spec-interactive.js","utf8"))(window,document,fn=>fn());
const cpu=name=>db.cpus.find(x=>x.name===name).id;
const board=name=>db.boards.find(x=>x.name===name).id;
const choose=(id,value)=>{get(id).value=value;get(id).listeners.change();};
const option=(id,value)=>get(id).options.find(x=>x.value===value);
choose("board",board("MSI MAG B650 TOMAHAWK WIFI"));
assert.equal(get("socket").value,"AM5");
assert.equal(get("ramtype").value,"DDR5");
assert.equal(option("ramtype","DDR4").disabled,true);
assert.equal(option("cpu",cpu("AMD Ryzen 5 5600X")).disabled,true);
choose("board","");
choose("cpu",cpu("AMD Ryzen 5 5600X"));
assert.equal(get("socket").value,"AM4");
assert.equal(get("ramtype").value,"DDR4");
assert.equal(option("board",board("MSI MAG B650 TOMAHAWK WIFI")).disabled,true);
choose("cpu","");
choose("board",board("ASUS PRIME Z390-A"));
assert.equal(option("cpu",cpu("Intel Core i7-7700K")).disabled,true);
assert.equal(option("cpu",cpu("Intel Core i7-8700K")).disabled,false);
choose("board",board("MSI MAG B550 TOMAHAWK"));
assert.equal(option("cpu",cpu("AMD Ryzen 5 1600")).disabled,true);
assert.equal(option("cpu",cpu("AMD Ryzen 5 3600")).disabled,false);
console.log("SPEC TJEK interactive dependency tests passed.");
