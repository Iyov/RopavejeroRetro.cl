---
name: venta-online
description: Organiza una venta online ("Actualización") de Ropavejero Retro por Instagram. Actualiza los 3 flayers en Canva y publica el anuncio (llega también a Threads y Facebook); registra en "Ventas" y "Disponibles" los productos nuevos de la carpeta de fotos; y el día de la venta publica los productos (uno por post, o por grupo cuando solo hay foto grupal) con fotos ajustadas a 3:4, y anota el código de cada post en Disponibles. Úsala cuando Francisco pida anunciar o hacer una venta online, una "Actualización", publicar productos en Instagram, o escriba /venta-online.
---

# Venta online por Instagram

Procedimiento armado con la primera venta (anunciada el 2026-11-18 para el viernes 20/11 a las 21:00 y publicada el sábado 21). Los fragmentos de código, coordenadas y detalles de cada herramienta están en [referencia.md](referencia.md).

Publicar en Instagram es público y llega a Threads y Facebook. Los textos y las tablas se validan con Francisco antes de publicar o escribir en las hojas. Nada se borra sin su OK.

## Reglas que salen de la primera venta

- **Si algo falla, avisar a Francisco en el acto.** La primera venta no salió a la hora anunciada: el permiso del navegador falló a las 21:00 y el turno terminó sin avisar. Ante cualquier error en un paso con hora comprometida, lo primero es escribirle qué falló.
- **Revisar el primer post publicado antes de seguir** (abrirlo y mirarlo). En la primera venta se publicaron 13 posts antes de notar que Instagram recortaba las fotos.
- **No inventar textos.** El título de los flayers es `VIERNES` / `ACTUALIZACIÓN` (no `HOY`, no títulos propios). Si falta un dato, preguntar.

## Datos fijos

- **Navegador:** Brave, con Claude in Chrome (`switch_browser` si hace falta). Ahí están las sesiones de Canva, Google y Instagram (@ropavejero.retro). No iniciar sesión con otra cuenta.
- **Flayers en Canva**, en este orden en el carrusel: `DAG37_ZT-PQ` (con foto), `DAF5aFzOOj8` (Pac-Man) y `DAF5aKV1erw`. Se editan en el mismo diseño, sin duplicarlo.
- **Fotos de la venta:** `D:\Downloads\Ropavejero.Retro\Ventas\<AAAA-MM-DD Día>` (ej. `2026-11-20 Viernes`).
- **Ventas:** planilla "Tienda" `1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA`, gid `659622227`. B Num, C Product, D Platform, E Sale, F Price (costo), G Stock, H Pulir.
- **Disponibles:** `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek`, gid `1184394447`. A Num, B Product, C Platform, D Price, G Link (código del post), H Sold.
- **Archivos para subir:** `file_upload` solo acepta archivos dentro del repo, así que todo va a `.cache/` (ignorada por git), con nombres sin `~`.

## Paso 1: anuncio (días antes)

1. Preguntar la fecha y la hora, qué se vende (ej. "juegos de DS, PS2, PS3 y más") y cuándo publicar.
2. En cada diseño de Canva cambiar la fecha. En el diseño 1 va `Viernes 20/Nov/2026`; en el 2, la forma corta `20 NOV`, porque `20 NOVIEMBRE` choca con los separadores; en el 3, `20 NOVIEMBRE`. Mostrarle los cambios a Francisco.
3. Descargar los 3 en PNG (Compartir → Descargar). Los diseños 2 y 3 proponen MP4: cambiar a PNG. Copiarlos a `.cache/flayers/`.
4. Armar el texto con la plantilla de [referencia.md](referencia.md), mostrárselo a Francisco y publicar el carrusel con el flujo de publicación (paso 4). El texto lleva `#RopavejeroRetroWeb` para que salga en la web.

## Paso 2: registrar los productos nuevos

Solo si Francisco lo pide: hay fotos de productos que no tienen ID.

1. Revisar la carpeta con `scripts/hoja_contacto.py` (ver referencia) e identificar cada producto, su plataforma y su estado: en caja = `CIB`; sin manual = `MM`; suelto = `L`; lomo rojo PS2/PS3 = `GH`; resto de PS3 = `BL`.
2. Proponer una tabla con ID, producto, plataforma, precio de venta y costo. Los ID siguen al último de Ventas. Los precios se estiman con ventas parecidas de la hoja, y el costo es `0` si Francisco no lo da. **Validar con Francisco antes de escribir.**
3. Ventas: insertar las filas encima de la fila vacía que separa la lista del bloque `XXXX` y pegar B:H como valores (Stock `1`, Pulir `0`). Disponibles: pegar A:D antes del Total, e insertar filas si no alcanzan. Verificar ambas hojas exportando.
4. **Francisco suele corregir los ID y los precios después.** Antes de publicar, volver a leer las hojas; mandan los ID y precios que estén ahí.

