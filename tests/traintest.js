const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync((process.env.HOOPBLAST || require('path').join(__dirname, '..', 'index.html')),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get state(){return state},players,ball,get mode(){return mode},TR});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('FRAME ERR',e.stack);process.exit(1)} } } }
const key=(code,down=true)=>w.dispatchEvent(new w.KeyboardEvent(down?'keydown':'keyup',{code}));
run(0.5); w.document.getElementById('train').click(); run(1);
const d=w.__dbg(), h=d.players[0];
console.log('mode',d.mode,'holder human',d.ball.holder===h,'hidden others',!d.players[3].rig.root.visible);
// shoot 12 times with ~perfect timing (hold J for 0.67s)
for(let i=0;i<12;i++){
  let waited=0; while(d.ball.holder!==h && waited<8){ run(0.25); waited+=0.25; }
  if(d.ball.holder!==h){ console.log('ball did not return'); break; }
  run(0.3);
  key('KeyJ'); run(i%3===0?0.4:0.67); key('KeyJ',false); run(0.1);
}
run(4);
console.log(JSON.stringify(d.TR), 'panel', w.document.getElementById('tMade').textContent, w.document.getElementById('tStreak').textContent);
// Q recall
key('KeyW'); run(1); key('KeyW',false); key('KeyJ'); run(0.67); key('KeyJ',false); run(0.4); key('KeyQ'); key('KeyQ',false); run(2);
console.log('after Q holder human', d.ball.holder===h);
// back to menu
w.document.getElementById('quit').click(); run(0.5);
console.log('mode',d.mode,'others visible',d.players[3].rig.root.visible);
w.document.getElementById('play').click(); run(10);
console.log('match state',d.state);
