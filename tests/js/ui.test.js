'use strict';

// Specs: specs/base/05-interfaz.md, 06-idioma.md
// Se prueba sobre los HTML reales, con todos los scripts que cada página declara.
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { abrirPagina, parsear } = require('./helpers/pagina');

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

async function abrirSitio(html, opciones = {}) {
    pagina = await abrirPagina({ html, scripts: 'declarados', iniciar: true, ...opciones });
    return pagina;
}

const traducciones = () => JSON.parse(pagina.evaluar('JSON.stringify(translations)'));
const texto = selector => pagina.document.querySelector(selector).textContent.trim();

// ---------- Tema ----------

test('[THM-001] el sitio abre en modo oscuro y aplica el tema claro si quedó guardado', async () => {
    await abrirSitio('index.html');
    let icono = pagina.document.querySelector('#themeBtn i');
    assert.ok(!pagina.document.documentElement.classList.contains('light-mode'));
    assert.ok(icono.classList.contains('fa-moon'));
    await pagina.cerrar();

    await abrirSitio('index.html', { almacenamiento: { theme: 'light' } });
    icono = pagina.document.querySelector('#themeBtn i');
    assert.ok(pagina.document.documentElement.classList.contains('light-mode'));
    assert.ok(icono.classList.contains('fa-sun'));
    assert.ok(!icono.classList.contains('fa-moon'));
});

test('[THM-002] el botón de tema alterna claro/oscuro y recuerda la elección', async () => {
    for (const html of ['index.html', 'productos.html']) {
        await abrirSitio(html);
        const { document, window: w } = pagina;
        const boton = document.getElementById('themeBtn');
        const icono = boton.querySelector('i');

        pagina.click(boton);
        assert.ok(document.documentElement.classList.contains('light-mode'), html);
        assert.ok(icono.classList.contains('fa-sun'), html);
        assert.equal(w.localStorage.getItem('theme'), 'light', html);

        pagina.click(boton);
        assert.ok(!document.documentElement.classList.contains('light-mode'), html);
        assert.ok(icono.classList.contains('fa-moon'), html);
        assert.equal(w.localStorage.getItem('theme'), 'dark', html);
        await pagina.cerrar();
    }
    pagina = null;
});

// ---------- Idioma ----------

test('[I18N-001] setLanguage traduce textos, placeholders y opciones de select según data-translate', async () => {
    pagina = await abrirPagina({
        contenido: `<!DOCTYPE html><html lang="es"><body>
            <h1 id="titulo" data-translate="hero-title">inicial</h1>
            <p id="sin-clave" data-translate="clave-que-no-existe">se conserva</p>
            <input id="entrada" data-translate="filter-platform-search">
            <input id="entrada2" data-translate-placeholder="filter-platform-search">
            <select id="orden" data-translate="filter-sort">
                <option value="a" data-translate="sort-price-asc">x</option>
                <option value="b">sin traducir</option>
            </select>
        </body></html>`,
        scripts: ['js/modules/utils.js', 'js/modules/ui.js', 'js/modules/efemerides.js']
    });
    const { document, window: w } = pagina;

    w.setLanguage('en');
    assert.equal(document.getElementById('titulo').innerHTML, 'Retro games and consoles in Chile<br>Everything Retro in one place');
    assert.equal(document.getElementById('sin-clave').textContent, 'se conserva');
    assert.equal(document.getElementById('entrada').placeholder, 'Search platform...');
    assert.equal(document.getElementById('entrada2').placeholder, 'Search platform...');
    assert.deepEqual(Array.from(document.querySelectorAll('#orden option'), o => o.textContent), ['Price: Low to high', 'sin traducir']);

    w.setLanguage('es');
    assert.equal(document.getElementById('titulo').innerHTML, 'Juegos y consolas retro en Chile<br>Todo lo Retro en un solo lugar');
    assert.equal(document.getElementById('entrada').placeholder, 'Buscar plataforma...');
    assert.deepEqual(Array.from(document.querySelectorAll('#orden option'), o => o.textContent), ['Precio: Ascendente', 'sin traducir']);
});

