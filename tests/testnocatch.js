// un defensor saltando delante del tirador y otro bajo el aro: ¿pueden coger el tiro en vuelo?
let src=require('fs').readFileSync('testblock.js','utf8').split('// 1) tiro del rival')[0].replace("'/mnt/user-data/outputs/hoopblast.html'","'/home/claude/reorg_out.html'").replace(/process\.env\.HOOPBLAST\|\|[^)]*\)/,"'/home/claude/reorg_out.html'");
eval(src + `
const V=h.pos.constructor; const rim=d.hoops[1].rimC;
let caughtInFlight=0, rebounds=0, N=10;
for(let i=0;i<N;i++){ d.state='play';
  r.pos.set(rim.x-6,0,0); r.vel.set(0,0,0); r.attackSide=1; r.stunT=0; r.charging=false; d.ball.holder=r; d.ball.shot=null;
  h.pos.set(rim.x-2.2,0,0.1*(i-5)); h.vel.set(0,0,0); h.vel.y=5.5; h.onGround=false; h.blockCd=9; h.blockT=0;   // salta en la trayectoria (sin tapón)
  r.charge = 0.65 + 0.03*i; d.ball.pos.set(r.pos.x+0.2,2.3,0); r.shotKind='jump';
  w.__shoot(r);
  let caught=false, touched=false;
  for(let k=0;k<240;k++){ run(1/120); if(d.ball.shot && d.ball.shot.touched) touched=true; if(d.ball.holder===h){ if(!touched) caught=true; break; } }
  if(caught) caughtInFlight++; else if(d.ball.holder===h) rebounds++;
}
console.log('tiros atrapados en vuelo por un jugador saltando en la trayectoria:', caughtInFlight+'/'+N, '| rebotes cogidos tras tocar aro/tablero:', rebounds);
`);
