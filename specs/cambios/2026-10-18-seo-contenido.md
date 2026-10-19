# SEO: textos para búsqueda, datos del local, enlaces internos e imagen para redes

- **Estado:** Borrador
- **Fecha:** 2026-10-18
- **Tipo:** Cambio de comportamiento

## Problema

Datos de Search Console de los últimos 16 meses: 1.540 clics, 24.100 impresiones y una posición media de 7,5. Las consultas que traen visitas son "juegos retro chile", "tienda retro", "consolas retro chile" y "venta de consolas retro", y en casi todas el sitio aparece entre los puestos 4 y 11. Lo que hoy le juega en contra:

- La descripción del inicio tiene unos 330 caracteres (Google muestra unos 155) y parte con "@Ropavejero.Retro es una tienda de Instagram". El H1 es "Bienvenidos a @Ropavejero.Retro" y no contiene ninguna de esas consultas.
- `/index.html` recibe impresiones que deberían ir a `/` (1.081 frente a 23.044), porque los enlaces internos apuntan a `index.html`.
- En el `<head>` del inicio y del catálogo quedan bloques antiguos de datos estructurados con valoraciones y reseñas inventadas (4,8 estrellas, "Carlos M.", "Ana L."...). Google no los lee porque están marcados como `application/json`, pero son datos falsos en el código del sitio.
- En los datos estructurados del local faltan coordenadas, teléfono, código postal y el enlace al Perfil de Empresa. Las coordenadas `geo` de la página son las del centro de Santiago, a unos 3,7 km del local.
- La imagen para compartir en redes es el logo de 256×256; WhatsApp, Facebook y X piden 1200×630 para la vista grande.
- `robots.txt` trae directivas que Google ignora (`Host`, `Crawl-delay`) y rutas que no existen (`/admin/`, `/private/`).

## Resultado esperado

En Google, el inicio y el catálogo muestran un título y una descripción completos y escritos con las palabras que la gente busca. El H1 dice qué vende la tienda. Google asocia el sitio con el local real del Persa Bio Bio (coordenadas y Perfil de Empresa). Al compartir el sitio en WhatsApp o redes se ve una imagen grande.

## Textos propuestos (para acordar)

| Dónde | Hoy | Propuesto |
|-------|-----|-----------|
| Inicio, `<title>` y `og:title` | Ropavejero Retro \| Tienda de videojuegos retro en Santiago de Chile | Ropavejero Retro \| Juegos y consolas retro en Santiago, Chile |
| Inicio, `description` y `og:description` | (330 caracteres) | Tienda de juegos y consolas retro originales en Santiago: Nintendo, PlayStation, Sega, Xbox y Atari. Envíos a todo Chile y local en Persa Bio Bio. |
| Inicio, H1 (ES) | Bienvenidos a @Ropavejero.Retro / Todo lo Retro en un solo lugar | Juegos y consolas retro en Chile / Todo lo Retro en un solo lugar |
| Inicio, H1 (EN) | Welcome to @Ropavejero.Retro / Everything Retro in one place | Retro games and consoles in Chile / Everything Retro in one place |
| Catálogo, `<title>` y `og:title` | Productos retro disponibles \| Ropavejero Retro | Catálogo de juegos y consolas retro \| Ropavejero Retro |
| Catálogo, `description` y `og:description` | (230 caracteres) | Juegos, consolas y accesorios retro disponibles hoy: Nintendo, PlayStation, Sega, Xbox y Atari. Revisa precios y escríbenos por WhatsApp. |
| Catálogo, H1 (ES) | Productos Disponibles | Juegos y consolas retro disponibles |
| Catálogo, H1 (EN) | Available Products | Available retro games and consoles |

La marca sigue visible arriba del H1 (logo y "Ropavejero.Retro" en el encabezado) y en el subtítulo, que no cambia.

## Requisitos

### Nuevos

