# 14 · Páginas legacy

- **Código:** `old.html` (con `css/app.css`, `css/transition*.css`, `js/app.min.js`) y `ps3.html`
- **Tests:** `tests/js/sitio.test.js`

Páginas independientes del sistema de módulos. No reciben funcionalidades nuevas; solo se cuida que sigan funcionando.

## Requisitos

- **LEG-001** — `old.html` conserva sus estilos y su script propios, con versión de caché, y no depende de los módulos del sitio actual.
- **LEG-002** — `old.html` se abre sin errores de JavaScript y enlaza al Instagram de la tienda.
- **LEG-003** — `ps3.html` redirige de inmediato a la guía externa (por `meta refresh` y por script), ofrece un enlace manual y no depende de ningún script del sitio.
- **LEG-004** — Los enlaces externos de `old.html` que abren otra pestaña llevan `rel="noopener"`.

## Notas

- La indexación (`noindex`) y la CSP de estas páginas están en `SEO-006` y `SITE-011`.
