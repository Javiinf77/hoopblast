// comprueba que ni el balón ni los antebrazos atraviesan el tronco, y que el pie de eje del giro no se mueve
const base=require('fs').readFileSync('testanim.js','utf8').split("console.log('modo'")[0];
eval(base + `
const V=d.human.pos.constructor;
const wp=(o,x,y,z)=>{ const v=new V(x||0,y||0,z||0); o.localToWorld(v); return v; };
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
function check(name){ pick(name).click(); $('animPause').click(); const h=d.human, r=h.rig; let minBall=9, minArm=9, fB=0, fA=0, info='';
  const total=Math.round(d.ANIMS[d.ANIM.cur].dur*60);
  for(let f=1; f<total-2; f++){ $('animStep').click();
    // eje del tronco: de la cadera al cuello
    const a=wp(r.hips,0,0,0), b=wp(r.torso,0,0.5,0);
    const segD=(p)=>{ const ab=b.clone().sub(a), t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq())); return p.distanceTo(a.clone().addScaledVector(ab,t)); };
    if(d.ball.holder===h && f>8){ const db=segD(d.ball.pos); if(db<minBall){minBall=db;fB=f;} }
    for(const arm of [r.armL,r.armR]){ for(let s=0;s<=1;s+=0.25){ const e=wp(arm.elbow), wr=wp(arm.wrist); const pnt=e.clone().lerp(wr,s); const da=segD(pnt); if(da<minArm){minArm=da;fA=f; const dx=pnt.x-h.pos.x, dz=pnt.z-h.pos.z, psi=h.yaw+h.spinAngle; info=(arm===r.armL?'izq':'der')+' s='+s+' lat(der+)='+(-(dx*Math.cos(psi)-dz*Math.sin(psi))).toFixed(2)+' fw='+(dx*Math.sin(psi)+dz*Math.cos(psi)).toFixed(2)+' y='+(pnt.y-h.pos.y).toFixed(2)+' k='+(h.move?(h.move.t/h.move.dur).toFixed(2):'-');} } }
  }
  return 'balón-tronco mín '+minBall.toFixed(2)+' (f'+fB+')  antebrazo-tronco mín '+minArm.toFixed(2)+' (f'+fA+') '+info;
}
for(const n of ['Por la espalda con bote (der. → izq.)','Por la espalda con bote (izq. → der.)','Por la espalda sin bote (der. → izq.)','Por la espalda sin bote (izq. → der.)','Giro (der. → izq.)','Giro (izq. → der.)','Giro de poste (hacia la derecha)','Giro de poste (hacia la izquierda)','Paso atrás','Cruce','Entre las piernas','Cruce explosivo']) console.log(n.padEnd(40), check(n));
// pie de eje del giro: posición del pie izquierdo durante la rotación
pick('Giro (der. → izq.)').click(); $('animPause').click(); const r=d.human.rig; let pts=[];
for(let f=1; f<130; f++){ $('animStep').click(); if(d.human.move && d.human.move.type==='spin'){ const k=d.human.move.t/d.human.move.dur; if(k>0.25&&k<0.85){ const ft=wp(r.legL.ankle); pts.push(ft); } } }
let maxDev=0; for(const p of pts) maxDev=Math.max(maxDev, Math.hypot(p.x-pts[0].x,p.z-pts[0].z));
console.log('Giro der.→izq.: desplazamiento máximo del pie de eje (izquierdo) durante la rotación', (maxDev*100).toFixed(1)+' cm', 'en', pts.length, 'fotogramas');
`);
