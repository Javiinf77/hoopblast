const src=require('fs').readFileSync('testpad.js','utf8').split("// navegación de menú")[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human}, ANIM,");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function trial(back, holdT){ hh.pos.set(rim.x-6,0,0); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; hh.moveCd.step=0; hh.stamina=1; hh.charging=false; d.ball.holder=hh; d.ball.shot=null; run(0.3);
  pad.axes=[0, back?1:0, 0, 0]; run(0.1); btn(2,true); run(1/60); const x0=hh.pos.x; const stepped = hh.move && hh.move.type==='step';
  let shotAt=-1, t=0, xs=null; while(t<2){ run(1/60); t+=1/60; if(t>=holdT && pad.buttons[2].pressed) btn(2,false); if(shotAt<0 && d.ball.shot && !d.ball.holder){ shotAt=t; xs=hh.pos.x; } }
  pad.axes=[0,0,0,0]; btn(2,false); return 'paso atrás '+stepped+' | retroceso hasta el tiro '+(xs!==null?(x0-xs).toFixed(2):'-')+' m | tiro a los '+(shotAt>=0?shotAt.toFixed(2)+' s':'—'); }
console.log('stick atrás + □ mantenido (suelta a 1,35 s):', trial(true, 1.35));
console.log('stick atrás + □ mantenido (suelta a 1,55 s):', trial(true, 1.55));
console.log('stick quieto + □ (tiro normal, suelta a 0,68 s):', trial(false, 0.68));
`);
