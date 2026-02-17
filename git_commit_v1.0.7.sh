#!/bin/bash

# Script para realizar el commit de la versión 1.0.7
# Mejoras de SEO e Indexación

echo "=================================================="
echo "🚀 Git Commit Script - v1.0.7"
echo "   SEO & Indexación Improvements"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Rama actual: ${CURRENT_BRANCH}${NC}"
echo ""

# Mostrar estado actual
echo -e "${YELLOW}📊 Estado de Git:${NC}"
git status --short
echo ""

# Mostrar archivos que serán commiteados
echo -e "${YELLOW}📝 Archivos en staging:${NC}"
git diff --cached --name-status
echo ""

# Mostrar resumen de cambios
echo -e "${YELLOW}📈 Resumen de cambios:${NC}"
echo "  - 10 archivos modificados"
echo "  - 1 archivo nuevo (docs/SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md)"
echo ""
echo "Archivos modificados:"
echo "  ✏️  index.html (footer con enlaces)"
echo "  ✏️  sitemap.xml (3 URLs agregadas)"
echo "  ✏️  robots.txt (restricciones eliminadas)"
echo "  ✏️  security-policy.html (meta tags)"
echo "  ✏️  security-acknowledgments.html (meta tags)"
echo "  ✏️  css/index.css (estilos footer)"
echo "  ✏️  css/index.min.css (minificado)"
echo "  ✏️  js/index.js (traducciones)"
echo "  ✏️  js/index.min.js (minificado)"
echo "  ✏️  README.md (documentación)"
echo ""
echo "Archivos nuevos:"
echo "  ✨ docs/SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md"
echo ""

# Preguntar confirmación
echo -e "${YELLOW}⚠️  IMPORTANTE: Este script NO ejecutará el commit automáticamente.${NC}"
echo -e "${YELLOW}   Solo te mostrará el comando que debes ejecutar.${NC}"
echo ""

# Mostrar el mensaje de commit
echo -e "${GREEN}📋 Mensaje de commit:${NC}"
echo "=================================================="
cat COMMIT_MESSAGE.txt
echo "=================================================="
echo ""

# Mostrar comandos a ejecutar
echo -e "${GREEN}✅ Comandos para ejecutar:${NC}"
echo ""
echo "1. Revisar los cambios:"
echo "   ${YELLOW}git diff --cached${NC}"
echo ""
echo "2. Hacer el commit:"
echo "   ${YELLOW}git commit -F COMMIT_MESSAGE.txt${NC}"
echo ""
echo "3. Ver el commit creado:"
echo "   ${YELLOW}git log -1 --stat${NC}"
echo ""
echo "4. Push a remoto (cuando estés listo):"
echo "   ${YELLOW}git push origin ${CURRENT_BRANCH}${NC}"
echo ""

# Verificaciones pre-commit
echo -e "${GREEN}🔍 Verificaciones recomendadas antes de commit:${NC}"
echo ""
echo "✓ Verificar que todos los archivos estén en staging:"
echo "  git status"
echo ""
echo "✓ Revisar cambios específicos:"
echo "  git diff --cached index.html"
echo "  git diff --cached sitemap.xml"
echo "  git diff --cached robots.txt"
echo ""
echo "✓ Validar HTML (opcional):"
echo "  npx html-validate index.html security-policy.html security-acknowledgments.html"
echo ""
echo "✓ Validar XML (opcional):"
echo "  xmllint --noout sitemap.xml"
echo ""

# Checklist
echo -e "${GREEN}📋 Checklist Pre-Commit:${NC}"
echo ""
echo "  [ ] Todos los archivos están en staging"
echo "  [ ] CSS minificado correctamente"
echo "  [ ] JavaScript minificado correctamente"
echo "  [ ] Traducciones agregadas (ES/EN)"
echo "  [ ] Sitemap.xml válido"
echo "  [ ] Robots.txt actualizado"
echo "  [ ] Meta tags actualizados"
echo "  [ ] README.md actualizado"
echo "  [ ] Documentación creada"
echo ""

# Checklist Post-Commit
echo -e "${GREEN}📋 Checklist Post-Deploy:${NC}"
echo ""
echo "  [ ] Verificar sitio en producción"
echo "  [ ] Probar enlaces del footer"
echo "  [ ] Verificar traducciones (ES/EN)"
echo "  [ ] Probar responsive en móvil"
echo "  [ ] Enviar sitemap a Google Search Console"
echo "  [ ] Solicitar indexación de páginas individuales"
echo "  [ ] Monitorear GSC durante 1-2 semanas"
echo ""

# Información adicional
echo -e "${YELLOW}📚 Documentación:${NC}"
echo "  - docs/SEO_INDEXATION_IMPROVEMENTS_v1.0.7.md"
echo "  - README.md (actualizado)"
echo "  - COMMIT_MESSAGE.txt (este mensaje)"
echo ""

echo -e "${GREEN}✅ Script completado. Revisa la información y ejecuta los comandos manualmente.${NC}"
echo ""
