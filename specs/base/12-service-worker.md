# 12 · Service worker

- **Código:** `service-worker.js`, registro inline en `index.html` y `productos.html`
- **Tests:** `tests/js/service-worker.test.js`

## Requisitos

### Ciclo de vida

- **SW-001** — Los cachés se nombran con la versión de caché del sitio: `ropavejero-vAAAA-MM-DD_N-static` y `-data`.
- **SW-002** — Al instalarse precachea los recursos estáticos y las imágenes de Instagram, y se activa de inmediato. Si alguna imagen de Instagram no se puede guardar, la instalación termina igual.
- **SW-003** — Al activarse borra los cachés de versiones anteriores del sitio, sin tocar cachés ajenos, y toma el control de las pestañas abiertas.
- **SW-008** — Atiende los mensajes `SKIP_WAITING` (activar ya) y `CLEAR_CACHE` (borrar todos los cachés).
- **SW-012** — El inicio y el catálogo registran el service worker con la versión de caché en la URL y alcance de todo el sitio, al terminar de cargar la página. En un navegador sin service workers no pasa nada.

### Estrategias de caché

- **SW-004** — No intercepta las peticiones que no son GET, ni las de la hoja de productos, analítica o extensiones del navegador.
- **SW-005** — El inicio (`/`, `/index.html`), los CSS, los JS, las fuentes y el manifest se sirven desde el caché y solo van a la red si faltan; lo descargado queda guardado. Una URL con un `?v=` nuevo es un recurso distinto y se descarga. Sin caché y sin red responde 503, y una respuesta de error no se guarda.
- **SW-006** — Las demás páginas (catálogo, seguridad) y los JSON van primero a la red, de modo que siempre llega la versión nueva, y usan la última copia guardada solo sin conexión.
- **SW-007** — Las imágenes se responden desde el caché y se actualizan en segundo plano para la próxima vez. Sin conexión, una imagen guardada se sigue mostrando.
- **SW-013** — Si el almacenamiento de caché del navegador no está disponible, el service worker responde igual desde la red, en sus tres estrategias; sin caché y sin conexión responde 503 en vez de dejar la petición sin respuesta. Un fallo al guardar una copia no afecta a la respuesta.

### Precache

- **SW-009** — Todo lo que se precachea existe en el repositorio y no hay entradas duplicadas. Un archivo faltante haría fallar el precache completo.
- **SW-010** — Los módulos de `js/modules/` y `js/index.min.js` que cargan las páginas están en el precache, junto con las páginas principales, el CSS y el manifest.
- **SW-011** — La lista de imágenes de Instagram del precache corresponde exactamente a los posts publicados, cuatro archivos por post.

## Notas

- `js/seo-analytics.js`, `js/siglas.json` y `js/efemerides.json` no están en el precache: quedan guardados recién después de la primera visita con conexión.
