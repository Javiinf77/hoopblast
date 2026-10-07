// Cabeza y pelo: para las 8 cabezas × 70 peinados, cuenta cuántas direcciones (rayos desde el centro de la cabeza)
// tienen la cabeza por fuera del pelo, es decir, el cuero cabelludo asomando. Debe ser 0.
// Uso: node testhairfit.js [archivo.html]
const path = require('path'), fs = require('fs'), file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'index.html');
const { JSDOM } = require('jsdom'); const THREE = require('three');
const html = fs.readFileSync(file, 'utf8');
let script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const i = script.lastIndexOf('})();'); script = script.slice(0, i) + 'window.__ev = s => eval(s);\n' + script.slice(i);
const dom = new JSDOM(html.slice(0, html.indexOf('<script src')), { pretendToBeVisual: true, url: 'https://example.org/' }); const w = dom.window;
class R { constructor() { this.domElement = w.document.createElement('canvas'); this.shadowMap = {}; this.capabilities = { getMaxAnisotropy: () => 1 }; this.domElement.requestPointerLock = () => {}; } setPixelRatio() {} setSize() {} render() {} }
THREE.WebGLRenderer = R; w.THREE = THREE;
w.HTMLCanvasElement.prototype.getContext = function () { return new Proxy({}, { get: (t, k) => k === 'createRadialGradient' || k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}, set: () => true }); };
w.matchMedia = () => ({ matches: false });
new Function('window', 'document', 'THREE', 'performance', 'requestAnimationFrame', 'addEventListener', 'innerWidth', 'innerHeight', 'localStorage', script)(w, w.document, THREE, { now: () => 0 }, () => {}, w.addEventListener.bind(w), 1280, 720, w.localStorage);
const E = s => w.__ev(s), dirs = [];
for (let e = -0.2; e <= 1.5; e += 0.1) for (let a = 0; a < 48; a++) dirs.push([Math.cos(e) * Math.sin(a / 48 * 6.283), Math.sin(e), Math.cos(e) * Math.cos(a / 48 * 6.283)]);
const nH = E('MII_DATA.head.length'), nh = E('MII_DATA.hair.length'), fit = typeof E('typeof fitUnderHair') === 'string' && E('typeof fitUnderHair') === 'function';
let worst = 0, total = 0, bad = 0; const rows = [];
for (let h = 0; h < nH; h++) { let rowMax = 0;
  for (let k = 0; k < nh; k++) {
    if (k === 31) continue;   // peinado de calvicie: la coronilla calva es a propósito
    const r = E(`(() => { const hair = miiGeo('hair', ${k}), C = MII_CENTER, hp = hair.attributes.position.array, hi = hair.index.array;
      const head = ${fit ? `fitUnderHair(miiGeo('head', ${h}), hair, 'h${h}_${k}')` : `miiGeo('head', ${h})`}, p = head.attributes.position.array, I = head.index.array;
      // solo cuenta dentro de la zona del pelo (los rayos vecinos también lo tocan): en el borde la piel sale de debajo del pelo, como debe
      const D = ${JSON.stringify(dirs)}, hit = D.map(d => rayFar(hp, hi, C, d, true)), W = 48;
      let n = 0; for (let j = 0; j < D.length; j++) { const fh = hit[j]; if (fh <= 0) continue;
        const a = j % W, row = (j - a) / W, nb = [[row, a + 1], [row, a - 1], [row + 1, a], [row - 1, a]].map(([rr, aa]) => hit[rr * W + ((aa + W) % W)]);
        if (nb.some(x => !(x > 0))) continue;
        const rh = rayFar(p, I, C, D[j]); if (rh > fh - 0.002 && rh - fh < (D[j][1] > 0.35 ? 0.12 : 0.045)) n++; } return n; })()`);   // pelo enterrado a propósito: no cuenta
    total++; if (r > 3) bad++; worst = Math.max(worst, r); rowMax = Math.max(rowMax, r); if (process.env.DET && r > 3) console.log('combo', h, k, r);
  }
  rows.push('cabeza ' + (h + 1) + ': peor peinado ' + rowMax + ' rayos');
}
console.log(rows.join('\n'));
console.log('combinaciones con el cuero cabelludo asomando (más de 3 rayos):', bad, '/', total, '| peor:', worst, 'rayos de', dirs.length);
