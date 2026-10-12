'use strict';

// Spec: specs/base/07-catalogo.md
// Catálogo de productos sobre productos.html real, con la hoja de cálculo simulada.
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { abrirPagina, parsear, respuesta } = require('./helpers/pagina');
const { HOJA_URL, PRODUCTOS, csvHoja, muchosProductos } = require('./helpers/datos');

const URL_CATALOGO = 'https://ropavejeroretro.cl/productos';

// Claves vigentes del caché de productos y las de la versión anterior (ver specs/base/02-cache-productos.md)
const CLAVE_DATOS = 'ropavejero_products_cache_v1_1_2';
const CLAVE_TIEMPO = 'ropavejero_cache_timestamp_v1_1_2';
const CLAVE_DATOS_ANTERIOR = 'ropavejero_products_cache_v1_1_1';
const CLAVE_TIEMPO_ANTERIOR = 'ropavejero_cache_timestamp_v1_1_1';

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

const esHoja = url => url.startsWith(HOJA_URL);
const hojaCon = productos => url => (esHoja(url) ? respuesta(csvHoja(productos), { tipo: 'text/csv' }) : undefined);
const cargasHoja = () => pagina.peticiones.filter(p => esHoja(p.url)).length;

// Abre el catálogo e inicia la carga de productos sin esperar a la inicialización diferida
async function abrirCatalogo({ productos = PRODUCTOS, query = '', esperarFilas = true, ...opciones } = {}) {
    pagina = await abrirPagina({
        html: 'productos.html',
        url: URL_CATALOGO + query,
        scripts: 'declarados',
        iniciar: true,
        rutas: hojaCon(productos),
        ...opciones
    });
    pagina.window.initProducts();
    if (esperarFilas) await pagina.hasta(() => filas().length > 0, 'la tabla con productos');
    return pagina;
}

const $ = selector => pagina.document.querySelector(selector);
const $$ = selector => Array.from(pagina.document.querySelectorAll(selector));
const limpio = texto => texto.replace(/\s+/g, ' ').trim();

function filas() {
    return $$('#productsTableBody tr[data-product-id]').map(fila => {
        const celdas = fila.children;
        return {
            num: Number(celdas[1].textContent),
            producto: limpio(celdas[2].childNodes[0].textContent),
            plataforma: celdas[3].textContent,
            precio: celdas[4].textContent,
            stock: limpio(celdas[5].textContent),
            estado: limpio(celdas[0].textContent),
            vendido: celdas[0].querySelector('.status-badge').classList.contains('status-sold'),
            fila
        };
    });
}
const nums = () => filas().map(f => f.num);
const tarjetas = () => $$('#mobileCards .product-card');

function escribir(selector, texto) {
    const campo = $(selector);
    campo.value = texto;
    pagina.despachar(campo, 'input');
}

// Escribe en el buscador y espera a que pase el debounce de 300 ms
async function buscar(texto) {
    escribir('#searchFilter', texto);
    await pagina.esperar(350);
}

function ordenar(criterio) {
    const select = $('#sortFilter');
    select.value = criterio;
    pagina.despachar(select, 'change');
}

function marcarPlataforma(plataforma, marcada = true) {
    const casilla = plataforma === 'all'
        ? $('#platform-all')
        : $$('#platformDropdown input[type="checkbox"]').find(c => c.value === plataforma);
    casilla.checked = marcada;
    pagina.despachar(casilla, 'change');
}

const plataformasMarcadas = () => $$('#platformDropdown input[type="checkbox"]').filter(c => c.checked).map(c => (c.id === 'platform-all' ? 'all' : c.value));
const etiquetas = () => $$('#platformDisplay .platform-tag').map(tag => limpio(tag.textContent));

// Errores de JavaScript sin capturar que registró la página (excepciones en eventos y temporizadores)
const erroresJs = () => pagina.errores.map(error => (error && error.message) || String(error));
// Valor de un dato del modal de detalles, por su etiqueta
const detalleModal = etiqueta => $$('#productModalContent .detail-item')
    .find(item => item.querySelector('label').textContent === etiqueta).querySelector('span').textContent;

// Parámetros de la URL actual, como objeto
const parametros = () => Object.fromEntries(new URLSearchParams(pagina.window.location.search));
const paginaActual = () => `${$('#currentPage').textContent}/${$('#totalPages').textContent}`;

// Elige un idioma con el selector, como lo hace el visitante
async function elegirIdioma(idioma) {
    pagina.click($('#languageBtn'));
    pagina.click($(`.language-option[data-lang="${idioma}"]`));
    await pagina.asentar();
}

// Textos generados de la primera tarjeta móvil y del resto del catálogo, que dependen del idioma
const textosDelCatalogo = () => ({
    etiquetasTarjeta: $$('#mobileCards .product-card:first-child .product-card-label').map(e => e.textContent),
    verDetalles: limpio(tarjetas()[0].querySelector('.view-product-btn span').textContent),
    tituloSiglas: limpio(tarjetas()[0].querySelector('.product-card-siglas-title').textContent),
    siglasTarjeta: Array.from(tarjetas()[0].querySelectorAll('.product-card-sigla-item'), e => limpio(e.textContent)).sort(),
    siglasTabla: Array.from(filas()[0].fila.querySelectorAll('.siglas-tooltip .sigla-item'), e => limpio(e.textContent)).sort(),
    contador: $('#productsCounter').textContent,
    todas: limpio($('#platformDisplay .placeholder').textContent)
});
const EN_ESPANOL = {
    etiquetasTarjeta: ['Plataforma', 'Precio', 'Stock'],
    verDetalles: 'Ver detalles',
    tituloSiglas: 'Siglas:',
    siglasTarjeta: ['BL: Black Label', 'CIB: Caja, Juego, Manual'],
    siglasTabla: ['BL: Black Label', 'CIB: Caja, Juego, Manual'],
    contador: 'Mostrando 6 de 6 productos',
    todas: 'Todas'
};
const EN_INGLES = {
    etiquetasTarjeta: ['Platform', 'Price', 'Stock'],
    verDetalles: 'View details',
    tituloSiglas: 'Abbreviations:',
    siglasTarjeta: ['BL: Black Label', 'CIB: Box, Game, Manual'],
    siglasTabla: ['BL: Black Label', 'CIB: Box, Game, Manual'],
    contador: 'Showing 6 of 6 products',
    todas: 'All'
};

// Un producto con la forma que tiene en el caché (localStorage)
const productoEnCache = (Num, Platform, extra = {}) => (
    { Num, Product: `Juego ${Num}`, Platform, Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0, ...extra }
);
// Caché vigente con el texto indicado (lo normal es una lista de productos en JSON)
const cacheConTexto = texto => ({ [CLAVE_DATOS]: texto, [CLAVE_TIEMPO]: String(Date.now()) });
const cacheCon = productos => cacheConTexto(JSON.stringify(productos));

// Quita una plataforma elegida con la × de su etiqueta
function quitarEtiqueta(plataforma) {
    const boton = $$('#platformDisplay .platform-tag .remove').find(x => x.getAttribute('data-platform') === plataforma);
    assert.ok(boton, `la etiqueta de "${plataforma}" tiene su ×`);
    pagina.click(boton);
}

// ---------- Estado en la URL ----------

test('[PRD-001] los filtros se leen desde la URL, con valores por defecto si faltan o son inválidos', async () => {
    pagina = await abrirPagina({ html: 'productos.html', url: URL_CATALOGO, scripts: 'declarados' });
    const estado = (query) => {
        pagina.window.history.replaceState({}, '', `/productos${query}`);
        return pagina.valor('getProductsUrlState()');
    };

    assert.deepEqual(estado(''), { search: '', sort: 'id-asc', page: 1, platforms: [] });
    assert.deepEqual(estado('?q=mario&sort=price-desc&page=3&platform=SNES,Xbox%20360'), {
        search: 'mario', sort: 'price-desc', page: 3, platforms: ['SNES', 'Xbox 360']
    });
    ['id-asc', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'platform-asc'].forEach(criterio => {
        assert.equal(estado(`?sort=${criterio}`).sort, criterio);
    });
    assert.equal(estado('?sort=drop-table').sort, 'id-asc');
    assert.equal(estado('?page=-2').page, 1);
    assert.equal(estado('?page=0').page, 1);
    assert.equal(estado('?page=abc').page, 1);
    assert.deepEqual(estado('?platform=,%20,PS1,').platforms, ['PS1']);
});

test('[PRD-002] los filtros activos se escriben en la URL y los valores por defecto se omiten', async () => {
    await abrirCatalogo({ productos: muchosProductos(30).concat(PRODUCTOS.map(p => ({ ...p, num: p.num + 1000 }))) });
    const { window: w } = pagina;

    assert.equal(w.location.search, '');

    ordenar('name-desc');
    assert.equal(w.location.search, '?sort=name-desc');

    marcarPlataforma('SNES');
    marcarPlataforma('PS1');
    assert.equal(new URLSearchParams(w.location.search).get('platform'), 'PS1,SNES', 'en orden alfabético');

    marcarPlataforma('all');
    ordenar('id-asc');
    await buscar('juego');
    assert.equal(w.location.search, '?q=juego');
    assert.equal(w.location.pathname, '/productos');

    pagina.click($('#clearFilters'));
    assert.equal(w.location.search, '');
});

test('[PRD-002] fuera de /productos y /productos.html la URL no se modifica', async () => {
    await abrirCatalogo({ url: 'https://ropavejeroretro.cl/otra-pagina?x=1' });

    ordenar('name-desc');

    assert.equal(nums()[0], 102, 'el filtro sí se aplica');
    assert.equal(pagina.window.location.search, '?x=1');
});

test('[PRD-003] un enlace con filtros en la URL abre el catálogo ya filtrado', async () => {
    await abrirCatalogo({ query: '?q=sonic&sort=name-desc' });
    assert.equal($('#searchFilter').value, 'sonic');
    assert.equal($('#sortFilter').value, 'name-desc');
    assert.deepEqual(nums(), [200]);
    await pagina.cerrar();

    await abrirCatalogo({ query: '?platform=SNES,PS1&sort=price-desc' });
    assert.deepEqual(nums(), [102, 101, 23, 50]);
    assert.deepEqual(plataformasMarcadas().sort(), ['PS1', 'SNES']);
    assert.deepEqual(etiquetas().sort(), ['PS1 ×', 'SNES ×']);
    await pagina.cerrar();

    await abrirCatalogo({ query: '?platform=NoExiste' });
    assert.equal(nums().length, PRODUCTOS.length);
    assert.deepEqual(plataformasMarcadas(), ['all']);
});

// ---------- Lectura de la hoja ----------

test('[PRD-004] el CSV de la hoja se convierte en productos válidos y descarta las filas que no lo son', async () => {
    pagina = await abrirPagina({ html: 'productos.html', url: URL_CATALOGO, scripts: 'declarados' });
    const parsearCsv = csv => JSON.parse(pagina.evaluar(`JSON.stringify(parseCSVSecure(${JSON.stringify(csv)}))`));

    const productos = parsearCsv(csvHoja());
    assert.deepEqual(productos.map(p => p.Num), [23, 50, 101, 102, 200, 300], 'omite la fila de título y la de encabezados');
    assert.deepEqual(productos[0], {
        Num: 23, Product: 'Grudge Warriors (BL-CIB)', Platform: 'PS1', Sale: '$15', Neto: '$15.000', Stock: '1', Link: 'DMwPmoFsgMg', Sold: 0
    });
    assert.equal(productos[1].Sold, 1);
    assert.equal(productos[3].Product, 'Zelda, A Link to the Past', 'respeta las comas dentro de comillas');
    assert.equal(productos[4].Neto, 'X');

    // Saltos de línea de Windows, líneas vacías, filas cortas y filas sin número
    const sucio = [
        'encabezado',
        '"7","Juego CRLF","NES","$1","$1.000","1","L","","",""\r',
        '',
        '"8","Fila corta","NES"',
        '"","Sin numero","NES","$1","$1.000","1","L","","",""',
        '"0","Numero cero","NES","$1","$1.000","1","L","","",""',
        '"9","Otro","NES","$1","$1.000","1","L","1","",""'
    ].join('\n');
    assert.deepEqual(parsearCsv(sucio).map(p => [p.Num, p.Product, p.Sold]), [[7, 'Juego CRLF', 0], [9, 'Otro', 1]]);
    assert.ok(pagina.mensajes('warn').some(linea => linea.includes('insufficient columns')));

    assert.throws(() => pagina.evaluar('parseCSVSecure(null)'), /Invalid CSV data type/);
    assert.throws(() => pagina.evaluar('parseCSVSecure("solo una linea")'), /at least header and one data row/);
});

