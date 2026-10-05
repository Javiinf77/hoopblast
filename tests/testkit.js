// Kit de cabezas propio: todas las piezas se construyen, sin valores raros y con las caras hacia fuera
const base=require('fs').readFileSync(require('path').join(__dirname,'mintest.js'),'utf8');
let src=base.split("run(1); $('play').click();")[0].replace("const script=","let script=").replace("new Function(","script=script.replace(\"'use strict';\",\"'use strict'; window.__kit=(k,i)=>kitGeo(k,i); window.__kitN=()=>({head:HEAD_N, hair:HAIR_NAMES.length, nose:NOSE_NAMES.length, beard:BEARD_NAMES.length}); window.__C=()=>HEAD_C;\");\nnew Function(");
src += `
run(0.2); const N=w.__kitN(), C=w.__C(); const bad=[]; let tot=0;
for (const kind of ['head','hair','nose','beard']) for (let i=0;i<N[kind];i++) { let g=w.__kit(kind,i); if(!g) continue; tot++; if(g.index) g=g.toNonIndexed();
  let ref=C; if(kind==='nose' || (kind==='beard' && i===0)){ g.computeBoundingBox(); const b=g.boundingBox; ref=[(b.min.x+b.max.x)/2,(b.min.y+b.max.y)/2,(b.min.z+b.max.z)/2]; }
  const p=g.attributes.position.array, n=g.attributes.normal.array; let out=0, T=p.length/9, nan=false;
  for (let t=0;t<T;t++){ const a=t*9; let mx=0,my=0,mz=0,nx=0,ny=0,nz=0; for(let k=0;k<3;k++){ mx+=p[a+k*3]; my+=p[a+k*3+1]; mz+=p[a+k*3+2]; nx+=n[a+k*3]; ny+=n[a+k*3+1]; nz+=n[a+k*3+2]; if(!isFinite(p[a+k*3])) nan=true; }
    mx=mx/3-ref[0]; my=my/3-ref[1]; mz=mz/3-ref[2]; if(mx*nx+my*ny+mz*nz>0) out++; }
  if (nan || out/T < 0.5) bad.push(kind+i+' ('+(out/T*100).toFixed(0)+'%)'); }
console.log('piezas del kit:', tot, '|', bad.length ? 'MAL: '+bad.join(', ') : 'todas correctas y orientadas hacia fuera');
process.exit(bad.length?1:0);
`;
eval(src);
