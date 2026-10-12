<div align="center">

# 🎮 Ropavejero Retro - Tienda de Videojuegos Retro

[![Website](https://img.shields.io/badge/Website-ropavejeroretro.cl-blue)](https://ropavejeroretro.cl/)
[![Instagram](https://img.shields.io/badge/Instagram-@ropavejero.retro-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/ropavejero.retro/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.1.0-brightgreen.svg)](CHANGELOG.md)

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
- [Desarrollo](#-desarrollo)
- [Últimos Cambios](#-últimos-cambios)
- [Otros Cambios](#-otros-cambios)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Desarrollador](#-desarrollador)
- [Agradecimientos](#-agradecimientos)

---

## 🎯 Sobre Nosotros

**Ropavejero Retro** es una tienda especializada en videojuegos retro originales americanos ubicada en Santiago, Chile. Ofrecemos también **servicio técnico de consolas retro** y **pulido profesional de discos ópticos**. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.

### ¿Qué Ofrecemos?

- 🎮 **Consolas Retro**: NES, SNES, PlayStation 1, Sega Genesis, y más
- 🕹️ **Juegos Originales**: Títulos clásicos verificados y garantizados
- 🎯 **Accesorios**: Controles, cables, memory cards y más
- 🔧 **Servicio Técnico**: Diagnóstico y reparación de consolas retro
- 💿 **Pulido de Discos**: Eliminación de rayaduras en discos ópticos (PS1, PS2, Xbox, GameCube, Wii)
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
- **Google Tag Manager (GTM)**: Gestión centralizada de tags, cargado por `js/seo-analytics.js`
- **Google Analytics 4 (GA4)**: Seguimiento de métricas y comportamiento de usuarios (configurado dentro de GTM)
- **Eventos propios**: `seo_page_context`, `outbound_click` y `generate_lead` (clics a WhatsApp) vía `dataLayer`
- **Cloudflare Analytics**: Métricas de rendimiento y tráfico

### 🛡️ Seguridad
- **Content Security Policy**: Protección contra XSS (declarada con `<meta http-equiv>` en todas las páginas salvo `ps3.html`, que solo redirige)
- **Sanitización**: Validación de todas las entradas de usuario
- **HTTPS**: Conexión segura obligatoria
- **Headers de Seguridad**: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`, agregados por una regla de Cloudflare (el sitio se sirve desde GitHub Pages detrás de Cloudflare)
- **Política de Seguridad Pública**: Divulgación responsable de vulnerabilidades
- **Página de Agradecimientos**: Reconocimiento a investigadores de seguridad

### 🔍 SEO y Indexación
- **Sitemap.xml**: solo las 2 páginas indexables (`/` y `/productos`)
- **Robots.txt**: Configuración optimizada para crawlers
- **Meta Tags**: Open Graph, Twitter Cards, Schema.org
- **Enlaces Internos**: Arquitectura de información mejorada
- **Canonical URLs**: Prevención de contenido duplicado
- **404 Personalizado**: Página de error amigable
- **Páginas indexables**: inicio y `/productos`; las auxiliares (`404`, `old`, `ps3`, seguridad) llevan `noindex`

---

## 🤖 Automatización de Instagram

El sitio cuenta con un sistema de actualización inteligente que sincroniza los posts de Instagram con la web automáticamente.

### ¿Cómo funciona?
1. **Control por Hashtag**: El sistema solo selecciona los posts de Instagram que incluyan el hashtag `#RopavejeroRetroWeb`.
2. **Tipos de post**: Los videos se omiten; de los carruseles se usa la primera imagen. La primera línea del caption es el título y el resto la descripción.
3. **Procesamiento de Imágenes**: El script descarga las imágenes originales y genera automáticamente variantes en formato **WebP** (400px, 800px, 1200px) usando la librería `Pillow`. Las imágenes de posts que ya no están se eliminan.
4. **Sincronización Total**: Solo si hubo cambios (posts agregados, modificados, eliminados o con distinto número de likes) se actualizan los archivos de datos (`js/instagram_posts.js` y `js/instagram_posts.min.js`), la lista de imágenes del `service-worker.js` y la versión de caché de todo el sitio (`AAAA-MM-DD_N`).
5. **Ejecución**: Se ejecuta automáticamente cada 12 horas vía **GitHub Actions** o manualmente desde la pestaña *Actions*. El workflow commitea el resultado con `github-actions[bot]`.

6. **Despliegue**: Cuando hubo cambios, el mismo workflow lanza *Deploy to GitHub Pages* (`deploy-pages.yml`) para publicarlos. Es un paso explícito porque los pushes del bot no disparan por sí solos el despliegue.

### Configuración de Secretos
Para la ejecución en GitHub, se requiere configurar:
- `INSTAGRAM_TOKEN`: Token de acceso de larga duración (Instagram Graph API). Cuando expira, el script lo informa en el log del workflow y hay que renovarlo.

---

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript (Vanilla)**: Sin frameworks, código puro y optimizado
- **Font Awesome 6.5.1**: Iconografía

### Backend y Automatización
- **Python 3 (api/ folder)**: Script de actualización de Instagram y procesamiento de imágenes (`Pillow`, `requests`).
- **GitHub Actions**: Actualización de Instagram cada 12 horas (o manual) y despliegue a GitHub Pages en cada push a `main`.

### APIs y Servicios
- **Google Sheets**: Base de datos de productos, leída como CSV público desde el navegador
- **Service Worker API**: Caché y funcionalidad offline
- **LocalStorage API**: Almacenamiento local de preferencias
- **Google Tag Manager**: Gestión de analytics
- **Google Analytics 4**: Métricas de usuario

### Herramientas de Desarrollo
- **PWA**: Manifest.json para instalación
- **Schema.org**: Datos estructurados para SEO
- **Open Graph**: Optimización para redes sociales
- **terser / csso**: Minificación de JS y CSS (`npm run build`)
- **Watcher.js**: Minificación automática de archivos
- **node:test + jsdom**: Tests del front-end sobre los HTML y scripts reales (`npm run test:js`)
- **pytest**: Tests de los scripts Python (`npm run test:py`)
- **Python Scripts**: Análisis de performance y optimización

---

## 📁 Estructura del Proyecto

```
RopavejeroRetro.cl/
├── index.html                 # Página principal
├── productos.html             # Catálogo de productos (URL: /productos)
├── 404.html                   # Página de error personalizada
├── old.html                   # Versión antigua del sitio
├── ps3.html                   # Página suelta: guía HEN para PS3 (URL: /ps3)
├── security-policy.html       # Política de seguridad
├── security-acknowledgments.html  # Agradecimientos de seguridad
├── manifest.json              # Configuración PWA
├── service-worker.js          # Service Worker para caché
├── robots.txt                 # Configuración para bots
├── sitemap.xml                # Mapa del sitio (2 URLs indexables)
├── schema.json                # Datos estructurados Schema.org
├── structured-data.json       # Datos estructurados Schema.org
├── watcher.js                 # Minificación automática
├── package.json               # Scripts y dependencias de minificación
├── requirements.txt           # Dependencias Python del script de Instagram
├── commit_message.txt         # Mensaje de commit que escribe el script de Instagram
├── CHANGELOG.md               # Historial de cambios
├── CLAUDE.md                  # Guía técnica para agentes de IA (arquitectura y precauciones)
├── AGENTS.md                  # Puntero a CLAUDE.md para otros agentes de IA
├── MEMORY.md                  # Acuerdos, decisiones y pendientes del proyecto
├── SECURITY.md                # Guía de seguridad
├── api/
│   ├── update_instagram.py    # Motor de automatización (Python)
│   └── bump_version.py        # Versión de caché única (AAAA-MM-DD_N) para todo el sitio
├── tests/
│   ├── js/                        # Tests del front-end (node:test + jsdom) y su arnés
│   ├── test_update_instagram.py   # Tests del script de Instagram (pytest)
│   └── test_bump_version.py       # Tests del versionado de caché
├── specs/
│   ├── README.md              # Proceso de desarrollo guiado por especificación (SDD)
│   ├── base/                  # Requisitos vigentes del sitio, uno por línea con identificador
│   └── cambios/               # Especificación de cada cambio
├── .claude/agents/            # Agentes de Claude Code: orquestador, frontend y tester
├── .github/workflows/
│   ├── update_instagram.yml   # Actualización de Instagram cada 12 horas
│   └── deploy-pages.yml       # Despliegue a GitHub Pages en cada push a main
├── css/
│   ├── index.css              # Estilos principales
│   ├── index.min.css          # Estilos minificados
│   ├── app.css / app.min.css  # Estilos de la versión antigua (old.html)
│   ├── transition*.min.css    # Transiciones de la versión antigua (old.html)
│   └── font-awesome_6.5.1_all.min.css
├── js/
│   ├── index.js               # Entry point — solo el DOMContentLoaded (16 líneas)
│   ├── index.min.js           # Minificado del entry point
│   ├── seo-analytics.js       # GTM/GA4, consentimiento y eventos de dataLayer
│   ├── modules/               # Módulos separados por responsabilidad
│   │   ├── logger.js          # Control de logs por ambiente
│   │   ├── cache.js           # Sistema de caché con localStorage
│   │   ├── siglas.js          # Diccionario y detección de siglas
│   │   ├── utils.js           # Utilidades: sanitize, validate, sort
│   │   ├── ui.js              # Tema, idioma, traducciones, FAQ, Blog, menú
│   │   ├── products.js        # Catálogo: tabla, filtros, paginación, modal
│   │   ├── instagram.js       # Posts de Instagram y filtros por consola
│   │   ├── efemerides.js      # Efemérides del día
│   │   └── analytics.js       # CSP, AdBlock, fallback analytics
│   ├── app.js / app.min.js    # Script de la versión antigua (old.html)
│   ├── instagram_posts.js     # Datos de posts de Instagram (generado)
│   ├── instagram_posts.min.js # Datos minificados de Instagram (generado)
│   ├── siglas.json            # Diccionario de siglas ES/EN (40+ entradas)
│   ├── console_aliases.json   # Aliases de consolas para filtros de Instagram
│   └── efemerides.json        # Efemérides del día
├── img/
│   ├── RopavejeroLogo_*.png   # Logos en varios tamaños
│   ├── IG_*.jpeg              # Imagen original de cada post de Instagram (fallback)
│   ├── IG_*-400.webp          # Variantes optimizadas Instagram (Móvil)
│   ├── IG_*-800.webp          # Variantes optimizadas Instagram (Tablet)
│   ├── IG_*-1200.webp         # Variantes optimizadas Instagram (Desktop)
│   ├── hero-*.webp            # Hero images responsive
│   ├── bg.svg                 # Fondo
│   └── favicon.png            # Favicon
├── webfonts/                  # Fuentes de Font Awesome
├── docs/                      # Documentación técnica (ver docs/README.md)
├── .well-known/
│   └── security.txt           # Política de seguridad
└── README.md                  # Este archivo
```

---

## 🎯 Funcionalidades

### 1. **Catálogo de Productos**
- Página independiente accesible en `https://ropavejeroretro.cl/productos`
- Búsqueda en tiempo real con debouncing (300ms)
- Filtros por plataforma (múltiple selección)
- Ordenamiento por precio, nombre o plataforma
- Paginación (25 productos por página)
- Filtros reflejados en la URL (`?q=`, `sort=`, `platform=`, `page=`) para compartir búsquedas
- Siglas de estado del producto (CIB, BL, GH, etc.) explicadas en tooltips y en el detalle
- Vista de detalles completos
- Integración con Google Sheets
- Caché local (5 minutos)

### 2. **Sección de Instagram**
- Últimos posts de Instagram sincronizados automáticamente
- Filtro por consola (botones generados desde `js/console_aliases.json`)
- Número de likes por post
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

### 8. **Servicios Adicionales**
- Servicio técnico de consolas retro (diagnóstico, reparación, limpieza)
- Pulido profesional de discos ópticos (PS1, PS2, Xbox, GameCube, Wii)
- Contacto directo vía WhatsApp e Instagram para presupuestos

### 9. **PWA (Progressive Web App)**
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

### ¿Qué tipos de productos y servicios ofrecen?
Vendemos consolas, juegos y accesorios retro originales americanos. Trabajamos con marcas como Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) y Atari. Además ofrecemos **servicio técnico de consolas retro** y **pulido profesional de discos ópticos**.

### ¿Los productos son originales?
Sí, todos nuestros productos son 100% originales americanos. Cada artículo es revisado minuciosamente y garantizamos su funcionamiento. El estado varía desde productos como nuevos hasta usados en buen estado, siempre especificando claramente las condiciones en cada listing.

### ¿Realizan envíos a todo Chile?
Sí, realizamos envíos a todo Chile a través de Starken. El costo de envío varía según la ubicación y el peso del paquete. Las entregas presenciales dentro de Santiago se realizan en metro San Joaquín L5.

### ¿Ofrecen garantía?
Todos nuestros productos incluyen 30 días de garantía por defectos de funcionamiento. Para consolas reacondicionadas por nosotros, ofrecemos 90 días de garantía. La garantía cubre problemas técnicos pero no daños físicos por mal uso.

### ¿En qué consiste el servicio técnico y el pulido de discos?
El servicio técnico incluye diagnóstico y reparación de consolas retro (limpieza de conectores, cambio de condensadores, reemplazo de lector óptico, entre otros). El pulido de discos elimina rayaduras superficiales de discos ópticos (PS1, PS2, Xbox, GameCube, Wii, etc.) restaurando su capacidad de lectura. Contáctanos por WhatsApp o Instagram para presupuesto.

### ¿Puedo ver los productos antes de comprar?
Sí. Puedes visitarnos en nuestro local @DoubleImpactStore, en el Persa Bio Bio: Bio Bio 654, Local 58, Galpón Nuevo Bio Bio, a pasos del Metro Bio Bio L6. Atendemos sábados, domingos y festivos de 11:00 a 18:00 hrs. Si buscas un producto específico, escríbenos antes por Instagram o WhatsApp para confirmar que esté en el local. También publicamos videos demostrativos de nuestros productos en Instagram y YouTube.

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
- 📊 **Catálogo Excel**: [Google Sheets](https://docs.google.com/spreadsheets/d/1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek/)

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
pip install -r requirements.txt

# Configurar token
echo "INSTAGRAM_TOKEN=tu_token_aqui" > .env

# Ejecutar actualización (siempre desde la raíz del repositorio)
python api/update_instagram.py
```

5. **Configurar Google Sheets (Opcional)**
   - El sitio usa Google Sheets como base de datos
   - Para usar tu propia hoja, actualiza el `sheetId` en `js/modules/products.js`
   - Asegúrate de que la hoja sea pública o tenga permisos adecuados

### Instalación como PWA

1. Visita [ropavejeroretro.cl](https://ropavejeroretro.cl/)
2. En el navegador, busca el ícono de "Instalar" o "Agregar a pantalla de inicio"
3. Confirma la instalación
4. ¡Listo! Ahora puedes usar el sitio como una app

---

## 🛠 Desarrollo

No hay paso de build para correr el sitio: basta un servidor estático. `npm run build` solo minifica.

```bash
npm install          # herramientas de minificación (terser, csso)
npm run minify:js    # js/index.js, js/instagram_posts.js, js/app.js -> *.min.js
npm run minify:css   # css/index.css, css/app.css -> *.min.css
npm run build        # ambos
npm run watch        # minifica automáticamente al guardar

pip install pytest
npm test                     # todos los tests: JavaScript (jsdom) y Python (pytest)
npm run test:js              # solo los del front-end
npm run test:py              # solo los de los scripts Python
npm run trace                # matriz de trazabilidad requisito -> tests

npm run bump                 # sube la versión de caché en todo el sitio
npm run check:version        # verifica que la versión sea consistente
```

A tener en cuenta:

- **El HTML referencia `js/index.min.js` y `css/index.min.css`**, no los fuentes: después de editar `js/index.js` o `css/index.css` hay que minificar y commitear el resultado. Los módulos de `js/modules/` se sirven tal cual.
- **`npm run minify:js`, `npm run build` y `npm run watch` también regeneran `js/instagram_posts.min.js`**, con un resultado distinto al que escribe el bot de Instagram. No hace falta commitear ese diff: descartarlo con `git checkout js/instagram_posts.min.js`.
- **Versionado de caché:** el sitio usa una sola versión con el esquema `AAAA-MM-DD_N` (ej. `2026-10-12_2`), igual en todos los `?v=` y en `CACHE_VERSION` del service worker. Después de cada cambio se sube con `npm run bump` (o `python api/bump_version.py`): si ya hubo cambios ese día aumenta el correlativo, y si es un día nuevo parte en `_1`. `npm run check:version` verifica que no quede ninguna referencia con otra versión o sin `?v=`. El bot de Instagram usa el mismo mecanismo. Para que no se olvide, un hook `pre-commit` rechaza los commits que modifican el sitio sin subir la versión (activarlo una vez con `git config core.hooksPath .githooks`), y el despliegue no publica si la versión no cambió.
- **Despliegue:** cada push a `main` publica la raíz del repositorio en GitHub Pages, sin build en CI.
- **Textos:** todo texto visible debe existir en español e inglés en `translations` (`js/modules/ui.js`).
- **Especificación y tests:** todo cambio se especifica antes de implementarse y cada requisito tiene un test ([specs/README.md](specs/README.md)). `npm test` debe pasar antes de commitear. Los tests en `todo` corresponden a defectos conocidos, listados en [MEMORY.md](MEMORY.md).

El detalle de arquitectura, orden de carga de módulos y precauciones está en [CLAUDE.md](CLAUDE.md); el índice de documentación técnica, en [docs/README.md](docs/README.md).

---

## 🆕 Últimos Cambios
### Sin versionar | Agosto – Octubre 2026

#### Agregado
- **Tests de todo el sitio**: 164 tests del front-end (`node:test` + `jsdom`) y 45 de los scripts Python; `npm test` y workflow de CI
- **Desarrollo guiado por especificación**: `specs/` con 180 requisitos numerados y trazabilidad requisito → test
- **Agentes de Claude Code**: `orquestador`, `frontend` y `tester` en `.claude/agents/`
- ✅ Local físico **@DoubleImpactStore** (junto a @NekketsuStore, Persa Bio Bio) en textos, meta tags y datos estructurados de todo el sitio.
- ✅ Documentación para desarrollo: `CLAUDE.md`, `AGENTS.md`, `MEMORY.md` y `docs/README.md`.

#### Corregido
- **Catálogo**: tras una búsqueda sin resultados ya no queda bloqueado; la búsqueda se combina con una sola plataforma e ignora espacios sobrantes; los nombres con `&` se muestran bien
- **Catálogo**: se redibuja al cambiar de idioma, la URL refleja la página del listado, y tolera nombres de plataforma inusuales y un caché dañado
- **Páginas 404 y de seguridad**: funcionan el tema y el menú móvil; **inglés**: traducciones y efemérides que faltaban
- **Idioma y robustez**: el selector marca el idioma vigente, el HTML dice lo mismo que el diccionario, y el service worker funciona aunque el caché del navegador falle
- ✅ `productos.html` no cargaba el catálogo tras la refactorización: faltaba incluir los módulos de `js/modules/`.
- ✅ La FAQ "¿Puedo ver los productos antes de comprar?" ahora indica el local del Persa Bio Bio en vez de decir que no hay showroom.
- ✅ Los posts de Instagram sincronizados por el bot ahora se despliegan automáticamente.
- ✅ `sitemap.xml` ya no lista páginas `noindex` y usa la URL canónica `/productos`.
- ✅ `old.html` ahora tiene Content Security Policy.

#### Eliminado
- ✅ `.htaccess` y `.htaccess.development`: GitHub Pages no los procesa, así que sus headers y redirecciones nunca estuvieron activos.

#### Cambiado
- ✅ Versionado de caché unificado: un solo valor `AAAA-MM-DD_N` en todo el sitio, administrado por `api/bump_version.py` y verificado antes de cada commit y de cada despliegue.

### Versión: v2.1.0 | Agosto 2026

#### Refactorización
- ✅ `js/index.js` descompuesto en 9 módulos independientes bajo `js/modules/`
- ✅ `js/modules/logger.js` — control de logs por ambiente (producción/desarrollo)
- ✅ `js/modules/cache.js` — sistema de caché con localStorage
- ✅ `js/modules/siglas.js` — carga, detección y renderizado de siglas
- ✅ `js/modules/utils.js` — sanitize, validate, sort y manejo de errores
- ✅ `js/modules/ui.js` — tema, idioma, traducciones ES/EN, FAQ, Blog, menú móvil
- ✅ `js/modules/products.js` — catálogo completo: tabla, filtros, paginación, modal
- ✅ `js/modules/instagram.js` — posts y filtros por consola con `console_aliases.json`
- ✅ `js/modules/efemerides.js` — efemérides del día
- ✅ `js/modules/analytics.js` — CSP, AdBlock y fallback analytics
- ✅ `js/index.js` reducido a 16 líneas (solo el orquestador DOMContentLoaded)
- ✅ `index.html` actualizado para cargar módulos en orden de dependencia (`v=2026-08-17_2`)

#### Corregido
- ✅ Botones de filtro de Instagram no aparecían al cargar (función `buildFilterButtons()` faltante)
- ✅ `detectConsole()` fallaba silenciosamente con la estructura `{ label, aliases }` de `console_aliases.json`
- ✅ `localStorage.setItem('language')` se ejecutaba después de `setLanguage()`, causando que `extractSiglas()` usara el idioma anterior

#### Cambiado
- ✅ `js/siglas.json` ahora tiene estructura bilingüe `{ "es": "...", "en": "..." }` por entrada
- ✅ `extractSiglas()` resuelve la descripción según el idioma activo en tiempo de ejecución
- ✅ `initLanguage()` guarda el idioma en localStorage **antes** de llamar `setLanguage()`
- ✅ Query strings actualizados a `v=2026-08-17_1` y `v=2026-08-17_2`



#### Agregado
- ✅ Servicio técnico de consolas retro y pulido de discos mencionados en todo el sitio.
- ✅ Nueva pregunta FAQ (ES+EN) sobre ambos servicios.
- ✅ 2 nuevos feature items en sección "Sobre Nosotros".
- ✅ Schema.org `knowsAbout` con los nuevos servicios para SEO.

#### Cambiado
- ✅ Meta tags, og:description y twitter:description de `index.html` y `productos.html`.
- ✅ Traducciones ES/EN actualizadas en `js/index.js`.
- ✅ `schema.json`, `structured-data.json` y `manifest.json` actualizados.

---

## 🆕 Otros Cambios
### Versión: v1.1.9 | May 2026

#### Cambiado
- ✅ Google Sheets actualizado al nuevo ID `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek` en todo el sistema.
- ✅ Query strings actualizados a `v=2026-05-09_1` en todos los archivos HTML.
- ✅ Service Worker actualizado a `ropavejero-v2026-05-09_1`.
- ✅ `js/index.min.js` regenerado con el nuevo Sheet ID.

---

## 🆕 Otros Cambios
### Versión: v1.1.8 | Mar 2026

#### Cambiado
- ✅ Versión unificada a `v=2026-03-16_7` en todos los archivos del sistema.
- ✅ `index.html`, `productos.html`, `404.html`, `security-policy.html`, `security-acknowledgments.html`, `old.html`, `service-worker.js` actualizados.
- ✅ `js/index.min.js` y `css/index.min.css` regenerados con todos los cambios acumulados.

---

## 🆕 Otros Cambios
### Versión: v1.1.7 | Mar 2026

#### Cambiado
- ✅ Google Sheets actualizado al nuevo ID `1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek`.
- ✅ Actualizado en `js/index.js`, `index.html`, `old.html` y `README.md`.
- ✅ Query strings actualizados a `v=2026-03-16_6`.
- ✅ Service Worker actualizado a `ropavejero-v2026-03-16_6`.

---

## 🆕 Otros Cambios
### Versión: v1.1.6 | Mar 2026

#### Agregado
- ✅ `initNavActive()` — marca el ítem activo del nav al hacer scroll en `index.html`.
- ✅ En `productos.html` el ítem "Productos" queda siempre marcado con la línea activa.

#### Corregido
- ✅ Orden CSS de `.nav-active::after` — la regla base sobreescribía el estado activo.

#### Cambiado
- ✅ Query strings actualizados a `v=2026-03-16_4`.
- ✅ Service Worker actualizado a `ropavejero-v2026-03-16_4`.

---

## 🆕 Otros Cambios
### Versión: v1.1.4 | Mar 2026

#### Corregido
- ✅ Guards de null en `.then` y `.catch` de `loadEfemerides()` para llamadas desde `setLanguage()`.
- ✅ Minificado regenerado correctamente (terser no estaba instalado en la iteración anterior).

#### Cambiado
- ✅ Query strings actualizados a `v=2026-03-16_3`.
- ✅ Service Worker actualizado a `ropavejero-v2026-03-16_3`.

---

## 🆕 Otros Cambios
### Versión: v1.1.3 | Mar 2026

#### Corregido
- ✅ `initBackToTop()` — guard de null para páginas sin logo-botón (ej: `productos.html`).
- ✅ `loadEfemerides()` — guard de null al no existir `#efemeridesCard`.
- ✅ `initBlogDialogs()` — guard de null al no existir `#blogDialogOverlay`.
- ✅ `updateProductsCounter()` — guard de null en contextos sin el contador.

#### Cambiado
- ✅ Query strings actualizados a `v=2026-03-16_2` en todos los HTML.
- ✅ Service Worker actualizado a `ropavejero-v2026-03-16_2`.
- ✅ `index.min.js` regenerado con los guards de null.

---

## 🆕 Otros Cambios
### Versión: v1.1.2 | Mar 2026

#### Añadido
- ✅ Página independiente `productos.html` accesible en `/productos`.
- ✅ URL limpia `https://ropavejeroretro.cl/productos` vía `.htaccess`.
- ✅ Breadcrumb de navegación en la página de productos.
- ✅ Schema.org `CollectionPage` para SEO en página de productos.
- ✅ Clase CSS `.nav-active` para resaltar ítem activo en el nav.

#### Cambiado
- ✅ Link "Productos" en el nav apunta a `/productos` (URL independiente).
- ✅ Query strings actualizados a `v=2026-03-16_1` en todos los HTML.
- ✅ Service Worker actualizado a `ropavejero-v2026-03-16_1`.
- ✅ Sitemap actualizado con la nueva URL `/productos`.

---

## 🆕 Otros Cambios
### Versión: v1.1.1 | Mar 2026

#### Añadido
- ✅ Sistema completo de siglas para productos del catálogo.
- ✅ Tooltips interactivos en tabla desktop (hover sobre productos).
- ✅ Sección visible de siglas en tarjetas móviles.
- ✅ Diccionario de siglas con 40+ abreviaturas (CIB, BL, GH, MM, etc.).
- ✅ Link de Instagram mejorado con gradiente oficial.

#### Mejorado
- ✅ Modal de detalles con sección dedicada de siglas.
- ✅ Detección precisa de múltiples siglas por producto.
- ✅ Experiencia de usuario en móvil con información siempre visible.

---

## 🆕 Otros Cambios
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
- 📦 **Versión Actual**: v2.1.0
- ⚡ **Performance**: 60-70% más rápido que v1.0.0

---

<div align="center">

**🎮 Ropavejero Retro - Todo lo Retro en un solo lugar 🎮**

[Website](https://ropavejeroretro.cl/) • [Instagram](https://www.instagram.com/ropavejero.retro/) • [WhatsApp](https://wa.me/56967691585)

© 2026 @Ropavejero.Retro - Todos los derechos reservados

</div>
