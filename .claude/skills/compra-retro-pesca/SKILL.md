---
name: compra-retro-pesca
description: Registra una compra a Simon Bayer (Retro Pesca) en el bloque "Retro Pesca" de la hoja "Ventas" de la planilla "Tienda". Lee la compra pendiente en el chat de Messenger (lista con códigos y capturas de sus publicaciones), arma la tabla con el formato de Francisco, la valida con él y la escribe. Úsala cuando Francisco pida anotar, registrar o pasar a la hoja una compra de Retro Pesca o de Simon Bayer, o escriba /compra-retro-pesca.
---

# Compra a Retro Pesca

Procedimiento acordado con Francisco el 2026-11-04, probado con la compra de ese día ($193.500, 27 juegos). Los fragmentos de código están en [referencia.md](referencia.md).

Escribir en la planilla cambia datos reales de la tienda. La tabla **siempre** se valida con Francisco antes de escribir (paso 5).

## Datos fijos

- **Navegadores:** la planilla se abre en **Brave** (el Chrome por defecto tiene otra cuenta de Google y da "Necesitas acceso"). El chat se abre en el **Chrome de Trina**, que tiene el Facebook personal de Francisco. Para cambiar de uno a otro: `list_connected_browsers` y `switch_browser` (Francisco hace clic en "Connect" en el que corresponde) o `select_browser` si el `deviceId` ya se conoce en la sesión.
- **Chat:** `https://www.facebook.com/messages/t/1712523042104445` (Retro Pesca).
- **Planilla:** "Tienda" `1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA`, pestaña "Ventas" (gid `659622227`).
- **Bloque:** la fila con `Name:` en B y `Retro Pesca` en C (el 2026-11-04 era la 5484). Buscarla siempre en una exportación fresca: cambia cuando se insertan o borran filas más arriba.

## Forma del bloque

```
B        C                        D            E      F      G
Name:    Retro Pesca              <fecha>
Price:   <total en miles>         Chile
Email:   Simon Bayer
         FB Sale - AAAA-MM-DD
Num      Product                  Platform     Sale   Price  Stock
1        <producto (condición)>   <plataforma> <venta> <costo> 0
...
n+1      Shipping                                     0
n+2      Discount                                     0
                                  Total        =SUMA  =SUMA  =(1-(F/E))
```

- **Fecha (D de Name):** la del día en que se registra (acordado: "hoy"). Se escribe `d/m/aaaa` (la planilla está en configuración chilena) y se muestra `m/d/aaaa`. La línea `FB Sale - AAAA-MM-DD` usa la misma fecha.
- **Price (C de Price:):** total pagado en miles, con coma decimal (`193,5`). Se muestra redondeado (`$194`), pero guarda el decimal.
- **Price de cada producto:** costo en miles, con coma decimal si hace falta (`6,5`). La suma tiene que dar el total de Simon.
- **Sale:** precio de venta estimado, cerca del doble del costo y en línea con lo que la hoja ya registra para ese juego. Francisco lo ajusta después. Margen típico de los bloques: 45–52%.
- **Stock:** `0`, ya viene en la plantilla. Num, Shipping, Discount y las columnas H en adelante no se tocan, salvo para renumerar Shipping y Discount (paso 7).
- Total y % son fórmulas que suman desde la primera fila de producto hasta Discount: se ajustan solas al borrar filas.

## Nombres, plataformas y condición

- **Producto:** nombre completo en inglés como en la portada (`Herbie Fully Loaded`, `Star Wars Jedi Knight II: Jedi Outcast`, `Warriors Orochi 3 Ultimate`), seguido de la condición entre paréntesis.
- **Plataformas:** `NES`, `SNES`, `N64`, `GB`, `GBC`, `GBA`, `DS`, `3DS`, `Gamecube`, `Wii`, `WiiU`, `Genesis`, `GG` (Game Gear), `PS1`, `PS2`, `PS3`, `PS4`, `PSP`, `Xbox`, `X360`, `XOne`, `PC`, `Acc`, `Console`.
- **Condición** (Francisco confirmó estas equivalencias el 2026-11-04):

| Lo que dice Simon | Etiqueta |
|---|---|
| completo | `(CIB)` |
| completo, Greatest Hits / Platinum Hits | `(GH-CIB)` / `(PH-CIB)` |
| completo, Black Label (PS2/Xbox) | `(BL-CIB)` |
| en caja, sin manual | `(MM)` |
| solo cartucho / solo disco / "disco" | `(L)` |
| cartucho con manual, sin caja | `(Manual)` |
| con manual y dust cover (NES) | `(Manual + Dust Cover)` |
| no se sabe | sin etiqueta |

