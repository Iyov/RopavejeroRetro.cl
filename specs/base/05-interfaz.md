# 05 · Tema, navegación, FAQ y blog

- **Código:** `js/modules/ui.js` · **Páginas:** `index.html`, `productos.html`
- **Tests:** `tests/js/ui.test.js`

## Requisitos

### Tema claro / oscuro

- **THM-001** — El sitio abre en modo oscuro. Si el visitante había elegido el tema claro, se aplica al cargar y el botón muestra el ícono de sol.
- **THM-002** — El botón de tema alterna entre claro y oscuro, cambia su ícono y recuerda la elección para la próxima visita. Funciona en el inicio y en el catálogo.

### Navegación

- **NAV-001** — La barra de progreso superior refleja el porcentaje de scroll de la página.
- **NAV-002** — En la página de productos (`/productos` o `/productos.html`) el menú marca "Productos" como activo, en escritorio y en móvil.
- **NAV-003** — En el inicio, el menú marca la sección que se está viendo, y cambia 100 px antes de llegar al borde superior de la siguiente.
- **NAV-004** — El botón "volver arriba" aparece al bajar más de 300 px y lleva al inicio de la página con desplazamiento suave. En el inicio, el logo hace lo mismo.
- **NAV-005** — El menú móvil se abre con su botón y se cierra con el botón de cerrar, al elegir un enlace o con la tecla Escape. Mientras está abierto la página de fondo no hace scroll, y `aria-expanded` refleja su estado.
- **NAV-006** — Las funciones de interfaz (`initTheme`, `initLanguage`, `initProgressBar`, `initMobileMenu`, `initFAQ`, `initBlogDialogs`, `initBackToTop`, `initNavActive`) no fallan en una página a la que le falta el elemento que manejan: simplemente no hacen nada. `ui.js` funciona sin los demás módulos.

### Preguntas frecuentes

- **FAQ-001** — La FAQ funciona como acordeón: al abrir una pregunta se cierra la que estaba abierta, y un segundo clic cierra la actual.
- **FAQ-002** — Cada pregunta tiene su respuesta, y ambas son traducibles (`faq-question-N` / `faq-answer-N`).

### Blog

- **BLG-001** — "Leer más" abre el artículo completo (imagen, título, fecha y texto) en el idioma activo y bloquea el scroll del fondo.
- **BLG-002** — El artículo se cierra con su botón o con un clic fuera de él, y devuelve el scroll. Un clic dentro del artículo no lo cierra.
- **BLG-003** — Cada tarjeta del blog tiene su artículo completo en español y en inglés.
