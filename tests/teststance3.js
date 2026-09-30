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
const h=d.players[0]; const sp=()=>Math.hypot(h.vel.x,h.vel.z).toFixed(2);
function reset(hold){ h.pos.set(0,0,0); h.vel.set(0,0,0); h.move=null; h.stunT=0; h.stamina=1; h.exhausted=false; for(const k in h.moveCd) h.moveCd[k]=0; d.camYaw=-Math.PI/2; h.yaw=Math.PI/2; d.ball.pass=null; d.ball.guide=null; if(hold){ d.ball.holder=h; } }
// R1 esprinta
reset(true); pad.axes=[0,-1,0,0]; run(1); const v1=sp(); btn(5,true); run(1); console.log('correr', v1, '| R1 sprint', sp()); 
// L2 corriendo con balón = parada en seco
btn(5,false); run(0.5); btn(6,true); pad.buttons[6].value=1; run(1/60); run(1/60); console.log('L2 al correr con balón -> velocidad', sp(), 'postura', h.stance); run(1); console.log('en postura ofensiva moviéndose ->', sp()); btn(6,false); pad.buttons[6].value=0; pad.axes=[0,0,0,0]; run(0.5);
// sin L2: el stick derecho no regatea (mueve cámara)
reset(true); run(0.3); const cy=d.camYaw; pad.axes=[0,0,-1,0]; run(2/60); pad.axes=[0,0,0,0]; run(2/60); console.log('RS con balón sin L2 -> regate:', h.move?h.move.type:'ninguno', '| cámara movida', Math.abs(d.camYaw-cy)>0.01); run(0.5);
// con L2: mapa NBA 2K (balón en mano derecha / izquierda)
function flick(x,y,hand){ reset(true); h.hand=hand; run(0.2); btn(6,true); pad.buttons[6].value=1; run(2/60); pad.axes=[0,0,x,y]; run(3/60); pad.axes=[0,0,0,0]; run(2/60); const r=h.move?h.move.type+' (lado '+h.move.side+')':'ninguno'; btn(6,false); pad.buttons[6].value=0; run(0.9); return r; }
for(const hand of [1,-1]){ console.log('— balón en mano', hand>0?'derecha':'izquierda');
  for(const [n,x,y] of [['↑',0,-1],['→',1,0],['↖',-0.7,-0.7],['←',-1,0],['↙',-0.7,0.7],['↓',0,1]]) console.log('  L2 + RS', n, '->', flick(x,y,hand)); }
// girar el stick = giro
reset(true); run(0.2); btn(6,true); pad.buttons[6].value=1; run(2/60); const pts=[[1,0],[0.7,0.7],[0,1],[-0.7,0.7],[-1,0]]; for(const [x,y] of pts){ pad.axes=[0,0,x,y]; run(1/60);} pad.axes=[0,0,0,0]; run(2/60); console.log('L2 + girar RS ->', h.move?h.move.type:'ninguno'); btn(6,false); pad.buttons[6].value=0; run(1);
// teclado: regate sin postura / con postura (clic derecho)
reset(true); run(0.3); key('KeyF'); key('KeyF',false); run(1/60); console.log('teclado F sin postura ->', h.move?h.move.type:'ninguno'); run(0.5);
reset(true); run(0.3); const cv=w.document.querySelector('#stage canvas'); cv.dispatchEvent(new w.MouseEvent('mousedown',{button:2,bubbles:true})); run(2/60); key('KeyF'); key('KeyF',false); run(1/60); console.log('teclado clic der. + F ->', h.move?h.move.type:'ninguno'); w.dispatchEvent(new w.MouseEvent('mouseup',{button:2}));
