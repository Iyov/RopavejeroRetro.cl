'use strict';

// Specs: specs/base/08-instagram.md, 09-efemerides.md
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { abrirPagina, leer, existe, parsear, scriptsInline, respuesta } = require('./helpers/pagina');
const { POSTS } = require('./helpers/datos');

let pagina;
afterEach(async () => { if (pagina) await pagina.cerrar(); pagina = null; });

const $ = selector => pagina.document.querySelector(selector);
const $$ = selector => Array.from(pagina.document.querySelectorAll(selector));
const limpio = texto => texto.replace(/\s+/g, ' ').trim();

// index.html real con sus scripts y los posts de prueba disponibles como si ya hubiera cargado instagram_posts.min.js
async function abrirInicio({ posts = POSTS, ...opciones } = {}) {
    pagina = await abrirPagina({ html: 'index.html', scripts: 'declarados', iniciar: true, ahora: [2026, 10, 12], ...opciones });
    if (posts) {
        pagina.evaluar(`const INSTAGRAM_POSTS_DATA = ${JSON.stringify(posts)}; function getInstagramPostsData() { return INSTAGRAM_POSTS_DATA; }`);
    }
    return pagina;
}

const titulos = () => $$('#instagramGrid .instagram-card h3').map(h => h.textContent);
const botonConsola = clave => $$('#instagramFilters .ig-filter-btn').find(b => b.dataset.console === clave);

// ---------- Posts de Instagram ----------

test('[IGF-001] las consolas del filtro se cargan desde js/console_aliases.json con la versión de caché', async () => {
    await abrirInicio();
    await pagina.window.loadConsoleAliases();

    const peticion = pagina.peticiones.find(p => p.original.startsWith('js/console_aliases.json'));
    assert.match(peticion.original, /^js\/console_aliases\.json\?v=\d{4}-\d{2}-\d{2}_\d+$/);
    assert.deepEqual(pagina.valor('CONSOLE_ALIASES'), JSON.parse(leer('js/console_aliases.json')));
});

test('[IGF-002] si console_aliases.json no carga se usa una lista de consolas de respaldo', async () => {
    await abrirInicio({ rutas: url => (url.includes('console_aliases.json') ? respuesta('x', { status: 404 }) : undefined) });
    await pagina.window.loadInstagramPosts();

    const alias = pagina.valor('CONSOLE_ALIASES');
    assert.deepEqual(alias.PS1, { label: 'PS1', aliases: ['[PS1]'] });
    assert.equal(alias.GCN.label, 'GameCube');
    assert.ok(Object.keys(alias).length >= 19);
    assert.ok(pagina.mensajes('warn').some(linea => linea.includes('console_aliases.json')));
    assert.equal(titulos().length, POSTS.length, 'los posts se muestran igual');
    assert.ok(botonConsola('SNES'));
});

test('[IGF-003] se crea un botón de filtro por consola, además de "Todas", sin duplicarlos', async () => {
    await abrirInicio();
    await pagina.window.loadInstagramPosts();
    const alias = JSON.parse(leer('js/console_aliases.json'));
    const botones = () => $$('#instagramFilters .ig-filter-btn');

    assert.equal(botones().length, Object.keys(alias).length + 1);
    assert.equal(botones()[0].dataset.console, 'all');
    assert.ok(botones()[0].classList.contains('active'));
    assert.deepEqual(botones().slice(1).map(b => b.dataset.console), Object.keys(alias));
    assert.deepEqual(botones().slice(1).map(b => b.textContent), Object.values(alias).map(entrada => entrada.label));

    pagina.window.buildFilterButtons();
    assert.equal(botones().length, Object.keys(alias).length + 1);
});

