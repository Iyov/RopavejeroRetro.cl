'use strict';

// Spec: specs/cambios/2026-10-12-rediseno-anuncio-local.md (se integra como specs/base/17-local.md)
// Sección "Visítanos" del inicio (#local), aviso compacto del catálogo (#storeNotice)
// y señal de estado del local (#storeStatus).
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { abrirPagina, parsear, leer } = require('./helpers/pagina');

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

const PAGINAS_SIN_ANUNCIO = ['404.html', 'security-policy.html', 'security-acknowledgments.html'];
const MAPS = 'https://www.google.com/maps/search/?api=1&query=';
const SITIO_LOCAL = 'https://doubleimpactstore.cl/';
// Clases que ya existen en el sitio o vienen de Font Awesome: no se exige que sean nuevas
const CLASES_EXISTENTES = new Set(['btn', 'btn-primary', 'btn-secondary', 'container', 'section', 'section-header']);

const normalizar = texto => texto.replace(/\s+/g, ' ').trim();
const traducciones = () => JSON.parse(pagina.evaluar('JSON.stringify(translations)'));

// Fija el instante real (UTC) de la página: así el día de Chile no depende de la zona horaria de la máquina
const enInstante = iso => w => {
    const DateReal = w.Date;
    const fijo = Date.parse(iso);
    class DateFija extends DateReal {
        constructor(...args) { if (args.length === 0) { super(fijo); } else { super(...args); } }
        static now() { return fijo; }
    }
    w.Date = DateFija;
};

async function abrirSitio(html, opciones = {}) {
    pagina = await abrirPagina({ html, scripts: 'declarados', iniciar: true, ...opciones });
    return pagina;
}

// Elementos de la sección o el aviso, incluido el propio contenedor
function conDescendientes(raiz) {
    return [raiz, ...raiz.querySelectorAll('*')];
}

function clasesDe(raiz) {
    const clases = new Set();
    conDescendientes(raiz).forEach(el => el.classList.forEach(c => clases.add(c)));
    return [...clases].filter(c => !CLASES_EXISTENTES.has(c) && !/^(fas|fab|far|fa|fa-[\w-]+)$/.test(c));
}

// Cuerpo visible de una página: sin <noscript> ni <script>
function textoVisible(rel) {
    const body = parsear(rel).body.cloneNode(true);
    body.querySelectorAll('noscript, script').forEach(el => el.remove());
    return { body, texto: normalizar(body.textContent) };
}

// ---------- LOC-001 ----------

test('[LOC-001] el inicio tiene la sección #local con un h2, después del encabezado principal y antes de Instagram', () => {
    const doc = parsear('index.html');
    const local = doc.querySelector('section#local');
    assert.ok(local, 'falta section#local');
    assert.ok(local.querySelector('h2'), 'la sección necesita un h2');

    const ids = Array.from(doc.querySelectorAll('section[id]'), s => s.id);
    // Va arriba: la sección de Instagram muestra todos los posts y mide decenas de miles de píxeles
    assert.ok(ids.indexOf('local') > ids.indexOf('hero'), 'debe ir después de #hero');
    assert.ok(ids.indexOf('local') < ids.indexOf('instagram'), 'debe ir antes de #instagram');
});

test('[LOC-001] la tarjeta presenta el local con descripción, dirección, metro y horario, cada dato con su ícono', () => {
    const local = parsear('index.html').querySelector('section#local');
    assert.ok(local, 'falta section#local');
    const texto = normalizar(local.textContent);

    assert.match(texto, /@DoubleImpactStore/);
    assert.match(texto, /Bio Bio 654/);
    assert.match(texto, /Metro Bio Bio/);
    assert.match(texto, /11:00/);
    assert.match(texto, /18:00/);
    // Tienda + dirección + metro + horario: al menos cuatro íconos de Font Awesome
    assert.ok(local.querySelectorAll('i.fas, i.fab, i.far').length >= 4, 'cada dato lleva un ícono de Font Awesome');
    assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿➡]/u.test(local.textContent), 'sin emojis en el texto');
});

