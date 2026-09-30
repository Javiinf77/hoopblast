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
// navegación de menú con mando: bajar a "Entrenamiento" y aceptar con ✕
btn(13,true); run(0.05); btn(13,false); run(0.3);
console.log('foco en', w.document.activeElement && w.document.activeElement.id, 'modo', d.inputMode);
btn(0,true); run(0.05); btn(0,false); run(1.2);
console.log('estado', d.state, 'entrenamiento?', !w.document.getElementById('trainpanel').hidden);
run(3.5); console.log('estado tras cuenta atrás', d.state);
const h=d.players[0]; const sp=()=>Math.hypot(h.vel.x,h.vel.z).toFixed(2);
function reset(){ h.pos.set(0,0,0); h.vel.set(0,0,0); d.camYaw=-Math.PI/2; h.yaw=Math.PI/2; d.ball.holder=null; d.ball.pos.set(0,5,8); d.ball.vel.set(0,0,0); }
// 1) analógico: stick poco inclinado = andar
reset(); pad.axes=[0,-0.3,0,0]; run(1); console.log('stick 30% -> velocidad', sp()); reset(); pad.axes=[0,-0.6,0,0]; run(1); console.log('stick 60% -> velocidad', sp(), 'energía', h.stamina.toFixed(2));
pad.axes=[0,-1,0,0]; run(1); console.log('stick 100% -> velocidad', sp());
btn(7,true); run(1.2); console.log('R2 sprint -> velocidad', sp()); btn(7,false);
// 2) aceleración desde parado (teclado)
pad.axes=[0,0,0,0]; reset(); run(0.2); key('KeyW'); let out=[]; for(const t of [0.1,0.2,0.3,0.5]){ run(t-(out.length?[0.1,0.2,0.3,0.5][out.length-1]:0)); out.push(sp()); } console.log('arranque W: 0.1s/0.2s/0.3s/0.5s ->', out.join(' / '));
// 3) cambio de sentido brusco a carrera: W -> S
run(0.5); key('KeyW',false); key('KeyS'); let t0=0, planted=false; while(t0<1.2){ run(1/60); t0+=1/60; if(h.plantT>0) planted=true; if(h.vel.x < -3) break; }
console.log('giro 180º: frenada con apoyo', planted, '| en', t0.toFixed(2), 's ya corre al revés'); key('KeyS',false); run(0.5);
// 4) radio de giro a sprint vs normal (curva de 90º)
function turnRadius(sprint){ reset(); key('KeyW'); if(sprint) key('ShiftLeft'); run(1.2); const x0=h.pos.x, z0=h.pos.z; key('KeyW',false); key('KeyD'); let t=0; while(t<2 && Math.abs(h.vel.x)>0.3*Math.hypot(h.vel.x,h.vel.z)){ run(1/60); t+=1/60; } key('KeyD',false); key('ShiftLeft',false); return [ (h.pos.x-x0).toFixed(2), t.toFixed(2) ]; }
console.log('curva 90º corriendo: avanza', ...turnRadius(false).map((v,i)=>i?'en '+v+' s':v+' m'));
console.log('curva 90º esprintando: avanza', ...turnRadius(true).map((v,i)=>i?'en '+v+' s':v+' m'));
// 5) regates con el stick derecho y botones
reset(); d.ball.holder=h; h.stamina=1; for(const k in h.moveCd) h.moveCd[k]=0; run(0.3);
const flicks=[['derecha',[1,0]],['izquierda',[-1,0]],['arriba',[0,-1]],['abajo',[0,1]],['arriba-dcha',[0.7,-0.7]],['abajo-izq',[-0.7,0.7]]];
for(const [n,[x,y]] of flicks){ for(const k in h.moveCd) h.moveCd[k]=0; h.move=null; d.ball.holder=h; h.stunT=0; h.onGround=true; h.pos.y=0; pad.axes=[0,0,x,y]; run(1/60); run(1/60); pad.axes=[0,0,0,0]; console.log('RS', n.padEnd(12), '->', h.move? h.move.type+' lado '+h.move.side : 'nada'); run(0.9); }
for(const k in h.moveCd) h.moveCd[k]=0; h.move=null; d.ball.holder=h; h.stamina=1; btn(11,true); run(1/60); btn(11,false); console.log('R3 ->', h.move?h.move.type:'nada'); run(0.8);
// 6) □ mantener = medidor; soltar = tiro
reset(); h.pos.set(10.5,0,0); d.ball.holder=h; run(0.2); btn(2,true); run(0.5); console.log('□ mantenido: cargando', h.charging, 'carga', h.charge.toFixed(2)); btn(2,false); run(0.3); console.log('□ soltado: balón en el aire', !d.ball.holder);
console.log('vibraciones', pad.rumbles);
