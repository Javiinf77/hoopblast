// Jugadas nuevas: 5 contra 5, pedir bloqueo (L1 / T) y bloquear tú (○ / T), pase por iconos (R1 / Tab + 1…4),
// bandeja con barra (□ / clic mantenido sin correr; a aro pasado debajo del aro) y mates solo corriendo (R2 / Mayús).
// Uso: node testjugadas.js [archivo.html]
const path = require('path'), fs = require('fs'), file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'index.html');
const { JSDOM } = require('jsdom'); const THREE = require('three');
const html = fs.readFileSync(file, 'utf8');
let script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const i0 = script.lastIndexOf('})();'); script = script.slice(0, i0) + 'window.__ev = s => eval(s);\n' + script.slice(i0);
const dom = new JSDOM(html.slice(0, html.indexOf('<script src')), { pretendToBeVisual: true, url: 'https://example.org/' }); const w = dom.window;
class R { constructor() { this.domElement = w.document.createElement('canvas'); this.shadowMap = {}; this.capabilities = { getMaxAnisotropy: () => 1 }; this.domElement.requestPointerLock = () => {}; } setPixelRatio() {} setSize() {} render() {} }
THREE.WebGLRenderer = R; w.THREE = THREE;
w.HTMLCanvasElement.prototype.getContext = function () { return new Proxy({}, { get: (t, k) => k === 'createRadialGradient' || k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}, set: () => true }); };
w.matchMedia = () => ({ matches: false });
let cbs = [], tnow = 0;
new Function('window', 'document', 'THREE', 'performance', 'requestAnimationFrame', 'addEventListener', 'innerWidth', 'innerHeight', 'localStorage', script)(w, w.document, THREE, { now: () => tnow }, f => cbs.push(f), w.addEventListener.bind(w), 1280, 720, w.localStorage);
const E = s => w.__ev(s);
const frame = () => { tnow += 1000 / 60; const c = cbs; cbs = []; for (const f of c) f(tnow); };
const run = sec => { for (let i = 0; i < sec * 60; i++) frame(); };
const key = (code, down) => w.dispatchEvent(new w.KeyboardEvent(down === false ? 'keyup' : 'keydown', { code }));
run(1);
// ---- 5 contra 5 ----
E('matchSize = 5'); w.document.getElementById('play').click(); run(4.5);
console.log('5c5: en pista', E('live.length'), '| visibles', E('live.filter(p => p.rig.root.visible).length'), '| por equipo', E('teamOf(0).length + "+" + teamOf(1).length'));
run(25); console.log('5c5 tras 25 s: marcador', E('score.join("-")'), '| estado', E('state'));
// ---- 3 contra 3: jugadas ----
w.document.getElementById('quit') && w.document.getElementById('quit').click(); run(0.5);
E('matchSize = 3'); w.document.getElementById('play').click(); run(4.5);
const place = `(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); state = 'play'; RESET = null; possTeam = 0; needClear[0] = needClear[1] = false;
  for (const p of live) { p.vel.set(0, 0, 0); p.screen = null; p.move = null; p.stunT = 0; p.swipeCd = 99; p.blockCd = 99; p.dunkSeq = null; p.layupSeq = null; p.shotT = 0; p.charging = false; p.charge = 0; p.onGround = true; p.pos.y = 0; p.fakeT = 0; p.drive = null; p.deadDribble = false; p.rebT = 0; p.throwT = 0; }
  human.pos.set(c.x - sx * 8, 0, 0); ball.holder = human; ball.shot = null; ball.pass = null; ball.guide = null;
  const d = live.find(p => p.team === 1 && p.idx === 0); d.pos.set(c.x - sx * 7, 0, 0); })()`;
// pedir bloqueo por la izquierda
E(place); E('pendH.screen = "call"'); E('keys.KeyA = true'); run(0.05); E('keys.KeyA = false');
let set = null; for (let i = 0; i < 150; i++) { frame(); const ph = E('(live.find(p => p.screen) || {}).screen'); if (ph && ph.ph === 'set') { set = ph; break; } }
console.log('pedir bloqueo (T/L1): lo pone', E('(live.find(p => p.screen) || {idx: "nadie"}).idx'), '| plantado', !!set, '| lado', set ? (set.side > 0 ? 'derecha' : 'izquierda') : '-',
  '| a', E('(() => { const s = live.find(p => p.screen); return s ? hdist(s.pos, s.screen.def.pos).toFixed(2) : "-"; })()'), 'm del defensor');
