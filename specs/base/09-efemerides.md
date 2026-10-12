# 09 · Efemérides del día

- **Código:** `js/modules/efemerides.js` · **Datos:** `js/efemerides.json` · **Página:** `index.html`
- **Tests:** `tests/js/instagram-efemerides.test.js`

## Requisitos

- **EFE-001** — Se muestra la fecha de hoy escrita en el idioma activo.
- **EFE-002** — Se muestra la efeméride que corresponde al día de hoy (título, texto y detalle) en el idioma activo. El archivo se pide con la versión de caché en la URL y su contenido se muestra como texto plano.
- **EFE-003** — Si no hay efeméride para hoy se muestra un mensaje por defecto, en el idioma activo.
- **EFE-004** — Si las efemérides no cargan o vienen mal formadas se muestra un mensaje de error genérico, en el idioma activo.
- **EFE-005** — En las páginas sin sección de efemérides no se descarga el archivo.
- **EFE-006** — `js/efemerides.json` cubre los 366 días del año, con fechas `MM/DD` válidas y sin repetir.
- **EFE-007** — Cada efeméride tiene título, texto y detalle en español y en inglés.
- **EFE-008** — Con el archivo real, la efeméride del día se muestra en español y en inglés.
