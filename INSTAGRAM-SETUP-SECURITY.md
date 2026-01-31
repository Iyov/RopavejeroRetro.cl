# 🔐 Configuración Simple y Segura

## 📝 Instrucciones Fáciles

### 1. Configurar Instagram (Opcional)
Si quieres mostrar tus posts reales de Instagram:

1. **Abre el archivo `instagram-config.js`**
2. **Reemplaza estos valores:**
   ```javascript
   ACCESS_TOKEN: 'tu_access_token_aqui',  // ← Pon tu token real aquí
   USER_ID: 'tu_user_id_aqui',            // ← Pon tu user ID real aquí
   ```
3. **Guarda el archivo**
4. **¡Listo!** El sitio usará tus posts reales

### 2. Si NO tienes credenciales
- **No hagas nada**, el sitio funciona perfectamente con datos simulados
- Los posts de ejemplo se ven igual de bien

## 🔑 ¿Cómo obtener las credenciales?

### Paso 1: Crear App en Facebook
1. Ve a https://developers.facebook.com/
2. Crea una nueva aplicación
3. Agrega "Instagram Basic Display"

### Paso 2: Obtener credenciales
1. Copia tu **Access Token**
2. Copia tu **User ID**
3. Pégalos en `instagram-config.js`

## 🛡️ Seguridad Simple

### ✅ Qué hacer:
- Configurar credenciales en `instagram-config.js`
- Mantener el archivo seguro
- No compartir tus tokens

### ❌ Qué NO hacer:
- No subir credenciales reales a GitHub público
- No compartir tu Access Token

## 🚨 Si algo sale mal:
1. **Revisa la consola del navegador** (F12)
2. **Verifica que las credenciales sean correctas**
3. **Si no funciona, el sitio usará datos simulados automáticamente**

## 📞 ¿Necesitas ayuda?
- El sitio funciona sin configuración adicional
- Los datos simulados se ven igual de bien
- Solo configura Instagram si quieres datos reales

---

**🎯 Resumen: Configura `instagram-config.js` si quieres datos reales, o déjalo como está para usar datos simulados. ¡Ambas opciones funcionan perfectamente!**