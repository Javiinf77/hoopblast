const src=require('fs').readFileSync('testpad.js','utf8').split("// navegación de menú")[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function setup(){ hh.pos.set(rim.x-7,0,0); hh.vel.set(0,0,0); hh.fakeCd=0; hh.fakeT=0; hh.deadDribble=false; hh.charging=false; d.ball.holder=hh; d.ball.shot=null; run(0.3); }
// amago y enseguida tiro: ¿cuánto tarda en empezar a cargar?
setup(); btn(2,true); run(2/60); btn(2,false); run(3/60); btn(2,true); let t=0; while(!hh.charging && t<1){ run(1/60); t+=1/60; } console.log('amago → tiro: empieza a cargar a los', t.toFixed(2),'s del segundo toque');
btn(2,false); run(1.2);
setup(); btn(2,true); run(2/60); btn(2,false); run(4/60); btn(0,true); run(1/60); btn(0,false); let t2=0; while(d.ball.holder===hh && t2<1){ run(1/60); t2+=1/60; } console.log('amago → pase: el balón sale a los', t2.toFixed(2),'s');
setup(); btn(2,true); run(2/60); btn(2,false); run(1/60); let ft=1/60; while(hh.fakeT>0){ run(1/60); ft+=1/60; } console.log('duración de la animación del amago:', ft.toFixed(2),'s');
`);
