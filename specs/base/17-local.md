# 17 · Local físico (@DoubleImpactStore)

- **Código:** sección `#local` de `index.html`, aviso `#storeNotice` de `productos.html`, `initStoreStatus()` en `js/modules/ui.js`, estilos `.store-*` en `css/index.css`
- **Tests:** `tests/js/local.test.js`

El sitio anuncia el local físico que @Ropavejero.Retro comparte con @NekketsuStore en el Persa Bio Bio.

## Requisitos

### Sección del inicio

- **LOC-001** — El inicio tiene una sección "Visítanos" (`id="local"`), ubicada después del encabezado principal y antes de Instagram, con un título `h2` y una tarjeta que presenta el local @DoubleImpactStore: una descripción breve, la dirección, el metro más cercano y el horario, cada dato con su ícono.
- **LOC-002** — El menú del inicio y el del catálogo, en escritorio y en móvil, tienen un ítem "Local" que lleva a esa sección (`#local` en el inicio, `/#local` en el catálogo), ubicado antes de "Instagram", el primero del menú. En el inicio el ítem se marca como activo al ver la sección.
- **LOC-003** — La tarjeta tiene un botón "Cómo llegar", que abre en otra pestaña el Perfil de Empresa del local en Google Maps (`https://www.google.com/maps?cid=2529777286738516949`), y un botón al sitio del local (`https://doubleimpactstore.cl/`). Ambos llevan `rel="noopener noreferrer"`.
- **LOC-004** — La tarjeta muestra una señal de estado según el día en hora de Chile (`America/Santiago`), sin depender de la zona horaria del visitante: sábado y domingo dice "Abierto hoy" con el horario; de lunes a viernes dice cuándo abre ("Abre sábados, domingos y festivos") y nunca "cerrado". El texto sale en el idioma activo y se actualiza al cambiar de idioma.
- **LOC-009** — La sección conserva los datos estructurados del local (microdatos `LocalBusiness` con nombre y dirección) y no carga ningún recurso de otro dominio: sin `iframe`, sin imágenes ni scripts externos.

### Otras páginas

- **LOC-005** — El catálogo muestra un aviso compacto del local: el nombre, la dirección resumida y el horario, y un enlace "Ver cómo llegar" a `/#local`. No repite la tarjeta completa.
- **LOC-006** — `404.html` y las dos páginas de seguridad no muestran el anuncio del local.

### Texto y estilo

- **LOC-007** — Todo el texto de la sección y del aviso existe en español y en inglés, y el texto inicial del HTML coincide con el diccionario en español. El diccionario no conserva claves del anuncio anterior.
- **LOC-008** — La sección y el aviso tienen estilo propio: toda clase CSS usada en su marcado tiene reglas en `css/index.css`, y esas reglas toman sus colores de las variables del sitio, de modo que se ven bien en tema oscuro y claro.

## Notas

- La señal de estado no conoce los festivos: por eso entre semana no dice "cerrado". El texto inicial del HTML es el neutro, cierto cualquier día aunque no corra JavaScript.
- Los botones llevan su ícono por CSS (`::before`), porque `setLanguage()` reemplaza el contenido de todo elemento con `data-translate` y borraría un `<i>` interno.
- La tarjeta no lleva foto ni mapa incrustado, por decisión de diseño; está armada para sumar una foto sin rehacerla.
