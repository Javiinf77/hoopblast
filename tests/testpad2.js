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
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get state(){return state},players,ball,hoops,get camYaw(){return camYaw}, set camYaw(v){camYaw=v}, get inputMode(){return inputMode}});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','navigator',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.navigator);
function run(sec){ for(let i=0;i<Math.round(sec*60);i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const key=(code,down=true)=>w.dispatchEvent(new w.KeyboardEvent(down?'keydown':'keyup',{code}));
const d=w.__dbg();
run(0.5);

w.document.getElementById('train').click(); run(1.5);
const h=d.players[0], rim=d.hoops[1].rimC;
for(const [name,bi,r2] of [['□',2,false],['△',3,false],['○',1,false],['✕',0,false],['R1+□',2,true],['R1+△',3,true]]){
  h.pos.set(rim.x-6,0,0); h.vel.set(0,0,0); h.dunkSeq=null; h.move=null; h.stunT=0; h.onGround=true; h.stamina=1; h.exhausted=false; d.camYaw=-Math.PI/2; d.ball.holder=h; d.ball.pass=null; d.ball.guide=null;
  pad.axes=[0,-1,0,0]; if(r2) btn(5,true);
  let pressed=false; for(let i=0;i<120 && !h.dunkSeq;i++){ run(1/60); if(!pressed && Math.hypot(rim.x-h.pos.x,rim.z-h.pos.z)<3.1){ btn(bi,true); run(1/60); btn(bi,false); pressed=true; } }
  pad.axes=[0,0,0,0]; btn(5,false);
  console.log('mando', name.padEnd(5), '->', h.dunkSeq? h.dunkSeq.type : 'sin mate'); run(2.5);
}
