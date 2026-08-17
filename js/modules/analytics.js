// ========== MÓDULO: ANALYTICS ==========

// ========== MANEJO DE RECURSOS BLOQUEADOS Y CORS ==========
// Función para detectar si Cloudflare Analytics está bloqueado o tiene problemas CORS
function detectBlockedResources() {
    const blockedResources = {
        cloudflareAnalytics: false,
        adBlockerDetected: false,
        corsBlocked: false,
        browserBlocked: false
    };
    
    // Detectar si Cloudflare Analytics está disponible
    setTimeout(() => {
        const hasCloudflare = typeof window.__CF$cv$params !== 'undefined' || 
                             typeof window.cloudflare !== 'undefined';
        
        if (!hasCloudflare) {
            blockedResources.cloudflareAnalytics = true;
            
            // Detectar tipo de bloqueo basado en el navegador
            const userAgent = navigator.userAgent.toLowerCase();
            const isBrave = navigator.brave && typeof navigator.brave.isBrave === 'function';
            const isOpera = userAgent.includes('opr/') || userAgent.includes('opera');
            const isDuckDuckGo = userAgent.includes('duckduckgo');
            
            if (isBrave || isOpera || isDuckDuckGo) {
                blockedResources.corsBlocked = true;
                blockedResources.browserBlocked = true;
            } else {
                blockedResources.adBlockerDetected = true;
            }
            
            // Log solo en desarrollo con información específica
            if (window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1') {
                if (blockedResources.corsBlocked) {
                    console.info('🛡️ Cloudflare bloqueado por política CORS del navegador (Brave/Opera/DuckDuckGo)');
                } else {
                    console.info('🛡️ Cloudflare Analytics bloqueado por AdBlocker (normal)');
                }
            }
            
            // Implementar analytics alternativo
            initFallbackAnalytics();
        }
    }, 3000); // Aumentar tiempo de espera para navegadores lentos
    
    return blockedResources;
}

// Analytics alternativo mejorado para diferentes navegadores
function initFallbackAnalytics() {
    // Solo si realmente necesitas analytics básicos
    const analytics = {
        pageView: function(page) {
            // Implementar tracking básico sin cookies ni scripts externos
            if (navigator.sendBeacon && window.location.hostname !== 'localhost') {
                const data = {
                    page: page || window.location.pathname,
                    referrer: document.referrer,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent.substring(0, 100), // Truncar para privacidad
                    browser: getBrowserInfo(),
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                };
                
                // Enviar a tu propio endpoint (opcional)
                // navigator.sendBeacon('/api/analytics', JSON.stringify(data));
                
                // Log en desarrollo
                if (window.location.hostname === 'localhost') {
                    console.debug('📊 Fallback Analytics - Page View:', data);
                }
            }
        },
        
        event: function(category, action, label, value) {
            // Tracking de eventos básico
            if (navigator.sendBeacon && window.location.hostname !== 'localhost') {
                const data = {
                    type: 'event',
                    category: category,
                    action: action,
                    label: label,
                    value: value,
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname
                };
                
                // Enviar a tu propio endpoint (opcional)
                // navigator.sendBeacon('/api/analytics', JSON.stringify(data));
                
                // Log en desarrollo
                if (window.location.hostname === 'localhost') {
                    console.debug('📊 Fallback Analytics - Event:', data);
                }
            }
        }
    };
    
    // Hacer disponible globalmente
    window.fallbackAnalytics = analytics;
    
    // Track página inicial
    analytics.pageView();
    
    // Log de activación
    if (window.location.hostname === 'localhost') {
        console.info('📊 Fallback Analytics activado');
    }
}

// Función para obtener información del navegador
function getBrowserInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
        return 'Brave';
    } else if (userAgent.includes('edg/')) {
        return 'Edge';
    } else if (userAgent.includes('opr/') || userAgent.includes('opera')) {
        return 'Opera';
    } else if (userAgent.includes('chrome/')) {
        return 'Chrome';
    } else if (userAgent.includes('firefox/')) {
        return 'Firefox';
    } else if (userAgent.includes('safari/') && !userAgent.includes('chrome/')) {
        return 'Safari';
    } else if (userAgent.includes('duckduckgo')) {
        return 'DuckDuckGo';
    } else {
        return 'Unknown';
    }
}

