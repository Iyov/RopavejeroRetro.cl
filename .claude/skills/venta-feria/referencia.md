# Referencia técnica de `/venta-feria`

Fragmentos probados en la feria Retro San Antonio (2026-10-10). Se ejecutan con la herramienta de JavaScript de Claude in Chrome, en una pestaña ya abierta en el dominio correspondiente (las exportaciones usan la sesión de Google del navegador).

## Leer las hojas

Desde una pestaña abierta en `docs.google.com`:

```js
// Ventas (planilla "Tienda", pestaña "Ventas")
const t = await (await fetch('/spreadsheets/d/1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA/export?format=tsv&gid=659622227')).text();
const v = t.split('\n').map(l => l.split('\t'));   // v[fila-1][col]; col 0 = A, 1 = B (Num) ... 15 = P (Pago)
window._v = v;

// Disponibles (planilla "Disponibles", única pestaña)
const t2 = await (await fetch('https://docs.google.com/spreadsheets/d/1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek/export?format=tsv&gid=1184394447')).text();
const d = t2.split('\n').map(l => l.split('\t'));  // d[fila-1][col]; col 0 = A (Num) ... 6 = G (Link), 7 = H (Sold)
window._d = d;
```

- La exportación TSV entrega lo que muestra la celda (`$10`, `10/oct/26`) y respeta el número de fila real de la hoja aunque haya filtros activos.
- Si la salida de JavaScript viene bloqueada ("Cookie/query string data"), es porque algún texto parece una URL con parámetros: reemplazar `=`, `&` y `?` por espacios antes de devolverlo.
- Buscar un ID: `v.findIndex(x => x[1].trim() === '4271') + 1` da la fila. En Disponibles el ID está en la columna 0.

## Verificar lo escrito en Ventas

Compara las columnas I–O de cada fila con una fila modelo de la misma feria, y P con el monto esperado:

```js
window._check = async (filas, modelo) => {   // filas: [[fila, pago], ...]; modelo: número de una fila ya correcta
  const t = await (await fetch('/spreadsheets/d/1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA/export?format=tsv&gid=659622227')).text();
  const v = t.split('\n').map(l => l.split('\t'));
  const m = v[modelo - 1].slice(8, 16).map(s => s.trim());
  return filas.map(([r, pago]) => {
    const got = v[r - 1].slice(8, 16).map(s => s.trim());
    const exp = [...m.slice(0, 7), '$' + pago];
    return r + ' ' + v[r - 1][1] + ' ' + v[r - 1][2] + ' => ' + (JSON.stringify(got) === JSON.stringify(exp) ? 'OK' : 'DIFF ' + got.join('|'));
  }).join('\n');
};
```

## Escribir una fila en Ventas

Con la herramienta `computer` (clics y teclas reales), en lotes con `browser_batch`:

1. Triple clic en el cuadro de nombre (buscarlo con `find`: "Name box"), escribir `I<fila>`, `Return`.
2. Escribir cada valor seguido de `Tab`: `1`, `Vendido en <X>`, `Vendido en <X> <dd/mm/aa>`, `Pagado`, `1`, `<dd/mmm/aa>`, `1`, `<pago>`; el último con `Return`.

Tipear funciona para estos valores porque coinciden exactamente con otros de la columna. Para nombres de producto (filas `XXXX`) **no tipear**: el autocompletado de Sheets puede cambiar "X-Men" por "X-Men (BL-CIB)" al presionar `Tab`. Usar el portapapeles (siguiente sección).

## Insertar filas `XXXX`

1. Cuadro de nombre: `<primera>:<primera+n-1>` (filas completas), `Return`; clic derecho en el encabezado de la fila → "Insertar n filas encima".
2. Copiar el formato de la fila que quedó justo debajo: seleccionarla (`<fila>:<fila>`), `ctrl+c`; seleccionar las nuevas, `ctrl+alt+v` (pegar solo formato).
3. Poner los datos en el portapapeles y pegarlos como valores desde la columna B:

```js
const filas = [['Sims 3 (MM)', 'PS3', 3], ['Matrix', 'DVD', 3]];   // [producto, plataforma, pago en miles]
const tsv = filas.map(([n, p, v]) => ['XXXX', n, p, v, 0, 1, 0, 1, 'Vendido en Retro', 'Vendido en Retro 10/10/26', 'Pagado', 1, '10/oct/26', 1, v].join('\t')).join('\n');
await navigator.clipboard.writeText(tsv);
```

   Luego cuadro de nombre `B<primera>`, `Return`, `ctrl+shift+v`.

## Instagram: cambiar ✅ por ❌

En `https://www.instagram.com/p/<Link>/`, con la sesión de @ropavejero.retro. Abre el editor, cambia solo las líneas de los IDs indicados y **lanza un error si algo no calza**, para que el lote se detenga antes de guardar:

```js
const ids = ['4476', '4477'];
const svg = document.querySelector('svg[aria-label="Más opciones"]');
(svg.closest('[role="button"],button') || svg.parentElement).click();
await new Promise(r => setTimeout(r, 1000));
const e = [...document.querySelectorAll('div,span,button')].filter(x => x.children.length === 0 && x.innerText && x.innerText.trim() === 'Editar')[0];
(e.closest('[role="button"],button') || e).click();
await new Promise(r => setTimeout(r, 2000));
const ed = () => document.querySelector('[data-lexical-editor="true"]');
const before = ed().innerText;
const found = [];
const mk = id => new RegExp('\\[\u2705\\] (0*' + id + '[\\t ])');   // tabulación o espacio; ceros a la izquierda
for (const id of ids) {
  const w = document.createTreeWalker(ed(), NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const m = n.textContent.match(mk(id));
    if (m) {
      ed().focus();
      const r = document.createRange(); r.setStart(n, m.index + 1); r.setEnd(n, m.index + 2);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      document.execCommand('insertText', false, '\u274c');
      found.push(id);
      break;
    }
  }
  await new Promise(r => setTimeout(r, 300));
}
let exp = before;
ids.forEach(id => { exp = exp.replace(mk(id), '[\u274c] $1'); });
const ok = ed().innerText === exp;
if (!ok || found.length !== ids.length) throw new Error('NO GUARDAR: ' + JSON.stringify({ found, ok }));
JSON.stringify({ found, lineas: ed().innerText.split('\n').filter(l => ids.some(id => new RegExp('\\] 0*' + id + '[\\t ]').test(l))) });
```

Después:

- **Guardar con un clic real** en "Listo" (herramienta `computer`; en una ventana de 1358×857 queda en (1129, 109), o buscarlo con `find`). Un `.click()` desde JavaScript cierra el editor **sin guardar**.
- Esperar 4 s, volver a abrir el post y confirmar con `document.body.innerText.split('\n').filter(l => /\] 0*(4476|4477)[\t ]/.test(l))`.
- Si el script lanza "NO GUARDAR", el editor queda abierto: revisar las líneas del ID (`ed().innerText.split('\n').filter(l => l.includes('4476'))`) antes de seguir.