test('[IGF-004] la consola de un post se detecta por sus alias en el título o la descripción', async () => {
    await abrirInicio();
    await pagina.window.loadConsoleAliases();
    const consola = (title, description = '') => pagina.window.detectConsole({ title, description });

    assert.equal(consola('[PS1] Juegos nuevos'), 'PS1');
    assert.equal(consola('Novedades', 'cartuchos [snes] originales'), 'SNES', 'no distingue mayúsculas');
    assert.equal(consola('Sony PlayStation 2 con juegos'), 'PS2');
    assert.equal(consola('Feria retro este sábado', 'Nos vemos'), null);

    // Formato antiguo: la consola definida como lista simple de alias
    pagina.evaluar(`CONSOLE_ALIASES = { 'Atari': ['[Atari]', 'Atari 2600'] };`);
    assert.equal(consola('Llegó un atari 2600'), 'Atari');
});

test('[IGF-005] cada post se muestra como tarjeta con imagen responsive, fecha, likes y enlace a Instagram', async () => {
    await abrirInicio();
    await pagina.window.loadInstagramPosts();
    const tarjetas = $$('#instagramGrid .instagram-card');

    assert.equal(tarjetas.length, 3);
    assert.deepEqual(titulos(), POSTS.map(post => post.title));

    const primera = tarjetas[0];
    assert.equal(primera.querySelector('.instagram-content p').textContent, 'Llegaron juegos de PlayStation');
    assert.equal(primera.querySelector('.post-date').textContent, 'Hoy');
    assert.equal(tarjetas[1].querySelector('.post-date').textContent, 'Hace 1 semana');
    assert.match(limpio(primera.querySelector('.post-likes').textContent), /^1[.,]?234$/);
    assert.equal(limpio(tarjetas[1].querySelector('.post-likes').textContent), '0', 'los likes en cero también se muestran');

    const fuente = primera.querySelector('picture source');
    assert.equal(fuente.getAttribute('type'), 'image/webp');
    assert.equal(fuente.getAttribute('srcset'), 'img/IG_1-400.webp 400w, img/IG_1-800.webp 800w, img/IG_1-1200.webp 1200w');
    const imagen = primera.querySelector('picture img');
    assert.equal(imagen.getAttribute('src'), 'img/IG_1.jpeg');
    assert.equal(imagen.getAttribute('alt'), '[PS1] Juegos nuevos');
    assert.equal(imagen.getAttribute('loading'), 'lazy');
    assert.match(imagen.getAttribute('onerror'), /RopavejeroLogo_256\.png/);

    const enlace = primera.querySelector('.instagram-actions a');
    assert.equal(enlace.getAttribute('href'), 'https://www.instagram.com/p/AAA/');
    assert.equal(enlace.getAttribute('target'), '_blank');
    assert.equal(enlace.getAttribute('rel'), 'noopener noreferrer');
});

test('[IGF-006] las imágenes y enlaces de los posts se sanitizan, y el texto no se interpreta como HTML', async () => {
    await abrirInicio({ posts: [
        { id: 'a', title: '<img src=x onerror=alert(1)>', description: '<script>alert(2)</script>', image: 'https://evil.example/x.jpg', link: 'javascript:alert(3)', media_type: 'IMAGE' },
        { id: 'b', title: 'Rutas relativas', description: '', image: '../img/IG_9.jpeg?cache=1', link: 'https://evil.example/', media_type: 'VIDEO', date: '2026-10-12', likes: null },
        { id: 'c', description: '', media_type: 'IMAGE' }
    ] });
    await pagina.window.loadInstagramPosts();
    const tarjetas = $$('#instagramGrid .instagram-card');

    assert.equal($$('#instagramGrid script').length, 0);
    assert.equal($$('#instagramGrid img[src="x"]').length, 0);
    assert.equal(tarjetas[0].querySelector('h3').textContent, '<img src=x onerror=alert(1)>');
    assert.equal(tarjetas[0].querySelector('img').getAttribute('src'), '#', 'una imagen de un dominio no permitido se descarta');
    assert.equal(tarjetas[0].querySelector('.instagram-actions a').getAttribute('href'), '#');
    assert.equal(tarjetas[0].querySelector('.post-date'), null);
    assert.equal(tarjetas[0].querySelector('.post-likes'), null);

    assert.equal(tarjetas[1].querySelector('img').getAttribute('src'), 'img/IG_9.jpeg?cache=1');
    assert.equal(tarjetas[1].querySelector('source').getAttribute('srcset'), 'img/IG_9-400.webp 400w, img/IG_9-800.webp 800w, img/IG_9-1200.webp 1200w');
    assert.equal(tarjetas[1].querySelector('.instagram-actions a').getAttribute('href'), '#');
    assert.ok(tarjetas[1].querySelector('.video-indicator'));
    assert.equal(tarjetas[1].querySelector('.post-likes'), null);

    assert.equal(tarjetas[2].querySelector('h3').textContent, 'Post de Instagram');
    assert.equal(tarjetas[2].querySelector('img').getAttribute('src'), 'img/RopavejeroLogo_256.png', 'sin imagen se usa el logo');
});