test('[PRD-005] con un caché vigente y válido el catálogo se muestra sin consultar la hoja', async () => {
    // El caché guarda el texto tal como viene en la hoja, sin escapar
    const enCache = [
        { Num: 1, Product: 'Desde caché & Cía <3', Platform: 'NES', Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0 }
    ];
    await abrirCatalogo({
        almacenamiento: {
            [CLAVE_DATOS]: JSON.stringify(enCache),
            [CLAVE_TIEMPO]: String(Date.now())
        }
    });

    assert.deepEqual(filas().map(f => f.producto), ['Desde caché & Cía <3']);
    assert.equal(limpio(tarjetas()[0].querySelector('.product-card-title').textContent), 'Desde caché & Cía <3');
    assert.equal(cargasHoja(), 0);
});

test('[PRD-005] un caché guardado con la versión anterior de las claves no se usa: se consulta la hoja', async () => {
    // Forma antigua: el texto se guardaba ya escapado
    const formaAntigua = [
        { Num: 1, Product: 'Ratchet &amp; Clank', Platform: 'PS2', Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0 }
    ];
    await abrirCatalogo({
        almacenamiento: {
            [CLAVE_DATOS_ANTERIOR]: JSON.stringify(formaAntigua),
            [CLAVE_TIEMPO_ANTERIOR]: String(Date.now())
        }
    });

    assert.equal(cargasHoja(), 1);
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
    assert.equal(pagina.window.localStorage.getItem(CLAVE_DATOS_ANTERIOR), null);
    assert.equal(pagina.window.localStorage.getItem(CLAVE_TIEMPO_ANTERIOR), null);
});

test('[PRD-006] sin caché los productos se piden a la hoja de Google, se muestran y quedan en caché', async () => {
    await abrirCatalogo();
    const { window: w } = pagina;
    const peticion = pagina.peticiones.find(p => esHoja(p.url));

    assert.equal(cargasHoja(), 1);
    assert.match(peticion.url, /tqx=out:csv/);
    assert.equal(peticion.opciones.method, 'GET');
    assert.equal(nums().length, PRODUCTOS.length);
    const guardado = w.localStorage.getItem(CLAVE_DATOS);
    assert.ok(guardado, `los productos quedan en ${CLAVE_DATOS}`);
    assert.deepEqual(JSON.parse(guardado).map(p => p.Num), [23, 50, 101, 102, 200, 300]);
    assert.ok(w.localStorage.getItem(CLAVE_TIEMPO));
});

test('[PRD-006] lo que queda en caché es el texto tal como viene en la hoja, sin escapar', async () => {
    await abrirCatalogo({
        productos: [
            { ...PRODUCTOS[2], num: 1, producto: 'Ratchet & Clank', plataforma: 'PS2' },
            { ...PRODUCTOS[2], num: 2, producto: 'Juego <3', plataforma: 'PS2' }
        ]
    });

    const guardado = pagina.window.localStorage.getItem(CLAVE_DATOS);
    assert.ok(guardado, `los productos quedan en ${CLAVE_DATOS}`);
    assert.deepEqual(JSON.parse(guardado), [
        { Num: 1, Product: 'Ratchet & Clank', Platform: 'PS2', Sale: '$30', Neto: '$30.000', Stock: '2', Link: '', Sold: 0 },
        { Num: 2, Product: 'Juego <3', Platform: 'PS2', Sale: '$30', Neto: '$30.000', Stock: '2', Link: '', Sold: 0 }
    ]);
});

