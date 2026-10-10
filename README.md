# 🏀 Hoopblast 3v3

Baloncesto 3 contra 3 arcade en el navegador, con estética cel-shading inspirada en Rematch y controles de regate inspirados en NBA 2K.
Todo el juego está en **un solo archivo** (`index.html`): sin instalación y sin recursos externos, salvo Three.js y las fuentes de Google.

**Versión actual: 0.5 alpha «Flow»** · [Qué incluye](CHANGELOG.md)

## Jugar
- Abre `index.html` en Chrome, Edge o Firefox de escritorio.
- O juega en la web si GitHub Pages está activado: `https://javiinf77.github.io/hoopblast/`
- Teclado y ratón, o mando de PS4 (se detecta solo). Los controles completos están en el menú del juego.

## Jugar online con amigos
1. Uno crea la sala en **Online** y comparte el código que aparece.
2. Los demás abren el juego, entran en **Online** y escriben ese código.
3. Hasta 10 jugadores (1c1, 2c2, 3c3 o 5c5). Cada uno controla solo a su jugador; los huecos libres los lleva la IA.

Todos tienen que tener la misma versión del juego: descargad `index.html` (o `dist/hoopblast.min.html`) del último commit de `main`, o usad el enlace de GitHub Pages.

## Estructura del repositorio
| Ruta | Qué es |
|---|---|
| `index.html` | El juego, con el código comentado y organizado en secciones §01–§31 (el índice está al inicio del código JavaScript) |
| `dist/hoopblast.min.html` | Versión comprimida para compartir |
| `tests/` | Pruebas de regresión: simulan partidos y mecánicas con aleatoriedad fija |
| `tools/minify.js` | Genera la versión comprimida |

## Desarrollo
```bash
npm install        # dependencias de las pruebas (solo la primera vez)
npm test           # ¿el comportamiento sigue igual que la referencia?
npm run smoke      # prueba rápida de carga, partido, entrenamiento y vestuario
npm run min        # regenera dist/hoopblast.min.html
```
Si un cambio es intencionado, las diferencias de `npm test` deben estar solo en lo que se ha tocado.
Al cerrar una versión, se regenera la referencia (`tests/referencia_X.txt`).

## Ramas y versiones
- `main`: solo versiones estables y probadas, etiquetadas (`v0.1-prealpha`, `v0.2-prealpha`...).
- `dev`: trabajo en curso.
- `feature/...`: funcionalidades grandes o arriesgadas (por ejemplo `feature/online`); se fusionan en `dev` cuando funcionan.

Numeración: `0.x pre-alpha` → `0.x alpha` → `0.x beta` → `1.0`.