// Función mejorada para manejar errores de carga de recursos
function handleResourceError(event) {
    const resource = event.target;
    const resourceUrl = resource.src || resource.href;
    
    if (resourceUrl && resourceUrl.includes('cloudflareinsights.com')) {
        const browserInfo = getBrowserInfo();
        
        // Cloudflare bloqueado - comportamiento normal
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            
            if (['Brave', 'Opera', 'DuckDuckGo'].includes(browserInfo)) {
                console.info(`🛡️ Cloudflare bloqueado por política CORS de ${browserInfo} (normal)`);
            } else {
                console.info('🛡️ Cloudflare Analytics bloqueado por cliente (AdBlocker)');
            }
        }
        
        // Inicializar analytics alternativo si no está ya inicializado
        if (!window.fallbackAnalytics) {
            initFallbackAnalytics();
        }
    } else if (resourceUrl) {
        // Otros recursos bloqueados
        if (window.location.hostname === 'localhost') {
            console.warn('⚠️ Recurso bloqueado:', resourceUrl);
        }
    }
}

// Escuchar errores de carga de recursos
window.addEventListener('error', handleResourceError, true);

// Detectar recursos bloqueados al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    detectBlockedResources();
});

// ========== MANEJO DE CSP Y RECURSOS BLOQUEADOS ==========
// Función para reportar violaciones de CSP
function handleCSPViolation(violationEvent) {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.hostname.includes('localhost');
    
    // Filtrar violaciones comunes de AdBlockers y CORS
    const isAdBlockerViolation = violationEvent.blockedURI && (
        violationEvent.blockedURI.includes('cloudflareinsights.com') ||
        violationEvent.blockedURI.includes('google-analytics.com') ||
        violationEvent.blockedURI.includes('googletagmanager.com')
    );
    
    const isCorsViolation = violationEvent.violatedDirective && 
                           violationEvent.violatedDirective.includes('script-src') &&
                           violationEvent.blockedURI && 
                           violationEvent.blockedURI.includes('cloudflareinsights.com');
    
    if (isAdBlockerViolation || isCorsViolation) {
        // No reportar violaciones de AdBlockers o CORS como errores
        if (isDevelopment) {
            const browserInfo = getBrowserInfo();
            if (['Brave', 'Opera', 'DuckDuckGo'].includes(browserInfo)) {
                console.info(`🛡️ ${browserInfo} bloqueó por CORS:`, violationEvent.blockedURI);
            } else {
                console.info('🛡️ AdBlocker bloqueó:', violationEvent.blockedURI);
            }
        }
        return;
    }
    
    // Log detallado en desarrollo para violaciones reales
    if (isDevelopment) {
        console.group('🔒 CSP Violation Detected');
        console.warn('Blocked URI:', violationEvent.blockedURI);
        console.warn('Violated Directive:', violationEvent.violatedDirective);
        console.warn('Original Policy:', violationEvent.originalPolicy);
        console.warn('Document URI:', violationEvent.documentURI);
        console.warn('Source File:', violationEvent.sourceFile);
        console.warn('Line Number:', violationEvent.lineNumber);
        console.groupEnd();
        
        // Sugerencia para desarrolladores
        if (violationEvent.blockedURI && violationEvent.blockedURI !== 'eval') {
            try {
                console.info('💡 Tip: Add this domain to CSP if it\'s trusted:', 
                            new URL(violationEvent.blockedURI).hostname);
            } catch (e) {
                // URL inválida, ignorar
            }
        }
    }
    
    // En producción, enviar solo violaciones reales a servicio de logging
    if (!isDevelopment && typeof fetch !== 'undefined') {
        // Ejemplo de envío a endpoint de logging
        /*
        fetch('/api/csp-violation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blockedURI: violationEvent.blockedURI,
                violatedDirective: violationEvent.violatedDirective,
                documentURI: violationEvent.documentURI,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                browser: getBrowserInfo()
            })
        }).catch(err => console.error('Failed to report CSP violation:', err));
        */
    }
}

// Escuchar violaciones de CSP
document.addEventListener('securitypolicyviolation', handleCSPViolation);

