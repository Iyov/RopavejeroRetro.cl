#!/bin/bash
# ========== GENERADOR DE VARIABLES DE ENTORNO (BASH) ==========
# Este script genera env.js desde las variables de entorno

# Determinar entorno (development o production)
ENVIRONMENT=${1:-development}
ENV_FILE=".env.$ENVIRONMENT"

echo "🔧 Generando env.js desde $ENV_FILE..."

# Verificar que el archivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Archivo $ENV_FILE no encontrado"
    echo "📝 Creando env.js con valores por defecto..."
    
    cat > env.js << EOF
// ========== VARIABLES DE ENTORNO - DEFAULT ==========
// Archivo .env no encontrado, usando valores por defecto

window.ENV = {
    INSTAGRAM_ACCESS_TOKEN: '',
    INSTAGRAM_USER_ID: '',
    DEBUG_MODE: 'false'
};

// Generado el: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
    
    echo "✅ env.js creado con valores por defecto"
    exit 0
fi

# Leer variables del archivo .env
INSTAGRAM_ACCESS_TOKEN=$(grep "^INSTAGRAM_ACCESS_TOKEN=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"')
INSTAGRAM_USER_ID=$(grep "^INSTAGRAM_USER_ID=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"')
DEBUG_MODE=$(grep "^DEBUG_MODE=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"')

# Valores por defecto si no se encuentran
INSTAGRAM_ACCESS_TOKEN=${INSTAGRAM_ACCESS_TOKEN:-""}
INSTAGRAM_USER_ID=${INSTAGRAM_USER_ID:-""}
DEBUG_MODE=${DEBUG_MODE:-"false"}

# Generar env.js
cat > env.js << EOF
// ========== VARIABLES DE ENTORNO - ${ENVIRONMENT^^} ==========
// Generado automáticamente desde $ENV_FILE
// NO edites este archivo manualmente

window.ENV = {
    INSTAGRAM_ACCESS_TOKEN: '$INSTAGRAM_ACCESS_TOKEN',
    INSTAGRAM_USER_ID: '$INSTAGRAM_USER_ID',
    DEBUG_MODE: '$DEBUG_MODE'
};

// Generado el: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo "✅ env.js generado exitosamente"
echo "📊 Variables cargadas:"
echo "   - INSTAGRAM_ACCESS_TOKEN: $([ -n "$INSTAGRAM_ACCESS_TOKEN" ] && echo "SET" || echo "NOT SET")"
echo "   - INSTAGRAM_USER_ID: $([ -n "$INSTAGRAM_USER_ID" ] && echo "SET" || echo "NOT SET")"
echo "   - DEBUG_MODE: $DEBUG_MODE"

# Verificar que env.js está en .gitignore
if grep -q "env.js" .gitignore; then
    echo "🔒 env.js está protegido por .gitignore"
else
    echo "⚠️  ADVERTENCIA: env.js no está en .gitignore"
fi