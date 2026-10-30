"use strict";
/* Source: Tom's Hardware CPU Benchmarks and Hierarchy, updated 5 Oct 2026.
 * The gaming index is a relative score (top CPU 100%), NOT FPS and NOT a
 * conversion factor to apply to separate GPU benchmarks.
 * Test rig: RTX 5090 FE, 1080p, High/Ultra, 17-game geometric mean.
 * Only the explicitly listed tested CPU models have a score.
 */
window.GEETECH_CPU_BENCHMARK = Object.freeze({
 source:"https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html",
 sourceLabel:"Tom's Hardware CPU Benchmarks Hierarchy, 5. oktober 2026",
 testbed:"RTX 5090 FE · 1080p · High/Ultra · 17-spils geometriske gennemsnit",
 baseline:"Ryzen 7 9850X3D = 100 %; dette er et relativt gamingindeks, ikke FPS",
 scores:{
 "AMD Ryzen 7 9800X3D":97.0,
 "AMD Ryzen 9 9950X3D":95.7,
 "AMD Ryzen 9 9900X3D":86.9,
 "AMD Ryzen 7 7800X3D":85.6,
 "AMD Ryzen 9 7950X3D":83.9,
 "AMD Ryzen 5 9600X":72.6,
 "Intel Core Ultra 9 285K":71.8,
 "AMD Ryzen 9 7950X":71.0,
 "Intel Core i5-13600K":70.9,
 "AMD Ryzen 7 7700X":70.6,
 "Intel Core Ultra 7 265K":70.3,
 "AMD Ryzen 9 7900X":69.2,
 "AMD Ryzen 5 7600X":67.3,
 "Intel Core Ultra 5 245K":67.1,
 "Intel Core i7-12700K":65.8
 }
});