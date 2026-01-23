// ========== FUNCIONES DE SEGURIDAD ==========
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
    
    return {
        Num: parseInt(product.Num) || 0,
        Product: sanitizeHTML(String(product.Product || '')),
        Platform: sanitizeHTML(String(product.Platform || '')),
        Sale: sanitizeHTML(String(product.Sale || 'X')),
        Neto: sanitizeHTML(String(product.Neto || 'X')),
        Stock: sanitizeHTML(String(product.Stock || '0')),
        Link: sanitizeHTML(String(product.Link || '')),
        Sold: product.Sold === '1' || product.Sold === 'Si' ? 1 : 0
    };
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

// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initTheme();
    initLanguage();
    initProgressBar();
    initBackToTop();
    initMobileMenu();
    initFAQ();
    initBlogDialogs();
    initProducts();
    loadInstagramPosts();
    loadEfemerides();
    
    // Aplicar configuraciones guardadas
    applySavedSettings();
});

// ========== TEMA CLARO/OSCURO ==========
function initTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Verificar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeBtn.addEventListener('click', function() {
        const isLightMode = document.documentElement.classList.toggle('light-mode');
        
        if (isLightMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ========== MULTILENGUAJE ==========
function initLanguage() {
    const languageBtn = document.getElementById('languageBtn');
    const languageSelectorOverlay = document.getElementById('languageSelectorOverlay');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Verificar idioma guardado
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    
    // Mostrar selector de idioma
    languageBtn.addEventListener('click', function() {
        languageSelectorOverlay.classList.add('active');
        
        // Marcar la opción activa
        languageOptions.forEach(option => {
            if (option.dataset.lang === savedLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    });
    
    // Seleccionar idioma
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('language', lang);
            languageSelectorOverlay.classList.remove('active');
        });
    });
    
    // Cerrar selector al hacer clic fuera
    languageSelectorOverlay.addEventListener('click', function(e) {
        if (e.target === languageSelectorOverlay) {
            languageSelectorOverlay.classList.remove('active');
        }
    });
}

// Traducciones
const translations = {
    es: {
        // Menú
        'menu-instagram': 'Instagram',
        'menu-about': 'Nosotros',
        'menu-efemerides': 'Efemérides',
        'menu-products': 'Productos',
        'menu-testimonials': 'Testimonios',
        'menu-brands': 'Marcas',
        'menu-faq': 'FAQ',
        'menu-blog': 'Blog',
        'menu-contact': 'Contacto',
        
        // Hero
        'hero-title': 'Bienvenidos a @Ropavejero.Retro<br/>Todo lo Retro en un solo lugar',
        'hero-subtitle': 'Consolas, juegos y accesorios retro originales americanos. Revive la nostalgia de los videojuegos clásicos.',
        'instagram-button': 'Ir a Instagram',
        
        // Instagram
        'instagram-title': 'Posts de Instagram',
        
        // Nosotros
        'about-title': 'Sobre Nosotros',
        'about-subtitle-1': '¿Quiénes Somos?',
        'about-text-1': 'Ropavejero Retro es una tienda especializada en videojuegos retro originales americanos. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.',
        'about-subtitle-2': 'Nuestros Productos',
        'about-text-2': 'Desde consolas clásicas como NES, SNES, PlayStation 1 y Sega Genesis, hasta juegos y accesorios originales, todo cuidadosamente revisado y garantizado. Trabajamos directamente con proveedores en Estados Unidos para asegurar la autenticidad de nuestros productos.',
        'about-subtitle-3': 'Nuestra Misión',
        'about-text-3': 'Nuestro objetivo es que revivas aquellos maravillosos momentos de tu infancia con la misma calidad y emoción de entonces.',
        'about-btn-1': 'Garantía 30 días',
        'about-btn-2': 'Envío a todo Chile',
        'about-btn-3': 'Productos originales',
        'explore-store': 'Explora la Tienda',
        
        // Efemérides
        'efemerides-title': 'Efemérides de hoy',
        'efemerides-badge': 'Efeméride del día',
        'no-efemerides': 'Hoy no hay efemérides registradas. ¡Disfruta de tus juegos retro!',
        'efemerides-error': 'No se pudieron cargar las efemérides del día. Por favor, intenta más tarde.',
        
        // Productos
        'products-title': 'Productos Disponibles',
        'products-subtitle': 'Explora nuestra colección de videojuegos retro disponibles para venta.',
        'filter-search': 'Buscar producto:',
        'filter-platform': 'Plataforma:',
        'filter-all': 'Todas',
        'filter-status': 'Estado:',
        'filter-all-status': 'Todos',
        'filter-available': 'Disponibles',
        'filter-sold': 'Vendidos',
        'clear-filters': 'Limpiar',
        'platforms-selected': 'plataformas seleccionadas',
        'platform-selected': 'plataforma seleccionada',
        'products-count': 'Cargando productos...',
        'loading-products': 'Cargando productos...',
        'table-num': '#',
        'table-product': 'Producto',
        'table-platform': 'Plataforma',
        'table-price': 'Precio',
        'table-stock': 'Stock',
        'table-status': 'Estado',
        'table-actions': 'Acciones',
        'status-available': 'Disponible',
        'status-sold': 'Vendido',
        'view-details': 'Ver detalles',
        'modal-close': 'Cerrar',
        'modal-num': 'Número',
        'modal-product': 'Producto',
        'modal-platform': 'Plataforma',
        'modal-sale': 'Precio de Venta',
        'modal-price': 'Precio de Compra',
        'modal-stock': 'Stock',
        'modal-polish': 'Pulir',
        'modal-sold': 'Vendido',
        'modal-userid': 'ID Usuario',
        'modal-username': 'Nombre Instagram',
        'modal-payment': 'Método Pago',
        'modal-test': 'Probado',
        'modal-date': 'Fecha',
        'modal-delivered': 'Entregado',
        'modal-payment-price': 'Pago',
        'yes': 'Sí',
        'no': 'No',
        'delivered-yes': 'Entregado',
        'delivered-no': 'No entregado',
        'polish-yes': 'Pulir',
        'polish-no': 'No pulir',
        'products-loaded': 'Mostrando {count} de {total} productos',
        'no-products': 'No hay productos disponibles con los filtros seleccionados.',
        'pagination-prev': 'Anterior',
        'pagination-next': 'Siguiente',
        'pagination-page': 'Página',
        'pagination-of': 'de',
        
        // Testimonios
        'testimonials-title': 'Testimonios de Clientes Satisfechos',
        'testimonials-subtitle': 'Nos enorgullece contar con la confianza de la comunidad retro. Aquí algunos de sus testimonios.',
        'testimonial-1': '"He comprado en RopavejeroRetro durante años y su servicio siempre es de primera. La calidad de los productos es excelente y siempre llegan en perfecto estado. ¡Muy recomendable!"',
        'testimonial-2': '"Encontré exactamente lo que buscaba en RopavejeroRetro. La selección de juegos y consolas retro es impresionante, y los precios son muy competitivos. Definitivamente seré un cliente recurrente."',
        'testimonial-3': '"El equipo de RopavejeroRetro es fantástico. Son conocedores, amables y siempre dispuestos a ayudar. Mi pedido llegó rápidamente y todo estaba como se describía. ¡No podría estar más feliz!"',
        'testimonial-role-1': 'Coleccionista',
        'testimonial-role-2': 'Gamer',
        'testimonial-role-3': 'Entusiasta Retro',

        // Marcas
        'brands-title': 'Marcas',
        'brand-nintendo': 'Nintendo',
        'brand-playstation': 'PlayStation',
        'brand-xbox': 'Xbox',
        'brand-sega': 'Sega',
        'brand-atari': 'Atari',

        // FAQ
        'faq-title': 'Preguntas Frecuentes (FAQ)',
        'faq-question-1': '¿Qué tipos de productos venden?',
        'faq-answer-1': 'Vendemos consolas, juegos y accesorios retro originales americanos. Trabajamos con marcas como Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) y Atari.',
        'faq-question-2': '¿Los productos son originales y en qué estado están?',
        'faq-answer-2': 'Todos nuestros productos son 100% originales americanos. Revisamos cada artículo minuciosamente y garantizamos su funcionamiento. El estado varía desde productos como nuevos hasta usados en buen estado, siempre especificando claramente las condiciones en cada listing.',
        'faq-question-3': '¿Realizan envíos a todo Chile?',
        'faq-answer-3': 'Sí, realizamos envíos a todo Chile a través de Starken. El costo de envío varía según la ubicación y el peso del paquete. Las entregas presenciales dentro de Santiago se realizan en metro San Joaquín L5.',
        'faq-question-4': '¿Ofrecen garantía en sus productos?',
        'faq-answer-4': 'Todos nuestros productos incluyen 30 días de garantía por defectos de funcionamiento. Para consolas reacondicionadas por nosotros, ofrecemos 90 días de garantía. La garantía cubre problemas técnicos pero no daños físicos por mal uso.',
        'faq-question-5': '¿Puedo ver los productos antes de comprar?',
        'faq-answer-5': 'Actualmente no tenemos showroom físico, pero puedes agendar una cita para ver productos específicos en nuestras oficinas en Santiago. También publicamos videos demostrativos de todos nuestros productos en Instagram y YouTube.',
        
        // Blog
        'blog-title': 'Nuestro Blog',
        'blog-subtitle': 'Últimas noticias, actualizaciones e historias del mundo de los videojuegos retro.',
        'blog-title-1': 'La historia de Nintendo: De las cartas a los videojuegos',
        'blog-excerpt-1': 'Descubre cómo Nintendo pasó de ser una empresa de cartas a convertirse en un gigante de los videojuegos...',
        'blog-title-2': 'Nintendo vs Sega: La batalla que definió una generación',
        'blog-excerpt-2': 'Analizamos la competencia entre Nintendo y Sega durante los años 90 y cómo cambió la industria...',
        'blog-title-3': 'Guía para coleccionar videojuegos retro: Por dónde empezar',
        'blog-excerpt-3': 'Consejos prácticos para quienes quieren comenzar su colección de videojuegos retro sin gastar demasiado...',
        'read-more': 'Leer más',
        
        // Contacto
        'contact-title': 'Contacto',
        'contact-subtitle': 'Puedes encontrarnos en nuestras redes sociales o contactarnos directamente a través de los siguientes medios:',
        'contact-instagram': 'Instagram',
        'contact-tiktok': 'TikTok',
        'contact-youtube': 'YouTube',
        'contact-facebook': 'Facebook',
        'contact-threads': 'Threads',
        'contact-twitter': 'Twitter (X)',
        'contact-whatsapp': 'WhatsApp',
        'contact-website': 'Sitio Web',
        'contact-excel': 'Excel Disponibles',
        
        // Footer
        'footer-copyright': '© 2026 @Ropavejero.Retro Todos los derechos reservados.',
        
        // Tooltip
        'whatsapp-tooltip': 'Comunícate con nosotros'
    },
    en: {
        // Menú
        'menu-instagram': 'Instagram',
        'menu-about': 'About Us',
        'menu-efemerides': 'Anniversaries',
        'menu-products': 'Products',
        'menu-testimonials': 'Testimonials',
        'menu-brands': 'Brands',
        'menu-faq': 'FAQ',
        'menu-blog': 'Blog',
        'menu-contact': 'Contact',
        
        // Hero
        'hero-title': 'Welcome to @Ropavejero.Retro<br/>Everything Retro in one place',
        'hero-subtitle': 'Original American retro consoles, games and accessories. Relive the nostalgia of classic video games.',
        'instagram-button': 'Go to Instagram',
        
        // Instagram
        'instagram-title': 'Instagram Posts',
        
        // Nosotros
        'about-title': 'About Us',
        'about-subtitle-1': 'Who are we?',
        'about-text-1': 'Ropavejero Retro is a store specialized in original American retro video games. Our passion for classic video games drives us to search for and offer the best products for nostalgia gaming lovers.',
        'about-subtitle-2': 'Our Products',
        'about-text-2': 'From classic consoles like NES, SNES, PlayStation 1 and Sega Genesis, to original games and accessories, all carefully reviewed and guaranteed. We work directly with suppliers in the United States to ensure the authenticity of our products.',
        'about-subtitle-3': 'Our Mission',
        'about-text-3': 'Our goal is for you to relive those wonderful moments of your childhood with the same quality and excitement as then.',
        'about-btn-1': '30-day warranty',
        'about-btn-2': 'Shipping throughout Chile',
        'about-btn-3': 'Original products',
        'explore-store': 'Explore the Store',
        
        // Efemérides
        'efemerides-title': "Today's Anniversaries",
        'efemerides-badge': "Today's Anniversary",
        'no-efemerides': 'No anniversaries recorded for today. Enjoy your retro games!',
        'efemerides-error': "Could not load today's anniversaries. Please try again later.",
        
        // Productos
        'products-title': 'Available Products',
        'products-subtitle': 'Explore our collection of retro video games available for sale.',
        'filter-search': 'Search product:',
        'filter-platform': 'Platform:',
        'filter-all': 'All',
        'filter-status': 'Status:',
        'filter-all-status': 'All',
        'filter-available': 'Available',
        'filter-sold': 'Sold',
        'clear-filters': 'Clear',
        'platforms-selected': 'platforms selected',
        'platform-selected': 'platform selected',
        'products-count': 'Loading products...',
        'loading-products': 'Loading products...',
        'table-num': '#',
        'table-product': 'Product',
        'table-platform': 'Platform',
        'table-price': 'Price',
        'table-stock': 'Stock',
        'table-status': 'Status',
        'table-actions': 'Actions',
        'status-available': 'Available',
        'status-sold': 'Sold',
        'view-details': 'View details',
        'modal-close': 'Close',
        'modal-num': 'Number',
        'modal-product': 'Product',
        'modal-platform': 'Platform',
        'modal-sale': 'Sale Price',
        'modal-price': 'Purchase Price',
        'modal-stock': 'Stock',
        'modal-polish': 'Polish',
        'modal-sold': 'Sold',
        'modal-userid': 'User ID',
        'modal-username': 'Instagram Name',
        'modal-payment': 'Payment Method',
        'modal-test': 'Tested',
        'modal-date': 'Date',
        'modal-delivered': 'Delivered',
        'modal-payment-price': 'Payment',
        'yes': 'Yes',
        'no': 'No',
        'delivered-yes': 'Delivered',
        'delivered-no': 'Not delivered',
        'polish-yes': 'Polish',
        'polish-no': 'No polish',
        'products-loaded': 'Showing {count} of {total} products',
        'no-products': 'No products available with selected filters.',
        'pagination-prev': 'Previous',
        'pagination-next': 'Next',
        'pagination-page': 'Page',
        'pagination-of': 'of',
        
        // Testimonios
        'testimonials-title': 'Testimonials from Satisfied Customers',
        'testimonials-subtitle': 'We are proud to have the trust of the retro community. Here are some of their testimonials.',
        'testimonial-1': '"I have bought from RopavejeroRetro for years and their service is always first class. The quality of the products is excellent and they always arrive in perfect condition. Highly recommended!"',
        'testimonial-2': '"I found exactly what I was looking for at RopavejeroRetro. The selection of retro games and consoles is impressive, and the prices are very competitive. I will definitely be a recurring customer."',
        'testimonial-3': '"The RopavejeroRetro team is fantastic. They are knowledgeable, friendly and always willing to help. My order arrived quickly and everything was as described. I couldn\'t be happier!"',
        'testimonial-role-1': 'Collector',
        'testimonial-role-2': 'Gamer',
        'testimonial-role-3': 'Retro Enthusiast',

        // Marcas
        'brands-title': 'Brands',
        'brand-nintendo': 'Nintendo',
        'brand-playstation': 'PlayStation',
        'brand-xbox': 'Xbox',
        'brand-sega': 'Sega',
        'brand-atari': 'Atari',

        // FAQ
        'faq-title': 'Frequently Asked Questions (FAQ)',
        'faq-question-1': 'What types of products do you sell?',
        'faq-answer-1': 'We sell original American retro consoles, games and accessories. We work with brands like Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) and Atari.',
        'faq-question-2': 'Are the products original and in what condition are they?',
        'faq-answer-2': 'All our products are 100% original American. We carefully review each item and guarantee its operation. The condition varies from like-new products to used in good condition, always clearly specifying the conditions in each listing.',
        'faq-question-3': 'Do you ship throughout Chile?',
        'faq-answer-3': 'Yes, we ship throughout Chile via Starken. The shipping cost varies depending on the location and weight of the package. In-person deliveries within Santiago are made at San Joaquín L5 metro station.',
        'faq-question-4': 'Do you offer warranty on your products?',
        'faq-answer-4': 'All our products include 30 days warranty for operational defects. For consoles refurbished by us, we offer 90 days warranty. The warranty covers technical problems but not physical damage from misuse.',
        'faq-question-5': 'Can I see the products before buying?',
        'faq-answer-5': 'We currently do not have a physical showroom, but you can schedule an appointment to see specific products at our offices in Santiago. We also publish demonstration videos of all our products on Instagram and YouTube.',
        
        // Blog
        'blog-title': 'Our Blog',
        'blog-subtitle': 'Latest news, updates, and stories from the world of retro gaming.',
        'blog-title-1': 'The History of Nintendo: From Cards to Video Games',
        'blog-excerpt-1': 'Discover how Nintendo went from being a card company to becoming a video game giant...',
        'blog-title-2': 'Nintendo vs Sega: The Battle That Defined a Generation',
        'blog-excerpt-2': 'We analyze the competition between Nintendo and Sega during the 90s and how it changed the industry...',
        'blog-title-3': 'Guide to Collecting Retro Video Games: Where to Start',
        'blog-excerpt-3': 'Practical tips for those who want to start their retro video game collection without spending too much...',
        'read-more': 'Read more',
        
        // Contacto
        'contact-title': 'Contact',
        'contact-subtitle': 'You can find us on our social networks or contact us directly through the following means:',
        'contact-instagram': 'Instagram',
        'contact-tiktok': 'TikTok',
        'contact-youtube': 'YouTube',
        'contact-facebook': 'Facebook',
        'contact-threads': 'Threads',
        'contact-twitter': 'Twitter (X)',
        'contact-whatsapp': 'WhatsApp',
        'contact-website': 'Website',
        'contact-excel': 'Available Excel',
        
        // Footer
        'footer-copyright': '© 2026 @Ropavejero.Retro All rights reserved.',
        
        // Tooltip
        'whatsapp-tooltip': 'Contact us'
    }
};

// Contenido de los blogs en ambos idiomas
const blogContent = {
    1: {
        es: {
            title: 'La historia de Nintendo: De las cartas a los videojuegos',
            date: '02 de Enero, 2026',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Nintendo es hoy en día sinónimo de videojuegos, pero pocos conocen sus humildes orígenes. Fundada en 1889 por Fusajiro Yamauchi en Kioto, Japón, la compañía comenzó fabricando cartas Hanafuda, un tipo de baraja tradicional japonesa.</p>
                
                <p>Durante más de medio siglo, Nintendo se dedicó exclusivamente a los juegos de cartas, expandiéndose gradualmente a otros tipos de juegos de mesa. No fue hasta la década de 1960 que la empresa comenzó a diversificarse, incursionando en negocios tan diversos como taxis, alimentos instantáneos y hasta una cadena de hoteles del amor.</p>
                
                <p>El giro hacia los videojuegos llegó en los años 70, cuando Nintendo comenzó a desarrollar máquinas arcade. Su primer gran éxito fue Donkey Kong en 1981, que introdujo al mundo a Mario (entonces llamado Jumpman). Este personaje se convertiría en el ícono más reconocible de la compañía.</p>
                
                <p>La revolución definitiva llegó en 1983 con el lanzamiento de la Family Computer (Famicom) en Japón, conocida internacionalmente como Nintendo Entertainment System (NES). Esta consola no solo salvó a la industria de los videojuegos tras la crisis de 1983, sino que estableció estándares de calidad y jugabilidad que perduran hasta hoy.</p>
                
                <p>Desde entonces, Nintendo ha continuado innovando con consolas como Game Boy, Super Nintendo, Nintendo 64, GameCube, Wii, Nintendo DS, 3DS, Switch y muchas más, siempre manteniendo su filosofía de priorizar la jugabilidad por encima de todo.</p>
            `
        },
        en: {
            title: 'The History of Nintendo: From Cards to Video Games',
            date: 'January 02, 2026',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Nintendo is today synonymous with video games, but few know its humble origins. Founded in 1889 by Fusajiro Yamauchi in Kyoto, Japan, the company began by manufacturing Hanafuda cards, a type of traditional Japanese deck.</p>
                
                <p>For over half a century, Nintendo dedicated itself exclusively to card games, gradually expanding to other types of board games. It wasn't until the 1960s that the company began to diversify, venturing into businesses as diverse as taxis, instant foods, and even a love hotel chain.</p>
                
                <p>The turn towards video games came in the 70s, when Nintendo began developing arcade machines. Its first big success was Donkey Kong in 1981, which introduced the world to Mario (then called Jumpman). This character would become the most recognizable icon of the company.</p>
                
                <p>The definitive revolution came in 1983 with the launch of the Family Computer (Famicom) in Japan, known internationally as the Nintendo Entertainment System (NES). This console not only saved the video game industry after the 1983 crash, but established quality and gameplay standards that endure to this day.</p>
                
                <p>Since then, Nintendo has continued innovating with consoles like Game Boy, Super Nintendo, Nintendo 64, GameCube, Wii, Nintendo DS, 3DS, Switch and many more, always maintaining its philosophy of prioritizing gameplay above all else.</p>
            `
        }
    },
    2: {
        es: {
            title: 'Nintendo vs Sega: La batalla que definió una generación',
            date: '02 de Enero, 2026',
            image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Los años 90 fueron testigos de una de las rivalidades más épicas en la historia de los videojuegos: Nintendo contra Sega. Esta batalla no solo definió una generación de jugadores, sino que cambió para siempre la forma en que se comercializaban y percibían los videojuegos.</p>
                
                <p>Cuando Sega lanzó Genesis (Mega Drive fuera de América) en 1989, Nintendo dominaba el mercado con su NES. Sega adoptó una estrategia agresiva de marketing, posicionando a Genesis como la consola "cool" para adolescentes, en contraste con la imagen más infantil de Nintendo.</p>
                
                <p>El eslogan "Genesis does what Nintendon't" se convirtió en el estandarte de esta guerra, destacando las ventajas técnicas de la consola de Sega, como su mayor potencia y el chip de sonido Yamaha que ofrecía música de mejor calidad.</p>
                
                <p>La competencia se intensificó con las mascotas de ambas compañías: Mario de Nintendo contra Sonic de Sega. Sonic, con su actitud desafiante y velocidad, representaba perfectamente la imagen que Sega quería proyectar. La guerra de consolas llegó a su punto máximo con el lanzamiento de juegos como Street Fighter II, que apareció primero en SNES, y Mortal Kombat, cuya versión sin censura en Genesis le dio una ventaja significativa a Sega.</p>
                
                <p>Aunque Nintendo eventualmente ganó la batalla en términos de ventas, la competencia benefició enormemente a los consumidores, impulsando la innovación y reduciendo precios. Esta rivalidad demostró que en el mundo de los videojuegos, la competencia feroz puede ser el mejor catalizador para el progreso.</p>
            `
        },
        en: {
            title: 'Nintendo vs Sega: The Battle That Defined a Generation',
            date: 'January 02, 2026',
            image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>The 90s witnessed one of the most epic rivalries in video game history: Nintendo vs Sega. This battle not only defined a generation of players, but forever changed the way video games were marketed and perceived.</p>
                
                <p>When Sega launched Genesis (Mega Drive outside America) in 1989, Nintendo dominated the market with its NES. Sega adopted an aggressive marketing strategy, positioning Genesis as the "cool" console for teenagers, in contrast to Nintendo's more childish image.</p>
                
                <p>The slogan "Genesis does what Nintendon't" became the banner of this war, highlighting the technical advantages of Sega's console, such as its greater power and the Yamaha sound chip that offered better quality music.</p>
                
                <p>The competition intensified with the mascots of both companies: Nintendo's Mario vs Sega's Sonic. Sonic, with his defiant attitude and speed, perfectly represented the image Sega wanted to project. The console war reached its peak with the launch of games like Street Fighter II, which appeared first on SNES, and Mortal Kombat, whose uncensored version on Genesis gave Sega a significant advantage.</p>
                
                <p>Although Nintendo eventually won the battle in terms of sales, the competition greatly benefited consumers, driving innovation and reducing prices. This rivalry demonstrated that in the world of video games, fierce competition can be the best catalyst for progress.</p>
            `
        }
    },
    3: {
        es: {
            title: 'Guía para coleccionar videojuegos retro: Por dónde empezar',
            date: '02 de Enero, 2026',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Coleccionar videojuegos retro puede ser un hobby increíblemente gratificante, pero también abrumador para quienes recién comienzan. Con tantas consolas, juegos y accesorios disponibles, es fácil perderse. Esta guía te ayudará a dar tus primeros pasos en el mundo del coleccionismo retro.</p>
                
                <h4>1. Define tu enfoque</h4>
                <p>Antes de comprar nada, decide qué tipo de coleccionista quieres ser. ¿Te interesa una consola específica? ¿Una franquicia particular? ¿O prefieres tener una muestra representativa de varias épocas? Definir tu enfoque te ayudará a evitar compras impulsivas y a construir una colección coherente.</p>
                
                <h4>2. Investiga antes de comprar</h4>
                <p>Conoce los precios de mercado, las ediciones especiales y los juegos más valiosos. Foros especializados, canales de YouTube y grupos de Facebook son excelentes recursos. Aprende a identificar productos originales y evita las réplicas.</p>
                
                <h4>3. Comienza con lo esencial</h4>
                <p>No necesitas comprar todos los juegos de una consola para empezar. Adquiere primero los títulos más icónicos y representativos. Para NES, por ejemplo, Super Mario Bros., The Legend of Zelda y Metroid son excelentes puntos de partida.</p>
                
                <h4>4. Verifica el estado de los productos</h4>
                <p>El estado es crucial en el coleccionismo. Los juegos completos en caja (CIB) valen significativamente más que los cartuchos sueltos. Revisa que los manuales, mapas y otros insertos estén presentes. Para las consolas, verifica que funcionen correctamente.</p>
                
                <h4>5. Conecta con la comunidad</h4>
                <p>Únete a grupos locales de coleccionistas, participa en convenciones y ferias de intercambio. La comunidad retro es generalmente muy acogedora y estarás rodeado de personas con quienes compartir tu pasión.</p>
                
                <p>Recuerda: el coleccionismo debe ser una actividad placentera. No te obsesiones con completar colecciones rápidamente. Disfruta el proceso de búsqueda, el aprendizaje y, por supuesto, jugar con tus adquisiciones.</p>
            `
        },
        en: {
            title: 'Guide to Collecting Retro Video Games: Where to Start',
            date: 'January 2, 2026',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Collecting retro video games can be an incredibly rewarding hobby, but also overwhelming for those just starting out. With so many consoles, games and accessories available, it's easy to get lost. This guide will help you take your first steps in the world of retro collecting.</p>
                
                <h4>1. Define your focus</h4>
                <p>Before buying anything, decide what kind of collector you want to be. Are you interested in a specific console? A particular franchise? Or do you prefer to have a representative sample from several eras? Defining your focus will help you avoid impulse purchases and build a coherent collection.</p>
                
                <h4>2. Research before buying</h4>
                <p>Know market prices, special editions and the most valuable games. Specialized forums, YouTube channels and Facebook groups are excellent resources. Learn to identify original products and avoid replicas.</p>
                
                <h4>3. Start with the essentials</h4>
                <p>You don't need to buy all the games of a console to start. First acquire the most iconic and representative titles. For NES, for example, Super Mario Bros., The Legend of Zelda and Metroid are excellent starting points.</p>
                
                <h4>4. Verify product condition</h4>
                <p>Condition is crucial in collecting. Complete in box (CIB) games are worth significantly more than loose cartridges. Check that manuals, maps and other inserts are present. For consoles, verify that they work correctly.</p>
                
                <h4>5. Connect with the community</h4>
                <p>Join local collector groups, participate in conventions and swap meets. The retro community is generally very welcoming and you'll be surrounded by people with whom to share your passion.</p>
                
                <p>Remember: collecting should be a pleasurable activity. Don't obsess over completing collections quickly. Enjoy the search process, the learning, and of course, playing with your acquisitions.</p>
            `
        }
    }
};

// Función para cambiar idioma
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                if (element.tagName === 'SELECT') {
                    // Para selects, actualizar las opciones si tienen data-translate
                    const options = element.querySelectorAll('option');
                    options.forEach(option => {
                        const optionKey = option.getAttribute('data-translate');
                        if (optionKey && translations[lang][optionKey]) {
                            option.textContent = translations[lang][optionKey];
                        }
                    });
                } else if (element.tagName === 'INPUT') {
                    element.placeholder = translations[lang][key];
                }
            } else {
                // Reemplazar placeholders en texto
                let text = translations[lang][key];
                element.innerHTML = text;
            }
        }
    });
    
    // Actualizar opciones de idioma activas
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Recargar efemérides con el nuevo idioma
    loadEfemerides();
    
    // Recargar productos con el nuevo idioma
    if (window.productsData && window.productsData.length > 0) {
        renderProductsTable();
    }
}

