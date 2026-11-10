# Nexo IA Studio — web corporativa

Web de una consultoría de inteligencia artificial. "Nexo IA Studio" es un nombre **provisional**.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, three.js +
React Three Fiber + postprocesado (bloom) para la escena 3D, GSAP + ScrollTrigger para las
animaciones ligadas al scroll, Motion para las microinteracciones, Lenis para el scroll suave y
Lucide para los iconos.

## Dirección visual: "Señal"

La explicación completa está en [`docs/direccion-visual.md`](docs/direccion-visual.md). En
resumen: negro profundo, antracita y tres neones (azul eléctrico, violeta y cian) que solo
emiten luz; titulares en Hubot Sans expandida y texto en Mona Sans.

Detrás de toda la portada hay **una sola escena WebGL fija**: un núcleo neuronal de ~7.000
partículas que cambia de formación según la sección (`data-stage` en `src/app/page.tsx`):

| Sección | Formación |
| --- | --- |
| Hero | Núcleo de cristal con sinapsis y pulsos de luz; reacciona al ratón |
| Servicios | Constelación: disco galáctico al fondo |
| Método | Señal: una hélice con cinco nodos; se ilumina el del paso activo |
| Proyectos | Rejilla de datos en perspectiva |
| Llamada final | Portal: un anillo de luz alrededor del titular |
| Contacto | Calma: el núcleo pequeño, detrás del formulario |

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/components/scene/` | Escena 3D: formaciones, shaders GLSL, capa fija, modo de calidad y pausa |
| `src/components/sections/` | Hero, Servicios (recorrido horizontal), Método (paso a paso), Proyectos, Llamada final, Contacto |
| `src/components/visuals/` | Diagramas animados de cada servicio e interfaces de las demos |
| `src/components/ui/` | Logo, botón magnético, revelados al hacer scroll |
| `src/content/home.ts` | Todos los textos de la portada |

Calidad de la escena según el dispositivo (`src/components/scene/useSceneMode.ts`):

| Situación | Qué se muestra |
| --- | --- |
| Escritorio con ratón | ~7.000 partículas, bloom, reacción al puntero |
| Móvil, tableta o pantalla táctil | ~2.600 partículas, sin bloom, resolución limitada |
| `prefers-reduced-motion`, ahorro de datos, poca memoria o CPU, sin WebGL | Fondo de luz estático, sin descargar three.js |

three.js se descarga aparte, después del contenido. La escena se pausa con la pestaña oculta,
tiene botón de pausa (que congela también las animaciones CSS) y baja la calidad si el equipo
no mantiene ~40 fps. Para revisar las alternativas: `/?escena=estatica` o `/?escena=ligera`.

Con `prefers-reduced-motion` no hay scroll suave ni animaciones ligadas al scroll: cada sección
se muestra en su composición final.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
npm start          # sirve la compilación
npm run lint
```

Requiere Node.js 20.9 o superior.

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

La web se publica sola en **https://ortiorti07.github.io/nexo-ia-studio/** cada vez que se sube
un cambio a la rama `main` (flujo `.github/workflows/pages.yml`, pestaña *Actions* del repositorio).

GitHub Pages solo sirve archivos estáticos, así que esa versión:

- se compila con `NEXT_PUBLIC_STATIC_EXPORT=1` en la carpeta `out/`, bajo la subcarpeta
  `/nexo-ia-studio` (`NEXT_PUBLIC_BASE_PATH`);
- no incluye la ruta `/api/contact`. El formulario valida los datos y ofrece enviarlos desde el
  correo del visitante a tu dirección. Para recibirlos directamente, crea un formulario en un
  servicio como Formspree o Web3Forms y guarda su URL como variable del repositorio
  `NEXT_PUBLIC_CONTACT_ENDPOINT` (*Settings → Secrets and variables → Actions → Variables*);

Para enlaces internos usa siempre `href("/ruta")` de `src/config/site.ts`, que añade la
subcarpeta. `robots.txt`, `sitemap.xml` y el manifest los genera `scripts/static-files.mjs`.

Para probar la versión estática en local (Git Bash):

```bash
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/nexo-ia-studio npm run build
```

(Antes, mueve temporalmente `src/app/api` fuera del proyecto, como hace el flujo de GitHub.)

## Cambiar la marca y los textos

| Qué | Dónde |
| --- | --- |
| Nombre, dominio, correo, título y descripción SEO, navegación | `src/config/site.ts` |
| Todos los textos de la portada (hero, servicios, método, proyectos, llamada final, contacto) | `src/content/home.ts` |
| Redes sociales del pie (solo se muestran las que tengan URL) | `socials` en `src/config/site.ts` |
| Colores, tipografía, espaciado, radios | bloque `@theme` en `src/app/globals.css` |
| Favicon e icono de app | `src/app/icon.svg`, `src/app/apple-icon.png` |
| Imagen para redes sociales | `src/app/opengraph-image.jpg` |
| Datos del titular para las páginas legales | `src/config/legal.ts` |

El dominio `nexoia.studio` es provisional. El teléfono y el correo de contacto están en `src/config/site.ts`.

## Formulario de contacto

El formulario valida los datos en el navegador y en el servidor (`src/app/api/contact/route.ts`,
reglas compartidas en `src/lib/contact/schema.ts`).

**Ahora mismo no envía correos.** Mientras no haya un canal configurado, la web lo dice
claramente antes y después de enviar, y ofrece mandar el mensaje desde el correo del usuario.

Para conectarlo, copia `.env.example` a `.env.local` (o define las variables en el hosting) y
elige una opción:

- `CONTACT_WEBHOOK_URL`: recibe un POST JSON (Make, Zapier, n8n, CRM o backend propio).
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL`): correo a través de Resend.

La lógica de envío está en `src/lib/contact/deliver.ts`. Incluye un campo trampa contra bots;
no hay limitación de peticiones (conviene añadirla en el hosting o en un proxy).

## Páginas legales

- `/aviso-legal` (`src/app/aviso-legal/page.tsx`): datos del titular según la LSSI-CE y
  condiciones de uso.
- `/privacidad` (`src/app/privacidad/page.tsx`): política de privacidad según el RGPD y la
  LOPDGDD, incluido el apartado de cookies.

Los datos del titular (razón social, NIF, domicilio, inscripción registral) se rellenan en
`src/config/legal.ts`. Mientras falte alguno, las páginas lo marcan como "pendiente" y muestran
un aviso; al completarlos, ambos desaparecen solos. El formulario incluye la información básica
de protección de datos y enlaza a la política.

Los textos son una base para una web informativa con formulario de contacto y **sin cookies**.
No sustituyen el asesoramiento legal: conviene que los revise un profesional. Si se añade
analítica, píxeles publicitarios o vídeos incrustados de terceros, hay que actualizar la
política y añadir un banner de consentimiento de cookies.

## Pendiente antes de publicar

- Sustituir el nombre y el dominio provisionales.
- Completar los datos del titular en `src/config/legal.ts` y revisar los textos legales.
- Conectar el envío del formulario (ver "Publicación en GitHub Pages").
