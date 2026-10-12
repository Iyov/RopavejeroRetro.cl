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
python -m pytest tests/            # tests del script de Instagram (requiere instalar pytest)
```

## Reglas que no se deducen del código

1. **No correr `npm run minify:js`, `npm run build` ni `npm run watch` sin revisar el resultado.** `js/app.js` está vacío y esos comandos sobrescriben `js/app.min.js` (lo usa `old.html`) con un archivo vacío. Si ocurre: `git checkout js/app.min.js`.
2. **El HTML carga `js/index.min.js` y `css/index.min.css`**, no los fuentes. Tras editar `js/index.js` o `css/index.css` hay que regenerar el `.min` y commitearlo. Los archivos de `js/modules/` se sirven sin minificar.
3. **Los módulos son scripts globales con `defer`, en orden de dependencia.** Agregar, quitar o reordenar uno exige actualizar `index.html`, `productos.html` y `STATIC_RESOURCES` en `service-worker.js`.
4. **Cache-busting:** al cambiar un asset, subir el `?v=YYYY-MM-DD_N` en todos los HTML y cambiar `CACHE_VERSION` en `service-worker.js`. No tocar el `?v=` de `instagram_posts.min.js` en `index.html`: lo administra el bot.
5. **No editar a mano** `js/instagram_posts.js`, `js/instagram_posts.min.js`, el array `INSTAGRAM_IMAGES` de `service-worker.js` ni las imágenes `img/IG_*`: los regenera el script de Instagram.
6. **El bot de Instagram commitea a `main` cada 12 horas** sobre `index.html` y `service-worker.js`: hacer `git pull --rebase` antes de pushear. Sus pushes no disparan el despliegue por sí solos: `update_instagram.yml` lo lanza con `gh workflow run deploy-pages.yml`, así que no renombrar ese workflow ni quitarle `workflow_dispatch`.
7. **Todo texto visible va en español e inglés**: atributo `data-translate` en el HTML y la clave en ambos idiomas de `translations` (`js/modules/ui.js`).
8. **`console.log` y `console.info` están anulados en producción** (`js/modules/logger.js`); usar `console.warn`/`console.error` para lo que deba verse.
9. **La CSP vive en un `<meta>` de cada HTML.** Un dominio externo nuevo hay que agregarlo en todos, y en las listas de `js/modules/utils.js` y `js/modules/analytics.js`.
10. **Documentación:** los cambios de funcionalidad se registran en `CHANGELOG.md` y en "Últimos Cambios" de `README.md`. La documentación del proyecto se escribe en español.
