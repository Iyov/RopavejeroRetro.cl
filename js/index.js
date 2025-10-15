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
        'about-text-1': 'Ropavejero Retro es una tienda especializada en videojuegos retro originales americanos. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.',
        'about-text-2': 'Desde consolas clásicas como NES, SNES, PlayStation 1 y Sega Genesis, hasta juegos y accesorios originales, todo cuidadosamente revisado y garantizado. Trabajamos directamente con proveedores en Estados Unidos para asegurar la autenticidad de nuestros productos.',
        'about-text-3': 'Nuestro objetivo es que revivas aquellos maravillosos momentos de tu infancia con la misma calidad y emoción de entonces.',
        'explore-store': 'Explora la Tienda',
        
        // Efemérides
        'efemerides-title': 'Efemérides de hoy',
        'efemerides-badge': 'Efeméride del día',
        'no-efemerides': 'Hoy no hay efemérides registradas. ¡Disfruta de tus juegos retro!',
        'efemerides-error': 'No se pudieron cargar las efemérides del día. Por favor, intenta más tarde.',
        
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
        'footer-copyright': '© 2025 @Ropavejero.Retro Todos los derechos reservados.',
        
        // Tooltip
        'whatsapp-tooltip': 'Comunícate con nosotros'
    },
    en: {
        // Menú
        'menu-instagram': 'Instagram',
        'menu-about': 'About Us',
        'menu-efemerides': 'Anniversaries',
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
        'about-text-1': 'Ropavejero Retro is a store specialized in original American retro video games. Our passion for classic video games drives us to search for and offer the best products for nostalgia gaming lovers.',
        'about-text-2': 'From classic consoles like NES, SNES, PlayStation 1 and Sega Genesis, to original games and accessories, all carefully reviewed and guaranteed. We work directly with suppliers in the United States to ensure the authenticity of our products.',
        'about-text-3': 'Our goal is for you to relive those wonderful moments of your childhood with the same quality and excitement as then.',
        'explore-store': 'Explore the Store',
        
        // Efemérides
        'efemerides-title': "Today's Anniversaries",
        'efemerides-badge': "Today's Anniversary",
        'no-efemerides': 'No anniversaries recorded for today. Enjoy your retro games!',
        'efemerides-error': "Could not load today's anniversaries. Please try again later.",
        
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
        'footer-copyright': '© 2025 @Ropavejero.Retro All rights reserved.',
        
        // Tooltip
        'whatsapp-tooltip': 'Contact us'
    }
};