test('[LOC-001] el inicio mantiene un solo h1 y la sección usa h2, no h1', () => {
    const doc = parsear('index.html');
    assert.equal(doc.querySelectorAll('h1').length, 1);
    const local = doc.querySelector('section#local');
    assert.ok(local, 'falta section#local');
    assert.equal(local.querySelectorAll('h1').length, 0);
});

test('[LOC-001] el bloque suelto anterior (.store-announcement) ya no está en el inicio', () => {
    const doc = parsear('index.html');
    assert.equal(doc.querySelectorAll('.store-announcement').length, 0);
    assert.ok(!/store-announcement/.test(leer('index.html')), 'quedan restos de store-announcement en index.html');
});

// ---------- LOC-002 ----------

test('[LOC-002] el inicio tiene el ítem "Local" (#local) después de Instagram, en el menú de escritorio y en el móvil', () => {
    const doc = parsear('index.html');
    for (const contenedor of ['.nav', '.mobile-menu-content']) {
        const enlaces = Array.from(doc.querySelectorAll(`${contenedor} a`));
        const hrefs = enlaces.map(a => a.getAttribute('href'));
        assert.ok(hrefs.includes('#local'), `${contenedor}: falta el ítem #local`);
        assert.ok(hrefs.indexOf('#local') < hrefs.indexOf('#instagram'), `${contenedor}: debe ir antes de Instagram`);
        const item = enlaces[hrefs.indexOf('#local')];
        assert.ok(item.getAttribute('data-translate'), `${contenedor}: el ítem necesita data-translate`);
    }
});

test('[LOC-002] el catálogo tiene el ítem "Local" (/#local) después de Instagram, en el menú de escritorio y en el móvil', () => {
    const doc = parsear('productos.html');
    for (const contenedor of ['.nav', '.mobile-menu-content']) {
        const hrefs = Array.from(doc.querySelectorAll(`${contenedor} a`), a => a.getAttribute('href'));
        assert.ok(hrefs.includes('/#local'), `${contenedor}: falta el ítem /#local`);
        assert.ok(hrefs.indexOf('/#local') < hrefs.indexOf('/#instagram'), `${contenedor}: debe ir antes de Instagram`);
    }
});

test('[LOC-002] el texto del ítem "Local" existe en español e inglés', async () => {
    await abrirSitio('index.html');
    const clave = pagina.document.querySelector('.nav a[href="#local"]').getAttribute('data-translate');
    const t = traducciones();
    assert.ok(clave && /^(menu|store)-/.test(clave), `clave inesperada: ${clave}`);
    assert.ok(t.es[clave] && t.en[clave], `la clave ${clave} debe existir en es y en`);
    assert.equal(normalizar(pagina.document.querySelector('.nav a[href="#local"]').textContent), t.es[clave]);
});

test('[LOC-002] en el inicio el menú marca "Local" como activo al ver la sección', async () => {
    await abrirSitio('index.html');
    const { document } = pagina;
    const secciones = Array.from(document.querySelectorAll('section[id]'));
    secciones.forEach((seccion, i) => {
        Object.defineProperty(seccion, 'offsetTop', { value: i * 1000, configurable: true });
    });
    const posicion = secciones.findIndex(s => s.id === 'local') * 1000;
    assert.ok(posicion >= 0, 'falta section#local');

    pagina.desplazar(posicion);
    assert.deepEqual(Array.from(document.querySelectorAll('a.nav-active'), a => a.getAttribute('href')), ['#local', '#local']);
});

// ---------- LOC-003 ----------

