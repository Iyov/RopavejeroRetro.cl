# Referencia técnica de `/venta-online`

Probado en la venta del 20–21/11/2026 con Claude in Chrome sobre Brave, en una ventana de 1357×857. Si la ventana tiene otro tamaño, sacar una captura y recalcular las coordenadas antes de hacer clic.

## Texto del anuncio

Plantilla del anuncio publicado el 2026-11-18 (https://www.instagram.com/p/Df5UPGUmFHy/). Cambiar la fecha, la hora y lo que se vende:

```
🎮 Actualización Viernes 20/Nov/26 21:00 hrs!

✅ Se venderán juegos de DS, PS2, PS3 y más.
🔔 Activen las notificaciones.

✋ Se subirán distintos lotes en un post que contendrá en su descripción el listado con:
Ej: [✅] 125 Gungrave (BL-CIB) $55K
1) Estado: [✅️] Disponible ó [❌️] Vendido
2) Número (identificador): 125
3) Nombre: Gungrave (BL-CIB)
4) Precio: $55K, dónde K=1.000

Si deseas comprar algo, basta con que comentes en el post el número del juego con un: "Yo 125" o "Mio 125", por ejemplo. En tal caso te responderemos a la brevedad y enviaremos los datos para concretar la venta. Se le da prioridad al primer comentario. Se esperan unos minutos, luego pasa al siguiente. Ten listos nuestros datos para que pueda ser lo más rápido posible.

💰 Medios de Pago: Efectivo, Transferencia.

🚚 Entregas en metro San Joaquín L5 o envío vía Starken a todo Chile.

📷 Una vez que se concreten las ventas, enviaremos las fotos y detalles de los productos.

🤞🏻 Mucha suerte en sus compras, cariños!

#RopavejeroRetroWeb
```

Los textos de posts anteriores están en `js/instagram_posts.js` (los genera el bot), y sirven para copiar el formato.

## Canva

- **Editar un texto:** doble clic en el cuadro, `ctrl+a` y escribir. Si el cuadro tiene dos líneas con estilos distintos, `ctrl+a` reemplaza ambas y el texto nuevo toma el estilo más grande: corregir el tamaño en el campo de tamaño de la barra (en el diseño 3 el título va en 25). Para cambiar una sola palabra, seleccionarla con doble clic.
- **Descargar:** Compartir → Descargar → tipo PNG → Descargar. Si el panel "Imprime con Canva" tapa el botón, cerrarlo primero. Buscar los botones con `find` si las coordenadas no calzan. El PNG gratuito sale de unos 1414×2000.
- **PowerShell:** los nombres como `Actualización [1].png` tienen corchetes; al copiarlos, usar `Copy-Item -LiteralPath`.

## Revisar las fotos

```bash
python -E -P .claude/skills/venta-online/scripts/hoja_contacto.py "D:/Downloads/Ropavejero.Retro/Ventas/2026-11-20 Viernes" "<scratchpad>/contacto"
# solo las fotos nuevas, tomadas desde las 18:00:
python -E -P .claude/skills/venta-online/scripts/hoja_contacto.py "<carpeta>" "<scratchpad>/contacto2" 20261120_18
```

Leer `hoja1.jpg`, `hoja2.jpg`... con Read. Cada miniatura lleva el número y la hora de la foto. Las fotos de un mismo producto van seguidas: frente, reverso, etiqueta superior, conector. Los reversos de Game Gear y GBA tienen un sticker con el ID y el precio.

## Preparar los posts

```bash
python -E -P .claude/skills/venta-online/scripts/preparar_posts.py "<carpeta de fotos>" "<scratchpad>/plan.json" .cache/venta
```

El formato de `plan.json` está en el docstring del script. Lo más simple es armarlo con Python a partir de la exportación de Ventas, para que el nombre, la plataforma y el precio salgan de la hoja y no se tipeen a mano. Después, leer `.cache/venta/contacto.jpg` y `.cache/venta/resumen.txt`.

## Esperar la hora de la venta

El `sleep` en primer plano está bloqueado. Lanzar con `run_in_background` y continuar cuando llegue la notificación:

```bash
while [ "$(date +%H%M)" -lt 2100 ]; do sleep 30; done; date +%H:%M:%S
```

## Publicar un post en instagram.com

Herramienta `computer` (clics reales), coordenadas para una ventana de 1357×857, en una pestaña con `https://www.instagram.com/`. Un post toma 4 llamadas:

1. **Abrir el diálogo:** `navigate` a `https://www.instagram.com/`; clic en Crear (34, 481); esperar 1 s; clic en Publicación (68, 532); esperar 1 s; `find` "file-input (hidden)". Usar el input del diálogo de la página de inicio: en la página del perfil hay otro input que abre un flujo de una sola foto (`/create/style/`).
2. **Subir las fotos:** `file_upload` con las rutas absolutas `D:\...\.cache\venta\<carpeta>\01_....jpg` en orden. Máximo 10 MB por envío; las fotos preparadas pesan unos 250 KB.
3. **Recorte y avance:** esperar 1 s; clic en el ícono de recorte (384, 738); clic en "Original" (420, 535); clic en Siguiente (943, 109); esperar 3 s; `hover` y clic en Siguiente (1110, 109); esperar 4–5 s; captura. **Seguir solo si la captura muestra "Añade una descripción..."**. Si sigue en Filtros, esperar y volver a capturar antes de hacer otro clic. Un clic en (1110, 109) en el paso del texto es "Compartir" y publica sin texto. Si aparece "¿Descartar publicación?", es que el clic cayó fuera del diálogo: elegir "Cancelar" (671, 368).
4. **Texto y publicación:** clic en el cuadro (960, 204); `type` con el texto de `caption.txt` (los `\n` funcionan); clic en el texto (860, 277), o (860, 230) si el texto no tiene siglas, para cerrar la sugerencia de hashtag sin elegir nada; `zoom` a (820, 90, 1160, 400) para confirmar que terminó en `#RopavejeroRetroWeb`; clic en Compartir (1110, 109); esperar 20 s; `zoom` a (350, 380, 1000, 540). Debe decir "Se ha compartido tu publicación". Si sigue cargando, esperar más **antes** de navegar.

Mientras la página se usa, los clics en Siguiente a veces no responden a la primera: por eso el `hover` previo y la captura antes de escribir.

## Me gusta en cada post

Francisco pide poner me gusta, con @ropavejero.retro, a cada publicación que se crea: el anuncio y todos los posts de la venta. Para cada código, en un lote con `browser_batch`: `navigate` a `https://www.instagram.com/p/<código>/`, esperar 2 s y ejecutar:

```js
const h = () => [...document.querySelectorAll('svg[aria-label]')]
  .find(s => /^(Me gusta|Ya no me gusta)$/.test(s.getAttribute('aria-label')) && s.getAttribute('height') === '24');
const a = h();
const antes = a && a.getAttribute('aria-label');
if (antes === 'Me gusta') {   // solo si todavía no tiene: un clic en "Ya no me gusta" lo quitaría
  (a.closest('[role=button],button') || a.parentElement).click();
  await new Promise(r => setTimeout(r, 1500));
}
location.pathname + ' ' + antes + ' -> ' + (h() && h().getAttribute('aria-label'));
```

- El corazón del post mide 24 px. Los de los comentarios son más chicos y también se llaman "Me gusta": por eso el filtro por `height`.
- Se esperaba `-> Ya no me gusta` en todos. Recargar uno o dos posts al final para confirmar que quedó guardado.
- Probado el 2026-11-21 con los 33 posts de la primera venta. Unos 6 posts por lote.

## Editar el texto de un post ya publicado

En `https://www.instagram.com/p/<código>/`: `find` "Más opciones" → clic → Editar (1056, 158) → clic en el cuadro de texto (`find` "Añade una descripción") → `type` → clic en el texto → Listo (1128, 109). Recargar y leer con `get_page_text` para confirmar.

## Borrar un post (solo con OK de Francisco)

En el post: `get_page_text` para confirmar que es el correcto; "Más opciones" → Eliminar (1062, 108) → captura del diálogo "¿Eliminar publicación?" → Eliminar (671, 320). Las copias en Threads y Facebook no se borran: avisarle a Francisco.

## Códigos de los posts

En la página del perfil, después de bajar para que cargue la grilla. Los dos primeros enlaces son posts fijados:

```js
const codes = [...new Set([...document.querySelectorAll('a[href*="/p/"]')]
  .map(a => a.getAttribute('href').split('/p/')[1].replace('/', '')))].slice(2, 40);
const out = [];
for (const c of codes) {
  const h = await fetch('/p/' + c + '/').then(r => r.text());
  const m = h.match(/og:title" content="[^"]*?\] (\d{4}) /) || h.match(/og:title" content="[^"]*?: &quot;([^\n&]{0,30})/);
  out.push((m ? m[1] : '?') + ' ' + c);
}
out.join('\n');
```

Los posts de grupo no tienen un ID en el título: aparecen con el comienzo de su título (ej. `Portátiles Sueltos`).

## Escribir los códigos en Disponibles

1. Exportar Disponibles (ver `.claude/skills/venta-feria/referencia.md`) y confirmar que la fila de cada ID es la esperada y que G está vacía.
2. Armar la columna en la página (`window.__tsv = [...].join('\n')`), hacer un clic en la hoja para darle el foco y luego `await navigator.clipboard.writeText(window.__tsv)`. Sin el clic falla con "Document is not focused".
3. Cuadro de nombre (`find` "Name box") → `G<primera fila>` → `Return` → `ctrl+shift+v`.
4. Exportar otra vez y comparar fila por fila.

## Registrar productos nuevos

- **Ventas:** cuadro de nombre `<primera>:<última>` (filas completas) → clic derecho en el encabezado → "Insertar n filas encima", sobre la fila vacía que separa la lista del bloque `XXXX`. Pegar B:H desde el portapapeles con `ctrl+shift+v`.
- **Disponibles:** A:D desde la primera fila libre antes del Total. E (Neto) es fórmula: no tocarla.
- Si la salida de JavaScript viene bloqueada, reemplazar `=`, `&` y `?` antes de devolverla.
