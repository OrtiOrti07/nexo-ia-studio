# Juan · Diseño web

Web personal de Juan, que diseña y desarrolla páginas web a medida para empresas: webs
corporativas, landing pages y rediseños.

Publicada en **https://ortiorti07.github.io/nexo-ia-studio/** (el nombre del repositorio se
mantiene para no cambiar la dirección).

Stack: Next.js 16 (App Router, Turbopack, exportación estática), React 19, TypeScript,
Tailwind CSS 4, three.js para las escenas 3D, GSAP (ScrollTrigger y SplitText) y Lenis para
las animaciones y el scroll suave, y Lucide para los iconos.

## Dirección visual: "Plano"

La explicación completa está en [`docs/direccion-visual.md`](docs/direccion-visual.md). En
resumen: blancos fríos, tinta azulada y un cobalto (`#2e5bff`) que marca lo importante;
titulares en Bricolage Grotesque, texto en Instrument Sans y detalles técnicos en Geist Mono.

### Escenas 3D

**Portada: escaparate 3D ligado al scroll.** Escena oscura de cine renderizada en tiempo real
con three.js: un portátil flota cerrado, inclinado y con el emblema de la marca, delante de la
palabra «A MEDIDA». Al bajar, la escena se queda fija y los textos pasan por encima mientras:

1. el portátil se abre y la pantalla se enciende con la web de «tu empresa»;
2. la cámara se acerca y la web se recorre dentro de la pantalla;
3. llega el móvil con la versión móvil;
4. pasan los conceptos (restaurante, arquitectura, instalaciones).

Suelo con reflejo, contraluces en cobalto, luz de la pantalla sobre el teclado, brillo
(*bloom*), partículas y un leve giro hacia el ratón.

**Resto de secciones:** renders WebP (65–190 KB) hechos con el mismo motor: páginas en abanico,
landing con botón protagonista y antes/después (servicios), una escena por paso (proceso) y
cada concepto en portátil y móvil (trabajos).

Los dispositivos se construyen con geometría propia y las pantallas se dibujan en canvas: no se
descarga ningún modelo, textura ni mapa de entorno.

| Situación | Portada |
| --- | --- |
| Escritorio con WebGL 2 | Escena en tiempo real en calidad alta (three.js se descarga aparte, después de la página) |
| Móvil o tableta con WebGL 2 | También en tiempo real, en calidad ligera: menos resolución, menos partículas y reflejo más barato |
| Equipo que no llega a ~35 fps | Baja la resolución, luego quita el brillo y por último el reflejo |
| Sin WebGL, ahorro de datos, poca memoria o `prefers-reduced-motion` | Fotogramas renderizados de cada etapa (verticales en móvil), con fundido. No se descarga three.js |
| Fuera de pantalla o pestaña oculta | La escena se detiene |

La escena sigue al scroll a través de un muelle (con inercia), entra desde la oscuridad al
cargar, la pantalla se enciende con un destello y los conceptos pasan con una cortinilla de luz
(un shader propio en `showcase.ts`).

### Animaciones

Toda la coreografía está en `src/components/motion/Motion.tsx` y se engancha a atributos del
HTML (`data-split`, `data-reveal`, `data-clip`, `data-parallax`, `data-tilt`, `data-magnetic`…):

- Titulares que se revelan palabra a palabra tras una máscara (SplitText).
- Textos del escaparate que entran y salen con el scroll, con desenfoque.
- Imágenes que se descubren con un recorte y un acercamiento; paralaje suave.
- Tarjetas que se inclinan hacia el ratón y botones magnéticos (solo con ratón).
- La cabecera se esconde al bajar y vuelve al subir.
- Scroll suave con Lenis en escritorio; en táctil, el nativo.

Con `prefers-reduced-motion` no se anima nada. La portada solo empieza oculta si hay JavaScript
y, si en 4 s no ha arrancado la animación, se muestra igualmente.

#### Volver a generar los renders

Si cambias una escena (`src/components/three/scenes.ts`) o el contenido de sus pantallas
(`src/components/three/screens.ts`):

1. `npm run dev`
2. Abre http://localhost:3000/estudio-3d.
   - **Renderizar todo**: escenas de servicios, proceso y trabajos.
   - **Escaparate de la portada**: fotogramas de cada etapa (horizontal y vertical) y la imagen
     para redes sociales.
3. Las imágenes se guardan en `src/assets/renders/` y la imagen social en
   `src/app/opengraph-image.png`.

El escaparate está en `src/components/three/showcase.ts` (fotogramas clave en `KEYS`).

El laboratorio (`src/app/estudio-3d/*.dev.tsx`) solo existe en desarrollo: no se publica.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/config/site.ts` | Nombre, dirección pública, correo, teléfono, título y descripción SEO, navegación |
| `src/config/legal.ts` | Datos del titular para las páginas legales |
| `src/content/home.ts` | Todos los textos de la portada (servicios, proceso, conceptos, preguntas, contacto) |
| `src/components/sections/` | Portada con escaparate 3D (`Showcase.tsx`), Quién hay detrás, Servicios, Proceso, Trabajos, Preguntas, Contacto |
| `src/components/three/` | Motor 3D: dispositivos, pantallas, escaparate de la portada, escenas, estudio de luz y laboratorio de render |
| `src/components/visuals/renders.ts` | Lista de renders de cada sección |
| `src/assets/renders/` | Renders WebP de las escenas |
| `src/components/contact/ContactForm.tsx` | Formulario de contacto |
| `src/lib/contact/` | Validación (`schema.ts`) y envío a Formspree (`send.ts`) |
| `src/app/globals.css` | Sistema de diseño: colores, tipografía, espaciado, botones (bloque `@theme`) |
| `src/app/estudio-3d/` | Laboratorio de render (solo en desarrollo) |

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
npm run lint
```

