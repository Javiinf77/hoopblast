const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(process.env.HOOPBLAST||require('path').join(__dirname,'..','index.html'),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({get human(){return human},players,ball,ANIMS,ANIM,get mode(){return mode},get state(){return state}});");
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720);
function run(sec){ for(let i=0;i<Math.round(sec*60);i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERR',e.stack.split('\n').slice(0,3).join(' | '));process.exit(1)} } } }
const $=id=>w.document.getElementById(id);
run(0.5); $('animMode').click(); run(0.3);
const d=w.__dbg(), h=d.human;
console.log('modo', d.mode, '| animaciones en la lista', w.document.querySelectorAll('#animList button').length);
const btns=[...w.document.querySelectorAll('#animList button')];
for(const b of btns){ b.click(); const a=d.ANIMS[+b.dataset.i]; let ev=new Set();
  for(let k=0;k<Math.ceil(a.dur*60)-2;k++){ run(1/60); if(h.move) ev.add('regate:'+h.move.type); if(h.dunkSeq) ev.add('mate:'+h.dunkSeq.type); if(h.charging) ev.add('carga:'+h.shotKind); if(h.throwT>0) ev.add('lanza:'+h.throwKind); if(h.swipeT>0) ev.add('manotazo'); if(h.blockT>0) ev.add('tapón'); if(h.stance) ev.add('postura'); if(h.post) ev.add('poste'); if(!h.onGround) ev.add('aire'); if(h.fakeT>0) ev.add('amago'); if(h.plantT>0) ev.add('frenada'); if(h.burstT>0) ev.add('explosión'); if(d.ball.holder===h && a.name==='Recibir un pase') ev.add('recibido'); }
  console.log((a.cat+' · '+a.name).padEnd(34), [...ev].join(', ')||'(ok)'); }
$('animPause').click(); const t0=d.ANIM.t; run(0.5); console.log('pausa: el tiempo no avanza', d.ANIM.t===t0); $('animStep').click(); run(1/60); console.log('+1 fotograma avanza', (d.ANIM.t-t0).toFixed(4));
$('animBack').click(); run(0.3); console.log('volver: modo', d.mode, 'estado', d.state, '| menú visible', !$('menu').hidden);
$('play').click(); run(30); console.log('partido tras salir: estado', d.state, 'marcador', $('s0').textContent+'-'+$('s1').textContent);
