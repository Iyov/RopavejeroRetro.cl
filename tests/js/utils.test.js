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
