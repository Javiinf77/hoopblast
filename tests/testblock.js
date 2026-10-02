const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync('/mnt/user-data/outputs/hoopblast.html','utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__shoot=(p)=>shoot(p); window.__dbg=()=>({get state(){return state}, set state(v){state=v}, setScoredT(){stateT=99},players,ball,hoops,startDunk,get stats(){return stats},get score(){return score},get live(){return live}, set live(v){live=v}});");
script=script.replace("const frames = live.map(p => p === human ? hf : mode === 'anim' ? (ANIM.npc.get(p) || ANIM.idle) : aiThink(p, gdt));","const frames = live.map(p => p.isHuman ? humanFrameInput() : (window.__ctl && window.__ctl.get(p)) || { move: new V3(), sprint:false, shootHold:false });");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<Math.round(sec*120);i++){ tnow+=1000/120; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
run(0.3); w.document.getElementById('play').click(); run(4);
const d=w.__dbg(), h=d.players[0], r=d.players[3];
for(const p of d.players.slice(1)) if(p!==r) p.pos.set(0,0,-11.5);
d.live=[h,r];
const click=()=>{ w.dispatchEvent(new w.MouseEvent('mousedown',{})); };
// helper: el canvas recibe mousedown
const cv=w.document.querySelector('#stage canvas');
const press=()=>{ cv.dispatchEvent(new w.MouseEvent('mousedown',{button:0,bubbles:true})); w.dispatchEvent(new w.MouseEvent('mouseup',{button:0})); };
const ctl=new Map(); w.__ctl=ctl;
// 1) tiro del rival: el rival carga hasta 0.8 y suelta; el humano pulsa con distinto adelanto respecto al lanzamiento
function shotTrial(lead){
  const V=h.pos.constructor; d.state='play'; for(const p of d.players){p.inbounding=false;} r.stamina=1; h.stamina=1; r.exhausted=h.exhausted=false; h.blockMissLand=false;
  r.pos.set(8,0,0); r.vel.set(0,0,0); r.onGround=true; r.yaw=Math.PI/2; r.attackSide=1; r.charging=false; r.charge=0; r.shotT=0; r.stunT=0;
  h.pos.set(8+(w.__gap||1.0),0,0); h.vel.set(0,0,0); h.onGround=true; h.yaw=-Math.PI/2; h.blockCd=0; h.blockT=0; h.stunT=0; h.missT=0; h.blockMissLand=false;
  d.ball.holder=r; d.ball.shot=null; d.ball.guide=null; d.ball.pass=null; d.ball.pos.set(8.4,1,0);
  const b0=d.stats[0].blocks;
  // el rival mantiene tiro ~0.68 s (carga 0.8), luego salto 0.16 s y suelta
  const hold=0.68, release=hold+0.16;
  let t=0, pressed=false;
  ctl.set(r,{move:new V(),sprint:false,shootHold:true});
  while(t<2.5){ if(t>=hold) ctl.set(r,{move:new V(),sprint:false,shootHold:false}); if(!pressed && t>=release-lead){ press(); pressed=true; } run(1/120); t+=1/120; }
  return d.stats[0].blocks>b0;
}
for(const gap of [1.0,1.4]){ w.__gap=gap; console.log('distancia',gap); for(const lead of [0.45,0.36,0.3,0.24,0.18,0.12,0.06,0,-0.08]){ let ok=0; for(let i=0;i<4;i++) if(shotTrial(lead)) ok++; console.log('  pulsar',lead.toFixed(2),'s antes de soltar ->',ok+'/4'); } }
console.log('tras fallar, stun al aterrizar:', (()=>{ shotTrial(0.9); return h.missT>0 || h.stunT>0 || 'visto antes'; })());
// 2) mates
const rimB=d.hoops[0].rimC; // el rival ataca el aro 0 (x negativa)
for(const type of ['one','two','windmill','spin360']){ let blk=0, post=0;
  for(let i=0;i<8;i++){
    d.state='play'; for(const p of d.players){p.inbounding=false;} r.stamina=1; h.stamina=1; r.exhausted=h.exhausted=false; h.blockMissLand=false; h.dunkSeq=null;
    r.pos.set(rimB.x+2.8,0,0.2); r.vel.set(-6,0,0); r.onGround=true; r.stunT=0; r.dunkSeq=null; d.ball.holder=r; d.ball.pos.set(r.pos.x,1,0.2); ctl.set(r,{move:new r.pos.constructor(),sprint:false,shootHold:false});
    h.pos.set(rimB.x+0.9,0,0); h.vel.set(0,0,0); h.onGround=true; h.yaw=-Math.PI/2; h.blockCd=0; h.blockT=0; h.stunT=0; h.missT=0;
    const b0=d.stats[0].blocks; d.startDunk(r,type,false); run(r.dunkSeq.rise*0.35); press(); run(2.5);
    if(d.stats[0].blocks>b0) blk++; else if(h.stunT>0||h.missT===0) post++;
  }
  console.log('mate',type,'taponados',blk+'/8');
}