test('[PRD-007] si la hoja falla se reintenta hasta 3 veces y luego se muestra un error con botón de reintento', async () => {
    const casos = [
        { nombre: 'HTTP 500', rutas: url => (esHoja(url) ? respuesta('error', { status: 500, tipo: 'text/plain' }) : undefined) },
        { nombre: 'sin red', rutas: url => (esHoja(url) ? new TypeError('Failed to fetch') : undefined) },
        { nombre: 'CSV vacío', rutas: url => (esHoja(url) ? respuesta('   ', { tipo: 'text/csv' }) : undefined) },
        { nombre: 'CSV sin productos', rutas: url => (esHoja(url) ? respuesta('a,b\n"","x"', { tipo: 'text/csv' }) : undefined) }
    ];

    for (const caso of casos) {
        await abrirCatalogo({ rutas: caso.rutas, esperarFilas: false, antes: () => {} });
        pagina.acelerarTemporizadores();
        await pagina.hasta(() => $('#productsTableBody .fa-exclamation-triangle'), `mensaje de error (${caso.nombre})`, 6000);

        assert.equal(cargasHoja(), 3, caso.nombre);
        assert.match($('#productsTableBody').textContent, /No se pudieron cargar los productos\. Verifica tu conexión a internet\./, caso.nombre);
        assert.match($('#mobileCards').textContent, /No se pudieron cargar los productos/, caso.nombre);
        assert.equal(limpio($('#productsTableBody button').textContent), 'Reintentar', caso.nombre);
        assert.match($('#productsTableBody button').getAttribute('onclick'), /location\.reload\(\)/, caso.nombre);
        assert.equal(pagina.window.localStorage.getItem(CLAVE_DATOS), null, caso.nombre);
        assert.deepEqual(Object.keys(pagina.window.localStorage).filter(clave => clave.includes('products_cache')), [], caso.nombre);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[PRD-007] el error de carga se muestra en inglés si ese es el idioma activo', async () => {
    await abrirCatalogo({
        rutas: url => (esHoja(url) ? respuesta('error', { status: 503, tipo: 'text/plain' }) : undefined),
        almacenamiento: { language: 'en' },
        esperarFilas: false
    });
    pagina.acelerarTemporizadores();
    await pagina.hasta(() => $('#productsTableBody .fa-exclamation-triangle'), 'mensaje de error', 6000);

    assert.match($('#productsTableBody').textContent, /Could not load products\. Check your internet connection\./);
    assert.equal(limpio($('#mobileCards button').textContent), 'Retry');
});

test('[PRD-007] un fallo pasajero de la hoja se recupera en el reintento', async () => {
    let intentos = 0;
    await abrirCatalogo({
        rutas: (url) => {
            if (!esHoja(url)) return undefined;
            intentos++;
            return intentos === 1 ? respuesta('error', { status: 500, tipo: 'text/plain' }) : respuesta(csvHoja(), { tipo: 'text/csv' });
        },
        esperarFilas: false
    });
    pagina.acelerarTemporizadores();
    await pagina.hasta(() => filas().length > 0, 'productos tras el reintento', 6000);

    assert.equal(intentos, 2);
    assert.equal(nums().length, PRODUCTOS.length);
});

// ---------- Tabla y tarjetas ----------

test('[PRD-008] cada producto se muestra en la tabla de escritorio y en las tarjetas móviles', async () => {
    await abrirCatalogo();
    const tabla = filas();

    assert.deepEqual(tabla.map(f => f.num), [23, 50, 101, 102, 200, 300], 'orden por número');
    assert.deepEqual(
        { num: tabla[0].num, producto: tabla[0].producto, plataforma: tabla[0].plataforma, precio: tabla[0].precio, stock: tabla[0].stock },
        { num: 23, producto: 'Grudge Warriors (BL-CIB)', plataforma: 'PS1', precio: '$15.000', stock: '1' }
    );

    // Estado disponible / vendido
    assert.deepEqual(tabla.map(f => f.vendido), [false, true, false, false, false, false]);
    assert.equal(tabla[0].estado, '[✅]');
    assert.equal(tabla[1].estado, '[❌]');

    // Un precio "X" se muestra como 0
    assert.equal(tabla.find(f => f.num === 200).precio, '0');

    const moviles = tarjetas();
    assert.equal(moviles.length, tabla.length);
    const primera = moviles[0];
    assert.equal(primera.getAttribute('data-product-id'), '23');
    assert.equal(limpio(primera.querySelector('.product-card-number').textContent), '#23');
    assert.equal(limpio(primera.querySelector('.product-card-title').textContent), 'Grudge Warriors (BL-CIB)');
    assert.equal(limpio(primera.querySelector('.product-card-price').textContent), '$15.000');
    assert.deepEqual($$('#mobileCards .product-card:first-child .product-card-label').map(e => e.textContent), ['Plataforma', 'Precio', 'Stock']);
    assert.ok(moviles[1].querySelector('.status-badge.status-sold'));
    assert.equal(limpio(moviles[4].querySelector('.product-card-price').textContent), '0');
});

test('[PRD-009] las siglas del nombre se explican en un tooltip (tabla) y en una lista (tarjeta)', async () => {
    await abrirCatalogo();
    const [conSiglas, , sinSiglas] = filas();

    const celda = conSiglas.fila.children[2];
    assert.ok(celda.classList.contains('has-siglas-tooltip'));
    assert.equal(celda.getAttribute('data-has-siglas'), 'true');
    assert.deepEqual(
        Array.from(celda.querySelectorAll('.siglas-tooltip .sigla-item'), e => limpio(e.textContent)).sort(),
        ['BL: Black Label', 'CIB: Caja, Juego, Manual']
    );
    assert.ok(!sinSiglas.fila.children[2].classList.contains('has-siglas-tooltip'));
    assert.equal(sinSiglas.fila.querySelector('.siglas-tooltip'), null);

    const tarjeta = tarjetas()[0];
    assert.equal(limpio(tarjeta.querySelector('.product-card-siglas-title').textContent), 'Siglas:');
    assert.equal(tarjeta.querySelectorAll('.product-card-sigla-item').length, 2);
    assert.equal(tarjetas()[2].querySelector('.product-card-siglas'), null);
});

test('[PRD-010] el contenido de la hoja no puede inyectar HTML ni atributos en la página', async () => {
    const maliciosos = [
        { ...PRODUCTOS[0], num: 1, producto: '<img src=x onerror=alert(1)>', plataforma: '<script>alert(2)</script>' },
        { ...PRODUCTOS[0], num: 2, producto: 'Juego" onmouseover="alert(3)', neto: '<b>gratis</b>', stock: '<i>9</i>', link: '"><svg onload=alert(4)>' }
    ];
    await abrirCatalogo({ productos: maliciosos });
    const contenedores = [$('#productsTableBody'), $('#mobileCards')];

    contenedores.forEach(contenedor => {
        assert.equal(contenedor.querySelectorAll('img, script, svg, b').length, 0);
        assert.equal(contenedor.querySelectorAll('[onmouseover], [onerror], [onload]').length, 0);
    });
    assert.equal($$('.stock-badge i').length, 0);
    assert.ok($('#productsTableBody').textContent.includes('img src=x onerror=alert(1)'), 'el texto se muestra como texto');

    // Escapado una sola vez: el visitante lee exactamente lo que dice la hoja
    const [primero, segundo] = filas();
    assert.equal(primero.producto, '<img src=x onerror=alert(1)>');
    assert.equal(primero.plataforma, '<script>alert(2)</script>');
    assert.equal(segundo.precio, '<b>gratis</b>');
    assert.equal(segundo.stock, '<i>9</i>');
    const tarjeta = tarjetas()[0];
    assert.equal(limpio(tarjeta.querySelector('.product-card-title').textContent), '<img src=x onerror=alert(1)>');
    assert.equal(limpio(tarjeta.querySelector('.product-card-value').textContent), '<script>alert(2)</script>');
    assert.equal(limpio(tarjetas()[1].querySelector('.product-card-price').textContent), '<b>gratis</b>');
    assert.equal(limpio(tarjetas()[1].querySelector('.stock-badge').textContent), '<i>9</i>');

    // El modal de detalles tampoco interpreta el contenido
    pagina.click($('#productsTableBody .view-product-btn'));
    assert.equal($('#productModalContent').querySelectorAll('img, script, svg').length, 0);
    assert.equal($('#product-modal-title').textContent, '<img src=x onerror=alert(1)>');
    assert.equal(detalleModal('Producto'), '<img src=x onerror=alert(1)>');
    assert.equal(detalleModal('Plataforma'), '<script>alert(2)</script>');
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-010] un producto que llega desde el caché con comillas en el nombre y en el enlace no crea atributos en la página', async () => {
    // El CSV de la hoja pierde las comillas al leerse; en el caché (localStorage) el texto llega tal cual
    const enCache = [
        { Num: 1, Product: 'Juego" onmouseover="alert(1)', Platform: 'NES', Sale: '$1', Neto: '$1.000', Stock: '1', Link: 'x" onclick="alert(2)', Sold: 0 },
        { Num: 2, Product: "Juego' onfocus='alert(3)", Platform: 'NES', Sale: '$1', Neto: '$1.000', Stock: '1', Link: "y' onload='alert(4)", Sold: 0 },
        { Num: 3, Product: '"><img src=x onerror=alert(5)>', Platform: 'NES', Sale: '$1', Neto: '$1.000', Stock: '1', Link: '"><svg onload=alert(6)>', Sold: 1 }
    ];
    await abrirCatalogo({
        almacenamiento: {
            [CLAVE_DATOS]: JSON.stringify(enCache),
            [CLAVE_TIEMPO]: String(Date.now())
        }
    });
    assert.equal(cargasHoja(), 0, 'los productos vienen del caché');

    const nombres = enCache.map(p => p.Product);
    const enlaces = enCache.map(p => p.Link);
    const contenedores = { tabla: $('#productsTableBody'), tarjetas: $('#mobileCards') };
    const atributos = elemento => Array.from(elemento.attributes, a => a.name).sort();

    Object.entries(contenedores).forEach(([donde, contenedor]) => {
        // Ningún elemento lleva manejadores de eventos ni atributos que la plantilla no escribe
        const conEventos = Array.from(contenedor.querySelectorAll('*'))
            .filter(elemento => Array.from(elemento.attributes).some(a => /^on/i.test(a.name)));
        assert.deepEqual(conEventos.map(e => e.outerHTML), [], `sin atributos on* en ${donde}`);
        assert.equal(contenedor.querySelectorAll('img, svg, script, [autofocus], [src], [href]').length, 0, donde);

        const ver = Array.from(contenedor.querySelectorAll('.view-product-btn'));
        const instagram = Array.from(contenedor.querySelectorAll('.link-product-btn'));
        assert.equal(ver.length, 3, donde);
        assert.equal(instagram.length, 3, donde);
        ver.forEach(boton => assert.deepEqual(atributos(boton), ['aria-label', 'class', 'data-product-id', 'title'], donde));
        instagram.forEach(boton => assert.deepEqual(atributos(boton), ['aria-label', 'class', 'data-product-link', 'title'], donde));

        // Los atributos conservan el texto original completo
        assert.deepEqual(instagram.map(boton => boton.getAttribute('data-product-link')), enlaces, donde);
        assert.deepEqual(instagram.map(boton => boton.getAttribute('aria-label')), nombres.map(nombre => `Ver ${nombre} en Instagram`), donde);
        ver.forEach((boton, i) => assert.ok(boton.getAttribute('aria-label').endsWith(nombres[i]), `${donde}: ${boton.getAttribute('aria-label')}`));
        ver.forEach(boton => assert.equal(boton.className, 'btn btn-primary btn-small view-product-btn', donde));
        instagram.forEach(boton => assert.equal(boton.className, 'btn btn-primary btn-small link-product-btn', donde));
    });

    // El nombre se lee literal, en la tabla y en las tarjetas
    assert.deepEqual(filas().map(f => f.producto), nombres);
    filas().forEach(f => {
        assert.equal(f.fila.children.length, 7, 'la fila conserva sus 7 celdas');
        assert.equal(f.fila.children[2].children.length, 0, 'el nombre no crea elementos');
        assert.deepEqual(atributos(f.fila), ['data-product-id']);
    });
    assert.deepEqual(tarjetas().map(t => limpio(t.querySelector('.product-card-title').textContent)), nombres);
    tarjetas().forEach(t => {
        assert.equal(t.querySelector('.product-card-title').children.length, 0);
        assert.deepEqual(atributos(t), ['class', 'data-product-id']);
    });
    assert.equal($$('#productsTableBody tr').length, 3);
    assert.equal(tarjetas().length, 3);

    // El modal y el botón de Instagram tampoco interpretan el contenido
    nombres.forEach((nombre, i) => {
        pagina.click(filas()[i].fila.querySelector('.view-product-btn'));
        assert.equal($('#product-modal-title').textContent, nombre);
        assert.equal(detalleModal('Producto'), nombre);
        assert.equal($('#productModalContent').querySelectorAll('img, svg, script, [onmouseover], [onclick], [onfocus], [onload], [onerror]').length, 0);
        pagina.click($('#modalCloseBtn'));
        pagina.click(filas()[i].fila.querySelector('.link-product-btn'));
        pagina.click(tarjetas()[i].querySelector('.link-product-btn'));
    });
    pagina.ventanasAbiertas.forEach(([url, destino, opciones]) => {
        assert.ok(url.startsWith('https://www.instagram.com/p/'), url);
        assert.equal(new URL(url).hostname, 'www.instagram.com');
        assert.equal(destino, '_blank');
        assert.equal(opciones, 'noopener,noreferrer');
    });
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-010] una plataforma con comillas o etiquetas, al elegirla, se muestra como texto en su etiqueta y no crea atributos', async () => {
    const plataformas = ['PS"2" onmouseover="alert(1)', "N'64' onclick='alert(2)", '<img src=x onerror=alert(3)>'];
    const enCache = plataformas.map((Platform, i) => (
        { Num: i + 1, Product: `Juego ${i + 1}`, Platform, Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0 }
    ));
    await abrirCatalogo({
        almacenamiento: {
            [CLAVE_DATOS]: JSON.stringify(enCache),
            [CLAVE_TIEMPO]: String(Date.now())
        }
    });

    plataformas.forEach(plataforma => marcarPlataforma(plataforma));

    assert.deepEqual(etiquetas(), plataformas.map(plataforma => `${plataforma} ×`));
    const quitar = $$('#platformDisplay .platform-tag .remove');
    assert.deepEqual(quitar.map(x => x.getAttribute('data-platform')), plataformas);
    quitar.forEach(x => assert.deepEqual(Array.from(x.attributes, a => a.name).sort(), ['class', 'data-platform']));
    $$('#platformDisplay .platform-tag').forEach(tag => {
        assert.deepEqual(Array.from(tag.attributes, a => a.name), ['class']);
        assert.equal(tag.children.length, 1, 'solo el botón de quitar');
    });
    const sospechosos = $$('#platformDisplay *, #platformDropdown *, #productsTableBody *, #mobileCards *')
        .filter(elemento => elemento.tagName === 'IMG' || Array.from(elemento.attributes).some(a => /^on/i.test(a.name)));
    assert.deepEqual(sospechosos.map(e => e.outerHTML), []);
    assert.deepEqual(filas().map(f => f.plataforma), plataformas);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-011] los nombres con "&", "<" o ">" se muestran tal como vienen en la hoja, en la tabla, la tarjeta y el modal', async () => {
    // El último ya trae "&amp;" escrito en la hoja: se muestra literal, no se convierte en "&"
    const nombres = ['Ratchet & Clank', 'Juego <3', 'Mayor > Menor', 'Uno &amp; Dos'];
    await abrirCatalogo({ productos: nombres.map((producto, i) => ({ ...PRODUCTOS[2], num: i + 1, producto })) });

    // Tabla de escritorio
    assert.deepEqual(filas().map(f => f.producto), nombres);
    filas().forEach(f => assert.equal(f.fila.children[2].children.length, 0, `"${f.producto}" no crea elementos en la celda`));
    assert.deepEqual(
        filas().map(f => f.fila.querySelector('.view-product-btn').getAttribute('aria-label')),
        nombres.map(nombre => `Ver detalles de ${nombre}`)
    );

    // Tarjetas móviles
    assert.deepEqual(tarjetas().map(t => limpio(t.querySelector('.product-card-title').textContent)), nombres);
    tarjetas().forEach(t => assert.equal(t.querySelector('.product-card-title').children.length, 0));

    // Modal de detalles
    nombres.forEach((nombre, i) => {
        pagina.click(filas()[i].fila.querySelector('.view-product-btn'));
        assert.equal($('#product-modal-title').textContent, nombre);
        assert.equal($('#product-modal-title').children.length, 0);
        assert.equal(detalleModal('Producto'), nombre);
        pagina.click($('#modalCloseBtn'));
    });
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-012] si ningún producto coincide con los filtros se informa en la tabla y en las tarjetas', async () => {
    await abrirCatalogo();
    await buscar('no existe este juego');

    assert.equal(filas().length, 0);
    assert.equal(limpio($('#productsTableBody').textContent), 'No hay productos disponibles.');
    assert.equal(limpio($('#mobileCards').textContent), 'No hay productos disponibles.');
    assert.equal($('#productsCounter').textContent, 'Mostrando 0 de 0 productos');
    assert.ok($('#prevPage').disabled);
    assert.ok($('#nextPage').disabled);
    await pagina.cerrar();

    await abrirCatalogo({ query: '?q=nothing+matches', almacenamiento: { language: 'en' }, esperarFilas: false });
    await pagina.hasta(() => $('#productsCounter').textContent === 'Showing 0 of 0 products', 'el contador en cero');
    assert.equal(limpio($('#productsTableBody').textContent), 'No products available.');
    assert.equal(limpio($('#mobileCards').textContent), 'No products available.');
});

test('[PRD-034] después de una búsqueda sin resultados se puede corregir el texto y seguir buscando', async () => {
    await abrirCatalogo();

    await buscar('zeldaa');
    assert.equal(nums().length, 0);
    await buscar('zelda');

    assert.deepEqual(nums(), [102]);
    assert.equal($('#productsCounter').textContent, 'Mostrando 1 de 1 productos');
    assert.equal(pagina.window.location.search, '?q=zelda');
    assert.deepEqual(erroresJs(), [], 'sin errores de JavaScript');

    // Con el desplegable de plataformas abierto y sin resultados, un clic fuera tampoco falla
    await buscar('zeldaa');
    pagina.click($('#platformDisplay'));
    pagina.click(pagina.document.body);
    assert.ok(!$('#platformDropdown').classList.contains('active'));
    assert.deepEqual(erroresJs(), [], 'sin errores al hacer clic fuera del desplegable');

    await buscar('mario');
    assert.deepEqual(nums(), [101]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-035] "Limpiar" restablece el catálogo también después de una búsqueda sin resultados', async () => {
    await abrirCatalogo();

    await buscar('no existe este juego');
    assert.equal(nums().length, 0);
    pagina.click($('#clearFilters'));

    assert.equal(nums().length, PRODUCTOS.length);
    assert.equal(pagina.window.location.search, '');
    assert.equal($('#searchFilter').value, '');
    assert.equal($('#productsCounter').textContent, 'Mostrando 6 de 6 productos');
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.equal($('#platformDropdown .no-platforms-message'), null, 'desaparece el aviso de "sin plataformas"');
    assert.deepEqual(erroresJs(), [], 'sin errores de JavaScript');

    // El catálogo sigue respondiendo después de limpiar
    await buscar('zelda');
    assert.deepEqual(nums(), [102]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-036] la búsqueda ignora los espacios al inicio y al final del texto', async () => {
    await abrirCatalogo();

    await buscar(' zelda ');
    assert.deepEqual(nums(), [102]);
    assert.equal(pagina.window.location.search, '?q=zelda');

    await buscar('\tSNES  ');
    assert.deepEqual(nums(), [101, 102], 'también al buscar por plataforma');

    await buscar('  mario world ');
    assert.deepEqual(nums(), [101], 'los espacios entre palabras sí cuentan');

    await buscar('   ');
    assert.equal(nums().length, PRODUCTOS.length, 'solo espacios equivale a no buscar');
    assert.equal(pagina.window.location.search, '');
    await pagina.cerrar();

    // También al llegar con un enlace
    await abrirCatalogo({ query: '?q=%20zelda%20' });
    assert.deepEqual(nums(), [102]);
});

// ---------- Búsqueda ----------

