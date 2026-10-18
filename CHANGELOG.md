# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Sin publicar]

### Agregado
- Sección "Visítanos en el Persa Bio Bio" en el inicio (2026-10-12): tarjeta del local @DoubleImpactStore con dirección, metro, horario, señal "Abierto hoy" según el día en hora de Chile y botones "Cómo llegar" (Google Maps) y "Sitio del local"; ítem "Local" en el menú; aviso compacto en el catálogo. Reemplaza al bloque de texto sin estilo que estaba bajo los íconos de contacto, y se quita de la 404 y de las páginas de seguridad
- Headers de seguridad en todas las respuestas del sitio (2026-10-12), mediante una regla de Cloudflare: HSTS (6 meses), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy` sin cámara, micrófono, geolocalización, pagos ni USB
- Tests de todo el sitio (2026-10-12): 164 tests de JavaScript con `node:test` y `jsdom` en `tests/js/`, que cargan los HTML y scripts reales (utilidades, caché, siglas, tema, idioma, navegación, FAQ, blog, catálogo, Instagram, efemérides, analytics, GTM, service worker e integridad entre archivos), y 45 tests de Python para `api/bump_version.py` y `api/update_instagram.py`. Scripts `npm test`, `npm run test:js`, `npm run test:py` y `npm run trace`; workflow `.github/workflows/tests.yml` que los corre en cada push y pull request
- Desarrollo guiado por especificación (2026-10-12): `specs/README.md` con el proceso, `specs/base/` con 180 requisitos numerados que describen lo que hace hoy el sitio, `specs/cambios/` para especificar cada cambio y una prueba de trazabilidad que exige un test por requisito
- Agentes de Claude Code en `.claude/agents/` (2026-10-12): `orquestador` (desarrollador senior que conduce cada cambio con SDD), `frontend` (especialista en HTML, CSS y JS del sitio) y `tester` (escribe los tests y verifica cada cambio)
- `api/bump_version.py`: versión de caché única con esquema `AAAA-MM-DD_N` (correlativo por día) para todo el sitio; `--check` detecta referencias con otra versión o sin `?v=`. Scripts `npm run bump` y `npm run check:version`, y tests en `tests/test_bump_version.py` (2026-10-12)
- Control automático del versionado (2026-10-12): hook `.githooks/pre-commit` y paso "Verificar versión de caché" en `deploy-pages.yml`, que rechazan cambios a archivos del sitio sin subir la versión (`bump_version.py --verify-staged` / `--verify`)
- Local físico @DoubleImpactStore (junto a @NekketsuStore, Persa Bio Bio) en textos ES/EN, meta tags, `schema.json`, `structured-data.json` y `manifest.json` (2026-08-26)
- `CLAUDE.md`: guía de arquitectura y precauciones para agentes de IA (2026-09-04, ampliada 2026-10-12)
- `AGENTS.md`: puntero a `CLAUDE.md` para otros agentes de IA
- `MEMORY.md`: acuerdos, decisiones y pendientes del proyecto
- `docs/README.md`: índice de la documentación técnica, indicando qué documentos están vigentes y cuáles son históricos
- Sección "Desarrollo" en `README.md`

### Eliminado
- `.htaccess` y `.htaccess.development`: GitHub Pages no los procesa, así que sus headers de seguridad, redirecciones y reglas de caché nunca estuvieron activos. `SECURITY.md` deja de presentarlos como implementados (2026-10-12)

### Seguridad
- `old.html` ahora declara Content Security Policy por `<meta>`, igual que el resto del sitio, permitiendo además el video embebido de `youtube-nocookie.com` (2026-10-12)

### Corregido
- Idioma (2026-10-12): al reabrir el selector quedaba marcado el idioma anterior; el texto de ayuda de los buscadores del catálogo y el aviso de error de carga no se traducían
- Texto inicial de `index.html` y `productos.html` igualado al diccionario en español en 12 claves, para que los buscadores lean lo mismo que ve el visitante (2026-10-12)
- Service worker (2026-10-12): si el almacenamiento de caché del navegador no está disponible responde desde la red, en vez de dejar la página sin cargar
- Filtro de plataformas (2026-10-12): una plataforma con espacios sobrantes no filtraba sus productos, y dos plataformas de nombre parecido podían recibir el mismo `id`
- Páginas 404 y de seguridad (2026-10-12): no funcionaban el botón de tema ni el menú móvil y había un error de JavaScript al cargar. Ahora cargan `logger.js` y `ui.js`, respetan el tema guardado y se muestran siempre en español
- Inglés (2026-10-12): faltaban las traducciones de los botones "Servicio Técnico" y "Pulido de Discos" y la versión en inglés de cuatro efemérides (24 de octubre, 9 de noviembre, 13 y 19 de diciembre)
- `index.html` tenía dos `h1`: "Efemérides de hoy" pasa a `h2`, con el estilo de los demás títulos de sección (2026-10-12)
- `old.html`: los enlaces externos que abren otra pestaña llevan `rel="noopener noreferrer"` (2026-10-12)
- Catálogo de productos (2026-10-12), segunda tanda:
  - Al cambiar de idioma, las tarjetas, el contador y el filtro de plataformas quedaban en el idioma anterior hasta el siguiente filtro
  - Al pasar de página la URL no reflejaba la página, así que un enlace copiado abría siempre la primera
  - Una plataforma con comillas dobles o barra invertida en el nombre rompía el filtro
  - Un caché de productos dañado dejaba el catálogo en blanco hasta que vencía
  - Una plataforma con `%` o coma en el nombre no se conservaba en la URL
- Catálogo de productos (2026-10-12), cuatro defectos que destaparon los tests:
  - Después de una búsqueda sin resultados el catálogo quedaba bloqueado: corregir el texto no actualizaba la tabla y "Limpiar" no funcionaba
  - Con texto en el buscador y una sola plataforma elegida, la plataforma se descartaba
  - Los nombres con `&` se mostraban como `&amp;` en la tabla y las tarjetas, y como `&amp;amp;` en el modal. Los productos ahora se guardan sin escapar y se escapan una sola vez al dibujarlos; las claves del caché de productos pasan a `v1_1_2`
  - Un espacio al inicio o al final de la búsqueda impedía encontrar resultados
- `sitemap.xml` listaba cuatro páginas `noindex` (`old.html`, `ps3` y las dos de seguridad) y apuntaba a `/productos.html` en vez de la URL canónica `/productos`; ahora contiene solo `/` y `/productos`, con `lastmod` actualizado (2026-10-12)
- FAQ "¿Puedo ver los productos antes de comprar?" (ES/EN): decía que no hay showroom físico; ahora indica el local @DoubleImpactStore en el Persa Bio Bio, con dirección y horario (2026-10-12)
- Los posts de Instagram sincronizados por el bot no se publicaban: sus pushes no disparan `deploy-pages.yml`, y quedaban sin desplegar hasta el siguiente push manual. `update_instagram.yml` ahora lanza el despliegue después de pushear (2026-10-12)
- `productos.html` no cargaba el catálogo tras la refactorización de 2.1.0: seguía referenciando solo `index.min.js` y no incluía los módulos de `js/modules/`; además se agregaron los módulos a `STATIC_RESOURCES` del service worker (2026-08-25)
- `README.md`: dependencias Python (`python-dotenv` no se usa), ubicación del ID de Google Sheets (`js/modules/products.js`), número de URLs del sitemap, estado de indexación y estructura del proyecto

### Cambiado
- Bot de Instagram (2026-10-17): ante un error de la API (por ejemplo, un token expirado) o si falta `INSTAGRAM_TOKEN`, el script termina con error y la ejecución del workflow queda en rojo, para que GitHub avise. Antes terminaba bien y el token pasó 13 días vencido sin que nadie lo notara. Un error en una página posterior a la primera ya no deja al bot seguir con una lista parcial de posts
- El despliegue espera a los tests (2026-10-12): en cada push a `main`, `deploy-pages.yml` corre la suite completa y publica solo si pasa. El despliegue que lanza el bot de Instagram no se bloquea
- El catálogo pide la hoja de Google con un solo pedido (2026-10-12): usa `cache: 'no-store'` en vez de los encabezados `Cache-Control` y `Pragma`, que obligaban al navegador a un pedido de comprobación previo
- Versionado de caché unificado (2026-10-12): antes convivían el esquema manual `AAAA-MM-DD_N`, el del bot de Instagram `AAAA-MM-DD_HHMM` (en `instagram_posts.min.js` y `CACHE_VERSION`), versiones antiguas escritas dentro de `siglas.js` e `instagram.js`, y referencias sin `?v=` (Font Awesome, CSS de `old.html`, `efemerides.json`, registro del service worker en `productos.html`). Ahora todo usa el mismo valor
- `api/update_instagram.py` ya no genera su propia versión: usa `bump_version.bump()`
- Query strings actualizados a `v=2026-08-26_1`, luego `v=2026-10-12_1`, `_2` y `_3`
- Notas de vigencia en `SECURITY.md`, `docs/GOOGLE_TRACKING_SETUP.md` y `docs/SEO_ANALYTICS_PLAYBOOK.md`

---

## [2.1.0] - 2026-08-17

### Refactorización
- `js/index.js` (3300+ líneas) descompuesto en 9 módulos independientes bajo `js/modules/`
  - `logger.js` — IIFE de control de logs por ambiente (24 líneas)
  - `cache.js` — `CACHE_CONFIG`, `cleanOldCaches`, `getCachedProducts`, `setCachedProducts`, `clearProductsCache`, `clearAllCache` (93 líneas)
  - `siglas.js` — `loadSiglas`, `extractSiglas`, `createSiglasTooltip` (74 líneas)
  - `utils.js` — `sanitizeHTML`, `sanitizeURL`, `validateProductData`, `parseProductPrice`, `compareNullableNumbers`, `sortProducts`, `handleSecureError` (185 líneas)
  - `ui.js` — `initTheme`, `initLanguage`, `setLanguage`, `translations`, `blogContent`, `initBlogDialogs`, `initProgressBar`, `initNavActive`, `initBackToTop`, `initMobileMenu`, `initFAQ`, `applySavedSettings` (798 líneas)
  - `products.js` — todo el sistema de catálogo: tabla, tarjetas móviles, filtros, paginación, modal de detalles (1276 líneas)
  - `instagram.js` — `loadConsoleAliases`, `buildFilterButtons`, `detectConsole`, `initInstagramFilters`, `loadInstagramPosts`, `renderInstagramPosts` (334 líneas)
  - `efemerides.js` — `loadEfemerides` (129 líneas)
  - `analytics.js` — detección de recursos bloqueados, CSP violation handler, fallback analytics (418 líneas)
- `js/index.js` reducido a 16 líneas: solo el orquestador `DOMContentLoaded`
- `index.html` carga los 9 módulos en orden de dependencia con `defer` y versión `v=2026-08-17_2`

### Corregido
- Botones de filtro de Instagram (`ig-filter-btn`) no se generaban al cargar la página — faltaba llamar `buildFilterButtons()` después de `loadConsoleAliases()`
- `detectConsole()` fallaba silenciosamente: el JSON `console_aliases.json` usa estructura `{ label, aliases }` pero el código esperaba arrays planos
- `extractSiglas()` usaba el idioma anterior al cambiar de idioma — `localStorage.setItem('language')` se ejecutaba después de `setLanguage()`, no antes

### Cambiado
- `js/siglas.json`: cada entrada ahora tiene estructura bilingüe `{ "es": "...", "en": "..." }` en lugar de string plano
- `extractSiglas()`: resuelve la descripción según `localStorage.getItem('language')` en tiempo de ejecución
- `initLanguage()`: guarda el idioma en `localStorage` **antes** de invocar `setLanguage()` para que el re-render de siglas use el idioma correcto
- `api/update_instagram.py`: corregido para procesar `CAROUSEL_ALBUM` (extrae primera imagen) y omitir `VIDEO` sin tirar error de Pillow
- Query strings actualizados a `v=2026-08-17_1` y `v=2026-08-17_2` en todos los archivos HTML y JS

---

## [2.0.0] - 2026-05-09

### Agregado
- Servicio técnico de consolas retro y pulido de discos documentados en todo el sitio
- Nueva pregunta FAQ (ES+EN): "¿En qué consiste el servicio técnico y el pulido de discos?"
- 2 nuevos feature items en sección "Sobre Nosotros": Servicio Técnico y Pulido de Discos
- `knowsAbout` en Schema.org actualizado con "Servicio Técnico de Consolas Retro", "Pulido de Discos Ópticos" y "Reparación de Consolas Retro"

### Cambiado
- Meta description, og:description y twitter:description de `index.html` y `productos.html` incluyen los nuevos servicios
- Traducciones ES/EN en `js/index.js`: hero-subtitle, about-text-1/2, faq-question-1/answer-1 actualizados
- `schema.json`, `structured-data.json` y `manifest.json` actualizados con los nuevos servicios
- `README.md` actualizado con sección de servicios adicionales y FAQ

---

### Cambiado
- Google Sheets actualizado al nuevo ID `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek` en todo el sistema
- Query strings actualizados a `v=2026-05-09_1` en todos los archivos HTML
- Versión del caché del service worker actualizada a `ropavejero-v2026-05-09_1`
- `js/index.min.js` regenerado con el nuevo Sheet ID

---

## [1.1.8] - 2026-03-16

### Cambiado
- Versión unificada a `v=2026-03-16_7` en todos los archivos HTML, JS y service worker
- Archivos actualizados: `index.html`, `productos.html`, `404.html`, `security-policy.html`, `security-acknowledgments.html`, `old.html`, `service-worker.js`, `js/index.js`, `js/index.min.js`, `css/index.min.css`
- `js/index.min.js` y `css/index.min.css` regenerados con el nuevo Sheet ID y todos los fixes acumulados

---

## [1.1.7] - 2026-03-16

### Cambiado
- ID del Google Sheets actualizado a `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek` en todos los archivos
- Archivos actualizados: `js/index.js`, `js/index.min.js`, `index.html`, `old.html`, `README.md`
- Query strings actualizados a `v=2026-03-16_6`
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_6`

