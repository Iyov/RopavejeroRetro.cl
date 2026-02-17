# Google Tracking Setup (GTM + GA4)

## Implementación Actual

El proyecto utiliza código inline de Google Analytics 4 (GA4) y Google Tag Manager (GTM) directamente en el HTML, siguiendo las recomendaciones oficiales de Google.

### IDs Configurados

- **GTM Container ID**: `GTM-5D6LZB66`
- **GA4 Measurement ID**: `G-GCE8SP8NBZ`

### Implementación en HTML

El código se inserta justo después de la etiqueta `<head>` en todas las páginas:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GCE8SP8NBZ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GCE8SP8NBZ');
    </script>
    
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5D6LZB66');</script>
    <!-- End Google Tag Manager -->
    
    <title>...</title>
```

### Noscript Fallback

Justo después de la etiqueta `<body>`:

```html
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5D6LZB66" 
              height="0" width="0" style="display:none;visibility:hidden">
      </iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->
```

## Verificación de Funcionamiento

### 1. Verificar en la Consola del Navegador

Abre la consola de desarrollo (F12) y verifica:

```javascript
console.log(window.dataLayer);
```

Deberías ver un array con eventos de GTM y GA4.

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
   Abre DevTools → Network y busca:
   - `googletagmanager.com/gtag/js?id=G-GCE8SP8NBZ`
   - `googletagmanager.com/gtm.js?id=GTM-5D6LZB66`

2. **Verifica dataLayer**:
   ```javascript
   console.log(window.dataLayer);
   ```

3. **Verifica Content Security Policy**:
   Asegúrate de que el CSP permita:
   - `script-src: https://www.googletagmanager.com https://www.google-analytics.com`
   - `connect-src: https://www.google-analytics.com https://analytics.google.com`

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

Google Analytics y GTM exponen APIs globales:

```javascript
// dataLayer para eventos personalizados
window.dataLayer = window.dataLayer || [];

// Función gtag para GA4
window.gtag = function() {
  window.dataLayer.push(arguments);
};
```

### Enviar Eventos Personalizados

```javascript
// Usando gtag (GA4)
gtag('event', 'button_click', {
  'event_category': 'engagement',
  'event_label': 'cta_button'
});

// Usando dataLayer (GTM)
window.dataLayer.push({
  'event': 'custom_event',
  'eventCategory': 'engagement',
  'eventAction': 'click',
  'eventLabel': 'cta_button'
});
```

## Archivos del Proyecto

El tracking se implementa mediante código inline en:
- `index.html`
- `old.html`
- `404.html`
- `security-policy.html`
- `security-acknowledgments.html`

**No hay archivos JavaScript externos para el tracking.**

## Actualización de IDs

Para cambiar los IDs de GTM o GA4:

1. Edita el código inline en cada archivo HTML
2. Busca y reemplaza:
   - `GTM-5D6LZB66` por tu nuevo GTM ID
   - `G-GCE8SP8NBZ` por tu nuevo GA4 ID

## Configuración de GA4

El código inline configura GA4 automáticamente:
```javascript
gtag('config', 'G-GCE8SP8NBZ');
```

Para agregar configuración adicional, modifica el código inline:
```javascript
gtag('config', 'G-GCE8SP8NBZ', {
  'send_page_view': true,
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});
```

## Soporte

Si tienes problemas con el tracking:

1. Verifica la consola del navegador
2. Usa Google Tag Assistant
3. Revisa el modo Preview de GTM
4. Consulta la [documentación oficial de GTM](https://support.google.com/tagmanager)
5. Consulta la [documentación oficial de GA4](https://support.google.com/analytics)