// ========== BARRA DE PROGRESO ==========
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progress.style.width = scrolled + '%';
    });
}

// ========== BOTÓN VOLVER ARRIBA ==========
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const backToTopLogo = document.getElementById('backToTopLogo');
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Funcionalidad del botón
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Funcionalidad del logo
    backToTopLogo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== MENÚ MÓVIL ==========
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    
    // Abrir menú
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Cerrar menú al hacer clic en un enlace
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== FAQ ==========
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abrir/cerrar item actual
            item.classList.toggle('active');
        });
    });
}

// ========== BLOG DIALOGS ==========
function initBlogDialogs() {
    const blogDialogOverlay = document.getElementById('blogDialogOverlay');
    const blogDialogClose = document.getElementById('blogDialogClose');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    // Abrir dialog de blog
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.closest('.blog-card').getAttribute('data-blog-id');
            const currentLang = localStorage.getItem('language') || 'es';
            const content = blogContent[blogId][currentLang];
            
            if (content) {
                document.getElementById('blogDialogContent').innerHTML = `
                    <div class="blog-dialog-image">
                        <img src="${content.image}" alt="${content.title}">
                    </div>
                    <h2 class="blog-dialog-title">${content.title}</h2>
                    <p class="blog-dialog-date">${content.date}</p>
                    <div class="blog-dialog-content">
                        ${content.content}
                    </div>
                `;
                
                blogDialogOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Cerrar dialog de blog
    blogDialogClose.addEventListener('click', function() {
        blogDialogOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Cerrar dialog al hacer clic fuera
    blogDialogOverlay.addEventListener('click', function(e) {
        if (e.target === blogDialogOverlay) {
            blogDialogOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== PRODUCTOS - SEGURO ==========
// Variables globales para productos
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 25;
let selectedPlatforms = new Set(['all']); // Plataformas seleccionadas

function initProducts() {
    const searchFilter = document.getElementById('searchFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    // Cargar productos
    loadProducts();
    
    // Event listeners para filtros
    searchFilter.addEventListener('input', filterProducts);
    statusFilter.addEventListener('change', filterProducts);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Event listeners para paginación
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
    
    // Inicializar filtro múltiple de plataformas
    initMultiSelectPlatform();
}

// Inicializar filtro múltiple de plataformas
function initMultiSelectPlatform() {
    const platformDisplay = document.getElementById('platformDisplay');
    const platformDropdown = document.getElementById('platformDropdown');
    
    // Toggle dropdown
    platformDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        platformDropdown.classList.toggle('active');
        platformDisplay.classList.toggle('active');
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.multi-select-container')) {
            platformDropdown.classList.remove('active');
            platformDisplay.classList.remove('active');
        }
    });
    
    // Prevenir que el dropdown se cierre al hacer clic dentro
    platformDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Cargar productos desde Google Sheets - SEGURO
async function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    const productsCounter = document.getElementById('productsCounter');
    
    try {
        // URL de tu Google Sheet (formato CSV) - validada
        const sheetId = '18kZ6wyheBWMmoa5yb1PR_XqhqzHCTAlT';
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv`;
        
        const response = await fetch(sheetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/csv',
            },
            // Timeout de 10 segundos
            signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvData = await response.text();
        
        // Validar que el CSV no esté vacío
        if (!csvData || csvData.trim().length === 0) {
            throw new Error('CSV data is empty');
        }
        
        // Parsear CSV de forma segura
        const products = parseCSVSecure(csvData);
        
        // Validar que tengamos productos
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('No valid products found');
        }
        
        // Guardar productos globalmente
        allProducts = products;
        filteredProducts = [...products];
        
        // Actualizar filtro de plataformas
        updatePlatformFilter(products);
        
        // Renderizar tabla
        renderProductsTable();
        
        // Actualizar contador
        updateProductsCounter();
        
    } catch (error) {
        const errorMessage = handleSecureError(error, 'products');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    ${sanitizeHTML(errorMessage)}
                </td>
            </tr>
        `;
        productsCounter.textContent = errorMessage;
    }
}

// Parsear CSV a objetos - SEGURO
function parseCSVSecure(csvText) {
    if (typeof csvText !== 'string') {
        throw new Error('Invalid CSV data type');
    }
    
    const lines = csvText.split('\n');
    
    if (lines.length < 2) {
        throw new Error('CSV must have at least header and one data row');
    }
    
    // Saltar la primera línea (encabezados)
    const dataLines = lines.slice(1);
    const products = [];
    
    dataLines.forEach((line, index) => {
        if (line.trim() === '') return;
        
        try {
            // Manejar comas dentro de comillas de forma segura
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            
            // Agregar el último valor
            values.push(currentValue.trim());
            
            // Validar que tengamos suficientes columnas
            if (values.length < 8) {
                console.warn(`Row ${index + 2} has insufficient columns, skipping`);
                return;
            }
            
            // Crear objeto producto con validación
            const rawProduct = {
                Num: values[0] || '',
                Product: values[1] || '',
                Platform: values[2] || '',
                Sale: values[3] || 'X',
                Neto: values[4] || 'X',
                Stock: values[5] || '0',
                Link: values[6] || '',
                Sold: values[7] || '0'
            };
            
            // Validar y sanitizar producto
            const product = validateProductData(rawProduct);
            
            if (product && product.Num > 0) {
                products.push(product);
            }
            
        } catch (rowError) {
            console.warn(`Error parsing row ${index + 2}:`, rowError);
        }
    });
    
    return products;
}

// Renderizar tabla de productos - SEGURO
function renderProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    const currentLang = localStorage.getItem('language') || 'es';
    
    if (filteredProducts.length === 0) {
        const noProductsMsg = currentLang === 'es' ? 'No hay productos disponibles.' : 'No products available.';
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    ${sanitizeHTML(noProductsMsg)}
                </td>
            </tr>
        `;
        updatePaginationButtons();
        return;
    }
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    let html = '';
    
    productsToShow.forEach(product => {
        // Validar y sanitizar producto
        const safeProduct = validateProductData(product);
        if (!safeProduct || !safeProduct.Num) return;
        
        const statusClass = safeProduct.Sold == 1 ? 'status-sold' : 'status-available';
        const statusText = safeProduct.Sold == 1 ? 
            (currentLang === 'es' ? 'Vendido' : 'Sold') : 
            (currentLang === 'es' ? 'Disponible' : 'Available');
        
        html += `
            <tr data-product-id="${safeProduct.Num}">
                <td>${safeProduct.Num}</td>
                <td>${safeProduct.Product}</td>
                <td>${safeProduct.Platform}</td>
                <td>${safeProduct.Neto !== 'X' ? safeProduct.Neto : '0'}</td>
                <td><span class="stock-badge">${safeProduct.Stock}</span></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="actions-cell">
                    <button class="btn btn-primary btn-small view-product-btn" data-product-id="${safeProduct.Num}" title="Ver detalles">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-primary btn-small link-product-btn" data-product-link="${safeProduct.Link}" title="Ver en Instagram">
                        <i class="fab fa-instagram" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Agregar event listeners a los botones de ver detalles
    document.querySelectorAll('.view-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = allProducts.find(p => p.Num === productId);
            if (product) {
                showProductModal(product);
            }
        });
    });

    document.querySelectorAll('.link-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productLink = this.getAttribute('data-product-link');
            const safeURL = sanitizeURL(getLinkProductInstagram(productLink));
            if (safeURL !== '#') {
                window.open(safeURL, '_blank', 'noopener,noreferrer');
            }
        });
    });
    
    // Actualizar paginación
    updatePagination();
    updatePaginationButtons();
    
    // Traducir elementos
    setLanguage(currentLang);
}

