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
```

Servir localmente con cualquier servidor estático, ej. `python -m http.server 8000`, luego abrir `http://localhost:8000`.

Script de automatización de Instagram (Python, en `api/`):
```bash
pip install -r requirements.txt
python api/update_instagram.py     # requiere INSTAGRAM_TOKEN en .env
```

Tests (Python, `tests/`):
```bash
python -m pytest tests/            # o: python -m pytest tests/test_update_instagram.py
```
No existe suite de tests para JS.

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

`index.html` y `productos.html` declaran esta lista de scripts cada uno por su cuenta (`productos.html` además incluye `products.js`) — al agregar/quitar un módulo o cambiar el orden de carga, hay que actualizar **ambos** HTML, y regenerar `js/index.min.js` con `npm run minify:js`, ya que `index.min.js` (no `index.js`) es el que realmente se referencia en el HTML.

`js/instagram_posts.js` / `.min.js` contienen los datos reales de los posts de Instagram (generados por `api/update_instagram.py`, no se editan a mano).

### Convención de cache-busting / versionado

Cada referencia a un asset estático en el HTML (`css/*.min.css`, `js/*.min.js`, `js/modules/*.js`, `manifest.json`, `service-worker.js`) lleva un query string `?v=YYYY-MM-DD_N`, y `service-worker.js` tiene una constante `CACHE_VERSION` equivalente (`ropavejero-vYYYY-MM-DD_N`). Todas deben incrementarse juntas cada vez que cambia un asset cacheado, a través de `index.html`, `productos.html`, `404.html`, `old.html`, `security-policy.html`, `security-acknowledgments.html`, y `service-worker.js` — de lo contrario el service worker seguirá sirviendo archivos cacheados obsoletos. `docs/generate_cache_version.py` ayuda a inspeccionar/validar la versión actual y la lista de assets cacheados.

### Pipeline de automatización de Instagram

`api/update_instagram.py` corre vía `.github/workflows/update_instagram.yml` (cron cada 12h, o disparo manual). El script:
- Trae posts desde la Instagram Graph API, quedándose solo con los que llevan el hashtag `#RopavejeroRetroWeb`.
- Descarga las imágenes y genera variantes WebP responsive (400/800/1200px) con Pillow.
- Reescribe `js/instagram_posts.min.js`, incrementa el query string de versión en `index.html`, y actualiza la lista de caché/versión de `service-worker.js`.
- Escribe un mensaje de commit en `commit_message.txt`, que el workflow lee para commitear y pushear el resultado por su cuenta (vía `github-actions[bot]`).

`detect_instagram_error()` en ese script clasifica los payloads de error de la Graph API (ej. token expirado) — ver `tests/test_update_instagram.py` para la forma esperada.

### Despliegue

`.github/workflows/deploy-pages.yml` despliega la raíz del repo tal cual a GitHub Pages en cada push a `main` (sin build en CI — los assets minificados ya deben estar commiteados). `.nojekyll` desactiva el procesamiento de Jekyll ya que este es un sitio estático plano.

### Fuentes de datos

- Catálogo de productos: una Google Sheet pública (ID referenciado en `js/modules/products.js`), obtenida del lado del cliente y cacheada en localStorage por ~5 minutos.
- `js/efemerides.json`, `js/siglas.json`, `js/console_aliases.json`: archivos JSON locales estáticos.

### Docs

`docs/` contiene documentos históricos de implementación (SEO, performance, optimización mobile, fix de GitHub Pages, etc.) — revisar ahí antes de reinvestigar una decisión pasada. `docs/SEO_ANALYTICS_PLAYBOOK.md` documenta la configuración actual de GTM/GA4/Search Console impulsada por `js/seo-analytics.js`.
