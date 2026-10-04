// Prueba del modo online con dos instancias del juego conectadas por un PeerJS simulado (en memoria)
const {JSDOM}=require('jsdom'); const fs=require('fs'); const THREE=require('three');
const html=fs.readFileSync(process.env.HOOPBLAST||require('path').join(__dirname,'..','index.html'),'utf8');
const script0=html.match(/<script>([\s\S]*?)<\/script>/)[1];
// ---- PeerJS falso: registro de pares y conexiones que entregan mensajes con un pequeño retardo ----
const registry={}, queue=[];
class Emitter{ constructor(){this.h={};} on(e,f){(this.h[e]=this.h[e]||[]).push(f); return this;} emit(e,...a){(this.h[e]||[]).forEach(f=>f(...a));} }
class FakeConn extends Emitter{ constructor(){super(); this.open=false; this.other=null;} send(m){ const o=this.other, s=JSON.stringify(m); queue.push(()=>o.emit('data', JSON.parse(s))); } close(){ this.open=false; queue.push(()=>{ this.other.open=false; this.other.emit('close'); }); } }
function makePeerClass(){ return class Peer extends Emitter{ constructor(id){ super(); this.id=id||('anon'+Math.random()); registry[this.id]=this; queue.push(()=>this.emit('open', this.id)); }
  connect(id){ const a=new FakeConn(), b=new FakeConn(); a.other=b; b.other=a; queue.push(()=>{ const host=registry[id]; if(!host){ this.emit('error',{type:'peer-unavailable'}); return; } host.emit('connection', b); a.open=b.open=true; a.emit('open'); b.emit('open'); }); return a; }
  destroy(){} }; }
global.Peer=makePeerClass();
function makeGame(name){
  const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{pretendToBeVisual:true, url:'https://example.org/'});
  const w=dom.window;
  class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
  const T3=Object.assign({},THREE); T3.WebGLRenderer=R; w.THREE=T3;
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
  w.matchMedia=()=>({matches:false}); w.Peer=global.Peer; w.confirm=()=>true;
  const script=script0.replace("'use strict';","'use strict'; window.__g=()=>({players,ball,get human(){return human},get state(){return state},get clock(){return clock},score,NET,get live(){return live}});");
  const g={w, cbs:[], tnow:0};
  new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','localStorage',script)(w,w.document,T3,{now:()=>g.tnow},f=>g.cbs.push(f),w.addEventListener.bind(w),1280,720,w.localStorage);
  g.step=()=>{ g.tnow+=1000/60; const c=g.cbs; g.cbs=[]; for(const f of c){ try{f(g.tnow)}catch(e){ console.log(name,'ERROR',e.stack.split('\n').slice(0,3).join(' | ')); process.exit(1);} } };
  return g;
}
const H=makeGame('anfitrión'), C=makeGame('invitado');
async function run(sec){ for(let i=0;i<Math.round(sec*60);i++){ H.step(); C.step(); let n=queue.length; while(n-- > 0) queue.shift()(); if(i%5===0) await new Promise(r=>setImmediate(r)); } }
const $h=id=>H.w.document.getElementById(id), $c=id=>C.w.document.getElementById(id);
(async()=>{
await run(0.3);
$h('onlineBtn').click(); $h('netName').value='Javi'; $h('netCreate').click(); await run(0.5);
const code=$h('netStatus').textContent.match(/Código: ([A-Z0-9]{5})/); console.log('anfitrión:', $h('netStatus').textContent.slice(0,40), '→ código', code&&code[1]);
$c('onlineBtn').click(); $c('netName').value='Amigo'; $c('netCode').value=code[1]; $c('netJoin').click(); await run(0.5);
console.log('invitado:', $c('netStatus').textContent.slice(0,45), '| sala vista por el anfitrión:', [...$h('netPlayers').children].map(li=>li.textContent).join(' / '));
$h('netStart').click(); await run(0.2);
const gh=H.w.__g(), gc=C.w.__g();
console.log('en partido: anfitrión', gh.NET.inGame, '| invitado', gc.NET.inGame, '| jugadores en pista', gh.live.length, '| el invitado controla al', gc.human.team===1?'equipo rojo':'azul', gc.human.idx);
await run(4);   // cuenta atrás
// el invitado se mueve con el teclado: ¿se mueve su jugador en el anfitrión?
const mine=gh.players[gc.players.indexOf(gc.human)], p0=mine.pos.clone();
C.w.dispatchEvent(new C.w.KeyboardEvent('keydown',{code:'KeyA'})); await run(1.2); C.w.dispatchEvent(new C.w.KeyboardEvent('keyup',{code:'KeyA'})); await run(0.3);
console.log('el invitado pulsa A 1,2 s → su jugador se mueve en el anfitrión', p0.distanceTo(mine.pos).toFixed(2), 'm');
const dev=Math.max(...gh.live.map(p=>{ const q=gc.players[gh.players.indexOf(p)]; return p.pos.distanceTo(q.pos); }));
console.log('diferencia máxima de posiciones anfitrión ↔ invitado', dev.toFixed(3), 'm | reloj', gh.clock.toFixed(1), 'vs', gc.clock.toFixed(1), '| estado', gh.state, gc.state);
await run(30); console.log('tras 30 s más: marcador anfitrión', JSON.stringify(gh.score), '| invitado', JSON.stringify(gc.score), '| HUD invitado', $c('s0').textContent+'-'+$c('s1').textContent);

})();
