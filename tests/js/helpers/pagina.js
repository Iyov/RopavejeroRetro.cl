'use strict';

// Arnés de pruebas del front-end.
//
// El sitio no usa ES modules: cada archivo de js/modules/ declara funciones y
// constantes globales y el navegador los carga en orden con <script defer>.
// Este arnés reproduce eso: abre un HTML (real o mínimo) en jsdom y evalúa los
// scripts en el mismo contexto global, en el orden indicado, sin modificarlos.

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const ORIGEN = 'https://ropavejeroretro.cl';
const HTML_MINIMO = '<!DOCTYPE html><html lang="es"><head></head><body></body></html>';

// Orden de dependencia de los módulos (ver "Sistema de módulos frontend" en CLAUDE.md)
const MODULOS = [
    'js/modules/logger.js',
    'js/modules/cache.js',
    'js/modules/siglas.js',
    'js/modules/utils.js',
    'js/modules/ui.js',
    'js/modules/products.js',
    'js/modules/instagram.js',
    'js/modules/efemerides.js',
    'js/modules/analytics.js'
];

function leer(rel) {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// Existencia respetando mayúsculas y minúsculas, como GitHub Pages (Windows y macOS no las distinguen)
function existe(rel) {
    let actual = ROOT;
    for (const parte of rel.split('/').filter(Boolean)) {
        if (!fs.existsSync(actual) || !fs.statSync(actual).isDirectory() || !fs.readdirSync(actual).includes(parte)) return false;
        actual = path.join(actual, parte);
    }
    return true;
}

// Quita ?query y #hash de una referencia local
function sinQuery(ref) {
    return ref.split('#')[0].split('?')[0];
}

// Documento jsdom de solo lectura, para inspeccionar el HTML sin ejecutar nada
function parsear(rel) {
    return new JSDOM(leer(rel)).window.document;
}

// Scripts locales que declara un HTML: [{ src, ruta, defer, async }] en orden de aparición
function scriptsDeclarados(rel) {
    return Array.from(parsear(rel).querySelectorAll('script[src]'))
        .map(script => ({
            src: script.getAttribute('src'),
            ruta: sinQuery(script.getAttribute('src')).replace(/^\//, ''),
            defer: script.hasAttribute('defer'),
            async: script.hasAttribute('async')
        }))
        .filter(script => !/^(https?:)?\/\//.test(script.src));
}

// Contenido de los <script> inline (sin src y sin type de datos) de un HTML
function scriptsInline(rel) {
    return Array.from(parsear(rel).querySelectorAll('script:not([src])'))
        .filter(script => !script.getAttribute('type') || script.getAttribute('type') === 'text/javascript')
        .map(script => script.textContent);
}

function respuesta(cuerpo, { status = 200, tipo = 'application/json' } = {}) {
    const texto = typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo);
    return new Response(texto, { status, headers: { 'content-type': tipo } });
}

/**
 * Abre una página en jsdom y carga scripts del sitio en su contexto global.
 *
 * opciones:
 *   html            archivo HTML de la raíz del repo (ej. 'productos.html'); por defecto un documento vacío
 *   contenido       HTML literal (alternativa a `html`)
 *   url             URL de la página; por defecto `${ORIGEN}/<html>`
 *   scripts         rutas a evaluar en orden, o 'declarados' para usar los <script src> locales del HTML
 *   almacenamiento  pares clave/valor que se escriben en localStorage antes de cargar los scripts
 *   rutas           (url, opciones) => Response | undefined  — respuestas de fetch; undefined usa el valor por defecto
 *   ahora           [año, mes(1-12), día, hora?] fecha fija para `new Date()` y `Date.now()` dentro de la página
 *   antes           (window) => void  — se ejecuta antes de cargar los scripts
 *   iniciar         true para despachar DOMContentLoaded tras cargar los scripts y esperar a que se asiente
 */
async function abrirPagina(opciones = {}) {
    const {
        html = null,
        contenido = null,
        scripts = [],
        almacenamiento = {},
        rutas = null,
        ahora = null,
        antes = null,
        iniciar = false
    } = opciones;
    const url = opciones.url || `${ORIGEN}/${html || ''}`;

    const consola = [];
    const errores = [];
    const virtualConsole = new VirtualConsole();
    ['log', 'info', 'warn', 'error', 'debug'].forEach(nivel => {
        virtualConsole.on(nivel, (...args) => consola.push({ nivel, args }));
    });
    virtualConsole.on('jsdomError', error => errores.push(error));

    const dom = new JSDOM(contenido || (html ? leer(html) : HTML_MINIMO), {
        url,
        runScripts: 'outside-only',
        pretendToBeVisual: true,
        virtualConsole
    });
    const { window } = dom;
    const contexto = dom.getInternalVMContext();

    if (window.document.readyState !== 'complete') {
        await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
    }

    const evaluar = (codigo, filename = 'prueba.js') => vm.runInContext(codigo, contexto, { filename });

    // --- APIs del navegador que jsdom no implementa ---
    const scrolls = [];
    const ventanasAbiertas = [];
    window.scrollTo = (...args) => { scrolls.push(args); };
    window.open = (...args) => { ventanasAbiertas.push(args); return null; };
    window.Element.prototype.scrollIntoView = function scrollIntoView(...args) {
        scrolls.push(['scrollIntoView', this.id, ...args]);
    };

    // --- fetch: sirve los archivos locales del repo; lo externo hay que declararlo en `rutas` ---
    const peticiones = [];
    window.fetch = async (recurso, opcionesFetch = {}) => {
        const destino = new URL(String(recurso), window.location.href);
        peticiones.push({ url: destino.href, original: String(recurso), opciones: opcionesFetch });

        if (rutas) {
            const propia = await rutas(destino.href, opcionesFetch);
            if (propia !== undefined) {
                if (propia instanceof Error) throw propia;
                return propia;
            }
        }

        if (destino.origin === ORIGEN) {
            const rel = decodeURIComponent(destino.pathname).replace(/^\//, '');
            if (rel && existe(rel)) return respuesta(leer(rel));
            return respuesta('No encontrado', { status: 404, tipo: 'text/plain' });
        }

        throw new TypeError(`fetch sin ruta definida en la prueba: ${destino.href}`);
    };

    if (ahora) {
        const [anio, mes, dia, hora = 12] = ahora;
        evaluar(`(function () {
            const DateReal = Date;
            const fijo = new DateReal(${anio}, ${mes - 1}, ${dia}, ${hora}, 0, 0).getTime();
            class DateFija extends DateReal {
                constructor(...args) { if (args.length === 0) { super(fijo); } else { super(...args); } }
                static now() { return fijo; }
            }
            globalThis.Date = DateFija;
        })();`, 'fecha-fija.js');
    }

    Object.entries(almacenamiento).forEach(([clave, valor]) => window.localStorage.setItem(clave, valor));

    if (antes) antes(window);

    // Ruta absoluta como nombre: así los errores apuntan al archivo real y la cobertura lo reconoce
    const cargar = rel => evaluar(leer(rel), path.join(ROOT, rel));
    const lista = scripts === 'declarados' ? scriptsDeclarados(html).map(script => script.ruta) : scripts;
    lista.forEach(cargar);

    // Deja correr microtareas y temporizadores ya vencidos
    const asentar = async (vueltas = 5) => {
        for (let i = 0; i < vueltas; i++) {
            await new Promise(resolve => setImmediate(resolve));
        }
    };
    const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Espera hasta que `condicion()` sea verdadera (para flujos con fetch y promesas encadenadas)
    const hasta = async (condicion, descripcion = 'la condición esperada', limite = 3000) => {
        const inicio = Date.now();
        while (!condicion()) {
            if (Date.now() - inicio > limite) throw new Error(`No se cumplió a tiempo: ${descripcion}`);
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    };

    // Valor de una expresión de la página, copiado al contexto de la prueba
    const valor = expresion => JSON.parse(evaluar(`JSON.stringify(${expresion})`));

    // Hace que los setTimeout de la página venzan de inmediato (reintentos, esperas de 3 s, etc.)
    const acelerarTemporizadores = () => {
        const original = window.setTimeout.bind(window);
        window.setTimeout = (fn, _ms, ...args) => original(fn, 0, ...args);
    };

    const despachar = (destino, tipo, init = {}) => {
        const Clase = init.key !== undefined ? window.KeyboardEvent
            : (tipo === 'click' ? window.MouseEvent : window.Event);
        const evento = new Clase(tipo, { bubbles: true, cancelable: true, ...init });
        destino.dispatchEvent(evento);
        return evento;
    };

    const iniciarPagina = async () => {
        window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
        await asentar();
    };

    // Simula el desplazamiento vertical de la ventana
    const desplazar = (scrollY) => {
        Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
        window.dispatchEvent(new window.Event('scroll'));
    };

    const pagina = {
        dom,
        window,
        document: window.document,
        consola,
        errores,
        peticiones,
        scrolls,
        ventanasAbiertas,
        evaluar,
        cargar,
        asentar,
        esperar,
        hasta,
        valor,
        acelerarTemporizadores,
        despachar,
        desplazar,
        iniciar: iniciarPagina,
        click: destino => despachar(destino, 'click'),
        mensajes: nivel => consola.filter(entrada => entrada.nivel === nivel).map(entrada => entrada.args.join(' ')),
        // Espera a que terminen las promesas en curso antes de cerrar la ventana
        cerrar: async () => { await asentar(); window.close(); }
    };

    if (iniciar) await iniciarPagina();
    return pagina;
}

module.exports = {
    ROOT,
    ORIGEN,
    MODULOS,
    leer,
    existe,
    sinQuery,
    parsear,
    scriptsDeclarados,
    scriptsInline,
    respuesta,
    abrirPagina
};
