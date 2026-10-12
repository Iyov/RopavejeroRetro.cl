# Rediseño del anuncio del local del Persa Bio Bio

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Funcionalidad nueva (rediseño visual)
- **Tamaño:** grande (rediseño, sección nueva): tests a cargo del agente `tester`, implementación a cargo del agente `frontend`

## Problema

El sitio debe comunicar que hay un local físico, @DoubleImpactStore, en el Persa Bio Bio. Hoy lo hace con un bloque de texto sin ningún estilo propio (`.store-announcement` no tiene reglas en el CSS), pegado bajo los íconos de contacto al final del inicio, y repetido igual de suelto en el catálogo, la 404 y las dos páginas de seguridad. A Francisco no le gustó cómo quedó.

## Resultado esperado

Quien entra al inicio encuentra pronto una sección clara, "Visítanos", con el local presentado como una tarjeta: dónde está, cómo llegar y cuándo abre, con un botón para abrir la ruta. El catálogo lo recuerda en una línea. Se ve bien en ambos temas y en el teléfono.

## Decisiones de diseño tomadas con Francisco (2026-10-12)

1. **Ubicación:** sección propia en el inicio, arriba, con su ítem "Local" en el menú. Al implementarla se ubicó inmediatamente después del encabezado principal y antes de Instagram: la sección de Instagram muestra todos los posts (190 hoy, unos 50.000 px de alto) y ponerla después habría dejado el local al final de la página.
2. **Contenido visual:** solo íconos y botones. Sin foto y sin mapa incrustado: nada de terceros, sin tocar la CSP.
3. **Páginas:** completo en el inicio y una versión compacta en el catálogo. Se quita de `404.html` y de las dos páginas de seguridad.

## Requisitos

Área nueva, prefijo `LOC` (`specs/base/17-local.md`).

### Nuevos

- **LOC-001** — El inicio tiene una sección "Visítanos" (`id="local"`), ubicada después del encabezado principal y antes de Instagram, con un título `h2` y una tarjeta que presenta el local @DoubleImpactStore: una descripción breve, la dirección, el metro más cercano y el horario, cada dato con su ícono.
- **LOC-002** — El menú del inicio y el del catálogo, en escritorio y en móvil, tienen un ítem "Local" que lleva a esa sección (`#local` en el inicio, `/#local` en el catálogo), ubicado antes de "Instagram", el primero del menú. En el inicio el ítem se marca como activo al ver la sección.
- **LOC-003** — La tarjeta tiene un botón "Cómo llegar", que abre en otra pestaña la búsqueda de la dirección del local en Google Maps, y un botón al sitio del local (`https://doubleimpactstore.cl/`). Ambos llevan `rel="noopener noreferrer"`.
- **LOC-004** — La tarjeta muestra una señal de estado según el día en hora de Chile (`America/Santiago`), sin depender de la zona horaria del visitante: sábado y domingo dice "Abierto hoy" con el horario; de lunes a viernes dice cuándo abre ("Abre sábados, domingos y festivos"). El texto sale en el idioma activo y se actualiza al cambiar de idioma.
- **LOC-005** — El catálogo muestra un aviso compacto del local: una línea con el nombre, la dirección resumida y el horario, y un enlace "Ver cómo llegar" a `/#local`. No repite la tarjeta completa.
- **LOC-006** — `404.html` y las dos páginas de seguridad no muestran el anuncio del local.
- **LOC-007** — Todo el texto de la sección y del aviso existe en español y en inglés, y el texto inicial del HTML coincide con el diccionario en español.
- **LOC-008** — La sección y el aviso tienen estilo propio: toda clase CSS usada en su marcado tiene reglas en `css/index.css`, usa las variables de color del sitio (se ve bien en tema oscuro y claro) y `css/index.min.css` está regenerado.
- **LOC-009** — La sección conserva los datos estructurados del local (microdatos `LocalBusiness` con nombre y dirección) y no carga ningún recurso de otro dominio: sin `iframe`, sin imágenes ni scripts externos.

### Modificados

- **SITE-018** — sigue vigente: la sección nueva usa `h2`, no `h1`.
- **I18N-008** — sigue vigente y cubre los textos nuevos.

### Eliminados

