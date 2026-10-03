const src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
eval(src + `
const V=h.pos.constructor; const wp=(o)=>{ const v=new V(); o.getWorldPosition(v); return v; };

function setup(){ h.pos.set(rim.x-3.6,0,0.3); h.vel.set(0,0,0); h.stunT=0; h.move=null; h.stamina=1; h.charging=false; h.shotT=0; h.hand=1; h.yaw=-Math.PI/2; d.ball.holder=h; d.ball.shot=null; run(0.15); }
// gancho: ángulo del codo del brazo de tiro y si el codo apunta hacia dentro (hacia el cuerpo)
setup(); rmb(true); run(0.2); key('KeyG'); let maxBend=0, inward=0, n=0, bends=[]; const arm=h.rig.armR;
for(let i=0;i<40;i++){ run(1/60); const s=wp(arm.shoulder), e=wp(arm.elbow), wr=wp(arm.wrist); const u=e.clone().sub(s).normalize(), f=wr.clone().sub(e).normalize(); const bend=Math.acos(Math.max(-1,Math.min(1,u.dot(f))))*180/Math.PI; if(h.charge/0.8>0.35) maxBend=Math.max(maxBend,bend); if(i%5==0) bends.push(bend.toFixed(0)+'°/'+(wp(arm.wrist).distanceTo(d.ball.pos)*100).toFixed(0)+'cm');
  const c=wp(h.rig.torso); const mid=s.clone().add(wr).multiplyScalar(0.5); if (e.distanceTo(c) < mid.distanceTo(c)-0.02) inward++; n++; }
key('KeyG',false); rmb(false); run(2);
console.log('gancho: flexión del codo cada 5 fotogramas', bends.join(' '), '| máxima con el balón ya subiendo', maxBend.toFixed(0)+'° | codo hacia el cuerpo en', inward+'/'+n, 'fotogramas');
// fadeaway: giro según el stick y quieto mientras carga
for (const [k,lbl] of [['KeyD','stick a la derecha'],['KeyA','stick a la izquierda']]) { setup(); rmb(true); run(0.25); const y0=h.yaw, p0=h.pos.clone();
  key(k); run(1/60); key('KeyC'); let minD=0,maxD=0; for(let i=0;i<30;i++){ run(1/60); const dl=Math.atan2(Math.sin(h.yaw-y0),Math.cos(h.yaw-y0)); if(i<12){minD=Math.min(minD,dl); maxD=Math.max(maxD,dl);} }
  const moved=p0.distanceTo(h.pos); key(k,false); key('KeyC',false); rmb(false); run(2);
  console.log('fadeaway con', lbl+':', 'el frente barre hacia el lado', (Math.abs(minD)>Math.abs(maxD)?'izquierdo de la pantalla':'derecho de la pantalla'), '| se movió mientras cargaba', moved.toFixed(2),'m'); }
`);
