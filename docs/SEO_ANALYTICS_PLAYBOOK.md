# SEO, Search Console, GA4 y GTM

## Implementacion actual

- `GTM` es el punto de entrada principal para medicion mediante `js/seo-analytics.js?v=2026-03-18_1`.
- La capa `dataLayer` expone contexto SEO por pagina: `page_type`, `page_title`, `canonical_url`, `meta_description` y `page_language`.
- Se envian eventos base para `outbound_click` y `generate_lead` cuando el destino es `wa.me`.
- Las paginas auxiliares (`404`, `old`, `security-policy`, `security-acknowledgments`) quedaron en `noindex`.

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

Configurar en el contenedor:

1. Un tag de configuracion `GA4` con el ID `G-GCE8SP8NBZ`.
2. Un trigger `All Pages`.
3. Variables de Data Layer para:
   - `page_type`
   - `page_title`
   - `canonical_url`
   - `meta_description`
   - `page_language`
4. Eventos para:
   - `outbound_click`
   - `generate_lead`
   - `seo_page_context`

## Google Analytics 4

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
