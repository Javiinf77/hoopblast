const src=require('fs').readFileSync('testpad.js','utf8').split("// navegación de menú")[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function trial(hand, delay, run1, sprint){ hh.pos.set(rim.x-12,0,0.5); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; hh.hand=hand; for(const k in hh.moveCd) hh.moveCd[k]=0; hh.stamina=1; hh.charging=false; d.ball.holder=hh; d.ball.shot=null; pad.axes=[0,0,0,0]; btn(2,false); btn(5,false); run(0.2);
  pad.axes=[0,-1,0,0]; if(sprint) btn(5,true); run(run1); btn(5,false); pad.axes=[0,1,0,0];   // tira del stick hacia atrás
  let swaps=0; for(let i=0;i<Math.round(delay*60);i++){ run(1/60); if(hh.move&&hh.move.type==='swap') swaps++; }
  btn(2,true); run(2/60); const ok = hh.move && hh.move.type==='step'; let t=0; while(t<1.2){ run(1/60); t+=1/60; if(hh.move&&hh.move.type==='swap') swaps++; } btn(2,false); pad.axes=[0,0,0,0]; run(1.5);
  return ok ? 1 : 0; }
let tot=0, ok=0;
for(const hand of [1,-1]) for(const sprint of [false,true]) for(const delay of [0,0.05,0.1,0.2,0.35]) { tot++; const r=trial(hand, delay, 0.8, sprint); ok+=r; if(!r) console.log('  falla: mano',hand,'sprint',sprint,'retraso',delay,'| estado tras pulsar:', JSON.stringify({move: hh.move&&hh.move.type, charging: hh.charging, onGround: hh.onGround, cd: hh.moveCd.step.toFixed(2), stam: hh.stamina.toFixed(2), exh: hh.exhausted})); }
console.log('stick atrás + □ (con y sin sprint, ambas manos, pulsando de 0 a 0,35 s tras tirar del stick): paso atrás', ok+'/'+tot);
// ¿cambios de mano al dar media vuelta sin tirar?
let sw=0; for(const hand of [1,-1]){ hh.pos.set(rim.x-12,0,0.5); hh.vel.set(0,0,0); hh.move=null; hh.hand=hand; d.ball.holder=hh; pad.axes=[0,-1,0,0]; run(0.8); pad.axes=[0,1,0,0]; for(let i=0;i<60;i++){ run(1/60); if(hh.move&&hh.move.type==='swap') { sw++; break; } } pad.axes=[0,0,0,0]; run(0.5); }
console.log('media vuelta con el stick atrás: cambios de mano automáticos', sw, '(0 = no se mete en medio)');
`);
