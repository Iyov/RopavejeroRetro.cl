# Testimonios reales y sin `schema.json`

- **Estado:** Entregado
- **Fecha:** 2026-10-19
- **Tipo:** Cambio de comportamiento

## Problema

La sección "Testimonios de Clientes Satisfechos" del inicio muestra tres testimonios inventados ("Andrés V.", "Carla M.", "Javier R."), con fotos de stock de Unsplash. Francisco confirmó el 2026-10-19 que no son reales. Además, `schema.json`, que se publica en la raíz del sitio aunque ninguna página lo usa, trae una valoración `AggregateRating` inventada.

## Resultado esperado

El visitante ve tres testimonios reales, con su autor y un enlace a la fuente para comprobarlos. `schema.json` deja de existir.

## Testimonios elegidos por Francisco

Vienen de la destacada "Cliente Feliz 5" de @ropavejero.retro (`https://www.instagram.com/stories/highlights/18080169038493913/`): son historias en las que cada cliente etiquetó a la tienda. El texto va tal como lo escribieron.

| Autor | Cita (ES) | Cita (EN) | Detalle (ES / EN) |
|-------|-----------|-----------|-------------------|
| @ignacioalvaarado | "Full recomendado" | "Highly recommended" | Compró una PS3 · Historia en Instagram / Bought a PS3 · Instagram story |
| @bazardekaneda | "Gracias a @ropavejero.retro que me salvó estas joyitas" | "Thanks to @ropavejero.retro for saving these gems for me" | Compró juegos de GameCube · Historia en Instagram / Bought GameCube games · Instagram story |
| Carlos M. | "Llegó todo impecable" | "Everything arrived in perfect condition" | Compró juegos con envío · Mensaje en Instagram / Bought games with shipping · Instagram message |

Carlos M. aparece solo con su nombre y la inicial del apellido, porque su testimonio viene de un mensaje directo y no de una publicación suya. No se usó la reseña de Google de Cristian P. (Francisco no la eligió).

## Requisitos

### Nuevos

- **TST-001** — La sección de testimonios muestra solo testimonios reales. Cada tarjeta tiene la cita, el autor y un enlace a su fuente en Instagram o Google, que abre en otra pestaña con `rel="noopener noreferrer"`. En lugar de una foto lleva el ícono de la fuente, y la sección no carga imágenes.
- **TST-002** — Los testimonios son los de @ignacioalvaarado, @bazardekaneda y Carlos M., con las citas y los detalles de esta especificación, en español y en inglés. El texto inicial del HTML coincide con el diccionario en español.

### Modificados

- **SEO-012** — Las páginas no contienen valoraciones ni reseñas que el visitante no vea: no hay bloques de datos con `AggregateRating` ni `Review`, los datos estructurados van solo en bloques `application/ld+json`, y ningún archivo JSON de la raíz del sitio trae valoraciones (`schema.json` no existe). *(Antes no mencionaba los archivos JSON.)*

## Fuera de alcance

- `structured-data.json`: no tiene valoraciones y no se toca.
- La preconexión a `images.unsplash.com` se mantiene, porque la usan las imágenes del blog.

## Archivos que se tocan

- `index.html`: marcado de las tres tarjetas y subtítulo de la sección.
- `js/modules/ui.js`: claves `testimonials-subtitle`, `testimonial-1..3` y `testimonial-role-1..3`, en ES y EN.
- `css/index.css` y `css/index.min.css`: estilo del ícono que reemplaza a la foto.
- `schema.json`: se elimina; se quita de `README.md` y de la lista de `SITE-009`.
- `specs/base/18-testimonios.md` (nuevo), `specs/base/11-seo.md`, `specs/README.md`; tests en `tests/js/testimonios.test.js` (nuevo) y `tests/js/analytics-seo.test.js`.
- Bump de versión de caché.

## Cómo se comprueba

- Tests de `TST-001`, `TST-002` y del `SEO-012` modificado.
- A mano en el navegador: la sección en claro y oscuro, en móvil y escritorio.

## Decisiones

- Las citas en inglés son traducciones; en español van tal como las escribieron los clientes.
- Subtítulo nuevo: "Esto dicen nuestros clientes en Instagram. Puedes ver todas sus historias en la destacada «Cliente Feliz»." / "This is what our customers say on Instagram. You can see all their stories in the «Cliente Feliz» highlight."