- El código de Simon (`h060`, `k321`...) **no** se anota en la hoja.

## Pasos

1. **Encontrar la compra pendiente.** Abrir el chat y considerar **solo la compra que está pendiente**: lo que viene después de la última entrega pagada (la última captura de "Transferencia exitosa" a Simón Bayer Monnard, o el último total que ya se pagó). No revisar compras anteriores.
2. **Leer el detalle.** Simon manda una línea por tanda: `<juego> <plataforma> <código> (<precio>)`, con `+` entre juegos sueltos, `//` entre grupos y `-` entre juegos de un mismo lote (que lleva un solo precio al final). Al cierre manda la lista completa y `tengo anotado <total>`. Las capturas que Francisco le envía son las publicaciones de Simon y traen el estado ("completo", "caja rota", "Greatest Hits") y, en los lotes, el precio por separado de cada juego y los títulos de los packs. Verlas en grande con el visor de la referencia.
3. **Verificar el total.** Sumar los precios de la lista y compararlo con el total de Simon. Si no calza, decírselo a Francisco antes de seguir.
4. **Armar la tabla.**
   - Un juego por fila, también dentro de los packs y lotes (con sus títulos sacados de la foto).
   - **Lote con precio por separado:** repartir el precio del lote en proporción a esos precios, en miles enteros, cuidando que sumen el total del lote (ej. NES de $45.000 con precios de 5/11/16/25 → 4/9/12/20).
   - **Pack sin precios por separado:** repartir en partes iguales (5 juegos por $10.000 → 2 cada uno).
   - Un título ilegible va como `Etiqueta dañada (L)` y se avisa. Los títulos dudosos también se avisan.
   - Lo que Francisco consultó pero Simon no incluyó en el total (ej. Halo 2, que vendió a otro) **no va**.
5. **Validar con Francisco.** Mostrarle el encabezado y la tabla (n.º, producto, plataforma, Sale, Price y la fuente de la condición), con las sumas y el margen, y señalarle lo dudoso. **No escribir nada hasta su OK.**
6. **Escribir.** En Brave, con la planilla abierta:
   - Pegar los productos como valores en `C<primera fila>` (columnas C–F) desde el portapapeles, con `ctrl+shift+v`. No tipear nombres: el autocompletado de Sheets los cambia.
   - Encabezado: pegar `FB Sale - AAAA-MM-DD` en la C de la cuarta fila, y tipear la fecha (`d/m/aaaa`) en la D de Name y el total (`193,5`) en la C de Price.
   - Si los juegos superan las filas numeradas de la plantilla (47 el 2026-11-04), insertar filas antes de Shipping y copiarles el formato de una fila de producto.
7. **Ajustar el largo del bloque.** Borrar las filas numeradas que sobran (clic derecho en los encabezados de fila → "Borrar filas X - Y") y renumerar Shipping y Discount como n+1 y n+2. El 2026-11-04 el control de permisos de Claude Code bloqueó el borrado: si vuelve a pasar, decirle a Francisco qué filas borrar y qué números poner, y no intentar otra vía.
8. **Verificar y cerrar.** Exportar la hoja y comprobar que cada fila tenga el producto y la plataforma de la tabla, que el encabezado esté bien y que el Total dé el total de Simon. Informarle a Francisco lo escrito, lo que quedó pendiente y lo que hay que revisar (Sale, títulos dudosos, juegos sin condición). Cerrar las pestañas abiertas.

## Errores conocidos

- **Cuenta equivocada:** si la exportación devuelve HTML o la página dice "Necesitas acceso", se está usando un navegador con otra cuenta de Google. Cambiar a Brave.
- **Messenger carga los mensajes de a poco:** el texto de la conversación está virtualizado, así que hay que recorrerlo con scroll para leerlo (ver referencia). La hora antes de AM/PM es un espacio angosto (U+202F): buscar mensajes con `startsWith('<Mes> <día>, <año>, <hora>')` y no con la hora completa.
- **Fecha:** tipearla como `m/d` la deja invertida (`11/4` sería 11 de abril). Va `4/11/2026` para el 4 de noviembre.
