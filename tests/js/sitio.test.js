'use strict';

// Specs: specs/base/13-integridad-sitio.md, 14-paginas-legacy.md
// Reglas que conectan archivos entre sí: lo que se rompe "en otra parte" cuando se toca algo.
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, MODULOS, abrirPagina, leer, existe, sinQuery, parsear, scriptsDeclarados, scriptsInline, respuesta } = require('./helpers/pagina');

const PAGINAS_COMPLETAS = ['index.html', 'productos.html'];
const PAGINAS_MINIMAS = ['404.html', 'security-policy.html', 'security-acknowledgments.html'];
const PAGINAS_CON_CSP = [...PAGINAS_COMPLETAS, ...PAGINAS_MINIMAS, 'old.html'];
const TODAS = [...PAGINAS_CON_CSP, 'ps3.html'];
const VERSION = /\?v=\d{4}-\d{2}-\d{2}_\d+$/;

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

// ---------- Carga de scripts ----------

test('[SITE-001] inicio y catálogo cargan los módulos en orden de dependencia, con defer y versión de caché', () => {
    const esperado = {
        'index.html': ['js/seo-analytics.js', ...MODULOS.filter(m => m !== 'js/modules/products.js'), 'js/index.min.js'],
        'productos.html': ['js/seo-analytics.js', ...MODULOS, 'js/index.min.js']
    };

    PAGINAS_COMPLETAS.forEach(html => {
        const scripts = scriptsDeclarados(html);
        assert.deepEqual(scripts.map(s => s.ruta), esperado[html], html);
        scripts.forEach(s => {
            assert.ok(s.defer, `${html}: ${s.ruta} sin defer`);
            assert.match(s.src, VERSION, `${html}: ${s.ruta} sin ?v=`);
        });
    });
});

test('[SITE-001] todo archivo de js/modules/ está contemplado en el orden de carga', () => {
    const enDisco = fs.readdirSync(path.join(ROOT, 'js', 'modules')).filter(f => f.endsWith('.js')).map(f => `js/modules/${f}`).sort();

    assert.deepEqual(enDisco, [...MODULOS].sort(), 'un módulo nuevo debe agregarse a los HTML, al service worker y a MODULOS del arnés');
});

test('[SITE-002] la página 404 y las de seguridad cargan solo seo-analytics.js, logger.js, ui.js e index.min.js', () => {
    PAGINAS_MINIMAS.forEach(html => {
        const scripts = scriptsDeclarados(html);
        assert.deepEqual(scripts.map(s => s.ruta), ['js/seo-analytics.js', 'js/modules/logger.js', 'js/modules/ui.js', 'js/index.min.js'], html);
        scripts.forEach(s => {
            assert.ok(s.defer, `${html}: ${s.ruta} sin defer`);
            assert.match(s.src, VERSION, `${html}: ${s.ruta} sin ?v=`);
        });
    });
});

test('[SITE-003] los archivos minificados que sirve el sitio corresponden a sus fuentes', async () => {
    const terser = require('terser');
    const csso = require('csso');

    for (const [fuente, minificado] of [['js/index.js', 'js/index.min.js'], ['js/app.js', 'js/app.min.js']]) {
        const { code } = await terser.minify(leer(fuente), { compress: true, mangle: true });
        assert.equal(code.trim(), leer(minificado).trim(), `${minificado} está desactualizado: regenerarlo desde ${fuente}`);
    }
    for (const [fuente, minificado] of [['css/index.css', 'css/index.min.css'], ['css/app.css', 'css/app.min.css']]) {
        assert.equal(csso.minify(leer(fuente)).css.trim(), leer(minificado).trim(), `${minificado} está desactualizado: correr npm run minify:css`);
    }
});

