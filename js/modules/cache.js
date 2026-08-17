// ========== MÓDULO: CACHE ==========

// ========== SIGLAS HANDLER ==========
let siglasData = {};

// ========== SISTEMA DE CACHÉ INTELIGENTE ==========
const CACHE_CONFIG = {
    VERSION: '1.1.1', // Versión del caché
    PRODUCTS_KEY: 'ropavejero_products_cache_v1_1_1',
    TIMESTAMP_KEY: 'ropavejero_cache_timestamp_v1_1_1',
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos en milisegundos
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000 // 2 segundos
};

// Limpiar cachés antiguos al cargar
function cleanOldCaches() {
    try {
        // Limpiar cachés antiguos
        const oldKeys = [
            'ropavejero_products_cache',
            'ropavejero_cache_timestamp',
            'ropavejero_products_cache_v1',
            'ropavejero_cache_timestamp_v1',
            'ropavejero_products_cache_v1_0_8',
            'ropavejero_cache_timestamp_v1_0_8',
            'ropavejero_products_cache_v1_0_9',
            'ropavejero_cache_timestamp_v1_0_9'
        ];
        oldKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.warn('Error cleaning old caches:', error);
    }
}

// Ejecutar limpieza al cargar
cleanOldCaches();

// Función para obtener datos del caché
function getCachedProducts() {
    try {
        const cachedData = localStorage.getItem(CACHE_CONFIG.PRODUCTS_KEY);
        const timestamp = localStorage.getItem(CACHE_CONFIG.TIMESTAMP_KEY);
        
        if (!cachedData || !timestamp) {
            return null;
        }
        
        const now = Date.now();
        const cacheAge = now - parseInt(timestamp);
        
        // Verificar si el caché ha expirado
        if (cacheAge > CACHE_CONFIG.CACHE_DURATION) {
            // Limpiar caché expirado
            localStorage.removeItem(CACHE_CONFIG.PRODUCTS_KEY);
            localStorage.removeItem(CACHE_CONFIG.TIMESTAMP_KEY);
            return null;
        }
        
        return JSON.parse(cachedData);
    } catch (error) {
        console.warn('Error reading cache:', error);
        return null;
    }
}

// Función para guardar datos en caché
function setCachedProducts(products) {
    try {
        localStorage.setItem(CACHE_CONFIG.PRODUCTS_KEY, JSON.stringify(products));
        localStorage.setItem(CACHE_CONFIG.TIMESTAMP_KEY, Date.now().toString());
        console.info('✅ Productos guardados en caché');
    } catch (error) {
        console.warn('Error saving to cache:', error);
    }
}

// Función para limpiar caché manualmente
function clearProductsCache() {
    localStorage.removeItem(CACHE_CONFIG.PRODUCTS_KEY);
    localStorage.removeItem(CACHE_CONFIG.TIMESTAMP_KEY);
    console.info('🗑️ Caché de productos limpiado');
}

// Función para limpiar todo el caché
function clearAllCache() {
    clearProductsCache();
    console.info('🗑️ Todo el caché limpiado');
}
