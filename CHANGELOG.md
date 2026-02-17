# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.8] - 2026-02-17

### Agregado
- Google Tag Manager (GTM) integrado en todas las páginas HTML
- Google Analytics 4 (GA4) configurado
- Watcher.js para minificación automática de archivos
- Footer con enlaces a páginas adicionales:
  - Versión Antigua (old.html)
  - Política de Seguridad (security-policy.html)
  - Agradecimientos de Seguridad (security-acknowledgments.html)
- Traducciones ES/EN para enlaces del footer
- 3 nuevas URLs en sitemap.xml (total: 13 URLs)

### Cambiado
- Service Worker actualizado a v1.0.8
- Query strings actualizados a v=2026-02-17_2
- Meta tags en páginas de seguridad: `noindex` → `index, follow`
- Robots.txt optimizado (eliminadas restricciones de páginas de seguridad)
- Estructura del footer reorganizada (flex-direction: column)
- README.md actualizado con historial de versiones

### Mejorado
- SEO: Cobertura de indexación mejorada de 25% a 100%
- Arquitectura de información con enlaces internos
- Transparencia con políticas de seguridad públicas
- Cache busting automático en navegadores

---

## [1.0.7] - 2026-02-17

### Agregado
- Mejoras de SEO e indexación para Google Search Console
- Estilos CSS para `.footer-links`
- Canonical URLs en páginas de seguridad
- Documentación completa en `docs/SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md`

### Cambiado
- Sitemap.xml actualizado con fechas 2026-02-17
- Prioridades ajustadas en sitemap (old.html: 0.3, security-*.html: 0.5)

---

## [1.0.6] - 2026-02-16

### Agregado
- Preconnect hints a dominios externos (docs.google.com, fonts.googleapis.com)
- Critical CSS inline para mejorar FCP
- Imágenes responsive WebP con múltiples variantes
- Service Worker con defer attribute

### Mejorado
- LCP mejorado ~80% (hero image local preloaded)
- FCP mejorado ~60% (critical CSS inline)
- Cache management optimizado (56 assets, 3.85 MB)

---

## [1.0.5] - 2026-02-16

### Agregado
- Minificación de JavaScript y CSS
- Lazy loading de imágenes e Instagram posts
- Passive event listeners
- Debouncing en búsqueda (300ms)

### Mejorado
- Reducción de tamaño de archivos: 36.4% total
  - JavaScript: -29.9% (141.3 KB → 99.1 KB)
  - CSS: -28.7% (44.0 KB → 31.4 KB)
- Performance mejorado 40-60% en Desktop y Mobile

---

## [1.0.0] - 2020

### Agregado
- Lanzamiento inicial del sitio web
- Catálogo de productos con integración a Google Sheets
- Sección de Instagram con posts
- Efemérides del día
- Blog con artículos sobre gaming retro
- Testimonios de clientes
- FAQ interactivo
- Soporte multilenguaje (ES/EN)
- Modo claro/oscuro
- PWA (Progressive Web App)
- Service Worker para funcionalidad offline

---

## Tipos de Cambios

- **Agregado**: para nuevas funcionalidades
- **Cambiado**: para cambios en funcionalidades existentes
- **Deprecado**: para funcionalidades que serán eliminadas
- **Eliminado**: para funcionalidades eliminadas
- **Corregido**: para corrección de errores
- **Mejorado**: para mejoras de performance o UX
- **Seguridad**: para vulnerabilidades corregidas
