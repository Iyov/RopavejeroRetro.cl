// ========== MÓDULO: LOGGER ==========
// IIFE log control — desactiva console.log y console.info en producción

(function() {
    const hostname = window.location.hostname;
    // Lista de dominios de desarrollo
    const devDomains = ['localhost', '127.0.0.1'];
    
    // Si NO estamos en un dominio de desarrollo, desactivar logs no críticos
    if (!devDomains.includes(hostname)) {
        // Guardar referencia original por si se necesita debuggear en consola (opcional)
        window.__console_log_original = console.log;
        window.__console_info_original = console.info;
        
        // Sobrescribir con función vacía
        console.log = function() {};
        console.info = function() {};
        
        // console.warn y console.error se mantienen activos para monitoreo de errores
        // console.warn('Modo Producción: Logs detallados desactivados');
    } else {
        console.log('🔧 Modo Desarrollo detectado: Logs activados');
    }
})();
