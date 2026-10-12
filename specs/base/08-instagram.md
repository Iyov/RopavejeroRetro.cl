# 08 · Posts de Instagram en el sitio

- **Código:** `js/modules/instagram.js`, cargador inline al final de `index.html`
- **Datos:** `js/instagram_posts.js` / `.min.js` (los genera el bot, ver [16-bot-instagram.md](16-bot-instagram.md)) y `js/console_aliases.json`
- **Tests:** `tests/js/instagram-efemerides.test.js`

## Requisitos

### Carga

- **IGF-011** — `index.html` descarga los posts de forma diferida, cuando la sección de Instagram se acerca a la pantalla, una sola vez y con la versión de caché en la URL. Al terminar la descarga los dibuja.
- **IGF-009** — Si el archivo de posts no llegó a cargar se muestra un post de respaldo que enlaza al perfil de la tienda.
- **IGF-008** — Si no hay posts se muestra un aviso con enlace al perfil de Instagram, en el idioma activo.
- **IGF-012** — Los datos publicados tienen la forma que espera el sitio (id, título, descripción, enlace a Instagram, fecha, tipo y likes), el archivo `.min` contiene los mismos posts, y existen las cuatro imágenes de cada uno (JPEG y WebP de 400, 800 y 1200).

### Tarjetas

- **IGF-005** — Cada post se muestra como tarjeta con imagen responsive (WebP de 400, 800 y 1200 con el JPEG de respaldo), título, descripción, fecha relativa, likes y enlace a la publicación en una pestaña nueva.
- **IGF-006** — El título y la descripción se muestran como texto, sin interpretarse como HTML. Una imagen o enlace de un dominio no permitido se descarta, y un post sin imagen usa el logo de la tienda.
- **IGF-010** — La fecha de un post se muestra en forma relativa ("Hoy", "Hace 3 días", "Hace 2 semanas", "Mañana") y, pasados 30 días, como fecha completa; siempre en el idioma activo.
- **IGF-013** — `getInstagramLink` devuelve el enlace sanitizado de un post, o el perfil de la tienda si no hay enlace.

### Filtro por consola

- **IGF-001** — Las consolas del filtro se cargan desde `js/console_aliases.json`, con la versión de caché en la URL.
- **IGF-002** — Si `console_aliases.json` no carga se usa una lista de consolas de respaldo y los posts se muestran igual.
- **IGF-003** — Se crea un botón de filtro por consola además de "Todas", sin duplicarlos si se reconstruyen.
- **IGF-004** — La consola de un post se detecta por sus alias en el título o la descripción, sin distinguir mayúsculas.
- **IGF-007** — Los botones de consola filtran los posts y marcan el botón activo. Si una consola no tiene posts se avisa en el idioma activo, y "Todas" vuelve a mostrarlos todos.
