# 🔒 Guía de Seguridad - Ropavejero Retro

> **Nota de vigencia (octubre 2026):** este documento es de enero de 2026 y describe en parte una configuración que ya no existe. Estado real:
> - **Headers de seguridad: activos desde el 2026-10-12**, mediante una regla de Cloudflare ("Headers de seguridad"), no desde el repositorio: `Strict-Transport-Security: max-age=15552000` (6 meses, sin `includeSubDomains` ni `preload`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`. Los demás headers que este documento lista más abajo (de la época de `.htaccess`) no se envían.
> - **CSP: sí está activa**, mediante `<meta http-equiv="Content-Security-Policy">` en `index.html`, `productos.html`, `404.html`, `old.html` y las dos páginas de seguridad. `ps3.html` no lleva CSP porque solo redirige a un sitio externo. Una CSP por `<meta>` no puede declarar `frame-ancestors`, así que la protección contra clickjacking depende de los headers de Cloudflare.
> - La CSP incluye además los dominios de Google Tag Manager y Google Analytics; el valor actual es el de los HTML, no el copiado más abajo. Las funciones citadas viven hoy en `js/modules/utils.js`.

## 📋 Resumen de Implementaciones de Seguridad

### ✅ Medidas Implementadas

#### 🛡️ **Protección contra XSS (Cross-Site Scripting)**
- ✅ Función `sanitizeHTML()` para limpiar contenido HTML
- ✅ Validación de datos de entrada en formularios
- ✅ Uso de `textContent` en lugar de `innerHTML` cuando es posible
- ✅ Content Security Policy (CSP) implementado

#### 🔐 **Validación y Sanitización de URLs**
- ✅ Función `sanitizeURL()` con lista blanca de dominios
- ✅ Validación de protocolos (solo HTTPS/HTTP)
- ✅ Apertura segura de enlaces externos con `noopener,noreferrer`

#### 🛡️ **Headers de Seguridad**
- ✅ Content Security Policy (CSP)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Strict-Transport-Security (HSTS)
- ✅ Permissions-Policy

#### 🔒 **Protección de Datos**
- ✅ Función `validateProductData()` para validar datos de productos
- ✅ Manejo seguro de errores con `handleSecureError()`
- ✅ Timeouts en requests para prevenir ataques de denegación de servicio
- ✅ Validación de estructura de datos JSON

#### 🚫 **Protección de Archivos Sensibles**
- ✅ Bloqueo de acceso a archivos de configuración
- ✅ Protección de directorios de control de versiones
- ✅ Ocultación de información del servidor
- ✅ Páginas de error personalizadas

#### 📝 **Divulgación Responsable**
- ✅ Archivo security.txt en /.well-known/security.txt
- ✅ Política de seguridad pública
- ✅ Página de agradecimientos de seguridad
- ✅ Clave PGP para comunicación segura

### 🔧 **Configuraciones Técnicas**

#### **Content Security Policy (CSP)**
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://docs.google.com https://static.cloudflareinsights.com https://cloudflareinsights.com; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
img-src 'self' data: https: blob:; 
connect-src 'self' https://docs.google.com https://cloudflareinsights.com https://static.cloudflareinsights.com; 
frame-src 'none'; 
object-src 'none'; 
base-uri 'self'; 
form-action 'self'; 
upgrade-insecure-requests
```

#### **Dominios Permitidos (Lista Blanca)**
- instagram.com
- facebook.com
- tiktok.com
- youtube.com
- twitter.com
- threads.net
- wa.me
- docs.google.com
- ropavejeroretro.cl
- static.cloudflareinsights.com (Cloudflare Analytics)
- cloudflareinsights.com (Cloudflare Analytics)

### 🚨 **Funciones de Seguridad Implementadas**

#### **sanitizeHTML(str)**
Limpia contenido HTML para prevenir XSS:
```javascript
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
```

#### **sanitizeURL(url)**
Valida y sanitiza URLs con lista blanca de dominios:
```javascript
function sanitizeURL(url) {
    // Validación de protocolo y dominio
    // Lista blanca de dominios permitidos
    // Retorna '#' si la URL no es segura
}
```

#### **validateProductData(product)**
Valida y sanitiza datos de productos:
```javascript
function validateProductData(product) {
    // Validación de tipos de datos
    // Sanitización de strings
    // Conversión segura de números
}
```

#### **handleSecureError(error, context)**
Manejo seguro de errores sin exponer información sensible:
```javascript
function handleSecureError(error, context) {
    // Log interno para debugging
    // Mensaje genérico para el usuario
    // Sin exposición de stack traces
}
```

### 📊 **Métricas de Seguridad**

- **Vulnerabilidades XSS:** ✅ Mitigadas
- **Inyección de código:** ✅ Prevenida
- **Exposición de datos:** ✅ Controlada
- **Headers de seguridad:** ⚠️ No activos (ver nota de vigencia al inicio)
- **HTTPS:** ✅ Forzado
- **CSP:** ✅ Configurado

### 🔄 **Mantenimiento de Seguridad**

#### **Revisiones Regulares**
- [ ] Revisar y actualizar CSP mensualmente
- [ ] Auditar logs de seguridad semanalmente
- [ ] Actualizar lista blanca de dominios según necesidad
- [ ] Revisar y actualizar dependencias trimestralmente

#### **Monitoreo**
- [ ] Configurar alertas para intentos de XSS
- [ ] Monitorear requests sospechosos
- [ ] Revisar headers de seguridad regularmente
- [ ] Auditar accesos a archivos sensibles

### 📞 **Contacto de Seguridad**

- **Email:** contacto@ropavejeroretro.cl
- **Asunto:** [SEGURIDAD] Reporte de Vulnerabilidad
- **PGP:** Disponible en /pgp-key.txt
- **Política:** /security-policy.html
- **Agradecimientos:** /security-acknowledgments.html

### 🎯 **Próximas Mejoras**

1. **Implementar Rate Limiting** para prevenir ataques de fuerza bruta
2. **Agregar logging de seguridad** más detallado
3. **Implementar CAPTCHA** en formularios críticos
4. **Configurar Web Application Firewall (WAF)**
5. **Implementar Content Integrity** para recursos externos

---

**Última actualización:** 22 de enero de 2026  
**Versión:** 1.0  
**Responsable:** Equipo de Desarrollo Ropavejero Retro