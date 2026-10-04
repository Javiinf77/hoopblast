// entrenamiento → P dos veces: el rival ataca y defiendes tú; se cuentan posesiones
const src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
eval(src + `
key('KeyP'); key('KeyP',false); run(0.2); key('KeyP'); key('KeyP',false); run(0.3);
const tr=w.__tr ? w.__tr() : null;
console.log('modo tras P×2:', w.document.getElementById('defpanel').hidden ? 'panel oculto' : 'panel de defensa visible', '| ¿tiene el balón el rival?', d.ball.holder===d.players[3]);
// tú quieto (no defiendes): el rival debería anotar a menudo
run(40); const txt=()=>['dStops','dAgainst','dSteals','dBlocks'].map(id=>id+'='+w.document.getElementById(id).textContent).join(' ');
console.log('40 s sin defender:', txt());
// ahora defiende "a tope": colocarse delante del rival con postura y robar a menudo
const r=d.players[3]; let t=0; rmb(true);
while(t<40){ const c=rim, dx=c.x-r.pos.x, dz=c.z-r.pos.z, l=Math.hypot(dx,dz)||1; h.pos.set(r.pos.x+dx/l*0.95, 0, r.pos.z+dz/l*0.95); if(Math.round(t*10)%7===0){ key('KeyE'); key('KeyE',false); } run(0.1); t+=0.1; }
rmb(false); console.log('40 s defendiendo pegado y robando:', txt());
key('KeyP'); key('KeyP',false); run(0.3); console.log('P otra vez -> sin rival:', d.live.length, 'jugador(es); balón tuyo', d.ball.holder===h);
`);
