// 1 contra 1: solo dos jugadores en pista, el resto oculto y sin intervenir; y vuelta al 3 contra 3
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','index.html'),'utf8');
let script=html.slice(html.indexOf('<script>')+8, html.lastIndexOf('</script>'));
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({players, get live(){return live}, get state(){return state}, get score(){return score}, get possTeam(){return possTeam}, ball});");
const dom=new JSDOM(html.slice(0,html.indexOf('<script src')),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','localStorage',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.localStorage);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERROR',e.stack.split('\n').slice(0,2).join(' '));process.exit(1)} } } }
const $=id=>w.document.getElementById(id), d=w.__dbg();
run(1); w.document.querySelector('.seg button[data-size="1"]').click(); $('play').click(); run(90);
const vis=d.players.filter(p=>p.rig.root.visible).length, inCourt=d.players.filter(p=>p.pos.y>-1).length;
console.log('1 contra 1: en pista', d.live.length, '| visibles', vis, '| fuera de pista', 6-inCourt, '| marcador', JSON.stringify(d.score), '| el balón lo tiene', d.ball.holder ? (d.live.includes(d.ball.holder)?'un jugador en pista':'¡uno oculto!') : 'nadie');
$('quit') && $('quit').click(); run(0.5);
w.document.querySelector('.seg button[data-size="3"]').click(); $('play').click(); run(10);
console.log('3 contra 3 después: en pista', d.live.length, '| visibles', d.players.filter(p=>p.rig.root.visible).length);
