'use strict';

// Spec: specs/base/12-service-worker.md
// El service worker se ejecuta en un contexto aislado con `self`, `caches` y `fetch` simulados.
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const path = require('node:path');
const { ROOT, abrirPagina, leer, existe, scriptsDeclarados, scriptsInline } = require('./helpers/pagina');

const ORIGEN = 'https://ropavejeroretro.cl';

function crearServiceWorker({ red = async () => new Response('de la red'), cachesIniciales = {}, fallaAddAll = () => false, cacheDisponible = () => true } = {}) {
    const oyentes = {};
    const almacenes = new Map(Object.entries(cachesIniciales).map(([nombre, entradas]) => [nombre, new Map(Object.entries(entradas))]));
    const registro = { skipWaiting: 0, claim: 0, addAll: [], red: [], consola: [] };
    const clave = peticion => (typeof peticion === 'string' ? peticion : peticion.url);

    const caches = {
        open: async (nombre) => {
            if (!cacheDisponible()) throw new Error('almacenamiento de caché no disponible');
            if (!almacenes.has(nombre)) almacenes.set(nombre, new Map());
            const almacen = almacenes.get(nombre);
            return {
                addAll: async (urls) => {
                    registro.addAll.push({ nombre, urls: Array.from(urls) });
                    if (fallaAddAll(nombre, Array.from(urls))) throw new TypeError('Failed to fetch');
                    Array.from(urls).forEach(url => almacen.set(url, new Response(`precache ${url}`)));
                },
                match: async peticion => almacen.get(clave(peticion)),
                put: async (peticion, respuesta) => { almacen.set(clave(peticion), respuesta); }
            };
        },
        keys: async () => Array.from(almacenes.keys()),
        delete: async nombre => almacenes.delete(nombre)
    };
    const consola = Object.fromEntries(['log', 'info', 'warn', 'error'].map(nivel =>
        [nivel, (...args) => registro.consola.push({ nivel, texto: args.join(' ') })]));
    const self = {
        addEventListener: (tipo, oyente) => { oyentes[tipo] = oyente; },
        skipWaiting: () => { registro.skipWaiting++; return Promise.resolve(); },
        clients: { claim: () => { registro.claim++; return Promise.resolve(); } }
    };
    const contexto = vm.createContext({
        self, caches, console: consola, URL, Response, Promise,
        fetch: async (peticion) => { registro.red.push(clave(peticion)); return red(peticion); }
    });
    vm.runInContext(leer('service-worker.js'), contexto, { filename: path.join(ROOT, 'service-worker.js') });

    // Despacha un evento y espera a que termine lo registrado con waitUntil
    const despachar = async (tipo, datos = {}) => {
        const pendientes = [];
        oyentes[tipo]({ waitUntil: promesa => pendientes.push(promesa), ...datos });
        await Promise.all(pendientes);
    };

    // Despacha un fetch: devuelve null si el service worker no lo intercepta
    const pedir = async (url, method = 'GET') => {
        let respuesta = null;
        oyentes.fetch({ request: { url, method }, respondWith: promesa => { respuesta = promesa; } });
        return respuesta ? await respuesta : null;
    };

    return {
        registro,
        almacenes,
        despachar,
        pedir,
        constante: nombre => JSON.parse(vm.runInContext(`JSON.stringify(${nombre})`, contexto))
    };
}

const texto = async respuesta => (respuesta ? respuesta.text() : null);

test('[SW-001] los cachés se nombran con la versión de caché del sitio', () => {
    const sw = crearServiceWorker();
    const version = sw.constante('CACHE_VERSION');

    assert.match(version, /^ropavejero-v\d{4}-\d{2}-\d{2}_\d+$/);
    assert.equal(sw.constante('CACHE_NAME'), `${version}-static`);
    assert.equal(sw.constante('DATA_CACHE_NAME'), `${version}-data`);
});

test('[SW-002] al instalarse precachea los recursos estáticos y las imágenes de Instagram, y se activa de inmediato', async () => {
    const sw = crearServiceWorker();
    await sw.despachar('install');
    const estatico = sw.constante('CACHE_NAME');

    assert.deepEqual(sw.registro.addAll, [
        { nombre: estatico, urls: sw.constante('STATIC_RESOURCES') },
        { nombre: estatico, urls: sw.constante('INSTAGRAM_IMAGES') }
    ]);
    assert.equal(sw.registro.skipWaiting, 1);
});

