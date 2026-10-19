'use strict';

// Specs: specs/base/10-analytics.md, 11-seo.md
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { abrirPagina, parsear, leer, existe, ROOT } = require('./helpers/pagina');

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

const UA = {
    Chrome: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    Edge: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    Opera: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0',
    Firefox: 'Mozilla/5.0 (Windows NT 10.0; rv:131.0) Gecko/20100101 Firefox/131.0',
    Safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    DuckDuckGo: 'Mozilla/5.0 (Linux; Android 14) DuckDuckGo/5',
    Unknown: 'curl/8.0'
};

function usarNavegador(w, userAgent, { brave = false } = {}) {
    Object.defineProperty(w.navigator, 'userAgent', { value: userAgent, configurable: true });
    Object.defineProperty(w.navigator, 'brave', { value: brave ? { isBrave: () => Promise.resolve(true) } : undefined, configurable: true });
}

async function abrirAnalytics(opciones = {}) {
    pagina = await abrirPagina({ scripts: ['js/modules/analytics.js'], ...opciones });
    return pagina;
}

// ---------- analytics.js ----------

test('[ANL-001] getBrowserInfo identifica el navegador a partir del user agent', async () => {
    await abrirAnalytics();
    const { window: w } = pagina;

    Object.entries(UA).forEach(([navegador, userAgent]) => {
        usarNavegador(w, userAgent);
        assert.equal(w.getBrowserInfo(), navegador);
    });

    usarNavegador(w, UA.Chrome, { brave: true });
    assert.equal(w.getBrowserInfo(), 'Brave');
});

test('[ANL-002] isAllowedByCSP solo acepta los dominios externos autorizados para carga dinámica', async () => {
    await abrirAnalytics();
    const { window: w } = pagina;

    ['https://docs.google.com/spreadsheets/d/x', 'https://static.cloudflareinsights.com/beacon.min.js',
        'https://cloudflareinsights.com/cdn-cgi/rum', 'https://fonts.googleapis.com/css2', 'https://fonts.gstatic.com/s/x.woff2',
        'https://sub.fonts.gstatic.com/x'
    ].forEach(url => assert.equal(w.isAllowedByCSP(url), true, url));

    ['https://evil.example/x.js', 'https://docs.google.com.evil.example/x.js', 'https://notfonts.gstatic.com.mx/', 'ruta/relativa.js', '', null
    ].forEach(url => assert.equal(w.isAllowedByCSP(url), false, String(url)));
});

test('[ANL-003] loadResourceSafely rechaza dominios no autorizados y tipos desconocidos sin tocar el DOM', async () => {
    await abrirAnalytics();
    const { window: w, document } = pagina;
    const antes = document.head.children.length;

    await assert.rejects(w.loadResourceSafely('https://evil.example/x.js'), /URL not allowed by CSP/);
    await assert.rejects(w.loadResourceSafely('https://fonts.googleapis.com/x', 'iframe'), /Unsupported resource type/);
    assert.equal(document.head.children.length, antes);
});

test('[ANL-004] loadResourceSafely inserta el script u hoja de estilos autorizado y resuelve al cargar', async () => {
    await abrirAnalytics();
    const { window: w, document } = pagina;

    const estilo = w.loadResourceSafely('https://fonts.googleapis.com/css2?family=Inter', 'style');
    const link = document.head.querySelector('link[rel="stylesheet"]');
    assert.equal(link.getAttribute('href'), 'https://fonts.googleapis.com/css2?family=Inter');
    link.onload();
    assert.equal(await estilo, link);

    const fallido = w.loadResourceSafely('https://docs.google.com/x.js');
    const script = document.head.querySelector('script[src="https://docs.google.com/x.js"]');
    assert.equal(script.async, true);
    script.onerror();
    await assert.rejects(fallido, /Failed to load script/);
});

test('[ANL-005] si el script de Cloudflare es bloqueado no hay error: se activa el analytics de respaldo', async () => {
    await abrirAnalytics();
    const { window: w, document } = pagina;
    assert.equal(w.fallbackAnalytics, undefined);

    const carga = w.loadResourceSafely('https://static.cloudflareinsights.com/beacon.min.js');
    document.head.querySelector('script[src*="cloudflareinsights"]').onerror(new w.Event('error'));

    assert.equal(await carga, null);
    assert.equal(typeof w.fallbackAnalytics.pageView, 'function');
    assert.equal(typeof w.fallbackAnalytics.event, 'function');
    assert.doesNotThrow(() => { w.fallbackAnalytics.pageView('/x'); w.fallbackAnalytics.event('cat', 'accion', 'etiqueta', 1); });
});

