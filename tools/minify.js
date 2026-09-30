// Genera la versión comprimida: JS minificado con terser, CSS y HTML sin comentarios ni espacios sobrantes
const { minify } = require('terser'), fs = require('fs');
(async () => {
  const s = fs.readFileSync(process.argv[2], 'utf8');
  const a = s.indexOf('<script>\n') + 9, b = s.lastIndexOf('</script>');
  const r = await minify(s.slice(a, b), { ecma: 2020, compress: { passes: 2 }, mangle: true, format: { comments: false } });
  let head = s.slice(0, a).replace(/<!--[\s\S]*?-->\s*/g, '');
  head = head.replace(/<style>([\s\S]*?)<\/style>/, (m, css) => '<style>' + css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};:,>])\s*/g, '$1').replace(/;}/g, '}') + '</style>');
  head = head.replace(/>\s*\n\s*</g, '><');
  const out = '<!-- Hoopblast 3v3 v0.1 pre-alpha (versión comprimida; el código comentado está en hoopblast.html) -->\n' + head + r.code + '\n' + s.slice(b).replace(/>\s*\n\s*</g, '><');
  fs.writeFileSync(process.argv[3], out);
  console.log('original', s.length, '→ comprimido', out.length, '(' + Math.round(out.length / s.length * 100) + ' %)');
})();
