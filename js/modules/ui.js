// ========== MÓDULO: UI ==========

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

// ========== NAV ACTIVO POR SECCIÓN ==========
function initNavActive() {
    const navLinks = document.querySelectorAll('.nav a, .mobile-menu-content a');

    // Si la URL es /productos, marcar ese ítem y salir
    if (window.location.pathname.startsWith('/productos') || window.location.pathname.includes('productos.html')) {
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            const href = link.getAttribute('href') || '';
            if (href === '/productos' || href.includes('productos.html')) link.classList.add('nav-active');
        });
        return;
    }

    // En index.html: marcar el ítem según la sección visible al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) current = section.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            const href = link.getAttribute('href') || '';
            if (current && (href === `#${current}` || href.endsWith(`#${current}`))) {
                link.classList.add('nav-active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

// ========== BOTÓN VOLVER ARRIBA ==========
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const backToTopLogo = document.getElementById('backToTopLogo');

    if (!backToTopBtn) return;
    
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
    if (backToTopLogo) {
        backToTopLogo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        
        // Focus en el primer enlace del menú
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    });
    
    // Cerrar menú
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus(); // Devolver focus al botón
    });
    
    // Cerrar menú al hacer clic en un enlace
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
        }
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
        'hero-subtitle': '@Ropavejero.Retro es una tienda de Instagram de videojuegos, consolas, accesorios y coleccionables retro. Además, junto con @NekketsuStore, formó el local físico @DoubleImpactStore en Persa Bio Bio.',
        'instagram-button': 'Ir a Instagram',
        
        // Instagram
        'instagram-title': 'Posts de Instagram',
        
        // Nosotros
        'about-title': 'Sobre Nosotros',
        'about-subtitle-1': '¿Quiénes Somos?',
        'about-text-1': '@Ropavejero.Retro es una tienda de Instagram especializada en videojuegos, consolas, accesorios y coleccionables retro originales americanos. Junto con @NekketsuStore, también formó el local físico @DoubleImpactStore en Persa Bio Bio.',
        'about-subtitle-2': 'Nuestros Productos y Servicios',
        'about-text-2': 'Vendemos juegos, consolas, accesorios y coleccionables retro originales de Nintendo, PlayStation, Sega, Xbox y Atari. Además ofrecemos servicio técnico de consolas retro y pulido profesional de discos ópticos, con productos cuidadosamente revisados y garantizados.',
        'about-subtitle-3': 'Nuestra Misión',
        'about-text-3': 'Nuestro objetivo es que revivas aquellos maravillosos momentos de tu infancia con la misma calidad y emoción de entonces.',
        'about-btn-1': 'Garantía 30 días',
        'about-btn-2': 'Envío a todo Chile',
        'about-btn-3': 'Productos originales',
        'about-btn-4': 'Servicio Técnico',
        'about-btn-5': 'Pulido de Discos',
        'explore-store': 'Explora la Tienda',
        
        // Efemérides
        'efemerides-title': 'Efemérides de hoy',
        'efemerides-badge': 'Efeméride del día',
        'no-efemerides': 'Hoy no hay efemérides registradas. ¡Disfruta de tus juegos retro!',
        'efemerides-error': 'No se pudieron cargar las efemérides del día. Por favor, intenta más tarde.',
        
        // Productos
        'featured-products-title': 'Productos destacados',
        'featured-products-subtitle': 'Explora el catálogo completo en Google Sheets',
        'featured-nintendo-title': 'Nintendo',
        'featured-nintendo-platforms': 'NES · SNES · N64 · GameCube · Game Boy / Color / Advance · Wii / U · DS · 3DS',
        'featured-playstation-title': 'PlayStation',
        'featured-playstation-platforms': 'PS1 · PS2 · PSP · PS3 · PS4',
        'featured-sega-title': 'Sega',
        'featured-sega-platforms': 'Genesis · GameGear · Dreamcast',
        'featured-xbox-title': 'Xbox',
        'featured-xbox-platforms': 'OG Classic · 360 · One',
        'featured-atari-title': 'Atari y más',
        'featured-atari-platforms': 'Atari · Odyssey · Pong · y otras consolas retro',
        'featured-products-button': 'Ir al catálogo',
        'products-title': 'Productos Disponibles',
        'products-subtitle': 'Explora nuestra colección de videojuegos retro disponibles para venta.',
        'filter-search': 'Buscar producto:',
        'filter-platform': 'Plataforma:',
        'filter-platform-search': 'Buscar plataforma...',
        'filter-all': 'Todas',
        'filter-sort': 'Ordenar por:',
        'sort-id-asc': 'Número ID',
        'sort-price-asc': 'Precio: Ascendente',
        'sort-price-desc': 'Precio: Descendente',
        'sort-name-asc': 'Nombre: A-Z',
        'sort-name-desc': 'Nombre: Z-A',
        'sort-platform-asc': 'Plataforma',
        'clear-filters': 'Limpiar',
        'clear-cache': 'Actualizar',
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
        'faq-question-1': '¿Qué tipos de productos y servicios ofrecen?',
        'faq-answer-1': 'Vendemos consolas, juegos y accesorios retro originales americanos (Nintendo, PlayStation, Sega, Xbox, Atari). Además ofrecemos servicio técnico de consolas retro y pulido profesional de discos ópticos (PS1, PS2, Xbox, GameCube, Wii, etc.).',
        'faq-question-2': '¿Los productos son originales y en qué estado están?',
        'faq-answer-2': 'Todos nuestros productos son 100% originales americanos. Revisamos cada artículo minuciosamente y garantizamos su funcionamiento. El estado varía desde productos como nuevos hasta usados en buen estado, siempre especificando claramente las condiciones en cada listing.',
        'faq-question-3': '¿Realizan envíos a todo Chile?',
        'faq-answer-3': 'Sí, realizamos envíos a todo Chile a través de Starken. El costo de envío varía según la ubicación y el peso del paquete. Las entregas presenciales dentro de Santiago se realizan en metro San Joaquín L5.',
        'faq-question-4': '¿Ofrecen garantía en sus productos?',
        'faq-answer-4': 'Todos nuestros productos incluyen 30 días de garantía por defectos de funcionamiento. Para consolas reacondicionadas por nosotros, ofrecemos 90 días de garantía. La garantía cubre problemas técnicos pero no daños físicos por mal uso.',
        'faq-question-5': '¿Puedo ver los productos antes de comprar?',
        'faq-answer-5': 'Actualmente no tenemos showroom físico, pero puedes agendar una cita para ver productos específicos en nuestras oficinas en Santiago. También publicamos videos demostrativos de todos nuestros productos en Instagram y YouTube.',
        'faq-question-6': '¿En qué consiste el servicio técnico y el pulido de discos?',
        'faq-answer-6': 'El servicio técnico incluye diagnóstico y reparación de consolas retro (limpieza de conectores, cambio de condensadores, reemplazo de lector óptico, entre otros). El pulido de discos elimina rayaduras superficiales de discos ópticos (PS1, PS2, Xbox, GameCube, Wii, etc.) restaurando su capacidad de lectura. Contáctanos por WhatsApp o Instagram para presupuesto.',
        
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

        // DoubleImpactStore
        'store-announcement-title': '@DoubleImpactStore',
        'store-announcement-new': 'Nueva tienda de videojuegos retro',
        'store-announcement-description': '@Ropavejero.Retro es una tienda de Instagram de videojuegos, consolas, accesorios y coleccionables retro. Junto con @NekketsuStore formó el local físico @DoubleImpactStore.',
        'store-announcement-address': 'Bio Bio 654, Local 58, Galpón Nuevo Bio Bio (cerca de Víctor Manuel, frente al McDonald\'s).',
        'store-announcement-transport-hours': 'Metro Bio Bio L6 | Sábados, domingos y festivos, de 11:00 a 18:00 hrs.',
        
        // Footer
        'footer-copyright': '© 2026 @Ropavejero.Retro Todos los derechos reservados.',
        'footer-old-version': 'Versión Antigua',
        'footer-security-policy': 'Política de Seguridad',
        'footer-security-acknowledgments': 'Agradecimientos de Seguridad',
        
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
        'hero-subtitle': '@Ropavejero.Retro is an Instagram store selling retro video games, consoles, accessories and collectibles. Together with @NekketsuStore, it also formed the @DoubleImpactStore physical location at Persa Bio Bio.',
        'instagram-button': 'Go to Instagram',
        
        // Instagram
        'instagram-title': 'Instagram Posts',
        
        // Nosotros
        'about-title': 'About Us',
        'about-subtitle-1': 'Who are we?',
        'about-text-1': '@Ropavejero.Retro is an Instagram store specializing in original American retro video games, consoles, accessories and collectibles. Together with @NekketsuStore, it also formed the @DoubleImpactStore physical location at Persa Bio Bio.',
        'about-subtitle-2': 'Our Products and Services',
        'about-text-2': 'We sell original retro games, consoles, accessories and collectibles from Nintendo, PlayStation, Sega, Xbox and Atari. We also offer retro console repair and professional optical disc polishing, with products carefully checked and guaranteed.',
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
        'featured-products-title': 'Featured products',
        'featured-products-subtitle': 'Explore the complete catalog in Google Sheets',
        'featured-nintendo-title': 'Nintendo',
        'featured-nintendo-platforms': 'NES · SNES · N64 · GameCube · Game Boy / Color / Advance · Wii / U · DS · 3DS',
        'featured-playstation-title': 'PlayStation',
        'featured-playstation-platforms': 'PS1 · PS2 · PSP · PS3 · PS4',
        'featured-sega-title': 'Sega',
        'featured-sega-platforms': 'Genesis · GameGear · Dreamcast',
        'featured-xbox-title': 'Xbox',
        'featured-xbox-platforms': 'OG Classic · 360 · One',
        'featured-atari-title': 'Atari and more',
        'featured-atari-platforms': 'Atari · Odyssey · Pong · and other retro consoles',
        'featured-products-button': 'Go to catalog',
        'products-title': 'Available Products',
        'products-subtitle': 'Explore our collection of retro video games available for sale.',
        'filter-search': 'Search product:',
        'filter-platform': 'Platform:',
        'filter-platform-search': 'Search platform...',
        'filter-all': 'All',
        'filter-sort': 'Sort by:',
        'sort-id-asc': 'ID number',
        'sort-price-asc': 'Price: Low to high',
        'sort-price-desc': 'Price: High to low',
        'sort-name-asc': 'Name: A-Z',
        'sort-name-desc': 'Name: Z-A',
        'sort-platform-asc': 'Platform',
        'clear-filters': 'Clear',
        'clear-cache': 'Refresh',
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
        'faq-question-1': 'What products and services do you offer?',
        'faq-answer-1': 'We sell original American retro consoles, games and accessories (Nintendo, PlayStation, Sega, Xbox, Atari). We also offer retro console repair service and professional disc polishing (PS1, PS2, Xbox, GameCube, Wii, etc.).',
        'faq-question-2': 'Are the products original and in what condition are they?',
        'faq-answer-2': 'All our products are 100% original American. We carefully review each item and guarantee its operation. The condition varies from like-new products to used in good condition, always clearly specifying the conditions in each listing.',
        'faq-question-3': 'Do you ship throughout Chile?',
        'faq-answer-3': 'Yes, we ship throughout Chile via Starken. The shipping cost varies depending on the location and weight of the package. In-person deliveries within Santiago are made at San Joaquín L5 metro station.',
        'faq-question-4': 'Do you offer warranty on your products?',
        'faq-answer-4': 'All our products include 30 days warranty for operational defects. For consoles refurbished by us, we offer 90 days warranty. The warranty covers technical problems but not physical damage from misuse.',
        'faq-question-5': 'Can I see the products before buying?',
        'faq-answer-5': 'We currently do not have a physical showroom, but you can schedule an appointment to see specific products at our offices in Santiago. We also publish demonstration videos of all our products on Instagram and YouTube.',
        'faq-question-6': 'What does the repair service and disc polishing consist of?',
        'faq-answer-6': 'The repair service includes diagnosis and repair of retro consoles (connector cleaning, capacitor replacement, optical drive replacement, etc.). Disc polishing removes surface scratches from optical discs (PS1, PS2, Xbox, GameCube, Wii, etc.) restoring their readability. Contact us via WhatsApp or Instagram for a quote.',
        
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

        // DoubleImpactStore
        'store-announcement-title': '@DoubleImpactStore',
        'store-announcement-new': 'New retro video game store',
        'store-announcement-description': '@Ropavejero.Retro is an Instagram store selling retro video games, consoles, accessories and collectibles. Together with @NekketsuStore, it formed the @DoubleImpactStore physical location.',
        'store-announcement-address': 'Bio Bio 654, Store 58, Galpón Nuevo Bio Bio (near Víctor Manuel, across from McDonald\'s).',
        'store-announcement-transport-hours': 'Bio Bio Metro Station, Line 6 | Saturdays, Sundays and holidays, 11:00 AM to 6:00 PM.',
        
        // Footer
        'footer-copyright': '© 2026 @Ropavejero.Retro All rights reserved.',
        'footer-old-version': 'Old Version',
        'footer-security-policy': 'Security Policy',
        'footer-security-acknowledgments': 'Security Acknowledgments',
        
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

// ========== BLOG DIALOGS ==========
function initBlogDialogs() {
    const blogDialogOverlay = document.getElementById('blogDialogOverlay');
    const blogDialogClose = document.getElementById('blogDialogClose');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    if (!blogDialogOverlay) return;
    
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
    
    // Manejar placeholders con atributo especial
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
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
        replaceProductsUrlState();
    }
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

    // Seleccionar idioma — guardar ANTES de llamar setLanguage para que extractSiglas use el idioma correcto
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.dataset.lang;
            localStorage.setItem('language', lang);
            setLanguage(lang);
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

// ========== APLICAR CONFIGURACIONES GUARDADAS ==========
function applySavedSettings() {
    // Tema ya se aplica en initTheme()
    // Idioma ya se aplica en initLanguage()
    
    // Cargar efemérides según el idioma
    loadEfemerides();
}