test('[ANL-006] al cargar la página, si Cloudflare Analytics no está disponible se activa el respaldo', async () => {
    await abrirAnalytics({ antes: (w) => {
        const original = w.setTimeout.bind(w);
        w.setTimeout = (fn, _ms, ...args) => original(fn, 0, ...args);
    } });
    const { window: w } = pagina;
    usarNavegador(w, UA.Chrome);
    const bloqueos = w.detectBlockedResources();
    assert.deepEqual({ ...bloqueos }, { cloudflareAnalytics: false, adBlockerDetected: false, corsBlocked: false, browserBlocked: false });

    await pagina.hasta(() => bloqueos.cloudflareAnalytics, 'la detección de bloqueo');
    assert.deepEqual({ ...bloqueos }, { cloudflareAnalytics: true, adBlockerDetected: true, corsBlocked: false, browserBlocked: false });
    assert.ok(w.fallbackAnalytics);

    // En Brave, Opera y DuckDuckGo se atribuye a la política del navegador, no a un adblocker
    usarNavegador(w, UA.Opera);
    const enOpera = w.detectBlockedResources();
    await pagina.hasta(() => enOpera.cloudflareAnalytics, 'la detección de bloqueo en Opera');
    assert.deepEqual({ ...enOpera }, { cloudflareAnalytics: true, adBlockerDetected: false, corsBlocked: true, browserBlocked: true });
});

test('[ANL-006] al despachar DOMContentLoaded se programa la detección; con Cloudflare presente no se activa el respaldo', async () => {
    await abrirAnalytics({ antes: (w) => {
        const original = w.setTimeout.bind(w);
        w.setTimeout = (fn, _ms, ...args) => original(fn, 0, ...args);
        w.__CF$cv$params = { r: 'abc' };
    } });
    await pagina.iniciar();
    await pagina.esperar(30);
    assert.equal(pagina.window.fallbackAnalytics, undefined);
    await pagina.cerrar();

    await abrirAnalytics({ antes: (w) => {
        const original = w.setTimeout.bind(w);
        w.setTimeout = (fn, _ms, ...args) => original(fn, 0, ...args);
    } });
    await pagina.iniciar();
    await pagina.hasta(() => pagina.window.fallbackAnalytics, 'el analytics de respaldo');
});

test('[ANL-007] un error de carga del beacon de Cloudflare activa el respaldo; otros recursos no', async () => {
    await abrirAnalytics();
    const { window: w, document } = pagina;
    const fallar = (src) => {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
        script.dispatchEvent(new w.Event('error'));
    };

    fallar('https://ropavejeroretro.cl/js/no-existe.js');
    assert.equal(w.fallbackAnalytics, undefined);

    fallar('https://static.cloudflareinsights.com/beacon.min.js');
    assert.ok(w.fallbackAnalytics);
});

test('[ANL-008] las violaciones de CSP causadas por bloqueadores se ignoran; las reales solo se detallan en desarrollo', async () => {
    const real = { blockedURI: 'https://evil.example/x.js', violatedDirective: 'script-src', originalPolicy: "default-src 'self'", documentURI: 'https://ropavejeroretro.cl/', sourceFile: '', lineNumber: 1 };
    const deBloqueador = ['https://static.cloudflareinsights.com/beacon.min.js', 'https://www.google-analytics.com/g/collect', 'https://www.googletagmanager.com/gtm.js']
        .map(blockedURI => ({ ...real, blockedURI }));

    await abrirAnalytics({ url: 'https://ropavejeroretro.cl/' });
    [...deBloqueador, real].forEach(evento => pagina.window.handleCSPViolation(evento));
    assert.deepEqual(pagina.consola, [], 'en producción no se escribe nada en la consola');
    assert.equal(pagina.peticiones.length, 0);
    await pagina.cerrar();

    await abrirAnalytics({ url: 'http://localhost:8000/' });
    deBloqueador.forEach(evento => pagina.window.handleCSPViolation(evento));
    assert.deepEqual(pagina.mensajes('warn'), []);

    pagina.window.reportCSPViolation(real);
    pagina.window.trackResourceViolation(real);
    const avisos = pagina.mensajes('warn');
    assert.equal(avisos.filter(linea => linea === 'Blocked URI: https://evil.example/x.js').length, 2);
    assert.ok(avisos.includes('Violated Directive: script-src'));
});

