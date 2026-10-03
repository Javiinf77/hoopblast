const src=require('fs').readFileSync(require('path').join(__dirname,'testpad.js'),'utf8').split("// navegación de menú")[0].replace("require('path').join(__dirname,'..','index.html')","require('path').join(__dirname,'..','index.html')").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human, rim=d.hoops[1].rimC;
hh.pos.set(rim.x-7,0,0); hh.vel.set(0,0,0); hh.fakeCd=0; d.ball.holder=hh; for(const k in hh.moveCd) hh.moveCd[k]=0; run(0.3);
btn(2,true); run(2/60); btn(2,false); run(0.6);   // toque corto: amago
console.log('tras el amago: bote muerto', hh.deadDribble);
const p0=hh.pos.clone(); pad.axes=[0,-1,0,0]; run(1); pad.axes=[0,0,0,0]; console.log('empujando el stick 1 s: se ha movido', p0.distanceTo(hh.pos).toFixed(2),'m | mira hacia', (hh.yaw*180/Math.PI).toFixed(0)+'°');
pad.axes=[0,0,-1,0]; run(3/60); pad.axes=[0,0,0,0]; run(3/60); console.log('stick derecho (regate):', hh.move ? hh.move.type : 'nada');
btn(2,true); run(0.68); btn(2,false); run(0.4); console.log('mantener □ y soltar: tiro', !d.ball.holder && !!d.ball.shot, '| bote muerto ahora', hh.deadDribble);
`);