---

## [1.1.6] - 2026-03-16

### Corregido
- Link "Productos" en el nav apunta a `productos.html` en lugar de `/productos` — la URL limpia solo funciona en producción con Apache, no en desarrollo local
- `initNavActive()` detecta ahora tanto `/productos` como `productos.html` para marcar el ítem activo

### Cambiado
- Query strings actualizados a `v=2026-03-16_5`
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_5`

---

## [1.1.5] - 2026-03-16

### Agregado
- `initNavActive()`: marca el ítem activo del nav según la sección visible al hacer scroll en `index.html`
- En `productos.html` el ítem "Productos" queda siempre marcado con la línea activa

### Corregido
- Orden de declaración CSS de `.nav-active::after` — la regla base `width: 0` sobreescribía el `width: 100%` del active
- `.nav a:hover::after` y `.nav a.nav-active::after` unificados en una sola regla

### Cambiado
- Query strings actualizados a `v=2026-03-16_4`
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_4`
- `js/index.min.js` y `css/index.min.css` regenerados

---

## [1.1.4] - 2026-03-16

### Corregido
- Guards de null en `.then` y `.catch` de `loadEfemerides()` para cubrir llamadas desde `setLanguage()`
- El minificado anterior no se había generado correctamente (terser no estaba instalado)

