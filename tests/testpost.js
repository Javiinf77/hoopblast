const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(process.env.HOOPBLAST||require('path').join(__dirname,'..','index.html'),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get human(){return human},players,ball,hoops,shoot,shotWindow,TR,get live(){return live}});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<Math.round(sec*60);i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERR',e.stack.split('\n').slice(0,3).join(' | '));process.exit(1)} } } }
const key=(c,dn=true)=>w.dispatchEvent(new w.KeyboardEvent(dn?'keydown':'keyup',{code:c}));
const cv=()=>w.document.querySelector('#stage canvas');
const rmb=(dn)=>{ if(dn) cv().dispatchEvent(new w.MouseEvent('mousedown',{button:2,bubbles:true})); else w.dispatchEvent(new w.MouseEvent('mouseup',{button:2})); };
run(0.5); w.document.getElementById('train').click(); run(1);
const d=w.__dbg(), h=d.human, rim=d.hoops[1].rimC;
console.log('Ventana verde por distancia (sin defensa):', [2,3.5,5,6.75,8,9,11].map(x=>x+' m '+d.shotWindow(h,x,'jump').toFixed(3)).join(' · '));
// aciertos con un pequeño error fijo de sincronización (+0,04) a cada distancia
for(const err of [0, 0.04]){ const res=[]; for(const dist of [3,5,6.75,8,9]){ let m=0; for(let k=0;k<6;k++){ const a=(k-2.5)*0.25; h.pos.set(rim.x-Math.cos(a)*dist,0,Math.sin(a)*dist); h.vel.set(0,0,0); h.onGround=true; d.ball.holder=h; d.ball.pos.set(h.pos.x,2.3,h.pos.z); d.TR.pending=false; h.charge=0.8+err; const m0=d.TR.made; d.shoot(h); run(2.4); if(d.TR.made>m0) m++; } res.push(dist+'m '+m+'/6'); } console.log('error de sincronización', err, '->', res.join(' · ')); }
// rival de práctica
key('KeyP'); key('KeyP',false); run(0.2); console.log('P -> rival activo', d.TR.rival, '| jugadores en pista', d.live.length);
// poste: de espaldas cerca del aro con el rival entre tú y el aro
const r=d.players[3];
function setupPost(){ h.pos.set(rim.x-3.6,0,0.3); h.vel.set(0,0,0); h.stunT=0; h.move=null; h.stamina=1; for(const k in h.moveCd) h.moveCd[k]=0; d.ball.holder=h; d.ball.pass=null; r.pos.set(rim.x-2.6,0,0.3); r.vel.set(0,0,0); r.stunT=0; r.reactT=0; r.swipeCd=5; r.blockCd=5; }
setupPost(); run(0.1); rmb(true); run(0.3); console.log('clic der. junto al rival -> poste', h.post, '| mira de espaldas al aro', Math.abs(Math.atan2(Math.sin(h.yaw - (-Math.PI/2)),Math.cos(h.yaw-(-Math.PI/2)))) < 0.6);
const rx0=r.pos.x, hx0=h.pos.x; key('KeyW'); run(1.0); key('KeyW',false); console.log('W (hacia el aro, de espaldas): avanzas', (h.pos.x-hx0).toFixed(2), 'm y el defensor se desplaza', (r.pos.x-rx0).toFixed(2),'m (empujado)');
key('KeyG'); run(0.68); console.log('mantener G -> cargando', h.charging, 'tipo', h.shotKind); key('KeyG',false); run(0.4); console.log('soltar -> lanzamiento', !d.ball.holder, '| animación', h.throwKind); run(2.5);
setupPost(); run(0.1); rmb(true); run(0.3); key('KeyC'); run(0.68); key('KeyC',false); run(0.05); const vx=h.vel.x; run(0.35); console.log('fadeaway: salta hacia atrás (vel x '+vx.toFixed(1)+') | animación', h.throwKind); run(2.5);
setupPost(); run(0.1); rmb(true); run(0.3); key('KeyD'); key('KeyF'); key('KeyF',false); run(1/60); console.log('F en el poste ->', h.move && h.move.type); key('KeyD',false); run(1); rmb(false);
key('KeyP'); key('KeyP',false); run(0.2); console.log('P otra vez -> rival', d.TR.rival, '| jugadores', d.live.length);