test('[SW-002] si alguna imagen de Instagram no se puede precachear la instalación termina igual', async () => {
    const sw = crearServiceWorker({ fallaAddAll: (_nombre, urls) => urls.some(url => url.includes('/img/IG_')) });
    await sw.despachar('install');

    assert.equal(sw.registro.skipWaiting, 1);
    assert.ok(sw.registro.consola.some(e => e.nivel === 'warn' && e.texto.includes('imágenes no se pudieron cachear')));
});

test('[SW-003] al activarse borra los cachés de versiones anteriores del sitio y toma el control de las pestañas', async () => {
    const sw = crearServiceWorker({ cachesIniciales: {
        'ropavejero-v2026-08-26_1-static': {},
        'ropavejero-v2026-08-26_1-data': {},
        'ropavejero-v1.0.6-static': {},
        'cache-de-otra-app': {}
    } });
    const actuales = [sw.constante('CACHE_NAME'), sw.constante('DATA_CACHE_NAME')];
    await sw.despachar('install');
    await sw.pedir(`${ORIGEN}/security-policy.html`);

    await sw.despachar('activate');

    assert.deepEqual(Array.from(sw.almacenes.keys()).sort(), [...actuales, 'cache-de-otra-app'].sort());
    assert.equal(sw.registro.claim, 1);
});

test('[SW-004] no intercepta peticiones que no sean GET ni las de la hoja de productos o analítica', async () => {
    const sw = crearServiceWorker();

    assert.equal(await sw.pedir(`${ORIGEN}/index.html`, 'POST'), null);
    assert.equal(await sw.pedir('https://docs.google.com/spreadsheets/d/x/gviz/tq?tqx=out:csv'), null);
    assert.equal(await sw.pedir('https://static.cloudflareinsights.com/beacon.min.js'), null);
    assert.equal(await sw.pedir('https://www.google-analytics.com/g/collect'), null);
    assert.equal(await sw.pedir('chrome-extension://abc/script.js'), null);
    assert.deepEqual(sw.registro.red, []);
});

test('[SW-005] inicio, CSS, JS, fuentes y manifest se sirven desde el caché y solo van a la red si faltan', async () => {
    const sw = crearServiceWorker();
    await sw.despachar('install');
    const estatico = sw.almacenes.get(sw.constante('CACHE_NAME'));

    // Precacheados: no tocan la red
    for (const ruta of ['/', '/index.html', '/manifest.json', '/css/index.min.css', '/js/modules/ui.js']) {
        estatico.set(`${ORIGEN}${ruta}`, new Response(`cache ${ruta}`));
        assert.equal(await texto(await sw.pedir(`${ORIGEN}${ruta}`)), `cache ${ruta}`, ruta);
    }
    assert.deepEqual(sw.registro.red, []);

    // Con un ?v= nuevo la URL es otra: se descarga y queda guardada
    const versionada = `${ORIGEN}/js/modules/ui.js?v=2099-01-01_1`;
    assert.equal(await texto(await sw.pedir(versionada)), 'de la red');
    assert.equal(await texto(await sw.pedir(versionada)), 'de la red');
    assert.deepEqual(sw.registro.red, [versionada], 'la segunda vez sale del caché');

    for (const ruta of ['/webfonts/fa-solid-900.woff2', '/webfonts/fa-brands-400.ttf']) {
        await sw.pedir(`${ORIGEN}${ruta}`);
        assert.ok(estatico.has(`${ORIGEN}${ruta}`), ruta);
    }
});

test('[SW-005] un recurso estático que no está en caché y no se puede descargar responde 503', async () => {
    const sw = crearServiceWorker({ red: async () => { throw new TypeError('Failed to fetch'); } });
    const respuesta = await sw.pedir(`${ORIGEN}/css/index.min.css?v=x`);

    assert.equal(respuesta.status, 503);
    assert.equal(await respuesta.text(), 'Offline');
});

test('[SW-005] una respuesta de error de la red no se guarda en el caché', async () => {
    const sw = crearServiceWorker({ red: async () => new Response('no existe', { status: 404 }) });
    const url = `${ORIGEN}/js/no-existe.js`;

    assert.equal((await sw.pedir(url)).status, 404);
    assert.ok(!sw.almacenes.get(sw.constante('CACHE_NAME')).has(url));
});

