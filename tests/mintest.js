// prueba de humo de la versión comprimida: carga, partido, entrenamiento y vestuario sin errores
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const script=html.slice(html.indexOf('<script>')+8, html.lastIndexOf('</script>'));
const dom=new JSDOM(html.slice(0,html.indexOf('<script src')),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
let cbs=[],tnow=0;
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','localStorage',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.localStorage);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERROR',e.stack.split('\n').slice(0,2).join(' '));process.exit(1)} } } }
const $=id=>w.document.getElementById(id);
run(1); $('play').click(); run(120);
console.log('partido: marcador', $('s0').textContent,'-',$('s1').textContent,'reloj',$('clock').textContent);
$('quit').click(); run(0.5); $('train').click(); run(20); console.log('entrenamiento: panel visible', !$('trainpanel').hidden);
$('quit').click(); run(0.5); $('customize').click(); run(2); w.document.querySelector('#custform .ob').click(); run(1); $('custRand').click(); run(1); $('custDone').click(); run(1);
console.log('vestuario ok, menú visible', !$('menu').hidden, '| sin errores');
