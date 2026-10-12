# 13 · Integridad entre archivos

- **Código:** todos los HTML, `js/index.js`, archivos minificados, `manifest.json`, `sitemap.xml`, `.github/workflows/`
- **Tests:** `tests/js/sitio.test.js`

Reglas que conectan un archivo con otro. Son las que se rompen "sin querer" al tocar algo en otra parte.

## Requisitos

### Carga de scripts

- **SITE-001** — El inicio y el catálogo cargan `seo-analytics.js`, luego los módulos en orden de dependencia (logger, cache, siglas, utils, ui, products solo en el catálogo, instagram, efemerides, analytics) y al final `index.min.js`; todos con `defer` y versión de caché. Todo archivo de `js/modules/` está contemplado en ese orden.
- **SITE-002** — La página 404 y las de seguridad cargan solo `seo-analytics.js` e `index.min.js`.
- **SITE-003** — Los archivos minificados que sirve el sitio corresponden a sus fuentes: `js/index.min.js`, `js/app.min.js`, `css/index.min.css` y `css/app.min.css`.
- **SITE-004** — Toda función que invoca `index.js` existe en las páginas que cargan los módulos. `lazyInitProducts`, que solo existe en el catálogo, va protegida.
- **SITE-005** — El inicio y el catálogo arrancan sin errores de JavaScript.
- **SITE-006** — En la página 404 y las de seguridad funcionan el botón de tema y el menú móvil, sin errores de JavaScript. ⚠ PEND-13

### Referencias

- **SITE-007** — Todo archivo local referenciado desde un HTML (scripts, estilos, imágenes, páginas) existe.
- **SITE-008** — Todo enlace a una sección (`#id`) apunta a un id que existe en la página de destino.
- **SITE-009** — Los JSON del sitio y los bloques JSON-LD de los HTML son válidos; cada consola de `console_aliases.json` tiene nombre y alias.
- **SITE-010** — El manifest de la PWA abre el sitio en la raíz, apunta a íconos que existen y está enlazado, con versión, desde el inicio y el catálogo.

### Seguridad

- **SITE-011** — `index.html`, `productos.html`, `404.html`, `old.html` y las dos páginas de seguridad declaran su Content-Security-Policy con las restricciones base: origen propio por defecto, sin `object`, sin `unsafe-eval` y sin comodines. `ps3.html` no lleva porque solo redirige.
- **SITE-012** — La CSP de cada página permite los servicios externos que esa página usa: GTM y Google Analytics en todas, los scripts, estilos e iframes externos que declare, y Google Sheets en el catálogo.
- **SITE-013** — Los enlaces externos que abren otra pestaña llevan `rel="noopener"`.

### Indexación, accesibilidad y despliegue

- **SITE-014** — `sitemap.xml` lista solo las páginas indexables, por su URL canónica, y `robots.txt` lo anuncia sin bloquear el sitio.
- **SITE-015** — El despliegue a GitHub Pages conserva lo que el bot de Instagram necesita: `deploy-pages.yml` acepta `workflow_dispatch`, el bot lo lanza después de pushear, y existen `.nojekyll` y `CNAME`.
- **SITE-016** — Las páginas declaran idioma, título, descripción y viewport.
- **SITE-017** — Las imágenes de contenido tienen texto alternativo.
- **SITE-018** — Cada página tiene un único encabezado `h1`. ⚠ PEND-14
