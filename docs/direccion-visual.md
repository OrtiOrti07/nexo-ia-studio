# Dirección visual — "Señal"

## Concepto

Una consultoría de IA convierte ruido en señal: procesos desordenados, datos dispersos y tareas
repetitivas pasan a ser sistemas claros que trabajan solos. La web cuenta esa idea con un único
objeto 3D vivo: **un núcleo neuronal de partículas** que, a medida que se baja por la página,
se reorganiza en formaciones distintas. Cada sección tiene la suya:

| Sección | Formación | Lectura |
| --- | --- | --- |
| Hero | Núcleo: esfera neuronal con sinapsis que laten | La inteligencia, en estado puro |
| Servicios | Constelación: un disco galáctico al fondo | Muchas capacidades, un mismo sistema |
| Método | Señal: una onda que pasa por cinco nodos | Del análisis a la optimización |
| Proyectos | Rejilla: un terreno de datos ordenado | Problemas reales, estructurados |
| Llamada final | Portal: un anillo de luz | El salto |
| Contacto | Calma: el núcleo, pequeño y en reposo | Empieza la conversación |

Es una sola escena WebGL fija detrás del contenido: el objeto cambia de forma, no se cargan
escenas nuevas.

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#050505` | Fondo |
| `--graphite` | `#0d0f13` | Superficies elevadas |
| `--anthracite` | `#1a1d24` | Bordes fuertes, campos |
| `--text` | `#eef0f5` | Texto |
| `--muted` | `#9ba1b0` | Texto secundario |
| `--blue` | `#3b82ff` | Acento principal (azul eléctrico) |
| `--violet` | `#8b5cff` | Acento secundario |
| `--cyan` | `#22e3ff` | Luz, foco, estados activos |

Los neones solo emiten luz: en partículas, líneas, brillos y bordes activos. El texto es blanco
o gris; nunca un párrafo en neón.

## Tipografía

- **Hubot Sans** expandida (ancho 118–125), peso 700–800: titulares. Técnica y contundente.
- **Mona Sans** (ancho 100), 400–500: texto y botones. Misma familia, lectura cómoda.
- **Geist Mono**: solo índices y etiquetas técnicas cortas (01, DEMO 02).

## Movimiento

- Un único momento orquestado al cargar: el núcleo se condensa desde el polvo y el titular sube.
- Scroll: la escena se transforma; los servicios se recorren en horizontal; el método se cuenta
  paso a paso con la sección fijada; el resto aparece con desplazamientos cortos (24–40 px).
- Microinteracciones: botones magnéticos con brillo, paneles con profundidad y luz que sigue al
  cursor (solo con ratón), pulsación a escala 0,97, curvas `cubic-bezier(0.23, 1, 0.32, 1)`.
- Movimiento reducido: sin scroll suave, sin transformaciones ligadas al scroll, escena quieta.
- La animación continua tiene botón de pausa.

## Rendimiento

- three.js se descarga aparte, después del contenido.
- Escritorio: ~7.000 partículas, bloom y resolución máxima 1,5×.
- Móvil y tableta: ~2.600 partículas, sin bloom, resolución máxima 1,25×.
- Sin WebGL o con movimiento reducido: fondo de luz estático, sin three.js.
