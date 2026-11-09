# Nexo IA Studio — web corporativa

Web de una consultora de inteligencia artificial y desarrollo web a medida.
"Nexo IA Studio" es un nombre **provisional**.

Stack: Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript,
Tailwind CSS 4, three.js + React Three Fiber para la escena 3D, GSAP + ScrollTrigger para las
animaciones ligadas al scroll y Lenis para el scroll suave.

## Estilo cinematográfico

La portada se recorre como una secuencia:

1. **Hero por capas** (`src/components/hero/CinematicHero.tsx`): cielo, titular gigante,
   sistema orbital 3D y nubes en primer plano. Al hacer scroll cada capa se mueve a su propia
   velocidad y el titular se hunde tras las nubes.
2. **Presentación de marca** (`src/components/sections/BrandReveal.tsx`): se empieza dentro de
   una letra (solo se ve la foto) y la cámara se aleja hasta mostrar el nombre con el cielo dentro.
3. **Servicios** en filas oscuras con foto, que se abren desde el centro al entrar.
4. **Método** en cinco flechas que comparten una sola foto.
5. **Criterio**: la frase se ilumina palabra a palabra.
6. **Contacto** sobre la foto del sol en las nubes, con parallax.

Con `prefers-reduced-motion` no hay scroll suave ni animaciones ligadas al scroll: cada sección
se muestra en su composición final.

### Fotografías

En `src/assets/photos/`, de Unsplash (licencia libre para uso comercial; se acredita a los
autores en el pie): Jason Leung (mar de nubes), Jerry Zhang (sol sobre las nubes), Parrish
Freeman (arquitectura), Calvin Wise (escritorio), Compare Fibre (fibra óptica) y Jakub
Żerdzicki (pantalla con código). Se importan de forma estática, así que Next.js genera
versiones AVIF/WebP del tamaño de cada pantalla.

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

## Cambiar la marca y los textos

| Qué | Dónde |
| --- | --- |
| Nombre, dominio, correo, título y descripción SEO, navegación | `src/config/site.ts` |
| Todos los textos de la página (hero, servicios, método, situaciones, criterio, FAQ, contacto) | `src/content/home.ts` |
| Colores, tipografía, espaciado, radios | bloque `@theme` en `src/app/globals.css` |
| Favicon e icono de app | `src/app/icon.svg`, `src/app/apple-icon.tsx` |
| Imagen para redes sociales | `src/app/opengraph-image.tsx` (se genera con el nombre y el titular) |
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

## Escena 3D

`src/components/hero/`

- `OrreryScene.tsx`: la escena three.js (núcleo, órbitas, nodos, pulsos de datos).
- `useSceneMode.ts`: decide si se muestra el 3D completo, el ligero o la ilustración.
- `OrreryPoster.tsx`: versión estática en SVG.

Comportamiento:

| Situación | Qué se muestra |
| --- | --- |
| Escritorio con ratón | 3D completo, inclinación con el puntero |
| Móvil, tableta o pantalla táctil | 3D ligero (menos partículas, resolución limitada) |
| `prefers-reduced-motion`, ahorro de datos, equipo con poca memoria o CPU, sin WebGL | Ilustración estática, sin descargar three.js |

three.js se descarga aparte y solo cuando hace falta. La animación se detiene cuando el hero
sale de pantalla, tiene botón de pausa y baja la resolución si el equipo no mantiene ~45 fps.

Para revisar las alternativas: `/?escena=estatica` o `/?escena=ligera`.

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
- Conectar el envío del formulario y comprobar que el hosting sirve la web por HTTPS.