### Cambiado
- Query strings actualizados a `v=2026-03-16_3`
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_3`
- `js/index.min.js` regenerado correctamente

---

## [1.1.3] - 2026-03-16

### Corregido
- `initBackToTop()` falla con null en páginas sin el logo como botón (ej: `productos.html`)
- `loadEfemerides()` falla con null al no existir `#efemeridesCard` fuera de `index.html`
- `initBlogDialogs()` falla con null al no existir `#blogDialogOverlay` fuera de `index.html`
- `updateProductsCounter()` falla con null en contextos sin el contador visible

### Cambiado
- Query strings actualizados a `v=2026-03-16_2` en todos los archivos HTML
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_2`
- `js/index.min.js` regenerado con los guards de null

---

## [1.1.2] - 2026-03-16

### Agregado
- Página independiente `productos.html` accesible en `https://ropavejeroretro.cl/productos`
- Regla en `.htaccess` para URL limpia `/productos` → `productos.html`
- Breadcrumb de navegación en la página de productos
- Clase CSS `.nav-active` para resaltar el ítem activo en el nav
- Entradas en `sitemap.xml` para la nueva URL `/productos`
- Caché del service worker para `/productos` y `/productos.html`
- Schema.org `CollectionPage` en la página de productos

### Cambiado
- Link "Productos" en el nav de `index.html` apunta ahora a `/productos` (URL independiente)
- Query strings actualizados a `v=2026-03-16_1` en todos los archivos HTML
- Versión del caché del service worker actualizada a `ropavejero-v2026-03-16_1`

