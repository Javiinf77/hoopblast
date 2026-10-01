const src=require('fs').readFileSync('testpad.js','utf8').split("// navegación de menú")[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace("window.__dbg=()=>({","window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh=d.human;
function setup(hand){ hh.pos.set(0,0,0); hh.vel.set(0,0,0); hh.yaw=Math.PI/2; hh.move=null; hh.nextMove=null; hh.hand=hand; hh.chain=[]; for(const k in hh.moveCd) hh.moveCd[k]=0; hh.stamina=1; d.ball.holder=hh; pad.axes=[0,0,0,0]; run(0.3); }
function flick(deg){ const a=deg*Math.PI/180; pad.axes=[0,0,Math.sin(a),-Math.cos(a)]; run(3/60); pad.axes=[0,0,0,0]; run(2/60); }
// balón en la izquierda y cruce hacia la izquierda: cambio rápido a la derecha y luego el cruce
setup(-1); flick(-45); const seq=[]; for(let i=0;i<50;i++){ run(1/60); const t=hh.move&&hh.move.type; if(t && seq[seq.length-1]!==t) seq.push(t); }
console.log('balón en la IZQUIERDA + ↖ (cruce a la izquierda):', seq.join(' → '), '| mano final', hh.hand>0?'derecha':'izquierda');
setup(1); flick(-45); const seq2=[]; for(let i=0;i<50;i++){ run(1/60); const t=hh.move&&hh.move.type; if(t && seq2[seq2.length-1]!==t) seq2.push(t); }
console.log('balón en la DERECHA + ↖ (cruce a la izquierda):', seq2.join(' → '), '| mano final', hh.hand>0?'derecha':'izquierda');
setup(1); flick(45); const seq3=[]; for(let i=0;i<50;i++){ run(1/60); const t=hh.move&&hh.move.type; if(t && seq3[seq3.length-1]!==t) seq3.push(t); }
console.log('balón en la DERECHA + ↗ (cruce a la derecha):', seq3.join(' → '), '| mano final', hh.hand>0?'derecha':'izquierda');
// mano natural: corriendo hacia la derecha con el balón en la izquierda → pasa sola a la derecha
setup(-1); pad.axes=[0,-1,0,0]; run(0.5); pad.axes=[1,-0.2,0,0]; let sw=-1; for(let i=0;i<60;i++){ run(1/60); if(sw<0 && hh.hand>0) sw=i; } pad.axes=[0,0,0,0];
console.log('corriendo y girando a la derecha con el balón en la izquierda: cambia sola a la derecha en', sw>=0 ? (sw/60).toFixed(2)+' s' : 'no cambia');
setup(1); pad.axes=[0,-1,0,0]; run(1); console.log('corriendo recto con la derecha: sigue en la', hh.hand>0?'derecha':'izquierda');
`);