test('[SW-006] las demás páginas y los JSON van primero a la red y usan el caché solo sin conexión', async () => {
    let enLinea = true;
    let version = 1;
    const sw = crearServiceWorker({ red: async () => {
        if (!enLinea) throw new TypeError('Failed to fetch');
        return new Response(`red v${version}`);
    } });
    const datos = () => sw.almacenes.get(sw.constante('DATA_CACHE_NAME'));

    for (const ruta of ['/productos', '/productos.html', '/security-policy.html', '/js/siglas.json?v=1', '/js/efemerides.json?v=1', '/api/algo']) {
        const url = `${ORIGEN}${ruta}`;
        version = 1;
        enLinea = true;
        assert.equal(await texto(await sw.pedir(url)), 'red v1', ruta);
        version = 2;
        assert.equal(await texto(await sw.pedir(url)), 'red v2', `${ruta}: siempre trae la versión nueva`);
        assert.ok(datos().has(url), ruta);

        enLinea = false;
        assert.equal(await texto(await sw.pedir(url)), 'red v2', `${ruta}: sin conexión usa la última copia`);
    }

    enLinea = false;
    const nunca = await sw.pedir(`${ORIGEN}/pagina-nunca-visitada.html`);
    assert.equal(nunca.status, 503);
});

test('[SW-007] las imágenes se responden desde el caché y se actualizan en segundo plano', async () => {
    let version = 1;
    const sw = crearServiceWorker({ red: async () => new Response(`imagen v${version}`) });
    const url = `${ORIGEN}/img/hero-800.webp`;

    assert.equal(await texto(await sw.pedir(url)), 'imagen v1', 'la primera vez viene de la red');
    version = 2;
    assert.equal(await texto(await sw.pedir(url)), 'imagen v1', 'luego responde con la copia guardada');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(await texto(await sw.pedir(url)), 'imagen v2', 'y deja actualizada la copia para la próxima vez');
    assert.equal(sw.registro.red.length, 3);

    for (const extension of ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']) {
        await sw.pedir(`${ORIGEN}/img/x.${extension}`);
        assert.ok(sw.almacenes.get(sw.constante('CACHE_NAME')).has(`${ORIGEN}/img/x.${extension}`), extension);
    }
});

test('[SW-007] sin conexión una imagen guardada se sigue mostrando', async () => {
    let enLinea = true;
    const sw = crearServiceWorker({ red: async () => { if (!enLinea) throw new TypeError('Failed to fetch'); return new Response('imagen'); } });
    const url = `${ORIGEN}/img/IG_1-400.webp`;

    await sw.pedir(url);
    enLinea = false;
    assert.equal(await texto(await sw.pedir(url)), 'imagen');
});

test('[SW-008] atiende los mensajes SKIP_WAITING y CLEAR_CACHE', async () => {
    const sw = crearServiceWorker({ cachesIniciales: { 'cache-de-otra-app': {} } });
    await sw.despachar('install');
    assert.equal(sw.registro.skipWaiting, 1);

    await sw.despachar('message', { data: { type: 'SKIP_WAITING' } });
    assert.equal(sw.registro.skipWaiting, 2);

    await sw.despachar('message', { data: { type: 'OTRO' } });
    await sw.despachar('message', { data: null });
    assert.ok(sw.almacenes.size > 0);

    await sw.despachar('message', { data: { type: 'CLEAR_CACHE' } });
    assert.equal(sw.almacenes.size, 0);
});

