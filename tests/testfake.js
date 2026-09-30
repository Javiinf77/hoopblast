const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
// mando falso
const pad={index:0,connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0})),vibrationActuator:{playEffect(){pad.rumbles++;}},rumbles:0};
w.navigator.getGamepads=()=>[pad];
const btn=(i,v)=>{pad.buttons[i].pressed=v; pad.buttons[i].value=v?1:0;};
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get stats(){return stats},get state(){return state},players,ball,hoops, get live(){return live}, set live(v){live=v},get camYaw(){return camYaw}, set camYaw(v){camYaw=v}, get inputMode(){return inputMode}});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','navigator',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.navigator);
function run(sec){ for(let i=0;i<Math.round(sec*60);i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const key=(code,down=true)=>w.dispatchEvent(new w.KeyboardEvent(down?'keydown':'keyup',{code}));
const d=w.__dbg();
run(0.5);

w.document.getElementById('train').click(); run(1.5);
const h=d.players[0]; const sp=()=>Math.hypot(h.vel.x,h.vel.z).toFixed(2);
function reset(){ h.pos.set(0,0,0); h.vel.set(0,0,0); h.move=null; h.nextMove=null; h.stunT=0; h.stamina=1; h.exhausted=false; h.hand=1; h.chain=[]; h.chainT=9; h.explodeWin=0; h.burstT=0; for(const k in h.moveCd) h.moveCd[k]=0; d.camYaw=-Math.PI/2; h.yaw=Math.PI/2; d.ball.holder=h; d.ball.pass=null; d.ball.guide=null; pad.axes=[0,0,0,0]; btn(5,false); }
const flick=(x,y)=>{ const ls=[pad.axes[0],pad.axes[1]]; pad.axes=[ls[0],ls[1],x,y]; run(3/60); pad.axes=[ls[0],ls[1],0,0]; run(1/60); };
const comboDone=()=>[...w.document.querySelectorAll('.combos span.done')].map(e=>e.dataset.c).join(',');

w.document.getElementById('quit').click(); run(0.3); w.document.getElementById('play').click(); run(4);
const r=d.players[3]; for(const p of d.players.slice(1)) if(p!==r) p.pos.set(0,0,-11.5); d.live=[h,r];
let bites=0, blocked=0, made=0; const N=12;
for(let i=0;i<N;i++){
  h.pos.set(9,0,0); h.vel.set(0,0,0); h.yaw=Math.PI/2; h.fakeCd=0; h.fakeT=0; h.stamina=1; h.stunT=0; d.camYaw=-Math.PI/2; d.ball.holder=h; d.ball.shot=null;
  r.pos.set(10.3,0,0); r.vel.set(0,0,0); r.stunT=0; r.reactT=0; r.blockCd=0; r.blockT=0; r.onGround=true; r.pos.y=0; r.swipeCd=9; r.yaw=-Math.PI/2;
  run(0.2); btn(2,true); run(0.1); btn(2,false); run(2/60);
  const fake=h.fakeT>0, jumped = r.blockT>0 || !r.onGround; if(jumped) bites++;
  run(0.2); btn(2,true); run(0.68); btn(2,false); run(0.3);
  const b0=d.stats? 0:0;
  run(1.5);
  if(i===0) console.log('amago activo tras toque corto:', fake);
}
console.log('amago de tiro vs defensor IA normal: picó y saltó', bites+'/'+N);
