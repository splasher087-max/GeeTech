"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const w={};
new Function("window",fs.readFileSync("js/spec-database.js","utf8"))(w);
new Function("window",fs.readFileSync("js/spec-enrichment.js","utf8"))(w);
const db=w.GEETECH_DB;
const all=[...db.cpus,...db.gpus,...db.boards,...db.psus,...db.cases];
assert.ok(db.cpus.length>=50 && db.gpus.length>=50 && db.boards.length>=20);
for(const item of all){
 assert.ok(item.name && item.summary && item.specs?.length>=2,"Missing specs: "+item.name);
 assert.ok(item.evidenceLabel,"Missing provenance: "+item.name);
 assert.ok(item.specs.every(([label,value])=>label&&value!==null&&value!==undefined),"Invalid specs: "+item.name);
}
const cpu=name=>db.cpus.find(x=>x.name===name);
const board=name=>db.boards.find(x=>x.name===name);
const check=w.GEETECH_SPEC_META.exactCompatibility;
assert.equal(check(cpu("AMD Ryzen 5 7600"),board("MSI MAG B550 TOMAHAWK")).kind,"blocked");
assert.equal(check(cpu("AMD Ryzen 5 7600"),board("MSI MAG B650 TOMAHAWK WIFI")).kind,"socket");
assert.equal(check(cpu("AMD Ryzen 5 1600"),board("MSI MAG B550 TOMAHAWK")).kind,"blocked");
assert.equal(check(cpu("AMD Ryzen 5 2600"),board("MSI MAG B550 TOMAHAWK")).kind,"blocked");
assert.equal(check(cpu("AMD Ryzen 5 3600"),board("MSI MAG B550 TOMAHAWK")).kind,"socket");
assert.equal(check(cpu("Intel Core i7-7700K"),board("ASUS PRIME Z390-A")).kind,"blocked");
assert.equal(check(cpu("Intel Core i7-8700K"),board("ASUS PRIME Z390-A")).kind,"socket");
assert.equal(board("MSI MAG B650 TOMAHAWK WIFI").memory,"DDR5");
console.log("SPEC TJEK catalogue checks passed:",all.length,"entries");
