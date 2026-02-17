# Google Tracking Setup (GTM + GA4)

## Implementación Actual

El proyecto utiliza una implementación unificada de Google Tag Manager (GTM) y Google Analytics 4 (GA4) a través del archivo `js/google-tracking.js`.

### IDs Configurados

- **GTM Container ID**: `GTM-5D6LZB66`
- **GA4 Measurement ID**: `G-GCE8SP8NBZ`

### Implementación en HTML

```html
<!-- Google Tracking (GTM + GA4) -->
<script src="js/google-tracking.min.js?v=2026-02-17_3" defer data-gtm-id="GTM-5D6LZB66" data-ga-id="G-GCE8SP8NBZ"></script>
```

### Noscript Fallback

```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5D6LZB66" 
          height="0" width="0" style="display:none;visibility:hidden">
  </iframe>
</noscript>
```

## Verificación de Funcionamiento

### 1. Verificar en la Consola del Navegador

Abre la consola de desarrollo (F12) y busca estos mensajes:

```
✅ Google Tag Manager inicializado: GTM-5D6LZB66
✅ Google Analytics 4 inicializado: G-GCE8SP8NBZ
📊 Google Tracking completamente inicializado
   - GTM ID: GTM-5D6LZB66
   - GA4 ID: G-GCE8SP8NBZ
```

**Nota**: Estos mensajes solo aparecen en `localhost` o `127.0.0.1`.

### 2. Verificar dataLayer

En la consola del navegador, ejecuta:

```javascript
console.log(window.dataLayer);
```

Deberías ver un array con eventos, incluyendo:
- `gtm.js`
- `gtm.start`
- Configuración de GA4

### 3. Verificar con Google Tag Assistant

1. Instala la extensión [Google Tag Assistant](https://tagassistant.google.com/)
2. Abre tu sitio web
3. Haz clic en el icono de Tag Assistant
4. Verifica que aparezcan:
   - Google Tag Manager (GTM-5D6LZB66)
   - Google Analytics 4 (G-GCE8SP8NBZ)

### 4. Verificar en Google Tag Manager

1. Ve a [Google Tag Manager](https://tagmanager.google.com/)
2. Selecciona tu contenedor `GTM-5D6LZB66`
3. Ve a "Preview" (Vista previa)
4. Ingresa la URL de tu sitio
5. Verifica que los tags se disparen correctamente

### 5. Verificar en Google Analytics 4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad `G-GCE8SP8NBZ`
3. Ve a "Realtime" (Tiempo real)
4. Abre tu sitio en otra pestaña
5. Deberías ver tu visita en tiempo real

### 6. Verificar Network Requests

En las DevTools, ve a la pestaña "Network":

1. Busca requests a:
   - `https://www.googletagmanager.com/gtm.js?id=GTM-5D6LZB66`
   - `https://www.googletagmanager.com/gtag/js?id=G-GCE8SP8NBZ`
   - `https://www.google-analytics.com/g/collect` (eventos de GA4)

2. Verifica que el status sea `200 OK`

## Troubleshooting

### El tracking no funciona

1. **Verifica que los scripts se carguen**:
   ```javascript
   console.log(window.GoogleTracking);
   ```
   Debería mostrar un objeto con `gtmId`, `gaId`, `gtag`, y `dataLayer`.

2. **Verifica los IDs**:
   ```javascript
   console.log(window.GoogleTracking.gtmId); // GTM-5D6LZB66
   console.log(window.GoogleTracking.gaId);  // G-GCE8SP8NBZ
   ```

3. **Verifica que dataLayer exista**:
   ```javascript
   console.log(window.dataLayer);
   ```

4. **Verifica Content Security Policy**:
   Asegúrate de que el CSP permita:
   - `script-src: https://www.googletagmanager.com`
   - `connect-src: https://www.googletagmanager.com`

### Los eventos no se registran

1. Verifica que el tag esté publicado en GTM
2. Verifica que los triggers estén configurados correctamente
3. Usa el modo Preview de GTM para debuggear

### Ad Blockers

Los bloqueadores de anuncios pueden bloquear GTM y GA4. Para testing:
1. Desactiva temporalmente el ad blocker
2. Usa modo incógnito sin extensiones
3. Prueba en diferentes navegadores

## API Pública

El script expone una API global:

```javascript
window.GoogleTracking = {
  gtmId: 'GTM-5D6LZB66',      // ID del contenedor GTM
  gaId: 'G-GCE8SP8NBZ',        // ID de medición GA4
  gtag: function() { ... },    // Función gtag para eventos personalizados
  dataLayer: window.dataLayer  // Referencia al dataLayer
};
```

### Enviar Eventos Personalizados

```javascript
// Usando gtag
window.GoogleTracking.gtag('event', 'button_click', {
  'event_category': 'engagement',
  'event_label': 'cta_button'
});

// Usando dataLayer
window.dataLayer.push({
  'event': 'custom_event',
  'eventCategory': 'engagement',
  'eventAction': 'click',
  'eventLabel': 'cta_button'
});
```

## Archivos del Proyecto

- `js/google-tracking.js` - Código fuente
- `js/google-tracking.min.js` - Versión minificada
- Implementado en:
  - `index.html`
  - `old.html`
  - `404.html`
  - `security-policy.html`
  - `security-acknowledgments.html`

## Actualización de Versión

Para actualizar la versión del cache:

1. Edita el query string en todos los archivos HTML:
   ```html
   <script src="js/google-tracking.min.js?v=NUEVA-VERSION" ...>
   ```

2. Regenera el minificado:
   ```bash
   npm run minify:js
   ```

## Configuración de GA4

El script configura GA4 con:
- `send_page_view: true` - Envía pageviews automáticamente
- `anonymize_ip: true` - Anonimiza IPs para privacidad

Para modificar la configuración, edita `js/google-tracking.js`:

```javascript
window.gtag('config', GA_ID, {
  'send_page_view': true,
  'anonymize_ip': true,
  // Agrega más opciones aquí
});
```

## Soporte

Si tienes problemas con el tracking:

1. Verifica la consola del navegador
2. Usa Google Tag Assistant
3. Revisa el modo Preview de GTM
4. Consulta la [documentación oficial de GTM](https://support.google.com/tagmanager)
5. Consulta la [documentación oficial de GA4](https://support.google.com/analytics)
