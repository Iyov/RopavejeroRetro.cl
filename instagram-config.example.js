// ========== CONFIGURACIÓN DE INSTAGRAM API ==========
// Copia este archivo como 'instagram-config.js' y configura tus credenciales

// PASO 1: Crear una aplicación en Facebook Developers
// 1. Ve a https://developers.facebook.com/
// 2. Crea una nueva aplicación
// 3. Agrega el producto "Instagram Basic Display"

// PASO 2: Configurar Instagram Basic Display
// 1. En Instagram Basic Display, configura:
//    - Valid OAuth Redirect URIs: https://ropavejeroretro.cl/auth/instagram
//    - Deauthorize Callback URL: https://ropavejeroretro.cl/auth/instagram/deauth
//    - Data Deletion Request URL: https://ropavejeroretro.cl/auth/instagram/delete

// PASO 3: Obtener Access Token
// 1. Sigue la documentación de Instagram Basic Display API
// 2. Obtén un Long-Lived Access Token (válido por 60 días)
// 3. Configura un sistema para renovar automáticamente el token

// PASO 4: Configurar las credenciales aquí
window.INSTAGRAM_API_CONFIG = {
    // Tu Access Token de Instagram (Long-Lived)
    ACCESS_TOKEN: 'TU_ACCESS_TOKEN_AQUI',
    
    // Tu User ID de Instagram
    USER_ID: 'TU_USER_ID_AQUI',
    
    // Configuración de caché (en milisegundos)
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutos
    
    // Número máximo de posts a mostrar
    MAX_POSTS: 6,
    
    // Habilitar fallback a datos simulados si la API falla
    FALLBACK_ENABLED: true,
    
    // URL base de la API
    API_BASE_URL: 'https://graph.instagram.com'
};

// PASO 5: Incluir este archivo en tu HTML
// <script src="instagram-config.js"></script>
// (antes de cargar index.js)

// NOTAS DE SEGURIDAD:
// - El Access Token es sensible, manténlo seguro
// - Considera usar variables de entorno en producción
// - Los tokens expiran cada 60 días y deben renovarse
// - Nunca subas este archivo con credenciales reales a repositorios públicos

// RENOVACIÓN AUTOMÁTICA DE TOKENS:
// Para renovar automáticamente los tokens, puedes crear un endpoint en tu servidor:
// GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={access-token}

// EJEMPLO DE RESPUESTA DE LA API:
/*
{
  "data": [
    {
      "id": "17841405309211844",
      "caption": "Descripción del post...",
      "media_type": "IMAGE",
      "media_url": "https://scontent.cdninstagram.com/...",
      "permalink": "https://www.instagram.com/p/ABC123/",
      "timestamp": "2024-01-15T10:30:00+0000"
    }
  ],
  "paging": {
    "cursors": {
      "before": "QVFIUmx1WTBpMGpRL...",
      "after": "QVFIUjBpNHlkUXlON..."
    }
  }
}
*/