// tras gancho / fadeaway / tiro: al caer, vuelve a la pose normal (sin el gesto del remate) y no se puede mover con esa pose
const src=require('fs').readFileSync(require('path').join(__dirname,'testpost.js'),'utf8').split("console.log('Ventana")[0];
eval(src + `
function trial(keyc){ h.pos.set(rim.x-3.6,0,0.3); h.vel.set(0,0,0); h.stunT=0; h.move=null; h.stamina=1; h.charging=false; h.shotT=0; h.throwT=0; h.hand=1; h.yaw=-Math.PI/2; d.ball.holder=h; d.ball.shot=null; run(0.15);
  rmb(true); run(0.2); key(keyc); run(0.68); key(keyc,false); rmb(false);
  let landF=-1, poseAfter=null, f=0; while(f<120){ run(1/60); f++; if(landF<0 && h.onGround && !d.ball.holder && f>5) landF=f; if(landF>0 && f===landF+20){ poseAfter={throwT:h.throwT.toFixed(2), armX:h.rig.cur.aR.x.toFixed(2), bodyX:h.rig.cur.bodyX.toFixed(2)}; break; } }
  return 'aterriza en f'+landF+' | 20 fotogramas después: gesto restante '+poseAfter.throwT+' s, brazo '+poseAfter.armX+' (reposo ≈ 0), inclinación '+poseAfter.bodyX; }
console.log('gancho  :', trial('KeyG'));
console.log('fadeaway:', trial('KeyC'));
`);
