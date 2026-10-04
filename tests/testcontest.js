// punteo: con postura y el stick (flechas) apuntando al tirador su franja verde se estrecha
let src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
src=src.replace("window.__dbg=()=>({","window.__dbg=()=>({contestAmount,");
eval(src.replace("script=script.replace(\"'use strict';\",\"'use strict'; window.__dbg=()=>({","script=script.replace(\"'use strict';\",\"'use strict'; window.__dbg=()=>({contestAmount,") + `
key('KeyP'); key('KeyP',false); run(0.2); key('KeyP'); key('KeyP',false); run(0.3);   // modo defensa
const r=d.players[3]; w.__noai=true;
function measure(arrow, dz){ r.pos.set(rim.x-7,0,dz||0); r.vel.set(0,0,0); d.ball.holder=r; r.charging=true; r.charge=0.3; r.shotKind='jump';
  h.pos.set(rim.x-5.9,0,0); h.vel.set(0,0,0); h.stunT=0;
  rmb(true); if(arrow) key(arrow); run(0.15); const k=(d.contestAmount||w.__dbg().contestAmount)(r); const win=d.shotWindow(r,7.1,'jump'); if(arrow) key(arrow,false); rmb(false); run(0.05); return 'punteo '+k.toFixed(2)+' | franja verde '+win.toFixed(4); }
console.log('postura sin apuntar        :', measure(null));
console.log('apuntando al tirador (↓)    :', measure('ArrowDown'));
console.log('apuntando al lado contrario (↑):', measure('ArrowUp'));
console.log('apuntando de lado (→)       :', measure('ArrowRight'));
`);