test('[PRD-013] la búsqueda filtra por nombre o plataforma, sin distinguir mayúsculas, tras 300 ms sin escribir', async () => {
    await abrirCatalogo();

    escribir('#searchFilter', 'zel');
    assert.equal(nums().length, PRODUCTOS.length, 'no filtra mientras se escribe');
    escribir('#searchFilter', 'ZELDA');
    await pagina.esperar(350);
    assert.deepEqual(nums(), [102]);

    await buscar('genesis');
    assert.deepEqual(nums(), [200], 'también busca en la plataforma');

    await buscar('S');
    assert.deepEqual(nums(), [23, 50, 101, 102, 200], 'coincidencia parcial en nombre o plataforma');

    await buscar('');
    assert.equal(nums().length, PRODUCTOS.length);
});

test('[PRD-013] la búsqueda usa el texto tal como está en la hoja: "&" encuentra los nombres que lo llevan', async () => {
    await abrirCatalogo({ productos: PRODUCTOS.concat({ ...PRODUCTOS[2], num: 400, producto: 'Ratchet & Clank', plataforma: 'PS2' }) });

    await buscar('&');
    assert.deepEqual(nums(), [400]);

    await buscar('ratchet & c');
    assert.deepEqual(nums(), [400]);

    await buscar('T & CL');
    assert.deepEqual(nums(), [400], 'sin distinguir mayúsculas');

    // El nombre no contiene "amp": eso solo existe en su forma escapada (&amp;)
    await buscar('amp');
    assert.deepEqual(nums(), []);
    await buscar('&amp;');
    assert.deepEqual(nums(), []);
});

// ---------- Filtro de plataformas ----------

test('[PRD-014] el filtro ofrece "Todas" más cada plataforma del catálogo, sin repetir y en orden alfabético', async () => {
    await abrirCatalogo();

    assert.deepEqual($$('#platformDropdown .multi-select-option').map(o => o.getAttribute('data-value')), ['all', 'Genesis', 'PS1', 'SNES', 'Xbox 360']);
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.equal(limpio($('#platformDisplay .placeholder').textContent), 'Todas');
    assert.ok($('#platformDropdown .platform-search-container'), 'conserva el buscador de plataformas');
});

test('[PRD-015] se pueden combinar varias plataformas; "Todas" y las plataformas concretas se excluyen entre sí', async () => {
    await abrirCatalogo();

    marcarPlataforma('SNES');
    assert.deepEqual(nums(), [101, 102]);
    assert.deepEqual(plataformasMarcadas(), ['SNES'], 'al elegir una plataforma se desmarca "Todas"');

    marcarPlataforma('Genesis');
    assert.deepEqual(nums(), [101, 102, 200]);

    marcarPlataforma('SNES', false);
    assert.deepEqual(nums(), [200]);

    marcarPlataforma('Genesis', false);
    assert.equal(nums().length, PRODUCTOS.length);
    assert.deepEqual(plataformasMarcadas(), ['all'], 'sin plataformas elegidas vuelve a "Todas"');

    marcarPlataforma('PS1');
    marcarPlataforma('all');
    assert.deepEqual(plataformasMarcadas(), ['all'], 'marcar "Todas" desmarca las demás');
    assert.equal(nums().length, PRODUCTOS.length);

    marcarPlataforma('all', false);
    assert.deepEqual(plataformasMarcadas(), ['all'], '"Todas" no se puede desmarcar si no hay otra elegida');
});

test('[PRD-016] las plataformas elegidas se muestran como etiquetas (máximo 3 y un contador) que se pueden quitar', async () => {
    await abrirCatalogo();
    const marcador = $('#platformDisplay .placeholder');

    marcarPlataforma('SNES');
    assert.deepEqual(etiquetas(), ['SNES ×']);
    assert.equal(marcador.style.display, 'none');

    marcarPlataforma('PS1');
    marcarPlataforma('Genesis');
    marcarPlataforma('Xbox 360');
    assert.deepEqual(etiquetas(), ['SNES ×', 'PS1 ×', 'Genesis ×', '+1']);
    assert.equal($('#platformDisplay .counter-tag').title, 'Xbox 360');

    pagina.click($('#platformDisplay .platform-tag .remove'));
    assert.deepEqual(etiquetas(), ['PS1 ×', 'Genesis ×', 'Xbox 360 ×']);
    assert.deepEqual(plataformasMarcadas().sort(), ['Genesis', 'PS1', 'Xbox 360']);
    assert.deepEqual(nums(), [23, 50, 200, 300]);

    $$('#platformDisplay .platform-tag .remove').forEach(() => pagina.click($('#platformDisplay .platform-tag .remove')));
    assert.deepEqual(etiquetas(), []);
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.equal(marcador.style.display, 'block');
    assert.equal(nums().length, PRODUCTOS.length);
});

test('[PRD-017] el desplegable de plataformas se abre y cierra, y su buscador interno filtra las opciones', async () => {
    await abrirCatalogo();
    const desplegable = $('#platformDropdown');
    const combo = $('#comboBoxMulti');
    const visibles = () => $$('#platformDropdown .multi-select-option:not([data-value="all"])')
        .filter(o => !o.classList.contains('search-hidden')).map(o => o.getAttribute('data-value'));

    pagina.click($('#platformDisplay'));
    assert.ok(desplegable.classList.contains('active'));
    assert.equal(combo.getAttribute('aria-expanded'), 'true');

    escribir('#platformSearchInput', 'S');
    assert.deepEqual(visibles(), ['Genesis', 'PS1', 'SNES']);
    escribir('#platformSearchInput', 'xbox');
    assert.deepEqual(visibles(), ['Xbox 360']);

    escribir('#platformSearchInput', 'atari');
    assert.deepEqual(visibles(), []);
    assert.equal($('#platformDropdown .no-search-results').textContent, 'No se encontraron plataformas que contengan "atari"');

    pagina.click(desplegable);
    assert.ok(desplegable.classList.contains('active'), 'un clic dentro no lo cierra');

    pagina.click(pagina.document.body);
    assert.ok(!desplegable.classList.contains('active'));
    assert.equal(combo.getAttribute('aria-expanded'), 'false');
    assert.equal($('#platformSearchInput').value, '', 'al cerrar se limpia el buscador');
    assert.deepEqual(visibles(), ['Genesis', 'PS1', 'SNES', 'Xbox 360']);
    assert.equal($('#platformDropdown .no-search-results'), null);

    pagina.click($('#platformDisplay'));
    pagina.click($('#platformDisplay'));
    assert.ok(!desplegable.classList.contains('active'), 'un segundo clic en el control lo cierra');
});

test('[PRD-018] con una búsqueda activa el desplegable solo ofrece las plataformas que tienen resultados', async () => {
    await abrirCatalogo();
    const ofrecidas = () => $$('#platformDropdown .multi-select-option:not([data-value="all"]):not(.no-platforms-message)')
        .filter(o => o.style.display !== 'none').map(o => o.getAttribute('data-value'));

    await buscar('s');
    assert.deepEqual(ofrecidas(), ['Genesis', 'PS1', 'SNES']);
    assert.ok($('#platformDisplay').classList.contains('filtered'));

    await buscar('nada coincide');
    assert.deepEqual(ofrecidas(), []);
    assert.equal($('#platformDropdown .no-platforms-message').textContent, 'No hay plataformas para esta búsqueda');

    await buscar('');
    assert.deepEqual(ofrecidas(), ['Genesis', 'PS1', 'SNES', 'Xbox 360']);
    assert.ok(!$('#platformDisplay').classList.contains('filtered'));
    assert.equal($('#platformDropdown .no-platforms-message'), null);
});

test('[PRD-019] la búsqueda y el filtro de plataformas se combinan', async () => {
    await abrirCatalogo();

    marcarPlataforma('SNES');
    marcarPlataforma('PS1');
    await buscar('o');

    // "o" descarta Tetris Plus (PS1); la plataforma descarta Sonic (Genesis) y Halo (Xbox 360)
    assert.deepEqual(nums(), [23, 101, 102]);
    assert.deepEqual(plataformasMarcadas().sort(), ['PS1', 'SNES']);
});

test('[PRD-020] la búsqueda se puede combinar con una sola plataforma elegida', async () => {
    await abrirCatalogo();

    marcarPlataforma('SNES');
    await buscar('e');

    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(nums(), [101, 102]);

    // "the" está en Zelda (SNES) y en Sonic (Genesis): la búsqueda descarta a Mario y la plataforma a Sonic
    await buscar('the');
    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(etiquetas(), ['SNES ×']);
    assert.deepEqual(nums(), [102]);
    const params = new URLSearchParams(pagina.window.location.search);
    assert.equal(params.get('q'), 'the');
    assert.equal(params.get('platform'), 'SNES');

    // Al borrar la búsqueda la plataforma sigue elegida
    await buscar('');
    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(nums(), [101, 102]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-020] con una búsqueda ya escrita se puede elegir una sola plataforma', async () => {
    await abrirCatalogo();

    await buscar('the');
    assert.deepEqual(nums(), [102, 200]);
    marcarPlataforma('SNES');

    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(etiquetas(), ['SNES ×']);
    assert.deepEqual(nums(), [102]);
});

test('[PRD-020] un enlace con búsqueda y una sola plataforma abre el catálogo filtrado por ambas', async () => {
    await abrirCatalogo({ query: '?q=the&platform=SNES' });

    assert.equal($('#searchFilter').value, 'the');
    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(etiquetas(), ['SNES ×']);
    assert.deepEqual(nums(), [102]);
    const params = new URLSearchParams(pagina.window.location.search);
    assert.equal(params.get('q'), 'the');
    assert.equal(params.get('platform'), 'SNES');
});

test('[PRD-037] el aviso "No hay plataformas para esta búsqueda" no es una opción del filtro y desaparece al volver a haber resultados', async () => {
    await abrirCatalogo();
    const avisos = () => $$('#platformDropdown .no-platforms-message');
    // Una opción del filtro es un elemento con data-value
    const opciones = () => $$('#platformDropdown [data-value]');
    const valores = () => opciones().map(o => o.getAttribute('data-value'));
    const ofrecidas = () => opciones().filter(o => o.getAttribute('data-value') !== 'all' && o.style.display !== 'none')
        .map(o => o.getAttribute('data-value'));

    await buscar('zzzz');
    assert.equal(avisos().length, 1);
    const aviso = avisos()[0];
    assert.equal(limpio(aviso.textContent), 'No hay plataformas para esta búsqueda');

    // No se puede marcar ni cuenta como plataforma
    assert.equal(aviso.querySelector('input'), null, 'no lleva casilla');
    assert.equal(aviso.hasAttribute('data-value'), false);
    assert.equal(aviso.closest('[data-value]'), null);
    assert.deepEqual(valores(), ['all', 'Genesis', 'PS1', 'SNES', 'Xbox 360'], 'las opciones siguen siendo las plataformas');
    assert.ok(opciones().every(o => !o.textContent.includes('No hay plataformas')));
    assert.equal($$('#platformDropdown input[type="checkbox"]').length, 5);

    pagina.click(aviso);
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.deepEqual(etiquetas(), []);
    assert.equal(pagina.window.location.search, '?q=zzzz');

    // El buscador interno del desplegable no lo trata como plataforma
    pagina.click($('#platformDisplay'));
    escribir('#platformSearchInput', 's');
    escribir('#platformSearchInput', '');
    assert.deepEqual(erroresJs(), [], 'sin errores al usar el buscador de plataformas');

    // Desaparece cuando la búsqueda vuelve a tener resultados, sin vaciar el buscador
    await buscar('zelda');
    assert.deepEqual(avisos(), []);
    assert.deepEqual(nums(), [102]);
    assert.deepEqual(ofrecidas(), ['SNES']);
    assert.deepEqual(erroresJs(), []);

    // Varias búsquedas seguidas sin resultados muestran un solo aviso
    await buscar('zzzz');
    await buscar('yyyy');
    assert.equal(avisos().length, 1);
    await buscar('halo');
    assert.deepEqual(avisos(), []);
    assert.deepEqual(ofrecidas(), ['Xbox 360']);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    // En inglés
    await abrirCatalogo({ almacenamiento: { language: 'en' } });
    await buscar('zzzz');
    assert.equal(limpio(avisos()[0].textContent), 'No platforms for this search');
    assert.equal(avisos()[0].querySelector('input'), null);
    await buscar('zelda');
    assert.deepEqual(avisos(), []);
    assert.deepEqual(nums(), [102]);
});

// ---------- Orden ----------