test('[ANL-008] el evento securitypolicyviolation del documento se atiende sin errores', async () => {
    await abrirAnalytics({ url: 'http://localhost:8000/' });
    const { window: w, document } = pagina;

    const evento = new w.Event('securitypolicyviolation');
    Object.assign(evento, { blockedURI: 'https://evil.example/x.js', violatedDirective: 'img-src' });
    document.dispatchEvent(evento);

    assert.ok(pagina.mensajes('warn').includes('Blocked URI: https://evil.example/x.js'));
    assert.deepEqual(pagina.errores, []);
});

test('[ANL-009] trackEvent queda disponible globalmente y delega en el analytics de respaldo', async () => {
    await abrirAnalytics();
    const { window: w } = pagina;
    const eventos = [];

    assert.equal(w.trackEvent, pagina.evaluar('trackEvent'));
    assert.doesNotThrow(() => w.trackEvent('catalogo', 'buscar', 'zelda', 1), 'sin analytics activo no falla');

    w.fallbackAnalytics = { event: (...args) => eventos.push(args) };
    w.trackEvent('catalogo', 'buscar', 'zelda', 1);
    assert.deepEqual(eventos, [['catalogo', 'buscar', 'zelda']]);
});

// ---------- seo-analytics.js ----------

const PAGINAS = [
    { html: 'index.html', url: 'https://ropavejeroretro.cl/', tipo: 'home', canonical: 'https://ropavejeroretro.cl/', indexable: true },
    { html: 'productos.html', url: 'https://ropavejeroretro.cl/productos', tipo: 'products', canonical: 'https://ropavejeroretro.cl/productos', indexable: true },
    { html: '404.html', url: 'https://ropavejeroretro.cl/no-existe', tipo: '404', canonical: 'https://ropavejeroretro.cl/404.html', indexable: false },
    { html: 'security-policy.html', url: 'https://ropavejeroretro.cl/security-policy.html', tipo: 'security-policy', canonical: 'https://ropavejeroretro.cl/security-policy.html', indexable: false },
    { html: 'security-acknowledgments.html', url: 'https://ropavejeroretro.cl/security-acknowledgments.html', tipo: 'security-acknowledgments', canonical: 'https://ropavejeroretro.cl/security-acknowledgments.html', indexable: false },
    { html: 'old.html', url: 'https://ropavejeroretro.cl/old.html', tipo: 'legacy', canonical: 'https://ropavejeroretro.cl/old.html', indexable: false }
];

const abrirSeo = ({ html, url }) => abrirPagina({ html, url, scripts: ['js/seo-analytics.js'] }).then(p => { pagina = p; return p; });
const eventos = nombre => Array.from(pagina.window.dataLayer).filter(e => e && e.event === nombre).map(e => ({ ...e }));

test('[SEO-001] el consentimiento por defecto niega publicidad y permite analítica, antes de cualquier otro evento', async () => {
    await abrirSeo(PAGINAS[0]);
    const primero = Array.from(pagina.window.dataLayer[0]);

    assert.equal(typeof pagina.window.gtag, 'function');
    assert.deepEqual([primero[0], primero[1]], ['consent', 'default']);
    assert.deepEqual({ ...primero[2] }, {
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        analytics_storage: 'granted', functionality_storage: 'granted', security_storage: 'granted',
        wait_for_update: 500
    });
});

test('[SEO-002] cada página envía seo_page_context con su tipo, idioma, título, URL canónica y descripción', async () => {
    for (const info of PAGINAS) {
        await abrirSeo(info);
        const documento = pagina.document;
        const [contexto, ...otros] = eventos('seo_page_context');

        assert.equal(otros.length, 0, info.html);
        assert.deepEqual(contexto, {
            event: 'seo_page_context',
            ga_measurement_id: 'G-GCE8SP8NBZ',
            page_type: info.tipo,
            page_language: documento.documentElement.lang,
            page_title: documento.title,
            page_path: new URL(info.url).pathname,
            page_location: info.url,
            canonical_url: info.canonical,
            meta_description: documento.querySelector('meta[name="description"]').content
        }, info.html);
        assert.ok(contexto.page_title.trim(), `${info.html}: título`);
        assert.ok(contexto.meta_description.trim(), `${info.html}: descripción`);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[SEO-002] sin data-page-type ni canonical se usan "website" y la URL actual', async () => {
    pagina = await abrirPagina({ url: 'https://ropavejeroretro.cl/suelta?x=1', scripts: ['js/seo-analytics.js'] });
    const [contexto] = eventos('seo_page_context');

    assert.equal(contexto.page_type, 'website');
    assert.equal(contexto.canonical_url, 'https://ropavejeroretro.cl/suelta?x=1');
    assert.equal(contexto.meta_description, '');
    assert.equal(contexto.page_language, 'es');
});

test('[SEO-003] Google Tag Manager se inyecta una sola vez con el contenedor del sitio', async () => {
    await abrirSeo(PAGINAS[0]);
    pagina.cargar('js/seo-analytics.js');
    const scripts = pagina.document.querySelectorAll('script[data-gtm-id]');

    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].dataset.gtmId, 'GTM-5D6LZB66');
    assert.equal(scripts[0].getAttribute('src'), 'https://www.googletagmanager.com/gtm.js?id=GTM-5D6LZB66');
    assert.equal(scripts[0].async, true);
});