// Función para cambiar idioma
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
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
    
    // Contenido de los blogs
    const blogContent = {
        1: {
            title: 'La historia de Nintendo: De las cartas a los videojuegos',
            date: '15 de Octubre, 2025',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Nintendo es hoy en día sinónimo de videojuegos, pero pocos conocen sus humildes orígenes. Fundada en 1889 por Fusajiro Yamauchi en Kioto, Japón, la compañía comenzó fabricando cartas Hanafuda, un tipo de baraja tradicional japonesa.</p>
                
                <p>Durante más de medio siglo, Nintendo se dedicó exclusivamente a los juegos de cartas, expandiéndose gradualmente a otros tipos de juegos de mesa. No fue hasta la década de 1960 que la empresa comenzó a diversificarse, incursionando en negocios tan diversos como taxis, alimentos instantáneos y hasta una cadena de hoteles del amor.</p>
                
                <p>El giro hacia los videojuegos llegó en los años 70, cuando Nintendo comenzó a desarrollar máquinas arcade. Su primer gran éxito fue Donkey Kong en 1981, que introdujo al mundo a Mario (entonces llamado Jumpman). Este personaje se convertiría en el ícono más reconocible de la compañía.</p>
                
                <p>La revolución definitiva llegó en 1983 con el lanzamiento de la Family Computer (Famicom) en Japón, conocida internacionalmente como Nintendo Entertainment System (NES). Esta consola no solo salvó a la industria de los videojuegos tras la crisis de 1983, sino que estableció estándares de calidad y jugabilidad que perduran hasta hoy.</p>
                
                <p>Desde entonces, Nintendo ha continuado innovando con consolas como Game Boy, Super Nintendo, Nintendo 64, GameCube, Wii, Nintendo DS, 3DS, Switch y muchas más, siempre manteniendo su filosofía de priorizar la jugabilidad por encima de todo.</p>
            `
        },
        2: {
            title: 'Nintendo vs Sega: La batalla que definió una generación',
            date: '10 de Octubre, 2025',
            image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80',
            content: `
                <p>Los años 90 fueron testigos de una de las rivalidades más épicas en la historia de los videojuegos: Nintendo contra Sega. Esta batalla no solo definió una generación de jugadores, sino que cambió para siempre la forma en que se comercializaban y percibían los videojuegos.</p>
                
                <p>Cuando Sega lanzó Genesis (Mega Drive fuera de América) en 1989, Nintendo dominaba el mercado con su NES. Sega adoptó una estrategia agresiva de marketing, posicionando a Genesis como la consola "cool" para adolescentes, en contraste con la imagen más infantil de Nintendo.</p>
                
                <p>El eslogan "Genesis does what Nintendon't" se convirtió en el estandarte de esta guerra, destacando las ventajas técnicas de la consola de Sega, como su mayor potencia y el chip de sonido Yamaha que ofrecía música de mejor calidad.</p>
                
                <p>La competencia se intensificó con las mascotas de ambas compañías: Mario de Nintendo contra Sonic de Sega. Sonic, con su actitud desafiante y velocidad, representaba perfectamente la imagen que Sega quería proyectar. La guerra de consolas llegó a su punto máximo con el lanzamiento de juegos como Street Fighter II, que apareció primero en SNES, y Mortal Kombat, cuya versión sin censura en Genesis le dio una ventaja significativa a Sega.</p>
                
                <p>Aunque Nintendo eventualmente ganó la batalla en términos de ventas, la competencia benefició enormemente a los consumidores, impulsando la innovación y reduciendo precios. Esta rivalidad demostró que en el mundo de los videojuegos, la competencia feroz puede ser el mejor catalizador para el progreso.</p>
            `
        },
        3: {
            title: 'Guía para coleccionar videojuegos retro: Por dónde empezar',
            date: '5 de Octubre, 2025',
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
        }
    };
    
    // Abrir dialog de blog
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.closest('.blog-card').getAttribute('data-blog-id');
            const content = blogContent[blogId];
            
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

// ========== POSTS DE INSTAGRAM ==========
function loadInstagramPosts() {
    const instagramGrid = document.getElementById('instagramGrid');
    
    // Datos simulados de Instagram (en un caso real, se obtendrían de una API)
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
        title: "[✅] 3172 Mario's Time Machine (CIB-Poster) [SNES] $90K",
        description: `- Caja Mario TM NTSC U/C original americana impecable estado.
- Juego original impecable estado.
- Caja interna, dust cover.
- Manual y Poster original.
- Protector PET de regalo.

[✅]: DISPONIBLE`,
        link: "https://www.instagram.com/p/DLljA0wsCbf/"
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

// ========== EFEMÉRIDES ==========
function loadEfemerides() {
    const currentDateElement = document.getElementById('currentDate');
    const efemeridesCard = document.getElementById('efemeridesCard');
    
    // Obtener fecha actual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const dateKey = `${month}/${day}`; // Formato nuevo: MM/DD

    // Formatear fecha para mostrar
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentLang = localStorage.getItem('language') || 'es';
    const formattedDate = now.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
    currentDateElement.textContent = formattedDate;
    
    // Cargar efemérides desde el archivo JSON
    fetch('js/efemerides.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de efemérides');
            }
            return response.json();
        })
        .then(data => {
            // Buscar la efeméride para la fecha actual
            const efemeridesArr = data.efemerides;
            const efemerideHoy = efemeridesArr.find(item => item.date === dateKey);

            let langKey = currentLang === 'es' ? 'ES' : 'EN';

            if (efemerideHoy && efemerideHoy[langKey]) {
                const info = efemerideHoy[langKey];
                efemeridesCard.innerHTML = `
                    <div class="efemerides-header">
                        <span class="efemerides-badge" data-translate="efemerides-badge">${info.title}</span>
                        <h3>${info.text}</h3>
                        <p>${info.det}</p>
                    </div>
                `;
            } else {
                // Si no hay efeméride para hoy, mostrar un mensaje predeterminado
                efemeridesCard.innerHTML = `
                    <div class="efemerides-header">
                        <span class="efemerides-badge" data-translate="efemerides-badge">Efeméride del día</span>
                        <h3 data-translate="no-efemerides">Hoy no hay efemérides registradas. ¡Disfruta de tus juegos retro!</h3>
                        <p></p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error cargando efemérides:', error);
            // Mostrar mensaje de error
            efemeridesCard.innerHTML = `
                <div class="efemerides-header">
                    <span class="efemerides-badge" data-translate="efemerides-badge">Efeméride del día</span>
                    <h3 data-translate="efemerides-error">No se pudieron cargar las efemérides del día. Por favor, intenta más tarde.</h3>
                </div>
            `;
        });
}

// ========== APLICAR CONFIGURACIONES GUARDADAS ==========
function applySavedSettings() {
    // Tema ya se aplica en initTheme()
    // Idioma ya se aplica en initLanguage()
    
    // Cargar efemérides según el idioma
    loadEfemerides();
}