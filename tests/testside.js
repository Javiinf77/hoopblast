const src=require('fs').readFileSync('testpad.js','utf8').split("// navegación de menú")[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function trial(lx, sprint){ hh.pos.set(rim.x-7,0,-lx*2.5); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; hh.moveCd.step=0; hh.stamina=1; hh.charging=false; d.ball.holder=hh; d.ball.shot=null; pad.axes=[0,0,0,0]; btn(2,false); btn(5,false); run(0.2);
  pad.axes=[lx,0,0,0]; if(sprint) btn(5,true); run(0.8); const v=Math.hypot(hh.vel.x,hh.vel.z).toFixed(1); const p0=hh.pos.clone(); btn(2,true); run(1/60); const kind=hh.move&&hh.move.type==='step'?(hh.move.sideStep?'paso lateral':'paso atrás'):'tiro normal';
  let t=0, shot=-1, ps=null; while(t<1.3){ run(1/60); t+=1/60; if(t>0.7 && pad.buttons[2].pressed) btn(2,false); if(shot<0 && d.ball.shot && !d.ball.holder){ shot=t; ps=hh.pos.clone(); } }
  pad.axes=[0,0,0,0]; btn(5,false); const dz=ps?ps.z-p0.z:0, dx=ps?ps.x-p0.x:0;
  return 'vel. '+v+' m/s → '+kind+' | desplazamiento hasta tirar: lateral '+dz.toFixed(2)+' m, hacia el aro '+dx.toFixed(2)+' m | tiro a los '+(shot>=0?shot.toFixed(2):'—')+' s'; }
// cámara mira +x: stick derecha = +z
console.log('corriendo a la derecha + □:', trial(1, true));
console.log('corriendo a la izquierda + □:', trial(-1, true));
console.log('andando a la derecha (stick 40%) + □:', trial(0.4, false));
console.log('corriendo a la derecha SIN R1 + □:', trial(1, false));
`);
