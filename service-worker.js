// ========== SERVICE WORKER - ROPAVEJERO RETRO ==========
// Versión del caché - Incrementar cuando actualices recursos
const CACHE_VERSION = 'ropavejero-v2026-04-12_1234';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DATA_CACHE_NAME = `${CACHE_VERSION}-data`;

// Recursos para cachear inmediatamente
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/productos',
    '/productos.html',
    '/css/index.min.css',
    '/css/font-awesome_6.5.1_all.min.css',
    '/js/index.min.js',
    '/js/instagram_posts.min.js',
    '/js/app.min.js',
    '/img/hero-400.webp',
    '/img/hero-800.webp',
    '/img/hero-1200.webp',
    '/img/hero-1920.webp',
    '/img/hero-800.jpg',
    '/img/hero-1200.jpg',
    '/img/hero-1920.jpg',
    '/img/RopavejeroLogo_256.png',
    '/img/RopavejeroLogo_150.png',
    '/img/RopavejeroLogo_100.png',
    '/img/RopavejeroLogo_50.png',
    '/img/favicon.png',
    '/manifest.json'
];

// Recursos de Instagram (imágenes de posts WebP responsive y fallbacks)
const INSTAGRAM_IMAGES = [
    '/img/IG_18050717042723876.jpeg',
    '/img/IG_18050717042723876-400.webp',
    '/img/IG_18050717042723876-800.webp',
    '/img/IG_18050717042723876-1200.webp',
    '/img/IG_17944335083997696.jpeg',
    '/img/IG_17944335083997696-400.webp',
    '/img/IG_17944335083997696-800.webp',
    '/img/IG_17944335083997696-1200.webp',
    '/img/IG_18319887493265053.jpeg',
    '/img/IG_18319887493265053-400.webp',
    '/img/IG_18319887493265053-800.webp',
    '/img/IG_18319887493265053-1200.webp',
    '/img/IG_18086476100016483.jpeg',
    '/img/IG_18086476100016483-400.webp',
    '/img/IG_18086476100016483-800.webp',
    '/img/IG_18086476100016483-1200.webp',
    '/img/IG_18043782038763893.jpeg',
    '/img/IG_18043782038763893-400.webp',
    '/img/IG_18043782038763893-800.webp',
    '/img/IG_18043782038763893-1200.webp',
    '/img/IG_17893407120304412.jpeg',
    '/img/IG_17893407120304412-400.webp',
    '/img/IG_17893407120304412-800.webp',
    '/img/IG_17893407120304412-1200.webp',
    '/img/IG_18082720118366461.jpeg',
    '/img/IG_18082720118366461-400.webp',
    '/img/IG_18082720118366461-800.webp',
    '/img/IG_18082720118366461-1200.webp',
    '/img/IG_18046796558752600.jpeg',
    '/img/IG_18046796558752600-400.webp',
    '/img/IG_18046796558752600-800.webp',
    '/img/IG_18046796558752600-1200.webp',
    '/img/IG_17917761678339044.jpeg',
    '/img/IG_17917761678339044-400.webp',
    '/img/IG_17917761678339044-800.webp',
    '/img/IG_17917761678339044-1200.webp',
    '/img/IG_17935530975198542.jpeg',
    '/img/IG_17935530975198542-400.webp',
    '/img/IG_17935530975198542-800.webp',
    '/img/IG_17935530975198542-1200.webp',
    '/img/IG_17994365957767005.jpeg',
    '/img/IG_17994365957767005-400.webp',
    '/img/IG_17994365957767005-800.webp',
    '/img/IG_17994365957767005-1200.webp',
    '/img/IG_18537807793066621.jpeg',
    '/img/IG_18537807793066621-400.webp',
    '/img/IG_18537807793066621-800.webp',
    '/img/IG_18537807793066621-1200.webp',
    '/img/IG_18092722895142241.jpeg',
    '/img/IG_18092722895142241-400.webp',
    '/img/IG_18092722895142241-800.webp',
    '/img/IG_18092722895142241-1200.webp',
    '/img/IG_17890732692327215.jpeg',
    '/img/IG_17890732692327215-400.webp',
    '/img/IG_17890732692327215-800.webp',
    '/img/IG_17890732692327215-1200.webp',
    '/img/IG_17957820246103525.jpeg',
    '/img/IG_17957820246103525-400.webp',
    '/img/IG_17957820246103525-800.webp',
    '/img/IG_17957820246103525-1200.webp',
    '/img/IG_18080158754387395.jpeg',
    '/img/IG_18080158754387395-400.webp',
    '/img/IG_18080158754387395-800.webp',
    '/img/IG_18080158754387395-1200.webp',
    '/img/IG_18384214489095982.jpeg',
    '/img/IG_18384214489095982-400.webp',
    '/img/IG_18384214489095982-800.webp',
    '/img/IG_18384214489095982-1200.webp',
    '/img/IG_18347840878241019.jpeg',
    '/img/IG_18347840878241019-400.webp',
    '/img/IG_18347840878241019-800.webp',
    '/img/IG_18347840878241019-1200.webp',
    '/img/IG_17876155668439654.jpeg',
    '/img/IG_17876155668439654-400.webp',
    '/img/IG_17876155668439654-800.webp',
    '/img/IG_17876155668439654-1200.webp',
    '/img/IG_18418398307131857.jpeg',
    '/img/IG_18418398307131857-400.webp',
    '/img/IG_18418398307131857-800.webp',
    '/img/IG_18418398307131857-1200.webp',
    '/img/IG_18111989497745508.jpeg',
    '/img/IG_18111989497745508-400.webp',
    '/img/IG_18111989497745508-800.webp',
    '/img/IG_18111989497745508-1200.webp',
    '/img/IG_17988376982966993.jpeg',
    '/img/IG_17988376982966993-400.webp',
    '/img/IG_17988376982966993-800.webp',
    '/img/IG_17988376982966993-1200.webp',
    '/img/IG_18093052766128517.jpeg',
    '/img/IG_18093052766128517-400.webp',
    '/img/IG_18093052766128517-800.webp',
    '/img/IG_18093052766128517-1200.webp',
    '/img/IG_18005375426710787.jpeg',
    '/img/IG_18005375426710787-400.webp',
    '/img/IG_18005375426710787-800.webp',
    '/img/IG_18005375426710787-1200.webp',
    '/img/IG_17972823113858508.jpeg',
    '/img/IG_17972823113858508-400.webp',
    '/img/IG_17972823113858508-800.webp',
    '/img/IG_17972823113858508-1200.webp',
    '/img/IG_18071324624541843.jpeg',
    '/img/IG_18071324624541843-400.webp',
    '/img/IG_18071324624541843-800.webp',
    '/img/IG_18071324624541843-1200.webp',
    '/img/IG_18023227511639731.jpeg',
    '/img/IG_18023227511639731-400.webp',
    '/img/IG_18023227511639731-800.webp',
    '/img/IG_18023227511639731-1200.webp',
    '/img/IG_18102142781309641.jpeg',
    '/img/IG_18102142781309641-400.webp',
    '/img/IG_18102142781309641-800.webp',
    '/img/IG_18102142781309641-1200.webp',
    '/img/IG_18127312852603869.jpeg',
    '/img/IG_18127312852603869-400.webp',
    '/img/IG_18127312852603869-800.webp',
    '/img/IG_18127312852603869-1200.webp',
    '/img/IG_18046375097729709.jpeg',
    '/img/IG_18046375097729709-400.webp',
    '/img/IG_18046375097729709-800.webp',
    '/img/IG_18046375097729709-1200.webp',
    '/img/IG_18015649244668313.jpeg',
    '/img/IG_18015649244668313-400.webp',
    '/img/IG_18015649244668313-800.webp',
    '/img/IG_18015649244668313-1200.webp',
    '/img/IG_17854862022631904.jpeg',
    '/img/IG_17854862022631904-400.webp',
    '/img/IG_17854862022631904-800.webp',
    '/img/IG_17854862022631904-1200.webp',
    '/img/IG_18175707910377145.jpeg',
    '/img/IG_18175707910377145-400.webp',
    '/img/IG_18175707910377145-800.webp',
    '/img/IG_18175707910377145-1200.webp',
    '/img/IG_18104183341887528.jpeg',
    '/img/IG_18104183341887528-400.webp',
    '/img/IG_18104183341887528-800.webp',
    '/img/IG_18104183341887528-1200.webp',
    '/img/IG_17888398707446498.jpeg',
    '/img/IG_17888398707446498-400.webp',
    '/img/IG_17888398707446498-800.webp',
    '/img/IG_17888398707446498-1200.webp',
    '/img/IG_18258015586295629.jpeg',
    '/img/IG_18258015586295629-400.webp',
    '/img/IG_18258015586295629-800.webp',
    '/img/IG_18258015586295629-1200.webp',
    '/img/IG_17984388509956269.jpeg',
    '/img/IG_17984388509956269-400.webp',
    '/img/IG_17984388509956269-800.webp',
    '/img/IG_17984388509956269-1200.webp',
    '/img/IG_18001713173907575.jpeg',
    '/img/IG_18001713173907575-400.webp',
    '/img/IG_18001713173907575-800.webp',
    '/img/IG_18001713173907575-1200.webp',
    '/img/IG_17999589350910911.jpeg',
    '/img/IG_17999589350910911-400.webp',
    '/img/IG_17999589350910911-800.webp',
    '/img/IG_17999589350910911-1200.webp',
    '/img/IG_17920957479266936.jpeg',
    '/img/IG_17920957479266936-400.webp',
    '/img/IG_17920957479266936-800.webp',
    '/img/IG_17920957479266936-1200.webp'
];

