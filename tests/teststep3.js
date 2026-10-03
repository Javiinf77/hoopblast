const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
function reset(){ hh.pos.set(rim.x-6,0,0); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; hh.moveCd.step=0; hh.stamina=1; hh.charging=false; d.ball.holder=hh; d.ball.shot=null; pad.axes=[0,0,0,0]; btn(2,false); run(0.3); }
reset(); pad.axes=[0,1,0,0]; run(0.1); btn(2,true); run(1/60);
const x0=hh.pos.x; let log=[]; let t=0, rel=false, shotAt=-1;
while(t<1.6){ run(1/60); t+=1/60; if(Math.round(t*60)%6===0) log.push(t.toFixed(2)+'s '+(hh.move?'paso':'—')+' carga '+hh.charge.toFixed(2)+' balón y '+(d.ball.pos.y-hh.pos.y).toFixed(2)+' x '+(x0-hh.pos.x).toFixed(2)); if(!rel && t>=1.0){ btn(2,false); rel=true; } if(shotAt<0 && d.ball.shot && !d.ball.holder) shotAt=t; }
console.log(log.slice(0,10).join('\\n')); console.log('tiro a los', shotAt.toFixed(2),'s');
reset(); pad.buttons[11]; const xs=hh.pos.x; pad.axes=[0,0,0,1]; run(0.1); pad.axes=[0,0,0,0]; run(0.3); console.log('RS ↓ con balón ->', hh.move? hh.move.type : 'nada (quitado)');
reset(); btn(2,true); run(0.15); pad.axes=[1,0,0,0]; run(0.4); console.log('cargando tiro y moviendo el stick a la derecha: desplazamiento', Math.hypot(hh.pos.x-(rim.x-6), hh.pos.z).toFixed(3),'m'); pad.axes=[0,0,0,0]; btn(2,false); run(0.2); console.log('en el salto del tiro: velocidad horizontal', Math.hypot(hh.vel.x,hh.vel.z).toFixed(2));
`);
