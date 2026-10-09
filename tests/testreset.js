// Reposición tras canasta (partido 3v3 y 1v1): quien anota recoge el balón y se lo pasa al base rival en lo alto
// mientras todos se colocan andando. Comprueba: fases en orden, duración, sin teletransportes, quién recibe y que empieza el juego.
// Uso: node testreset.js [archivo.html]
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
run(1);
for (const size of [3, 1]) {
  E(`matchSize = ${size}`); w.document.getElementById('play').click(); run(4.5);
  for (const scoreTeam of [0, 1]) {
    // canasta simulada: el balón cae por el aro, lanzado por un jugador del equipo que anota
    E(`(() => { const sh = live.find(p => p.team === ${scoreTeam}); const c = hoops[1].rimC; state = 'play'; ball.holder = null; ball.guide = null;
      ball.pos.set(c.x, c.y - 0.05, c.z); ball.vel.set(0, -3, 0); ball.shot = { team: ${scoreTeam}, shooter: sh, from3: false }; possTeam = ${scoreTeam};
      for (const p of live) { p.pos.set(c.x - Math.sign(c.x) * (2 + Math.random() * 4), 0, (Math.random() - 0.5) * 8); p.vel.set(0, 0, 0); } onScore(1); })()`);
    const ph = [], stamps = [], t0 = tnow; let maxJump = 0, prev = E('live.map(p => [p.pos.x, p.pos.z])'), carried = false, played = false;
    for (let f = 0; f < 60 * 8; f++) {
      frame();
      const st = E('state'), r = E('RESET && RESET.ph');
      if (r && ph[ph.length - 1] !== r) { ph.push(r); stamps.push(tnow); }
      if (E('RESET && ball.holder === RESET.scorer')) carried = true;
      const cur = E('live.map(p => [p.pos.x, p.pos.z])');
      cur.forEach((q, i) => { maxJump = Math.max(maxJump, Math.hypot(q[0] - prev[i][0], q[1] - prev[i][1])); }); prev = cur;
      if (st === 'play') { played = true; break; }
    }
    const res = E(`({ holder: ball.holder ? ball.holder.team + '/' + ball.holder.idx : 'nadie', poss: possTeam, far: Math.max(...live.map(p => hdist(p.pos, p.home))).toFixed(2), control: human === players[0] || human.team === 0 })`);
    stamps.push(tnow); const durs = ph.map((x, i) => x + ' ' + ((stamps[i + 1] - stamps[i]) / 1000).toFixed(1) + 's');
    console.log(`${size}c${size} anota ${scoreTeam === 0 ? 'tu equipo' : 'el rival '}: fases ${durs.join(' → ')} | ${((tnow - t0) / 1000).toFixed(1)} s | lo lleva quien anota ${carried} | recibe ${res.holder} (posesión ${res.poss}) | más lejos de su sitio ${res.far} m | mayor salto por fotograma ${maxJump.toFixed(2)} m | juego en marcha ${played}`);
  }
  E(`document.getElementById('quit') && document.getElementById('quit').click()`); run(0.5);
}
