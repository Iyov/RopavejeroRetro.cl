# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.1.0] - 2026-03-05

### Agregado
- Sistema completo de automatización de Instagram con filtrado por hashtag `#RopavejeroRetroWeb`
- Script Python (`api/update_instagram.py`) para sincronización automática de posts de Instagram
- Generación automática de imágenes WebP responsive en 3 tamaños (400px, 800px, 1200px) usando Pillow
- Flujo de trabajo en GitHub Actions (`.github/workflows/update_instagram.yml`) para actualizaciones automáticas cada 12 horas
- Ejecución manual del workflow desde la pestaña Actions de GitHub
- Sistema de detección inteligente de cambios (posts agregados, modificados, eliminados)
- Generación automática de mensajes de commit descriptivos basados en cambios detectados
- Busting de caché automático en `index.html` con versionado dinámico
- Actualización automática del Service Worker con nuevas imágenes y versión
- Soporte para hasta 100 posts de Instagram con paginación automática
- Procesamiento de imágenes con conversión RGB y redimensionamiento proporcional
- Caché inteligente de imágenes (evita re-descargas innecesarias)
- Lazy loading de script de Instagram posts con IntersectionObserver
- Documentación completa del sistema de automatización en README.md

### Cambiado
- Service Worker actualizado a v2026-03-05_1454 con soporte para variantes WebP
- Array `INSTAGRAM_IMAGES` en Service Worker ahora incluye todas las variantes (JPEG + 400/800/1200 WebP)
- Query string de `instagram_posts.min.js` actualizado a v=2026-03-05_1454
- Estructura de datos de posts de Instagram ahora incluye ID único con prefijo `ig_auto_`
- Mejora en la estrategia de caché del Service Worker para imágenes de Instagram
- Optimización del proceso de carga de posts con lazy loading basado en viewport

### Mejorado
- Performance de carga de imágenes de Instagram con formato WebP (reducción ~70% en tamaño)
- Rendimiento general del sitio con imágenes responsive adaptadas a cada dispositivo
- Experiencia de usuario con actualizaciones automáticas sin intervención manual
- Gestión de caché con limpieza automática de versiones antiguas
- Proceso de deployment con commits automáticos descriptivos
- Escalabilidad del sistema para manejar grandes cantidades de posts

### Técnico
- Dependencias Python: `Pillow`, `requests`, `python-dotenv`
- Configuración de secretos en GitHub: `INSTAGRAM_TOKEN` (Instagram Basic Display API / Graph API)
- Integración con Instagram Graph API para obtención de media
- Procesamiento de imágenes con calidad optimizada (WebP quality=85, JPEG quality=90)
- Sistema de versionado automático basado en timestamp
- Manejo robusto de errores en descarga y procesamiento de imágenes
- Compatibilidad con imágenes RGBA y P (conversión automática a RGB)

---

## [1.0.9] - 2026-02-17

### Corregido
- Regenerados todos los archivos minificados (.min.js y .min.css)
- Eliminada declaración duplicada de CACHE_CONFIG en index.min.js
- Optimización de gtm.min.js

### Cambiado
- Service Worker actualizado a v1.0.9
- Query strings actualizados a v=2026-02-17_3
- Cache localStorage actualizado a v1_0_9
- Limpieza automática de cachés antiguos (v1_0_8 y anteriores)

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
