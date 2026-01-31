// ========== CONFIGURACIÓN DE INSTAGRAM API CON VARIABLES DE ENTORNO ==========
// Este archivo usa variables de entorno para mantener las credenciales seguras

// Función para obtener variables de entorno
function getEnvVar(name, defaultValue = '') {
    // En un entorno real con servidor, estas variables vendrían del backend
    // Por ahora simulamos la carga desde variables de entorno
    
    // Intentar obtener desde window.ENV (inyectado por el servidor)
    if (window.ENV && window.ENV[name]) {
        return window.ENV[name];
    }
    
    // Valores por defecto para desarrollo (sin credenciales reales)
    const envDefaults = {
        'INSTAGRAM_ACCESS_TOKEN': '',
        'INSTAGRAM_USER_ID': '',
        'DEBUG_MODE': 'false'
    };
    
    return envDefaults[name] || defaultValue;
}

// Configuración de Instagram usando variables de entorno
window.INSTAGRAM_API_CONFIG = {
    // 🔑 CREDENCIALES (vienen de variables de entorno)
    ACCESS_TOKEN: getEnvVar('INSTAGRAM_ACCESS_TOKEN'),
    USER_ID: getEnvVar('INSTAGRAM_USER_ID'),
    
    // ⚙️ CONFIGURACIÓN (valores fijos seguros)
    CACHE_DURATION: 30 * 60 * 1000,       // 30 minutos de caché
    MAX_POSTS: 6,                          // Máximo 6 posts
    FALLBACK_ENABLED: true,                // Usar datos simulados si falla
    API_BASE_URL: 'https://graph.instagram.com'
};

// Debug en desarrollo
if (getEnvVar('DEBUG_MODE') === 'true') {
    console.log('🔧 Instagram Config:', {
        hasToken: !!window.INSTAGRAM_API_CONFIG.ACCESS_TOKEN,
        hasUserId: !!window.INSTAGRAM_API_CONFIG.USER_ID,
        fallbackEnabled: window.INSTAGRAM_API_CONFIG.FALLBACK_ENABLED
    });
}

// ========== INYECCIÓN DE VARIABLES DE ENTORNO ==========
// En producción, el servidor debe inyectar las variables así:
/*
<script>
window.ENV = {
    INSTAGRAM_ACCESS_TOKEN: '<?php echo $_ENV["INSTAGRAM_ACCESS_TOKEN"]; ?>',
    INSTAGRAM_USER_ID: '<?php echo $_ENV["INSTAGRAM_USER_ID"]; ?>',
    DEBUG_MODE: '<?php echo $_ENV["DEBUG_MODE"]; ?>'
};
</script>
*/

// O para hosting estático, crear un archivo env.js en build time:
/*
// env.js (generado automáticamente)
window.ENV = {
    INSTAGRAM_ACCESS_TOKEN: 'valor_real_del_servidor',
    INSTAGRAM_USER_ID: 'valor_real_del_servidor',
    DEBUG_MODE: 'false'
};
*/