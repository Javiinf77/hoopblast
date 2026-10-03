let src=require('fs').readFileSync(require('path').join(__dirname,'testblock.js'),'utf8').split('// 1) tiro del rival')[0].replace(/process\.env\.HOOPBLAST\|\|[^)]*\)/,"require('path').join(__dirname,'..','index.html')").replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')");
eval(src + `
const V=h.pos.constructor;
// defensa: el rival bota hacia ti; tú en postura (clic derecho) o sin ella
function defTrial(stance){ d.state='play'; for(const p of d.players) p.inbounding=false;
  r.pos.set(8,0,0.2); r.vel.set(0,0,0); r.stunT=0; r.move=null; r.cutT=9; r.stamina=1; d.ball.holder=r; r.attackSide=1; r.hand=1; for(const k in r.moveCd) r.moveCd[k]=99; for(const k in r.pend) r.pend[k]=k==='move'?null:false;
  h.pos.set(9,0,0); h.vel.set(0,0,0); h.stunT=0; h.stamina=1;
  ctl.set(r,{move:new V(1,0,0.25).normalize(),sprint:false,shootHold:false});
  const cv=w.document.querySelector('#stage canvas'); if(stance) cv.dispatchEvent(new w.MouseEvent('mousedown',{button:2,bubbles:true}));
  const x0=r.pos.x; let mx=0; for(let i=0;i<120;i++){ run(1/120); mx=Math.max(mx, Math.hypot(r.vel.x,r.vel.z)); } const sp=(r.pos.x-x0), n=1; console.log('    (vel. máx',mx.toFixed(2),'| move',r.move&&r.move.type,'| burst',r.burstT.toFixed(2),')');
  if(stance) w.dispatchEvent(new w.MouseEvent('mouseup',{button:2}));
  return (sp/n).toFixed(2)+' m en 1 s'; }
console.log('avance del atacante contra ti: sin postura', defTrial(false), '| con postura', defTrial(true));
// poste: tú atacas de espaldas y empujas; el rival en postura (IA) o quieto sin postura
function postTrial(defStance){ d.state='play'; const rim=d.hoops[1].rimC;
  h.pos.set(rim.x-4.5,0,0.3); h.vel.set(0,0,0); h.stamina=1; h.exhausted=false; h.move=null; d.ball.holder=h; h.attackSide=1;
  r.pos.set(rim.x-3.6,0,0.3); r.vel.set(0,0,0); r.stamina=1; r.stunT=0; r.stance=false; r.noStance=!defStance;
  ctl.set(r,{move:new V(),sprint:false,shootHold:false,stance:defStance});
  const cv=w.document.querySelector('#stage canvas'); cv.dispatchEvent(new w.MouseEvent('mousedown',{button:2,bubbles:true}));
  const rx0=r.pos.x; const key=(c,dn=true)=>w.dispatchEvent(new w.KeyboardEvent(dn?'keydown':'keyup',{code:c}));
  key('KeyW'); for(let i=0;i<240;i++) run(1/120); key('KeyW',false); w.dispatchEvent(new w.MouseEvent('mouseup',{button:2}));
  return 'defensor hundido '+(r.pos.x-rx0).toFixed(2)+' m | tu energía '+Math.round(h.stamina*100)+'% | la suya '+Math.round(r.stamina*100)+'%'; }
console.log('poste 2 s empujando, defensor SIN postura:', postTrial(false));
console.log('poste 2 s empujando, defensor CON postura:', postTrial(true));
`);
