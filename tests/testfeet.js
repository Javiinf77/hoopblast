const base=require('fs').readFileSync('testanim.js','utf8').split("console.log('modo'")[0];
eval(base + `
const V=d.human.pos.constructor; const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
function low(name){ pick(name).click(); $('animPause').click(); const h=d.human, r=h.rig; let mn=9, f0=0; const tot=Math.round(d.ANIMS[d.ANIM.cur].dur*60);
  for(let f=1; f<tot-2; f++){ $('animStep').click(); for(const leg of [r.legL,r.legR]){ const a=new V(); leg.ankle.getWorldPosition(a); if(a.y<mn){mn=a.y;f0=f;} } }
  return 'tobillo más bajo '+mn.toFixed(3)+' m (f'+f0+')'; }
for(const n of ['Reposo','Correr','Paso atrás + tiro','Paso lateral a la derecha + tiro','Paso lateral a la izquierda + tiro','Eurostep por la derecha','Cruce','Giro (der. → izq.)','Retroceso con bote','Por la espalda con bote (der. → izq.)','Postura defensiva (L2)']) console.log(n.padEnd(36), low(n));
`);
