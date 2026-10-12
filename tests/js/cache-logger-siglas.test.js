'use strict';

// Specs: specs/base/02-cache-productos.md, 03-logger.md, 04-siglas.md
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { abrirPagina, leer, respuesta } = require('./helpers/pagina');

const CLAVE_DATOS = 'ropavejero_products_cache_v1_1_2';
const CLAVE_TIEMPO = 'ropavejero_cache_timestamp_v1_1_2';

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

// ---------- Caché de productos ----------

test('[CCH-001] los productos guardados se recuperan desde las claves versionadas de localStorage', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js'] });
    const { window: w } = pagina;

    assert.equal(w.getCachedProducts(), null);

    // El texto se guarda tal cual, sin escapar
    w.setCachedProducts([{ Num: 1, Product: 'Ratchet & Clank <3' }]);

    assert.equal(pagina.evaluar('CACHE_CONFIG.PRODUCTS_KEY'), CLAVE_DATOS);
    assert.equal(pagina.evaluar('CACHE_CONFIG.TIMESTAMP_KEY'), CLAVE_TIEMPO);
    assert.deepEqual(JSON.parse(w.localStorage.getItem(CLAVE_DATOS)), [{ Num: 1, Product: 'Ratchet & Clank <3' }]);
    assert.match(w.localStorage.getItem(CLAVE_TIEMPO), /^\d+$/);
    assert.deepEqual(JSON.parse(JSON.stringify(w.getCachedProducts())), [{ Num: 1, Product: 'Ratchet & Clank <3' }]);
    assert.deepEqual(
        Object.keys(w.localStorage).filter(clave => clave.startsWith('ropavejero_')).sort(),
        [CLAVE_TIEMPO, CLAVE_DATOS],
        'no escribe en claves de otra versión'
    );
});

test('[CCH-002] el caché vence a los 5 minutos y al vencer se eliminan sus claves', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js'] });
    const { window: w } = pagina;
    const cincoMinutos = 5 * 60 * 1000;
    assert.equal(pagina.evaluar('CACHE_CONFIG.CACHE_DURATION'), cincoMinutos);

    w.localStorage.setItem(CLAVE_DATOS, JSON.stringify([{ Num: 1 }]));
    w.localStorage.setItem(CLAVE_TIEMPO, String(Date.now() - cincoMinutos + 30000));
    assert.deepEqual(JSON.parse(JSON.stringify(w.getCachedProducts())), [{ Num: 1 }], 'a los 4:30 sigue vigente');

    w.localStorage.setItem(CLAVE_TIEMPO, String(Date.now() - cincoMinutos - 1000));
    assert.equal(w.getCachedProducts(), null);
    assert.equal(w.localStorage.getItem(CLAVE_DATOS), null);
    assert.equal(w.localStorage.getItem(CLAVE_TIEMPO), null);
});

test('[CCH-003] un caché incompleto o corrupto se trata como inexistente, sin lanzar errores', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js'] });
    const { window: w } = pagina;

    w.localStorage.setItem(CLAVE_DATOS, JSON.stringify([{ Num: 1 }]));
    assert.equal(w.getCachedProducts(), null, 'sin marca de tiempo');

    w.localStorage.setItem(CLAVE_DATOS, '{esto no es json');
    w.localStorage.setItem(CLAVE_TIEMPO, String(Date.now()));
    assert.equal(w.getCachedProducts(), null);
    assert.ok(pagina.mensajes('warn').some(linea => linea.includes('Error reading cache')));
});

test('[CCH-004] al cargar el módulo se eliminan las claves de versiones anteriores y se conservan las actuales', async () => {
    const antiguas = [
        'ropavejero_products_cache', 'ropavejero_cache_timestamp',
        'ropavejero_products_cache_v1', 'ropavejero_cache_timestamp_v1',
        'ropavejero_products_cache_v1_0_8', 'ropavejero_cache_timestamp_v1_0_8',
        'ropavejero_products_cache_v1_0_9', 'ropavejero_cache_timestamp_v1_0_9',
        'ropavejero_products_cache_v1_1_1', 'ropavejero_cache_timestamp_v1_1_1'
    ];
    const almacenamiento = Object.fromEntries(antiguas.map(clave => [clave, 'viejo']));
    almacenamiento[CLAVE_DATOS] = '[]';
    almacenamiento[CLAVE_TIEMPO] = String(Date.now());
    almacenamiento.theme = 'light';
    almacenamiento.language = 'en';

    pagina = await abrirPagina({ scripts: ['js/modules/cache.js'], almacenamiento });
    const { window: w } = pagina;

    antiguas.forEach(clave => assert.equal(w.localStorage.getItem(clave), null, clave));
    assert.equal(w.localStorage.getItem(CLAVE_DATOS), '[]');
    assert.equal(w.localStorage.getItem(CLAVE_TIEMPO), almacenamiento[CLAVE_TIEMPO]);
    assert.equal(w.localStorage.getItem('theme'), 'light');
    assert.equal(w.localStorage.getItem('language'), 'en');
});