---

## [1.1.1] - 2026-03-06

### Agregado
- Sistema completo de siglas para productos del catálogo
- Tooltips interactivos en tabla desktop al hacer hover sobre productos
- Sección visible de siglas en tarjetas móviles (sin tooltips)
- Diccionario de siglas en `js/siglas.json` con 40+ abreviaturas
- Funciones `loadSiglas()`, `extractSiglas()`, `createSiglasTooltip()` en index.js
- Detección inteligente de siglas con ordenamiento por longitud
- Sección de siglas en modal de detalles de producto
- Link de Instagram mejorado con gradiente de colores oficial

### Mejorado
- Modal de detalles de producto con mejor organización visual
- Detección precisa de siglas (CIB+ no detecta CIB, evita duplicados)
- Extracción de múltiples siglas por producto (ej: BL-CIB detecta ambas)
- Experiencia de usuario en móvil con información siempre visible
- Presentación de información técnica de productos

### Cambiado
- Query strings actualizados a v=2026-03-06_1 en index.html
- Tarjetas móviles ahora muestran siglas directamente (no requieren interacción)
- Estructura de tarjetas móviles con nueva sección de siglas

### Técnico
- Patrones regex mejorados para detección de siglas
- Escape de caracteres especiales en búsqueda de siglas
- Set para evitar duplicados en detección
- Estilos CSS responsive para siglas en móvil y desktop
- Documentación completa en `docs/SIGLAS_IMPLEMENTATION.md`