test('[I18N-002] la página se muestra en el idioma guardado, y en español si no hay ninguno', async () => {
    await abrirSitio('index.html');
    assert.equal(texto('.nav [data-translate="menu-about"]'), 'Nosotros');
    assert.equal(texto('[data-translate="faq-title"]'), 'Preguntas Frecuentes (FAQ)');
    await pagina.cerrar();

    await abrirSitio('index.html', { almacenamiento: { language: 'en' } });
    assert.equal(texto('.nav [data-translate="menu-about"]'), 'About Us');
    assert.equal(texto('[data-translate="faq-title"]'), 'Frequently Asked Questions (FAQ)');
    await pagina.cerrar();

    await abrirSitio('productos.html', { almacenamiento: { language: 'en' } });
    assert.equal(texto('[data-translate="products-title"]'), 'Available retro games and consoles');
    assert.deepEqual(
        Array.from(pagina.document.querySelectorAll('#sortFilter option'), o => o.textContent),
        ['ID number', 'Price: Low to high', 'Price: High to low', 'Name: A-Z', 'Name: Z-A', 'Platform']
    );
});

test('[I18N-003] el selector de idioma se abre, cambia el idioma, lo guarda y se cierra', async () => {
    for (const html of ['index.html', 'productos.html']) {
        await abrirSitio(html);
        const { document, window: w } = pagina;
        const overlay = document.getElementById('languageSelectorOverlay');
        const opcion = lang => document.querySelector(`.language-option[data-lang="${lang}"]`);

        assert.ok(!overlay.classList.contains('active'), html);
        pagina.click(document.getElementById('languageBtn'));
        assert.ok(overlay.classList.contains('active'), html);
        assert.ok(opcion('es').classList.contains('active'), html);

        pagina.click(opcion('en'));
        assert.equal(w.localStorage.getItem('language'), 'en', html);
        assert.equal(texto('.nav [data-translate="menu-contact"]'), 'Contact', html);
        assert.ok(!overlay.classList.contains('active'), html);
        assert.ok(opcion('en').classList.contains('active'), html);
        assert.ok(!opcion('es').classList.contains('active'), html);

        // Un clic fuera del cuadro (sobre el fondo) cierra el selector sin cambiar el idioma
        pagina.click(document.getElementById('languageBtn'));
        pagina.click(document.getElementById('languageSelector'));
        assert.ok(overlay.classList.contains('active'), `${html}: clic dentro no cierra`);
        pagina.click(overlay);
        assert.ok(!overlay.classList.contains('active'), html);
        assert.equal(w.localStorage.getItem('language'), 'en', html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[I18N-003] cambiar de idioma ida y vuelta no produce errores de JavaScript, tampoco en la página sin catálogo', async () => {
    // index.html carga ui.js pero no products.js: el redibujado del catálogo no existe ahí
    for (const html of ['index.html', 'productos.html']) {
        await abrirSitio(html);
        const { document, window: w } = pagina;
        const elegir = async lang => {
            pagina.click(document.getElementById('languageBtn'));
            pagina.click(document.querySelector(`.language-option[data-lang="${lang}"]`));
            await pagina.asentar();
        };

        await elegir('en');
        assert.equal(w.localStorage.getItem('language'), 'en', html);
        assert.equal(texto('.nav [data-translate="menu-contact"]'), 'Contact', html);
        await elegir('es');
        assert.equal(w.localStorage.getItem('language'), 'es', html);
        assert.equal(texto('.nav [data-translate="menu-contact"]'), 'Contacto', html);
        await elegir('en');
        assert.equal(texto('.nav [data-translate="menu-contact"]'), 'Contact', html);

        assert.deepEqual(pagina.errores.map(error => (error && error.message) || String(error)), [], `${html}: sin errores de JavaScript`);
        assert.ok(!document.getElementById('languageSelectorOverlay').classList.contains('active'), html);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[I18N-009] al reabrir el selector queda marcado el idioma vigente', async () => {
    for (const html of ['index.html', 'productos.html']) {
        // La página cargó en español y el visitante pasa a inglés
        await abrirSitio(html);
        const { document } = pagina;
        const opcion = lang => document.querySelector(`.language-option[data-lang="${lang}"]`);
        const marcadas = () => Array.from(document.querySelectorAll('.language-option.active'), o => o.dataset.lang);

        pagina.click(document.getElementById('languageBtn'));
        pagina.click(opcion('en'));
        assert.deepEqual(marcadas(), ['en'], `${html}: tras elegir inglés`);

        pagina.click(document.getElementById('languageBtn'));
        assert.ok(document.getElementById('languageSelectorOverlay').classList.contains('active'), html);
        assert.deepEqual(marcadas(), ['en'], `${html}: al reabrir el selector sigue marcado inglés`);
        await pagina.cerrar();

        // Lo mismo en el otro sentido: cargó en inglés y pasa a español
        await abrirSitio(html, { almacenamiento: { language: 'en' } });
        const doc = pagina.document;
        pagina.click(doc.getElementById('languageBtn'));
        pagina.click(doc.querySelector('.language-option[data-lang="es"]'));
        pagina.click(doc.getElementById('languageBtn'));
        assert.deepEqual(Array.from(doc.querySelectorAll('.language-option.active'), o => o.dataset.lang), ['es'], `${html}: al reabrir queda marcado español`);
        await pagina.cerrar();
    }
    pagina = null;
});

test('[I18N-004] al cambiar de idioma se vuelven a cargar las efemérides en el idioma nuevo', async () => {
    await abrirSitio('index.html', { ahora: [2026, 1, 1] });
    const { document } = pagina;
    const cargas = () => pagina.peticiones.filter(p => p.original.startsWith('js/efemerides.json')).length;
    const antes = cargas();
    assert.equal(document.querySelector('#efemeridesCard .efemerides-badge').textContent, 'Efeméride del día');

    pagina.click(document.getElementById('languageBtn'));
    pagina.click(document.querySelector('.language-option[data-lang="en"]'));
    await pagina.asentar();

    assert.ok(cargas() > antes);
    assert.equal(document.querySelector('#efemeridesCard .efemerides-badge').textContent, "Today's Anniversary");
});

test('[I18N-005] toda clave de traducción existe en español y en inglés', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'] });
    const { es, en } = traducciones();

    const soloEs = Object.keys(es).filter(clave => !(clave in en));
    const soloEn = Object.keys(en).filter(clave => !(clave in es));

    assert.deepEqual(soloEs, [], 'claves sin versión en inglés');
    assert.deepEqual(soloEn, [], 'claves sin versión en español');
});

test('[I18N-006] toda clave data-translate usada en los HTML existe en el diccionario en español', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'] });
    const { es } = traducciones();
    const faltantes = [];

    // Solo las páginas que cargan ui.js; en las demás data-translate no tiene efecto (ver SITE-004)
    for (const html of ['index.html', 'productos.html']) {
        const documento = parsear(html);
        documento.querySelectorAll('[data-translate], [data-translate-placeholder]').forEach(elemento => {
            const clave = elemento.getAttribute('data-translate') || elemento.getAttribute('data-translate-placeholder');
            if (!(clave in es)) faltantes.push(`${html}: ${clave}`);
        });
    }

    assert.deepEqual(faltantes, []);
});

test('[I18N-007] toda clave data-translate usada en los HTML tiene versión en inglés', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'] });
    const { en } = traducciones();
    const faltantes = new Set();

    for (const html of ['index.html', 'productos.html']) {
        parsear(html).querySelectorAll('[data-translate]').forEach(elemento => {
            const clave = elemento.getAttribute('data-translate');
            if (!(clave in en)) faltantes.add(`${html}: ${clave}`);
        });
    }

    assert.deepEqual([...faltantes], []);
});

