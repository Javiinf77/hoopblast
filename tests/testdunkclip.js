// mates: distancia mínima de cabeza, tronco y manos al aro (anillo) y al tablero; y flexión del codo en el molino
const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("console.log('modo'")[0];
eval(base + `
const V=d.human.pos.constructor; const wp=(o,x,y,z)=>{ const v=new V(x||0,y||0,z||0); o.localToWorld(v); return v; };
const rim=w.__rim ? w.__rim() : null;
for (const n of ['Una mano','Dos manos','Tomahawk','Molino','360','Reverso']) {
  const b=[...w.document.querySelectorAll('#animList button')].find(x=>x.textContent===n); b.click(); $('animPause').click(); const h=d.human, r=h.rig;
  let minRing=9, minBoard=9, maxBend=0, what='';
  for(let f=1; f<180; f++){ $('animStep').click(); if(!h.dunkSeq) continue; const c=h.dunkSeq.rim, R=0.28;
    const pts={cabeza:wp(r.head,0,0.2,0), pecho:wp(r.torso,0,0.3,0), cadera:wp(r.hips), manoI:wp(r.armL.wrist), manoD:wp(r.armR.wrist), codoI:wp(r.armL.elbow), codoD:wp(r.armR.elbow)};
    const bx = c.x + Math.sign(c.x)*0.4;   // tablero ~0,4 m detrás del centro del aro
    for(const [k,p] of Object.entries(pts)){ const dh=Math.hypot(p.x-c.x,p.z-c.z), dRing=Math.hypot(dh-R, p.y-c.y); const pr = k.startsWith('mano') ? 0.06 : k==='cabeza' ? 0.22 : 0.17;
      if(dRing-pr<minRing && !k.startsWith('mano')){ minRing=dRing-pr; what=k+' f'+f; }
      const db=(bx-p.x)*Math.sign(c.x); if(p.y>2.6 && db-pr<minBoard) minBoard=db-pr; }
    for(const arm of [r.armL,r.armR]){ const s=wp(arm.shoulder), e=wp(arm.elbow), wr=wp(arm.wrist); const u=e.clone().sub(s).normalize(), v=wr.clone().sub(e).normalize(); maxBend=Math.max(maxBend, Math.acos(Math.max(-1,Math.min(1,u.dot(v))))*180/Math.PI); } }
  console.log(n.padEnd(10), '| cuerpo-aro mín', minRing.toFixed(2), 'm ('+what+') | hasta el tablero', minBoard.toFixed(2), 'm | codo máx', maxBend.toFixed(0)+'°'); }
`);
