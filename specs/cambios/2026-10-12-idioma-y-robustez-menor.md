# Selector de idioma, textos del HTML y robustez menor del catálogo y el service worker

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Arreglo
- **Pendientes relacionados:** PEND-16, PEND-18 y cinco observaciones sin test de `MEMORY.md` (acordado con Francisco el 2026-10-12)

## Problema

- Al reabrir el selector de idioma después de cambiarlo, queda marcado el idioma con que cargó la página (PEND-18).
- El texto que trae el HTML no coincide con el diccionario en español en 8 claves de `index.html` y 4 de `productos.html`: los buscadores leen un texto y el visitante ve otro (PEND-16).
- El texto de ayuda del buscador del catálogo queda en español con el sitio en inglés (observación A).
- Si la hoja no cargó, el aviso de error no se traduce al cambiar de idioma (observación B).
- Si el almacenamiento de caché del navegador falla, el service worker deja sin cargar las páginas que intercepta (observación C).
- Una plataforma con espacios al inicio o al final, leída del caché, no filtra sus productos (observación D).
- Dos plataformas cuyo nombre solo difiere en mayúsculas o espacios ("Xbox 360" y "xbox-360") recibirían el mismo `id` de casilla (observación E).

## Resultado esperado

El selector de idioma muestra siempre el idioma vigente, el HTML dice lo mismo que ve el visitante, el catálogo en inglés no tiene textos sueltos en español, y ni un caché defectuoso ni nombres de plataforma parecidos dejan algo sin funcionar.

## Requisitos

### Modificados

Dejan de estar pendientes (se quita `⚠ PEND-NN`; el texto no cambia):

- **I18N-008** — El texto inicial que trae cada HTML coincide con su traducción al español.
- **I18N-009** — Al reabrir el selector queda marcado el idioma vigente.

### Nuevos

- **PRD-041** — El texto de ayuda de los buscadores del catálogo (productos y plataformas) sale en el idioma activo.
- **PRD-042** — Si los productos no cargaron, el aviso de error y su botón "Reintentar" pasan al idioma nuevo cuando el visitante cambia de idioma.
- **PRD-043** — Una plataforma cuyo nombre trae espacios al inicio o al final se trata como la misma plataforma sin ellos: aparece una sola vez en el filtro y al marcarla se muestran sus productos.
- **PRD-044** — Cada casilla del filtro de plataformas tiene un `id` único y su etiqueta apunta a ella, aunque dos plataformas tengan nombres que solo difieren en mayúsculas, espacios o guiones.
- **SW-013** — Si el almacenamiento de caché del navegador no está disponible, el service worker responde igual desde la red, en sus tres estrategias, sin dejar la petición sin respuesta.

## Fuera de alcance

- El rediseño del anuncio del local. Sus cuatro textos solo se igualan al diccionario.
- Traducir los `aria-label` y demás atributos de accesibilidad del catálogo.
- Las observaciones F (comillas dobles que el CSV pierde) y G (primer pedido a la hoja lento).

## Archivos que se tocan

- `index.html`, `productos.html` — textos iniciales iguales al diccionario; `data-translate-placeholder` en los dos buscadores.
- `js/modules/ui.js` — selector de idioma; clave nueva `filter-search-placeholder` en español e inglés.
- `js/modules/products.js` — aviso de error traducible, plataformas con espacios, `id` de casillas.
- `service-worker.js` — estrategias tolerantes a un caché no disponible.

Ninguno pasa por minificación. Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Tests automáticos: `tests/js/ui.test.js` (`I18N-008`, `I18N-009` sin `todo`), `tests/js/productos.test.js` (`PRD-041` a `PRD-044`), `tests/js/service-worker.test.js` (`SW-013`).
- `npm test` completo.
- En el navegador: cambiar de idioma y reabrir el selector; el catálogo en inglés (texto de ayuda del buscador).

## Decisiones

- **PEND-16: gana el diccionario en las 12 claves.** Es el texto que el visitante ya ve, porque el JavaScript reemplaza el del HTML al cargar, y es la versión más reciente (menciona los servicios y el local). Así el sitio no cambia a la vista: solo se alinea el HTML. Consecuencia: los emojis del anuncio del local que estaban en el HTML (📍 en `productos.html`, ➡ y 🕒) desaparecen del HTML; el visitante ya no los veía después de la carga. Si se quieren, se agregan al diccionario en el rediseño del anuncio.
- **Observación D: se recorta al normalizar.** `normalizeProductData()` entrega la plataforma sin espacios sobrantes, igual que ya hace el lector del CSV; así todo el catálogo compara el mismo valor.
- **Observación E: `id` por posición.** Las casillas pasan a llamarse `platform-option-N`. El `id` anterior, derivado del nombre, no lo usa ningún CSS ni otro script.
