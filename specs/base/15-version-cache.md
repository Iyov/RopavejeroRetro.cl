# 15 · Versión de caché

- **Código:** `api/bump_version.py`
- **Tests:** `tests/test_bump_version.py`

El sitio tiene una sola versión de caché, `AAAA-MM-DD_N`, que aparece en todos los `?v=` y en `CACHE_VERSION` del service worker.

## Requisitos

### Cálculo de la versión

- **VER-001** — El mismo día, el correlativo sube en uno (`_1` → `_2`).
- **VER-002** — Un día nuevo parte en `_1`.
- **VER-003** — Una versión de otro esquema, inválida o inexistente se reemplaza por la de hoy con `_1`.
- **VER-004** — La versión nunca retrocede, aunque la fecha local sea anterior a la de la versión actual.
- **VER-010** — La fecha del esquema es `AAAA-MM-DD`, tomada en hora de Chile.

### Aplicación

- **VER-005** — El bump escribe la versión nueva en todos los `?v=` locales y en `CACHE_VERSION`, sin tocar los `?v=` de URLs externas. Varios bumps seguidos dejan siempre una sola versión.
- **VER-006** — El bump no altera los saltos de línea ni el resto del contenido de los archivos.
- **VER-009** — Todo archivo servido que contiene un `?v=` versionado está en la lista de archivos que recorre el script.

### Verificación

- **VER-007** — La verificación detecta: versiones distintas a la actual, referencias locales sin `?v=` (en `<script>`/`<link>`, en `fetch()` de JSON y en el registro del service worker) y un `CACHE_VERSION` fuera del esquema. Las URLs externas, las anclas y las imágenes no se reportan.
- **VER-008** — El sitio real usa una sola versión de caché y ningún asset local queda sin `?v=`.

### Control de que la versión se suba

- **VER-013** — Cuentan como archivos del sitio los que se sirven a los visitantes: los HTML de la raíz, los CSS, los JS y JSON de `js/`, `manifest.json` y `service-worker.js`. La documentación, los tests, las especificaciones, los scripts de `api/` y las imágenes no cuentan.
- **VER-014** — Modificar un archivo del sitio sin subir la versión se reporta como problema. Un cambio que sube la versión, o que no toca archivos del sitio, se acepta.
- **VER-015** — Antes de commitear (`--verify-staged`) se detecta si lo preparado para el commit modifica el sitio sin subir la versión.
- **VER-016** — Antes de desplegar (`--verify <base> <head>`) se detecta lo mismo entre dos commits. Si el commit base no se puede leer, la verificación se omite en vez de bloquear el despliegue.
- **VER-017** — El hook `.githooks/pre-commit` y el workflow de despliegue ejecutan estas verificaciones; en el despliegue, antes de publicar.

### Línea de comandos

- **VER-011** — Sin argumentos sube la versión e informa el cambio; `--show` muestra la versión actual; `--check` termina en 0 si todo es consistente y en 1, listando los problemas, si no.
- **VER-012** — `npm run bump` y `npm run check:version` invocan al script.