Requiere Node.js 22.18 o superior.

### Nota sobre Tailwind en Windows

En este equipo, el **Control inteligente de aplicaciones de Windows** bloquea el binario nativo
de Tailwind (`@tailwindcss/oxide`). Tailwind recurre entonces a una versión WebAssembly que en
Windows no puede leer los archivos y genera el CSS sin clases. Para evitarlo,
`scripts/tailwind-classes.mjs` escribe la lista de clases usadas en un bloque marcado de
`src/app/globals.css` (`@source inline(...)`):

- `npm run dev` arranca Next.js y vigila `src/` para actualizar la lista al guardar.
- `npm run build` la regenera antes de compilar.
- `npm run classes` la regenera a mano.

No edites el bloque entre los comentarios `tailwind-classes:start` y `tailwind-classes:end`.
En equipos donde el binario funciona, todo esto es inofensivo.

## Publicación en GitHub Pages

La web se publica sola cada vez que se sube un cambio a la rama `main` (flujo
`.github/workflows/pages.yml`, pestaña *Actions* del repositorio). Se compila como web estática
(`NEXT_PUBLIC_STATIC_EXPORT=1`, carpeta `out/`) bajo la subcarpeta `/nexo-ia-studio`
(`NEXT_PUBLIC_BASE_PATH`), que el propio flujo toma de la configuración de Pages.

Para enlaces internos usa siempre `href("/ruta")` de `src/config/site.ts`, que añade la
subcarpeta. `robots.txt`, `sitemap.xml` y el manifest los genera `scripts/static-files.mjs`.

Para comprobar en local la versión estática tal como la sirve GitHub Pages (Git Bash):

```bash
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/nexo-ia-studio npm run build
```

```bash
npm run preview:pages
```

y abre http://localhost:4173/nexo-ia-studio/.

## Formulario de contacto (Formspree)

El formulario envía los mensajes **sin salir de la página** a [Formspree](https://formspree.io),
un servicio de formularios compatible con webs estáticas que los reenvía por correo. No hay
claves secretas en el código: la dirección de un formulario de Formspree es pública por
naturaleza.

Incluye validación en el navegador, estado de envío, confirmación, mensajes de error (de red o
de Formspree), un campo trampa para bots (`_gotcha`, que Formspree descarta), un tiempo mínimo
de relleno y la casilla de consentimiento con la información básica de protección de datos.
Los enlaces «Quiero una landing page…» de los servicios preseleccionan el tipo de proyecto.

**Hasta que configures Formspree, el formulario no envía nada** y lo dice claramente: muestra un
aviso y ofrece el correo y el teléfono. Para activarlo:

1. Crea una cuenta en [formspree.io](https://formspree.io) con `juanortereque@gmail.com` y
   confirma el correo de verificación que te envíen.
2. Crea un formulario nuevo (*New form*) con ese correo como destino y copia su dirección
   (*endpoint*), con la forma `https://formspree.io/f/xxxxxxxx`.
3. En GitHub, en el repositorio: *Settings → Secrets and variables → Actions → Variables →
   New repository variable*.
   - **Name:** `NEXT_PUBLIC_CONTACT_ENDPOINT`
   - **Value:** la dirección del paso 2.
4. Vuelve a publicar: *Actions → Publicar en GitHub Pages → Run workflow* (o sube cualquier
   cambio a `main`).
5. Envía un mensaje de prueba desde la web publicada. Si Formspree te pide confirmar algo en el
   primer envío, sigue el enlace del correo que te mande.

Opcional: en la configuración del formulario en Formspree puedes revisar las opciones antispam
y de dominios permitidos que ofrezca tu plan, y el límite mensual de envíos del plan gratuito.

Para probarlo en local, copia `.env.example` a `.env.local` y rellena la misma variable.

## Páginas legales

- `/aviso-legal` (`src/app/aviso-legal/page.tsx`): datos del titular según la LSSI-CE y
  condiciones de uso.
- `/privacidad` (`src/app/privacidad/page.tsx`): política de privacidad según el RGPD y la
  LOPDGDD, incluidos los proveedores (Formspree y GitHub Pages) y el apartado de cookies.

Los datos del titular (nombre y apellidos, NIF, domicilio y, si aplica, inscripción registral)
se rellenan en `src/config/legal.ts`. Mientras falte alguno, las páginas lo marcan como
"pendiente" y muestran un aviso; al completarlos, ambos desaparecen solos. Si trabajas como
autónomo y no hay inscripción registral, pon `registry: false`.

Los textos son una base para una web informativa con formulario de contacto y **sin cookies**.
No sustituyen el asesoramiento legal: conviene que los revise un profesional. Si se añade
analítica, píxeles publicitarios o vídeos incrustados de terceros, hay que actualizar la
política y añadir un aviso de consentimiento de cookies.

## Pendiente

- Configurar Formspree (pasos de arriba) para recibir los mensajes.
- Completar los datos del titular en `src/config/legal.ts`.
- Añadir las redes sociales en `socials` de `src/config/site.ts`, si quieres que aparezcan.
- Cuando haya trabajos reales para clientes (y su permiso), sustituir o acompañar los conceptos
  de `src/content/home.ts`.