Ninguno. Las claves `store-announcement-*` del diccionario que dejen de usarse se eliminan de `translations`.

## Diseño

Referencia de composición en escritorio; en pantallas angostas las dos columnas se apilan (primero el nombre y el estado, después los datos y los botones):

```
+----------------------------------------------------------+
|               VISÍTANOS EN EL PERSA BIO BIO              |
|      Ahora también puedes ver los productos en persona   |
|                                                          |
|  +----------------------------------------------------+  |
|  |  [ícono tienda]               [pin]   Bio Bio 654, |  |
|  |  @DoubleImpactStore                   Local 58 ... |  |
|  |  Ropavejero.Retro +           [metro] Metro Bio    |  |
|  |  NekketsuStore                        Bio L6       |  |
|  |                               [reloj] Sáb, dom y   |  |
|  |  ( ABIERTO HOY · 11 a 18 )            festivos ... |  |
|  |                                                    |  |
|  |  [ Cómo llegar ]   [ Sitio del local ]             |  |
|  +----------------------------------------------------+  |
+----------------------------------------------------------+
```

- Tarjeta con el mismo lenguaje visual de las demás del sitio (fondo `--card-bg`, borde `--border-color`, radios y sombras existentes), con un acento en `--primary-color` que la distinga como destacada.
- Íconos de Font Awesome, que el sitio ya carga. Sin emojis en el texto.
- La señal de estado es una píldora: verde cuando está abierto hoy, neutra cuando no.
- Botón principal "Cómo llegar" (`.btn-primary`) y secundario "Sitio del local" (`.btn-secondary`).
- Aviso del catálogo: una franja de una línea (se parte en dos en el teléfono), discreta, encima del pie de página, en el mismo lugar que hoy.

## Fuera de alcance

- Foto del local y mapa incrustado (decisión 2). La tarjeta debe permitir sumar una foto más adelante sin rehacerla.
- Los textos que mencionan el local en el encabezado principal, "Sobre Nosotros" y la FAQ: no cambian.
- El horario de festivos: la señal de estado no sabe qué días son festivos; por eso de lunes a viernes no dice "cerrado".
- `ps3.html` y `old.html`.

## Archivos que se tocan

- `index.html` — sección nueva, ítem de menú (escritorio y móvil), y se quita el bloque actual de la sección de contacto.
- `productos.html` — aviso compacto en vez del bloque actual; ítem de menú.
- `404.html`, `security-policy.html`, `security-acknowledgments.html` — se quita el bloque.
- `css/index.css` → `css/index.min.css` (`npm run minify:css`).
- `js/modules/ui.js` — textos en `translations` (es y en) y la señal de estado, como una función `init...` que no falla si la sección no existe (`NAV-006`), invocada desde `js/index.js` → regenerar `js/index.min.js` (`npx terser js/index.js -o js/index.min.js -c -m`). No se crea un módulo nuevo.

Al cerrar: bump de versión de caché.

## Cómo se comprueba

- Tests automáticos nuevos en `tests/js/local.test.js` (`LOC-001` a `LOC-009`), más la suite completa (`npm test`), que ya vigila enlaces a secciones (`SITE-008`), traducciones (`I18N-005` a `I18N-008`), un solo `h1` (`SITE-018`), minificados (`SITE-003`) y la CSP.
- Revisión en el navegador, a cargo del orquestador: la sección y el aviso en tema oscuro y claro, en 360 px, 768 px y 1280 px de ancho, en español e inglés, y la consola sin errores.

## Decisiones

- **Señal de estado por día, no por hora.** Decir "abierto ahora" exigiría acertar la hora exacta y los festivos; "Abierto hoy · 11:00 a 18:00" es cierto todo el sábado y el domingo, y basta para decidir si ir.
- **Hora de Chile.** El día se calcula con `Intl.DateTimeFormat` en `America/Santiago`, para que un visitante en otra zona horaria no vea un día distinto al del local.
- **Enlace de "Cómo llegar".** `https://www.google.com/maps/search/?api=1&query=...` con la dirección del local: abre la app de mapas en el teléfono y no necesita clave ni carga nada en la página.
- **Sin Instagram del local.** El único enlace del local que el sitio ya publica es `https://doubleimpactstore.cl/`; no se inventa otro.
