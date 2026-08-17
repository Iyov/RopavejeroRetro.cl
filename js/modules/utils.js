// ========== MÓDULO: UTILS ==========

// Función para sanitizar HTML y prevenir XSS
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Función para validar y sanitizar URLs
function sanitizeURL(url) {
    if (typeof url !== 'string') return '#';
    
    // Lista blanca de dominios permitidos
    const allowedDomains = [
        'instagram.com',
        'www.instagram.com',
        'facebook.com',
        'www.facebook.com',
        'tiktok.com',
        'www.tiktok.com',
        'youtube.com',
        'www.youtube.com',
        'twitter.com',
        'www.twitter.com',
        'threads.net',
        'www.threads.net',
        'wa.me',
        'docs.google.com',
        'ropavejeroretro.cl',
        'static.cloudflareinsights.com',
        'cloudflareinsights.com'
    ];
    
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();
        
        // Verificar protocolo seguro
        if (!['https:', 'http:'].includes(urlObj.protocol)) {
            return '#';
        }
        
        // Verificar dominio permitido
        const isAllowed = allowedDomains.some(allowedDomain => 
            domain === allowedDomain || domain.endsWith('.' + allowedDomain)
        );
        
        if (!isAllowed) {
            return '#';
        }
        
        return url;
    } catch (e) {
        return '#';
    }
}

// Función para validar datos de productos
function validateProductData(product) {
    if (!product || typeof product !== 'object') return null;
    
    // Lógica corregida para el campo Sold:
    // - Vacío/undefined/null/string vacío = NO vendido (0)
    // - "1" o 1 = SÍ vendido (1)
    let soldValue = 0;
    
    // Debug: log del valor original del campo Sold
    // console.log('Sold original value:', product.Sold, 'Type:', typeof product.Sold);
    
    if (product.Sold === '1' || product.Sold === 1) {
        soldValue = 1;
    } else {
        // Cualquier otro valor (vacío, null, undefined, '0', 0) = NO vendido
        soldValue = 0;
    }
    
    return {
        Num: parseInt(product.Num) || 0,
        Product: sanitizeHTML(String(product.Product || '')),
        Platform: sanitizeHTML(String(product.Platform || '')),
        Sale: sanitizeHTML(String(product.Sale || 'X')),
        Neto: sanitizeHTML(String(product.Neto || 'X')),
        Stock: sanitizeHTML(String(product.Stock || '0')),
        Link: sanitizeHTML(String(product.Link || '')),
        Sold: soldValue
    };
}

function parseProductPrice(value) {
    if (value === null || value === undefined) return null;

    const normalized = String(value).trim().toUpperCase();
    if (!normalized || normalized === 'X') return null;

    const match = normalized.match(/(\d+(?:[.,]\d+)?)/);
    if (!match) return null;

    let amount = parseFloat(match[1].replace(',', '.'));
    if (Number.isNaN(amount)) return null;

    if (normalized.includes('K')) {
        amount *= 1000;
    }

    return amount;
}

function compareNullableNumbers(a, b, direction = 'asc') {
    const aIsNull = a === null || a === undefined || Number.isNaN(a);
    const bIsNull = b === null || b === undefined || Number.isNaN(b);

    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;

    return direction === 'desc' ? b - a : a - b;
}

function sortProducts(products, sortValue) {
    const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    const sortableProducts = [...products];

    sortableProducts.sort((a, b) => {
        const safeA = validateProductData(a);
        const safeB = validateProductData(b);

        switch (sortValue) {
            case 'price-asc': {
                const priceComparison = compareNullableNumbers(
                    parseProductPrice(safeA?.Neto),
                    parseProductPrice(safeB?.Neto),
                    'asc'
                );
                return priceComparison || ((safeA?.Num || 0) - (safeB?.Num || 0));
            }
            case 'price-desc': {
                const priceComparison = compareNullableNumbers(
                    parseProductPrice(safeA?.Neto),
                    parseProductPrice(safeB?.Neto),
                    'desc'
                );
                return priceComparison || ((safeA?.Num || 0) - (safeB?.Num || 0));
            }
            case 'name-asc':
                return collator.compare(safeA?.Product || '', safeB?.Product || '') || ((safeA?.Num || 0) - (safeB?.Num || 0));
            case 'name-desc':
                return collator.compare(safeB?.Product || '', safeA?.Product || '') || ((safeA?.Num || 0) - (safeB?.Num || 0));
            case 'platform-asc':
                return collator.compare(safeA?.Platform || '', safeB?.Platform || '') ||
                    collator.compare(safeA?.Product || '', safeB?.Product || '') ||
                    ((safeA?.Num || 0) - (safeB?.Num || 0));
            case 'id-asc':
            default:
                return (safeA?.Num || 0) - (safeB?.Num || 0);
        }
    });

    return sortableProducts;
}

// Función para manejo seguro de errores
function handleSecureError(error, context = 'general') {
    // Log interno para debugging (no mostrar al usuario)
    console.error(`[${context}] Error interno:`, error);
    
    // Mensaje genérico para el usuario
    const userMessages = {
        'es': {
            'products': 'Error cargando productos. Por favor, intenta más tarde.',
            'efemerides': 'No se pudieron cargar las efemérides del día.',
            'general': 'Ha ocurrido un error. Por favor, intenta más tarde.'
        },
        'en': {
            'products': 'Error loading products. Please try again later.',
            'efemerides': 'Could not load today\'s anniversaries.',
            'general': 'An error occurred. Please try again later.'
        }
    };
    
    const currentLang = localStorage.getItem('language') || 'es';
    return userMessages[currentLang][context] || userMessages[currentLang]['general'];
}
