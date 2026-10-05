// tras tirar: tiempo clavado y velocidad en los primeros instantes después de aterrizar empujando el stick con R1
const src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
eval(src + `
h.pos.set(rim.x-6,0,0); h.vel.set(0,0,0); h.onGround=true; h.stamina=1; d.ball.holder=h; d.ball.shot=null; run(0.2);
key('KeyJ'); run(0.68); key('KeyJ',false); key('KeyS'); key('ShiftLeft');
let landT=-1, t=0, out=[]; while(t<1.6){ run(1/60); t+=1/60; if(landT<0 && h.onGround && !d.ball.holder && t>0.2) landT=t; if(landT>=0){ const dt=t-landT; if([0.1,0.2,0.3,0.4,0.55,0.8].some(x=>Math.abs(dt-x)<0.009)) out.push(dt.toFixed(2)+'s '+Math.hypot(h.vel.x,h.vel.z).toFixed(1)+'m/s'); } }
key('KeyS',false); key('ShiftLeft',false);
console.log('tras aterrizar del tiro (empujando el stick y con sprint):', out.join(' · '));
`);
