const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("console.log('modo'")[0];
eval(base + `
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
pick('Paso atrás + tiro').click(); $('animPause').click(); const hh=d.human; let x0=null, xEnd=null, shotF=-1, kind='', maxY=0, made=false;
for(let f=1; f<200; f++){ $('animStep').click(); if(hh.move && hh.move.type==='step' && x0===null) x0=hh.pos.x; if(hh.move && hh.move.type==='step') maxY=Math.max(maxY,hh.pos.y); if(x0!==null && !hh.move && xEnd===null) xEnd=hh.pos.x; if(shotF<0 && d.ball.shot && !d.ball.holder){ shotF=f; kind=hh.throwKind; } }
console.log('retroceso del paso atrás:', (x0-xEnd).toFixed(2),'m | altura del saltito', maxY.toFixed(2),'m | tiro automático en el fotograma', shotF, '('+kind+')');
`);
