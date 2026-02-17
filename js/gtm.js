/**
 * Google Tag Manager + GA4 (unificado)
 * GTM Container ID: GTM-5D6LZB66
 * GA4 Measurement ID: G-GCE8SP8NBZ
 *
 * Esta versión carga GTM y además inyecta el snippet de GA4 (gtag) desde un único fichero.
 */
(function(){
  'use strict';

  const GTM_ID = 'GTM-5D6LZB66';
  const GA_MEASUREMENT_ID = 'G-GCE8SP8NBZ';

  function ensureDataLayer(){
    window.dataLayer = window.dataLayer || [];
  }

  function injectScript(src, attrs){
    const s = document.createElement('script');
    s.async = true;
    if (attrs) Object.keys(attrs).forEach(k => s[k] = attrs[k]);
    s.src = src;
    const ref = document.getElementsByTagName('script')[0];
    if (ref && ref.parentNode) ref.parentNode.insertBefore(s, ref); else document.head.appendChild(s);
    return s;
  }

  function initGtag(){
    ensureDataLayer();
    if (window.gtagInitialized) return; // idempotente

    // gtag() pushes to dataLayer — compatible con GTM
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtagInitialized = true;

    // Cargar librería gtag.js y configurar la propiedad GA4
    injectScript('https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('GA4 (gtag) initialized:', GA_MEASUREMENT_ID);
    }
  }

  function initGTM(){
    ensureDataLayer();
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    injectScript('https://www.googletagmanager.com/gtm.js?id=' + GTM_ID);

    // Inicializar gtag (uso compartido de dataLayer) — idempotente
    initGtag();

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('Google Tag Manager initialized:', GTM_ID);
    }
  }

  function getGTMNoscript(){
    return '<iframe src="https://www.googletagmanager.com/ns.html?id=' + GTM_ID + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGTM); else initGTM();

  window.GTM = { init: initGTM, getNoscript: getGTMNoscript, containerId: GTM_ID };
  window.GTAG = { init: initGtag, measurementId: GA_MEASUREMENT_ID };
})();
