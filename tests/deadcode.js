const acorn=require('acorn'), walk=require('acorn-walk'), fs=require('fs');
const s=fs.readFileSync(process.argv[2],'utf8');
const js=s.slice(s.indexOf('<script>\n')+9, s.lastIndexOf('</script>'));
const ast=acorn.parse(js,{ecmaVersion:2022, allowReturnOutsideFunction:true});
const body=ast.body[0].expression.callee.body.body;   // (() => { ... })()
const declared=new Map();
for(const st of body){
  if(st.type==='FunctionDeclaration') declared.set(st.id.name,0);
  if(st.type==='VariableDeclaration') for(const d of st.declarations) if(d.id.type==='Identifier') declared.set(d.id.name,0);
}
walk.full(ast, n=>{ if(n.type==='Identifier' && declared.has(n.name)) declared.set(n.name, declared.get(n.name)+1); });
console.log('Sin uso (solo la declaración):', [...declared].filter(([k,v])=>v<=1).map(([k])=>k).join(', ')||'ninguna');
console.log('Declaraciones de primer nivel:', declared.size, '| sentencias:', body.length);