---

## [1.1.0] - 2026-03-05

### Agregado
- Sistema completo de automatización de Instagram con filtrado por hashtag `#RopavejeroRetroWeb`
- Script Python (`api/update_instagram.py`) para sincronización automática de posts de Instagram
- Generación automática de imágenes WebP responsive en 3 tamaños (400px, 800px, 1200px) usando Pillow
- Flujo de trabajo en GitHub Actions (`.github/workflows/update_instagram.yml`) para actualizaciones automáticas cada 12 horas
- Ejecución manual del workflow desde la pestaña Actions de GitHub
- Sistema de detección inteligente de cambios (posts agregados, modificados, eliminados)
- Generación automática de mensajes de commit descriptivos basados en cambios detectados
- Busting de caché automático en `index.html` con versionado dinámico
- Actualización automática del Service Worker con nuevas imágenes y versión
- Soporte para hasta 100 posts de Instagram con paginación automática
- Procesamiento de imágenes con conversión RGB y redimensionamiento proporcional
- Caché inteligente de imágenes (evita re-descargas innecesarias)
- Lazy loading de script de Instagram posts con IntersectionObserver
- Documentación completa del sistema de automatización en README.md

### Cambiado
- Service Worker actualizado a v2026-03-05_1454 con soporte para variantes WebP
- Array `INSTAGRAM_IMAGES` en Service Worker ahora incluye todas las variantes (JPEG + 400/800/1200 WebP)
- Query string de `instagram_posts.min.js` actualizado a v=2026-03-05_1454
- Estructura de datos de posts de Instagram ahora incluye ID único con prefijo `ig_auto_`
- Mejora en la estrategia de caché del Service Worker para imágenes de Instagram
- Optimización del proceso de carga de posts con lazy loading basado en viewport

### Mejorado
- Performance de carga de imágenes de Instagram con formato WebP (reducción ~70% en tamaño)
- Rendimiento general del sitio con imágenes responsive adaptadas a cada dispositivo
- Experiencia de usuario con actualizaciones automáticas sin intervención manual
- Gestión de caché con limpieza automática de versiones antiguas
- Proceso de deployment con commits automáticos descriptivos
- Escalabilidad del sistema para manejar grandes cantidades de posts

