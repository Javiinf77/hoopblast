const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get human(){return human},players,ball,pass,get live(){return live}, set live(v){live=v}});");
// congelar la IA para la prueba de pases
script=script.replace("const frames = live.map(p => p === human ? hf : aiThink(p, gdt));","const frames = live.map(p => p === human ? hf : (window.__noai ? { move: window.__mv && p===window.__mvP ? window.__mv : new V3(), sprint:false, shootHold:false } : aiThink(p, gdt)));");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }

run(0.3); w.document.getElementById('play').click(); run(4);
const d=w.__dbg(), P=d.players, key=(c,dn=true)=>w.dispatchEvent(new w.KeyboardEvent(dn?'keydown':'keyup',{code:c}));
const place=()=>{ P[0].pos.set(-6,0,0); P[1].pos.set(-6,0,-5); P[2].pos.set(-6,0,5); for(const p of P){p.vel.set(0,0,0); p.stunT=0;} for(const p of P.slice(3)) p.pos.set(12,0,-10+p.idx*2); d.ball.holder=d.human; d.ball.pass=null; };
w.__noai=true;
// cámara mira +x por defecto: D = derecha = +z
place(); run(0.1); const h0=d.human.idx; key('KeyD'); run(0.05); key('KeyQ'); key('KeyQ',false); run(0.05); key('KeyD',false);
let t=0; while(t<2 && d.ball.holder!==P[2] && d.ball.holder!==P[1]){ run(0.05); t+=0.05; }
console.log('apuntando a la derecha (D) + Q -> recibe el jugador', d.ball.holder && d.ball.holder.idx, '(z='+(d.ball.holder&&d.ball.holder.pos.z.toFixed(1))+') | ahora controlas al', d.human.idx);
place(); run(0.1); key('KeyA'); run(0.05); key('KeyQ'); key('KeyQ',false); run(0.05); key('KeyA',false);
t=0; while(t<2 && d.ball.holder===d.human){ run(0.05); t+=0.05; } t=0; while(t<2 && !d.ball.holder){ run(0.05); t+=0.05; }
console.log('apuntando a la izquierda (A) + Q -> recibe el jugador', d.ball.holder && d.ball.holder.idx, '(z='+(d.ball.holder&&d.ball.holder.pos.z.toFixed(1))+') | ahora controlas al', d.human.idx);
// defensa: el rival tiene el balón cerca del jugador 2; Q cambia al más cercano al balón
const r=P[3]; r.pos.set(-6,0,6.5); d.ball.holder=r; P[0].pos.set(5,0,0); P[1].pos.set(0,0,-6); P[2].pos.set(-6,0,4.5);
const hb=d.human.idx; key('KeyQ'); key('KeyQ',false); run(0.1);
console.log('defensa: Q cambia del jugador', hb, 'al', d.human.idx, '(el más cercano al balón es el 2)');
