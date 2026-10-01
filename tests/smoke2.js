const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
const C=w.__C={miss:0,swipes:0,moves:0,passes:0};
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get state(){return state},score,get stats(){return stats},players,ball});")
 .replace('function swipeMiss(p) {','function swipeMiss(p) { window.__C.miss++;')
 .replace('function startSwipe(p) {','function startSwipe(p) { if(!(p.swipeCd > 0 || p.swipeT > 0 || p.stunT > 0 || ball.holder === p)) window.__C.swipes++;')
 .replace('  p.heat += 1;','  p.heat += 1; window.__C.moves++;')
 .replace("p === human ? hf : mode === 'anim' ? (ANIM.npc.get(p) || ANIM.idle) : aiThink(p, gdt)",'aiThink(p, gdt)').replace('if (mode === \'match\' && ball.holder && ball.holder.team === human.team && ball.holder !== human) setControlled(ball.holder);','').replace('function pass(p, to, alley) {','function pass(p, to, alley) { window.__C.passes++;');
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const diff=process.argv[2]||'normal';
w.document.querySelector(`[data-d="${diff}"]`).click();
run(1); w.document.getElementById('play').click();
// make human an AI-like idle? human stays still
run(330);
const d=w.__dbg();
console.log(diff,'state',d.state,'score',JSON.stringify(d.score));
console.log(JSON.stringify(d.stats));
console.log('exhausts',C.ex, JSON.stringify(w.__dbg().players.map(p=>Math.round(p.stamina*100))));console.log('swipes',C.swipes,'miss',C.miss,'moves',C.moves,'passes',C.passes);
