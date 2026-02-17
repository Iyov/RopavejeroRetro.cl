/**
 * Google Tracking (GTM + GA4)
 * Implementación unificada de Google Tag Manager y Google Analytics 4
 * 
 * Uso:
 * <script src="js/google-tracking.min.js?v=VERSION" defer data-gtm-id="GTM-XXXXXXXX" data-ga-id="G-XXXXXXXXXX"></script>
 */
(function() {
    'use strict';

    // Obtener IDs desde los atributos data del script
    const currentScript = document.currentScript || document.querySelector('script[data-gtm-id]');
    
    if (!currentScript) {
        console.warn('Google Tracking: No se pudo encontrar el script con data-gtm-id');
        return;
    }

    const GTM_ID = currentScript.getAttribute('data-gtm-id');
    const GA_ID = currentScript.getAttribute('data-ga-id');

    if (!GTM_ID || !GA_ID) {
        console.error('Google Tracking: Faltan los IDs de GTM o GA4');
        return;
    }

    const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);

    // Inicializar dataLayer
    window.dataLayer = window.dataLayer || [];

    /**
     * Función gtag para GA4
     */
    function gtag() {
        window.dataLayer.push(arguments);
    }

    /**
     * Inicializar Google Tag Manager
     */
    function initGTM() {
        // Push del evento GTM
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        // Crear e inyectar el script de GTM
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
        
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(gtmScript, firstScript);

        if (isDev) {
            console.log('✅ Google Tag Manager inicializado:', GTM_ID);
        }
    }

    /**
     * Inicializar Google Analytics 4
     */
    function initGA4() {
        // Definir gtag globalmente
        window.gtag = gtag;
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
            'send_page_view': true,
            'anonymize_ip': true
        });

        // Crear e inyectar el script de GA4
        const ga4Script = document.createElement('script');
        ga4Script.async = true;
        ga4Script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(ga4Script, firstScript);

        if (isDev) {
            console.log('✅ Google Analytics 4 inicializado:', GA_ID);
        }
    }

    /**
     * Inicializar todo el tracking
     */
    function init() {
        try {
            initGTM();
            initGA4();
            
            if (isDev) {
                console.log('📊 Google Tracking completamente inicializado');
                console.log('   - GTM ID:', GTM_ID);
                console.log('   - GA4 ID:', GA_ID);
            }
        } catch (error) {
            console.error('Error inicializando Google Tracking:', error);
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer API pública
    window.GoogleTracking = {
        gtmId: GTM_ID,
        gaId: GA_ID,
        gtag: gtag,
        dataLayer: window.dataLayer
    };

})();