test('[SEO-008] el evento de inicio de GTM se envía una vez, después del consentimiento y antes de seo_page_context', async () => {
    for (const info of PAGINAS) {
        const antes = Date.now();
        await abrirSeo(info);
        pagina.cargar('js/seo-analytics.js');
        const capa = Array.from(pagina.window.dataLayer);
        const posicion = capa.findIndex(e => e && e.event === 'gtm.js');
        const inicio = eventos('gtm.js');

        assert.equal(inicio.length, 1, info.html);
        assert.equal(typeof inicio[0]['gtm.start'], 'number', info.html);
        assert.ok(inicio[0]['gtm.start'] >= antes && inicio[0]['gtm.start'] <= Date.now(), info.html);
        assert.deepEqual([capa[0][0], capa[0][1]], ['consent', 'default'], info.html);
        assert.ok(posicion > 0, info.html);
        assert.ok(posicion < capa.findIndex(e => e && e.event === 'seo_page_context'), info.html);
    }
});

test('[SEO-004] un clic en un enlace externo envía outbound_click; los enlaces internos no', async () => {
    await abrirSeo(PAGINAS[0]);
    const { document } = pagina;

    pagina.click(document.querySelector('.nav a[href="#about"]'));
    pagina.click(document.querySelector('.nav a[href="productos.html"]'));
    pagina.click(document.querySelector('h1'));
    assert.deepEqual(eventos('outbound_click'), []);

    const instagram = document.querySelector('.hero-buttons a[href^="https://www.instagram.com"]');
    pagina.click(instagram);
    assert.deepEqual(eventos('outbound_click'), [{
        event: 'outbound_click',
        page_type: 'home',
        link_url: 'https://www.instagram.com/ropavejero.retro/',
        link_text: instagram.textContent.trim()
    }]);
    assert.deepEqual(eventos('generate_lead'), []);
});