test('[PRD-021] el selector de orden reordena el catálogo', async () => {
    await abrirCatalogo();

    ordenar('price-asc');
    assert.deepEqual(nums(), [300, 50, 23, 101, 102, 200], 'los productos sin precio quedan al final');
    ordenar('price-desc');
    assert.deepEqual(nums(), [102, 101, 23, 50, 300, 200]);
    ordenar('name-asc');
    assert.deepEqual(nums(), [23, 300, 200, 101, 50, 102]);
    ordenar('name-desc');
    assert.deepEqual(nums(), [102, 50, 101, 200, 300, 23]);
    ordenar('platform-asc');
    assert.deepEqual(nums(), [200, 23, 50, 101, 102, 300]);
    ordenar('id-asc');
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
});

test('[PRD-022] "Limpiar" restablece búsqueda, orden y plataformas', async () => {
    await abrirCatalogo();
    marcarPlataforma('SNES');
    marcarPlataforma('PS1');
    ordenar('price-desc');
    await buscar('e');
    escribir('#platformSearchInput', 'zzz');
    assert.notEqual(nums().length, PRODUCTOS.length);

    pagina.click($('#clearFilters'));

    assert.equal($('#searchFilter').value, '');
    assert.equal($('#sortFilter').value, 'id-asc');
    assert.equal($('#platformSearchInput').value, '');
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.deepEqual(etiquetas(), []);
    assert.equal($('#platformDropdown .no-search-results'), null);
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
    assert.equal($('#productsCounter').textContent, 'Mostrando 6 de 6 productos');
});

// ---------- Paginación y contador ----------

test('[PRD-023] el catálogo se pagina de a 25 productos, con botones anterior/siguiente', async () => {
    await abrirCatalogo({ productos: muchosProductos(60) });
    const pagActual = () => `${$('#currentPage').textContent}/${$('#totalPages').textContent}`;

    assert.equal(nums().length, 25);
    assert.deepEqual([nums()[0], nums()[24]], [1, 25]);
    assert.equal(tarjetas().length, 25);
    assert.equal(pagActual(), '1/3');
    assert.ok($('#prevPage').disabled);
    assert.ok(!$('#nextPage').disabled);

    pagina.click($('#nextPage'));
    assert.deepEqual([nums()[0], nums()[24]], [26, 50]);
    assert.equal(pagActual(), '2/3');
    assert.ok(!$('#prevPage').disabled);
    assert.ok(pagina.scrolls.some(s => s[0] === 'scrollIntoView' && s[1] === 'productos'), 'vuelve al inicio del listado');

    pagina.click($('#nextPage'));
    assert.deepEqual(nums(), [51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);
    assert.equal(pagActual(), '3/3');
    assert.ok($('#nextPage').disabled);

    pagina.click($('#nextPage'));
    assert.equal(pagActual(), '3/3', 'no avanza más allá de la última página');

    pagina.click($('#prevPage'));
    pagina.click($('#prevPage'));
    assert.equal(pagActual(), '1/3');
    assert.ok($('#prevPage').disabled);
});

test('[PRD-024] la página indicada en la URL se respeta y se ajusta si excede el total', async () => {
    await abrirCatalogo({ productos: muchosProductos(60), query: '?page=2' });
    assert.equal($('#currentPage').textContent, '2');
    assert.equal(nums()[0], 26);
    await pagina.cerrar();

    await abrirCatalogo({ productos: muchosProductos(60), query: '?page=99' });
    assert.equal($('#currentPage').textContent, '3');
    assert.equal(nums()[0], 51);
    assert.equal(pagina.window.location.search, '?page=3');
});

test('[PRD-025] al avanzar y retroceder de página la URL refleja la página actual, y la página 1 no lleva "page"', async () => {
    await abrirCatalogo({ productos: muchosProductos(60) });
    const { window: w } = pagina;
    assert.equal(w.location.search, '');

    pagina.click($('#nextPage'));
    assert.equal(w.location.search, '?page=2');

    pagina.click($('#nextPage'));
    assert.equal(w.location.search, '?page=3');

    pagina.click($('#nextPage'));
    assert.equal(w.location.search, '?page=3', 'en la última página no avanza');

    pagina.click($('#prevPage'));
    assert.equal(w.location.search, '?page=2');
    assert.equal(paginaActual(), '2/3');

    pagina.click($('#prevPage'));
    assert.equal(w.location.search, '', 'la página 1 no lleva "page"');
    assert.equal(w.location.pathname, '/productos');

    pagina.click($('#prevPage'));
    assert.equal(w.location.search, '');
    assert.deepEqual(erroresJs(), []);

    // El enlace copiado desde una página del listado abre esa misma página
    pagina.click($('#nextPage'));
    pagina.click($('#nextPage'));
    const enlace = w.location.search;
    await pagina.cerrar();

    await abrirCatalogo({ productos: muchosProductos(60), query: enlace });
    assert.equal(paginaActual(), '3/3');
    assert.equal(nums()[0], 51);
});

test('[PRD-025] al cambiar de página se conservan en la URL la búsqueda, el orden y las plataformas', async () => {
    await abrirCatalogo({ productos: muchosProductos(60).concat(PRODUCTOS.map(p => ({ ...p, num: p.num + 1000 }))) });
    ordenar('name-desc');
    marcarPlataforma('PS2');
    await buscar('juego');
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2' });

    pagina.click($('#nextPage'));
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2', page: '2' });
    assert.equal(nums()[0], 35, 'la segunda página del orden elegido');

    pagina.click($('#nextPage'));
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2', page: '3' });

    pagina.click($('#prevPage'));
    pagina.click($('#prevPage'));
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2' }, 'en la página 1 quedan solo los filtros');
    assert.equal($('#searchFilter').value, 'juego');
    assert.equal($('#sortFilter').value, 'name-desc');
    assert.deepEqual(plataformasMarcadas(), ['PS2']);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-025] al retroceder desde un enlace con página la URL se actualiza y conserva los demás filtros', async () => {
    await abrirCatalogo({ productos: muchosProductos(60), query: '?page=2' });
    pagina.click($('#prevPage'));
    assert.equal(paginaActual(), '1/3');
    assert.equal(pagina.window.location.search, '');
    await pagina.cerrar();

    await abrirCatalogo({ productos: muchosProductos(60), query: '?sort=name-desc&page=3' });
    pagina.click($('#prevPage'));
    assert.deepEqual(parametros(), { sort: 'name-desc', page: '2' });
    pagina.click($('#prevPage'));
    assert.deepEqual(parametros(), { sort: 'name-desc' });
});

test('[PRD-002] fuera de /productos y /productos.html pasar de página tampoco modifica la URL', async () => {
    await abrirCatalogo({ productos: muchosProductos(60), url: 'https://ropavejeroretro.cl/otra-pagina?x=1' });

    pagina.click($('#nextPage'));

    assert.equal(paginaActual(), '2/3', 'la página sí cambia');
    assert.equal(pagina.window.location.search, '?x=1');
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-026] el contador informa cuántos productos se muestran y cuántos hay, en el idioma activo', async () => {
    await abrirCatalogo();
    const contador = $('#productsCounter');
    assert.equal(contador.textContent, 'Mostrando 6 de 6 productos');
    assert.equal(contador.dataset.count, '6');
    assert.equal(contador.dataset.total, '6');

    marcarPlataforma('SNES');
    assert.equal(contador.textContent, 'Mostrando 2 de 2 productos');
    await pagina.cerrar();

    await abrirCatalogo({ productos: muchosProductos(60), almacenamiento: { language: 'en' } });
    assert.equal($('#productsCounter').textContent, 'Showing 25 of 60 products');
});

// ---------- Detalle del producto ----------

test('[PRD-027] "Ver detalles" abre un modal con los datos del producto, sus siglas y el enlace a Instagram', async () => {
    await abrirCatalogo();
    const overlay = $('#productModalOverlay');

    pagina.click(filas()[0].fila.querySelector('.view-product-btn'));

    assert.ok(overlay.classList.contains('active'));
    assert.equal(pagina.document.body.style.overflow, 'hidden');
    assert.equal($('#product-modal-title').textContent, 'Grudge Warriors (BL-CIB)');
    assert.equal($('#productModalContent .status-badge').getAttribute('aria-label'), 'Producto disponible');
    assert.deepEqual(
        $$('#productModalContent .detail-item').map(item => [item.querySelector('label').textContent, item.querySelector('span').textContent]),
        [['Número', '23'], ['Producto', 'Grudge Warriors (BL-CIB)'], ['Plataforma', 'PS1'], ['Precio de Venta', '$15.000'], ['Stock', '1']]
    );
    assert.equal($$('#productModalContent .sigla-detail').length, 2);

    const enlace = $('#productModalContent .modal-instagram-link');
    assert.equal(enlace.href, 'https://www.instagram.com/p/DMwPmoFsgMg/');
    assert.equal(enlace.target, '_blank');
    assert.equal(enlace.rel, 'noopener noreferrer');
    assert.equal(limpio(enlace.textContent), 'Ver en Instagram');
    assert.equal($('#modalCloseBtn').textContent, 'Cerrar');
});

test('[PRD-027] el modal refleja vendido, precio sin definir, producto sin publicación e idioma inglés', async () => {
    await abrirCatalogo({ almacenamiento: { language: 'en' } });
    const abrir = num => pagina.click(filas().find(f => f.num === num).fila.querySelector('.view-product-btn'));
    const detalle = etiqueta => $$('#productModalContent .detail-item').find(i => i.querySelector('label').textContent === etiqueta).querySelector('span').textContent;

    abrir(50);
    assert.equal($('#productModalContent .status-badge').getAttribute('aria-label'), 'Producto vendido');
    assert.ok($('#productModalContent .status-badge').classList.contains('status-sold'));
    assert.equal(detalle('Platform'), 'PS1');
    assert.equal($('#modalCloseBtn').textContent, 'Close');
    pagina.click($('#modalCloseBtn'));

    abrir(200);
    assert.equal(detalle('Sale Price'), '0');
    pagina.click($('#modalCloseBtn'));

    abrir(101);
    assert.equal($$('#productModalContent .sigla-detail').length, 0);
    assert.equal($('#productModalContent .modal-instagram-link').href, 'https://www.instagram.com/ropavejero.retro/', 'sin publicación enlaza al perfil');
    assert.equal(limpio($('#productModalContent .modal-instagram-link').textContent), 'View on Instagram');
});

test('[PRD-028] el modal se cierra con "Cerrar", con la X, con un clic fuera o con Escape', async () => {
    await abrirCatalogo();
    const overlay = $('#productModalOverlay');
    const abrir = () => {
        pagina.click(filas()[0].fila.querySelector('.view-product-btn'));
        assert.ok(overlay.classList.contains('active'));
    };
    const cerrado = (como) => {
        assert.ok(!overlay.classList.contains('active'), como);
        assert.equal(pagina.document.body.style.overflow, '', como);
    };

    abrir();
    pagina.click($('#modalCloseBtn'));
    cerrado('botón Cerrar');

    abrir();
    pagina.click($('#productModalClose'));
    cerrado('botón X');

    abrir();
    pagina.click($('#productModalContent'));
    assert.ok(overlay.classList.contains('active'), 'un clic dentro del modal no lo cierra');
    pagina.click(overlay);
    cerrado('clic fuera');

    abrir();
    pagina.despachar(pagina.document, 'keydown', { key: 'Enter' });
    assert.ok(overlay.classList.contains('active'), 'otras teclas no lo cierran');
    pagina.despachar(pagina.document, 'keydown', { key: 'Escape' });
    cerrado('tecla Escape');

    // Tras varios ciclos el modal sigue abriendo y cerrando una sola vez por acción
    abrir();
    pagina.click($('#productModalClose'));
    cerrado('botón X por segunda vez');

    pagina.window.closeProductModal();
    cerrado('closeProductModal()');
});

test('[PRD-029] el botón de Instagram abre la publicación del producto en una pestaña nueva', async () => {
    await abrirCatalogo();
    const boton = num => filas().find(f => f.num === num).fila.querySelector('.link-product-btn');

    pagina.click(boton(23));
    pagina.click(boton(101));
    pagina.click(tarjetas()[3].querySelector('.link-product-btn'));

    assert.deepEqual(pagina.ventanasAbiertas, [
        ['https://www.instagram.com/p/DMwPmoFsgMg/', '_blank', 'noopener,noreferrer'],
        ['https://www.instagram.com/ropavejero.retro/', '_blank', 'noopener,noreferrer'],
        ['https://www.instagram.com/p/ABC123/', '_blank', 'noopener,noreferrer']
    ]);
});

