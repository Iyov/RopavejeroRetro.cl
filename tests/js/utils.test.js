'use strict';

// Spec: specs/base/01-utilidades.md
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { abrirPagina } = require('./helpers/pagina');

let pagina;
let w;

before(async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/utils.js'] });
    w = pagina.window;
});

after(() => pagina.cerrar());

const producto = (num, nombre, plataforma, neto) => ({ Num: num, Product: nombre, Platform: plataforma, Neto: neto });
const nums = lista => Array.from(lista, p => p.Num);

test('[UTL-001] sanitizeHTML escapa las etiquetas y devuelve vacío si no recibe un string', () => {
    assert.equal(w.sanitizeHTML('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
    assert.equal(w.sanitizeHTML('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
    assert.equal(w.sanitizeHTML('Tom & Jerry'), 'Tom &amp; Jerry');
    assert.equal(w.sanitizeHTML('Zelda (CIB)'), 'Zelda (CIB)');
    assert.equal(w.sanitizeHTML(null), '');
    assert.equal(w.sanitizeHTML(42), '');
    assert.equal(w.sanitizeHTML(undefined), '');
});

test('[UTL-002] sanitizeURL acepta solo http/https de los dominios de la lista blanca', () => {
    const permitidas = [
        'https://www.instagram.com/p/DMwPmoFsgMg/',
        'https://instagram.com/ropavejero.retro/',
        'https://wa.me/56912345678',
        'https://docs.google.com/spreadsheets/d/abc',
        'https://ropavejeroretro.cl/productos',
        'http://www.youtube.com/watch?v=1',
        'https://scontent.cdninstagram.instagram.com/x.jpg'
    ];
    permitidas.forEach(url => assert.equal(w.sanitizeURL(url), url, url));

    const rechazadas = [
        'https://evil.example.com/',
        'https://instagram.com.evil.example/',
        'https://notinstagram.com/',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'ftp://instagram.com/archivo',
        'img/RopavejeroLogo_256.png',
        '',
        'no es una url'
    ];
    rechazadas.forEach(url => assert.equal(w.sanitizeURL(url), '#', url));

    assert.equal(w.sanitizeURL(null), '#');
    assert.equal(w.sanitizeURL(123), '#');
});

// Valores que intentan cerrar el atributo en el que van, abrir otro o abrir una etiqueta
const VALORES_DE_ATRIBUTO = [
    'Zelda (CIB)',
    'Ratchet & Clank',
    'Juego" onmouseover="alert(1)',
    "Juego' onmouseover='alert(1)",
    'x" onclick="alert(2)',
    "x' onclick='alert(2)",
    '"><img src=x onerror=alert(3)>',
    "'><script>alert(4)</script>",
    '" autofocus onfocus=alert(5) x="',
    'Mezcla "dobles" y \'simples\' <b>&</b>',
    'Ya escapado: &quot; &#39; &amp; &lt;',
    '"',
    "'",
    ''
];

test('[UTL-009] sanitizeAttribute escapa etiquetas, "&" y comillas dobles y simples, y devuelve vacío si no recibe un string', () => {
    assert.equal(w.sanitizeAttribute('Zelda (CIB)'), 'Zelda (CIB)');
    assert.equal(w.sanitizeAttribute('Tom & Jerry'), 'Tom &amp; Jerry');
    assert.equal(w.sanitizeAttribute('<b>x</b>'), '&lt;b&gt;x&lt;/b&gt;');
    assert.equal(w.sanitizeAttribute('Juego" onmouseover="alert(1)'), 'Juego&quot; onmouseover=&quot;alert(1)');
    assert.equal(w.sanitizeAttribute("Juego' onmouseover='alert(1)"), 'Juego&#39; onmouseover=&#39;alert(1)');
    assert.equal(w.sanitizeAttribute('"><img src=x onerror=alert(1)>'), '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;');
    assert.equal(w.sanitizeAttribute(''), '');

    // El resultado nunca contiene comillas ni signos de etiqueta sin escapar
    VALORES_DE_ATRIBUTO.forEach(valor => {
        assert.doesNotMatch(w.sanitizeAttribute(valor), /["'<>]/, JSON.stringify(valor));
    });

    assert.equal(w.sanitizeAttribute(null), '');
    assert.equal(w.sanitizeAttribute(undefined), '');
    assert.equal(w.sanitizeAttribute(42), '');
    assert.equal(w.sanitizeAttribute({ toString: () => '" onclick="alert(1)' }), '');
    assert.equal(w.sanitizeAttribute(['"']), '');
});

test('[UTL-009] un valor pasado por sanitizeAttribute no puede cerrar el atributo, entre comillas dobles ni simples', () => {
    const contenedor = w.document.createElement('div');
    const plantillas = {
        'comillas dobles': valor => `<button class="btn" data-valor="${valor}" title="fijo">texto</button>`,
        'comillas simples': valor => `<button class='btn' data-valor='${valor}' title='fijo'>texto</button>`
    };

    Object.entries(plantillas).forEach(([comillas, plantilla]) => {
        VALORES_DE_ATRIBUTO.forEach(valor => {
            const caso = `${comillas}: ${JSON.stringify(valor)}`;
            contenedor.innerHTML = plantilla(w.sanitizeAttribute(valor));

            assert.equal(contenedor.children.length, 1, `un solo elemento (${caso})`);
            const boton = contenedor.firstElementChild;
            assert.equal(boton.tagName, 'BUTTON', caso);
            assert.deepEqual(Array.from(boton.attributes, a => a.name), ['class', 'data-valor', 'title'], `sin atributos extra (${caso})`);
            assert.equal(boton.getAttribute('data-valor'), valor, `el atributo conserva el texto original (${caso})`);
            assert.equal(boton.getAttribute('class'), 'btn', caso);
            assert.equal(boton.getAttribute('title'), 'fijo', caso);
            assert.equal(boton.children.length, 0, `sin elementos dentro (${caso})`);
            assert.equal(boton.textContent, 'texto', caso);
            assert.equal(contenedor.querySelectorAll('img, script, [onmouseover], [onclick], [onerror], [onfocus], [autofocus]').length, 0, caso);
            assert.equal(contenedor.textContent, 'texto', `nada se escapa fuera del elemento (${caso})`);
        });
    });
});

test('[UTL-010] normalizeProductData normaliza tipos y valores por defecto sin escapar el texto', () => {
    assert.deepEqual({ ...w.normalizeProductData({
        Num: '23', Product: 'Grudge <b>Warriors</b>', Platform: 'PS1', Sale: '$15', Neto: '$15.000', Stock: '1', Link: 'DMwPmoFsgMg', Sold: ''
    }) }, {
        Num: 23, Product: 'Grudge <b>Warriors</b>', Platform: 'PS1', Sale: '$15', Neto: '$15.000', Stock: '1', Link: 'DMwPmoFsgMg', Sold: 0
    });

    // El texto queda tal como viene: ni "&", ni etiquetas, ni comillas se escapan
    const crudo = {
        Num: 7, Product: 'Ratchet & Clank "GH" \'PAL\' <3', Platform: 'R&D <x>', Sale: '<$1>', Neto: '$1.000 & más', Stock: '"2"', Link: 'a&b"c', Sold: '1'
    };
    assert.deepEqual({ ...w.normalizeProductData(crudo) }, { ...crudo, Sold: 1 });
    assert.equal(w.normalizeProductData({ Product: 'Uno &amp; Dos' }).Product, 'Uno &amp; Dos', 'un texto que ya trae "&amp;" tampoco se toca');

    // Valores por defecto
    assert.deepEqual({ ...w.normalizeProductData({}) }, {
        Num: 0, Product: '', Platform: '', Sale: 'X', Neto: 'X', Stock: '0', Link: '', Sold: 0
    });
    assert.deepEqual({ ...w.normalizeProductData({ Num: null, Product: null, Platform: undefined, Sale: '', Neto: '', Stock: '', Link: null, Sold: null }) }, {
        Num: 0, Product: '', Platform: '', Sale: 'X', Neto: 'X', Stock: '0', Link: '', Sold: 0
    });

    // Número entero; los demás campos siempre son texto
    assert.equal(w.normalizeProductData({ Num: 23 }).Num, 23);
    assert.equal(w.normalizeProductData({ Num: '23abc' }).Num, 23);
    assert.equal(w.normalizeProductData({ Num: '12.9' }).Num, 12);
    assert.equal(w.normalizeProductData({ Num: 'abc' }).Num, 0);
    assert.equal(w.normalizeProductData({ Num: '' }).Num, 0);
    assert.deepEqual({ ...w.normalizeProductData({ Num: 5, Product: 2048, Platform: 64, Sale: 15, Neto: 15000, Stock: 3, Link: 99, Sold: 1 }) }, {
        Num: 5, Product: '2048', Platform: '64', Sale: '15', Neto: '15000', Stock: '3', Link: '99', Sold: 1
    });

    // Vendido: mismas reglas que UTL-004
    assert.equal(w.normalizeProductData({ Sold: '1' }).Sold, 1);
    assert.equal(w.normalizeProductData({ Sold: 1 }).Sold, 1);
    ['', '0', 0, null, undefined, 'si', 'true', '2'].forEach(valor => {
        assert.equal(w.normalizeProductData({ Sold: valor }).Sold, 0, `Sold=${JSON.stringify(valor)}`);
    });

    // Si no recibe un objeto devuelve null
    assert.equal(w.normalizeProductData(null), null);
    assert.equal(w.normalizeProductData(undefined), null);
    assert.equal(w.normalizeProductData('texto'), null);
    assert.equal(w.normalizeProductData(''), null);
    assert.equal(w.normalizeProductData(42), null);
    assert.equal(w.normalizeProductData(0), null);
    assert.equal(w.normalizeProductData(true), null);
});

test('[UTL-010] normalizeProductData no modifica el producto recibido y normalizar dos veces da lo mismo', () => {
    const entrada = { Num: '23', Product: 'Ratchet & Clank', Platform: 'PS2', Neto: '$30.000', Sold: '1', Extra: 'se ignora' };
    const copia = { ...entrada };

    const normalizado = w.normalizeProductData(entrada);

    assert.deepEqual(entrada, copia, 'la entrada queda intacta');
    assert.notEqual(normalizado, entrada, 'entrega un objeto nuevo');
    assert.deepEqual(Object.keys(normalizado), ['Num', 'Product', 'Platform', 'Sale', 'Neto', 'Stock', 'Link', 'Sold'], 'solo los campos del producto');
    // Es la forma que se guarda en caché: sobrevive a JSON y volver a normalizarla no la cambia
    const desdeCache = JSON.parse(JSON.stringify(normalizado));
    assert.deepEqual({ ...w.normalizeProductData(desdeCache) }, desdeCache);
    assert.deepEqual({ ...w.normalizeProductData(normalizado) }, { ...normalizado });
});

test('[UTL-003] validateProductData es la normalización de UTL-010 con cada texto sanitizado una sola vez', () => {
    const crudo = {
        Num: '9', Product: 'Ratchet & Clank <3', Platform: 'R&D', Sale: '<$1>', Neto: '$1.000 & más', Stock: '<2>', Link: 'a&b', Sold: '1'
    };
    const normalizado = w.normalizeProductData(crudo);
    const validado = w.validateProductData(crudo);

    assert.deepEqual({ ...validado }, {
        Num: 9, Product: 'Ratchet &amp; Clank &lt;3', Platform: 'R&amp;D', Sale: '&lt;$1&gt;', Neto: '$1.000 &amp; más', Stock: '&lt;2&gt;', Link: 'a&amp;b', Sold: 1
    });
    ['Product', 'Platform', 'Sale', 'Neto', 'Stock', 'Link'].forEach(campo => {
        assert.equal(validado[campo], w.sanitizeHTML(normalizado[campo]), campo);
    });
    assert.equal(validado.Num, normalizado.Num);
    assert.equal(validado.Sold, normalizado.Sold);

    // Da lo mismo validar el producto crudo que el ya normalizado (el que está en memoria y en caché)
    assert.deepEqual({ ...w.validateProductData(normalizado) }, { ...validado });
    assert.deepEqual({ ...normalizado }, { ...w.normalizeProductData(crudo) }, 'validar no modifica el producto normalizado');

    // Escapado una sola vez: insertado como HTML se lee exactamente el texto original
    const celda = w.document.createElement('td');
    ['Product', 'Platform', 'Sale', 'Neto', 'Stock', 'Link'].forEach(campo => {
        celda.innerHTML = validado[campo];
        assert.equal(celda.textContent, normalizado[campo], campo);
        assert.equal(celda.children.length, 0, campo);
    });
    celda.innerHTML = w.validateProductData({ Product: 'Uno &amp; Dos' }).Product;
    assert.equal(celda.textContent, 'Uno &amp; Dos', 'un "&amp;" escrito en la hoja se muestra literal');
});

test('[UTL-003] validateProductData normaliza los campos, aplica valores por defecto y sanitiza', () => {
    assert.deepEqual({ ...w.validateProductData({
        Num: '23', Product: 'Grudge <b>Warriors</b>', Platform: 'PS1', Sale: '$15', Neto: '$15.000', Stock: '1', Link: 'DMwPmoFsgMg', Sold: ''
    }) }, {
        Num: 23, Product: 'Grudge &lt;b&gt;Warriors&lt;/b&gt;', Platform: 'PS1', Sale: '$15', Neto: '$15.000', Stock: '1', Link: 'DMwPmoFsgMg', Sold: 0
    });

    assert.deepEqual({ ...w.validateProductData({}) }, {
        Num: 0, Product: '', Platform: '', Sale: 'X', Neto: 'X', Stock: '0', Link: '', Sold: 0
    });

    assert.equal(w.validateProductData(null), null);
    assert.equal(w.validateProductData('texto'), null);
    assert.equal(w.validateProductData(undefined), null);
});

test('[UTL-004] solo Sold "1" o 1 marca el producto como vendido', () => {
    assert.equal(w.validateProductData({ Sold: '1' }).Sold, 1);
    assert.equal(w.validateProductData({ Sold: 1 }).Sold, 1);
    ['', '0', 0, null, undefined, 'si', 'true', '2'].forEach(valor => {
        assert.equal(w.validateProductData({ Sold: valor }).Sold, 0, `Sold=${JSON.stringify(valor)}`);
    });
});

test('[UTL-005] parseProductPrice extrae el número del precio y entiende el sufijo K', () => {
    assert.equal(w.parseProductPrice(null), null);
    assert.equal(w.parseProductPrice(undefined), null);
    assert.equal(w.parseProductPrice(''), null);
    assert.equal(w.parseProductPrice('   '), null);
    assert.equal(w.parseProductPrice('X'), null);
    assert.equal(w.parseProductPrice('x'), null);
    assert.equal(w.parseProductPrice('sin precio'), null);

    assert.equal(w.parseProductPrice('15K'), 15000);
    assert.equal(w.parseProductPrice('12,5k'), 12500);
    assert.equal(w.parseProductPrice('$20'), 20);
    assert.equal(w.parseProductPrice(30), 30);

    // Formato real de la hoja ("$15.000"): el punto se lee como decimal, pero el orden
    // relativo entre precios con separador de miles se conserva.
    const reales = ['$5.000', '$8.000', '$15.000', '$45.000', '$120.000'].map(w.parseProductPrice);
    assert.deepEqual(reales, [...reales].sort((a, b) => a - b));
    assert.equal(new Set(reales).size, reales.length);
});

test('[UTL-006] compareNullableNumbers deja los valores nulos al final en ambos sentidos', () => {
    assert.ok(w.compareNullableNumbers(1, 2) < 0);
    assert.ok(w.compareNullableNumbers(2, 1) > 0);
    assert.ok(w.compareNullableNumbers(1, 2, 'desc') > 0);
    assert.equal(w.compareNullableNumbers(3, 3), 0);
    assert.equal(w.compareNullableNumbers(null, undefined), 0);
    assert.equal(w.compareNullableNumbers(NaN, null), 0);
    ['asc', 'desc'].forEach(sentido => {
        assert.equal(w.compareNullableNumbers(null, 5, sentido), 1);
        assert.equal(w.compareNullableNumbers(5, null, sentido), -1);
    });
});

test('[UTL-007] sortProducts ordena por cada criterio, desempata por número y no modifica la lista original', () => {
    const lista = [
        producto(3, 'Zelda', 'SNES', '$45.000'),
        producto(1, 'mario', 'SNES', '$30.000'),
        producto(4, 'Árbol', 'NES', 'X'),
        producto(2, 'Sonic 10', 'Genesis', '$30.000'),
        producto(5, 'Sonic 2', 'Genesis', '$5.000')
    ];
    const original = nums(lista);

    assert.deepEqual(nums(w.sortProducts(lista, 'id-asc')), [1, 2, 3, 4, 5]);
    assert.deepEqual(nums(w.sortProducts(lista, 'price-asc')), [5, 1, 2, 3, 4]);
    assert.deepEqual(nums(w.sortProducts(lista, 'price-desc')), [3, 1, 2, 5, 4]);
    // Orden alfabético en español: ignora mayúsculas y acentos, y ordena los números por valor
    assert.deepEqual(nums(w.sortProducts(lista, 'name-asc')), [4, 1, 5, 2, 3]);
    assert.deepEqual(nums(w.sortProducts(lista, 'name-desc')), [3, 2, 5, 1, 4]);
    assert.deepEqual(nums(w.sortProducts(lista, 'platform-asc')), [5, 2, 4, 1, 3]);
    assert.deepEqual(nums(w.sortProducts(lista, 'criterio-desconocido')), [1, 2, 3, 4, 5]);

    assert.deepEqual(nums(lista), original);
    assert.deepEqual(nums(w.sortProducts([], 'price-asc')), []);
});

test('[UTL-007] sortProducts compara el texto sin escapar, tal como está en la hoja', () => {
    // Escapados, "&lt;" y "&gt;" se ordenarían al revés ("g" va antes que "l"); sin escapar, "<" va antes que ">"
    const referencia = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    assert.ok(referencia.compare('<', '>') < 0 && referencia.compare('&lt;', '&gt;') > 0, 'el caso distingue ambos órdenes');

    const porNombre = [
        producto(1, 'Juego > B', 'NES', '$1.000'),
        producto(2, 'Juego < A', 'NES', '$1.000'),
        producto(3, 'Juego', 'NES', '$1.000')
    ];
    assert.deepEqual(nums(w.sortProducts(porNombre, 'name-asc')), [3, 2, 1]);
    assert.deepEqual(nums(w.sortProducts(porNombre, 'name-desc')), [1, 2, 3]);

    const porPlataforma = [
        producto(1, 'Igual', 'Consola >', '$1.000'),
        producto(2, 'Igual', 'Consola <', '$1.000')
    ];
    assert.deepEqual(nums(w.sortProducts(porPlataforma, 'platform-asc')), [2, 1]);

    // Los productos ordenados son los mismos objetos, con su texto intacto
    const conAmpersand = [producto(2, 'Ratchet & Clank', 'PS2', '$30.000'), producto(1, 'Tom & Jerry <3', 'NES', '$5.000')];
    const ordenados = w.sortProducts(conAmpersand, 'id-asc');
    assert.equal(ordenados[0], conAmpersand[1]);
    assert.equal(ordenados[1], conAmpersand[0]);
    assert.deepEqual(Array.from(ordenados, p => p.Product), ['Tom & Jerry <3', 'Ratchet & Clank']);
});

test('[UTL-008] handleSecureError devuelve un mensaje genérico según contexto e idioma y registra el error real', () => {
    const interno = new Error('detalle interno: token=abc123');

    w.localStorage.removeItem('language');
    assert.equal(w.handleSecureError(interno, 'products'), 'Error cargando productos. Por favor, intenta más tarde.');
    assert.equal(w.handleSecureError(interno, 'efemerides'), 'No se pudieron cargar las efemérides del día.');
    assert.equal(w.handleSecureError(interno, 'otro-contexto'), 'Ha ocurrido un error. Por favor, intenta más tarde.');
    assert.equal(w.handleSecureError(interno), 'Ha ocurrido un error. Por favor, intenta más tarde.');

    w.localStorage.setItem('language', 'en');
    assert.equal(w.handleSecureError(interno, 'products'), 'Error loading products. Please try again later.');
    assert.equal(w.handleSecureError(interno, 'efemerides'), "Could not load today's anniversaries.");
    w.localStorage.removeItem('language');

    assert.ok(!w.handleSecureError(interno, 'products').includes('token'));
    assert.ok(pagina.mensajes('error').some(linea => linea.includes('[products] Error interno:')));
});