### Técnico
- Dependencias Python: `Pillow`, `requests`, `python-dotenv`
- Configuración de secretos en GitHub: `INSTAGRAM_TOKEN` (Instagram Basic Display API / Graph API)
- Integración con Instagram Graph API para obtención de media
- Procesamiento de imágenes con calidad optimizada (WebP quality=85, JPEG quality=90)
- Sistema de versionado automático basado en timestamp
- Manejo robusto de errores en descarga y procesamiento de imágenes
- Compatibilidad con imágenes RGBA y P (conversión automática a RGB)

---

## [1.0.9] - 2026-02-17

### Corregido
- Regenerados todos los archivos minificados (.min.js y .min.css)
- Eliminada declaración duplicada de CACHE_CONFIG en index.min.js
- Optimización de gtm.min.js

### Cambiado
- Service Worker actualizado a v1.0.9
- Query strings actualizados a v=2026-02-17_3
- Cache localStorage actualizado a v1_0_9
- Limpieza automática de cachés antiguos (v1_0_8 y anteriores)

---

## [1.0.8] - 2026-02-17

### Agregado
- Google Tag Manager (GTM) integrado en todas las páginas HTML
- Google Analytics 4 (GA4) configurado
- Watcher.js para minificación automática de archivos
- Footer con enlaces a páginas adicionales:
  - Versión Antigua (old.html)
  - Política de Seguridad (security-policy.html)
  - Agradecimientos de Seguridad (security-acknowledgments.html)
- Traducciones ES/EN para enlaces del footer
- 3 nuevas URLs en sitemap.xml (total: 13 URLs)

### Cambiado
- Service Worker actualizado a v1.0.8
- Query strings actualizados a v=2026-02-17_2
- Meta tags en páginas de seguridad: `noindex` → `index, follow`
- Robots.txt optimizado (eliminadas restricciones de páginas de seguridad)
- Estructura del footer reorganizada (flex-direction: column)
- README.md actualizado con historial de versiones

### Mejorado
- SEO: Cobertura de indexación mejorada de 25% a 100%
- Arquitectura de información con enlaces internos
- Transparencia con políticas de seguridad públicas
- Cache busting automático en navegadores

---

## [1.0.7] - 2026-02-17

### Agregado
- Mejoras de SEO e indexación para Google Search Console
- Estilos CSS para `.footer-links`
- Canonical URLs en páginas de seguridad
- Documentación completa en `docs/SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md`

### Cambiado
- Sitemap.xml actualizado con fechas 2026-02-17
- Prioridades ajustadas en sitemap (old.html: 0.3, security-*.html: 0.5)

---

## [1.0.6] - 2026-02-16

### Agregado
- Preconnect hints a dominios externos (docs.google.com, fonts.googleapis.com)
- Critical CSS inline para mejorar FCP
- Imágenes responsive WebP con múltiples variantes
- Service Worker con defer attribute

### Mejorado
- LCP mejorado ~80% (hero image local preloaded)
- FCP mejorado ~60% (critical CSS inline)
- Cache management optimizado (56 assets, 3.85 MB)

---

## [1.0.5] - 2026-02-16

### Agregado
- Minificación de JavaScript y CSS
- Lazy loading de imágenes e Instagram posts
- Passive event listeners
- Debouncing en búsqueda (300ms)

### Mejorado
- Reducción de tamaño de archivos: 36.4% total
  - JavaScript: -29.9% (141.3 KB → 99.1 KB)
  - CSS: -28.7% (44.0 KB → 31.4 KB)
- Performance mejorado 40-60% en Desktop y Mobile

---

## [1.0.0] - 2020

### Agregado
- Lanzamiento inicial del sitio web
- Catálogo de productos con integración a Google Sheets
- Sección de Instagram con posts
- Efemérides del día
- Blog con artículos sobre gaming retro
- Testimonios de clientes
- FAQ interactivo
- Soporte multilenguaje (ES/EN)
- Modo claro/oscuro
- PWA (Progressive Web App)
- Service Worker para funcionalidad offline

---

## Tipos de Cambios

- **Agregado**: para nuevas funcionalidades
- **Cambiado**: para cambios en funcionalidades existentes
- **Deprecado**: para funcionalidades que serán eliminadas
- **Eliminado**: para funcionalidades eliminadas
- **Corregido**: para corrección de errores
- **Mejorado**: para mejoras de performance o UX
- **Seguridad**: para vulnerabilidades corregidas
