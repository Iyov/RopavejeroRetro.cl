# CLAUDE.md

Este archivo entrega contexto a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Resumen del proyecto

Sitio web estático en HTML/CSS/JS puro (vanilla) para Ropavejero Retro (tienda de videojuegos retro en Santiago, Chile), desplegado en GitHub Pages bajo `ropavejeroretro.cl`. Sin framework frontend, sin bundler, y sin build necesario para correr el sitio — `npm run build` solo minifica JS/CSS para producción. Los datos del catálogo de productos viven en una Google Sheet externa, no en este repo.

## Comandos

```bash
npm install          # instala terser/csso-cli/html-minifier-terser (dev-only, para minificación)
npm run minify:js    # terser: js/index.js, js/instagram_posts.js, js/app.js -> *.min.js
npm run minify:css   # csso: css/index.css, css/app.css -> *.min.css
npm run build        # ejecuta ambos anteriores
npm run watch        # watcher.js: observa js/ y css/ (archivos no .min) y corre el minify correspondiente al detectar cambios
npm run bump         # sube la versión de caché (AAAA-MM-DD_N) en todo el sitio; requiere Python
npm run check:version  # verifica que todo el sitio use la misma versión
```

`npm run minify:js` (y el watcher, que lo dispara ante cualquier cambio en `js/`) también regenera `js/instagram_posts.min.js` con terser, cuyo resultado difiere del que escribe el bot de Instagram. Es un diff inofensivo, pero conviene no commitearlo (`git checkout js/instagram_posts.min.js`) para no chocar con el bot; para minificar solo el entry point: `npx terser js/index.js -o js/index.min.js -c -m`. `js/app.js` (el script de `old.html`) está en una sola línea, y minificarlo reproduce `js/app.min.js` byte a byte.

Solo `js/index.js`, `css/index.css` y `css/app.css` pasan por minificación. Los archivos de `js/modules/` y `js/seo-analytics.js` se sirven tal cual, sin `.min`.

Servir localmente con cualquier servidor estático, ej. `python -m http.server 8000`, luego abrir `http://localhost:8000`.

Script de automatización de Instagram (Python, en `api/`):
```bash
pip install -r requirements.txt
python api/update_instagram.py     # requiere INSTAGRAM_TOKEN en .env
```

Tests (Python, `tests/`):
```bash
python -m pytest tests/            # o: python -m pytest tests/test_bump_version.py
python -m pytest tests/test_update_instagram.py::test_detects_expired_instagram_token   # un solo test
```
`pytest` no está en `requirements.txt` (instalarlo aparte). No existe suite de tests ni linter para JS.

## Arquitectura

### Sistema de módulos frontend

No hay bundler — el navegador carga etiquetas `<script>` planas en un orden de dependencia específico. `js/index.js` es un orquestador mínimo (solo el handler de `DOMContentLoaded`) que invoca los módulos bajo `js/modules/`, los cuales deben cargarse *antes* que él en la lista de `<script>` del HTML:

1. `logger.js` — logging en consola sensible al ambiente (silenciado en producción)
2. `cache.js` — helpers de caché respaldados por localStorage
3. `siglas.js` — carga/detecta siglas de productos desde `js/siglas.json`
4. `utils.js` — helpers de sanitize/validate/sort, compartidos por otros módulos
5. `ui.js` — tema, idioma (ES/EN), traducciones, FAQ, diálogos del blog, menú móvil
6. `products.js` — catálogo de productos: tabla, filtros, paginación, modal (solo se carga en `productos.html`, no en `index.html`)
7. `instagram.js` — renderizado de posts de Instagram y filtros por consola/plataforma (usa `js/console_aliases.json`)
8. `efemerides.js` — widget de efemérides gamer del día (datos en `js/efemerides.json`)
9. `analytics.js` — manejo de CSP, detección de adblock, fallback de analytics
10. `js/index.min.js` — se carga al final, conecta todo en `DOMContentLoaded`

Todos los scripts se cargan con `defer` y `js/seo-analytics.js` va antes que los módulos. No son ES modules: cada archivo declara funciones y constantes globales, y los módulos se llaman entre sí por nombre global (por eso importa el orden, y por eso `index.js` protege `lazyInitProducts` con un `typeof` — solo existe en `productos.html`).

