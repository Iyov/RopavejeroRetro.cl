# 10 · Analytics resiliente y CSP

- **Código:** `js/modules/analytics.js`
- **Tests:** `tests/js/analytics-seo.test.js`

El sitio no debe mostrar errores ni dejar de funcionar cuando un bloqueador de anuncios o el navegador impiden cargar los scripts de analítica.

## Requisitos

- **ANL-001** — `getBrowserInfo` identifica el navegador (Brave, Edge, Opera, Chrome, Firefox, Safari, DuckDuckGo) a partir del user agent, o `Unknown`.
- **ANL-002** — `isAllowedByCSP` acepta solo los dominios externos autorizados para carga dinámica: `docs.google.com`, Cloudflare Insights y Google Fonts, con sus subdominios.
- **ANL-003** — `loadResourceSafely` rechaza los dominios no autorizados y los tipos de recurso desconocidos sin insertar nada en la página.
- **ANL-004** — `loadResourceSafely` inserta el script u hoja de estilos autorizado, resuelve cuando carga y rechaza si falla.
- **ANL-005** — Si el script de Cloudflare es bloqueado no se produce un error: se activa el analytics de respaldo (`window.fallbackAnalytics`).
- **ANL-006** — Al cargar la página, si Cloudflare Analytics no está disponible tras la espera, se activa el respaldo y se distingue si lo bloqueó un adblocker o la política del navegador (Brave, Opera, DuckDuckGo). Si Cloudflare está presente, el respaldo no se activa.
- **ANL-007** — Un error de carga del beacon de Cloudflare activa el respaldo; el fallo de otros recursos no.
- **ANL-008** — Las violaciones de CSP causadas por bloqueadores (Cloudflare, Google Analytics, GTM) se ignoran. Las reales se detallan en la consola solo en desarrollo; en producción no se escribe nada.
- **ANL-009** — `trackEvent` está disponible globalmente y delega en el analytics de respaldo cuando está activo; sin él, no falla.

## Notas

- El analytics de respaldo no envía datos a ningún servidor: su envío está comentado en el código. Hoy solo evita errores cuando Cloudflare no carga.
