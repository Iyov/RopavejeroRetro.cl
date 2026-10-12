# Pedido a la hoja de Google sin comprobación previa

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Cambio de comportamiento (mejora de rendimiento)
- **Pendiente relacionado:** observación del pedido extra en `MEMORY.md` (acordado con Francisco el 2026-10-12)

## Problema

El catálogo pide la hoja de Google enviando los encabezados `Cache-Control` y `Pragma`. Como no son encabezados simples, el navegador hace antes un pedido de comprobación (`OPTIONS`) a Google, que agrega unos 150 ms a cada carga del catálogo y es un pedido más que puede fallar.

## Resultado esperado

El catálogo carga con un solo pedido a la hoja, y sigue trayendo siempre los datos actuales, sin copia de la caché del navegador.

## Requisitos

### Nuevos

- **PRD-045** — El pedido a la hoja de Google no usa la caché HTTP del navegador (`cache: 'no-store'`) y solo lleva encabezados simples, de modo que el navegador no necesita un pedido de comprobación previo.

## Fuera de alcance

- El caché de productos en `localStorage` (5 minutos), los reintentos y el tiempo límite: no cambian.

## Archivos que se tocan

- `js/modules/products.js` — opciones del `fetch` en `loadProducts()`.

Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Test automático `PRD-045` en `tests/js/productos.test.js`.
- En un navegador real: una sola petición a `docs.google.com` (sin `OPTIONS`) y el catálogo visible.

## Decisiones

- **`cache: 'no-store'` en vez de los encabezados.** Es la forma estándar de pedirle al navegador que no use ni guarde copia; los encabezados `Cache-Control` y `Pragma` en la petición buscaban lo mismo, pero obligaban a la comprobación previa. `Accept: text/csv` se conserva porque es un encabezado simple.
