// Encadenar regates con el stick derecho (p. ej. retroceso → entre las piernas): que el segundo regate salga
// aunque se pida pronto, sin hueco entre los dos y sin saltos de pose ni de balón.
// Uso: node testchain.js [archivo.html]
const path = require('path'), file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'index.html'); process.env.HOOPBLAST = file;
const src = require('fs').readFileSync(path.join(__dirname, 'testpad.js'), 'utf8').split("// navegación de menú")[0]
  .replace("require('path').join(__dirname,'..','index.html')", JSON.stringify(file))
  .replace("window.__dbg=()=>({", "window.__dbg=()=>({get human(){return human},");
eval(src + `
w.document.getElementById('train').click(); run(1.5);
const hh = d.human, rim = d.hoops[1].rimC;
const flat = (o, out = []) => { for (const k in o) typeof o[k] === 'object' ? flat(o[k], out) : out.push(o[k]); return out; };
const flick = (x, y) => { pad.axes = [0, 0, x, y]; run(3 / 60); pad.axes = [0, 0, 0, 0]; run(1 / 60); };
const combos = [['retroceso → entre piernas', [0, 1], [-1, 0]], ['retroceso → entre piernas (otro lado)', [0, 1], [1, 0]], ['cruce → entre piernas', [-0.7, -0.7], [1, 0]],
  ['entre piernas → retroceso', [-1, 0], [0, 1]], ['cruce → cruce', [-0.7, -0.7], [0.7, -0.7]], ['entre piernas → espalda', [-1, 0], [0.7, 0.7]]];
for (const [name, a, b] of combos) for (const delay of [0.05, 0.2, 0.35]) {
  hh.pos.set(rim.x - 7, 0, 0); hh.vel.set(0, 0, 0); hh.onGround = true; hh.move = null; hh.nextMove = null; hh.chainT = 9; for (const k in hh.moveCd) hh.moveCd[k] = 0; hh.stamina = 1; hh.hand = 1; d.ball.holder = hh; run(0.6);
  flick(a[0], a[1]); const first = hh.move && hh.move.type, m0 = hh.move;
  run(delay);
  const seq = [first], seen = [m0], prev = { pose: null, ball: null }; let gap = 0, maxPose = 0, maxBall = 0, idle = 0;
  pad.axes = [0, 0, b[0], b[1]];
  for (let i = 0; i < 90; i++) {
    if (i === 3) pad.axes = [0, 0, 0, 0];
    run(1 / 60);
    const t = hh.move ? hh.move.type : null;
    if (t && !seen.includes(hh.move)) { seen.push(hh.move); seq.push(t); }
    if (!t && seq.length === 1) gap += 1 / 60;
    const pose = flat(hh.rig.cur);
    if (prev.pose && seq.length) maxPose = Math.max(maxPose, ...pose.map((v, j) => Math.abs(v - prev.pose[j])));
    if (prev.ball) maxBall = Math.max(maxBall, d.ball.pos.distanceTo(prev.ball) - Math.hypot(hh.vel.x, hh.vel.z) / 60);
    prev.pose = pose; prev.ball = d.ball.pos.clone();
    if (!t && seq.length >= 2) { idle++; if (idle > 5) break; }
  }
  console.log(name.padEnd(38), ('pedido a ' + delay.toFixed(2) + ' s').padEnd(15), '| ' + (first || '—') + ' → ' + (seq.slice(1).join(' → ') || 'NADA').padEnd(16), '| hueco ' + gap.toFixed(2) + ' s', '| salto pose/fotograma ' + maxPose.toFixed(3), '| balón ' + maxBall.toFixed(3) + ' m', '| con balón ' + (d.ball.holder === hh));
}
`);