## Paso 3: preparar los posts

1. Revisar todas las fotos con `hoja_contacto.py`. Para cada producto anotar sus fotos. Las fotos `~2` son la versión editada: usar esa y no la original.
2. **Un post por producto** si tiene fotos propias. Los que **solo tienen foto grupal** van en un post de grupo (ej. `Portátiles Sueltos | 20/Nov/26`), con la lista separada por plataforma con líneas en blanco. Mostrarle a Francisco qué productos no tienen foto: él saca las que falten.
3. Armar `plan.json` con el orden de publicación (por ID; el post de grupo va en el lugar de su primer ID) y correr `scripts/preparar_posts.py`. Deja cada post en `.cache/venta/<carpeta>/`, con las fotos en 3:4 y `caption.txt`, más `resumen.txt` y `contacto.jpg`.
4. **Mostrarle `contacto.jpg` y `resumen.txt` a Francisco** antes de la hora de la venta.

**Por qué 3:4:** las fotos del celular son 9:20 (1836×4080), e Instagram muestra como máximo 3:4 y recorta lo demás. El script detecta el producto, recorta en 3:4 con el producto completo y centrado, y si no cabe rellena los costados con el mismo fondo difuminado.

## Paso 4: publicar (a la hora acordada)

1. Esperar la hora con un comando en segundo plano (ver referencia). **Si algo falla en ese momento, avisar de inmediato.**
2. Publicar cada post con el flujo de [referencia.md](referencia.md): Crear → Publicación → subir las fotos → recorte "Original" → Siguiente → Siguiente → texto → Compartir. Los interruptores de Threads y Facebook vienen activados.
3. Después del **primer** post, abrirlo en el perfil y revisar que las fotos y el texto se vean bien antes de seguir.
4. Esperar "Se ha compartido tu publicación" antes de pasar al siguiente: si se sale antes de la página, el post puede quedar a medias.
5. Avisar el avance a Francisco cada pocos posts.

## Paso 5: cierre

1. Sacar el código de cada post con el script de la referencia: lee el título de cada post del perfil y lo cruza con su ID. Revisar que no haya duplicados.
2. Escribir los códigos en la columna G de Disponibles. En un post de grupo, el mismo código va en todos sus productos. Verificar exportando.
3. Informar qué se publicó, qué falló y qué queda para Francisco (ej. borrar copias en Threads o Facebook). Cerrar las pestañas y borrar `.cache/venta` y `.cache/flayers` si Francisco lo aprueba.
4. Lo que se venda durante la venta (comentarios "Yo 125") lo atiende Francisco. Para marcar ❌ en los posts y registrar la venta en las hojas, todavía no hay un procedimiento acordado para ventas online: preguntar. El script de ✅→❌ está en `.claude/skills/venta-feria/referencia.md`.

## Errores conocidos

- **Fotos recortadas o "hacia arriba":** se subieron en 9:20 sin preparar. No se pueden cambiar en un post ya publicado; solo se pueden borrar y republicar, con OK de Francisco. Las copias en Threads y Facebook no se borran solas.
- **Post sin texto:** un clic de más en "Siguiente" cae en "Compartir". Antes de escribir, confirmar que aparece "Añade una descripción". Si pasa, agregar el texto con ⋯ → Editar.
- **"No se ha podido compartir la publicación"** puede aparecer aunque el post sí se publicó. Revisar el perfil antes de reintentar, para no duplicar.
- **Las capturas de pantalla se congelan** ("Page.captureScreenshot timed out"): abrir una pestaña nueva y cerrar la anterior. Si el grupo de pestañas se reinicia, llamar a `tabs_context_mcp` con `createIfEmpty` y volver a calcular las coordenadas, porque el tamaño de la ventana puede cambiar.
- **Meta Business Suite no sirve**: la cuenta de Brave no tiene páginas administrables. Se publica desde instagram.com.
- **threads.com no está permitido** en Claude in Chrome: no se puede comprobar ahí si llegó la copia.
