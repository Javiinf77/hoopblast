# Pruebas de regresión
Simulan el juego sin navegador (jsdom) con `Math.random` fijo (`seed.js`), así que la salida es siempre la misma.
- `bash golden.sh salida.txt` → ejecuta todo · `diff referencia_0.1-prealpha.txt salida.txt` → sin diferencias = nada roto.
- `node mintest.js ../index.html` → prueba de humo de cualquier versión (también la comprimida).
- `node deadcode.js ../index.html` → variables o funciones sin uso.
Por defecto prueban `../index.html`; otra ruta: `HOOPBLAST=/ruta/archivo.html bash golden.sh salida.txt`.
