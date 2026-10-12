# Páginas 404 y de seguridad, traducciones faltantes, `h1` y enlaces de `old.html`

- **Estado:** Acordado
- **Fecha:** 2026-10-12
- **Tipo:** Arreglo
- **Pendientes relacionados:** PEND-06, PEND-12, PEND-13, PEND-14 y PEND-15 (acordado con Francisco el 2026-10-12)

## Problema

- En `404.html` y en las dos páginas de seguridad no funcionan el botón de tema ni el menú móvil, y hay un error de JavaScript al cargar: `index.min.js` llama a `loadSiglas()`, de un módulo que esas páginas no cargan (PEND-13).
- En inglés, los botones "Servicio Técnico" y "Pulido de Discos" de "Sobre Nosotros" quedan en español (PEND-06).
- Cuatro efemérides no tienen versión en inglés: 24 de octubre, 9 de noviembre, 13 de diciembre y 19 de diciembre (PEND-12).
- El inicio tiene dos `h1`: el principal y "Efemérides de hoy" (PEND-14).
- Los enlaces externos de `old.html` abren otra pestaña sin `rel="noopener"` (PEND-15).

## Resultado esperado

Las páginas 404 y de seguridad respetan el tema elegido y su menú móvil funciona; el sitio en inglés no tiene textos sueltos en español ni días sin efeméride; el inicio tiene un solo título principal.

## Requisitos

### Modificados

Dejan de estar pendientes (se quita `⚠ PEND-NN`; el texto no cambia):

- **I18N-005** — Toda clave del diccionario existe en español y en inglés.
- **I18N-007** — Toda clave `data-translate` usada en `index.html` y `productos.html` tiene versión en inglés.
- **EFE-007** — Cada efeméride tiene título, texto y detalle en español y en inglés.
- **SITE-006** — En la página 404 y las de seguridad funcionan el botón de tema y el menú móvil, sin errores de JavaScript.
- **SITE-018** — Cada página tiene un único encabezado `h1`.
- **LEG-004** — Los enlaces externos de `old.html` que abren otra pestaña llevan `rel="noopener"`.

Cambian de texto:

- **SITE-002** — La página 404 y las de seguridad cargan `seo-analytics.js`, luego `logger.js` y `ui.js`, y al final `index.min.js`; todos con `defer` y versión de caché. *(Antes: solo `seo-analytics.js` e `index.min.js`.)*
- **SITE-004** — Toda función que invoca `index.js` existe en las páginas que cargan todos los módulos. Las que pertenecen a un módulo que no todas las páginas cargan (`loadSiglas`, `lazyInitProducts`, `loadEfemerides`) van protegidas, y la inicialización no depende de que las siglas carguen. *(Antes solo `lazyInitProducts` iba protegida.)*

### Nuevos

- **SITE-019** — En la página 404 y las de seguridad se aplica el tema guardado por el visitante, y funcionan además la barra de progreso y el botón "volver arriba". Esas páginas se muestran siempre en español: no tienen selector de idioma y un idioma guardado no las traduce a medias.
- **NAV-006** — Las funciones de interfaz (`initTheme`, `initLanguage`, `initProgressBar`, `initMobileMenu`, `initFAQ`, `initBlogDialogs`, `initBackToTop`, `initNavActive`) no fallan en una página a la que le falta el elemento que manejan: simplemente no hacen nada.

## Fuera de alcance

- Traducir al inglés la página 404 y las de seguridad.
- PEND-16 (textos del HTML distintos al diccionario) y el rediseño del anuncio del local.
- Cualquier cambio visual: el título "Efemérides de hoy" debe verse igual que hoy.

## Archivos que se tocan

- `404.html`, `security-policy.html`, `security-acknowledgments.html` — cargan `logger.js` y `ui.js`.
- `js/index.js` → regenerar `js/index.min.js` (`npx terser js/index.js -o js/index.min.js -c -m`).
- `js/modules/ui.js` — funciones tolerantes a elementos ausentes; traducciones `about-btn-4` y `about-btn-5` en inglés.
- `js/efemerides.json` — bloque `EN` de las cuatro fechas. El archivo es JSON compacto en una línea con escapes `\uXXXX`: editarlo con un script que lo cargue y lo vuelva a escribir con `json.dumps(datos, separators=(',', ':'))`, que reproduce el archivo actual byte a byte.
- `index.html` — "Efemérides de hoy" pasa de `h1` a `h2`; `css/index.css` → `css/index.min.css` solo si hace falta para conservar su aspecto.
- `old.html` — `rel="noopener noreferrer"` en los enlaces externos con `target="_blank"`.

Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Tests automáticos: `tests/js/sitio.test.js` (`SITE-002`, `004`, `006`, `018`, `019`, `LEG-004`), `tests/js/ui.test.js` (`I18N-005`, `I18N-007`, `NAV-006`), `tests/js/instagram-efemerides.test.js` (`EFE-007`), sin la marca `todo`.
- `npm test` completo.
- En el navegador: abrir `404.html` y `security-policy.html` con tema claro guardado, alternar tema, abrir y cerrar el menú móvil; el inicio en inglés (botones de "Sobre Nosotros"); que "Efemérides de hoy" se vea igual.

## Decisiones

- **Por qué cargar `ui.js` en vez de duplicar código.** El tema y el menú móvil ya están en `ui.js`; cargarlo (con `logger.js`, que silencia los logs en producción) evita mantener una copia. `ui.js` no necesita los demás módulos si `setLanguage()` protege su llamada a `loadEfemerides()`.
- **Las siglas no bloquean la interfaz.** Hoy `index.js` espera a `loadSiglas()` antes de iniciar el tema y el menú. Con la protección, donde no existe `loadSiglas` la interfaz se inicia igual.
- **Textos en inglés.** `about-btn-4`: "Repair Service"; `about-btn-5`: "Disc Polishing" (los mismos términos que ya usa la FAQ en inglés). Las cuatro efemérides se traducen del texto en español, con el mismo estilo que las demás.
- **Páginas mínimas siempre en español.** Tienen atributos `data-translate` de cuando compartían plantilla; con `ui.js` cargado y un idioma guardado se traducirían solo algunos textos. Sin botón de idioma, `initLanguage()` no hace nada.