test('[I18N-008] el texto inicial de cada HTML coincide con su traducción al español', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'] });
    const { es } = traducciones();
    const normalizar = html => html.replace(/\s+/g, ' ').trim();
    const distintos = [];

    for (const html of ['index.html', 'productos.html']) {
        const documento = parsear(html);
        const lienzo = documento.createElement('div');
        documento.querySelectorAll('[data-translate]').forEach(elemento => {
            const clave = elemento.getAttribute('data-translate');
            if (!(clave in es) || elemento.tagName === 'OPTION') return;
            lienzo.innerHTML = es[clave];
            if (normalizar(elemento.innerHTML) !== normalizar(lienzo.innerHTML)) distintos.push(`${html}: ${clave}`);
        });
    }

    assert.deepEqual([...new Set(distintos)], []);
});

// ---------- Navegación ----------

test('[NAV-001] la barra de progreso refleja el porcentaje de scroll de la página', async () => {
    await abrirSitio('index.html');
    const { document } = pagina;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 3000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    pagina.desplazar(500);
    assert.equal(document.getElementById('progress').style.width, '25%');
    pagina.desplazar(2000);
    assert.equal(document.getElementById('progress').style.width, '100%');
});

test('[NAV-002] en la página de productos el menú marca "Productos" como activo', async () => {
    for (const url of ['https://ropavejeroretro.cl/productos', 'https://ropavejeroretro.cl/productos.html']) {
        await abrirSitio('productos.html', { url });
        const activos = Array.from(pagina.document.querySelectorAll('.nav a.nav-active, .mobile-menu-content a.nav-active'));

        assert.equal(activos.length, 2, url);
        activos.forEach(enlace => assert.equal(enlace.getAttribute('href'), '/productos', url));
        await pagina.cerrar();
    }
    pagina = null;
});

