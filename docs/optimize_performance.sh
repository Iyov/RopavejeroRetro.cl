#!/bin/bash

# Script de Optimización de Rendimiento para Ropavejero Retro
# Fecha: 16 de Febrero de 2026

echo "🚀 Iniciando optimización de rendimiento..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Verificar dependencias
echo -e "\n${YELLOW}📋 Verificando dependencias...${NC}"

MISSING_DEPS=()

if ! command_exists "node"; then
    MISSING_DEPS+=("node")
fi

if ! command_exists "npm"; then
    MISSING_DEPS+=("npm")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Faltan dependencias: ${MISSING_DEPS[*]}${NC}"
    echo "Por favor instala las dependencias faltantes antes de continuar."
    exit 1
fi

echo -e "${GREEN}✅ Todas las dependencias están instaladas${NC}"

# 2. Instalar herramientas de optimización si no existen
echo -e "\n${YELLOW}📦 Instalando herramientas de optimización...${NC}"

if ! command_exists "terser"; then
    npm install -g terser
fi

if ! command_exists "csso"; then
    npm install -g csso-cli
fi

if ! command_exists "html-minifier"; then
    npm install -g html-minifier
fi

echo -e "${GREEN}✅ Herramientas instaladas${NC}"

# 3. Crear directorio de backup
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo -e "\n${YELLOW}💾 Creando backup en ${BACKUP_DIR}...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r css js index.html "$BACKUP_DIR/"
echo -e "${GREEN}✅ Backup creado${NC}"

# 4. Minificar JavaScript
echo -e "\n${YELLOW}⚡ Minificando JavaScript...${NC}"

# Minificar index.js
if [ -f "js/index.js" ]; then
    terser js/index.js \
        --compress \
        --mangle \
        --output js/index.min.js \
        --source-map "url=index.min.js.map"
    
    ORIGINAL_SIZE=$(wc -c < "js/index.js")
    MINIFIED_SIZE=$(wc -c < "js/index.min.js")
    SAVINGS=$((100 - (MINIFIED_SIZE * 100 / ORIGINAL_SIZE)))
    
    echo -e "${GREEN}✅ index.js minificado (ahorro: ${SAVINGS}%)${NC}"
fi

# Minificar instagram_posts.js
if [ -f "js/instagram_posts.js" ]; then
    terser js/instagram_posts.js \
        --compress \
        --mangle \
        --output js/instagram_posts.min.js \
        --source-map "url=instagram_posts.min.js.map"
    
    ORIGINAL_SIZE=$(wc -c < "js/instagram_posts.js")
    MINIFIED_SIZE=$(wc -c < "js/instagram_posts.min.js")
    SAVINGS=$((100 - (MINIFIED_SIZE * 100 / ORIGINAL_SIZE)))
    
    echo -e "${GREEN}✅ instagram_posts.js minificado (ahorro: ${SAVINGS}%)${NC}"
fi

# Minificar app.js
if [ -f "js/app.js" ]; then
    terser js/app.js \
        --compress \
        --mangle \
        --output js/app.min.js \
        --source-map "url=app.min.js.map"
    
    ORIGINAL_SIZE=$(wc -c < "js/app.js")
    MINIFIED_SIZE=$(wc -c < "js/app.min.js")
    SAVINGS=$((100 - (MINIFIED_SIZE * 100 / ORIGINAL_SIZE)))
    
    echo -e "${GREEN}✅ app.js minificado (ahorro: ${SAVINGS}%)${NC}"
fi

# 5. Minificar CSS
echo -e "\n${YELLOW}🎨 Minificando CSS...${NC}"

# Minificar index.css
if [ -f "css/index.css" ]; then
    csso css/index.css --output css/index.min.css
    
    ORIGINAL_SIZE=$(wc -c < "css/index.css")
    MINIFIED_SIZE=$(wc -c < "css/index.min.css")
    SAVINGS=$((100 - (MINIFIED_SIZE * 100 / ORIGINAL_SIZE)))
    
    echo -e "${GREEN}✅ index.css minificado (ahorro: ${SAVINGS}%)${NC}"
fi

# Minificar app.css
if [ -f "css/app.css" ]; then
    csso css/app.css --output css/app.min.css
    
    ORIGINAL_SIZE=$(wc -c < "css/app.css")
    MINIFIED_SIZE=$(wc -c < "css/app.min.css")
    SAVINGS=$((100 - (MINIFIED_SIZE * 100 / ORIGINAL_SIZE)))
    
    echo -e "${GREEN}✅ app.css minificado (ahorro: ${SAVINGS}%)${NC}"
fi

# 6. Optimizar imágenes (si imagemagick está instalado)
if command_exists "convert"; then
    echo -e "\n${YELLOW}🖼️  Optimizando imágenes...${NC}"
    
    # Optimizar JPEGs
    find img -name "*.jpg" -o -name "*.jpeg" | while read img; do
        convert "$img" -strip -quality 85 -interlace Plane "$img"
        echo -e "${GREEN}✅ Optimizado: $img${NC}"
    done
    
    # Optimizar PNGs
    if command_exists "optipng"; then
        find img -name "*.png" | while read img; do
            optipng -o7 "$img"
            echo -e "${GREEN}✅ Optimizado: $img${NC}"
        done
    fi
else
    echo -e "${YELLOW}⚠️  ImageMagick no instalado, saltando optimización de imágenes${NC}"
    echo "   Instala con: sudo apt-get install imagemagick (Linux)"
    echo "   o: brew install imagemagick (macOS)"
fi

# 7. Generar reporte
echo -e "\n${YELLOW}📊 Generando reporte de optimización...${NC}"

REPORT_FILE="docs/optimization_report_$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" << EOF
=================================================
REPORTE DE OPTIMIZACIÓN DE RENDIMIENTO
Fecha: $(date)
=================================================

ARCHIVOS MINIFICADOS:
EOF

# Agregar información de archivos JS
for file in js/*.min.js; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file" | numfmt --to=iec)
        echo "  - $file: $SIZE" >> "$REPORT_FILE"
    fi
done

# Agregar información de archivos CSS
for file in css/*.min.css; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file" | numfmt --to=iec)
        echo "  - $file: $SIZE" >> "$REPORT_FILE"
    fi
done

cat >> "$REPORT_FILE" << EOF

BACKUP CREADO EN:
  - $BACKUP_DIR/

PRÓXIMOS PASOS:
  1. Verificar que el sitio funcione correctamente
  2. Ejecutar Lighthouse para medir mejoras
  3. Probar en dispositivos móviles reales
  4. Considerar implementar CDN
  5. Configurar compresión gzip/brotli en servidor

COMANDOS ÚTILES:
  - Lighthouse: lighthouse https://ropavejeroretro.cl --view
  - Rollback: cp -r $BACKUP_DIR/* .
  - Limpiar backups: rm -rf backup_*

=================================================
EOF

echo -e "${GREEN}✅ Reporte generado: $REPORT_FILE${NC}"

# 8. Resumen final
echo -e "\n${GREEN}🎉 ¡Optimización completada!${NC}"
echo -e "\n${YELLOW}📋 Resumen:${NC}"
echo "  - Archivos JavaScript minificados"
echo "  - Archivos CSS minificados"
echo "  - Backup creado en: $BACKUP_DIR"
echo "  - Reporte generado: $REPORT_FILE"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  1. Prueba el sitio antes de hacer deploy"
echo "  2. Verifica que todos los archivos .min.js y .min.css funcionen"
echo "  3. Ejecuta Lighthouse para medir mejoras"
echo ""
echo -e "${GREEN}✨ ¡Listo para deploy!${NC}"
