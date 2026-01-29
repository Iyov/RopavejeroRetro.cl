# 📸 Configuración de Instagram API para Ropavejero Retro

Esta guía te ayudará a configurar la conexión real a Instagram para cargar automáticamente los posts de @Ropavejero.Retro en tu sitio web.

## 🚀 Configuración Rápida

### Paso 1: Crear Aplicación en Facebook Developers

1. **Ve a [Facebook Developers](https://developers.facebook.com/)**
2. **Crea una nueva aplicación:**
   - Tipo: "Consumidor"
   - Nombre: "Ropavejero Retro Website"
   - Email de contacto: tu email

3. **Agrega el producto "Instagram Basic Display"**

### Paso 2: Configurar Instagram Basic Display

1. **En el panel de Instagram Basic Display, configura:**
   - **Valid OAuth Redirect URIs:** `https://ropavejeroretro.cl/auth/instagram`
   - **Deauthorize Callback URL:** `https://ropavejeroretro.cl/auth/instagram/deauth`
   - **Data Deletion Request URL:** `https://ropavejeroretro.cl/auth/instagram/delete`

2. **Copia tu Instagram App ID y Instagram App Secret**

### Paso 3: Obtener Access Token

#### Opción A: Usando la herramienta de Facebook (Recomendado)

1. **Ve a Graph API Explorer:**
   - URL: https://developers.facebook.com/tools/explorer/
   - Selecciona tu aplicación
   - Genera un User Access Token con permisos `instagram_graph_user_profile,instagram_graph_user_media`

2. **Convierte a Long-Lived Token:**
   ```bash
   curl -i -X GET "https://graph.instagram.com/access_token
     ?grant_type=ig_exchange_token
     &client_secret={instagram-app-secret}
     &access_token={short-lived-access-token}"
   ```

#### Opción B: Flujo de autorización manual

1. **URL de autorización:**
   ```
   https://api.instagram.com/oauth/authorize
     ?client_id={instagram-app-id}
     &redirect_uri=https://ropavejeroretro.cl/auth/instagram
     &scope=user_profile,user_media
     &response_type=code
   ```

2. **Intercambiar código por token:**
   ```bash
   curl -X POST https://api.instagram.com/oauth/access_token \
     -F client_id={instagram-app-id} \
     -F client_secret={instagram-app-secret} \
     -F grant_type=authorization_code \
     -F redirect_uri=https://ropavejeroretro.cl/auth/instagram \
     -F code={authorization-code}
   ```

### Paso 4: Configurar el Sitio Web

1. **Copia el archivo de configuración:**
   ```bash
   cp instagram-config.example.js instagram-config.js
   ```

2. **Edita `instagram-config.js` con tus credenciales:**
   ```javascript
   window.INSTAGRAM_API_CONFIG = {
       ACCESS_TOKEN: 'TU_ACCESS_TOKEN_AQUI',
       USER_ID: 'TU_USER_ID_AQUI',
       CACHE_DURATION: 30 * 60 * 1000, // 30 minutos
       MAX_POSTS: 6,
       FALLBACK_ENABLED: true
   };
   ```

3. **Descomenta la línea en `index.html`:**
   ```html
   <script src="instagram-config.js"></script>
   ```

## 🔧 Configuración Avanzada

### Renovación Automática de Tokens

Los tokens de Instagram expiran cada 60 días. Para renovarlos automáticamente:

```javascript
// Función para renovar token (ejecutar cada 30 días)
async function refreshInstagramToken() {
    const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
    );
    const data = await response.json();
    return data.access_token;
}
```

### Variables de Entorno (Producción)

Para mayor seguridad en producción, usa variables de entorno:

```javascript
// En tu servidor (Node.js ejemplo)
const INSTAGRAM_CONFIG = {
    ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    USER_ID: process.env.INSTAGRAM_USER_ID
};
```

### Proxy Server (Recomendado para Producción)

Crea un endpoint en tu servidor para hacer las llamadas a Instagram:

```php
<?php
// api/instagram.php
$accessToken = $_ENV['INSTAGRAM_ACCESS_TOKEN'];
$userId = $_ENV['INSTAGRAM_USER_ID'];

$url = "https://graph.instagram.com/{$userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=6&access_token={$accessToken}";

$response = file_get_contents($url);
header('Content-Type: application/json');
echo $response;
?>
```

## 🧪 Testing y Debugging

### Verificar Configuración

1. **Abre la consola del navegador**
2. **Busca estos mensajes:**
   ```
   📦 Cargando posts de Instagram desde caché
   🔄 Cargando posts desde Instagram API
   📋 Usando datos simulados de Instagram
   ```

### Comandos de Debug

```javascript
// En la consola del navegador:

// Limpiar caché de Instagram
clearInstagramCache();

// Ver configuración actual
console.log(INSTAGRAM_CONFIG);

// Probar carga manual
loadInstagramPosts();
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Invalid access token` | Token expirado o incorrecto | Renovar token |
| `User does not exist` | USER_ID incorrecto | Verificar USER_ID |
| `CORS error` | Llamada directa desde navegador | Usar proxy server |
| `Rate limit exceeded` | Demasiadas llamadas | Aumentar CACHE_DURATION |

## 📊 Monitoreo

### Métricas a Monitorear

- **Cache Hit Rate:** % de cargas desde caché vs API
- **API Response Time:** Tiempo de respuesta de Instagram
- **Error Rate:** % de errores en llamadas API
- **Token Expiry:** Días restantes del token

### Logs Útiles

```javascript
// Agregar al código para monitoreo
console.log('Instagram API Status:', {
    hasToken: !!INSTAGRAM_CONFIG.ACCESS_TOKEN,
    hasUserId: !!INSTAGRAM_CONFIG.USER_ID,
    cacheAge: getCacheAge(),
    lastError: getLastError()
});
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE: Información Sensible

**NUNCA subas `instagram-config.js` con credenciales reales al repositorio público.**

El archivo `instagram-config.js` está incluido en `.gitignore` para proteger tus credenciales. Para más información sobre seguridad, consulta: [INSTAGRAM-SETUP-SECURITY.md](INSTAGRAM-SETUP-SECURITY.md)

### Mejores Prácticas

1. **Nunca expongas tokens en el frontend**
2. **Usa HTTPS siempre**
3. **Implementa rate limiting**
4. **Monitorea el uso de la API**
5. **Rota tokens regularmente**
6. **Verifica que .gitignore funcione correctamente**

### Verificación de Seguridad

```bash
# Verificar que instagram-config.js no está rastreado
git status --ignored | grep instagram-config.js

# El archivo NO debe aparecer en git status
git status
```

### Configuración de Producción

```javascript
// Configuración segura para producción
const INSTAGRAM_CONFIG = {
    ACCESS_TOKEN: '', // Vacío en frontend
    API_ENDPOINT: '/api/instagram', // Tu endpoint proxy
    CACHE_DURATION: 60 * 60 * 1000, // 1 hora
    FALLBACK_ENABLED: true
};
```

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Revisa los logs de la consola**
2. **Verifica que el token no haya expirado**
3. **Confirma que el USER_ID sea correcto**
4. **Prueba con datos simulados primero**

## 🎯 Resultado Final

Una vez configurado correctamente, tu sitio web:

- ✅ Cargará automáticamente los posts reales de @Ropavejero.Retro
- ✅ Usará caché inteligente para mejor rendimiento
- ✅ Tendrá fallback a datos simulados si hay problemas
- ✅ Mostrará indicadores de video para posts de video
- ✅ Incluirá fechas relativas de los posts
- ✅ Será completamente responsivo en móviles

¡Tu sección de Instagram estará completamente funcional y conectada a tu cuenta real!