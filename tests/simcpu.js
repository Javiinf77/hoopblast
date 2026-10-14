// CPU contra CPU: simula un partido (también tu jugador lo lleva la IA) y saca estadísticas para ajustar la IA.
// Uso: node simcpu.js [archivo.html] [tamaño 1|3|5] [segundos]
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
const size = +(process.argv[3] || 3), secs = +(process.argv[4] || 150);
run(1); E(`matchSize = ${size}`); w.document.getElementById('play').click(); run(4.5);
// CPU contra CPU: el humano también lo lleva la IA
E('setControlled = () => {}; human.isHuman = false; humanFrameInput = () => aiThink(human, 1 / 60); CFG.matchTime = 9999; clock = 9999;');
E(`window.__S = { moves: {}, combos: 0, passes: 0, clump: 0, samples: 0, shots: [], flows: 0, bumps: 0, poss: 0, screens: 0, floaters: 0, hops: 0 };
const _sm = startMove; startMove = function (p, t, ...a) { const ok = _sm(p, t, ...a); if (ok && p.move && p.move.type === t) { window.__S.moves[t] = (window.__S.moves[t] || 0) + 1; if (p.chain.length > 1) window.__S.combos++; } return ok; };
const _ps = pass; pass = function (...a) { window.__S.passes++; return _ps(...a); };
const _sa = screenAction; screenAction = function (...a) { window.__S.screens++; return _sa(...a); };
const _sh = shoot; shoot = function (p) { const _d = hdist(p.pos, hoops[p.attackSide].rimC), rec = { d: _d, c: contestAmount(p), f: !!p.floater, ch: p.charge, w: shotWindow(p, _d, p.floater ? 'float' : p.shotKind || 'jump'), k: p.shotKind, gr: p.onGround, y: p.pos.y }; window.__S.shots.push(rec); if (p.floater) window.__S.floaters++; const r = _sh(p); if (ball.shot) ball.shot.rec = rec; return r; };
const _os = onScore; onScore = function (hi) { const sh = ball.shot; if (sh && sh.rec) sh.rec.made = true; return _os(hi); };
const _rs = resolveSwipe; resolveSwipe = function (p) { const c = ball.holder; const k = c ? (c.protectT > 0 ? 'prot' : exposure(c, p) < -0.2 ? 'body' : exposure(c, p) > 0.25 ? 'exp' : 'side') : 'none'; const before = stats[p.team].steals; _rs(p); const ok = stats[p.team].steals > before; window.__S.sw = window.__S.sw || {}; const key = k + (ok ? '+' : '-'); window.__S.sw[key] = (window.__S.sw[key] || 0) + 1; };
const _pk = pass; pass = function (p, to, al, ty) { window.__S.pk = window.__S.pk || {}; const k = (p.inbounding ? 'saque' : 'juego') + '-' + (ty || 'chest'); window.__S.pk[k] = (window.__S.pk[k] || 0) + 1; return _pk(p, to, al, ty); };
const _cf = chargeFoul; chargeFoul = function (...a) { window.__S.charges = (window.__S.charges || 0) + 1; return _cf(...a); };
const _rl = releaseLayup; releaseLayup = function (p) { const rec = { d: hdist(p.pos, hoops[p.attackSide].rimC), c: contestAmount(p), lay: true, ct: contested(p), y: ball.pos.y, sk: shotSkill(p), m: !!(p.layupSeq && p.layupSeq.meter), mv: p.layupSeq ? +p.layupSeq.t.toFixed(2) : -1 }; window.__S.shots.push(rec); const r = _rl(p); if (ball.shot) ball.shot.rec = rec; return r; };`);
for (let i = 0; i < secs * 60; i++) {
  frame();
  if (i % 6 === 0 && E("state === 'play' && !!ball.holder")) {
    const r = E(`(() => { const t = ball.holder.team, m = live.filter(p => p.team === t); let c = 0; for (let a = 0; a < m.length; a++) for (let b = a + 1; b < m.length; b++) if (hdist(m[a].pos, m[b].pos) < 2.2) c++; return c; })()`);
    E(`window.__S.samples++; window.__S.clump += ${r}; for (const p of live) if (p.bumpT > 0.2) window.__S.bumps++; if (live.some(p => p.flowT > 11.9)) window.__S.flows++;`);
  }
}
const S = E('window.__S'), st = E('stats');
const sh = S.shots, n = sh.length || 1;
console.log(`${size}c${size} ${secs}s | marcador ${E('score.join("-")')} | tiros ${sh.length} (bandejas ${sh.filter(s => s.lay).length}, flotadoras ${S.floaters}, triples ${sh.filter(s => s.d > 6.75).length}) | dist media ${(sh.reduce((a, s) => a + s.d, 0) / n).toFixed(1)} m | punteo medio ${(sh.reduce((a, s) => a + s.c, 0) / n).toFixed(2)}`);
console.log(`  pases ${S.passes} | robos ${st[0].steals + st[1].steals} | tapones ${st[0].blocks + st[1].blocks} | mates ${st[0].dunks + st[1].dunks} | asist ${st[0].assists + st[1].assists} | bloqueos ${S.screens} | aglomeración ${(S.clump / S.samples).toFixed(2)} pares<2,2m | choques ${S.bumps} | flow ${S.flows}`);
const cat = (nm, fl) => { const a = sh.filter(fl); return nm + ' ' + a.filter(x => x.made).length + '/' + a.length; };
console.log('  aciertos:', cat('bandejas', x => x.lay), '|', cat('flotadoras', x => x.f), '|', cat('cerca<3m', x => !x.lay && !x.f && x.d < 3), '|', cat('media', x => !x.lay && !x.f && x.d >= 3 && x.d < 6.75), '|', cat('triples', x => !x.lay && x.d >= 6.75), '| abiertos (punteo<0,2)', cat('', x => x.c < 0.2), '| punteados', cat('', x => x.c >= 0.2));
console.log('  detalle tiros:', sh.filter(x => !x.lay).map(x => `${x.d.toFixed(1)}m ${x.k}${x.f ? 'F' : ''} e${(x.ch - 0.8).toFixed(2)} w${x.w.toFixed(3)} ${x.made ? 'SI' : 'no'}`).join(' · '));
console.log('  bandejas:', sh.filter(x => x.lay).map(x => `${x.d.toFixed(1)}m h${x.y.toFixed(2)} c${x.c.toFixed(2)}${x.ct ? '*' : ''} t${x.mv} ${x.made ? 'SI' : 'no'}`).join(' · '));
console.log('  manotazos', JSON.stringify(S.sw), '| cargas', S.charges || 0, '| interceptados', st[0].steals + st[1].steals - Object.entries(S.sw || {}).filter(([k]) => k.endsWith('+')).reduce((a, [, v]) => a + v, 0), '| pases', JSON.stringify(S.pk));
console.log('  regates', JSON.stringify(S.moves), '| combos', S.combos);
