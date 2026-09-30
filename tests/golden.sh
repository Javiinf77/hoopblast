#!/bin/bash
# ejecuta la batería de pruebas con aleatoriedad fija y guarda la salida en $1
cd "$(dirname "$0")"; out=$1; : > $out
for t in "smoke2.js easy" "smoke2.js normal" "smoke2.js hard" test9.js test9b.js testblock.js testpad.js testpad2.js teststance3.js testdrib2.js testdrib3.js testfake.js traintest.js energytest.js; do
  echo "=== $t" >> $out
  timeout 300 node -r ./seed.js $t >> $out 2>&1
done
