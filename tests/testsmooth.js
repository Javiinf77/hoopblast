const base=require('fs').readFileSync('testanim.js','utf8').split("console.log('modo'")[0];
eval(base + `
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
function measure(name, frames){ pick(name).click(); $('animPause').click(); let prevYaw=d.human.yaw, prevB=d.ball.pos.clone(), maxYaw=0, maxBall=0, at=0, atB=0, caught=-1;
  for(let f=1; f<=frames; f++){ $('animStep').click(); const h=d.human; const dy=Math.abs(Math.atan2(Math.sin(h.yaw-prevYaw),Math.cos(h.yaw-prevYaw))); if(dy>maxYaw){maxYaw=dy; at=f;} const db=d.ball.pos.distanceTo(prevB); if(d.ball.holder===h && db>maxBall && f>2){maxBall=db; atB=f;} if(caught<0 && d.ball.holder===h) caught=f; prevYaw=h.yaw; prevB=d.ball.pos.clone(); }
  return {maxYawDeg:(maxYaw*180/Math.PI).toFixed(1), at, maxBallCm:(maxBall*100).toFixed(1), atB, caught, rebT:d.human.rebT}; }
console.log('Cruce: giro máximo por fotograma / salto máx. del balón', JSON.stringify(measure('Cruce', 100)));
console.log('Entre las piernas', JSON.stringify(measure('Entre las piernas', 100)));
const r=measure('Rebote (salto y captura)', 70); console.log('Rebote: capturado en el fotograma', r.caught, '| en el aire al cogerlo', d.human.pos.y>0 || 'ver');
pick('Rebote (salto y captura)').click(); $('animPause').click(); for(let f=0;f<150;f++){ $('animStep').click(); if(f%15==0) console.log('  f',f,'y jugador',d.human.pos.y.toFixed(2),'balón',d.ball.pos.y.toFixed(2),'lo tiene',d.ball.holder===d.human,'rebT',d.human.rebT.toFixed(2)); }
`);
