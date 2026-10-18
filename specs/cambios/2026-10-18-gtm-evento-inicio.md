# GA4 no recibe datos: falta el evento de inicio de GTM

- **Estado:** Entregado
- **Fecha:** 2026-10-18
- **Tipo:** Arreglo

## Problema

GA4 (`G-GCE8SP8NBZ`) nunca ha recibido un dato del sitio. Había dos causas:

1. El contenedor GTM publicado (versión 1) estaba vacío. **Se corrigió el 2026-10-18 fuera del repositorio**: la versión 2 del contenedor tiene la etiqueta de Google, que se activa con `seo_page_context`, y los eventos `generate_lead` y `outbound_click`.
2. `js/seo-analytics.js` inyecta `gtm.js`, pero no envía el evento de inicio que trae el fragmento oficial de GTM (`{'gtm.start': <hora>, event: 'gtm.js'}`). Sin ese evento, la etiqueta de Google de GA4 se carga pero no envía nada: se comprobó el 2026-10-18 en Chrome contra el sitio publicado. Sin el evento no sale ningún `g/collect`; inyectándolo antes de los scripts de la página, sale el `page_view` y GA4 lo muestra en tiempo real.

## Resultado esperado

Cada visita a cualquier página con `seo-analytics.js` llega a GA4 como `page_view`, y los clics en WhatsApp y en enlaces externos llegan como `generate_lead` y `outbound_click`.

## Requisitos

### Nuevos

- **SEO-008** — Antes de inyectar Google Tag Manager se envía una sola vez el evento de inicio de GTM (`event: 'gtm.js'` con `gtm.start` igual a la hora de carga en milisegundos), después del consentimiento por defecto y antes de `seo_page_context`.

### Modificados

Ninguno. `SEO-001` sigue igual: el consentimiento por defecto sigue siendo lo primero en `dataLayer`.

## Fuera de alcance

- La configuración de GTM y GA4 (ya hecha en sus paneles; queda registrada en `docs/SEO_ANALYTICS_PLAYBOOK.md`).
- Los cambios de contenido SEO (títulos, descripciones, datos estructurados, enlaces internos): van en una especificación aparte.

## Archivos que se tocan

- `js/seo-analytics.js`: agregar el evento de inicio de GTM.
- `docs/SEO_ANALYTICS_PLAYBOOK.md`: describir el contenedor actual (versión 2) y lo que falta hacer en GA4.
- `specs/base/11-seo.md`: agregar `SEO-008`.
- `tests/js/analytics-seo.test.js`: test de `SEO-008`.
- Bump de versión de caché (se toca un archivo del sitio).

## Cómo se comprueba

- Test automático `[SEO-008]` en `tests/js/analytics-seo.test.js`: en cada página, `dataLayer` tiene exactamente un evento `gtm.js` con `gtm.start` numérico, ubicado después del `consent default` y antes de `seo_page_context`.
- Después del despliegue: abrir el sitio publicado en un Chrome sin bloqueador y comprobar que sale `google-analytics.com/g/collect?…tid=G-GCE8SP8NBZ` y que la visita aparece en "Tiempo real" de GA4.

## Decisiones

- La etiqueta de Google en GTM se activa con `seo_page_context` y no con "Initialization - All Pages". Así no depende del orden interno de GTM, y ese evento ya existe en todas las páginas.
- Se pausaron en GTM, sin borrarlas, la etiqueta de Google antigua (nunca publicada y duplicada) y "Clic a Instagram evento de GA4" (su ID de medición era `{{Click URL}}`, inválido). `outbound_click` ya mide los clics a Instagram. Francisco lo autorizó el 2026-10-18.
- `generate_lead` se marca como evento clave en GA4 cuando llegue el primero: la interfaz actual de GA4 solo deja marcar eventos que ya se recibieron.
