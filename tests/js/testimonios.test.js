'use strict';

// Spec: specs/base/18-testimonios.md
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parsear, leer } = require('./helpers/pagina');

const DESTACADA = 'https://www.instagram.com/stories/highlights/18080169038493913/';
const FUENTES = /^https:\/\/(www\.instagram\.com|www\.google\.com\/maps)\//;

// Diccionario de ui.js: la primera aparición de cada clave es la española y la segunda la inglesa
const traducciones = clave => [...leer('js/modules/ui.js').matchAll(new RegExp(`'${clave}':\\s*'([^']*)'`, 'g'))].map(m => m[1]);
const tarjetas = () => Array.from(parsear('index.html').querySelectorAll('#testimonios .testimonial-card'));

test('[TST-001] cada testimonio tiene cita, autor y enlace a su fuente, sin fotos', () => {
    const seccion = parsear('index.html').querySelector('#testimonios');
    assert.ok(seccion, 'falta la sección #testimonios');
    assert.equal(seccion.querySelectorAll('img').length, 0, 'la sección no debe cargar imágenes');

    const lista = tarjetas();
    assert.equal(lista.length, 3);
    lista.forEach((tarjeta, i) => {
        assert.ok(tarjeta.querySelector('blockquote p').textContent.trim(), `tarjeta ${i + 1}: cita`);
        assert.ok(tarjeta.querySelector('.testimonial-name').textContent.trim(), `tarjeta ${i + 1}: autor`);
        assert.ok(tarjeta.querySelector('.testimonial-image i.fab'), `tarjeta ${i + 1}: ícono de la fuente`);

        const enlace = tarjeta.querySelector('a[href]');
        assert.ok(enlace, `tarjeta ${i + 1}: enlace a la fuente`);
        assert.match(enlace.getAttribute('href'), FUENTES, `tarjeta ${i + 1}`);
        assert.equal(enlace.getAttribute('target'), '_blank');
        assert.match(enlace.getAttribute('rel'), /noopener/);
        assert.match(enlace.getAttribute('rel'), /noreferrer/);
    });
});

test('[TST-002] los testimonios son los reales elegidos, en español y en inglés', () => {
    const esperado = [
        {
            autor: '@ignacioalvaarado',
            cita: ['"Full recomendado"', '"Highly recommended"'],
            detalle: ['Compró una PS3 · Historia en Instagram', 'Bought a PS3 · Instagram story']
        },
        {
            autor: '@bazardekaneda',
            cita: ['"Gracias a @ropavejero.retro que me salvó estas joyitas"', '"Thanks to @ropavejero.retro for saving these gems for me"'],
            detalle: ['Compró juegos de GameCube · Historia en Instagram', 'Bought GameCube games · Instagram story']
        },
        {
            autor: 'Carlos M.',
            cita: ['"Llegó todo impecable"', '"Everything arrived in perfect condition"'],
            detalle: ['Compró juegos con envío · Mensaje en Instagram', 'Bought games with shipping · Instagram message']
        }
    ];

    tarjetas().forEach((tarjeta, i) => {
        const n = i + 1;
        assert.equal(tarjeta.querySelector('.testimonial-name').textContent.trim(), esperado[i].autor);
        assert.deepEqual(traducciones(`testimonial-${n}`), esperado[i].cita, `testimonial-${n}`);
        assert.deepEqual(traducciones(`testimonial-role-${n}`), esperado[i].detalle, `testimonial-role-${n}`);
        assert.equal(tarjeta.querySelector(`[data-translate="testimonial-${n}"]`).textContent, esperado[i].cita[0]);
        assert.equal(tarjeta.querySelector(`[data-translate="testimonial-role-${n}"]`).textContent, esperado[i].detalle[0]);
        assert.equal(tarjeta.querySelector('a[href]').getAttribute('href'), DESTACADA);
    });

    const subtitulo = traducciones('testimonials-subtitle');
    assert.deepEqual(subtitulo, [
        'Esto dicen nuestros clientes en Instagram. Puedes ver todas sus historias en la destacada «Cliente Feliz».',
        'This is what our customers say on Instagram. You can see all their stories in the «Cliente Feliz» highlight.'
    ]);
    assert.equal(parsear('index.html').querySelector('[data-translate="testimonials-subtitle"]').textContent, subtitulo[0]);
});
