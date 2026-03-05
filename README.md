<div align="center">

# 🎮 Ropavejero Retro - Tienda de Videojuegos Retro

[![Website](https://img.shields.io/badge/Website-ropavejeroretro.cl-blue)](https://ropavejeroretro.cl/)
[![Instagram](https://img.shields.io/badge/Instagram-@ropavejero.retro-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/ropavejero.retro/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)](CHANGELOG.md)

> **Todo lo Retro en un solo lugar** - Consolas, juegos y accesorios retro originales americanos. Revive la nostalgia de los videojuegos clásicos.

![Ropavejero.Retro Logo](img/RopavejeroLogo_256.png)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre Nosotros](#-sobre-nosotros)
- [Características del Sitio](#-características-del-sitio)
- [Automatización de Instagram](#-automatización-de-instagram)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Marcas Disponibles](#-marcas-disponibles)
- [Preguntas Frecuentes](#-preguntas-frecuentes)
- [Redes Sociales](#-redes-sociales)
- [Instalación y Uso](#-instalación-y-uso)
- [Últimos Cambios](#-últimos-cambios)
- [Otros Cambios](#-otros-cambios)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Desarrollador](#-desarrollador)
- [Agradecimientos](#-agradecimientos)

---

## 🎯 Sobre Nosotros

**Ropavejero Retro** es una tienda especializada en videojuegos retro originales americanos ubicada en Santiago, Chile. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.

### ¿Qué Ofrecemos?

- 🎮 **Consolas Retro**: NES, SNES, PlayStation 1, Sega Genesis, y más
- 🕹️ **Juegos Originales**: Títulos clásicos verificados y garantizados
- 🎯 **Accesorios**: Controles, cables, memory cards y más
- ✅ **Garantía**: 30 días en todos los productos, 90 días en consolas reacondicionadas
- 🚚 **Envío Nacional**: A todo Chile vía Starken
- 🔍 **Productos Verificados**: Cada artículo es revisado minuciosamente

---

## ✨ Características del Sitio

### 🎨 Diseño y UX
- **Modo Claro/Oscuro**: Cambia entre temas según tu preferencia
- **Multilenguaje**: Soporte completo en Español e Inglés
- **Responsive**: Diseño adaptado para móviles, tablets y desktop
- **Accesibilidad**: Implementación completa de ARIA labels y navegación por teclado
- **PWA**: Funciona como aplicación web progresiva (instalable)

### 🚀 Performance
- **Service Worker**: Caché inteligente para carga ultra-rápida
- **Lazy Loading**: Carga diferida de imágenes
- **Optimización**: Tiempos de carga reducidos en 60-70%
- **Offline**: Funcionalidad básica sin conexión a internet
- **Minificación**: Archivos JS y CSS minificados (reducción del 36.4%)
- **WebP Nativo**: Generación automática de variantes (400, 800, 1200px) para máxima velocidad.

### 📊 Analytics
- **Google Tag Manager (GTM)**: Gestión centralizada de tags
- **Google Analytics 4 (GA4)**: Seguimiento de métricas y comportamiento de usuarios
- **Cloudflare Analytics**: Métricas de rendimiento y tráfico

### 🛡️ Seguridad
- **Content Security Policy**: Protección contra XSS
- **Sanitización**: Validación de todas las entradas de usuario
- **HTTPS**: Conexión segura obligatoria
- **Headers de Seguridad**: X-Content-Type-Options, X-XSS-Protection
- **Política de Seguridad Pública**: Divulgación responsable de vulnerabilidades
- **Página de Agradecimientos**: Reconocimiento a investigadores de seguridad

### 🔍 SEO y Indexación
- **Sitemap.xml**: 13 URLs indexables
- **Robots.txt**: Configuración optimizada para crawlers
- **Meta Tags**: Open Graph, Twitter Cards, Schema.org
- **Enlaces Internos**: Arquitectura de información mejorada
- **Canonical URLs**: Prevención de contenido duplicado
- **404 Personalizado**: Página de error amigable
- **Indexación Completa**: 8/8 páginas indexadas en Google (100%)

---

## 🤖 Automatización de Instagram

El sitio cuenta con un sistema de actualización inteligente que sincroniza los posts de Instagram con la web automáticamente.

### ¿Cómo funciona?
1. **Control por Hashtag**: El sistema solo selecciona los posts de Instagram que incluyan el hashtag `#RopavejeroRetroWeb`.
2. **Procesamiento de Imágenes**: El script descarga las imágenes originales y genera automáticamente variantes en formato **WebP** (400px, 800px, 1200px) usando la librería `Pillow`.
3. **Sincronización Total**: Se actualizan los archivos de datos (`js/instagram_posts.min.js`), la versión en el `index.html` y el manifiesto del `service-worker.js`.
4. **Ejecución**: Se ejecuta automáticamente cada 12 horas vía **GitHub Actions** o manualmente desde la pestaña *Actions*.

### Configuración de Secretos
Para la ejecución en GitHub, se requiere configurar:
- `INSTAGRAM_TOKEN`: Token de acceso de larga duración (Instagram Basic Display API / Graph API).

---

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript (Vanilla)**: Sin frameworks, código puro y optimizado
- **Font Awesome 6.5.1**: Iconografía

### Backend y Automatización
- **Python 3 (api/ folder)**: Script de actualización de Instagram y procesamiento de imágenes (`Pillow`, `requests`, `python-dotenv`).
- **GitHub Actions**: Orquestación de tareas programadas cada 12 horas o manuales.

### APIs y Servicios
- **Google Sheets API**: Base de datos de productos en tiempo real
- **Service Worker API**: Caché y funcionalidad offline
- **LocalStorage API**: Almacenamiento local de preferencias
- **Google Tag Manager**: Gestión de analytics
- **Google Analytics 4**: Métricas de usuario

### Herramientas de Desarrollo
- **PWA**: Manifest.json para instalación
- **Schema.org**: Datos estructurados para SEO
- **Open Graph**: Optimización para redes sociales
- **Watcher.js**: Minificación automática de archivos
- **Python Scripts**: Análisis de performance y optimización

---

## 📁 Estructura del Proyecto

```
RopavejeroRetro.cl/
├── index.html                 # Página principal
├── 404.html                   # Página de error personalizada
├── old.html                   # Versión antigua del sitio
├── security-policy.html       # Política de seguridad
├── security-acknowledgments.html  # Agradecimientos de seguridad
├── manifest.json              # Configuración PWA
├── service-worker.js          # Service Worker para caché
├── robots.txt                 # Configuración para bots
├── sitemap.xml               # Mapa del sitio (13 URLs)
├── watcher.js                # Minificación automática
├── package.json              # Dependencias del proyecto
├── CHANGELOG.md              # Historial de cambios
├── api/
│   └── update_instagram.py   # Motor de automatización (Python)
├── .github/workflows/
│   └── update_instagram.yml  # Configuración de GitHub Actions
├── css/
│   ├── index.css             # Estilos principales
│   ├── index.min.css         # Estilos minificados
│   ├── app.css               # Estilos adicionales
│   └── font-awesome_6.5.1_all.min.css
├── js/
│   ├── index.js              # Lógica principal
│   ├── index.min.js          # JavaScript minificado
│   ├── app.js                # Lógica adicional
│   ├── instagram_posts.js    # Datos de posts de Instagram
│   ├── instagram_posts.min.js # Datos minificados de Instagram
│   └── efemerides.json       # Efemérides del día
├── img/
│   ├── RopavejeroLogo_*.png  # Logos en varios tamaños
│   ├── Post*-*.webp          # Imágenes optimizadas legacy
│   ├── IG_*-400.webp         # Variantes optimizadas Instagram (Móvil)
│   ├── IG_*-800.webp         # Variantes optimizadas Instagram (Tablet)
│   ├── IG_*-1200.webp        # Variantes optimizadas Instagram (Desktop)
│   ├── hero-*.webp           # Hero images responsive
│   ├── bg.svg                # Fondo
│   └── favicon.png           # Favicon
├── webfonts/                 # Fuentes de Font Awesome
├── docs/                     # Documentación técnica
│   ├── SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md
│   ├── OPTIMIZACIONES_RENDIMIENTO.md
│   ├── OPTIMIZACIONES_MOBILE.md
│   └── GOOGLE_TRACKING_SETUP.md
├── .well-known/
│   └── security.txt          # Política de seguridad
└── README.md                 # Este archivo
```

---

## 🎯 Funcionalidades

### 1. **Catálogo de Productos**
- Búsqueda en tiempo real con debouncing (300ms)
- Filtros por plataforma (múltiple selección)
- Filtro por estado (disponible/vendido)
- Paginación inteligente
- Vista de detalles completos
- Integración con Google Sheets
- Caché local (5 minutos)

### 2. **Sección de Instagram**
- Últimos posts de Instagram sincronizados automáticamente
- Imágenes optimizadas en WebP
- Enlaces directos a publicaciones
- Fechas relativas ("Hace X días")
- Lazy loading de imágenes

### 3. **Efemérides del Día**
- Eventos históricos del gaming
- Actualización diaria automática
- Diseño destacado
- Datos en formato JSON

### 4. **Blog**
- Artículos sobre gaming retro
- Historia de Nintendo, Sega, etc.
- Guías para coleccionistas
- Diálogos modales para lectura

### 5. **Testimonios**
- Reseñas de clientes reales
- Diseño de tarjetas atractivo
- Imágenes lazy loaded

### 6. **FAQ Interactivo**
- Preguntas frecuentes expandibles
- Respuestas detalladas
- Fácil navegación
- Animaciones suaves

### 7. **Contacto**
- Enlaces a todas las redes sociales
- WhatsApp directo
- Acceso al catálogo en Excel
- Footer con enlaces adicionales

### 8. **PWA (Progressive Web App)**
- Instalable en dispositivos
- Funciona offline
- Service Worker con caché inteligente
- Manifest.json configurado

---

## 🎮 Marcas Disponibles

| Marca | Productos | Enlace Oficial |
|-------|-----------|----------------|
| 🟥 **Nintendo** | NES, SNES, N64, GameCube, Wii, GameBoy, DS, 3DS | [nintendo.com](https://www.nintendo.com/) |
| 🔵 **PlayStation** | PS1, PS2, PS3, PS4, PSP | [playstation.com](https://www.playstation.com/) |
| 🟢 **Xbox** | Xbox Classic, Xbox 360, Xbox One | [xbox.com](https://www.xbox.com/) |
| 🔷 **Sega** | Genesis, Master System, Dreamcast, GameGear | [sega.com](https://www.sega.com/) |
| 🟠 **Atari** | Atari 2600, 7800 | [atari.com](https://www.atari.com/) |

---

## ❓ Preguntas Frecuentes

### ¿Qué tipos de productos venden?
Vendemos consolas, juegos y accesorios retro originales americanos. Trabajamos con marcas como Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) y Atari.

### ¿Los productos son originales?
Sí, todos nuestros productos son 100% originales americanos. Cada artículo es revisado minuciosamente y garantizamos su funcionamiento. El estado varía desde productos como nuevos hasta usados en buen estado, siempre especificando claramente las condiciones en cada listing.

### ¿Realizan envíos a todo Chile?
Sí, realizamos envíos a todo Chile a través de Starken. El costo de envío varía según la ubicación y el peso del paquete. Las entregas presenciales dentro de Santiago se realizan en metro San Joaquín L5.

### ¿Ofrecen garantía?
Todos nuestros productos incluyen 30 días de garantía por defectos de funcionamiento. Para consolas reacondicionadas por nosotros, ofrecemos 90 días de garantía. La garantía cubre problemas técnicos pero no daños físicos por mal uso.

### ¿Puedo ver los productos antes de comprar?
Actualmente no tenemos showroom físico, pero puedes agendar una cita para ver productos específicos en nuestras oficinas en Santiago. También publicamos videos demostrativos de todos nuestros productos en Instagram y YouTube.

---

## 📱 Redes Sociales

Síguenos en todas nuestras plataformas:

- 📸 **Instagram**: [@ropavejero.retro](https://www.instagram.com/ropavejero.retro/)
- 🎵 **TikTok**: [@ropavejero.retro](https://www.tiktok.com/@ropavejero.retro/)
- 🎥 **YouTube**: [RopavejeroRetro](https://www.youtube.com/@RopavejeroRetro)
- 👥 **Facebook**: [ropavejero.retro](https://www.facebook.com/ropavejero.retro/)
- 🧵 **Threads**: [@ropavejero.retro](https://www.threads.com/@ropavejero.retro/)
- 🐦 **Twitter (X)**: [@RopavejeroRetro](https://twitter.com/RopavejeroRetro/)
- 💬 **WhatsApp**: [+56 9 6769 1585](https://wa.me/56967691585)
- 🌐 **Website**: [ropavejeroretro.cl](https://ropavejeroretro.cl/)
- 📊 **Catálogo Excel**: [Google Sheets](https://docs.google.com/spreadsheets/d/18kZ6wyheBWMmoa5yb1PR_XqhqzHCTAlT/)

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para carga inicial)
- Node.js (opcional, para desarrollo)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/Iyov/RopavejeroRetro.cl.git
cd RopavejeroRetro.cl
```

2. **Instalar dependencias (opcional)**
```bash
npm install
```

3. **Abrir el sitio**
```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Usar un servidor local
python -m http.server 8000
# Luego visitar: http://localhost:8000

# Opción 3: Usar Live Server (VS Code)
# Instalar extensión "Live Server" y hacer clic derecho > "Open with Live Server"
```

4. **Automatización de Instagram (Nuevo)**
```bash
# Instalar dependencias del script
pip install Pillow requests python-dotenv --break-system-packages

# Configurar token
echo "INSTAGRAM_TOKEN=tu_token_aqui" > .env

# Ejecutar actualización
python api/update_instagram.py
```

5. **Configurar Google Sheets (Opcional)**
   - El sitio usa Google Sheets como base de datos
   - Para usar tu propia hoja, actualiza la URL en `js/index.js`
   - Asegúrate de que la hoja sea pública o tenga permisos adecuados

### Instalación como PWA

1. Visita [ropavejeroretro.cl](https://ropavejeroretro.cl/)
2. En el navegador, busca el ícono de "Instalar" o "Agregar a pantalla de inicio"
3. Confirma la instalación
4. ¡Listo! Ahora puedes usar el sitio como una app

---

## 🆕 Últimos Cambios
### Versión: v1.1.0 | Mar 2026

#### Añadido
- ✅ Sistema de automatización de Instagram con filtrado por hashtag.
- ✅ Generación automática de imágenes WebP responsive (400/800/1200px).
- ✅ Flujo de trabajo en GitHub Actions para actualizaciones automáticas.
- ✅ Busting de caché automático en index.html y service-worker.js.

#### Corregido
- ✅ Mejoras en el rendimiento de carga de posts de Instagram.

---

## 🆕 Otros Cambios
### Versión: v1.0.9 | Feb 2026

### Corregido
- ✅ Regenerados todos los archivos minificados (.min.js y .min.css)
- ✅ Eliminada declaración duplicada de CACHE_CONFIG en index.min.js
- ✅ Optimización de gtm.min.js

### Cambiado
- ✅ Service Worker actualizado a v1.0.9
- ✅ Query strings actualizados a v=2026-02-17_3
- ✅ Cache localStorage actualizado a v1_0_9
- ✅ Limpieza automática de cachés antiguos (v1_0_8 y anteriores)

Ver historial completo en [CHANGELOG.md](CHANGELOG.md)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar el sitio:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Áreas de Mejora
- 🎨 Mejoras de diseño y UX
- 🐛 Corrección de bugs
- 📱 Optimizaciones móviles
- ♿ Mejoras de accesibilidad
- 🌐 Traducciones a otros idiomas
- 📊 Nuevas métricas de analytics
- 🚀 Optimizaciones de performance

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Desarrollador

**Desarrollado con ❤️ por [@Iyov](https://github.com/Iyov)**

- 🌐 GitHub: [github.com/Iyov](https://github.com/Iyov)
- 📧 Contacto: [FranciscoBarrientos.cl](https://franciscobarrientos.cl/)

---

## 🙏 Agradecimientos

- A todos los clientes que confían en nosotros
- A la comunidad retro gaming de Chile
- A los desarrolladores de las herramientas open source utilizadas
- A Google por las herramientas de analytics y optimización

---

## 📊 Estadísticas del Proyecto

- 📅 **Año de Inicio**: 2020
- 🌟 **Productos Disponibles**: 100+
- 👥 **Clientes Satisfechos**: 150+
- ⭐ **Rating Promedio**: 4.8/5
- 🚚 **Envíos Realizados**: A todo Chile
- 📦 **Versión Actual**: v1.1.0
- 🔍 **SEO Score**: 100% de páginas indexadas
- ⚡ **Performance**: 60-70% más rápido que v1.0.0

---

<div align="center">

**🎮 Ropavejero Retro - Todo lo Retro en un solo lugar 🎮**

[Website](https://ropavejeroretro.cl/) • [Instagram](https://www.instagram.com/ropavejero.retro/) • [WhatsApp](https://wa.me/56967691585)

© 2026 @Ropavejero.Retro - Todos los derechos reservados

</div>
