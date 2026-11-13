# Dirección visual — "Plano"

## Concepto

Juan diseña y programa webs a medida. La web no debía parecer una consultoría ni una plantilla:
tenía que enseñar el oficio. La idea es la **mesa de trabajo de un diseñador**: retículas, cotas
y marcos de selección, y encima, renderizados en 3D, los portátiles y móviles donde vive el
trabajo.

El titular lo resume con un guiño: «Tu web debería estar **a la altura** de tu negocio», con una
cota vertical en cobalto, como las de un plano, junto a la palabra *altura*.

## Color

Gama sobria y profesional: blancos fríos, tinta azulada y un único acento.

| Token | Valor | Uso |
| --- | --- | --- |
| `paper` | `#f4f5f7` | Fondo general |
| `paper-2` | `#eaedf1` | Superficies hundidas (fondos de las escenas, proceso) |
| `card` | `#ffffff` | Superficies elevadas (tarjetas) |
| `ink` | `#0b1020` | Texto y bloques oscuros (contacto, pie, franja de servicios) |
| `muted` | `#535c6e` | Texto secundario sobre claro (6,2:1) |
| `muted-dark` | `#9aa3b7` | Texto secundario sobre tinta (7,5:1) |
| `accent` | `#2e5bff` | Cobalto: botones (con texto blanco, 5,2:1), marcas, luz de contorno en 3D |
| `accent-ink` | `#2449d8` | Cobalto para texto sobre claro (6,4:1) |
| `accent-light` | `#8ea6ff` | Cobalto para texto e iconos sobre tinta (8,2:1) |

Las webs que aparecen dentro de las escenas tienen sus propias marcas (verde y dorado para «tu
empresa», brasa para el restaurante…): así se ve que cada web se adapta a su marca, mientras
la de Juan mantiene la suya. No se muestran paletas de colores sueltas.

## Tipografía

- **Bricolage Grotesque** (titulares), con su eje de anchura algo estrecho (`wdth 86`) y tamaño
  óptico grande: tiene carácter sin ser excéntrica.
- **Instrument Sans** (texto): neutra y muy legible.
- **Geist Mono** (etiquetas, numeraciones, cotas): el detalle técnico.

## La portada: un escaparate de producto

La portada se trata como el lanzamiento de un producto: fondo casi negro (`#05070d`), un
portátil que flota cerrado con el emblema de la marca, la palabra «A MEDIDA» gigante detrás y
un halo cobalto. Al bajar, la escena se queda fija y cuenta el servicio en cuatro pasos (la web
se enciende, se recorre, llega al móvil y cambia según el negocio) mientras los textos pasan
por encima. La cabecera se vuelve clara sobre ese fondo. El resto de la web vuelve a los
blancos fríos.

## Profundidad, luz y sombra

- Las escenas son **renders de three.js**: portátiles, móviles, tableta, ventanas flotantes,
  etiquetas y un cursor, construidos con geometría propia (losas redondeadas con cantos
  biselados) y materiales físicos: aluminio, cristal oscuro, tarjetas con barniz.
- Las pantallas se dibujan en canvas con las tipografías de la web, así que se leen nítidas.
- Luz de estudio generada en local (sin mapas HDR descargados), luz principal cenital con
  sombra suave, contraluz en cobalto y sombras de contacto bajo cada pieza.
- La cámara se encuadra sola a partir de las piezas de cada escena.
- El formulario no está en 3D (se tiene que rellenar con comodidad): la profundidad la dan dos
  hojas apiladas detrás.

## Movimiento

Principios: curvas de salida fuertes (`expo.out`), nada aparece de la nada (siempre desde algo
de desplazamiento, opacidad o desenfoque), escalonados cortos, la interacción con el ratón con
muelles, y la animación al servicio de explicar el servicio.

- **Portada en vivo**: la luz sube desde la oscuridad, un brillo recorre la tapa y la escena
  sigue al scroll con inercia (muelle). La pantalla se enciende con un destello; los conceptos
  pasan con una cortinilla de luz; el móvil llega girando en arco.
- **Textos**: titulares palabra a palabra tras una máscara; los textos del escaparate entran y
  salen con el scroll; el bloque de la portada se desvanece hacia arriba al bajar.
- **Imágenes**: se descubren con un recorte que se abre y un acercamiento; paralaje suave.
- **Interacción**: tarjetas que se inclinan hacia el ratón, botones magnéticos con rebote al
  soltarlos, brillo que cruza el botón principal, presión al pulsar.
- **Transiciones entre secciones**: la primera sección clara entra como una hoja que se desliza
  sobre el escaparate oscuro.
- **Móvil**: la escena 3D también va en vivo (calidad ligera); servicios y proceso son
  carruseles que se deslizan con el dedo; la cabecera se esconde al bajar.
- Con `prefers-reduced-motion` no hay animaciones, escena en vivo ni scroll suave.

## Regla editorial

No se inventan apellidos, trayectoria, clientes, cifras, precios ni testimonios. Los trabajos
son conceptos con marcas ficticias (dominios `.example`) y se presentan como tales.