test('[LOC-003] "Cómo llegar" abre en otra pestaña la búsqueda de Bio Bio 654 en Google Maps, con noopener y noreferrer', () => {
    const local = parsear('index.html').querySelector('section#local');
    assert.ok(local, 'falta section#local');
    // Se busca por comparación de texto: en jsdom un selector de atributo cuyo valor lleva "/" y "&" no encuentra nada
    const enlace = Array.from(local.querySelectorAll('a')).find(a => (a.getAttribute('href') || '').startsWith(MAPS));
    assert.ok(enlace, 'falta el enlace a Google Maps');

    const consulta = decodeURIComponent(enlace.getAttribute('href').slice(MAPS.length).replace(/\+/g, ' '));
    assert.match(consulta, /Bio Bio 654/);
    assert.equal(enlace.getAttribute('target'), '_blank');
    assert.match(enlace.getAttribute('rel'), /noopener/);
    assert.match(enlace.getAttribute('rel'), /noreferrer/);
    assert.ok(enlace.getAttribute('data-translate'), 'el texto del botón necesita data-translate');
});

test('[LOC-003] el botón al sitio del local apunta a doubleimpactstore.cl, en otra pestaña y con noopener y noreferrer', () => {
    const local = parsear('index.html').querySelector('section#local');
    assert.ok(local, 'falta section#local');
    const enlaces = Array.from(local.querySelectorAll('a')).filter(a => a.getAttribute('href') === SITIO_LOCAL);
    assert.ok(enlaces.length >= 1, 'falta el enlace al sitio del local');

    enlaces.forEach(enlace => {
        assert.equal(enlace.getAttribute('target'), '_blank');
        assert.match(enlace.getAttribute('rel'), /noopener/);
        assert.match(enlace.getAttribute('rel'), /noreferrer/);
    });
    assert.ok(enlaces.some(a => a.classList.contains('btn')), 'al menos uno es un botón (.btn)');
});

test('[LOC-003] todo enlace externo de la sección y del aviso lleva rel noopener y noreferrer cuando abre otra pestaña', () => {
    const raices = [
        parsear('index.html').querySelector('section#local'),
        parsear('productos.html').querySelector('#storeNotice')
    ];
    raices.forEach(raiz => {
        assert.ok(raiz, 'falta la sección o el aviso');
        raiz.querySelectorAll('a[target="_blank"]').forEach(a => {
            assert.match(a.getAttribute('rel') || '', /noopener/, a.outerHTML);
            assert.match(a.getAttribute('rel') || '', /noreferrer/, a.outerHTML);
        });
    });
});

// ---------- LOC-004 ----------

// Mediodía en Chile (UTC-3 en octubre): 15:00 UTC
const DIAS = [
    ['lunes', '2026-10-12T15:00:00Z', false],
    ['martes', '2026-10-13T15:00:00Z', false],
    ['miércoles', '2026-10-14T15:00:00Z', false],
    ['jueves', '2026-10-15T15:00:00Z', false],
    ['viernes', '2026-10-16T15:00:00Z', false],
    ['sábado', '2026-10-17T15:00:00Z', true],
    ['domingo', '2026-10-18T15:00:00Z', true]
];

const estado = () => pagina.document.querySelector('#local #storeStatus');