// Actualizar plataformas disponibles basado en búsqueda actual
function updateAvailablePlatforms(filteredProducts) {
    const platformDropdown = document.getElementById('platformDropdown');
    const platformDisplay = document.getElementById('platformDisplay');
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const availablePlatforms = new Set();
    
    // Obtener plataformas de productos filtrados
    filteredProducts.forEach(product => {
        if (product.Platform && product.Platform.trim() !== '') {
            availablePlatforms.add(product.Platform.trim());
        }
    });
    
    // Agregar clase visual si hay filtrado activo
    if (searchFilter) {
        platformDisplay.classList.add('filtered');
    } else {
        platformDisplay.classList.remove('filtered');
    }
    
    // Obtener todas las opciones de plataforma (excepto "Todas")
    const platformOptions = platformDropdown.querySelectorAll('.multi-select-option:not([data-value="all"])');
    
    platformOptions.forEach(option => {
        const platform = option.getAttribute('data-value');
        const checkbox = option.querySelector('input[type="checkbox"]');
        
        if (availablePlatforms.has(platform)) {
            // Mostrar opción si la plataforma tiene productos
            option.style.display = 'flex';
            option.classList.remove('filtered-out');
            option.classList.add('available');
        } else {
            // Ocultar opción si no hay productos de esta plataforma
            option.style.display = 'none';
            option.classList.add('filtered-out');
            option.classList.remove('available');
            
            // Si la plataforma oculta estaba seleccionada, deseleccionarla
            if (checkbox.checked) {
                checkbox.checked = false;
                selectedPlatforms.delete(platform);
            }
        }
    });
    
    // Si no hay plataformas seleccionadas después del filtrado, seleccionar "Todas"
    if (selectedPlatforms.size === 0 || (selectedPlatforms.size === 1 && !selectedPlatforms.has('all'))) {
        const remainingSelected = Array.from(selectedPlatforms).filter(p => p !== 'all' && availablePlatforms.has(p));
        if (remainingSelected.length === 0) {
            selectedPlatforms.clear();
            selectedPlatforms.add('all');
            document.getElementById('platform-all').checked = true;
        }
    }
    
    // Actualizar la visualización
    updatePlatformDisplay();
    
    // Mostrar/ocultar mensaje si no hay plataformas disponibles
    updatePlatformDropdownMessage(availablePlatforms.size);
}