// URLs que NO deben cachearse
const EXCLUDED_URLS = [
    'docs.google.com',
    'cloudflareinsights.com',
    'analytics',
    'chrome-extension'
];

// ========== INSTALACIÓN ==========
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando recursos estáticos');
                return cache.addAll(STATIC_RESOURCES);
            })
            .then(() => {
                // Cachear imágenes de Instagram en segundo plano
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('[Service Worker] Cacheando imágenes de Instagram');
                        return cache.addAll(INSTAGRAM_IMAGES).catch((err) => {
                            console.warn('[Service Worker] Algunas imágenes no se pudieron cachear:', err);
                        });
                    });
            })
            .then(() => {
                console.log('[Service Worker] Instalación completada');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch((error) => {
                console.error('[Service Worker] Error en instalación:', error);
            })
    );
});

// ========== ACTIVACIÓN ==========
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Eliminar cachés antiguos
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('ropavejero-') && 
                                   cacheName !== CACHE_NAME && 
                                   cacheName !== DATA_CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activación completada');
                return self.clients.claim(); // Tomar control inmediatamente
            })
    );
});

// ========== FETCH - ESTRATEGIA DE CACHÉ ==========
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar URLs excluidas
    if (EXCLUDED_URLS.some(excluded => url.href.includes(excluded))) {
        return;
    }
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia: Cache First para recursos estáticos
    if (isStaticResource(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estrategia: Network First para datos dinámicos (Google Sheets)
    if (isDataRequest(url)) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estrategia: Stale While Revalidate para imágenes
    if (isImageRequest(url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // Por defecto: Network First
    event.respondWith(networkFirst(request));
});

// ========== ESTRATEGIAS DE CACHÉ ==========

// Cache First: Busca en caché primero, luego en red
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[Service Worker] Error en fetch:', error);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Network First: Intenta red primero, luego caché
async function networkFirst(request) {
    const cache = await caches.open(DATA_CACHE_NAME);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Stale While Revalidate: Devuelve caché y actualiza en segundo plano
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// ========== FUNCIONES AUXILIARES ==========

function isStaticResource(url) {
    return url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.woff2') ||
           url.pathname.endsWith('.ttf') ||
           url.pathname === '/' ||
           url.pathname === '/index.html' ||
           url.pathname === '/manifest.json';
}

function isDataRequest(url) {
    return url.hostname.includes('docs.google.com') ||
           url.pathname.includes('/api/');
}

function isImageRequest(url) {
    return url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.jpeg') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.gif') ||
           url.pathname.endsWith('.webp') ||
           url.pathname.endsWith('.svg');
}

// ========== MENSAJES ==========
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('[Service Worker] Cargado correctamente');
