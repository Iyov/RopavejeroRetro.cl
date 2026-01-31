# 🚀 Configuración Simple con Variables de Entorno

## ✨ ¡Súper fácil y seguro!

### 🎯 Opción 1: Usar tal como está (Recomendado)
- **No hagas nada**
- El sitio funciona perfectamente con datos de ejemplo
- Los posts de Instagram simulados se ven geniales

### 🎯 Opción 2: Conectar tu Instagram real

#### Paso 1: Configurar variables de entorno
1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env.development
   ```

2. **Edita `.env.development` con tus credenciales:**
   ```bash
   INSTAGRAM_ACCESS_TOKEN=tu_token_real_aqui
   INSTAGRAM_USER_ID=tu_user_id_real_aqui
   DEBUG_MODE=true
   ```

#### Paso 2: Generar archivo de configuración
**En Windows:**
```cmd
generate-env.bat development
```

**En Linux/Mac:**
```bash
./generate-env.sh development
```

**O manualmente:**
```bash
cp env.example.js env.js
# Luego edita env.js con tus credenciales
```

#### Paso 3: ¡Listo!
- El sitio usará automáticamente tus credenciales reales
- Las credenciales están seguras (no se suben a GitHub)

## 🔒 ¿Por qué es seguro?

### ✅ Archivos protegidos (NO se suben a GitHub):
- `.env.development` - Tus credenciales de desarrollo
- `.env.production` - Tus credenciales de producción  
- `env.js` - Archivo generado con credenciales

### ✅ Archivos en el repositorio (seguros):
- `instagram-config.js` - Lógica de configuración (sin credenciales)
- `.env.example` - Plantilla sin credenciales reales
- `env.example.js` - Ejemplo de configuración

## 🛠️ Archivos importantes

- **`.env.development`** - Configura aquí tus credenciales de desarrollo
- **`.env.production`** - Configura aquí tus credenciales de producción
- **`generate-env.bat`** - Script para Windows
- **`generate-env.sh`** - Script para Linux/Mac
- **`env.example.js`** - Para configuración manual

## 🔑 ¿Cómo obtener las credenciales?

1. Ve a https://developers.facebook.com/
2. Crea una nueva aplicación
3. Agrega "Instagram Basic Display"
4. Copia tu **Access Token** y **User ID**
5. Pégalos en `.env.development`

## 🆘 ¿Problemas?

### El sitio no carga posts de Instagram:
- **Verifica**: Que hayas ejecutado `generate-env.bat` o `generate-env.sh`
- **Verifica**: Que el archivo `env.js` exista
- **Normal**: Si no hay credenciales, usa datos simulados automáticamente

### ¿Cómo sé si funciona?
- Abre la consola del navegador (F12)
- Busca mensajes como "Instagram Config: hasToken: true"
- Si ves "hasToken: false", está usando datos simulados

## 🚀 Para Producción

1. **Configura `.env.production`** con credenciales reales
2. **Ejecuta:** `generate-env.bat production`
3. **Sube `env.js`** generado a tu servidor
4. **¡Listo!** Tu sitio usará credenciales reales

## 🎉 Resumen

1. **Sin configuración**: Funciona con datos simulados
2. **Con configuración**: Edita `.env.development` y ejecuta el script
3. **Seguro**: Las credenciales nunca se suben a GitHub
4. **Fácil**: Solo un comando para generar la configuración

---

**💡 Tip: Los archivos `.env*` y `env.js` están protegidos por `.gitignore`. ¡Tus credenciales están seguras!**