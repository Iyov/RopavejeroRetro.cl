# Referencia técnica de `/compra-retro-pesca`

Fragmentos probados con la compra del 2026-11-04. Se ejecutan con la herramienta de JavaScript de Claude in Chrome.

## Messenger (Chrome de Trina)

### Recorrer el chat y guardar los mensajes

El chat carga los mensajes a medida que se hace scroll. Este fragmento busca el contenedor, sube hasta el principio y baja guardando cada mensaje con su fecha y autor en `window._log`:

```js
const sc = [...document.querySelectorAll('div')].filter(d => d.scrollHeight > d.clientHeight + 50
  && /auto|scroll/.test(getComputedStyle(d).overflowY)
  && d.getBoundingClientRect().left > 370 && d.getBoundingClientRect().left < 500);
const s = window._sc = sc.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
for (let i = 0; i < 15; i++) { s.scrollTop = 0; await new Promise(r => setTimeout(r, 1500)); }
const seen = new Set(), log = []; let last = -1;
for (let k = 0; k < 400; k++) {
  for (const l of s.innerText.split('\n'))
    if (/^Enter, Message sent/.test(l) && !seen.has(l)) { seen.add(l); log.push(l.replace('Enter, Message sent ', '')); }
  for (const im of s.querySelectorAll('img'))
    if (im.naturalWidth > 100 && !seen.has(im.src)) { seen.add(im.src); log.push('[IMG]'); }
  s.scrollTop += 300; await new Promise(r => setTimeout(r, 250));
  if (s.scrollTop === last) break; last = s.scrollTop;
}
window._log = log; log.length;
```

Luego mostrar solo el final (la compra pendiente), por ejemplo `window._log.slice(-60)`, recortando cada línea a ~150 caracteres para que la salida no se trunque. Las fechas de la última semana aparecen como día de la semana (`Thursday 3:04pm`) y las de hoy solo con la hora.

### Juntar las capturas de la compra

Con el chat desplazado hasta el mensaje donde empieza la compra pendiente (ej. `August 6, 2026`), bajar guardando las imágenes:

```js
const s = window._sc;
for (let k = 0; k < 200; k++) { if (s.innerText.includes('August 6, 2026')) break; s.scrollTop -= 600; await new Promise(r => setTimeout(r, 300)); }
const seen = new Set(), out = []; let last = -1;
for (let k = 0; k < 300; k++) {
  for (const im of s.querySelectorAll('img'))
    if (im.naturalWidth > 150 && !seen.has(im.src)) { seen.add(im.src); out.push({ src: im.src, w: im.naturalWidth, h: im.naturalHeight }); }
  s.scrollTop += 250; await new Promise(r => setTimeout(r, 300));
  if (s.scrollTop === last) break; last = s.scrollTop;
}
window._imgs = out; out.map((o, i) => i + ' ' + o.w + 'x' + o.h).join('\n');
```

### Ver las capturas en grande

Las miniaturas del chat son ilegibles. Este visor las muestra sobre la página, de a tres, y después se toma un `screenshot`:

```js
window._show = a => {
  let o = document.getElementById('_ov');
  if (!o) { o = document.createElement('div'); o.id = '_ov';
    o.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#fff;display:flex;gap:6px;padding:2px;align-items:flex-start';
    document.body.appendChild(o); }
  o.innerHTML = a.map(i => '<img src="' + window._imgs[i].src + '" style="height:' + (window._imgs[i].h > 600 ? 840 : 420) + 'px">').join('');
  return 'ok';
};
window._show([0, 1, 2]);
```

Para leer un detalle (títulos de un pack, precios por separado), mostrar una sola imagen ampliada y moverla con márgenes negativos:

```js
document.getElementById('_ov').innerHTML = '<img src="' + window._imgs[4].src + '" style="width:2400px;margin-top:-1150px;margin-left:-1100px">';
```

Al terminar: `document.getElementById('_ov').remove()`.

## Planilla (Brave)

### Leer y ubicar el bloque

```js
const t = await (await fetch('/spreadsheets/d/1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA/export?format=tsv&gid=659622227')).text();
const v = window._v = t.split('\n').map(l => l.split('\t'));   // v[fila-1][col]; 1 = B ... 6 = G
const fila = v.findIndex(r => r[1] === 'Name:' && r[2] === 'Retro Pesca') + 1;
const ship = v.findIndex((r, i) => i > fila && r[2] === 'Shipping') + 1;
fila + ' ' + ship;   // primera fila de producto = fila + 5; filas numeradas = ship - (fila + 5)
```

Si la salida viene bloqueada ("Cookie/query string data"), reemplazar `=`, `&` y `?` por espacios antes de devolverla.

### Pegar los productos

```js
const f = [   // [producto, plataforma, sale, price]; decimales con coma, como texto
  ['Sega Superstars Tennis + Xbox Live Arcade (CIB)', 'X360', 15, 8],
  ['Rainbow Six 3', 'Xbox', 12, '6,5'],
];
window._f = f;
await navigator.clipboard.writeText(f.map(r => r.join('\t')).join('\n'));
```

Luego, con la herramienta `computer`: triple clic en el cuadro de nombre (arriba a la izquierda, ~(50, 68)), escribir `C<primera fila>`, `Return`, `ctrl+shift+v`.

### Verificar

```js
const t = await (await fetch('/spreadsheets/d/1kUTZQhP7A1qsrPtjSDq7p4XCuvBtCu5RW1bQWWYgVQA/export?format=tsv&gid=659622227')).text();
const v = t.split('\n').map(l => l.split('\t'));
const p = FILA_NAME + 5;   // primera fila de producto
const bad = window._f.map((r, i) => [p + i, r, v[p - 1 + i]])
  .filter(([n, r, g]) => g[2] !== r[0] || g[3] !== r[1])
  .map(([n, r, g]) => n + ': ' + g.slice(2, 6).join('|'));
// también revisar el encabezado (v[FILA_NAME-1 .. FILA_NAME+2]) y la fila Total
```