// ---------- Inicialización ----------

test('[PRD-030] el catálogo se inicializa cuando la sección entra en pantalla, y una sola vez', async () => {
    const observadores = [];
    pagina = await abrirPagina({
        html: 'productos.html',
        url: URL_CATALOGO,
        scripts: 'declarados',
        rutas: hojaCon(PRODUCTOS),
        antes: (w) => {
            w.IntersectionObserver = class {
                constructor(callback, opciones) { this.callback = callback; this.opciones = opciones; this.desconectado = false; observadores.push(this); }
                observe(elemento) { this.elemento = elemento; }
                disconnect() { this.desconectado = true; }
            };
        },
        iniciar: true
    });
    const observador = observadores.find(o => o.elemento && o.elemento.id === 'productos');

    assert.ok(observador, 'observa la sección #productos');
    assert.equal(observador.opciones.rootMargin, '400px');
    assert.equal(cargasHoja(), 0, 'no carga nada mientras la sección no es visible');

    observador.callback([{ isIntersecting: false }], observador);
    assert.equal(cargasHoja(), 0);

    observador.callback([{ isIntersecting: true }], observador);
    await pagina.hasta(() => filas().length > 0, 'la tabla con productos');
    assert.ok(observador.desconectado);

    pagina.window.initProducts();
    observador.callback([{ isIntersecting: true }], observador);
    await pagina.asentar();
    assert.equal(cargasHoja(), 1, 'no se inicializa dos veces');
});

test('[PRD-030] sin IntersectionObserver el catálogo se inicializa solo tras una espera', async () => {
    pagina = await abrirPagina({
        html: 'productos.html',
        url: URL_CATALOGO,
        scripts: 'declarados',
        rutas: hojaCon(PRODUCTOS),
        antes: (w) => {
            const original = w.setTimeout.bind(w);
            w.setTimeout = (fn, _ms, ...args) => original(fn, 0, ...args);
        },
        iniciar: true
    });

    await pagina.hasta(() => filas().length > 0, 'la tabla con productos');
    assert.equal(cargasHoja(), 1);
});

test('[PRD-031] el botón "Actualizar" vacía el caché de productos y recarga la página', () => {
    const boton = parsear('productos.html').getElementById('clearCache');

    assert.match(boton.getAttribute('onclick'), /clearProductsCache\(\)/);
    assert.match(boton.getAttribute('onclick'), /location\.reload\(\)/);
});

// ---------- Idioma ----------

test('[PRD-032] los textos generados del catálogo salen en el idioma activo', async () => {
    await abrirCatalogo({ almacenamiento: { language: 'en' } });

    assert.deepEqual($$('#mobileCards .product-card:first-child .product-card-label').map(e => e.textContent), ['Platform', 'Price', 'Stock']);
    assert.equal(limpio(tarjetas()[0].querySelector('.view-product-btn span').textContent), 'View details');
    assert.equal(limpio(tarjetas()[0].querySelector('.product-card-siglas-title').textContent), 'Abbreviations:');
    assert.ok(limpio(tarjetas()[0].querySelector('.product-card-siglas-list').textContent).includes('Box, Game, Manual'));
    assert.equal(limpio($('#platformDisplay .placeholder').textContent), 'All');
    assert.deepEqual($$('#productsTable thead th').map(th => th.textContent), ['Status', '#', 'Product', 'Platform', 'Price', 'Stock', 'Actions']);
});

test('[PRD-033] al elegir inglés se redibujan la tabla, las tarjetas, el contador y el texto "Todas" del filtro', async () => {
    await abrirCatalogo();
    assert.deepEqual(textosDelCatalogo(), EN_ESPANOL);

    await elegirIdioma('en');

    assert.equal(pagina.window.localStorage.getItem('language'), 'en');
    assert.deepEqual(textosDelCatalogo(), EN_INGLES);
    assert.equal(limpio($('label[for="platform-all"]').textContent), 'All');
    assert.deepEqual($$('#productsTable thead th').map(th => th.textContent), ['Status', '#', 'Product', 'Platform', 'Price', 'Stock', 'Actions']);
    // Los productos son los mismos: solo cambian los textos
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
    assert.equal(tarjetas().length, 6);
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.equal(pagina.window.location.search, '');
    assert.equal(cargasHoja(), 1, 'no se vuelve a consultar la hoja');
    assert.deepEqual(erroresJs(), [], 'sin errores de JavaScript');
});

test('[PRD-033] volver a español también redibuja el catálogo', async () => {
    // Desde un idioma guardado en inglés
    await abrirCatalogo({ almacenamiento: { language: 'en' } });
    assert.deepEqual(textosDelCatalogo(), EN_INGLES);

    await elegirIdioma('es');
    assert.equal(pagina.window.localStorage.getItem('language'), 'es');
    assert.deepEqual(textosDelCatalogo(), EN_ESPANOL);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    // Ida y vuelta en la misma visita
    await abrirCatalogo();
    await elegirIdioma('en');
    assert.deepEqual(textosDelCatalogo(), EN_INGLES);
    await elegirIdioma('es');
    assert.deepEqual(textosDelCatalogo(), EN_ESPANOL);
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-033] al cambiar de idioma se conservan la página, la búsqueda, el orden y las plataformas elegidas', async () => {
    const productos = muchosProductos(40, 'PS2')
        .concat(muchosProductos(30, 'SNES').map(p => ({ ...p, num: p.num + 100 })))
        .concat(muchosProductos(5, 'Genesis').map(p => ({ ...p, num: p.num + 200 })))
        .concat(PRODUCTOS.map(p => ({ ...p, num: p.num + 1000 })));
    await abrirCatalogo({ productos });
    const estado = () => ({
        pagina: paginaActual(),
        nums: nums(),
        tarjetas: tarjetas().map(t => t.getAttribute('data-product-id')),
        busqueda: $('#searchFilter').value,
        orden: $('#sortFilter').value,
        plataformas: plataformasMarcadas().sort(),
        etiquetas: etiquetas()
    });

    ordenar('name-desc');
    marcarPlataforma('PS2');
    marcarPlataforma('SNES');
    await buscar('juego');
    pagina.click($('#nextPage'));
    const antes = estado();
    assert.equal(antes.pagina, '2/3');
    assert.equal(antes.nums.length, 25);
    assert.equal($('#productsCounter').textContent, 'Mostrando 25 de 70 productos');

    await elegirIdioma('en');

    assert.deepEqual(estado(), antes);
    assert.equal($('#productsCounter').textContent, 'Showing 25 of 70 products');
    assert.deepEqual($$('#mobileCards .product-card:first-child .product-card-label').map(e => e.textContent), ['Platform', 'Price', 'Stock']);
    assert.equal($('#platformDisplay .placeholder').style.display, 'none', 'con plataformas elegidas no se muestra "All"');
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2,SNES', page: '2' });
    assert.deepEqual(erroresJs(), []);

    // El catálogo sigue respondiendo, ya en inglés
    pagina.click($('#nextPage'));
    assert.equal(paginaActual(), '3/3');
    assert.equal($('#productsCounter').textContent, 'Showing 25 of 70 products');

    await elegirIdioma('es');
    assert.equal(paginaActual(), '3/3');
    assert.deepEqual(parametros(), { q: 'juego', sort: 'name-desc', platform: 'PS2,SNES', page: '3' });
    assert.equal($('#productsCounter').textContent, 'Mostrando 25 de 70 productos');

    pagina.click($('#clearFilters'));
    assert.equal(limpio($('#platformDisplay .placeholder').textContent), 'Todas');
    assert.equal($('#productsCounter').textContent, 'Mostrando 25 de 81 productos');
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-033] con una búsqueda sin resultados, el aviso de la tabla y el contador pasan al idioma nuevo', async () => {
    await abrirCatalogo();
    await buscar('no existe este juego');
    assert.equal(limpio($('#productsTableBody').textContent), 'No hay productos disponibles.');

    await elegirIdioma('en');

    assert.equal(limpio($('#productsTableBody').textContent), 'No products available.');
    assert.equal(limpio($('#mobileCards').textContent), 'No products available.');
    assert.equal($('#productsCounter').textContent, 'Showing 0 of 0 products');
    assert.equal($('#searchFilter').value, 'no existe este juego');
    assert.equal(pagina.window.location.search, '?q=no+existe+este+juego');
    assert.deepEqual(erroresJs(), []);

    // Se puede seguir buscando
    await buscar('zelda');
    assert.deepEqual(nums(), [102]);
    assert.equal($('#productsCounter').textContent, 'Showing 1 of 1 products');
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-033] cambiar de idioma varias veces no produce errores ni deja el catálogo sin responder', async () => {
    await abrirCatalogo();

    for (const idioma of ['en', 'es', 'en', 'en', 'es', 'en']) {
        await elegirIdioma(idioma);
        assert.deepEqual(erroresJs(), [], `sin errores al elegir "${idioma}"`);
    }
    assert.deepEqual(textosDelCatalogo(), EN_INGLES);
    assert.equal($$('#productsTableBody tr').length, 6, 'la tabla no se duplica');
    assert.equal(tarjetas().length, 6);
    assert.ok(!$('#languageSelectorOverlay').classList.contains('active'), 'el selector de idioma queda cerrado');
    assert.equal(cargasHoja(), 1);

    // Los botones de la tabla y de las tarjetas recién dibujadas siguen funcionando, una sola vez por clic
    pagina.click(filas()[0].fila.querySelector('.view-product-btn'));
    assert.ok($('#productModalOverlay').classList.contains('active'));
    assert.equal($('#product-modal-title').textContent, 'Grudge Warriors (BL-CIB)');
    assert.equal(detalleModal('Platform'), 'PS1');

    // Con el modal abierto, cambiar de idioma no lo cierra ni cambia de producto
    await elegirIdioma('es');
    assert.ok($('#productModalOverlay').classList.contains('active'));
    assert.equal($('#product-modal-title').textContent, 'Grudge Warriors (BL-CIB)');
    pagina.click($('#modalCloseBtn'));
    assert.ok(!$('#productModalOverlay').classList.contains('active'));
    assert.deepEqual(textosDelCatalogo(), EN_ESPANOL);

    pagina.click(tarjetas()[3].querySelector('.link-product-btn'));
    assert.deepEqual(pagina.ventanasAbiertas, [['https://www.instagram.com/p/ABC123/', '_blank', 'noopener,noreferrer']]);

    marcarPlataforma('SNES');
    assert.deepEqual(nums(), [101, 102]);
    await buscar('zelda');
    assert.deepEqual(nums(), [102]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-033] cambiar de idioma antes de que el catálogo haya cargado no produce errores ni anuncia que no hay productos', async () => {
    // La página está abierta pero el catálogo todavía no se inicializa (la sección no ha entrado en pantalla)
    pagina = await abrirPagina({ html: 'productos.html', url: URL_CATALOGO, scripts: 'declarados', iniciar: true, rutas: hojaCon(PRODUCTOS) });

    await elegirIdioma('en');

    assert.deepEqual(erroresJs(), []);
    assert.doesNotMatch($('#productsTableBody').textContent, /No products available|No hay productos disponibles/);
    assert.doesNotMatch($('#mobileCards').textContent, /No products available|No hay productos disponibles/);

    // Al cargar después, sale en el idioma elegido
    pagina.window.initProducts();
    await pagina.hasta(() => filas().length > 0, 'la tabla con productos');
    assert.deepEqual(textosDelCatalogo(), EN_INGLES);
    assert.deepEqual(erroresJs(), []);
});

// ---------- Nombres de plataforma inusuales ----------

