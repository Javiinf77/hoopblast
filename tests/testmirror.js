const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("console.log('modo'")[0];
eval(base + `
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
const deg=(x,z)=>(Math.atan2(z,x)*180/Math.PI).toFixed(0);
for (const nm of ['Cruce','Espalda','Giro']) { pick('Diagonal izq. → '+nm+' → diagonal der.').click(); $('animPause').click(); const hh=d.human; let before='', after='';
  for(let f=1; f<160; f++){ $('animStep').click(); if(f===38) before=deg(hh.vel.x,hh.vel.z); if(f===140) after=deg(hh.vel.x,hh.vel.z); }
  console.log(nm.padEnd(8), '| rumbo antes (0° = hacia la canasta, − = izquierda):', before+'°', '| después:', after+'°', '| stick sigue en diagonal izquierda'); }
`);
