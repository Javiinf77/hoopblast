const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({players,ball,pass,get live(){return live}, set live(v){live=v}});");
// congelar la IA para la prueba de pases
script=script.replace("const frames = live.map(p => p === human ? hf : aiThink(p, gdt));","const frames = live.map(p => p === human ? hf : (window.__noai ? { move: window.__mv && p===window.__mvP ? window.__mv : new V3(), sprint:false, shootHold:false } : aiThink(p, gdt)));");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
run(0.3); w.document.getElementById('play').click(); run(4);
const d=w.__dbg(), h=d.players[0], m=d.players[1];
w.__noai=true;
for(const p of d.players.slice(2)) p.pos.set(0,0,-11.5);
d.live=[h,m];
const V=h.pos.constructor;
for(const type of ['chest','bounce','lob']) for(const [dist,mv] of [[6,0],[10,0],[14,0],[8,1],[12,1]]) {
  h.pos.set(-6,0,0); h.vel.set(0,0,0); m.pos.set(-6+dist*0.8,0,dist*0.6); m.vel.set(0,0,0); m.stunT=0; m.pickupCd=0;
  d.ball.holder=h; d.ball.pos.set(h.pos.x+0.3,1.2,h.pos.z); d.ball.vel.set(0,0,0); d.ball.pass=null; d.ball.shot=null;
  w.__mvP=m; w.__mv = mv ? new V(0,0,-1) : null;   // el receptor se mueve en perpendicular
  run(0.1); d.pass(h,m,false,type);
  let t=0; while(d.ball.holder!==m && t<4){ run(0.05); t+=0.05; }
  console.log(type.padEnd(7),'dist',dist,mv?'receptor corriendo':'receptor quieto','->', d.ball.holder===m? 'recibido en '+t.toFixed(2)+' s':'NO');
}