test('[SW-009] todo lo que se precachea existe en el repositorio', () => {
    const sw = crearServiceWorker();
    const aArchivo = ruta => ({ '/': 'index.html', '/productos': 'productos.html' }[ruta] || ruta.replace(/^\//, ''));
    const faltantes = [...sw.constante('STATIC_RESOURCES'), ...sw.constante('INSTAGRAM_IMAGES')]
        .filter(ruta => !existe(aArchivo(ruta)));

    // Un archivo faltante hace fallar cache.addAll completo y deja el sitio sin precache
    assert.deepEqual(faltantes, []);
    assert.equal(new Set(sw.constante('STATIC_RESOURCES')).size, sw.constante('STATIC_RESOURCES').length, 'sin duplicados');
});

test('[SW-010] los módulos JS y el punto de entrada que cargan las páginas están en el precache', () => {
    const precache = new Set(crearServiceWorker().constante('STATIC_RESOURCES'));
    const faltantes = new Set();

    ['index.html', 'productos.html'].forEach(html => {
        scriptsDeclarados(html)
            .filter(script => script.ruta.startsWith('js/modules/') || script.ruta === 'js/index.min.js')
            .forEach(script => { if (!precache.has(`/${script.ruta}`)) faltantes.add(script.ruta); });
    });

    assert.deepEqual([...faltantes], []);
    ['/', '/index.html', '/productos', '/productos.html', '/css/index.min.css', '/manifest.json'].forEach(ruta => assert.ok(precache.has(ruta), ruta));
});

test('[SW-011] la lista de imágenes de Instagram del precache corresponde a los posts publicados', () => {
    const contexto = vm.createContext({});
    vm.runInContext(`${leer('js/instagram_posts.js')}\n;globalThis.__posts = getInstagramPostsData();`, contexto);
    const esperadas = JSON.parse(JSON.stringify(contexto.__posts)).flatMap(post => {
        const base = `/${post.image.replace(/\.jpeg$/, '')}`;
        return [`${base}.jpeg`, `${base}-400.webp`, `${base}-800.webp`, `${base}-1200.webp`];
    });

    assert.deepEqual(crearServiceWorker().constante('INSTAGRAM_IMAGES'), esperadas);
});

// ---------- Registro desde las páginas ----------

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

test('[SW-012] inicio y catálogo registran el service worker versionado, con alcance de todo el sitio, al terminar de cargar', async () => {
    for (const html of ['index.html', 'productos.html']) {
        const registro = scriptsInline(html).find(codigo => codigo.includes('serviceWorker.register'));
        assert.ok(registro, `${html} registra el service worker`);

        const llamadas = [];
        pagina = await abrirPagina({ html, antes: (w) => {
            Object.defineProperty(w.navigator, 'serviceWorker', {
                value: { register: (...args) => { llamadas.push(args); return Promise.resolve({}); } },
                configurable: true
            });
        } });
        pagina.evaluar(registro, `${html} (registro del service worker)`);
        assert.equal(llamadas.length, 0, 'espera al evento load');

        pagina.window.dispatchEvent(new pagina.window.Event('load'));
        assert.equal(llamadas.length, 1, html);
        assert.match(llamadas[0][0], /^\/service-worker\.js\?v=\d{4}-\d{2}-\d{2}_\d+$/, html);
        assert.deepEqual({ ...llamadas[0][1] }, { scope: '/' }, html);
        await pagina.cerrar();

        // En un navegador sin service workers el script no hace nada ni falla
        pagina = await abrirPagina({ html });
        pagina.evaluar(registro);
        pagina.window.dispatchEvent(new pagina.window.Event('load'));
        assert.deepEqual(pagina.errores, [], html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[SW-013] si el almacenamiento de caché no está disponible, responde igual desde la red', async () => {
    let enLinea = true;
    const sw = crearServiceWorker({
        cacheDisponible: () => false,
        red: async () => { if (!enLinea) throw new TypeError('Failed to fetch'); return new Response('de la red'); }
    });
    const urls = [
        `${ORIGEN}/index.html`,                 // caché primero
        `${ORIGEN}/js/modules/ui.js?v=1`,       // caché primero
        `${ORIGEN}/productos.html`,             // red primero
        `${ORIGEN}/js/siglas.json?v=1`,         // red primero
        `${ORIGEN}/img/hero-800.webp`           // imagen
    ];

    for (const url of urls) {
        const respuesta = await sw.pedir(url);
        assert.ok(respuesta, `${url}: sin respuesta`);
        assert.equal(await respuesta.text(), 'de la red', url);
    }
    assert.equal(sw.registro.red.length, urls.length);

    // Sin caché y sin conexión no queda la petición colgada ni rechazada: responde 503
    enLinea = false;
    for (const url of urls) {
        const respuesta = await sw.pedir(url);
        assert.equal(respuesta.status, 503, url);
    }
});

test('[SW-013] un fallo al guardar en el caché no impide entregar la respuesta de la red', async () => {
    let disponible = true;
    const sw = crearServiceWorker({ cacheDisponible: () => disponible });
    await sw.pedir(`${ORIGEN}/productos.html`);

    disponible = false;
    assert.equal(await (await sw.pedir(`${ORIGEN}/productos.html`)).text(), 'de la red');
    assert.equal(await (await sw.pedir(`${ORIGEN}/css/index.min.css?v=2`)).text(), 'de la red');
});