// Función para verificar si un dominio está permitido en CSP
function isAllowedByCSP(url) {
    const allowedDomains = [
        'docs.google.com',
        'static.cloudflareinsights.com',
        'cloudflareinsights.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];
    
    try {
        const urlObj = new URL(url);
        return allowedDomains.some(domain => 
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
    } catch (e) {
        return false;
    }
}

// Función para validar recursos antes de cargarlos dinámicamente
function loadResourceSafely(url, type = 'script') {
    return new Promise((resolve, reject) => {
        if (!isAllowedByCSP(url)) {
            reject(new Error(`URL not allowed by CSP: ${url}`));
            return;
        }
        
        let element;
        
        if (type === 'script') {
            element = document.createElement('script');
            element.src = url;
            element.async = true;
            
            // Manejar específicamente scripts de Cloudflare
            if (url.includes('cloudflareinsights.com')) {
                element.onerror = (error) => {
                    const browserInfo = getBrowserInfo();
                    
                    // Diferentes mensajes según el navegador
                    if (['Brave', 'Opera', 'DuckDuckGo'].includes(browserInfo)) {
                        console.info(`🛡️ Cloudflare bloqueado por política CORS de ${browserInfo} (comportamiento normal)`);
                    } else {
                        console.info('🛡️ Cloudflare Analytics bloqueado por AdBlocker (comportamiento normal)');
                    }
                    
                    // Activar analytics alternativo
                    if (!window.fallbackAnalytics) {
                        initFallbackAnalytics();
                    }
                    
                    resolve(null); // Resolver como éxito para evitar errores
                };
                
                // También manejar eventos de carga exitosa
                element.onload = () => {
                    console.debug('✅ Cloudflare Analytics cargado exitosamente');
                    resolve(element);
                };
            } else {
                element.onerror = () => reject(new Error(`Failed to load ${type}: ${url}`));
                element.onload = () => resolve(element);
            }
        } else if (type === 'style') {
            element = document.createElement('link');
            element.rel = 'stylesheet';
            element.href = url;
            element.onerror = () => reject(new Error(`Failed to load ${type}: ${url}`));
            element.onload = () => resolve(element);
        } else {
            reject(new Error(`Unsupported resource type: ${type}`));
            return;
        }
        
        document.head.appendChild(element);
    });
}

// Función para inicializar Cloudflare Analytics de manera resiliente
function initCloudflareAnalytics() {
    // Verificar si ya está cargado
    if (typeof window.__CF$cv$params !== 'undefined' || 
        typeof window.cloudflare !== 'undefined') {
        return Promise.resolve();
    }
    
    // Intentar cargar Cloudflare Analytics
    const cloudflareScript = document.querySelector('script[src*="cloudflareinsights.com"]');
    if (cloudflareScript) {
        return new Promise((resolve) => {
            // Esperar más tiempo para navegadores con políticas estrictas
            setTimeout(() => {
                if (typeof window.__CF$cv$params === 'undefined') {
                    // No se cargó, probablemente bloqueado
                    const browserInfo = getBrowserInfo();
                    
                    if (window.location.hostname === 'localhost') {
                        if (['Brave', 'Opera', 'DuckDuckGo'].includes(browserInfo)) {
                            console.info(`🛡️ ${browserInfo} bloqueó Cloudflare por CORS (activando alternativo)`);
                        } else {
                            console.info('🛡️ Cloudflare bloqueado (activando alternativo)');
                        }
                    }
                    
                    // Activar analytics alternativo
                    if (!window.fallbackAnalytics) {
                        initFallbackAnalytics();
                    }
                }
                resolve();
            }, 4000); // Aumentar tiempo de espera
        });
    }
    
    return Promise.resolve();
}

// ========== INICIALIZACIÓN DE ANALYTICS ==========
// Inicializar analytics al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Cloudflare Analytics de manera resiliente
    initCloudflareAnalytics();
    
    // Detectar recursos bloqueados después de un tiempo
    setTimeout(() => {
        detectBlockedResources();
    }, 1000);
});

// Función para track de eventos personalizados (compatible con ambos sistemas)
function trackEvent(category, action, label, value) {
    // Intentar usar Cloudflare Analytics si está disponible
    if (typeof window.__CF$cv$params !== 'undefined' && window.cloudflare) {
        // Cloudflare Analytics está disponible
        try {
            // Implementar tracking específico de Cloudflare si es necesario
            console.debug('Cloudflare Analytics event:', { category, action, label, value });
        } catch (e) {
            console.warn('Error tracking with Cloudflare:', e);
        }
    }
    
    // Usar analytics alternativo si está disponible
    if (window.fallbackAnalytics) {
        window.fallbackAnalytics.event(category, action, label);
    }
}

// Hacer disponible globalmente para uso en otros scripts
window.trackEvent = trackEvent;

// Función para track de violaciones de recursos (alias para handleCSPViolation)
function trackResourceViolation(violationEvent) {
    handleCSPViolation(violationEvent);
}

// Función para reportar violaciones de CSP (alias público)
function reportCSPViolation(violationEvent) {
    handleCSPViolation(violationEvent);
}