`index.html` y `productos.html` declaran esta lista de scripts cada uno por su cuenta (`productos.html` además incluye `products.js`) — al agregar/quitar un módulo o cambiar el orden de carga, hay que actualizar **ambos** HTML, agregar el archivo a `STATIC_RESOURCES` en `service-worker.js`, y regenerar `js/index.min.js`, ya que `index.min.js` (no `index.js`) es el que realmente se referencia en el HTML.

`404.html`, `security-policy.html` y `security-acknowledgments.html` cargan solo `seo-analytics.js` + `index.min.js`, sin los módulos: cualquier función nueva que se invoque desde `index.js` tampoco existirá en esas páginas.

`js/instagram_posts.js` / `.min.js` contienen los datos reales de los posts de Instagram (generados por `api/update_instagram.py`, no se editan a mano). No tienen etiqueta `<script>` propia: un script inline al final de `index.html` inyecta `js/instagram_posts.min.js` de forma lazy, y `instagram.js` lo consume a través de `getInstagramPostsData()` (con datos simulados de respaldo si no cargó).

Páginas legacy/independientes: `old.html` (sitio anterior, usa `css/app.css` + `js/app.min.js` + `css/transition*.css`) y `ps3.html` (página suelta sin dependencias del sistema de módulos).

### Convención de cache-busting / versionado

El sitio tiene **una sola versión de caché**, con el esquema `AAAA-MM-DD_N` (ej. `2026-10-12_2`): fecha del cambio en Chile y un correlativo que parte en 1 y sube con cada cambio del mismo día. Ese mismo valor aparece en todas partes:

- En el `?v=` de **toda** referencia a un asset local: `<link>`/`<script>` de los HTML (incluidos Font Awesome y los CSS de `old.html`), el loader inline de `instagram_posts.min.js`, el registro del service worker, y los `fetch()` de JSON dentro de `js/modules/` (`siglas.json`, `console_aliases.json`, `efemerides.json`).
- En `CACHE_VERSION` de `service-worker.js`, como `ropavejero-vAAAA-MM-DD_N`.

La versión nunca se edita a mano. `api/bump_version.py` es la única forma de cambiarla:

```bash
python api/bump_version.py           # o: npm run bump  -> pasa todo a la siguiente versión
python api/bump_version.py --check   # o: npm run check:version -> falla si algo no calza o le falta ?v=
python api/bump_version.py --show    # versión actual
```

Reglas:

- **Cada cambio a un archivo que sirve el sitio (HTML, CSS, JS, JSON) termina con un bump**, antes de commitear. Mismo día: `_N+1`; día nuevo: `_1`. La versión actual se lee de `CACHE_VERSION`.
- El bot de Instagram usa el mismo script (`bump_version.bump()`), así que sus commits también suben el correlativo y tocan todos los HTML. Por eso hay que hacer `git pull --rebase` **antes** del bump; si aun así hay conflicto en líneas de versión, resolverlo quedándose con cualquiera de los dos lados y volver a correr el bump.
- Al agregar una referencia nueva a un asset local, escribirla ya con el `?v=` actual; `--check` avisa de las que no lo llevan. Las imágenes no se versionan.
- Archivos que el script recorre: `*.html` de la raíz, `js/index.js`, `js/index.min.js`, `js/seo-analytics.js`, `js/modules/*.js` y `service-worker.js`. Un archivo nuevo fuera de esa lista que contenga `?v=` hay que agregarlo a `target_files()`.

La regla se hace cumplir en dos puntos, para que no dependa de que alguien la haya leído:

- **Hook `pre-commit`** (`.githooks/pre-commit`): rechaza el commit si hay archivos del sitio preparados y `CACHE_VERSION` no cambió, o si la versión quedó inconsistente. Se activa una vez por equipo con `git config core.hooksPath .githooks`. No saltárselo con `--no-verify`.
- **Despliegue** (`deploy-pages.yml`, paso "Verificar versión de caché"): corre `--check` y, en cada push, `--verify <antes> <después>`. Si falla, el sitio no se publica y queda como estaba; se arregla con `python api/bump_version.py` y un nuevo push.

"Archivo del sitio" es lo que define `SITE_FILE_RE` en `api/bump_version.py`: `*.html` de la raíz, `css/**/*.css`, `js/**/*.js`, `js/**/*.json`, `manifest.json` y `service-worker.js`. Documentación, tests, workflows, `api/`, imágenes y `sitemap.xml` no exigen bump.

