// ========== EJEMPLO DE VARIABLES DE ENTORNO ==========
// Copia este archivo como 'env.js' para desarrollo local
// En producción, este archivo se genera automáticamente desde .env.production

window.ENV = {
    // Instagram API (pon aquí tus credenciales para desarrollo)
    INSTAGRAM_ACCESS_TOKEN: 'tu_token_de_desarrollo_aqui',
    INSTAGRAM_USER_ID: 'tu_user_id_aqui',
    DEBUG_MODE: 'true'
};

// 📝 INSTRUCCIONES:
// 1. Copia este archivo: cp env.example.js env.js
// 2. Edita env.js con tus credenciales reales
// 3. El archivo env.js está en .gitignore, así que es seguro

// 🔒 SEGURIDAD:
// - env.js NO se sube a GitHub (está en .gitignore)
// - En producción se genera automáticamente desde .env.production
// - Mantén tus credenciales seguras