# Catálogo: redibujar al cambiar de idioma, página en la URL y robustez

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Arreglo
- **Pendientes relacionados:** PEND-07 y las observaciones 1, 2 y 4 del catálogo de `MEMORY.md` (acordado con Francisco el 2026-10-12)

## Problema

- Al cambiar de idioma en el catálogo, las tarjetas, el contador y el filtro de plataformas quedan en el idioma anterior hasta el siguiente filtro; y al pasar de página la URL no refleja la página (PEND-07). La causa común es que `setLanguage()` consulta `window.productsData`, que nunca se define.
- Una plataforma cuyo nombre lleve comillas dobles o barra invertida rompería el filtro, porque la casilla se busca con un selector CSS armado con el nombre (observación 1).
- Un caché de productos dañado en `localStorage` deja el catálogo en blanco hasta que vence (observación 2).
- Una plataforma con `%` o con coma en el nombre no sobrevive al ir y volver por la URL (observación 4).

## Resultado esperado

El catálogo se ve completo en el idioma recién elegido, un enlace copiado desde cualquier página del listado abre esa misma página, y nombres de plataforma inusuales o un caché dañado no dejan el catálogo inservible.

## Requisitos

### Modificados

Dejan de estar pendientes (se quita `⚠ PEND-07`; el texto no cambia):

- **PRD-025** — Al cambiar de página la URL refleja la página actual.
- **PRD-033** — Al cambiar de idioma el catálogo se vuelve a dibujar en el idioma nuevo, sin esperar a otro filtro.

Cambia de texto:

- **PRD-005** — Si hay un caché vigente y válido, el catálogo se muestra sin consultar la hoja. *(Se agrega "y válido".)*

### Nuevos

- **PRD-038** — El filtro de plataformas funciona con cualquier nombre de plataforma, incluidos los que llevan comillas dobles, comillas simples, barra invertida o corchetes: se puede marcar, quitar con su etiqueta y abrir desde un enlace.
- **PRD-039** — Un caché de productos dañado no deja el catálogo en blanco: si lo guardado no es una lista de productos se descarta y se consulta la hoja; los elementos que no son un producto válido se ignoran. No se produce ningún error de JavaScript.
- **PRD-040** — Una plataforma con `%` o con coma en el nombre se conserva al escribirse en la URL y al abrir ese enlace. Los enlaces actuales siguen funcionando y la URL de las plataformas sin esos caracteres no cambia de forma (`?platform=PS1,SNES`).

## Fuera de alcance

- Las observaciones 3 (comillas dobles que el CSV pierde) y 5 (primer pedido a la hoja lento).
- Volver a la página 1 al filtrar: se mantiene el comportamiento actual.
- Cualquier cambio visual.

## Archivos que se tocan

- `js/modules/products.js` — URL al paginar, selectores de plataforma, lectura del caché, codificación de `platform`.
- `js/modules/ui.js` — solo `setLanguage()` / `initLanguage()`, para el redibujado del catálogo.

Ninguno pasa por minificación. Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Tests automáticos en `tests/js/productos.test.js`: `PRD-025` y `PRD-033` sin `todo`, y los nuevos `PRD-038`, `PRD-039`, `PRD-040`; `PRD-005` ajustado.
- `npm test` completo.
- En el navegador (`productos.html`): cambiar de idioma con el catálogo cargado; pasar a la página 2 y recargar.

## Decisiones

- **Cuidado con la recursión.** `renderProductsTable()` termina llamando a `setLanguage()`. El redibujado al cambiar de idioma no puede hacerse llamando a `renderProductsTable()` desde `setLanguage()` sin más, porque se llamarían mutuamente. El redibujado corresponde al momento en que el visitante elige un idioma.
- **Qué se redibuja al cambiar de idioma:** tabla, tarjetas móviles, contador y el texto "Todas" del filtro de plataformas. El modal abierto no se redibuja.
- **Codificación de `platform` en la URL.** Solo se codifican los caracteres que chocan con el formato (`%` y `,`), para no cambiar la forma de las URL que ya circulan. Un valor que no se puede decodificar se toma tal cual.
