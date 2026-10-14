// Gameplay 0.6: giro en el sitio, nuevos regates (medio giro, Shammgod, amago, parada falsa, paso de recogida), flotadora, recogida en carrera, colisiones e IA.
// Uso: node testgameplay.js [archivo.html]
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
const place = `(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); state = 'play'; RESET = null; possTeam = 0; needClear[0] = needClear[1] = false;
  for (const p of live) { p.vel.set(0, 0, 0); p.screen = null; p.move = null; p.nextMove = null; p.stunT = 0; p.swipeCd = 99; p.blockCd = 99; p.dunkSeq = null; p.layupSeq = null; p.shotT = 0; p.charging = false; p.charge = 0; p.onGround = true; p.pos.y = 0; p.fakeT = 0; p.drive = null; p.deadDribble = false; p.rebT = 0; p.throwT = 0; p.ctrlT = 0; p.chainT = 9; p.chain = []; p.stamina = 1; p.exhausted = false; for (const k in p.moveCd) p.moveCd[k] = 0; }
  human.pos.set(c.x - sx * 9, 0, 0); human.yaw = Math.atan2(sx, 0); human.hand = 1; ball.holder = human; ball.shot = null; ball.pass = null; ball.guide = null;
  for (const p of live) if (p !== human) p.pos.set(c.x - sx * 2, 0, (p.team ? 9 : -9) + p.idx * 0.9); })()`;
const sx = () => E('Math.sign(hoops[1].rimC.x)');

