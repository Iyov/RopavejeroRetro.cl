# Arreglos del catálogo: búsqueda, filtro de plataformas y nombres con "&"

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Arreglo
- **Pendientes relacionados:** PEND-08, PEND-09, PEND-10 y PEND-11 (acordado con Francisco el 2026-10-12)

## Problema

Cuatro defectos del catálogo de productos que afectan a quien busca un juego:

- Después de una búsqueda sin resultados el catálogo queda bloqueado: corregir el texto no actualiza la tabla y "Limpiar" no hace nada (PEND-10).
- Con texto en el buscador y una sola plataforma elegida, la plataforma se descarta (PEND-08).
- Los nombres con `&` se muestran como `&amp;` en la tabla y las tarjetas, y como `&amp;amp;` en el modal (PEND-09).
- Un espacio al inicio o al final de la búsqueda cuenta como texto y hace que no se encuentre nada (PEND-11).

## Resultado esperado

El visitante puede buscar, equivocarse, corregir y limpiar sin que el catálogo se bloquee; puede combinar la búsqueda con una plataforma; y ve los nombres de los productos tal como están en la hoja.

## Requisitos

### Modificados

Dejan de estar pendientes (se quita `⚠ PEND-NN`; el texto no cambia):

- **PRD-011** — Los nombres con `&` se muestran tal como están en la hoja.
- **PRD-020** — La búsqueda se puede combinar con una sola plataforma elegida.
- **PRD-034** — Después de una búsqueda sin resultados se puede corregir el texto y seguir buscando.
- **PRD-035** — "Limpiar" restablece el catálogo también después de una búsqueda sin resultados.
- **PRD-036** — La búsqueda ignora los espacios al inicio y al final del texto.

Cambian de texto:

- **PRD-010** — El contenido de la hoja no puede inyectar HTML ni atributos en la página: en la tabla, las tarjetas y el modal se muestra siempre como texto, escapado una sola vez. *(Antes no decía "una sola vez".)*
- **PRD-013** — La búsqueda filtra por nombre o plataforma, con coincidencia parcial y sin distinguir mayúsculas, 300 ms después de dejar de escribir. Busca sobre el texto tal como está en la hoja, de modo que `&` encuentra los nombres que lo llevan. *(Se agrega la segunda frase.)*
- **CCH-001** y **CCH-004** — Si la solución cambia la forma en que se guardan los productos en caché, las claves pasan a `v1_1_2` y las `v1_1_1` se agregan a las que se limpian al cargar, como indica `CLAUDE.md`.

### Nuevos

- **UTL-009** — `sanitizeAttribute` escapa también las comillas, para los valores que van dentro de atributos HTML.
- **UTL-010** — `normalizeProductData` normaliza un producto sin escapar su texto; `validateProductData` (UTL-003) pasa a ser esa normalización más el escape.
- **PRD-037** — El aviso "No hay plataformas para esta búsqueda" no es una opción del filtro: no se puede marcar, no cuenta como plataforma y desaparece cuando la búsqueda vuelve a tener resultados.

## Fuera de alcance

- PEND-07 (redibujar al cambiar de idioma y página en la URL) y los demás pendientes.
- Cualquier cambio visual del catálogo.
- Reiniciar la página a 1 al filtrar: se mantiene el comportamiento actual.

## Archivos que se tocan

- `js/modules/products.js` — los cuatro arreglos.
- `js/modules/utils.js` — solo si hace falta separar "normalizar" de "sanitizar" un producto.
- `js/modules/cache.js` — solo si cambia la forma de los datos en caché.

Ninguno pasa por minificación. Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Tests automáticos: `tests/js/productos.test.js` (`PRD-010`, `011`, `013`, `020`, `034`, `035`, `036`, `037`), sin la marca `todo`; y `tests/js/cache-logger-siglas.test.js` si cambian las claves del caché.
- `npm test` completo sin fallos nuevos.
- En el navegador (`productos.html`): buscar "zzzz", corregir a "zelda", pulsar "Limpiar"; elegir una plataforma y buscar; abrir el detalle de un producto con `&`.

## Decisiones

- **Doble escape (PEND-09).** Hoy el producto se sanitiza al leer la hoja y otra vez en cada dibujo. La opción elegida: guardar el texto tal como viene (normalizado, sin escapar) y escaparlo una sola vez al insertarlo como HTML; el modal, que usa `textContent`, recibe el texto sin escapar. Se descartó dejar de sanitizar al dibujar, porque el modal y la búsqueda seguirían viendo `&amp;`. Como cambia lo que se guarda en `localStorage`, se sube la versión de las claves del caché.
