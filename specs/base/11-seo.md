# 11 · GTM, eventos e indexación

- **Código:** `js/seo-analytics.js` · **Páginas:** todas menos `ps3.html`
- **Referencia:** `docs/SEO_ANALYTICS_PLAYBOOK.md`
- **Tests:** `tests/js/analytics-seo.test.js`

## Requisitos

### Google Tag Manager

- **SEO-001** — Antes de cualquier otro evento se declara el consentimiento por defecto: publicidad denegada; analítica, funcionalidad y seguridad permitidas.
- **SEO-002** — Cada página envía un evento `seo_page_context` con su tipo de página, idioma, título, ruta, URL, URL canónica, descripción y el ID de GA4. Sin `data-page-type` el tipo es `website`, y sin canonical se usa la URL actual.
- **SEO-003** — Google Tag Manager se inyecta una sola vez, con el contenedor `GTM-5D6LZB66`.
- **SEO-008** — Antes de inyectar Google Tag Manager se envía una sola vez el evento de inicio de GTM (`event: 'gtm.js'` con `gtm.start` igual a la hora de carga en milisegundos), después del consentimiento por defecto y antes de `seo_page_context`.
- **SEO-004** — Un clic en un enlace a otro sitio envía `outbound_click` con la URL y el texto del enlace. Los enlaces internos no envían nada.
- **SEO-005** — Un clic en un enlace de WhatsApp (`wa.me`) envía además `generate_lead`, aunque se pulse el ícono dentro del enlace.
- **SEO-007** — Toda página que carga `seo-analytics.js` declara su `data-page-type` en el `<body>`.

### Indexación

- **SEO-006** — Solo el inicio y el catálogo son indexables. La página 404, las de seguridad, `old.html` y `ps3.html` llevan `noindex`. Cada página declara su URL canónica; la del catálogo es `/productos`.
- **SEO-011** — Ningún enlace interno apunta a `index.html`: el inicio se enlaza como `/` (o `/#sección`) desde todas las páginas.
- **SEO-015** — `robots.txt` contiene solo lo que Google usa: `User-agent`, `Allow`/`Disallow` de rutas que existen y `Sitemap`. No lleva `Host` ni `Crawl-delay`.

### Contenido para buscadores

- **SEO-009** — En el inicio y en el catálogo, el `<title>` tiene como máximo 60 caracteres y la `description`, entre 70 y 160. Ambos incluyen "retro", y `og:title`, `og:description`, `twitter:title` y `twitter:description` repiten el mismo texto. Inicio: "Ropavejero Retro | Juegos y consolas retro en Chile". Catálogo: "Catálogo de juegos y consolas retro | Ropavejero Retro".
- **SEO-010** — El H1 dice qué se vende, en español y en inglés: en el inicio, "Juegos y consolas retro en Chile / Todo lo Retro en un solo lugar" ("Retro games and consoles in Chile / Everything Retro in one place"); en el catálogo, "Juegos y consolas retro disponibles" ("Available retro games and consoles").
- **SEO-012** — Las páginas no contienen valoraciones ni reseñas que el visitante no vea: no hay bloques de datos con `AggregateRating` ni `Review`, los datos estructurados van solo en bloques `application/ld+json`, y ningún archivo JSON de la raíz del sitio trae valoraciones (`schema.json` no existe).
- **SEO-013** — Los datos estructurados del inicio describen el local como `Store` con la dirección completa (calle, local, comuna, región, código postal `8361348` y país), las coordenadas `-33.4738041, -70.6410784`, el teléfono, el horario y el enlace a su Perfil de Empresa en Google (`hasMap`); su `alternateName` incluye "Double Impact Store SpA", el nombre del perfil. Las metaetiquetas `geo.position` e `ICBM` usan esas coordenadas.
- **SEO-014** — El inicio y el catálogo usan como imagen para redes `img/og-ropavejero.jpg` (1200×630), declarando ancho, alto y texto alternativo en `og:image` y `twitter:image`.

## Notas

- El sitemap está en [13-integridad-sitio.md](13-integridad-sitio.md) (`SITE-014`).