test('[IGF-007] los botones de consola filtran los posts y marcan el botón activo', async () => {
    await abrirInicio();
    await pagina.window.loadInstagramPosts();
    const activos = () => $$('#instagramFilters .ig-filter-btn.active').map(b => b.dataset.console);

    pagina.click(botonConsola('SNES'));
    assert.deepEqual(titulos(), ['Super Nintendo en stock']);
    assert.deepEqual(activos(), ['SNES']);

    pagina.click(botonConsola('PS1'));
    assert.deepEqual(titulos(), ['[PS1] Juegos nuevos']);
    assert.deepEqual(activos(), ['PS1']);

    pagina.click(botonConsola('N64'));
    assert.deepEqual(titulos(), []);
    assert.equal(limpio($('#instagramGrid .instagram-no-results').textContent), 'No hay posts para esta consola.');

    pagina.click(botonConsola('all'));
    assert.equal(titulos().length, 3);
    assert.deepEqual(activos(), ['all']);

    pagina.window.localStorage.setItem('language', 'en');
    pagina.click(botonConsola('N64'));
    assert.equal(limpio($('#instagramGrid .instagram-no-results').textContent), 'No posts for this console.');
});

test('[IGF-008] si no hay posts se muestra un aviso con enlace al perfil de Instagram', async () => {
    await abrirInicio({ posts: [] });
    await pagina.window.loadInstagramPosts();

    assert.equal(limpio($('#instagramGrid .instagram-error p').textContent), 'No se pudieron cargar los posts de Instagram.');
    const enlace = $('#instagramGrid .instagram-error a');
    assert.equal(enlace.getAttribute('href'), 'https://www.instagram.com/ropavejero.retro/');
    assert.equal(limpio(enlace.textContent), 'Visita nuestro Instagram');

    pagina.window.localStorage.setItem('language', 'en');
    pagina.window.showInstagramError();
    assert.equal(limpio($('#instagramGrid .instagram-error p').textContent), 'Could not load Instagram posts.');
    assert.equal(limpio($('#instagramGrid .instagram-error a').textContent), 'Visit our Instagram');
});

test('[IGF-009] si el archivo de posts no llegó a cargar se muestra un post de respaldo', async () => {
    await abrirInicio({ posts: null });
    await pagina.window.loadInstagramPosts();

    assert.deepEqual(titulos(), ['Post de Instagram']);
    assert.equal($('#instagramGrid .instagram-actions a').getAttribute('href'), 'https://www.instagram.com/ropavejero.retro/');
    assert.ok(pagina.mensajes('warn').some(linea => linea.includes('instagram_posts.js no cargado')));
});

