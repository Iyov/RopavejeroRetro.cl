# 🔐 Configuración Segura de Instagram API

## ⚠️ IMPORTANTE: Seguridad de Credenciales

Este proyecto utiliza la Instagram Basic Display API para mostrar posts en tiempo real. Las credenciales de API son **información sensible** y deben manejarse con cuidado.

## 🚀 Configuración Inicial

### 1. Copiar el Archivo de Configuración
```bash
cp instagram-config.example.js instagram-config.js
```

### 2. Configurar Credenciales
Edita `instagram-config.js` y reemplaza los placeholders:
- `TU_ACCESS_TOKEN_AQUI` → Tu token de acceso real
- `TU_USER_ID_AQUI` → Tu ID de usuario de Instagram

### 3. Verificar .gitignore
El archivo `instagram-config.js` debe estar listado en `.gitignore` para evitar subir credenciales al repositorio.

## 🔒 Archivos Protegidos por .gitignore

Los siguientes archivos están excluidos del control de versiones por seguridad:

### Configuraciones de API
- `instagram-config.js` - Credenciales de Instagram API
- `*-config.js` - Cualquier archivo de configuración con credenciales
- `.env*` - Variables de entorno

### Información Sensible
- `*.key`, `*.pem`, `*.crt` - Certificados y claves
- `credentials.js`, `secrets.js` - Archivos de credenciales
- `*.sql`, `*.db` - Backups de base de datos

## 🛡️ Mejores Prácticas de Seguridad

### ✅ Hacer
- Usar el archivo `.example` como plantilla
- Mantener credenciales en archivos locales no rastreados
- Renovar tokens regularmente (cada 60 días)
- Usar HTTPS en producción
- Verificar que `.gitignore` funcione correctamente

### ❌ No Hacer
- Subir credenciales reales al repositorio
- Compartir tokens de acceso públicamente
- Hardcodear credenciales en el código
- Usar tokens en URLs o logs
- Ignorar las fechas de expiración

## 🔄 Renovación de Tokens

Los tokens de Instagram expiran cada 60 días. Para renovarlos:

```javascript
// Endpoint para renovar token
GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={tu-token}
```

## 🚨 En Caso de Compromiso

Si sospechas que tus credenciales han sido comprometidas:

1. **Revoca inmediatamente** el token en Facebook Developers
2. **Genera nuevas credenciales**
3. **Actualiza** `instagram-config.js`
4. **Verifica** que no hay credenciales en el historial de Git
5. **Considera** cambiar las URLs de callback

## 📋 Verificación de Seguridad

Ejecuta estos comandos para verificar que todo está configurado correctamente:

```bash
# Verificar que instagram-config.js no está rastreado
git status --ignored | grep instagram-config.js

# Verificar que .gitignore funciona
echo "test-secret" > instagram-config.js
git status  # No debería aparecer el archivo

# Limpiar archivo de prueba
rm instagram-config.js
```

## 🆘 Soporte

Si tienes problemas con la configuración:

1. Revisa la [documentación oficial de Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
2. Verifica que todas las URLs de callback estén configuradas correctamente
3. Asegúrate de que el token no haya expirado
4. Consulta los logs del navegador para errores específicos

## 📝 Notas Adicionales

- El sitio funciona sin configuración de API usando datos simulados
- La configuración de API es opcional pero recomendada para datos en tiempo real
- Los datos simulados se usan automáticamente si la API falla
- Todos los errores de API se manejan de forma silenciosa para el usuario final

---

**🔐 Recuerda: La seguridad es responsabilidad de todos. Mantén tus credenciales seguras.**