test('[NAV-003] en el inicio el menú marca la sección visible al hacer scroll', async () => {
    await abrirSitio('index.html');
    const { document } = pagina;
    const secciones = Array.from(document.querySelectorAll('section[id]'));
    secciones.forEach((seccion, i) => {
        Object.defineProperty(seccion, 'offsetTop', { value: i * 1000, configurable: true });
    });
    const posicion = id => secciones.findIndex(seccion => seccion.id === id) * 1000;
    const activos = () => Array.from(document.querySelectorAll('a.nav-active'), a => a.getAttribute('href'));

    pagina.desplazar(posicion('about'));
    assert.deepEqual(activos(), ['#about', '#about'], 'menú de escritorio y menú móvil');

    // La sección cambia 100 px antes de llegar a su borde superior
    pagina.desplazar(posicion('faq') - 100);
    assert.deepEqual(activos(), ['#faq', '#faq']);
    pagina.desplazar(posicion('faq') - 101);
    assert.ok(!activos().includes('#faq'));
});

test('[NAV-004] el botón "volver arriba" aparece pasados los 300 px y sube al inicio; el logo también', async () => {
    await abrirSitio('index.html');
    const { document } = pagina;
    const boton = document.getElementById('backToTopBtn');

    pagina.desplazar(300);
    assert.ok(!boton.classList.contains('visible'));
    pagina.desplazar(301);
    assert.ok(boton.classList.contains('visible'));

    pagina.click(boton);
    pagina.click(document.getElementById('backToTopLogo'));
    assert.deepEqual(JSON.parse(JSON.stringify(pagina.scrolls)), [
        [{ top: 0, behavior: 'smooth' }],
        [{ top: 0, behavior: 'smooth' }]
    ]);

    pagina.desplazar(0);
    assert.ok(!boton.classList.contains('visible'));
});

test('[NAV-004] en productos.html el botón "volver arriba" funciona aunque no exista el logo clicable', async () => {
    await abrirSitio('productos.html');
    const boton = pagina.document.getElementById('backToTopBtn');

    pagina.desplazar(500);
    assert.ok(boton.classList.contains('visible'));
    pagina.click(boton);
    assert.equal(pagina.scrolls.length, 1);
});

