# 11 · GTM, eventos e indexación

- **Código:** `js/seo-analytics.js` · **Páginas:** todas menos `ps3.html`
- **Referencia:** `docs/SEO_ANALYTICS_PLAYBOOK.md`
- **Tests:** `tests/js/analytics-seo.test.js`

## Requisitos

### Google Tag Manager

- **SEO-001** — Antes de cualquier otro evento se declara el consentimiento por defecto: publicidad denegada; analítica, funcionalidad y seguridad permitidas.
- **SEO-002** — Cada página envía un evento `seo_page_context` con su tipo de página, idioma, título, ruta, URL, URL canónica, descripción y el ID de GA4. Sin `data-page-type` el tipo es `website`, y sin canonical se usa la URL actual.
- **SEO-003** — Google Tag Manager se inyecta una sola vez, con el contenedor `GTM-5D6LZB66`.
- **SEO-008** — Antes de inyectar Google Tag Manager se envía una sola vez el evento de inicio de GTM (`event: 'gtm.js'` con `gtm.start` igual a la hora de carga en milisegundos), después del consentimiento por defecto y antes de `seo_page_context`.
- **SEO-004** — Un clic en un enlace a otro sitio envía `outbound_click` con la URL y el texto del enlace. Los enlaces internos no envían nada.
- **SEO-005** — Un clic en un enlace de WhatsApp (`wa.me`) envía además `generate_lead`, aunque se pulse el ícono dentro del enlace.
- **SEO-007** — Toda página que carga `seo-analytics.js` declara su `data-page-type` en el `<body>`.

### Indexación

- **SEO-006** — Solo el inicio y el catálogo son indexables. La página 404, las de seguridad, `old.html` y `ps3.html` llevan `noindex`. Cada página declara su URL canónica; la del catálogo es `/productos`.

## Notas

- El sitemap está en [13-integridad-sitio.md](13-integridad-sitio.md) (`SITE-014`).