// Marca cada plataforma, la quita con su etiqueta y prueba "Limpiar". `plataformas[i]` es la del producto i + 1
function comprobarFiltroConPlataformas(plataformas, total) {
    const { window: w } = pagina;

    plataformas.forEach((plataforma, i) => {
        marcarPlataforma(plataforma);
        assert.deepEqual(plataformasMarcadas(), [plataforma], `se marca "${plataforma}"`);
        assert.deepEqual(nums(), [i + 1], `"${plataforma}" filtra el catálogo`);
        assert.deepEqual(etiquetas(), [`${plataforma} ×`]);
        assert.equal(new URLSearchParams(w.location.search).get('platform'), plataforma);

        quitarEtiqueta(plataforma);
        assert.deepEqual(plataformasMarcadas(), ['all'], `quitar la etiqueta de "${plataforma}" desmarca su casilla`);
        assert.deepEqual(etiquetas(), []);
        assert.equal(nums().length, total, `sin "${plataforma}" vuelve el catálogo completo`);
        assert.equal(w.location.search, '');
        assert.deepEqual(erroresJs(), [], `sin errores de JavaScript con "${plataforma}"`);
    });

    // Varias a la vez, junto a una plataforma corriente: se quita una y las demás siguen elegidas
    plataformas.forEach(plataforma => marcarPlataforma(plataforma));
    marcarPlataforma('NES');
    assert.deepEqual(plataformasMarcadas().sort(), plataformas.concat('NES').sort());
    assert.equal(nums().length, total);
    quitarEtiqueta(plataformas[0]);
    assert.deepEqual(plataformasMarcadas().sort(), plataformas.slice(1).concat('NES').sort());
    assert.equal(nums().length, total - 1);
    assert.ok(!nums().includes(1));

    // Desmarcar la casilla también funciona
    marcarPlataforma(plataformas[1], false);
    assert.deepEqual(plataformasMarcadas().sort(), plataformas.slice(2).concat('NES').sort());

    pagina.click($('#clearFilters'));
    assert.deepEqual(plataformasMarcadas(), ['all']);
    assert.deepEqual(etiquetas(), []);
    assert.equal(nums().length, total);
    assert.equal(w.location.search, '');
    assert.deepEqual(erroresJs(), []);
}

// Comillas dobles, comilla simple, barra invertida y corchetes
const PLATAFORMAS_RARAS = ['PS"2" Slim', "N'64", 'PC\\DOS', '[Import] JP'];
// Las comillas dobles se pierden al leer el CSV de la hoja: las demás sí pueden llegar por ahí
const PLATAFORMAS_RARAS_CSV = ["N'64", 'PC\\DOS', '[Import] JP', 'Win\\'];

test('[PRD-038] se puede marcar, quitar con su etiqueta y limpiar una plataforma con comillas, barra invertida o corchetes en el nombre', async () => {
    const enCache = PLATAFORMAS_RARAS.map((plataforma, i) => productoEnCache(i + 1, plataforma))
        .concat([productoEnCache(90, 'NES'), productoEnCache(91, 'NES')]);
    await abrirCatalogo({ almacenamiento: cacheCon(enCache) });
    assert.equal(cargasHoja(), 0, 'los productos vienen del caché');
    assert.deepEqual(filas().map(f => f.plataforma), PLATAFORMAS_RARAS.concat(['NES', 'NES']));

    comprobarFiltroConPlataformas(PLATAFORMAS_RARAS, enCache.length);
});

test('[PRD-038] el filtro funciona con plataformas con comilla simple, barra invertida o corchetes que llegan desde la hoja', async () => {
    const productos = PLATAFORMAS_RARAS_CSV.map((plataforma, i) => ({ ...PRODUCTOS[2], num: i + 1, producto: `Juego ${i + 1}`, plataforma }))
        .concat([{ ...PRODUCTOS[2], num: 90, plataforma: 'NES' }, { ...PRODUCTOS[2], num: 91, plataforma: 'NES' }]);
    await abrirCatalogo({ productos });
    assert.equal(cargasHoja(), 1);
    assert.deepEqual(filas().map(f => f.plataforma), PLATAFORMAS_RARAS_CSV.concat(['NES', 'NES']), 'el nombre llega intacto desde la hoja');

    comprobarFiltroConPlataformas(PLATAFORMAS_RARAS_CSV, productos.length);
});

test('[PRD-038] un enlace con una plataforma con comillas, barra invertida o corchetes abre el catálogo filtrado', async () => {
    const enCache = PLATAFORMAS_RARAS.map((plataforma, i) => productoEnCache(i + 1, plataforma))
        .concat([productoEnCache(90, 'NES'), productoEnCache(91, 'NES')]);

    for (const [i, plataforma] of PLATAFORMAS_RARAS.entries()) {
        await abrirCatalogo({ query: `?platform=${encodeURIComponent(plataforma)}`, almacenamiento: cacheCon(enCache) });

        assert.deepEqual(plataformasMarcadas(), [plataforma], `enlace con "${plataforma}"`);
        assert.deepEqual(etiquetas(), [`${plataforma} ×`]);
        assert.deepEqual(nums(), [i + 1], `enlace con "${plataforma}"`);
        assert.equal(new URLSearchParams(pagina.window.location.search).get('platform'), plataforma, 'la URL conserva la plataforma');
        assert.deepEqual(erroresJs(), [], `sin errores con "${plataforma}"`);

        // Desde el enlace también se puede quitar con su etiqueta
        quitarEtiqueta(plataforma);
        assert.deepEqual(plataformasMarcadas(), ['all']);
        assert.equal(nums().length, enCache.length);
        assert.deepEqual(erroresJs(), []);
        await pagina.cerrar();
    }

    // Todas en un mismo enlace, junto a una plataforma corriente
    const todas = PLATAFORMAS_RARAS.concat('NES');
    await abrirCatalogo({ query: `?platform=${todas.map(encodeURIComponent).join(',')}`, almacenamiento: cacheCon(enCache) });
    assert.deepEqual(plataformasMarcadas().sort(), [...todas].sort());
    assert.equal(nums().length, enCache.length);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-038] un enlace con plataformas con comilla simple, barra invertida o corchetes que vienen de la hoja abre filtrado', async () => {
    const productos = PLATAFORMAS_RARAS_CSV.map((plataforma, i) => ({ ...PRODUCTOS[2], num: i + 1, producto: `Juego ${i + 1}`, plataforma }))
        .concat([{ ...PRODUCTOS[2], num: 90, plataforma: 'NES' }, { ...PRODUCTOS[2], num: 91, plataforma: 'NES' }]);

    await abrirCatalogo({ productos, query: `?platform=${PLATAFORMAS_RARAS_CSV.map(encodeURIComponent).join(',')}` });

    assert.deepEqual(plataformasMarcadas().sort(), [...PLATAFORMAS_RARAS_CSV].sort());
    assert.deepEqual(nums(), [1, 2, 3, 4]);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    // Una sola, la de la barra invertida
    await abrirCatalogo({ productos, query: '?platform=PC%5CDOS' });
    assert.deepEqual(plataformasMarcadas(), ['PC\\DOS']);
    assert.deepEqual(etiquetas(), ['PC\\DOS ×']);
    assert.deepEqual(nums(), [2]);
    assert.deepEqual(erroresJs(), []);
});

// ---------- Caché dañado ----------

test('[PRD-039] si lo guardado en el caché no es una lista de productos se descarta y se consulta la hoja', async () => {
    const casos = [
        ['un objeto', '{"Num":1,"Product":"Suelto","Platform":"NES"}'],
        ['un texto', '"hola"'],
        ['un número', '42'],
        ['null', 'null'],
        ['una lista vacía', '[]'],
        ['un JSON incompleto', '[{"Num":1,"Product":"Cortado"']
    ];

    for (const [nombre, guardado] of casos) {
        await abrirCatalogo({ almacenamiento: cacheConTexto(guardado) });

        assert.equal(cargasHoja(), 1, `${nombre}: se consulta la hoja`);
        assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300], nombre);
        assert.equal(tarjetas().length, 6, nombre);
        assert.equal($('#productsCounter').textContent, 'Mostrando 6 de 6 productos', nombre);
        // Lo dañado no queda guardado: el caché pasa a tener los productos de la hoja
        assert.deepEqual(JSON.parse(pagina.window.localStorage.getItem(CLAVE_DATOS)).map(p => p.Num), [23, 50, 101, 102, 200, 300], nombre);
        assert.deepEqual(erroresJs(), [], `${nombre}: sin errores de JavaScript`);
        await pagina.cerrar();
    }
    pagina = null;
});

// Abre el catálogo con ese caché y comprueba que solo se ven los dos productos válidos (#7 NES y #8 SNES)
async function comprobarCacheConInvalidos(guardado) {
    // La hoja simulada trae otros productos: si se vieran, el caché se habría descartado entero
    await abrirCatalogo({ almacenamiento: cacheCon(guardado) });

    assert.deepEqual(nums(), [7, 8], 'se muestran los productos válidos del caché');
    assert.deepEqual(filas().map(f => f.producto), ['Juego 7', 'Juego 8']);
    assert.deepEqual(tarjetas().map(t => t.getAttribute('data-product-id')), ['7', '8']);
    assert.equal($('#productsCounter').textContent, 'Mostrando 2 de 2 productos', 'el contador no cuenta los inválidos');
    assert.equal(paginaActual(), '1/1');
    assert.deepEqual(
        $$('#platformDropdown .multi-select-option').map(o => o.getAttribute('data-value')),
        ['all', 'NES', 'SNES'],
        'el filtro no ofrece plataformas de elementos inválidos'
    );
    assert.deepEqual(erroresJs(), [], 'sin errores de JavaScript');

    // El catálogo responde con normalidad
    marcarPlataforma('SNES');
    assert.deepEqual(nums(), [8]);
    marcarPlataforma('all');
    ordenar('name-desc');
    assert.deepEqual(nums(), [8, 7]);
    await buscar('juego 7');
    assert.deepEqual(nums(), [7]);
    assert.equal($('#productsCounter').textContent, 'Mostrando 1 de 1 productos');
    pagina.click(filas()[0].fila.querySelector('.view-product-btn'));
    assert.equal($('#product-modal-title').textContent, 'Juego 7');
    pagina.click($('#modalCloseBtn'));
    pagina.click($('#clearFilters'));
    assert.deepEqual(nums(), [7, 8]);
    assert.deepEqual(erroresJs(), []);
}

test('[PRD-039] en un caché con null, números o textos mezclados se ignoran esos elementos y se muestran los productos válidos', async () => {
    await comprobarCacheConInvalidos([null, productoEnCache(7, 'NES'), 15, 'un texto', true, productoEnCache(8, 'SNES'), null]);
});

test('[PRD-039] en un caché con objetos sin número de producto se ignoran esos elementos y se muestran los válidos', async () => {
    const sinNum = { Product: 'Sin número', Platform: 'Fantasma', Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0 };
    await comprobarCacheConInvalidos([sinNum, productoEnCache(7, 'NES'), {}, [1, 2], productoEnCache(8, 'SNES'), { ...sinNum, Platform: 'Otra' }]);
});

test('[PRD-039] en un caché con productos cuya plataforma no es texto se ignoran esos elementos y se muestran los válidos', async () => {
    await comprobarCacheConInvalidos([
        productoEnCache(7, 'NES'),
        productoEnCache(5, 42),
        productoEnCache(6, { nombre: 'PS1' }),
        productoEnCache(8, 'SNES'),
        productoEnCache(9, ['PS1'])
    ]);
});