// el defensor choca con el bloqueo al seguirte
// el defensor persigue al que bota y se mete por el lado del bloqueo
let caught = false; E(`(() => { const s = live.find(p => p.screen); if (!s) return; const d = s.screen.def; d.pos.set(s.pos.x - 0.9, 0, s.pos.z + 0.1); d.vel.set(3.5, 0, 0); })()`);
for (let i = 0; i < 40; i++) { frame(); if (E('live.some(p => p.screenedT > 0)')) { caught = true; break; } }
console.log('defensor que choca con el bloqueo: enganchado', caught, '| luego el bloqueador continúa al aro', (run(2), E('(live.find(p => p.screen) || {screen: {ph: "-"}}).screen.ph')));
// bloquear tú sin balón
// (sin conexión controlas siempre a quien tiene el balón: esto se usa online; aquí se prueba la mecánica con un compañero)
E(place); E('(() => { const m = live.find(p => p.team === 0 && p !== human); m.pos.set(human.pos.x + 2, 0, 2); screenAction(m, "set", new THREE.Vector3()); window.__m = m; })()');
const x0 = E('window.__m.pos.x'); run(0.6);
console.log('bloquear sin balón (○/T online): plantado', E('!!window.__m.screen && window.__m.screen.ph'), '| se ha movido', Math.abs(E('window.__m.pos.x') - x0).toFixed(2), 'm');
run(1.5);
// pase por iconos
E(place); run(0.05); E('keys.Tab = true'); run(0.1);
const target = E('PASSICO.mates[1] ? PASSICO.mates[1].idx : -1'); key('Digit2'); run(0.05); key('Digit2', false); E('keys.Tab = false');
console.log('pase por iconos (Tab + 2): iconos visibles', E('PASSICO.els.filter(e => !e.hidden).length'), '| pasa a', E('ball.pass && ball.pass.to ? ball.pass.to.idx : (ball.holder ? "lo tiene " + ball.holder.idx : "-")'), '| marcado', target);
// bandeja con barra: soltando en el verde, pronto y tarde; y a aro pasado
const lay = (dist, releaseAt) => {
  E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); human.pos.set(c.x - sx * ${dist}, 0, 0.6); human.vel.set(sx * 3, 0, 0); human.yaw = Math.atan2(sx, 0); for (const p of live) if (p.team === 1) p.pos.set(c.x + sx * 6, 0, 8); })()`);
  key('KeyJ'); let meter = false, rev = false, rel = null;
  for (let i = 0; i < 90; i++) { frame(); const L = E('human.layupSeq'); if (L) { meter = L.meter; rev = rev || L.rev; if (rel === null && E('human.charge') >= releaseAt) { key('KeyJ', false); rel = E('human.charge').toFixed(2); } } else if (rel !== null || i > 40) break; }
  key('KeyJ', false);
  let made = false; for (let i = 0; i < 120; i++) { frame(); if (E('state') === 'scored') { made = true; break; } }
  return { meter, rev, rel, made };
};
for (const [nm, d, r] of [['bandeja soltando en el verde', 2.2, 0.8], ['bandeja soltando pronto', 2.2, 0.3], ['bandeja soltando tarde', 2.2, 1.12], ['debajo del aro', 0.7, 0.8]]) {
  let m = 0, last; for (let k = 0; k < 8; k++) { last = lay(d, r); if (last.made) m++; }
  console.log(nm.padEnd(28), '| con barra', last.meter, '| aro pasado', last.rev, '| suelta en', last.rel, '| canastas', m + '/8');
}
// mates: corriendo sin Mayús → bandeja; con Mayús → mate
for (const sprint of [false, true]) {
  E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); human.pos.set(c.x - sx * 3.4, 0, 0); human.vel.set(sx * 7, 0, 0); camYaw = -sx * Math.PI / 2; for (const p of live) if (p.team === 1) p.pos.set(c.x + sx * 6, 0, 8); })()`);
  if (sprint) E('keys.ShiftLeft = true'); E('keys.KeyD = false'); E(`keys.${'KeyW'} = true`);
  frame(); key('KeyJ'); frame(); frame(); const dk = E('!!human.dunkSeq'), ly = E('!!human.layupSeq'); key('KeyJ', false); E('keys.ShiftLeft = false; keys.KeyW = false'); run(2);
  console.log('corriendo al aro ' + (sprint ? 'con Mayús/R2' : 'sin correr   ') + ' + clic: mate', dk, '| bandeja', ly);
}
