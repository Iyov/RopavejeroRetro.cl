# AGENTS.md

Instrucciones para agentes de IA (Codex, Copilot, Cursor, Gemini, etc.) que trabajen en este repositorio.

La guía completa y única fuente de verdad es [CLAUDE.md](CLAUDE.md): léela antes de modificar código. Este archivo solo resume lo que más fácilmente se rompe; si algo cambia, se edita en `CLAUDE.md` y aquí solo se ajusta el resumen.

Lee también [MEMORY.md](MEMORY.md): contiene los acuerdos tomados con el dueño del proyecto (cuenta de GitHub permitida, commit y push con cada cambio terminado, temas pendientes de decidir). Cada acuerdo nuevo se registra ahí.

## Qué es

Sitio estático en HTML/CSS/JS puro para Ropavejero Retro, desplegado en GitHub Pages (`ropavejeroretro.cl`). Sin framework ni bundler. El catálogo viene de una Google Sheet pública; los posts de Instagram los genera `api/update_instagram.py` desde GitHub Actions.

## Comandos

```bash
python -m http.server 8000         # servir el sitio localmente
npm run minify:css                 # css/index.css, css/app.css -> *.min.css
npx terser js/index.js -o js/index.min.js -c -m   # minificar solo el entry point
npm test                           # todos los tests: JavaScript (jsdom) y Python (requiere npm install y pytest)
npm run trace                      # matriz de trazabilidad requisito -> tests
python api/bump_version.py         # subir la versión de caché en todo el sitio
python api/bump_version.py --check # verificar que la versión sea consistente
```

## Reglas que no se deducen del código

1. **`npm run minify:js`, `npm run build` y `npm run watch` también regeneran `js/instagram_posts.min.js`** con un resultado distinto al que escribe el bot. No commitear ese diff: `git checkout js/instagram_posts.min.js`.
2. **El HTML carga `js/index.min.js` y `css/index.min.css`**, no los fuentes. Tras editar `js/index.js` o `css/index.css` hay que regenerar el `.min` y commitearlo. Los archivos de `js/modules/` se sirven sin minificar.
3. **Los módulos son scripts globales con `defer`, en orden de dependencia.** Agregar, quitar o reordenar uno exige actualizar `index.html`, `productos.html` y `STATIC_RESOURCES` en `service-worker.js`.
4. **Versión de caché única, `AAAA-MM-DD_N`:** el mismo valor va en todos los `?v=` (HTML, loader de Instagram, registro del service worker, `fetch()` de JSON en `js/modules/`) y en `CACHE_VERSION`. Nunca se edita a mano: todo cambio a un archivo que sirve el sitio termina con `python api/bump_version.py` (mismo día `_N+1`, día nuevo `_1`), y `python api/bump_version.py --check` debe pasar antes de commitear. Un hook `pre-commit` (activar con `git config core.hooksPath .githooks`) y el workflow de despliegue rechazan los cambios al sitio que no suban la versión.
5. **No editar a mano** `js/instagram_posts.js`, `js/instagram_posts.min.js`, el array `INSTAGRAM_IMAGES` de `service-worker.js` ni las imágenes `img/IG_*`: los regenera el script de Instagram.
6. **El bot de Instagram commitea a `main` cada 12 horas** y sube la misma versión de caché, así que toca todos los HTML: hacer `git pull --rebase` antes del bump y antes de pushear. Sus pushes no disparan el despliegue por sí solos: `update_instagram.yml` lo lanza con `gh workflow run deploy-pages.yml`, así que no renombrar ese workflow ni quitarle `workflow_dispatch`.
7. **Todo texto visible va en español e inglés**: atributo `data-translate` en el HTML y la clave en ambos idiomas de `translations` (`js/modules/ui.js`).
8. **`console.log` y `console.info` están anulados en producción** (`js/modules/logger.js`); usar `console.warn`/`console.error` para lo que deba verse.
9. **La CSP vive en un `<meta>`** de `index.html`, `productos.html`, `404.html`, `old.html` y las dos páginas de seguridad (`ps3.html` no tiene). Un dominio externo nuevo hay que agregarlo en los seis, y en las listas de `js/modules/utils.js` y `js/modules/analytics.js`.
10. **Documentación:** los cambios de funcionalidad se registran en `CHANGELOG.md` y en "Últimos Cambios" de `README.md`. La documentación del proyecto se escribe en español.
11. **SDD y tests:** todo cambio al sitio sigue [specs/README.md](specs/README.md): primero la especificación en `specs/cambios/`, acordada con el dueño del proyecto; después los tests y la implementación. Cada requisito de `specs/base/` tiene un test que lo cita por su identificador (`[PRD-013]`), y `npm test` debe pasar antes de cada commit. Un push a `main` solo se publica si la suite pasa.
12. **Defectos conocidos:** los tests marcados `todo` con `PEND-NN` describen defectos registrados en `MEMORY.md`. No corregirlos de paso: se corrigen cuando se acuerda, quitando la marca del test y la de la especificación.
