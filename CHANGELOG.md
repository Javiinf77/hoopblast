# Registro de cambios

## 0.2 alpha
**3 contra 3 y controles**
- Controlas siempre a quien tiene el balón; el pase va al compañero hacia el que apuntas (anillo blanco) y el control salta al receptor.
- En defensa, L1 cambia al compañero más cercano al balón. △ sin balón: salto al rebote, o tapón si el rival está tirando cerca.
- Mando: R1 para correr, L2 postura (agacharse y proteger), stick derecho para regates estilo NBA 2K. Lectura robusta de L2.
- Pases más lentos (directo ~11 m/s, picado ~9,5 m/s, bombeado con más vuelo).

**Cámara y presentación**
- Cámara de retransmisión estilo NBA 2K por defecto, seleccionable en menú y pausa (o tercera persona).
- Cabezas estilo Mii (modelos provisionales, solo uso privado) y vestuario rediseñado con pestañas; el jugador ya no gira solo.

**Tiro y juego interior**
- La franja verde se estrecha mucho con la distancia; release realista (mano bajo el balón, mano guía, golpe de muñeca); el tirador queda fijo.
- Poste con L2 cerca del aro (con o sin defensor): empujar al defensor, gancho, fadeaway y giro de poste sobre pie de eje.
- Paso atrás (stick atrás + □) y paso lateral (esprintando de lado + □), híbridos con el tiro.
- Eurostep (□ + □ con pausa) y bandeja con giro (□ + □ seguidos) corriendo hacia la canasta.

**Regates y animación**
- Cruce y entre las piernas suaves con inercia; por la espalda con y sin bote sin atravesar el cuerpo; giro de 360° sobre pie de eje; retroceso con bote (stick derecho ↓).
- Los cambios reflejan la dirección (diagonal izquierda → diagonal derecha). Eliminados la parada falsa y el amago de cruce.
- Bote más lateral y adelantado con ambas manos, pantalón articulado con las piernas, captura de rebote, animaciones exageradas.

**Entrenamiento y herramientas**
- Rival de práctica activable (P / Share). Paneles a la derecha para no tapar la canasta.
- Modo Animaciones (depuración): cada animación por separado, fotograma a fotograma hacia delante y atrás, velocidad y cámara orbital.

**Correcciones**
- El juego se colgaba al usar el mando dentro de marcos sin permiso; L2 se quedaba pulsado con un rival cerca.

## 0.1 pre-alpha — primera versión
**Juego**
- Partidos 3v3 contra IA (fácil, normal, difícil), 4 minutos, 14 s de posesión, saque de fondo tras canasta y gol de oro.
- Modo entrenamiento en solitario con estadísticas de tiro, retorno automático del balón y panel de combos.
- Vestuario: piel, 8 peinados, color de pelo, 7 estampados, 3 colores de equipación, dorsal y accesorios (cinta, manga, muñequeras, coderas, rodilleras, calcetines, zapatillas).

**Mecánicas**
- Física propia del balón: efecto, rebotes en aro toroidal, tablero y cristal; aro reglamentario a 3,05 m y jugadores de 1,95 m.
- Tiro con medidor (franja verde), bandeja, amago de tiro y paso atrás.
- Seis mates: una mano, dos manos, tomahawk, molino, 360 y reverso; colgarse del aro.
- Siete regates estilo NBA 2K (stick derecho), explosión tras el regate, combos encadenados y reacción del defensor.
- Postura ofensiva/defensiva (L2), corte defensivo, robo por manotazo, tapón con timing e interferencia.
- Pases directo, picado y bombeado con atracción hacia el receptor; alley-oops.
- Energía estilo Rematch: solo el sprint gasta; estado de agotamiento.

**Controles**
- Teclado y ratón, y mando de PS4 con iconos en pantalla y vibración.

**Técnico**
- Código organizado en 31 secciones comentadas; pruebas de regresión con referencia.
- Corregido: el juego se colgaba cuando un jugador se agotaba.
