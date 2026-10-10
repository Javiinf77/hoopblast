# Registro de cambios

## 0.5 alpha «Flow»
**Modos y jugadas**
- Nuevo 5 contra 5, también online.
- Bloqueos: L1 con balón pide bloqueo por la izquierda o la derecha (según el stick) y el compañero más cercano lo pone sobre tu defensor y luego continúa al aro. ○ sin balón te planta como bloqueador (pensado para el online).
- Pase dirigido: mantén R1 con balón y aparece un botón (□ ✕ ○ △) sobre cada compañero; pulsándolo le pasas a él. En teclado, Tab + 1–4.
- Tras canasta, quien anota recoge el balón y se lo pasa al base rival mientras todos se colocan, sin cortes de cámara.

**Controles y tiro**
- Se corre solo con R2; doble R2 gasta el turbo, con llamas en el jugador.
- Mate: corriendo al aro con R2 + □/△/○ (L2 + □ tomahawk, L2 + △ reverso). Menos cámara lenta.
- Bandeja con barra: suelta R2 y mantén □ cerca del aro; suelta en el verde. Debajo del aro sale un aro pasado. La mano depende del lado de la canasta.
- Regates encadenados sin cortes entre animaciones (p. ej. entre las piernas → por la espalda).

**Vestuario y aspecto**
- Caras Mii con ojos, cejas, bocas, gafas, bigotes y barbas; tamaño y posición de ojos, nariz y boca ajustables (±6) con primer plano de la cabeza.
- Vestuario manejable con mando; cinta plana, calcetines y zapatillas altas rediseñadas; la cabeza ya no atraviesa el pelo.
- Pistas exteriores con público, decorado y animaciones.

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

## 0.3 alpha
**Jugabilidad y mecánicas**
- Partido en media pista (3x3): una sola canasta, saque fuera del triple tras cada canasta, regla de sacar el balón fuera del triple tras cambiar la posesión.
- Bote muerto tras el amago de tiro: no puedes volver a botar, solo pasar, tirar o pivotar. Amago fluido (0,3 s, tiro y pase al instante).
- Tiros en vuelo no interceptables hasta que toquen aro o tablero.
- Paso atrás (LS ↓ + □) y paso lateral esprintando (correr de lado + □) con tiro encadenado.
- Eurostep (□ + □ con pausa) y bandeja con giro (□ + □ seguidos) corriendo hacia la canasta.
- Retroceso con bote (RS ↓ / tecla C): gana espacio sin dejar de botar.

**Regates y mano libre**
- La mano del balón ya no es fija: los regates usan direcciones absolutas y el cambio de mano es automático (incluso mientras el cuerpo gira).
- Cruce, entre las piernas, espalda y giro reflejan la dirección (diagonal izquierda → diagonal derecha).
- Stick derecho más estricto (a fondo, ventana ±17°, giro con vuelta completa); regates en el sitio al estar parado.
- Eliminadas la parada falsa y el amago de cruce.

**Energía y sobresfuerzo**
- Sobresfuerzo: 3 cargas azules recargables (9 s con energía llena, 23 s casi vacía). La explosión tras regate gasta una carga y añade un dash +17 % con partículas azules. Sin carga, el regate sale pero sin el impulso extra.

**Pase y selección de receptor**
- Pases más rápidos (directo ~15,5 m/s, picado ~12,5 m/s). L1 (E en teclado) elige el receptor con balón (anillo dorado).
- Robar pases del rival: algo más de alcance al interceptar.

**Defensa y contacto físico**
- Postura (L2) ocupa más espacio; frena al atacante pegado (~15 % menos avance).
- En el poste: empujar hunde al defensor, cansa más al atacante; el defensor en postura aguanta más.

**Mando y controles**
- △ sin balón: salto al rebote (o tapón si el rival tira cerca). L1 sin balón: cambiar de jugador.
- Cámara de retransmisión estilo NBA 2K por defecto (elegible en menú y pausa).

**Animaciones corregidas (modo Animaciones)**
- Eurostep: zancadas muy abiertas, peso a los lados, balón bajo que sube a la bandeja.
- Paso atrás: retroceso con saltito, tiro levantándose mientras saltas.
- Por la espalda (con y sin bote, ambas direcciones): el balón rodea el cuerpo por fuera.
- Giro: sobre el pie de eje fijo (<1,5 cm de desviación), media vuelta del stick.
- Giro de poste: mismo mecanismo de eje, balón por fuera.
- Rebote: el balón se atrae hacia las manos en el aire y baja al pecho.