test('[CCH-005] clearProductsCache y clearAllCache vacían el caché de productos sin tocar las preferencias', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js'], almacenamiento: { theme: 'light' } });
    const { window: w } = pagina;

    w.setCachedProducts([{ Num: 1 }]);
    assert.notEqual(w.localStorage.getItem(CLAVE_DATOS), null, 'hay algo que vaciar');
    w.clearProductsCache();
    assert.equal(w.localStorage.getItem(CLAVE_DATOS), null);
    assert.equal(w.localStorage.getItem(CLAVE_TIEMPO), null);

    w.setCachedProducts([{ Num: 1 }]);
    assert.notEqual(w.localStorage.getItem(CLAVE_DATOS), null, 'hay algo que vaciar');
    w.clearAllCache();
    assert.equal(w.getCachedProducts(), null);
    assert.equal(w.localStorage.getItem('theme'), 'light');
});

// ---------- Logger ----------

test('[LOG-001] en producción console.log y console.info quedan anulados; warn y error siguen activos', async () => {
    pagina = await abrirPagina({ url: 'https://ropavejeroretro.cl/', scripts: ['js/modules/logger.js'] });

    pagina.evaluar(`console.log('traza'); console.info('informativo'); console.warn('aviso'); console.error('fallo');`);

    assert.deepEqual(pagina.mensajes('log'), []);
    assert.deepEqual(pagina.mensajes('info'), []);
    assert.deepEqual(pagina.mensajes('warn'), ['aviso']);
    assert.deepEqual(pagina.mensajes('error'), ['fallo']);

    // Las funciones originales quedan disponibles para depurar desde la consola
    pagina.evaluar(`window.__console_log_original.call(console, 'recuperado');`);
    assert.deepEqual(pagina.mensajes('log'), ['recuperado']);
    assert.equal(typeof pagina.window.__console_info_original, 'function');
});

test('[LOG-002] en localhost y 127.0.0.1 los logs se mantienen activos', async () => {
    for (const url of ['http://localhost:8000/', 'http://127.0.0.1:8000/productos.html']) {
        pagina = await abrirPagina({ url, scripts: ['js/modules/logger.js'] });
        pagina.evaluar(`console.log('traza'); console.info('informativo');`);

        assert.ok(pagina.mensajes('log').includes('traza'), url);
        assert.ok(pagina.mensajes('log').some(linea => linea.includes('Modo Desarrollo')), url);
        assert.deepEqual(pagina.mensajes('info'), ['informativo'], url);
        assert.equal(pagina.window.__console_log_original, undefined);
        await pagina.cerrar();
    }
    pagina = null;
});

// ---------- Siglas ----------

const SIGLAS_PRUEBA = {
    'CIB': { es: 'Caja, Juego, Manual', en: 'Box, Game, Manual' },
    'CIB+': { es: 'Caja, Juego, Manual, Insertos', en: 'Box, Game, Manual, Inserts' },
    'MM': { es: 'Sin Manual', en: 'Missing Manual' },
    'BL': { es: 'Black Label', en: 'Black Label' },
    'GH': { es: 'Greatest Hits', en: 'Greatest Hits' },
    'SOLO': { es: 'Solo en español' },
    'LEGACY': 'Descripción antigua'
};

async function paginaSiglas(opciones = {}) {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js', 'js/modules/siglas.js'], ...opciones });
    pagina.evaluar(`siglasData = ${JSON.stringify(SIGLAS_PRUEBA)};`);
    return pagina;
}

const siglasDe = (texto) => Array.from(pagina.window.extractSiglas(texto), item => item.sigla).sort();

test('[SIG-001] loadSiglas carga js/siglas.json con la versión de caché y deja las siglas disponibles', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/cache.js', 'js/modules/siglas.js'] });

    const datos = await pagina.window.loadSiglas();

    assert.equal(pagina.peticiones.length, 1);
    assert.match(pagina.peticiones[0].original, /^js\/siglas\.json\?v=\d{4}-\d{2}-\d{2}_\d+$/);
    assert.deepEqual(JSON.parse(JSON.stringify(datos)), JSON.parse(leer('js/siglas.json')));
    assert.deepEqual(siglasDe('Crash Bandicoot (BL-CIB)'), ['BL', 'CIB']);
});

