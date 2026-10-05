// Online: sala con N jugadores (conexiones simuladas) → se juega ceil(N/2) contra ceil(N/2) y la partida corre sin errores
const {JSDOM}=require('jsdom'); const fs=require('fs');
const file=process.argv[2]||require('path').join(__dirname,'..','index.html');
const N=+process.argv[3]||4;
const html=fs.readFileSync(file,'utf8');
let script=html.slice(html.indexOf('<script>')+8, html.lastIndexOf('</script>'));
script=script.replace("'use strict';","'use strict'; window.__dbg=()=>({players, get live(){return live}, get state(){return state}, get score(){return score}, NET, netHostData, netStart, netSize: () => netSize()});");
const dom=new JSDOM(html.slice(0,html.indexOf('<script src')),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','localStorage',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.localStorage);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERROR',e.stack.split('\n').slice(0,3).join(' '));process.exit(1)} } } }
const d=w.__dbg(); run(0.5);
// el anfitrión crea la sala (sin red: preparamos el estado a mano) y entran N-1 amigos
d.NET.role='host'; d.NET.code='TEST1'; d.NET.mySlot=0; d.NET.names=['Anfitrión'].concat(new Array(9).fill(null)); d.NET.conns=new Array(10).fill(null);
const sent=[]; const mk=i=>({ open:true, slot:null, send:m=>sent.push(m) });
for (let k=1;k<N;k++){ const c=mk(k); d.netHostData(c,{t:'hello', name:'Amigo'+k}); }
const lobby=[...w.document.querySelectorAll('#netPlayers li')].length;
d.netStart(); run(25);
const size=d.netSize(), humans=d.players.filter(p=>p.netCtl).length+1, onCourt=d.live.length, vis=d.players.filter(p=>p.rig.root.visible).length;
const snap=sent.filter(m=>m.t==='snap').pop();
console.log(N+' en la sala → '+size+' contra '+size+' | en pista '+onCourt+' (visibles '+vis+') | humanos '+humans+', IA '+(onCourt-humans)+' | lista de la sala '+lobby+' huecos | instantánea con '+(snap?snap.pl.length:0)+' jugadores | estado '+d.state+' | marcador '+JSON.stringify(d.score));
