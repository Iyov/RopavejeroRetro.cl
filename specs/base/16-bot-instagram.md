# 16 · Bot de Instagram

- **Código:** `api/update_instagram.py`, `.github/workflows/update_instagram.yml`
- **Tests:** `tests/test_update_instagram.py` (sin red: la Graph API y las descargas se simulan)

Cada 12 horas el bot trae los posts de Instagram marcados con `#RopavejeroRetroWeb` y regenera los archivos que el sitio muestra.

## Requisitos

### Lectura desde Instagram

- **BOT-001** — Un error de la API se clasifica: `OAuthException` con código 190, o un mensaje que menciona el token, es un token expirado o inválido; cualquier otro es un error genérico.
- **BOT-002** — Los posts se piden a la Graph API siguiendo la paginación hasta el final, sin superar el máximo de posts configurado.
- **BOT-003** — Ante un error de la API, en cualquier página, el bot se detiene sin tocar ningún archivo, avisa si el problema es el token y termina con error, para que la ejecución del workflow quede fallida.
- **BOT-016** — Si falta `INSTAGRAM_TOKEN`, el bot avisa y termina con error, sin tocar ningún archivo.

### Selección de posts

- **BOT-004** — Solo se publican los posts cuyo texto lleva `#RopavejeroRetroWeb`, sin distinguir mayúsculas.
- **BOT-005** — La primera línea del texto es el título y el resto la descripción; el hashtag se quita. Cada post lleva id, imagen local, enlace, tipo, fecha y likes (0 si Instagram no los informa).
- **BOT-006** — Los videos se omiten. De un carrusel se usa la primera imagen, y se omite si no tiene ninguna.

### Imágenes

- **BOT-007** — Cada imagen se guarda como JPEG y en variantes WebP de 400, 800 y 1200 px de ancho, conservando la proporción y sin agrandar las más pequeñas. Si ya existen no se vuelve a descargar, y una descarga fallida no deja archivos a medias.
- **BOT-008** — Al desaparecer un post se borran sus cuatro imágenes, y solo las suyas.

### Publicación

- **BOT-009** — Hay cambios si se agregan, quitan o modifican posts (título, descripción, imagen, enlace o likes); el orden no importa. Se cuentan por separado los agregados, modificados y eliminados.
- **BOT-010** — Si no llega ningún post con el hashtag no se toca ningún archivo.
- **BOT-011** — Con cambios se regeneran `js/instagram_posts.js` y `.min.js`, la lista de imágenes del precache en `service-worker.js` (sin alterar el resto del archivo), la versión de caché de todo el sitio y el mensaje de commit.
- **BOT-012** — Si los posts no cambiaron no se reescribe ningún archivo ni se sube la versión.
- **BOT-013** — El mensaje de commit resume cuántos posts se agregaron, modificaron y eliminaron.
- **BOT-014** — Los posts ya publicados se leen desde `js/instagram_posts.js`; si el archivo falta o está dañado se asume que no hay ninguno. El archivo real es legible por el bot.
- **BOT-015** — `service-worker.js` conserva la forma exacta de las líneas `const CACHE_VERSION = '...';` y `const INSTAGRAM_IMAGES = [ ... ];`, que los scripts reescriben.

## Notas

- El despliegue que el bot dispara después de pushear está en `SITE-015`.
- El hashtag se quita del texto solo si viene escrito exactamente `#RopavejeroRetroWeb` o todo en minúsculas. Con otra combinación (por ejemplo `#ROPAVEJERORETROWEB`) el post se publica igual, pero el hashtag queda visible.
