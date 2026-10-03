// bandejas: % de acierto sin defensa desde distintas entradas, y que el balón sale de la mano cerca del aro
const src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
eval(src + `
const lay=(w.__lay = null);
let made=0, tot=0, rels=[];
for (const [ox,oz] of [[-2.3,0],[-2.0,1.0],[-2.0,-1.0],[-1.6,1.6],[-2.4,0.5],[-1.8,-0.6]]) for (let r=0;r<3;r++) {
  h.pos.set(rim.x+ox,0,oz); h.vel.set(2.4,0,0); h.onGround=true; h.move=null; h.stamina=1; h.charging=false; h.throwT=0; h.layupSeq=null; d.ball.holder=h; d.ball.shot=null; d.TR.pending=false; run(0.05);
  const m0=d.TR.made; key('KeyJ'); run(2/60); key('KeyJ',false);
  let relPos=null; for(let i=0;i<150;i++){ run(1/60); if(!relPos && !d.ball.holder && d.ball.shot){ relPos=d.ball.pos.clone(); } }
  tot++; if(d.TR.made>m0) made++; if(relPos) rels.push(Math.hypot(relPos.x-rim.x, relPos.z-rim.z).toFixed(2)+'m/'+relPos.y.toFixed(2));
}
console.log('bandejas sin defensa:', made+'/'+tot, '| balón soltado a (distancia horizontal al aro / altura):', rels.slice(0,8).join(' '));
`);
