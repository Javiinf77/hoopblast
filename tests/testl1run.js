const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human}, get passLock(){return passLock}, get live(){return live},");
eval(src + `
btn(0,true); run(0.05); btn(0,false); run(4);
const h=d.human; const P=d.players;
pad.axes=[0,-1,0,0]; run(1); const vRun=Math.hypot(h.vel.x,h.vel.z);
btn(4,true); run(1); const vL1=Math.hypot(h.vel.x,h.vel.z); btn(4,false); run(0.3);
btn(5,true); run(1); const vR1=Math.hypot(h.vel.x,h.vel.z); btn(5,false); pad.axes=[0,0,0,0]; run(0.5);
console.log('correr: stick solo', vRun.toFixed(1), 'm/s | con L1', vL1.toFixed(1), 'm/s | con R1', vR1.toFixed(1), 'm/s');
const d0=h.dash; pad.axes=[0,-1,0,0]; run(0.4); btn(4,true); run(2/60); btn(4,false); run(4/60); btn(4,true); run(2/60); btn(4,false); run(0.3); pad.axes=[0,0,0,0];
console.log('doble L1: cargas de sobresfuerzo', d0.toFixed(2), '→', h.dash.toFixed(2));
d.ball.holder=h; run(0.1); btn(5,true); run(1/60); btn(5,false); run(1/60); console.log('R1 con balón: receptor elegido', !!d.passLock);
`);
