// Revisión de todas las animaciones: antebrazos y balón contra el tronco, codos (flexión y dirección) y pies contra el suelo
const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("console.log('modo'")[0];
eval(base + `
const V=d.human.pos.constructor; const wp=(o,x,y,z)=>{ const v=new V(x||0,y||0,z||0); o.localToWorld(v); return v; };
const rows=[];
for (const b of [...w.document.querySelectorAll('#animList button')]) { b.click(); $('animPause').click(); const h=d.human, r=h.rig; const tot=Math.round(d.ANIMS[d.ANIM.cur].dur*60);
  let fa=9, bt=9, ank=9, bend=0;
  for(let f=1; f<tot-2; f++){ $('animStep').click(); if(f<8) continue;
    const a=wp(r.hips), bb=wp(r.torso,0,0.5,0), ab=bb.clone().sub(a);
    const segD=(p)=>{ const t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq())); return p.distanceTo(a.clone().addScaledVector(ab,t)); };
    for(const arm of [r.armL,r.armR]){ const s=wp(arm.shoulder), e=wp(arm.elbow), wr=wp(arm.wrist);
      fa=Math.min(fa, segD(e.clone().lerp(wr,0.5)), segD(wr));
      const u=e.clone().sub(s).normalize(), v=wr.clone().sub(e).normalize(); bend=Math.max(bend, Math.acos(Math.max(-1,Math.min(1,u.dot(v))))*180/Math.PI); }
    if(d.ball.holder===h) bt=Math.min(bt, segD(d.ball.pos));
    for(const l of [r.legL,r.legR]){ const p=new V(); l.ankle.getWorldPosition(p); ank=Math.min(ank,p.y); } }
  rows.push([b.textContent, fa, bt, ank, bend]); }
const bad=rows.filter(([n,fa,bt,ank,bend])=>fa<0.15||bt<0.22||ank<0.045||bend>150);
console.log('animaciones revisadas:', rows.length, '| con problemas:', bad.length);
for(const [n,fa,bt,ank,bend] of bad) console.log('  ', n.padEnd(40), 'antebrazo-tronco', fa.toFixed(2), '| balón-tronco', bt>8?'-':bt.toFixed(2), '| tobillo', ank.toFixed(3), '| codo', bend.toFixed(0)+'°');
`);