- **SEO-009** — En el inicio y en el catálogo, el `<title>` tiene como máximo 60 caracteres y la `description`, entre 70 y 160. Ambos incluyen "retro", y `og:title`, `og:description`, `twitter:title` y `twitter:description` repiten el mismo texto que el `<title>` y la `description` de la página.
- **SEO-010** — El H1 del inicio y el del catálogo dicen qué se vende ("juegos y consolas retro"), en español y en inglés, con los textos de esta especificación.
- **SEO-011** — Ningún enlace interno apunta a `index.html`: el inicio se enlaza como `/` (o `/#sección`) desde todas las páginas.
- **SEO-012** — Las páginas no contienen valoraciones ni reseñas que el visitante no vea: no hay bloques de datos con `AggregateRating` ni `Review`, y los datos estructurados van solo en bloques `application/ld+json`.
- **SEO-013** — Los datos estructurados del inicio describen el local como `Store` con la dirección completa (calle, local, comuna, región, código postal `8361348` y país), las coordenadas `-33.4738041, -70.6410784`, el teléfono, el horario y el enlace a su Perfil de Empresa en Google (`hasMap`). Las metaetiquetas `geo.position` e `ICBM` usan esas mismas coordenadas.
- **SEO-014** — El inicio y el catálogo usan como imagen para redes una imagen propia de 1200×630 (`img/og-ropavejero.jpg`), declarando su ancho, alto y texto alternativo, en `og:image` y `twitter:image`.
- **SEO-015** — `robots.txt` contiene solo lo que Google usa: `User-agent`, `Allow`/`Disallow` de rutas que existen y `Sitemap`. No lleva `Host` ni `Crawl-delay`.

### Modificados

- **LOC-003** — La tarjeta tiene un botón "Cómo llegar", que abre en otra pestaña el Perfil de Empresa del local en Google Maps, y un botón al sitio del local... *(Antes: "...que abre en otra pestaña la búsqueda de la dirección del local en Google Maps...". El resto del requisito no cambia.)*

## Fuera de alcance

- Que Google pueda indexar los productos del catálogo (lista estática generada por el bot): cambio grande aparte, acordado para más adelante.
- Páginas propias para los artículos del blog.
- Los enlaces a `productos.html` se mantienen: con `python -m http.server`, `/productos` no funciona en local. El canónico `/productos` ya consolida esa URL en Google: hoy `productos.html` tiene 6 impresiones.
- Los testimonios del inicio: ver "Decisiones".

## Archivos que se tocan

- `index.html`, `productos.html`: título, descripción, `og:*`, `twitter:*`, H1, datos estructurados, geo y enlaces a `index.html`.
- `404.html`, `security-policy.html`, `security-acknowledgments.html`, `old.html`: enlaces a `index.html` → `/`.
- `js/modules/ui.js`: `hero-title` y `products-title` en ES y EN.
- `img/og-ropavejero.jpg`: nueva imagen de 1200×630, hecha con el logo y los colores del sitio.
- `robots.txt`, `sitemap.xml` (`lastmod`).
- `specs/base/11-seo.md`, `specs/base/17-local.md`; tests en `tests/js/analytics-seo.test.js`, `tests/js/sitio.test.js`, `tests/js/local.test.js`.
- Bump de versión de caché.

## Cómo se comprueba

- Tests automáticos de `SEO-009` a `SEO-015` y del `LOC-003` modificado.
- Prueba de resultados enriquecidos de Google (search.google.com/test/rich-results) sobre el inicio publicado: el `Store` del local sin errores.
- Vista previa al compartir el enlace en WhatsApp (imagen grande).
- En Search Console, pedir la indexación de `/` y `/productos` después del despliegue, y revisar en 2 a 4 semanas el CTR y la posición de las consultas de arriba.

## Decisiones

- **Testimonios:** la sección "Testimonios de Clientes Satisfechos" muestra tres testimonios sin nombre de origen verificable. Si no son reales, conviene reemplazarlos por reseñas reales (por ejemplo, del Perfil de Empresa) o quitar la sección. No entra en este cambio. **Pregunta para Francisco.**
- El nombre del Perfil de Empresa es "Double Impact Store SpA", y el sitio dice "@DoubleImpactStore". Google compara nombre, dirección y teléfono entre el sitio y el perfil; el `alternateName` del `Store` incluirá los dos.