test('[IGF-010] la fecha de un post se muestra en forma relativa y en el idioma activo', async () => {
    await abrirInicio();
    const { window: w } = pagina;
    const fechas = entradas => entradas.map(w.formatInstagramDate);

    assert.deepEqual(fechas(['2026-10-12', '2026-10-11', '2026-10-09', '2026-10-06', '2026-10-05', '2026-09-22', '2026-09-13']),
        ['Hoy', 'Hace 1 día', 'Hace 3 días', 'Hace 6 días', 'Hace 1 semana', 'Hace 2 semanas', 'Hace 4 semanas']);
    assert.deepEqual(fechas(['2026-10-13', '2026-10-15']), ['Mañana', 'En 3 días']);
    assert.match(w.formatInstagramDate('2026-09-12'), /12.*sep.*2026/i, '30 días o más: fecha completa');
    assert.match(w.formatInstagramDate('2022-12-06'), /6.*dic.*2022/i);
    assert.match(w.formatInstagramDate('2026-10-30'), /30.*oct.*2026/i, 'futuro a más de una semana: fecha completa');

    w.localStorage.setItem('language', 'en');
    assert.deepEqual(fechas(['2026-10-12', '2026-10-11', '2026-10-09', '2026-10-05', '2026-09-22', '2026-10-13', '2026-10-15']),
        ['Today', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago', 'Tomorrow', 'In 3 days']);
    assert.match(w.formatInstagramDate('2022-12-06'), /Dec 6, 2022/);
});

test('[IGF-011] index.html carga los posts de forma diferida, una sola vez, y luego los dibuja', async () => {
    const cargador = scriptsInline('index.html').find(codigo => codigo.includes('instagram_posts.min.js'));
    assert.ok(cargador, 'index.html tiene el cargador inline de instagram_posts.min.js');

    const observadores = [];
    pagina = await abrirPagina({
        html: 'index.html',
        scripts: 'declarados',
        iniciar: true,
        antes: (w) => {
            w.IntersectionObserver = class {
                constructor(callback, opciones) { this.callback = callback; this.opciones = opciones; observadores.push(this); }
                observe(elemento) { this.elemento = elemento; }
                disconnect() { this.desconectado = true; }
            };
        }
    });
    pagina.evaluar(cargador, 'index.html (cargador de Instagram)');
    const inyectados = () => $$('script[src*="instagram_posts"]');
    const observador = observadores.find(o => o.elemento && o.elemento.id === 'instagram');

    assert.ok(observador, 'observa la sección #instagram');
    assert.equal(inyectados().length, 0, 'no descarga los posts hasta que la sección se acerca a la pantalla');

    observador.callback([{ isIntersecting: true }], observador);
    observador.callback([{ isIntersecting: true }], observador);
    assert.equal(inyectados().length, 1);
    assert.match(inyectados()[0].getAttribute('src'), /^js\/instagram_posts\.min\.js\?v=\d{4}-\d{2}-\d{2}_\d+$/);
    assert.ok(observador.desconectado);

    // Al terminar la descarga, el cargador dibuja los posts
    pagina.evaluar(`const INSTAGRAM_POSTS_DATA = ${JSON.stringify(POSTS)}; function getInstagramPostsData() { return INSTAGRAM_POSTS_DATA; }`);
    inyectados()[0].onload();
    await pagina.hasta(() => titulos().length === 3, 'los posts dibujados');
});

test('[IGF-012] los datos publicados de Instagram tienen la forma que espera el sitio y sus imágenes existen', () => {
    const cargar = (archivo) => {
        const contexto = vm.createContext({});
        vm.runInContext(`${leer(archivo)}\n;globalThis.__posts = getInstagramPostsData();`, contexto);
        return JSON.parse(JSON.stringify(contexto.__posts));
    };
    const posts = cargar('js/instagram_posts.js');

    assert.deepEqual(cargar('js/instagram_posts.min.js'), posts, 'la versión .min contiene los mismos posts');
    assert.ok(posts.length > 0);
    assert.equal(new Set(posts.map(post => post.id)).size, posts.length, 'ids únicos');

    const problemas = [];
    posts.forEach(post => {
        if (!/^ig_auto_\d+$/.test(post.id)) problemas.push(`${post.id}: id`);
        if (typeof post.title !== 'string' || !post.title.trim()) problemas.push(`${post.id}: título`);
        if (typeof post.description !== 'string') problemas.push(`${post.id}: descripción`);
        if (!/^https:\/\/www\.instagram\.com\//.test(post.link)) problemas.push(`${post.id}: link`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) problemas.push(`${post.id}: fecha`);
        if (!['IMAGE', 'CAROUSEL_ALBUM'].includes(post.media_type)) problemas.push(`${post.id}: tipo ${post.media_type}`);
        if (!Number.isInteger(post.likes)) problemas.push(`${post.id}: likes`);
        const base = post.image.replace(/\.jpeg$/, '');
        [post.image, `${base}-400.webp`, `${base}-800.webp`, `${base}-1200.webp`].forEach(ruta => {
            if (!existe(ruta)) problemas.push(`${post.id}: falta ${ruta}`);
        });
    });
    assert.deepEqual(problemas, []);
});

test('[IGF-013] getInstagramLink devuelve el enlace sanitizado, o el perfil si no hay enlace', async () => {
    await abrirInicio();
    const { window: w } = pagina;

    assert.equal(w.getInstagramLink('https://www.instagram.com/p/AAA/'), 'https://www.instagram.com/p/AAA/');
    assert.equal(w.getInstagramLink(''), 'https://www.instagram.com/ropavejero.retro/');
    assert.equal(w.getInstagramLink(undefined), 'https://www.instagram.com/ropavejero.retro/');
    assert.equal(w.getInstagramLink('https://evil.example/'), '#');
});

// ---------- Efemérides ----------

const EFEMERIDES_PRUEBA = {
    efemerides: [
        { date: '10/12', ES: { title: 'Título ES', text: 'Texto <b>ES</b>', det: 'Detalle ES' }, EN: { title: 'Title EN', text: 'Text EN', det: 'Detail EN' } }
    ]
};
const conEfemerides = datos => url => (url.includes('efemerides.json') ? (datos instanceof Error ? datos : respuesta(datos)) : undefined);
const parrafos = () => $$('#efemeridesCard p').map(p => p.textContent);

test('[EFE-001] se muestra la fecha de hoy escrita en el idioma activo', async () => {
    await abrirInicio({ rutas: conEfemerides(EFEMERIDES_PRUEBA) });
    assert.match($('#currentDate').textContent, /lunes.*12 de octubre de 2026/i);
    await pagina.cerrar();

    await abrirInicio({ rutas: conEfemerides(EFEMERIDES_PRUEBA), almacenamiento: { language: 'en' } });
    assert.match($('#currentDate').textContent, /Monday, October 12, 2026/);
});

test('[EFE-002] se muestra la efeméride que corresponde al día de hoy, en el idioma activo y como texto plano', async () => {
    await abrirInicio({ rutas: conEfemerides(EFEMERIDES_PRUEBA) });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'la efeméride');

    assert.match(pagina.peticiones.find(p => p.original.startsWith('js/efemerides.json')).original, /\?v=\d{4}-\d{2}-\d{2}_\d+$/);
    assert.equal($('#efemeridesCard .efemerides-badge').textContent, 'Efeméride del día');
    assert.equal($('#efemeridesCard h3').textContent, 'Título ES');
    assert.equal($('#efemeridesCard b'), null, 'el contenido no se interpreta como HTML');
    assert.equal(parrafos()[1], 'Detalle ES');
    await pagina.cerrar();

    await abrirInicio({ rutas: conEfemerides(EFEMERIDES_PRUEBA), almacenamiento: { language: 'en' } });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'la efeméride');
    assert.equal($('#efemeridesCard .efemerides-badge').textContent, "Today's Anniversary");
    assert.equal($('#efemeridesCard h3').textContent, 'Title EN');
    assert.deepEqual(parrafos(), ['Text EN', 'Detail EN']);
});

test('[EFE-003] si no hay efeméride para hoy se muestra un mensaje por defecto', async () => {
    await abrirInicio({ rutas: conEfemerides({ efemerides: [{ date: '01/01', ES: { title: 'Otro día' }, EN: { title: 'Another day' } }] }) });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'el mensaje');
    assert.equal($('#efemeridesCard h3').textContent, 'Hoy no hay efemérides registradas.');
    assert.deepEqual(parrafos(), ['¡Disfruta de tus juegos retro!']);
    await pagina.cerrar();

    await abrirInicio({ rutas: conEfemerides({ efemerides: [] }), almacenamiento: { language: 'en' } });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'el mensaje');
    assert.equal($('#efemeridesCard h3').textContent, 'No anniversaries recorded for today.');
    assert.deepEqual(parrafos(), ['Enjoy your retro games!']);
});

