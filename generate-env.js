#!/usr/bin/env node
// ========== GENERADOR DE VARIABLES DE ENTORNO ==========
// Este script genera env.js desde las variables de entorno

const fs = require('fs');
const path = require('path');

// Función para leer archivo .env
function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo ${filePath} no encontrado`);
        return {};
    }
    
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
    
    return envVars;
}

// Determinar qué archivo .env usar
const environment = process.argv[2] || 'development';
const envFile = `.env.${environment}`;

console.log(`🔧 Generando env.js desde ${envFile}...`);

// Cargar variables de entorno
const envVars = loadEnvFile(envFile);

// Generar contenido de env.js
const jsContent = `// ========== VARIABLES DE ENTORNO - ${environment.toUpperCase()} ==========
// Generado automáticamente desde ${envFile}
// NO edites este archivo manualmente

window.ENV = {
    INSTAGRAM_ACCESS_TOKEN: '${envVars.INSTAGRAM_ACCESS_TOKEN || ''}',
    INSTAGRAM_USER_ID: '${envVars.INSTAGRAM_USER_ID || ''}',
    DEBUG_MODE: '${envVars.DEBUG_MODE || 'false'}'
};

// Generado el: ${new Date().toISOString()}
`;

// Escribir archivo env.js
fs.writeFileSync('env.js', jsContent);

console.log('✅ env.js generado exitosamente');
console.log(`📊 Variables cargadas:`);
console.log(`   - INSTAGRAM_ACCESS_TOKEN: ${envVars.INSTAGRAM_ACCESS_TOKEN ? 'SET' : 'NOT SET'}`);
console.log(`   - INSTAGRAM_USER_ID: ${envVars.INSTAGRAM_USER_ID ? 'SET' : 'NOT SET'}`);
console.log(`   - DEBUG_MODE: ${envVars.DEBUG_MODE || 'false'}`);

// Verificar que env.js está en .gitignore
const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
if (!gitignoreContent.includes('env.js')) {
    console.log('⚠️  ADVERTENCIA: env.js no está en .gitignore');
} else {
    console.log('🔒 env.js está protegido por .gitignore');
}