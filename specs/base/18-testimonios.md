# 18 · Testimonios de clientes

- **Código:** sección `#testimonios` de `index.html`, claves `testimonial*` en `js/modules/ui.js`, estilos `.testimonial-*` en `css/index.css`
- **Tests:** `tests/js/testimonios.test.js`

El inicio muestra testimonios reales de clientes, tomados de la destacada "Cliente Feliz" de @ropavejero.retro en Instagram.

## Requisitos

- **TST-001** — La sección de testimonios muestra solo testimonios reales. Cada tarjeta tiene la cita, el autor y un enlace a su fuente en Instagram o Google, que abre en otra pestaña con `rel="noopener noreferrer"`. En lugar de una foto lleva el ícono de la fuente, y la sección no carga imágenes.
- **TST-002** — Los testimonios son los de @ignacioalvaarado ("Full recomendado"), @bazardekaneda ("Gracias a @ropavejero.retro que me salvó estas joyitas") y Carlos M. ("Llegó todo impecable"), cada uno con el detalle de qué compró y de dónde viene, en español y en inglés. El texto inicial del HTML coincide con el diccionario en español.

## Notas

- Las citas en español van tal como las escribieron los clientes; las de inglés son traducciones.
- Carlos M. aparece sin su usuario porque su testimonio viene de un mensaje directo y no de una publicación suya.
- Para cambiar o sumar un testimonio, usar solo reseñas reales con su fuente enlazada. Especificación de origen: [2026-10-19-testimonios-reales.md](../cambios/2026-10-19-testimonios-reales.md).
