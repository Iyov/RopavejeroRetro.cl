# 04 · Siglas de productos

- **Código:** `js/modules/siglas.js` · **Datos:** `js/siglas.json`
- **Tests:** `tests/js/cache-logger-siglas.test.js`

Los nombres de producto llevan siglas del estado del artículo, como `(BL-CIB)`. El sitio las detecta y explica su significado.

## Requisitos

- **SIG-001** — `loadSiglas` carga `js/siglas.json` con la versión de caché en la URL y deja las siglas disponibles. Si el archivo no carga devuelve un objeto vacío, registra el error y el sitio sigue funcionando sin siglas.
- **SIG-002** — `extractSiglas` reconoce una sigla cuando aparece entre paréntesis, entre corchetes, unida por guiones o como palabra suelta, sin distinguir mayúsculas y sin repetirla. Una sigla dentro de otra palabra no cuenta. Si no recibe un texto devuelve una lista vacía.
- **SIG-003** — La descripción de cada sigla sale en el idioma activo; si no tiene traducción se usa la descripción en español.
- **SIG-004** — `CIB+` se detecta como `CIB+` y no como `CIB`.
- **SIG-005** — `createSiglasTooltip` genera el tooltip con una fila por sigla, y nada si no hay siglas.
- **SIG-006** — Cada sigla de `js/siglas.json` tiene descripción en español y en inglés.
