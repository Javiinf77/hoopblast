const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human;
function flick(deg, frames, moving){ hh.pos.set(0,0,0); hh.vel.set(0,0,0); hh.move=null; hh.hand=1; hh.chain=[]; hh.chainT=9; for(const k in hh.moveCd) hh.moveCd[k]=0; hh.stamina=1; d.ball.holder=hh; pad.axes=[0,moving?-1:0,0,0]; run(moving?0.6:0.2);
  const p0=hh.pos.clone(); const a=deg*Math.PI/180; pad.axes=[0,moving?-1:0,Math.sin(a),-Math.cos(a)]; run((frames||3)/60); pad.axes=[0,moving?-1:0,0,0]; run(2/60);
  const t=hh.move?hh.move.type:'nada'; run(0.8); const dist=Math.hypot(hh.pos.x-p0.x,hh.pos.z-p0.z); pad.axes=[0,0,0,0]; run(0.3); return t+(moving?'':' (desplazamiento '+dist.toFixed(2)+' m)'); }
console.log('Balón en la derecha · parado:');
for(const [n,deg] of [['↖ exacto (-45°)',-45],['↖ desviado (-60°)',-60],['← exacto (-90°)',-90],['← algo desviado (-80°)',-80],['↙ exacto (-135°)',-135],['↙ desviado (-115°)',-115],['↓ (180°)',180],['↘ (135°)',135],['↑ (0°)',0],['→ (90°)',90]]) console.log('  ', n.padEnd(22), '->', flick(deg));
console.log('En carrera: ↖ ->', flick(-45,3,true), ' | ← ->', flick(-90,3,true));
`);