test('[EFE-004] si las efemérides no cargan o vienen mal formadas se muestra un error genérico', async () => {
    const casos = [
        ['HTTP 500', respuesta('error', { status: 500, tipo: 'text/plain' })],
        ['sin red', new TypeError('Failed to fetch')],
        ['estructura inválida', { otraCosa: [] }],
        ['no es JSON', '<html>404</html>']
    ];
    for (const [nombre, datos] of casos) {
        await abrirInicio({ rutas: url => (url.includes('efemerides.json') ? datos : undefined) });
        await pagina.hasta(() => $('#efemeridesCard h3'), `el mensaje de error (${nombre})`);

        assert.equal($('#efemeridesCard h3').textContent, 'No se pudieron cargar las efemérides del día.', nombre);
        assert.equal($('#efemeridesCard .efemerides-badge').textContent, 'Efeméride del día', nombre);
        await pagina.cerrar();
    }

    await abrirInicio({ rutas: conEfemerides(new TypeError('Failed to fetch')), almacenamiento: { language: 'en' } });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'el mensaje de error');
    assert.equal($('#efemeridesCard h3').textContent, "Could not load today's anniversaries.");
});

test('[EFE-005] en las páginas sin sección de efemérides no se descarga nada', async () => {
    pagina = await abrirPagina({ html: 'productos.html', url: 'https://ropavejeroretro.cl/productos', scripts: 'declarados', iniciar: true });

    assert.equal(pagina.peticiones.filter(p => p.original.includes('efemerides.json')).length, 0);
});

