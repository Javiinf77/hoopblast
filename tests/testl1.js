const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human}, get live(){return live}, set live(v){live=v},");
eval(src + `
btn(0,true); run(0.05); btn(0,false); run(4);
const P=d.players; const h=d.human; w.__noai=true;
for(const p of P.slice(3)) p.pos.set(18,0,-10+p.idx*2);
function place(){ P[0].pos.set(9,0,0); P[1].pos.set(13,0,-5); P[2].pos.set(13,0,5); for(const p of P){p.vel.set(0,0,0);} d.ball.holder=P[0]; d.ball.pass=null; d.camYaw=-Math.PI/2; }
const press=(i)=>{ btn(i,true); run(1/60); btn(i,false); run(1/60); };
// mirando a +x: el jugador 1 (z -5) queda a la izquierda en pantalla y el 2 (z +5) a la derecha
const NN=[+process.argv[2]]; for (const n of NN) { place(); run(0.1); for(let k=0;k<n;k++) press(4); pad.axes=[0.9,0,0,0]; run(2/60); press(0); pad.axes=[0,0,0,0];
  let t=0; while(t<1.5 && !(d.ball.holder && d.ball.holder!==P[0])){ run(1/60); t+=1/60; }
  console.log('L1 ×'+n+' y pase con el stick apuntando a la derecha -> lo recibe el jugador', d.ball.holder && d.ball.holder.idx, '(z '+(d.ball.holder? d.ball.holder.pos.z.toFixed(0):'')+') en', t.toFixed(2),'s'); run(0.5); }
`);