test('[PRD-039] si ningún elemento del caché es un producto válido se consulta la hoja', async () => {
    const sinNum = { Product: 'Sin número', Platform: 'Fantasma', Sale: '$1', Neto: '$1.000', Stock: '1', Link: '', Sold: 0 };
    const casos = [
        ['solo null, números y textos', [null, 3, 'x', false]],
        ['solo objetos sin número', [sinNum, {}, { ...sinNum, Product: 'Otro' }]],
        ['solo plataformas que no son texto', [productoEnCache(5, 42), productoEnCache(6, { nombre: 'PS1' })]],
        ['de todo un poco', [null, 3, 'x', sinNum, productoEnCache(5, 42), [], {}]]
    ];

    for (const [nombre, guardado] of casos) {
        await abrirCatalogo({ almacenamiento: cacheCon(guardado) });

        assert.equal(cargasHoja(), 1, `${nombre}: se consulta la hoja`);
        assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300], nombre);
        assert.equal(tarjetas().length, 6, nombre);
        assert.equal($('#productsCounter').textContent, 'Mostrando 6 de 6 productos', nombre);
        assert.deepEqual(
            $$('#platformDropdown .multi-select-option').map(o => o.getAttribute('data-value')),
            ['all', 'Genesis', 'PS1', 'SNES', 'Xbox 360'],
            nombre
        );
        assert.deepEqual(erroresJs(), [], `${nombre}: sin errores de JavaScript`);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[PRD-039] con un caché parcialmente dañado no se consulta la hoja y el caché vence a su hora', async () => {
    const guardado = cacheCon([null, productoEnCache(7, 'NES'), 'un texto', productoEnCache(8, 'SNES'), productoEnCache(5, 42)]);
    // Guardado hace 4 minutos: sigue vigente (dura 5)
    guardado[CLAVE_TIEMPO] = String(Date.now() - 4 * 60 * 1000);
    await abrirCatalogo({ almacenamiento: guardado });

    assert.deepEqual(nums(), [7, 8]);
    assert.equal(cargasHoja(), 0, 'los productos válidos del caché se muestran sin consultar la hoja');
    // La antigüedad del caché no se renueva: el catálogo incompleto no dura más que el caché original
    assert.equal(pagina.window.localStorage.getItem(CLAVE_TIEMPO), guardado[CLAVE_TIEMPO]);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    // El mismo caché, ya vencido: se consulta la hoja y vuelve el catálogo completo
    guardado[CLAVE_TIEMPO] = String(Date.now() - 6 * 60 * 1000);
    await abrirCatalogo({ almacenamiento: guardado });
    assert.equal(cargasHoja(), 1);
    assert.deepEqual(nums(), [23, 50, 101, 102, 200, 300]);
    assert.deepEqual(JSON.parse(pagina.window.localStorage.getItem(CLAVE_DATOS)).map(p => p.Num), [23, 50, 101, 102, 200, 300]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-039] en un caché con campos de tipos inesperados el catálogo se muestra sin errores y se ignoran los que no tienen número válido', async () => {
    const sinPlataforma = productoEnCache(4, 'x');
    delete sinPlataforma.Platform;
    await abrirCatalogo({
        almacenamiento: cacheCon([
            productoEnCache(3, null),                       // sin plataforma, como una fila de la hoja con esa celda vacía
            sinPlataforma,
            productoEnCache('7', 'NES'),                    // número guardado como texto
            productoEnCache(8, 'SNES', { Product: 12345, Stock: 2, Neto: null, Sale: {}, Link: 99, Sold: 'quizás' }),
            productoEnCache(0, 'Cero'),
            productoEnCache(-5, 'Negativa'),
            productoEnCache('abc', 'Texto'),
            productoEnCache(null, 'Nula')
        ])
    });

    assert.equal(cargasHoja(), 0);
    assert.deepEqual(nums(), [3, 4, 7, 8]);
    assert.deepEqual(filas().map(f => f.plataforma), ['', '', 'NES', 'SNES']);
    assert.equal(filas()[3].producto, '12345');
    assert.equal(tarjetas().length, 4);
    assert.equal($('#productsCounter').textContent, 'Mostrando 4 de 4 productos');
    assert.deepEqual(
        $$('#platformDropdown .multi-select-option').map(o => o.getAttribute('data-value')),
        ['all', 'NES', 'SNES'],
        'ni la plataforma vacía ni las de elementos sin número válido se ofrecen en el filtro'
    );
    assert.deepEqual(erroresJs(), []);

    // El catálogo responde: ordenar, filtrar, buscar y abrir el detalle de cada producto
    ordenar('price-desc');
    ordenar('name-asc');
    ordenar('platform-asc');
    ordenar('id-asc');
    for (const fila of filas()) {
        pagina.click(fila.fila.querySelector('.view-product-btn'));
        assert.ok($('#productModalOverlay').classList.contains('active'), `detalle del #${fila.num}`);
        pagina.click($('#modalCloseBtn'));
    }
    marcarPlataforma('NES');
    assert.deepEqual(nums(), [7]);
    marcarPlataforma('all');
    await buscar('12345');
    assert.deepEqual(nums(), [8]);
    pagina.click($('#clearFilters'));
    assert.deepEqual(nums(), [3, 4, 7, 8]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-003] una plataforma de la URL que coincide con el valor interno de la casilla "Todas" se ignora como cualquier otra que no existe', async () => {
    // La casilla "Todas" no declara value, así que el navegador le da "on": no es una plataforma
    for (const query of ['?platform=on', '?platform=on,NoExiste']) {
        await abrirCatalogo({ query });

        assert.deepEqual(plataformasMarcadas(), ['all'], query);
        assert.deepEqual(etiquetas(), [], query);
        assert.equal(nums().length, PRODUCTOS.length, `${query}: se muestra el catálogo completo`);
        assert.equal(limpio($('#platformDisplay .placeholder').textContent), 'Todas', query);
        assert.deepEqual(erroresJs(), [], query);
        await pagina.cerrar();
    }

    // Junto a una plataforma real, solo cuenta la real
    await abrirCatalogo({ query: '?platform=on,SNES' });
    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(etiquetas(), ['SNES ×']);
    assert.deepEqual(nums(), [101, 102]);
    assert.equal(new URLSearchParams(pagina.window.location.search).get('platform'), 'SNES');
    assert.deepEqual(erroresJs(), []);
});

// ---------- Plataformas con "%" o coma en la URL ----------

const PRODUCTOS_CON_RARAS = PRODUCTOS.concat([
    { ...PRODUCTOS[2], num: 401, producto: 'Lote retro', plataforma: '100% Retro' },
    { ...PRODUCTOS[2], num: 402, producto: 'Lote variado', plataforma: 'Juegos, Varios' }
]);

// Marca las plataformas, toma la URL que quedó y la abre en una página nueva: debe verse lo mismo
async function comprobarIdaYVuelta(seleccion, numsEsperados) {
    const marcadas = [...seleccion].sort();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS });
    assert.deepEqual(filas().map(f => f.plataforma).slice(-2), ['100% Retro', 'Juegos, Varios'], 'el nombre llega intacto desde la hoja');
    seleccion.forEach(plataforma => marcarPlataforma(plataforma));
    assert.deepEqual(plataformasMarcadas().sort(), marcadas);
    assert.deepEqual(nums(), numsEsperados);
    const enlace = pagina.window.location.search;
    const enUrl = new URLSearchParams(enlace).get('platform');
    assert.ok(enUrl, `las plataformas quedan en la URL: ${enlace}`);
    // La coma solo separa plataformas: la que forma parte de un nombre no cuenta como separador
    assert.equal(enUrl.split(',').length, seleccion.length, `"${enUrl}" lista ${seleccion.length} plataforma(s)`);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: enlace });
    assert.deepEqual(plataformasMarcadas().sort(), marcadas, `al abrir ${enlace} quedan marcadas`);
    assert.deepEqual(etiquetas().sort(), marcadas.map(plataforma => `${plataforma} ×`).sort());
    assert.deepEqual(nums(), numsEsperados, `al abrir ${enlace} queda filtrado`);
    assert.equal(pagina.window.location.search, enlace, 'la URL no cambia al abrirla');
    assert.deepEqual(erroresJs(), []);

    // Sigue funcionando después de abrir el enlace
    quitarEtiqueta(seleccion[0]);
    assert.deepEqual(plataformasMarcadas().sort(), seleccion.length > 1 ? marcadas.filter(p => p !== seleccion[0]) : ['all']);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();
    pagina = null;
}

test('[PRD-040] una plataforma con "%" en el nombre se conserva al escribirse en la URL y al abrir ese enlace', async () => {
    await comprobarIdaYVuelta(['100% Retro'], [401]);
    await comprobarIdaYVuelta(['100% Retro', 'SNES'], [101, 102, 401]);
});

test('[PRD-040] una plataforma con coma en el nombre se conserva al escribirse en la URL y al abrir ese enlace', async () => {
    await comprobarIdaYVuelta(['Juegos, Varios'], [402]);
    await comprobarIdaYVuelta(['Juegos, Varios', 'PS1', 'SNES'], [23, 50, 101, 102, 402]);
});

test('[PRD-040] plataformas con "%" y con coma se pueden combinar entre sí en un mismo enlace', async () => {
    await comprobarIdaYVuelta(['100% Retro', 'Juegos, Varios'], [401, 402]);
    await comprobarIdaYVuelta(['Xbox 360', 'Juegos, Varios', '100% Retro'], [300, 401, 402]);
});

test('[PRD-040] un enlace con la búsqueda, el orden y una plataforma con "%" o coma abre todo tal como quedó', async () => {
    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS });
    ordenar('name-desc');
    marcarPlataforma('100% Retro');
    marcarPlataforma('Juegos, Varios');
    marcarPlataforma('SNES');
    await buscar('lote');
    assert.deepEqual(nums(), [402, 401]);
    const enlace = pagina.window.location.search;
    await pagina.cerrar();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: enlace });
    assert.equal($('#searchFilter').value, 'lote');
    assert.equal($('#sortFilter').value, 'name-desc');
    assert.deepEqual(nums(), [402, 401]);
    assert.deepEqual(plataformasMarcadas().sort(), ['100% Retro', 'Juegos, Varios']);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-040] los enlaces actuales siguen funcionando y la URL de las plataformas sin "%" ni coma no cambia de forma', async () => {
    // Enlaces que ya circulan, con un catálogo que además tiene plataformas con "%" y coma
    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=SNES,PS1' });
    assert.deepEqual(plataformasMarcadas().sort(), ['PS1', 'SNES']);
    assert.deepEqual(nums(), [23, 50, 101, 102]);
    assert.equal(new URLSearchParams(pagina.window.location.search).get('platform'), 'PS1,SNES');
    await pagina.cerrar();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=Xbox%20360' });
    assert.deepEqual(plataformasMarcadas(), ['Xbox 360']);
    assert.deepEqual(nums(), [300]);
    assert.equal(new URLSearchParams(pagina.window.location.search).get('platform'), 'Xbox 360');
    await pagina.cerrar();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=SNES%2CXbox+360&sort=price-desc' });
    assert.deepEqual(plataformasMarcadas().sort(), ['SNES', 'Xbox 360']);
    assert.deepEqual(nums(), [102, 101, 300]);
    await pagina.cerrar();

    // La URL que se escribe para plataformas corrientes es la de siempre
    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS });
    const { window: w } = pagina;
    marcarPlataforma('SNES');
    assert.equal(w.location.search, '?platform=SNES');
    marcarPlataforma('PS1');
    assert.equal(new URLSearchParams(w.location.search).get('platform'), 'PS1,SNES');
    marcarPlataforma('Xbox 360');
    assert.equal(new URLSearchParams(w.location.search).get('platform'), 'PS1,SNES,Xbox 360');

    // También junto a una plataforma con "%": las corrientes se escriben igual
    marcarPlataforma('100% Retro');
    const partes = new URLSearchParams(w.location.search).get('platform').split(',');
    assert.equal(partes.length, 4);
    ['PS1', 'SNES', 'Xbox 360'].forEach(plataforma => assert.ok(partes.includes(plataforma), `${plataforma} en ${partes.join(' | ')}`));
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-040] un enlace escrito a mano con el "%" de la plataforma sin doble codificación también abre filtrado', async () => {
    // "100%25%20Retro" es "100% Retro": no se puede decodificar por segunda vez y se toma tal cual
    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=100%25%20Retro' });
    assert.deepEqual(plataformasMarcadas(), ['100% Retro']);
    assert.deepEqual(nums(), [401]);
    assert.deepEqual(erroresJs(), []);
    await pagina.cerrar();

    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=SNES,100%25%20Retro' });
    assert.deepEqual(plataformasMarcadas().sort(), ['100% Retro', 'SNES']);
    assert.deepEqual(nums(), [101, 102, 401]);
    assert.deepEqual(erroresJs(), []);
});

test('[PRD-040] un valor de "platform" imposible de decodificar no produce errores y el catálogo se muestra', async () => {
    for (const query of ['?platform=100%25%', '?platform=%', '?platform=%ZZ&sort=name-desc', '?platform=%E0%A4%A']) {
        await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query });

        assert.equal(nums().length, PRODUCTOS_CON_RARAS.length, `${query}: se muestra el catálogo completo`);
        assert.deepEqual(plataformasMarcadas(), ['all'], query);
        assert.deepEqual(erroresJs(), [], `${query}: sin errores de JavaScript`);

        // Y el catálogo sigue respondiendo
        marcarPlataforma('SNES');
        assert.deepEqual(nums().sort(), [101, 102], query);
        assert.deepEqual(erroresJs(), [], query);
        await pagina.cerrar();
    }

    // El valor ilegible no impide leer los demás
    await abrirCatalogo({ productos: PRODUCTOS_CON_RARAS, query: '?platform=SNES,%ZZ' });
    assert.deepEqual(plataformasMarcadas(), ['SNES']);
    assert.deepEqual(nums(), [101, 102]);
    assert.deepEqual(erroresJs(), []);
});