test('[EFE-006] js/efemerides.json cubre los 366 días del año con fechas válidas y sin repetir', () => {
    const { efemerides } = JSON.parse(leer('js/efemerides.json'));
    const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const esperadas = diasPorMes.flatMap((dias, mes) => Array.from({ length: dias }, (_, dia) =>
        `${String(mes + 1).padStart(2, '0')}/${String(dia + 1).padStart(2, '0')}`));
    const fechas = efemerides.map(e => e.date);

    assert.equal(new Set(fechas).size, fechas.length, 'fechas repetidas');
    assert.deepEqual([...fechas].sort(), esperadas);
});

test('[EFE-007] cada efeméride tiene título, texto y detalle en español y en inglés', () => {
    const { efemerides } = JSON.parse(leer('js/efemerides.json'));
    const incompletas = [];

    efemerides.forEach(e => {
        ['ES', 'EN'].forEach(idioma => {
            ['title', 'text', 'det'].forEach(campo => {
                const valor = e[idioma] && e[idioma][campo];
                if (typeof valor !== 'string' || !valor.trim()) incompletas.push(`${e.date} ${idioma}.${campo}`);
            });
        });
    });

    assert.deepEqual(incompletas, []);
});

test('[EFE-008] con el archivo real, la efeméride del día se muestra en español y en inglés', async () => {
    const { efemerides } = JSON.parse(leer('js/efemerides.json'));
    const anioNuevo = efemerides.find(e => e.date === '01/01');

    await abrirInicio({ ahora: [2026, 1, 1] });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'la efeméride');
    assert.equal($('#efemeridesCard h3').textContent, anioNuevo.ES.title);
    assert.deepEqual(parrafos(), [anioNuevo.ES.text, anioNuevo.ES.det]);
    await pagina.cerrar();

    await abrirInicio({ ahora: [2026, 1, 1], almacenamiento: { language: 'en' } });
    await pagina.hasta(() => $('#efemeridesCard h3'), 'la efeméride');
    assert.equal($('#efemeridesCard h3').textContent, anioNuevo.EN.title);
});