// Actualizar mensaje del dropdown cuando no hay plataformas disponibles
function updatePlatformDropdownMessage(availablePlatformsCount) {
    const platformDropdown = document.getElementById('platformDropdown');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Remover mensaje existente
    const existingMessage = platformDropdown.querySelector('.no-platforms-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Si no hay plataformas disponibles (excepto "Todas"), mostrar mensaje
    if (availablePlatformsCount === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-platforms-message multi-select-option';
        messageDiv.style.fontStyle = 'italic';
        messageDiv.style.color = 'var(--text-secondary)';
        messageDiv.style.justifyContent = 'center';
        messageDiv.textContent = currentLang === 'es' ? 
            'No hay plataformas para esta búsqueda' : 
            'No platforms for this search';
        
        platformDropdown.appendChild(messageDiv);
    }
}
// Actualizar filtro de plataformas - MULTI-SELECT INICIAL
function updatePlatformFilter(products) {
    const platformDropdown = document.getElementById('platformDropdown');
    const platforms = new Set();
    
    products.forEach(product => {
        if (product.Platform && product.Platform.trim() !== '') {
            platforms.add(product.Platform.trim());
        }
    });
    
    // Limpiar opciones excepto "Todas"
    const allOption = platformDropdown.querySelector('[data-value="all"]');
    platformDropdown.innerHTML = '';
    platformDropdown.appendChild(allOption);
    
    // Agregar plataformas únicas ordenadas alfabéticamente
    Array.from(platforms).sort((a, b) => a.localeCompare(b)).forEach(platform => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'multi-select-option';
        optionDiv.setAttribute('data-value', platform);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `platform-${platform.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.value = platform;
        
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = platform;
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);
        platformDropdown.appendChild(optionDiv);
        
        // Event listener para cada checkbox
        checkbox.addEventListener('change', handlePlatformSelection);
    });
    
    // Event listener para "Todas"
    const allCheckbox = platformDropdown.querySelector('#platform-all');
    if (allCheckbox) {
        // Remover listeners existentes para evitar duplicados
        allCheckbox.removeEventListener('change', handleAllPlatformsSelection);
        allCheckbox.addEventListener('change', handleAllPlatformsSelection);
    }
}

// Manejar selección de plataforma individual
function handlePlatformSelection(e) {
    const platform = e.target.value;
    const isChecked = e.target.checked;
    const allCheckbox = document.getElementById('platform-all');
    
    if (isChecked) {
        selectedPlatforms.add(platform);
        // Si se selecciona una plataforma específica, desmarcar "Todas"
        if (selectedPlatforms.has('all')) {
            selectedPlatforms.delete('all');
            allCheckbox.checked = false;
        }
    } else {
        selectedPlatforms.delete(platform);
        // Si no hay plataformas seleccionadas, marcar "Todas"
        if (selectedPlatforms.size === 0) {
            selectedPlatforms.add('all');
            allCheckbox.checked = true;
        }
    }
    
    updatePlatformDisplay();
    filterProducts();
}

// Manejar selección de "Todas las plataformas"
function handleAllPlatformsSelection(e) {
    const isChecked = e.target.checked;
    const platformDropdown = document.getElementById('platformDropdown');
    const allCheckboxes = platformDropdown.querySelectorAll('input[type="checkbox"]:not(#platform-all)');
    
    if (isChecked) {
        // Desmarcar todas las plataformas específicas
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        selectedPlatforms.clear();
        selectedPlatforms.add('all');
    } else {
        // Si se desmarca "Todas" y no hay otras seleccionadas, volver a marcar "Todas"
        if (selectedPlatforms.size <= 1) {
            e.target.checked = true;
            return;
        }
        selectedPlatforms.delete('all');
    }
    
    updatePlatformDisplay();
    filterProducts();
}

// Actualizar la visualización del filtro de plataformas
function updatePlatformDisplay() {
    const platformDisplay = document.getElementById('platformDisplay');
    const placeholder = platformDisplay.querySelector('.placeholder');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Limpiar tags existentes
    const existingTags = platformDisplay.querySelectorAll('.platform-tag');
    existingTags.forEach(tag => tag.remove());
    
    if (selectedPlatforms.has('all') || selectedPlatforms.size === 0) {
        placeholder.textContent = currentLang === 'es' ? 'Todas' : 'All';
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
        
        // Crear tags para plataformas seleccionadas
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'selected-platforms';
        
        const selectedArray = Array.from(selectedPlatforms).filter(p => p !== 'all');
        
        // Mostrar hasta 3 tags, después mostrar contador
        const maxTags = 3;
        const tagsToShow = selectedArray.slice(0, maxTags);
        const remainingCount = selectedArray.length - maxTags;
        
        tagsToShow.forEach(platform => {
            const tag = document.createElement('span');
            tag.className = 'platform-tag';
            tag.innerHTML = `
                ${sanitizeHTML(platform)}
                <span class="remove" data-platform="${platform}">×</span>
            `;
            
            // Event listener para remover tag
            const removeBtn = tag.querySelector('.remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removePlatformSelection(platform);
            });
            
            tagsContainer.appendChild(tag);
        });
        
        // Si hay más plataformas seleccionadas, mostrar contador
        if (remainingCount > 0) {
            const counterTag = document.createElement('span');
            counterTag.className = 'platform-tag counter-tag';
            counterTag.textContent = `+${remainingCount}`;
            counterTag.title = selectedArray.slice(maxTags).join(', ');
            tagsContainer.appendChild(counterTag);
        }
        
        platformDisplay.insertBefore(tagsContainer, platformDisplay.querySelector('i'));
    }
}

// Remover selección de plataforma
function removePlatformSelection(platform) {
    selectedPlatforms.delete(platform);
    
    // Desmarcar checkbox correspondiente
    const checkbox = document.querySelector(`input[value="${platform}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Si no hay plataformas seleccionadas, marcar "Todas"
    if (selectedPlatforms.size === 0) {
        selectedPlatforms.add('all');
        document.getElementById('platform-all').checked = true;
    }
    
    updatePlatformDisplay();
    filterProducts();
}

// Filtrar productos - MULTI-SELECT CON FILTRADO DINÁMICO
function filterProducts() {
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Primero filtrar por búsqueda de texto y estado para obtener productos relevantes
    let searchFilteredProducts = allProducts.filter(product => {
        // Filtrar por búsqueda de texto
        if (searchFilter) {
            const searchText = searchFilter.toLowerCase();
            const productText = (product.Product || '').toLowerCase();
            const platformText = (product.Platform || '').toLowerCase();
            
            if (!productText.includes(searchText) && !platformText.includes(searchText)) {
                return false;
            }
        }
        
        // Filtrar por estado
        if (statusFilter === 'available' && product.Sold != 0) {
            return false;
        }
        if (statusFilter === 'sold' && product.Sold != 1) {
            return false;
        }
        
        return true;
    });
    
    // Actualizar las plataformas disponibles basado en la búsqueda
    updateAvailablePlatforms(searchFilteredProducts);
    
    // Ahora aplicar el filtro de plataformas a los productos ya filtrados
    filteredProducts = searchFilteredProducts.filter(product => {
        // Filtrar por plataforma (múltiple)
        if (!selectedPlatforms.has('all')) {
            if (!selectedPlatforms.has(product.Platform)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Resetear a página 1
    currentPage = 1;
    
    // Renderizar productos filtrados
    renderProductsTable();
    
    // Actualizar contador
    updateProductsCounter();
}

// Limpiar filtros - MULTI-SELECT CON RESET DE PLATAFORMAS
function clearFilters() {
    // Limpiar búsqueda
    document.getElementById('searchFilter').value = '';
    
    // Limpiar estado
    document.getElementById('statusFilter').value = 'all';
    
    // Limpiar plataformas
    selectedPlatforms.clear();
    selectedPlatforms.add('all');
    
    // Desmarcar todos los checkboxes excepto "Todas"
    const platformDropdown = document.getElementById('platformDropdown');
    const allCheckboxes = platformDropdown.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = checkbox.id === 'platform-all';
    });
    
    // Mostrar todas las opciones de plataforma
    const platformOptions = platformDropdown.querySelectorAll('.multi-select-option:not([data-value="all"])');
    platformOptions.forEach(option => {
        option.style.display = 'flex';
    });
    
    // Remover mensaje de "no hay plataformas"
    const existingMessage = platformDropdown.querySelector('.no-platforms-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Actualizar display
    updatePlatformDisplay();
    
    // Aplicar filtros
    filterProducts();
}

// Actualizar contador de productos
function updateProductsCounter() {
    const productsCounter = document.getElementById('productsCounter');
    const currentLang = localStorage.getItem('language') || 'es';
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    const text = currentLang === 'es' 
        ? `Mostrando ${Math.min(filteredProducts.length, productsPerPage)} de ${filteredProducts.length} productos`
        : `Showing ${Math.min(filteredProducts.length, productsPerPage)} of ${filteredProducts.length} products`;
    
    productsCounter.textContent = text;
    productsCounter.dataset.count = Math.min(filteredProducts.length, productsPerPage);
    productsCounter.dataset.total = filteredProducts.length;
}

// Actualizar paginación
function updatePagination() {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
}

// Actualizar botones de paginación
function updatePaginationButtons() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Cambiar página
function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProductsTable();
    }
}

// Mostrar modal de producto - SEGURO
function showProductModal(product) {
    const modalOverlay = document.getElementById('productModalOverlay');
    const modalContent = document.getElementById('productModalContent');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Validar y sanitizar producto
    const safeProduct = validateProductData(product);
    if (!safeProduct) {
        console.error('Invalid product data for modal');
        return;
    }
    
    const statusClass = safeProduct.Sold == 1 ? 'status-sold' : 'status-available';
    const statusText = safeProduct.Sold == 1 ? 
        (currentLang === 'es' ? 'Vendido' : 'Sold') : 
        (currentLang === 'es' ? 'Disponible' : 'Available');
    
    // Crear contenido del modal de forma segura
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const productTitle = document.createElement('h3');
    productTitle.textContent = safeProduct.Product;
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${statusClass}`;
    statusBadge.textContent = statusText;
    
    modalHeader.appendChild(productTitle);
    modalHeader.appendChild(statusBadge);
    
    const modalDetails = document.createElement('div');
    modalDetails.className = 'modal-details';
    
    // Crear elementos de detalles de forma segura
    const details = [
        { label: currentLang === 'es' ? 'Número' : 'Number', value: safeProduct.Num },
        { label: currentLang === 'es' ? 'Producto' : 'Product', value: safeProduct.Product },
        { label: currentLang === 'es' ? 'Plataforma' : 'Platform', value: safeProduct.Platform },
        { label: currentLang === 'es' ? 'Precio de Venta' : 'Sale Price', value: safeProduct.Neto !== 'X' ? safeProduct.Neto : '0' },
        { label: currentLang === 'es' ? 'Stock' : 'Stock', value: safeProduct.Stock },
        { label: 'Link', value: getLinkProductInstagram(safeProduct.Link) }
    ];
    
    details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const label = document.createElement('label');
        label.textContent = detail.label;
        
        const span = document.createElement('span');
        span.textContent = detail.value;
        
        detailItem.appendChild(label);
        detailItem.appendChild(span);
        modalDetails.appendChild(detailItem);
    });
    
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.id = 'modalCloseBtn';
    closeBtn.textContent = currentLang === 'es' ? 'Cerrar' : 'Close';
    
    modalActions.appendChild(closeBtn);
    
    // Limpiar y agregar contenido
    modalContent.innerHTML = '';
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalDetails);
    modalContent.appendChild(modalActions);
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Event listeners para cerrar modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    const modalCloseBtn = document.getElementById('productModalClose');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Obtener Link de producto en Instagram
function getLinkProductInstagram(productLink) {
    if (productLink) {
        productLink = "https://www.instagram.com/p/" + productLink + "/";
    } else {
        productLink = "https://www.instagram.com/ropavejero.retro/";
    }
    return productLink;
}

// ========== POSTS DE INSTAGRAM ==========
function loadInstagramPosts() {
    const instagramGrid = document.getElementById('instagramGrid');
    
    // Datos simulados de Instagram
    const instagramPosts = [
        {
            image: "../img/Post01.jpeg",
            title: "[❌] 3419 PS3 Slim azul 320Gb, 1 control org. y cables (HEN) $110K",
            description: `- Sony PS3 Slim Splash Blue NTSC-J original Japonesa model CECH-3000B.
- Control azul org.
- Cable corriente directo a los 220V.
- Cable HDMI.
- Lector operativo compatible con juegos originales americanos.
- Liberada con HEN, tienda y juegos cargados.
- 320 GB de Disco Duro.
- Mantención y limpieza profunda a consola y control.

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
org: original`,
            link: "https://www.instagram.com/p/DPU_RqCjJYG/"
        },
        {
            image: "../img/Post02.jpeg",
            title: "Feliz Navidad y Próspero Año Nuevo 2026",
            description: `Esperamos que pasen un feliz año 2026, lleno de bendiciones, éxito y salud. Muchas gracias 2025 por todo y allá vamos 2026!`,
            link: "https://www.instagram.com/p/DS82t4FFa2x/"
        },
        {
            image: "../img/Post03.jpeg",
            title: "[❌] 3418 PS2 Fat en caja 30000, 1 control/cables org. 500Gb $135K",
            description: `- Sony PS2 Fat negra NTSC-J original Japonesa model 30000.
- Control negro org.
- Cable corriente con minwa 110V-220V incluido.
- Cable AV RCA Sony 3 colores org.
- Memory Card con Free MC Boot + OPL.
- Adaptador para Discos Duros Sata.
- Disco Duro Sata 500 Gb con muchos juegos includos.
- Lector NO compatible con juegos originales americanos.
[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE
Siglas:
org: original`,
            link: "https://www.instagram.com/p/DPU8g8JjE5g/"
        },
        {
            image: "../img/Post04.jpeg",
            title: "[❌] 3417 PS1 Fat en caja, control y cables org. $120K",
            description: `- Sony PS1 Fat NTSC U/C original americana model SCPH-7501.
- Control plomo Sony c/análogo org.
- Cable corriente con Minwa 110V-220V incluido.
- Cable AV RCA Sony 3 colores org.
- Lector funcionando bien.
- SIN chip de liberación.
- Mantención y limpieza profunda a consola y control.
* La serie de la caja y consola NO coinciden.
[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE
Siglas:
org: original`,
            link: "https://www.instagram.com/p/DPU5m7jjPLu/"
        },
        {
            image: "../img/Post05.jpeg",
            title: "[✅] 3676 Spiderman Edge of Time (CIB) [Wii] $20K",
            description: `[✅]: DISPONIBLE

Siglas:
CIB: Caja, Juego, Manual`,
            link: "https://www.instagram.com/p/DSdo4Y_laqb/"
        },
        {
            image: "../img/Post06.jpeg",
            title: "Varios | 06/Nov/25",
            description: `[❌] 3615 GTA V (GH-CIB) [PS3] $10K
[✅] 3616 GTA V (BL-CIB-C/M-Japo) [PS3] $12K
[✅] 3617 Far Cry Instincts (CIB) [Xbox] $10K
[✅] 3618 StarCraft II: Wings of Liberty (CIB) [PC] $12K
[✅] 3619 Guitar Hero World Tour (CIB) [PC] $12K
[❌] 3621 Yoshi's Island (CIB) [SFC] $30K
[✅] 3623 Super Bomberman W (CIB) [SFC] $30K
[✅] 3624 Street Fighter 30th Anniversary (CIB) [Switch] $30K
[❌] 3625 Super Mario RPG (Sealed-Japo) [Switch] $35K
[✅] 3626 Paper Mario: The Origami King (Sealed-Japo) [Switch] $35K
[❌] 3628 Control PS1 plomo org. (detalle stick) [Control] $15K
[✅] 3629 Control PS1 plomo org. (detalle stick y marca Sony adelante) [Control] $13K
[✅] 3630 Control N64 azul trasparente (Repro) [Control] $15K
[❌] 3631 Control N64 azul trasparente (Repro-Estilo Hori) [Control] $15K
[✅] 3632 Control Gamecube violeta (Repro) [Control] $15K
[✅] 3633 Nunchuck blanco Nintendo Wii [Acc] $5K
[✅] 3634 Nunchuck blanco Nintendo Wii [Acc] $5K
[✅] 3635 Nunchuck blanco Nintendo Wii [Acc] $5K
[✅] 3636 Nunchuck blanco Nintendo Wii [Acc] $5K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
GH: Greatest Hits
CIB: Caja, Juego, Manual
MM: Sin Manual
S: Sealed: Sellado de Fábrica
SFC: Super Famicom
Japo: Japonés
org: original
Acc: Accesorio`,
            link: "https://www.instagram.com/p/DQvBSs0jCkB/"
        }
    ];
    
    // Generar HTML para los posts
    instagramPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'instagram-card';
        postElement.innerHTML = `
            <div class="instagram-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="instagram-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Ver Post</a>
            </div>
        `;
        
        instagramGrid.appendChild(postElement);
    });
}

// ========== EFEMÉRIDES - SEGURO ==========
function loadEfemerides() {
    const currentDateElement = document.getElementById('currentDate');
    const efemeridesCard = document.getElementById('efemeridesCard');
    
    // Obtener fecha actual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateKey = `${month}/${day}`;
    
    // Formatear fecha para mostrar
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentLang = localStorage.getItem('language') || 'es';
    const formattedDate = now.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
    
    if (currentDateElement) {
        currentDateElement.textContent = formattedDate;
    }
    
    // Cargar efemérides desde el archivo JSON de forma segura
    fetch('js/efemerides.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Validar estructura de datos
            if (!data || !Array.isArray(data.efemerides)) {
                throw new Error('Invalid efemerides data structure');
            }
            
            // Buscar la efeméride para la fecha actual
            const efemeridesArr = data.efemerides;
            const efemerideHoy = efemeridesArr.find(item => item.date === dateKey);
            
            const langKey = currentLang === 'es' ? 'ES' : 'EN';
            
            if (efemerideHoy && efemerideHoy[langKey]) {
                const info = efemerideHoy[langKey];
                
                // Validar y sanitizar datos
                const safeTitle = sanitizeHTML(info.title || '');
                const safeText = sanitizeHTML(info.text || '');
                const safeDet = sanitizeHTML(info.det || '');
                
                // Crear elementos de forma segura
                const headerDiv = document.createElement('div');
                headerDiv.className = 'efemerides-header';
                
                const badge = document.createElement('span');
                badge.className = 'efemerides-badge';
                badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
                
                const title = document.createElement('h3');
                title.textContent = safeTitle;
                
                const text = document.createElement('p');
                text.textContent = safeText;
                
                const detail = document.createElement('p');
                detail.textContent = safeDet;
                
                headerDiv.appendChild(badge);
                headerDiv.appendChild(title);
                headerDiv.appendChild(text);
                headerDiv.appendChild(detail);
                
                efemeridesCard.innerHTML = '';
                efemeridesCard.appendChild(headerDiv);
            } else {
                // Mensaje predeterminado
                const headerDiv = document.createElement('div');
                headerDiv.className = 'efemerides-header';
                
                const badge = document.createElement('span');
                badge.className = 'efemerides-badge';
                badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
                
                const title = document.createElement('h3');
                title.textContent = currentLang === 'es' ? 
                    'Hoy no hay efemérides registradas.' : 
                    'No anniversaries recorded for today.';
                
                const text = document.createElement('p');
                text.textContent = currentLang === 'es' ? 
                    '¡Disfruta de tus juegos retro!' : 
                    'Enjoy your retro games!';
                
                headerDiv.appendChild(badge);
                headerDiv.appendChild(title);
                headerDiv.appendChild(text);
                
                efemeridesCard.innerHTML = '';
                efemeridesCard.appendChild(headerDiv);
            }
        })
        .catch(error => {
            const errorMessage = handleSecureError(error, 'efemerides');
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'efemerides-header';
            
            const badge = document.createElement('span');
            badge.className = 'efemerides-badge';
            badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
            
            const title = document.createElement('h3');
            title.textContent = errorMessage;
            
            headerDiv.appendChild(badge);
            headerDiv.appendChild(title);
            
            efemeridesCard.innerHTML = '';
            efemeridesCard.appendChild(headerDiv);
        });
}

// ========== APLICAR CONFIGURACIONES GUARDADAS ==========
function applySavedSettings() {
    // Tema ya se aplica en initTheme()
    // Idioma ya se aplica en initLanguage()
    
    // Cargar efemérides según el idioma
    loadEfemerides();
}

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