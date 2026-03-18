(() => {
    const GTM_ID = 'GTM-5D6LZB66';
    const GA4_ID = 'G-GCE8SP8NBZ';
    const html = document.documentElement;
    const body = document.body;
    const canonicalElement = document.querySelector('link[rel="canonical"]');
    const descriptionElement = document.querySelector('meta[name="description"]');
    const pageType = (body && body.dataset.pageType) || 'website';
    const canonicalUrl = canonicalElement ? canonicalElement.href : window.location.href;
    const metaDescription = descriptionElement ? descriptionElement.content : '';
    const dataLayerName = 'dataLayer';

    window[dataLayerName] = window[dataLayerName] || [];
    window.gtag = window.gtag || function gtag() {
        window[dataLayerName].push(arguments);
    };

    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
    });

    window[dataLayerName].push({
        event: 'seo_page_context',
        ga_measurement_id: GA4_ID,
        page_type: pageType,
        page_language: html.lang || 'es',
        page_title: document.title,
        page_path: window.location.pathname,
        page_location: window.location.href,
        canonical_url: canonicalUrl,
        meta_description: metaDescription
    });

    if (!document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) {
        const firstScript = document.getElementsByTagName('script')[0];
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.dataset.gtmId = GTM_ID;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(gtmScript, firstScript);
        } else {
            document.head.appendChild(gtmScript);
        }
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link) {
            return;
        }

        let targetUrl;
        try {
            targetUrl = new URL(link.href, window.location.origin);
        } catch (error) {
            return;
        }

        if (targetUrl.origin !== window.location.origin) {
            window[dataLayerName].push({
                event: 'outbound_click',
                page_type: pageType,
                link_url: targetUrl.href,
                link_text: (link.textContent || '').trim()
            });
        }

        if (targetUrl.hostname === 'wa.me') {
            window[dataLayerName].push({
                event: 'generate_lead',
                lead_channel: 'whatsapp',
                page_type: pageType,
                link_url: targetUrl.href
            });
        }
    });
})();