test('[SIG-001] si js/siglas.json no carga, loadSiglas devuelve un objeto vacío y registra el error', async () => {
    pagina = await abrirPagina({
        scripts: ['js/modules/cache.js', 'js/modules/siglas.js'],
        rutas: () => respuesta('error', { status: 500, tipo: 'text/plain' })
    });

    const datos = await pagina.window.loadSiglas();

    assert.deepEqual({ ...datos }, {});
    assert.ok(pagina.mensajes('error').some(linea => linea.includes('Error cargando siglas')));
    assert.deepEqual(siglasDe('Crash Bandicoot (BL-CIB)'), []);
});

test('[SIG-002] extractSiglas reconoce siglas entre paréntesis, corchetes, guiones o como palabra suelta', async () => {
    await paginaSiglas();

    assert.deepEqual(siglasDe('Grudge Warriors (BL-CIB)'), ['BL', 'CIB']);
    assert.deepEqual(siglasDe('Tetris Plus [GH-MM]'), ['GH', 'MM']);
    assert.deepEqual(siglasDe('Halo 3 CIB'), ['CIB']);
    assert.deepEqual(siglasDe('halo 3 (cib)'), ['CIB'], 'no distingue mayúsculas');
    assert.deepEqual(siglasDe('Gran Turismo GH-CIB'), ['CIB', 'GH']);
    assert.deepEqual(siglasDe('Super Mario World'), []);
    assert.deepEqual(siglasDe('Blade'), [], 'BL dentro de una palabra no es sigla');

    assert.deepEqual(siglasDe(''), []);
    assert.deepEqual(Array.from(pagina.window.extractSiglas(null)), []);
    assert.deepEqual(Array.from(pagina.window.extractSiglas(123)), []);

    const repetidas = Array.from(pagina.window.extractSiglas('CIB (CIB) [CIB]'), item => item.sigla);
    assert.deepEqual(repetidas, ['CIB'], 'sin duplicados');
});

test('[SIG-003] la descripción de la sigla sale en el idioma activo, con español como respaldo', async () => {
    await paginaSiglas();
    const { window: w } = pagina;
    const descripcion = (texto) => w.extractSiglas(texto)[0].descripcion;

    assert.equal(descripcion('Zelda (MM)'), 'Sin Manual');

    w.localStorage.setItem('language', 'en');
    assert.equal(descripcion('Zelda (MM)'), 'Missing Manual');
    assert.equal(descripcion('Zelda (SOLO)'), 'Solo en español', 'sin traducción usa español');
    assert.equal(descripcion('Zelda (LEGACY)'), 'Descripción antigua', 'formato antiguo de texto plano');
});

test('[SIG-004] "CIB+" se detecta como CIB+ y no como CIB', async () => {
    await paginaSiglas();

    assert.deepEqual(siglasDe('Zelda (CIB+)'), ['CIB+']);
    assert.deepEqual(siglasDe('Zelda CIB+ NES'), ['CIB+']);
    assert.deepEqual(siglasDe('Zelda (BL-CIB+)'), ['BL', 'CIB+']);
    assert.deepEqual(siglasDe('Zelda (CIB)'), ['CIB']);
});

test('[SIG-005] createSiglasTooltip arma el tooltip con una fila por sigla y nada si no hay siglas', async () => {
    await paginaSiglas();
    const { window: w, document } = pagina;

    assert.equal(w.createSiglasTooltip([]), '');
    assert.equal(w.createSiglasTooltip(null), '');

    const contenedor = document.createElement('div');
    contenedor.innerHTML = w.createSiglasTooltip(w.extractSiglas('Grudge Warriors (BL-CIB)'));
    const filas = contenedor.querySelectorAll('.siglas-tooltip > .sigla-item');

    assert.equal(filas.length, 2);
    const textos = Array.from(filas, fila => fila.textContent.replace(/\s+/g, ' ').trim()).sort();
    assert.deepEqual(textos, ['BL: Black Label', 'CIB: Caja, Juego, Manual']);
});

test('[SIG-006] js/siglas.json define cada sigla con descripción en español y en inglés', () => {
    const siglas = JSON.parse(leer('js/siglas.json'));
    const entradas = Object.entries(siglas);

    assert.ok(entradas.length > 0);
    entradas.forEach(([sigla, valor]) => {
        assert.equal(typeof valor, 'object', sigla);
        assert.ok(typeof valor.es === 'string' && valor.es.trim(), `${sigla} sin "es"`);
        assert.ok(typeof valor.en === 'string' && valor.en.trim(), `${sigla} sin "en"`);
    });
});