test('[NAV-005] el menú móvil se abre y se cierra con el botón, un enlace o Escape, bloqueando el scroll del fondo', async () => {
    for (const html of ['index.html', 'productos.html']) {
        await abrirSitio(html);
        const { document } = pagina;
        const menu = document.getElementById('mobileMenu');
        const abrir = document.getElementById('mobileMenuBtn');
        const abierto = () => menu.classList.contains('active');
        const comprobarAbierto = () => {
            pagina.click(abrir);
            assert.ok(abierto(), html);
            assert.equal(document.body.style.overflow, 'hidden', html);
            assert.equal(abrir.getAttribute('aria-expanded'), 'true', html);
        };
        const comprobarCerrado = (como) => {
            assert.ok(!abierto(), `${html}: ${como}`);
            assert.equal(document.body.style.overflow, '', `${html}: ${como}`);
            assert.equal(abrir.getAttribute('aria-expanded'), 'false', `${html}: ${como}`);
        };

        comprobarCerrado('estado inicial');

        comprobarAbierto();
        pagina.click(document.getElementById('mobileMenuClose'));
        comprobarCerrado('botón cerrar');

        comprobarAbierto();
        pagina.click(menu.querySelector('a'));
        comprobarCerrado('clic en un enlace');

        comprobarAbierto();
        pagina.despachar(document, 'keydown', { key: 'Escape' });
        comprobarCerrado('tecla Escape');

        pagina.despachar(document, 'keydown', { key: 'Escape' });
        comprobarCerrado('Escape con el menú ya cerrado');
        await pagina.cerrar();
    }
    pagina = null;
});

test('[NAV-006] las funciones de interfaz no fallan en una página a la que le falta el elemento que manejan', async () => {
    const funciones = ['initTheme', 'initLanguage', 'initProgressBar', 'initNavActive', 'initBackToTop', 'initMobileMenu', 'initFAQ', 'initBlogDialogs', 'applySavedSettings'];

    // Página vacía, solo con ui.js (sin efemérides, catálogo ni utilidades)
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'], almacenamiento: { theme: 'light', language: 'en' } });
    funciones.forEach(nombre => assert.doesNotThrow(() => pagina.window[nombre](), nombre));
    assert.doesNotThrow(() => pagina.window.setLanguage('en'), 'setLanguage sin el módulo de efemérides');
    assert.deepEqual(pagina.errores.map(e => e.message), []);
    await pagina.cerrar();

    // Elementos a medias: botones sin su ícono o sin su pareja
    pagina = await abrirPagina({
        contenido: `<!DOCTYPE html><html lang="es"><body>
            <button id="themeBtn"></button>
            <button id="mobileMenuBtn"></button>
            <div id="progressBar"></div>
            <div class="faq-item"><p>sin pregunta</p></div>
            <div id="blogDialogOverlay"></div>
            <article class="blog-card" data-blog-id="99"><button class="read-more-btn">Leer</button></article>
            <button id="languageBtn"></button>
        </body></html>`,
        scripts: ['js/modules/ui.js']
    });
    funciones.forEach(nombre => assert.doesNotThrow(() => pagina.window[nombre](), `${nombre} con elementos a medias`));
    ['themeBtn', 'mobileMenuBtn', 'languageBtn'].forEach(id => pagina.click(pagina.document.getElementById(id)));
    pagina.click(pagina.document.querySelector('.read-more-btn'));
    pagina.despachar(pagina.document, 'keydown', { key: 'Escape' });
    pagina.desplazar(500);
    assert.deepEqual(pagina.errores.map(e => e.message), []);
});

// ---------- FAQ ----------

test('[FAQ-001] la FAQ funciona como acordeón: una sola respuesta abierta a la vez', async () => {
    await abrirSitio('index.html');
    const items = Array.from(pagina.document.querySelectorAll('.faq-item'));
    const abiertos = () => items.map((item, i) => (item.classList.contains('active') ? i : null)).filter(i => i !== null);

    assert.ok(items.length >= 6);
    assert.deepEqual(abiertos(), []);

    pagina.click(items[0].querySelector('.faq-question'));
    assert.deepEqual(abiertos(), [0]);

    pagina.click(items[2].querySelector('.faq-question h3'));
    assert.deepEqual(abiertos(), [2], 'abrir otra pregunta cierra la anterior');

    pagina.click(items[2].querySelector('.faq-question'));
    assert.deepEqual(abiertos(), [], 'un segundo clic la cierra');
});

