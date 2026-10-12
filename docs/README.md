# Documentación técnica

Índice de `docs/`. La mayoría de estos documentos registran una implementación en el momento en que se hizo y no se han mantenido después: sirven para entender por qué se tomó una decisión, no para saber cómo está el código hoy.

Para el estado actual del proyecto (arquitectura, comandos, versionado de caché, pipeline de Instagram, despliegue) ver [CLAUDE.md](../CLAUDE.md) y la sección "Desarrollo" del [README](../README.md).

## Vigentes

| Documento | Contenido |
|-----------|-----------|
| [SEO_ANALYTICS_PLAYBOOK.md](SEO_ANALYTICS_PLAYBOOK.md) | Configuración de GTM, GA4 y Search Console; eventos que envía `js/seo-analytics.js`; qué páginas son `noindex`. |
| [GITHUB_PAGES_FIX.md](GITHUB_PAGES_FIX.md) | Por qué existen `.nojekyll` y `.github/workflows/deploy-pages.yml`. |
| [ADBLOCK-COMPATIBILITY.md](ADBLOCK-COMPATIBILITY.md) | Comportamiento esperado con bloqueadores de anuncios y errores de consola que son normales. La lógica está en `js/modules/analytics.js`. |

## Históricos

Describen el sitio de febrero–marzo de 2026. Desde la versión 2.1.0 (agosto de 2026) `js/index.js` es solo el orquestador y el código al que se refieren vive en `js/modules/`.

| Documento | Fecha | Qué quedó desactualizado |
|-----------|-------|--------------------------|
| [SIGLAS_IMPLEMENTATION.md](SIGLAS_IMPLEMENTATION.md) | Marzo 2026 | El diseño sigue siendo válido, pero las funciones están en `js/modules/siglas.js` y `js/modules/products.js`, y `js/siglas.json` pasó a ser bilingüe (`{ "es": ..., "en": ... }`). |
| [GOOGLE_TRACKING_SETUP.md](GOOGLE_TRACKING_SETUP.md) | Febrero 2026 | Describe los snippets de GTM y GA4 pegados en cada HTML. Hoy GTM lo carga `js/seo-analytics.js`, que no carga GA4 directamente: el tag de GA4 debe estar configurado dentro del contenedor. Los IDs siguen siendo los mismos. |
| [SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md](SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md) | Febrero 2026 | Pasó las páginas de seguridad y `old.html` a `index, follow`. Después volvieron a `noindex` (ver el playbook de SEO). |
| [OPTIMIZACIONES_RENDIMIENTO.md](OPTIMIZACIONES_RENDIMIENTO.md) | Febrero 2026 | Tamaños de archivo, versión de caché `v1.0.6` y métricas de ese momento. |
| [OPTIMIZACIONES_MOBILE.md](OPTIMIZACIONES_MOBILE.md) | Febrero 2026 | Incluye recomendaciones para `.htaccess`, que GitHub Pages no procesa. |

## Scripts

Todos son de la optimización de febrero de 2026 y ninguno forma parte del flujo de trabajo actual.

| Script | Qué hace | Nota |
|--------|----------|------|
| `generate_cache_version.py` | Imprime un reporte con la versión de caché y los assets cacheados, y lo guarda en `docs/CACHE_VERSION_REPORT.txt`. | No cambia ninguna versión. Usa rutas `../`: ejecutarlo con `cd docs`. Su lista de assets está desactualizada. |
| `analyze_perf.py` | Compara tamaños de CSS/JS originales y minificados. | Usa rutas `../`: ejecutarlo con `cd docs`. |
| `SUMMARY.py` | Imprime el resumen de la optimización `v1.0.6`. | Solo texto fijo. |
| `optimize_performance.sh` | Script de optimización de esa fecha. | Revisarlo antes de ejecutarlo: no se ha usado desde entonces. |
