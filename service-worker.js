// ========== SERVICE WORKER - ROPAVEJERO RETRO ==========
// Versión del caché - Incrementar cuando actualices recursos
const CACHE_VERSION = 'ropavejero-v2026-03-17_1241';
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
    '/img/IG_18039043958769550.jpeg',
    '/img/IG_18039043958769550-400.webp',
    '/img/IG_18039043958769550-800.webp',
    '/img/IG_18039043958769550-1200.webp',
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
    '/img/IG_18070865726227512.jpeg',
    '/img/IG_18070865726227512-400.webp',
    '/img/IG_18070865726227512-800.webp',
    '/img/IG_18070865726227512-1200.webp',
    '/img/IG_17881039875387202.jpeg',
    '/img/IG_17881039875387202-400.webp',
    '/img/IG_17881039875387202-800.webp',
    '/img/IG_17881039875387202-1200.webp',
    '/img/IG_17999589350910911.jpeg',
    '/img/IG_17999589350910911-400.webp',
    '/img/IG_17999589350910911-800.webp',
    '/img/IG_17999589350910911-1200.webp',
    '/img/IG_17920957479266936.jpeg',
    '/img/IG_17920957479266936-400.webp',
    '/img/IG_17920957479266936-800.webp',
    '/img/IG_17920957479266936-1200.webp',
    '/img/IG_18122212840518134.jpeg',
    '/img/IG_18122212840518134-400.webp',
    '/img/IG_18122212840518134-800.webp',
    '/img/IG_18122212840518134-1200.webp',
    '/img/IG_18071761007140852.jpeg',
    '/img/IG_18071761007140852-400.webp',
    '/img/IG_18071761007140852-800.webp',
    '/img/IG_18071761007140852-1200.webp',
    '/img/IG_17902748031199245.jpeg',
    '/img/IG_17902748031199245-400.webp',
    '/img/IG_17902748031199245-800.webp',
    '/img/IG_17902748031199245-1200.webp',
    '/img/IG_18110866735659338.jpeg',
    '/img/IG_18110866735659338-400.webp',
    '/img/IG_18110866735659338-800.webp',
    '/img/IG_18110866735659338-1200.webp',
    '/img/IG_18323105596217851.jpeg',
    '/img/IG_18323105596217851-400.webp',
    '/img/IG_18323105596217851-800.webp',
    '/img/IG_18323105596217851-1200.webp',
    '/img/IG_18119567194606230.jpeg',
    '/img/IG_18119567194606230-400.webp',
    '/img/IG_18119567194606230-800.webp',
    '/img/IG_18119567194606230-1200.webp',
    '/img/IG_18016290578646891.jpeg',
    '/img/IG_18016290578646891-400.webp',
    '/img/IG_18016290578646891-800.webp',
    '/img/IG_18016290578646891-1200.webp',
    '/img/IG_18357988195201613.jpeg',
    '/img/IG_18357988195201613-400.webp',
    '/img/IG_18357988195201613-800.webp',
    '/img/IG_18357988195201613-1200.webp',
    '/img/IG_18055811306380269.jpeg',
    '/img/IG_18055811306380269-400.webp',
    '/img/IG_18055811306380269-800.webp',
    '/img/IG_18055811306380269-1200.webp',
    '/img/IG_17995638653859879.jpeg',
    '/img/IG_17995638653859879-400.webp',
    '/img/IG_17995638653859879-800.webp',
    '/img/IG_17995638653859879-1200.webp',
    '/img/IG_17996237519906325.jpeg',
    '/img/IG_17996237519906325-400.webp',
    '/img/IG_17996237519906325-800.webp',
    '/img/IG_17996237519906325-1200.webp',
    '/img/IG_17909902839309642.jpeg',
    '/img/IG_17909902839309642-400.webp',
    '/img/IG_17909902839309642-800.webp',
    '/img/IG_17909902839309642-1200.webp',
    '/img/IG_18119768341583465.jpeg',
    '/img/IG_18119768341583465-400.webp',
    '/img/IG_18119768341583465-800.webp',
    '/img/IG_18119768341583465-1200.webp',
    '/img/IG_17867016285552189.jpeg',
    '/img/IG_17867016285552189-400.webp',
    '/img/IG_17867016285552189-800.webp',
    '/img/IG_17867016285552189-1200.webp',
    '/img/IG_18020656073803699.jpeg',
    '/img/IG_18020656073803699-400.webp',
    '/img/IG_18020656073803699-800.webp',
    '/img/IG_18020656073803699-1200.webp',
    '/img/IG_18098015590916334.jpeg',
    '/img/IG_18098015590916334-400.webp',
    '/img/IG_18098015590916334-800.webp',
    '/img/IG_18098015590916334-1200.webp'
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
