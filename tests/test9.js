const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get state(){return state},set state(v){state=v},players,ball,TR,hoops,shoot,startDunk,pass,startMove,CFG,get live(){return live}, set live(v){live=v}, get mode(){return mode}, set mode(v){mode=v}, setTrainingVisible});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const key=(code,down=true)=>w.dispatchEvent(new w.KeyboardEvent(down?'keydown':'keyup',{code}));
run(0.3); w.document.getElementById('train').click(); run(1);
const d=w.__dbg(), h=d.players[0], rim=d.hoops[1].rimC;
function setup(x,z){ h.pos.set(x,0,z); h.vel.set(0,0,0); h.onGround=true; h.move=null; h.dunkSeq=null; h.shotT=0; h.charging=false; h.stunT=0; h.yaw=Math.atan2(rim.x-x,rim.z-z); d.ball.holder=h; d.ball.pass=null; d.ball.guide=null; d.ball.pos.set(x,2.2,z); d.ball.vel.set(0,0,0); d.TR.pending=false; }
// 1) tiros con carga exacta y con errores
function shotTest(ch){ let m=0,n=0; for(const dist of [3.5,5,7,9]) for(const a of [-0.8,0,0.8]){ setup(rim.x-Math.cos(a)*dist, Math.sin(a)*dist); d.ball.pos.set(h.pos.x,2.2,h.pos.z); h.charge=ch; const m0=d.TR.made; d.shoot(h); run(2.2); n++; if(d.TR.made>m0) m++; } return m+'/'+n; }
for(const ch of [0.55,0.68,0.74,0.8,0.86,0.92,1.05]) console.log('carga',ch,shotTest(ch));
// 2) mates de cada tipo
for(const type of ['one','two','tomahawk','windmill','spin360','reverse']){ let m=0; for(let k=0;k<3;k++){ setup(rim.x-2.8, (k-1)*0.8); h.vel.set(6,0,0); const m0=d.TR.made; d.startDunk(h,type,false); run(2.5); if(d.TR.made>m0) m++; } console.log('mate',type,m+'/3', 'dunkSeq cleared', h.dunkSeq===null, 'y', h.pos.y.toFixed(2)); }
// 3) teclas de mate reales: corriendo al aro y clic / F / R / X
for(const [code,sh] of [['KeyJ',false],['KeyF',false],['KeyR',false],['KeyX',false],['KeyJ',true],['KeyF',true]]){
  setup(rim.x-5,0); run(0.1); key('KeyW'); if(sh) key('ShiftLeft');
  // cámara mira +x por defecto en entrenamiento
  let started=false; for(let i=0;i<60 && !started;i++){ run(1/60); if(h.dunkSeq){started=true;break;} if(Math.hypot(rim.x-h.pos.x,rim.z-h.pos.z)<3.2){ key(code); key(code,false);} }
  key('KeyW',false); key('ShiftLeft',false); console.log('tecla',code,sh?'+Mayús':'','->', h.dunkSeq? h.dunkSeq.type : 'sin mate'); run(2.5);
}
// 4) regates
for(const code of ['KeyF','KeyG','KeyR','KeyX','KeyT','KeyC']){ setup(8,0); h.moveCd={cross:0,between:0,behind:0,spin:0,hesi:0,step:0}; h.stamina=1; run(0.2); key(code); key(code,false); run(0.05); console.log('regate',code, h.move? h.move.type:'ninguno'); run(1.2); }
