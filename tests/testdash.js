const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human}, CFG,");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human;
function combo(){ hh.pos.set(-4,0,0); hh.vel.set(0,0,0); hh.move=null; hh.hand=1; hh.stamina=1; hh.exhausted=false; for(const k in hh.moveCd) hh.moveCd[k]=0; d.ball.holder=hh; pad.axes=[0,-0.6,0,0]; run(0.4);
  const a=-45*Math.PI/180; pad.axes=[0,-0.6,Math.sin(a),-Math.cos(a)]; run(3/60); pad.axes=[0,-0.6,0,0]; run(0.5);   // cruce
  pad.axes=[0,-1,0,0]; btn(5,true); let mx=0; for(let i=0;i<30;i++){ run(1/60); mx=Math.max(mx,Math.hypot(hh.vel.x,hh.vel.z)); } btn(5,false); pad.axes=[0,0,0,0]; run(0.2);
  return mx.toFixed(1); }
for(let i=1;i<=4;i++){ const before=hh.dash.toFixed(2); const v=combo(); console.log('cruce + R1 nº'+i+': cargas', before,'→',hh.dash.toFixed(2),'| velocidad máx', v,'m/s', hh.dash<+before-0.5 ? '(¡dash!)' : '(sin carga: solo sprint)'); }
// recarga con la energía llena y casi vacía
hh.dash=0; hh.stamina=1; let t=0; while(hh.dash<1 && t<40){ run(0.25); t+=0.25; hh.stamina=1; } console.log('recarga de 1 carga con energía llena:', t.toFixed(1),'s');
hh.dash=0; t=0; while(hh.dash<1 && t<60){ hh.stamina=0.05; run(0.25); t+=0.25; } console.log('recarga de 1 carga con energía casi vacía:', t.toFixed(1),'s');
`);