test('[SITE-004] toda función que invoca index.js existe en las páginas que cargan todos los módulos', async () => {
    const fuente = leer('js/index.js');
    const invocadas = [...new Set([...fuente.matchAll(/\b((?:init|load|apply|lazy)[A-Za-z]\w*)\(/g)].map(m => m[1]))];
    assert.ok(invocadas.includes('initTheme') && invocadas.includes('loadEfemerides') && invocadas.includes('loadSiglas'));

    for (const html of PAGINAS_COMPLETAS) {
        pagina = await abrirPagina({ html, scripts: 'declarados' });
        const faltantes = invocadas.filter(nombre => pagina.evaluar(`typeof ${nombre}`) !== 'function');
        const esperadas = html === 'index.html' ? ['lazyInitProducts'] : [];

        assert.deepEqual(faltantes, esperadas, html);
        await pagina.cerrar();
    }
    pagina = null;

    // Las funciones de módulos que no todas las páginas cargan van protegidas
    ['loadSiglas', 'lazyInitProducts', 'loadEfemerides'].forEach(nombre => {
        assert.match(fuente, new RegExp(`typeof ${nombre} === 'function'`), `${nombre} debe ir protegida con typeof`);
    });
});

test('[SITE-004] la interfaz se inicia aunque las siglas no carguen', async () => {
    pagina = await abrirPagina({
        html: 'index.html',
        scripts: 'declarados',
        iniciar: true,
        rutas: url => (url.includes('siglas.json') ? respuesta('error', { status: 500, tipo: 'text/plain' }) : undefined)
    });
    const { document } = pagina;

    pagina.click(document.getElementById('themeBtn'));
    assert.ok(document.documentElement.classList.contains('light-mode'));
    pagina.click(document.getElementById('mobileMenuBtn'));
    assert.ok(document.getElementById('mobileMenu').classList.contains('active'));
    assert.deepEqual(pagina.errores.map(e => e.message), []);
});

test('[SITE-005] inicio y catálogo arrancan sin errores de JavaScript', async () => {
    for (const html of PAGINAS_COMPLETAS) {
        const url = html === 'index.html' ? 'https://ropavejeroretro.cl/' : 'https://ropavejeroretro.cl/productos';
        pagina = await abrirPagina({ html, url, scripts: 'declarados', iniciar: true });
        await pagina.asentar();

        assert.deepEqual(pagina.errores.map(e => e.message), [], html);
        assert.deepEqual(pagina.mensajes('error'), [], html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[SITE-006] en la página 404 y las de seguridad funcionan el botón de tema y el menú móvil', async () => {
    for (const html of PAGINAS_MINIMAS) {
        pagina = await abrirPagina({ html, scripts: 'declarados', iniciar: true });
        const { document, window: w } = pagina;
        const menu = document.getElementById('mobileMenu');
        const boton = document.getElementById('themeBtn');

        pagina.click(boton);
        assert.ok(document.documentElement.classList.contains('light-mode'), `${html}: tema claro`);
        assert.ok(boton.querySelector('i').classList.contains('fa-sun'), `${html}: ícono`);
        assert.equal(w.localStorage.getItem('theme'), 'light', `${html}: se recuerda`);
        pagina.click(boton);
        assert.ok(!document.documentElement.classList.contains('light-mode'), `${html}: tema oscuro`);
        assert.equal(w.localStorage.getItem('theme'), 'dark', html);

        pagina.click(document.getElementById('mobileMenuBtn'));
        assert.ok(menu.classList.contains('active'), `${html}: menú abre`);
        assert.equal(document.body.style.overflow, 'hidden', html);
        pagina.click(document.getElementById('mobileMenuClose'));
        assert.ok(!menu.classList.contains('active'), `${html}: menú cierra`);

        pagina.click(document.getElementById('mobileMenuBtn'));
        pagina.despachar(document, 'keydown', { key: 'Escape' });
        assert.ok(!menu.classList.contains('active'), `${html}: Escape`);
        assert.equal(document.body.style.overflow, '', html);

        assert.deepEqual(pagina.errores.map(e => e.message), [], html);
        assert.deepEqual(pagina.mensajes('error'), [], html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[SITE-019] la página 404 y las de seguridad aplican el tema guardado y se muestran siempre en español', async () => {
    for (const html of PAGINAS_MINIMAS) {
        const original = Array.from(parsear(html).querySelectorAll('[data-translate]'), e => e.innerHTML);
        pagina = await abrirPagina({ html, scripts: 'declarados', iniciar: true, almacenamiento: { theme: 'light', language: 'en' } });
        const { document } = pagina;

        assert.ok(document.documentElement.classList.contains('light-mode'), `${html}: tema guardado`);
        assert.ok(document.querySelector('#themeBtn i').classList.contains('fa-sun'), html);

        // Sin selector de idioma, el idioma guardado no traduce la página a medias
        assert.deepEqual(Array.from(document.querySelectorAll('[data-translate]'), e => e.innerHTML), original, `${html}: textos`);
        assert.equal(document.getElementById('languageBtn'), null, html);

        // Barra de progreso y botón "volver arriba"
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
        Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });
        pagina.desplazar(500);
        assert.equal(document.getElementById('progress').style.width, '50%', html);
        assert.ok(document.getElementById('backToTopBtn').classList.contains('visible'), html);
        pagina.click(document.getElementById('backToTopBtn'));
        assert.equal(pagina.scrolls.length, 1, html);

        // No piden datos que no usan
        assert.deepEqual(pagina.peticiones.map(p => p.original), [], `${html}: peticiones`);
        assert.deepEqual(pagina.errores.map(e => e.message), [], html);
        await pagina.cerrar();
    }
    pagina = null;
});

// ---------- Referencias entre archivos ----------

// Archivo del repo al que apunta una referencia local, o null si es externa / solo un ancla
function archivoDe(ref, htmlOrigen) {
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:|\/\/|#)/i.test(ref)) return null;
    let ruta = sinQuery(ref);
    if (ruta === '/' || ruta === '') return ruta === '/' ? 'index.html' : null;
    ruta = ruta.replace(/^\//, '');
    if (!path.extname(ruta)) ruta += '.html';
    return htmlOrigen && !ref.startsWith('/') ? path.posix.join(path.posix.dirname(htmlOrigen), ruta) : ruta;
}

test('[SITE-007] todo archivo local referenciado desde los HTML existe', () => {
    const faltantes = [];

    TODAS.forEach(html => {
        const documento = parsear(html);
        const refs = [];
        documento.querySelectorAll('[href]:not(use)').forEach(e => refs.push(e.getAttribute('href')));
        documento.querySelectorAll('[src]').forEach(e => refs.push(e.getAttribute('src')));
        documento.querySelectorAll('[srcset]').forEach(e => {
            e.getAttribute('srcset').split(',').forEach(candidato => refs.push(candidato.trim().split(/\s+/)[0]));
        });

        refs.forEach(ref => {
            const archivo = archivoDe(ref, html);
            if (archivo && !existe(archivo)) faltantes.push(`${html}: ${ref}`);
        });
    });

    assert.deepEqual(faltantes, []);
});

test('[SITE-008] todo enlace a una sección apunta a un id que existe en la página de destino', () => {
    const ids = Object.fromEntries(TODAS.map(html => [html, new Set(Array.from(parsear(html).querySelectorAll('[id]'), e => e.id))]));
    const rotos = [];

    TODAS.forEach(html => {
        parsear(html).querySelectorAll('a[href*="#"]').forEach(enlace => {
            const href = enlace.getAttribute('href');
            if (/^(https?:|mailto:)/i.test(href)) return;
            const [ruta, ancla] = href.split('#');
            if (!ancla) return;
            const destino = ruta ? archivoDe(ruta, html) : html;
            if (!ids[destino] || !ids[destino].has(ancla)) rotos.push(`${html}: ${href}`);
        });
    });

    assert.deepEqual(rotos, []);
});

test('[SITE-009] los JSON del sitio y los bloques JSON-LD de los HTML son válidos', () => {
    ['manifest.json', 'schema.json', 'structured-data.json', 'js/siglas.json', 'js/console_aliases.json', 'js/efemerides.json', 'package.json']
        .forEach(archivo => assert.doesNotThrow(() => JSON.parse(leer(archivo)), archivo));

    TODAS.forEach(html => {
        parsear(html).querySelectorAll('script[type="application/ld+json"]').forEach((bloque, i) => {
            assert.doesNotThrow(() => JSON.parse(bloque.textContent), `${html}: bloque JSON-LD ${i + 1}`);
        });
    });

    const alias = JSON.parse(leer('js/console_aliases.json'));
    Object.entries(alias).forEach(([clave, entrada]) => {
        assert.ok(typeof entrada.label === 'string' && entrada.label.trim(), `${clave}: label`);
        assert.ok(Array.isArray(entrada.aliases) && entrada.aliases.length > 0, `${clave}: aliases`);
    });
});

test('[SITE-010] el manifest de la PWA apunta a íconos que existen y abre el sitio en la raíz', () => {
    const manifest = JSON.parse(leer('manifest.json'));

    assert.equal(manifest.start_url, '/');
    assert.equal(manifest.scope, '/');
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.name && manifest.short_name);
    [...manifest.icons, ...(manifest.screenshots || [])].forEach(icono => assert.ok(existe(icono.src), icono.src));
    PAGINAS_COMPLETAS.forEach(html => {
        assert.match(parsear(html).querySelector('link[rel="manifest"]').getAttribute('href'), /^manifest\.json\?v=/, html);
    });
});

// ---------- Seguridad ----------

function csp(html) {
    const meta = parsear(html).querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!meta) return null;
    return Object.fromEntries(meta.getAttribute('content').split(';').map(d => d.trim()).filter(Boolean).map(directiva => {
        const [nombre, ...valores] = directiva.split(/\s+/);
        return [nombre, valores];
    }));
}

test('[SITE-011] las páginas del sitio declaran su Content-Security-Policy con las restricciones base', () => {
    PAGINAS_CON_CSP.forEach(html => {
        const politica = csp(html);
        assert.ok(politica, `${html} sin CSP`);
        assert.deepEqual(politica['default-src'], ["'self'"], html);
        assert.deepEqual(politica['object-src'], ["'none'"], html);
        assert.deepEqual(politica['base-uri'], ["'self'"], html);
        assert.deepEqual(politica['form-action'], ["'self'"], html);
        assert.ok(!politica['script-src'].includes("'unsafe-eval'"), `${html}: unsafe-eval`);
        assert.ok(!politica['script-src'].includes('*') && !politica['default-src'].includes('*'), `${html}: comodín`);
    });
    assert.equal(csp('ps3.html'), null, 'ps3.html solo redirige a un sitio externo y no lleva CSP');
});

test('[SITE-012] la CSP de cada página permite los servicios externos que esa página usa', () => {
    PAGINAS_CON_CSP.forEach(html => {
        const politica = csp(html);
        // seo-analytics.js inyecta Google Tag Manager en todas
        assert.ok(politica['script-src'].includes('https://www.googletagmanager.com'), `${html}: GTM en script-src`);
        assert.ok(politica['connect-src'].includes('https://www.google-analytics.com'), `${html}: GA en connect-src`);

        // Scripts, estilos e iframes externos declarados en el propio HTML
        const documento = parsear(html);
        const permitido = (directiva, url) => (politica[directiva] || politica['default-src']).some(origen => origen === new URL(url).origin || origen === 'https:');
        documento.querySelectorAll('script[src^="http"]').forEach(e => assert.ok(permitido('script-src', e.src), `${html}: script ${e.src}`));
        documento.querySelectorAll('link[rel="stylesheet"][href^="http"]').forEach(e => assert.ok(permitido('style-src', e.href), `${html}: estilo ${e.href}`));
        documento.querySelectorAll('body iframe[src^="http"]').forEach(e => assert.ok(permitido('frame-src', e.src), `${html}: iframe ${e.src}`));
    });

    // El catálogo se descarga con fetch desde Google Sheets
    assert.ok(csp('productos.html')['connect-src'].includes('https://docs.google.com'));
    assert.match(leer('js/modules/products.js'), /https:\/\/docs\.google\.com\/spreadsheets\/d\//);
});

function enlacesSinNoopener(htmls) {
    const inseguros = [];

    htmls.forEach(html => {
        parsear(html).querySelectorAll('a[target="_blank"]').forEach(enlace => {
            const href = enlace.getAttribute('href') || '';
            if (/^https?:/.test(href) && !(enlace.getAttribute('rel') || '').includes('noopener')) inseguros.push(`${html}: ${href}`);
        });
    });
    return inseguros;
}

test('[SITE-013] los enlaces que abren otra pestaña llevan rel="noopener"', () => {
    assert.deepEqual(enlacesSinNoopener([...PAGINAS_COMPLETAS, ...PAGINAS_MINIMAS, 'ps3.html']), []);
});

// ---------- Indexación y despliegue ----------

test('[SITE-014] sitemap.xml lista solo las páginas indexables, por su URL canónica, y robots.txt lo anuncia', () => {
    const urls = [...leer('sitemap.xml').matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const canonicas = PAGINAS_COMPLETAS.map(html => parsear(html).querySelector('link[rel="canonical"]').getAttribute('href'));

    assert.deepEqual(urls.sort(), canonicas.sort());
    assert.match(leer('robots.txt'), /^Sitemap: https:\/\/ropavejeroretro\.cl\/sitemap\.xml$/m);
    assert.doesNotMatch(leer('robots.txt'), /^Disallow: \/\s*$/m, 'robots.txt no debe bloquear todo el sitio');
});

test('[SITE-015] el despliegue a GitHub Pages conserva lo que el bot de Instagram necesita', () => {
    const deploy = leer('.github/workflows/deploy-pages.yml');
    const bot = leer('.github/workflows/update_instagram.yml');

    assert.match(deploy, /workflow_dispatch:/, 'el bot lanza el despliegue con workflow_dispatch');
    assert.match(deploy, /branches:\s*\n\s*- main/);
    assert.match(bot, /gh workflow run deploy-pages\.yml --ref main/);
    assert.match(bot, /actions: write/);
    assert.match(bot, /python api\/update_instagram\.py/);
    assert.ok(existe('.nojekyll'));
    assert.equal(leer('CNAME').trim(), 'ropavejeroretro.cl');
});

test('[SITE-020] en un push el despliegue espera a la suite; el del bot de Instagram publica sin ella', () => {
    const deploy = leer('.github/workflows/deploy-pages.yml');
    const tests = leer('.github/workflows/tests.yml');
    // Bloque de un job: desde "  nombre:" hasta el siguiente job o el final
    const job = (yaml, nombre) => {
        const inicio = yaml.search(new RegExp(`^  ${nombre}:\\s*$`, 'm'));
        assert.notEqual(inicio, -1, `falta el job ${nombre}`);
        const resto = yaml.slice(inicio + 1);
        const fin = resto.search(/^  [A-Za-z_][\w-]*:\s*$/m);
        return fin === -1 ? resto : resto.slice(0, fin);
    };

    // La suite se define una sola vez y es reutilizable
    assert.match(tests, /^\s+workflow_call:/m, 'tests.yml debe poder llamarse desde otro workflow');
    assert.match(tests, /^\s+pull_request:/m);
    assert.doesNotMatch(tests.split(/^jobs:/m)[0], /^\s+push:/m, 'en los push la suite la corre el despliegue, no dos veces');
    assert.match(tests, /npm run test:js/);
    assert.match(tests, /npm run test:py/);

    // El despliegue corre la suite solo en los push...
    const jobTests = job(deploy, 'tests');
    assert.match(jobTests, /uses: \.\/\.github\/workflows\/tests\.yml/);
    assert.match(jobTests, /if: github\.event_name == 'push'/);

    // ...y publica si pasó, o si no correspondía correrla (workflow_dispatch del bot o manual)
    const jobDeploy = job(deploy, 'deploy');
    assert.match(jobDeploy, /needs: tests/);
    assert.match(jobDeploy, /needs\.tests\.result == 'success'/);
    assert.match(jobDeploy, /needs\.tests\.result == 'skipped'/);
    assert.doesNotMatch(jobDeploy, /always\(\)\s*$/m, 'no debe publicar cuando la suite falla');
    assert.match(jobDeploy, /actions\/deploy-pages@/);
});

test('[SITE-016] las páginas declaran idioma, título, descripción y viewport', () => {
    [...PAGINAS_COMPLETAS, ...PAGINAS_MINIMAS].forEach(html => {
        const documento = parsear(html);
        assert.equal(documento.documentElement.lang, 'es', html);
        assert.ok(documento.title.trim(), `${html}: title`);
        assert.ok(documento.querySelector('meta[name="description"]').content.trim(), `${html}: description`);
        assert.ok(documento.querySelector('meta[name="viewport"]'), `${html}: viewport`);
    });
});

test('[SITE-018] cada página tiene un único encabezado h1', () => {
    const conteo = Object.fromEntries([...PAGINAS_COMPLETAS, ...PAGINAS_MINIMAS].map(html => [html, parsear(html).querySelectorAll('h1').length]));

    assert.deepEqual(conteo, Object.fromEntries(Object.keys(conteo).map(html => [html, 1])));
});

test('[SITE-017] las imágenes de contenido tienen texto alternativo', () => {
    const sinAlt = [];

    TODAS.forEach(html => {
        parsear(html).querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('alt')) sinAlt.push(`${html}: ${img.getAttribute('src')}`);
        });
    });

    assert.deepEqual(sinAlt, []);
});

// ---------- Páginas legacy ----------

test('[LEG-001] old.html conserva sus estilos y su script propios, versionados, y no depende de los módulos', () => {
    const documento = parsear('old.html');
    const estilos = Array.from(documento.querySelectorAll('link[rel="stylesheet"]'), e => e.getAttribute('href')).filter(href => !href.startsWith('http'));
    const scripts = scriptsDeclarados('old.html');

    assert.deepEqual(estilos.map(sinQuery), ['css/app.css', 'css/transition.min.css', 'css/transition.hackpack.min.css']);
    estilos.forEach(href => assert.match(href, VERSION, href));
    assert.deepEqual(scripts.map(s => s.ruta), ['js/seo-analytics.js', 'js/app.min.js']);
    scripts.forEach(s => assert.match(s.src, VERSION, s.ruta));
});

test('[LEG-002] old.html se abre sin errores de JavaScript', async () => {
    pagina = await abrirPagina({ html: 'old.html', scripts: 'declarados', iniciar: true });
    pagina.window.dispatchEvent(new pagina.window.Event('load'));
    await pagina.asentar();

    assert.deepEqual(pagina.errores.map(e => e.message), []);
    assert.ok(pagina.document.querySelector('a[href^="https://www.instagram.com/ropavejero.retro"]'), 'enlaza al Instagram de la tienda');
});

test('[LEG-004] los enlaces externos de old.html llevan rel="noopener"', () => {
    assert.deepEqual(enlacesSinNoopener(['old.html']), []);
});

test('[LEG-003] ps3.html redirige de inmediato a la guía externa y ofrece un enlace manual', () => {
    const documento = parsear('ps3.html');
    const destino = 'https://videogamesscz.github.io/videohost/';

    assert.equal(documento.querySelector('meta[http-equiv="refresh"]').getAttribute('content'), `0; url=${destino}`);
    assert.ok(scriptsInline('ps3.html').some(codigo => codigo.includes(`window.location.replace('${destino}')`)));
    assert.ok(documento.querySelector(`a[href="${destino}"]`));
    assert.equal(scriptsDeclarados('ps3.html').length, 0, 'no depende de ningún script del sitio');
});
