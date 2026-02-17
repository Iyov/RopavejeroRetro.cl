/**
 * Google Tag Manager Integration
 * Container ID: GTM-5D6LZB66
 * 
 * This module provides the Google Tag Manager implementation for RopavejeroRetro.cl
 * It should be included in all HTML pages to enable analytics and tracking.
 */

(function() {
    'use strict';
    
    /**
     * Initialize Google Tag Manager
     * This function injects the GTM script into the page
     */
    function initGTM() {
        // GTM Container ID
        const GTM_ID = 'GTM-5D6LZB66';
        
        // Create dataLayer if it doesn't exist
        window.dataLayer = window.dataLayer || [];
        
        // Push GTM initialization
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        
        // Create and inject GTM script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
        
        // Insert script as first script in head
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.head.appendChild(script);
        }
        
        // Log initialization (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Google Tag Manager initialized:', GTM_ID);
        }
    }
    
    /**
     * Get GTM noscript iframe HTML
     * This should be placed immediately after the opening <body> tag
     */
    function getGTMNoscript() {
        return '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5D6LZB66" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    }
    
    // Auto-initialize GTM when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGTM);
    } else {
        initGTM();
    }
    
    // Export for manual usage if needed
    window.GTM = {
        init: initGTM,
        getNoscript: getGTMNoscript,
        containerId: 'GTM-5D6LZB66'
    };
})();
