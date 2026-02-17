# 🔄 Actualización de Versión de Caché - v1.0.7

## Fecha
Febrero 17, 2026

## Versión Actualizada
- **Service Worker Cache**: `ropavejero-v1.0.7` (anteriormente v1.0.6)
- **Assets Version Query String**: `?v=2026-02-17_1` (anteriormente `?v=2026-02-16_9`)

---

## 📊 Cambios en Versiones de Caché

### Service Worker (service-worker.js)
```javascript
// Antes
const CACHE_VERSION = 'ropavejero-v1.0.6';

// Después
const CACHE_VERSION = 'ropavejero-v1.0.7';
```

**Estado**: ✅ Ya actualizado

---

### Query Strings en index.html

#### CSS
```html
<!-- Antes -->
<link rel="preload" href="css/index.min.css?v=2026-02-16_9" as="style">

<!-- Después -->
<link rel="preload" href="css/index.min.css?v=2026-02-17_1" as="style">
```

#### JavaScript Principal
```html
<!-- Antes -->
<script src="js/index.min.js?v=2026-02-16_9" defer></script>

<!-- Después -->
<script src="js/index.min.js?v=2026-02-17_1" defer></script>
```

#### JavaScript Instagram Posts
```javascript
// Antes
s.src = 'js/instagram_posts.min.js?v=2026-02-16_9';

// Después
s.src = 'js/instagram_posts.min.js?v=2026-02-17_1';
```

**Estado**: ✅ Actualizado

---

### Query Strings en old.html

#### JavaScript App
```html
<!-- Antes -->
<script src="js/app.min.js?v=2026-02-16_5"></script>

<!-- Después -->
<script src="js/app.min.js?v=2026-02-17_1"></script>
```

**Estado**: ✅ Actualizado

---

## 📁 Archivos Modificados

```
✏️ service-worker.js
   - CACHE_VERSION: ropavejero-v1.0.6 → ropavejero-v1.0.7

✏️ index.html
   - css/index.min.css: ?v=2026-02-16_9 → ?v=2026-02-17_1
   - js/index.min.js: ?v=2026-02-16_9 → ?v=2026-02-17_1
   - js/instagram_posts.min.js: ?v=2026-02-16_9 → ?v=2026-02-17_1

✏️ old.html
   - js/app.min.js: ?v=2026-02-16_5 → ?v=2026-02-17_1
```

---

## 🎯 Propósito de la Actualización

Esta actualización de versión de caché es parte de la release v1.0.7 que incluye:

1. ✅ Mejoras de SEO e indexación
2. ✅ Footer actualizado con enlaces internos
3. ✅ Sitemap.xml con 8 URLs
4. ✅ Robots.txt optimizado
5. ✅ Meta tags actualizados
6. ✅ Traducciones ES/EN agregadas

---

## 🔄 Comportamiento Esperado

### Primera Carga (Usuarios Nuevos)
1. Service Worker se registra con versión v1.0.7
2. Event `install` cachea todos los assets
3. Assets se cargan con query string `?v=2026-02-17_1`
4. Caché offline disponible inmediatamente

### Actualización (Usuarios Existentes)
1. Service Worker detecta nueva versión v1.0.7 ≠ v1.0.6
2. Event `install` descarga nueva versión
3. Query strings fuerzan recarga de CSS/JS
4. Event `activate` elimina cachés antiguos (v1.0.6)
5. Próxima navegación usa nuevo caché

---

## 📊 Assets Cacheados

| Categoría | Archivos | Descripción |
|-----------|----------|-------------|
| HTML | 2 | index.html, old.html |
| CSS | 2 | index.min.css, font-awesome |
| JavaScript | 3 | index.min.js, instagram_posts.min.js, app.min.js |
| Imágenes Hero | 7 | WebP + JPG responsive |
| Logos | 4 | PNG varios tamaños |
| Otros | 2 | favicon.png, manifest.json |
| **Total** | **20** | **Recursos estáticos** |

---

## 🚀 Impacto de Performance

### Cache Busting
- ✅ Navegadores descargarán nuevas versiones automáticamente
- ✅ No se usarán versiones cacheadas antiguas
- ✅ Usuarios obtienen cambios inmediatamente

### Service Worker
- ✅ Caché offline actualizado con nueva versión
- ✅ Eliminación automática de cachés antiguos
- ✅ Sin intervención manual requerida

---

## 📝 Formato de Versionado

### Service Worker
```
ropavejero-v{MAJOR}.{MINOR}.{PATCH}
```

Ejemplo: `ropavejero-v1.0.7`

### Query Strings
```
?v={YYYY}-{MM}-{DD}_{CHANGE_NUMBER}
```

Ejemplo: `?v=2026-02-17_1`

Donde:
- `YYYY-MM-DD`: Fecha del cambio
- `CHANGE_NUMBER`: Número secuencial de cambios en el día (1, 2, 3...)

---

## ✅ Verificación Post-Deploy

### 1. Verificar Service Worker
```javascript
// En DevTools > Application > Service Workers
// Debería mostrar: ropavejero-v1.0.7
```

### 2. Verificar Query Strings
```bash
# Verificar en el HTML
curl https://ropavejeroretro.cl/ | grep "v=2026-02-17_1"
```

### 3. Verificar Cache
```javascript
// En DevTools > Application > Cache Storage
// Debería mostrar: ropavejero-v1.0.7-static
```

### 4. Verificar Recursos
```javascript
// En DevTools > Network
// Todos los recursos deberían tener ?v=2026-02-17_1
```

---

## 🔍 Troubleshooting

### Problema: Service Worker no se actualiza

**Solución**:
```javascript
// En DevTools > Application > Service Workers
// Clic en "Unregister" y recargar página
```

### Problema: Recursos cacheados antiguos

**Solución**:
```javascript
// En DevTools > Application > Clear storage
// Marcar "Cache storage" y "Service Workers"
// Clic en "Clear site data"
```

### Problema: Query strings no actualizados

**Solución**:
```bash
# Verificar que los archivos fueron actualizados
git diff HEAD~1 index.html
git diff HEAD~1 old.html
```

---

## 📋 Checklist de Actualización

### Pre-Deploy
- [x] Service Worker actualizado a v1.0.7
- [x] Query strings actualizados a v=2026-02-17_1
- [x] index.html actualizado (3 referencias)
- [x] old.html actualizado (1 referencia)
- [x] Documentación creada

### Post-Deploy
- [ ] Verificar Service Worker en producción
- [ ] Verificar query strings en Network tab
- [ ] Verificar cache storage
- [ ] Probar en navegador incógnito
- [ ] Verificar que recursos se descargan correctamente

---

## 🎉 Conclusión

La versión de caché ha sido actualizada correctamente de v1.0.6 a v1.0.7, con query strings actualizados de `2026-02-16_9` a `2026-02-17_1`.

Esto asegura que:
- ✅ Los usuarios obtengan la versión más reciente
- ✅ El caché se invalide correctamente
- ✅ Los cambios de SEO se apliquen inmediatamente
- ✅ No haya problemas de caché antiguo

**Estado**: ✅ Listo para deploy

---

## 📞 Soporte

Para dudas sobre versiones de caché:
- Documentación: docs/DEPLOYMENT_NOTES_v1.0.6.md
- Email: contacto@ropavejeroretro.cl

---

*Generado el 17 de Febrero de 2026*
