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
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get state(){return state},players,ball,hoops, get live(){return live}, set live(v){live=v},get camYaw(){return camYaw}, set camYaw(v){camYaw=v}, get inputMode(){return inputMode}});");
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
// 1) cruce sin explotar vs cruce + explosión
reset(); pad.axes=[0,-0.6,0,0]; run(0.6); flick(-0.7,-0.7); console.log('cruce ->', h.move&&h.move.type); run(0.35); console.log('  sin explotar, velocidad tras el cruce', sp());
reset(); pad.axes=[0,-0.6,0,0]; run(0.6); flick(-0.7,-0.7); run(0.26); pad.axes=[0,-1,0,0]; btn(5,true); run(2/60); console.log('  con explosión (LS + R1) ->', sp(), 'm/s | combos', comboDone()); run(0.4); console.log('  0,4 s después', sp()); btn(5,false);
// 2) combo cruce -> espalda (el segundo toque durante el cruce)
reset(); pad.axes=[0,-0.6,0,0]; run(0.6); flick(-0.7,-0.7); run(0.08); flick(-0.7,0.7); const seq=[h.move&&h.move.type]; run(0.2); seq.push(h.move&&h.move.type); run(0.3); pad.axes=[0,-1,0,0]; btn(5,true); run(2/60);
console.log('combo cruce→espalda: secuencia', seq.join(' → '), '| explosión', sp(), '| combos', comboDone()); btn(5,false); run(0.5);
// 3) entre las piernas -> explosión
reset(); pad.axes=[0,-0.6,0,0]; run(0.5); flick(-1,0); run(0.33); pad.axes=[0,-1,0,0]; btn(5,true); run(2/60); console.log('piernas → explosión', sp(), '| combos', comboDone()); btn(5,false); run(0.5);
// 4) parada falsa -> explosión
reset(); pad.axes=[0,-0.6,0,0]; run(0.5); flick(1,0); run(0.25); console.log('parada falsa: velocidad durante la parada', sp()); pad.axes=[0,-1,0,0]; btn(5,true); run(2/60); console.log('  explosión', sp(), '| combos', comboDone()); btn(5,false); run(0.5);
// 5) contra un defensor IA: correr recto vs regate + explosión
w.document.getElementById('quit').click(); run(0.3); w.document.getElementById('play').click(); run(4);
const r=d.players[3]; for(const p of d.players.slice(1)) if(p!==r) p.pos.set(0,0,-11.5); d.live=[h,r];

function duel(kind, diffName){
  let ok=0; const N=12;
  for(let i=0;i<N;i++){
    h.pos.set(4,0,0); h.vel.set(0,0,0); h.yaw=Math.PI/2; h.hand=1; h.move=null; h.nextMove=null; h.stamina=1; h.stunT=0; h.chain=[]; h.chainT=9; h.explodeWin=0; for(const k in h.moveCd) h.moveCd[k]=0; d.camYaw=-Math.PI/2; d.ball.holder=h;
    r.pos.set(5.3+0.05*i,0,0.08*(i-6)); r.vel.set(0,0,0); r.stunT=0; r.reactT=0; r.swipeCd=9; r.stamina=1; r.yaw=-Math.PI/2;
    pad.axes=[0,-0.7,0,0]; run(0.3);
    const fl={cross:[-0.7,-0.7], between:[-1,0], hesi:[1,0], inout:[0,-1]}[kind.split('+')[0]];
    if(fl){ flick(fl[0],fl[1]); run(kind.startsWith('hesi')?0.22:0.24); }
    if(kind.endsWith('+exp') || kind==='straight'){ pad.axes=[0,-1,0,0]; btn(5,true); } else { pad.axes=[0,-1,0,0]; }
    run(0.9); btn(5,false); pad.axes=[0,0,0,0];
    const rim=d.hoops[1].rimC; if(Math.hypot(r.pos.x-rim.x,r.pos.z-rim.z) > Math.hypot(h.pos.x-rim.x,h.pos.z-rim.z)+0.5) ok++;
    run(0.2);
  }
  return ok+'/'+N;
}


for(const kind of ['straight','cross','cross+exp','between+exp','hesi+exp','inout+exp']) console.log('  ', kind.padEnd(12), duel(kind));
