// ========== SERVICE WORKER - ROPAVEJERO RETRO ==========
// Versión del caché - Incrementar cuando actualices recursos
const CACHE_VERSION = 'ropavejero-v1.0.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DATA_CACHE_NAME = `${CACHE_VERSION}-data`;

// Recursos para cachear inmediatamente
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/css/index.css',
    '/css/font-awesome_6.5.1_all.min.css',
    '/js/index.js',
    '/js/instagram_posts.js',
    '/img/RopavejeroLogo_256.png',
    '/img/RopavejeroLogo_150.png',
    '/img/RopavejeroLogo_100.png',
    '/img/RopavejeroLogo_50.png',
    '/img/favicon.png',
    '/manifest.json'
];

// Recursos de Instagram (imágenes de posts)
const INSTAGRAM_IMAGES = [
    '/img/Post01.jpeg',
    '/img/Post02.jpeg',
    '/img/Post03.jpeg',
    '/img/Post04.jpeg',
    '/img/Post05.jpeg',
    '/img/Post06.jpeg'
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
