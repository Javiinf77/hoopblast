const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human}, TR,");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function trial(lx, gapF, holdF){ hh.pos.set(rim.x-11,0,0); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; for(const k in hh.moveCd) hh.moveCd[k]=0; hh.stamina=1; hh.charging=false; hh.fakeCd=0; d.ball.holder=hh; d.ball.shot=null; d.TR.pending=false; pad.axes=[0,0,0,0]; btn(2,false); run(0.2);
  pad.axes=[lx*0.4,-1,0,0]; btn(5,true); let t=0; while(Math.hypot(rim.x-hh.pos.x, rim.z-hh.pos.z) > 6.2 && t<3){ run(1/60); t+=1/60; }
  const zs=[]; let kind=null, m0=d.TR.made;
  btn(2,true); for(let i=0;i<(holdF||2);i++){ run(1/60); if(!kind && hh.charging) kind='tiro (carga '+hh.charge.toFixed(2)+')'; } btn(2,false);
  if(gapF){ for(let i=0;i<gapF;i++){ run(1/60); } btn(2,true); run(2/60); btn(2,false); }
  for(let i=0;i<120;i++){ run(1/60); if(hh.move && !kind) kind=hh.move.type; if(hh.move) zs.push(hh.pos.z); if(!kind && hh.charging) kind='tiro'; if(!kind && hh.fakeT>0) kind='amago'; }
  btn(5,false); pad.axes=[0,0,0,0]; run(2);
  const zz = zs.length? 'z: '+zs[0].toFixed(2)+' → '+(Math.max(...zs.map(Math.abs))*Math.sign(zs[Math.floor(zs.length*0.4)])).toFixed(2)+' → '+zs[zs.length-1].toFixed(2) : '';
  return (kind||'nada')+' '+zz+' | canasta '+(d.TR.made>m0); }
console.log('□ + □ con 0,3 s, stick a la derecha  :', trial(1, 18));
console.log('□ + □ con 0,3 s, stick a la izquierda:', trial(-1, 18));
console.log('□ + □ casi seguidos (0,06 s), derecha :', trial(1, 3));
console.log('□ mantenido (tiro)                    :', trial(0, 0, 30));
console.log('□ un toque (amago)                    :', trial(0, 0, 2));
`);
