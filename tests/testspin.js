const base=require('fs').readFileSync('testanim.js','utf8').split("console.log('modo'")[0];
eval(base + `
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
for (const n of ['Giro (der. → izq.)','Giro (izq. → der.)','Diagonal izq. → Giro → diagonal der.']) { pick(n).click(); $('animPause').click(); const h=d.human; let p0=null, p1=null;
  for(let f=1; f<160; f++){ $('animStep').click(); if(h.move && h.move.type==='spin' && !p0) p0=h.pos.clone(); if(p0 && !h.move && !p1) p1=h.pos.clone(); }
  const dx=p1.x-p0.x, dz=p1.z-p0.z; console.log(n.padEnd(38), 'desplazamiento durante el giro', Math.hypot(dx,dz).toFixed(2),'m | hacia', (Math.atan2(dz,dx)*180/Math.PI).toFixed(0)+'° (0° = canasta, + = derecha)'); }
`);