test('[SEO-005] un clic en un enlace de WhatsApp envía además generate_lead, aunque se pulse el ícono', async () => {
    for (const info of PAGINAS.slice(0, 2)) {
        await abrirSeo(info);
        const icono = pagina.document.querySelector('a[href^="https://wa.me/"] i');
        assert.ok(icono, `${info.html} tiene botón de WhatsApp`);

        pagina.click(icono);

        const enlace = icono.closest('a').href;
        assert.deepEqual(eventos('generate_lead'), [{ event: 'generate_lead', lead_channel: 'whatsapp', page_type: info.tipo, link_url: enlace }], info.html);
        assert.equal(eventos('outbound_click').length, 1, info.html);
        assert.equal(eventos('outbound_click')[0].link_url, enlace, info.html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[SEO-006] solo el inicio y el catálogo son indexables; el resto lleva noindex', () => {
    const robots = html => parsear(html).querySelector('meta[name="robots"]').getAttribute('content');

    PAGINAS.forEach(info => {
        if (info.indexable) {
            assert.match(robots(info.html), /^index, follow/, info.html);
        } else {
            assert.match(robots(info.html), /^noindex/, info.html);
        }
        assert.equal(parsear(info.html).querySelector('link[rel="canonical"]').getAttribute('href'), info.canonical, info.html);
    });
    assert.match(robots('ps3.html'), /^noindex/);
});

test('[SEO-007] toda página que carga seo-analytics.js declara su data-page-type', () => {
    const htmls = ['index.html', 'productos.html', '404.html', 'security-policy.html', 'security-acknowledgments.html', 'old.html', 'ps3.html'];
    const tipos = new Map();

    htmls.forEach(html => {
        const documento = parsear(html);
        const cargaSeo = documento.querySelector('script[src*="seo-analytics.js"]');
        const tipo = documento.body.dataset.pageType;
        if (cargaSeo) {
            assert.ok(tipo, `${html} carga seo-analytics.js sin data-page-type`);
            tipos.set(html, tipo);
        }
    });

    assert.deepEqual(Object.fromEntries(tipos), Object.fromEntries(PAGINAS.map(info => [info.html, info.tipo])));
});

// ---------- Contenido para buscadores (2026-10-18-seo-contenido) ----------

const INDEXABLES = {
    'index.html': {
        titulo: 'Ropavejero Retro | Juegos y consolas retro en Chile',
        descripcion: 'Tienda de juegos y consolas retro originales en Santiago: Nintendo, PlayStation, Sega, Xbox y Atari. Envíos a todo Chile y local en Persa Bio Bio.'
    },
    'productos.html': {
        titulo: 'Catálogo de juegos y consolas retro | Ropavejero Retro',
        descripcion: 'Juegos, consolas y accesorios retro disponibles hoy: Nintendo, PlayStation, Sega, Xbox y Atari. Revisa precios y escríbenos por WhatsApp.'
    }
};
const TODAS_LAS_PAGINAS = ['index.html', 'productos.html', '404.html', 'security-policy.html', 'security-acknowledgments.html', 'old.html', 'ps3.html'];
const PERFIL_LOCAL = 'https://www.google.com/maps?cid=2529777286738516949';
const IMAGEN_REDES = 'https://ropavejeroretro.cl/img/og-ropavejero.jpg';

const meta = (documento, atributo, valor) => {
    const elemento = documento.querySelector(`meta[${atributo}="${valor}"]`);
    return elemento ? elemento.getAttribute('content') : null;
};

// Diccionario de ui.js: la primera aparición de cada clave es la española y la segunda la inglesa
const traducciones = clave => [...leer('js/modules/ui.js').matchAll(new RegExp(`'${clave}':\\s*'([^']*)'`, 'g'))].map(m => m[1]);

function dimensionesJpeg(ruta) {
    const datos = fs.readFileSync(path.join(ROOT, ruta));
    let i = 2;
    while (i < datos.length) {
        const marcador = datos[i + 1];
        if (marcador >= 0xC0 && marcador <= 0xC3) {
            return { alto: datos.readUInt16BE(i + 5), ancho: datos.readUInt16BE(i + 7) };
        }
        i += 2 + datos.readUInt16BE(i + 2);
    }
    return null;
}

test('[SEO-009] inicio y catálogo tienen título y descripción para buscadores, repetidos en Open Graph y X', () => {
    Object.entries(INDEXABLES).forEach(([html, esperado]) => {
        const documento = parsear(html);
        const titulo = documento.title;
        const descripcion = meta(documento, 'name', 'description');

        assert.equal(titulo, esperado.titulo, html);
        assert.equal(descripcion, esperado.descripcion, html);
        assert.ok(titulo.length <= 60, `${html}: título de ${titulo.length} caracteres`);
        assert.ok(descripcion.length >= 70 && descripcion.length <= 160, `${html}: descripción de ${descripcion.length} caracteres`);
        assert.match(titulo, /retro/i, html);
        assert.match(descripcion, /retro/i, html);
        assert.equal(meta(documento, 'property', 'og:title'), titulo, `${html}: og:title`);
        assert.equal(meta(documento, 'name', 'twitter:title'), titulo, `${html}: twitter:title`);
        assert.equal(meta(documento, 'property', 'og:description'), descripcion, `${html}: og:description`);
        assert.equal(meta(documento, 'name', 'twitter:description'), descripcion, `${html}: twitter:description`);
    });
});

test('[SEO-010] el H1 del inicio y del catálogo dice qué se vende, en español y en inglés', () => {
    assert.deepEqual(traducciones('hero-title'), [
        'Juegos y consolas retro en Chile<br/>Todo lo Retro en un solo lugar',
        'Retro games and consoles in Chile<br/>Everything Retro in one place'
    ]);
    assert.deepEqual(traducciones('products-title'), ['Juegos y consolas retro disponibles', 'Available retro games and consoles']);
    assert.equal(parsear('index.html').querySelector('h1').innerHTML, 'Juegos y consolas retro en Chile<br>Todo lo Retro en un solo lugar');
    assert.equal(parsear('productos.html').querySelector('h1').textContent, 'Juegos y consolas retro disponibles');
});

test('[SEO-011] ningún enlace interno apunta a index.html', () => {
    const enlaces = TODAS_LAS_PAGINAS.flatMap(html => Array.from(parsear(html).querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(href => /^(\.\/|\/)?index\.html/.test(href))
        .map(href => `${html}: ${href}`));

    assert.deepEqual(enlaces, []);
    assert.equal(parsear('404.html').querySelector('a.logo').getAttribute('href'), '/');
});

test('[SEO-012] no hay valoraciones ni reseñas ocultas, y los datos estructurados van solo en JSON-LD', () => {
    TODAS_LAS_PAGINAS.forEach(html => {
        const documento = parsear(html);
        Array.from(documento.querySelectorAll('script')).forEach((script, i) => {
            const texto = script.textContent;
            assert.doesNotMatch(texto, /AggregateRating|"@type":\s*"Review"/, `${html}: script ${i + 1}`);
            if (/"@context"\s*:\s*"https?:\/\/schema\.org"/.test(texto)) {
                assert.equal(script.getAttribute('type'), 'application/ld+json', `${html}: script ${i + 1} con datos de schema.org`);
            }
        });
        assert.equal(documento.querySelectorAll('[itemprop="aggregateRating"], [itemprop="review"]').length, 0, html);
    });
});

test('[SEO-013] los datos estructurados describen el local con dirección, coordenadas, teléfono, horario y Perfil de Empresa', () => {
    const documento = parsear('index.html');
    const nodos = Array.from(documento.querySelectorAll('script[type="application/ld+json"]'))
        .flatMap(bloque => JSON.parse(bloque.textContent)['@graph'] || []);
    const local = nodos.find(nodo => nodo['@id'] === 'https://doubleimpactstore.cl/#store');

    assert.ok(local, 'falta el Store del local');
    assert.equal(local['@type'], 'Store');
    assert.match(local.address.streetAddress, /Bio Bio 654, Local 58/);
    assert.deepEqual(
        [local.address.addressLocality, local.address.addressRegion, local.address.postalCode, local.address.addressCountry],
        ['Santiago', 'Región Metropolitana', '8361348', 'CL']
    );
    assert.deepEqual([local.geo['@type'], local.geo.latitude, local.geo.longitude], ['GeoCoordinates', -33.4738041, -70.6410784]);
    assert.equal(local.telephone, '+56967691585');
    assert.equal(local.hasMap, PERFIL_LOCAL);
    assert.ok(local.openingHoursSpecification, 'falta el horario');
    assert.ok([].concat(local.alternateName).includes('Double Impact Store SpA'), 'alternateName con el nombre del Perfil de Empresa');
    assert.equal(meta(documento, 'name', 'geo.position'), '-33.4738041;-70.6410784');
    assert.equal(meta(documento, 'name', 'ICBM'), '-33.4738041, -70.6410784');
});

test('[SEO-014] inicio y catálogo comparten en redes una imagen propia de 1200×630', () => {
    assert.ok(existe('img/og-ropavejero.jpg'), 'falta img/og-ropavejero.jpg');
    assert.deepEqual(dimensionesJpeg('img/og-ropavejero.jpg'), { alto: 630, ancho: 1200 });

    Object.keys(INDEXABLES).forEach(html => {
        const documento = parsear(html);
        assert.equal(meta(documento, 'property', 'og:image'), IMAGEN_REDES, html);
        assert.equal(meta(documento, 'property', 'og:image:width'), '1200', html);
        assert.equal(meta(documento, 'property', 'og:image:height'), '630', html);
        assert.ok((meta(documento, 'property', 'og:image:alt') || '').trim(), `${html}: og:image:alt`);
        assert.equal(meta(documento, 'name', 'twitter:image'), IMAGEN_REDES, html);
        assert.ok((meta(documento, 'name', 'twitter:image:alt') || '').trim(), `${html}: twitter:image:alt`);
    });
});

test('[SEO-015] robots.txt contiene solo directivas que Google usa, sobre rutas que existen', () => {
    const lineas = leer('robots.txt').split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));

    lineas.forEach(linea => assert.match(linea, /^(User-agent|Allow|Disallow|Sitemap):/, linea));
    lineas.filter(l => /^Disallow:\s*\/\S/.test(l)).forEach(linea => {
        assert.ok(existe(linea.replace(/^Disallow:\s*\//, '')), `${linea}: la ruta no existe`);
    });
});
