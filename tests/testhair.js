// Comprueba que todas las mallas Mii (cabeza, pelo, nariz, barba) quedan orientadas hacia fuera tras decodificarlas.
// Uso: node tests/testhair.js index.html  (sale con código 1 si alguna malla está mal orientada)
// prueba de humo de la versión comprimida: carga, partido, entrenamiento y vestuario sin errores
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let script=html.slice(html.indexOf('<script>')+8, html.lastIndexOf('</script>'));
const dom=new JSDOM(html.slice(0,html.indexOf('<script src')),{pretendToBeVisual:true, url:'https://example.org/'});
const w=dom.window; const THREE=require('three');
class R{constructor(){this.domElement=w.document.createElement('canvas');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.domElement.requestPointerLock=()=>{};} setPixelRatio(){} setSize(){} render(){}}
THREE.WebGLRenderer=R; w.THREE=THREE;
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(t,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{} ,set:()=>true});};
w.matchMedia=()=>({matches:false});
let cbs=[],tnow=0;
script=script.replace("'use strict';","'use strict'; window.__mii=(k,i)=>miiGeo(k,i); window.__miiD=()=>MII_DATA; window.__Cf=()=>MII_CENTER;");
new Function('window','document','THREE','performance','requestAnimationFrame','addEventListener','innerWidth','innerHeight','localStorage',script)(w,w.document,THREE,{now:()=>tnow},f=>cbs.push(f),w.addEventListener.bind(w),1280,720,w.localStorage);
function run(sec){ for(let i=0;i<sec*60;i++){ tnow+=1000/60; const c=cbs; cbs=[]; for(const f of c){ try{f(tnow)}catch(e){console.log('ERROR',e.stack.split('\n').slice(0,2).join(' '));process.exit(1)} } } }
const $=id=>w.document.getElementById(id);

run(0.2);
const CC=w.__Cf(), DATA=w.__miiD(); const bad=[];
for (const kind of ['head','hair','nose','beard']) { const n=DATA[kind].length; let worst=1;
  for (let i=0;i<n;i++){ const g=w.__mii(kind,i); if(!g) continue; const p=g.attributes.position.array, I=g.index.array, N=g.attributes.normal.array; let out=0, agree=0; const T=I.length/3;
    for(let t=0;t<T;t++){ const a=I[3*t]*3,b=I[3*t+1]*3,c=I[3*t+2]*3;
      const u=[p[b]-p[a],p[b+1]-p[a+1],p[b+2]-p[a+2]], v=[p[c]-p[a],p[c+1]-p[a+1],p[c+2]-p[a+2]];
      const gn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const m=[(p[a]+p[b]+p[c])/3-CC[0],(p[a+1]+p[b+1]+p[c+1])/3-CC[1],(p[a+2]+p[b+2]+p[c+2])/3-CC[2]];
      if(gn[0]*m[0]+gn[1]*m[1]+gn[2]*m[2]>0) out++;
      const nn=[0,1,2].map(j=>N[I[3*t]*3+j]+N[I[3*t+1]*3+j]+N[I[3*t+2]*3+j]); if(gn[0]*nn[0]+gn[1]*nn[1]+gn[2]*nn[2]>0) agree++; }
    worst=Math.min(worst,out/T); if(out/T<0.5 || agree/T<0.75) bad.push(kind+i+' (fuera '+(out/T*100).toFixed(0)+'%, normales coherentes '+(agree/T*100).toFixed(0)+'%)'); }
  console.log(kind.padEnd(5), String(n).padStart(2), 'mallas | peor fracción de caras hacia fuera', (worst*100).toFixed(0)+'%'); }
console.log(bad.length ? 'MAL ORIENTADAS: '+bad.join(',') : 'OK: todas las mallas miran hacia fuera y sus normales coinciden con el orden de vértices');
process.exit(bad.length ? 1 : 0);