Por qué importa `CACHE_VERSION`: el service worker sirve `/` e `index.html` con estrategia cache-first desde un caché cuyo nombre depende de ese valor, así que sin cambiarlo los visitantes que ya tienen el sitio cacheado siguen recibiendo el `index.html` anterior, con sus `?v=` viejos. Los `.js`/`.css` también son cache-first, pero un `?v=` nuevo es una URL distinta y se descarga; `productos.html` y las demás páginas van network-first.

`docs/generate_cache_version.py` es un script antiguo que no cambia ninguna versión: imprime un reporte y lo guarda en `docs/CACHE_VERSION_REPORT.txt`. Usa rutas `../` — hay que ejecutarlo con `cd docs` pese a lo que dice su docstring — y su lista de assets está desactualizada. No confundirlo con `api/bump_version.py`.

### Convenciones del frontend

- **Idioma (ES/EN):** todo texto visible lleva `data-translate="clave"` (o `data-translate-placeholder`) y la clave debe existir en ambos idiomas del objeto `translations` de `js/modules/ui.js`; el HTML trae el texto en español como valor inicial. `setLanguage()` reemplaza con `innerHTML` y vuelve a renderizar efemérides y la tabla de productos. Los textos generados desde JS eligen idioma con `localStorage.getItem('language')`.
- **Logs:** `logger.js` anula `console.log` y `console.info` fuera de `localhost`/`127.0.0.1`. Lo que deba verse en producción va con `console.warn`/`console.error`.
- **Contenido externo:** los datos de la Sheet, de Instagram y de los JSON pasan por `sanitizeHTML()` / `sanitizeURL()` (`utils.js`) antes de llegar al DOM. `sanitizeURL()` tiene una lista blanca de dominios.
- **CSP:** se declara con `<meta http-equiv="Content-Security-Policy">` (no por headers) en `index.html`, `productos.html`, `404.html`, `old.html` y las dos páginas de seguridad; `ps3.html` no tiene porque solo redirige a un sitio externo. La de `old.html` permite además el iframe de `youtube-nocookie.com`. Agregar un dominio externo implica actualizar ese meta en los seis, y las listas de dominios de `utils.js` (`sanitizeURL`) y `analytics.js` (`isAllowedByCSP`).
- **Caché de productos:** las claves de localStorage llevan versión propia (`CACHE_CONFIG` en `cache.js`, hoy `v1_1_1`). Si cambia la forma de los datos de producto, subir esa versión y agregar las claves anteriores a `cleanOldCaches()`.
- **Catálogo:** `products.js` sincroniza filtros con la URL (`?q=`, `sort=`, `platform=`, `page=`) vía `history.replaceState`, solo en `/productos` o `productos.html`.
- **Analytics:** `js/seo-analytics.js` inyecta GTM (`GTM-5D6LZB66`); no carga GA4 directamente, solo pasa su ID por `dataLayer`, y el tag de GA4 debe estar configurado dentro del contenedor (ver `docs/SEO_ANALYTICS_PLAYBOOK.md`) y empuja a `dataLayer` el evento `seo_page_context` usando `data-page-type` del `<body>`, más `outbound_click` y `generate_lead` (enlaces a `wa.me`). Una página nueva necesita su `data-page-type`.
- **Indexación:** solo `index.html` y `productos.html` son indexables (canonical de productos: `/productos`). `404`, `old`, `ps3` y las páginas de seguridad llevan `noindex`. `sitemap.xml` lista solo las indexables: una página `noindex` no va ahí.

### Pipeline de automatización de Instagram

