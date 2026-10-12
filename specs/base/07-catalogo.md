# 07 · Catálogo de productos

- **Código:** `js/modules/products.js` · **Página:** `productos.html`
- **Datos:** hoja pública de Google (CSV), con columnas número, producto, plataforma, venta, precio, stock, enlace de Instagram y vendido
- **Tests:** `tests/js/productos.test.js`

## Requisitos

### Carga de datos

- **PRD-004** — El CSV de la hoja se convierte en productos: se omiten la fila de título, la de encabezados, las líneas vacías, las filas con menos de 8 columnas y las que no tienen número. Las comas dentro de comillas se respetan y los saltos de línea de Windows no afectan.
- **PRD-005** — Si hay un caché vigente, el catálogo se muestra sin consultar la hoja.
- **PRD-006** — Sin caché, los productos se piden a la hoja de Google, se muestran y quedan guardados en caché.
- **PRD-007** — Si la hoja falla (error HTTP, sin red, CSV vacío o sin productos) se reintenta hasta 3 veces. Si un reintento funciona, el catálogo se muestra normalmente; si todos fallan se muestra un mensaje de error con botón "Reintentar", en el idioma activo, y no se guarda nada en caché.
- **PRD-030** — El catálogo se inicializa cuando su sección se acerca a la pantalla, o tras una espera si el navegador no puede detectarlo, y nunca dos veces.
- **PRD-031** — El botón "Actualizar" vacía el caché de productos y recarga la página.

### Listado

- **PRD-008** — Cada producto se muestra en la tabla de escritorio y en una tarjeta móvil, con número, nombre, plataforma, precio, stock y estado (disponible `[✅]` o vendido `[❌]`). Un precio sin definir (`X`) se muestra como `0`.
- **PRD-009** — Las siglas del nombre se explican en un tooltip en la tabla y en una lista en la tarjeta móvil. Un producto sin siglas no lleva ninguno de los dos.
- **PRD-010** — El contenido de la hoja no puede inyectar HTML ni atributos en la página: en la tabla, las tarjetas y el modal se muestra siempre como texto.
- **PRD-011** — Los nombres con `&` se muestran tal como están en la hoja (por ejemplo "Ratchet & Clank"). ⚠ PEND-09
- **PRD-012** — Si ningún producto coincide con los filtros se informa en la tabla y en las tarjetas, en el idioma activo; el contador queda en cero y la paginación deshabilitada.

### Búsqueda y filtros

- **PRD-013** — La búsqueda filtra por nombre o plataforma, con coincidencia parcial y sin distinguir mayúsculas, 300 ms después de dejar de escribir.
- **PRD-036** — La búsqueda ignora los espacios al inicio y al final del texto. ⚠ PEND-11
- **PRD-034** — Después de una búsqueda sin resultados se puede corregir el texto y seguir buscando. ⚠ PEND-10
- **PRD-014** — El filtro de plataformas ofrece "Todas" más cada plataforma del catálogo, sin repetir y en orden alfabético.
- **PRD-015** — Se pueden elegir varias plataformas a la vez. "Todas" y las plataformas concretas se excluyen entre sí: elegir una desmarca "Todas", quitarlas todas vuelve a "Todas", y "Todas" no se puede desmarcar si no hay otra elegida.
- **PRD-016** — Las plataformas elegidas se muestran como etiquetas: hasta 3, más un contador con el resto. Cada etiqueta se puede quitar con su `×`.
- **PRD-017** — El desplegable de plataformas se abre y se cierra con su control, y se cierra con un clic fuera. Su buscador interno filtra las opciones, avisa si ninguna coincide y se limpia al cerrar.
- **PRD-018** — Con una búsqueda activa, el desplegable solo ofrece las plataformas que tienen resultados, y avisa si no hay ninguna.
- **PRD-019** — La búsqueda y el filtro de plataformas se combinan: se muestran los productos que cumplen ambos.
- **PRD-020** — La búsqueda se puede combinar con una sola plataforma elegida. ⚠ PEND-08
- **PRD-021** — El selector de orden reordena el catálogo por número, precio, nombre o plataforma. Los productos sin precio quedan al final al ordenar por precio.
- **PRD-022** — "Limpiar" restablece la búsqueda, el orden y las plataformas, y vuelve a mostrar todo el catálogo.
- **PRD-035** — "Limpiar" restablece el catálogo también después de una búsqueda sin resultados. ⚠ PEND-10

### Paginación y contador

- **PRD-023** — El catálogo se pagina de a 25 productos. "Anterior" y "Siguiente" cambian de página, se deshabilitan en los extremos y devuelven la vista al inicio del listado.
- **PRD-026** — El contador informa cuántos productos se muestran y cuántos hay en total, en el idioma activo.

### Filtros en la URL

- **PRD-001** — Los filtros se leen desde la URL (`q`, `sort`, `platform`, `page`). Un valor ausente o inválido usa su valor por defecto: sin búsqueda, orden por número, página 1, todas las plataformas.
- **PRD-002** — Los filtros activos se escriben en la URL sin recargar la página y los valores por defecto se omiten. Solo ocurre en `/productos` y `/productos.html`.
- **PRD-003** — Un enlace con filtros en la URL abre el catálogo ya filtrado. Una plataforma que no existe se ignora.
- **PRD-024** — La página indicada en la URL se respeta, y se ajusta a la última si excede el total.
- **PRD-025** — Al cambiar de página la URL refleja la página actual. ⚠ PEND-07

### Detalle del producto

- **PRD-027** — "Ver detalles" abre un modal con número, nombre, plataforma, precio, stock, estado, las siglas explicadas y el enlace a la publicación de Instagram, en el idioma activo. Si el producto no tiene publicación, enlaza al perfil de la tienda.
- **PRD-028** — El modal se cierra con "Cerrar", con la X, con un clic fuera o con Escape, y devuelve el scroll. Un clic dentro del modal no lo cierra.
- **PRD-029** — El botón de Instagram de cada producto abre su publicación en una pestaña nueva, o el perfil de la tienda si no tiene.

### Idioma

- **PRD-032** — Los textos que el catálogo genera (etiquetas de las tarjetas, botones, siglas, encabezados de la tabla) salen en el idioma activo.
- **PRD-033** — Al cambiar de idioma el catálogo se vuelve a dibujar en el idioma nuevo, sin esperar a otro filtro. ⚠ PEND-07

## Notas

- Al filtrar, el catálogo conserva la página en la que estaba el visitante (ajustada al nuevo total) en lugar de volver a la primera.
- El contador muestra siempre el tamaño de página (25) como cantidad mostrada cuando hay más de 25 resultados, también en la última página.
