let src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
src=src.replace("window.__dbg=()=>({","window.__dbg=()=>({get contestMark(){return contestMark}, get contestRing(){return contestRing},");
eval(src + `
// 1) doble Mayús: sobresfuerzo con balón y sin balón
function dbl(){ key('ShiftLeft'); key('ShiftLeft',false); run(0.08); key('ShiftLeft'); key('ShiftLeft',false); run(1/60); }
h.pos.set(rim.x-9,0,0); h.vel.set(0,0,0); h.dash=3; d.ball.holder=h; run(0.2); key('KeyW'); run(0.4); const c0=h.dash; dbl(); let mx=0; for(let i=0;i<30;i++){ run(1/60); mx=Math.max(mx,Math.hypot(h.vel.x,h.vel.z)); } key('KeyW',false);
console.log('doble Mayús con balón: cargas', c0.toFixed(1),'→',h.dash.toFixed(1),'| velocidad máx', mx.toFixed(1),'m/s'); run(0.5);
d.ball.holder=null; d.ball.pos.set(0,-5,0); h.pos.set(rim.x-9,0,2); run(0.2); key('KeyW'); run(0.4); const c1=h.dash; dbl(); mx=0; for(let i=0;i<30;i++){ run(1/60); mx=Math.max(mx,Math.hypot(h.vel.x,h.vel.z)); } key('KeyW',false);
console.log('doble Mayús sin balón: cargas', c1.toFixed(1),'→',h.dash.toFixed(1),'| velocidad máx', mx.toFixed(1),'m/s'); run(0.5);
// 2) cerrar el rebote: modo defensa; el rival detrás de ti va a por el rebote
key('KeyP'); key('KeyP',false); run(0.2); key('KeyP'); key('KeyP',false); run(0.3);
const r=d.players[3]; w.__noai=false;
function rebTrial(box){ d.ball.holder=null; d.ball.shot={team:1,shooter:r,from3:false,dunk:false}; d.ball.pos.set(rim.x-0.2,4.2,0); d.ball.vel.set(0,1,0);
  h.pos.set(rim.x-2.2,0,0); h.vel.set(0,0,0); h.stunT=0; r.pos.set(rim.x-3.1,0,0); r.vel.set(0,0,0); r.stunT=0; r.reactT=0;
  if(box) rmb(true); const r0=r.pos.x; for(let i=0;i<36;i++) run(1/60); const adv=r.pos.x-r0; if(box) rmb(false); return 'el rival avanza hacia el aro '+adv.toFixed(2)+' m en 0,6 s | cerrando: '+h.boxout; }
console.log('rebote SIN cerrar :', rebTrial(false));
console.log('rebote CERRANDO   :', rebTrial(true));
// 3) punteo visible
r.pos.set(rim.x-7,0,0); d.ball.holder=r; r.vel.set(0,0,0); h.pos.set(rim.x-6,0,0); rmb(true); key('ArrowDown'); run(0.2);
console.log('punteo visible: halo en la mano', d.contestMark.visible, '| diana sobre el rival', d.contestRing.visible, '| color diana', '#'+d.contestRing.material.color.getHexString());
key('ArrowDown',false); rmb(false);
`);
