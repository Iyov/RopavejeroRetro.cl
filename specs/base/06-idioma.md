# 06 · Idioma español / inglés

- **Código:** `js/modules/ui.js` (`translations`, `setLanguage`, `initLanguage`) · **Páginas:** `index.html`, `productos.html`
- **Tests:** `tests/js/ui.test.js`

Todo texto visible lleva `data-translate="clave"` y la clave existe en el diccionario `translations`, en español y en inglés.

## Requisitos

- **I18N-001** — `setLanguage` reemplaza el contenido de cada elemento con `data-translate` por su traducción; en los campos de texto traduce el placeholder (también con `data-translate-placeholder`) y en los `select`, sus opciones. Una clave que no existe deja el elemento como estaba.
- **I18N-002** — La página se muestra en el idioma guardado por el visitante, y en español si no hay ninguno.
- **I18N-003** — El botón de idioma abre el selector con el idioma actual marcado. Al elegir un idioma se aplica, se guarda y el selector se cierra. Un clic sobre el fondo lo cierra sin cambiar nada.
- **I18N-009** — Al reabrir el selector queda marcado el idioma vigente. ⚠ PEND-18
- **I18N-004** — Al cambiar de idioma se vuelven a cargar las efemérides en el idioma nuevo.
- **I18N-005** — Toda clave del diccionario existe en español y en inglés. ⚠ PEND-06
- **I18N-006** — Toda clave `data-translate` usada en `index.html` y `productos.html` existe en el diccionario en español.
- **I18N-007** — Toda clave `data-translate` usada en `index.html` y `productos.html` tiene versión en inglés. ⚠ PEND-06
- **I18N-008** — El texto inicial que trae cada HTML coincide con su traducción al español, de modo que lo que leen los buscadores es lo mismo que ve el visitante. ⚠ PEND-16

## Notas

- Los textos del catálogo que se generan desde JavaScript están en [07-catalogo.md](07-catalogo.md) (`PRD-032`, `PRD-033`).
- `404.html` y las páginas de seguridad tienen atributos `data-translate` pero no cargan `ui.js`, así que ahí no tienen efecto (ver `SITE-006`).
