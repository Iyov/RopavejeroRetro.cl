// ========== SISTEMA DE ANALYTICS PROPIO - ROPAVEJERO RETRO ==========
// Sistema de analytics respetuoso con la privacidad (sin cookies, solo localStorage)

const RopavejeroAnalytics = (function() {
    'use strict';
    
    // Configuración
    const CONFIG = {
        STORAGE_KEY: 'ropavejero_analytics',
        MAX_EVENTS: 1000, // Máximo de eventos a guardar
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        VERSION: '1.0.0'
    };
    
    // Inicializar analytics
    function init() {
        // Crear estructura de datos si no existe
        if (!getAnalyticsData()) {
            const initialData = {
                version: CONFIG.VERSION,
                sessions: [],
                products: {
                    views: {},
                    clicks: {}
                },
                searches: {
                    terms: {},
                    platforms: {}
                },
                interactions: {
                    languageChanges: 0,
                    themeChanges: 0,
                    filterUses: 0,
                    instagramClicks: 0,
                    statsViews: 0
                },
                pages: {
                    views: {}
                },
                performance: {
                    loadTimes: []
                },
                lastCleanup: Date.now()
            };
            saveAnalyticsData(initialData);
        }
        
        // Iniciar nueva sesión
        startSession();
        
        // Limpiar datos antiguos periódicamente
        cleanupOldData();
        
        console.log('📊 Analytics inicializado');
    }
    
    // ========== GESTIÓN DE SESIONES ==========
    
    function startSession() {
        const data = getAnalyticsData();
        const session = {
            id: generateSessionId(),
            startTime: Date.now(),
            endTime: null,
            pageViews: 1,
            events: []
        };
        
        data.sessions.push(session);
        
        // Mantener solo las últimas 50 sesiones
        if (data.sessions.length > 50) {
            data.sessions = data.sessions.slice(-50);
        }
        
        saveAnalyticsData(data);
        return session.id;
    }
    
    function generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // ========== TRACKING DE PRODUCTOS ==========
    
    function trackProductView(productId, productName, platform) {
        const data = getAnalyticsData();
        
        if (!data.products.views[productId]) {
            data.products.views[productId] = {
                id: productId,
                name: productName,
                platform: platform,
                count: 0,
                lastViewed: null
            };
        }
        
        data.products.views[productId].count++;
        data.products.views[productId].lastViewed = Date.now();
        
        saveAnalyticsData(data);
        
        if (window.location.hostname === 'localhost') {
            console.log('📊 Producto visto:', productName);
        }
    }
    
    function trackProductClick(productId, productName, destination) {
        const data = getAnalyticsData();
        
        if (!data.products.clicks[productId]) {
            data.products.clicks[productId] = {
                id: productId,
                name: productName,
                count: 0,
                destinations: {}
            };
        }
        
        data.products.clicks[productId].count++;
        
        if (!data.products.clicks[productId].destinations[destination]) {
            data.products.clicks[productId].destinations[destination] = 0;
        }
        data.products.clicks[productId].destinations[destination]++;
        
        saveAnalyticsData(data);
    }
    
    // ========== TRACKING DE BÚSQUEDAS ==========
    
    function trackSearch(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) return;
        
        const data = getAnalyticsData();
        const normalizedTerm = searchTerm.toLowerCase().trim();
        
        if (!data.searches.terms[normalizedTerm]) {
            data.searches.terms[normalizedTerm] = {
                term: normalizedTerm,
                count: 0,
                lastSearched: null
            };
        }
        
        data.searches.terms[normalizedTerm].count++;
        data.searches.terms[normalizedTerm].lastSearched = Date.now();
        
        saveAnalyticsData(data);
    }
    
    function trackPlatformFilter(platforms) {
        const data = getAnalyticsData();
        
        platforms.forEach(platform => {
            if (platform === 'all') return;
            
            if (!data.searches.platforms[platform]) {
                data.searches.platforms[platform] = {
                    platform: platform,
                    count: 0,
                    lastUsed: null
                };
            }
            
            data.searches.platforms[platform].count++;
            data.searches.platforms[platform].lastUsed = Date.now();
        });
        
        saveAnalyticsData(data);
    }
    
    // ========== TRACKING DE INTERACCIONES ==========
    
    function trackInteraction(type) {
        const data = getAnalyticsData();
        
        if (data.interactions[type] !== undefined) {
            data.interactions[type]++;
            saveAnalyticsData(data);
        }
    }
    
    function trackPageView(pageName) {
        const data = getAnalyticsData();
        
        if (!data.pages.views[pageName]) {
            data.pages.views[pageName] = {
                name: pageName,
                count: 0,
                lastViewed: null
            };
        }
        
        data.pages.views[pageName].count++;
        data.pages.views[pageName].lastViewed = Date.now();
        
        saveAnalyticsData(data);
    }
    
    // ========== TRACKING DE PERFORMANCE ==========
    
    function trackLoadTime(loadTime) {
        const data = getAnalyticsData();
        
        data.performance.loadTimes.push({
            time: loadTime,
            timestamp: Date.now()
        });
        
        // Mantener solo los últimos 100 registros
        if (data.performance.loadTimes.length > 100) {
            data.performance.loadTimes = data.performance.loadTimes.slice(-100);
        }
        
        saveAnalyticsData(data);
    }
    
    // ========== OBTENER ESTADÍSTICAS ==========
    
    function getTopProducts(limit = 10) {
        const data = getAnalyticsData();
        const products = Object.values(data.products.views);
        
        return products
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    
    function getTopSearches(limit = 10) {
        const data = getAnalyticsData();
        const searches = Object.values(data.searches.terms);
        
        return searches
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    
    function getTopPlatforms(limit = 10) {
        const data = getAnalyticsData();
        const platforms = Object.values(data.searches.platforms);
        
        return platforms
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    
    function getInteractionStats() {
        const data = getAnalyticsData();
        return data.interactions;
    }
    
    function getSessionStats() {
        const data = getAnalyticsData();
        const sessions = data.sessions;
        
        return {
            total: sessions.length,
            avgDuration: calculateAvgSessionDuration(sessions),
            totalPageViews: sessions.reduce((sum, s) => sum + s.pageViews, 0)
        };
    }
    
    function getPerformanceStats() {
        const data = getAnalyticsData();
        const loadTimes = data.performance.loadTimes;
        
        if (loadTimes.length === 0) return null;
        
        const times = loadTimes.map(lt => lt.time);
        return {
            avg: times.reduce((a, b) => a + b, 0) / times.length,
            min: Math.min(...times),
            max: Math.max(...times),
            count: times.length
        };
    }
    
    function getAllStats() {
        return {
            topProducts: getTopProducts(10),
            topSearches: getTopSearches(10),
            topPlatforms: getTopPlatforms(10),
            interactions: getInteractionStats(),
            sessions: getSessionStats(),
            performance: getPerformanceStats()
        };
    }
    
    // ========== EXPORTAR DATOS ==========
    
    function exportData() {
        const data = getAnalyticsData();
        const stats = getAllStats();
        
        const exportData = {
            exportDate: new Date().toISOString(),
            version: CONFIG.VERSION,
            summary: stats,
            rawData: data
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    function downloadStats() {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ropavejero-analytics-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // ========== LIMPIEZA DE DATOS ==========
    
    function cleanupOldData() {
        const data = getAnalyticsData();
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        
        // Limpiar solo una vez al día
        if (now - data.lastCleanup < 24 * 60 * 60 * 1000) {
            return;
        }
        
        // Limpiar sesiones antiguas (más de 30 días)
        data.sessions = data.sessions.filter(s => s.startTime > thirtyDaysAgo);
        
        // Limpiar búsquedas antiguas
        Object.keys(data.searches.terms).forEach(term => {
            if (data.searches.terms[term].lastSearched < thirtyDaysAgo) {
                delete data.searches.terms[term];
            }
        });
        
        data.lastCleanup = now;
        saveAnalyticsData(data);
        
        console.log('🧹 Analytics: Datos antiguos limpiados');
    }
    
    function clearAllData() {
        if (confirm('¿Estás seguro de que quieres borrar todas las estadísticas?')) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            init();
            console.log('🗑️ Analytics: Todos los datos borrados');
            return true;
        }
        return false;
    }
    
    // ========== UTILIDADES ==========
    
    function getAnalyticsData() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error leyendo analytics:', error);
            return null;
        }
    }
    
    function saveAnalyticsData(data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error guardando analytics:', error);
        }
    }
    
    function calculateAvgSessionDuration(sessions) {
        const durations = sessions
            .filter(s => s.endTime)
            .map(s => s.endTime - s.startTime);
        
        if (durations.length === 0) return 0;
        
        return durations.reduce((a, b) => a + b, 0) / durations.length;
    }
    
    // ========== API PÚBLICA ==========
    
    return {
        init,
        trackProductView,
        trackProductClick,
        trackSearch,
        trackPlatformFilter,
        trackInteraction,
        trackPageView,
        trackLoadTime,
        getTopProducts,
        getTopSearches,
        getTopPlatforms,
        getInteractionStats,
        getSessionStats,
        getPerformanceStats,
        getAllStats,
        exportData,
        downloadStats,
        clearAllData
    };
})();

// Hacer disponible globalmente
window.RopavejeroAnalytics = RopavejeroAnalytics;