run(1); E('matchSize = 3'); w.document.getElementById('play').click(); run(4.5);
const fx = n => (+n).toFixed(2);
// ---- giro: solo rota sobre sí mismo ----
const spinTest = (type, speed) => {
  E(place); E(`human.vel.set(${sx()} * ${speed}, 0, 0); human.yaw = Math.atan2(${sx()}, 0);`); run(0.05);
  const z0 = E('human.pos.z'), x0 = E('human.pos.x'), y0 = E('human.yaw + human.spinAngle');
  E(`pendH.move = '${type}'; PAD.side = 1;`);
  let maxLat = 0, rot = 0, prev = y0, started = false;
  for (let i = 0; i < 70; i++) { frame(); const m = E('human.move ? human.move.type : null'); if (m === type) started = true; const yaw = E('human.yaw + human.spinAngle'); rot += E(`wrapA(${yaw} - ${prev})`); prev = yaw; maxLat = Math.max(maxLat, Math.abs(E('human.pos.z') - z0)); if (started && !m) break; }
  return { started, maxLat: fx(maxLat), fwd: fx((E('human.pos.x') - x0) * sx()), rot: fx(Math.abs(rot) / Math.PI * 180), ball: E('ball.holder === human'), vel: fx(E('Math.hypot(human.vel.x, human.vel.z)')) };
};
for (const [ty, sp] of [['spin', 0], ['spin', 6], ['halfspin', 0], ['halfspin', 6]]) {
  const r = spinTest(ty, sp);
  console.log((ty === 'spin' ? 'giro' : 'medio giro').padEnd(11), 'a', sp, 'm/s | hecho', r.started, '| desplazamiento lateral máx', r.maxLat, 'm | avance', r.fwd, 'm | rotación', r.rot, '° (neta) | balón', r.ball, '| sale a', r.vel, 'm/s');
}
// ---- nuevos regates ----
const moveTest = (type, speed) => {
  E(place); E(`human.vel.set(${sx()} * ${speed}, 0, 0);`); run(0.05);
  const h0 = E('human.hand'), p0 = E('[human.pos.x, human.pos.z]');
  E(`pendH.move = '${type}'`); let seen = false;
  for (let i = 0; i < 80; i++) { frame(); const m = E('human.move ? human.move.type : null'); if (m === type) seen = true; if (seen && m !== type) break; }
  const p1 = E('[human.pos.x, human.pos.z]');
  return { seen, hand: h0 + '→' + E('human.hand'), fwd: fx((p1[0] - p0[0]) * sx()), lat: fx(p1[1] - p0[1]), ball: E('ball.holder === human') };
};
for (const [ty, sp, nm] of [['shammgod', 5, 'Shammgod'], ['hesi', 5, 'Parada falsa'], ['inout', 4, 'Amago de cruce']]) {
  const r = moveTest(ty, sp); console.log(nm.padEnd(15), '| hecho', r.seen, '| mano', r.hand, '| avance', r.fwd, 'm | lateral', r.lat, 'm | balón', r.ball);
}
// ---- paso de recogida (L2 / clic derecho entrando al aro) ----
{
  let made = 0, hops = 0;
  for (let n = 0; n < 6; n++) {
    E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); human.pos.set(c.x - sx * 6.5, 0, ${n % 2 ? 1 : -1}); human.vel.set(sx * 7, 0, 0); })()`);
    E('keys.KeyD = false'); let hop = false;
    for (let i = 0; i < 40; i++) { E(`human.vel.set(${sx()} * 7, 0, 0)`); frame(); if (E('hdist(human.pos, hoops[1].rimC)') < 4.2) break; }
    E('rmbHeld = true'); for (let i = 0; i < 90; i++) { frame(); if (E('human.move && human.move.type === "hop"')) hop = true; if (E('!!ball.shot')) break; } E('rmbHeld = false');
    if (hop) hops++;
    for (let i = 0; i < 150; i++) { frame(); if (E('state') === 'scored') { made++; break; } }
  }
  console.log('paso de recogida  | hechos', hops + '/6', '| canastas', made + '/6');
}
// ---- flotadora ----
{
  let floats = 0, made = 0, apex = 0;
  for (let n = 0; n < 6; n++) {
    E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); human.pos.set(c.x - sx * 6.6, 0, 0.5); human.vel.set(sx * 6, 0, 0); })()`);
    E('keys.KeyW = true'); E('human.drive = null');
    // la cámara mira al aro: W = hacia el aro
    E('camYaw = Math.atan2(-Math.sign(hoops[1].rimC.x), 0)');
    run(0.15); key('KeyJ'); let fl = false;
    for (let i = 0; i < 60; i++) { frame(); if (E('human.floater')) fl = true; if (fl && E('human.charge') >= 0.8) break; }
    key('KeyJ', false); E('keys.KeyW = false');
    let a = 0; for (let i = 0; i < 180; i++) { frame(); if (E('!!ball.shot')) a = Math.max(a, E('ball.pos.y')); if (E('state') === 'scored') { made++; break; } }
    if (fl) floats++; apex = Math.max(apex, a);
  }
  console.log('flotadora         | hechas', floats + '/6', '| canastas', made + '/6', '| altura máx del balón', fx(apex), 'm');
}
// ---- tiro tras bote en carrera: frena en dos apoyos, no en seco ----
{
  E(place); E(`human.vel.set(${sx()} * 6.5, 0, 0)`); run(0.05);
  key('KeyJ'); frame(); frame(); const v1 = E('Math.hypot(human.vel.x, human.vel.z)'); const x0 = E('human.pos.x');
  run(0.4); const slid = Math.abs(E('human.pos.x') - x0); key('KeyJ', false); run(1.5);
  console.log('tiro en carrera   | velocidad al empezar a cargar', fx(v1), 'm/s | se desliza', fx(slid), 'm antes de saltar');
}
// ---- colisiones ----
{
  E(place);
  E(`(() => { const a = live.find(p => p.team === 0 && p !== human), b = live.find(p => p.team === 1); window.__a = a; window.__b = b;
    a.pos.set(5, 0, 0); b.pos.set(9, 0, 0.15); ball.holder = human; human.pos.set(14, 0, -8); for (const p of live) if (p !== a && p !== b && p !== human) p.pos.set(14, 0, 8 - p.idx); })()`);
  let minD = 9, crossed = false, bumped = false;
  for (let i = 0; i < 60; i++) { E('window.__a.vel.x = Math.max(window.__a.vel.x, 0); window.__b.vel.x = Math.min(window.__b.vel.x, 0);'); E('window.__a.ai.t = 9; window.__b.ai.t = 9;');
    E('updatePlayer(window.__a, {move: new THREE.Vector3(1,0,0), sprint: true}, CFG.step); updatePlayer(window.__b, {move: new THREE.Vector3(-1,0,0), sprint: true}, CFG.step); playersCollide(window.__a, window.__b);');
    const d = E('hdist(window.__a.pos, window.__b.pos)'); minD = Math.min(minD, d); if (E('window.__a.pos.x > window.__b.pos.x')) crossed = true; if (E('window.__a.bumpT > 0 || window.__b.bumpT > 0')) bumped = true; }
  console.log('choque de frente  | distancia mínima', fx(minD), 'm | se rodean sin solaparse', crossed, '| se desequilibran', bumped);
  // de lado: uno corre en diagonal contra otro quieto y lo rodea
  E('window.__a.pos.set(5, 0, 0); window.__a.vel.set(0, 0, 0); window.__b.pos.set(7, 0, 0.25); window.__b.vel.set(0, 0, 0); window.__a.bumpT = window.__b.bumpT = 0; window.__a.bumpCd = window.__b.bumpCd = 0;');
  let minD2 = 9;
  for (let i = 0; i < 120; i++) { E('updatePlayer(window.__a, {move: new THREE.Vector3(1,0,0), sprint: false}, CFG.step); updatePlayer(window.__b, {move: new THREE.Vector3(), sprint: false}, CFG.step); playersCollide(window.__a, window.__b);'); minD2 = Math.min(minD2, E('hdist(window.__a.pos, window.__b.pos)')); }
  console.log('rodear a un parado| distancia mínima', fx(minD2), 'm | lo ha rebasado', E('window.__a.pos.x > window.__b.pos.x + 0.3'), '| desvío lateral', fx(Math.abs(E('window.__a.pos.z'))), 'm');
}
// ---- falta en ataque y amago y paso ----
{
  let charges = 0;
  for (let n = 0; n < 6; n++) {
    E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x), d = live.find(p => p.team === 1 && p.idx === 0); window.__d = d;
      human.pos.set(c.x - sx * 9, 0, 0); human.vel.set(sx * 7.5, 0, 0); human.burstT = 0; d.pos.set(c.x - sx * 6.6, 0, 0.05); d.vel.set(0, 0, 0); d.yaw = Math.atan2(-sx, 0); d.swipeCd = 99; })()`);
    E('keys.ShiftLeft = true; keys.KeyW = true; camYaw = Math.atan2(-Math.sign(hoops[1].rimC.x), 0)');
    let got = false; for (let i = 0; i < 60; i++) { E('window.__d.vel.set(0, 0, 0); window.__d.pos.z = 0.05;'); frame(); if (E('ball.holder === window.__d')) { got = true; break; } }
    E('keys.ShiftLeft = false; keys.KeyW = false'); if (got) charges++; run(0.5);
  }
  console.log('falta en ataque   | arrollando a un defensor plantado:', charges + '/6 cargas');
  let uu = 0;
  for (let n = 0; n < 4; n++) {
    E(place); E(`(() => { const c = hoops[1].rimC, sx = Math.sign(c.x); human.pos.set(c.x - sx * 3.2, 0, 0.8); human.vel.set(0, 0, 0); human.deadDribble = true; human.fakeCd = 0; })()`);
    E('keys.KeyW = true; camYaw = Math.atan2(-Math.sign(hoops[1].rimC.x), 0)'); key('KeyJ'); let hop = false;
    for (let i = 0; i < 40; i++) { frame(); if (E('human.move && human.move.type === "hop"')) hop = true; }
    key('KeyJ', false); E('keys.KeyW = false'); if (hop) uu++; run(1.5);
  }
  console.log('amago y paso      | tras amago, clic + stick al aro:', uu + '/4');
}