test('[LOC-004] sábado y domingo la señal dice "Abierto hoy" con el horario y se marca como abierta', async () => {
    for (const [dia, iso] of DIAS.filter(d => d[2])) {
        await abrirSitio('index.html', { antes: enInstante(iso) });
        assert.ok(estado(), `${dia}: falta #storeStatus dentro de #local`);
        assert.ok(estado().classList.contains('is-open'), `${dia}: sin is-open`);
        assert.match(normalizar(estado().textContent), /Abierto hoy/, dia);
        assert.match(normalizar(estado().textContent), /11:00/, dia);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[LOC-004] de lunes a viernes la señal dice cuándo abre y no se marca como abierta', async () => {
    for (const [dia, iso] of DIAS.filter(d => !d[2])) {
        await abrirSitio('index.html', { antes: enInstante(iso) });
        assert.ok(estado(), `${dia}: falta #storeStatus dentro de #local`);
        assert.ok(!estado().classList.contains('is-open'), `${dia}: no debe llevar is-open`);
        assert.equal(normalizar(estado().textContent), 'Abre sábados, domingos y festivos', dia);
        assert.ok(!/cerrado/i.test(estado().textContent), `${dia}: no debe decir "cerrado"`);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[LOC-004] en inglés la señal sale en inglés, abierta y cerrada', async () => {
    await abrirSitio('index.html', { almacenamiento: { language: 'en' }, antes: enInstante('2026-10-17T15:00:00Z') });
    assert.ok(estado(), 'falta #storeStatus');
    assert.ok(estado().classList.contains('is-open'));
    assert.match(normalizar(estado().textContent), /Open today/);
    assert.match(normalizar(estado().textContent), /11:00/);
    await pagina.cerrar();

    await abrirSitio('index.html', { almacenamiento: { language: 'en' }, antes: enInstante('2026-10-14T15:00:00Z') });
    assert.ok(!estado().classList.contains('is-open'));
    assert.equal(normalizar(estado().textContent), 'Open Saturdays, Sundays and holidays');
});

test('[LOC-004] al cambiar de idioma con el selector el texto de la señal cambia y conserva su estado', async () => {
    for (const [iso, esperado] of [
        ['2026-10-17T15:00:00Z', { es: /Abierto hoy/, en: /Open today/, abierto: true }],
        ['2026-10-14T15:00:00Z', { es: /^Abre sábados, domingos y festivos$/, en: /^Open Saturdays, Sundays and holidays$/, abierto: false }]
    ]) {
        await abrirSitio('index.html', { antes: enInstante(iso) });
        const { document } = pagina;
        const elegir = async lang => {
            pagina.click(document.getElementById('languageBtn'));
            pagina.click(document.querySelector(`.language-option[data-lang="${lang}"]`));
            await pagina.asentar();
        };

        assert.match(normalizar(estado().textContent), esperado.es);
        await elegir('en');
        assert.match(normalizar(estado().textContent), esperado.en, 'tras elegir inglés');
        assert.equal(estado().classList.contains('is-open'), esperado.abierto, 'el estado se conserva en inglés');
        await elegir('es');
        assert.match(normalizar(estado().textContent), esperado.es, 'tras volver al español');
        assert.equal(estado().classList.contains('is-open'), esperado.abierto);
        assert.deepEqual(pagina.errores.map(e => (e && e.message) || String(e)), []);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[LOC-004] el día se calcula en hora de Chile, no en la de la máquina del visitante', async () => {
    // 02:00 UTC del sábado 17 = viernes 23:00 en Chile: todavía no abre.
    // 02:00 UTC del lunes 19 = domingo 23:00 en Chile: sigue abierto hoy.
    // Estos casos solo distinguen si la máquina que corre el test no está en Chile (ver informe: revisión manual en una máquina en esa zona).
    await abrirSitio('index.html', { antes: enInstante('2026-10-17T02:00:00Z') });
    assert.ok(!estado().classList.contains('is-open'), 'viernes 23:00 en Chile no es sábado');
    assert.equal(normalizar(estado().textContent), 'Abre sábados, domingos y festivos');
    await pagina.cerrar();

    await abrirSitio('index.html', { antes: enInstante('2026-10-19T02:00:00Z') });
    assert.ok(estado().classList.contains('is-open'), 'domingo 23:00 en Chile sigue siendo domingo');
    assert.match(normalizar(estado().textContent), /Abierto hoy/);
});

test('[LOC-004] la función que inicializa la señal no falla donde no existe la sección', async () => {
    const fuente = leer('js/modules/ui.js');
    const nombres = [...fuente.matchAll(/function\s+(init\w*(?:Store|Local|Status)\w*)\s*\(/g)].map(m => m[1]);
    assert.ok(nombres.length >= 1, 'ui.js debe declarar una función init...Store/Local/Status para la señal de estado');

    for (const html of ['productos.html', ...PAGINAS_SIN_ANUNCIO]) {
        await abrirSitio(html);
        for (const nombre of nombres) {
            assert.doesNotThrow(() => pagina.evaluar(`${nombre}()`), `${html}: ${nombre}() falló sin la sección`);
        }
        assert.deepEqual(pagina.errores.map(e => (e && e.message) || String(e)), [], html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[LOC-004] el inicio arranca sin errores de JavaScript con la sección presente', async () => {
    await abrirSitio('index.html', { antes: enInstante('2026-10-17T15:00:00Z') });
    assert.ok(pagina.document.getElementById('local'), 'falta #local');
    assert.deepEqual(pagina.errores.map(e => (e && e.message) || String(e)), []);
    assert.deepEqual(pagina.mensajes('error'), []);
});

// ---------- LOC-005 ----------

test('[LOC-005] el catálogo muestra un aviso compacto con nombre, dirección, horario y enlace a /#local', () => {
    const doc = parsear('productos.html');
    const aviso = doc.getElementById('storeNotice');
    assert.ok(aviso, 'falta #storeNotice');
    const texto = normalizar(aviso.textContent);

    assert.match(texto, /DoubleImpactStore/);
    assert.match(texto, /Bio Bio/);
    assert.match(texto, /11:00/);
    const enlace = aviso.querySelector('a[href="/#local"]');
    assert.ok(enlace, 'falta el enlace "Ver cómo llegar" a /#local');
    assert.ok(enlace.getAttribute('data-translate'));
    assert.equal(doc.querySelectorAll('.store-announcement').length, 0, 'queda el bloque anterior');
    assert.equal(doc.querySelectorAll('#local').length, 0, 'el catálogo no repite la sección completa');
    assert.equal(aviso.querySelectorAll('h1, h2').length, 0, 'el aviso no lleva títulos de sección');
});

test('[LOC-005] el aviso del catálogo cambia de idioma con el selector', async () => {
    await abrirSitio('productos.html');
    const { document } = pagina;
    const aviso = () => normalizar(document.getElementById('storeNotice').textContent);
    const enlace = () => normalizar(document.querySelector('#storeNotice a[href="/#local"]').textContent);
    const antesAviso = aviso();
    const antesEnlace = enlace();

    pagina.click(document.getElementById('languageBtn'));
    pagina.click(document.querySelector('.language-option[data-lang="en"]'));
    await pagina.asentar();

    assert.notEqual(aviso(), antesAviso);
    assert.notEqual(enlace(), antesEnlace);
    assert.match(aviso(), /11:00/);
    assert.match(aviso(), /DoubleImpactStore/);
    assert.deepEqual(pagina.errores.map(e => (e && e.message) || String(e)), []);
});

// ---------- LOC-006 ----------

test('[LOC-006] 404 y las páginas de seguridad no muestran el anuncio del local', () => {
    for (const html of PAGINAS_SIN_ANUNCIO) {
        const doc = parsear(html);
        const { body, texto } = textoVisible(html);

        assert.equal(doc.querySelectorAll('.store-announcement').length, 0, `${html}: queda .store-announcement`);
        assert.equal(doc.getElementById('local'), null, `${html}: no debe tener #local`);
        assert.equal(doc.getElementById('storeNotice'), null, `${html}: no debe tener #storeNotice`);
        assert.equal(body.querySelectorAll('[data-translate^="store-"]').length, 0, `${html}: quedan textos del anuncio`);
        assert.ok(!/DoubleImpactStore/i.test(texto), `${html}: el cuerpo visible menciona DoubleImpactStore`);
        assert.ok(!texto.includes('Bio Bio 654'), `${html}: el cuerpo visible menciona la dirección`);
    }
});

// ---------- LOC-007 ----------

function claves(raiz) {
    return conDescendientes(raiz)
        .flatMap(el => ['data-translate', 'data-translate-placeholder'].map(a => el.getAttribute(a)))
        .filter(Boolean);
}

test('[LOC-007] todo data-translate de la sección y del aviso existe en español e inglés, con claves store-', async () => {
    await abrirSitio('index.html');
    const t = traducciones();

    for (const [html, selector] of [['index.html', 'section#local'], ['productos.html', '#storeNotice']]) {
        const raiz = parsear(html).querySelector(selector);
        assert.ok(raiz, `${html}: falta ${selector}`);
        const usadas = claves(raiz);
        assert.ok(usadas.length >= 3, `${html}: ${selector} debería tener varios textos traducibles`);
        usadas.forEach(clave => {
            assert.ok(t.es[clave] && t.es[clave].trim(), `${html}: ${clave} falta en español`);
            assert.ok(t.en[clave] && t.en[clave].trim(), `${html}: ${clave} falta en inglés`);
            assert.ok(clave.startsWith('store-') || clave.startsWith('menu-'), `${html}: clave ${clave} debe empezar con store-`);
        });
    }
});

test('[LOC-007] el texto inicial del HTML de la sección y del aviso coincide con el diccionario en español', async () => {
    await abrirSitio('index.html');
    const t = traducciones();
    const plantilla = pagina.document.createElement('div');

    for (const [html, selector] of [['index.html', 'section#local'], ['productos.html', '#storeNotice']]) {
        const raiz = parsear(html).querySelector(selector);
        assert.ok(raiz, `${html}: falta ${selector}`);
        conDescendientes(raiz).filter(el => el.hasAttribute('data-translate')).forEach(el => {
            const clave = el.getAttribute('data-translate');
            plantilla.innerHTML = t.es[clave] || '';
            assert.equal(normalizar(el.textContent), normalizar(plantilla.textContent), `${html}: "${clave}" no coincide con translations.es`);
        });
    }
});

test('[LOC-007] las claves store-announcement-* que ya no se usan se eliminaron del diccionario', async () => {
    await abrirSitio('index.html');
    const t = traducciones();
    const html = ['index.html', 'productos.html', '404.html', 'security-policy.html', 'security-acknowledgments.html'].map(leer).join('\n');

    ['es', 'en'].forEach(idioma => {
        Object.keys(t[idioma]).filter(k => k.startsWith('store-announcement-')).forEach(clave => {
            assert.ok(html.includes(`"${clave}"`), `translations.${idioma} conserva "${clave}" sin uso`);
        });
    });
});

test('[LOC-007] al cambiar a inglés, la sección y el aviso muestran el diccionario en inglés', async () => {
    const t = (await abrirSitio('index.html', { almacenamiento: { language: 'en' } }), traducciones());
    const plantilla = pagina.document.createElement('div');
    const textoEn = clave => { plantilla.innerHTML = t.en[clave]; return normalizar(plantilla.textContent); };

    const textosLocal = pagina.document.querySelectorAll('section#local [data-translate]');
    assert.ok(textosLocal.length >= 3, 'falta section#local con textos traducibles');
    textosLocal.forEach(el => {
        const clave = el.getAttribute('data-translate');
        if (el.id === 'storeStatus') return; // lo cubre LOC-004
        assert.equal(normalizar(el.textContent), textoEn(clave), `#local: "${clave}" sin traducir`);
    });
    await pagina.cerrar();

    await abrirSitio('productos.html', { almacenamiento: { language: 'en' } });
    const textosAviso = pagina.document.querySelectorAll('#storeNotice [data-translate]');
    assert.ok(textosAviso.length >= 2, 'falta #storeNotice con textos traducibles');
    textosAviso.forEach(el => {
        const clave = el.getAttribute('data-translate');
        assert.equal(normalizar(el.textContent), textoEn(clave), `#storeNotice: "${clave}" sin traducir`);
    });
});

// ---------- LOC-008 ----------

function reglas(css) {
    const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return [...sinComentarios.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({ selector: m[1].trim(), cuerpo: m[2] }));
}

test('[LOC-008] toda clase usada en la sección y en el aviso tiene reglas en css/index.css', () => {
    const css = leer('css/index.css');
    for (const [html, selector] of [['index.html', 'section#local'], ['productos.html', '#storeNotice']]) {
        const raiz = parsear(html).querySelector(selector);
        assert.ok(raiz, `${html}: falta ${selector}`);
        const clases = clasesDe(raiz);
        assert.ok(clases.length >= 3, `${html}: ${selector} debería usar clases propias`);
        clases.forEach(clase => {
            const escapada = clase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            assert.match(css, new RegExp(`\\.${escapada}(?![\\w-])`), `${html}: la clase .${clase} no tiene reglas en css/index.css`);
        });
    }
});

test('[LOC-008] las reglas de esas clases usan variables de color del sitio, sin colores fijos', () => {
    const css = leer('css/index.css');
    const local = parsear('index.html').querySelector('section#local');
    const aviso = parsear('productos.html').querySelector('#storeNotice');
    assert.ok(local && aviso, 'faltan section#local o #storeNotice');
    const clases = new Set([...clasesDe(local), ...clasesDe(aviso)]);
    assert.ok(clases.size >= 3, 'no se encontraron las clases propias de la sección');

    const propias = reglas(css).filter(r => [...clases].some(c => new RegExp(`\\.${c.replace(/[-]/g, '\\-')}(?![\\w-])`).test(r.selector)));
    assert.ok(propias.length >= 3, 'faltan reglas propias');

    const COLOR = /^\s*(color|background|background-color|border|border-color|border-left|border-right|border-top|border-bottom|outline|outline-color)\s*:\s*([^;]+)/gim;
    const fijo = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(white|black|red|green|blue|gray|grey|yellow|orange)\b/i;
    let usaVariable = false;
    propias.forEach(({ selector, cuerpo }) => {
        for (const m of cuerpo.matchAll(COLOR)) {
            const valor = m[2];
            if (/var\(--/.test(valor)) usaVariable = true;
            assert.ok(!fijo.test(valor.replace(/var\([^)]*\)/g, '')), `${selector}: ${m[1]} usa un color fijo (${valor.trim()}); usar var(--...)`);
        }
    });
    assert.ok(usaVariable, 'las reglas de la sección deben usar variables de color (var(--...))');
});

// css/index.min.css regenerado: lo vigila [SITE-003]; no se duplica aquí.

// ---------- LOC-009 ----------

test('[LOC-009] la sección conserva los microdatos LocalBusiness con nombre y dirección', () => {
    const local = parsear('index.html').querySelector('section#local');
    assert.ok(local, 'falta section#local');
    const negocio = local.querySelector('[itemtype="https://schema.org/LocalBusiness"]');
    assert.ok(negocio, 'falta el itemtype LocalBusiness dentro de #local');

    const nombre = negocio.querySelector('[itemprop="name"]');
    assert.ok(nombre && /DoubleImpactStore/i.test(nombre.textContent), 'falta itemprop="name" con el nombre del local');
    const direccion = negocio.querySelector('[itemprop="address"]');
    assert.ok(direccion && /Bio Bio/.test(direccion.textContent), 'falta itemprop="address" con la dirección');
});

test('[LOC-009] la sección y el aviso no cargan recursos de otro dominio: sin iframe, ni img, script o link externos', () => {
    for (const [html, selector] of [['index.html', 'section#local'], ['productos.html', '#storeNotice']]) {
        const raiz = parsear(html).querySelector(selector);
        assert.ok(raiz, `${html}: falta ${selector}`);

        assert.equal(raiz.querySelectorAll('iframe, embed, object, video, audio, source').length, 0, `${html}: ${selector} embebe contenido`);
        assert.equal(raiz.querySelectorAll('script').length, 0, `${html}: ${selector} no debe llevar scripts`);
        raiz.querySelectorAll('img[src], img[srcset], link[href], script[src]').forEach(el => {
            const ref = el.getAttribute('src') || el.getAttribute('srcset') || el.getAttribute('href');
            assert.ok(!/^(https?:)?\/\//i.test(ref.trim()), `${html}: recurso externo ${el.outerHTML}`);
        });
        assert.equal(raiz.querySelectorAll('[style*="url("]').length, 0, `${html}: ${selector} carga una imagen por estilo en línea`);
    }
});
