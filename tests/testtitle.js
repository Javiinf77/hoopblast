// pantalla de título: la jugada de intro se reproduce en bucle y cualquier tecla lleva al menú
const base=require('fs').readFileSync(require('path').join(__dirname,'testanim.js'),'utf8').split("const \$=id=>w.document.getElementById(id);")[0];
eval(base + `
const $=id=>w.document.getElementById(id);
setTimeout(()=>{
  run(0.2);
  const d=w.__dbg(), h=d.human; let dunk=false, mx=0, holderEnd=null;
  console.log('al cargar: título visible', !$('titlescreen').hidden, '| menú oculto', $('menu').hidden, '| versión', $('tversion').textContent);
  for(let i=0;i<60*12;i++){ run(1/60); if(h.dunkSeq) dunk=true; }
  console.log('12 s de intro: hubo mate', dunk, '| modo', d.mode, '| bucle activo', d.ANIM.cur!==null);
  w.dispatchEvent(new w.KeyboardEvent('keydown',{code:'KeyX'})); run(0.3);
  console.log('tecla → título oculto', $('titlescreen').hidden, '| menú visible', !$('menu').hidden, '| modo', d.mode);
  $('controlsBtn').click(); run(0.1); console.log('Controles → pestaña visible', !$('controls').hidden, '| menú oculto', $('menu').hidden);
  $('controlsBack').click(); run(0.1); $('play').click(); run(8); console.log('partido tras el título: estado', d.state);
}, 10);
`);
