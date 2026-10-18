# SEO, Search Console, GA4 y GTM

## Implementacion actual

- `GTM` es el punto de entrada principal para medicion mediante `js/seo-analytics.js` (cargado con el mismo `?v=` que el resto de los assets de cada HTML).
- La capa `dataLayer` expone contexto SEO por pagina: `page_type`, `page_title`, `canonical_url`, `meta_description` y `page_language`.
- Se envian eventos base para `outbound_click` y `generate_lead` cuando el destino es `wa.me`.
- Las paginas auxiliares (`404`, `old`, `ps3`, `security-policy`, `security-acknowledgments`) quedaron en `noindex`.
- `sitemap.xml` lista solo las paginas indexables: `/` y `/productos` (la URL canonica, sin `.html`). Las paginas `noindex` no van en el sitemap.

## Search Console

Metodos recomendados de verificacion:

1. DNS TXT en el dominio raiz.
2. Archivo HTML entregado por Google en la raiz del sitio.
3. Meta tag en el `<head>` solo si no se puede usar DNS.

Checklist:

- Enviar `https://ropavejeroretro.cl/sitemap.xml`.
- Revisar cobertura e indexacion de `/` y `/productos`.
- Confirmar que las paginas `noindex` no aparezcan como validas.
- Supervisar Core Web Vitals y mejoras de resultados enriquecidos.

## Google Tag Manager

Estado del contenedor `GTM-5D6LZB66` desde el 2026-10-18 (version 2, "GA4 base: etiqueta de Google y eventos"). La version 1 estaba vacia, y por eso GA4 no recibio datos hasta esa fecha.

| Etiqueta | Tipo | Activador |
|----------|------|-----------|
| GA4 - Etiqueta de Google | Etiqueta de Google `G-GCE8SP8NBZ`, con el parametro `page_type` | `CE - seo_page_context` (evento personalizado; lo envia cada pagina) |
| GA4 - generate_lead (WhatsApp) | Evento GA4 `generate_lead` con `lead_channel`, `link_url`, `page_type` | `CE - generate_lead` |
| GA4 - outbound_click | Evento GA4 `outbound_click` con `link_url`, `link_text`, `page_type` | `CE - outbound_click` |

- Variables de capa de datos: `DLV - page_type`, `DLV - link_url`, `DLV - link_text`, `DLV - lead_channel`.
- Pausadas (no borradas): la etiqueta de Google antigua `G-GCE8SP8NBZ` con "Initialization - All Pages", que nunca se publico y quedaba duplicada, y "Clic a Instagram evento de GA4", que tenia `{{Click URL}}` como ID de medicion. `outbound_click` ya mide los clics a Instagram.
- La etiqueta de Google se activa con `seo_page_context` y no con "All Pages" para no depender del orden interno de GTM. Aun asi, `js/seo-analytics.js` envia el evento de inicio `gtm.js` (`SEO-008`): sin ese evento la etiqueta de GA4 se carga pero no envia nada (comprobado el 2026-10-18).
- Brave bloquea GTM con sus Shields: para revisar la medicion usar Chrome o Edge sin bloqueador, o el modo Vista previa de GTM.

## Google Analytics 4

Estado al 2026-10-18: propiedad `Ropavejero.Retro SpA` (flujo web `13625416084`), conservacion de datos de eventos y de usuario en 14 meses, vinculada con la propiedad de dominio `ropavejeroretro.cl` de Search Console desde el 2026-08-23. Pendiente: marcar `generate_lead` como evento clave cuando llegue el primero (GA4 solo permite marcar eventos ya recibidos).

Eventos recomendados:

- `page_view`
- `view_search_results`
- `select_content`
- `generate_lead`
- `outbound_click`

Conversiones sugeridas:

- `generate_lead`
- clics salientes a Instagram o WhatsApp

## Buenas practicas operativas

- Mantener canonicals consistentes entre `/productos` y `productos.html`.
- No agregar `AggregateRating` o reseñas en schema si no existen de forma visible y verificable.
- Mantener `robots.txt`, `sitemap.xml` y metadata alineados con las paginas realmente indexables.
- Revisar en cada despliegue que `title`, `description`, `og:*`, `twitter:*` y JSON-LD sigan coherentes.
