const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
hh.pos.set(rim.x-6,0,0); hh.vel.set(0,0,0); hh.onGround=true; hh.move=null; for(const k in hh.moveCd) hh.moveCd[k]=0; hh.stamina=1; d.ball.holder=hh; run(0.3);
const x0=hh.pos.x; pad.axes=[0,0,0,1]; run(3/60); pad.axes=[0,0,0,0]; run(1/60);
const kind=hh.move&&hh.move.type; let minB=9; for(let i=0;i<40;i++){ run(1/60); minB=Math.min(minB,d.ball.pos.y); }
console.log('RS ↓ ->', kind, '| retroceso', (x0-hh.pos.x).toFixed(2), 'm | sigue con el balón', d.ball.holder===hh, '| botes (altura mín. del balón)', minB.toFixed(2), '| ventana de explosión', hh.explodeWin>0 || 'cerrada');
`);
