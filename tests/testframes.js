const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("console.log('modo'")[0];
eval(base + `
const pick=(name)=>[...w.document.querySelectorAll('#animList button')].find(b=>b.textContent===name);
// determinismo: avanzar a un fotograma, ir atrás y adelante, y comparar la pose y el balón
const snap=()=>{ const h=d.human, r=h.rig; return [h.pos.x,h.pos.y,h.pos.z,h.yaw,r.cur.torsoX,r.cur.aR.x,r.cur.aR.el,r.cur.aR.wr,d.ball.pos.x,d.ball.pos.y].map(v=>v.toFixed(5)).join(','); };
for (const name of ['Molino','Tiro en suspensión','Cruce explosivo','Tapón']) {
  pick(name).click(); $('animPause').click();
  for (let i=0;i<40;i++) $('animStep').click();
  const a=snap(), lbl=$('animTime').textContent;
  $('animStep').click(); $('animStep').click(); $('animBackF').click(); $('animBackF').click();
  const b=snap();
  $('animBackF').click(); $('animStep').click();
  const c=snap();
  if(a!==b) console.log('   A',a,' | B',b);
  console.log(name.padEnd(20), '|', lbl, '| tras +2 y -2 idéntico:', a===b, '| tras -1 y +1 idéntico:', a===c);
}
$('animPause').click(); run(1); console.log('reanudar: el contador avanza ->', $('animTime').textContent);
$('animBack').click(); run(0.3); $('play').click(); run(20); console.log('partido tras salir:', d.state, $('s0').textContent+'-'+$('s1').textContent, '| Math.random restaurado', Math.random !== undefined);
`);
