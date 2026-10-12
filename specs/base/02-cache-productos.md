# 02 · Caché de productos

- **Código:** `js/modules/cache.js`
- **Tests:** `tests/js/cache-logger-siglas.test.js`

El catálogo se guarda en `localStorage` para no consultar la hoja de Google en cada visita.

## Requisitos

- **CCH-001** — Los productos se guardan y se recuperan desde `localStorage`, en claves que llevan la versión del caché (`ropavejero_products_cache_v1_1_2` y `ropavejero_cache_timestamp_v1_1_2`). El texto de cada producto se guarda tal como viene de la hoja, sin escapar.
- **CCH-002** — El caché vence a los 5 minutos. Al leer un caché vencido se eliminan sus claves y se informa que no hay datos.
- **CCH-003** — Un caché incompleto (sin marca de tiempo) o con datos corruptos se trata como inexistente, sin lanzar errores.
- **CCH-004** — Al cargar el módulo se eliminan las claves de versiones anteriores del caché, incluidas las `v1_1_1`, que guardaban el texto ya escapado. Las claves actuales y las preferencias del visitante (tema, idioma) no se tocan.
- **CCH-005** — `clearProductsCache` y `clearAllCache` vacían el caché de productos sin tocar las preferencias del visitante.

## Notas

- Si cambia la forma de los datos de un producto hay que subir la versión de las claves (`CACHE_CONFIG`) y agregar las claves anteriores a `cleanOldCaches()`; `CCH-001` y `CCH-004` fijan los nombres actuales.