`api/update_instagram.py` corre vía `.github/workflows/update_instagram.yml` (cron cada 12h, o disparo manual). El script:
- Trae posts desde la Instagram Graph API, quedándose solo con los que llevan el hashtag `#RopavejeroRetroWeb`.
- Omite los posts `VIDEO`; de los `CAROUSEL_ALBUM` usa la primera imagen. La primera línea del caption pasa a ser el título y el resto la descripción.
- Descarga las imágenes a `img/IG_<id>.jpeg` y genera variantes WebP responsive (`-400/-800/-1200.webp`) con Pillow; borra las de posts que ya no están.
- Solo si hubo cambios (incluye cambios en likes): reescribe `js/instagram_posts.js` y `js/instagram_posts.min.js` (genera el min por su cuenta, sin terser), regenera el array `INSTAGRAM_IMAGES` de `service-worker.js` y sube la versión de caché de todo el sitio con `bump_version.bump()` (ver "Convención de cache-busting / versionado").
- Escribe un mensaje de commit en `commit_message.txt` (archivo versionado), que el workflow lee para commitear y pushear el resultado por su cuenta (vía `github-actions[bot]`).

El script y `bump_version.py` editan archivos con regex, así que dependen de la forma exacta de estas líneas de `service-worker.js`: `const CACHE_VERSION = 'ropavejero-v...';` y `const INSTAGRAM_IMAGES = [ ... ];`. Usa rutas relativas al cwd: correrlo siempre desde la raíz del repo.

El bot commitea directo a `main` cada 12h y, por el bump de versión, toca todos los HTML, los módulos con `fetch()` versionado y `service-worker.js` — hacer `git pull --rebase` antes de empezar un cambio y antes de pushear.

`detect_instagram_error()` en ese script clasifica los payloads de error de la Graph API (ej. token expirado) — ver `tests/test_update_instagram.py` para la forma esperada.

### Despliegue

`.github/workflows/deploy-pages.yml` despliega la raíz del repo tal cual a GitHub Pages en cada push a `main` (sin build en CI — los assets minificados ya deben estar commiteados). `.nojekyll` desactiva el procesamiento de Jekyll ya que este es un sitio estático plano.

Los pushes del bot de Instagram se hacen con el `GITHUB_TOKEN` por defecto, y GitHub no dispara workflows `on: push` desde esos pushes. Por eso `update_instagram.yml` lanza el despliegue explícitamente después de pushear (`gh workflow run deploy-pages.yml --ref main`, que sí funciona con `GITHUB_TOKEN` y requiere el permiso `actions: write` del job). Si se renombra `deploy-pages.yml` o se le quita `workflow_dispatch`, ese paso se rompe y los posts dejan de publicarse.

El sitio se sirve desde GitHub Pages detrás de Cloudflare. No hay `.htaccess` (GitHub Pages no lo procesa; los que había se eliminaron el 2026-10-12): redirecciones, URLs limpias o headers no se pueden definir desde el repositorio. `/productos` y `/ps3` funcionan porque Pages sirve `productos.html` y `ps3.html` sin la extensión. Los headers de seguridad (HSTS, X-Frame-Options, etc.) solo se pueden agregar en Cloudflare, y hoy no están configurados.

### Fuentes de datos

- Catálogo de productos: una Google Sheet pública (ID referenciado en `js/modules/products.js`), obtenida del lado del cliente y cacheada en localStorage por ~5 minutos.
- `js/efemerides.json`, `js/siglas.json`, `js/console_aliases.json`: archivos JSON locales estáticos.

### Docs

`docs/` contiene documentos históricos de implementación (SEO, performance, optimización mobile, fix de GitHub Pages, etc.) — revisar ahí antes de reinvestigar una decisión pasada. `docs/README.md` indica cuáles siguen vigentes; varios describen el estado de febrero–marzo 2026 (`js/index.js` monolítico, versiones `v1.0.x`) y no el actual. `docs/SEO_ANALYTICS_PLAYBOOK.md` documenta la configuración actual de GTM/GA4/Search Console impulsada por `js/seo-analytics.js`.

Al cambiar funcionalidad, el proyecto mantiene a mano tres lugares: `CHANGELOG.md` (formato Keep a Changelog, en español), la sección "Últimos Cambios" y el badge de versión de `README.md`. `AGENTS.md` solo apunta a este archivo: las reglas se editan aquí.

### Memoria del proyecto

`MEMORY.md` (raíz del repo) reúne los acuerdos tomados con el usuario: reglas de trabajo (cuenta de GitHub permitida, commit y push con cada cambio terminado), decisiones sobre la documentación y la lista de inconsistencias pendientes de decidir. Leerlo antes de trabajar, y registrar ahí cada acuerdo nuevo en el momento en que se toma, con su fecha. No corregir un pendiente de esa lista sin acordarlo antes.