test('[FAQ-002] cada pregunta de la FAQ tiene su respuesta, ambas traducibles', () => {
    const items = Array.from(parsear('index.html').querySelectorAll('.faq-item'));

    items.forEach((item, i) => {
        const pregunta = item.querySelector('.faq-question [data-translate]');
        const respuesta = item.querySelector('.faq-answer [data-translate]');
        assert.equal(pregunta.getAttribute('data-translate'), `faq-question-${i + 1}`);
        assert.equal(respuesta.getAttribute('data-translate'), `faq-answer-${i + 1}`);
    });
});

// ---------- Blog ----------

test('[BLG-001] "Leer más" abre el artículo completo en el idioma activo', async () => {
    await abrirSitio('index.html');
    const { document, window: w } = pagina;
    const overlay = document.getElementById('blogDialogOverlay');
    const botones = document.querySelectorAll('.read-more-btn');
    const contenido = document.getElementById('blogDialogContent');

    assert.equal(botones.length, 3);
    assert.ok(!overlay.classList.contains('active'));

    pagina.click(botones[0]);
    assert.ok(overlay.classList.contains('active'));
    assert.equal(document.body.style.overflow, 'hidden');
    assert.equal(contenido.querySelector('.blog-dialog-title').textContent, 'La historia de Nintendo: De las cartas a los videojuegos');
    assert.equal(contenido.querySelector('.blog-dialog-date').textContent, '02 de Enero, 2026');
    assert.ok(contenido.querySelectorAll('.blog-dialog-content p').length >= 4);
    assert.ok(contenido.querySelector('.blog-dialog-image img').getAttribute('src').startsWith('https://images.unsplash.com/'));

    pagina.click(document.getElementById('blogDialogClose'));
    w.localStorage.setItem('language', 'en');
    pagina.click(botones[2]);
    assert.equal(contenido.querySelector('.blog-dialog-title').textContent, 'Guide to Collecting Retro Video Games: Where to Start');
    assert.equal(contenido.querySelectorAll('.blog-dialog-content h4').length, 5);
});

test('[BLG-002] el artículo se cierra con el botón o con un clic fuera, y devuelve el scroll', async () => {
    await abrirSitio('index.html');
    const { document } = pagina;
    const overlay = document.getElementById('blogDialogOverlay');
    const abrir = () => pagina.click(document.querySelector('.read-more-btn'));

    abrir();
    pagina.click(document.getElementById('blogDialogContent'));
    assert.ok(overlay.classList.contains('active'), 'un clic dentro del artículo no lo cierra');

    pagina.click(document.getElementById('blogDialogClose'));
    assert.ok(!overlay.classList.contains('active'));
    assert.equal(document.body.style.overflow, '');

    abrir();
    pagina.click(overlay);
    assert.ok(!overlay.classList.contains('active'));
    assert.equal(document.body.style.overflow, '');
});

test('[BLG-003] cada tarjeta del blog tiene su artículo completo en español y en inglés', async () => {
    pagina = await abrirPagina({ scripts: ['js/modules/ui.js'] });
    const articulos = JSON.parse(pagina.evaluar('JSON.stringify(blogContent)'));
    const tarjetas = Array.from(parsear('index.html').querySelectorAll('.blog-card'));

    assert.equal(tarjetas.length, 3);
    tarjetas.forEach(tarjeta => {
        const id = tarjeta.getAttribute('data-blog-id');
        assert.ok(tarjeta.querySelector('.read-more-btn'), `tarjeta ${id} sin botón`);
        ['es', 'en'].forEach(idioma => {
            const articulo = articulos[id] && articulos[id][idioma];
            assert.ok(articulo, `artículo ${id} sin versión ${idioma}`);
            ['title', 'date', 'image', 'content'].forEach(campo => {
                assert.ok(articulo[campo] && articulo[campo].trim(), `artículo ${id}/${idioma} sin ${campo}`);
            });
        });
    });
});
