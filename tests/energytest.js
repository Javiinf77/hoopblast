const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({players});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const key=(code,down=true)=>w.dispatchEvent(new w.KeyboardEvent(down?'keydown':'keyup',{code}));
run(0.5); w.document.getElementById('play').click(); run(3.2);
const h=w.__dbg().players[0];
const log=(l)=>console.log(l.padEnd(22), (h.stamina*100).toFixed(0).padStart(3)+'%', h.exhausted?'AGOTADO':'', 'vel', Math.hypot(h.vel.x,h.vel.z).toFixed(1), w.document.getElementById('estate').textContent);
const keepIn=()=>{h.pos.x=Math.max(-15,Math.min(15,h.pos.x)); h.pos.z=0;};
function hold(sec,label){ for(let t=0;t<sec;t+=0.5){ run(0.5); keepIn(); } log(label); }
key('KeyW'); key('ShiftLeft'); hold(2,'sprint 2s'); hold(2,'sprint 4s'); hold(2,'sprint 6s (sigue)'); hold(2,'forzando agotado 8s');
key('ShiftLeft',false); hold(4,'corre agotado +4s');
key('KeyW',false); hold(2,'quieto 2s'); hold(3,'quieto 5s'); hold(3,'quieto 8s');
key('KeyW'); hold(6,'corre normal 6s'); hold(10,'corre normal 16s'); hold(15,'corre normal 31s');
key('KeyW',false); hold(3,'quieto 3s');
h.stamina=0.5; h.exhausted=false; key('KeyW'); hold(3,'mover normal 3s desde 50%'); key('ShiftLeft'); hold(2,'sprint 2s'); key('ShiftLeft',false); hold(2,'soltar sprint 2s'); key('KeyW',false);
