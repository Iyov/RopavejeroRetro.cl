# 01 · Utilidades

- **Código:** `js/modules/utils.js`
- **Tests:** `tests/js/utils.test.js`

Funciones compartidas por los demás módulos. Todo dato externo (hoja de productos, Instagram, JSON) pasa por aquí antes de llegar a la página.

## Requisitos

### Sanitización

- **UTL-001** — `sanitizeHTML` convierte un texto en HTML inofensivo: las etiquetas y el `&` quedan escapados y se muestran como texto. Si no recibe un string devuelve cadena vacía.
- **UTL-002** — `sanitizeURL` devuelve la URL solo si usa `http` o `https` y su dominio (o un subdominio) está en la lista blanca: Instagram, Facebook, TikTok, YouTube, Twitter, Threads, `wa.me`, `docs.google.com`, `ropavejeroretro.cl` y Cloudflare Insights. En cualquier otro caso devuelve `#`.
- **UTL-009** — `sanitizeAttribute` deja un texto listo para ir dentro de un atributo HTML: además de las etiquetas y el `&`, escapa las comillas dobles y simples, de modo que el valor no pueda cerrar el atributo. Si no recibe un string devuelve cadena vacía.

### Productos

- **UTL-010** — `normalizeProductData` entrega un producto normalizado sin escapar: número entero, textos tal como vienen y valores por defecto (`Sale` y `Neto` en `X`, `Stock` en `0`). Es la forma en que los productos se guardan en memoria y en caché. Si no recibe un objeto devuelve `null`.
- **UTL-003** — `validateProductData` entrega el mismo producto normalizado con sus textos sanitizados, listo para insertarse como HTML. Se aplica una sola vez, sobre el producto sin escapar. Si no recibe un objeto devuelve `null`.
- **UTL-004** — Un producto está vendido solo si su campo `Sold` es `"1"` o `1`. Vacío, `0` o cualquier otro valor significa disponible.
- **UTL-005** — `parseProductPrice` obtiene el número de un precio escrito como texto. `X`, vacío o sin número devuelven `null`; el sufijo `K` multiplica por mil. Con el formato de la hoja (`$15.000`) el orden entre precios se conserva.
- **UTL-006** — `compareNullableNumbers` compara dos números dejando los valores nulos al final, tanto en orden ascendente como descendente.
- **UTL-007** — `sortProducts` ordena por número, precio (ascendente o descendente), nombre (A-Z o Z-A) o plataforma. El nombre se ordena con reglas del español (sin distinguir mayúsculas ni acentos, números por valor). Los empates se resuelven por número, un criterio desconocido equivale a ordenar por número, la lista original no se modifica y se compara el texto sin escapar.

### Errores

- **UTL-008** — `handleSecureError` devuelve un mensaje genérico para el visitante según el contexto (`products`, `efemerides` o general) y el idioma activo, sin revelar el error real, que solo se registra en la consola.

## Notas

- Un precio de un millón o más (`$1.000.000`) se leería como `1`, porque solo se toma el primer grupo de dígitos. Hoy ningún producto llega a ese valor.
