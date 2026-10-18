---
name: venta-feria
description: Actualiza el stock después de una feria de Ropavejero Retro. Lee el ID y el precio de las fotos de lo vendido, registra la venta en la hoja "Ventas", marca el producto en "Disponibles" y cambia ✅ por ❌ en su post de Instagram. Úsala cuando Francisco pida procesar las ventas de una feria o escriba /venta-feria seguido del nombre de la carpeta (ej. /venta-feria "2026-10-24 Hobby Planet").
---

# Ventas de una feria

Procedimiento acordado con Francisco el 2026-10-17 y probado con la feria Retro San Antonio (2026-10-10). Los fragmentos de código y los detalles de cada herramienta están en [referencia.md](referencia.md).

Escribir en dos planillas y en Instagram cambia datos reales de la tienda. Antes de escribir, la tabla de IDs **siempre** se valida con Francisco (paso 4). Nada se borra sin su OK.

## Datos fijos

- **Fotos:** `D:\Downloads\Ropavejero.Retro\Ferias - Eventos\<carpeta>\Fco` e `\Ivette`. Las subcarpetas que empiezan con `_` (`_Carlos`, `_Otros`, `_SinId`) no se procesan.
- **Carpeta:** `AAAA-MM-DD NombreFeria Detalle`, una por día (ej. `2026-10-10 Retro San Antonio`). La fecha sale del nombre, y el nombre corto **X** es la primera palabra después de la fecha (`Retro`, `Hobby`).
- **Ventas:** planilla "Tienda" `1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA`, pestaña "Ventas" (gid `659622227`). B = Num (ID), C = Product, D = Platform, E = Sale, F = Price (costo), G = Stock, H = Pulir, I–P = venta.
- **Disponibles:** planilla `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek` (gid `1184394447`). A = Num, B = Product, D = Price, G = Link (código del post), H = Sold.
- **Instagram:** `https://www.instagram.com/p/<Link>/`. Cada línea de la descripción es `[✅] <ID> <producto> [<plataforma>] $<precio>K`. El ID va separado por tabulación o por espacio, y puede llevar ceros adelante (`0527`).

## Columnas I–P de Ventas

| Col. | Valor | Ejemplo (Retro, 2026-10-10) |
|---|---|---|
| I Sold | `1` | `1` |
| J UserId | `Vendido en <X>` | `Vendido en Retro` |
| K NombreCliente | `Vendido en <X> <dd/mm/aa>` | `Vendido en Retro 10/10/26` |
| L Mét Pago | `Pagado` | `Pagado` |
| M Test | `1` | `1` |
| N Fecha | `<dd>/<mes>/<aa>`, **como texto** | `10/oct/26` |
| O Entreg | `1` | `1` |
| P Pago | precio de venta en miles, como número | `10` (se muestra `$10`) |

- Meses en N: `ene feb mar abr may jun jul ago sept oct nov dic` (septiembre es `sept`).
- Antes de escribir, buscar ventas anteriores de la misma feria en la columna K y copiar exactamente su forma de J y K. Ejemplo: en Bio Bio, J fue `Vendido en Bio Bio` y K `Vendido en Bio 16/05/26`. Si hay diferencias con esta tabla, preguntar.
- Si Francisco ya cargó a mano alguna venta de esa feria, usarla como fila modelo para verificar.

## Pasos

1. **Leer las fotos.** Reducirlas con `python -E -P .claude/skills/venta-feria/scripts/reducir_fotos.py "<carpeta>" "<scratchpad>/fotos"` y leer cada una: ID (número escrito a mano en la etiqueta, a veces con `CIB`, `MM`, `BL-CIB`), precio y producto. Si un número es dudoso, recortarlo de la foto original con `scripts/recortar.py`. En la primera feria un `995` parecía `495`: el 9 se escribe parecido al 4.
2. **Cruzar con las hojas.** Exportar Ventas y Disponibles (ver referencia) y, para cada ID, comprobar que el producto y el precio calcen con la foto y que no esté ya vendido (I vacío en Ventas). La misma venta puede aparecer en las fotos de los dos vendedores, por ejemplo con 33 segundos de diferencia: es **una** venta.
3. **Productos sin ID.** Buscarlos por nombre entre los no vendidos de las dos hojas:
   - Un solo candidato que calza: proponerlo.
   - Varios candidatos iguales (ej. dos Call of Duty Ghosts BL-CIB a $8): preguntar cuál.
   - No registrado, o la etiqueta no calza con el registrado (otra copia): va como fila `XXXX` (paso 6).
4. **Validar con Francisco.** Mostrar dos tablas: los IDs (foto, ID, producto, precio en foto y en las hojas, Link) y los sin ID con la propuesta para cada uno. Señalar diferencias de precio entre la foto, Ventas y Disponibles. **No escribir nada hasta su OK.**
5. **Ventas, productos con ID.** Comprobar en una exportación fresca que cada número de fila sigue correspondiendo a su ID. Escribir I–P fila por fila y verificar cada lote contra la fila modelo con `_check`.
6. **Ventas, filas `XXXX`.** Van **al tope** del bloque `XXXX` que está debajo de la lista numerada (insertando hacia arriba: lo más nuevo queda arriba), justo encima de la primera fila `XXXX` existente. B = `XXXX`, E = precio de venta, F = `0`, G = `1`, H = `0`, I–P como arriba, con P igual a E. Insertar filas, copiar el formato de la fila de abajo y pegar los valores desde el portapapeles (no tipear: el autocompletado cambia los nombres). Un lote vendido a precio cerrado se reparte en miles enteros que sumen el total. Si un producto del lote ya tiene fila con ID, se ajusta su P.
7. **Disponibles.** Para cada ID, guardar el Link (G) y poner `1` en Sold (H). Hasta que Francisco diga otra cosa: marcar con `1`, mostrarle el resultado y **borrar esas filas solo con su OK**, de abajo hacia arriba para que no se corran los números.
8. **Instagram.** Agrupar los IDs por Link (un post puede tener varios productos vendidos) y editar cada post una sola vez. Guardar con un clic real en "Listo", y recargar el post para confirmar que quedó ❌. Las filas `XXXX` no tienen post.
9. **Cierre.** Exportar Ventas y contar las filas de la feria (columna K) y la suma de Pago. Informar qué se registró, qué quedó pendiente y por qué, y cerrar la pestaña del navegador.

## Errores conocidos

- **"Listo" con `.click()` de JavaScript** cierra el editor de Instagram sin guardar. Siempre con clic real, y siempre recargar para verificar.
- **Insertar filas** les da el formato de la fila de arriba (una fila vacía). Hay que copiar el formato de la fila `XXXX` de abajo.
- **Precio de Disponibles desactualizado:** puede no coincidir con Ventas (RE5 995: $10 en Ventas y $12 en Disponibles). Vale el de la etiqueta; preguntar si hay duda.
- **Error de precio en la feria** (ej. se vendió a precio de la versión `(M)`): se registra lo que realmente se cobró.
