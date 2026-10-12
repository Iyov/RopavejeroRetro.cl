'use strict';

// Datos de prueba con la misma forma que entregan las fuentes reales.

const HOJA_URL = 'https://docs.google.com/spreadsheets/d/1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek/gviz/tq';

// Catálogo base: columnas Num, Product, Platform, Sale, Neto, Stock, Link, Sold
const PRODUCTOS = [
    { num: 23, producto: 'Grudge Warriors (BL-CIB)', plataforma: 'PS1', venta: '$15', neto: '$15.000', stock: '1', link: 'DMwPmoFsgMg', vendido: '' },
    { num: 50, producto: 'Tetris Plus (GH-MM)', plataforma: 'PS1', venta: '$8', neto: '$8.000', stock: '1', link: 'DMwPmoFsgMg', vendido: '1' },
    { num: 101, producto: 'Super Mario World', plataforma: 'SNES', venta: '$30', neto: '$30.000', stock: '2', link: '', vendido: '' },
    { num: 102, producto: 'Zelda, A Link to the Past', plataforma: 'SNES', venta: '$45', neto: '$45.000', stock: '1', link: 'ABC123', vendido: '' },
    { num: 200, producto: 'Sonic the Hedgehog 2', plataforma: 'Genesis', venta: 'X', neto: 'X', stock: '1', link: 'GEN200', vendido: '' },
    { num: 300, producto: 'Halo 3 CIB', plataforma: 'Xbox 360', venta: '$5', neto: '$5.000', stock: '3', link: 'X360', vendido: '' }
];

function celda(valor) {
    return `"${String(valor).replace(/"/g, '""')}"`;
}

// CSV con el formato real de la hoja: una fila de título, una de encabezados y los datos
function csvHoja(productos = PRODUCTOS) {
    const lineas = [
        ['Disponibles Ropavejero.Retro [1] al lunes 14/sept/2026', '', '', '', '', '', '100%', '100%', '14/9', ''],
        ['', 'Product', 'Platform', '', '', '', 'Link', '', '', '']
    ];
    productos.forEach(p => {
        lineas.push([p.num, p.producto, p.plataforma, p.venta, p.neto, p.stock, p.link, p.vendido, '', '']);
    });
    return lineas.map(linea => linea.map(celda).join(',')).join('\n');
}

// Genera `cantidad` productos numerados, para probar la paginación
function muchosProductos(cantidad, plataforma = 'PS2') {
    return Array.from({ length: cantidad }, (_, i) => ({
        num: i + 1,
        producto: `Juego ${String(i + 1).padStart(3, '0')}`,
        plataforma,
        venta: '$10',
        neto: '$10.000',
        stock: '1',
        link: `LINK${i + 1}`,
        vendido: ''
    }));
}

const POSTS = [
    {
        id: 'ig_auto_1',
        image: 'img/IG_1.jpeg',
        title: '[PS1] Juegos nuevos',
        description: 'Llegaron juegos de PlayStation',
        link: 'https://www.instagram.com/p/AAA/',
        media_type: 'IMAGE',
        date: '2026-10-12',
        likes: 1234
    },
    {
        id: 'ig_auto_2',
        image: 'img/IG_2.jpeg',
        title: 'Super Nintendo en stock',
        description: 'Cartuchos [SNES] originales',
        link: 'https://www.instagram.com/p/BBB/',
        media_type: 'CAROUSEL_ALBUM',
        date: '2026-10-05',
        likes: 0
    },
    {
        id: 'ig_auto_3',
        image: 'img/IG_3.jpeg',
        title: 'Feria retro este sábado',
        description: 'Nos vemos en la feria',
        link: 'https://www.instagram.com/p/CCC/',
        media_type: 'IMAGE',
        date: '2026-01-02',
        likes: 7
    }
];

module.exports = { HOJA_URL, PRODUCTOS, POSTS, csvHoja, muchosProductos };
