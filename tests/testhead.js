// mide la distancia mínima del brazo izquierdo (codo→mano) al centro de la cabeza durante el tiro
const base=require('fs').readFileSync('testpost.js','utf8').split("console.log('Ventana")[0];
eval(base + `
const THREE_=require('three'); const V=h.pos.constructor;
const wp=(o,x,y,z)=>{ const v=new V(x||0,y||0,z||0); o.localToWorld(v); return v; };
function minDist(){ const r=h.rig; const hc=wp(r.head,0,0.2,0.02); let m=9;
  const e=wp(r.armL.elbow), wr=wp(r.armL.wrist), hand=wp(r.armL.wrist,0,-0.05,0);
  for(let t=0;t<=1;t+=0.1){ const p=e.clone().lerp(wr,t); m=Math.min(m,p.distanceTo(hc)); } m=Math.min(m,hand.distanceTo(hc)); return m; }
h.pos.set(11,0,0); h.vel.set(0,0,0); d.ball.holder=h; run(0.4);
key('KeyJ'); let worst=9, t=0; while(t<0.62){ run(1/60); t+=1/60; worst=Math.min(worst,minDist()); }
console.log('cargando: distancia mínima brazo izq.-centro cabeza', worst.toFixed(3));
key('KeyJ',false); worst=9; t=0; while(t<0.8){ run(1/60); t+=1/60; worst=Math.min(worst,minDist()); }
console.log('salto y remate: distancia mínima', worst.toFixed(3), '(la cabeza mide ~0,21 de radio)');
`);
